package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;


public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Venta> findBySucursalIdAndFechaBetween(Long sucursalId, LocalDateTime inicio, LocalDateTime fin);
}