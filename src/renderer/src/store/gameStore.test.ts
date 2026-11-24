import { beforeEach, describe, expect, it } from 'vitest'
import { attributeScale } from '../data/gameModes'
import { shopOffer } from '../logic/finance'
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

async function signWithArgentinianStreetOrigin(name: string): Promise<void> {
  s().startNewGame()
  toOrigins(name)
  s().selectOrigin('arg-potrero')
  s().confirmOrigin()
  spendAllPoints()
  s().confirmAttributes()
  s().selectClub('arg-quilmez')
  await s().confirmClub()
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
      position: 'DC',
      nationalityId: 'ARG'
    })
    expect(s().draft.originId).toBeNull()
    expect(s().draft.mode).toEqual({ id: 'normal', seasons: 20, decisionInterval: 2 })
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
    expect(s().draft.character.name).toBe('Lionel Test')
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
    expect(s().draft.character.name).toBe('Test')
  })

  it('firmar crea la carrera y abre el hub', async () => {
    s().startNewGame()
    toOrigins('Test Final') // Argentina
    s().selectOrigin('arg-hijo-del-tanque')
    s().confirmOrigin()
    spendAllPoints()
    s().confirmAttributes()
    s().selectClub('arg-lanuz')
    expect(await s().confirmClub()).toBe(true)

    const career = s().career
    expect(s().screen).toBe('careerHub')
    expect(career?.character.name).toBe('Test Final')
    expect(career?.clubId).toBe('arg-lanuz')
    expect(career?.season).toBe(1)
    expect(career?.age).toBe(17)
    expect(career?.flags.firstClubOriginBond).toBe(true) // el club donde su padre es ídolo
    expect(career?.mode.id).toBe('normal')
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
    await signWithArgentinianStreetOrigin('Test Temporada')

    s().playSeason()
    expect(s().screen).toBe('seasonEvent')
    const total = s().career?.seasonProgress?.eventIds.length ?? 0
    expect(total).toBe(4)

    for (let i = 0; i < total; i++) {
      expect(s().screen).toBe('seasonEvent')
      await s().chooseOption(0)
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
