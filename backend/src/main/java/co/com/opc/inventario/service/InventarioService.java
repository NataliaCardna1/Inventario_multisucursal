package co.com.opc.inventario.service;

import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.InventarioSucursalRepository;
import co.com.opc.inventario.repository.MovimientoInventarioRepository;
import co.com.opc.inventario.repository.ProductoRepository;
import co.com.opc.inventario.repository.SucursalRepository;
import co.com.opc.inventario.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventarioService {

    private final InventarioSucursalRepository inventarioRepository;
    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;
    private final UsuarioRepository usuarioRepository;

    public InventarioService(
            InventarioSucursalRepository inventarioRepository,
            MovimientoInventarioRepository movimientoRepository,
            ProductoRepository productoRepository,
            SucursalRepository sucursalRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.inventarioRepository = inventarioRepository;
        this.movimientoRepository = movimientoRepository;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<InventarioSucursal> obtenerPorSucursal(Long sucursalId) {
        return inventarioRepository.findBySucursalId(sucursalId);
    }

    public boolean haySuficienteStock(Long productoId, Long sucursalId, BigDecimal cantidadRequerida) {
        return inventarioRepository.findByProductoIdAndSucursalId(productoId, sucursalId)
                .map(inv -> inv.getStockActual().compareTo(cantidadRequerida) >= 0)
                .orElse(false);
    }

    @Transactional
    public MovimientoInventario registrarIngreso(
            Long productoId, Long sucursalId, BigDecimal cantidad, MotivoMovimiento motivo
    ) {
        if (cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + productoId));
        Sucursal sucursal = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada: " + sucursalId));
        Usuario usuario = obtenerUsuarioAutenticado();

        InventarioSucursal inventario = inventarioRepository
                .findByProductoIdAndSucursalId(productoId, sucursalId)
                .orElseGet(() -> {
                    InventarioSucursal nuevo = new InventarioSucursal();
                    nuevo.setProducto(producto);
                    nuevo.setSucursal(sucursal);
                    nuevo.setStockActual(BigDecimal.ZERO);
                    return nuevo;
                });

        inventario.setStockActual(inventario.getStockActual().add(cantidad));
        inventarioRepository.save(inventario);

        return registrarMovimiento(producto, sucursal, usuario, TipoMovimiento.INGRESO, motivo, cantidad);
    }

    @Transactional
    public MovimientoInventario registrarRetiro(
            Long productoId, Long sucursalId, BigDecimal cantidad, MotivoMovimiento motivo
    ) {
        if (cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }
        if (!haySuficienteStock(productoId, sucursalId, cantidad)) {
            throw new IllegalStateException("Stock insuficiente para realizar el retiro");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + productoId));
        Sucursal sucursal = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada: " + sucursalId));
        Usuario usuario = obtenerUsuarioAutenticado();

        InventarioSucursal inventario = inventarioRepository
                .findByProductoIdAndSucursalId(productoId, sucursalId)
                .orElseThrow(() -> new IllegalStateException("No existe inventario para ese producto en esa sucursal"));

        inventario.setStockActual(inventario.getStockActual().subtract(cantidad));
        inventarioRepository.save(inventario);

        return registrarMovimiento(producto, sucursal, usuario, TipoMovimiento.RETIRO, motivo, cantidad);
    }
    public InventarioSucursal actualizarStockMinimo(Long productoId, Long sucursalId, BigDecimal stockMinimo) {
        InventarioSucursal registro = inventarioRepository
                .findByProductoIdAndSucursalId(productoId, sucursalId)
                .orElseThrow(() -> new IllegalArgumentException("No existe inventario para ese producto en esa sucursal"));
        registro.setStockMinimo(stockMinimo);
        return inventarioRepository.save(registro);
    }

    private MovimientoInventario registrarMovimiento(
            Producto producto, Sucursal sucursal, Usuario usuario,
            TipoMovimiento tipo, MotivoMovimiento motivo, BigDecimal cantidad
    ) {
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setSucursal(sucursal);
        movimiento.setUsuario(usuario);
        movimiento.setTipo(tipo);
        movimiento.setMotivo(motivo);
        movimiento.setCantidad(cantidad);
        return movimientoRepository.save(movimiento);
    }

    private Usuario obtenerUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado en base de datos"));
    }
    public List<InventarioSucursal> obtenerAlertasStockBajo() {
    return inventarioRepository.findConStockBajoElMinimo();
}
}