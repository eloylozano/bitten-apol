# 🛒 BittenApol

Este proyecto es una aplicación de un ecommerce desarrollado con Next.js, MongoDB y TypeScript. Permite a los usuarios agregar productos al carrito y gestionar su dirección de envío.

## 📌 Características
- Agregar y eliminar productos del carrito.
- Recuperación automática de la dirección del usuario.
- Integración con MongoDB para almacenar usuarios y direcciones.
- Checkout (pendiente de implementación).

## 🛠️ Tecnologías utilizadas
- **Frontend:** Next.js, React, TypeScript
- **Backend:** API Routes en Next.js
- **Base de datos:** MongoDB con Mongoose, AWS, 
- **Autenticación:** Google Cloud
- **Manejo de estado:** Context API

## 🚀 Instalación y ejecución
### 1️⃣ Clonar el repositorio
```bash
 git clone https://github.com/tu-usuario/tu-repo.git
 cd tu-repo
```
### 2️⃣ Instalar dependencias
```bash
npm install
```
### 3️⃣ Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con los siguientes valores:
```env
MONGO_URI=mongodb+srv://tu_usuario:tu_contraseña@cluster.mongodb.net/tu_db
NEXT_PUBLIC_STRIPE_KEY=tu_stripe_key
```
### 4️⃣ Ejecutar el proyecto
```bash
npm run dev
```
El proyecto estará disponible en `http://localhost:3000`

## 🔧 Estructura del proyecto
```
📂 app/
 ├── 📂 models/          # Modelos de Mongoose
 ├── 📂 api/             # Rutas API para manejar datos
 ├── 📂 account/         # Página de perfil del usuario
 ├── 📂 cart/            # Página del carrito de compras
 ├── 📂 checkout/        # Página de checkout
 ├── 📂 components/      # Componentes reutilizables
 ├── 📜 layout.tsx       # Layout principal
 ├── 📜 page.tsx         # Página principal
```

## 📜 Licencia
Este proyecto está bajo la licencia MIT.
