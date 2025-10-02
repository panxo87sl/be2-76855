# 🚀 Proyecto Final - Backend Avanzado (Coderhouse)

**Estudiante:** Francisco Orellana  
**Escuela:** [Coderhouse](https://www.coderhouse.cl)  
**Código del Curso:** `76855`

# API RESTful - Proyecto Backend Nivel 2

Este proyecto implementa una API completa con gestión de usuarios, productos, carritos de compra y tickets de compra. Utiliza Node.js, Express, MongoDB, Mongoose, y sigue una arquitectura basada en DAO + Repository + Service.

## 🔐 Roles disponibles

- `user`: Usuario común, puede comprar productos y gestionar su carrito.
- `admin`: Puede acceder a los recursos solicitados en consigna, incluyendo todos los usuarios, carritos y tickets.

## 📦 Rutas disponibles

---

### 🛠️ **Autenticación - /api/v1/auth**

| Método | Ruta       | Descripción               | Rol Requerido |
| ------ | ---------- | ------------------------- | ------------- |
| POST   | /register  | Registro de nuevo usuario | Público       |
| POST   | /jwt/login | Login con JWT             | Público       |
| GET    | /jwt/me    | Obtener perfil con JWT    | Autenticado   |
| POST   | /logout    | Cerrar sesión             | Autenticado   |

---

### 👤 **Usuarios - /api/v1/users**

| Método | Ruta | Descripción                     | Rol     |
| ------ | ---- | ------------------------------- | ------- |
| GET    | /    | Obtener todos los usuarios      | Admin   |
| POST   | /    | Crear nuevo usuario (y carrito) | Público |
| GET    | /:id | Obtener usuario por ID          | Admin   |
| PUT    | /:id | Actualizar usuario por ID       | Admin   |
| DELETE | /:id | Eliminar usuario por ID         | Admin   |

---

### 🛒 **Carritos - /api/v1/carts**

| Método | Ruta               | Descripción                             | Rol   |
| ------ | ------------------ | --------------------------------------- | ----- |
| GET    | /                  | Obtener todos los carritos              | Admin |
| GET    | /mycart            | Obtener el carrito del usuario logueado | User  |
| GET    | /:id               | Obtener carrito por ID                  | Admin |
| POST   | /                  | Crear carrito manualmente (por admin)   | Admin |
| PUT    | /:id/products/:pid | Agregar producto al carrito             | User  |
| DELETE | /:id/products/:pid | Eliminar producto del carrito           | User  |
| DELETE | /:id               | Eliminar carrito completo               | User  |
| DELETE | /:id/products      | Vaciar carrito completamente            | User  |
| POST   | /purchase          | Procesar compra (genera ticket)         | User  |

---

### 🧾 **Tickets - /api/v1/tickets**

| Método | Ruta       | Descripción                     | Rol          |
| ------ | ---------- | ------------------------------- | ------------ |
| GET    | /          | Obtener todos los tickets       | Admin        |
| GET    | /mytickets | Tickets del usuario autenticado | User o Admin |
| GET    | /:code     | Obtener ticket por código       | Admin        |

---

### 📦 **Productos - /api/v1/products**

| Método | Ruta | Descripción                | Rol     |
| ------ | ---- | -------------------------- | ------- |
| GET    | /    | Listar todos los productos | Público |
| GET    | /:id | Obtener producto por ID    | Público |
| POST   | /    | Crear nuevo producto       | Admin   |
| PUT    | /:id | Actualizar producto        | Admin   |
| DELETE | /:id | Eliminar producto          | Admin   |

---

### 🔐 **Sesiones y perfil**

| Método | Ruta              | Descripción                        | Rol         |
| ------ | ----------------- | ---------------------------------- | ----------- |
| GET    | /sessions/current | Obtener sesión actual              | Autenticado |
| GET    | /profile          | Ver perfil logueado (session)      | Autenticado |
| GET    | /profile/premium  | Vista para cambio de rol           | User        |
| POST   | /profile/premium  | Procesar cambio de rol             | User        |
| GET    | /process          | Probar manejo de errores simulados | Público     |

---

## 🏠 Home

| Ruta      | Descripción               |
| --------- | ------------------------- |
| /home     | Vista home (session)      |
| /login    | Vista login               |
| /register | Vista registro            |
| /error    | Vista error personalizada |

---

## ✅ Notas

- Algunas rutas están protegidas por middleware de roles.
- Los datos del usuario se almacenan en cookies firmadas (JWT) o sesiones, dependiendo del endpoint.
- Los tickets se generan automáticamente al procesar el carrito si hay stock suficiente.

---

> Proyecto desarrollado como entrega final del curso de Backend Avanzado en Coderhouse (Nivel 2)
