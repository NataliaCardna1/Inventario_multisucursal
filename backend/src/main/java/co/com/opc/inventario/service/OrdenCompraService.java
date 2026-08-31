package co.com.opc.inventario.service;

import co.com.opc.inventario.dto.OrdenCompraRequest;
import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class OrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final OrdenCompraDetalleRepository detalleRepository;
    private final ProveedorRepository proveedorRepository;
    private final SucursalRepository sucursalRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InventarioSucursalRepository inventarioSucursalRepository;
    private final InventarioService inventarioService;

    public OrdenCompraService(
            OrdenCompraRepository ordenCompraRepository,
            OrdenCompraDetalleRepository detalleRepository,
            ProveedorRepository proveedorRepository,
            SucursalRepository sucursalRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            InventarioSucursalRepository inventarioSucursalRepository,
            InventarioService inventarioService
    ) {
        this.ordenCompraRepository = ordenCompraRepository;
        this.detalleRepository = detalleRepository;
        this.proveedorRepository = proveedorRepository;
        this.sucursalRepository = sucursalRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.inventarioSucursalRepository = inventarioSucursalRepository;
        this.inventarioService = inventarioService;
    }

    public List<OrdenCompra> listar() {
        return ordenCompraRepository.findAll();
    }

    public OrdenCompra obtenerPorId(Long id) {
        return ordenCompraRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden de compra no encontrada: " + id));
    }

    public List<OrdenCompraDetalle> obtenerDetalles(Long ordenId) {
        return detalleRepository.findByOrdenCompraId(ordenId);
    }

    @Transactional
    public OrdenCompra crear(OrdenCompraRequest request) {
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado: " + request.getProveedorId()));
        Sucursal sucursal = sucursalRepository.findById(request.getSucursalId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada: " + request.getSucursalId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));

        OrdenCompra orden = new OrdenCompra();
        orden.setProveedor(proveedor);
        orden.setSucursal(sucursal);
        orden.setUsuario(usuario);
        orden.setCondicionesPago(request.getCondicionesPago());
        orden = ordenCompraRepository.save(orden);

        for (OrdenCompraRequest.ItemCompra item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProductoId()));

            OrdenCompraDetalle detalle = new OrdenCompraDetalle();
            detalle.setOrdenCompra(orden);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setDescuento(item.getDescuento() != null ? item.getDescuento() : BigDecimal.ZERO);
            detalleRepository.save(detalle);
        }

        return orden;
    }

    @Transactional
    public OrdenCompra confirmarRecepcion(Long ordenId) {
        OrdenCompra orden = obtenerPorId(ordenId);

        if (orden.getEstado() != EstadoOrdenCompra.PENDIENTE) {
            throw new IllegalStateException(
                    "Solo se puede recibir una orden en estado PENDIENTE. Estado actual: " + orden.getEstado());
        }

        List<OrdenCompraDetalle> detalles = detalleRepository.findByOrdenCompraId(ordenId);

        for (OrdenCompraDetalle detalle : detalles) {
            inventarioService.registrarIngreso(
                    detalle.getProducto().getId(),
                    orden.getSucursal().getId(),
                    detalle.getCantidad(),
                    MotivoMovimiento.COMPRA
            );
            actualizarCostoPromedio(detalle.getProducto(), detalle.getCantidad(), detalle.getPrecioUnitario());
        }

        orden.setEstado(EstadoOrdenCompra.RECIBIDA);
        return ordenCompraRepository.save(orden);
    }

    private void actualizarCostoPromedio(Producto producto, BigDecimal cantidadRecibida, BigDecimal precioUnitario) {
        List<InventarioSucursal> registros = inventarioSucursalRepository.findByProductoId(producto.getId());
        BigDecimal stockTotalPrevio = registros.stream()
                .map(InventarioSucursal::getStockActual)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // El ingreso ya se aplicó arriba, así que restamos la cantidad recién ingresada
        // para obtener el stock que existía ANTES de esta recepción.
        BigDecimal stockAntesDeRecibir = stockTotalPrevio.subtract(cantidadRecibida);
        if (stockAntesDeRecibir.compareTo(BigDecimal.ZERO) < 0) {
            stockAntesDeRecibir = BigDecimal.ZERO;
        }

        BigDecimal costoAnterior = producto.getCostoPromedio() != null ? producto.getCostoPromedio() : BigDecimal.ZERO;
        BigDecimal valorAnterior = stockAntesDeRecibir.multiply(costoAnterior);
        BigDecimal valorNuevo = cantidadRecibida.multiply(precioUnitario);
        BigDecimal stockTotalNuevo = stockAntesDeRecibir.add(cantidadRecibida);

        BigDecimal nuevoCosto = stockTotalNuevo.compareTo(BigDecimal.ZERO) > 0
                ? valorAnterior.add(valorNuevo).divide(stockTotalNuevo, 2, RoundingMode.HALF_UP)
                : precioUnitario;

        producto.setCostoPromedio(nuevoCosto);
        productoRepository.save(producto);
    }
}