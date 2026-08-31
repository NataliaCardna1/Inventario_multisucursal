package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {
}