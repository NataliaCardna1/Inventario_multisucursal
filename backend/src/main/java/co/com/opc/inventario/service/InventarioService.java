package co.com.opc.inventario.service;

import co.com.opc.inventario.entity.InventarioSucursal;
import co.com.opc.inventario.repository.InventarioSucursalRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventarioService {

    private final InventarioSucursalRepository inventarioRepository;

    public InventarioService(InventarioSucursalRepository inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
    }

    public List<InventarioSucursal> obtenerPorSucursal(Long sucursalId) {
        return inventarioRepository.findBySucursalId(sucursalId);
    }

    public InventarioSucursal obtenerStock(Long productoId, Long sucursalId) {
        return inventarioRepository.findByProductoIdAndSucursalId(productoId, sucursalId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe registro de inventario para ese producto en esa sucursal"));
    }

    public boolean haySuficienteStock(Long productoId, Long sucursalId, BigDecimal cantidadRequerida) {
        return inventarioRepository.findByProductoIdAndSucursalId(productoId, sucursalId)
                .map(inv -> inv.getStockActual().compareTo(cantidadRequerida) >= 0)
                .orElse(false);
    }
}