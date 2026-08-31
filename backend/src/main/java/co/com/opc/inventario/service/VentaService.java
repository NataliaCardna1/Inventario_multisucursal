package co.com.opc.inventario.service;

import co.com.opc.inventario.dto.VentaRequest;
import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final SucursalRepository sucursalRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InventarioService inventarioService;

    public VentaService(
            VentaRepository ventaRepository,
            VentaDetalleRepository ventaDetalleRepository,
            SucursalRepository sucursalRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            InventarioService inventarioService
    ) {
        this.ventaRepository = ventaRepository;
        this.ventaDetalleRepository = ventaDetalleRepository;
        this.sucursalRepository = sucursalRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.inventarioService = inventarioService;
    }

    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    public Venta obtenerPorId(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venta no encontrada: " + id));
    }

    public List<VentaDetalle> obtenerDetalles(Long ventaId) {
        return ventaDetalleRepository.findByVentaId(ventaId);
    }

    @Transactional
    public Venta registrarVenta(VentaRequest request) {
        Sucursal sucursal = sucursalRepository.findById(request.getSucursalId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada: " + request.getSucursalId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));

        for (VentaRequest.ItemVenta item : request.getItems()) {
            if (!inventarioService.haySuficienteStock(item.getProductoId(), request.getSucursalId(), item.getCantidad())) {
                throw new IllegalStateException("Stock insuficiente para el producto " + item.getProductoId());
            }
        }

        Venta venta = new Venta();
        venta.setSucursal(sucursal);
        venta.setUsuario(usuario);
        venta.setListaPrecio(request.getListaPrecio());
        venta.setTotal(BigDecimal.ZERO);
        venta = ventaRepository.save(venta);

        BigDecimal total = BigDecimal.ZERO;

        for (VentaRequest.ItemVenta item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProductoId()));

            BigDecimal descuento = item.getDescuento() != null ? item.getDescuento() : BigDecimal.ZERO;
            BigDecimal subtotal = item.getPrecioUnitario().multiply(item.getCantidad()).subtract(descuento);
            total = total.add(subtotal);

            VentaDetalle detalle = new VentaDetalle();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setDescuento(descuento);
            ventaDetalleRepository.save(detalle);

            inventarioService.registrarRetiro(
                    item.getProductoId(), request.getSucursalId(), item.getCantidad(), MotivoMovimiento.VENTA
            );
        }

        venta.setTotal(total);
        return ventaRepository.save(venta);
    }
}