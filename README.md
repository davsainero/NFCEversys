# Eversys — Portal de Servicio NFC

## Requisitos
- Node.js v18 o superior

## Instalación

```bash
# 1. Entrar en la carpeta del proyecto
cd eversys

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor
npm start
```

Abre el navegador en → **http://localhost:3000**

## Desarrollo (recarga automática)

```bash
npm run dev
```

## Estructura

```
eversys/
├── server.js          ← Servidor Express (API REST)
├── package.json
├── .gitignore
├── data/
│   └── companies.json ← Datos de empresas (se guarda aquí)
└── public/
    └── index.html     ← Aplicación web completa
```

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/companies` | Obtener todas las empresas |
| POST | `/api/companies` | Crear empresa `{ name }` |
| DELETE | `/api/companies/:name` | Eliminar empresa |
| PUT | `/api/companies/:name/module` | Asignar/reemplazar módulo `{ module, machine, id, url }` |
| DELETE | `/api/companies/:name/module/:module` | Desasignar módulo |

## Notas
- Los datos se guardan en `data/companies.json` — son compartidos por todos los usuarios conectados al servidor.
- Una empresa sólo puede tener un módulo de cada tipo (vapor, leche, etc.). Si se asigna un segundo del mismo tipo, reemplaza al anterior.
