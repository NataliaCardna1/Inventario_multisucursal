package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.InventarioSucursal;
import co.com.opc.inventario.service.InventarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}