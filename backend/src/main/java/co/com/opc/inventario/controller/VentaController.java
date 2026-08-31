package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.VentaRequest;
import co.com.opc.inventario.entity.Venta;
import co.com.opc.inventario.entity.VentaDetalle;
import co.com.opc.inventario.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<Venta>> listar() {
        return ResponseEntity.ok(ventaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<VentaDetalle>> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerDetalles(id));
    }

    @PostMapping
    public ResponseEntity<Venta> registrar(@Valid @RequestBody VentaRequest request) {
        Venta venta = ventaService.registrarVenta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(venta);
    }
}