package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.TransferenciaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransferenciaDetalleRepository extends JpaRepository<TransferenciaDetalle, Long> {
    List<TransferenciaDetalle> findByTransferenciaId(Long transferenciaId);
}