# Futbol-Rol

**Proyecto: Juego Futbol-Rol** (nombre provisional). Es una carrera de futbolista con decisiones de RPG, al estilo de Mass Effect, Dragon Age o Baldur's Gate. No se juega al fútbol: se eligen opciones y esas decisiones marcan toda la carrera.

- Plataforma: **solo escritorio, distribuido por Steam**. Windows primero. No habrá versión web.
- Plan completo e ideas de diseño: [PLAN.md](PLAN.md).
- **Versión actual: v0.10**:
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
  - Creación del jugador en 5 pasos (jugador, modo de juego, origen, atributos y primer club).
  - 4 orígenes por país y 10 orígenes especiales.
  - Modos Rápida, Normal, Completa y Personalizada, con fin de carrera.
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
dist\win-unpacked\futbol-rol.exe
```

También hay un acceso directo **Futbol-Rol** en el escritorio que apunta a ese `.exe`.

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
| `npm run build:unpack` | Genera `dist/win-unpacked/futbol-rol.exe`. |
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
- Todos los textos están en `src/renderer/src/i18n/es.ts`, para poder traducir al inglés más adelante.

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

### Pendiente / siguientes pasos
- Sexo femenino y más posiciones.
- Más eventos y más clubes. Relaciones que cambien con eventos propios: agente, compañeros y pareja.
- Ventana de invierno, cesiones y retirada.
- Integración con Steamworks (logros y Cloud), traducción al inglés e instalador (`npm run build:win`).
- `npm audit` sigue avisando de 6 vulnerabilidades moderadas en dependencias de desarrollo de la plantilla (sin cambios).
- El repositorio git solo tiene el primer commit (PLAN.md y README.md); el código sigue sin commitear.

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
                               ClubSelection, CareerHub, LoadGame, SeasonEvent, Match, SeasonSummary, TrophyRoom,
                               TransferMarket, Records, Settings, Relationships, Competitions, Contract,
                               Extras, OriginCatalog, TrainingPoints, ClubSearch
  components/                  MenuButton, NationalitySelector, Stepper, ClubCrest, Stars,
                               AttributeBar, EffectChips, TrophyIcon, GameTitle, RecentResults, OriginDetail, icons
  data/                        nationalities, positions, attributes, origins + originCatalog, clubs,
                               leagues/ (primera y segunda división de cada país), playerNames, partnerNames,
                               events + eventsExtra + storyEvents + contextEvents + teamEvents, currencies,
                               matchTypes + matchMoments, gameModes, continentalCups,
                               shop + shopCatalog + shopTraining, trophies, nationalTeams
  logic/                       characterName, career (creación y puntos), saveGame (formato y migraciones),
                               season (eventos, tiradas, simulación y selección), random (aleatoriedad con semilla),
                               transfers (mercado de fichajes), records (comparativa de carreras),
                               relationships (cómo te ven), motion (ajuste de animaciones),
                               competitions (calendario, ligas, copas y goleadores), match (partidos importantes),
                               finance (contrato, sueldo y tienda), rating (media y valor de mercado),
                               playerAttributes (escala por modo y lanzadores),
                               teammates (compañeros, excompañeros y capitanía)
  types/                       character.ts, career.ts
  i18n/es.ts                   Textos
  assets/cursors/              Puntero "Flecha césped" (normal, sobre botones y desactivado)
  styles/                      theme.css (tema y v0.1), career.css (v0.2), season.css (v0.3–v0.6), v07.css,
                               v010.css
e2e/app.spec.ts                Tests de la app real con Playwright
```
