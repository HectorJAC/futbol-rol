import { AttributeAllocation } from './screens/AttributeAllocation'
import { BuildBadge } from './components/BuildBadge'
import { CareerDetail } from './screens/CareerDetail'
import { Credits } from './screens/Credits'
import { CareerHub } from './screens/CareerHub'
import { CharacterCreation } from './screens/CharacterCreation'
import { ClubSearch } from './screens/ClubSearch'
import { ClubSelection } from './screens/ClubSelection'
import { CreationSummary } from './screens/CreationSummary'
import { Competitions } from './screens/Competitions'
import { Contract } from './screens/Contract'
import { Extras } from './screens/Extras'
import { Match } from './screens/Match'
import { ModeSelection } from './screens/ModeSelection'
import { OriginCatalog } from './screens/OriginCatalog'
import { TrainingPoints } from './screens/TrainingPoints'
import { LoadGame } from './screens/LoadGame'
import { MainMenu } from './screens/MainMenu'
import { OriginSelection } from './screens/OriginSelection'
import { Records } from './screens/Records'
import { RelationHistory } from './screens/RelationHistory'
import { Relationships } from './screens/Relationships'
import { Settings } from './screens/Settings'
import { SeasonEvent } from './screens/SeasonEvent'
import { SeasonSummary } from './screens/SeasonSummary'
import { TransferMarket } from './screens/TransferMarket'
import { TrophyRoom } from './screens/TrophyRoom'
import { useEffect } from 'react'
import { applyMotionSetting } from './logic/motion'
import { useGameStore, type Screen } from './store/gameStore'

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  mainMenu: MainMenu,
  loadGame: LoadGame,
  characterCreation: CharacterCreation,
  originSelection: OriginSelection,
  attributes: AttributeAllocation,
  clubSelection: ClubSelection,
  creationSummary: CreationSummary,
  careerHub: CareerHub,
  seasonEvent: SeasonEvent,
  seasonSummary: SeasonSummary,
  trophyRoom: TrophyRoom,
  transferMarket: TransferMarket,
  records: Records,
  careerDetail: CareerDetail,
  credits: Credits,
  settings: Settings,
  relationships: Relationships,
  relationHistory: RelationHistory,
  modeSelection: ModeSelection,
  extras: Extras,
  originCatalog: OriginCatalog,
  competitions: Competitions,
  match: Match,
  contract: Contract,
  trainingPoints: TrainingPoints,
  clubSearch: ClubSearch
}

/** Muestra la pantalla actual según el estado del juego. */
function App(): React.JSX.Element {
  const screen = useGameStore((s) => s.screen)
  const language = useGameStore((s) => s.language)
  const setGameLanguage = useGameStore((s) => s.setGameLanguage)
  const Current = SCREENS[screen]

  // Aplica los ajustes guardados al arrancar (animaciones e idioma).
  useEffect(() => {
    window.api.settings
      .get()
      .then((s) => {
        applyMotionSetting(s.animations)
        setGameLanguage(s.language)
      })
      .catch(() => {})
  }, [setGameLanguage])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <div className="app">
      <div className="app__backdrop" aria-hidden="true" />
      {/* Al cambiar de idioma la pantalla se vuelve a montar con los textos nuevos. */}
      <Current key={`${screen}:${language}`} />
      <BuildBadge />
    </div>
  )
}

export default App
