package co.com.opc.inventario.config;

import co.com.opc.inventario.entity.*;
import co.com.opc.inventario.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SucursalRepository sucursalRepository;
    private final CategoriaProductoRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public DataSeeder(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            SucursalRepository sucursalRepository,
            CategoriaProductoRepository categoriaRepository,
            ProductoRepository productoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.sucursalRepository = sucursalRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
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

        if (sucursalRepository.count() == 0) {
            Sucursal principal = new Sucursal();
            principal.setNombre("Sucursal Principal");
            principal.setDireccion("Calle 100 No 10-20, Bogotá");
            principal.setTelefono("6011234567");
            principal.setActiva(true);
            sucursalRepository.save(principal);

            Sucursal norte = new Sucursal();
            norte.setNombre("Sucursal Norte");
            norte.setDireccion("Calle 200 No 30-40, Bogotá");
            norte.setTelefono("6019876543");
            norte.setActiva(true);
            sucursalRepository.save(norte);

            System.out.println(">>> Sucursales de demostración creadas");
        }

        if (categoriaRepository.count() == 0) {
            String[] nombresCategorias = { "General", "Electrónica", "Alimentos y Bebidas", "Ferretería" };
            for (String nombre : nombresCategorias) {
                CategoriaProducto categoria = new CategoriaProducto();
                categoria.setNombre(nombre);
                categoria.setActiva(true);
                categoriaRepository.save(categoria);
            }
            System.out.println(">>> Categorías fijas creadas");
        }

        if (productoRepository.count() == 0) {
            CategoriaProducto general = categoriaRepository.findAll().get(0);

            Producto p1 = new Producto();
            p1.setSku("SKU-0001");
            p1.setNombre("Producto de prueba");
            p1.setDescripcion("Producto de demostración");
            p1.setCategoria(general);
            p1.setPrecioVenta(new BigDecimal("15000"));
            p1.setCostoPromedio(BigDecimal.ZERO);
            p1.setActivo(true);
            productoRepository.save(p1);

            Producto p2 = new Producto();
            p2.setSku("SKU-0002");
            p2.setNombre("Segundo producto");
            p2.setDescripcion("Producto de demostración");
            p2.setCategoria(general);
            p2.setPrecioVenta(new BigDecimal("25000"));
            p2.setCostoPromedio(BigDecimal.ZERO);
            p2.setActivo(true);
            productoRepository.save(p2);

            System.out.println(">>> Productos de demostración creados");
        }
    }
}