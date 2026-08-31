package co.com.opc.inventario.service;

import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import co.com.opc.inventario.dto.DashboardResumen;

@Service
public class DashboardService {

    private final VentaRepository ventaRepository;
    private final VentaDetalleRepository ventaDetalleRepository;
    private final InventarioSucursalRepository inventarioSucursalRepository;
    private final TransferenciaRepository transferenciaRepository;
    private final SucursalRepository sucursalRepository;

    public DashboardService(
            VentaRepository ventaRepository,
            VentaDetalleRepository ventaDetalleRepository,
            InventarioSucursalRepository inventarioSucursalRepository,
            TransferenciaRepository transferenciaRepository,
            SucursalRepository sucursalRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.ventaDetalleRepository = ventaDetalleRepository;
        this.inventarioSucursalRepository = inventarioSucursalRepository;
        this.transferenciaRepository = transferenciaRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @Transactional
    public DashboardResumen obtenerResumen(Long sucursalId) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioMesActual = ahora.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime inicioMesAnterior = inicioMesActual.minusMonths(1);
        LocalDateTime finMesAnterior = inicioMesActual.minusSeconds(1);

        // --- Datos filtrados por la sucursal seleccionada ---
        List<Venta> ventasMesActual = ventaRepository.findBySucursalIdAndFechaBetween(sucursalId, inicioMesActual, ahora);
        List<Venta> ventasMesAnterior = ventaRepository.findBySucursalIdAndFechaBetween(sucursalId, inicioMesAnterior, finMesAnterior);

        BigDecimal totalMesActual = ventasMesActual.stream()
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalMesAnterior = ventasMesAnterior.stream()
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        long productosStockBajo = inventarioSucursalRepository.findConStockBajoPorSucursal(sucursalId).size();

        long transferenciasActivas = transferenciaRepository
                .findBySucursalOrigenIdOrSucursalDestinoId(sucursalId, sucursalId).stream()
                .filter(t -> t.getEstado() == EstadoTransferencia.SOLICITADA
                        || t.getEstado() == EstadoTransferencia.EN_PREPARACION
                        || t.getEstado() == EstadoTransferencia.EN_TRANSITO)
                .count();

        Map<Long, BigDecimal> cantidadPorProductoId = new HashMap<>();
        Map<Long, String> nombrePorProductoId = new HashMap<>();
        for (Venta v : ventasMesActual) {
            for (VentaDetalle d : ventaDetalleRepository.findByVentaId(v.getId())) {
                Long pid = d.getProducto().getId();
                cantidadPorProductoId.merge(pid, d.getCantidad(), BigDecimal::add);
                nombrePorProductoId.put(pid, d.getProducto().getNombre());
            }
        }
        List<DashboardResumen.ProductoRotacion> topProductos = cantidadPorProductoId.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(e -> new DashboardResumen.ProductoRotacion(nombrePorProductoId.get(e.getKey()), e.getValue()))
                .collect(Collectors.toList());

        // --- Comparativa entre sucursales: SIEMPRE global, sin importar la sucursal seleccionada ---
        List<Venta> ventasMesActualTodas = ventaRepository.findByFechaBetween(inicioMesActual, ahora);
        List<DashboardResumen.VentasPorSucursal> comparativa = new ArrayList<>();
        for (Sucursal s : sucursalRepository.findAll()) {
            BigDecimal totalSucursal = ventasMesActualTodas.stream()
                    .filter(v -> v.getSucursal().getId().equals(s.getId()))
                    .map(Venta::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            comparativa.add(new DashboardResumen.VentasPorSucursal(s.getNombre(), totalSucursal));
        }

        DashboardResumen resumen = new DashboardResumen();
        resumen.setVentasMesActual(totalMesActual);
        resumen.setVentasMesAnterior(totalMesAnterior);
        resumen.setProductosStockBajo(productosStockBajo);
        resumen.setTransferenciasActivas(transferenciasActivas);
        resumen.setTopProductos(topProductos);
        resumen.setVentasPorSucursal(comparativa);
        return resumen;
    }
}