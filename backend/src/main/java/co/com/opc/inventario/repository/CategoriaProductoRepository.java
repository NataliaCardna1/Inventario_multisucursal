package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.CategoriaProducto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Long> {
}