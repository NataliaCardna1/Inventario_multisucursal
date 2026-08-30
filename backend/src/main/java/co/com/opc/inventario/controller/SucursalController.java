package co.com.opc.inventario.controller;

import co.com.opc.inventario.entity.Sucursal;
import co.com.opc.inventario.repository.SucursalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sucursales")
public class SucursalController {

    private final SucursalRepository sucursalRepository;

    public SucursalController(SucursalRepository sucursalRepository) {
        this.sucursalRepository = sucursalRepository;
    }

    @GetMapping
    public ResponseEntity<List<Sucursal>> listar() {
        return ResponseEntity.ok(sucursalRepository.findAll());
    }
}