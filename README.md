# Your Football Path

**Your Football Path** (hasta la v0.14 se llamaba "Proyecto: Juego Futbol-Rol"). Es una carrera de futbolista con decisiones de RPG, al estilo de Mass Effect, Dragon Age o Baldur's Gate. No se juega al fútbol: se eligen opciones y esas decisiones marcan toda la carrera.

- Plataforma: **solo escritorio, distribuido por Steam**. Windows primero. No habrá versión web.
- Plan completo e ideas de diseño: [PLAN.md](PLAN.md).
- **Versión actual: v0.18 (Early-Access)**:
  - **Inglés:** el juego entero se puede jugar en inglés. Se cambia en Ajustes, en cualquier momento, y no es una traducción: todos los textos están escritos de nuevo en inglés.
  - Pantalla de Créditos y "Early-Access v0.x" visible en todas las pantallas.
  - Como mucho 5 puntos de atributo por temporada y una tienda que sube de precio cada temporada.
- **v0.17**:
  - Historial de cada relación: qué decisiones subieron o bajaron la relación con el míster, la afición y tu pareja.
  - El míster y la afición empiezan de cero al fichar por otro club.
  - Pareja con relación de 0 a 100 (novios a 50, boda a 100, ruptura a 0) y exparejas.
  - Lesiones que te dejan sin jugar y bajan atributos.
  - Tienda con precios según los puntos que da cada compra.
  - Una jugada más contra tu exequipo, y el derbi de la traición si es de tu misma ciudad.
- **Lo que ya tiene el juego**:
  - Ficha completa de cada carrera desde Records.
  - Primera versión acotada: solo nacionalidades europeas, solo delantero centro (las otras cinco posiciones se ven bloqueadas) y solo el modo Completa.
  - "Pelea por el descenso" como partido importante cuando tu club está abajo.
  - El nombre: **Your Football Path**.
  - Hub rediseñado: bandera junto al nombre, sueldo junto al club, tarjetas a su medida y titularidad en la situación.
  - Pedir una mejora de contrato (una vez por temporada) y la tienda pasa a llamarse "Compras".
  - Relación con cada compañero al pasar el cursor por su nombre en las decisiones.
  - Pierna buena (derecha o izquierda) en el primer paso de la creación y nombre siempre en mayúsculas.
  - Modo Completa de 15 temporadas.
  - Resumen antes de firmar el primer contrato y tres ofertas de club al azar en cada partida.
  - Moral que empieza en 50 y sube o baja con los partidos, el míster y el vestuario.
  - De 3 a 5 jugadas en los partidos importantes según su relevancia, y contra quién juegas antes de empezar.
  - Convocatoria en los partidos importantes (titular, suplente o no convocado) y cambios durante el partido.
  - Notas de partido y de temporada parecidas a las de Sofascore; mercado de fichajes según tu nacionalidad y tu edad.
  - "Horas extra" con las mejoras que necesita tu equipo.
  - Atributos de balón parado (córners, faltas y penaltis) y lanzadores; escala de atributos según el modo (20, 30 o 50).
  - Compañeros y excompañeros con nombre y relación, capitanía y buscador de equipos para fichar al final de la temporada.
  - Tres copas europeas según el puesto en liga y Copa Intercontinental para América y Asia.
  - Resultados entre decisiones, título del partido importante bien visible y origen de cada consecuencia al hacer clic.
  - Eventos que reaccionan al último partido (con su marcador real) y eventos únicos.
  - Moneda del país en el que juegas; titularidad difícil para un joven en un club de 5 estrellas.
  - Clubes con nombres parecidos a los reales: primera y segunda división de los 9 países, con ascensos y descensos.
  - Media que tiene en cuenta atributos, estadísticas y carrera; valor de mercado.
  - Historia de pareja a lo largo de la carrera; puntos de atributo al acabar cada temporada.
  - Sueldo mensual y tienda que cambia cada temporada.
  - Menú (con Extras) y puntero propio (flecha y manita sobre los botones).
  - Creación del jugador en 6 pasos (jugador, modo de juego, origen, atributos, primer club y resumen).
  - 4 orígenes por país y 10 orígenes especiales.
  - Modo Completa, con fin de carrera (la Rápida, la Normal y la Personalizada, cerradas por ahora).
  - Temporadas con calendario, liga de 16 equipos, copa nacional y copa internacional.
  - Decisiones, tiradas de habilidad y partidos importantes jugada a jugada.
  - Contrato, dinero y tienda de mejoras.
  - Consecuencias que vuelven en temporadas posteriores.
  - Mercado de fichajes.
  - Selección nacional.
  - Sala de trofeos por temporadas (títulos colectivos e individuales).
  - Relaciones.
  - Records.
  - Ajustes.
  - Guardar y cargar partidas.

---

## Cómo abrir el juego

### Opción A — ejecutable (doble clic)

```
dist\win-unpacked\your-football-path.exe
```

También hay un acceso directo **Your Football Path** en el escritorio que apunta a ese `.exe`.

La carpeta `dist/` no se sube a git. Para regenerarla después de cambiar el código, ejecuta:

```bash
npm run build:unpack
```

### Opción B — modo desarrollo (recarga al guardar)

```bash
npm run dev
```

F12 abre las herramientas de desarrollador.

---

## Requisitos para desarrollar

- **Node.js 22** y **npm 10** (ya instalados en este equipo).
- Después de clonar el repositorio, ejecuta `npm install`. Descarga Electron, que ocupa unos 100 MB.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Abre el juego en modo desarrollo. |
| `npm start` | Abre la versión compilada (`out/`) sin empaquetar. |
| `npm test` | Ejecuta los tests unitarios (Vitest). |
| `npm run test:e2e` | Compila el juego, lo abre de verdad con Playwright, recorre las pantallas y guarda capturas en `e2e/screenshots/`. |
| `npm run typecheck` | Comprueba los tipos de TypeScript. |
| `npm run lint` | Revisa el código con ESLint y Prettier. |
| `npm run format` | Formatea el código con Prettier. |
| `npm run build:unpack` | Genera `dist/win-unpacked/your-football-path.exe`. |
| `npm run build:win` | Genera el instalador de Windows en `dist/`. |

---

## Tecnologías

| Pieza | Herramienta | Para qué |
|---|---|---|
| App de escritorio | Electron 44 | Ventana nativa y ejecutable para Steam. |
| Compilación | electron-vite 6 + Vite 8 | Compila main, preload y renderer, con recarga en caliente. |
| Interfaz | React 19 + TypeScript 5.9 | Pantallas y componentes. |
| Estado del juego | Zustand 5 | Pantalla actual, borrador del personaje y personaje creado. |
| Banderas | flag-icons 7 (SVG) | Windows no muestra los emojis de banderas. Las banderas van empaquetadas y funcionan sin conexión. |
| Tipografías | @fontsource/oswald y @fontsource/inter | Van empaquetadas, sin CDN. |
| Tests | Vitest 5 y Playwright 1.65 (modo Electron) | Tests de lógica y tests de la app real. |
| Empaquetado | electron-builder 26 | Genera el `.exe` y el instalador. |

---

## Registro de descargas e instalaciones

Todo se instaló dentro del proyecto (`node_modules/`). No se instaló nada global en el sistema.

| Fecha | Qué | Cómo | Notas |
|---|---|---|---|
| 2026-11-23 | Plantilla `@quick-start/create-electron@1.0.31` (react-ts) | `npm create @quick-start/electron@latest` | Se generó en una carpeta temporal y se copió al proyecto, sin su README. Se borraron los archivos de demostración. |
| 2026-11-23 | Dependencias de la plantilla: electron 44.11.5, electron-vite 6.0.0, vite 8.3.8, react / react-dom 19.3.1, typescript 5.9.3, electron-builder 26.18.0, eslint 9, prettier 3, @electron-toolkit/* | `npm install` | 552 paquetes. Incluye el binario de Electron. |
| 2026-11-23 | zustand 5.1.0, flag-icons 7.6.0, @fontsource/oswald 5.3.0, @fontsource/inter 5.3.0 | `npm install` | Dependencias del juego. |
| 2026-11-23 | vitest 5.1.1, @playwright/test 1.65.1 | `npm install -D` | Solo para tests. Playwright no descarga navegadores: usa el Electron del proyecto. |
| 2026-11-23 | Se quitó `@electron-toolkit/preload` | `npm uninstall` | El preload propio expone solo `window.api.quit()`. |
| 2026-11-23 | Runtime de Electron para empaquetar (zip de Electron 44.11.5) | Automático en `npm run build:unpack` | Lo descarga electron-builder la primera vez. |

`npm audit` avisa de 6 vulnerabilidades moderadas en dependencias de desarrollo de la plantilla. No afectan al juego empaquetado. Se revisarán más adelante, sin usar `--force`, para no romper versiones.

---

## Registro de trabajo

### v0.1 — Menú principal y creación de personaje (2026-11-23)

**Hecho**
- Proyecto Electron + React + TypeScript creado y configurado:
  - Ventana de 1280x720 (tamaño mínimo), sin barra de menú y con título "Proyecto: Juego Futbol-Rol".
  - Seguridad: `contextIsolation` activado y `nodeIntegration` desactivado.
  - El renderer solo puede llamar a `window.api.quit()`, que manda un mensaje IPC `app:quit` para cerrar la app.
- **Menú principal**:
  - Título "Proyecto: Juego Futbol-Rol".
  - Botones: Nueva Partida (activo), Cargar Partida, Ajustes y Records (deshabilitados, con la etiqueta "Próximamente"), Salir del juego (cierra la app).
  - Se puede navegar con ↑/↓ y Enter. Los botones deshabilitados se saltan.
  - Etiqueta de versión v0.1.
- **Creación de personaje**:
  - Nombre: obligatorio, de 2 a 24 caracteres. Se quitan los espacios sobrantes.
  - Sexo: ♂ seleccionado. ♀ deshabilitado, con la etiqueta "Próximamente".
  - Posición: DC (Delantero centro).
  - Nacionalidad: bandera con flechas ◀ ▶ (también con las teclas ←/→) que dan la vuelta en los extremos. Por defecto es Argentina.
  - Las 9 nacionalidades son Argentina, Brasil, España, Francia, Inglaterra, Alemania, Italia, Japón y Estados Unidos. "Francia" estaba repetida en la lista original.
  - Botones Volver (descarta lo escrito) y Comenzar carrera (solo se activa con un nombre válido).
- **Ficha provisional** del jugador después de crearlo, con el botón "Volver al menú".
- **Estilo "Moderno oscuro"**: fondo de estadio de noche con focos, césped en perspectiva y círculo central. Acentos en verde césped y dorado. Títulos en Oswald y textos en Inter. Probado a 1280x720 y 1920x1080.
- Los textos están en `src/renderer/src/i18n/`: `es.ts` y `en.ts` para la interfaz y `en/` para el contenido en inglés (escrito aparte, no traducido). Se cambia de idioma en Ajustes.

**Verificado**
- 17 tests unitarios: nacionalidades, validación del nombre y flujo del store.
- 6 tests e2e sobre la app real:
  - Título y estado de cada botón.
  - Valores por defecto y validación.
  - Las 9 banderas cargan.
  - Las flechas y las teclas cambian de nacionalidad.
  - La ficha se muestra y Volver funciona.
  - El teclado navega el menú.
  - **Salir del juego cierra la app.**
- `typecheck` y `lint` sin errores.
- El `.exe` empaquetado abre el menú principal.

### v0.2 — Origen, atributos, primer club, guardar y cargar (2026-11-23)

No hubo descargas nuevas: todo se construyó con las dependencias de la v0.1.

**Hecho**
- **Nueva partida en 4 pasos** (Jugador → Origen → Atributos → Club), con un indicador de pasos. "Atrás" vuelve al paso anterior sin perder lo elegido.
- **Orígenes** (al estilo Dragon Age: Origins). Cada uno tiene historia, ventaja, desventaja, modificadores de atributos y edad de debut:
  - *Potrero de barrio*: +3 Regate.
  - *Academia de élite*: +2 Definición, +2 Desmarque.
  - *Hijo de una leyenda*: +2 Liderazgo.
  - *Descubierto tarde*: +2 Potencia, +2 Velocidad. Debuta con 19 años.
- **Atributos** en escala 1–20: Definición, Cabezazo, Regate, Desmarque, Velocidad, Potencia, Compostura y Liderazgo.
  - Base de delantero centro + origen + **6 puntos libres** para repartir con los botones −/+.
  - Ningún atributo puede pasar de 15 al empezar.
  - La **media** (0–99) se calcula en vivo, con más peso para Definición, Desmarque y Compostura.
- **Primer contrato**: tres clubes **ficticios** del país del jugador (grande, ambicioso y modesto). Muestran prestigio, formación, minutos prometidos, sueldo y descripción.
  - Hay 27 clubes en total, 3 por nacionalidad, con escudo genérico en SVG y los colores del club.
  - El origen crea un vínculo con uno de ellos. Por ejemplo, con "Hijo de una leyenda", el club medio muestra "Tu padre es su ídolo".
  - Se guardan "flags" para consecuencias futuras: los clubes rechazados y el vínculo de origen.
- **Hub de carrera** (Temporada 1): ficha del jugador, atributos con barras de color, club y el aviso de lo que llega en la v0.3.
- **Guardado en disco**:
  - Se guarda automáticamente al firmar el contrato, con el botón "Guardar partida" y al pulsar "Guardar y salir al menú".
  - Cada partida es un JSON en `%APPDATA%\futbol-rol\saves\`.
  - La escritura es atómica: primero se escribe un archivo temporal y luego se renombra, para no dejar partidas a medias.
  - El archivo lleva versión y se valida al cargar. Una partida dañada o manipulada se rechaza.
- **Cargar Partida**:
  - En el menú se activa solo si hay partidas guardadas. Si no hay, muestra "Sin partidas".
  - La pantalla lista las partidas (bandera, nombre, club, temporada y fecha) con los botones Cargar y Borrar. Borrar pide confirmación.
- Los tests e2e usan su propia carpeta de datos (variable `FUTBOL_ROL_USER_DATA`), así que nunca tocan tus partidas reales.

**Verificado**
- 37 tests unitarios: atributos, orígenes, clubes, creación de carrera, guardado/carga, rechazo de partidas manipuladas y flujo completo del store.
- 10 tests e2e sobre la app real:
  - Los 4 pasos de la creación.
  - Atrás conserva los datos.
  - Los puntos y los límites de atributos funcionan.
  - Firmar con un club abre el hub y autoguarda.
  - **La partida sobrevive a cerrar y volver a abrir el juego.**
  - Cargar y borrar partidas.
  - Salir del juego cierra la app.
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado abre la v0.2.

### v0.3 — Temporadas con decisiones y Sala de trofeos (2026-11-23)

No hubo descargas nuevas.

**Hecho**
- **Temporadas jugables** desde el hub ("Jugar temporada N"). Cada temporada trae **4 decisiones** sacadas de un banco de 13 eventos:
  - Debut, fiesta, horas extra, rueda de prensa, penalti en el 90, patrocinador, rival interno, molestias, el gran partido, suplencia y ojeador extranjero.
  - Dos eventos exclusivos de origen: tu padre en televisión (*Hijo de una leyenda*) y la vuelta al potrero (*Potrero de barrio*).
  - Los eventos tienen condiciones: solo la primera temporada, desde la temporada 2, por origen o por tamaño de club.
- **Tiradas de habilidad** al estilo Baldur's Gate:
  - Algunas opciones muestran 🎲 *atributo · probabilidad*. La probabilidad es 50 % si el atributo es igual a la dificultad, y sube o baja 5 % por punto, entre el 5 % y el 95 %.
  - El resultado se muestra como **Éxito/Fallo**, con su texto y sus efectos.
- **Consecuencias**:
  - Cada decisión cambia atributos, **confianza del míster**, **moral**, **fama** y goles extra de la temporada.
  - También guarda "flags" para el futuro: fiestero, queja pública, vínculo con el capitán, relación con tu padre, interés extranjero, etc.
- **Sin repeticiones**: la decisión se guarda al momento y la tirada usa una semilla fija por partida, temporada y evento. Recargar la partida no cambia el resultado.
- **Simulación de fin de temporada**:
  - Los partidos dependen del tamaño del club, la confianza y tu media frente al nivel del club.
  - Los goles dependen de Definición, Desmarque, Compostura, moral y goles de los eventos. También se calculan asistencias, nota media y posición en liga.
  - Títulos colectivos posibles: Liga Nacional, Copa Nacional y Copa de Campeones (solo clubes grandes).
  - Premios individuales: Bota de Plata, Jugador de la Temporada, Equipo Ideal, Mejor Jugador Joven y Balón Dorado. Todos los nombres son propios del juego, sin licencias.
  - Progresión de atributos según edad, minutos y cantera del club. Desde los 30 años, la velocidad y la potencia bajan.
- **Resumen de temporada**: estadísticas, posición, progresión de atributos y títulos ganados (con animación).
- **Sala de trofeos** (la parte prioritaria del diseño):
  - Totales de títulos colectivos, títulos individuales, goles y partidos.
  - **Por temporadas**: una fila por temporada con año, club, posición, edad, PJ, G, A, nota, **títulos colectivos** e **individuales** por separado.
  - **Vitrina**: cada trofeo con cuántas veces se ganó y en qué temporadas. Los no conseguidos aparecen bloqueados.
- **Hub** renovado:
  - Medidores de confianza, moral y fama.
  - Resumen de la última temporada.
  - Botones "Jugar/Continuar temporada" y "Sala de trofeos".
- **Guardado v2**: las partidas de la v0.2 (formato v1) se **migran solas** al cargarlas.

**Verificado**
- 52 tests unitarios. Además de los anteriores, cubren:
  - Aleatoriedad reproducible.
  - Condiciones de los eventos.
  - Probabilidades y límites.
  - Simulación coherente.
  - Una carrera de 10 temporadas gana títulos.
  - Declive físico con la edad.
  - Migración v1 → v2.
  - Temporada completa en el store.
- 12 tests e2e sobre la app real. Incluyen una temporada completa de 4 decisiones, el resumen, la Sala de trofeos en sus dos vistas y la vuelta al hub en la temporada 2.
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado abre la v0.3.

### v0.4 — Mercado de fichajes y consecuencias (2026-11-23)

No hubo descargas nuevas.

**Hecho**
- **Mercado de verano** antes de cada temporada, a partir de la 2.ª. Se abre desde "Continuar" en el resumen o desde el botón principal del hub.
  - De 1 a 3 ofertas de clubes de cualquier país. Las que son de fuera llevan la etiqueta "Aventura en el extranjero".
  - El número y la calidad de las ofertas dependen de tu **fama** y tu **nota**. Los grandes solo llaman con fama ≥ 55 o nota ≥ 7,4.
  - Cada oferta muestra prestigio, minutos esperados (según tu media frente al nivel del club) y sueldo.
  - Siempre puedes **quedarte**, y el club valora el compromiso: +4 de confianza.
  - **Fichar** reinicia la confianza del entrenador, porque hay que ganársela otra vez. Si antes prometiste "aquí soy feliz", pierdes fama y se guarda el flag `brokenPromise`.
  - Las ofertas son deterministas por partida y temporada: recargar no cambia el mercado.
- **Las decisiones vuelven**: los clubes que rechazaste en tu primer contrato **no vuelven a llamarte**. El mercado lo indica con un aviso.
- **6 eventos de consecuencia** que solo aparecen si antes tomaste cierta decisión:
  - Las fotos de aquella fiesta.
  - El capitán que te cede el penalti que te prometió.
  - El míster que no olvida tu queja pública.
  - El rival interno que mueve ficha.
  - Tu padre en la grada, tras haberlo hablado con él.
  - La afición que se entera del ojeador extranjero.

  Funcionan así:
  - Tienen prioridad, con un máximo de 2 por temporada.
  - Cada uno ocurre una sola vez por carrera.
  - En pantalla muestran la etiqueta "Consecuencia de una decisión anterior".

### v0.5 — Selección nacional y Records (2026-11-23)

No hubo descargas nuevas.

**Hecho**
- **Selección nacional**:
  - Convocatoria desde los 18 años si tu nota es ≥ 7,0 o tu fama ≥ 50. Cuenta partidos y goles internacionales por temporada.
  - **Torneos de verano**: *Copa Mundial de Naciones* (2030, 2034…) y *Copa de Naciones* continental (2028, 2032…).
  - La probabilidad de llegar lejos depende del nivel de tu país y de tu nota. Rondas: de fase de grupos a campeón.
  - Ganar el torneo suma el trofeo a tu palmarés. Con 5 goles o más en el torneo ganas la *Bota de Oro de Selecciones*. Ganar el Mundial con una gran temporada abre la puerta al *Balón Dorado*.
  - Se ve en el resumen de temporada, en la columna "Sel. PJ/G" de la Sala de trofeos y en "Internacional" del hub.
- **Records** (botón del menú principal, activo si hay partidas guardadas):
  - Compara todas tus carreras guardadas, ordenadas por títulos totales y luego por goles.
  - Muestra temporadas, PJ, goles, asistencias, internacionalidades, títulos colectivos e individuales, y la mejor temporada.
  - Se calcula a partir de las partidas guardadas: si borras una partida, desaparece de Records.
- La vitrina de la Sala de trofeos queda en 11 trofeos: 5 colectivos (3 de club y 2 de selección) y 6 individuales.

**Verificado (estado actual)**
- **69 tests unitarios**, incluidos:
  - Mercado de fichajes: puertas cerradas por decisiones pasadas, promesa rota y determinismo.
  - Eventos de consecuencia.
  - Torneos de selecciones.
  - Records.
- **14 tests e2e** sobre la app real: el flujo completo de nueva partida, temporada, resumen, Sala de trofeos, mercado, guardado y reinicio, Records, borrar y salir.
- `typecheck` y `lint` sin errores.
- **El `.exe` empaquetado** (`dist\win-unpacked\futbol-rol.exe`) se probó jugando una temporada completa: crear jugador, firmar, 4 decisiones y resumen. La partida queda guardada en disco.

### v0.6 — Ajustes (2026-11-23)

No hubo descargas nuevas.

**Hecho**
- **Ajustes** en el menú principal. Ya están activos todos los botones del menú.
  - **Pantalla completa**: se aplica al momento y se recuerda al volver a abrir el juego.
  - **Tamaño de ventana**: 1280×720, 1600×900 o 1920×1080. Nunca supera el área útil de tu pantalla.
  - **Animaciones**: se pueden apagar para tener una interfaz sin movimiento.
  - **Idioma**: Español. *English* aparece bloqueado hasta que exista la traducción.
  - **Audio**: aparece como "Próximamente", porque el juego aún no tiene sonido.
- Los ajustes se guardan en `%APPDATA%\futbol-rol\settings.json`. Se validan al leerlos: un archivo dañado o editado a mano vuelve a los valores por defecto.

**Verificado**
- **73 tests unitarios** y **15 tests e2e**, todos en verde. El e2e cubre:
  - El cambio real del tamaño de la ventana.
  - Activar y desactivar animaciones.
  - El guardado en disco.
  - La navegación con teclado del menú con Ajustes activo.
- En el `.exe` empaquetado se comprobó que la pantalla completa se activa, que **sigue activa al reiniciar el juego** y que se desactiva volviendo a 1280×720.

### Relaciones (completa la v0.4) (2026-11-23)

No hubo descargas nuevas.

**Hecho**
- Pantalla **Relaciones**, a la que se entra desde el botón del hub. Muestra cómo te ven:
  - **el míster**;
  - **el capitán**;
  - **tu rival de puesto**, solo si llegasteis a pelearos;
  - **tu padre**, solo con el origen *Hijo de una leyenda*;
  - **la afición**.
- Cada relación tiene un nivel (Aliado, Buena, Neutral, Tensa o Enemistad), con color y una frase que recuerda la decisión que la provocó. Por ejemplo: "Le dejaste tirar aquel penalti y desde entonces te protege en el vestuario".
- Se calcula a partir de la confianza, la fama y los flags de tus decisiones, así que no cambia el formato del guardado.

**Verificado**
- **77 tests unitarios** y **15 tests e2e** en verde.
- `typecheck` y `lint` sin errores.
- En el `.exe` final (v0.6) se probó este recorrido:
  1. Crear un jugador.
  2. Jugar una temporada.
  3. **Fichar por otro club** en el mercado.
  4. Abrir Relaciones.

### Ejecutable y acceso directo en el escritorio (2026-11-23)

No se instaló nada nuevo. electron-builder volvió a preparar el mismo Electron 44.11.5 de antes.

**Hecho**
- Se regeneró `dist\win-unpacked\futbol-rol.exe` con `npm run build:unpack`, a partir del código actual (v0.6).
- Se creó el acceso directo `C:\Users\USER\Desktop\Futbol-Rol.lnk`, que apunta a ese `.exe`. Como volver a compilar recrea el `.exe` en la misma ruta, el acceso directo sigue funcionando.

**Verificado**
- El `.exe` abre el menú principal con el título "Proyecto: Juego Futbol-Rol" (probado con Playwright y una carpeta de datos aparte).
- Al abrir el acceso directo aparece la ventana del juego.

### v0.7 — Ocho peticiones nuevas tras probar el juego (2026-11-23)

No se descargó ni instaló nada. Para escribir los textos (orígenes, clubes y eventos) trabajaron tres agentes en paralelo, cada uno en su propio archivo de datos.

**Hecho**
1. **Puntero propio.** Te enseñé 6 diseños y elegiste "Flecha césped".
   - Se usa en todo el juego: verde normal, verde claro sobre botones y gris en botones desactivados.
   - Archivos: `src/renderer/src/assets/cursors/cesped*.svg`.
2. **Orígenes por nacionalidad.** Cada país tiene 4 orígenes (calle, cantera, hijo de una leyenda y llegada tardía), con historias y atributos propios. Hay además 10 orígenes especiales que valen para cualquier país.
   - Al crear la partida ves los 4 de tu país y 1 especial al azar.
   - Nuevo botón **Extras** en el menú. Dentro, **Orígenes** muestra todos, por país y los especiales.
3. **Modos de juego** (paso 2 de la nueva partida):
   - **Rápida:** 15 temporadas, decisiones cada dos temporadas.
   - **Normal:** 20 temporadas, decisiones cada dos temporadas.
   - **Completa:** 20 temporadas, decisiones todas las temporadas.
   - **Personalizada:** de 5 a 25 temporadas; decides cada temporada, cada dos o cada tres.
   - Las temporadas sin decisiones se simulan de golpe ("Simular temporada").
   - El mercado de fichajes solo abre antes de las temporadas con decisiones.
   - Al jugar la última temporada, la carrera termina y el hub lo indica.
4. **Asistencias** en la Sala de trofeos: total arriba y por temporada. Hay un premio nuevo, "Rey de las Asistencias".
5. **4 atributos nuevos:** Pase corto, Pase largo, Resistencia y Físico (12 en total).
   - Ahora hay 8 puntos libres al crear el jugador (antes 6).
   - Resistencia: aguantas más minutos. Físico: te lesionas menos y frena el declive de los veteranos. Los pases dan asistencias.
6. **Más decisiones.**
   - Rápida y Normal: 4 por temporada con decisiones.
   - Completa (y Personalizada si decides cada temporada): 10 por temporada.
   - En esos mismos modos, los **partidos importantes** se juegan jugada a jugada: los dos contra tu rival directo de liga, y las semifinales y finales de las copas.
   - Cada partido tiene 3 o 4 jugadas (4 en las finales). Tras cada decisión ves el marcador actualizado y lo que va pasando.
   - Contenido nuevo: 38 eventos (de juvenil, de veterano, por tipo de origen y 6 de consecuencia) y 20 jugadas de partido.
   - Los eventos que menos han salido tienen prioridad, para no repetir siempre los mismos.
7. **Competiciones** (botón en el hub):
   - Calendario de tu club con fechas, resultados, tus goles, asistencias y nota.
   - Liga de 16 equipos por país (117 clubes nuevos).
   - Cuadro de la copa nacional.
   - Copa internacional: 16 clubes de todos los países, en grupos y eliminatorias.
   - Tablas de goleadores y asistentes.
   - Puedes ver las temporadas anteriores.
   - Los títulos y premios salen de estas tablas: la liga si quedas 1º y la Bota de Plata si eres el máximo goleador.
8. **Contrato y dinero** (botón en el hub):
   - **Contrato:** sueldo, primas por gol y por título, cláusula, temporadas restantes e ingresos de cada temporada.
   - **Mejoras:** 18 compras, por ejemplo la casa para tus padres (+2 Compostura), la caminadora (+1 Resistencia) o el fisioterapeuta (+1 Físico, una vez por temporada).
   - **Gastos:** lista de lo comprado, lo que costó y lo que te dio.
   - El dinero llega del sueldo, las primas y algunos eventos.
   - Las ofertas del mercado traen años de contrato. Si te quedas con el contrato terminado, renuevas con subida.

- **Guardado v3:** las partidas de antes se convierten solas.
  - Pasan al modo Completa y conservan sus atributos; los nuevos empiezan con el valor base.
  - Su origen pasa al equivalente de su país.
  - Reciben el dinero que habrían cobrado y un contrato con su club.

**Verificado**
- **113 tests unitarios** en verde. Hay tests nuevos de calendario, ligas, copas, goleadores, partidos importantes, contrato, tienda y migración de partidas v2.
- **20 tests e2e** en la app real. Recorren Extras, el modo personalizado, el origen especial y una temporada completa con partidos importantes. También cubren competiciones, la compra de una mejora y la lista de gastos, el mercado, guardar y cargar.
- `typecheck` y `lint` sin errores.
- Revisé las capturas a 1280×720. La pantalla de orígenes y los botones del hub se desbordaban y quedaron corregidos.
- El `.exe` regenerado abre la v0.7. Lo probé con una carpeta de datos aparte: puntero, Extras, modos y 4 + 1 orígenes.
- No había ninguna partida guardada en tu PC, así que la migración solo está probada con los tests.

### v0.8 — Diez mejoras y correcciones (2026-11-23)

No se descargó ni instaló nada. Cuatro agentes trabajaron en paralelo, cada uno en sus propios archivos de datos: tres con los clubes y uno con la historia de pareja y la tienda.

**Hecho**
1. **Media corregida** (`logic/rating.ts`).
   - Antes solo contaban los atributos. Ahora, cuando ya hay carrera, la media mezcla atributos (55 %) y rendimiento (45 %).
   - El rendimiento sale de la nota, los goles y las asistencias por partido de las dos últimas temporadas, la fama y los títulos.
   - Un goleador de 0,67 goles por partido en un grande pasa de unos 67 a unos 80.
2. **Partidos importantes** (jugada a jugada en los modos que deciden cada temporada):
   - Copas nacional e internacional: cuartos, semifinales y final.
   - Liga: contra los 3 clubes más grandes del país, contra el otro equipo de los dos primeros puestos, el clásico y el derbi de la misma ciudad.
3. **Resumen de temporada:** al pasar el cursor por la ronda de la copa (o de la internacional) se ve el último partido, por ejemplo "Dieciseisavos de final: Valensia CF 0-2 RCD Espanyel". También avisa de ascensos y descensos.
4. **Tienda rotativa.**
   - Hay 50 mejoras en el catálogo (antes 18). Cada temporada la tienda muestra 10 distintas, y las de lujo aparecen más adelante.
   - Lo que compras se sustituye la temporada siguiente, y lo que compras para siempre ya no vuelve a salir.
5. **Sueldo mensual:** se cobra cada mes durante la temporada (de agosto a mayo). El resto, hasta 12 mensualidades, y las primas se cobran al acabar. Así se puede comprar a mitad de temporada.
6. **Manita:** el puntero cambia a una mano verde sobre cualquier botón.
7. **Historia de pareja** (16 capítulos):
   - Conocer a alguien, salir, irse a vivir juntos, pedida, boda, hijos y aniversarios.
   - También crisis, infidelidad (que se puede descubrir) y ruptura, con la posibilidad de rehacer la vida.
   - Sale como mucho un capítulo por temporada y, si hubo infidelidad, que se entere va primero.
   - La ficha muestra la **Familia** (por ejemplo, "Casado con Lucía · 2 hijos") y Relaciones muestra a tu pareja.
8. **Valor de mercado** en la ficha del jugador. Depende de la media, la edad, la fama y los años de contrato.
9. **Puntos de fin de temporada:** de 0 a 5, según partidos, goles, asistencias, nota, títulos y cuántas tiradas te salieron bien. Se reparten en una pantalla nueva antes de seguir. La progresión natural de atributos bajó para compensar.
10. **Clubes y ligas parecidos a los reales:**
    - 352 clubes cuyo nombre cambia 1 o 2 letras respecto al real ("Real Madrik", "FC Barkelone", "Manchester Unitet", "Boka Juniors"…).
    - Primera y segunda división de los 9 países, con 18 o 20 equipos cada una y nombres como "Primera División de Inglaterra".
    - Cada temporada suben 3 equipos y bajan 3. La copa tiene 32 equipos (5 rondas) y los rivales clásicos están marcados.
    - El primer contrato lo ofrecen un grande, un club medio de primera y uno de segunda.

- **Guardado v4:**
  - Las partidas anteriores pasan a los clubes nuevos (mismo país y nivel parecido).
  - Empiezan con las divisiones iniciales.
  - Se quitan las tablas antiguas de temporadas pasadas (eran de las ligas inventadas).

**Verificado**
- **129 tests unitarios** en verde. Hay tests nuevos de media, valor de mercado, puntos, historia de pareja, ascensos y descensos, copa de 32, importancia de partidos, sueldo mensual, tienda rotativa y migración v3→v4.
- **21 tests e2e** en la app real: clubes nuevos, valor de mercado, familia, resultado de la copa al pasar el cursor, compra en la tienda rotativa, cobro mensual y reparto de puntos.
- `typecheck` y `lint` sin errores. Revisé las capturas a 1280×720: el resumen de temporada se desbordaba y quedó corregido.
- El `.exe` regenerado abre la v0.8 (probado con una carpeta de datos aparte).

### v0.9 — Ocho mejoras de control y claridad (2026-11-23)

No se descargó ni instaló nada.

**Hecho**
1. **Resultados en la pantalla de decisiones.** Un panel a la derecha muestra tu puesto en la liga y los partidos jugados desde tu última decisión: competición, jornada, rival, resultado y tus goles o asistencias. Así no hace falta volver al hub.
2. **Moneda según el país** (`data/currencies.ts`).
   - El dinero se ve en la moneda del país donde juegas: euros, libras, dólares, pesos argentinos, reales o yenes, con un cambio fijo.
   - Al fichar por un club de otro país, el mensaje avisa del cambio: "Tu dinero se cambia a libras: £ …".
   - También salen en la moneda local los sueldos de las ofertas, la tienda, el contrato, el valor de mercado y las cantidades de los textos de los eventos.
3. **De dónde viene una consecuencia.** La etiqueta "Consecuencia de una decisión anterior" se puede pulsar y muestra la decisión que la provocó, por ejemplo "Tu decisión en la temporada 2: «Un ojeador extranjero» → «…»". Desde ahora el juego apunta qué decisión deja cada recuerdo.
4. **Partido importante:** el título (por ejemplo "Partido importante · Internacional · Semifinales") va arriba del recuadro de decisiones, en grande. Lleva el motivo cuando es de liga: Clásico, Derbi, Contra un grande o Duelo en la parte alta.
5. **Eventos según el último partido.**
   - "Después de la goleada" solo sale justo tras perder por tres goles o más.
   - "Al banquillo" solo sale tras tres partidos seguidos sin marcar.
   - "¿Hasta cuándo?" solo sale tras un partido que no se ganó.
   - Hay dos eventos nuevos de este tipo: tras una goleada a favor y tras un hat-trick.
   - Estos eventos se deciden al llegar a ellos, no al empezar la temporada. Si un evento ya no encaja con lo que acaba de pasar, se cambia por otro.
6. **Titular en un club de 5 estrellas:** con menos de 22 años, en la primera temporada juegas como mucho el 40 % de los partidos. No pasa si llegas avalado (gran temporada anterior, dos premios individuales o mucha fama). Las ofertas de esos clubes lo indican con "Pocos" minutos.
7. **Eventos de una sola vez.**
   - "Tu primera nómina" y otros 15 eventos de "primera vez" (novatada, brazalete, último contrato…) solo salen una vez por carrera.
   - Al fichar por primera vez por un club de 5 estrellas sale un evento nuevo, "La nómina de un grande", con título, texto y opciones propios.
   - Al llegar a otro país sale "Un país nuevo".
8. **Texto dinámico:** los eventos pueden usar el marcador real del último partido ("Habéis perdido por 7-2 contra …"), el rival y tus goles.

- **Además:** el calendario de las temporadas nuevas alterna mejor casa y fuera. Antes un equipo podía encadenar muchos partidos seguidos fuera. Las temporadas a medias mantienen su calendario.

**Verificado**
- **141 tests unitarios** en verde. Hay tests nuevos de eventos según el último partido, texto con el marcador real, eventos únicos, nómina de un grande, origen de las consecuencias, titularidad en un grande, monedas y calendario equilibrado.
- **21 tests e2e** en la app real. Ahora comprueban también el panel de resultados en la pantalla de decisiones y el título dentro del partido importante.
- `typecheck` y `lint` sin errores. Revisé las capturas a 1280×720.
- El `.exe` regenerado abre la v0.9.

### v0.10 — Trece mejoras: balón parado, vestuario, capitanía, buscador y copas europeas (2026-11-24)

No se instaló nada nuevo. Al empaquetar, electron-builder volvió a bajar a su caché local el zip de Electron 44 (el mismo que ya usaba el juego).

**Hecho**
1. **Atributos nuevos:** Tiros de esquina, Faltas y Penaltis (grupo "Balón parado"). Ya son 15 atributos y cuentan un poco en la media.
2. **Escala de atributos por modo** (`attributeScale` en `data/gameModes.ts`).
   - Rápida de 1 a 20, Normal de 1 a 30 y Completa de 1 a 50. La Personalizada usa 50 si decides cada temporada.
   - Todo se escala: puntos libres al crear (8 / 12 / 20), tope al crear (15 / 22 / 37), modificadores de los orígenes, mejoras de la tienda, efectos de los eventos y progresión de cada temporada.
   - Los puntos de fin de temporada también se escalan: hasta 5 en la Rápida, 8 en la Normal y 13 en la Completa.
   - Las fórmulas (tiradas, media, partidos) siguen trabajando sobre la escala de 20 (`logic/playerAttributes.ts`), así que el juego está igual de equilibrado en los tres modos.
3. **Compañeros y excompañeros** (`logic/teammates.ts`, `data/teamEvents.ts`).
   - Cada club tiene 5 compañeros con nombre y papel (capitán, rival de puesto, veterano, tu amigo y un joven de la cantera), con una relación de 0 a 100.
   - Al fichar, tus compañeros pasan a ser excompañeros (se recuerdan hasta 12) y conoces a los del club nuevo.
   - 17 decisiones nuevas sobre el vestuario: tregua con el rival de puesto, lesión del rival, consejos del capitán, fiesta de tu amigo, apadrinar al joven, el último año del veterano, vestuario dividido, la venta de tu amigo, la oferta de capitanía y sus conflictos.
   - Excompañeros: una llamada pidiendo consejo, una crítica en una entrevista, su boda, un reencuentro en el campo, un negocio y su partido homenaje. El texto nombra al excompañero y el club donde coincidisteis.
   - Las decisiones antiguas también cuentan (el penalti cedido al capitán, la pelea con el rival…).
   - La pantalla de Relaciones tiene tres pestañas: tu entorno, el vestuario (con la capitanía) y los excompañeros.
4. **Tus números junto a los resultados:** en la pantalla de decisiones se ven partidos, goles, asistencias y nota de la temporada.
5. **El panel de resultados ya no se reinicia:** muestra todos los partidos de la temporada con scroll, baja solo hasta el último y resalta los nuevos desde tu última decisión.
6. **Partido importante de liga:** debajo del escudo de cada equipo sale su puesto y sus puntos antes del partido.
7. **Tienda con 15 mejoras, la mayoría de atributos:** al menos 11 mejoran atributos. Hay una categoría nueva, "Entrenamiento", con 18 sesiones (una por atributo y 3 de élite).
8. **Capitanía.**
   - Tras 3 temporadas seguidas en el mismo club, con liderazgo suficiente, la confianza del míster (55) y buena relación con el vestuario (55), te proponen ser capitán.
   - En una temporada con decisiones, eliges en la decisión "El brazalete"; si no hay decisiones, te nombran directamente.
   - El capitán juega algo más, gana fama y moral cada temporada y crece en liderazgo. La capitanía se pierde al fichar o si el míster o el vestuario te dan la espalda.
   - Los requisitos se ven en Relaciones → Vestuario.
9. **Lanzadores:** eres el lanzador de córners, faltas o penaltis con 30 o más en la Completa, 15 en la Normal y 10 en la Rápida.
   - El hub lo indica y la barra del atributo marca ese mínimo.
   - Como lanzador, marcas penaltis y faltas y das asistencias de córner en los partidos simulados.
   - En los partidos importantes, las jugadas de penalti, falta y córner solo salen si eres el lanzador (con tiradas de esos atributos).
10. **Buscador de equipos** (botón "Buscar equipo" en el hub).
    - Eliges país, división y club, y ves sus requisitos: tu media, tu fama, si pueden pagar tu cláusula y si les rechazaste.
    - "Fichar al final de la temporada" lo marca como objetivo. Al acabar la temporada, si cumples, te hace una oferta en el mercado (aunque ese verano no tocara mercado). Si no, el mercado explica por qué no.
11. **Copas internacionales.**
    - Europa: los 4 primeros de cada liga van a la Copa de Campeones (20 equipos), el 5º y el 6º a la Copa de Europa (10) y el 7º a la Copa Conferencia (5). Son grupos de 5 a una vuelta y eliminatorias con los 2 primeros de cada grupo.
    - Argentina, Brasil, Estados Unidos y Japón juegan la Copa Intercontinental (16 equipos).
    - Hay tres trofeos nuevos. Las temporadas que ya estaban a medias terminan con su copa antigua.
12. **Corrección: "Reacción antes del descanso"** salía con 0-0. El marcador se miraba en otro minuto distinto al de la jugada; ahora se mira en el minuto real. Además hay 5 jugadas nuevas del segundo tiempo, para que siempre haya alguna que encaje con el marcador.
13. **Puntos de atributo cuando quieras.**
    - Pulsar la sección de atributos del hub abre la pantalla de puntos si te quedan.
    - Al acabar la temporada hay dos botones: "Repartir puntos" y "Continuar sin repartir".
    - Puedes repartir solo una parte. Los puntos que no uses se guardan para más adelante.

- **Además:**
  - El formato de guardado pasa a la v5. Las partidas antiguas se convierten solas: los atributos se escalan al modo, se añaden los de balón parado, aparecen tus compañeros (y excompañeros de tus clubes anteriores) y se reparten las plazas europeas.
  - El hub, el reparto de atributos y Relaciones caben en 1280×720 con 15 atributos y avisos.

**Verificado**
- **160 tests unitarios** en verde. Hay tests nuevos de escala por modo, lanzadores, compañeros, capitanía, buscador, copas europeas, migración v4 → v5 y jugadas que encajan con el marcador.
- **22 tests e2e** en la app real. Comprueban también el buscador de equipos, las pestañas de Relaciones, los atributos clicables del hub y repartir los puntos más tarde.
- `typecheck` y `lint` sin errores. Revisé las capturas a 1280×720.
- El `.exe` regenerado abre la v0.10.

### v0.11 — Nueve mejoras: convocatoria, notas realistas y mercado por nacionalidad (2026-11-24)

No se descargó ni instaló nada. Para calibrar las notas se consultó cómo puntúa Sofascore (todos parten de 6,5, rara vez se baja de 6 y los goles pesan mucho).

**Hecho**
1. **Puntos libres al crear el personaje:** en la Completa pasan de 20 a 10. La Rápida sigue con 8 y la Normal con 12.
2. **Por qué no jugaste:** en vez de "No jugó" sale "No convocado" o "Te quedaste en la banca" (o "Lesionado"). Los partidos anteriores a esta versión siguen diciendo "No jugó".
3. **"Horas extra" dinámico.**
   - Las tres opciones son los atributos que más necesita tu equipo: los más importantes para un delantero en los que estás más lejos de lo que pide el nivel de tu club.
   - Cada opción muestra lo que mejora (por ejemplo "+3 Definición").
   - Todas las decisiones muestran ahora los atributos que suben al elegir una opción.
4. **Resultados de la temporada:** el panel es más ancho y ya no tiene scroll horizontal, solo vertical.
5. **"Jugar partido":** si lo siguiente es un partido importante, el botón de después de una decisión (o del final de otro partido) dice "Jugar partido".
6. **"Un estadio en contra":** con menos de 25 años el texto ya no habla de "tus compañeros más jóvenes". Ahora dice que nunca habías jugado en un ambiente así.
7. **Convocatoria antes de cada partido importante.**
   - Antes de empezar ves si eres titular, suplente o no vas convocado (depende de tus minutos en el equipo).
   - El suplente sale al campo en la segunda parte y solo vive las jugadas desde que entra.
   - Un titular puede ser sustituido (más probable con poca resistencia o con 31 años o más) y no vive jugadas después del cambio.
   - Si no vas convocado, ves el resultado desde la grada.
   - El cronograma marca cuándo entras y cuándo te cambian.
8. **Notas más realistas** (al estilo de Sofascore).
   - Todos parten de 6,6. Un gol suma 1 punto, cada gol más 0,9 y el hat-trick tiene un extra. Cada asistencia suma 0,65. El nivel y el resultado mueven algo la nota.
   - Un suplente sin participar se queda cerca de 6,5.
   - Marcar suele dar entre 7,4 y 8, un hat-trick ronda el 9 y un goleador de 0,75 goles por partido promedia alrededor de 7,5.
   - En los partidos importantes, cada jugada bien resuelta suma 0,15 y cada una fallada resta 0,1.
   - Los goles de las decisiones también cuentan en la nota de la temporada.
   - Subí un poco los umbrales que dependen de la nota (premios, convocatoria con la selección, ofertas) para que no se regalen.
9. **Mercado de fichajes según nacionalidad y edad.**
   - Pesan mucho los clubes de tu país (y del país donde juegas).
   - Con 20 años o menos, otras ligas de tu continente solo llaman si hiciste una gran temporada (nota de 7,2 o más, o mucha fama).
   - Saltar a Europa desde otro continente exige destacar.
   - Un europeo no recibe ofertas de Argentina o Brasil salvo de veterano. Estados Unidos y Japón son destino sobre todo a partir de los 30.
   - Ejemplo: un inglés de 18 años recibe ofertas de clubes ingleses y, si destaca, de algún club europeo.

- **Además:** al vivir menos jugadas (suplente o no convocado), los goles "de fondo" del partido aumentan para que el marcador siga siendo realista. Si te sustituyen, las jugadas siguen en orden de minuto.

**Verificado**
- **170 tests unitarios** en verde. Hay tests nuevos de convocatoria, cambios, notas, "Horas extra", texto por edad, motivo de no jugar y mercado por nacionalidad.
- **22 tests e2e** en la app real. Pasan ahora por la convocatoria y el botón "Jugar partido".
- `typecheck` y `lint` sin errores. Revisé las capturas a 1280×720.
- El `.exe` regenerado abre la v0.11.

### v0.12 — Nueve mejoras: resumen antes de firmar, clubes al azar y moral viva (2026-11-24)

No se instaló nada. Al regenerar el `.exe`, electron-builder volvió a descargar Electron a su caché, porque no lo encontró allí.

**Hecho**
1. **Resumen antes de firmar.** Tras elegir club, una pantalla nueva ("Resumen", paso 6) enseña tu jugador, tus atributos y el contrato. El botón "Firmar contrato" está ahí; en la elección de club el botón pasa a ser "Continuar".
2. **Clubes al azar en el primer contrato.**
   - Cada partida ofrece un club de 5 estrellas, uno de 4 o 3 y uno de 3 o 2, elegidos al azar entre los de tu país.
   - En los países sin clubes de 5 estrellas (Argentina, Brasil, Japón y Estados Unidos) se cuenta desde su mejor nivel.
   - El texto de cada oferta dice si el club es de primera o de segunda. Las partidas guardadas no cambian.
3. **Moral desde 50 y con vida.**
   - La carrera empieza con 50 de moral.
   - Después de cada partido, la moral se acerca poco a poco a un objetivo. El objetivo depende de:
     - cómo te fueron los últimos cinco partidos (jugar, ganar, marcar, la nota, quedarte en la banca o fuera de la convocatoria);
     - la confianza del míster y la relación con el vestuario;
     - la capitanía y la familia.
   - Lesionarte baja 3 puntos. Las decisiones siguen sumando o restando moral; ese cambio dura un tiempo y luego la moral vuelve hacia su objetivo.
4. **"Tu primera nómina de verdad"** muestra en cada opción lo que cambia: dinero, moral, confianza del míster y fama.
5. **Próximo partido importante.**
   - Antes de un partido importante, la pantalla de decisiones enseña contra quién juegas, la competición, la ronda y el motivo (clásico, derbi, contra un grande…).
   - Lo mismo al final de un partido importante si el siguiente también lo es.
6. **"Tiros de esquina" pasa a llamarse "Corners".**
7. **Sin pistas de lanzador:** se quitó el texto "Con 30 o más eres el lanzador" y la línea que marcaba el mínimo en los atributos de balón parado. El hub solo dice que eres lanzador cuando ya lo eres.
8. **Titular o suplente en los resultados:** cada partido jugado dice si fuiste titular o saliste desde el banquillo, en el panel de resultados y en el calendario.
9. **De 3 a 5 jugadas en los partidos importantes.**
   - Como titular, el número de jugadas depende de la relevancia del partido:
     - 3 contra un grande o en cuartos;
     - 4 en un clásico, un derbi, una semifinal o la lucha por el título en el último tercio de la liga;
     - 5 en una final;
     - en las copas continentales, una más (hasta 5).
   - Si te sustituyen, vives al menos 3 jugadas antes del cambio. Desde el banquillo son 2.
   - Hay 6 jugadas nuevas (minutos 17, 22, 27, 72, 75 y 81) para tapar huecos.
   - Con más jugadas tuyas hay menos goles "de fondo", para que el marcador siga siendo realista.
   - Por qué salían solo 2: un joven en un club grande casi nunca es titular, y como suplente o sustituido se vivían 1 o 2 jugadas.

**Verificado**
- **186 tests unitarios** en verde (16 nuevos, en `v012.test.ts`):
  - ofertas al azar por estrellas en los 9 países;
  - moral, que empieza en 50 y se mueve con los partidos y las relaciones;
  - número de jugadas por relevancia y papel, jugadas en orden y en su minuto;
  - titular o suplente en los resultados, "Corners" y la nómina.
- **22 tests e2e** en la app real. Ahora pasan por el resumen antes de firmar (con clubes al azar), el rival del próximo partido importante y el papel de titular o suplente en los resultados.
- `typecheck` y `lint` sin errores. Revisé las capturas a 1280×720 y 1920×1080.
- El `.exe` regenerado abre la v0.12.

### v0.13 — Pierna buena, nombre en mayúsculas y modo Completa de 15 temporadas (2026-11-24)

**Descargas:** al regenerar el `.exe`, electron-builder volvió a descargar Electron (no lo tenía en caché). No se instaló nada nuevo.

**Hecho**
1. **Completa de 15 temporadas** (antes 20). Las partidas ya guardadas en la Completa conservan su duración.
2. **Rápida y Normal cerradas por ahora.**
   - Se ven en la elección de modo, atenuadas, con "Próximamente", y no se pueden elegir.
   - La nueva partida empieza en la Completa. La Personalizada sigue disponible.
   - Las partidas guardadas en la Rápida o la Normal se cargan y se juegan igual.
3. **Pierna buena en el primer paso.**
   - Se elige entre derecha (diestro) e izquierda (zurdo); por defecto, derecha.
   - Sale en el resumen antes de firmar y en la ficha del hub.
   - Por ahora no cambia las tiradas.
   - Las partidas guardadas (formato v5) pasan al formato v6 como diestras.
4. **Nombre siempre en mayúsculas.** Se escribe en mayúsculas en el campo, con tildes y eñes (p. ej. "IÑAKI NÚÑEZ"), y así se guarda. Las partidas ya guardadas conservan su nombre.

**Verificado**
- **194 tests unitarios** en verde. Hay 8 nuevos:
  - en `v013.test.ts`: Completa de 15 temporadas, modos disponibles, mayúsculas, pierna buena al guardar y cargar, migración v5 → v6 y una pierna inválida rechazada;
  - en `gameStore.test.ts`: la Rápida y la Normal no se pueden elegir, y el nombre en mayúsculas y la pierna buena al ir y volver de paso.
- **22 tests e2e** en la app real. Ahora comprueban:
  - la pierna buena por defecto y que se puede cambiar a izquierda;
  - el nombre en mayúsculas al escribirlo;
  - la Rápida y la Normal deshabilitadas y la Completa de 15 temporadas;
  - la pierna en el resumen y en el hub;
  - "Temporada 1 de 15".
- `typecheck` y `lint` sin errores.
- Revisé las capturas: el paso 1, con la pierna buena, cabe entero en 1280×720 (en pantallas bajas los campos se compactan), y los modos cerrados se ven atenuados.
- El `.exe` regenerado abre la v0.13.

### v0.14 — Trece mejoras: hub, mejora de contrato, compañeros y colores de las copas (2026-11-24)

**Descargas:** al regenerar el `.exe`, electron-builder vuelve a descargar Electron si no lo tiene en caché. No se instaló nada nuevo.

**Hecho**
1. **Barras del míster y la afición** en Relaciones, como las del vestuario.
   - La del míster es su confianza; un choque con él o una queja pública la limitan.
   - La de la afición sale de tu fama: la lealtad y las obras benéficas la suben, y una promesa rota o mirar a otro club la bajan.
2. **Hub rediseñado.**
   - La bandera va a la derecha del nombre.
   - Las tarjetas miden lo que su contenido y se centran, sin hueco vacío debajo. Si no caben, hacen scroll.
3. **Titularidad en la situación.** Indica si eres titular indiscutible, titular, rotación, suplente o reserva, con cinco niveles. Sale de los minutos que te da el míster (su confianza y tu nivel frente al de tu club).
4. **"Mejoras" pasa a llamarse "Compras"** en Contrato y dinero.
5. **"Alguien especial" con cinco escenarios.** El título es el mismo y la historia cambia:
   - el cumpleaños de un compañero;
   - tu amiga de la infancia;
   - una visita al hospital infantil;
   - la cafetería de cada mañana;
   - un vuelo con retraso.

   Sale primero el que menos veces ha salido.
6. **"Tu primera nómina de verdad":** lo que cuesta más dinero del que tienes sale bloqueado, con lo que te falta. Ahorrar ya no cuesta nada (el asesor cobra si tu dinero crece), así que siempre hay una opción posible.
7. **"Una última petición"** (dejarle un penalti al veterano que se retira) solo sale si eres el lanzador de penaltis.
8. **Colores de las copas europeas** en la tabla de liga: azul para la Copa de Campeones (1º–4º), dorado para la Copa de Europa (5º y 6º) y verde para la Copa Conferencia (7º). La leyenda lo explica con sus colores.
9. **Relación con los compañeros en las decisiones.**
   - Los compañeros nombrados en una decisión salen subrayados, en verde si os lleváis bien y en rojo si hay roces.
   - Al pasar el cursor se ve su papel y la relación (p. ej. "Veterano del vestuario · Relación 62 (Buena)").
   - También en el resultado de la decisión.
10. **Sueldo en el hub,** a la derecha de la tarjeta del club.
11. **Pestaña "Mejorar contrato"** en Contrato y dinero.
    - Hay tres peticiones: una subida moderada, lo que vales según tu rendimiento y una subida ambiciosa.
    - Cada una enseña el sueldo nuevo, la probabilidad de que acepten (mejor con más confianza del míster) y lo que pierdes si dicen que no (confianza y moral).
    - Si aceptan, firmas un contrato nuevo con ese sueldo y al menos 3 temporadas.
    - Se puede pedir una vez por temporada, y no la misma temporada en que firmaste. La respuesta usa una semilla fija: recargar la partida no la cambia.
12. **División de cada club** en las tarjetas del mercado de fichajes, también en la de quedarte.
13. **Resumen de la temporada con muchos títulos:** la lista de títulos hace scroll y ya no tapa los botones.

**Verificado**
- **209 tests unitarios** en verde (15 nuevos, en `v014.test.ts`):
  - barras del míster y la afición;
  - titularidad;
  - peticiones de mejora (probabilidades, una por temporada, aceptar o rechazar y semilla fija);
  - los escenarios de "Alguien especial";
  - el penalti solo si eres el lanzador;
  - las opciones bloqueadas por dinero;
  - la relación con los compañeros nombrados.
- **22 tests e2e** en la app real. Ahora comprueban:
  - la bandera a la derecha del nombre, el sueldo y la titularidad en el hub;
  - los colores y la leyenda de la tabla;
  - la pestaña "Compras" y pedir una mejora;
  - la división en el mercado;
  - las barras de Relaciones;
  - que con 12 títulos la lista hace scroll sin tapar los botones;
  - la relación con un compañero al pasar el cursor y las opciones bloqueadas, cuando salen en la temporada.
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado abre la v0.14.

### v0.15 — El juego se llama Your Football Path (2026-11-24)

**Descargas:** al regenerar el `.exe`, electron-builder volvió a descargar Electron (no lo tenía en caché). No se instaló nada nuevo.

**Hecho**
- **Nombre nuevo en todo el juego.**
  - En el menú principal, "Your" va pequeño y dorado encima de "Football Path".
  - Cambian el título de la ventana, el nombre de la app (`productName`), su identificador (`com.yourfootballpath.game`) y el ejecutable, que pasa a `dist\win-unpacked\your-football-path.exe`.
  - El acceso directo del escritorio pasa a llamarse "Your Football Path" y apunta al ejecutable nuevo; se quitó el antiguo `Futbol-Rol.lnk`.
- **Las partidas y los ajustes se conservan.**
  - Con el nombre nuevo, los datos van a `%APPDATA%\Your Football Path`.
  - La primera vez que se abre el juego, copia las partidas (`saves`) y los ajustes (`settings.json`) de la carpeta antigua `%APPDATA%\futbol-rol`. Solo lo hace si la carpeta nueva aún no tiene ninguno (`src/main/legacyData.ts`).
  - La carpeta antigua no se toca y queda como copia de seguridad.
- El paquete npm pasa a `your-football-path`. La carpeta del proyecto y el repositorio de GitHub siguen llamándose `futbol-rol`.

**Verificado**
- **213 tests unitarios** en verde. Hay 4 nuevos, en `legacyData.test.ts`:
  - copia partidas y ajustes, sin cachés, y deja intacta la carpeta antigua;
  - no pisa nada si ya hay datos nuevos;
  - no hace nada sin carpeta antigua, ni si la carpeta de datos ya es la antigua.
- **22 tests e2e** en la app real (el título de la ventana y del menú es "Your Football Path").
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado (`your-football-path.exe`) abre la v0.15. Al arrancar con los datos reales, copió la partida guardada y los ajustes a `%APPDATA%\Your Football Path`, y la partida aparece en "Cargar partida".

### v0.16 — Ficha de cada carrera en Records y primera versión acotada (2026-11-25)

**Descargas:** al regenerar el `.exe`, electron-builder volvió a descargar Electron (no lo tenía en caché). No se instaló nada nuevo.

**Hecho**
1. **Ficha completa de una carrera desde Records.** Al pulsar una fila se abre una pantalla nueva con cinco pestañas:
   - **Trayectoria:** cada temporada con su club, la división, la posición en la liga, el ascenso o descenso, la capitanía, la edad, partidos, goles, asistencias, nota, selección, hasta dónde llegó en la copa y en la copa internacional, y cuántos títulos ganó.
   - **Títulos:** la vitrina con cada título ganado y en qué temporadas.
   - **Atributos:** la media, la ficha (posición, pierna, edad, origen, valor de mercado y familia) y los 15 atributos.
   - **Relaciones:** el entorno (míster, familia y afición), el vestuario y los excompañeros, cada uno con su barra.
   - **Dinero y contratos:** el contrato actual (o el último), el dinero, el total ganado y gastado, los ingresos de cada temporada y todas las compras.

   Arriba se ven los totales: temporadas, partidos, goles, asistencias, partidos con la selección y títulos.
2. **Solo nacionalidades europeas.**
   - Argentina, Brasil, Japón y Estados Unidos se ven en gris y con "Próximamente" debajo de la bandera, pero las flechas solo pasan por España, Francia, Inglaterra, Alemania e Italia. La nacionalidad por defecto es España.
   - Sus ligas están bloqueadas en el buscador de equipos y sus orígenes en Extras.
   - Sus clubes ya no hacen ofertas en el mercado.
   - Siguen existiendo como rivales (selecciones en los torneos y clubes en sus copas), y las partidas antiguas con esas nacionalidades se siguen jugando, también con ofertas de su país.
3. **Cinco posiciones nuevas, bloqueadas:** portero, defensa central, lateral, mediocentro defensivo y mediapunta. Se ven en el paso 1 junto al delantero centro, en gris y con candado.
4. **Modo Personalizado cerrado.** Por ahora solo se juega la Completa.
5. **"Pelea por el descenso".**
   - Desde la 4ª jornada, si tu club está en primera y en los 6 últimos puestos (los 3 de descenso y los 3 de encima), son partidos importantes los de contra rivales cercanos: los que también están en esa zona o a 3 puestos o menos de ti.
   - En esa situación, los partidos contra los grandes dejan de ser importantes. El clásico, el derbi y las rondas finales de las copas lo siguen siendo.
   - Como el duelo en la parte alta, tiene 4 jugadas en el último tercio de la liga y 3 antes.
6. **Comprar no cambia la tienda.** Antes, cada compra volvía a sortear los artículos de la temporada y la tienda entera cambiaba. Ahora la selección es fija toda la temporada: solo cambia el botón de lo que compras ("Comprado") y el dinero.
7. **"El gran partido"** ("titular por sorpresa") solo sale si no eres titular habitual. No sale si eres el capitán, si el míster te da minutos de titular o si has sido titular en 3 de tus últimos 5 partidos.
8. **"El árbitro no ve nada" siendo capitán:** la opción pasa a ser "Calmar a tus compañeros y hablar solo tú", y el resultado se cuenta a juego.
   - De paso, dos eventos en los que "el capitán" te cede un penalti ("Penalti en el 90" y "El capitán cumple su palabra") ya no salen si el capitán eres tú.
   - En la jugada de penalti, "Cedérselo al capitán" pasa a ser "Cedérselo a un compañero" si lo eres.
9. **"En el centro del rondo"** solo sale si tienes 25 años o menos, o si acabas de llegar al club.

**Verificado**
- **226 tests unitarios** en verde (12 nuevos en `v016.test.ts`, y los de nacionalidades y del flujo de partida, puestos al día):
  - posiciones y modos disponibles;
  - mercado y buscador sin países bloqueados (y abiertos en partidas antiguas);
  - pelea por el descenso en una temporada entera del club más flojo de España;
  - tienda igual tras comprar;
  - "El gran partido", el rondo, los penaltis del capitán y la jugada del árbitro;
  - abrir y cerrar la ficha desde Records.
- **22 tests e2e** en la app real. Ahora comprueban:
  - las nacionalidades bloqueadas y el recorrido por las 5 europeas;
  - las posiciones bloqueadas;
  - los modos cerrados;
  - los países bloqueados en el buscador y en Extras;
  - que la tienda no cambia al comprar;
  - las cinco pestañas de la ficha de una carrera desde Records.
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado abre la v0.16, y la partida que ya tenías sigue apareciendo en "Cargar partida".

### v0.17 — Diez mejoras: historial de relaciones, pareja por puntos, lesiones y la traición (2026-11-26)

**Descargas:** al regenerar el `.exe`, electron-builder volvió a descargar Electron (no lo tenía en caché). No se instaló nada nuevo.

**Hecho**
1. **"Los sesenta de tu madre" sale a partir de los 25 años.** Con 17, 18 o 19 años no tenía sentido.
2. **Historial de cada relación.** En Relaciones, las tarjetas del míster, la afición y la pareja se pueden pulsar y llevan a una pantalla nueva:
   - Lista, de la primera a la última, cada cosa que subió o bajó la relación: la decisión o la jugada, la opción que elegiste, la temporada, el club, cuánto subió o bajó y cómo quedó.
   - Cuenta las decisiones de temporada, las jugadas de los partidos importantes, una mejora de contrato rechazada (así se ve lo que bajó el míster), quedarte en el mercado y, para la afición, el balance de cada temporada.
   - Arriba, el valor actual y cuántas veces subió y bajó.
   - Las partidas guardadas antes de la v0.17 no tienen ese historial: empieza a llenarse desde ahora.
3. **Fichar reinicia al míster y a la afición.**
   - El míster nuevo empieza con la confianza de siempre según el tipo de club.
   - La afición nueva te recibe según tu fama: de 40 sin fama a 65 con la máxima. Desde ahí sube y baja con tu fama y con lo que ve de ti en el club (escuchar a otro club la baja; la lealtad y las obras benéficas la suben).
   - Se olvidan las cuentas pendientes del club anterior: el choque con el míster, la queja pública y el interés de otro club que se filtró a la grada.
4. **Lesiones de verdad.** Algunas decisiones te lesionan (el esguince, "Dos meses fuera", la tendinitis, el pinchazo en el isquiotibial, la rodilla en la pista de cemento y "El tobillo pasa factura"):
   - Te pierdes los partidos de la baja, y las decisiones que caían en esas semanas no llegan a salir.
   - Según los partidos de baja, la lesión es leve (hasta 3), moderada (4 a 8) o grave (9 o más).
   - Baja de 1 a 10 puntos los atributos de la zona: tobillo (velocidad, regate, físico), muscular (velocidad, resistencia, fuerza), rodilla (velocidad, fuerza, físico) y espalda (fuerza, cabeza, físico). Leve: 1 atributo, de 1 a 3 puntos. Moderada: 1 o 2 atributos, de 2 a 6. Grave: 2 o 3 atributos, de 4 a 10.
   - Si la recuperación se hace bien (respetar los plazos, una rehabilitación que sale bien), no pierdes atributos.
   - El resultado de la decisión enseña la baja y los puntos perdidos.
5. **Tienda por puntos.**
   - Cada compra sube de 1 a 3 puntos cada atributo (los puntos que ves en la ficha).
   - Si mejora dos atributos, lo normal es 1 y 2 puntos. Las compras de lujo suben 3 puntos en 2 o en 3 atributos, como el campo de entrenamiento privado (600.000, +3 en remate, pase largo y regate).
   - El precio va según los puntos y no se solapa: 1 punto, de 5.000 a 25.000; 2 puntos, de 30.000 a 60.000; 3 puntos, de 70.000 a 150.000; 6 puntos, de 250.000 a 400.000; 9 puntos, de 600.000 a 900.000. Ya no hay un +3 de físico por 50.000 y otro por 20.000.
   - Las compras de la familia (casas, viajes) tienen su propio precio, pero sus puntos siguen las mismas reglas.
6. **Pareja por puntos.**
   - Cada opción de la historia de la pareja dice cuánto sube o baja la relación (si hay tirada, lo que pasa si sale bien y si sale mal).
   - Al conocer a alguien empezáis en 25. A 50 sois novios y a 100 os casáis; después vienen los hijos. Irse a vivir juntos y prometerse quedan como momentos de los novios.
   - Si la relación llega a 0, lo dejáis. La temporada siguiente aparece otra persona.
   - En Relaciones hay una pestaña de **Exparejas** (solo si las has tenido), con cuándo empezó y acabó cada relación, hasta dónde llegasteis y su historial.
7. **El derbi de la traición.** Si juegas contra un club de tu misma ciudad en el que estuviste (del AC Milen al Inter de Milam, por ejemplo), el partido tiene una jugada más al saltar al campo: "Judas", "La ley del ex" o "En el túnel".
8. **"La afición se entera"** solo sale si sigues en el mismo club. Al fichar por otro, se olvida.
9. **Capitanía con 40 de liderazgo.** Con 40 o más de liderazgo no hace falta esperar las 3 temporadas en el club (el resto de requisitos sigue igual).
10. **Contra tu exequipo.** Cualquier partido contra un club en el que jugaste se vive jugada a jugada y tiene una jugada más que hace alusión a él: "Vuelves a casa", "La ley del ex" o "Te conozco".

**Partidas guardadas.** El formato pasa a la versión 7. Al cargar una partida antigua:
- La pareja pasa a puntos según su etapa (novios 60, viviendo juntos 70, prometidos 85, casados 100) y una ruptura pasa a las exparejas.
- La afición conserva la barra que tenía.

**Verificado**
- **246 tests unitarios** en verde (20 nuevos en `v017.test.ts`, y los de la pareja, la afición, la tienda y el formato de guardado, puestos al día):
  - "Los sesenta de tu madre" desde los 25 años;
  - historial del míster (una decisión que lo baja queda apuntada, en orden) y la afición que se mueve con la fama;
  - fichar reinicia al míster y a la afición, y "La afición se entera" solo en el mismo club;
  - capitanía con 40 de liderazgo;
  - lesiones: gravedad, partidos y decisiones de la baja y atributos de la zona;
  - tienda: puntos de 1 a 3, combinaciones y precios sin solaparse;
  - pareja: novios a 50, boda a 100, ruptura a 0, exparejas y otra persona la temporada siguiente;
  - derbi de la traición, reencuentro y la jugada extra;
  - partidas guardadas de la v0.16.
- **22 tests e2e** en la app real. Ahora también abren el historial del míster (punto de partida y "+4" por quedarte en el mercado) y el de la afición desde Relaciones.
- `typecheck` y `lint` sin errores.
- El `.exe` se regeneró (`dist\win-unpacked\your-football-path.exe`). No lo abrí a mano: los e2e prueban la misma compilación.

### v0.18 — Inglés original, créditos, Early-Access y ajustes de dificultad (2026-11-26)

**Descargas:** al regenerar el `.exe`, electron-builder volvió a descargar Electron (no lo tenía en caché). No se instaló nada nuevo.

**Hecho**
1. **Modos cerrados, solo con el título.** La Rápida, la Normal y la Personalizada ya no enseñan descripción ni datos, solo el nombre y "Próximamente". Las descripciones siguen en los datos para cuando se abran.
2. **El nombre de la competición en los partidos importantes.**
   - En lugar de "Internacional" sale la copa que juegas (p. ej. "Copa de Europa").
   - En copa, en lugar de "Copa", la copa de tu país (p. ej. "Copa de España").
3. **Como mucho 5 puntos de atributo por temporada** en la Completa (antes 13). En las escalas de 30 y 20 serían 3 y 2.
4. **La tienda sube de precio cada temporada:** un 10 % del precio base por temporada. Lo que cuesta 20.000 en la primera temporada cuesta 22.000 en la segunda y 40.000 en la undécima.
5. **"Rueda de prensa"** (¿estás contento con tus minutos?) ya no sale si eres titular, titular indiscutible o capitán.
6. **Créditos.** Botón nuevo en el menú principal. Lleva a una pantalla con "Creado por Hector JAC" y "Contacto: hjac10@hotmail.com". Con 7 botones, el menú se compacta en ventanas bajas para que quepa en 1280×720.
7. **"Early-Access v0.18"** abajo en el centro de todas las pantallas, discreto y sin tapar botones. Sustituye a la versión que había en el menú.
8. **Inglés.**
   - **Cómo se activa:** en Ajustes → Idioma (Español / English). El cambio es inmediato: la pantalla se vuelve a pintar y la elección se guarda en `settings.json`.
   - **Texto original, no traducido:** el inglés no copia frases del español, está escrito como lo escribiría un guionista inglés. Usa inglés británico y vocabulario de fútbol (gaffer, dressing room, pitch, nil…). Las situaciones y sus consecuencias son las mismas, porque la mecánica vive en los datos y no cambia con el idioma.
   - **Interfaz:** `i18n/en.ts` tiene sus propios textos con las mismas claves que `i18n/es.ts`. El compilador y un test comprueban que no falte ni sobre ninguna.
   - **Textos que arma la lógica:** relaciones, mercado, contrato, tienda, pareja, lesiones, capitanía y etiquetas de efectos pasan a una sección `game` de los diccionarios, en los dos idiomas.
   - **Contenido:** `i18n/en/` tiene paquetes con el texto inglés de los 98 eventos de temporada, las 39 jugadas de partido, los 46 orígenes, los 68 artículos de la tienda, los 15 enfoques de "Horas extra" y los 16 títulos. Cada paquete se liga a sus datos al cargar el juego (`i18n/bind.ts`): `evento.title`, `origen.name`… devuelven el texto del idioma activo, sin copiar ni tocar efectos, tiradas ni condiciones.
   - **Nombres base:** atributos, países, posiciones, modos, ligas, copas, torneos, monedas y rondas tienen su nombre en inglés.
   - **Formatos:** los nombres de clubes y jugadores no cambian. El dinero sale como "€1,250,000" o "£850", los puestos como 1st, 2nd o 3rd, y las fechas en formato británico.
   - **Lo que no depende del idioma:** el minuto de cada jugada se sigue leyendo del texto original, así que la mecánica es idéntica en los dos idiomas. Lo que ya quedó escrito en una partida (resultados de decisiones pasadas, el historial de relaciones) se queda en el idioma en que se jugó.
   - **Escritura:** cinco redactores trabajaron en paralelo, uno por bloque de contenido, con las mismas reglas: mismos marcadores (`{veterano}`, `{pareja}`, `{rival}`…), la misma forma de cada evento y una longitud parecida para que quepa en pantalla. Cada uno comprobó su bloque con un script.

**Detalles a revisar en los textos en español.** Los redactores encontraron sitios donde el texto español no cuadra con sus efectos. En inglés se escribió sin contradecir la mecánica; en español siguen igual:
- Lesiones que el texto menciona pero que no tienen efecto de lesión: "Un mes fuera" (`perder-velocidad`), "El aductor se rompe" (`convocatoria-seleccion`) y "un tirón" (`consecuencia-fundacion`).
- `hat-trick`: prometes otro hat-trick y el premio es un doblete.
- `comp-tregua-rival`: habla de cambiar quién tira los penaltis, pero no cambia nada.
- `fiesta`: te llama "novato" a cualquier edad.
- `pareja-crisis`: habla de divorcio aunque los puntos que baja no siempre acaban la relación.
- `entrenador-penaltis` (tienda): habla de penaltis pero sube la compostura.
- Los nombres de relleno ("un compañero", "tu pareja"…) ahora salen en el idioma activo.

**Verificado**
- **257 tests unitarios** en verde (11 nuevos en `v018.test.ts`, y los de puntos por temporada y ajustes, puestos al día):
  - la interfaz inglesa tiene exactamente las claves de la española;
  - cada evento y cada jugada tienen texto inglés con la misma forma, distinto del español y con los mismos marcadores;
  - orígenes, tienda, títulos, "Horas extra" y datos base cambian de idioma;
  - cambiar de idioma no cambia efectos, tiradas, condiciones ni minutos;
  - cambio en vivo (interfaz, lógica y datos);
  - dinero, puestos y rondas en formato inglés;
  - máximo de 5 puntos, precios por temporada, "Rueda de prensa" y Créditos.
- **23 tests e2e** en la app real, con uno nuevo que cambia a inglés en Ajustes y juega en inglés: menú, creación completa, hub, primera decisión, resultado y tienda. También comprueban Créditos, la etiqueta Early-Access, los modos cerrados sin descripción y el máximo de 5 puntos.
- `typecheck` y `lint` sin errores.
- El `.exe` regenerado abre la v0.18 con tus partidas guardadas en "Cargar partida". Revisé las capturas en inglés: menú, creación, hub, decisión y tienda.

### Pendiente / siguientes pasos
- Sexo femenino y más posiciones.
- Más eventos y más clubes. Relaciones que cambien con eventos propios: agente y compañeros.
- Las lesiones de los partidos simulados no quitan decisiones ni atributos (solo las de las decisiones).
- Ventana de invierno, cesiones y retirada.
- Integración con Steamworks (logros y Cloud) e instalador (`npm run build:win`).
- Revisar los detalles de los textos en español que no cuadran con sus efectos (lista en la v0.18).
- `npm audit` sigue avisando de 6 vulnerabilidades moderadas en dependencias de desarrollo de la plantilla (sin cambios).
- El código está en la rama `feature/v0.10` de GitHub (HectorJAC/futbol-rol), pendiente de pull request hacia `main`.

---

## Estructura

```
src/main/index.ts              Proceso principal de Electron (ventana, IPC para salir y para las partidas)
src/main/saves.ts              Leer, escribir, listar y borrar partidas en disco
src/main/settings.ts           Ajustes en disco y aplicarlos a la ventana
src/preload/index.ts           Puente seguro: window.api (quit, saves)
src/shared/                    Tipos compartidos entre Electron y el juego (api.ts, saves.ts, settings.ts)
src/renderer/index.html
src/renderer/src/
  App.tsx                      Muestra la pantalla actual
  store/gameStore.ts           Estado del juego (Zustand): pantallas, borrador de partida y carrera
  screens/                     MainMenu, CharacterCreation, ModeSelection, OriginSelection, AttributeAllocation,
                               ClubSelection, CreationSummary, CareerHub, LoadGame, SeasonEvent, Match,
                               SeasonSummary, TrophyRoom, CareerDetail, RelationHistory,
                               TransferMarket, Records, Settings, Relationships, Competitions, Contract,
                               Extras, OriginCatalog, TrainingPoints, ClubSearch
  components/                  MenuButton, NationalitySelector, Stepper, ClubCrest, Stars,
                               AttributeBar, EffectChips, TrophyIcon, GameTitle, RecentResults, OriginDetail,
                               NextMatch, MateText, icons
  data/                        nationalities, positions, attributes, origins + originCatalog, clubs,
                               leagues/ (primera y segunda división de cada país), playerNames, partnerNames,
                               events + eventsExtra + storyEvents + contextEvents + teamEvents, currencies,
                               matchTypes + matchMoments + matchMomentsExtra + matchMomentsExClub, gameModes, continentalCups,
                               shop + shopCatalog + shopTraining, trainingFocus, trophies, nationalTeams
  logic/                       characterName, career (creación y puntos), saveGame (formato y migraciones),
                               partner (pareja por puntos), relationLog (historial de relaciones), injury (lesiones),
                               season (eventos, tiradas, simulación y selección), random (aleatoriedad con semilla),
                               transfers (mercado de fichajes), records (comparativa de carreras),
                               relationships (cómo te ven), motion (ajuste de animaciones),
                               competitions (calendario, ligas, copas y goleadores), match (partidos importantes),
                               finance (contrato, sueldo y tienda), rating (media y valor de mercado),
                               playerAttributes (escala por modo y lanzadores),
                               teammates (compañeros, excompañeros y capitanía), notPlayed,
                               contractTalks (pedir una mejora de contrato)
  types/                       character.ts, career.ts
  i18n/                        index.ts (idioma activo y `t`), es.ts y en.ts (interfaz), en/ (contenido en inglés), bind.ts
  assets/cursors/              Puntero "Flecha césped" (normal, sobre botones y desactivado)
  styles/                      theme.css (tema y v0.1), career.css (v0.2), season.css (v0.3–v0.6), v07.css,
                               v010.css, v012.css, v013.css, v014.css, v016.css, v017.css, v018.css
e2e/app.spec.ts                Tests de la app real con Playwright
```
