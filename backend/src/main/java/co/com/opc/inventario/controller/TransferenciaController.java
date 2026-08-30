package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.TransferenciaRequest;
import co.com.opc.inventario.entity.Transferencia;
import co.com.opc.inventario.service.TransferenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import co.com.opc.inventario.dto.PreparacionRequest;
import co.com.opc.inventario.dto.DespachoRequest;
import co.com.opc.inventario.dto.RecepcionRequest;
import co.com.opc.inventario.entity.TransferenciaDetalle;
import java.util.List;

@RestController
@RequestMapping("/transferencias")
public class TransferenciaController {

    private final TransferenciaService transferenciaService;

    public TransferenciaController(TransferenciaService transferenciaService) {
        this.transferenciaService = transferenciaService;
    }

    @PostMapping
    public ResponseEntity<Transferencia> solicitar(@Valid @RequestBody TransferenciaRequest request) {
        Transferencia transferencia = transferenciaService.solicitar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transferencia);
    }
    @PostMapping("/{id}/preparar")
    public ResponseEntity<Transferencia> prepararEnvio(@PathVariable Long id, @Valid @RequestBody PreparacionRequest request) {
        Transferencia transferencia = transferenciaService.prepararEnvio(id, request);
        return ResponseEntity.ok(transferencia);
    }
    @PostMapping("/{id}/despachar")
    public ResponseEntity<Transferencia> registrarDespacho(@PathVariable Long id, @Valid @RequestBody DespachoRequest request) {
        Transferencia transferencia = transferenciaService.registrarDespacho(id, request);
        return ResponseEntity.ok(transferencia);
    }
    @PostMapping("/{id}/recibir")
    public ResponseEntity<Transferencia> confirmarRecepcion(@PathVariable Long id, @Valid @RequestBody RecepcionRequest request) {
        Transferencia transferencia = transferenciaService.confirmarRecepcion(id, request);
        return ResponseEntity.ok(transferencia);
    }

    @GetMapping
    public ResponseEntity<List<Transferencia>> listar() {
        return ResponseEntity.ok(transferenciaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transferencia> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(transferenciaService.obtenerPorId(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<TransferenciaDetalle>> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(transferenciaService.obtenerDetalles(id));
    }
}