package co.com.opc.inventario.dto;

public class LoginResponse {
    private String token;
    private String email;
    private String rol;
    private Long sucursalId;
    private String sucursalNombre;

    public LoginResponse(String token, String email, String rol, Long sucursalId, String sucursalNombre) {
        this.token = token;
        this.email = email;
        this.rol = rol;
        this.sucursalId = sucursalId;
        this.sucursalNombre = sucursalNombre;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
    public Long getSucursalId() { return sucursalId; }
    public String getSucursalNombre() { return sucursalNombre; }
}