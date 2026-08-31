package co.com.opc.inventario.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "proveedor")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "nombre_contacto")
    private String nombreContacto;

    private String telefono;
    private String email;

    @Column(name = "tiempo_entrega_promedio_dias")
    private Integer tiempoEntregaPromedioDias;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getNombreContacto() { return nombreContacto; }
    public void setNombreContacto(String nombreContacto) { this.nombreContacto = nombreContacto; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getTiempoEntregaPromedioDias() { return tiempoEntregaPromedioDias; }
    public void setTiempoEntregaPromedioDias(Integer tiempoEntregaPromedioDias) { this.tiempoEntregaPromedioDias = tiempoEntregaPromedioDias; }
}