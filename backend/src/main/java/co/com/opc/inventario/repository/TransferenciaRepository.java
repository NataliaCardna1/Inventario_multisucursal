package co.com.opc.inventario.repository;

import co.com.opc.inventario.entity.Transferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransferenciaRepository extends JpaRepository<Transferencia, Long> {
    List<Transferencia> findBySucursalOrigenIdOrSucursalDestinoId(Long origenId, Long destinoId);
}