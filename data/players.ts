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
} as const;

export type PlayerSlug = keyof typeof players;