package co.com.opc.inventario.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transferencia")
public class Transferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sucursal_origen_id", nullable = false)
    private Sucursal sucursalOrigen;

    @ManyToOne
    @JoinColumn(name = "sucursal_destino_id", nullable = false)
    private Sucursal sucursalDestino;

    @ManyToOne
    @JoinColumn(name = "usuario_solicita_id", nullable = false)
    private Usuario usuarioSolicita;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTransferencia estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgencia urgencia;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    @PrePersist
    protected void alCrear() {
        this.fechaSolicitud = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoTransferencia.SOLICITADA;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Sucursal getSucursalOrigen() { return sucursalOrigen; }
    public void setSucursalOrigen(Sucursal sucursalOrigen) { this.sucursalOrigen = sucursalOrigen; }
    public Sucursal getSucursalDestino() { return sucursalDestino; }
    public void setSucursalDestino(Sucursal sucursalDestino) { this.sucursalDestino = sucursalDestino; }
    public Usuario getUsuarioSolicita() { return usuarioSolicita; }
    public void setUsuarioSolicita(Usuario usuarioSolicita) { this.usuarioSolicita = usuarioSolicita; }
    public EstadoTransferencia getEstado() { return estado; }
    public void setEstado(EstadoTransferencia estado) { this.estado = estado; }
    public Urgencia getUrgencia() { return urgencia; }
    public void setUrgencia(Urgencia urgencia) { this.urgencia = urgencia; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
}