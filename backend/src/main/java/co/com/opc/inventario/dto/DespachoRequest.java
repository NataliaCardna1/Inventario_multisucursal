package co.com.opc.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DespachoRequest {

    @NotBlank
    private String transportista;

    @NotNull
    private LocalDate fechaEstimadaLlegada;

    public String getTransportista() { return transportista; }
    public void setTransportista(String transportista) { this.transportista = transportista; }
    public LocalDate getFechaEstimadaLlegada() { return fechaEstimadaLlegada; }
    public void setFechaEstimadaLlegada(LocalDate fechaEstimadaLlegada) { this.fechaEstimadaLlegada = fechaEstimadaLlegada; }
}