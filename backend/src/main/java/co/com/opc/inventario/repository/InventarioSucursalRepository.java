package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.InventarioSucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioSucursalRepository extends JpaRepository<InventarioSucursal, Long> {
    List<InventarioSucursal> findBySucursalId(Long sucursalId);
    Optional<InventarioSucursal> findByProductoIdAndSucursalId(Long productoId, Long sucursalId);
    
    @org.springframework.data.jpa.repository.Query("SELECT i FROM InventarioSucursal i WHERE i.stockActual < i.stockMinimo")
    List<InventarioSucursal> findConStockBajoElMinimo();

    List<InventarioSucursal> findByProductoId(Long productoId);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM InventarioSucursal i WHERE i.sucursal.id = :sucursalId AND i.stockActual < i.stockMinimo")
    List<InventarioSucursal> findConStockBajoPorSucursal(@org.springframework.data.repository.query.Param("sucursalId") Long sucursalId);
}