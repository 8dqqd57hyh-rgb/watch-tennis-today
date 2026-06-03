export type GuideSection = { heading: string; body: string };
export type GuideFaq = { question: string; answer: string };
export type GuideArticle = { slug: string; title: string; description: string; category: string; intro: string; sections: GuideSection[]; faq: GuideFaq[] };

export const guideArticles: GuideArticle[] = [
  {
    "slug": "tennis-scoring-for-beginners",
    "title": "Tennis Scoring for Beginners",
    "description": "Learn games, sets, deuce, advantage and tiebreaks in plain English, with the terms fans see on live scoreboards.",
    "category": "Basics",
    "intro": "Tennis scoring looks strange at first because the sport counts points, games, sets and matches at the same time. Once you separate those layers, a live scoreboard becomes much easier to read. This guide explains the words and numbers that appear most often when following a match online.",
    "sections": [
      {
        "heading": "Points inside a game",
        "body": "A single game starts at 0, which tennis calls love. The next points are 15, 30 and 40. If a player wins one more point after 40 while the opponent has 30 or less, the game is over. If both players reach 40, the score is called deuce and the game continues until one player wins two points in a row."
      },
      {
        "heading": "Deuce and advantage",
        "body": "At deuce, the next point gives a player advantage. If the same player wins the next point, they win the game. If they lose it, the score returns to deuce. This is why one game can last two minutes or fifteen minutes, especially when both players are serving and returning well."
      },
      {
        "heading": "Games inside a set",
        "body": "A player usually needs six games to win a set, but they must lead by at least two games. A set can end 6-0, 6-3 or 6-4. If it reaches 5-5, one player needs 7-5, or the set may go to a tiebreak at 6-6 depending on the tournament rules."
      },
      {
        "heading": "Tiebreak basics",
        "body": "A tiebreak uses normal numbers instead of 15, 30 and 40. Most tiebreaks are first to seven points with a two-point margin. A score such as 7-5 or 10-8 means the tiebreak was close. In many scoreboards, the tiebreak number is shown in parentheses next to the set score."
      },
      {
        "heading": "Best of three and best of five",
        "body": "Most ATP and WTA matches are best of three sets, so the first player to win two sets wins the match. Men's singles at Grand Slams are usually best of five sets, so a player needs three sets. This affects how long a match can last and why early momentum does not always decide the result."
      }
    ],
    "faq": [
      {
        "question": "What does love mean in tennis?",
        "answer": "Love means zero points in a game."
      },
      {
        "question": "Can a player win a set 6-5?",
        "answer": "No. A player needs a two-game lead, so the set continues to 7-5 or a tiebreak at 6-6 if the event uses one."
      },
      {
        "question": "Why do some final sets have a match tiebreak?",
        "answer": "Some tournaments use a deciding tiebreak format to control match length and scheduling."
      }
    ]
  },
  {
    "slug": "tennis-live-scores-guide",
    "title": "Tennis Live Scores Guide",
    "description": "How to read live tennis scoreboards, match statuses, tiebreak notation, retirements and suspended matches.",
    "category": "Live scores",
    "intro": "A tennis live score is a compact summary of a moving match. It can show who leads in sets, who is serving, the current game score and whether play is delayed. The key is to read the scoreboard from match level down to point level.",
    "sections": [
      {
        "heading": "Read sets before points",
        "body": "Start with the set score. If one player leads by one set, they are ahead even if they are losing the current game. Set columns show the bigger story, while the live point score shows only the current game."
      },
      {
        "heading": "Understand the current game",
        "body": "The current game may show 15, 30, 40, deuce or advantage. A player serving at 40-15 is close to holding serve. A receiver at 15-40 has break points. Break points are important because they can change the direction of a set quickly."
      },
      {
        "heading": "Spot tiebreak notation",
        "body": "Tiebreaks may appear as a separate score or as small numbers in parentheses. For example, 7-6(5) means the set ended 7-6 and the losing player won five points in the tiebreak. Different sites display this slightly differently, so check the layout once before relying on it."
      },
      {
        "heading": "Know the status labels",
        "body": "Live score pages often use labels such as scheduled, live, finished, suspended, postponed, retired or walkover. Suspended means the match started and will continue later. Retired means a player stopped after the match began. Walkover usually means the match did not start."
      },
      {
        "heading": "Expect small delays",
        "body": "Live score feeds can lag behind television, tournament scoreboards or court-side scoring. A short delay does not always mean the site is wrong. For important moments, compare with the official tournament scoreboard before assuming the match status changed."
      }
    ],
    "faq": [
      {
        "question": "What is a break point?",
        "answer": "A break point is a point where the returner can win the server's game."
      },
      {
        "question": "What does suspended mean?",
        "answer": "Suspended means play stopped temporarily, often because of rain, darkness or court conditions."
      },
      {
        "question": "Why is my TV ahead of the live score?",
        "answer": "Different data feeds update at different speeds, so small delays are normal."
      }
    ]
  },
  {
    "slug": "atp-wta-challenger-itf-explained",
    "title": "ATP, WTA, Challenger and ITF Explained",
    "description": "A clear explanation of tennis tour levels, ranking points, player development paths and why coverage changes by event.",
    "category": "Tours",
    "intro": "Professional tennis is not one single league. It is a pyramid of tours and tournament levels. Understanding that pyramid helps fans know why some matches are widely televised while others are available only through live scores or local coverage.",
    "sections": [
      {
        "heading": "ATP and WTA tours",
        "body": "The ATP Tour is the top level of men's professional tennis and the WTA Tour is the top level of women's professional tennis. Their biggest events attract global broadcasters, stronger production and more consistent live coverage."
      },
      {
        "heading": "Masters, 500 and 250 events",
        "body": "ATP and WTA events are grouped by level. Higher-level tournaments usually offer more ranking points, larger prize money and better broadcast distribution. Smaller tour events can still be important, especially for players building confidence or defending ranking points."
      },
      {
        "heading": "Challenger events",
        "body": "The Challenger Tour sits below the ATP Tour and is essential for players trying to climb toward the top 100. Coverage varies. Some events have official streams, some have limited cameras, and some rely mostly on live scoring."
      },
      {
        "heading": "ITF events",
        "body": "ITF tournaments form the foundation of the professional pathway. Many young players, returning players and lower-ranked professionals compete there. Broadcast coverage is often limited because production resources and media rights are smaller."
      },
      {
        "heading": "Why this matters for fans",
        "body": "When a favorite player appears in a Challenger or ITF event, do not assume the match will be available on the same services as a Grand Slam or Masters event. Start with the tournament page, then check official tour links and local broadcaster information."
      }
    ],
    "faq": [
      {
        "question": "Is Challenger tennis professional?",
        "answer": "Yes. Challenger events are professional tournaments and award ranking points."
      },
      {
        "question": "Do ATP and WTA have the same broadcasters?",
        "answer": "Not always. Rights are negotiated separately by tour, event and country."
      },
      {
        "question": "Why do top players rarely play Challengers?",
        "answer": "Top players usually qualify directly for higher-level events with more points and prize money."
      }
    ]
  },
  {
    "slug": "how-to-watch-tennis-online-legally",
    "title": "How to Watch Tennis Online Legally",
    "description": "A practical guide to finding official tennis coverage without unsafe streams or misleading links.",
    "category": "Streaming",
    "intro": "A practical guide to finding official tennis coverage without unsafe streams or misleading links. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Start with the tournament website because tennis rights are sold by event and territory",
        "body": "Start with the tournament website because tennis rights are sold by event and territory. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Check official broadcaster pages before subscribing because rights change by country",
        "body": "Check official broadcaster pages before subscribing because rights change by country. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Avoid sites that promise every match for free while hiding ownership or showing aggressive pop-ups",
        "body": "Avoid sites that promise every match for free while hiding ownership or showing aggressive pop-ups."
      },
      {
        "heading": "Use live scores and highlights when a match has no legal video in your region",
        "body": "Use live scores and highlights when a match has no legal video in your region. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Keep a short list of trusted providers for ATP, WTA and Grand Slam weeks",
        "body": "Keep a short list of trusted providers for ATP, WTA and Grand Slam weeks. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-tv-vs-grand-slam-broadcasters",
    "title": "Tennis TV vs Grand Slam Broadcasters",
    "description": "Why one tennis subscription does not show every major match and how tour rights differ from Grand Slam rights.",
    "category": "Streaming",
    "intro": "Why one tennis subscription does not show every major match and how tour rights differ from Grand Slam rights. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Tennis TV mainly relates to ATP Tour coverage and is not a universal tennis package",
        "body": "Tennis TV mainly relates to ATP Tour coverage and is not a universal tennis package. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Grand Slams sell rights separately, so Australian Open, Roland Garros, Wimbledon and US Open coverage can require different broadcasters",
        "body": "Grand Slams sell rights separately, so Australian Open, Roland Garros, Wimbledon and US Open coverage can require different broadcasters."
      },
      {
        "heading": "WTA coverage can use different partners from ATP coverage even during the same week",
        "body": "WTA coverage can use different partners from ATP coverage even during the same week. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Local blackout rules may change what a paid service can show in your country",
        "body": "Local blackout rules may change what a paid service can show in your country. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Before paying, confirm the event name, country and court coverage on the provider schedule",
        "body": "Before paying, confirm the event name, country and court coverage on the provider schedule."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "how-tennis-schedules-work",
    "title": "How Tennis Schedules Work",
    "description": "Understand order of play, not-before times, court changes, delays and why tennis start times move.",
    "category": "Schedules",
    "intro": "Understand order of play, not-before times, court changes, delays and why tennis start times move. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Only the first match on a court usually has a reliable start time",
        "body": "Only the first match on a court usually has a reliable start time. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Later matches depend on how long earlier matches take, so listed times are estimates",
        "body": "Later matches depend on how long earlier matches take, so listed times are estimates. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Not-before means the match cannot start earlier than that time, but it may start later",
        "body": "Not-before means the match cannot start earlier than that time, but it may start later. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Weather, darkness, withdrawals and broadcaster requests can change court assignments",
        "body": "Weather, darkness, withdrawals and broadcaster requests can change court assignments. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "The order of play is the most useful official document for planning a tennis day",
        "body": "The order of play is the most useful official document for planning a tennis day. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "grand-slam-viewing-guide",
    "title": "Grand Slam Viewing Guide",
    "description": "How to follow the Australian Open, Roland Garros, Wimbledon and US Open with legal viewing options.",
    "category": "Grand Slams",
    "intro": "How to follow the Australian Open, Roland Garros, Wimbledon and US Open with legal viewing options. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Each Grand Slam controls its own media-rights structure and official broadcaster list",
        "body": "Each Grand Slam controls its own media-rights structure and official broadcaster list. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Early rounds involve many courts, so full-court coverage matters more than simple TV availability",
        "body": "Early rounds involve many courts, so full-court coverage matters more than simple TV availability."
      },
      {
        "heading": "Australian Open times can be difficult for Europe and the Americas because of the Melbourne timezone",
        "body": "Australian Open times can be difficult for Europe and the Americas because of the Melbourne timezone."
      },
      {
        "heading": "Roland Garros and Wimbledon are easier for European schedules but may fall during work hours elsewhere",
        "body": "Roland Garros and Wimbledon are easier for European schedules but may fall during work hours elsewhere."
      },
      {
        "heading": "Combine official order of play, broadcaster schedules and live scores for the cleanest viewing plan",
        "body": "Combine official order of play, broadcaster schedules and live scores for the cleanest viewing plan."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "safe-tennis-streaming-checklist",
    "title": "Safe Tennis Streaming Checklist",
    "description": "A practical safety checklist for identifying trustworthy tennis viewing sources.",
    "category": "Safety",
    "intro": "A practical safety checklist for identifying trustworthy tennis viewing sources. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "A legitimate service clearly identifies the company, price, subscription terms and support process",
        "body": "A legitimate service clearly identifies the company, price, subscription terms and support process."
      },
      {
        "heading": "Be cautious with pages that open multiple pop-ups before showing basic match information",
        "body": "Be cautious with pages that open multiple pop-ups before showing basic match information. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Official apps in recognized app stores are safer than anonymous mirror domains",
        "body": "Official apps in recognized app stores are safer than anonymous mirror domains. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Free does not always mean illegal, but legal free coverage should still have a clear broadcaster or tournament source",
        "body": "Free does not always mean illegal, but legal free coverage should still have a clear broadcaster or tournament source."
      },
      {
        "heading": "When unsure, use official scores, tournament highlights or written recaps instead of risky streams",
        "body": "When unsure, use official scores, tournament highlights or written recaps instead of risky streams."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-time-zone-planning",
    "title": "Tennis Time Zone Planning",
    "description": "How to plan around tennis match times when tournaments are played across the world.",
    "category": "Schedules",
    "intro": "How to plan around tennis match times when tournaments are played across the world. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Always convert tournament local time to your own timezone before making plans",
        "body": "Always convert tournament local time to your own timezone before making plans. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Track previous matches on the same court if your favorite player is second, third or fourth on",
        "body": "Track previous matches on the same court if your favorite player is second, third or fourth on."
      },
      {
        "heading": "Set two reminders: one for the earliest possible window and one when the previous match nears completion",
        "body": "Set two reminders: one for the earliest possible window and one when the previous match nears completion."
      },
      {
        "heading": "Grand Slam night sessions can run extremely late in other regions, so replay access matters",
        "body": "Grand Slam night sessions can run extremely late in other regions, so replay access matters."
      },
      {
        "heading": "Do not treat schedule screenshots as final because weather and court changes can happen quickly",
        "body": "Do not treat schedule screenshots as final because weather and court changes can happen quickly."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "how-to-read-tennis-order-of-play",
    "title": "How to Read a Tennis Order of Play",
    "description": "What court assignments, sessions, match order and not-before notes mean for fans.",
    "category": "Schedules",
    "intro": "What court assignments, sessions, match order and not-before notes mean for fans. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "An order of play lists the daily court schedule and is more reliable than social media screenshots",
        "body": "An order of play lists the daily court schedule and is more reliable than social media screenshots."
      },
      {
        "heading": "Court assignment affects viewing availability because main courts receive stronger broadcast production",
        "body": "Court assignment affects viewing availability because main courts receive stronger broadcast production."
      },
      {
        "heading": "Match sequence matters more than the clock for later matches on a court",
        "body": "Match sequence matters more than the clock for later matches on a court. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Day and night sessions can affect tickets, coverage and start-time expectations",
        "body": "Day and night sessions can affect tickets, coverage and start-time expectations. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Recheck after rain, withdrawals or unusually long matches because tournaments can move matches",
        "body": "Recheck after rain, withdrawals or unusually long matches because tournaments can move matches."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-broadcast-rights-by-country",
    "title": "Tennis Broadcast Rights by Country",
    "description": "Why coverage changes by region and how fans can verify the correct legal broadcaster.",
    "category": "Streaming",
    "intro": "Why coverage changes by region and how fans can verify the correct legal broadcaster. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Tennis rights are territorial, so the same match can require different services in Poland, the UK or the US",
        "body": "Tennis rights are territorial, so the same match can require different services in Poland, the UK or the US."
      },
      {
        "heading": "The best confirmation comes from matching the tournament broadcaster page with the provider schedule",
        "body": "The best confirmation comes from matching the tournament broadcaster page with the provider schedule."
      },
      {
        "heading": "Old articles can be wrong because rights may change every season or every contract cycle",
        "body": "Old articles can be wrong because rights may change every season or every contract cycle. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Some providers show main courts only, while others include outside-court streams",
        "body": "Some providers show main courts only, while others include outside-court streams. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Country guides are useful starting points, but final availability depends on current rights and package details",
        "body": "Country guides are useful starting points, but final availability depends on current rights and package details."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-streaming-without-cable",
    "title": "How to Watch Tennis Without Cable",
    "description": "Legal cord-cutter options for fans who do not use traditional TV packages.",
    "category": "Streaming",
    "intro": "Legal cord-cutter options for fans who do not use traditional TV packages. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "List the tournaments you care about before choosing a service",
        "body": "List the tournaments you care about before choosing a service. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "A dedicated tennis service may suit ATP fans, while Grand Slam fans may need broadcaster bundles",
        "body": "A dedicated tennis service may suit ATP fans, while Grand Slam fans may need broadcaster bundles."
      },
      {
        "heading": "Replay access is important because tennis schedules often shift into work hours or overnight",
        "body": "Replay access is important because tennis schedules often shift into work hours or overnight."
      },
      {
        "heading": "Check whether the service supports your device before match day",
        "body": "Check whether the service supports your device before match day. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Avoid illegal cable-replacement sites because they often combine unstable streams with unsafe ads",
        "body": "Avoid illegal cable-replacement sites because they often combine unstable streams with unsafe ads."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-player-form-guide",
    "title": "How to Understand Tennis Player Form",
    "description": "Judge recent form without overreacting to one result, one injury rumor or one live score.",
    "category": "Analysis",
    "intro": "Judge recent form without overreacting to one result, one injury rumor or one live score. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Form is more than win-loss record; opponent quality and surface matter",
        "body": "Form is more than win-loss record; opponent quality and surface matter. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "A strong clay result may not predict grass performance, and indoor hard courts reward different skills",
        "body": "A strong clay result may not predict grass performance, and indoor hard courts reward different skills."
      },
      {
        "heading": "Travel, match load and recovery affect performance during packed parts of the season",
        "body": "Travel, match load and recovery affect performance during packed parts of the season. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Retirements and medical timeouts need context before they become conclusions",
        "body": "Retirements and medical timeouts need context before they become conclusions. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "For viewing decisions, look for serving quality, movement, return depth and calm under pressure",
        "body": "For viewing decisions, look for serving quality, movement, return depth and calm under pressure."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-surfaces-explained",
    "title": "Tennis Surfaces Explained",
    "description": "How clay, grass, hard courts and indoor conditions change tennis matches.",
    "category": "Basics",
    "intro": "How clay, grass, hard courts and indoor conditions change tennis matches. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Clay slows the ball and rewards patience, movement and heavy topspin",
        "body": "Clay slows the ball and rewards patience, movement and heavy topspin. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Grass keeps points shorter and makes low slices and first serves more dangerous",
        "body": "Grass keeps points shorter and makes low slices and first serves more dangerous. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Hard courts sit between clay and grass but can vary a lot by tournament speed",
        "body": "Hard courts sit between clay and grass but can vary a lot by tournament speed. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Indoor courts remove wind and sun, which can help clean ball-strikers and big servers",
        "body": "Indoor courts remove wind and sun, which can help clean ball-strikers and big servers. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Surface history is crucial when comparing players before a match",
        "body": "Surface history is crucial when comparing players before a match. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "grand-slam-final-set-rules",
    "title": "Grand Slam Final Set Rules",
    "description": "Why deciding sets and match tiebreaks can look different across major tournaments.",
    "category": "Rules",
    "intro": "Why deciding sets and match tiebreaks can look different across major tournaments. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Final-set rules have changed over time to reduce marathon matches and protect schedules",
        "body": "Final-set rules have changed over time to reduce marathon matches and protect schedules. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Many events now use a deciding tiebreak at a specific score in the final set",
        "body": "Many events now use a deciding tiebreak at a specific score in the final set. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Best-of-five men's Grand Slam matches create more room for momentum swings than best-of-three matches",
        "body": "Best-of-five men's Grand Slam matches create more room for momentum swings than best-of-three matches."
      },
      {
        "heading": "A final-set tiebreak can make serving order and pressure management decisive",
        "body": "A final-set tiebreak can make serving order and pressure management decisive. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Always check current tournament rules because formats can change between seasons",
        "body": "Always check current tournament rules because formats can change between seasons. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-rankings-basic-guide",
    "title": "Tennis Rankings Basic Guide",
    "description": "How ranking points work, why players defend points and why tournament level matters.",
    "category": "Rankings",
    "intro": "How ranking points work, why players defend points and why tournament level matters. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Rankings are built from points earned at tournaments over a rolling period",
        "body": "Rankings are built from points earned at tournaments over a rolling period. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Players defend points when results from the previous year drop off their total",
        "body": "Players defend points when results from the previous year drop off their total. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Higher-level events award more points, but deep runs at smaller events can still matter",
        "body": "Higher-level events award more points, but deep runs at smaller events can still matter. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Injuries can hurt rankings because missed events remove chances to replace old points",
        "body": "Injuries can hurt rankings because missed events remove chances to replace old points. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Rankings affect seeding, direct entry and the difficulty of a player's draw",
        "body": "Rankings affect seeding, direct entry and the difficulty of a player's draw. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-tournament-levels-guide",
    "title": "Tennis Tournament Levels Guide",
    "description": "A fan-friendly guide to Grand Slams, Masters, 500s, 250s, WTA levels, Challengers and ITF events.",
    "category": "Tours",
    "intro": "A fan-friendly guide to Grand Slams, Masters, 500s, 250s, WTA levels, Challengers and ITF events. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Grand Slams sit at the top for prestige, points and global attention",
        "body": "Grand Slams sit at the top for prestige, points and global attention. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Masters and WTA 1000 events are elite tour stops with strong fields",
        "body": "Masters and WTA 1000 events are elite tour stops with strong fields. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "ATP/WTA 500 and 250 events help shape form, rankings and regional tennis calendars",
        "body": "ATP/WTA 500 and 250 events help shape form, rankings and regional tennis calendars. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Challengers and ITF events build the pipeline for future tour players",
        "body": "Challengers and ITF events build the pipeline for future tour players. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Coverage depth usually follows tournament level, but local exceptions can happen",
        "body": "Coverage depth usually follows tournament level, but local exceptions can happen. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "how-to-follow-a-player-season",
    "title": "How to Follow a Tennis Player's Season",
    "description": "Build a simple system for tracking a favorite player's matches, surface swings and schedule changes.",
    "category": "Fans",
    "intro": "Build a simple system for tracking a favorite player's matches, surface swings and schedule changes. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Start with the official player schedule when available, then confirm through tournament entry lists",
        "body": "Start with the official player schedule when available, then confirm through tournament entry lists."
      },
      {
        "heading": "Track surface blocks: hard court, clay, grass, summer hard court and indoor season",
        "body": "Track surface blocks: hard court, clay, grass, summer hard court and indoor season. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Use live scores for match timing and official tournament pages for draw placement",
        "body": "Use live scores for match timing and official tournament pages for draw placement. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Expect withdrawals because tennis schedules are physically demanding",
        "body": "Expect withdrawals because tennis schedules are physically demanding. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Keep notes on form by surface rather than judging the whole season from one match",
        "body": "Keep notes on form by surface rather than judging the whole season from one match. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-draws-explained",
    "title": "Tennis Draws Explained",
    "description": "Understand seeds, qualifiers, wild cards, byes and why draw position changes the path to a title.",
    "category": "Basics",
    "intro": "Understand seeds, qualifiers, wild cards, byes and why draw position changes the path to a title. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "A draw shows the route players must take through a tournament",
        "body": "A draw shows the route players must take through a tournament. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Seeds are placed to keep top-ranked players apart in early rounds",
        "body": "Seeds are placed to keep top-ranked players apart in early rounds. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Qualifiers earn entry through pre-tournament matches and can be dangerous because they are already match sharp",
        "body": "Qualifiers earn entry through pre-tournament matches and can be dangerous because they are already match sharp."
      },
      {
        "heading": "Wild cards are tournament invitations, often given to local players or returning stars",
        "body": "Wild cards are tournament invitations, often given to local players or returning stars. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Byes allow selected players to skip the first round, usually in larger tour events",
        "body": "Byes allow selected players to skip the first round, usually in larger tour events. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-retirement-walkover-withdrawal",
    "title": "Retirement, Walkover and Withdrawal in Tennis",
    "description": "The differences between common tennis result labels and what they mean for fans.",
    "category": "Live scores",
    "intro": "The differences between common tennis result labels and what they mean for fans. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "A retirement happens after a match starts and a player cannot continue",
        "body": "A retirement happens after a match starts and a player cannot continue. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "A walkover usually means a player could not start the scheduled match",
        "body": "A walkover usually means a player could not start the scheduled match. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "A withdrawal can happen before a draw, before a tournament or before a specific round",
        "body": "A withdrawal can happen before a draw, before a tournament or before a specific round. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Suspension is different because the match is paused and expected to resume",
        "body": "Suspension is different because the match is paused and expected to resume. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "These labels matter when reading records, schedules and player health news",
        "body": "These labels matter when reading records, schedules and player health news. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-court-coverage-guide",
    "title": "Tennis Court Coverage Guide",
    "description": "Why some courts have video, some have only scores and some disappear from TV schedules.",
    "category": "Streaming",
    "intro": "Why some courts have video, some have only scores and some disappear from TV schedules. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Main courts usually receive the best cameras, commentary and international coverage",
        "body": "Main courts usually receive the best cameras, commentary and international coverage. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Outside courts may have streaming cameras but no TV commentary",
        "body": "Outside courts may have streaming cameras but no TV commentary. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Smaller tournaments may not have production resources for every court",
        "body": "Smaller tournaments may not have production resources for every court. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Court changes can affect whether a match is shown live or only tracked by score",
        "body": "Court changes can affect whether a match is shown live or only tracked by score. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Before paying for coverage, check if the service includes all courts or selected courts only",
        "body": "Before paying for coverage, check if the service includes all courts or selected courts only."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-replays-and-highlights-guide",
    "title": "Tennis Replays and Highlights Guide",
    "description": "How to use replays and highlights legally when live tennis is not practical.",
    "category": "Streaming",
    "intro": "How to use replays and highlights legally when live tennis is not practical. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Replays are valuable because tennis matches often start late or overnight",
        "body": "Replays are valuable because tennis matches often start late or overnight. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Some services offer full-match replays while others only provide short highlights",
        "body": "Some services offer full-match replays while others only provide short highlights. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Spoiler controls matter if you want to watch without knowing the result",
        "body": "Spoiler controls matter if you want to watch without knowing the result. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Tournament YouTube channels may post official highlights, but usually not full matches",
        "body": "Tournament YouTube channels may post official highlights, but usually not full matches. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Check replay availability before subscribing, especially during Grand Slam weeks",
        "body": "Check replay availability before subscribing, especially during Grand Slam weeks. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-weather-delay-guide",
    "title": "Tennis Weather Delay Guide",
    "description": "How rain, heat, wind and darkness affect tennis schedules and live coverage.",
    "category": "Schedules",
    "intro": "How rain, heat, wind and darkness affect tennis schedules and live coverage. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Rain is the most common reason outdoor matches stop or move",
        "body": "Rain is the most common reason outdoor matches stop or move. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Some tournaments have roofs on main courts, but outside courts may still be delayed",
        "body": "Some tournaments have roofs on main courts, but outside courts may still be delayed. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Heat rules can create breaks, schedule changes or slower play conditions",
        "body": "Heat rules can create breaks, schedule changes or slower play conditions. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Wind changes ball tosses, timing and rally patterns, especially on exposed courts",
        "body": "Wind changes ball tosses, timing and rally patterns, especially on exposed courts. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "After delays, always recheck court assignments because matches may move",
        "body": "After delays, always recheck court assignments because matches may move. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  },
  {
    "slug": "tennis-legal-streaming-red-flags",
    "title": "Tennis Streaming Red Flags",
    "description": "Warning signs that a tennis streaming page may be unsafe, misleading or unofficial.",
    "category": "Safety",
    "intro": "Warning signs that a tennis streaming page may be unsafe, misleading or unofficial. This guide focuses on practical decisions fans make before and during match day, using official sources and cautious assumptions instead of unsafe shortcuts.",
    "sections": [
      {
        "heading": "Be careful with pages that promise every match from every tournament with no clear provider",
        "body": "Be careful with pages that promise every match from every tournament with no clear provider."
      },
      {
        "heading": "Multiple pop-ups, fake download buttons and forced browser notifications are major red flags",
        "body": "Multiple pop-ups, fake download buttons and forced browser notifications are major red flags."
      },
      {
        "heading": "A legal service should explain pricing, rights, region and cancellation terms",
        "body": "A legal service should explain pricing, rights, region and cancellation terms. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "Do not install unknown extensions to watch a match",
        "body": "Do not install unknown extensions to watch a match. It is a small detail, but it can decide whether a fan finds the right match, the correct start window and a safe source of information."
      },
      {
        "heading": "When a page feels suspicious, close it and use official scores or broadcaster directories instead",
        "body": "When a page feels suspicious, close it and use official scores or broadcaster directories instead."
      }
    ],
    "faq": [
      {
        "question": "What is the safest starting point?",
        "answer": "Use the tournament website, official tour pages and recognized broadcasters before relying on unofficial pages."
      },
      {
        "question": "Can coverage change by country?",
        "answer": "Yes. Tennis media rights are territorial and can change by tournament, season and platform."
      },
      {
        "question": "Should I use free unofficial streams?",
        "answer": "No. They can be unstable, illegal or unsafe. Use legal broadcasts, official scores, replays or highlights instead."
      }
    ]
  }
];

export function getGuideArticle(slug: string) {
  return guideArticles.find((article) => article.slug === slug);
}
