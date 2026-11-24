import type { NationalityId } from '../nationalities'
import { ARG_LEAGUES } from './arg'
import { BRA_LEAGUES } from './bra'
import { ENG_LEAGUES } from './eng'
import { ESP_LEAGUES } from './esp'
import { FRA_LEAGUES } from './fra'
import { GER_LEAGUES } from './ger'
import { ITA_LEAGUES } from './ita'
import { JPN_LEAGUES } from './jpn'
import type { CountryLeagues } from './types'
import { USA_LEAGUES } from './usa'

/** Primera y segunda división de cada país. */
export const LEAGUES: Record<NationalityId, CountryLeagues> = {
  ARG: ARG_LEAGUES,
  BRA: BRA_LEAGUES,
  ESP: ESP_LEAGUES,
  FRA: FRA_LEAGUES,
  ENG: ENG_LEAGUES,
  GER: GER_LEAGUES,
  ITA: ITA_LEAGUES,
  JPN: JPN_LEAGUES,
  USA: USA_LEAGUES
}

export type { ClubSeed, CountryLeagues } from './types'
