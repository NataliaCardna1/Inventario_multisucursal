package co.com.opc.inventario.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "envio")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transferencia_id", nullable = false)
    private Transferencia transferencia;

    private String transportista;

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;

    @Column(name = "fecha_estimada_llegada")
    private LocalDate fechaEstimadaLlegada;

    @Column(name = "fecha_real_llegada")
    private LocalDate fechaRealLlegada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEnvio estado;

    @Column(name = "costo_envio", precision = 12, scale = 2)
    private BigDecimal costoEnvio;

    @Enumerated(EnumType.STRING)
    private Urgencia prioridad;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Transferencia getTransferencia() { return transferencia; }
    public void setTransferencia(Transferencia transferencia) { this.transferencia = transferencia; }
    public String getTransportista() { return transportista; }
    public void setTransportista(String transportista) { this.transportista = transportista; }
    public LocalDate getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDate fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public LocalDate getFechaEstimadaLlegada() { return fechaEstimadaLlegada; }
    public void setFechaEstimadaLlegada(LocalDate fechaEstimadaLlegada) { this.fechaEstimadaLlegada = fechaEstimadaLlegada; }
    public LocalDate getFechaRealLlegada() { return fechaRealLlegada; }
    public void setFechaRealLlegada(LocalDate fechaRealLlegada) { this.fechaRealLlegada = fechaRealLlegada; }
    public EstadoEnvio getEstado() { return estado; }
    public void setEstado(EstadoEnvio estado) { this.estado = estado; }
    public BigDecimal getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(BigDecimal costoEnvio) { this.costoEnvio = costoEnvio; }
    public Urgencia getPrioridad() { return prioridad; }
    public void setPrioridad(Urgencia prioridad) { this.prioridad = prioridad; }
}