import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { players, type PlayerSlug } from "@/data/players";
import { getCanonicalPlayerSlug, matchContainsExactPlayer, normalizePlayerName, playerNameFromSlug } from "@/data/playerSlugs";
import LocalPlayerFollowButton from "@/app/components/LocalPlayerFollowButton";
import PlayerFollowCTA from "@/components/PlayerFollowCTA";
import EmailCapture from "@/components/EmailCapture";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { supabase } from "@/app/lib/supabase";
import { shouldIndexPlayerPage } from "@/app/lib/adsenseIndexing";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

type PlayerEditorialProfile = {
  nationality: string;
  biography: string;
  playingStyle: string;
  careerContext: string;
  recentForm?: string;
  strengths: string[];
  surfaceContext: string;
  surfacePreferences?: string;
  watchReasons?: string[];
};

const PLAYER_EDITORIAL_PROFILES: Partial<Record<PlayerSlug, PlayerEditorialProfile>> = {
  "jannik-sinner": {
    nationality: "Italy",
    biography: "Jannik Sinner has become one of the defining ATP players for fans who want a mix of clean baseline power, calm match management and week-to-week title relevance. His matches are rarely useful only as live-score rows; they usually carry tournament, ranking and broadcast significance because he is often scheduled on show courts, late sessions and high-demand Grand Slam windows. For a watch guide, Sinner deserves fuller context than a generic player template because his matches can attract casual fans, Italian viewers, hard-court specialists and people tracking the top of the ATP race at the same time. The most useful page for Sinner explains why the match matters, how the surface changes the viewing experience and where fans should verify official coverage before relying on a stream claim.",
    playingStyle: "Sinner plays first-strike baseline tennis built around early contact, compact timing and unusually stable power from both wings. He can redirect pace without taking large preparation swings, which makes his rallies feel fast even before he goes for a clear winner. His backhand is a major viewing clue because it lets him hold court position under pressure and change direction without opening the court too early. On return, he often pressures servers by blocking or driving the ball deep enough to start neutral rallies on his terms. When he is serving well, the first serve and first forehand can shorten games quickly; when he is returning well, opponents can feel rushed from the first shot of the rally.",
    careerContext: "When following Sinner, start with event level and surface. Grand Slam, Masters 1000, ATP Finals and Davis Cup matches tend to carry the strongest audience interest, while hard courts and indoor courts often showcase the most direct version of his game. Match timing matters too: Sinner in a night session or late tournament round is more likely to appear in premium broadcaster windows, so users should confirm the official order of play, court assignment and local rights holder before match time. If his opponent is an elite defender, watch whether Sinner can create short balls without overhitting. If his opponent is a big server, the key is whether Sinner turns enough return games into rallies.",
    strengths: ["Early ball striking", "Backhand stability", "Return pressure", "Calm match management"],
    surfaceContext: "Hard courts and indoor events are especially relevant because the cleaner bounce rewards Sinner's early timing and direct redirection. Clay can still suit his patience and weight of shot, but the slower surface gives opponents more time to defend. Grass makes first-strike patterns more valuable, so serve quality and low-bounce movement become bigger viewing checks.",
    watchReasons: ["Fast baseline exchanges with very little wasted motion", "Elite return games that can turn a server's advantage into pressure", "High-value Grand Slam, Masters and ATP Finals scheduling", "Useful contrast between calm point construction and sudden acceleration"],
  },
  "carlos-alcaraz": {
    nationality: "Spain",
    biography: "Carlos Alcaraz is one of the most important player pages to keep indexable because his matches are not interchangeable with ordinary schedule entries. Fans search for him because they expect athletic defense, explosive attacking, tactical variety and highlight-level shotmaking, but a useful page also needs to explain how to follow him legally and practically. Alcaraz can be a title contender on clay, grass and hard courts, which means his schedule has different meanings across the season. A clay match may be about spin, patience and physical rallies; a grass match may be about fast reactions and confident movement; a hard-court match may turn on return position, serve plus one patterns and night-session conditions. Those differences make original editorial context valuable.",
    playingStyle: "Alcaraz plays all-court tennis with unusually wide tactical range. He can use a heavy forehand to push opponents back, then change the rhythm with a drop shot, a net rush or a sudden angle. His movement is not only defensive; it lets him turn stretched positions into counterattacks, which is why his matches can swing quickly after points that looked under control for the opponent. On return, he can step in aggressively or use athletic defense to lengthen games. He is also comfortable finishing points forward, so fans should watch how often he earns short balls and whether he chooses power, touch or net pressure as the next move.",
    careerContext: "Before watching Alcaraz, check the tournament stage, surface and court assignment. He is frequently placed in marquee sessions, and that can affect both start time volatility and broadcaster availability. In Grand Slams, best-of-five format increases the value of physical recovery and tactical adjustment. In Masters events, the short turnaround between rounds can make previous match length and surface conditions more important. The most useful viewing preparation is to confirm the official order of play, identify whether earlier matches could delay his start and verify the licensed broadcaster for the viewer's country instead of assuming every Alcaraz match appears on the same service.",
    strengths: ["Explosive movement", "Drop-shot creativity", "Forehand acceleration", "All-court finishing"],
    surfaceContext: "Clay and outdoor hard courts are key contexts because they let Alcaraz combine spin, defense and acceleration. Grass is also important during Wimbledon season because it tests his movement, serve quality and willingness to move forward. Indoor hard courts can reduce the time available for creativity, making first-strike execution and return depth especially important.",
    watchReasons: ["Momentum can change quickly because defense becomes attack", "Shot selection includes power, touch, net play and improvisation", "Surface changes visibly alter his tactical choices", "Marquee sessions often create high-demand official viewing windows"],
  },
  "novak-djokovic": {
    nationality: "Serbia",
    biography: "Novak Djokovic remains one of the strongest evergreen player pages because his matches carry historical, tactical and scheduling interest beyond the live score. Even when he is not playing every week, fans often search for his next match because Grand Slam appearances, Masters events and national-team competitions can affect records, rankings, seeding narratives and tournament attention. A thin Djokovic page would miss the point: the value is in explaining how his style changes match expectations, why best-of-five context matters and how fans should confirm official viewing routes. His matches also attract viewers who may not follow the weekly tour closely, so the page needs plain, reliable guidance rather than assuming users already know which broadcaster owns each event.",
    playingStyle: "Djokovic's game is built around elite returning, balance under pressure, depth control and tactical patience. He is one of the best players to watch when the opponent has a strong serve because he can neutralize pace, make first serves come back and force extra shots in games that normally end quickly. From the baseline, he absorbs pace without giving up court position, then changes direction when the opponent leaves space. His flexibility and movement let him defend wide balls, but the larger tactical point is that he often turns defense into a neutral rally rather than a desperate scramble. Fans should watch return depth, backhand direction and how often he makes opponents hit one more ball on important points.",
    careerContext: "When following Djokovic, format and surface matter. Best-of-five Grand Slam matches give him more time to solve an opponent, while faster best-of-three matches can put more weight on early service games and tiebreaks. Hard courts and major tournaments are especially important contexts, but grass and clay still require different viewing checks: on grass, return positioning and first-strike efficiency become louder; on clay, point construction and physical patience become more visible. Before match time, users should verify the official order of play and local broadcaster because Djokovic matches often sit in premium TV windows and can move if previous matches run long.",
    strengths: ["Return of serve", "Movement and flexibility", "Tactical point construction", "Pressure handling"],
    surfaceContext: "Hard courts and Grand Slam formats are especially important because they emphasize Djokovic's return quality, movement and ability to make tactical adjustments across a long match. Grass highlights the value of his return and balance on low balls. Clay can make rallies longer, which places more weight on patience, depth and physical rhythm.",
    watchReasons: ["Return games against big servers are often tactical events by themselves", "Pressure points reveal patterns in serve location and rally tolerance", "Grand Slam matches can change after Djokovic solves an opponent's plan", "Historical stakes often make even routine-looking matches meaningful"],
  },
  "daniil-medvedev": {
    nationality: "Russia",
    biography: "Daniil Medvedev is one of the most distinctive champions in modern ATP tennis because his best matches rarely look like anyone else's. The 2021 US Open champion and 2020 ATP Finals winner built an elite career by turning hard-court tennis into a geometry problem: deep return positions, low-risk depth, flat backhands and relentless court coverage. He also reached world No. 1, a milestone that reflected more than one peak fortnight. Medvedev has been a sustained threat across Grand Slams, Masters events and indoor tournaments, especially when the conditions let him stretch rallies and test an opponent's shot tolerance. For fans, his page needs more than a live-score snapshot because his matches often explain the tactical side of tennis better than highlight clips do.",
    playingStyle: "Medvedev plays from unusual court positions, often standing far behind the baseline on return and daring servers to find repeated precision. Once the rally starts, he uses a flat, skidding backhand, a compact forehand and awkward depth to pull opponents out of comfortable strike zones. He does not rely on classic looking attack patterns; instead, he makes rivals hit one extra ball from bad locations until the court opens. His serve can earn free points, but the larger pattern is pressure through patience. Watch how often he changes a clean attacking point into a neutral rally, then how quickly he redirects when an opponent loses balance.",
    careerContext: "Medvedev is most relevant in hard-court Grand Slams, Masters 1000 tournaments, ATP Finals-style indoor conditions and matchups against aggressive baseliners. He has played some of his most important tennis in Australia, North America and late-season indoor events, where bounce and court speed reward his return depth and flat ball. Against big servers, the first question is whether his deep return position still gives him enough looks at second serves. Against elite movers, the match often turns on whether he can create awkward angles without giving up court position.",
    recentForm: "The evergreen version of Medvedev's recent form is less about a weekly ranking number and more about how his physical, precise style ages across long tournaments. When he is confident, service games become calmer, return games become longer, and opponents look impatient before the scoreboard is truly dangerous. When he is under pressure, fans should watch second-serve protection and forehand depth, because those two details usually reveal whether he is dictating the pattern or only surviving it.",
    strengths: ["Deep return positioning", "Flat backhand control", "Defensive coverage", "Tactical patience"],
    surfaceContext: "Hard courts and indoor courts are the most relevant viewing contexts because they reward Medvedev's low, flat drives and his ability to turn defense into controlled depth.",
    surfacePreferences: "Outdoor hard courts give Medvedev his clearest identity: enough speed to make his backhand bite, enough bounce to defend from deep positions and enough predictability to build long return games. Indoor courts can make his serve and backhand even sharper. Clay asks him to create more height and patience, while grass can reward his serve but makes low-bounce movement and net exchanges more urgent.",
    watchReasons: ["A rare tactical contrast between deep court positioning and elite hard-court results", "Return games that make even strong servers play uncomfortable rallies", "Flat backhand patterns that expose impatient attacking players", "Matches where problem-solving matters as much as highlight winners"],
  },
  "alexander-zverev": {
    nationality: "Germany",
    biography: "Alexander Zverev has been a central ATP contender for years, with Olympic gold from Tokyo 2021, ATP Finals titles and a long record of deep runs at Masters 1000 and Grand Slam level. His career is useful for tennis fans because it sits at the intersection of raw physical tools and high-pressure match management. At his best, Zverev can look almost impossible to hit through: a tall first serve, a heavy two-handed backhand, long reach in defense and the ability to play patient baseline tennis without giving up pace. His player page deserves indexable editorial context because his matches are often main-court events with real tactical stakes, especially on clay and hard courts.",
    playingStyle: "Zverev's game starts with a first serve that can set up short replies or end points outright, but his backhand is the stroke that gives his baseline tennis its shape. He can absorb pace crosscourt, redirect down the line and keep depth without taking unnecessary risks. The forehand is more volatile, so fans should watch whether he is stepping through that wing or falling into defensive contact. In return games, Zverev often uses reach and depth rather than constant early aggression. When he is serving well and landing the backhand deep, opponents are forced to take bigger risks just to escape neutral rallies.",
    careerContext: "Zverev is especially important during clay swings, hard-court Masters events and Grand Slams, where his combination of serve, stamina and baseline weight can carry through long matches. His Olympic title and ATP Finals success show that he has already won in very different competitive settings: national pressure, elite round-robin fields and knockout tournaments. For viewing purposes, check surface, round and opponent style. A match against a counterpuncher tests his patience and forehand discipline; a match against a first-strike attacker tests his second serve, return depth and willingness to move forward.",
    recentForm: "Zverev's form is best evaluated through repeatable indicators rather than a single result: first-serve percentage, second-serve confidence, backhand depth and how often he takes initiative with the forehand. When those pieces align, he can control matches without playing flashy tennis. When one piece drops, especially second-serve protection, his service games can become longer and the pressure on his baseline tolerance rises.",
    strengths: ["First serve power", "Two-handed backhand", "Baseline depth", "Big-event experience"],
    surfaceContext: "Clay and hard courts are both important contexts because Zverev can combine serve protection with long-rally patience and deep backhand control.",
    surfacePreferences: "Clay gives Zverev time to use his reach, construct points and lean on the backhand without being rushed. Outdoor hard courts also fit him well when the bounce is high enough for his service patterns and baseline depth. Faster indoor courts can reward his first serve, while grass places extra emphasis on low-ball movement and forehand clarity.",
    watchReasons: ["A top-tier first serve paired with one of the ATP's most stable two-handed backhands", "Clay and hard-court matches where physical reach changes rally geometry", "Clear tactical signals around second-serve confidence and forehand discipline", "High-stakes history in Olympic, ATP Finals, Masters and Grand Slam settings"],
  },
  "taylor-fritz": {
    nationality: "United States",
    biography: "Taylor Fritz is one of the leading American ATP players and is frequently featured in hard-court tournaments, United States events and Grand Slam coverage. His matches are useful for fans tracking American tennis and fast-court schedules.",
    playingStyle: "Fritz relies on a strong serve, direct baseline hitting and efficient first-strike patterns. He is especially dangerous when he earns short balls after the first serve.",
    careerContext: "Check Fritz during North American hard-court swings, indoor events and grass tournaments where his serve can become a major factor.",
    strengths: ["Serve plus one", "Forehand pace", "Fast-court efficiency", "American fan interest"],
    surfaceContext: "Hard courts, grass and indoor courts are especially relevant.",
  },
  "holger-rune": {
    nationality: "Denmark",
    biography: "Holger Rune is a high-energy ATP player whose matches often attract attention because of intensity, variety and momentum swings. Fans track his schedule closely at Masters and Grand Slam events.",
    playingStyle: "Rune mixes aggressive baseline attacks with drop shots, net approaches and emotional momentum. His matches can become tactical and dramatic quickly.",
    careerContext: "Clay, indoor hard courts and matches against top-ten opponents are useful contexts for following Rune.",
    strengths: ["Aggressive return games", "Variety", "Competitive intensity", "Backhand attack"],
    surfaceContext: "Clay and indoor hard courts are especially relevant.",
  },
  "andrey-rublev": {
    nationality: "Russia",
    biography: "Andrey Rublev is a regular ATP contender known for relentless pace and high-volume attacking tennis. His matches are easy for fans to identify because the rhythm is often fast, physical and direct.",
    playingStyle: "Rublev attacks with heavy forehands, early baseline pressure and repeatable patterns. When he controls court position, he can rush opponents into short replies.",
    careerContext: "Look at surface speed and opponent defense when following Rublev. Those factors often decide whether his power patterns control the match.",
    strengths: ["Forehand power", "Aggressive tempo", "Baseline pressure", "High-intensity rallies"],
    surfaceContext: "Hard courts and clay are strong viewing contexts.",
  },
  "casper-ruud": {
    nationality: "Norway",
    biography: "Casper Ruud is a top Norwegian player associated with strong clay-court results, disciplined point construction and consistent tournament performances. Fans often track him during clay swings and Grand Slams.",
    playingStyle: "Ruud uses heavy topspin, structured patterns and reliable forehand pressure. His matches often reward fans who watch rally construction rather than only winners.",
    careerContext: "Clay events and matches with long baseline exchanges are the best contexts for understanding Ruud's game.",
    strengths: ["Heavy forehand topspin", "Clay-court patience", "Point construction", "Physical consistency"],
    surfaceContext: "Clay is the most important context, with hard courts also relevant.",
  },
  "stefanos-tsitsipas": {
    nationality: "Greece",
    biography: "Stefanos Tsitsipas is a prominent ATP player whose matches attract fans because of attacking patterns, one-handed backhand rallies and strong clay-court history.",
    playingStyle: "Tsitsipas likes to use the serve and forehand to move forward, while his one-handed backhand creates different rally shapes compared with most top players.",
    careerContext: "Clay events, grass tournaments and matches where he can attack behind the serve are important contexts for his schedule.",
    strengths: ["Serve and forehand", "Net approaches", "One-handed backhand variety", "Clay-court experience"],
    surfaceContext: "Clay and faster courts where first-strike tennis matters are relevant.",
  },
  "alex-de-minaur": {
    nationality: "Australia",
    biography: "Alex de Minaur is one of the fastest players on the ATP Tour and is popular with fans who enjoy counterpunching, speed and long defensive points.",
    playingStyle: "De Minaur wins many points through movement, anticipation and pressure through consistency. He can turn defense into offense by taking time away on the counterattack.",
    careerContext: "Hard courts, grass and matches against bigger hitters are useful contexts because they show how his speed changes rallies.",
    strengths: ["Court speed", "Counterpunching", "Return consistency", "Competitive energy"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "lorenzo-musetti": {
    nationality: "Italy",
    biography: "Lorenzo Musetti is an Italian ATP player known for stylish shotmaking, a one-handed backhand and clay-court creativity. His matches often appeal to fans who enjoy variety and touch.",
    playingStyle: "Musetti uses spin, angles, slices and changes of pace to disrupt rhythm. His one-handed backhand and touch shots make his matches visually distinctive.",
    careerContext: "Clay and slower outdoor courts are the most useful contexts when planning to watch Musetti.",
    strengths: ["One-handed backhand", "Touch and angles", "Clay-court creativity", "Shot variety"],
    surfaceContext: "Clay and slower outdoor courts are especially relevant.",
  },
  "tommy-paul": {
    nationality: "United States",
    biography: "Tommy Paul is an American ATP player with an athletic all-court game and strong results on hard courts. His matches are often relevant during North American events and Grand Slam coverage.",
    playingStyle: "Paul combines movement, clean ball striking and willingness to finish points forward. He can defend well but also take control when he earns court position.",
    careerContext: "Hard-court events and matches against aggressive baseliners are important contexts for his schedule.",
    strengths: ["Athletic movement", "All-court balance", "Clean forehand timing", "Transition play"],
    surfaceContext: "Hard courts are the main context, with grass also relevant.",
  },
  "ben-shelton": {
    nationality: "United States",
    biography: "Ben Shelton is an American ATP player whose matches draw attention because of left-handed serving power, athleticism and crowd energy. Fans often search for his schedule during U.S. events and Grand Slams.",
    playingStyle: "Shelton builds points around a heavy left-handed serve, explosive forehand and aggressive court positioning. His service games can move quickly when the first serve lands.",
    careerContext: "Fast courts, night sessions and matches against elite returners are key contexts for following Shelton.",
    strengths: ["Left-handed serve", "Athletic explosiveness", "Forehand power", "Crowd energy"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "iga-swiatek": {
    nationality: "Poland",
    biography: "Iga Swiatek is one of the defining WTA players of her generation, with multiple Roland Garros titles, a US Open title, a Wimbledon title and a long record of dominance in high-level events. Her rise from teenage major champion to sustained No. 1-level force changed expectations for modern clay-court tennis and made her schedule essential for fans far beyond Poland. Swiatek's appeal is not only the trophy list. It is the way her tennis has a recognizable identity: heavy spin, fast feet, ruthless return pressure and an ability to turn neutral rallies into uncomfortable defensive work for opponents. A strong player page should explain those patterns because her matches often look routine only after she has spent several games tightening every available space.",
    playingStyle: "Swiatek plays with heavy topspin, especially on the forehand, and uses exceptional footwork to take balls early while still creating height and margin. Her return games are often the clearest sign of control: she crowds second serves, lands deep replies and forces servers to hit under pressure before the rally has settled. She is also skilled at using the backhand to redirect down the line, which prevents opponents from simply camping in forehand exchanges. The visual rhythm of a Swiatek match is intense but structured. She wants to own the first neutral ball, build pressure through spin and depth, then finish when the opponent offers a short reply.",
    careerContext: "Swiatek is a priority page during Roland Garros, WTA 1000 clay events, Grand Slams and late-stage matches against elite power players. Her Roland Garros record is central to modern tennis context, but her major success on hard courts and grass prevents the page from being only a clay profile. Fans should check court speed and opponent style before match time. A big server asks whether Swiatek can start enough return points in balance. A flat hitter asks whether her spin and movement can break timing. A strong defender asks whether she can finish without forcing the issue too soon.",
    recentForm: "Swiatek's form is most usefully read through return pressure, forehand shape and emotional tempo. When she is sharp, her service games become efficient because opponents know the return games will be demanding. When she is slightly off, the forehand can land shorter and opponents get more chances to attack before she takes command. Those indicators stay useful across seasons and surfaces, which makes them better for fans than a weekly ranking snapshot.",
    strengths: ["Heavy topspin forehand", "Return pressure", "Movement intensity", "Clay dominance"],
    surfaceContext: "Clay is the signature context because Swiatek's spin, sliding movement and point construction become especially punishing, but hard courts and grass now matter in any complete viewing guide.",
    surfacePreferences: "Slow and medium clay courts best showcase Swiatek's ability to build pressure with height, angles and repeatable footwork. Outdoor hard courts reward her return intensity when she controls depth. Grass asks for quicker strike timing and lower contact points, making serve placement and first-ball decisions more visible than on clay.",
    watchReasons: ["Elite clay-court patterns that are easy to see point by point", "Return games that can change a match before the score looks lopsided", "Heavy topspin and footwork that create a distinctive WTA style", "Major-title context across clay, hard courts and grass"],
  },
  "aryna-sabalenka": {
    nationality: "Belarus",
    biography: "Aryna Sabalenka is the current WTA singles No. 1 and one of the clearest power identities in women's tennis, with major titles in Australia and New York and a career that also includes a previous doubles No. 1 ranking. Her matches often become the physical benchmark of a tournament because she can make elite opponents defend from the first strike. Her best tennis is direct, loud in the sporting sense and tactically braver than a simple power label suggests. Sabalenka has turned a huge serve and explosive groundstrokes into repeatable major-title contention by improving shot selection, emotional control and point construction. Fans search for her because the matchup can feel decisive before the first point: if she has time to set her feet, few opponents can absorb the pace for long.",
    playingStyle: "Sabalenka plays first-strike baseline tennis with a heavy serve, a bruising forehand and a backhand that can redirect pace down the line. She wants to shorten points, but the best version of her game is not mindless hitting. She uses deep returns to seize the center of the court, then attacks through bigger targets until the open space appears. On second serve, her improved reliability is a major tactical detail because it lets her play aggressive return games without constantly defending service games. Fans should watch the spacing between her feet and the ball: when she is balanced, the power looks clean rather than forced.",
    careerContext: "Sabalenka is essential viewing at hard-court Grand Slams, WTA 1000 events, late-stage clay tournaments and major show-court sessions against defenders or counterpunchers. Her Australian Open titles confirmed her ability to handle pressure over a full major, while her US Open titles added another hard-court milestone. Against elite defenders, the question is whether she can stay patient enough to keep the rally on her terms. Against other power players, serve quality, return depth and first forehand location usually decide whether the match becomes controlled aggression or a race of errors.",
    recentForm: "Sabalenka's form is best measured through controlled aggression: first-serve rhythm, second-serve trust, return depth and how often she attacks with margin before going for the sideline. When those details hold, she can dominate without needing spectacular winners every few points. When timing slips, the same weapons can produce rushed errors, so early games often reveal whether she is building points or swinging through tension.",
    strengths: ["Serve power", "Forehand aggression", "Backhand pace", "Big-match intensity"],
    surfaceContext: "Hard courts are especially relevant because Sabalenka's serve and flat power get full value, while clay and grass add different tests of patience, movement and contact height.",
    surfacePreferences: "Medium and quick hard courts are the cleanest setting for Sabalenka's first strike tennis. Clay can still work because her weight of shot pushes opponents back, but it asks for more rally tolerance and disciplined targets. Grass rewards the serve and first ball, while also testing low-bounce adjustment and quick recovery after attacking shots.",
    watchReasons: ["One of the WTA's most forceful serve and return combinations", "Power tennis with visible tactical choices around margin and timing", "Major-title context in Australia and New York", "High-contrast matchups against elite defenders and counterpunchers"],
  },
  "coco-gauff": {
    nationality: "United States",
    biography: "Coco Gauff has already moved from teenage prospect to major champion and one of the most watched players in the sport. Her US Open title gave American fans a home Grand Slam centerpiece, and her later Roland Garros success showed that her game is not confined to hard courts. Gauff's profile is especially valuable for a watch guide because her matches attract casual viewers, U.S. audiences, younger fans and tennis people interested in athletic problem-solving. She brings unusual defensive reach, a dangerous backhand, strong returning and a willingness to compete through imperfect patches. That combination makes her matches more layered than a simple star-player schedule listing.",
    playingStyle: "Gauff is built around movement, defense-to-offense transitions and a backhand that can hold up in the fastest rallies. She reads direction well, covers wide balls with long strides and often forces opponents to hit several winners in the same point. The serve gives her free points when the rhythm is right, while the forehand is the wing opponents most often test under pressure. Her best attacking tennis comes when she uses the backhand to change direction, steps inside the baseline after deep returns and finishes at the net instead of letting rallies reset.",
    careerContext: "Gauff is a priority page during Grand Slams, the North American hard-court swing, high-profile night sessions and matches against power hitters. Her US Open win proved she can handle the noise of a huge home stage; her clay success underlined how valuable her movement and rally tolerance are when the court gives her time to defend and counter. For viewers, matchup style matters. Against aggressive baseliners, watch whether she can lengthen rallies without leaving the forehand short. Against patient defenders, watch whether she can choose the right moment to step forward.",
    recentForm: "Gauff's form is best understood through serve rhythm, forehand depth, backhand confidence and how often her defense creates attacking chances rather than only survival. When those pieces connect, she can win ugly points and clean points in the same game, which is a rare pressure combination. When the serve or forehand becomes inconsistent, return games and athletic coverage usually keep her competitive while she searches for timing.",
    strengths: ["Movement and defense", "Backhand strength", "Return games", "Crowd interest"],
    surfaceContext: "Hard courts are especially relevant because they frame Gauff's U.S. star power and return game, while clay is important because her movement and patience can become major weapons.",
    surfacePreferences: "Outdoor hard courts give Gauff a strong balance of speed, bounce and crowd energy, especially in North American events. Clay rewards her defense, sliding and ability to extend points until opponents press. Grass can help her serve and athletic reactions, but it makes first-strike clarity and forehand timing more important.",
    watchReasons: ["Elite athletic defense that can turn a lost point into a winning position", "A strong backhand and return game that pressure even powerful opponents", "Major-title context on both hard courts and clay", "High-interest American matches with real tactical substance"],
  },
  "elena-rybakina": {
    nationality: "Kazakhstan",
    biography: "Elena Rybakina is a major WTA contender known for a calm presence, powerful serve and clean baseline hitting. Her matches are especially relevant on fast courts and during Grand Slam title races.",
    playingStyle: "Rybakina uses a heavy first serve, flat groundstrokes and measured aggression. She can win points quickly when she controls the first shot after serve or return.",
    careerContext: "Grass, hard courts and indoor conditions are strong contexts for following Rybakina.",
    strengths: ["First serve", "Flat baseline power", "Calm execution", "Fast-court efficiency"],
    surfaceContext: "Grass and hard courts are especially relevant.",
  },
  "jessica-pegula": {
    nationality: "United States",
    biography: "Jessica Pegula is a consistent WTA contender with strong hard-court results and regular appearances in deep tournament rounds. Her matches are useful for fans tracking reliable baseline tennis and American coverage.",
    playingStyle: "Pegula plays compact, efficient baseline tennis with early timing and clean direction changes. She often wins by controlling errors and court position.",
    careerContext: "Hard-court events, WTA 1000 tournaments and matches against power hitters are important contexts.",
    strengths: ["Clean timing", "Return stability", "Baseline efficiency", "Hard-court consistency"],
    surfaceContext: "Hard courts are the main context.",
  },
  "madison-keys": {
    nationality: "United States",
    biography: "Madison Keys is a powerful American WTA player whose matches are often defined by first-strike tennis, fast winners and aggressive baseline exchanges.",
    playingStyle: "Keys uses a big serve and heavy forehand to shorten points. When she controls timing, her matches can move quickly and produce many winners.",
    careerContext: "Hard courts, grass and matches against defensive players are useful contexts for following Keys.",
    strengths: ["Forehand power", "Serve strength", "Fast-court attacking", "Winner production"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "naomi-osaka": {
    nationality: "Japan",
    biography: "Naomi Osaka remains one of the most recognizable names in WTA tennis, with major-title history and strong global fan interest. Her schedule draws attention whenever she enters hard-court events and Grand Slams.",
    playingStyle: "Osaka plays powerful first-strike tennis, built around a strong serve and heavy baseline shots. She is especially dangerous when she dictates rallies early.",
    careerContext: "Hard courts and major events are the most important contexts for following Osaka.",
    strengths: ["Serve power", "Forehand pace", "Hard-court title history", "Global fan interest"],
    surfaceContext: "Hard courts are the signature context.",
  },
  "mirra-andreeva": {
    nationality: "Russia",
    biography: "Mirra Andreeva is one of the most watched young WTA players because of tactical maturity, variety and rapid progress through major tournaments. Fans often track her schedule to follow the next stage of her development.",
    playingStyle: "Andreeva uses smart point construction, changes of direction and calm shot selection. Her game is less about one huge weapon and more about reading rallies early.",
    careerContext: "Grand Slams, clay events and matches against established top players are useful contexts.",
    strengths: ["Tactical maturity", "Point construction", "Variety", "Composure"],
    surfaceContext: "Clay and hard courts are especially relevant.",
  },
  "jasmine-paolini": {
    nationality: "Italy",
    biography: "Jasmine Paolini is an Italian WTA player whose rise made her matches increasingly popular with fans following energetic baseline tennis and deep tournament runs.",
    playingStyle: "Paolini uses speed, compact strokes and aggressive court coverage. She can pressure opponents by taking the ball early and fighting for court position.",
    careerContext: "Clay, grass and Grand Slam draws are important contexts for following Paolini.",
    strengths: ["Speed", "Compact aggression", "Return pressure", "High-energy rallies"],
    surfaceContext: "Clay and grass are especially relevant alongside hard courts.",
  },
  "emma-navarro": {
    nationality: "United States",
    biography: "Emma Navarro is a rising American WTA player known for steady improvement, disciplined patterns and strong tournament consistency.",
    playingStyle: "Navarro plays controlled baseline tennis, using consistency and smart direction changes to create pressure without unnecessary risk.",
    careerContext: "Hard-court tournaments and matches against more powerful opponents are useful contexts.",
    strengths: ["Consistency", "Court discipline", "Return reliability", "Calm decision-making"],
    surfaceContext: "Hard courts are especially relevant.",
  },
};

function getEditorialProfile(playerSlug: PlayerSlug | null, playerName: string, tour: string): PlayerEditorialProfile {
  if (playerSlug && PLAYER_EDITORIAL_PROFILES[playerSlug]) {
    return PLAYER_EDITORIAL_PROFILES[playerSlug]!;
  }

  return {
    nationality: "Professional tennis",
    biography: `${playerName} is covered on Watch Tennis Today as part of our ${tour} tennis schedule and legal viewing guide. This page is designed to help fans understand match status, tournament context and official viewing checks without relying on unsafe stream pages.`,
    playingStyle: `${playerName} matches should be evaluated through the event, surface, round and opponent rather than only the scoreline. Tennis styles vary by tournament conditions, so this page focuses on practical context for following the match live.`,
    careerContext: `For ${playerName}, the most useful fan checks are the official order of play, local broadcaster rights, start window and whether the match is singles or doubles.`,
    strengths: ["Tournament context", "Schedule tracking", "Legal viewing checks", "Live-score awareness"],
    surfaceContext: "Surface context depends on the tournament and current draw.",
    watchReasons: ["Schedule context", "Official viewing checks", "Tournament relevance"],
  };
}

function buildPlayerSeoTitle(playerName: string) {
  return `Watch ${playerName} Live Today: Next Match, Schedule & Results`;
}

function buildPlayerSeoDescription(playerName: string) {
  return `Watch ${playerName} live today with next match time, recent results, tournament context and legal tennis TV and streaming information.`;
}

export async function generateStaticParams() {
  // Keep player pages on-demand. Prebuilding every player page makes Vercel
  // spend a long time in Collecting page data and can stall deployments.
  return [];
}

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  winner?: string | null;
  winnerId?: string | number | null;
  round?: string;
};


const PLAYER_SLUGS = Object.keys(players) as PlayerSlug[];

const PRIORITY_PLAYERS: PlayerSlug[] = [
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "holger-rune",
  "taylor-fritz",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "naomi-osaka",
  "mirra-andreeva",
];

function getStatusPriority(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "LIVE") return 0;
  if (normalized === "SUSPENDED") return 1;
  if (normalized === "UPCOMING") return 2;

  return 3;
}

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();

  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function sortMatchesByUserIntent(a: Match, b: Match) {
  const statusDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
  if (statusDiff !== 0) return statusDiff;

  return getMatchTime(a) - getMatchTime(b);
}

function getPlayerSlugByName(name: string) {
  const normalizedName = normalizePlayerName(name);

  return PLAYER_SLUGS.find((playerSlug) =>
    normalizePlayerName(players[playerSlug].name) === normalizedName
  );
}

function uniquePlayerSlugs(slugs: (PlayerSlug | undefined | null)[]) {
  const seen = new Set<PlayerSlug>();

  return slugs.filter((slug): slug is PlayerSlug => {
    if (!slug || seen.has(slug)) return false;

    seen.add(slug);
    return true;
  });
}

function getRelatedPlayers(
  currentSlug: PlayerSlug | null,
  playerMatches: Match[]
) {
  const currentTour = currentSlug ? players[currentSlug].tour : null;

  const opponentsFromMatches = playerMatches.flatMap((match) => [
    getPlayerSlugByName(match.player1),
    getPlayerSlugByName(match.player2),
  ]);

  const sameTourPriority = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const sameTourFallback = PLAYER_SLUGS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const otherPopularPlayers = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    Boolean(currentTour && players[playerSlug].tour !== currentTour)
  );

  return uniquePlayerSlugs([
    ...opponentsFromMatches,
    ...sameTourPriority,
    ...sameTourFallback,
    ...otherPopularPlayers,
  ]).slice(0, 8);
}

function formatPlayerName(slug?: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug || "");
  return canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(slug || "");
}

function isIndexablePlayerSlug(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const profile = canonicalSlug ? PLAYER_EDITORIAL_PROFILES[canonicalSlug] : null;

  return shouldIndexPlayerPage({
    canonicalSlug,
    biography: profile?.biography,
    playingStyle: profile?.playingStyle,
    careerContext: profile?.careerContext,
    recentForm: profile?.recentForm,
    strengths: profile?.strengths,
    surfaceContext: profile?.surfaceContext,
    surfacePreferences: profile?.surfacePreferences,
    watchReasons: profile?.watchReasons,
  });
}

function getPlayerDisplay(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const safeSlug = slugify(slug || "tennis-player") || "tennis-player";

  return {
    canonicalSlug,
    pageSlug: canonicalSlug || safeSlug,
    playerName: canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(safeSlug),
    isVerifiedPlayer: Boolean(canonicalSlug),
  };
}

function matchContainsPlayerText(match: Match, slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (canonicalSlug) {
    return matchContainsExactPlayer(match, canonicalSlug);
  }

  const target = normalizePlayerName(slug.replace(/-/g, " "));
  if (!target) return false;

  const fields = [match.player1, match.player2];

  return fields.some((value) => {
    const normalized = normalizePlayerName(value || "");
    return normalized === target || normalized.split(" ").includes(target);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { playerName, pageSlug } = getPlayerDisplay(slug);
  const indexable = isIndexablePlayerSlug(slug);

  return {
    // AdSense quality: verified player pages with substantial editorial profiles can index;
    // unknown/API-only player pages stay noindex to avoid thin generated pages.
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    title: buildPlayerSeoTitle(playerName),
    description: buildPlayerSeoDescription(playerName),
    alternates: {
      canonical: `https://watchtennistoday.com/player/${pageSlug}`,
    },
    openGraph: {
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
      url: `https://watchtennistoday.com/player/${pageSlug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
    },
  };
}

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes("localhost")
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(
  playerName?: string,
  options: { daysBack?: number; daysForward?: number; formHistory?: boolean } = {}
): Promise<Match[]> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams({
      includeFinished: "1",
      daysBack: String(Math.min(options.daysBack ?? 30, 30)),
      daysForward: String(Math.min(options.daysForward ?? 30, 30)),
    });

    if (options.formHistory) {
      params.set("formHistory", "1");
    }

    if (playerName) {
      params.set("playerName", playerName);
    }

    const response = await fetch(`${baseUrl}/api/matches?${params.toString()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("/api/matches failed:", response.status);
      return [];
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("/api/matches returned non-JSON:", text.slice(0, 300));
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.matches)) {
      return data.matches;
    }
  } catch (error) {
    console.error("/api/matches request failed on player page:", error);
  }

  return [];
}

function mergeMatchesById(matches: Match[]) {
  return Array.from(new Map(matches.map((match) => [String(match.id), match])).values());
}

function getArchiveDateStart(daysBack = 365) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysBack);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

async function getArchivedMatchesForPlayerPage(playerName: string): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time")
      .gte("start_time", getArchiveDateStart(365))
      .order("start_time", { ascending: false })
      .limit(500);

    if (error || !Array.isArray(data)) {
      if (error) console.warn("player page archive fallback unavailable:", error.message);
      return [];
    }

    return data
      .filter((match) =>
        [match.player1, match.player2].some((name) => doSinglesPlayerNamesMatch(String(name || ""), playerName))
      )
      .map((match) => ({
        id: String(match.id),
        player1: match.player1 || "Unknown player",
        player2: match.player2 || "Unknown player",
        tournament: match.tournament || "Unknown tournament",
        category: match.category || "UNKNOWN",
        status: match.status || "FINISHED",
        score: match.score || "",
        startTime: match.start_time || "",
      }));
  } catch (error) {
    console.warn("player page archive fallback skipped:", error);
    return [];
  }
}

async function getMatchesForPlayer(playerName: string): Promise<Match[]> {
  try {
    const playerScopedMatches = await getMatches(playerName, { daysBack: 30, daysForward: 30 });

    const scopedPlayerMatches = playerScopedMatches.filter((match) =>
      [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName))
    );

    const scopedCompletedSingles = scopedPlayerMatches
      .filter(isSinglesMatchForPlayerForm)
      .filter((match) => isFinishedMatch(match));

    // Use Supabase archive for older finished rows instead of forcing normal
    // player pages through expensive /api/matches?daysBack=365&formHistory=1 calls.
    const archivedMatches = scopedCompletedSingles.length >= 10
      ? []
      : await getArchivedMatchesForPlayerPage(playerName);

    return mergeMatchesById([...playerScopedMatches, ...archivedMatches]);
  } catch (error) {
    console.error("Player match lookup failed:", error);
    return getArchivedMatchesForPlayerPage(playerName);
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMatchSlug(match: Match) {
  const readablePart = slugify(
    `${match.player1}-vs-${match.player2}`
  );

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function formatMatchDateTime(value?: string) {
  if (!value) return "Time to be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time to be announced";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isInitialNamePart(value?: string) {
  return /^[a-z]$/i.test(String(value || "").replace(/\./g, ""));
}

function doublesSideIncludesPlayer(candidateName: string, targetName: string) {
  if (!/[\/&+]/.test(candidateName)) return false;

  const targetParts = normalizePlayerName(targetName || "").replace(/\./g, "").split(" ").filter(Boolean);
  const targetLast = targetParts.at(-1);
  if (!targetLast) return false;

  return candidateName
    .split(/[\/&+]/)
    .map((part) => normalizePlayerName(part).replace(/\./g, ""))
    .filter(Boolean)
    .some((part) => {
      const partTokens = part.split(" ").filter(Boolean);

      if (partTokens.length === 1) {
        return partTokens[0] === targetLast;
      }

      return doPlayerNamesMatch(part, targetName);
    });
}

function doSinglesPlayerNamesMatch(candidateName: string, targetName: string) {
  const candidate = normalizePlayerName(candidateName || "").replace(/\./g, "");
  const target = normalizePlayerName(targetName || "").replace(/\./g, "");

  if (!candidate || !target) return false;
  if (candidate === target) return true;

  const candidateParts = candidate.split(" ").filter(Boolean);
  const targetParts = target.split(" ").filter(Boolean);
  const candidateLast = candidateParts.at(-1);
  const targetLast = targetParts.at(-1);
  const candidateFirst = candidateParts[0];
  const targetFirst = targetParts[0];

  if (!candidateLast || !targetLast || !candidateFirst || !targetFirst) {
    return false;
  }

  // API feeds often abbreviate tennis names as "A. Zverev" / "A Zverev" while
  // player pages use the full display name "Alexander Zverev".
  if (candidateLast === targetLast && candidateFirst[0] === targetFirst[0]) {
    return true;
  }

  // API-Tennis H2H recent-player rows commonly use reversed abbreviated names,
  // e.g. "Zverev A.". Support surname + first initial so we do not drop Rome,
  // Madrid and other history rows before the form tracker can use them.
  if (candidateFirst === targetLast) {
    return candidateLast === targetFirst || (
      isInitialNamePart(candidateLast) && candidateLast[0] === targetFirst[0]
    );
  }

  if (targetFirst === candidateLast) {
    return targetLast === candidateFirst || (
      isInitialNamePart(targetLast) && targetLast[0] === candidateFirst[0]
    );
  }

  return false;
}

function doPlayerNamesMatch(candidateName: string, targetName: string) {
  return (
    doSinglesPlayerNamesMatch(candidateName, targetName) ||
    doublesSideIncludesPlayer(candidateName, targetName)
  );
}

function getOpponentForPlayer(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return match.player2;
  if (doPlayerNamesMatch(match.player2, playerName)) return match.player1;

  return `${match.player1} / ${match.player2}`;
}

function isLiveMatch(match: Match) {
  return match.status?.toUpperCase() === "LIVE" && !isFinishedMatch(match);
}

function hasUsableScore(match: Match) {
  const score = String(match.score || "").trim();
  return Boolean(score && score !== "-" && score !== "0-0" && score !== "0 - 0");
}

function isFinishedMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  if (["FINISHED", "ENDED", "COMPLETED", "FINAL", "RETIRED", "WALKOVER"].includes(normalized)) {
    return true;
  }

  // Some live feeds keep a match marked LIVE after the score is already complete.
  // A clearly completed tennis score must be treated as FINAL everywhere.
  return Boolean(inferMatchWinnerSideFromScore(match));
}

function isUpcomingMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  return ["UPCOMING", "SCHEDULED", "NOT_STARTED"].includes(normalized) || (!isLiveMatch(match) && !isFinishedMatch(match));
}

function getPlayerPageSummary(playerName: string, playerMatches: Match[]) {
  const liveMatches = playerMatches.filter(isLiveMatch);
  const upcomingMatches = playerMatches.filter(isUpcomingMatch);
  const finishedMatches = playerMatches.filter(isFinishedMatch);
  const nextMatch = liveMatches[0] || upcomingMatches[0] || playerMatches[0];
  const tournaments = Array.from(new Set(playerMatches.map((match) => match.tournament).filter(Boolean))).slice(0, 3);

  return {
    liveMatches,
    upcomingMatches,
    finishedMatches,
    nextMatch,
    tournaments,
    headline: liveMatches.length
      ? `${playerName} is live now`
      : nextMatch
        ? `Watch ${playerName} live today`
        : `${playerName} schedule and live stream guide`,
  };
}


type PlayerFormItem = {
  match: Match;
  result: "W" | "L";
  opponent: string;
};

function getPlayerSide(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return "player1";
  if (doPlayerNamesMatch(match.player2, playerName)) return "player2";

  return null;
}

function parseSetScore(setScore: string) {
  const cleaned = setScore
    .replace(/\([^)]*\)/g, "")
    .replace(/[–—]/g, "-")
    .trim();

  const match = cleaned.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;

  const first = Number.parseInt(match[1], 10);
  const second = Number.parseInt(match[2], 10);

  if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) {
    return null;
  }

  return { first, second };
}

function getWinnerSideFromWinnerField(match: Match) {
  const winner = normalizePlayerName(String(match.winner || match.winnerId || ""));
  if (!winner) return null;

  const player1 = normalizePlayerName(match.player1 || "");
  const player2 = normalizePlayerName(match.player2 || "");

  if (["1", "first", "first player", "player1", "player 1", "home", "homeplayer", "event first player", "event_first_player"].includes(winner)) return "player1";
  if (["2", "second", "second player", "player2", "player 2", "away", "awayplayer", "event second player", "event_second_player"].includes(winner)) return "player2";
  if (winner === player1 || player1.includes(winner) || winner.includes(player1) || doPlayerNamesMatch(match.player1, winner)) return "player1";
  if (winner === player2 || player2.includes(winner) || winner.includes(player2) || doPlayerNamesMatch(match.player2, winner)) return "player2";

  return null;
}

function isCompletedTennisSet(first: number, second: number) {
  const high = Math.max(first, second);
  const low = Math.min(first, second);

  if (high >= 6 && high - low >= 2) return true;
  if (high === 7 && low >= 5) return true;

  return false;
}

function inferMatchWinnerSideFromScore(match: Match) {
  if (!match.score || match.score === "-") return null;

  const sets = match.score
    .split(/[,;]/)
    .map(parseSetScore)
    .filter((set): set is { first: number; second: number } => Boolean(set));

  if (!sets.length) return null;

  let player1Sets = 0;
  let player2Sets = 0;
  let incompleteSets = 0;

  for (const set of sets) {
    if (!isCompletedTennisSet(set.first, set.second)) {
      incompleteSets += 1;
      continue;
    }

    if (set.first > set.second) {
      player1Sets += 1;
    } else {
      player2Sets += 1;
    }
  }

  if (incompleteSets > 0) return null;
  if (player1Sets === player2Sets) return null;

  const requiredSets = sets.length >= 5 ? 3 : 2;

  if (player1Sets >= requiredSets && player1Sets > player2Sets) return "player1";
  if (player2Sets >= requiredSets && player2Sets > player1Sets) return "player2";

  return null;
}

function inferMatchWinnerSide(match: Match) {
  return getWinnerSideFromWinnerField(match) || inferMatchWinnerSideFromScore(match);
}

function canUseMatchInPlayerForm(match: Match) {
  if (getWinnerSideFromWinnerField(match)) return true;
  if (!isFinishedMatch(match)) return false;

  return Boolean(inferMatchWinnerSideFromScore(match));
}


function isSinglesMatchForPlayerForm(match: Match) {
  const searchable = [match.category, match.tournament, match.round, match.player1, match.player2]
    .join(" ")
    .toLowerCase();

  const isMainTourSingles = /\b(atp|wta)\b/.test(searchable);
  if (!isMainTourSingles) return false;

  return ![
    "double",
    "doubles",
    "mixed",
    "boys",
    "girls",
    "junior",
    "juniors",
    "wheelchair",
    "legend",
    "legends",
  ].some((blocked) => searchable.includes(blocked));
}

function buildPlayerForm(playerName: string, candidateMatches: Match[]) {
  const sortedMatches = [...candidateMatches]
    .filter(isSinglesMatchForPlayerForm)
    .filter((match) => isFinishedMatch(match))
    .sort((a, b) => getMatchTime(b) - getMatchTime(a));
  const excludedMatches: Match[] = [];
  const form: PlayerFormItem[] = [];

  for (const match of sortedMatches) {
    if (form.length >= 10) break;

    const playerSide = getPlayerSide(match, playerName);
    const winnerSide = inferMatchWinnerSide(match);

    if (!playerSide || !winnerSide || !canUseMatchInPlayerForm(match)) {
      excludedMatches.push(match);
      continue;
    }

    form.push({
      match,
      result: playerSide === winnerSide ? "W" : "L",
      opponent: getOpponentForPlayer(match, playerName),
    });
  }

  const wins = form.filter((item) => item.result === "W").length;
  const losses = form.filter((item) => item.result === "L").length;
  const winRate = form.length ? Math.round((wins / form.length) * 100) : null;

  let currentStreakType: "W" | "L" | null = null;
  let currentStreakCount = 0;

  for (const item of form) {
    if (!currentStreakType) {
      currentStreakType = item.result;
      currentStreakCount = 1;
      continue;
    }

    if (item.result === currentStreakType) {
      currentStreakCount += 1;
      continue;
    }

    break;
  }

  const allTournaments = Array.from(
    new Set(form.map((item) => item.match.tournament).filter(Boolean))
  );
  const tournaments = allTournaments.slice(0, 4);

  const tournamentSnapshots = tournaments.map((tournament) => {
    const matches = form.filter((item) => item.match.tournament === tournament);
    const wins = matches.filter((item) => item.result === "W").length;

    return {
      tournament,
      played: matches.length,
      wins,
      losses: matches.length - wins,
    };
  });

  const datedFormItems = form
    .map((item) => ({ item, timestamp: getMatchTime(item.match) }))
    .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp < Number.MAX_SAFE_INTEGER);

  const largestGapDays = datedFormItems.reduce((largestGap, current, index) => {
    const next = datedFormItems[index + 1];
    if (!next) return largestGap;

    const gapDays = Math.floor(Math.abs(current.timestamp - next.timestamp) / (1000 * 60 * 60 * 24));
    return Math.max(largestGap, gapDays);
  }, 0);

  const hasLargeDateGap = largestGapDays > 30;

  // Use win-rate/streak only when the available feed has enough continuous completed
  // singles rows to support a real recent-form read. Scattered archive rows are
  // useful as available results, but must not be presented as season/career form.
  const hasMeaningfulRecentHistory = form.length >= 5 && !hasLargeDateGap;
  const isPartialAvailableHistory = form.length > 0 && !hasMeaningfulRecentHistory;

  if (process.env.NODE_ENV !== "production") {
    console.info("Player form debug", {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      hasLargeDateGap,
      largestGapDays,
      excludedMatches: excludedMatches.map((match) => ({
        id: match.id,
        player1: match.player1,
        player2: match.player2,
        status: match.status,
        score: match.score,
        winner: match.winner || null,
      })),
    });
  }

  return {
    form,
    wins,
    losses,
    winRate,
    currentStreakType,
    currentStreakCount,
    tournaments,
    tournamentSnapshots,
    hasMeaningfulRecentHistory,
    isPartialAvailableHistory,
    hasLargeDateGap,
    largestGapDays,
    debug: {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      excludedMatches,
    },
  };
}


export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { canonicalSlug, pageSlug, playerName, isVerifiedPlayer } = getPlayerDisplay(slug);

  const allMatches = await getMatchesForPlayer(playerName);



const playerMatches = allMatches
  .filter((match) =>
    [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName)) ||
    matchContainsPlayerText(match, pageSlug)
  )
  .sort(sortMatchesByUserIntent);

  const relatedPlayers = getRelatedPlayers(canonicalSlug, playerMatches);
  const sameTourLabel = canonicalSlug ? players[canonicalSlug].tour : "tennis";
  const editorialProfile = getEditorialProfile(canonicalSlug, playerName, sameTourLabel);
  const pageSummary = getPlayerPageSummary(playerName, playerMatches);
  const { liveMatches, upcomingMatches, finishedMatches, nextMatch, tournaments, headline } = pageSummary;
  const currentTournament = tournaments[0] || finishedMatches[0]?.tournament || upcomingMatches[0]?.tournament || liveMatches[0]?.tournament || "Not listed";
  const playerForm = buildPlayerForm(playerName, playerMatches);

  if (process.env.NODE_ENV !== "production") {
    console.info("Player page match dataset debug", {
      playerName,
      matchCenterMatches: playerMatches.length,
      formMatches: playerForm.form.length,
      finishedMatches: finishedMatches.length,
      liveMatches: liveMatches.length,
    });
  }

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${playerName} tennis profile`,
    url: `https://watchtennistoday.com/player/${pageSlug}`,
    about: {
      "@type": "Person",
      name: playerName,
      nationality: editorialProfile.nationality,
      description: `${playerName} tennis match schedule, player context and legal viewing information on Watch Tennis Today.`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `When is ${playerName} playing next?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: nextMatch
            ? `${playerName}'s next listed match on this page is ${nextMatch.player1} vs ${nextMatch.player2} at ${nextMatch.tournament}. Start times can change during tournaments, so fans should confirm the official order of play before the match.`
            : `No upcoming match is currently listed for ${playerName}. Tennis schedules can change quickly because of draws, weather delays and withdrawals.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I watch ${playerName} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Legal viewing options for ${playerName} depend on the tournament and your country. Use official broadcasters, licensed streaming platforms and country viewing guides before using any stream.`,
        },
      },
      {
        "@type": "Question",
        name: `Which players are similar to ${playerName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This page links to related ${sameTourLabel} player schedules and popular tennis profiles so fans can continue browsing match pages without duplicate content.`,
        },
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
  <Link href="/" className="hover:text-white">
    Home
  </Link>

  <span>/</span>

  <a
    href="/players"
    className="hover:text-white"
  >
    Players
  </a>

  <span>/</span>

  <span className="text-white">
    {playerName}
  </span>
</nav>
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-sm">
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
              {canonicalSlug ? players[canonicalSlug].tour : "Tennis"} player hub
            </span>
            {liveMatches.length ? (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white animate-pulse">
                Live now
              </span>
            ) : null}
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            {headline}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
            Follow {playerName} with today’s live match status, next opponent, recent results,
            tournament context and official tennis viewing guides in one place.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Live matches</p>
              <p className="mt-1 text-3xl font-black">{liveMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Upcoming</p>
              <p className="mt-1 text-3xl font-black">{upcomingMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Current tournament</p>
              <p className="mt-1 truncate text-2xl font-black">{currentTournament}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          Player profile
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          {playerName} biography, playing style and match context
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-sm leading-7 text-zinc-700">
            <p>{editorialProfile.biography}</p>
            <p>{editorialProfile.playingStyle}</p>
            <p>{editorialProfile.careerContext}</p>
            {editorialProfile.recentForm ? <p>{editorialProfile.recentForm}</p> : null}
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Tour</p>
                <p className="mt-1 font-black text-zinc-950">{sameTourLabel}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Country / context</p>
                <p className="mt-1 font-black text-zinc-950">{editorialProfile.nationality}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Surface note</p>
                <p className="mt-1 text-sm leading-6 text-zinc-700">{editorialProfile.surfaceContext}</p>
              </div>
              {editorialProfile.surfacePreferences ? (
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Surface preferences</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-700">{editorialProfile.surfacePreferences}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {editorialProfile.strengths.map((strength) => (
            <div key={strength} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold text-zinc-800">
              <span className="text-green-600">✓</span> {strength}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Why watch</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {(editorialProfile.watchReasons || []).map((reason) => (
              <li key={reason} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          Editorial player guide
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          How to follow {playerName} today
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Match context</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              This page combines live status, upcoming matches, recent available results and tournament links so fans can understand whether {playerName} is scheduled, live, finished or waiting for an updated order of play.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Legal viewing checks</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis broadcast rights depend on the event and viewer location. Before subscribing or clicking an external provider, confirm the tournament, court assignment and local broadcaster on official sources.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Schedule caution</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis start times can move when earlier matches run long, rain interrupts play or a player withdraws. Treat listed times as planning information and check the official order of play close to match time.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Data transparency</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Live score and schedule feeds may be incomplete for lower-level events. When the available feed is limited, this page avoids presenting partial data as full season form or guaranteed broadcast availability.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          What to watch
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          What matters in the next {playerName} match
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-sm leading-7 text-zinc-700">
            <p>
              The most useful way to follow {playerName} is to connect the match
              listing to the conditions around it. Surface, draw stage, rest
              days, court assignment and opponent style can matter as much as a
              ranking number. {editorialProfile.surfaceContext}
            </p>
            <p>
              For live viewing, start with the official order of play, then
              confirm whether the match belongs to ATP, WTA, Grand Slam or
              team-event coverage. Watch Tennis Today does not host or embed
              live streams; it helps users find official and legal broadcasters
              and streaming options.
            </p>
            <p>
              If no current match appears, that is still useful context rather
              than a dead end. Tennis schedules update in waves as draws,
              qualifiers, withdrawals and court assignments are published, so a
              player page should be used alongside the live schedule and the
              tournament hub.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h3 className="font-black text-zinc-950">
              Match-day checklist for {playerName}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              <li>Check whether the match is live, upcoming or already completed.</li>
              <li>Confirm the tournament page and official order of play.</li>
              <li>Match the event level to the correct broadcaster rights.</li>
              <li>Re-check local availability before subscribing or traveling.</li>
            </ul>
          </div>
        </div>
      </section>

      {!isVerifiedPlayer ? (
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-7 text-zinc-300">
          <p>
            This is a fallback tennis player schedule page created from a live-data slug.
            The player name has not been manually verified yet, so the page is kept out
            of search indexing while still giving crawlers and visitors a useful landing
            page instead of a 404.
          </p>
        </section>
      ) : null}

      <div className="mb-8">
        <LocalPlayerFollowButton
          playerName={playerName}
          playerSlug={pageSlug}
        />
      </div>
      <div className="mb-8">
        <PlayerFollowCTA
          playerName={playerName}
          playerSlug={pageSlug}
          source="player-page-revenue-cta"
        />
      </div>


      {playerMatches.some(isLiveMatch) ? (
  <section className="mb-8 rounded-2xl border border-red-500 bg-red-500/10 p-6">
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
        🔴 LIVE NOW
      </span>

      <span className="text-red-300 font-bold">
        {playerName} is currently playing live
      </span>
    </div>

    <p className="text-zinc-300 mb-5 leading-8">
      Follow the live match, score updates, official viewing information and current
      tournament coverage for {playerName}.
    </p>

    <div className="flex flex-wrap gap-3">
      {playerMatches
        .filter(isLiveMatch)
        .slice(0, 2)
        .map((match) => (
          <Link
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 transition-all"
          >
            Open Match Page →
          </Link>
        ))}
    </div>
  </section>
) : null}


      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player form tracker
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} recent results and form guide
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
              {playerForm.hasMeaningfulRecentHistory
                ? "Recent completed singles results from API-Tennis player history. Doubles, juniors, wheelchair and legends events are filtered out."
                : "Available feed results. This feed does not include every match from the player&apos;s season. Singles only, with doubles, juniors, wheelchair and legends events filtered out."}
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase text-zinc-600">
            {playerForm.hasMeaningfulRecentHistory ? "Recent form" : "Available feed results"}
          </span>
        </div>

        {playerForm.form.length ? (
          <>
            <div className={`grid gap-4 ${playerForm.hasMeaningfulRecentHistory ? "lg:grid-cols-[1.35fr_0.9fr]" : ""}`}>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-zinc-600">
                    {playerForm.hasMeaningfulRecentHistory ? "Continuous form guide" : "Partial results found"}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                    {playerForm.form.length} match{playerForm.form.length === 1 ? "" : "es"}
                  </p>
                </div>

                {playerForm.hasMeaningfulRecentHistory ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playerForm.form.map((item) => (
                      <a
                        key={item.match.id}
                        href={`/watch/${getMatchSlug(item.match)}`}
                        title={`${item.result === "W" ? "Won" : "Lost"} vs ${item.opponent}`}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition hover:scale-105 ${
                          item.result === "W"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.result}
                      </a>
                    ))}
                  </div>
                ) : null}

                {!playerForm.hasMeaningfulRecentHistory ? (
                  <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-900">
                    This feed does not include every match from the player&apos;s season{playerForm.hasLargeDateGap ? ` and has a ${playerForm.largestGapDays}-day gap between available results` : ""}. These rows are shown as partial available results, not as recent form, season form or career form.
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    Winner is taken from the feed when available, otherwise inferred only from clearly completed tennis scores. Unclear rows are excluded.
                  </p>
                )}
              </div>

              {playerForm.hasMeaningfulRecentHistory ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white">
                  <p className="text-sm font-bold text-zinc-400">Current streak</p>
                  <p className="mt-3 text-3xl font-black">
                    {playerForm.currentStreakType && playerForm.currentStreakCount
                      ? `${playerForm.currentStreakType === "W" ? "🔥" : "⚠️"} ${playerForm.currentStreakCount} ${playerForm.currentStreakType === "W" ? "win" : "loss"}${playerForm.currentStreakCount === 1 ? "" : "es"}`
                      : `${playerForm.wins}-${playerForm.losses}`}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Wins</p>
                      <p className="text-xl font-black">{playerForm.wins}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Losses</p>
                      <p className="text-xl font-black">{playerForm.losses}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Win rate</p>
                      <p className="text-xl font-black">
                        {playerForm.winRate !== null ? `${playerForm.winRate}%` : "TBC"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {playerForm.hasMeaningfulRecentHistory && playerForm.tournamentSnapshots.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {playerForm.tournamentSnapshots.map((snapshot) => (
                  <div key={snapshot.tournament} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="truncate text-sm font-black text-zinc-950">{snapshot.tournament}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      {snapshot.played} completed · {snapshot.wins}-{snapshot.losses}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {playerForm.form.slice(0, 10).map((item) => {
                const opponentSlug = getPlayerSlugByName(item.opponent);

                return (
                  <div
                    key={item.match.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4"
                  >
                    <div>
                      <p className="font-black text-zinc-950">
                        {item.result === "W" ? "Won" : "Lost"} vs {opponentSlug ? (
                          <Link href={`/player/${opponentSlug}`} className="hover:text-green-600">
                            {item.opponent}
                          </Link>
                        ) : item.opponent}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.match.tournament} · {formatMatchDateTime(item.match.startTime)}
                      </p>
                    </div>
                    <a
                      href={`/watch/${getMatchSlug(item.match)}`}
                      className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-800 hover:border-green-500 hover:bg-green-50"
                    >
                      {item.match.score || "Open result"} →
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-600">
            <p className="font-bold text-zinc-800">No usable completed matches yet.</p>
            <p className="mt-2">
              The available feed does not currently provide completed singles results with a reliable winner for {playerName}. Doubles, juniors, wheelchair and legends events are intentionally excluded.
            </p>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player match center
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} live, next match and recent results
            </h2>
          </div>
          <Link href="/today" className="text-sm font-bold text-green-600 hover:text-green-500">
            Today’s full schedule →
          </Link>
        </div>

        {playerMatches.length > 0 ? (
          <div className="grid gap-3">
            {playerMatches.slice(0, 10).map((match) => {
              const live = isLiveMatch(match);
              const finished = isFinishedMatch(match);
              const opponent = getOpponentForPlayer(match, playerName);

              return (
                <article
                  key={match.id}
                  className="rounded-2xl border border-zinc-200 p-3 transition hover:border-green-500 hover:bg-green-50/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {live ? (
                          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase text-white animate-pulse">
                            Live
                          </span>
                        ) : !finished ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                            Next
                          </span>
                        ) : null}
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                          {match.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-zinc-950">
                        {match.player1} vs {match.player2}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        Opponent/context: {opponent} · {formatMatchDateTime(match.startTime)}
                      </p>
                      {match.score ? (
                        <p className="mt-2 text-sm font-bold text-zinc-800">Score: {match.score}</p>
                      ) : null}
                    </div>

                    <a
                      href={`/tournament/${slugify(match.tournament)}`}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-600 hover:border-green-500 hover:text-green-600"
                    >
                      {match.tournament}
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/watch/${getMatchSlug(match)}`}
                      className="inline-flex items-center rounded-xl bg-black px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
                    >
                      {live ? "Follow live match" : finished ? "Open result" : "Open match"} →
                    </a>
                    <a
                      href={`/watch-player-live/${pageSlug}`}
                      className="inline-flex items-center rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-900 hover:border-green-500 hover:bg-white"
                    >
                      {playerName} live stream guide
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <p className="text-zinc-600 leading-7">
              No upcoming matches are currently listed for {playerName}. Tennis schedules can
              change quickly because of tournament draws, weather delays, withdrawals and TV
              scheduling updates.
            </p>

            <p className="mt-3 text-zinc-600 leading-7">
              You can still explore live tennis schedules, tournament pages and official
              broadcaster information to check where future {playerName} matches may be
              available legally.
            </p>
          </>
        )}
      </section>


      {tournaments.length ? (
        <section className="mb-10 rounded-3xl border border-zinc-200 bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">
            Current tournament context for {playerName}
          </h2>
          <p className="mb-5 text-sm leading-7 text-zinc-600">
            These are the tournaments currently connected to {playerName} in today’s match feed.
            Use them for draw, schedule and TV coverage context.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <a
                key={tournament}
                href={`/tournament/${slugify(tournament)}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 font-bold text-zinc-950 hover:border-green-500 hover:bg-green-50"
              >
                {tournament} →
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mb-10">
        <EmailCapture
          title={`Get notified when ${playerName} appears in today’s tennis schedule`}
          description="Get useful player alerts for next match windows, live status and official viewing checks. No spam and no unofficial stream links."
          placeholder="Email for player alerts"
          buttonText="Follow player"
          contextType="player"
          contextValue={playerName}
        />
      </div>

      <RevenueConversionPanel context="player" playerName={playerName} />


      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Keep watching
            </p>
            <h2 className="text-2xl font-semibold">
              Related tennis players
            </h2>
          </div>
          <a href="/players" className="text-sm font-bold text-green-600 hover:text-green-500">
            All players →
          </a>
        </div>

        <p className="mb-5 text-sm leading-7 text-zinc-600">
          Similar player pages help fans continue from one schedule page to another without adding duplicate content or interrupting the reading experience.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedPlayers.map((playerSlug) => {
            const player = players[playerSlug];
            const isSameTour = canonicalSlug
              ? player.tour === players[canonicalSlug].tour
              : false;

            return (
              <a
                key={playerSlug}
                href={`/player/${playerSlug}`}
                className="rounded-2xl border border-zinc-200 p-4 transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-bold">{player.name}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                    {player.tour}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                  {isSameTour ? "Same tour schedule and live match coverage" : "Popular player schedule and TV coverage"}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">Related resources</p>
        <h2 className="text-2xl font-black text-zinc-950">Player resources for rankings, tournaments and legal viewing</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          Continue from {playerName} to evergreen guides that explain rankings, tournament levels, scoring and legal streaming checks.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/atp-wta-rankings-explained" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Rankings explained →</Link>
          <Link href="/tennis-tournament-levels-guide" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Tournament levels →</Link>
          <Link href="/guides/tennis-scoring-explained" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Tennis scoring →</Link>
          <Link href="/tennis-streaming" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Legal streaming hub →</Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
        <h2 className="text-3xl font-black mb-5">
          📺 Where to Watch {playerName} Live
        </h2>

        <div className="space-y-5 text-zinc-300 leading-8">
          <p>
  Tennis fans can watch {playerName} live through official sports broadcasters,
  licensed streaming platforms and tournament TV partners, depending on country
  and tournament rights.
</p>

          <p>
            Coverage may include ATP Tour events, WTA tournaments, Grand Slams,
            Masters events and international competitions featuring {playerName}.
          </p>

          <p>
            Watch Tennis Today helps fans find match schedules, live tennis coverage,
            official viewing options and TV channels for upcoming {playerName} matches.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            View Tennis Schedule
          </Link>

          <Link
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
  <h2 className="text-xl font-bold mb-3">
    Legal Tennis Viewing Information
  </h2>

  <p className="text-sm leading-7 text-zinc-700">
    Watch Tennis Today is an informational tennis guide. We do not stream matches,
    embed live video or bypass broadcaster restrictions. Our player pages are built
    to help fans compare legal viewing options, understand tournament coverage and
    find official match information.
  </p>
</section>

     <section className="mb-10 rounded-2xl border border-zinc-200 p-6 space-y-4 text-sm leading-7">
  <h2 className="text-2xl font-semibold">
    About {playerName} Matches and Coverage
  </h2>

  <p>
    This page is designed to help tennis fans follow {playerName} in a legal and
    practical way. Instead of hosting streams, Watch Tennis Today focuses on match
    schedules, tournament context, official broadcaster information and country-based
    viewing guidance.
  </p>

  <p>
    Tennis TV rights can change depending on the tournament, location and broadcast
    partner. For that reason, availability for {playerName} matches may differ between
    ATP, WTA, Grand Slam and other professional tennis events.
  </p>

  <p>
    When no upcoming match is listed, fans can still use this page to explore related
    tournament coverage, live tennis schedules and official viewing options for future
    {playerName} matches.
  </p>

  <p>
    Watch Tennis Today does not host live tennis streams and does not provide
    unauthorized access to copyrighted broadcasts. The goal of this page is to make it
    easier to find reliable tennis viewing information from legitimate sources.
  </p>
</section>
     

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-700">
        <h2 className="text-2xl font-black text-zinc-950">Sources for this player page</h2>
        <p className="mt-3 text-sm leading-7">
          Player pages combine editorial context with available match and schedule data. Broadcast availability should always be verified with official tournament and broadcaster sources because tennis rights vary by country and event.
        </p>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">ATP Tour official player and tournament information</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">WTA official player and tournament information</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">ITF rules and tournament context where relevant</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">Official tournament websites and order-of-play pages</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
          <Link href="/how-we-source-data" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">How we source data</Link>
          <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">How we verify streams</Link>
          <Link href="/tennis-guides" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">Tennis guides hub</Link>
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-2xl font-black text-zinc-950">
          {playerName} live stream and schedule FAQ
        </h2>
        <div className="space-y-4 text-sm leading-7 text-zinc-700">
          <div>
            <h3 className="font-black text-zinc-950">Is {playerName} playing today?</h3>
            <p>
              Check the match center above for live, upcoming and recently finished matches.
              Tennis order of play can change after long matches, weather delays or withdrawals.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Where can I watch {playerName} legally?</h3>
            <p>
              Legal broadcasters depend on your country and the tournament. Start with the country
              guides and official tournament pages linked from this page before choosing a service.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Why does the match time change?</h3>
            <p>
              Tennis matches are often scheduled after previous matches on the same court. A late finish,
              rain delay or court change can move the start time.
            </p>
          </div>
        </div>
      </section>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",

      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://watchtennistoday.com",
        },

        {
          "@type": "ListItem",
          position: 2,
          name: "Players",
          item: "https://watchtennistoday.com/players",
        },

        {
          "@type": "ListItem",
          position: 3,
          name: playerName,
          item: `https://watchtennistoday.com/player/${pageSlug}`,
        },
      ],
    }),
  }}
/>
    </main>
  );
}
