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
