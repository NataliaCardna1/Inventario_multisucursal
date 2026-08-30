package co.com.opc.inventario.service;

import co.com.opc.inventario.dto.UsuarioRequest;
import co.com.opc.inventario.entity.Sucursal;
import co.com.opc.inventario.entity.Usuario;
import co.com.opc.inventario.repository.SucursalRepository;
import co.com.opc.inventario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SucursalRepository sucursalRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, SucursalRepository sucursalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.sucursalRepository = sucursalRepository;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario crear(UsuarioRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Ya existe un usuario con el email: " + request.getEmail());
        }

        Sucursal sucursal = null;
        if (request.getSucursalId() != null) {
            sucursal = sucursalRepository.findById(request.getSucursalId())
                    .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada: " + request.getSucursalId()));
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setSucursal(sucursal);
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }
}