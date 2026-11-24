# Plan v0.1 — "Proyecto: Juego Futbol-Rol"

## Contexto
Juego que fusiona el modo carrera de jugador (FIFA/PES, Copero) con el RPG narrativo (Mass Effect, Dragon Age, Baldur's Gate): no se juega al fútbol, se toman decisiones que marcan toda la carrera. Objetivo final: publicarlo en **Steam**; **solo se jugará como app de escritorio desde Steam, no habrá versión web** (Windows primero). La carpeta `C:\Users\USER\Documents\Futbol-Rol` está vacía (no es repo git). Hay Node 22 / npm 10 instalados.

La v0.1 entrega: **menú principal** + **pantalla de creación de personaje** (sin guardar/cargar).

## Tecnología elegida (pensada para Steam)
Un juego de menús, textos y decisiones encaja mejor con una interfaz HTML/CSS dentro de una app de escritorio nativa que con un motor 3D. El resultado es un `.exe` que se distribuye solo por Steam.

| Pieza | Elección | Por qué |
|---|---|---|
| App de escritorio | **Electron** | La vía más probada para este tipo de juegos en Steam (buena integración con Steamworks); `Salir del juego` cierra la app. |
| Plantilla/build | **electron-vite** (`npm create @quick-start/electron` → react-ts) | Separa `main` / `preload` / `renderer`, recarga en caliente. |
| UI | **React + TypeScript** | Pantallas y componentes reutilizables; tipado para un modelo de datos que va a crecer mucho. |
| Estado | **Zustand** | Ligero; guarda pantalla actual y borrador del personaje. Luego serializable para guardados. |
| Banderas | **flag-icons** (SVG, MIT) | Windows **no** muestra emojis de banderas; incluye `gb-eng` (Inglaterra). |
| Fuentes | **@fontsource** (empaquetadas, sin CDN) | El juego debe funcionar offline. |
| Tests | **Vitest** + **Playwright (modo Electron)** | Vitest para lógica pura (rotación de nacionalidades, validación del nombre); Playwright lanza la app de escritorio real, recorre las pantallas y saca capturas. |
| Empaquetado | **electron-builder** (más adelante) | Genera el `.exe` para subir con SteamPipe. |
| Steam (v1.0, no ahora) | **steamworks.js** (alternativa: steamworks-ffi-node) + Steamworks SDK | Logros, Steam Cloud, overlay. Requiere cuenta Steamworks y pagar **Steam Direct: 100 USD por juego** (recuperable al llegar a 1.000 USD). |

## Estructura de archivos (v0.1)
```
Futbol-Rol/
  package.json · electron.vite.config.ts · tsconfig*.json
  src/main/index.ts            # ventana 1280x720 (mín.), sin barra de menú, IPC 'app:quit' → app.quit()
  src/preload/index.ts         # contextBridge: window.api.quit()  (contextIsolation ON, nodeIntegration OFF)
  src/renderer/index.html
  src/renderer/src/
    main.tsx · App.tsx         # App = selector de pantalla según el store
    store/gameStore.ts         # screen: 'mainMenu' | 'characterCreation' | 'careerStart'; characterDraft; acciones
    types/character.ts         # Character { name, sex: 'M'|'F', position: 'DC', nationalityId }
    data/nationalities.ts      # lista + helpers next/prev (con vuelta circular)
    data/positions.ts          # [{ id: 'DC', name: 'Delantero centro' }]
    i18n/es.ts                 # todos los textos en un sitio (facilita traducir a inglés para Steam)
    components/MenuButton.tsx · NationalitySelector.tsx · OptionToggle.tsx
    screens/MainMenu.tsx · CharacterCreation.tsx · CareerStartPlaceholder.tsx
    styles/theme.css           # variables de color/tipografía del tema oscuro
  src/renderer/src/**/*.test.ts
```

## Pantalla 1 — Menú principal
- Título arriba centrado: **"Proyecto: Juego Futbol-Rol"**. Etiqueta `v0.1` en una esquina.
- Botones centrados verticalmente: **Nueva Partida** (activo) · **Cargar Partida** (deshabilitado) · **Ajustes** (deshabilitado) · **Records** (deshabilitado) · **Salir del juego** (activo).
- Deshabilitados: atenuados, tooltip "Próximamente", sin acción.
- Nueva Partida → pantalla de creación. Salir del juego → `window.api.quit()` → cierra la aplicación.
- Navegable con ratón y teclado (↑/↓ + Enter), saltando los deshabilitados.

## Pantalla 2 — Creación de personaje
- **Nombre**: input de texto, obligatorio, 2–24 caracteres, se recortan espacios.
- **Sexo**: dos botones con ♂ y ♀. ♂ seleccionado por defecto; ♀ deshabilitado ("Próximamente").
- **Posición**: único chip **DC — Delantero centro**, seleccionado y fijo.
- **Nacionalidad**: bandera grande + nombre, flechas ◀ ▶ (también teclas ←/→), circular. Por defecto **Argentina**. Orden: Argentina (`ar`), Brasil (`br`), España (`es`), Francia (`fr`), Inglaterra (`gb-eng`), Alemania (`de`), Italia (`it`), Japón (`jp`), Estados Unidos (`us`).
  - Nota: "Francia" venía repetida en la lista → quedan **9** nacionalidades.
- Botones inferiores: **Volver** (al menú, descarta el borrador) y **Comenzar carrera** (activo solo con nombre válido).
- Comenzar carrera → pantalla provisional con la ficha del jugador (nombre, ♂, DC, bandera) y el texto "Tu carrera empieza aquí — próximamente", con botón "Volver al menú". Es el punto de enganche para la v0.2.

## Estilo visual — "Moderno oscuro"
Fondo azul-negro tipo estadio nocturno con un degradado/foco de luz suave, acento verde césped (`#2ecc71`-ish) y dorado para lo destacado, tipografía condensada deportiva (p. ej. Oswald/Barlow Condensed para títulos, Inter para texto). Botones anchos con borde fino, hover con brillo verde, estado deshabilitado claramente apagado. Diseño responsive desde 1280x720 hasta 1920x1080.

## Pasos de implementación
1. `git init` + `.gitignore`; crear el proyecto con la plantilla electron-vite react-ts en la carpeta.
2. Instalar `zustand`, `flag-icons`, `@fontsource/*`, `vitest`, `@playwright/test`.
3. Configurar `main` (ventana, título, IPC quit) y `preload` (contextBridge).
4. Tema CSS, `i18n/es.ts`, datos (nacionalidades, posiciones), tipos y store.
5. Componentes y las tres pantallas.
6. Tests de lógica + test de humo con Playwright sobre la app Electron.
7. Scripts `npm run dev`, `npm run build`, `npm test`, `npm run test:e2e`, `npm run typecheck`.

## Verificación
- `npm run typecheck` y `npm test` en verde (rotación ◀/▶ circular desde Argentina, validación del nombre).
- `npm run dev`: abre la ventana de Electron; comprobar Nueva Partida → creación → Comenzar carrera → ficha → Volver; botones deshabilitados no responden; **Salir del juego cierra la app**.
- `npm run test:e2e`: Playwright lanza la app Electron, recorre el flujo completo, recorre las 9 banderas, guarda capturas a 1280x720 y 1920x1080 (las reviso para el estilo) y comprueba que Salir del juego cierra la app.
- `npm run build` sin errores.

---

## Ideas para el juego (roadmap y diseño)

### Bucle principal
Temporada → semanas con eventos (entrenos, vestuario, prensa, vida personal) → partidos narrados como 3–5 **momentos clave** con decisiones → fin de temporada: premios, palmarés, mercado de fichajes → siguiente temporada. Retirada y legado.

### Sala de trofeos / Palmarés (prioritaria)
- Sección propia en cada partida, accesible siempre desde el menú de carrera.
- **Vista por temporadas** (línea de tiempo): cada temporada muestra club, edad, estadísticas (PJ, goles, asistencias, nota media) y dos columnas: **títulos colectivos** (liga, copa, supercopa, continental, mundial de clubes, selección) e **individuales** (máximo goleador, mejor jugador de la liga, balón dorado, mejor joven, equipo del año, gol del año, MVP de final).
- **Vista vitrina**: totales por tipo de trofeo con iconos; clic en un trofeo → en qué temporadas se ganó.
- Modelo de datos previsto: `Season { year, club, stats, trophies: Trophy[] }`, `Trophy { id, name, kind: 'colectivo'|'individual', competition, club|national }`.
- La pantalla **Records** (global, entre partidas) reutiliza estos datos: mejores carreras, más goles, más títulos.

### Mecánicas RPG
- **Orígenes** (como Dragon Age: Origins): barrio humilde, academia de élite, hijo de exfutbolista, descubierto tarde… Cambian atributos iniciales, contactos y eventos exclusivos.
- **Atributos** técnicos (definición, cabezazo, regate, desmarque), físicos (velocidad, potencia, resistencia) y mentales (compostura, liderazgo, ambición). Suben con entrenamiento y decisiones.
- **Rasgos/perks** al subir de nivel: "Cazagoles", "Hombre de vestuario", "Especialista en penaltis", "Jugador de grandes noches".
- **Tiradas de habilidad** visibles (estilo Baldur's Gate): en un penalti o mano a mano se muestra la probabilidad según atributos, presión y moral, y luego el resultado.
- **Ejes de personalidad** (estilo Mass Effect): *Profesional ↔ Estrella mediática*, *Leal ↔ Mercenario*, *Humilde ↔ Arrogante*. Desbloquean opciones de diálogo y cambian cómo te tratan.
- **Diálogos con tono** (diplomático / sincero / provocador / humor) en ruedas de prensa, con el entrenador, el agente o la directiva.

### Relaciones y "compañeros"
Entrenador, capitán, rival interno de puesto, agente, familia, afición, prensa. Cada uno con medidor de relación y **arcos personales** (el compañero veterano que te apadrina, el rival que acaba siendo amigo o enemigo).

### Consecuencias persistentes
Banderas de memoria: rechazar a un club hace que años después no quiera ficharte; celebrar un gol contra tu ex club enfada a esa afición para siempre; una mala noche de fiesta antes de una final se recuerda en la prensa. Eventos que hacen referencia a decisiones de temporadas anteriores.

### Carrera
- **Mercado de fichajes** tipo Copero (eliges destino) pero con negociación dialogada: sueldo, rol (titular/rotación), cláusulas, promesas del club que luego se cumplen o no.
- **Selección nacional** según la nacionalidad: convocatorias, torneos cada 4 años (mundial y continental de cada confederación).
- Lesiones, forma, moral, vida fuera del campo (descanso vs. vida social, patrocinadores, redes sociales).
- Final: retirada, ceremonia de despedida, Salón de la Fama, opción futura de seguir como entrenador.

### Modos y guardado
Autoguardado por temporada; **modo Ironman** (un solo guardado, decisiones irreversibles); Steam Cloud en v1.0.

### Contenido narrativo
Eventos definidos como datos (JSON con condiciones y efectos), o **Ink/inkjs** para escribir diálogos ramificados sin tocar código. Decidir en la v0.3.

### Importante para Steam: licencias
Sin licencias **no se pueden usar** nombres reales de clubes, jugadores, ligas, escudos ni trofeos (Balón de Oro, Champions…). Usar clubes y competiciones ficticios (p. ej. ciudades reales con nombres inventados) y premios propios ("Balón Dorado", "Bota de Plata"). Las banderas de países sí se pueden usar.

**Decisión del 2026-11-23 (v0.8):** los clubes usan nombres parecidos a los reales con una o dos letras cambiadas ("FC Barkelone", "Real Madrik") y las ligas nombres genéricos ("Primera División de España"). Jugadores, trofeos y escudos siguen siendo propios. Antes de publicar en Steam conviene revisar este criterio con alguien de temas legales.

### Roadmap tentativo
Estado a 2026-11-24: v0.1–v0.11 hechas (ver el registro de trabajo en README.md).

- ✅ **v0.1** — Menú principal + creación de personaje (este plan).
- ✅ **v0.2** — Orígenes y atributos iniciales, elección del primer club, guardado/carga local (JSON en la carpeta de usuario).
- ✅ **v0.3** — Simulación de una temporada con eventos y decisiones; Sala de trofeos.
- ✅ **v0.4** — Mercado de fichajes, eventos de consecuencia y pantalla de Relaciones.
- ✅ **v0.5** — Selección nacional, premios individuales completos y Records *(adelantado desde la v0.6)*.
- ✅ **v0.6** — Ajustes (pantalla completa, tamaño de ventana, animaciones, idioma). *(Volumen pendiente: aún no hay audio.)*
- ✅ **v0.7** — Peticiones tras la primera prueba: puntero propio, 4 orígenes por país y 10 especiales (menú Extras), modos de juego (Rápida, Normal, Completa, Personalizada) con fin de carrera, asistencias en la Sala de trofeos, 4 atributos nuevos, 10 decisiones y partidos importantes jugada a jugada en el modo Completa, competiciones (calendario, liga, copas, goleadores y asistentes) y contrato con dinero y tienda de mejoras.
- ✅ **v0.8** — Media con estadísticas y valor de mercado, partidos importantes (grandes, clásico, derbi, segundo de la tabla, desde cuartos de copa), resultado de la eliminación al pasar el cursor, tienda rotativa, sueldo mensual, manita en los botones, historia de pareja, puntos de atributo al acabar cada temporada y clubes con nombres parecidos a los reales en primera y segunda división con ascensos y descensos.
- ✅ **v0.9** — Resultados entre decisiones, moneda por país, origen de las consecuencias, título del partido importante dentro del recuadro, eventos que reaccionan al último partido (texto con el marcador real), eventos únicos ("La nómina de un grande", "Un país nuevo") y titularidad difícil para un joven en un club de 5 estrellas.
- ✅ **v0.10** — Balón parado (córners, faltas, penaltis) y lanzadores, escala de atributos por modo (20/30/50), compañeros y excompañeros con relación, capitanía, buscador de equipos, tienda de 15 mejoras centrada en atributos, panel de resultados con tus números, puesto en liga en el marcador, tres copas europeas y Copa Intercontinental, y reparto de puntos cuando quieras.
- ✅ **v0.11** — Convocatoria en los partidos importantes (titular, suplente, no convocado) y cambios, notas al estilo Sofascore, mercado según nacionalidad y edad, "Horas extra" según lo que necesita el equipo, 10 puntos libres en la Completa y motivos de no jugar.
- **v1.0** — Steamworks (logros, Cloud), traducción al inglés, empaquetado y página de Steam.
