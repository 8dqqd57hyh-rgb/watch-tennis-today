export type Rivalry = {
  slug: string;
  playerA: string;
  playerB: string;
  title: string;
  description: string;
  angle: string;
  surfaceNote: string;
  watchIntent: string;
  storylines: string[];
  related: string[];
};

export const rivalries: Rivalry[] = [
  {
    slug: "alcaraz-vs-sinner",
    playerA: "Carlos Alcaraz",
    playerB: "Jannik Sinner",
    title: "Carlos Alcaraz vs Jannik Sinner",
    description:
      "Follow Alcaraz vs Sinner with live match links, TV schedule context, recent matches and the key storylines that make this rivalry one of tennis' biggest draws.",
    angle: "The modern benchmark rivalry: explosive athleticism, first-strike tennis and Grand Slam pressure on every meeting.",
    surfaceNote:
      "Clay usually rewards Alcaraz's variety and drop-shot patterns, while faster courts can make Sinner's timing and baseline pressure feel even more brutal.",
    watchIntent:
      "Best for fans looking for the next blockbuster ATP match, Grand Slam final preview or live streaming guide.",
    storylines: [
      "Can Alcaraz turn defense into attack before Sinner locks the rally?",
      "Will Sinner control the backhand exchanges and keep points short?",
      "Which player handles the biggest points better today?",
    ],
    related: ["djokovic-vs-alcaraz", "djokovic-vs-sinner", "zverev-vs-alcaraz"],
  },
  {
    slug: "djokovic-vs-alcaraz",
    playerA: "Novak Djokovic",
    playerB: "Carlos Alcaraz",
    title: "Novak Djokovic vs Carlos Alcaraz",
    description:
      "Track Djokovic vs Alcaraz with schedule, live match context, player pages, official viewing links and rivalry storylines.",
    angle: "Experience against electricity: Djokovic's problem-solving against Alcaraz's speed, creativity and shot-making.",
    surfaceNote:
      "Long rallies favor the player who controls depth first. On clay, movement patterns matter; on hard courts, serve plus first forehand becomes huge.",
    watchIntent:
      "Best for fans searching before a semifinal, final or late-round Grand Slam match.",
    storylines: [
      "Can Djokovic redirect pace and make Alcaraz play one extra ball?",
      "Can Alcaraz protect his serve under return pressure?",
      "Does the match become physical, tactical, or both?",
    ],
    related: ["alcaraz-vs-sinner", "djokovic-vs-sinner", "zverev-vs-alcaraz"],
  },
  {
    slug: "djokovic-vs-sinner",
    playerA: "Novak Djokovic",
    playerB: "Jannik Sinner",
    title: "Novak Djokovic vs Jannik Sinner",
    description:
      "Follow Djokovic vs Sinner with live schedule links, player context, recent site matches and official broadcaster guidance.",
    angle: "The precision rivalry: Djokovic's return and patterns against Sinner's clean ball-striking and tempo control.",
    surfaceNote:
      "Indoor and fast hard courts can reward Sinner's first-strike rhythm. Slower courts give Djokovic more time to defend, redirect and extend rallies.",
    watchIntent:
      "Best for fans checking whether a current tournament has the next Djokovic-Sinner chapter.",
    storylines: [
      "Can Sinner hold baseline position without overpressing?",
      "Will Djokovic turn return games into constant pressure?",
      "Who wins the second-serve points?",
    ],
    related: ["alcaraz-vs-sinner", "djokovic-vs-alcaraz", "sinner-vs-medvedev"],
  },
  {
    slug: "sabalenka-vs-swiatek",
    playerA: "Aryna Sabalenka",
    playerB: "Iga Swiatek",
    title: "Aryna Sabalenka vs Iga Swiatek",
    description:
      "Follow Sabalenka vs Swiatek with live match links, TV schedule context, current tournament notes and WTA rivalry storylines.",
    angle: "Power against pressure: Sabalenka's first-strike aggression against Swiatek's movement, topspin and point construction.",
    surfaceNote:
      "Clay can amplify Swiatek's movement and heavy forehand. Faster courts can give Sabalenka more chances to end points early.",
    watchIntent:
      "Best for fans looking for WTA final previews, Grand Slam schedule updates and legal viewing options.",
    storylines: [
      "Can Sabalenka attack without letting errors pile up?",
      "Can Swiatek stretch the court and rush Sabalenka's timing?",
      "Who protects second serve better?",
    ],
    related: ["sabalenka-vs-gauff", "swiatek-vs-gauff", "rybakina-vs-sabalenka"],
  },
  {
    slug: "swiatek-vs-gauff",
    playerA: "Iga Swiatek",
    playerB: "Coco Gauff",
    title: "Iga Swiatek vs Coco Gauff",
    description:
      "Track Swiatek vs Gauff with schedule, live match context, player links and the storylines that matter before their next meeting.",
    angle: "Defense, speed and pressure: two elite movers where serve stability and forehand confidence often decide the tone.",
    surfaceNote:
      "Clay rewards patience and construction. Faster hard courts can make serve plus first ball more decisive.",
    watchIntent:
      "Best for fans checking WTA semifinals, finals and Grand Slam order of play.",
    storylines: [
      "Can Gauff keep service games calm enough to pressure Swiatek?",
      "Will Swiatek control the forehand patterns early?",
      "Who turns defense into offense first?",
    ],
    related: ["sabalenka-vs-swiatek", "sabalenka-vs-gauff", "rybakina-vs-sabalenka"],
  },
  {
    slug: "sabalenka-vs-gauff",
    playerA: "Aryna Sabalenka",
    playerB: "Coco Gauff",
    title: "Aryna Sabalenka vs Coco Gauff",
    description:
      "Follow Sabalenka vs Gauff with live match links, current schedule information and WTA matchup context.",
    angle: "Raw power against elite defense: Sabalenka tries to take time away, while Gauff can extend points and force extra shots.",
    surfaceNote:
      "The slower the court, the more Gauff's defense matters. The faster the court, the more Sabalenka's first strike can dominate.",
    watchIntent:
      "Best for fans preparing for a major WTA night-session match or Grand Slam final.",
    storylines: [
      "Can Sabalenka keep the rally on her racket?",
      "Can Gauff drag points into uncomfortable length?",
      "Which player handles pressure on second serve?",
    ],
    related: ["sabalenka-vs-swiatek", "swiatek-vs-gauff", "rybakina-vs-sabalenka"],
  },
  {
    slug: "zverev-vs-alcaraz",
    playerA: "Alexander Zverev",
    playerB: "Carlos Alcaraz",
    title: "Alexander Zverev vs Carlos Alcaraz",
    description:
      "Track Zverev vs Alcaraz with schedule context, live links, player pages and matchup storylines.",
    angle: "Serve weight against all-court chaos: Zverev needs clean service games, while Alcaraz tries to make the match physical and varied.",
    surfaceNote:
      "Clay can make this matchup especially tactical because return position, drop shots and backhand exchanges all matter.",
    watchIntent:
      "Best for fans checking late-round ATP matches and Grand Slam order of play.",
    storylines: [
      "Can Zverev land enough first serves to avoid Alcaraz return pressure?",
      "Can Alcaraz pull Zverev forward and break baseline rhythm?",
      "Who controls the backhand crosscourt pattern?",
    ],
    related: ["alcaraz-vs-sinner", "djokovic-vs-alcaraz", "sinner-vs-medvedev"],
  },
  {
    slug: "sinner-vs-medvedev",
    playerA: "Jannik Sinner",
    playerB: "Daniil Medvedev",
    title: "Jannik Sinner vs Daniil Medvedev",
    description:
      "Follow Sinner vs Medvedev with live schedule links, matchup context, player pages and legal viewing options.",
    angle: "Tempo against disruption: Sinner wants clean rhythm, while Medvedev changes court position and asks awkward questions.",
    surfaceNote:
      "Hard courts often make this rivalry especially watchable because both players can turn neutral rallies into pressure very quickly.",
    watchIntent:
      "Best for fans looking for ATP hard-court finals, semifinals and live schedule updates.",
    storylines: [
      "Can Medvedev's deep return position frustrate Sinner?",
      "Can Sinner take time away before rallies become awkward?",
      "Who wins the first-strike battle after the serve?",
    ],
    related: ["alcaraz-vs-sinner", "djokovic-vs-sinner", "zverev-vs-alcaraz"],
  },
  {
    slug: "rybakina-vs-sabalenka",
    playerA: "Elena Rybakina",
    playerB: "Aryna Sabalenka",
    title: "Elena Rybakina vs Aryna Sabalenka",
    description:
      "Track Rybakina vs Sabalenka with match schedule context, live links and WTA rivalry storylines.",
    angle: "First-strike tennis at full volume: both players can take the racket out of the opponent's hand quickly.",
    surfaceNote:
      "Faster courts reward serve quality and early ball-striking. Slower courts test movement, patience and error control.",
    watchIntent:
      "Best for fans checking WTA finals, night sessions and Grand Slam order of play.",
    storylines: [
      "Who lands the first serve under pressure?",
      "Can Rybakina keep the ball low and clean through the court?",
      "Can Sabalenka turn return games into immediate pressure?",
    ],
    related: ["sabalenka-vs-swiatek", "sabalenka-vs-gauff", "swiatek-vs-gauff"],
  },
];

export function getRivalry(slug: string) {
  return rivalries.find((rivalry) => rivalry.slug === slug);
}
