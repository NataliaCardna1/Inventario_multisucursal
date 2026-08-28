package co.com.opc.inventario.service;

import co.com.opc.inventario.entity.CategoriaProducto;
import co.com.opc.inventario.entity.Producto;
import co.com.opc.inventario.repository.CategoriaProductoRepository;
import co.com.opc.inventario.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaProductoRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaProductoRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Producto> listarActivos() {
        return productoRepository.findByActivoTrue();
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + id));
    }

    public Producto crear(String sku, String nombre, String descripcion, Long categoriaId,
                           BigDecimal precioVenta, LocalDate fechaVencimiento) {
        if (productoRepository.findBySku(sku).isPresent()) {
            throw new IllegalStateException("Ya existe un producto con el SKU: " + sku);
        }
        CategoriaProducto categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + categoriaId));

        Producto producto = new Producto();
        producto.setSku(sku);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setCategoria(categoria);
        producto.setPrecioVenta(precioVenta);
        producto.setCostoPromedio(BigDecimal.ZERO);
        producto.setFechaVencimiento(fechaVencimiento);
        producto.setActivo(true);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, String nombre, String descripcion, Long categoriaId,
                                BigDecimal precioVenta, LocalDate fechaVencimiento) {
        Producto producto = obtenerPorId(id);
        CategoriaProducto categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + categoriaId));

        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setCategoria(categoria);
        producto.setPrecioVenta(precioVenta);
        producto.setFechaVencimiento(fechaVencimiento);
        return productoRepository.save(producto);
    }

    public void desactivar(Long id) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }
}