export const players = {
  "jannik-sinner": {
  name: "Jannik Sinner",

  tour: "ATP",

  tournaments: [
    "ATP Masters 1000 tournaments",
    "ATP Finals",
    "Grand Slam tournaments",
    "Davis Cup",
  ],

  bio:
    "Jannik Sinner is known for clean ball striking, strong baseline control and calm match management under pressure.",

  playStyle:
    "Sinner plays aggressive baseline tennis with early ball striking, fast pace and powerful groundstrokes from both wings.",

  surfaceStrength:
    "Hard courts and indoor courts",

  watchReasons: [
    "Fast aggressive rallies",
    "Clean shotmaking",
    "Strong returning games",
  ],
},

  "iga-swiatek": {
    name: "Iga Swiatek",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

"carlos-alcaraz": {
  name: "Carlos Alcaraz",

  tour: "ATP",

  tournaments: [
    "ATP Masters 1000 tournaments",
    "ATP Finals",
    "Grand Slam tournaments",
    "Davis Cup",
  ],

  bio:
    "Carlos Alcaraz is known for explosive movement, creative shotmaking and high-energy all-court tennis.",

  playStyle:
    "Alcaraz combines heavy topspin, drop shots, aggressive net play and fast transitions, making his matches especially entertaining live.",

  surfaceStrength:
    "Clay courts and hard courts",

  watchReasons: [
    "Explosive athletic rallies",
    "Creative shot selection",
    "High-energy crowd matches",
  ],
},

  "novak-djokovic": {
  name: "Novak Djokovic",

  tour: "ATP",

  tournaments: [
    "ATP Masters 1000 tournaments",
    "ATP Finals",
    "Grand Slam tournaments",
    "Davis Cup",
  ],

  bio:
    "Novak Djokovic is known for elite defensive movement, consistency and one of the strongest return games in tennis history.",

  playStyle:
    "Djokovic controls rallies with deep baseline positioning, flexibility, precision and tactical point construction.",

  surfaceStrength:
    "Hard courts",

  watchReasons: [
    "Elite defensive rallies",
    "Historic Grand Slam matches",
    "Tactical baseline battles",
  ],
},

  "aryna-sabalenka": {
    name: "Aryna Sabalenka",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },
  "coco-gauff": {
    name: "Coco Gauff",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "elena-rybakina": {
    name: "Elena Rybakina",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "jessica-pegula": {
    name: "Jessica Pegula",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "jasmine-paolini": {
    name: "Jasmine Paolini",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "madison-keys": {
    name: "Madison Keys",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "naomi-osaka": {
    name: "Naomi Osaka",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "mirra-andreeva": {
    name: "Mirra Andreeva",
    tour: "WTA",
    tournaments: [
      "WTA 1000 tournaments",
      "WTA Finals",
      "Grand Slam tournaments",
      "Billie Jean King Cup",
    ],
  },

  "daniil-medvedev": {
    name: "Daniil Medvedev",
    tour: "ATP",
    tournaments: [
      "ATP Masters 1000 tournaments",
      "ATP Finals",
      "Grand Slam tournaments",
      "Davis Cup",
    ],
  },

  "alexander-zverev": {
    name: "Alexander Zverev",
    tour: "ATP",
    tournaments: [
      "ATP Masters 1000 tournaments",
      "ATP Finals",
      "Grand Slam tournaments",
      "Davis Cup",
    ],
  },

  "holger-rune": {
    name: "Holger Rune",
    tour: "ATP",
    tournaments: [
      "ATP Masters 1000 tournaments",
      "ATP Finals",
      "Grand Slam tournaments",
      "Davis Cup",
    ],
  }
} as const;

export type PlayerSlug = keyof typeof players;
