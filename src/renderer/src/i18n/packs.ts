/**
 * Forma de los "paquetes de texto" de un idioma para el contenido del juego
 * (eventos, jugadas, orígenes, tienda…). Cada idioma escribe sus propios textos
 * para las mismas situaciones: la mecánica (efectos, tiradas, condiciones) es
 * la de los datos y no cambia con el idioma.
 *
 * Reglas:
 * - Las claves son los `id` de los datos.
 * - `options` va en el mismo orden y con la misma cantidad que en los datos.
 * - `outcome` solo si la opción tiene `outcome`; `success` y `failure` solo si
 *   tiene tirada (`check`).
 * - Los marcadores (`{veterano}`, `{pareja}`, `{rival}`, `{dinero:15000}`…) se
 *   dejan tal cual: el juego los rellena.
 */

/** Textos de una opción de un evento de temporada. */
export interface OptionText {
  label: string
  /** Texto del resultado de una opción sin tirada (`outcome.text`). */
  outcome?: string
  /** Texto si la tirada sale bien (`check.success.text`). */
  success?: string
  /** Texto si la tirada sale mal (`check.failure.text`). */
  failure?: string
}

/** Textos de un evento de temporada (`GameEvent`). */
export interface EventText {
  title: string
  text: string
  options: OptionText[]
}

/** Textos de una opción de una jugada de partido importante. */
export interface MomentOptionText extends OptionText {
  /** Si la opción tiene `asCaptain`: lo mismo, dicho cuando eres el capitán. */
  asCaptain?: { label: string; success?: string; failure?: string }
}

/** Textos de una jugada de partido importante (`MatchMoment`). */
export interface MomentText {
  title: string
  text: string
  /** Solo si la jugada tiene `youngText`. */
  youngText?: string
  options: MomentOptionText[]
}

/** Textos de un origen (`Origin`). */
export interface OriginText {
  name: string
  tagline: string
  story: string
  advantage: string
  drawback: string
  /** Solo si el origen tiene `clubBond`: la etiqueta del club con vínculo. */
  clubBondTag?: string
}

/** Textos de un artículo de la tienda (`ShopItem`). */
export interface ShopItemText {
  name: string
  description: string
}

/** Textos de un enfoque de "Horas extra" (`TrainingFocus`). */
export interface TrainingFocusText {
  label: string
  text: string
}

/** Textos de un título (`TrophyInfo`). */
export interface TrophyText {
  name: string
  description: string
}
