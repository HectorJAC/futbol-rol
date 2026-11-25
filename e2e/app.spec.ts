import {
  _electron as electron,
  expect,
  test,
  type ElectronApplication,
  type Locator,
  type Page
} from '@playwright/test'
import { mkdirSync, readFileSync, rmSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')
const SCREENSHOTS = join(__dirname, 'screenshots')
// Carpeta de datos aparte: los tests nunca tocan las partidas reales del jugador.
const USER_DATA = join(__dirname, '.results', 'user-data')

const NATIONS = [
  'Argentina',
  'Brasil',
  'España',
  'Francia',
  'Inglaterra',
  'Alemania',
  'Italia',
  'Japón',
  'Estados Unidos'
]

let app: ElectronApplication
let page: Page

async function launch(): Promise<void> {
  app = await electron.launch({
    args: ['.'],
    cwd: ROOT,
    env: { ...process.env, YFP_USER_DATA: USER_DATA }
  })
  page = await app.firstWindow()
  await page.waitForLoadState('domcontentloaded')
}

async function resize(width: number, height: number): Promise<void> {
  await app.evaluate(
    ({ BrowserWindow }, size) => {
      BrowserWindow.getAllWindows()[0].setContentSize(size.width, size.height)
    },
    { width, height }
  )
  await page.waitForTimeout(400)
}

async function shot(name: string, sizes: Array<[number, number]> = [[1280, 720]]): Promise<void> {
  for (const [w, h] of sizes) {
    await resize(w, h)
    await page.waitForTimeout(350) // deja terminar las animaciones de entrada
    await page.screenshot({ path: join(SCREENSHOTS, `${name}-${w}x${h}.png`) })
  }
  await resize(1280, 720)
}

const BOTH: Array<[number, number]> = [
  [1280, 720],
  [1920, 1080]
]

const menuButton = (name: string | RegExp): Locator =>
  page.getByRole('navigation', { name: 'Menú principal' }).getByRole('button', { name })

/**
 * Juega lo que quede de temporada eligiendo siempre la primera opción, tanto
 * en los eventos como en las jugadas de los partidos importantes.
 */
let sawResults = false
let sawLineup = false
let sawNextMatch = false
let sawRole = false
let sawMate = false
let sawLocked = false
/** Primera opción que se puede elegir (las que no puedes pagar salen bloqueadas). */
const firstOption = (): Locator =>
  page.locator('[data-testid="event-option"]:not([disabled])').first()
/** Club elegido en el primer contrato y los dos rechazados (salen al azar en cada partida). */
let myClub = ''
let rejectedClubs: string[] = []

async function playUntilSummary(onMatch?: () => Promise<void>): Promise<void> {
  const summary = page.getByRole('heading', { name: 'Resumen de la temporada' })
  for (let guard = 0; guard < 200; guard++) {
    if (await summary.isVisible()) return
    if (await page.getByTestId('event-option').first().isVisible()) {
      if (!sawResults && (await page.getByTestId('recent-match').first().isVisible())) {
        sawResults = true
        // Al lado de los resultados, tus números de la temporada.
        await expect(page.getByTestId('season-stats')).toBeVisible()
        await shot('09b-evento-resultados', BOTH)
      }
      // Cada partido jugado dice si fuiste titular o suplente.
      if (
        !sawRole &&
        (await page
          .getByTestId('recent-match-me')
          .filter({ hasText: /Titular|Suplente/ })
          .count()) > 0
      ) {
        sawRole = true
      }
      // Compañeros nombrados: al pasar el cursor se ve la relación.
      const mate = page.getByTestId('mate-ref').first()
      if (!sawMate && (await mate.isVisible())) {
        sawMate = true
        await expect(mate).toHaveAttribute('data-tooltip', /Relación \d+ \(/)
        await mate.hover()
        await page.waitForTimeout(200)
        await page.screenshot({ path: join(SCREENSHOTS, '09d-relacion-companero-1280x720.png') })
      }
      // Lo que no puedes pagar sale bloqueado (p. ej. en "Tu primera nómina de verdad").
      if (!sawLocked && (await page.getByTestId('option-locked').count()) > 0) {
        sawLocked = true
        await expect(
          page
            .getByTestId('event-option')
            .filter({ has: page.getByTestId('option-locked') })
            .first()
        ).toBeDisabled()
        await page.waitForTimeout(500) // deja terminar la animación de entrada
        await page.screenshot({ path: join(SCREENSHOTS, '09e-opcion-bloqueada-1280x720.png') })
      }
      await firstOption().click()
      await expect(page.getByTestId('event-result')).toBeVisible()
      // Antes de un partido importante se ve contra quién.
      if (await page.getByRole('button', { name: 'Jugar partido' }).isVisible()) {
        await expect(page.getByTestId('next-match')).toBeVisible()
        if (!sawNextMatch) {
          sawNextMatch = true
          await shot('09c-proximo-partido')
        }
      }
      await page.getByRole('button', { name: /Continuar|Jugar el resto|Jugar partido/ }).click()
    } else if (await page.getByTestId('start-match').isVisible()) {
      // Convocatoria: titular, suplente o no convocado.
      await expect(page.getByTestId('match-lineup')).toBeVisible()
      if (!sawLineup) {
        sawLineup = true
        await shot('10a-convocatoria')
      }
      await page.getByTestId('start-match').click()
    } else if (await page.getByTestId('moment-option').first().isVisible()) {
      if (onMatch) {
        await onMatch()
        onMatch = undefined
      }
      await page.getByTestId('moment-option').first().click()
      await expect(page.getByTestId('moment-result')).toBeVisible()
      await page.getByRole('button', { name: /Siguiente jugada|Pitido final/ }).click()
    } else if (await page.getByTestId('match-final').isVisible()) {
      await page.getByRole('button', { name: /Seguir la temporada|Jugar partido/ }).click()
    } else {
      await page.waitForTimeout(100)
    }
  }
  await expect(summary).toBeVisible()
}

test.beforeAll(async () => {
  rmSync(USER_DATA, { recursive: true, force: true })
  rmSync(SCREENSHOTS, { recursive: true, force: true })
  mkdirSync(SCREENSHOTS, { recursive: true })
  await launch()
})

test.afterAll(async () => {
  // Si el test de "Salir" ya cerró la app, esto no hace nada.
  await app?.close().catch(() => {})
})

test('menú principal: título, botones y puntero propio', async () => {
  await expect(page).toHaveTitle('Your Football Path')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Football Path')

  await expect(menuButton('Nueva Partida')).toBeEnabled()
  // Sin partidas guardadas, "Cargar Partida" está deshabilitado.
  await expect(menuButton(/Cargar Partida/)).toBeDisabled()
  await expect(menuButton(/Cargar Partida/)).toContainText('Sin partidas')
  await expect(menuButton('Ajustes')).toBeEnabled()
  await expect(menuButton(/Records/)).toBeDisabled()
  await expect(menuButton('Extras')).toBeEnabled()
  await expect(menuButton('Salir del juego')).toBeEnabled()

  // Puntero "Flecha césped" en todo el juego (y su variante al pasar por un botón).
  const cursor = (selector: string): Promise<string> =>
    page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el).cursor)
  expect(await cursor('body')).toContain('url(')
  expect(await cursor('.menu-button')).toContain('url(')
  expect(await cursor('.menu-button')).not.toBe(await cursor('body'))

  await shot('01-menu', BOTH)
})

test('Extras: catálogo de orígenes por país y especiales', async () => {
  await menuButton('Extras').click()
  await expect(page.getByRole('heading', { name: 'Extras' })).toBeVisible()
  await page.getByRole('button', { name: 'Orígenes' }).click()
  await expect(page.getByRole('heading', { name: 'Orígenes', exact: true })).toBeVisible()
  await expect(page.getByTestId('catalog-origin')).toHaveCount(4)
  await shot('01c-extras-origenes', BOTH)

  await page.getByTestId('catalog-tab-JPN').click()
  await expect(page.getByTestId('catalog-origin')).toHaveCount(4)
  await page.getByTestId('catalog-tab-extra').click()
  await expect(page.getByTestId('catalog-origin')).toHaveCount(10)
  await page.getByTestId('catalog-origin').nth(3).click()
  await expect(page.getByTestId('origin-detail-title')).toBeVisible()
  await shot('01d-extras-especiales')

  await page.getByRole('button', { name: 'Volver a Extras' }).click()
  await page.getByRole('button', { name: 'Volver al menú' }).click()
  await expect(menuButton('Nueva Partida')).toBeVisible()
})

test('Ajustes: tamaño de ventana, animaciones e idioma', async () => {
  await menuButton('Ajustes').click()
  await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible()
  await expect(page.getByTestId('setting-fullscreen')).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('radio', { name: /English/ })).toBeDisabled()
  await shot('01b-ajustes')

  const contentSize = (): Promise<number[]> =>
    app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getContentSize())

  await page.getByRole('radio', { name: '1600 × 900' }).click()
  await expect.poll(contentSize).toEqual([1600, 900])
  await page.getByRole('radio', { name: '1280 × 720' }).click()
  await expect.poll(contentSize).toEqual([1280, 720])

  await page.getByTestId('setting-animations').click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await page.getByTestId('setting-animations').click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')

  // Se guardan en disco.
  const saved = JSON.parse(readFileSync(join(USER_DATA, 'settings.json'), 'utf8'))
  expect(saved).toMatchObject({ windowSize: '1280x720', animations: true, fullscreen: false })

  await page.getByRole('button', { name: 'Volver al menú' }).click()
})

test('paso 1: valores por defecto y validación', async () => {
  await menuButton('Nueva Partida').click()
  await expect(page.getByRole('heading', { name: 'Crea tu jugador' })).toBeVisible()

  await expect(page.getByTestId('nationality-name')).toHaveText('Argentina')
  await expect(page.getByRole('radio', { name: /Masculino/ })).toHaveAttribute(
    'aria-checked',
    'true'
  )
  await expect(page.getByRole('radio', { name: /Femenino/ })).toBeDisabled()
  await expect(page.getByRole('radio', { name: /Delantero centro/ })).toHaveAttribute(
    'aria-checked',
    'true'
  )
  // Pierna buena: diestro por defecto.
  await expect(page.getByTestId('foot-derecha')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('foot-izquierda')).toHaveAttribute('aria-checked', 'false')

  const next = page.getByRole('button', { name: 'Continuar' })
  await expect(next).toBeDisabled()
  await shot('02-creacion-vacia')

  await page.getByLabel('Nombre').fill('a')
  // El nombre se escribe siempre en mayúsculas.
  await expect(page.getByLabel('Nombre')).toHaveValue('A')
  await expect(page.getByRole('alert')).toContainText('al menos 2')
  await expect(next).toBeDisabled()
})

test('paso 1: las 9 nacionalidades con flechas y teclado', async () => {
  const name = page.getByTestId('nationality-name')
  const next = page.getByRole('button', { name: 'Nacionalidad siguiente' })
  const prev = page.getByRole('button', { name: 'Nacionalidad anterior' })

  for (let i = 0; i < NATIONS.length; i++) {
    await expect(name).toHaveText(NATIONS[i])
    // La bandera debe cargar de verdad (no imagen rota). Se espera porque algunas pesan más.
    await expect
      .poll(
        () =>
          page
            .locator('.nationality__flag')
            .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        { message: `bandera de ${NATIONS[i]}`, timeout: 3000 }
      )
      .toBe(true)
    await next.click()
  }
  await expect(name).toHaveText('Argentina') // vuelta completa

  await prev.click()
  await expect(name).toHaveText('Estados Unidos')

  // Teclado: → avanza cuando no se está escribiendo en el nombre.
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await page.keyboard.press('ArrowRight')
  await expect(name).toHaveText('Argentina')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(name).toHaveText('España')
})

test('paso 2: modo de juego', async () => {
  await page.getByLabel('Nombre').fill('  Diego   Rivera ')
  await expect(page.getByLabel('Nombre')).toHaveValue('  DIEGO   RIVERA ')
  // Zurdo.
  await page.getByTestId('foot-izquierda').click()
  await expect(page.getByTestId('foot-izquierda')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('foot-derecha')).toHaveAttribute('aria-checked', 'false')
  await shot('03-creacion-rellena', BOTH)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await expect(page.getByRole('heading', { name: 'Elige el modo de juego' })).toBeVisible()
  // Por ahora solo la Completa (15 temporadas) y la Personalizada.
  await expect(page.getByTestId('mode-completa')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('mode-completa')).toContainText('15 temporadas')
  await expect(page.getByTestId('mode-rapida')).toBeDisabled()
  await expect(page.getByTestId('mode-normal')).toBeDisabled()
  await expect(page.getByTestId('mode-normal')).toContainText('Próximamente')
  await shot('03a-modos', BOTH)

  // Personalizada: hasta 25 temporadas y cada cuánto se decide.
  await page.getByTestId('mode-personalizada').click()
  await expect(page.getByTestId('mode-custom')).toBeVisible()
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Más temporadas' }).click()
  await expect(page.getByTestId('custom-seasons')).toHaveText('25')
  await expect(page.getByRole('button', { name: 'Más temporadas' })).toBeDisabled()
  await shot('03b-modo-personalizada', BOTH)

  await page.getByTestId('mode-completa').click()
  await expect(page.getByTestId('mode-completa')).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('button', { name: 'Continuar' }).click()
})

test('paso 3: orígenes del país y uno especial', async () => {
  await expect(page.getByRole('heading', { name: 'Elige tu origen' })).toBeVisible()
  const next = page.getByRole('button', { name: 'Continuar' })
  await expect(next).toBeDisabled()
  await expect(page.getByTestId('origin-option')).toHaveCount(4)
  await expect(page.getByTestId('origin-option-extra')).toHaveCount(1)

  await page.getByRole('radio', { name: /Hijo del eterno capitán/ }).click()
  await expect(page.getByTestId('origin-detail-title')).toHaveText('Hijo del eterno capitán')
  // Modo Completa: atributos de 1 a 50, así que el +4 del origen (escala de 20) es un +10.
  await expect(page.getByText('+10 Liderazgo')).toBeVisible()
  await shot('04-origen', BOTH)

  // Atrás conserva el nombre y la nacionalidad.
  await page.getByRole('button', { name: 'Atrás' }).click()
  await page.getByRole('button', { name: 'Atrás' }).click()
  await expect(page.getByLabel('Nombre')).toHaveValue('DIEGO RIVERA')
  await expect(page.getByTestId('nationality-name')).toHaveText('España')
  await expect(page.getByTestId('foot-izquierda')).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByTestId('mode-completa')).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByRole('radio', { name: /Hijo del eterno capitán/ })).toHaveAttribute(
    'aria-checked',
    'true'
  )
  await next.click()
})

test('paso 4: repartir los puntos de atributo', async () => {
  await expect(page.getByRole('heading', { name: 'Reparte tus atributos' })).toBeVisible()
  const points = page.getByTestId('points-left')
  const next = page.getByRole('button', { name: 'Continuar' })
  // Completa: 10 puntos libres y atributos de 1 a 50 (con balón parado).
  await expect(points).toHaveText('10 / 10')
  await expect(next).toBeDisabled()
  await expect(page.getByTestId('attr-penalties')).toBeVisible()
  // El jugador descubre solo cuándo es lanzador: sin pistas ni línea de mínimo.
  await expect(page.getByText(/eres el lanzador/)).toHaveCount(0)
  await expect(page.locator('.attr-bar__marker')).toHaveCount(0)
  await expect(page.getByText('Corners', { exact: true })).toBeVisible()

  // Hijo del eterno capitán: liderazgo (5 + 4 = 9 en la escala de 20) → 23 de 50.
  await expect(page.getByTestId('attr-leadership')).toHaveText('23')
  await expect(page.getByTestId('attr-shortPassing')).toHaveText('18')

  const overallBefore = Number(await page.getByTestId('overall').textContent())
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Subir Definición' }).click()
  }
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Subir Pase corto' }).click()
  await expect(points).toHaveText('0 / 10')
  await expect(page.getByTestId('attr-finishing')).toHaveText('28')
  expect(Number(await page.getByTestId('overall').textContent())).toBeGreaterThan(overallBefore)
  await expect(page.getByRole('button', { name: 'Subir Regate' })).toBeDisabled()

  await shot('05-atributos', BOTH)
  await next.click()
})

test('paso 5: elegir club, ver el resumen y firmar', async () => {
  await expect(page.getByRole('heading', { name: 'Tu primer contrato' })).toBeVisible()
  const offers = page.getByRole('radio')
  await expect(offers).toHaveCount(3)
  // Clubes al azar: un grande (5 estrellas), uno de 4 o 3 y uno de 3 o 2.
  const names = await page.locator('.offer__name').allTextContents()
  expect(new Set(names).size).toBe(3)
  // El origen crea un vínculo con el club medio.
  await expect(offers.nth(1)).toContainText('Tu padre fue su capitán')

  const next = page.getByRole('button', { name: 'Continuar' })
  await expect(next).toBeDisabled()
  await offers.nth(1).click()
  myClub = names[1]
  rejectedClubs = [names[0], names[2]]
  await shot('06-clubes', BOTH)
  await next.click()

  // Resumen: jugador, atributos y contrato; aquí se firma.
  await expect(page.getByRole('heading', { name: 'Resumen', exact: true })).toBeVisible()
  await expect(page.getByTestId('summary-player')).toContainText('DIEGO RIVERA')
  await expect(page.getByTestId('summary-foot')).toHaveText('Izquierda')
  await expect(page.getByTestId('summary-club')).toHaveText(myClub)
  await expect(page.getByTestId('summary-contract')).toContainText('3 temporadas')
  await expect(page.getByTestId('summary-attributes')).toContainText('Corners')
  await shot('06b-resumen', BOTH)
  // "Atrás" lleva a los clubes sin perder la elección.
  await page.getByRole('button', { name: 'Atrás' }).click()
  await expect(offers.nth(1)).toHaveAttribute('aria-checked', 'true')
  await next.click()
  await page.getByTestId('sign-contract').click()

  await expect(page.getByTestId('hub-player-name')).toHaveText('DIEGO RIVERA')
  await expect(page.getByTestId('hub-foot')).toHaveText('Izquierda')
  // La bandera, a la derecha del nombre; el sueldo, a la derecha del club.
  await expect(page.getByTestId('hub-flag')).toHaveAttribute('alt', 'España')
  const nameBox = await page.getByTestId('hub-player-name').boundingBox()
  const flagBox = await page.getByTestId('hub-flag').boundingBox()
  expect(flagBox && nameBox && flagBox.x > nameBox.x + nameBox.width - 1).toBe(true)
  await expect(page.getByTestId('hub-wage')).toContainText('/sem')
  // Titularidad en la situación: de reserva a titular indiscutible.
  await expect(page.getByTestId('hub-squad')).toHaveText(
    /^(Titular indiscutible|Titular|Rotación|Suplente|Reserva)$/
  )
  await expect(page.getByTestId('hub-club-name')).toHaveText(myClub)
  await expect(page.getByTestId('hub-season')).toContainText('Temporada 1 de 15')
  await expect(page.getByTestId('hub-division')).toHaveText('Primera División de España')
  await expect(page.getByTestId('hub-market-value')).toContainText('€')
  await expect(page.getByTestId('hub-family')).toHaveText('Soltero')
  // 15 atributos (con balón parado) en la escala 1–50; aún no eres lanzador (y no se dice).
  await expect(page.getByTestId('hub-attributes')).toContainText('1–50')
  await expect(page.getByTestId('hub-set-pieces')).toHaveCount(0)
  // Autoguardado al firmar.
  await expect(page.getByTestId('save-button')).toHaveText('Partida guardada')
  await shot('07-hub', BOTH)
})

test('competiciones antes de empezar: calendario y liga a cero', async () => {
  await page.getByTestId('open-competitions').click()
  await expect(page.getByRole('heading', { name: 'Competiciones' })).toBeVisible()
  await expect(page.getByTestId('calendar').locator('tr')).not.toHaveCount(0)
  await page.getByTestId('competitions-tab-league').click()
  await expect(page.getByTestId('my-table-row')).toContainText(myClub)
  await page.getByRole('button', { name: 'Volver' }).click()
})

test('temporada 1 (modo completo): 10 decisiones, partidos importantes y resumen', async () => {
  await page.getByTestId('play-season').click()

  // La primera temporada siempre empieza con el debut.
  await expect(page.getByTestId('event-count')).toContainText('Decisión 1 / 10')
  await expect(page.getByTestId('event-title')).toHaveText('Tu debut')
  await expect(page.getByText(/🎲 Compostura/)).toBeVisible()
  await shot('09-evento', BOTH)
  await firstOption().click()
  await expect(page.getByTestId('event-result')).toBeVisible()
  await shot('10-evento-resultado')
  await page.getByRole('button', { name: /^(Continuar|Jugar partido)$/ }).click()

  let sawMatch = false
  await playUntilSummary(async () => {
    sawMatch = true
    await expect(page.getByTestId('scoreboard')).toBeVisible()
    // El contexto del partido, arriba del recuadro de decisiones.
    await expect(page.getByTestId('match-context')).toContainText('Partido importante')
    // En liga, el puesto de cada equipo debajo de su escudo.
    if ((await page.getByTestId('match-context').textContent())?.includes('Liga')) {
      await expect(page.getByTestId('team-position')).toHaveCount(2)
    }
    await shot('10b-partido-importante', BOTH)
  })
  expect(sawMatch || sawLineup).toBe(true)
  expect(sawLineup).toBe(true)
  // Partidos jugados con su papel (titular o suplente) en los resultados.
  expect(sawRole).toBe(true)
  // En la pantalla de decisiones se ven los resultados desde la última decisión.
  expect(sawResults).toBe(true)

  await expect(page.getByRole('heading', { name: 'Resumen de la temporada' })).toBeVisible()
  expect(Number(await page.getByTestId('season-matches').textContent())).toBeGreaterThan(0)
  await expect(page.getByTestId('national-line')).toContainText('Selección')
  await expect(page.getByTestId('season-earnings')).toBeVisible()
  await expect(page.getByTestId('season-points')).toBeVisible()
  // Con puntos pendientes se puede repartir o seguir sin repartir.
  if (await page.getByTestId('summary-skip-points').isVisible()) {
    await expect(page.getByTestId('summary-continue')).toContainText('Repartir puntos')
  }
  const cupRound = page.getByTestId('cup-round')
  await expect(cupRound).toHaveAttribute('data-tooltip', /\d+-\d+/)
  await cupRound.hover()
  await shot('11-resumen-temporada', BOTH)
  await cupRound.hover()
  await page.screenshot({ path: join(SCREENSHOTS, '11b-resumen-copa-tooltip-1280x720.png') })

  // Con muchos títulos, la lista hace scroll y no tapa los botones.
  await page.evaluate(() => {
    const panel = document.querySelector('.summary-trophies') as HTMLElement
    panel
      .querySelector<HTMLElement>('.summary-trophies__empty')
      ?.style.setProperty('display', 'none')
    const list = document.createElement('ul')
    list.className = 'trophy-list'
    list.dataset.test = 'many-trophies'
    list.innerHTML =
      '<li class="trophy-chip trophy-chip--colectivo"><div><strong>Título de prueba</strong><span>Una descripción de prueba</span></div></li>'.repeat(
        12
      )
    panel.appendChild(list)
  })
  const trophies = await page.locator('.summary-trophies').boundingBox()
  const actions = await page.locator('.summary-screen .action-bar').boundingBox()
  expect(trophies && actions && trophies.y + trophies.height <= actions.y + 1).toBe(true)
  const scrolls = await page
    .locator('[data-test="many-trophies"]')
    .evaluate((el) => el.scrollHeight > el.clientHeight)
  expect(scrolls).toBe(true)
  await page.waitForTimeout(700) // deja terminar la animación de entrada de los títulos
  await page.screenshot({ path: join(SCREENSHOTS, '11c-resumen-muchos-titulos-1280x720.png') })
  await page.evaluate(() => document.querySelector('[data-test="many-trophies"]')?.remove())
})

test('Sala de trofeos: temporadas, vitrina y asistencias', async () => {
  await page.getByRole('button', { name: 'Sala de trofeos' }).click()
  await expect(page.getByRole('heading', { name: 'Sala de trofeos' })).toBeVisible()
  await expect(page.getByTestId('total-assists')).toBeVisible()
  const rows = page.getByTestId('timeline-row')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('2026/27')
  await expect(rows.first()).toContainText(myClub)
  await shot('12-sala-trofeos-temporadas', BOTH)

  await page.getByRole('tab', { name: 'Vitrina' }).click()
  await expect(page.getByText('Balón Dorado')).toBeVisible()
  await expect(page.getByText('Rey de las Asistencias')).toBeVisible()
  await shot('13-sala-trofeos-vitrina')

  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByTestId('hub-season')).toContainText('Temporada 2')
})

test('competiciones de la temporada jugada: tablas, copa y goleadores', async () => {
  await page.getByTestId('open-competitions').click()
  // La temporada 2 aún no ha empezado: se mira la anterior.
  await page.getByRole('button', { name: 'Temporada anterior' }).click()
  await expect(page.getByTestId('competitions-season')).toHaveText('2026/27')
  await expect(page.getByTestId('calendar')).toBeVisible()
  await shot('17-calendario', BOTH)
  await page.getByTestId('competitions-tab-league').click()
  await expect(page.getByTestId('my-table-row')).toContainText('38')
  // Cada copa europea con su color: azul, dorado y verde.
  await expect(page.getByTestId('table-legend')).toContainText('Azul: 1º–4º, Copa de Campeones')
  await expect(page.getByTestId('table-legend')).toContainText('Dorado: 5º y 6º, Copa de Europa')
  await expect(page.getByTestId('table-legend')).toContainText('Verde: 7º, Copa Conferencia')
  await expect(page.locator('.standings .row--campeones')).toHaveCount(4)
  await expect(page.locator('.standings .row--europa')).toHaveCount(2)
  await expect(page.locator('.standings .row--conferencia')).toHaveCount(1)
  await shot('18-liga', BOTH)
  await page.getByTestId('competitions-tab-cup').click()
  await shot('19-copa')
  await page.getByTestId('competitions-tab-continental').click()
  await shot('20-internacional', BOTH)
  await page.getByTestId('competitions-tab-scorers').click()
  await expect(page.getByTestId('scorers-table')).toBeVisible()
  await shot('21-goleadores')
  await page.getByTestId('competitions-tab-assists').click()
  await expect(page.getByTestId('assists-table')).toBeVisible()
  await page.getByRole('button', { name: 'Volver' }).click()
})

test('contrato, mejora de contrato, compras y gastos', async () => {
  await page.getByTestId('open-contract').click()
  await expect(page.getByRole('heading', { name: 'Contrato y dinero' })).toBeVisible()
  await expect(page.getByTestId('contract-terms')).toContainText('1.200 €')
  await expect(page.getByTestId('contract-tab-shop')).toHaveText('Compras')
  await shot('22-contrato', BOTH)

  await expect(page.getByTestId('monthly-wage')).toContainText('5.200 €')

  // Pedir una mejora: tres peticiones con su probabilidad; una vez por temporada.
  await page.getByTestId('contract-tab-raise').click()
  await expect(page.getByTestId('raise-option')).toHaveCount(3)
  await expect(page.getByTestId('raise-option').first()).toContainText('%')
  await shot('22b-mejorar-contrato', BOTH)
  await page.getByTestId('raise-moderada').click()
  await expect(page.getByTestId('raise-result')).toHaveText(/Aceptado|ha dicho que no/)
  await expect(page.getByTestId('raise-option')).toHaveCount(0)
  await expect(page.getByTestId('raise-blocked')).toContainText('Ya lo pediste esta temporada')
  await shot('22c-mejora-respuesta')

  await page.getByTestId('contract-tab-shop').click()
  const moneyBefore = await page.getByTestId('money').textContent()
  const card = page
    .getByTestId('shop-item')
    .filter({ has: page.getByRole('button', { name: 'Comprar' }) })
    .first()
  const itemName = (await card.locator('strong').first().textContent()) ?? ''
  const buyId = (await card.getByRole('button').getAttribute('data-testid')) ?? ''
  await page.getByTestId(buyId).click()
  await expect(page.getByTestId(buyId)).toHaveText(/Comprado|Contratado/)
  expect(await page.getByTestId('money').textContent()).not.toBe(moneyBefore)
  await shot('23-mejoras', BOTH)

  await page.getByTestId('contract-tab-expenses').click()
  await expect(page.getByTestId('expenses')).toContainText(itemName)
  await shot('24-gastos')
  await page.getByRole('button', { name: 'Volver' }).click()
})

test('puntos de fin de temporada: desde los atributos del hub, ahora o más tarde', async () => {
  const open = page.getByTestId('open-points')
  if (await open.isVisible()) {
    await expect(page.getByTestId('points-banner')).toBeVisible()
    // Pulsar la sección de atributos del hub abre la pantalla de puntos.
    await page.getByTestId('hub-attributes').click()
    await expect(page.getByRole('heading', { name: 'Reparte tus puntos' })).toBeVisible()
    // "Repartir más tarde" vuelve al hub y los puntos se guardan.
    await page.getByTestId('skip-points').click()
    await expect(page.getByTestId('hub-player-name')).toBeVisible()
    await expect(open).toBeVisible()
    await open.click()
    await expect(page.getByRole('heading', { name: 'Reparte tus puntos' })).toBeVisible()
    await shot('25-puntos', BOTH)
    const confirm = page.getByTestId('confirm-points')
    await expect(confirm).toBeDisabled()
    const left = page.getByTestId('training-points-left')
    while (!(await left.textContent())?.startsWith('0 ')) {
      await page.getByRole('button', { name: 'Subir Definición' }).click()
    }
    await confirm.click()
    await expect(page.getByTestId('hub-player-name')).toBeVisible()
    await expect(open).toHaveCount(0)
  }
})

test('mercado de fichajes antes de la temporada 2', async () => {
  // Con el mercado pendiente, el botón principal del hub lleva al mercado.
  const heading = page.getByRole('heading', { name: 'Mercado de fichajes' })
  if (!(await heading.isVisible())) {
    await page.getByRole('button', { name: 'Mercado de fichajes' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Mercado de fichajes' })).toBeVisible()
  await expect(page.getByTestId('market-stay')).toContainText('Quedarte en ' + myClub)
  expect(await page.getByTestId('market-offer').count()).toBeGreaterThanOrEqual(1)
  // Rechazaste a los otros dos clubes en el primer contrato: si les tocaba llamar, no lo hacen.
  for (const rejected of rejectedClubs) {
    await expect(page.getByTestId('market-offer').filter({ hasText: rejected })).toHaveCount(0)
  }
  // Cada club dice en qué división juega.
  await expect(page.getByTestId('market-stay').getByTestId('offer-division')).toHaveText(
    'Primera División de España'
  )
  for (const offer of await page.getByTestId('market-offer').all()) {
    await expect(offer.getByTestId('offer-division')).toHaveText(/^(Primera|Segunda) División de /)
  }
  await shot('14-mercado', BOTH)

  await page.getByTestId('market-stay').click()
  await page.getByRole('button', { name: 'Quedarme' }).click()
  await expect(page.getByTestId('market-message')).toContainText('Te quedas')
  await expect(page.getByRole('button', { name: 'Jugar temporada 2' })).toBeVisible()
  await shot('15-hub-temporada-2')

  // Relaciones: míster, padre (origen de herencia) y afición; el vestuario va en otra pestaña.
  await page.getByRole('button', { name: 'Relaciones' }).click()
  await expect(page.getByRole('heading', { name: 'Relaciones' })).toBeVisible()
  expect(await page.getByTestId('relationship').count()).toBeGreaterThanOrEqual(3)
  await expect(page.getByText('Tu padre')).toBeVisible()
  // El míster y la afición llevan barra, como los compañeros.
  for (const who of ['El míster', 'La afición']) {
    await expect(
      page.getByTestId('relationship').filter({ hasText: who }).locator('.relationship__meter')
    ).toBeVisible()
  }
  await expect(
    page.getByTestId('relationship').filter({ hasText: 'Tu padre' }).locator('.relationship__meter')
  ).toHaveCount(0)
  await shot('15b-relaciones')
  await page.getByTestId('relationships-tab-teammates').click()
  await expect(page.getByTestId('relationship')).toHaveCount(5)
  await expect(page.getByTestId('captaincy-panel')).toContainText('Temporadas en el club')
  await shot('15c-vestuario', BOTH)
  await page.getByTestId('relationships-tab-ex').click()
  await expect(page.getByText('Cuando cambies de club')).toBeVisible()
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByRole('button', { name: 'Jugar temporada 2' })).toBeVisible()
})

test('buscador de equipos: país, división y club; objetivo para el final de temporada', async () => {
  await page.getByTestId('open-club-search').click()
  await expect(page.getByRole('heading', { name: 'Buscar equipo' })).toBeVisible()
  await page.getByTestId('search-country-ENG').click()
  await page.getByTestId('search-division-2').click()
  await page.getByTestId('search-club').first().click()
  await expect(page.getByTestId('signing-checks')).toContainText('Tu media')
  await page.getByTestId('search-division-1').click()
  await page.getByTestId('search-club').first().click()
  const name = (await page.getByTestId('search-club-name').textContent()) ?? ''
  await page.getByTestId('set-target').click()
  await expect(page.getByTestId('target-set')).toBeVisible()
  await shot('16-buscador', BOTH)
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByTestId('hub-target')).toContainText(name)
  // Se puede quitar el objetivo.
  await page.getByTestId('open-club-search').click()
  await page.getByTestId('cancel-target').click()
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByTestId('hub-target')).toHaveCount(0)
})

test('la partida se guarda en disco y sobrevive a reiniciar el juego', async () => {
  await page.getByRole('button', { name: 'Guardar y salir al menú' }).click()
  await expect(menuButton('Cargar Partida')).toBeEnabled()

  await app.close()
  await launch()

  await expect(menuButton('Cargar Partida')).toBeEnabled()
  await menuButton('Cargar Partida').click()
  const slots = page.getByTestId('save-slot')
  await expect(slots).toHaveCount(1)
  await expect(slots.first()).toContainText('DIEGO RIVERA')
  await expect(slots.first()).toContainText(myClub)
  await expect(slots.first()).toContainText('Temporada 2')
  await shot('08-cargar-partida', BOTH)

  await slots.first().getByRole('button', { name: 'Cargar' }).click()
  await expect(page.getByTestId('hub-player-name')).toHaveText('DIEGO RIVERA')
  await expect(page.getByTestId('hub-club-name')).toHaveText(myClub)
})

test('Records muestra todas las carreras guardadas', async () => {
  await page.getByRole('button', { name: 'Guardar y salir al menú' }).click()
  await expect(menuButton('Records')).toBeEnabled()
  await menuButton('Records').click()
  await expect(page.getByRole('heading', { name: 'Records' })).toBeVisible()
  const rows = page.getByTestId('record-row')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('DIEGO RIVERA')
  await shot('16-records')
  await page.getByRole('button', { name: 'Volver al menú' }).click()
})

test('borrar partida pide confirmación', async () => {
  await menuButton('Cargar Partida').click()
  const slot = page.getByTestId('save-slot').first()

  await slot.getByRole('button', { name: 'Borrar' }).click()
  await expect(slot).toContainText('¿Borrar definitivamente?')
  await slot.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.getByTestId('save-slot')).toHaveCount(1)

  await slot.getByRole('button', { name: 'Borrar' }).click()
  await slot.getByRole('button', { name: 'Sí, borrar' }).click()
  await expect(page.getByTestId('save-slot')).toHaveCount(0)
  await expect(page.getByText('No hay partidas guardadas todavía.')).toBeVisible()

  await page.getByRole('button', { name: 'Volver al menú' }).click()
  await expect(menuButton(/Cargar Partida/)).toBeDisabled()
  await expect(menuButton(/Records/)).toBeDisabled()
})

test('teclado en el menú: ↑/↓ saltan los botones deshabilitados', async () => {
  const newGame = menuButton('Nueva Partida')
  const quit = menuButton('Salir del juego')
  await newGame.focus()
  await page.keyboard.press('ArrowDown')
  await expect(menuButton('Ajustes')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(menuButton('Extras')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(quit).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(newGame).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(quit).toBeFocused()
})

test('Salir del juego cierra la aplicación', async () => {
  const closed = new Promise<void>((resolve) => app.process().once('exit', () => resolve()))
  await menuButton('Salir del juego').click()
  await expect(closed).resolves.toBeUndefined()
})
