import { EducationModule } from "../types";

export const EDUCATIONAL_MODULES: EducationModule[] = [
  {
    id: "recording-contracts",
    title: "Recording Contracts 101",
    category: "Master Rights & Label Deals",
    iconName: "Disc",
    badge: "Essential for Recording Artists",
    description: "Master ownership, advances, recoupment mechanics, 360 deals, packaging deductions, and option periods.",
    lessons: [
      {
        id: "rc-1",
        title: "Master Recordings vs. Composition Rights",
        duration: "5 min",
        summary: "Understand the fundamental difference between the sound recording (Master) and the underlying song (Composition).",
        keyPoints: [
          "Every song has TWO distinct copyrights: Sound Recording (Master) and Musical Composition (Songwriting).",
          "Record labels invest in sound recordings and usually demand 100% master ownership.",
          "Publishers manage the songwriting composition (melody + lyrics)."
        ],
        clauseExample: "Artist grants Company exclusive, perpetual ownership of all Master Recordings under work-made-for-hire principles.",
        plainEnglishExplanation: "If you sign this, the label owns the audio file forever. You don't own your master recordings, even if you pay back all the money they spent making them.",
        questionsToAsk: [
          "Can I negotiate a Master Reversion clause after 10-15 years?",
          "Will the label license masters back to me after recoupment?"
        ]
      },
      {
        id: "rc-2",
        title: "Advances, Budgets & Recoupment",
        duration: "7 min",
        summary: "How advances work, why advances are debt, and how cross-collateralization traps artists.",
        keyPoints: [
          "An Advance is NOT free cash or a salary—it is a pre-payment of future royalties.",
          "Recoupment means the label keeps 100% of your earnings until the advance + recording costs are paid off.",
          "Cross-collateralization lets the label hold back earnings from a hit Album 2 to pay off losses from Album 1."
        ],
        clauseExample: "All advances and recording costs shall be fully recoupable from any and all royalties under this or any other agreement.",
        plainEnglishExplanation: "The $50,000 the label gave you must be earned back from YOUR 15-20% royalty share—not from total sales. It takes ~$250,000 in gross earnings to recoup a $50k advance at a 20% royalty rate!",
        questionsToAsk: [
          "Is marketing or video budget 100% recoupable or 50% recoupable?",
          "Can we un-cross-collateralize separate projects?"
        ]
      },
      {
        id: "rc-3",
        title: "The 360 Deal (Ancillary Revenue Cuts)",
        duration: "6 min",
        summary: "Why labels take a cut of live touring, merchandise, brand deals, and acting.",
        keyPoints: [
          "Traditional labels claim streaming revenue isn't enough, so they request 10% to 25% of non-recording income.",
          "Labels rarely provide touring help or merchandise production despite taking a percentage of the gross.",
          "Always insist on calculating 360 participation on NET profit rather than GROSS revenue."
        ],
        clauseExample: "Company shall receive 15% of Artist's Gross Income from live concerts, merchandise, and endorsements.",
        plainEnglishExplanation: "If you make $10,000 on t-shirt sales but spent $8,000 to print them, the label takes 15% of $10,000 ($1,500), leaving you with only $500 profit!",
        questionsToAsk: [
          "Can we exclude non-recording income completely?",
          "Can 360 commission be calculated on NET income after tour expenses?"
        ]
      }
    ],
    quiz: [
      {
        question: "If a label gives an artist a $20,000 advance at a 20% royalty rate, how much gross streaming income must the record generate for the artist to become fully recouped?",
        options: ["$20,000", "$50,000", "$100,000", "$200,000"],
        correctAnswer: 2,
        explanation: "At a 20% artist royalty rate, the artist earns $0.20 per dollar. To earn $20,000 in artist royalties to pay off the advance, the record must generate $100,000 in gross net receipts ($100,000 * 20% = $20,000)."
      },
      {
        question: "What is Cross-Collateralization in a record deal?",
        options: [
          "A fair bonus paid when songs reach 1 million streams",
          "Applying earnings from one successful project to pay off debt from an unrecouped project",
          "Sharing profits equally between the label and distributor",
          "Splitting publishing royalties with backing band members"
        ],
        correctAnswer: 1,
        explanation: "Cross-collateralization connects multiple income sources or albums so the label can use profits from hit records to pay off debts from unrecouped records."
      }
    ]
  },
  {
    id: "publishing",
    title: "Music Publishing & Songwriting",
    category: "Composition Rights & PROs",
    iconName: "Music",
    badge: "For Songwriters & Beatmakers",
    description: "Performance royalties, mechanical royalties, sync licensing, PROs (ASCAP/BMI), and Admin vs Co-Publishing deals.",
    lessons: [
      {
        id: "pub-1",
        title: "Performance vs. Mechanical vs. Sync Royalties",
        duration: "6 min",
        summary: "The 3 primary revenue streams for song composition rights.",
        keyPoints: [
          "Performance Royalties: Paid when songs are radio-broadcasted, streamed online, or played live (collected by ASCAP, BMI, SESAC).",
          "Mechanical Royalties: Paid when songs are manufactured, downloaded, or streamed on Spotify/Apple Music (collected by MLC).",
          "Sync Royalties: Paid when songs are placed in TV shows, movies, video games, or commercials."
        ],
        clauseExample: "Writer retains 100% Writer's Share. Publisher collects Publisher's Share from mechanical and sync licensing.",
        plainEnglishExplanation: "Composition royalties have two equal halves: 50% Writer's Share and 50% Publisher's Share. PROs like ASCAP send the Writer's share directly to you.",
        questionsToAsk: [
          "Are my songs registered with ASCAP/BMI and the MLC?",
          "Does the publisher take a fee on sync placement leads?"
        ]
      },
      {
        id: "pub-2",
        title: "Co-Publishing vs. Administration Deals",
        duration: "8 min",
        summary: "Choosing between giving up 50% publishing copyright vs paying a 15% administration fee.",
        keyPoints: [
          "Admin Deal: You keep 100% song copyright ownership. The admin publisher takes a 10-15% commission to handle registration and licensing.",
          "Co-Publishing Deal: Publisher acquires 50% of your publishing copyright (25% total song rights) in exchange for cash advances and active pitching."
        ],
        clauseExample: "Publisher shall own an undivided 50% interest in all copyrights during the Term.",
        plainEnglishExplanation: "If you don't need a big upfront advance, an Admin Deal lets you keep full ownership while someone else does the accounting paperwork for a small fee.",
        questionsToAsk: [
          "Is an advance necessary, or is an Admin Deal better for long-term ownership?",
          "What is the retention period after the contract expires?"
        ]
      }
    ],
    quiz: [
      {
        question: "Which organization pays Performance Royalties directly to songwriters in the USA?",
        options: ["SoundExchange", "PROs like ASCAP / BMI / SESAC", "DistroKid", "The US Copyright Office"],
        correctAnswer: 1,
        explanation: "Performance rights organizations (ASCAP, BMI, SESAC) collect and distribute performance royalties directly to writers and publishers."
      }
    ]
  },
  {
    id: "producer-agreements",
    title: "Producer Agreements & Beat Licensing",
    category: "Production & Points",
    iconName: "Sliders",
    badge: "For Record Producers & Beatmakers",
    description: "Producer advances, producer points (1-5%), Letter of Direction (LOD), beat license leases vs buyouts.",
    lessons: [
      {
        id: "prod-1",
        title: "Producer Points & Letter of Direction (LOD)",
        duration: "5 min",
        summary: "How record producers get paid royalties from master sound recordings.",
        keyPoints: [
          "Producers typically earn 2% to 5% of master earnings ('Producer Points').",
          "A Letter of Direction (LOD) is a document signed by the artist instructing the label/distributor to pay the producer's points directly."
        ],
        clauseExample: "Artist shall execute a Letter of Direction directing Distributor to pay Producer a 3% master royalty quarter-annually.",
        plainEnglishExplanation: "The Letter of Direction ensures the producer gets paid automatically by Spotify/distributor without waiting for the artist to write a manual check.",
        questionsToAsk: [
          "Are producer points paid on net receipts or gross receipts?",
          "Is the producer advance recoupable against producer royalties?"
        ]
      }
    ],
    quiz: [
      {
        question: "What is the function of a Letter of Direction (LOD) in a producer agreement?",
        options: [
          "Directing the producer on how to arrange vocal harmonies",
          "Authorizing a record label or distributor to pay the producer's royalties directly",
          "Cancelling the contract if the song is not played on the radio",
          "Assigning album artwork copyright to the studio owner"
        ],
        correctAnswer: 1,
        explanation: "An LOD is a written instruction telling distributors/labels to send producer royalties directly to the producer."
      }
    ]
  },
  {
    id: "management-deals",
    title: "Artist Management Agreements",
    category: "Representation & Business Operations",
    iconName: "Users",
    badge: "Business Operations",
    description: "Manager commission rates (15-20%), Gross vs Net commission, Sunset Clauses, and Key Person provisions.",
    lessons: [
      {
        id: "mgr-1",
        title: "Gross vs. Net Commission & Sunset Clauses",
        duration: "7 min",
        summary: "Protecting your earnings from unfair management commissions and long-term debt.",
        keyPoints: [
          "Standard manager commission is 15% to 20%.",
          "Gross commission takes 20% of ALL revenue before expenses (dangerous for live touring).",
          "Sunset Clauses allow ex-managers to collect commissions on deals signed during their tenure for 1-3 years after being fired."
        ],
        clauseExample: "Artist agrees to pay Manager 20% of Gross Earnings across all entertainment activities.",
        plainEnglishExplanation: "Always negotiate for NET commission on live touring so you aren't paying your manager money out of pocket for a tour that lost cash.",
        questionsToAsk: [
          "Can touring commission be based on Net income after expenses?",
          "Can we limit the sunset clause duration to 1 year max with decreasing rates?"
        ]
      }
    ],
    quiz: [
      {
        question: "Why can a 20% GROSS commission on live touring be dangerous for an artist?",
        options: [
          "Because the manager gets paid before expenses, even if the tour loses money",
          "Because Spotify doesn't pay live concert royalties",
          "Because venues charge a 50% ticket tax",
          "Because managers aren't allowed to attend live shows"
        ],
        correctAnswer: 0,
        explanation: "Gross commission calculates 20% on total ticket sales before deducting venue rent, travel, hotels, and backing band costs. If expenses eat up 90% of revenue, a 20% gross commission leaves the artist in debt."
      }
    ]
  },
  {
    id: "distribution",
    title: "Distribution Agreements & Aggregators",
    category: "Digital Distribution & Rights Retention",
    iconName: "Share2",
    badge: "Independent Artist Distribution",
    description: "Flat-fee aggregators (DistroKid/TuneCore) vs percentage aggregators (AWAL/Virgin), white-label distribution, and playlist pitch access.",
    lessons: [
      {
        id: "dist-1",
        title: "Choosing the Right Distribution Model",
        duration: "5 min",
        summary: "Comparing annual subscription flat fees vs percentage rev-share distributor models.",
        keyPoints: [
          "Flat Fee Distributors: Pay $20-$40/year, keep 100% of royalties. Ideal for active independent artists with consistent streams.",
          "Rev-Share Distributors: Pay $0 upfront, distributor takes 15% of royalties. Ideal for low-budget creators wanting marketing support."
        ],
        clauseExample: "Distributor retains 15% distribution fee from Net Receipts delivered from DSPs.",
        plainEnglishExplanation: "If you stream 10,000,000 plays ($40,000 income), a 15% distributor takes $6,000, whereas a flat-fee distributor costs $22/year!",
        questionsToAsk: [
          "Does the distributor charge extra fees for Vevo, TikTok Content ID, or extra artist slots?",
          "Can I request a takedown within 30 days without cancellation fees?"
        ]
      }
    ],
    quiz: [
      {
        question: "For an independent artist earning $50,000/year in Spotify streaming royalties, which distribution model saves the most money?",
        options: [
          "15% Revenue Share Distributor ($7,500 fee)",
          "20% Label Partner Deal ($10,000 fee)",
          "Flat $22/year Unlimited Distributor ($22 fee)",
          "Traditional 50/50 Master Licensing Deal ($25,000 fee)"
        ],
        correctAnswer: 2,
        explanation: "A flat annual subscription of $22 saves $7,478 per year compared to a 15% revenue share model on $50,000 in streaming receipts!"
      }
    ]
  }
];
