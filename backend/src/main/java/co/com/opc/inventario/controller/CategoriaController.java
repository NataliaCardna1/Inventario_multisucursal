package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.CategoriaProducto;
import co.com.opc.inventario.repository.CategoriaProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}