export type GuideSection = { heading: string; body: string };
export type GuideFaq = { question: string; answer: string };
export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  publishedDate?: string;
  updatedDate?: string;
  sourceReferences?: string[];
};

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

  ,
  {
    "slug": "tennis-scoring-system-explained",
    "title": "Tennis Scoring System Explained",
    "description": "A beginner-friendly guide to love, 15, 30, 40, deuce, advantage, games, sets and matches.",
    "category": "Scoring",
    "intro": "Tennis scoring looks strange because it uses several layers at once. A player wins points to win a game, games to win a set, and sets to win the match. The words love, 15, 30 and 40 can make the sport feel harder than it is, but the structure is logical once you separate the scoreboard into those layers.\n\nThis guide explains the scoring system in match language, so a new fan can follow a live score without needing a rulebook beside the screen.",
    "sections": [
      {"heading":"Points inside a game","body":"A standard game starts at love-love. The first point is called 15, the second is 30 and the third is 40. If a player wins the next point from 40 while the opponent has 30 or less, the game is over. If both players reach 40, the score is deuce and the game must be won by two consecutive points.\n\nThe unusual numbers are historical, but fans do not need the history to follow the action. Treat 15, 30 and 40 as steps on a ladder. Once both players reach the top together, deuce begins."},
      {"heading":"Deuce and advantage","body":"At deuce, one point is not enough to win the game. The player who wins the next point gets advantage. If the same player wins again, they win the game. If the other player wins the point, the score returns to deuce.\n\nThis is why some games last much longer than others. A server can be one point from winning several times and still lose the game if the receiver keeps dragging the score back to deuce."},
      {"heading":"Games and sets","body":"Most sets are first to six games, but the winner usually needs a two-game lead. A 6-4 set is complete. At 5-5, a player normally needs to win 7-5 or reach a tiebreak at 6-6 depending on tournament rules.\n\nFor fans, the set score tells the larger story. A player leading 4-1 is close to controlling the set, while 4-4 means the pressure is concentrated into a few service games."},
      {"heading":"Best of three and best of five","body":"Most ATP and WTA matches are best of three sets. Grand Slam men’s singles matches are usually best of five, while women’s singles are best of three. A best-of-three match ends when a player wins two sets; a best-of-five match ends when a player wins three.\n\nThis format changes tactics. In best of five, momentum can swing over several hours, and physical endurance becomes part of the scoreboard."},
      {"heading":"How to read a live score","body":"Read the score from biggest to smallest: match sets, current set games, then current game points. For example, if a player leads one set to zero, trails 3-4 in the second set and the game is 30-40, they are ahead in the match but under pressure in the current return game.\n\nOnce you read scores this way, tennis becomes easier to follow because each point has a visible place in the match structure."}
    ],
    "faq": [
      {"question":"What does love mean in tennis?","answer":"Love means zero. A score of love-15 means the server has zero points and the receiver has one point in the current game."},
      {"question":"Why is tennis scored 15, 30 and 40?","answer":"The exact origin is debated, but modern fans can treat 15, 30 and 40 as the first three scoring steps before a game is won."},
      {"question":"What happens at deuce?","answer":"At deuce, a player must win two points in a row to win the game: one to earn advantage and one to finish the game."},
      {"question":"How many sets do you need to win?","answer":"In best of three, two sets win the match. In best of five, three sets win the match."}
    ]
  },
  {
    "slug": "tennis-seeds-explained",
    "title": "What Is a Seed in Tennis?",
    "description": "What seeded players are, how seeding affects tournament draws, and why seeds matter for fans reading a bracket.",
    "category": "Tournaments",
    "intro": "A seed is a player placed in the draw so the strongest entrants are less likely to meet in the earliest rounds. Seeding does not guarantee results, but it gives a tournament structure and helps fans understand why certain matchups cannot happen immediately.\n\nThis guide explains seeds without pretending they are predictions. A seed is a draw position based on ranking or tournament criteria, not a promise that the player will reach a specific round.",
    "sections": [
      {"heading":"The basic idea","body":"Seeded players are separated in the draw. In a Grand Slam singles draw, the top seeds are placed so they cannot all land in the same small section. This protects the tournament from having the highest-ranked players eliminate each other immediately.\n\nUnseeded players can still beat seeds. Tennis draws create structure, not safety."},
      {"heading":"Why the top seed matters","body":"The number one seed is usually the highest-ranked entered player, but rankings can shift and withdrawals can change the field. Being the top seed means the draw is built around that player’s position, but the player still has to win every match.\n\nFans often overreact to seeding. A top seed on an uncomfortable surface or returning from injury may have a harder path than the number suggests."},
      {"heading":"How seeds shape the draw","body":"Seeds are distributed through sections of the bracket. The goal is to avoid early meetings between the highest seeds. For example, the top two seeds are placed on opposite halves, meaning they can meet only in the final if both keep winning.\n\nThis is why draw releases are major tennis news. Fans immediately check which dangerous unseeded players landed near top names."},
      {"heading":"Seeded does not mean favorite","body":"A seed reflects entry position, not current form. A lower seed who has been playing excellent tennis may be more dangerous than a higher seed who has struggled for weeks. Surface, fitness, matchup history and confidence still matter.\n\nWhen reading previews, separate ranking-based seeding from match-specific analysis."},
      {"heading":"What fans should check","body":"Look at the seed, then check the draw section. Who could the player face in round three or four? Are there big servers on grass, clay specialists in Paris, or returning champions with low rankings?\n\nThe seed number is only the first clue. The surrounding draw tells the real story."}
    ],
    "faq": [
      {"question":"Does a seeded player automatically get an easier draw?","answer":"Not automatically. Seeds are separated from each other, but dangerous unseeded players can still appear in any section."},
      {"question":"Can an unseeded player win a tournament?","answer":"Yes. Seeding helps organize the draw, but unseeded players can beat seeded players and win titles."},
      {"question":"Are seeds based only on rankings?","answer":"Usually they closely follow rankings, though tournament rules and withdrawals can affect the final seed list."},
      {"question":"Why do commentators mention seed numbers?","answer":"Seed numbers help explain expectations, draw structure and possible later-round matchups."}
    ]
  },
  {
    "slug": "lucky-loser-explained",
    "title": "Lucky Loser in Tennis Explained",
    "description": "How a player can lose in qualifying but still enter the main draw as a lucky loser.",
    "category": "Tournaments",
    "intro": "A lucky loser is a player who loses in qualifying but still gets into the main draw because another player withdraws before starting. The phrase sounds strange, but the system exists so tournaments can keep a full draw when late withdrawals happen.\n\nLucky losers are not random fans pulled from nowhere. They are professional players who were already close to qualifying and stayed available for a main-draw opening.",
    "sections": [
      {"heading":"How lucky loser entry works","body":"When a main-draw player withdraws before playing, the tournament may replace them with an eligible player from qualifying. That replacement is called a lucky loser because they lost in qualifying but still received a main-draw place.\n\nExact procedures can vary by tour and tournament, but the principle is consistent: the draw needs a replacement, and qualifying provides the pool."},
      {"heading":"Why the rule exists","body":"Tennis tournaments have fixed draws, broadcast schedules and ticketed sessions. If a player withdraws late, leaving an empty spot damages the event and the opponent’s schedule. A lucky loser keeps the bracket complete.\n\nThe rule is also fairer than inviting an unrelated player at the last second because qualifying players already competed for entry."},
      {"heading":"Can a lucky loser go far?","body":"Yes. A lucky loser can win rounds or even produce a major storyline. Once they enter the main draw, the previous qualifying loss no longer matters. They face the same match requirements as everyone else.\n\nThe mental situation can be unusual: some players compete freely because they feel they have received a second chance."},
      {"heading":"How it differs from a wildcard","body":"A wildcard is a direct entry granted by the tournament before or around draw construction. A lucky loser enters because of a withdrawal after losing in qualifying.\n\nBoth can appear in the main draw without ranking-based direct entry, but the route is completely different."},
      {"heading":"What fans should watch","body":"When a lucky loser appears, check who withdrew and where the replacement lands in the draw. Sometimes the lucky loser inherits a difficult matchup; sometimes they land in a section that suddenly becomes more open.\n\nThat context explains whether the replacement is just administrative or a real tournament storyline."}
    ],
    "faq": [
      {"question":"Does lucky loser mean the player is bad?","answer":"No. It means the player lost in qualifying but was eligible to replace a withdrawn main-draw player."},
      {"question":"Can a lucky loser win the tournament?","answer":"Yes, once in the main draw, a lucky loser can keep winning like any other player."},
      {"question":"Is a lucky loser the same as a wildcard?","answer":"No. A wildcard is invited into the draw; a lucky loser enters after losing in qualifying because another player withdraws."},
      {"question":"Why do lucky losers need to stay on site?","answer":"They often need to be available quickly if a withdrawal creates an opening before the affected match starts."}
    ]
  },
  {
    "slug": "wild-card-in-tennis-explained",
    "title": "Wild Card in Tennis Explained",
    "description": "What wild cards are, why tournaments give them, and how they affect tennis draws.",
    "category": "Tournaments",
    "intro": "A wild card is a place in a tournament draw given to a player who did not enter through ranking, qualifying or another standard route. Tournaments use wild cards to support promising young players, returning stars, local players or commercially important names.\n\nWild cards can be controversial because they involve discretion. Used well, they help tournaments tell better stories and give opportunities to players who might not otherwise enter.",
    "sections": [
      {"heading":"The basic definition","body":"A wild card is direct entry granted by tournament organizers. The player still has to compete normally once the tournament begins, but they skip the usual requirement of ranking-based entry or qualifying.\n\nWild cards are common at tour events and Grand Slams, especially for home players or players returning from injury."},
      {"heading":"Why tournaments award wild cards","body":"Tournaments may award wild cards to national players, juniors, former champions, popular players or athletes coming back from injury. The decision can balance sporting development with fan interest and event identity.\n\nFor example, a Grand Slam may use wild cards to support domestic players who would not make the draw by ranking alone."},
      {"heading":"Why wild cards are debated","body":"Some fans see wild cards as valuable opportunities; others argue they can reward reputation over current level. The debate becomes louder when a wild card goes to a famous player instead of a younger or higher-ranked local candidate.\n\nThe fairest analysis asks whether the invitation serves the tournament’s stated goals and whether the player is competitive enough for the level."},
      {"heading":"Wild card versus qualifier","body":"A qualifier earns a main-draw place by winning qualifying matches. A wild card receives entry directly. Both may be lower ranked than direct entrants, but their paths are different.\n\nThis difference matters when assessing form. A qualifier may arrive with match rhythm, while a wild card may arrive fresher but less tested."},
      {"heading":"What fans should check","body":"When you see WC beside a player’s name, check why the player received entry. Are they a local prospect, former champion, returning from injury or a major audience draw? That context helps explain the tournament’s decision.\n\nThen judge the match on actual tennis factors: surface, fitness, matchup and recent results."}
    ],
    "faq": [
      {"question":"What does WC mean in a tennis draw?","answer":"WC means wild card, a player given direct entry by tournament organizers."},
      {"question":"Can a wild card win a tournament?","answer":"Yes. A wild card has the same chance to keep advancing once the matches begin."},
      {"question":"Is a wild card unfair?","answer":"Not automatically. Wild cards are part of tournament rules, but fans may disagree with individual choices."},
      {"question":"Do wild cards get ranking points?","answer":"They can earn ranking points by winning matches, subject to the normal event and tour rules."}
    ]
  },
  {
    "slug": "protected-ranking-in-tennis",
    "title": "Protected Ranking in Tennis Explained",
    "description": "How protected rankings help players return after long injury or absence, and what the rule does not do.",
    "category": "Rankings",
    "intro": "Protected ranking is one of the most misunderstood tennis rules. It can help a player enter tournaments after a long absence, but it does not restore their current ranking and it does not seed them as if nothing happened.\n\nThe rule exists because injuries, pregnancy and long absences can push a player down the rankings even when their previous level was much higher. Protected ranking gives a limited pathway back into events.",
    "sections": [
      {"heading":"What protected ranking means","body":"A protected ranking is a ranking position a player may use for entry into certain tournaments after being out for an extended period. It is not the same as the player’s live ranking. It is an entry tool, not a performance guarantee.\n\nThe player still needs to win matches to rebuild ranking points."},
      {"heading":"What it does not do","body":"Protected ranking usually does not make a player seeded. That distinction matters. A returning player may enter the draw using protected ranking but still be unseeded, which can create difficult early-round matchups.\n\nFans sometimes mistake protected entry for preferential seeding. They are different concepts."},
      {"heading":"Why the rule exists","body":"Without a protected ranking rule, players returning from serious injury or long absence could be forced to start far below their proven level. That would make comebacks harder and could distort lower-level draws.\n\nThe rule creates a bridge back, while still requiring the player to earn new results."},
      {"heading":"How it affects draws","body":"A strong returning player using protected ranking can become a dangerous unseeded opponent. This is why draw analysis often mentions protected ranking: it signals that the player’s current ranking may not reflect their ability.\n\nThat can make early rounds much tougher for seeded players."},
      {"heading":"What fans should watch","body":"Check three things: how long the player was away, whether they are match fit, and whether the surface suits their game. Protected ranking explains entry, but form explains results.\n\nA famous name returning on protected ranking still has to handle timing, movement and pressure after months away."}
    ],
    "faq": [
      {"question":"Is protected ranking the same as current ranking?","answer":"No. It is a special entry mechanism for eligible returning players, not their live ranking position."},
      {"question":"Does protected ranking give a seed?","answer":"Usually no. It may help with entry but does not normally determine seeding."},
      {"question":"Why do players use protected ranking?","answer":"They use it to enter tournaments after a long absence caused by injury, pregnancy or other eligible reasons."},
      {"question":"Can protected ranking last forever?","answer":"No. It is limited by tour rules and can be used only for a defined period or number of events."}
    ]
  },
  {
    "slug": "tennis-draws-explained",
    "title": "Tennis Draws Explained",
    "description": "How tennis brackets work, including halves, quarters, seeds, qualifiers and paths to the final.",
    "category": "Tournaments",
    "intro": "A tennis draw is the bracket that decides who plays whom and when players can meet. It is more than a list of matches: it shapes the route to the title, separates seeds, places qualifiers and creates the storylines fans discuss before the first ball is hit.\n\nUnderstanding the draw helps you read a tournament like a map rather than a random list of names.",
    "sections": [
      {"heading":"The basic bracket","body":"Most tennis draws are knockout brackets. Win and you advance; lose and you are out, except in round-robin formats such as some finals events. A player’s path is determined by their position in the bracket.\n\nIn a 128-player Grand Slam draw, a champion must usually win seven matches. In smaller events, the number of rounds is lower."},
      {"heading":"Halves and quarters","body":"A draw is commonly divided into halves and quarters. The top half and bottom half produce the two finalists. Quarters help fans identify likely quarterfinal matchups and difficult sections.\n\nWhen analysts say a player has a tough quarter, they mean several dangerous opponents are grouped in that section."},
      {"heading":"Seeds in the draw","body":"Seeds are distributed to prevent the highest-ranked players from meeting too early. The top two seeds go into opposite halves, while other seeds are placed according to draw rules.\n\nThis creates projected matchups, but those projections collapse quickly if seeded players lose."},
      {"heading":"Qualifiers and wild cards","body":"Qualifiers enter after winning qualifying matches. Wild cards receive direct entry from tournament organizers. Both can dramatically change the difficulty of a section.\n\nA qualifier may be dangerous because they already have match rhythm. A wild card may be dangerous because their ranking does not reflect their actual level."},
      {"heading":"How to read a draw like a fan","body":"Start with the favorite’s section, then look two rounds ahead. Are there big servers, left-handers, clay specialists, former champions or awkward head-to-head matchups nearby?\n\nThe draw does not decide the tournament, but it tells you where pressure and danger may appear."}
    ],
    "faq": [
      {"question":"What is a tennis draw?","answer":"It is the tournament bracket showing player positions and potential matchups."},
      {"question":"Is the draw random?","answer":"Partly. Seeds are placed according to rules, while many other positions are drawn."},
      {"question":"What does top half mean?","answer":"The top half is one side of the bracket. Its winner reaches the final to play the bottom-half winner."},
      {"question":"Why do fans care about the draw?","answer":"The draw shapes possible opponents, difficult sections and the route a player must take to win the title."}
    ]
  },
  {
    "slug": "grand-slam-tournaments-explained",
    "title": "Grand Slam Tournaments Explained",
    "description": "A guide to the Australian Open, Roland Garros, Wimbledon and US Open, and why Grand Slams matter most.",
    "category": "Tournaments",
    "intro": "The four Grand Slam tournaments are the most important events in tennis: the Australian Open, Roland Garros, Wimbledon and the US Open. They offer the biggest historical prestige, largest draws and most attention from fans, media and players.\n\nThis guide explains what makes Grand Slams different and how to understand them across surfaces, formats and calendar timing.",
    "sections": [
      {"heading":"The four majors","body":"The Australian Open is played on hard court in Melbourne. Roland Garros is played on clay in Paris. Wimbledon is played on grass in London. The US Open is played on hard court in New York.\n\nEach Slam has its own identity, conditions and traditions, which is why winning across all four surfaces and environments is so highly valued."},
      {"heading":"Why Grand Slams matter most","body":"Grand Slams carry the most prestige because of history, field strength, ranking value and best-of-five men’s singles format. Players build legacies around major titles.\n\nA player can have a brilliant career without a Slam, but Grand Slam results usually define all-time comparisons."},
      {"heading":"Draw size and difficulty","body":"Singles Grand Slam draws usually contain 128 players. That means champions must navigate two weeks of matches, changing opponents, weather, pressure and recovery demands.\n\nThe long format rewards consistency as much as peak level."},
      {"heading":"Surface differences","body":"Each Slam asks different questions. Roland Garros rewards clay movement and topspin. Wimbledon rewards grass timing, first-strike tennis and low-bounce adjustment. The Australian Open and US Open are both hard-court majors but can feel different because of heat, speed and scheduling.\n\nThis variety is a major reason tennis careers are difficult to compare."},
      {"heading":"What fans should watch","body":"Watch whether a player’s game style matches the surface and whether they have the physical base for two weeks. Early rounds can look routine, but long matches can affect later performance.\n\nGrand Slams are not just bigger tournaments; they are endurance tests with historical weight."}
    ],
    "faq": [
      {"question":"What are the four Grand Slam tournaments?","answer":"The Australian Open, Roland Garros, Wimbledon and the US Open."},
      {"question":"Which Grand Slam is played on clay?","answer":"Roland Garros, also called the French Open, is played on clay."},
      {"question":"Which Grand Slam is played on grass?","answer":"Wimbledon is played on grass."},
      {"question":"Why are Grand Slams so important?","answer":"They have the most prestige, strongest fields, major ranking value and the greatest impact on tennis legacies."}
    ]
  },
  {
    "slug": "atp-vs-wta-explained",
    "title": "ATP vs WTA Explained",
    "description": "The difference between ATP and WTA tennis, how the tours are organized, and what fans should know.",
    "category": "Tours",
    "intro": "ATP and WTA are two main professional tennis tours. The ATP organizes the leading men’s tour, while the WTA organizes the leading women’s tour. Grand Slam tournaments are separate major events, but ATP and WTA rankings and tour structures shape most of the weekly tennis calendar.\n\nThis guide explains the difference in plain language so fans can read schedules, rankings and tournament names more confidently.",
    "sections": [
      {"heading":"What ATP means","body":"ATP stands for Association of Tennis Professionals. It organizes the men’s professional tour, including ATP 250, ATP 500, ATP Masters 1000 and ATP Finals events.\n\nATP rankings help determine entry, seeding and year-end qualification, though each tournament has its own details and draw rules."},
      {"heading":"What WTA means","body":"WTA stands for Women’s Tennis Association. It organizes the women’s professional tour, including WTA 250, WTA 500, WTA 1000 and WTA Finals events.\n\nLike the ATP, the WTA has rankings, tournament levels and a season structure that guides entries and storylines."},
      {"heading":"Where Grand Slams fit","body":"Grand Slams are not simply ATP or WTA events. They are major tournaments with men’s and women’s competitions, run by Grand Slam organizers. They award ranking points and include ATP/WTA players, but they sit above the normal tour calendar in prestige.\n\nThis is why tennis schedules often list Grand Slams separately from ATP and WTA events."},
      {"heading":"Why fans should care","body":"Knowing ATP and WTA labels helps you understand tournament level, player fields and ranking impact. A WTA 1000 or ATP Masters 1000 usually carries more weight than a 250 event.\n\nIt also helps avoid confusion when several tournaments happen in the same week."},
      {"heading":"How to use the labels on Watch Tennis Today","body":"When browsing schedules, use ATP and WTA categories to separate men’s and women’s tour matches. Then check tournament level and surface to understand the importance of the match.\n\nThe label is not the full story, but it gives the first layer of context."}
    ],
    "faq": [
      {"question":"Is ATP men’s tennis?","answer":"Yes. ATP refers to the main men’s professional tennis tour."},
      {"question":"Is WTA women’s tennis?","answer":"Yes. WTA refers to the main women’s professional tennis tour."},
      {"question":"Are Grand Slams ATP events?","answer":"Grand Slams include ATP and WTA players but are separate major tournaments rather than normal tour events."},
      {"question":"Why do ATP and WTA rankings matter?","answer":"They influence entries, seedings, qualification races and how fans understand player status."}
    ]
  },
  {
    "slug": "tennis-retirement-rules-explained",
    "title": "Retirement in Tennis Explained",
    "description": "What it means when a player retires from a match, how it differs from withdrawal and walkover, and how fans should read it.",
    "category": "Rules",
    "intro": "A retirement happens when a player starts a match but cannot finish it. It is different from a withdrawal before the match and different from a walkover. Retirements usually happen because of injury, illness or another physical problem, though the match record depends on tour and tournament rules.\n\nThis guide explains retirement as a match situation, not as gossip. Fans should be careful with assumptions because medical details are often incomplete.",
    "sections": [
      {"heading":"The basic definition","body":"If a player begins a match and then stops before completion, the result is commonly recorded as a retirement. The opponent advances because the retiring player cannot continue.\n\nThe key detail is that the match started. If it never started, the situation is usually called a walkover or withdrawal instead."},
      {"heading":"Common reasons for retirement","body":"Players may retire because of muscle injuries, cramps, illness, dizziness, breathing issues or an aggravated existing problem. Sometimes the reason is visible; sometimes it is not.\n\nA player retiring is not automatically giving up casually. Professional players often continue through discomfort, so retirement usually means the problem is serious enough to stop competition."},
      {"heading":"Retirement versus walkover","body":"A walkover happens before the match begins. A retirement happens after the match has started. This distinction matters for records, tickets, broadcast schedules and fan interpretation.\n\nIf you see RET on a scoreboard, the match began but did not reach normal completion."},
      {"heading":"How fans should read the result","body":"Do not overstate a retirement result. The advancing player still moves on, but the match may not tell us much about form if the opponent was compromised.\n\nFor analysis, note the score at retirement, visible movement issues, recent workload and any official explanation from the tournament or player."},
      {"heading":"Why retirements affect tournaments","body":"A retirement can change a draw because one player advances with less completed match time while the injured player may leave the event. It can also affect doubles, future tournaments and ranking races if the injury continues.\n\nThat is why retirement news often matters beyond a single match."}
    ],
    "faq": [
      {"question":"What does RET mean in tennis?","answer":"RET usually means retirement: a player started the match but could not finish it."},
      {"question":"Is retirement the same as withdrawal?","answer":"No. Withdrawal usually happens before a match or event participation; retirement happens after the match starts."},
      {"question":"Does the opponent get the win?","answer":"Yes, the opponent advances when a player retires from a match."},
      {"question":"Should fans assume the exact injury?","answer":"No. Unless official information is available, it is better to describe the retirement without guessing medical details."}
    ]
  },
  {
    "slug": "tennis-ranking-points-explained",
    "title": "Tennis Ranking Points Explained",
    "description": "How ranking points work in tennis and why tournament level, round reached and calendar timing matter.",
    "category": "Rankings",
    "intro": "Tennis rankings are built from points earned at tournaments. The deeper a player goes, the more points they usually earn, and higher-level tournaments offer more points. Rankings then influence entry lists, seedings and how fans understand a player’s position in the sport.\n\nThis guide explains ranking points as a practical fan tool, without getting lost in every technical exception.",
    "sections": [
      {"heading":"The basic idea","body":"Players earn ranking points by winning matches and reaching rounds at eligible tournaments. A title at a larger event is worth more than a title at a smaller event because the draw and event level are stronger.\n\nThat is why Grand Slam and 1000-level results can transform a ranking faster than smaller events."},
      {"heading":"Why points drop off","body":"Ranking systems are based on a rolling calendar. Points from last year’s event can drop when the event returns, and a player may need to defend or replace them with new results.\n\nThis is why commentators talk about defending points. A player can play well and still lose ranking ground if they do not match a previous big result."},
      {"heading":"Tournament level matters","body":"Grand Slams, ATP Masters 1000, WTA 1000, 500 and 250 events do not carry identical ranking impact. Higher-level events usually offer more points and attract stronger fields.\n\nFans should read rankings alongside tournament category. A player collecting points at smaller events may rise steadily, while a player peaking at majors can jump dramatically."},
      {"heading":"Rankings versus form","body":"Ranking tells you accumulated results, not exactly who is playing best this week. A player returning from injury may be better than their ranking. A player defending a huge result may feel pressure despite a high ranking.\n\nGood tennis analysis combines ranking, recent form, surface and matchup."},
      {"heading":"How rankings affect draws","body":"Rankings help determine entry and often influence seeding. Higher-ranked players are more likely to enter big tournaments directly and receive seeded positions.\n\nThat creates a feedback loop: strong rankings help with draw position, but players must keep winning to maintain them."}
    ],
    "faq": [
      {"question":"How do tennis players earn ranking points?","answer":"They earn points by reaching rounds and winning matches at eligible tournaments, with larger events offering more points."},
      {"question":"What does defending points mean?","answer":"It means a player has points from a previous event coming off their ranking and may need a similar result to keep them."},
      {"question":"Do rankings show current form?","answer":"Not perfectly. Rankings reflect results over time, while form can change quickly."},
      {"question":"Why do ranking points matter?","answer":"They influence tournament entry, seeding, status and qualification races."}
    ]
  },
  {
    "slug": "tennis-match-formats-explained",
    "title": "Tennis Match Formats Explained",
    "description": "Best of three, best of five, final-set tiebreaks and match tiebreaks explained for tennis fans.",
    "category": "Rules",
    "intro": "Not every tennis match uses the same format. Most tour singles matches are best of three sets, Grand Slam men’s singles is usually best of five, and doubles or smaller events may use match tiebreaks or special scoring.\n\nKnowing the format helps fans understand urgency. A player down one set in best of three is in immediate danger; down one set in best of five, they still have more time to solve the match.",
    "sections": [
      {"heading":"Best of three","body":"In best of three, the first player to win two sets wins the match. This is the standard format for most ATP and WTA tour singles matches and women’s singles at Grand Slams.\n\nBecause the match can end in two sets, early breaks and first-set momentum carry major weight."},
      {"heading":"Best of five","body":"In best of five, the first player to win three sets wins. Men’s singles at Grand Slams is the most familiar example. This format allows more comebacks but also demands more physical endurance.\n\nA best-of-five match can become a tactical and fitness contest rather than only a shot-making contest."},
      {"heading":"Final-set tiebreaks","body":"Many tournaments use final-set tiebreaks to avoid endless matches. The exact target can vary by competition, so fans should check the event rules.\n\nThe key idea is that a tied final set no longer always continues until a player wins by two games."},
      {"heading":"Match tiebreaks","body":"Some doubles and lower-level formats use a match tiebreak instead of a full deciding set. This is often first to 10 points with a two-point margin.\n\nMatch tiebreaks create sudden momentum swings because every point directly changes the finish line."},
      {"heading":"Why format changes analysis","body":"Format affects risk. In a short format, players may attack sooner because recovery time is limited. In best of five, players may spend longer testing patterns, conserving energy or waiting for physical pressure to build.\n\nBefore judging a match, always check the format."}
    ],
    "faq": [
      {"question":"What does best of three mean?","answer":"The first player to win two sets wins the match."},
      {"question":"What does best of five mean?","answer":"The first player to win three sets wins the match."},
      {"question":"What is a match tiebreak?","answer":"It is a deciding tiebreak, often to 10 points with a two-point lead, used instead of a full final set in some formats."},
      {"question":"Do all tournaments use the same final-set rule?","answer":"No. Final-set tiebreak rules can vary by event and competition."}
    ]
  }

  ,
  {
    "slug": "tennis-walkover-explained",
    "title": "Walkover in Tennis Explained",
    "description": "What a walkover means in tennis, how it differs from retirement and withdrawal, and why it affects schedules and draws.",
    "category": "Rules",
    "intro": "A walkover happens when a scheduled tennis match does not take place because one player cannot play. The opponent advances without contesting the match. It is one of the most common terms fans see during busy tournaments, especially when injuries, illness or late withdrawals affect the draw.\n\nThe word can sound simple, but it matters for understanding results pages, order-of-play changes and tournament narratives. A walkover is not the same as a retirement after a match has started, and it should not be treated as proof that the advancing player played better that day.",
    "sections": [
      {"heading":"The basic definition","body":"A walkover means a player advances because the opponent did not start the scheduled match. The match is not played as a normal contest, so there is no completed scoreline to analyze.\n\nOn draws or live scoreboards, a walkover is often shortened to WO. Fans usually see it when a player withdraws too late for the tournament to replace them with another player."},
      {"heading":"Walkover versus retirement","body":"The cleanest distinction is timing. A walkover happens before the match begins. A retirement happens after the match begins and one player cannot continue.\n\nThis matters because a retirement can still include useful match evidence: movement, serve speed, rally patterns or score at the time of retirement. A walkover gives almost no on-court evidence because the match never started."},
      {"heading":"Why walkovers happen","body":"Walkovers can happen because of injury, illness, fatigue, scheduling problems or a player choosing not to risk a worse physical issue. In team competitions, administrative or eligibility issues can also create non-played matches.\n\nFans should avoid guessing the exact reason unless the tournament or player provides official information. A short scoreboard label rarely explains the whole situation."},
      {"heading":"How a walkover affects the draw","body":"The opponent moves to the next round, often with less physical load than players who had to complete a full match. That can matter later in the tournament, especially at Grand Slams where recovery time becomes part of the story.\n\nIt can also affect ticket holders and TV schedules because a court slot may suddenly need a replacement match or a delayed start."},
      {"heading":"How fans should read a walkover result","body":"Do not treat a walkover like a normal win. The advancing player benefits from moving on, but they did not beat the opponent on court in that round.\n\nFor analysis, record the result carefully: who advanced, who did not play, whether official medical or scheduling information was announced, and what the extra rest might mean for the next match."}
    ],
    "faq": [
      {"question":"What does WO mean in tennis?","answer":"WO usually means walkover: a player advanced because the opponent did not start the scheduled match."},
      {"question":"Is a walkover the same as retirement?","answer":"No. A walkover happens before a match starts. A retirement happens after a match has begun."},
      {"question":"Does the opponent get the win after a walkover?","answer":"The opponent advances in the draw, but fans should not analyze it like a normal on-court win."},
      {"question":"Can a walkover change the schedule?","answer":"Yes. It can leave a gap on a court schedule or cause tournaments and broadcasters to adjust the order of play."}
    ]
  },


  {
    "slug": "tennis-bye-explained",
    "title": "Bye in Tennis Explained",
    "description": "What a bye means in a tennis draw, why seeded players receive byes, and how it affects tournament schedules.",
    "category": "Draws",
    "intro": "A bye means a player advances to the next round without playing a match in the current round. It usually appears when the draw size is not a perfect fit or when top seeds receive first-round protection at certain events.\n\nByes can look strange to new fans because the player is listed in the bracket but has no opponent. Understanding byes helps explain why some players start later than others and why early tournament schedules do not always include every top name.",
    "sections": [
      {"heading":"The basic definition","body":"A bye is a free passage into the next round of a tournament draw. The player does not win a match on court; they simply do not need to play that round.\n\nOn a draw sheet, a bye often appears next to a seeded player’s name or in an empty bracket position."},
      {"heading":"Why byes exist","body":"Byes are used to balance draw sizes and manage tournament structure. If an event has a 96-player draw, not everyone can start in the same round cleanly, so some players receive byes.\n\nThey are also used as an incentive or protection for high-ranked players at certain tour events, giving them a later start."},
      {"heading":"Does a bye count as a win?","body":"A bye moves the player forward, but it is not the same as winning a completed match. It usually does not provide the same sporting evidence as a real victory.\n\nFor fan analysis, note that the player may be fresher but may also have less match rhythm than opponents who already played."},
      {"heading":"How byes affect schedules","body":"A player with a bye may not appear on the order of play until the second round. That can confuse fans searching for a top player on day one or day two.\n\nBefore assuming a player withdrew, check the draw. They may simply have a bye and start later in the event."},
      {"heading":"What fans should watch after a bye","body":"The first match after a bye can be tricky. The seeded player is rested, but the opponent may already be adjusted to the court speed, balls and conditions.\n\nThat is why early matches after byes sometimes feel tighter than ranking expectations suggest."}
    ],
    "faq": [
      {"question":"What does bye mean in tennis?","answer":"It means a player advances to the next round without playing a match in that round."},
      {"question":"Why do seeded players get byes?","answer":"Some tournaments give byes to top seeds because of draw size and event structure."},
      {"question":"Is a bye the same as a walkover?","answer":"No. A bye is built into the draw. A walkover happens when a scheduled opponent does not play."},
      {"question":"Can a bye hurt a player?","answer":"It can. A rested player may also lack match rhythm compared with an opponent who already played."}
    ]
  },
  {
    "slug": "tennis-qualifying-explained",
    "title": "Tennis Qualifying Explained",
    "description": "How qualifying rounds work, why qualifiers matter, and what fans should know before reading a main draw.",
    "category": "Draws",
    "intro": "Qualifying is the tournament before the tournament. Players who do not enter the main draw directly can earn a place by winning qualifying matches. Those who succeed are called qualifiers, and they often arrive in the main draw with confidence and match rhythm.\n\nFor fans, qualifiers are important because they are not just filler names. Many are rising players, returning players or specialists whose ranking does not fully show their danger in that specific week.",
    "sections": [
      {"heading":"How qualifying works","body":"Before the main draw begins, tournaments hold qualifying rounds for players outside the direct-entry cutoff. A player usually needs to win multiple matches to qualify, depending on draw size and event level.\n\nOnce they qualify, they receive a main-draw position and compete under the same match rules as other players."},
      {"heading":"Why players enter qualifying","body":"Qualifying gives players a route into bigger events when their ranking is not high enough for direct entry. It can provide prize money, ranking opportunities and valuable experience against stronger fields.\n\nFor young players or players returning from injury, qualifying can be an important step back toward tour stability."},
      {"heading":"Why qualifiers can be dangerous","body":"A qualifier has already played competitive matches at the event. They may understand the court speed, balls, weather and bounce better than a seeded player starting cold.\n\nThat match rhythm can make qualifiers especially dangerous in first-round main-draw matches."},
      {"heading":"Qualifier versus lucky loser","body":"A qualifier wins enough qualifying matches to earn entry. A lucky loser loses in qualifying but enters later because someone withdraws from the main draw.\n\nBoth labels come from qualifying, but one is earned through wins and the other comes through replacement rules."},
      {"heading":"How fans should use qualifying context","body":"When previewing a main-draw match, check whether a player is a qualifier. Then look at who they beat, how many matches they played and whether the surface suits them.\n\nA qualifier with three confident wins may be more prepared than their ranking suggests."}
    ],
    "faq": [
      {"question":"What is qualifying in tennis?","answer":"It is a pre-main-draw competition where players try to earn a place in the tournament."},
      {"question":"What does qualifier mean?","answer":"A qualifier is a player who won enough qualifying matches to enter the main draw."},
      {"question":"Are qualifiers weaker players?","answer":"Not always. They may be rising players, returning players or strong specialists with lower rankings."},
      {"question":"Can a qualifier win the main tournament?","answer":"Yes. It is uncommon but possible once the player enters the main draw."}
    ]
  }

,
  {
    "slug": "tennis-tv-vs-grand-slam-broadcasters",
    "title": "Tennis TV vs Grand Slam Broadcasters",
    "description": "Understand the difference between Tennis TV and Grand Slam broadcasters, why some major matches are not on Tennis TV, and how to check legal viewing options by tournament and country.",
    "category": "Streaming",
    "intro": "Tennis TV and Grand Slam broadcasters answer two different viewing questions. Tennis TV is the official ATP streaming service for many ATP Tour events. Grand Slam broadcasters are separate rights holders for the Australian Open, Roland Garros, Wimbledon and the US Open. That split is the main reason a fan can pay for Tennis TV and still not find a Grand Slam match there.\n\nThis guide explains the difference without promising free streams or pretending one service covers all tennis. Use it before subscribing to a service, checking a match page, or trying to understand why a major tournament appears on a different channel in your country.",
    "sections": [
      {
        "heading": "The short version",
        "body": "Tennis TV is best understood as an ATP Tour product. It is useful for fans who follow ATP Masters 1000, ATP 500, ATP 250 and ATP Finals events across the season. Grand Slam events sit outside that normal ATP Tour streaming package, even when ATP players are competing in them.\n\nGrand Slam broadcasters are arranged separately by each major tournament and by region. The same match may be shown by one broadcaster in the United States, another in the United Kingdom, another in Australia and another in parts of Europe. That is why a generic answer like “watch it on Tennis TV” can be misleading for the biggest tournaments."
      },
      {
        "heading": "What Tennis TV usually covers",
        "body": "Tennis TV is the official ATP streaming service. Its value is strongest for ATP-focused fans who want a regular season product rather than a one-tournament solution. It commonly points fans toward ATP Masters 1000, ATP 500, ATP 250, the Nitto ATP Finals and the Next Gen ATP Finals.\n\nThe important limitation is just as valuable as the coverage list: Tennis TV does not normally carry Grand Slam live video rights. It also should not be treated as a WTA subscription, a Challenger subscription, a Davis Cup subscription or a guaranteed Olympic tennis source. If your goal is one specific match, always check the tournament and country before assuming the service has it."
      },
      {
        "heading": "What Grand Slam broadcasters cover",
        "body": "Grand Slam broadcasters cover the four majors: Australian Open, Roland Garros, Wimbledon and the US Open. These events sell broadcast and streaming rights separately from the normal weekly tour calendar. The official broadcaster list can change by tournament, year and country.\n\nFor fans, this creates a simple rule: when the tournament is a Grand Slam, start with the official tournament broadcaster page or the local rights holder in your country. A player’s tour, ranking or popularity does not decide where the match is available. Broadcast rights do."
      },
      {
        "heading": "Why the same player appears on different services",
        "body": "Carlos Alcaraz, Jannik Sinner, Novak Djokovic, Iga Swiatek, Coco Gauff or Aryna Sabalenka may appear on different services during the same season because tennis rights are event-based. An ATP match in Rome or Cincinnati is a different media product from a Wimbledon semifinal or a US Open night match.\n\nThat distinction matters for site copy and SEO. A page about an ATP Tour match can mention Tennis TV as a possible official route if the event is included and the user’s region allows it. A page about a Grand Slam should direct readers to official Grand Slam broadcaster checks instead of implying Tennis TV will show the match."
      },
      {
        "heading": "How to choose the right viewing check",
        "body": "Start with the tournament name. If it is an ATP Tour event, Tennis TV may be relevant. If it is one of the four Grand Slams, use the tournament’s official broadcaster information. If it is a WTA event, team event, Challenger, exhibition or Olympic event, check that event’s own rights information instead of relying on an ATP streaming product.\n\nThen check your country. Tennis streaming is not global in a simple way. A legal option in one region may not be available in another. A responsible guide should explain the process and link readers toward official sources, not promise universal access."
      },
      {
        "heading": "Common mistakes fans make",
        "body": "The biggest mistake is assuming that because Tennis TV has ATP players, it must show every ATP player in every tournament. Grand Slams include ATP and WTA players, but their broadcast rights are not controlled by the weekly tour streaming package.\n\nAnother mistake is treating highlights, social clips or live scores as the same thing as live match video. A service may provide highlights, statistics or alerts without having the right to stream the full match live. For AdSense-safe and user-safe content, the page should keep those concepts separate."
      },
      {
        "heading": "What Watch Tennis Today should say on match pages",
        "body": "For ATP Tour matches, the safest wording is conditional: check Tennis TV and local official broadcasters for availability. For Grand Slam matches, the safest wording is different: Grand Slam rights are separate from Tennis TV, so check the official broadcaster list for your country.\n\nAvoid phrases like “watch free,” “free live stream,” or “available on Tennis TV” unless an official source confirms that exact claim. That keeps the page useful for fans and reduces policy risk from misleading streaming promises."
      }
    ],
    "faq": [
      {
        "question": "Does Tennis TV show Grand Slam matches?",
        "answer": "No. Tennis TV says it does not have live or replay streaming rights for the Australian Open, Roland Garros, Wimbledon or the US Open."
      },
      {
        "question": "Is Tennis TV only for ATP matches?",
        "answer": "Tennis TV is an official ATP streaming service. It is mainly useful for ATP Tour coverage, including many Masters 1000, ATP 500, ATP 250 and ATP Finals events."
      },
      {
        "question": "Where should I check Grand Slam coverage?",
        "answer": "Use the official broadcaster page for the specific Grand Slam and then confirm availability with the listed broadcaster in your country."
      },
      {
        "question": "Why can a Grand Slam match have ATP players but not be on Tennis TV?",
        "answer": "Because streaming rights are sold by event. Grand Slams have separate media rights even when ATP players compete in them."
      }
    ],
    "publishedDate": "2026-06-10",
    "updatedDate": "2026-06-10",
    "sourceReferences": [
      "Tennis TV Help Centre: What can I watch on Tennis TV?",
      "Tennis TV Help Centre: Why does Tennis TV not show Grand Slams/WTA?",
      "Official Australian Open, Roland Garros, Wimbledon and US Open broadcaster pages",
      "Official broadcaster pages should be checked by country before making viewing decisions"
    ]
  },

  {
    "slug": "masters-1000-500-250-explained",
    "title": "Masters 1000, ATP 500 and ATP 250 Explained",
    "description": "A practical guide to ATP tournament levels: what Masters 1000, ATP 500 and ATP 250 mean, how they affect rankings, and why fans should care.",
    "category": "Tournaments",
    "intro": "Masters 1000, ATP 500 and ATP 250 are tournament categories on the ATP Tour. The numbers point to the ranking points normally awarded to the singles champion, but the categories also tell fans something broader: how strong the field is likely to be, how much the result can change the rankings, and why players build their schedules around certain weeks.\n\nThis guide explains the difference between the three levels without treating every tournament as the same kind of event. A Masters 1000 title can reshape the top of the rankings. An ATP 500 title can be a major career achievement and a powerful ranking boost. An ATP 250 title can help an emerging player build confidence, gain points and move toward bigger draws. All three matter, but they matter in different ways.",
    "sections": [
      {
        "heading": "What the numbers mean",
        "body": "The number in each category is a ranking-points clue. A Masters 1000 champion usually receives 1000 ATP ranking points. An ATP 500 champion usually receives 500 points. An ATP 250 champion usually receives 250 points. The finalist, semifinalists and earlier-round players receive fewer points according to the event's draw size and round reached.\n\nThis does not mean every event is identical inside its category. Draw sizes, entry lists, surfaces and calendar placement can make one week feel very different from another. Still, the category gives fans a quick way to understand how much ranking value is available and why players may treat the event as a major target."
      },
      {
        "heading": "Masters 1000 tournaments",
        "body": "Masters 1000 tournaments are the biggest regular ATP Tour events below the Grand Slams and the ATP Finals. They usually attract many of the highest-ranked players because the ranking reward is large and because these events sit at the center of the tour calendar.\n\nFor fans, a Masters 1000 is often the best preview of major-title form outside the Slams. Indian Wells, Miami, Monte Carlo, Madrid, Rome, Canada, Cincinnati, Shanghai and Paris can all reveal how the top players are adapting to surface, conditions and pressure. A player who wins a Masters title has usually beaten several strong opponents, not simply collected points in a weak draw."
      },
      {
        "heading": "ATP 500 tournaments",
        "body": "ATP 500 events sit one level below Masters 1000 events but can still be extremely strong. A 500 draw may include Grand Slam champions, top-ten players, dangerous specialists and rising players trying to move into seeded positions.\n\nThese tournaments are important because they can change a player's season without requiring a Grand Slam-level run. Winning a 500 can lift a player toward better seeding, protect ranking position or prove that a strong result was not a one-week accident. Events such as Rotterdam, Dubai, Barcelona, Queen's, Halle, Washington, Beijing, Tokyo, Basel and Vienna are often treated by players and fans as serious title weeks."
      },
      {
        "heading": "ATP 250 tournaments",
        "body": "ATP 250 events are the smallest regular ATP Tour level, but calling them small can be misleading. They are often where younger players win first titles, returning players rebuild rhythm, and established players choose a schedule that fits their surface goals.\n\nA 250 title may not carry the same points as a Masters title, but it can matter deeply for a career. A player outside the top group may use a 250 run to enter bigger tournaments directly. A player coming back from injury may use one to test match fitness. A clay specialist, grass-court specialist or indoor hard-court specialist may target a 250 because the conditions fit their game."
      },
      {
        "heading": "How these levels affect rankings",
        "body": "Ranking points are cumulative, so tournament level affects how quickly a player can rise or fall. A deep Masters run can add enough points to change a player's ranking tier. Several good 250 or 500 results can also build a strong ranking base, especially for players who are not yet consistently reaching the second week of Grand Slams.\n\nThe important detail is that points also expire. If a player won a 500 last year and loses early this year, their ranking can drop even though they are still a strong player. That is why fans hear phrases like defending points, ranking pressure and live ranking during these events."
      },
      {
        "heading": "Why players do not simply play everything",
        "body": "A tennis season is long, physical and surface-specific. Players choose tournaments based on ranking goals, mandatory-event rules, travel load, injury management, surface preparation and confidence. Playing every possible event would usually hurt performance rather than help it.\n\nTop players often build around Grand Slams and Masters 1000 events, then add selected 500 or 250 events where the timing makes sense. Lower-ranked players may need more weeks to earn points, but they also have to manage qualifying, travel and recovery. A smart schedule is not always the one with the most tournaments; it is the one that creates the best chance to perform well at the right events."
      },
      {
        "heading": "How fans should read a tournament entry list",
        "body": "When you see an entry list, start with the category. A Masters 1000 should usually have a deeper elite field than a 250. Then look at timing. Is the event before a Grand Slam? Is it part of the clay swing, grass swing or indoor season? Are top players using it as preparation, or are they skipping it to rest?\n\nThis helps you avoid lazy conclusions. A player winning a 250 is not automatically ready to win a Slam, but the title may show improving form. A player losing early at a 500 may not be in crisis if they are returning from injury or changing surfaces. Tournament level gives context, not the whole story."
      },
      {
        "heading": "Grand Slams are separate",
        "body": "Grand Slams are not ATP 1000 events. They are run separately from the regular ATP Tour structure and award more points than Masters 1000 events. The four Grand Slams are the Australian Open, Roland Garros, Wimbledon and the US Open.\n\nThis matters because some fans see the number 1000 and assume it is the top of tennis. It is the top regular Masters category, not the top level of the whole sport. In prestige, best-of-five-set history and ranking value, Grand Slams remain above Masters 1000, ATP 500 and ATP 250 tournaments."
      }
    ],
    "faq": [
      {
        "question": "What does Masters 1000 mean in tennis?",
        "answer": "It is a top ATP Tour tournament category below the Grand Slams and ATP Finals. The number points to the ranking points normally awarded to the champion."
      },
      {
        "question": "Is ATP 500 better than ATP 250?",
        "answer": "Yes. ATP 500 events award more ranking points and usually attract stronger fields than ATP 250 events, though individual draw strength can vary."
      },
      {
        "question": "Are Grand Slams ATP 1000 tournaments?",
        "answer": "No. Grand Slams are separate major tournaments and sit above Masters 1000 events in prestige and ranking value."
      },
      {
        "question": "Can a player rise in the rankings by winning ATP 250 events?",
        "answer": "Yes. ATP 250 results can be very useful, especially for players building ranking position, returning from injury or trying to enter bigger events directly."
      }
    ],
    "publishedDate": "2026-06-10",
    "updatedDate": "2026-06-10",
    "sourceReferences": [
      "ATP Tour tournament categories and ranking points",
      "ITF Rules of Tennis",
      "Grand Slam tournament structures"
    ]
  }

];

export const publishedGuideArticles = guideArticles.filter(
  (article): article is GuideArticle => Boolean(article?.slug)
);

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return publishedGuideArticles.find((article) => article.slug === slug);
}


export function getGuideArticleDates(article: GuideArticle) {
  return {
    publishedDate: article.publishedDate || "2026-06-09",
    updatedDate: article.updatedDate || "2026-06-09",
  };
}

export function getGuideReadingTime(article: GuideArticle) {
  const words = [
    article.title,
    article.description,
    article.intro,
    ...article.sections.map((section) => `${section.heading} ${section.body}`),
    ...article.faq.map((item) => `${item.question} ${item.answer}`),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(4, Math.ceil(words / 220));
}

export function getGuideSourceReferences(article: GuideArticle) {
  return article.sourceReferences || [
    "ITF Rules of Tennis",
    "ATP Tour official tournament and ranking information",
    "WTA official tournament and ranking information",
    "Official Grand Slam and tournament websites where relevant",
  ];
}

const manualRelatedGuideSlugs: Record<string, string[]> = {
  "break-points-explained": [
    "tennis-scoring-system-explained",
    "tennis-tiebreak-rules",
    "tennis-match-formats-explained",
    "tennis-retirement-rules-explained",
  ],
  "tennis-tiebreak-rules": [
    "tennis-scoring-system-explained",
    "break-points-explained",
    "tennis-match-formats-explained",
    "grand-slam-tournaments-explained",
  ],
  "atp-rankings-explained": [
    "tennis-ranking-points-explained",
    "protected-ranking-in-tennis",
    "masters-1000-500-250-explained",
    "tennis-seeds-explained",
  ],
  "walkover-vs-retirement": [
    "tennis-walkover-explained",
    "tennis-retirement-rules-explained",
    "tennis-match-formats-explained",
    "tennis-draws-explained",
  ],
  "tennis-surfaces-explained": [
    "grand-slam-tournaments-explained",
    "masters-1000-500-250-explained",
    "tennis-match-formats-explained",
    "atp-vs-wta-explained",
  ],
  "tennis-scoring-system-explained": [
    "break-points-explained",
    "tennis-tiebreak-rules",
    "tennis-match-formats-explained",
    "walkover-vs-retirement",
  ],
  "tennis-seeds-explained": [
    "tennis-draws-explained",
    "tennis-qualifying-explained",
    "lucky-loser-explained",
    "wild-card-in-tennis-explained",
  ],
  "lucky-loser-explained": [
    "tennis-qualifying-explained",
    "wild-card-in-tennis-explained",
    "tennis-draws-explained",
    "tennis-seeds-explained",
  ],
  "wild-card-in-tennis-explained": [
    "tennis-qualifying-explained",
    "lucky-loser-explained",
    "tennis-draws-explained",
    "tennis-seeds-explained",
  ],
  "protected-ranking-in-tennis": [
    "tennis-ranking-points-explained",
    "atp-rankings-explained",
    "wild-card-in-tennis-explained",
    "tennis-draws-explained",
  ],
  "tennis-draws-explained": [
    "tennis-seeds-explained",
    "tennis-qualifying-explained",
    "lucky-loser-explained",
    "wild-card-in-tennis-explained",
  ],
  "grand-slam-tournaments-explained": [
    "masters-1000-500-250-explained",
    "tennis-surfaces-explained",
    "tennis-tv-vs-grand-slam-broadcasters",
    "tennis-tiebreak-rules",
  ],
  "atp-vs-wta-explained": [
    "atp-rankings-explained",
    "tennis-ranking-points-explained",
    "masters-1000-500-250-explained",
    "tennis-tv-vs-grand-slam-broadcasters",
  ],
  "tennis-retirement-rules-explained": [
    "walkover-vs-retirement",
    "tennis-walkover-explained",
    "tennis-match-formats-explained",
    "tennis-scoring-system-explained",
  ],
  "tennis-ranking-points-explained": [
    "atp-rankings-explained",
    "protected-ranking-in-tennis",
    "masters-1000-500-250-explained",
    "tennis-seeds-explained",
  ],
  "tennis-match-formats-explained": [
    "tennis-scoring-system-explained",
    "tennis-tiebreak-rules",
    "tennis-retirement-rules-explained",
    "walkover-vs-retirement",
  ],
  "tennis-walkover-explained": [
    "walkover-vs-retirement",
    "tennis-retirement-rules-explained",
    "tennis-draws-explained",
    "tennis-match-formats-explained",
  ],
  "tennis-bye-explained": [
    "tennis-draws-explained",
    "tennis-seeds-explained",
    "tennis-qualifying-explained",
    "wild-card-in-tennis-explained",
  ],
  "tennis-qualifying-explained": [
    "lucky-loser-explained",
    "wild-card-in-tennis-explained",
    "tennis-draws-explained",
    "tennis-seeds-explained",
  ],
  "tennis-tv-vs-grand-slam-broadcasters": [
    "grand-slam-tournaments-explained",
    "masters-1000-500-250-explained",
    "atp-vs-wta-explained",
    "tennis-ranking-points-explained",
  ],
  "masters-1000-500-250-explained": [
    "grand-slam-tournaments-explained",
    "atp-rankings-explained",
    "tennis-ranking-points-explained",
    "atp-vs-wta-explained",
  ],
};

export function getRelatedGuides(article: GuideArticle, limit = 4) {
  const manuallyRelated = (manualRelatedGuideSlugs[article.slug] || [])
    .map(getGuideArticle)
    .filter((item): item is GuideArticle => Boolean(item));

  const sameCategory = publishedGuideArticles.filter(
    (item) => item.slug !== article.slug && item.category === article.category
  );
  const fallback = publishedGuideArticles.filter(
    (item) => item.slug !== article.slug && item.category !== article.category
  );

  return [...new Map([...manuallyRelated, ...sameCategory, ...fallback].map((item) => [item.slug, item])).values()].slice(0, limit);
}
