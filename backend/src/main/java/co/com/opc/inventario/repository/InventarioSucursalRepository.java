package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.InventarioSucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import java.util.List;
import java.util.Optional;

public interface InventarioSucursalRepository extends JpaRepository<InventarioSucursal, Long> {
    List<InventarioSucursal> findBySucursalId(Long sucursalId);
    Optional<InventarioSucursal> findByProductoIdAndSucursalId(Long productoId, Long sucursalId);
    
    @Query("SELECT i FROM InventarioSucursal i WHERE i.stockActual <= i.stockMinimo")
    List<InventarioSucursal> findConStockBajoElMinimo();

    List<InventarioSucursal> findByProductoId(Long productoId);

    @Query("SELECT i FROM InventarioSucursal i WHERE i.sucursal.id = :sucursalId AND i.stockActual <= i.stockMinimo")
    List<InventarioSucursal> findConStockBajoPorSucursal(@Param("sucursalId") Long sucursalId);
}