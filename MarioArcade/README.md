# 🍄 MarioArcade  - Kaboom.js

Un juego estilo Super Mario Bros desarrollado con [Kaboom.js](https://kaboomjs.com/) v3000.1.17.

---

## Requisitos

- [Node.js](https://nodejs.org/) v16 o superior
- npm v7 o superior

---

## Instalación

### 1. Clona o descarga el proyecto

```bash
git clone https://github.com/juanjosemartin27/VisualComputing
cd VisualComputing/MarioArcade
```

O si lo descargaste como ZIP, descomprímelo y entra a la carpeta.

### 2. Instala las dependencias

```bash
npm install
```

Esto instala Kaboom.js y todo lo necesario automáticamente.

---

## Estructura del proyecto

```
MarioArcade/
├── src/
│   └── main.js
├── www/
│   ├── index.html
│   └── sprites/
│       ├── mario-standing.png
│       ├── mario-left.png
│       ├── mario-jumping.png
│       ├── mario-jumping-left.png
│       ├── mushroom.png
│       ├── evil-shroom.png
│       ├── coin.png
│       ├── question.png
│       ├── unboxed.png
│       ├── block.png
│       ├── brick.png
│       ├── pipe-left.png
│       ├── pipe-right.png
│       ├── pipe-top-left.png
│       ├── pipe-top-right.png
│       ├── background.png
│       └── ...otros sprites
└── package.json
```

> Todos los sprites deben estar en `www/sprites/`.

---

## Correr el juego

### Modo desarrollo

Compila y levanta un servidor local automáticamente:

```bash
npm run dev
```

Luego abre el navegador en `http://localhost:8000`

### Modo producción

Genera los archivos minificados listos para deploy:

```bash
npm run build
```

### Empaquetar para distribución

Genera un archivo `.zip` listo para compartir:

```bash
npm run bundle
```

El archivo se guarda en `dist/game.zip`.

---

## Controles

| Tecla | Acción |
|-------|--------|
| `→` flecha derecha | Mover a la derecha |
| `←` flecha izquierda | Mover a la izquierda |
| `Espacio` | Saltar |
| `Espacio` (en Game Over) | Reiniciar partida |

---

## Mecánicas del juego

- **Bloques `?`** — Golpéalos desde abajo para obtener monedas
- **Bloque especial `?`** — Uno de ellos suelta un hongo al golpearlo desde abajo
- **Hongo** — Recógelo para crecer y poder resistir un golpe de enemigo
- **Evil Shroom** — Enemigos que se mueven por el nivel. Puedes:
  - **Saltarles encima** para eliminarlos y ganar 10 puntos
  - **Chocarlos de lado** siendo grande para eliminarlos (pierdes el poder)
  - **Chocarlos de lado** siendo pequeño → Game Over
- **Monedas** — Cada moneda suma 1 punto al score

---

## Sistema de puntuación

| Acción | Puntos |
|--------|--------|
| Recoger moneda | +1 |
| Saltar sobre enemigo | +10 |

El **best score** se guarda durante la sesión y se muestra en la pantalla de Game Over.

---

## Posibles errores comunes

**Los sprites no cargan**
Verifica que todos los sprites estén en `www/sprites/` con los nombres exactos indicados arriba.

**Pantalla en negro**
Asegúrate de correr `npm run dev` y no abrir el `index.html` directamente en el navegador, ya que el navegador bloquea la carga de archivos locales por seguridad.

**Error de compilación**
Verifica que el archivo fuente esté en `src/main.js` exactamente, ya que el script de build apunta a esa ruta.
