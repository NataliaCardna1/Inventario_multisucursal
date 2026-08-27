package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.InventarioSucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioSucursalRepository extends JpaRepository<InventarioSucursal, Long> {
    List<InventarioSucursal> findBySucursalId(Long sucursalId);
    Optional<InventarioSucursal> findByProductoIdAndSucursalId(Long productoId, Long sucursalId);
}