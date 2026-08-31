package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.LoginRequest;
import co.com.opc.inventario.dto.LoginResponse;
import co.com.opc.inventario.entity.Usuario;
import co.com.opc.inventario.repository.UsuarioRepository;
import co.com.opc.inventario.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().name());

        Long sucursalId = usuario.getSucursal() != null ? usuario.getSucursal().getId() : null;
        String sucursalNombre = usuario.getSucursal() != null ? usuario.getSucursal().getNombre() : null;

        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getRol().name(), sucursalId, sucursalNombre));
    }
}