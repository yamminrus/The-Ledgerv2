import { SampleContract } from "../types";

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: "recording-360-deal",
    title: "Major Label Exclusive 360 Recording Agreement",
    category: "Recording Contracts",
    description: "Standard traditional 360 record deal assigning master recordings in perpetuity with label ancillary revenue rights (merch, touring, sync).",
    summaryText: "High artist risk. The label takes 82% of master royalties, retains master ownership forever, and claims 15% of live touring and merchandise.",
    defaultRiskScore: 88,
    fullText: `EXCLUSIVE RECORDING AGREEMENT

This Exclusive Recording Agreement ("Agreement") is made and entered into as of January 15, 2026, by and between APEX SOUND MUSIC GROUP LLC ("Company") and JANE DOE p/k/a "ECHO NOVA" ("Artist").

1. GRANT OF RIGHTS & MASTER OWNERSHIP
Artist hereby grants, assigns, and transfers to Company, solely, exclusively, and perpetually throughout the Universe, all right, title, and interest in and to all sound recordings, audio-visual recordings, and performances embodied therein produced hereunder during the Term ("Master Recordings"). Company shall be deemed the author and exclusive owner of all Master Recordings from inception under "work-made-for-hire" principles.

2. TERM & OPTION PERIODS
The initial period of the Term ("Initial Period") shall commence on the date hereof and continue until twelve (12) months following the commercial release of the First Album. Artist hereby grants Company six (6) separate, consecutive, and unilateral options to extend the Term for additional periods ("Option Periods"), each requiring the delivery of one (1) full-length album.

3. ADVANCES & RECOUPMENT
Company shall pay Artist a non-returnable advance of Twenty-Five Thousand Dollars ($25,000.00) upon execution hereof. All advances, recording costs, video production expenses ($10,000 max), marketing budgets, and audit fees paid by Company shall be fully recoupable from any and all royalties payable to Artist hereunder or under any other agreement between Artist and Company ("Cross-Collateralization").

4. ROYALTY RATE & DEDUCTIONS
Company shall pay Artist a royalty of eighteen percent (18%) of Company's Net Receipts from digital streaming and physical sales. Net Receipts shall be calculated after deducting standard packaging deductions (25%), container charges, distributor fees (15%), and bad debts.

5. ANCILLARY RIGHTS (360 PROVISION)
Company shall receive fifteen percent (15%) of Artist's Gross Income from all non-recording music activities, including but not limited to live touring, concerts, merchandising, brand sponsorships, fan clubs, and acting fees.

6. AUDIT RIGHTS
Artist shall have the right, at Artist's sole expense, to inspect Company's books and records relating to Artist's royalties once per calendar year upon sixty (60) days prior written notice. Any audit must be conducted by a certified public accountant during regular business hours at Company's main office.

7. INJUNCTIVE RELIEF & NON-COMPETE
During the Term, Artist shall not render recording performances for any other person or entity, nor re-record any composition embodied in a Master Recording for a period of five (5) years following the expiration or termination of this Agreement.`,
    analysis: {
      title: "Major Label Exclusive 360 Recording Agreement Analysis",
      dealType: "Major Label 360 Agreement",
      riskScore: 88,
      summary: "This is a restrictive traditional 360 deal. The label gains perpetual ownership of all master recordings, 82% of streaming profits, and takes a 15% cut of your live touring, merch, and brand deals.",
      plainEnglishTranslation: "The label pays you $25,000 upfront, but you must pay back that $25,000 plus video and studio costs from your small 18% royalty cut before you see another dollar. The label owns your music forever and takes a cut of your live shows and merchandise.",
      keyTerms: [
        { term: "Master Ownership", value: "Perpetual (Work for Hire)", impact: "You never own your original master recordings." },
        { term: "Artist Royalty Rate", value: "18% of Net Receipts", impact: "Label keeps 82% of all streaming revenue." },
        { term: "Ancillary (360) Cut", value: "15% Gross non-recording", impact: "Label takes 15% of touring, merch, and sponsorship income." },
        { term: "Option Periods", value: "6 Unilateral Options", impact: "Label can lock you into up to 7 album cycles." }
      ],
      redFlags: [
        {
          clause: "Section 1: Master Ownership in Perpetuity",
          riskLevel: "HIGH",
          explanation: "Assigning masters perpetually means you will never own your sound recordings even after all advances are recouped.",
          questionToAsk: "Can we negotiate a Master Reversion clause where rights return to the artist after 10-15 years or post-recoupment?"
        },
        {
          clause: "Section 3: Cross-Collateralization",
          riskLevel: "HIGH",
          explanation: "Unrecouped balances from album 1 can be deducted from earnings of album 2 or merch sales, making it very difficult to ever get paid.",
          questionToAsk: "Can cross-collateralization between albums and non-recording income streams be strictly severed?"
        },
        {
          clause: "Section 5: Ancillary 360 Cut (15%)",
          riskLevel: "HIGH",
          explanation: "Taking 15% of gross touring and merch revenue without contributing to tour expenses reduces artist profits significantly.",
          questionToAsk: "Can 360 participation be eliminated, or at least calculated on NET profits rather than GROSS receipts?"
        },
        {
          clause: "Section 2: 6 Unilateral Label Option Periods",
          riskLevel: "MEDIUM",
          explanation: "The label controls whether you remain signed for 7 albums, while you have no right to leave if unhappy.",
          questionToAsk: "Can option periods be capped at 2 options, tied strictly to minimum sales thresholds?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 6: Audit Rights",
          explanation: "Provides the right to inspect accounting books once per year upon written notice."
        }
      ],
      questionsForAttorney: [
        "How can we insert a Master Reversion clause so rights return to me after 10 years?",
        "Can we remove cross-collateralization between touring/merchandise and recording advances?",
        "Can we increase the artist royalty rate from 18% to 25-30% on digital streaming?",
        "Can we restrict the contract to 2 album options instead of 6 unilateral options?",
        "What is the definition of 'Net Receipts' and can we cap packaging deductions on digital streams to 0%?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 18,
        labelShareRate: 82,
        advanceAmount: 25000,
        distributionFeeRate: 15
      }
    }
  },
  {
    id: "co-publishing-deal",
    title: "Standard Music Co-Publishing Agreement",
    category: "Publishing Agreements",
    description: "50/50 Co-Publishing Agreement where publisher manages composition administration and takes 50% of the publisher's share.",
    summaryText: "Moderate risk. Publisher acquires 50% of your publishing rights in exchange for administration, sync plugging, and advance capital.",
    defaultRiskScore: 54,
    fullText: `CO-PUBLISHING AGREEMENT

This Co-Publishing Agreement is entered into on February 1, 2026, between SKYLINE MUSIC PUBLISHING INC. ("Publisher") and ALEX RIVERS ("Writer").

1. GRANT OF RIGHTS
Writer hereby assigns to Publisher an undivided fifty percent (50%) interest in all copyrights, titles, and publishing rights in and to all musical compositions written, composed, or acquired by Writer during the Term ("Compositions"). Writer retains one hundred percent (100%) of the Writer's Share of royalties.

2. ROYALTY SPLITS
Publisher shall collect all gross revenues generated from the Compositions (mechanical, sync, performance, print) and disburse income as follows:
(a) Writer's Share: 100% directly from PRO (ASCAP/BMI/SESAC) or Publisher.
(b) Publisher's Share: 50% to Publisher, 50% to Writer ("Co-Publishing Share").

3. ADVANCES & RECOUPMENT
Publisher agrees to pay Writer an advance of Fifteen Thousand Dollars ($15,000.00). All advances shall be recoupable from Writer's Co-Publishing Share and Writer's share of mechanical/sync royalties.

4. SYNC LICENSING APPROVAL
Publisher shall have the right to grant non-exclusive synchronization licenses for television, film, streaming, and commercials. Sync fees above $5,000 shall require Writer's prior written consent, not to be unreasonably withheld.`,
    analysis: {
      title: "Standard Music Co-Publishing Agreement Analysis",
      dealType: "Co-Publishing Agreement",
      riskScore: 54,
      summary: "A standard co-publishing deal where you retain 100% of your Writer's Share and 50% of the Publisher's Share (overall 75% of total publishing royalties).",
      plainEnglishTranslation: "You keep your writer's share (50% of total composition royalties). The publisher takes half of the publishing share for running administration and finding placement opportunities.",
      keyTerms: [
        { term: "Writer's Share", value: "100% (50% total composition)", impact: "Always paid directly to you by ASCAP/BMI." },
        { term: "Publisher's Share Split", value: "50% Publisher / 50% Writer", impact: "You yield 25% total composition share to publisher." },
        { term: "Advance", value: "$15,000 Recoupable", impact: "Publisher recoups advance before paying publisher share royalties." },
        { term: "Sync Approval Threshold", value: "$5,000+", impact: "You must approve sync licenses over $5,000." }
      ],
      redFlags: [
        {
          clause: "Section 1: Assignment of 50% Copyright",
          riskLevel: "MEDIUM",
          explanation: "Assigning half the copyright ownership permanently to the publisher means you cannot move those songs to another publisher later.",
          questionToAsk: "Can we structure this as an Administration Deal instead, where publisher gets 15-20% fee without acquiring copyright ownership?"
        },
        {
          clause: "Section 4: Unrestricted Sync under $5,000",
          riskLevel: "LOW",
          explanation: "Publisher can place songs in low-tier media without asking you first if the fee is below $5,000.",
          questionToAsk: "Can we require artist approval for ANY sync placement involving sensitive industries (alcohol, politics, weapons)?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 2: Writer Share Retention",
          explanation: "Writer retains 100% of Writer's share directly, guaranteeing 50% total income baseline."
        },
        {
          clause: "Section 4: Sync Consent Threshold",
          explanation: "Requires writer's written approval for major sync deals over $5,000."
        }
      ],
      questionsForAttorney: [
        "Can we convert this from a Co-Publishing Deal to an Admin Deal with a 15% fee?",
        "What is the term duration of this agreement and when do admin rights revert?",
        "Does the publisher have full global rights or can territory be limited?",
        "Are mechanical royalty payments paid quarterly or semi-annually?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 75,
        labelShareRate: 25,
        advanceAmount: 15000,
        distributionFeeRate: 0
      }
    }
  },
  {
    id: "producer-spec-agreement",
    title: "Independent Producer Spec & Royalty Agreement",
    category: "Producer Agreements",
    description: "Spec producer agreement allocating 3 producer points (3%) off the master and Letter of Direction (LOD) for direct distributor payouts.",
    summaryText: "Fair artist-producer arrangement. Producer gets $2,500 advance + 3% master points paid post-recoupment via Letter of Direction.",
    defaultRiskScore: 32,
    fullText: `PRODUCER AGREEMENT & LETTER OF DIRECTION

This Producer Agreement is entered into as of March 10, 2026, between BEATSMITH PRODUCTIONS ("Producer") and MARCUS Vance ("Artist").

1. SERVICES & PRODUCER ADVANCE
Producer agrees to produce, mix, and deliver two (2) master recordings ("Tracks"). Artist shall pay Producer a producer advance fee of Two Thousand Five Hundred Dollars ($2,500.00) per Track upon master delivery.

2. PRODUCER ROYALTY (POINTS)
Artist grants Producer a royalty equal to three percent (3%) of Net Receipts derived from the Master Recordings ("Producer Points"). Producer royalties shall be calculated on a "record one" basis after Artist has recouped recording costs at the artist royalty rate.

3. LETTER OF DIRECTION (LOD)
Artist agrees to execute a standard Letter of Direction authorizing Artist's record label or digital distributor (e.g. DistroKid, TuneCore) to pay Producer's 3% royalty directly to Producer on a quarterly basis.`,
    analysis: {
      title: "Independent Producer Spec Agreement Analysis",
      dealType: "Producer Agreement",
      riskScore: 32,
      summary: "Standard fair producer contract. Producer receives a $2,500 upfront fee per track and 3% points from master sound recording receipts.",
      plainEnglishTranslation: "You pay the producer $2,500 for producing the beat/track. Once you recoup your studio costs, the producer gets 3% of master earnings paid directly by your distributor.",
      keyTerms: [
        { term: "Upfront Fee", value: "$2,500 per Track", impact: "Fixed cost for beat production and mixing." },
        { term: "Producer Royalty", value: "3 Master Points (3%)", impact: "Producer earns 3% of master revenue." },
        { term: "Letter of Direction", value: "Included", impact: "Distributor pays producer automatically without manual calculations." }
      ],
      redFlags: [
        {
          clause: "Section 2: 'Record One' Recoupment Definition",
          riskLevel: "MEDIUM",
          explanation: "Record One recoupment means once recording costs are recouped, producer gets paid back to the very first stream.",
          questionToAsk: "Does the producer royalty apply prospectively or retroactively from stream #1?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 3: Letter of Direction",
          explanation: "Streamlines distributor payouts directly to producer, preventing dispute delays."
        }
      ],
      questionsForAttorney: [
        "Does the 3% producer royalty come out of the artist's royalty share or label share?",
        "Is the producer advance recoupable against producer royalties?",
        "Does the producer retain any publishing co-writing split on the musical composition?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 97,
        labelShareRate: 0,
        advanceAmount: 25000,
        distributionFeeRate: 0
      }
    }
  },
  {
    id: "management-deal",
    title: "Artist Management Agreement with Sunset Clause",
    category: "Management Deals",
    description: "Management representation agreement charging 20% gross commission across all entertainment earnings with a 3-year sunset clause.",
    summaryText: "High management risk if commission is on GROSS earnings. Includes a 3-year post-term sunset clause.",
    defaultRiskScore: 78,
    fullText: `ARTIST MANAGEMENT AGREEMENT

This Management Agreement ("Agreement") is made as of April 5, 2026, by and between APEX MANAGEMENT LLC ("Manager") and CHLOE BENNETT ("Artist").

1. ENGAGEMENT & SCOPE
Artist hereby engages Manager as Artist's exclusive personal manager throughout the world in the entertainment industry for a term of three (3) years.

2. MANAGER COMMISSION
Artist shall pay Manager a commission equal to twenty percent (20%) of Artist's Gross Earnings derived from all entertainment activities during the Term, including recordings, live performances, publishing, sync, acting, and brand endorsements.

3. SUNSET CLAUSE
Following the expiration or termination of the Term, Manager shall continue to receive commission on contracts entered into or negotiated during the Term as follows:
- Year 1 post-term: 20% commission
- Year 2 post-term: 15% commission
- Year 3 post-term: 10% commission

4. EXPENSE REIMBURSEMENT
Artist shall reimburse Manager for all reasonable out-of-pocket travel and promotional expenses incurred on Artist's behalf within thirty (30) days of invoice submission. Expenses exceeding $1,000 shall require Artist's prior written consent.`,
    analysis: {
      title: "Artist Management Agreement Analysis",
      dealType: "Personal Management Agreement",
      riskScore: 78,
      summary: "Manager takes 20% commission on GROSS earnings across all entertainment ventures, plus post-termination sunset commission for 3 years.",
      plainEnglishTranslation: "The manager gets 20% of every dollar you make before expenses. If a tour loses money, you still owe the manager 20% of gross ticket sales! Even after firing the manager, you must pay them sunset royalties for 3 years.",
      keyTerms: [
        { term: "Manager Commission", value: "20% of Gross Earnings", impact: "Manager takes 20% before deducting your travel, band, or production expenses." },
        { term: "Term", value: "3 Years Exclusive", impact: "You cannot switch managers during the 3-year period." },
        { term: "Sunset Clause", value: "3 Years Post-Term (20% -> 15% -> 10%)", impact: "You pay two managers simultaneously if you hire a new manager after termination." }
      ],
      redFlags: [
        {
          clause: "Section 2: Commission on GROSS Income",
          riskLevel: "HIGH",
          explanation: "Commissioning gross income can leave artists in debt after paying tour production costs, backing musicians, and travel.",
          questionToAsk: "Can commission be calculated on NET earnings (after deducting tour operating expenses) or capped on live shows?"
        },
        {
          clause: "Section 3: Extended 3-Year Sunset Clause",
          riskLevel: "HIGH",
          explanation: "Paying 20% post-term leaves very little income left to pay a new replacement manager.",
          questionToAsk: "Can sunset commission be shortened to 1 year max with a step-down rate of 10% then 5%?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 4: Expense Cap Approval",
          explanation: "Requires manager to get artist's written consent for expenses over $1,000."
        }
      ],
      questionsForAttorney: [
        "How can we insert a Key Person Clause so I can leave if my specific manager leaves the company?",
        "Can we exclude non-music earnings (e.g., passive family income, unrelated acting) from manager commission?",
        "Can we add performance milestones (e.g. manager must secure $50k gross income in Year 1 to trigger Year 2)?"
      ]
    }
  },
  {
    id: "distribution-agreement",
    title: "Digital Music Aggregator & Distribution Agreement",
    category: "Distribution Agreements",
    description: "Independent digital music distribution terms with 85/15 revenue split, non-exclusive term, and monthly payouts.",
    summaryText: "Artist friendly distribution deal. Artist retains 100% master ownership, distributor takes 15% fee, non-exclusive territory.",
    defaultRiskScore: 18,
    fullText: `DIGITAL MUSIC DISTRIBUTION AGREEMENT

This Agreement is made by and between VELOCITY DISTRO INC. ("Distributor") and INDEPENDENT ARTIST ("Artist").

1. DISTRIBUTION RIGHTS & MASTER RETENTION
Artist grants Distributor the non-exclusive right to distribute, stream, and monetize Artist's master sound recordings to digital service providers (Spotify, Apple Music, Amazon, YouTube, TikTok). Artist retains 100% sole ownership of all master recordings and copyrights.

2. FEES & REVENUE SHARE
Distributor shall pay Artist eighty-five percent (85%) of Net Receipts collected from digital service providers. Distributor shall retain a fifteen percent (15%) distribution fee.

3. TERM & TERMINATION
This Agreement shall run on a month-to-month basis. Artist may terminate distribution and request takedown of master recordings at any time upon thirty (30) days written notice without penalty.`,
    analysis: {
      title: "Digital Music Distribution Agreement Analysis",
      dealType: "DIY Distribution Agreement",
      riskScore: 18,
      summary: "Highly artist-friendly deal. You retain 100% of master ownership and can cancel and remove your music anytime with 30 days notice.",
      plainEnglishTranslation: "You keep full ownership of your songs. Distributor delivers your tracks to Spotify and Apple Music, takes a 15% service fee, and gives you 85% of royalties every month.",
      keyTerms: [
        { term: "Master Ownership", value: "100% Artist Retained", impact: "You own all copyrights completely." },
        { term: "Revenue Split", value: "85% Artist / 15% Distro", impact: "Clear, predictable percentage fee." },
        { term: "Term", value: "Month-to-Month (30 day takedown)", impact: "Full freedom to leave whenever you want." }
      ],
      redFlags: [],
      fairTerms: [
        {
          clause: "Section 1: 100% Ownership Retention",
          explanation: "Artist retains complete copyright and master ownership."
        },
        {
          clause: "Section 3: Flexible Termination",
          explanation: "Allows 30-day takedown request with zero penalty or exit fees."
        }
      ],
      questionsForAttorney: [
        "Are YouTube Content ID and TikTok monetization included in the 15% distribution fee?",
        "Is there an upfront annual fee per single/album or solely commission-based?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 85,
        labelShareRate: 0,
        advanceAmount: 0,
        distributionFeeRate: 15
      }
    }
  }
];
