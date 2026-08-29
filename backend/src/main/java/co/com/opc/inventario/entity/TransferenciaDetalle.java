package co.com.opc.inventario.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transferencia_detalle")
public class TransferenciaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transferencia_id", nullable = false)
    private Transferencia transferencia;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_solicitada", nullable = false, precision = 12, scale = 2)
    private BigDecimal cantidadSolicitada;

    @Column(name = "cantidad_enviada", precision = 12, scale = 2)
    private BigDecimal cantidadEnviada;

    @Column(name = "cantidad_recibida", precision = 12, scale = 2)
    private BigDecimal cantidadRecibida;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Transferencia getTransferencia() { return transferencia; }
    public void setTransferencia(Transferencia transferencia) { this.transferencia = transferencia; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public BigDecimal getCantidadSolicitada() { return cantidadSolicitada; }
    public void setCantidadSolicitada(BigDecimal cantidadSolicitada) { this.cantidadSolicitada = cantidadSolicitada; }
    public BigDecimal getCantidadEnviada() { return cantidadEnviada; }
    public void setCantidadEnviada(BigDecimal cantidadEnviada) { this.cantidadEnviada = cantidadEnviada; }
    public BigDecimal getCantidadRecibida() { return cantidadRecibida; }
    public void setCantidadRecibida(BigDecimal cantidadRecibida) { this.cantidadRecibida = cantidadRecibida; }
}