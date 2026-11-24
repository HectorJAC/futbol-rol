import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { getClub } from '../data/clubs'
import { formatMoney, getShopItem, type ShopCategory } from '../data/shop'
import { careerCurrency } from '../logic/season'
import { t } from '../i18n/es'
import { seasonYearLabel } from '../logic/competitions'
import {
  canBuy,
  contractYearsLeft,
  monthlyWage,
  purchaseSummary,
  shopOffer,
  totalSpent
} from '../logic/finance'
import { careerScale, scaledDeltas } from '../logic/playerAttributes'
import { useGameStore } from '../store/gameStore'

type Tab = 'contract' | 'shop' | 'expenses'

const CATEGORIES: ShopCategory[] = [
  'Entrenamiento',
  'Equipo personal',
  'Equipamiento',
  'Formación',
  'Familia'
]

/** Contrato actual, tienda de mejoras con el dinero ganado y lista de gastos. */
export function Contract(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const buyUpgrade = useGameStore((s) => s.buyUpgrade)
  const [tab, setTab] = useState<Tab>('contract')
  const [busy, setBusy] = useState(false)

  if (!career) return <></>
  const contract = career.contract
  const club = getClub(contract.clubId)
  const yearsLeft = contractYearsLeft(career)
  const seasonsWithEarnings = career.history.filter((r) => r.earnings)
  const offer = shopOffer(career)
  const currency = careerCurrency(career)
  const money = (amount: number): string => formatMoney(amount, currency)

  const buy = async (itemId: string): Promise<void> => {
    setBusy(true)
    await buyUpgrade(itemId)
    setBusy(false)
  }

  return (
    <div className="screen contract-screen">
      <header className="competitions__header">
        <div>
          <span className="eyebrow">{t.contract.eyebrow}</span>
          <h1 className="screen-title">{t.contract.title}</h1>
        </div>
        <div className="money-badge" data-testid="money">
          <span>{t.contract.balance}</span>
          <strong>{money(career.money)}</strong>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {(
          [
            ['contract', t.contract.contractTab],
            ['shop', t.contract.shopTab],
            ['expenses', t.contract.expensesTab]
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab${tab === id ? ' tab--active' : ''}`}
            onClick={() => setTab(id)}
            data-testid={`contract-tab-${id}`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="panel competitions__body">
        {tab === 'contract' && (
          <div className="contract-grid">
            <div>
              <div className="summary-club">
                <ClubCrest club={club} size={48} />
                <div>
                  <strong>{club.name}</strong>
                  <span>
                    {t.contract.role}: <b>{contract.role}</b>
                  </span>
                </div>
              </div>
              <dl className="info-list contract-terms" data-testid="contract-terms">
                <div>
                  <dt>{t.contract.wage}</dt>
                  <dd>
                    {money(contract.weeklyWage)}
                    {t.contract.perWeek} ({money(contract.weeklyWage * 52)} {t.contract.perSeason})
                  </dd>
                </div>
                <div>
                  <dt>{t.contract.monthly}</dt>
                  <dd data-testid="monthly-wage">{money(monthlyWage(contract))}</dd>
                </div>
                <div>
                  <dt>{t.contract.goalBonus}</dt>
                  <dd>{money(contract.goalBonus)}</dd>
                </div>
                <div>
                  <dt>{t.contract.titleBonus}</dt>
                  <dd>{money(contract.titleBonus)}</dd>
                </div>
                <div>
                  <dt>{t.contract.releaseClause}</dt>
                  <dd>{money(contract.releaseClause)}</dd>
                </div>
                <div>
                  <dt>{t.contract.until}</dt>
                  <dd>
                    {contract.endSeason} ({seasonYearLabel(contract.endSeason)})
                  </dd>
                </div>
                <div>
                  <dt>{t.contract.yearsLeft}</dt>
                  <dd>{yearsLeft > 0 ? yearsLeft : t.contract.expired}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="panel-title">{t.contract.earnings}</h2>
              {seasonsWithEarnings.length === 0 ? (
                <p className="field__hint">{t.contract.noEarnings}</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.trophies.season}</th>
                      <th className="num">{t.contract.salary}</th>
                      <th className="num">{t.contract.bonuses}</th>
                      <th className="num">{t.contract.events}</th>
                      <th className="num">{t.contract.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonsWithEarnings.map((r) => {
                      const e = r.earnings as NonNullable<typeof r.earnings>
                      return (
                        <tr key={r.season}>
                          <td>{r.yearLabel}</td>
                          <td className="num">{money(e.salary)}</td>
                          <td className="num">{money(e.goalBonus + e.titleBonus)}</td>
                          <td className="num">{money(e.events)}</td>
                          <td className="num">
                            <strong>
                              {money(e.salary + e.goalBonus + e.titleBonus + e.events)}
                            </strong>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'shop' && <p className="competitions__note">{t.contract.shopRotation}</p>}
        {tab === 'shop' &&
          CATEGORIES.filter((category) => offer.some((i) => i.category === category)).map(
            (category) => (
              <div key={category} className="shop-category">
                <h2 className="panel-title">{category}</h2>
                <div className="shop-grid">
                  {offer
                    .filter((i) => i.category === category)
                    .map((item) => {
                      const check = canBuy(career, item)
                      return (
                        <article key={item.id} className="shop-item" data-testid="shop-item">
                          <div className="shop-item__top">
                            <strong>{item.name}</strong>
                            <span className="shop-item__cost">{money(item.cost)}</span>
                          </div>
                          <span className="shop-item__limit">
                            {item.limit === 'once' ? t.contract.once : t.contract.perSeasonLimit}
                          </span>
                          <p>{item.description}</p>
                          <div className="shop-item__bottom">
                            <span className="modifier modifier--up">
                              {purchaseSummary({
                                attributes: scaledDeltas(
                                  item.attributes ?? {},
                                  careerScale(career)
                                ),
                                morale: item.morale,
                                reputation: item.reputation
                              })}
                            </span>
                            <button
                              type="button"
                              className="btn btn--primary btn--compact"
                              onClick={() => buy(item.id)}
                              disabled={!check.ok || busy}
                              title={check.ok ? undefined : check.reason}
                              data-testid={`buy-${item.id}`}
                            >
                              {check.ok ? t.contract.buy : check.short}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                </div>
              </div>
            )
          )}

        {tab === 'expenses' &&
          (career.purchases.length === 0 ? (
            <p className="field__hint">{t.contract.expensesEmpty}</p>
          ) : (
            <>
              <table className="data-table" data-testid="expenses">
                <thead>
                  <tr>
                    <th>{t.trophies.season}</th>
                    <th>{t.contract.item}</th>
                    <th className="num">{t.contract.cost}</th>
                    <th>{t.contract.gained}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...career.purchases].reverse().map((p, i) => (
                    <tr key={`${p.itemId}-${p.season}-${i}`}>
                      <td>{seasonYearLabel(p.season)}</td>
                      <td>{getShopItem(p.itemId).name}</td>
                      <td className="num">{money(p.cost)}</td>
                      <td>{purchaseSummary(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="contract-total">
                {t.contract.spent}: <strong>{money(totalSpent(career))}</strong>
              </p>
            </>
          ))}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.contract.back}
        </button>
      </footer>
    </div>
  )
}
