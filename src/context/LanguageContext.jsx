import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'jp', label: 'Japonais', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinois', flag: '🇨🇳' },
]

export const ERA_NAMES_FR = {
  'Scarlet & Violet':         'Écarlate et Violet',
  'Sword & Shield':           'Épée et Bouclier',
  'Sun & Moon':               'Soleil et Lune',
  'XY':                       'XY',
  'Black & White':            'Noir et Blanc',
  'HeartGold & SoulSilver':   'Or HeartGold & Argent SoulSilver',
  'Platinum':                 'Platine',
  'Diamond & Pearl':          'Diamant et Perle',
  'EX':                       'EX',
  'e-Card':                   'e-Carte',
  'Neo':                      'Néo',
  'Gym':                      'Gym',
  'Base':                     'De Base',
  'Other':                    'Autre',
}

export const SET_NAMES_FR = {
  // Scarlet & Violet
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
  // Sword & Shield
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
  // Sun & Moon
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
  // XY
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
  // Black & White
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
  // Diamond & Pearl
  'Diamond & Pearl':               'Diamant et Perle',
  'Mysterious Treasures':          'Trésors Mystérieux',
  'Secret Wonders':                'Merveilles Secrètes',
  'Great Encounters':              'Grandes Rencontres',
  'Majestic Dawn':                 'Aube Majestueuse',
  'Legends Awakened':              'Éveil des Légendes',
  'Stormfront':                    'Front Orageux',
  // Platinum
  'Platinum':                      'Platine',
  'Rising Rivals':                 'Rivaux Grandissants',
  'Supreme Victors':               'Grands Vainqueurs',
  'Arceus':                        'Arceus',
  // HeartGold SoulSilver
  'HeartGold & SoulSilver':        'Or HeartGold & Argent SoulSilver',
  'Unleashed':                     'Déchaîné',
  'Undaunted':                     'Intrépide',
  'Triumphant':                    'Triomphant',
  'Call of Legends':               'Appel des Légendes',
  // EX era
  'EX Ruby & Sapphire':            'EX Rubis et Saphir',
  'EX Sandstorm':                  'EX Tempête de Sable',
  'EX Dragon':                     'EX Dragon',
  'EX Team Magma vs Team Aqua':    'EX Magma vs Aqua',
  'EX Hidden Legends':             'EX Légendes Oubliées',
  'EX FireRed & LeafGreen':        'EX Rouge Feu & Vert Feuille',
  'EX Team Rocket Returns':        'EX Retour de la Team Rocket',
  'EX Deoxys':                     'EX Deoxys',
  'EX Emerald':                    'EX Émeraude',
  'EX Unseen Forces':              'EX Forces Cachées',
  'EX Delta Species':              'EX Espèce Delta',
  'EX Legend Maker':               'EX Percée Obscure',
  'EX Holon Phantoms':             'EX Fantômes Holon',
  'EX Crystal Guardians':          'EX Gardiens de Cristal',
  'EX Dragon Frontiers':           'EX Confins des Dragons',
  'EX Power Keepers':              'EX Gardiens du Pouvoir',
  // Neo
  'Neo Genesis':                   'Néo Genesis',
  'Neo Discovery':                 'Néo Découverte',
  'Neo Revelation':                'Néo Révélation',
  'Neo Destiny':                   'Néo Destinée',
  // Gym
  'Gym Heroes':                    'Gym - Les Héros',
  'Gym Challenge':                 'Gym - Le Défi',
  // Base
  'Base Set':                      'Jeu de Base',
  'Jungle':                        'Jungle',
  'Fossil':                        'Fossile',
  'Base Set 2':                    'Jeu de Base 2',
  'Team Rocket':                   'Team Rocket',
}

// Partial French Pokémon name map (common cards)
export const POKEMON_NAMES_FR = {
  'Charizard': 'Dracaufeu', 'Blastoise': 'Tortank', 'Venusaur': 'Florizarre',
  'Pikachu': 'Pikachu', 'Raichu': 'Raichu', 'Mewtwo': 'Mewtwo',
  'Mew': 'Mew', 'Gengar': 'Ectoplasma', 'Alakazam': 'Alakazam',
  'Machamp': 'Mackogneur', 'Golem': 'Grolem', 'Arcanine': 'Arcanin',
  'Gyarados': 'Léviator', 'Lapras': 'Lokhlass', 'Eevee': 'Évoli',
  'Vaporeon': 'Aquali', 'Jolteon': 'Voltali', 'Flareon': 'Pyroli',
  'Snorlax': 'Ronflex', 'Dragonite': 'Dracolosse', 'Articuno': 'Artikodin',
  'Zapdos': 'Électhor', 'Moltres': 'Sulfura', 'Ditto': 'Métamorph',
  'Umbreon': 'Noctali', 'Espeon': 'Mentali', 'Lugia': 'Lugia',
  'Ho-Oh': 'Ho-Oh', 'Entei': 'Entei', 'Raikou': 'Raikou', 'Suicune': 'Suicune',
  'Tyranitar': 'Tyranocif', 'Celebi': 'Celebi', 'Blaziken': 'Braségali',
  'Swampert': 'Laggron', 'Sceptile': 'Jungko', 'Gardevoir': 'Gardevoir',
  'Rayquaza': 'Rayquaza', 'Kyogre': 'Kyogre', 'Groudon': 'Groudon',
  'Latias': 'Latias', 'Latios': 'Latios', 'Jirachi': 'Jirachi',
  'Deoxys': 'Deoxys', 'Infernape': 'Infernape', 'Empoleon': 'Pingoléon',
  'Torterra': 'Tortipouss', 'Lucario': 'Lucario', 'Garchomp': 'Carchacrok',
  'Dialga': 'Dialga', 'Palkia': 'Palkia', 'Giratina': 'Giratina',
  'Darkrai': 'Darkrai', 'Arceus': 'Arceus', 'Zoroark': 'Zoroark',
  'Reshiram': 'Reshiram', 'Zekrom': 'Zekrom', 'Kyurem': 'Kyurem',
  'Greninja': 'Amphinobi', 'Chesnaught': 'Blindépique', 'Delphox': 'Goupelin',
  'Sylveon': 'Nymphali', 'Xerneas': 'Xerneas', 'Yveltal': 'Yveltal',
  'Zygarde': 'Zygarde', 'Incineroar': 'Félinferno', 'Decidueye': 'Archéduc',
  'Primarina': 'Tokotoro', 'Solgaleo': 'Solgaleo', 'Lunala': 'Lunala',
  'Necrozma': 'Necrozma', 'Marshadow': 'Marshadow', 'Zeraora': 'Zeraora',
  'Cinderace': 'Pyrobut', 'Intelleon': 'Lézargus', 'Rillaboom': 'Gorythmic',
  'Zacian': 'Zacian', 'Zamazenta': 'Zamazenta', 'Eternatus': 'Eternamax',
  'Urshifu': 'Shifours', 'Calyrex': 'Sylveroy', 'Sprigatito': 'Poussacha',
  'Fuecoco': 'Chochodile', 'Quaxly': 'Coiffeton', 'Koraidon': 'Koraidon',
  'Miraidon': 'Miraidon', 'Mew ex': 'Mew ex', 'Mewtwo ex': 'Mewtwo ex',
}

export function translateName(name, lang = 'fr') {
  if (lang !== 'fr') return name
  return POKEMON_NAMES_FR[name] || SET_NAMES_FR[name] || name
}

export function translateEra(era, lang = 'fr') {
  if (lang !== 'fr') return era
  return ERA_NAMES_FR[era] || era
}

export function translateSet(setName, lang = 'fr') {
  if (lang !== 'fr') return setName
  return SET_NAMES_FR[setName] || setName
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pokevault_lang') || 'fr'
  })

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
