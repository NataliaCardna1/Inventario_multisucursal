package co.com.opc.inventario.service;

import co.com.opc.inventario.dto.TransferenciaRequest;
import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import co.com.opc.inventario.dto.PreparacionRequest;
import co.com.opc.inventario.dto.RecepcionRequest;
import java.util.List;
import java.time.LocalDate;
import co.com.opc.inventario.dto.DespachoRequest;
import java.math.BigDecimal;

@Service
public class TransferenciaService {

    private final TransferenciaRepository transferenciaRepository;
    private final TransferenciaDetalleRepository detalleRepository;
    private final SucursalRepository sucursalRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InventarioService inventarioService;
    private final EnvioRepository envioRepository;

    public TransferenciaService(
            TransferenciaRepository transferenciaRepository,
            TransferenciaDetalleRepository detalleRepository,
            SucursalRepository sucursalRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            InventarioService inventarioService,
            EnvioRepository envioRepository
    ) {
        this.transferenciaRepository = transferenciaRepository;
        this.detalleRepository = detalleRepository;
        this.sucursalRepository = sucursalRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.inventarioService = inventarioService;
        this.envioRepository = envioRepository;
    }

    @Transactional
    public Transferencia solicitar(TransferenciaRequest request) {
        if (request.getSucursalOrigenId().equals(request.getSucursalDestinoId())) {
            throw new IllegalArgumentException("La sucursal de origen y destino no pueden ser la misma");
        }

        Sucursal origen = sucursalRepository.findById(request.getSucursalOrigenId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal origen no encontrada: " + request.getSucursalOrigenId()));
        Sucursal destino = sucursalRepository.findById(request.getSucursalDestinoId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal destino no encontrada: " + request.getSucursalDestinoId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));

        Transferencia transferencia = new Transferencia();
        transferencia.setSucursalOrigen(origen);
        transferencia.setSucursalDestino(destino);
        transferencia.setUsuarioSolicita(solicitante);
        transferencia.setUrgencia(request.getUrgencia());
        transferencia = transferenciaRepository.save(transferencia);

        for (TransferenciaRequest.ItemSolicitud item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.getProductoId()));

            TransferenciaDetalle detalle = new TransferenciaDetalle();
            detalle.setTransferencia(transferencia);
            detalle.setProducto(producto);
            detalle.setCantidadSolicitada(item.getCantidad());
            detalleRepository.save(detalle);
        }

        return transferencia;
    }
    @Transactional
    public Transferencia prepararEnvio(Long transferenciaId, PreparacionRequest request) {
        Transferencia transferencia = transferenciaRepository.findById(transferenciaId)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada: " + transferenciaId));

        if (transferencia.getEstado() != EstadoTransferencia.SOLICITADA) {
            throw new IllegalStateException(
                    "Solo se puede preparar una transferencia en estado SOLICITADA. Estado actual: " + transferencia.getEstado());
        }

        Long sucursalOrigenId = transferencia.getSucursalOrigen().getId();

        for (PreparacionRequest.ItemPreparacion item : request.getItems()) {
            TransferenciaDetalle detalle = detalleRepository.findById(item.getDetalleId())
                    .orElseThrow(() -> new IllegalArgumentException("Detalle no encontrado: " + item.getDetalleId()));

            if (!detalle.getTransferencia().getId().equals(transferenciaId)) {
                throw new IllegalArgumentException("El detalle " + item.getDetalleId() + " no pertenece a esta transferencia");
            }

            Long productoId = detalle.getProducto().getId();
            if (!inventarioService.haySuficienteStock(productoId, sucursalOrigenId, item.getCantidadEnviada())) {
                throw new IllegalStateException(
                        "Stock insuficiente en la sucursal origen para el producto " + productoId);
            }

            detalle.setCantidadEnviada(item.getCantidadEnviada());
            detalleRepository.save(detalle);
        }

    transferencia.setEstado(EstadoTransferencia.EN_PREPARACION);
    return transferenciaRepository.save(transferencia);
    }
    @Transactional
    public Transferencia registrarDespacho(Long transferenciaId, DespachoRequest request) {
        Transferencia transferencia = transferenciaRepository.findById(transferenciaId)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada: " + transferenciaId));

        if (transferencia.getEstado() != EstadoTransferencia.EN_PREPARACION) {
            throw new IllegalStateException(
                    "Solo se puede despachar una transferencia en estado EN_PREPARACION. Estado actual: " + transferencia.getEstado());
        }

        Long sucursalOrigenId = transferencia.getSucursalOrigen().getId();
        List<TransferenciaDetalle> detalles = detalleRepository.findByTransferenciaId(transferenciaId);

        for (TransferenciaDetalle detalle : detalles) {
            inventarioService.registrarRetiro(
                    detalle.getProducto().getId(),
                    sucursalOrigenId,
                    detalle.getCantidadEnviada(),
                    MotivoMovimiento.TRANSFERENCIA
            );
        }

        Envio envio = new Envio();
        envio.setTransferencia(transferencia);
        envio.setTransportista(request.getTransportista());
        envio.setFechaEnvio(LocalDate.now());
        envio.setFechaEstimadaLlegada(request.getFechaEstimadaLlegada());
        envio.setEstado(EstadoEnvio.EN_TRANSITO);
        envio.setPrioridad(transferencia.getUrgencia());
        envioRepository.save(envio);

        transferencia.setEstado(EstadoTransferencia.EN_TRANSITO);
        return transferenciaRepository.save(transferencia);
    }
    @Transactional
    public Transferencia confirmarRecepcion(Long transferenciaId, RecepcionRequest request) {
        Transferencia transferencia = transferenciaRepository.findById(transferenciaId)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada: " + transferenciaId));

        if (transferencia.getEstado() != EstadoTransferencia.EN_TRANSITO) {
            throw new IllegalStateException(
                    "Solo se puede confirmar recepción de una transferencia en estado EN_TRANSITO. Estado actual: " + transferencia.getEstado());
        }

        Long sucursalDestinoId = transferencia.getSucursalDestino().getId();
        boolean huboFaltante = false;

        for (RecepcionRequest.ItemRecepcion item : request.getItems()) {
            TransferenciaDetalle detalle = detalleRepository.findById(item.getDetalleId())
                    .orElseThrow(() -> new IllegalArgumentException("Detalle no encontrado: " + item.getDetalleId()));

            if (!detalle.getTransferencia().getId().equals(transferenciaId)) {
                throw new IllegalArgumentException("El detalle " + item.getDetalleId() + " no pertenece a esta transferencia");
            }

            detalle.setCantidadRecibida(item.getCantidadRecibida());
            detalleRepository.save(detalle);

            if (item.getCantidadRecibida().compareTo(detalle.getCantidadEnviada()) < 0) {
                huboFaltante = true;
            }

            if (item.getCantidadRecibida().compareTo(BigDecimal.ZERO) > 0) {
                inventarioService.registrarIngreso(
                        detalle.getProducto().getId(),
                        sucursalDestinoId,
                        item.getCantidadRecibida(),
                        MotivoMovimiento.TRANSFERENCIA
                );
            }
        }

        Envio envio = envioRepository.findByTransferenciaId(transferenciaId)
                .orElseThrow(() -> new IllegalStateException("No existe envío registrado para esta transferencia"));
        envio.setFechaRealLlegada(LocalDate.now());

        if (huboFaltante) {
            transferencia.setEstado(EstadoTransferencia.RECIBIDA_PARCIAL);
            envio.setEstado(EstadoEnvio.CON_FALTANTES);
        } else {
            transferencia.setEstado(EstadoTransferencia.RECIBIDA_COMPLETA);
            envio.setEstado(EstadoEnvio.ENTREGADO);
        }
        envioRepository.save(envio);

        return transferenciaRepository.save(transferencia);
    }
    public List<Transferencia> listarTodas() {
    return transferenciaRepository.findAll();
    }

    public Transferencia obtenerPorId(Long id) {
        return transferenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada: " + id));
    }

    public List<TransferenciaDetalle> obtenerDetalles(Long transferenciaId) {
        return detalleRepository.findByTransferenciaId(transferenciaId);
    }
}