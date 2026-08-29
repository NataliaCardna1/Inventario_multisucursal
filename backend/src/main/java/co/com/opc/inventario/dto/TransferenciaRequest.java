package co.com.opc.inventario.dto;

import co.com.opc.inventario.entity.Urgencia;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class TransferenciaRequest {

    @NotNull
    private Long sucursalOrigenId;

    @NotNull
    private Long sucursalDestinoId;

    @NotNull
    private Urgencia urgencia;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<ItemSolicitud> items;

    public Long getSucursalOrigenId() { return sucursalOrigenId; }
    public void setSucursalOrigenId(Long sucursalOrigenId) { this.sucursalOrigenId = sucursalOrigenId; }
    public Long getSucursalDestinoId() { return sucursalDestinoId; }
    public void setSucursalDestinoId(Long sucursalDestinoId) { this.sucursalDestinoId = sucursalDestinoId; }
    public Urgencia getUrgencia() { return urgencia; }
    public void setUrgencia(Urgencia urgencia) { this.urgencia = urgencia; }
    public List<ItemSolicitud> getItems() { return items; }
    public void setItems(List<ItemSolicitud> items) { this.items = items; }

    public static class ItemSolicitud {
        @NotNull
        private Long productoId;

        @NotNull
        @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a cero")
        private BigDecimal cantidad;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public BigDecimal getCantidad() { return cantidad; }
        public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }
    }
}