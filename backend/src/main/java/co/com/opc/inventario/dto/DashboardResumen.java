package co.com.opc.inventario.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResumen {

    private BigDecimal ventasMesActual;
    private BigDecimal ventasMesAnterior;
    private long productosStockBajo;
    private long transferenciasActivas;
    private List<ProductoRotacion> topProductos;
    private List<VentasPorSucursal> ventasPorSucursal;

    public BigDecimal getVentasMesActual() { return ventasMesActual; }
    public void setVentasMesActual(BigDecimal ventasMesActual) { this.ventasMesActual = ventasMesActual; }
    public BigDecimal getVentasMesAnterior() { return ventasMesAnterior; }
    public void setVentasMesAnterior(BigDecimal ventasMesAnterior) { this.ventasMesAnterior = ventasMesAnterior; }
    public long getProductosStockBajo() { return productosStockBajo; }
    public void setProductosStockBajo(long productosStockBajo) { this.productosStockBajo = productosStockBajo; }
    public long getTransferenciasActivas() { return transferenciasActivas; }
    public void setTransferenciasActivas(long transferenciasActivas) { this.transferenciasActivas = transferenciasActivas; }
    public List<ProductoRotacion> getTopProductos() { return topProductos; }
    public void setTopProductos(List<ProductoRotacion> topProductos) { this.topProductos = topProductos; }
    public List<VentasPorSucursal> getVentasPorSucursal() { return ventasPorSucursal; }
    public void setVentasPorSucursal(List<VentasPorSucursal> ventasPorSucursal) { this.ventasPorSucursal = ventasPorSucursal; }

    public static class ProductoRotacion {
        private String nombre;
        private BigDecimal cantidad;

        public ProductoRotacion(String nombre, BigDecimal cantidad) {
            this.nombre = nombre;
            this.cantidad = cantidad;
        }

        public String getNombre() { return nombre; }
        public BigDecimal getCantidad() { return cantidad; }
    }

    public static class VentasPorSucursal {
        private String sucursal;
        private BigDecimal total;

        public VentasPorSucursal(String sucursal, BigDecimal total) {
            this.sucursal = sucursal;
            this.total = total;
        }

        public String getSucursal() { return sucursal; }
        public BigDecimal getTotal() { return total; }
    }
}