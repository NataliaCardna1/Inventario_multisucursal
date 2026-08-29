package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.Transferencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferenciaRepository extends JpaRepository<Transferencia, Long> {
}