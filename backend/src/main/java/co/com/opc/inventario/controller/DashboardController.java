package co.com.opc.inventario.controller;

import co.com.opc.inventario.dto.DashboardResumen;
import co.com.opc.inventario.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResumen> obtenerResumen(@RequestParam Long sucursalId) {
        return ResponseEntity.ok(dashboardService.obtenerResumen(sucursalId));
}
}