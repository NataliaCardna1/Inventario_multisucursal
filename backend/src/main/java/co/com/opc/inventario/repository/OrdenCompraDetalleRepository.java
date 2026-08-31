package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.OrdenCompraDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenCompraDetalleRepository extends JpaRepository<OrdenCompraDetalle, Long> {
    List<OrdenCompraDetalle> findByOrdenCompraId(Long ordenCompraId);
}