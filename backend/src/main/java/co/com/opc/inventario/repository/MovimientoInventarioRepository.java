package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByProductoIdAndSucursalIdOrderByFechaDesc(Long productoId, Long sucursalId);
}