package co.com.opc.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class VentaRequest {

    @NotNull
    private Long sucursalId;

    @NotBlank
    private String listaPrecio;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<ItemVenta> items;

    public Long getSucursalId() { return sucursalId; }
    public void setSucursalId(Long sucursalId) { this.sucursalId = sucursalId; }
    public String getListaPrecio() { return listaPrecio; }
    public void setListaPrecio(String listaPrecio) { this.listaPrecio = listaPrecio; }
    public List<ItemVenta> getItems() { return items; }
    public void setItems(List<ItemVenta> items) { this.items = items; }

    public static class ItemVenta {
        @NotNull
        private Long productoId;

        @NotNull
        @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a cero")
        private BigDecimal cantidad;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
        private BigDecimal precioUnitario;

        private BigDecimal descuento = BigDecimal.ZERO;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public BigDecimal getCantidad() { return cantidad; }
        public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
        public BigDecimal getDescuento() { return descuento; }
        public void setDescuento(BigDecimal descuento) { this.descuento = descuento; }
    }
}