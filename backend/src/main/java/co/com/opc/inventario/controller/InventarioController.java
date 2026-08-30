package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.InventarioSucursal;
import co.com.opc.inventario.service.InventarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import co.com.opc.inventario.dto.MovimientoRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import co.com.opc.inventario.entity.MovimientoInventario;

import java.util.List;

@RestController
@RequestMapping("/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<InventarioSucursal>> obtenerPorSucursal(@PathVariable Long sucursalId) {
        return ResponseEntity.ok(inventarioService.obtenerPorSucursal(sucursalId));
    }
    @PostMapping("/ingreso")
public ResponseEntity<MovimientoInventario> registrarIngreso(@Valid @RequestBody MovimientoRequest request) {
    var movimiento = inventarioService.registrarIngreso(
            request.getProductoId(), request.getSucursalId(), request.getCantidad(), request.getMotivo()
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);
}

@PostMapping("/retiro")
public ResponseEntity<MovimientoInventario> registrarRetiro(@Valid @RequestBody MovimientoRequest request) {
    var movimiento = inventarioService.registrarRetiro(
            request.getProductoId(), request.getSucursalId(), request.getCantidad(), request.getMotivo()
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);

    }
    @GetMapping("/alertas")
    public ResponseEntity<List<InventarioSucursal>> obtenerAlertas() {
        return ResponseEntity.ok(inventarioService.obtenerAlertasStockBajo());
    }
}