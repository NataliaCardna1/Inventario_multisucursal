package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.CategoriaProducto;
import co.com.opc.inventario.repository.CategoriaProductoRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaProductoRepository categoriaRepository;

    public CategoriaController(CategoriaProductoRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaProducto>> listar() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<CategoriaProducto> crear(@Valid @RequestBody CategoriaRequest request) {
        CategoriaProducto categoria = new CategoriaProducto();
        categoria.setNombre(request.getNombre());
        categoria.setActiva(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaRepository.save(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaProducto> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        CategoriaProducto categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + id));
        categoria.setNombre(request.getNombre());
        return ResponseEntity.ok(categoriaRepository.save(categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        CategoriaProducto categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + id));
        categoria.setActiva(false);
        categoriaRepository.save(categoria);
        return ResponseEntity.noContent().build();
    }

    public static class CategoriaRequest {
        @NotBlank
        private String nombre;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
    }
}