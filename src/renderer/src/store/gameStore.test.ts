import { beforeEach, describe, expect, it } from 'vitest'
import { getClubOffers } from '../data/clubs'
import { attributeScale, defaultMode, type GameModeId } from '../data/gameModes'
import { getEvent } from '../data/events'
import { shopOffer } from '../logic/finance'
import { currentEventId, eventOptions, isOptionLocked } from '../logic/season'
import { useGameStore } from './gameStore'

const store = useGameStore
const s = (): ReturnType<typeof store.getState> => store.getState()

/** Reparte los puntos libres del modo (12 en la Normal) entre varios atributos. */
function spendAllPoints(): void {
  for (const id of ['finishing', 'pace', 'offTheBall', 'composure'] as const) {
    for (let i = 0; i < 6; i++) s().allocatePoint(id, 1)
  }
}

/** Reparte los puntos de fin de temporada que haya (todos en definición o en lo que quepa). */
async function spendPendingPoints(): Promise<void> {
  const career = s().career
  if (!career || career.pendingPoints === 0) return
  // Desde el hub (o el resumen) se abre la pantalla de puntos; jugar ya no obliga a repartirlos.
  s().openTrainingPoints()
  expect(s().screen).toBe('trainingPoints')
  const allocation: Record<string, number> = {}
  let left = career.pendingPoints
  const max = attributeScale(career.mode)
  for (const [id, value] of Object.entries(career.attributes)) {
    const room = Math.min(left, max - value)
    if (room > 0) allocation[id] = room
    left -= room
    if (left === 0) break
  }
  await s().applyTrainingPoints(allocation)
  expect(s().career?.pendingPoints).toBe(0)
}

/** Pasos 1 y 2: nombre válido y modo por defecto (Normal). */
function toOrigins(name = 'Test'): void {
  s().setDraftName(name)
  s().confirmCharacter()
  s().confirmMode()
}

/**
 * Firma con el origen "potrero" de Argentina. La Rápida y la Normal ya no se eligen al
 * crear partida, pero las guardadas siguen jugándose: aquí se fuerza el modo en el borrador.
 */
async function signWithArgentinianStreetOrigin(
  name: string,
  modeId: GameModeId = 'completa'
): Promise<void> {
  s().startNewGame()
  store.setState((st) => ({ draft: { ...st.draft, mode: defaultMode(modeId) } }))
  toOrigins(name)
  s().selectOrigin('arg-potrero')
  s().confirmOrigin()
  spendAllPoints()
  s().confirmAttributes()
  s().selectClub(offeredClub(2))
  s().confirmClub()
  await s().signContract()
}

/** Primera opción que se puede elegir (las que no puedes pagar salen bloqueadas). */
function firstAvailableOption(): number {
  const career = s().career
  const eventId = career && currentEventId(career)
  if (!career || !eventId) return 0
  const event = getEvent(eventId)
  return Math.max(
    0,
    eventOptions(event, career).findIndex((o) => !isOptionLocked(event, o, career))
  )
}

/** Club de la oferta `index` (0 grande, 1 medio, 2 modesto) de esta partida. */
function offeredClub(index: number): string {
  const { draft } = s()
  return getClubOffers(
    draft.character.nationalityId,
    draft.originId ?? draft.extraOriginId,
    draft.offerSeed
  )[index].club.id
}

describe('flujo de nueva partida', () => {
  beforeEach(() => s().backToMenu())

  it('empieza en el menú principal', () => {
    expect(s().screen).toBe('mainMenu')
  })

  it('Nueva Partida abre la creación con valores por defecto', () => {
    s().startNewGame()
    expect(s().screen).toBe('characterCreation')
    expect(s().draft.character).toEqual({
      name: '',
      sex: 'M',
      foot: 'derecha',
      position: 'DC',
      nationalityId: 'ARG'
    })
    expect(s().draft.originId).toBeNull()
    // Por ahora solo la Completa (15 temporadas) y la Personalizada.
    expect(s().draft.mode).toEqual({ id: 'completa', seasons: 15, decisionInterval: 1 })
    expect(s().draft.extraOriginId).toMatch(/^extra-/)
  })

  it('no deja continuar sin nombre válido', () => {
    s().startNewGame()
    expect(s().confirmCharacter()).toBe(false)
    expect(s().screen).toBe('characterCreation')
  })

  it('paso 1 → 2: limpia el nombre, guarda la nacionalidad y pasa al modo de juego', () => {
    s().startNewGame()
    s().setDraftName('  Lionel   Test ')
    s().changeNationality(1)
    s().changeNationality(1)
    expect(s().confirmCharacter()).toBe(true)
    expect(s().screen).toBe('modeSelection')
    // El nombre va siempre en mayúsculas.
    expect(s().draft.character.name).toBe('LIONEL TEST')
    expect(s().draft.character.nationalityId).toBe('ESP')
  })

  it('paso 2: se puede elegir un modo personalizado', () => {
    s().startNewGame()
    s().setDraftName('Test')
    s().confirmCharacter()
    s().setMode({ id: 'personalizada', seasons: 25, decisionInterval: 3 })
    s().confirmMode()
    expect(s().screen).toBe('originSelection')
    expect(s().draft.mode.seasons).toBe(25)
  })

  it('paso 1: el nombre se escribe en mayúsculas (con tildes y eñes) y se elige la pierna buena', () => {
    s().startNewGame()
    expect(s().draft.character.foot).toBe('derecha')
    s().setDraftName('iñaki núñez')
    expect(s().draft.character.name).toBe('IÑAKI NÚÑEZ')
    s().setFoot('izquierda')
    expect(s().draft.character.foot).toBe('izquierda')
    s().confirmCharacter()
    s().previousStep()
    expect(s().draft.character.foot).toBe('izquierda')
  })

  it('paso 2: la Rápida y la Normal no se pueden elegir por ahora', () => {
    s().startNewGame()
    s().setDraftName('Test')
    s().confirmCharacter()
    s().setMode(defaultMode('rapida'))
    s().setMode(defaultMode('normal'))
    expect(s().draft.mode.id).toBe('completa')
    s().setMode(defaultMode('personalizada'))
    expect(s().draft.mode.id).toBe('personalizada')
  })

  it('cambiar de país descarta un origen nacional pero conserva el especial', () => {
    s().startNewGame()
    toOrigins()
    s().selectOrigin('arg-potrero')
    s().changeNationality(1)
    expect(s().draft.originId).toBeNull()
    const extra = s().draft.extraOriginId
    s().selectOrigin(extra)
    s().changeNationality(1)
    expect(s().draft.originId).toBe(extra)
  })

  it('no deja pasar del origen sin elegir uno', () => {
    s().startNewGame()
    toOrigins()
    expect(s().confirmOrigin()).toBe(false)
    s().selectOrigin('arg-potrero')
    expect(s().confirmOrigin()).toBe(true)
    expect(s().screen).toBe('attributes')
  })

  it('exige gastar todos los puntos y cambiar de origen los reinicia', () => {
    s().startNewGame()
    toOrigins()
    s().selectOrigin('arg-potrero')
    s().confirmOrigin()
    expect(s().confirmAttributes()).toBe(false)
    s().allocatePoint('finishing', 1)
    expect(s().draft.allocation.finishing).toBe(1)

    s().selectOrigin('arg-pension')
    expect(s().draft.allocation.finishing).toBe(0)

    spendAllPoints()
    expect(s().confirmAttributes()).toBe(true)
    expect(s().screen).toBe('clubSelection')
  })

  it('previousStep vuelve atrás sin perder datos', () => {
    s().startNewGame()
    toOrigins()
    s().selectOrigin('arg-liga-regional')
    s().confirmOrigin()
    s().previousStep()
    expect(s().screen).toBe('originSelection')
    expect(s().draft.originId).toBe('arg-liga-regional')
    s().previousStep()
    expect(s().screen).toBe('modeSelection')
    s().previousStep()
    expect(s().screen).toBe('characterCreation')
    expect(s().draft.character.name).toBe('TEST')
  })

  it('firmar crea la carrera y abre el hub', async () => {
    s().startNewGame()
    s().setFoot('izquierda')
    toOrigins('Test Final') // Argentina
    s().selectOrigin('arg-hijo-del-tanque')
    s().confirmOrigin()
    spendAllPoints()
    s().confirmAttributes()
    const club = offeredClub(1)
    s().selectClub(club)
    expect(s().confirmClub()).toBe(true)
    // Antes de firmar, el resumen.
    expect(s().screen).toBe('creationSummary')
    expect(s().career).toBeNull()
    s().previousStep()
    expect(s().screen).toBe('clubSelection')
    expect(s().draft.clubId).toBe(club)
    s().confirmClub()
    expect(await s().signContract()).toBe(true)

    const career = s().career
    expect(s().screen).toBe('careerHub')
    expect(career?.character.name).toBe('TEST FINAL')
    expect(career?.clubId).toBe(club)
    expect(career?.season).toBe(1)
    expect(career?.age).toBe(17)
    expect(career?.flags.firstClubOriginBond).toBe(true) // el club donde su padre es ídolo
    expect(career?.mode).toEqual({ id: 'completa', seasons: 15, decisionInterval: 1 })
    expect(career?.character.foot).toBe('izquierda')
  })

  it('Volver al menú descarta el borrador', () => {
    s().startNewGame()
    s().setDraftName('Borrador')
    s().backToMenu()
    expect(s().screen).toBe('mainMenu')
    expect(s().draft.character.name).toBe('')
    expect(s().career).toBeNull()
  })
})

describe('menú Extras', () => {
  beforeEach(() => s().backToMenu())

  it('Extras → Orígenes → volver', () => {
    s().openExtras()
    expect(s().screen).toBe('extras')
    s().openOriginCatalog()
    expect(s().screen).toBe('originCatalog')
    s().openExtras()
    s().backToMenu()
    expect(s().screen).toBe('mainMenu')
  })
})

describe('temporada', () => {
  beforeEach(() => s().backToMenu())

  it('modo normal: temporada con decisiones, temporada simulada y mercado', async () => {
    await signWithArgentinianStreetOrigin('Test Temporada', 'normal')

    s().playSeason()
    expect(s().screen).toBe('seasonEvent')
    const total = s().career?.seasonProgress?.eventIds.length ?? 0
    expect(total).toBe(4)

    for (let i = 0; i < total; i++) {
      expect(s().screen).toBe('seasonEvent')
      await s().chooseOption(firstAvailableOption())
      expect(s().lastChoice).not.toBeNull()
      // No se puede elegir dos veces el mismo evento.
      await s().chooseOption(1)
      expect(s().career?.seasonProgress?.resolutions).toHaveLength(i + 1)
      await s().continueSeason()
    }

    expect(s().screen).toBe('seasonSummary')
    expect(s().lastRecord?.season).toBe(1)
    expect(s().lastRecord?.clubMatches?.length).toBeGreaterThanOrEqual(30)
    expect(s().career?.season).toBe(2)
    expect(s().career?.history).toHaveLength(1)
    expect(s().career?.money).toBeGreaterThan(0)

    s().openTrophyRoom()
    expect(s().screen).toBe('trophyRoom')
    s().openCompetitions()
    expect(s().screen).toBe('competitions')
    s().openContract()
    expect(s().screen).toBe('contract')
    s().backToHub()
    expect(s().screen).toBe('careerHub')

    // Con puntos de fin de temporada pendientes, primero se reparten.
    await spendPendingPoints()

    // Temporada 2 (modo normal): sin decisiones ni mercado, se simula de golpe.
    s().playSeason()
    expect(s().screen).toBe('seasonSummary')
    expect(s().career?.season).toBe(3)
    s().backToHub()
    await spendPendingPoints()

    // Antes de la temporada 3 (con decisiones) toca el mercado de fichajes.
    s().playSeason()
    expect(s().screen).toBe('transferMarket')
    await s().resolveMarket(null)
    expect(s().screen).toBe('careerHub')
    expect(s().marketMessage).toContain('Te quedas') // el contrato llega hasta la temporada 3
    s().playSeason()
    expect(s().screen).toBe('seasonEvent')
    expect(s().career?.seasonProgress?.eventIds).not.toContain('debut')
  })

  it('con dinero se compran mejoras y quedan en la lista de gastos', async () => {
    await signWithArgentinianStreetOrigin('Test Tienda')

    // Sin dinero no se puede comprar.
    const career = s().career
    if (!career) throw new Error('sin carrera')
    const item = shopOffer(career)
      .filter((i) => i.limit === 'once')
      .sort((a, b) => a.cost - b.cost)[0]
    expect(await s().buyUpgrade(item.id)).toBe(false)
    store.setState({ career: { ...career, money: item.cost + 2_000 } })
    expect(await s().buyUpgrade(item.id)).toBe(true)
    expect(s().career?.money).toBe(2_000)
    expect(s().career?.purchases).toHaveLength(1)
    expect(s().career?.purchases[0].itemId).toBe(item.id)
    // Es de una sola vez.
    store.setState({ career: { ...(s().career as typeof career), money: item.cost + 2_000 } })
    expect(await s().buyUpgrade(item.id)).toBe(false)
  })
})
