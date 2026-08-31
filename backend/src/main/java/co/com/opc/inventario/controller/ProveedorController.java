package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.Proveedor;
import co.com.opc.inventario.repository.ProveedorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Proveedor>> listar() {
        return ResponseEntity.ok(proveedorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Proveedor> crear(@Valid @RequestBody ProveedorRequest request) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(request.getNombre());
        proveedor.setNombreContacto(request.getNombreContacto());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setEmail(request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(proveedorRepository.save(proveedor));
    }

    public static class ProveedorRequest {
        @NotBlank
        private String nombre;
        private String nombreContacto;
        private String telefono;
        private String email;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getNombreContacto() { return nombreContacto; }
        public void setNombreContacto(String nombreContacto) { this.nombreContacto = nombreContacto; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}