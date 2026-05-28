import React from 'react'
import { useLang, LANGUAGES } from '../context/LanguageContext'

function Section({ title, children }) {
  return (
    <div className="card-base mb-4">
      <h3 className="font-bold text-sm uppercase tracking-wider text-poke-muted mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Settings() {
  const { lang, changeLang } = useLang()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title mb-2">Paramètres</h1>
          <p className="text-poke-muted">Personnalisez votre expérience PokéVault.</p>
        </div>

        {/* Language */}
        <Section title="Langue et région">
          <p className="text-sm text-poke-muted mb-4">
            La langue choisie détermine l'affichage des noms d'extensions, de séries et des cartes sur tout le site.
            Par défaut, les cartes françaises correspondent aux impressions internationales.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LANGUAGES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 font-semibold transition-all duration-200 ${
                  lang === code
                    ? 'border-poke-yellow bg-poke-yellow/10 text-poke-yellow'
                    : 'border-poke-border text-poke-muted hover:border-poke-muted hover:text-white'
                }`}
              >
                <span className="text-2xl">{flag}</span>
                <div className="text-left">
                  <div className="text-sm font-bold">{label}</div>
                  {lang === code && (
                    <div className="text-xs opacity-70">Langue active</div>
                  )}
                </div>
                {lang === code && (
                  <span className="ml-auto text-poke-yellow">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-poke-yellow/5 border border-poke-yellow/20 rounded-xl">
            <p className="text-xs text-poke-muted leading-relaxed">
              <span className="text-poke-yellow font-semibold">ℹ️ Note :</span> Les noms de cartes affichés correspondent aux données
              de l'API Pokémon TCG (majoritairement en anglais). Les traductions françaises sont appliquées pour les extensions et les Pokémon courants.
              La traduction complète des noms de cartes sera disponible dans une prochaine mise à jour.
            </p>
          </div>
        </Section>

        {/* Display */}
        <Section title="Affichage">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Thème</p>
                <p className="text-xs text-poke-muted">Mode sombre (par défaut)</p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                Bientôt
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-poke-border/50">
              <div>
                <p className="text-sm font-medium">Devise</p>
                <p className="text-xs text-poke-muted">Euro (€) — France</p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                Bientôt
              </span>
            </div>
          </div>
        </Section>

        {/* Data */}
        <Section title="Données et stockage">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Données de collection</p>
                <p className="text-xs text-poke-muted">Sauvegardées localement dans votre navigateur</p>
              </div>
              <span className="text-xs text-green-400 bg-green-900/20 border border-green-700/30 px-3 py-1 rounded-lg">
                Actif
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-poke-border/50">
              <div>
                <p className="text-sm font-medium">Synchronisation cloud</p>
                <p className="text-xs text-poke-muted">Sauvegardez et accédez depuis n'importe quel appareil</p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                Premium
              </span>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="À propos">
          <div className="space-y-2 text-sm text-poke-muted">
            <div className="flex justify-between"><span>Version</span><span className="text-white">1.0.0</span></div>
            <div className="flex justify-between"><span>Source des données</span><span className="text-white">Pokémon TCG API</span></div>
            <div className="flex justify-between"><span>Source des prix</span><span className="text-white">CardMarket & TCGPlayer</span></div>
            <div className="flex justify-between"><span>Stockage local</span><span className="text-white">localStorage</span></div>
          </div>
        </Section>
      </div>
    </div>
  )
}
