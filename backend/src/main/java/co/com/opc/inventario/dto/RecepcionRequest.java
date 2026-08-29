package co.com.opc.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class RecepcionRequest {

    @NotEmpty
    @Valid
    private List<ItemRecepcion> items;

    public List<ItemRecepcion> getItems() { return items; }
    public void setItems(List<ItemRecepcion> items) { this.items = items; }

    public static class ItemRecepcion {
        @NotNull
        private Long detalleId;

        @NotNull
        private BigDecimal cantidadRecibida;

        public Long getDetalleId() { return detalleId; }
        public void setDetalleId(Long detalleId) { this.detalleId = detalleId; }
        public BigDecimal getCantidadRecibida() { return cantidadRecibida; }
        public void setCantidadRecibida(BigDecimal cantidadRecibida) { this.cantidadRecibida = cantidadRecibida; }
    }
}