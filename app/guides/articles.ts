export type GuideSection = { heading: string; body: string };
export type GuideFaq = { question: string; answer: string };
export type GuideArticle = { slug: string; title: string; description: string; category: string; intro: string; sections: GuideSection[]; faq: GuideFaq[] };

// AdSense quality pilot: the previous generated guide library has been reduced to five fully rewritten evergreen articles.
// Duplicative or thin topics should be reintroduced only after they receive human-quality drafts with distinct structure and examples.
export const guideArticles: GuideArticle[] = [
  {
    "slug": "break-points-explained",
    "title": "Break Points Explained",
    "description": "A clear explanation of break points in tennis: what they are, why they matter, and how to read them during real matches.",
    "category": "Scoring",
    "intro": "A break point is one of the easiest tennis phrases to hear and one of the most important to understand. It appears when the receiver is one point away from winning the server’s game. If the receiver wins that point, they “break serve.” If the server wins it, the game continues and the pressure moves to the next point.\n\nThis guide explains break points as a match situation, not just a dictionary term. You will learn what the scoreboard looks like, why the server is under pressure, why some break points are more valuable than others, and what to watch when a player is trying to protect serve.",
    "sections": [
      {
        "heading": "The basic definition",
        "body": "A break point happens only when the player receiving serve can win the game with the next point. The common scores are 0-40, 15-40, 30-40 and advantage receiver. At 0-40 the receiver has three break points. At 15-40 there are two. At 30-40 or advantage receiver there is one.\n\nThe word “break” matters because serving is normally an advantage. A server starts every point, chooses placement, and can win quick points with a strong first serve. When the receiver earns break point, they have created a chance to take away that built-in advantage. That is why commentators treat break points as turning points even when the set score still looks close."
      },
      {
        "heading": "Why break points change the match",
        "body": "A break of serve can decide a set because most professional players expect to hold serve more often than they break. If a player breaks early, the rest of the set changes: the leader may serve with more margin, while the player behind often has to take more risk on return games.\n\nThe emotional pressure is different too. The server is not simply trying to win another point. They are trying to avoid losing control of the set. On break point, second serves often become more cautious, forehands may be aimed with extra safety, and players sometimes return to their most trusted patterns rather than trying something spectacular."
      },
      {
        "heading": "Triple break point is not the same as one break point",
        "body": "At 0-40, the receiver has three chances to break. That sounds comfortable, but the game is not over. A strong server can erase three chances with a first serve, a plus-one forehand and one brave second serve. Still, three break points force the server to prove they can repeat quality under pressure.\n\nA single break point at 30-40 or advantage receiver is sharper. The server knows one mistake loses the game. The receiver may choose between aggression and patience: attack the second serve, block the return deep, or make the server play one more ball. The best returners are not always the loudest shot-makers; they are often the players who make the server feel every part of the court."
      },
      {
        "heading": "How commentators use the term",
        "body": "When a commentator says “break point,” they are often pointing to the tactical question behind the score. Can the server find a first serve? Will the receiver step forward? Is the player under pressure still using the same pattern that worked earlier?\n\nIn the 2023 Wimbledon final between Carlos Alcaraz and Novak Djokovic, service games became small battles of adjustment. Alcaraz often had to survive pressure by mixing pace, height and direction rather than simply hitting harder. Djokovic, one of the best returners in history, made many service games feel tense because he could neutralize strong serves and extend rallies. Break points in that kind of match were not random scoreboard events; they were the clearest moments when the tactical balance was exposed."
      },
      {
        "heading": "Break point conversion and break point saved",
        "body": "Two statistics often appear beside break points: conversion and saved. Break point conversion tells you how many break chances the receiver turned into breaks. Break points saved tells you how often the server escaped those chances.\n\nBoth stats need context. A player can convert one of one break points and look perfect, while another can convert four of twelve and still dominate return games. The number alone does not tell you the quality of the chances. Were they second-serve points? Were they on clay, grass or indoor hard court? Did they come early in the set or at 5-5? Good analysis connects the statistic to the match situation."
      },
      {
        "heading": "What fans should watch on break point",
        "body": "Start with the serve. Does the server go wide, body or down the T? Do they trust the second serve or roll it in safely? Then watch the receiver’s position. A receiver standing inside the baseline is showing intent; one standing deep may be preparing to neutralize and start the rally.\n\nThe next clue is the first rally ball. Many players build break-point patterns around the shot after the serve or return. A server may serve wide and hit into the open court. A receiver may block deep to the backhand and wait for a short ball. Once you notice those patterns, break points become easier to read than highlight reels."
      },
      {
        "heading": "Common beginner mistake",
        "body": "Do not treat every break point as equally dramatic. A break point in the first game of the match matters, but a break point at 4-4 or 5-5 usually carries more consequence. A break point against a tired server late in a long set is different from one against a player who has been holding comfortably all day.\n\nThe right question is: what would this break change? Sometimes it changes the set immediately. Sometimes it changes confidence. Sometimes it reveals that a player can no longer protect a weakness, such as a vulnerable second serve or a backhand under pressure."
      }
    ],
    "faq": [
      {
        "question": "What score is a break point in tennis?",
        "answer": "Break point occurs when the receiver is one point from winning the server’s game. Common scores are 0-40, 15-40, 30-40 and advantage receiver."
      },
      {
        "question": "Is 40-40 a break point?",
        "answer": "No. 40-40 is deuce. The receiver must win the next point to reach advantage receiver, which is then a break point."
      },
      {
        "question": "Why are break points so important?",
        "answer": "They matter because the server normally has the advantage. A break point gives the receiver a chance to take the game and often change the direction of the set."
      },
      {
        "question": "What does break point saved mean?",
        "answer": "It means the server won a point while facing break point, so the receiver did not break serve on that chance."
      }
    ]
  },
  {
    "slug": "tennis-tiebreak-rules",
    "title": "Tennis Tiebreak Rules Explained",
    "description": "How tennis tiebreaks work, including serving order, points, changeovers and final-set tiebreaks.",
    "category": "Scoring",
    "intro": "A tiebreak is the short scoring game used to decide a set when the score reaches 6-6 in most modern formats. Instead of playing regular games until someone breaks serve, players play points numbered 1, 2, 3 and so on. The usual set tiebreak is first to seven points, but the winner must lead by at least two.\n\nTiebreaks are easy to follow once you know three things: the target score, the serve order and the change-of-ends rhythm. This guide explains those details and shows why tiebreaks feel so different from normal games.",
    "sections": [
      {
        "heading": "The standard set tiebreak",
        "body": "In a normal set tiebreak, the first player to reach seven points wins the tiebreak and the set, provided they lead by two points. A 7-4 tiebreak is finished. A 7-6 tiebreak is not, because the lead is only one. The players continue until someone leads by two, such as 8-6, 10-8 or 14-12.\n\nThe ITF Rules of Tennis describe a tie-break set as a set where a tie-break game is played if the score reaches six games all. In that tie-break game, points are counted with ordinary numbers rather than love, 15, 30 and 40. That simple change makes the pressure more visible for fans."
      },
      {
        "heading": "Serving order",
        "body": "The player whose turn it is to serve begins the tiebreak with one serve from the deuce court. After that, the opponent serves two points: first from the ad court, then from the deuce court. The players then continue serving two points each until the tiebreak ends.\n\nThis pattern matters because mini-breaks replace normal breaks of serve. If you win a point on your opponent’s serve in a tiebreak, fans often call it a mini-break. One mini-break can be enough if you protect your own serve, but tiebreaks can swing quickly because every point is counted directly."
      },
      {
        "heading": "Changing ends",
        "body": "Players change ends after every six points in a standard tiebreak. For example, they change at 3-3, 6-0, 5-1, 7-5 if the tiebreak is still alive, and so on. This keeps wind, sun and court conditions from favoring one player for too long.\n\nFor viewers, the change of ends is also a natural pause to read the match. Is one player rushing? Is the server choosing the same target? Has the returner moved forward? Tiebreaks are short, so small tactical details become louder."
      },
      {
        "heading": "Why tiebreaks feel different",
        "body": "A regular service game gives players some room to recover from one poor point. A tiebreak gives less room. A double fault at 1-1 is not fatal, but it can immediately change the scoreboard. A missed easy forehand at 5-5 may create set point.\n\nThis is why some players with huge serves are dangerous in tiebreaks. They can win quick points and keep the scoreboard pressure on the opponent. But great returners can flip the same situation by making one extra ball. Novak Djokovic’s career is full of tiebreaks where he did not need to dominate every rally; he needed to be cleaner on the few points that mattered most."
      },
      {
        "heading": "Final-set tiebreaks",
        "body": "Tournament rules can differ, so fans should always check the event format. Grand Slam tennis now uses final-set tiebreaks, but the exact target can be different from a normal seven-point tiebreak. The important principle stays the same: the match can be decided by a short points race rather than by continuing games indefinitely.\n\nThe 2019 Wimbledon final between Djokovic and Roger Federer is a famous example of final-set tiebreak pressure. The match reached 12-12 in the fifth set under the rule used at Wimbledon at the time, then Djokovic won the deciding tiebreak. It showed why final-set rules are more than technical details; they shape the emotional ending of a major final."
      },
      {
        "heading": "Set point, match point and mini-breaks",
        "body": "In a tiebreak, set point happens when one player is one point from winning the set. Match point happens when one player is one point from winning the match. A mini-break is not an official scoring term, but fans and commentators use it constantly to mean a point won against serve inside the tiebreak.\n\nA player leading 5-3 with a mini-break still has work to do. If they lose the next return point or double fault, the lead can vanish. The best tiebreak players manage the score without becoming passive. They understand which points invite aggression and which points demand a high-percentage target."
      },
      {
        "heading": "How to watch a tiebreak well",
        "body": "Follow the serve order first. Many fans get confused because the first server serves one point and then the two-point pattern begins. Once you know who should be serving, the score becomes easier to understand.\n\nNext, watch return depth. A deep blocked return can be as valuable as a clean winner because it prevents the server from attacking the second shot. Finally, watch body language between points. In tiebreaks, the player who resets quickly after a mistake often looks more stable by the final points."
      }
    ],
    "faq": [
      {
        "question": "How many points do you need to win a tennis tiebreak?",
        "answer": "In a standard set tiebreak, you need at least seven points and a two-point lead."
      },
      {
        "question": "Who serves first in a tiebreak?",
        "answer": "The player whose turn it is to serve starts with one point. After that, players serve two points each."
      },
      {
        "question": "What is a mini-break?",
        "answer": "A mini-break is a point won by the receiver during a tiebreak. It is not a separate game; it is simply a point against serve."
      },
      {
        "question": "Do players change ends during a tiebreak?",
        "answer": "Yes. In standard tiebreaks, players change ends after every six points."
      }
    ]
  },
  {
    "slug": "atp-rankings-explained",
    "title": "ATP Rankings Explained",
    "description": "A practical guide to ATP rankings: points, rolling totals, tournament levels and why rankings change every week.",
    "category": "Rankings",
    "intro": "The ATP rankings are the weekly points table used to order men’s professional tennis players. They help determine tournament entry, seedings and the storylines fans see every week. A ranking is not a subjective power ranking; it is a points total built from tournament results across a rolling period.\n\nUnderstanding the ATP rankings helps explain why a player can win a title and barely move, why another player can drop after reaching the same round as last year, and why defending points matters so much during the season.",
    "sections": [
      {
        "heading": "The basic idea",
        "body": "Players earn ranking points by winning matches at eligible ATP Tour, Grand Slam, Challenger and other professional events. Bigger tournaments award more points. Winning a Grand Slam is worth far more than winning a small tour event, and reaching the final is worth more than losing in the early rounds.\n\nThe rankings are usually calculated on a rolling 52-week basis. That means a player’s points from last year’s event eventually drop off and are replaced by the player’s result this year. If the player does worse than last year, their ranking total can fall even if they still played well."
      },
      {
        "heading": "Why defending points matters",
        "body": "The phrase “defending points” means a player has points from the same period last year that are about to expire. Suppose a player won a tournament last year and earned a large points total. When that event returns, those points come off. The player must perform well again to keep a similar total.\n\nThis is why a champion can feel pressure before playing a single match. Carlos Alcaraz, Jannik Sinner and Novak Djokovic have all had seasons where their ranking story was not just about winning now, but about protecting results from the previous year. The ranking table is constantly comparing present performance with past performance."
      },
      {
        "heading": "Tournament levels",
        "body": "Grand Slams, ATP Masters 1000 events, ATP 500 events and ATP 250 events do not carry the same ranking weight. The title names give a rough clue: Masters 1000 events are among the biggest regular ATP Tour events, while ATP 500 and ATP 250 events award smaller totals.\n\nFans should not reduce every result to points, though. A deep run at a smaller tournament can rebuild confidence, help a player improve seeding, or provide match rhythm before a major. Rankings measure results, but they do not always capture the full sporting value of a week."
      },
      {
        "heading": "Rankings vs race",
        "body": "The ATP rankings and the ATP Race are related but not the same. The regular rankings look back across the rolling ranking period. The Race counts points earned during the current season and is used to track qualification for the year-end ATP Finals.\n\nThis difference explains why a player may be ranked highly but not be near the top of the Race early in a season. They may still be carrying strong results from the previous year, while another player has collected more points since January."
      },
      {
        "heading": "How rankings affect tournaments",
        "body": "Rankings influence direct entry into tournaments. Higher-ranked players can enter major events without qualifying, while lower-ranked players may need to play qualifying rounds or use wild cards. Rankings also affect seeding. Seeded players are placed in the draw so they cannot meet certain other seeds in the earliest rounds.\n\nThis does not make the draw easy. A dangerous unseeded player can still appear early, especially after injury or a ranking drop. But rankings create the structure that prevents the top players from being randomly placed against each other in round one."
      },
      {
        "heading": "Why rankings can feel unfair",
        "body": "Rankings are useful, but they are not perfect. Injury can distort a player’s position. Surface preference can matter. A player may be far stronger on clay than on grass, but the ranking combines the entire calendar. A young player may be improving faster than the ranking table shows.\n\nThat is why fans often discuss form and ranking separately. Ranking tells you what a player has earned over time. Form tells you how they look right now. The best preview of a match usually uses both."
      },
      {
        "heading": "What to watch as a fan",
        "body": "When rankings change after a tournament, look beyond the number beside the player’s name. Ask which points came off, which points were added, what surface is coming next, and whether the player has many points to defend soon.\n\nThis turns rankings from a static list into a season map. You can understand why one player enters a Masters event under pressure, why another chooses a smaller tournament for points, and why a strong week at the right time can change a draw months later."
      }
    ],
    "faq": [
      {
        "question": "How often are ATP rankings updated?",
        "answer": "ATP rankings are generally updated weekly, after eligible tournament results are processed."
      },
      {
        "question": "Are ATP rankings the same as the ATP Race?",
        "answer": "No. Rankings usually reflect a rolling period, while the Race tracks points earned during the current season."
      },
      {
        "question": "Why can a player lose points after playing well?",
        "answer": "Because old points expire. If a player reached a final last year but only reaches a quarterfinal this year, their total may drop."
      },
      {
        "question": "Do rankings decide Grand Slam seeds?",
        "answer": "Rankings are a major basis for seeding, though tournament rules and timing can affect the final seed list."
      }
    ]
  },
  {
    "slug": "walkover-vs-retirement",
    "title": "Walkover vs Retirement in Tennis",
    "description": "The difference between a walkover, retirement and withdrawal, with examples and what each means for fans.",
    "category": "Rules",
    "intro": "Walkover, retirement and withdrawal are easy to mix up because all three involve a match not being completed in the normal way. The difference is timing. A walkover happens when a scheduled match does not start. A retirement happens after the match has started. A withdrawal usually describes a player pulling out of an event before a specific match is played.\n\nThese words matter for draws, tickets, statistics, betting rules and fan expectations. They also matter because tennis is physically demanding and individual players have no teammates who can replace them mid-match.",
    "sections": [
      {
        "heading": "What is a walkover?",
        "body": "A walkover occurs when a player advances because the opponent cannot play the match. The match never begins. The reason may be injury, illness, personal circumstances or another issue accepted by the tournament.\n\nFor fans, the key point is that a walkover is not a normal win on court. The advancing player moves to the next round, but there is no match score to analyze. You should not treat a walkover as evidence that the advancing player outplayed the opponent that day; the contest did not happen."
      },
      {
        "heading": "What is a retirement?",
        "body": "A retirement happens when a match starts but one player cannot continue. The scoreboard will show the score at the moment the match ended. The remaining player advances, while the retired player is recorded as unable to finish.\n\nRetirements can be emotionally awkward. A player may be losing because of the physical issue, or the issue may appear suddenly after a competitive start. Fans should be careful with assumptions. A retirement tells you the match ended early, not always exactly when the problem began."
      },
      {
        "heading": "What is a withdrawal?",
        "body": "Withdrawal is a broader term. It usually means a player has pulled out of a tournament or event before playing a particular match. A withdrawal can create a walkover for the scheduled opponent, open a place for a lucky loser, or change the draw before play begins.\n\nThe word often appears before tournaments when players announce that they are not ready to compete. It can also appear during an event if a player wins one match but cannot take the court in the next round."
      },
      {
        "heading": "Why the distinction matters",
        "body": "The timing affects how the result is understood. A completed match gives analysts tactics, statistics and momentum. A retirement gives partial evidence. A walkover gives almost no tennis evidence. The advancing player benefits, but the sporting information is limited.\n\nIt also matters for fans planning a day at a tournament. If a high-profile match becomes a walkover, the court schedule may be adjusted. Another match might be moved, a doubles match might fill the slot, or the session may feel lighter than expected."
      },
      {
        "heading": "Examples fans remember",
        "body": "Rafael Nadal’s injury retirement against Marin Cilic at the 2018 Australian Open quarterfinal is a clear example of a match that began as a contest and ended because one player could not continue. The score matters, but the retirement is central to how the result is remembered.\n\nWalkovers are remembered differently. When a player cannot take court before a match, fans often talk more about the missed matchup than the result. The draw moves forward, but the tennis question remains unanswered."
      },
      {
        "heading": "How it affects statistics",
        "body": "Statistics from retirements can be tricky. Some match stats exist because points were played, but the match may not tell a complete story. A player leading comfortably before an opponent retires still deserves credit for the tennis played, yet analysts usually avoid drawing the same conclusions they would from a full match.\n\nWalkovers generally should not be used as tactical evidence. There are no serve numbers, rally patterns or break-point decisions to study. The useful information is about availability and draw movement, not performance."
      },
      {
        "heading": "How fans should read the draw",
        "body": "When you see W/O, RET or withdrawal language in a draw, pause before judging the players. Check whether the match started, whether a score exists, and whether the tournament issued an explanation. Then look at how the next round changes.\n\nThis makes you a better reader of tennis results. Not every line in a draw represents the same kind of win, and not every exit says the same thing about form. Tennis uses compact labels, but the story behind those labels is often more human than the scoreboard shows."
      }
    ],
    "faq": [
      {
        "question": "Is a walkover the same as a retirement?",
        "answer": "No. A walkover means the match did not start. A retirement means the match started but one player could not finish."
      },
      {
        "question": "Does the opponent get credit for a win after a walkover?",
        "answer": "The opponent advances in the draw, but a walkover is not the same as winning a completed match on court."
      },
      {
        "question": "What does RET mean on a tennis scoreboard?",
        "answer": "RET means retired. The match started, then one player stopped before the normal finish."
      },
      {
        "question": "Can a withdrawal happen before a tournament starts?",
        "answer": "Yes. Players can withdraw before an event or before a later-round match if they cannot continue."
      }
    ]
  },
  {
    "slug": "tennis-surfaces-explained",
    "title": "Tennis Surfaces Explained",
    "description": "How clay, grass and hard courts change tennis tactics, movement, scheduling and match expectations.",
    "category": "Surfaces",
    "intro": "Tennis is unusual because the same sport changes dramatically depending on the court surface. Clay, grass and hard courts use the same scoring system, but they reward different movement, shot selection and patience. A player who looks untouchable on one surface can look much more vulnerable on another.\n\nUnderstanding surfaces helps fans read matches before the first ball. It explains why certain players dominate spring clay events, why grass seasons feel rushed and dangerous, and why hard courts produce many of the sport’s most balanced matchups.",
    "sections": [
      {
        "heading": "The three main surfaces",
        "body": "The main professional surfaces are clay, grass and hard court. Clay is slower and higher bouncing. Grass is faster and lower bouncing. Hard court sits between them, though speed can vary from tournament to tournament.\n\nThose differences change how points are built. On clay, players often have more time to defend and reset. On grass, the ball can stay low and reward first-strike tennis. On hard courts, movement, serve quality and baseline control usually combine in a more balanced way."
      },
      {
        "heading": "Clay courts",
        "body": "Clay rewards patience, heavy topspin and sliding movement. The ball tends to bounce higher, which gives defenders time but can also push opponents out of position. Players who can repeat physical rallies without losing depth often thrive.\n\nRafael Nadal at Roland Garros is the defining modern example. His left-handed topspin forehand, court coverage and ability to turn defense into attack made clay look like a different sport. Iga Swiatek’s dominance in Paris has shown a similar modern lesson on the WTA side: controlled aggression on clay is not just about hitting hard, but about using shape, margin and movement."
      },
      {
        "heading": "Grass courts",
        "body": "Grass usually rewards serving, first volleys, low slices and quick reactions. The bounce can stay lower, and points can feel shorter. Movement is also different because players must handle a slicker surface and stay balanced through quick changes.\n\nWimbledon is the main grass-court reference for most fans. Roger Federer’s grass-court success was built on more than elegance; his serve accuracy, early ball-striking and ability to move forward made him extremely difficult to rush. Modern grass tennis includes longer rallies than in previous eras, but the surface still punishes slow preparation."
      },
      {
        "heading": "Hard courts",
        "body": "Hard courts are the most common professional surface and can vary in speed. Some hard courts feel gritty and slower; others reward flatter hitting and fast serving. Because the bounce is usually more predictable than grass and less extreme than clay, hard courts often create tactical balance.\n\nNovak Djokovic’s hard-court record shows what the surface can reward: elite returning, flexible movement, depth under pressure and the ability to change direction safely. On the WTA side, players such as Serena Williams and Naomi Osaka have shown how a powerful serve-plus-first-strike game can dominate hard courts when timing is sharp."
      },
      {
        "heading": "How surfaces change tactics",
        "body": "On clay, a safe heavy ball can be attacking because it pushes the opponent back. On grass, the same looping ball may sit up or fail to penetrate. On hard courts, players often search for the right balance between margin and direct pace.\n\nReturn position changes too. On clay, returning from deeper behind the baseline can buy time. On grass, standing too far back can leave short angles and low skidding serves difficult to reach. Surface is not background decoration; it changes the geometry of the point."
      },
      {
        "heading": "How surfaces affect scheduling",
        "body": "Surfaces also shape the tennis calendar. The clay swing builds toward Roland Garros. The short grass season leads into Wimbledon. Hard-court stretches dominate large parts of the year, including the Australian Open and US Open.\n\nFor fans, that means form does not always transfer cleanly. A player who wins a clay title may still need matches to adjust to grass timing. A player returning from injury may choose certain surfaces carefully because movement demands are different."
      },
      {
        "heading": "What to watch in a match",
        "body": "Watch the height of the bounce first. If a player is taking balls above shoulder height, the surface and spin are already shaping the rally. Then watch court position. Is one player being pushed back? Is the other stepping inside the baseline?\n\nFinally, watch how players finish points. Clay points may end after construction and patience. Grass points may end after a serve, return or first volley. Hard-court points often reveal who can control the center of the court. Once you notice those surface patterns, predictions and commentary make much more sense."
      }
    ],
    "faq": [
      {
        "question": "What is the slowest tennis surface?",
        "answer": "Clay is generally considered the slowest main surface because the ball loses speed and often bounces higher."
      },
      {
        "question": "What is the fastest tennis surface?",
        "answer": "Grass is usually the fastest main surface, with lower bounces and shorter reaction time."
      },
      {
        "question": "Why do some players perform better on clay?",
        "answer": "Clay rewards movement, topspin, patience and point construction, so players with those strengths often perform better there."
      },
      {
        "question": "Are all hard courts the same speed?",
        "answer": "No. Hard-court speed varies by tournament, materials and conditions, even though the bounce is usually more predictable than grass or clay."
      }
    ]
  }
];

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return guideArticles.find((article) => article.slug === slug);
}
