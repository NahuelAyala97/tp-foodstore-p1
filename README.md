# TP FoodStore - P1

## Descripción del Proyecto

**TP FoodStore** es una aplicación web desarrollada para el primer parcial en el curso de Programación 3 de la UTN. Se trata de una plataforma de comercio electrónico de venta de alimentos, con funcionalidades de autenticación de usuarios, gestión de carrito de compras y panel administrativo.

### Características Principales

- **Autenticación de Usuarios**: Sistema de login y registro para clientes
- **Catálogo de Productos**: Visualización de alimentos disponibles organizados por categorías
- **Carrito de Compras**: Gestión de productos seleccionados antes de la compra
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos

## Requisitos Previos

Antes de ejecutar el proyecto, se debe tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **pnpm** (gestor de paquetes)

## Instalación

1. **Clonar o descargar el repositorio**

   ```bash
   cd Tp-foodstore-p1
   ```

2. **Instalar dependencias**

   Con pnpm:

   ```bash
   pnpm install
   ```

## Ejecución

### Modo Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:5173`

### Construir para Producción

Para compilar el código TypeScript y generar la versión optimizada para producción:

```bash
pnpm build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Estructura del Proyecto

```
src/
├── main.ts              # Punto de entrada de la aplicación
├── index.css            # Estilos globales
├── data/                # Datos del proyecto
├── pages/               # Páginas de la aplicación
│   ├── admin/           # Panel administrativo
│   ├── auth/            # Páginas de autenticación (login, registro)
│   └── store/           # Tienda (inicio, carrito)
├── types/               # Definiciones de tipos TypeScript
└── utils/               # Funciones utilitarias
```

## Tecnologías Utilizadas

- **TypeScript**: Lenguaje de programación
- **Vite**: Herramienta de compilación y desarrollo
- **HTML5 y CSS3**: Estructura y estilos
- **JavaScript/TypeScript**: Lógica de la aplicación

## Autor

Alumno: Nahuel Ayala

---
