package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {
}