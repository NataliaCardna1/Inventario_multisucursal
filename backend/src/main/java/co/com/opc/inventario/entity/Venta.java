package co.com.opc.inventario.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sucursal_id", nullable = false)
    private Sucursal sucursal;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(name = "lista_precio")
    private String listaPrecio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoVenta estado;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @PrePersist
    protected void alCrear() {
        this.fecha = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoVenta.CONFIRMADA;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getListaPrecio() { return listaPrecio; }
    public void setListaPrecio(String listaPrecio) { this.listaPrecio = listaPrecio; }
    public EstadoVenta getEstado() { return estado; }
    public void setEstado(EstadoVenta estado) { this.estado = estado; }
    public LocalDateTime getFecha() { return fecha; }
}