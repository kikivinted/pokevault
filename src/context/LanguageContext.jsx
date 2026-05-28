import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'jp', label: '日本語',    flag: '🇯🇵' },
  { code: 'zh', label: '中文',      flag: '🇨🇳' },
]

// ── UI strings ────────────────────────────────────────────────────────────────
export const UI = {
  fr: {
    nav_home: 'Accueil',      nav_series: 'Séries',      nav_scan: 'Scan',
    nav_binder: 'Classeur',   nav_market: 'Marché',      nav_settings: 'Paramètres',
    search_placeholder: 'Rechercher une carte Pokémon…',
    search_btn: 'Rechercher', search_close: 'Fermer',
    add: '+ Ajouter',         added: '✓ Ajouté',
    owned: 'Possédée',        wishlist_add: 'Wishlist',
    series_title: 'Séries Pokémon TCG',
    series_tabs_fr: 'Français', series_tabs_en: 'English',
    series_tabs_jp: 'Japonais', series_tabs_zh: 'Chinois',
    sets_count: (n) => `${n} extension${n>1?'s':''}`,
    cards_count: (n) => `${n.toLocaleString('fr-FR')} cartes`,
    all_rarities: 'Toutes', prev: '← Précédent', next: 'Suivant →',
    page_of: (a,b) => `Page ${a} / ${b}`,
    scan_title: 'Scanner une carte',   binder_title: 'Classeur',
    market_title: 'Marché',            settings_title: 'Paramètres',
    settings_lang: 'Langue et région', settings_display: 'Affichage',
    settings_data: 'Données et stockage',
    settings_lang_note: 'La langue active détermine la langue de l\'interface et les noms affichés sur tout le site.',
    settings_active: 'Langue active',  settings_soon: 'Bientôt',
    loading: 'Chargement…',            empty_collection: 'Collection vide',
    empty_scan: 'Classeur vide',       flip_hint: '🔄 Voir verso',
    scan_front: 'Recto', scan_back: 'Verso', scan_save: '💾 Sauvegarder',
    filter_lang: 'Langue des cartes',
    filter_lang_fr: '🇫🇷 Français (international)',
    filter_lang_jp: '🇯🇵 Japonais',
    filter_lang_en: '🇬🇧 Anglais',
    filter_lang_zh: '🇨🇳 Chinois',
    coming_soon: 'Intégration en cours',
    premium_label: 'Bientôt', premium_title: 'PokéVault Premium',
  },
  en: {
    nav_home: 'Home',         nav_series: 'Series',      nav_scan: 'Scan',
    nav_binder: 'Binder',     nav_market: 'Market',      nav_settings: 'Settings',
    search_placeholder: 'Search for a Pokémon card…',
    search_btn: 'Search',     search_close: 'Close',
    add: '+ Add',             added: '✓ Added',
    owned: 'Owned',           wishlist_add: 'Wishlist',
    series_title: 'Pokémon TCG Series',
    series_tabs_fr: 'French', series_tabs_en: 'English',
    series_tabs_jp: 'Japanese', series_tabs_zh: 'Chinese',
    sets_count: (n) => `${n} set${n>1?'s':''}`,
    cards_count: (n) => `${n.toLocaleString('en')} cards`,
    all_rarities: 'All', prev: '← Previous', next: 'Next →',
    page_of: (a,b) => `Page ${a} / ${b}`,
    scan_title: 'Scan a card',         binder_title: 'Binder',
    market_title: 'Market',            settings_title: 'Settings',
    settings_lang: 'Language & region',settings_display: 'Display',
    settings_data: 'Data & storage',
    settings_lang_note: 'The active language determines the interface language and names displayed across the site.',
    settings_active: 'Active language',settings_soon: 'Soon',
    loading: 'Loading…',               empty_collection: 'Empty collection',
    empty_scan: 'Empty binder',        flip_hint: '🔄 See back',
    scan_front: 'Front', scan_back: 'Back', scan_save: '💾 Save',
    filter_lang: 'Card language',
    filter_lang_fr: '🇫🇷 French (international)',
    filter_lang_jp: '🇯🇵 Japanese',
    filter_lang_en: '🇬🇧 English',
    filter_lang_zh: '🇨🇳 Chinese',
    coming_soon: 'Integration in progress',
    premium_label: 'Soon', premium_title: 'PokéVault Premium',
  },
  jp: {
    nav_home: 'ホーム',       nav_series: 'シリーズ',    nav_scan: 'スキャン',
    nav_binder: 'バインダー', nav_market: 'マーケット',  nav_settings: '設定',
    search_placeholder: 'ポケモンカードを検索…',
    search_btn: '検索',       search_close: '閉じる',
    add: '+ 追加',            added: '✓ 追加済み',
    owned: '所持',            wishlist_add: 'ウィッシュ',
    series_title: 'ポケモンカードゲーム シリーズ',
    series_tabs_fr: 'フランス語', series_tabs_en: '英語',
    series_tabs_jp: '日本語',     series_tabs_zh: '中国語',
    sets_count: (n) => `${n}セット`,
    cards_count: (n) => `${n.toLocaleString('ja')}枚`,
    all_rarities: 'すべて', prev: '← 前へ', next: '次へ →',
    page_of: (a,b) => `${a} / ${b}ページ`,
    scan_title: 'カードをスキャン',    binder_title: 'バインダー',
    market_title: 'マーケット',        settings_title: '設定',
    settings_lang: '言語と地域',       settings_display: '表示',
    settings_data: 'データとストレージ',
    settings_lang_note: '選択した言語はサイト全体のインターフェースと名前の表示に影響します。',
    settings_active: '現在の言語',     settings_soon: 'まもなく',
    loading: '読み込み中…',            empty_collection: 'コレクションが空です',
    empty_scan: 'バインダーが空です',  flip_hint: '🔄 裏面を見る',
    scan_front: '表面', scan_back: '裏面', scan_save: '💾 保存',
    filter_lang: 'カードの言語',
    filter_lang_fr: '🇫🇷 フランス語',
    filter_lang_jp: '🇯🇵 日本語',
    filter_lang_en: '🇬🇧 英語',
    filter_lang_zh: '🇨🇳 中国語',
    coming_soon: '統合作業中',
    premium_label: 'まもなく', premium_title: 'PokéVault プレミアム',
  },
  zh: {
    nav_home: '主页',         nav_series: '系列',        nav_scan: '扫描',
    nav_binder: '卡册',       nav_market: '市场',        nav_settings: '设置',
    search_placeholder: '搜索宝可梦卡牌…',
    search_btn: '搜索',       search_close: '关闭',
    add: '+ 添加',            added: '✓ 已添加',
    owned: '已拥有',          wishlist_add: '心愿单',
    series_title: '宝可梦集换式卡牌游戏 系列',
    series_tabs_fr: '法语', series_tabs_en: '英语',
    series_tabs_jp: '日语', series_tabs_zh: '中文',
    sets_count: (n) => `${n}个扩展包`,
    cards_count: (n) => `${n.toLocaleString('zh')}张牌`,
    all_rarities: '全部', prev: '← 上一页', next: '下一页 →',
    page_of: (a,b) => `第 ${a} / ${b} 页`,
    scan_title: '扫描卡牌',           binder_title: '卡册',
    market_title: '市场',             settings_title: '设置',
    settings_lang: '语言与地区',      settings_display: '显示',
    settings_data: '数据与存储',
    settings_lang_note: '所选语言会影响整个网站的界面语言和名称显示。',
    settings_active: '当前语言',      settings_soon: '即将推出',
    loading: '加载中…',              empty_collection: '收藏为空',
    empty_scan: '卡册为空',           flip_hint: '🔄 查看背面',
    scan_front: '正面', scan_back: '背面', scan_save: '💾 保存',
    filter_lang: '卡牌语言',
    filter_lang_fr: '🇫🇷 法语',
    filter_lang_jp: '🇯🇵 日语',
    filter_lang_en: '🇬🇧 英语',
    filter_lang_zh: '🇨🇳 中文',
    coming_soon: '集成进行中',
    premium_label: '即将推出', premium_title: 'PokéVault 高级版',
  },
}

// ── Official French TCG names (verified) ──────────────────────────────────────
export const ERA_NAMES = {
  fr: {
    'Scarlet & Violet':         'Écarlate et Violet',
    'Sword & Shield':           'Épée et Bouclier',
    'Sun & Moon':               'Soleil et Lune',
    'XY':                       'XY',
    'Black & White':            'Noir et Blanc',
    'HeartGold & SoulSilver':   'HeartGold SoulSilver',
    'Platinum':                 'Platine',
    'Diamond & Pearl':          'Diamant et Perle',
    'EX':                       'EX',
    'e-Card':                   'e-Carte',
    'Neo':                      'Néo',
    'Gym':                      'Gym',
    'Base':                     'Jeu de Base',
    'Other':                    'Autre',
  },
  en: {},  // keep original
  jp: {},
  zh: {},
}

export const SET_NAMES = {
  fr: {
    // ── Scarlet & Violet ─────────────────────────────────────────────────────
    'Scarlet & Violet':              'Écarlate et Violet',
    'Paldea Evolved':                'Évolutions à Paldea',
    'Obsidian Flames':               'Flammes Obsidiennes',
    '151':                           '151',
    'Paradox Rift':                  'Fissure Paradoxe',
    'Paldean Fates':                 'Destinées de Paldea',
    'Temporal Forces':               'Forces Temporelles',
    'Twilight Masquerade':           'Mascarade Crépusculaire',
    'Shrouded Fable':                'Fable Nébuleuse',
    'Stellar Crown':                 'Couronne Stellaire',
    'Surging Sparks':                'Étincelles Déferlantes',
    'Prismatic Evolutions':          'Évolutions Prismatiques',
    'Journey Together':              'Voyage Ensemble',
    // ── Sword & Shield ───────────────────────────────────────────────────────
    'Sword & Shield':                'Épée et Bouclier',
    'Rebel Clash':                   'Clash des Rebelles',
    'Darkness Ablaze':               'Ténèbres Embrasées',
    "Champion's Path":               'La Voie du Champion',
    'Vivid Voltage':                 'Voltage Éclatant',
    'Shining Fates':                 'Destinées Radieuses',
    'Battle Styles':                 'Styles de Combat',
    'Chilling Reign':                'Règne de Glace',
    'Evolving Skies':                'Cieux Évolutifs',
    'Celebrations':                  'Célébrations',
    'Fusion Strike':                 'Poing de Fusion',
    'Brilliant Stars':               'Étoiles Brillantes',
    'Astral Radiance':               'Zénith Suprême',
    'Pokémon GO':                    'Pokémon GO',
    'Lost Origin':                   'Origines Perdues',
    'Silver Tempest':                'Tempête Argentée',
    'Crown Zenith':                  'Zénith Royal',
    // ── Sun & Moon ───────────────────────────────────────────────────────────
    'Sun & Moon':                    'Soleil et Lune',
    'Guardians Rising':              'Gardiens Ascendants',
    'Burning Shadows':               'Ombres Ardentes',
    'Shining Legends':               'Légendes Brillantes',
    'Crimson Invasion':              'Invasion Carmin',
    'Ultra Prism':                   'Ultra-Prisme',
    'Forbidden Light':               'Lumière Interdite',
    'Celestial Storm':               'Tempête Céleste',
    'Dragon Majesty':                'Majesté des Dragons',
    'Lost Thunder':                  'Tonnerre Perdu',
    'Team Up':                       'Alliance Infaillible',
    'Unbroken Bonds':                'Liens Indestructibles',
    'Unified Minds':                 'Esprits Unis',
    'Cosmic Eclipse':                'Éclipse Cosmique',
    'Hidden Fates':                  'Destinées Cachées',
    // ── XY ───────────────────────────────────────────────────────────────────
    'XY':                            'XY',
    'Flashfire':                     'Vigueur Explosive',
    'Furious Fists':                 'Poings Furieux',
    'Phantom Forces':                'Forces Fantômes',
    'Primal Clash':                  'Choc des Primordiaux',
    'Double Crisis':                 'Double Crise',
    'Roaring Skies':                 'Cieux Rugissants',
    'Ancient Origins':               'Origines Antiques',
    'BREAKthrough':                  'Évolutions TURBO',
    'BREAKpoint':                    'Turbo Rupture',
    'Generations':                   'Générations',
    'Fates Collide':                 'Destin Scellé',
    'Steam Siege':                   'Assaut Vapeur',
    'Evolutions':                    'Évolutions',
    // ── Black & White ────────────────────────────────────────────────────────
    'Black & White':                 'Noir et Blanc',
    'Emerging Powers':               'Pouvoirs Émergents',
    'Noble Victories':               'Nobles Victoires',
    'Next Destinies':                'Prochaines Destinées',
    'Dark Explorers':                'Explorateurs des Ténèbres',
    'Dragons Exalted':               'Dragons Sublimes',
    'Boundaries Crossed':            'Frontières Franchies',
    'Plasma Storm':                  'Tempête Plasma',
    'Plasma Freeze':                 'Glaciation Plasma',
    'Plasma Blast':                  'Explosion Plasma',
    'Legendary Treasures':           'Trésors Légendaires',
    // ── Diamond & Pearl ──────────────────────────────────────────────────────
    'Diamond & Pearl':               'Diamant et Perle',
    'Mysterious Treasures':          'Trésors Mystérieux',
    'Secret Wonders':                'Merveilles Secrètes',
    'Great Encounters':              'Grandes Rencontres',
    'Majestic Dawn':                 'Aube Majestueuse',
    'Legends Awakened':              'Éveil des Légendes',
    'Stormfront':                    'Front Orageux',
    // ── Platinum ─────────────────────────────────────────────────────────────
    'Platinum':                      'Platine',
    'Rising Rivals':                 'Rivaux Grandissants',
    'Supreme Victors':               'Grands Vainqueurs',
    'Arceus':                        'Arceus',
    // ── HeartGold SoulSilver ─────────────────────────────────────────────────
    'HeartGold & SoulSilver':        'HeartGold SoulSilver',
    'Unleashed':                     'Déchaîné',
    'Undaunted':                     'Intrépide',
    'Triumphant':                    'Triomphant',
    'Call of Legends':               'Appel des Légendes',
    // ── EX era ───────────────────────────────────────────────────────────────
    'EX Ruby & Sapphire':            'EX Rubis & Saphir',
    'EX Sandstorm':                  'EX Tempête de Sable',
    'EX Dragon':                     'EX Dragon',
    'EX Team Magma vs Team Aqua':    'EX Team Magma contre Team Aqua',
    'EX Hidden Legends':             'EX Légendes Oubliées',
    'EX FireRed & LeafGreen':        'EX Rouge Feu & Vert Feuille',
    'EX Team Rocket Returns':        'EX Le Retour de la Team Rocket',
    'EX Deoxys':                     'EX Deoxys',
    'EX Emerald':                    'EX Émeraude',
    'EX Unseen Forces':              'EX Forces Cachées',
    'EX Delta Species':              'EX Espèce Delta',
    'EX Legend Maker':               'EX Percée Obscure',
    'EX Holon Phantoms':             'EX Fantômes Holon',
    'EX Crystal Guardians':          'EX Gardiens de Cristal',
    'EX Dragon Frontiers':           'EX Confins des Dragons',
    'EX Power Keepers':              'EX Gardiens du Pouvoir',
    // ── Neo ──────────────────────────────────────────────────────────────────
    'Neo Genesis':                   'Néo Genesis',
    'Neo Discovery':                 'Néo Découverte',
    'Neo Revelation':                'Néo Révélation',
    'Neo Destiny':                   'Néo Destinée',
    // ── Gym ──────────────────────────────────────────────────────────────────
    'Gym Heroes':                    'Gym - Les Héros',
    'Gym Challenge':                 'Gym - Le Défi',
    // ── Base ─────────────────────────────────────────────────────────────────
    'Base Set':                      'Jeu de Base',
    'Jungle':                        'Jungle',
    'Fossil':                        'Fossile',
    'Base Set 2':                    'Jeu de Base 2',
    'Team Rocket':                   'Team Rocket',
  },
  en: {},  // keep English original names
  jp: {},
  zh: {},
}

export function translateEra(era, lang = 'fr') {
  return ERA_NAMES[lang]?.[era] || ERA_NAMES.fr[era] || era
}

export function translateSet(name, lang = 'fr') {
  return SET_NAMES[lang]?.[name] || SET_NAMES.fr[name] || name
}

// ── Context ───────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('pokevault_lang') || 'fr')

  function changeLang(code) {
    setLang(code)
    localStorage.setItem('pokevault_lang', code)
  }

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ lang, changeLang, currentLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

export function useT() {
  const { lang } = useLang()
  return (key) => {
    const v = UI[lang]?.[key]
    return v !== undefined ? v : (UI.fr[key] ?? key)
  }
}
