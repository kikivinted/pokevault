import React from 'react'
import { useLang, useT, LANGUAGES } from '../context/LanguageContext'

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
  const t = useT()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title mb-2">{t('settings_title')}</h1>
        </div>

        {/* Language */}
        <Section title={t('settings_lang')}>
          <p className="text-sm text-poke-muted mb-5 leading-relaxed">
            {t('settings_lang_note')}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                  lang === code
                    ? 'border-poke-yellow bg-poke-yellow/10 text-poke-yellow'
                    : 'border-poke-border text-poke-muted hover:border-poke-muted hover:text-white'
                }`}
              >
                <span className="text-3xl">{flag}</span>
                <div className="text-left">
                  <div className="font-bold">{label}</div>
                  {lang === code && (
                    <div className="text-xs opacity-70">{t('settings_active')}</div>
                  )}
                </div>
                {lang === code && <span className="ml-auto text-poke-yellow text-lg">✓</span>}
              </button>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-poke-yellow/5 border border-poke-yellow/20 rounded-xl">
            <p className="text-xs text-poke-muted leading-relaxed">
              <span className="text-poke-yellow font-semibold">ℹ️</span>{' '}
              {lang === 'fr' && "Les cartes affichées sont celles des impressions internationales (également disponibles en français). Les noms de Pokémon et d'extensions sont traduits en français."}
              {lang === 'en' && "Cards displayed are from international prints. Pokémon and set names are shown in English."}
              {lang === 'jp' && "表示されているカードは国際版（日本版と異なる場合があります）。日本語版のカードは「シリーズ」→「日本語」タブでご確認ください。"}
              {lang === 'zh' && "显示的卡牌来自国际版印刷。中文版卡牌请在「系列」→「中文」标签页查看。"}
            </p>
          </div>
        </Section>

        {/* Display */}
        <Section title={t('settings_display')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'fr' ? 'Thème' : lang === 'en' ? 'Theme' : lang === 'jp' ? 'テーマ' : '主题'}
                </p>
                <p className="text-xs text-poke-muted">
                  {lang === 'fr' ? 'Mode sombre (par défaut)' : lang === 'en' ? 'Dark mode (default)' : lang === 'jp' ? 'ダークモード（デフォルト）' : '深色模式（默认）'}
                </p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                {t('settings_soon')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-poke-border/50">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'fr' ? 'Devise' : lang === 'en' ? 'Currency' : lang === 'jp' ? '通貨' : '货币'}
                </p>
                <p className="text-xs text-poke-muted">Euro (€)</p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                {t('settings_soon')}
              </span>
            </div>
          </div>
        </Section>

        {/* Data */}
        <Section title={t('settings_data')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'fr' ? 'Données de collection' : lang === 'en' ? 'Collection data' : lang === 'jp' ? 'コレクションデータ' : '收藏数据'}
                </p>
                <p className="text-xs text-poke-muted">
                  {lang === 'fr' ? 'Sauvegardées localement' : lang === 'en' ? 'Saved locally' : lang === 'jp' ? 'ローカルに保存済み' : '本地保存'}
                </p>
              </div>
              <span className="text-xs text-green-400 bg-green-900/20 border border-green-700/30 px-3 py-1 rounded-lg">
                ✓ Actif
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-poke-border/50">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'fr' ? 'Synchronisation cloud' : lang === 'en' ? 'Cloud sync' : lang === 'jp' ? 'クラウド同期' : '云同步'}
                </p>
                <p className="text-xs text-poke-muted">
                  {lang === 'fr' ? 'Accès multi-appareils' : lang === 'en' ? 'Multi-device access' : lang === 'jp' ? 'マルチデバイス対応' : '多设备访问'}
                </p>
              </div>
              <span className="text-xs bg-poke-card border border-poke-border px-3 py-1 rounded-lg text-poke-muted">
                Premium
              </span>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title={lang === 'fr' ? 'À propos' : lang === 'en' ? 'About' : lang === 'jp' ? 'について' : '关于'}>
          <div className="space-y-2 text-sm text-poke-muted">
            <div className="flex justify-between"><span>Version</span><span className="text-white">1.0.0</span></div>
            <div className="flex justify-between"><span>{lang === 'fr' ? 'Données' : 'Data'}</span><span className="text-white">Pokémon TCG API</span></div>
            <div className="flex justify-between"><span>{lang === 'fr' ? 'Prix' : 'Prices'}</span><span className="text-white">CardMarket · TCGPlayer</span></div>
          </div>
        </Section>
      </div>
    </div>
  )
}
