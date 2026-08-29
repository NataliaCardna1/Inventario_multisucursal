package co.com.opc.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class PreparacionRequest {

    @NotEmpty
    @Valid
    private List<ItemPreparacion> items;

    public List<ItemPreparacion> getItems() { return items; }
    public void setItems(List<ItemPreparacion> items) { this.items = items; }

    public static class ItemPreparacion {
        @NotNull
        private Long detalleId;

        @NotNull
        @DecimalMin(value = "0.01", message = "La cantidad a enviar debe ser mayor a cero")
        private BigDecimal cantidadEnviada;

        public Long getDetalleId() { return detalleId; }
        public void setDetalleId(Long detalleId) { this.detalleId = detalleId; }
        public BigDecimal getCantidadEnviada() { return cantidadEnviada; }
        public void setCantidadEnviada(BigDecimal cantidadEnviada) { this.cantidadEnviada = cantidadEnviada; }
    }
}