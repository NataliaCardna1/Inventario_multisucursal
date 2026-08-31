# Sistema de Inventario Multi-Sucursal

Prueba técnica para OptiPlant Consultores — sistema de gestión de inventario para una organización con múltiples sucursales, permitiendo operación autónoma por sucursal con visibilidad compartida sobre el inventario general de la red.

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos implementados](#módulos-implementados)
- [Roles y permisos](#roles-y-permisos)
- [Decisiones técnicas](#decisiones-técnicas)
- [Limitaciones conocidas y trabajo futuro](#limitaciones-conocidas-y-trabajo-futuro)
- [Documentación adicional](#documentación-adicional)

---

## Stack tecnológico

**Backend**
- Java 21 (LTS)
- Spring Boot 4.1.1 (Spring Framework 7)
- Spring Security + JWT (jjwt 0.13.0)
- Spring Data JPA (Hibernate)
- Flyway (migraciones de base de datos versionadas)
- PostgreSQL 17
- Maven

**Frontend**
- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS v4
- Axios
- Lucide React (iconografía)

**Infraestructura**
- Docker + Docker Compose (orquestación completa con un solo comando)
- Nginx (servir el build de producción del frontend)

## Arquitectura

El sistema está separado en tres capas independientes, cada una en su propio contenedor Docker, comunicándose exclusivamente vía API REST:

```
Navegador → [Frontend: React + Nginx] → [Backend: Spring Boot] → [Base de datos: PostgreSQL]
```

Dentro del backend, se sigue una arquitectura en capas:

```
Controller (REST) → Service (lógica de negocio) → Repository (Spring Data JPA) → PostgreSQL
```

El diagrama de arquitectura completo, el diagrama entidad-relación, el diagrama de casos de uso y los diagramas de actividad (flujo de transferencia y flujo de venta) están en la carpeta `docs/diagramas/`.

## Instalación y ejecución

Requisitos: Docker y Docker Compose instalados. Nada más — no se requiere instalar Java, Node, Maven ni PostgreSQL en la máquina local.

```bash
git clone https://github.com/NataliaCardna1/Inventario_multisucursal.git
cd Inventario_multisucursal
docker compose up --build
```

Una vez levantado:
- **Frontend:** http://localhost:5173
- **Backend (API):** http://localhost:8080
- **Health check:** http://localhost:8080/actuator/health

El proyecto funciona con los valores por defecto sin necesidad de crear ningún archivo `.env` (ver `.env.example` en la raíz si se desea personalizar usuario/contraseña de la base de datos).

Al arrancar por primera vez sobre una base de datos vacía, el sistema crea automáticamente datos de demostración (usuario administrador, dos sucursales, categorías base, y dos productos de ejemplo) — no es necesario insertar nada manualmente para empezar a probar.

### Credenciales de prueba

- **Administrador general:** `admin@opc.com.co` / `admin123`

⚠️ Este usuario se crea automáticamente solo para fines de evaluación — ver [Limitaciones conocidas](#limitaciones-conocidas-y-trabajo-futuro). Usuarios adicionales (gerentes de sucursal, operadores) pueden crearse desde la pantalla de Administración una vez dentro del sistema como administrador.

## Estructura del proyecto

```
├── backend/                # API REST en Spring Boot
│   ├── src/main/java/co/com/opc/inventario/
│   │   ├── config/          # Seguridad, CORS, manejo global de errores, seed de datos
│   │   ├── controller/      # Endpoints REST
│   │   ├── service/         # Lógica de negocio
│   │   ├── repository/      # Acceso a datos (Spring Data JPA)
│   │   ├── entity/          # Entidades JPA
│   │   ├── dto/             # Objetos de transferencia de datos
│   │   └── security/        # JWT (generación, validación, filtro)
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/    # Migraciones Flyway versionadas (V1 a V14)
├── frontend/                # SPA en React
│   └── src/
│       ├── api/             # Módulos tipados de llamadas a la API
│       ├── components/      # Componentes reutilizables (layout, modales, stepper)
│       ├── context/         # Autenticación y sucursal activa
│       ├── pages/           # Pantallas de la aplicación
│       └── types/           # Tipos TypeScript reflejando las entidades del backend
├── docs/                    # Diagramas, requerimientos, historias de usuario
├── docker-compose.yml
└── PENDIENTES.md            # Registro de decisiones pendientes y deuda técnica conocida
```

## Módulos implementados

| Módulo | Backend | Frontend | Requerimientos cubiertos |
|---|---|---|---|
| Autenticación (JWT + roles) | ✅ | ✅ | Estrategia de auth (sección 8.2) |
| Inventario (consulta, ingreso/retiro con trazabilidad, configuración de stock mínimo) | ✅ | ✅ | RF-01 a RF-04, RF-07 |
| Productos (CRUD completo, soft delete) | ✅ | ✅ | RF-01, RF-06 |
| Categorías de producto (CRUD, restringido a admin) | ✅ | ✅ | Normalización del catálogo |
| Transferencias (flujo completo: solicitud → preparación → despacho → recepción completa/parcial) | ✅ | ✅ | RF-17 a RF-21 |
| **Ventas** (registro, validación de stock, comprobante consultable) | ✅ | ✅ | RF-13 a RF-16 |
| **Compras** (orden de compra, confirmación de recepción, costo promedio ponderado) | ✅ | ✅ | RF-08 a RF-12 |
| **Proveedores** (catálogo, restringido a admin) | ✅ | ✅ | Soporte a Compras |
| **Dashboard con KPIs reales** (ventas del mes vs. anterior, stock bajo, transferencias activas, productos más vendidos, comparativa entre sucursales) | ✅ | ✅ | RF-26 a RF-30 |
| Alertas de stock bajo, con stock mínimo configurable por producto/sucursal (funcionalidad adicional) | ✅ | ✅ | RF-31, RF-32 (sección 4 del enunciado) |
| Administración de usuarios (crear, listar, restringido por rol) | ✅ | ✅ | RF-33 parcial |
| Logística | 🟡 entidad `Envio` existe dentro de Transferencias | ⬜ sin pantalla propia | RF-22 a RF-25 parcial |

## Roles y permisos

El sistema define tres roles (`ADMIN_GENERAL`, `GERENTE_SUCURSAL`, `OPERADOR_INVENTARIO`), con visibilidad de sucursal diferenciada:

- **Administrador general**: puede navegar libremente entre todas las sucursales desde el selector en la barra superior, y es el único rol con acceso a Administración de usuarios, Categorías y Proveedores.
- **Gerente de sucursal**: opera sobre su sucursal asignada (ventas, transferencias, dashboard filtrado a sus propios números), pero puede *consultar en modo solo lectura* el inventario de otras sucursales — útil, por ejemplo, para verificar disponibilidad antes de solicitar una transferencia.
- **Operador de inventario**: restringido por completo a su propia sucursal asignada, sin visibilidad de otras.

La restricción de sucursal está implementada a nivel de interfaz (qué se muestra y qué se puede seleccionar); ver la limitación correspondiente más abajo sobre la validación del lado del servidor.

## Decisiones técnicas

Justificación de las decisiones que el enunciado pide sustentar explícitamente:

**Lenguaje y framework de backend — Java 21 + Spring Boot 4.1.1.** Se eligió Java por su tipado fuerte (reduce errores en cálculos de stock y costos) y el ecosistema maduro de Spring para APIs REST empresariales. Se usa específicamente Spring Boot 4.1.1 porque toda la línea 3.x quedó sin soporte de seguridad el 30 de junio de 2026 — no es la versión "más nueva por defecto", es la única razonablemente defendible al momento de construir este proyecto.

**Motor de base de datos — PostgreSQL 17.** El dominio (inventario, movimientos, transferencias entre sucursales) es fuertemente relacional, con necesidad real de integridad referencial y transacciones ACID.

**Migraciones versionadas — Flyway, no `ddl-auto` de Hibernate.** Cada cambio de esquema es un archivo `.sql` versionado y auditable (`V1` a `V14`), en vez de depender de que Hibernate infiera el esquema automáticamente.

**Autenticación y autorización — JWT stateless + Spring Security, con RBAC real por endpoint.** Los permisos por rol no son solo cosméticos en la interfaz: endpoints como `/usuarios`, `/categorias` (creación/edición) y `/proveedores` (creación/edición) están protegidos con `hasRole("ADMIN_GENERAL")` a nivel de `SecurityConfig` — una petición autenticada pero sin el rol correcto recibe `403 Forbidden` directamente del filtro de seguridad, antes de que la petición llegue siquiera al controller.

**Sincronización de inventario entre sucursales.** Base de datos centralizada compartida, con el frontend actualizando su vista mediante recarga bajo demanda en vez de WebSockets — satisface el requisito de visibilidad "near-real-time" con una complejidad de infraestructura mucho menor.

**Costo promedio ponderado (diferenciador técnico, sección 12 del enunciado).** Al confirmar la recepción de una orden de compra, el sistema recalcula el costo promedio del producto con la fórmula estándar: `(stock existente × costo anterior + cantidad recibida × precio de compra) ÷ (stock existente + cantidad recibida)`. El cálculo se hace *después* de aplicar el ingreso al inventario, por lo que la cantidad recién ingresada se resta del stock total leído para reconstruir el stock previo a la recepción — evita contar la mercancía nueva dos veces en la fórmula.

**Patrones de diseño aplicados:**
- **Repository** — Spring Data JPA, con queries derivadas del nombre del método y `@Query` explícito donde el filtro cruza más de una relación (ej. stock bajo por sucursal).
- **DTO** — las peticiones y respuestas de la API nunca exponen las entidades JPA directamente sin control (ej. el hash de contraseña de un usuario nunca se serializa).
- **Máquina de estados** — el módulo de Transferencias modela explícitamente sus transiciones válidas, rechazando con errores claros cualquier transición fuera de orden.
- **Manejo centralizado de excepciones** (`@RestControllerAdvice`).
- **Soft delete** — productos y categorías nunca se eliminan físicamente, preservando la integridad del historial de movimientos que los referencia.

## Limitaciones conocidas y trabajo futuro

Documentadas explícitamente, siguiendo el principio del enunciado de que cada decisión debe poder justificarse:

- **La restricción de sucursal para roles no-admin (Gerente, Operador) está implementada solo a nivel de interfaz.** El frontend no ofrece la opción de operar sobre otra sucursal, pero el backend no valida server-side que el `sucursalId` en una petición coincida con la sucursal asignada al usuario autenticado. Un usuario técnico podría, en teoría, manipular la petición HTTP directamente. La forma correcta a futuro es agregar esa validación en cada endpoint relevante (Inventario, Ventas, Compras).
- **Logística no tiene pantalla ni reportes propios** — la entidad `Envio` existe y se usa implícitamente en el flujo de Transferencias, pero RF-22 a RF-25 (reportes de cumplimiento, tiempos de entrega) no se implementaron como módulo separado.
- **La gestión de Sucursales y Usuarios no tiene edición ni desactivación desde la interfaz** — solo creación y listado.
- **El modelo de datos diseñado (ver diagrama E-R) contempla `UNIDAD_MEDIDA`, `PRODUCTO_UNIDAD_MEDIDA`, y `ALERTA` como entidad persistida**, ninguna de las tres se implementó como tabla real — las alertas de stock se calculan al vuelo con una consulta, no se almacenan como registros históricos.
- **Las alertas de stock bajo no se envían por correo electrónico.** El diagrama de arquitectura contempla una integración SMTP como servicio externo opcional; se decidió no implementarla por el riesgo de depender de un servidor de correo real durante la evaluación, y porque el enunciado exige alertas visibles en el sistema, no necesariamente por correo.
- **El usuario administrador se crea automáticamente al arrancar (`DataSeeder`)** con credenciales fijas, solo para fines de evaluación.
- **El campo SKU no valida un formato específico** (texto libre); solo se garantiza que no se repita.
- **Códigos de estado HTTP:** las rutas protegidas sin token responden `403 Forbidden` en vez del semánticamente más preciso `401 Unauthorized`.
- **`spring.jpa.open-in-view`** se dejó en su valor por defecto (`true`).

## Documentación adicional

- `docs/levantamiento-requerimientos.md` — requerimientos funcionales, no funcionales, restricciones y supuestos.
- `docs/historias-usuario.md` — historias de usuario con trazabilidad a los requerimientos.
- `docs/diagramas/` — diagrama de casos de uso, diagramas de actividad (transferencia y venta), diagrama de arquitectura, diagrama entidad-relación (formato Mermaid).
- `USO_DE_IA.md` — descripción del uso de inteligencia artificial durante el desarrollo, con evaluación crítica.
- `PENDIENTES.md` — registro vivo de deuda técnica y decisiones pendientes identificadas durante el desarrollo.
