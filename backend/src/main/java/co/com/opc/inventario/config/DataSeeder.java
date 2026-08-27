package co.com.opc.inventario.config;

import co.com.opc.inventario.entity.Rol;
import co.com.opc.inventario.entity.Usuario;
import co.com.opc.inventario.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@opc.com.co");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN_GENERAL);
            admin.setActivo(true);
            usuarioRepository.save(admin);
            System.out.println(">>> Usuario admin de prueba creado: admin@opc.com.co / admin123");
        }
    }
}