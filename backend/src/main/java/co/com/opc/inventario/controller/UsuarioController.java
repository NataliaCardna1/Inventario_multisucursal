package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.UsuarioRequest;
import co.com.opc.inventario.entity.Usuario;
import co.com.opc.inventario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody UsuarioRequest request) {
        Usuario usuario = usuarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }
}