package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.OrdenCompraRequest;
import co.com.opc.inventario.entity.OrdenCompra;
import co.com.opc.inventario.entity.OrdenCompraDetalle;
import co.com.opc.inventario.service.OrdenCompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compras")
public class OrdenCompraController {

    private final OrdenCompraService ordenCompraService;

    public OrdenCompraController(OrdenCompraService ordenCompraService) {
        this.ordenCompraService = ordenCompraService;
    }

    @GetMapping
    public ResponseEntity<List<OrdenCompra>> listar() {
        return ResponseEntity.ok(ordenCompraService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenCompra> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.obtenerPorId(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<OrdenCompraDetalle>> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.obtenerDetalles(id));
    }

    @PostMapping
    public ResponseEntity<OrdenCompra> crear(@Valid @RequestBody OrdenCompraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordenCompraService.crear(request));
    }

    @PostMapping("/{id}/recibir")
    public ResponseEntity<OrdenCompra> confirmarRecepcion(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.confirmarRecepcion(id));
    }
}