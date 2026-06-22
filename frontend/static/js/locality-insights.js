// Static locality insights — collected city by city
// Sources: 99acres, MagicBricks, Google Maps, JLL, Anarock, Knight Frank research
// Day 1 (2026-06-17): Hyderabad

const LOCALITY_INSIGHTS = {

  'Hyderabad': {
    'Gachibowli': {
      overview: 'Gachibowli is Hyderabad\'s primary IT and BFSI hub anchored by the HITEC City–Gachibowli corridor, home to some of the largest global tech campuses in India. Real estate here commands a premium driven by high white-collar employment density and proximity to Financial District. Prices have appreciated consistently over the past decade with strong rental demand year-round.',
      specialties: ['IT & BFSI office hub', 'Large tech campuses', 'Luxury apartments', 'Stadium & sports precinct', 'Outer Ring Road access'],
      major_employers: ['Microsoft', 'Google', 'Amazon', 'Deloitte', 'ICICI Prudential'],
      schools: [
        { name: 'Oakridge International School', type: 'IB/CBSE', note: 'Top-rated international school' },
        { name: 'Delhi Public School (DPS)', type: 'CBSE', note: 'Established CBSE school nearby' },
        { name: 'Johnson Grammar School', type: 'CBSE', note: 'Well-regarded local CBSE school' },
      ],
      traffic: {
        peak_hours: 'Heavy congestion 8–10 am and 6–9 pm on ISB Road and Gachibowli Main Road',
        metro_access: 'Raidurg Metro Station (Blue Line) — 1.5 km',
        highway_access: 'Outer Ring Road (ORR) access at Gachibowli flyover — 1 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['KIMS Hospital (3 km)', 'Apollo Spectra (2.5 km)', 'Care Hospital Banjara Hills (6 km)'],
        malls: ['Inorbit Mall (2 km)', 'Sarath City Capital Mall (4 km)', 'Forum Sujana Mall (5 km)'],
        parks: ['Gachibowli Stadium grounds', 'Telangana Tourism Park (2 km)'],
      },
      investment_note: 'Gachibowli remains one of Hyderabad\'s strongest investment micro-markets with consistent 9–11% appreciation, driven by large tech campuses and limited new residential supply. Rental yields are among the highest in the city at 6–7% gross.',
    },

    'Hitech City': {
      overview: 'HITEC City (Hyderabad Information Technology Engineering Consultancy City) is the original tech nucleus of Cyberabad, housing iconic campuses of global IT giants since the late 1990s. It blends dense office towers with co-working spaces, malls, and mid-premium residential pockets. High walkability within the precinct and metro connectivity make it a perennial rental favourite.',
      specialties: ['IT park cluster', 'Co-working & startup ecosystem', 'Metro connectivity', 'F&B & entertainment zone', 'Mixed-use precinct'],
      major_employers: ['Wipro', 'Infosys', 'Salesforce', 'CA Technologies', 'Qualcomm'],
      schools: [
        { name: 'Bhashyam Public School', type: 'CBSE', note: 'Competitive coaching-oriented school' },
        { name: 'Meridian School', type: 'CBSE', note: 'Well-rounded school with strong academics' },
      ],
      traffic: {
        peak_hours: 'Very congested 8:30–10 am and 6:30–9 pm; bottlenecks at HITEC City main junction',
        metro_access: 'HITEC City Metro Station (Blue Line) — on-site',
        highway_access: 'ORR via Raidurg exit — 2 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Care Hospital Hi-Tech City (1 km)', 'Sunshine Hospital (3 km)', 'Medicover Hospital (4 km)'],
        malls: ['Inorbit Mall (1 km)', 'Cyber Towers Plaza (0.5 km)', 'The V Mall (2 km)'],
        parks: ['Durgam Cheruvu lakeside (1.5 km)', 'Botanical Garden (2 km)'],
      },
      investment_note: 'HITEC City carries a slight premium but offers the best tenant demand in Hyderabad — vacancy stays below 5% for 2BHK apartments. Appreciation is steady at 9–10% p.a. with infrastructure already mature.',
    },

    'Financial District': {
      overview: 'Financial District (Nanakramguda) has emerged as Hyderabad\'s premier BFSI and global captive centre hub, housing marquee towers for HSBC, Franklin Templeton, and Accenture. It commands the highest office rents in the city and the residential market is predominantly ultra-premium. Fast appreciation and very low vacancy define this micro-market.',
      specialties: ['Global captive centres', 'BFSI hub', 'Ultra-premium residential', 'Nanakramguda spine', 'Trophy office towers'],
      major_employers: ['HSBC GCC', 'Franklin Templeton', 'Accenture', 'Bank of America', 'UBS'],
      schools: [
        { name: 'Oakridge International School', type: 'IB', note: '5 min drive, top IB school' },
        { name: 'Indus International School', type: 'IB/IGCSE', note: 'Premium international curriculum' },
      ],
      traffic: {
        peak_hours: 'Moderate–high 8–10 am and 6–9 pm on Nanakramguda Road; improving with ORR access',
        metro_access: 'Raidurg Metro — 2.5 km; Financial District dedicated station proposed',
        highway_access: 'ORR via Gachibowli junction — 1.5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['KIMS Hospital (4 km)', 'Apollo Spectra Gachibowli (3 km)', 'Continental Hospital (5 km)'],
        malls: ['Inorbit Mall (3 km)', 'Sarath City Capital Mall (5 km)'],
        parks: ['Durgam Cheruvu (2 km)', 'Nanakramguda Lake walkway'],
      },
      investment_note: 'Financial District is Hyderabad\'s fastest-appreciating residential micro-market at 10–12% p.a. due to acute undersupply of housing near top-tier office clusters. Ideal for long-term capital appreciation plays.',
    },

    'Narsingi': {
      overview: 'Narsingi sits on the southern fringe of the Financial District corridor and is experiencing rapid transformation from farmland to high-density residential township. It offers more affordable entry points than Gachibowli while benefitting from the same employment catchment. Large plotted development and gated communities are the dominant typology.',
      specialties: ['Emerging township zone', 'Affordable Financial District fringe', 'Large plotted layouts', 'ORR corridor', 'Low-density gated living'],
      major_employers: ['Financial District offices (10 min)', 'Gachibowli IT corridor (12 min)', 'Amazon (8 km)', 'Google (9 km)'],
      schools: [
        { name: 'Delhi Public School Nacharam', type: 'CBSE', note: 'Reputed CBSE school in the zone' },
        { name: 'Sreenidhi International School', type: 'IGCSE', note: 'International board option nearby' },
      ],
      traffic: {
        peak_hours: 'Light to moderate on Narsingi–Puppalaguda Road; heavier closer to Financial District junction',
        metro_access: 'Raidurg Metro — 5 km; bus connectivity to metro available',
        highway_access: 'ORR — 2 km; direct entry/exit',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['KIMS Hospital (7 km)', 'Sunshine Hospital (8 km)', 'Care Hospital (9 km)'],
        malls: ['Sarath City Capital Mall (7 km)', 'Inorbit Mall (8 km)'],
        parks: ['Narsingi Forest Reserve (adjacent)', 'Durgam Cheruvu (6 km)'],
      },
      investment_note: 'Narsingi is Hyderabad\'s highest-appreciation micro-market due to its positioning as the next phase of Financial District expansion. Land prices have tripled in 5 years and residential prices are on a steep upward curve with new supply rapidly being absorbed.',
    },

    'Puppalaguda': {
      overview: 'Puppalaguda is a mid-market residential pocket sandwiched between the high-end Financial District and the emerging Narsingi zone, offering good value for buyers priced out of the core Gachibowli belt. It has strong rental demand from mid-level IT employees and is well-connected via the Outer Ring Road. Quality of new residential launches has improved significantly since 2020.',
      specialties: ['Mid-market Financial District fringe', 'High IT worker density', 'Affordable gated communities', 'ORR access', 'Quiet residential pockets'],
      major_employers: ['Financial District (5 km)', 'Gachibowli IT hub (7 km)', 'Wipro campus (8 km)'],
      schools: [
        { name: 'Kendriya Vidyalaya', type: 'CBSE', note: 'Central government school, high quality' },
        { name: 'Bhashyam Concept School', type: 'CBSE', note: 'Known for academic rigour' },
      ],
      traffic: {
        peak_hours: 'Moderate traffic on Puppalaguda–Narsingi Road; eases after 9 am and before 6 pm',
        metro_access: 'Raidurg Metro — 4 km',
        highway_access: 'ORR — 1.5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Rainbow Children\'s Hospital (6 km)', 'KIMS Hospital (8 km)'],
        malls: ['Sarath City Capital Mall (6 km)', 'Forum Mall (8 km)'],
        parks: ['Necklace Road (12 km)', 'Local community parks'],
      },
      investment_note: 'Puppalaguda offers the best value-for-money access to the Hyderabad IT belt at 10–11% appreciation, with lower base prices than Gachibowli. Rental yields are strong at 6.5–7% making it a solid income + appreciation play.',
    },

    'Madhapur': {
      overview: 'Madhapur is the commercial heart of Cyberabad, home to the original Cyber Towers and a dense mix of IT campuses, restaurants, pubs, and mid-premium apartments. It sits between HITEC City and Jubilee Hills making it one of the best-connected localities in Hyderabad. The residential market caters primarily to working professionals seeking walkability to their offices.',
      specialties: ['Cyberabad commercial core', 'IT campus belt', 'Vibrant nightlife & F&B', 'Walkable to work', 'Mid-premium apartments'],
      major_employers: ['Cyber Towers tenants', 'Honeywell', 'Computer Sciences Corp', 'Novartis', 'iGate'],
      schools: [
        { name: 'Gitanjali Devashray', type: 'CBSE', note: 'Well-rated CBSE school in Madhapur' },
        { name: 'Little Flower High School', type: 'State/CBSE', note: 'Long-established school' },
      ],
      traffic: {
        peak_hours: 'Very congested 8:30–10 am and 7–9 pm on Madhapur Main Road and Cyber Hills junction',
        metro_access: 'Durgam Cheruvu Metro Station — 0.8 km',
        highway_access: 'ORR via Raidurg — 3 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Care Hospital Hi-Tech City (2 km)', 'Yashoda Hospital (4 km)'],
        malls: ['Inorbit Mall (1.5 km)', 'Central Mall (3 km)'],
        parks: ['Durgam Cheruvu (1 km)', 'KBR Park (3 km)'],
      },
      investment_note: 'Madhapur offers premium rentals due to its walkability to IT campuses; a 2BHK typically fetches ₹35,000–50,000/mo. Appreciation at 9–10% p.a. is reliable but capital values are high, compressing yield slightly to 5.5–6.5%.',
    },

    'Kondapur': {
      overview: 'Kondapur is a large, well-established residential suburb on Hyderabad\'s western corridor, popular with mid-to-senior IT professionals seeking more space and lower prices than Madhapur or Gachibowli. It has a mature social infrastructure with good schools and hospitals, and benefits from the metro Blue Line running through it. The locality is predominantly apartment-driven with a mix of old buildings and new launches.',
      specialties: ['Established western suburb', 'Metro connectivity', 'Large apartment stock', 'Mid-premium family zone', 'Close to ORR'],
      major_employers: ['Gachibowli IT offices (7 km)', 'HITEC City (5 km)', 'Wipro Gachibowli (7 km)'],
      schools: [
        { name: 'Delhi Public School Nacharam', type: 'CBSE', note: 'High-demand CBSE school' },
        { name: 'Chirec International School', type: 'CBSE/Cambridge', note: 'International curriculum school' },
        { name: 'Global Edge School', type: 'CBSE', note: 'Good academic track record' },
      ],
      traffic: {
        peak_hours: 'Moderate to high on Kondapur Main Road; Kothaguda junction is a key bottleneck',
        metro_access: 'Kothaguda Metro Station (Blue Line) — 1 km',
        highway_access: 'ORR via Gachibowli — 4 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Sunshine Hospital Kondapur (1.5 km)', 'Apollo Spectra (4 km)', 'Medicover (5 km)'],
        malls: ['Sarath City Capital Mall (4 km)', 'Nexus Shantiniketan (6 km)'],
        parks: ['Kondapur community park', 'Kothaguda Park (1 km)'],
      },
      investment_note: 'Kondapur offers a balanced investment with a 10-year average appreciation of ~9.3% p.a. (CAGR) and 5.5–6% rental yield — entry prices are lower than Gachibowli, making the yield more attractive for rental investors. The recent pace (2022–2025) has been running slightly ahead at ~10–11% driven by Hyderabad\'s overall IT corridor momentum. Metro Blue Line connectivity has been a sustained value driver since 2018.',
    },

    'Miyapur': {
      overview: 'Miyapur is a large, affordable western suburb that serves as a transit gateway with Metro Phase 1 terminus at one end. It has high absorption of budget 2BHK apartments and attracts first-time buyers and young IT workers. Infrastructure has improved significantly since metro arrival and the area benefits from proximity to the Chandanagar IT belt.',
      specialties: ['Metro Phase 1 terminus', 'Affordable entry point', 'Large inventory', 'Chandanagar IT spillover', 'Budget-friendly suburb'],
      major_employers: ['Mindspace Business Park (8 km)', 'DLF Cybercity (10 km)', 'Hitech City offices (12 km)'],
      schools: [
        { name: 'Samsara Academy', type: 'CBSE', note: 'Popular CBSE school in the area' },
        { name: 'Sri Chaitanya School', type: 'CBSE', note: 'Strong competitive exam coaching' },
        { name: 'Narayana School', type: 'CBSE', note: 'Known for CBSE and entrance prep' },
      ],
      traffic: {
        peak_hours: 'Heavy traffic 8–10 am and 6:30–9 pm near Miyapur Metro and Allwyn X-Roads',
        metro_access: 'Miyapur Metro Station (Blue Line) — terminus, direct',
        highway_access: 'NH-65 (Hyderabad–Pune) — 3 km; ORR access via Patancheru — 5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Vijaya Hospital Miyapur (1 km)', 'Rainbow Hospital (6 km)', 'KIMS Hospital (10 km)'],
        malls: ['Manjeera Mall (2 km)', 'GSM Mall (4 km)'],
        parks: ['Botanical Garden (5 km)', 'Miyapur Lake Park'],
      },
      investment_note: 'Miyapur is an affordable growth zone with metro-boosted appreciation of 7–8% p.a. and decent rental yields of 5–5.5%. Best suited for first-time buyers and investors targeting budget tenants in the IT segment.',
    },

    'KPHB Colony': {
      overview: 'Kukatpally Housing Board Colony (KPHB) is one of Hyderabad\'s oldest and most densely populated planned colonies, offering very affordable housing with excellent metro and road connectivity. It serves as a bedroom community for IT workers in Madhapur and HITEC City and has a large middle-class population. Rental demand is steady but margins are tight.',
      specialties: ['Oldest planned colony', 'Very affordable housing', 'Metro hub', 'Dense middle-class neighbourhood', 'Strong rental demand'],
      major_employers: ['HITEC City (10 km)', 'Madhapur offices (10 km)', 'Gachibowli (14 km)'],
      schools: [
        { name: 'Bharatiya Vidya Bhavan', type: 'CBSE', note: 'Reputed national-chain school' },
        { name: 'St. Ann\'s High School', type: 'CBSE', note: 'English-medium, well-regarded' },
        { name: 'Little Flower High School', type: 'State', note: 'Long-established institution' },
      ],
      traffic: {
        peak_hours: 'Very congested at KPHB Junction 8–10 am and 6–9 pm; one of Hyderabad\'s major traffic nodes',
        metro_access: 'KPHB Colony Metro Station (Blue Line) — on Phase 1 line',
        highway_access: 'NH-65 via Miyapur — 2 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Vijaya Diagnostics (1 km)', 'Citizens Hospital (2 km)', 'KIMS Hospital (6 km)'],
        malls: ['Manjeera Mall (1.5 km)', 'KPHB Shopping Complex (0.5 km)'],
        parks: ['KPHB Community Park', 'Durgam Cheruvu (8 km)'],
      },
      investment_note: 'KPHB offers very low entry prices and stable rental income but limited appreciation upside at 7–7.5% p.a. It suits investors seeking modest, reliable rental income rather than capital gains.',
    },

    'Manikonda': {
      overview: 'Manikonda has rapidly evolved from a village to a premium residential hub adjacent to Gachibowli, offering a quieter alternative to Madhapur with newer residential stock. It has attracted significant developer interest with large-format gated communities and premium amenities. Appreciation has been strong and closely tracks the Gachibowli corridor.',
      specialties: ['Premium Gachibowli fringe', 'Large gated communities', 'Rapid infill development', 'Young professional catchment', 'New residential stock'],
      major_employers: ['Gachibowli IT offices (5 km)', 'Financial District (8 km)', 'Amazon (7 km)'],
      schools: [
        { name: 'Oakridge International School', type: 'IB/CBSE', note: 'Close to Manikonda, top-rated' },
        { name: 'Inventure Academy', type: 'IB', note: 'IB curriculum school nearby' },
      ],
      traffic: {
        peak_hours: 'Moderate to high on Manikonda Main Road; eases with ORR use',
        metro_access: 'Raidurg Metro — 3 km',
        highway_access: 'ORR — 2 km via Gachibowli',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['KIMS Hospital (5 km)', 'Continental Hospital (4 km)', 'Sunshine Hospital (7 km)'],
        malls: ['Sarath City Capital Mall (5 km)', 'Inorbit Mall (5 km)'],
        parks: ['Manikonda Lake Park', 'Nehru Zoological Park (8 km)'],
      },
      investment_note: 'Manikonda has delivered 10–11% appreciation tracking the Gachibowli belt at 15–20% lower entry prices. Strong rental demand and improving social infrastructure make it a top mid-market investment zone in Hyderabad.',
    },

    'Banjara Hills': {
      overview: 'Banjara Hills is Hyderabad\'s most prestigious residential address, known for its tree-lined Roads (with famous Road Numbers 2, 10, 12), luxury villas, and high concentration of embassies, hospitals, and fine dining. It is a low-supply, high-demand market where most transactions involve premium HIG apartments or independent houses. Capital values are among the highest in the city.',
      specialties: ['Luxury residential address', 'Commercial-residential crossover', 'Embassy & consulate zone', 'Premium hospitality & dining', 'Low new supply'],
      major_employers: ['Nearby Somajiguda BFSI belt', 'Hyderabad Secretariat (4 km)', 'Retail & hospitality sector'],
      schools: [
        { name: 'Hyderabad Public School', type: 'CBSE/State', note: 'One of Hyderabad\'s oldest elite schools' },
        { name: 'The Shri Ram Universal School', type: 'CBSE', note: 'Premium CBSE institution' },
      ],
      traffic: {
        peak_hours: 'Moderate on Roads 1–12; Panjagutta intersection gets very congested 9–11 am',
        metro_access: 'Panjagutta Metro (Blue Line) — 1.5 km',
        highway_access: 'Inner Ring Road — 1 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Apollo Hospitals (1 km)', 'Yashoda Hospitals (3 km)', 'Care Hospital Banjara Hills (0.5 km)'],
        malls: ['GVK One (1 km)', 'Hyderabad Central (2 km)'],
        parks: ['KBR National Park (2 km)', 'Sanjeevaiah Park (4 km)'],
      },
      investment_note: 'Banjara Hills is a capital preservation and prestige play, not a high-yield investment. Appreciation is 7–8.5% p.a. but base prices are very high. Rental yields are modest at 3–4% but tenant quality is premium. Best for HNI long-term holders.',
    },

    'Jubilee Hills': {
      overview: 'Jubilee Hills is Hyderabad\'s most exclusive address, home to film stars, industrialists, and top executives in ultra-large independent houses and luxury apartments. It is an extremely low-supply micro-market with almost no new residential launches, making it one of the most price-resilient localities in South India. The area houses several premium hospitals, luxury clubs, and cultural venues.',
      specialties: ['Ultra-premium residential enclave', 'Film industry hub', 'Very low new supply', 'Luxury independent homes', 'Film Nagar adjacency'],
      major_employers: ['Hyderabad\'s leisure & entertainment sector', 'Nearby Banjara Hills BFSI', 'Panjagutta commercial belt'],
      schools: [
        { name: 'Hyderabad Public School', type: 'CBSE', note: '1 km, one of city\'s most prestigious schools' },
        { name: 'Gitanjali Devashray', type: 'CBSE', note: 'Reputed school in Madhapur vicinity' },
      ],
      traffic: {
        peak_hours: 'Moderate; Jubilee Hills check post junction can be slow 9–10 am and 7–8 pm',
        metro_access: 'Jubilee Hills Road No. 5 Metro — 1 km (Yellow Line)',
        highway_access: 'Inner Ring Road — 1.5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Apollo Hospitals Jubilee Hills (1 km)', 'Yashoda Hospital (2 km)', 'KIMS Jubilee Hills (1.5 km)'],
        malls: ['GVK One (2 km)', 'Sarath City (5 km)'],
        parks: ['KBR National Park (1 km)', 'Film Nagar Lake (1 km)'],
      },
      investment_note: 'Jubilee Hills is a store-of-value investment with 8–8.5% appreciation driven purely by scarcity. Rental yield is low (3.5–4%) but capital values rarely decline. An HNI holding play, not a cash-flow investment.',
    },

    'Kukatpally': {
      overview: 'Kukatpally is a major residential and commercial suburb on Hyderabad\'s western flank, benefitting from being an important Metro junction (Blue Line interchange) and proximity to both Madhapur IT belt and the Uppal corridor. It offers a large volume of affordable to mid-range apartments with good connectivity. The suburb is densely populated with strong middle-class demand.',
      specialties: ['Metro junction suburb', 'Transit-led appreciation', 'Dense commercial high street', 'Affordable apartments', 'ORR & NH-65 access'],
      major_employers: ['HITEC City (9 km)', 'Gachibowli (12 km)', 'Madhapur offices (10 km)'],
      schools: [
        { name: 'Narayana e-Techno School', type: 'CBSE', note: 'Strong academic performance' },
        { name: 'Silver Oaks International School', type: 'CBSE', note: 'Good infrastructure' },
        { name: 'Kendriya Vidyalaya No. 1', type: 'CBSE', note: 'Government school, high quality' },
      ],
      traffic: {
        peak_hours: 'Heavy congestion near Kukatpally Y-Junction and JNTU flyover 8–10 am and 6–9 pm',
        metro_access: 'Kukatpally Metro Station (Blue Line) — on line',
        highway_access: 'NH-65 — adjacent; ORR via Miyapur — 3 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Yashoda Hospital Somajiguda (5 km)', 'Global Hospital (4 km)', 'Medha Hospital (1 km)'],
        malls: ['Manjeera Mall (1 km)', 'V One Mall (2 km)'],
        parks: ['JNTU campus grounds (1 km)', 'Balanagar Lake Park (2 km)'],
      },
      investment_note: 'Kukatpally delivers reliable 8% appreciation and 5–5.5% rental yields at affordable prices. Metro connectivity has made it a solid mid-market rental investment with consistent tenant demand from HITEC City workers.',
    },

    'Bachupally': {
      overview: 'Bachupally is a planned township corridor on the Outer Ring Road north-west of Hyderabad, dominated by large integrated township projects from top developers. It offers good value for money with ORR connectivity enabling easy access to Gachibowli and Shamshabad. The area is predominantly family-oriented with decent social infrastructure.',
      specialties: ['ORR corridor township', 'Large plotted developments', 'Affordable family housing', 'Quiet suburban living', 'Jeedimetla industrial proximity'],
      major_employers: ['Jeedimetla Industrial Area (5 km)', 'Gachibowli via ORR (20 km)', 'Patancheru IT belt (8 km)'],
      schools: [
        { name: 'Sri Chaitanya Techno School', type: 'CBSE', note: 'Strong academic output' },
        { name: 'Narayana School Bachupally', type: 'CBSE', note: 'Local CBSE option' },
      ],
      traffic: {
        peak_hours: 'Moderate on Bachupally Main Road; ORR keeps inter-city commutes manageable',
        metro_access: 'Miyapur Metro — 6 km (bus connectivity)',
        highway_access: 'ORR — 1 km; NH-65 (Hyderabad–Pune) — 4 km',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['Vijaya Hospitals (4 km)', 'Aditya Hospital (3 km)'],
        malls: ['Manjeera Mall (8 km)', 'City Centre Mall Miyapur (7 km)'],
        parks: ['Bachupally Lake Park', 'JNTU grounds (7 km)'],
      },
      investment_note: 'Bachupally is a steady appreciation play at 7.5–8% p.a. driven by planned township completions and ORR access. Rental demand is lower than core IT zones but capital entry is much lower, making it a strong long-term value buy.',
    },

    'Kompally': {
      overview: 'Kompally is a rapidly developing north Hyderabad suburb along the ORR, historically an industrial and logistics zone that is now seeing significant residential growth as the city expands northward. Entry prices are among the lowest in the Hyderabad metro area and appreciation potential is high as infrastructure catches up. It is best suited for long-horizon investors.',
      specialties: ['North Hyderabad ORR node', 'Emerging residential suburb', 'Industrial to residential transition', 'Very affordable entry', 'Long-term appreciation play'],
      major_employers: ['Patancheru industrial corridor (12 km)', 'Jeedimetla APIIC (8 km)', 'IDA Bollaram (10 km)'],
      schools: [
        { name: 'Narayana School Kompally', type: 'CBSE', note: 'CBSE school in the area' },
        { name: 'Sri Chaitanya Junior College', type: 'State', note: 'Strong engineering entrance prep' },
      ],
      traffic: {
        peak_hours: 'Light to moderate; ORR access keeps commute times manageable outside city hours',
        metro_access: 'No direct metro; Miyapur Metro — 12 km',
        highway_access: 'ORR — 1.5 km; NH-44 (Hyderabad–Delhi) — 3 km',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['Sunrise Hospital (4 km)', 'Citizens Specialty Hospital (6 km)'],
        malls: ['GSM Mall (8 km)', 'Manjeera Mall (10 km)'],
        parks: ['Kompally Lake (local)', 'Shamirpet Lake (10 km)'],
      },
      investment_note: 'Kompally is a speculative long-term investment at 7–8% current appreciation that could accelerate significantly if the proposed metro extension and ORR development projects materialise. Very affordable entry makes the risk-reward attractive for patient investors.',
    },

    'LB Nagar': {
      overview: 'LB Nagar is the south-east metro terminus of Hyderabad\'s Blue Line, serving as a major transit hub for the affordable eastern suburbs. It is a working-class and lower-middle-class residential zone with high density, good bus connectivity, and a high street commercial belt. Property prices are among the most affordable in greater Hyderabad.',
      specialties: ['Metro SE terminus', 'Transit hub', 'Affordable housing', 'Dense commercial high street', 'Working-class neighbourhood'],
      major_employers: ['Uppal IT hub (7 km)', 'Cherlapally industrial area (8 km)', 'Nagole IT corridor (5 km)'],
      schools: [
        { name: 'Pragathi High School', type: 'State/CBSE', note: 'Well-attended local school' },
        { name: 'Narayana School', type: 'CBSE', note: 'Local branch with coaching focus' },
      ],
      traffic: {
        peak_hours: 'Heavy congestion near LB Nagar junction 8–10 am and 6:30–8:30 pm',
        metro_access: 'LB Nagar Metro Station (Blue Line) — terminus',
        highway_access: 'Outer Ring Road (south) — 4 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Vijaya Hospital (2 km)', 'Sparsh Hospital (3 km)'],
        malls: ['LB Nagar local market', 'Sarath City (12 km)'],
        parks: ['Hayatnagar Lake (5 km)'],
      },
      investment_note: 'LB Nagar suits investors with very limited budgets; appreciation at 6–7% p.a. is modest and rental yields are thin. The metro terminus provides a structural demand floor but upside is limited without major infrastructure upgrades to the area.',
    },

    'Secunderabad': {
      overview: 'Secunderabad is Hyderabad\'s twin city and home to a large Defence establishment, the historic Cantonment, and well-established residential areas. It has strong cultural and institutional roots with some of the city\'s oldest schools, clubs, and markets. Real estate is stable rather than high-growth, attracting defence families, government employees, and heritage-loving residents.',
      specialties: ['Twin-city heritage', 'Cantonment stability', 'Defence services population', 'Oldest schools and clubs', 'Railway hub'],
      major_employers: ['Defence establishments', 'Indian Railways Secunderabad Division', 'Government offices'],
      schools: [
        { name: 'St. Patrick\'s High School', type: 'State/ICSE', note: 'One of the oldest and most respected schools' },
        { name: 'Hyderabad Public School Begumpet', type: 'CBSE', note: 'Elite residential school nearby' },
        { name: 'Army Public School', type: 'CBSE', note: 'Defence-run quality school' },
      ],
      traffic: {
        peak_hours: 'Moderate throughout the day; Secunderabad Railway Station area is always busy',
        metro_access: 'Secunderabad Metro Station (Blue & Red Lines) — city\'s largest metro junction',
        highway_access: 'NH-44 (Delhi highway) — 2 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Maxcure Hospital (3 km)', 'Yashodha Hospitals Secunderabad (2 km)', 'Military Hospital (1 km)'],
        malls: ['Paradise Circle (commercial area)', 'CMR Central (3 km)'],
        parks: ['Parade Ground (1 km)', 'Hussain Sagar (4 km)'],
      },
      investment_note: 'Secunderabad is a stable, low-volatility investment at 6.5–7.5% appreciation. Rental demand is consistent from defence and government employees. Not a high-growth zone but offers security and steady income, ideal for conservative investors.',
    },

    'Ameerpet': {
      overview: 'Ameerpet is Hyderabad\'s education and coaching hub, synonymous with software training institutes that launched thousands of IT careers in the 2000s. It is centrally located, well-connected by metro (interchange station), and has a mix of old commercial buildings and newer residential towers. Rental demand is very high from students and young professionals.',
      specialties: ['Education & coaching hub', 'Metro interchange', 'IT training centre of India', 'Dense commercial zone', 'Central location'],
      major_employers: ['Training institutes cluster', 'Nearby Punjagutta commercial belt', 'HITEC City (15 km)'],
      schools: [
        { name: 'St. Alphonsa High School', type: 'CBSE', note: 'Established CBSE school' },
        { name: 'DAV Public School', type: 'CBSE', note: 'Reputed national chain school' },
      ],
      traffic: {
        peak_hours: 'Very heavy near Ameerpet junction throughout the day; metro has eased surface congestion',
        metro_access: 'Ameerpet Metro Station — interchange for Blue and Green Lines',
        highway_access: 'Inner Ring Road — 1 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Lotus Children\'s Hospital (1 km)', 'Apollo Jubilee Hills (3 km)', 'Medicover Hospital (3 km)'],
        malls: ['Hyderabad Central (2 km)', 'GVK One (3 km)'],
        parks: ['People\'s Plaza (2 km)', 'Sanjeevaiah Park (3 km)'],
      },
      investment_note: 'Ameerpet delivers steady 7% appreciation and strong 4.5–5% rental yields from its captive student and young professional population. It is primarily a rental income play rather than a capital appreciation investment.',
    },

    'Chanda Nagar': {
      overview: 'Chanda Nagar is a quiet, well-established residential suburb on the western corridor between Miyapur and Lingampally, popular with mid-income IT workers seeking affordable housing with good access to the HITEC City belt. It has a balanced mix of apartments and independent houses with decent schools and local markets.',
      specialties: ['Quiet IT worker suburb', 'Balanced supply-demand', 'Western corridor', 'Affordable mid-segment', 'Good school catchment'],
      major_employers: ['HITEC City (12 km)', 'Mindspace Business Park (10 km)', 'Gachibowli (15 km)'],
      schools: [
        { name: 'Chirec International School', type: 'CBSE/Cambridge', note: 'Well-rated international-board school' },
        { name: 'Sri Chaitanya School', type: 'CBSE', note: 'Academic-focused CBSE school' },
      ],
      traffic: {
        peak_hours: 'Moderate on Chanda Nagar Main Road; eases quickly after 10 am',
        metro_access: 'Chandanagar Metro Station (Blue Line) — 1 km',
        highway_access: 'NH-65 via Miyapur — 3 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Citizens Hospital (4 km)', 'Apollo Cradle (5 km)'],
        malls: ['Manjeera Mall (5 km)', 'GSM Mall (6 km)'],
        parks: ['Chandanagar Lake (local)', 'Miyapur public park (3 km)'],
      },
      investment_note: 'Chanda Nagar offers 7.5–8% appreciation and 4.5–5% rental yields — a solid balanced return at very affordable prices. Metro connectivity since 2017 has been a consistent appreciation driver.',
    },

    'Attapur': {
      overview: 'Attapur is a mid-market suburb on Hyderabad\'s southern fringe with direct airport access via the Nehru Outer Ring Road, making it attractive for frequent travellers and logistics workers. It is relatively affordable compared to Gachibowli and is seeing increased developer interest as RGIA airport traffic grows. The area has a mix of established residential layouts and newer gated projects.',
      specialties: ['Airport adjacency', 'Infrastructure appreciation play', 'Southern suburb', 'Affordable gated communities', 'Rajiv Gandhi International Airport corridor'],
      major_employers: ['RGIA Airport (10 km)', 'Nanakramguda BFSI (12 km)', 'Gachibowli IT offices (14 km)'],
      schools: [
        { name: 'Gowtham Model School', type: 'CBSE', note: 'Popular CBSE school in south Hyderabad' },
        { name: 'Narayana School Attapur', type: 'CBSE', note: 'Local CBSE with coaching focus' },
      ],
      traffic: {
        peak_hours: 'Light to moderate on Attapur Main Road; ORR provides fast airport connectivity',
        metro_access: 'Nearest proposed metro station — PVNR Expressway corridor (planned)',
        highway_access: 'Nehru ORR (airport highway) — 1 km',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['Aware Gleneagles Global Hospital (3 km)', 'Fernandez Hospital (5 km)'],
        malls: ['Sarath City (6 km)', 'Waverock shopping (5 km)'],
        parks: ['Rajendra Nagar Lake (4 km)', 'Nehru Zoological Park (6 km)'],
      },
      investment_note: 'Attapur is an infrastructure-driven appreciation play at 6.5–7% p.a. currently, with potential acceleration as the airport and metro proposals materialise. Low entry prices and ORR access make it worth watching for mid-term investors.',
    },
  },

  // Day 2 (2026-06-22): Bangalore
  'Bangalore': {

    'Whitefield': {
      overview: 'Whitefield is Bangalore\'s oldest and largest IT corridor, anchored by International Tech Park Bangalore (ITPB) and the EPIP Zone, and now fully connected to the city centre via the Purple Line metro (opened October 2023). Spanning over 1,000 global company campuses across multiple tech parks, it employs several hundred thousand IT professionals and commands strong residential demand year-round. The area has matured into a full township with malls, hospitals, and international schools.',
      specialties: ['Largest IT corridor in Bangalore', 'Purple Line metro connected', 'ITPB & EPIP Zone hub', 'International school belt', 'Premium gated communities'],
      major_employers: ['Infosys (285-acre campus)', 'IBM', 'TCS', 'Wipro', 'SAP Labs India', 'Oracle'],
      schools: [
        { name: 'TCIS Whitefield (The Cambridge International School)', type: 'CBSE/IB', note: 'Rank #2 Emerging School Bangalore, TOI 2024; British Council award' },
        { name: 'NPS Whitefield (National Public School)', type: 'CBSE', note: 'Part of the renowned NPS chain; strong academics' },
        { name: 'Indus International School', type: 'IB', note: '40-acre campus, full IB continuum, 33+ nationalities' },
      ],
      traffic: {
        peak_hours: 'Heavy congestion on Whitefield Main Road and Hope Farm junction 8–10 am and 6–9 pm; Old Airport Road approach also bottlenecks',
        metro_access: 'Whitefield (Kadugodi) Metro Station — Purple Line terminus — on-site; 12-station eastern extension operational since Oct 2023',
        highway_access: 'Outer Ring Road (ORR) — 3 km via Marathahalli junction; NH-648 (Old Madras Road) — 4 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Manipal Hospital Whitefield (1.5 km)', 'Columbia Asia Hospital Whitefield (2 km)', 'Narayana Multispeciality Hospital (3 km)'],
        malls: ['Phoenix Marketcity (3 km)', 'VR Bengaluru (4 km)', 'Nexus Whitefield (1 km)'],
        parks: ['ITPB lake & grounds', 'Channasandra Lake Park (2 km)'],
      },
      investment_note: 'Whitefield is among Bangalore\'s strongest investment micro-markets with 9–12% p.a. appreciation driven by metro connectivity, large tech campus demand, and limited new supply near ITPB. Rental yields are 4–5% with 2BHK rents at ₹30,000–55,000/mo. Metro access since Oct 2023 has structurally lifted prices.',
    },

    'Electronic City': {
      overview: 'Electronic City is India\'s first dedicated electronics and IT industrial park, established in 1978 and spread across 800+ acres in south Bangalore. Home to Infosys and Wipro\'s flagship campuses along with 200+ global tech firms, it houses close to 100,000 IT employees. The Yellow Line metro (R.V. Road to Bommasandra), opened August 2025, has dramatically improved city connectivity. Residential supply is large, with a mix of affordable to mid-premium apartments across Phase 1 and 2.',
      specialties: ['India\'s first IT industrial park', 'Yellow Line metro (2025)', 'Infosys & Wipro flagship campuses', '200+ tech companies', 'Affordable-to-mid residential stock'],
      major_employers: ['Infosys (Phase 1 flagship campus)', 'Wipro (Phase 1)', 'TCS', 'HCL Technologies', 'Tech Mahindra', 'Robert Bosch'],
      schools: [
        { name: 'NPS Electronic City (National Public School)', type: 'CBSE', note: 'Reputed NPS chain school serving Electronic City residents' },
        { name: 'Greenwood High International School', type: 'CBSE/IB/IGCSE', note: 'Multinational campus near Electronic City Phase 2' },
        { name: 'Sri Kumaran Children\'s Home', type: 'CBSE', note: 'Long-established CBSE school in south Bangalore' },
      ],
      traffic: {
        peak_hours: 'Very heavy on Hosur Road (NH-44) and Electronic City Flyover 8–10 am and 6–9 pm; Silk Board junction is one of Bangalore\'s worst bottlenecks',
        metro_access: 'Electronic City Metro Station — Yellow Line (opened Aug 2025); Konappana Agrahara Station also on line',
        highway_access: 'NH-44 (Bengaluru–Chennai highway) — adjacent; Elevated Expressway from Silk Board — 9.9 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Narayana Health City (3 km)', 'Fortis Hospital Bannerghatta Road (7 km)', 'Apollo Hospital Bannerghatta (8 km)'],
        malls: ['Grand Mall Electronic City (2 km)', 'Mantri Square (18 km via elevated expressway)', 'Market Square Mall (4 km)'],
        parks: ['Electronic City Phase 2 lake area', 'Begur Lake (5 km)'],
      },
      investment_note: 'Electronic City offers Bangalore\'s best rental yields at 5–6% due to large captive IT employee demand. Appreciation has been 8–10% p.a. and the 2025 Yellow Line metro opening is expected to provide a further structural uplift. Ideal for rental income investors; entry prices are lower than east Bangalore.',
    },

    'Sarjapur Road': {
      overview: 'Sarjapur Road has emerged as one of Bangalore\'s hottest residential corridors, connecting the Outer Ring Road IT belt to Electronic City and Whitefield. It benefits from a massive employment catchment — thousands of IT workers from Wipro Sarjapur Campus, Infosys, and Accenture campuses commute from here. Prices appreciated ~63% between 2021 and 2024, and residential launches have been dominated by premium large-format gated communities.',
      specialties: ['ORR-to-Electronic City connector', 'Premium gated community belt', 'Rapid 2021–2024 appreciation', 'Large township projects', 'Startup & IT professional catchment'],
      major_employers: ['Wipro Sarjapur Campus', 'Infosys Sarjapur Campus', 'Accenture Sarjapur', 'RGA Tech Park tenants', 'Cessna Business Park tenants'],
      schools: [
        { name: 'Inventure Academy', type: 'IB/IGCSE/CBSE', note: 'One of Bangalore\'s top international schools; IB and Cambridge' },
        { name: 'Oakridge International School (Sarjapur)', type: 'IB/CBSE', note: 'Premium IB school on Sarjapur Road' },
        { name: 'Candor International School', type: 'IB', note: 'Full IB continuum school serving the Sarjapur corridor' },
      ],
      traffic: {
        peak_hours: 'Very congested on Sarjapur Main Road and Carmelaram junction 8–10 am and 6:30–9 pm; bottleneck at ORR-Sarjapur Road intersection',
        metro_access: 'No metro currently; Phase 3A Silk Board–Sarjapur corridor proposed but not yet sanctioned',
        highway_access: 'Outer Ring Road — 1.5 km at Carmelaram; NH-44 via Electronic City — 8 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Sarjapur (3 km)', 'Motherhood Hospital Sarjapur (2 km)', 'Narayana Health City (10 km)'],
        malls: ['Market Square Mall Sarjapur (2 km)', 'Nexus Whitefield (10 km)', 'Forum Mall Koramangala (12 km)'],
        parks: ['Sarjapur Lake (local)', 'Carmelaram Park (2 km)'],
      },
      investment_note: 'Sarjapur Road delivered ~63% price appreciation from 2021–2024 and continues at 10–12% p.a. as new township completions absorb strong demand. No metro yet is the main risk — traffic is severe. Rental yields at 4.5–5%. Best suited for 5–7 year hold investors banking on metro announcement upside.',
    },

    'Koramangala': {
      overview: 'Koramangala is Bangalore\'s foremost startup and tech hub, home to the headquarters of Flipkart (founded here), Swiggy, and dozens of high-growth companies. It blends upscale residential blocks (1st to 8th Block) with dense commercial and F&B activity, making it one of the city\'s most vibrant and walkable neighbourhoods. Supply of new residential inventory is very limited, keeping prices firm.',
      specialties: ['Startup capital of Bangalore', 'Flipkart & Swiggy HQ zone', 'Premium F&B & nightlife', 'Low new housing supply', 'BTM & HSR Layout proximity'],
      major_employers: ['Swiggy HQ', 'Flipkart HQ (historic)', 'Myntra', 'Amazon India offices', 'Accenture (Inner Ring Road)'],
      schools: [
        { name: 'National Public School Koramangala (NPS)', type: 'CBSE', note: 'British Council International Dimension award; top NPS chain' },
        { name: 'St. Joseph\'s Boys\' High School', type: 'ICSE', note: 'Prestigious old-established Jesuit school' },
        { name: 'Ryan International School Koramangala', type: 'CBSE', note: 'Well-regarded CBSE school in the locality' },
      ],
      traffic: {
        peak_hours: 'Heavy congestion at 80 Feet Road junction and Sony World Signal 9–10:30 am and 6:30–9 pm',
        metro_access: 'Nearest: Jayanagar Metro (Green Line) — 2 km; Purple Line\'s Koramangala station under Phase 3 planning',
        highway_access: 'Outer Ring Road via Silk Board — 3 km; Inner Ring Road — 0.5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Manipal Hospital (3 km)', 'Fortis Hospital Bannerghatta (4 km)', 'Apollo Spectra (1.5 km)'],
        malls: ['Forum Mall Koramangala (0.5 km)', '1 MG Lido Mall (3 km)', 'Garuda Mall (5 km)'],
        parks: ['Agara Lake (1 km)', 'BDA Complex grounds (1 km)', 'Koramangala Indoor Stadium grounds'],
      },
      investment_note: 'Koramangala is a premium capital-preservation and rental play. Appreciation is steady at 8–9% p.a. with very limited new supply. Rental yields of 4–4.5% are moderate but tenant quality is high (startup founders, senior tech employees). Entry prices are among Bangalore\'s highest outside CBD.',
    },

    'Indiranagar': {
      overview: 'Indiranagar is Bangalore\'s most coveted urban neighbourhood — a tree-lined, well-planned area popular with expats, senior professionals, and the creative class. It combines premium residential apartments and old independent houses with Bangalore\'s best restaurant and retail strip (100 Feet Road). Blue Line metro connectivity, low new supply, and high aspirational demand keep it as one of the city\'s top price-appreciation localities.',
      specialties: ['Premium urban lifestyle address', '100 Feet Road dining & retail', 'Purple Line metro connected', 'Expat favourite', 'Very low new residential supply'],
      major_employers: ['Numerous MNC offices on nearby ORR', 'Embassy Golf Links Business Park (4 km)', 'Bagmane Tech Park (3 km)', 'HAL Aerospace (2 km)'],
      schools: [
        { name: 'NPS Indiranagar (National Public School)', type: 'CBSE', note: 'Ranked #1 CBSE school Bangalore by Times School Survey 2023–24' },
        { name: 'Baldwin Boys\' High School', type: 'ICSE', note: 'One of Bangalore\'s oldest and most prestigious schools' },
        { name: 'Frank Anthony Public School', type: 'CBSE/ICSE', note: 'Reputed Anglo-Indian school with long history' },
      ],
      traffic: {
        peak_hours: 'Moderate–high on 100 Feet Road 9–10:30 am and 7–9 pm; CMH Road can bottleneck near metro',
        metro_access: 'Indiranagar Metro Station (Purple Line) — on-site, direct',
        highway_access: 'Old Airport Road — 0.5 km; Outer Ring Road via Domlur — 3 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Yeshwanthpur (8 km)', 'Manipal Hospital HAL (2 km)', 'Apollo Spectra Koramangala (4 km)'],
        malls: ['1 MG Lido Mall (1.5 km)', 'Garuda Mall (4 km)', 'Orion Mall (8 km)'],
        parks: ['Indiranagar Water Tank Park', 'Ulsoor Lake (2 km)', 'Cubbon Park (5 km)'],
      },
      investment_note: 'Indiranagar is Bangalore\'s scarcest residential micro-market — almost no new launches — making it a pure capital appreciation and prestige hold at 9–11% p.a. Rental yields at 3.5–4.5% are modest but tenant quality is exceptional. Best for long-term HNI or expat-targeting investors.',
    },

    'HSR Layout': {
      overview: 'HSR Layout (Hosur-Sarjapur Road Layout) has transformed from a quiet BDA township into Bangalore\'s secondary startup and tech hub. It sits at the intersection of the Outer Ring Road IT belt and Koramangala, making it a top address for mid-to-senior tech professionals who want proximity to work without the density of Koramangala or Indiranagar. Residential stock ranges from old BDA plots to new premium apartments.',
      specialties: ['ORR-Koramangala crossroads', 'Secondary startup hub', 'Mid-senior IT professional zone', 'Well-planned BDA layout', 'Growing café & co-working culture'],
      major_employers: ['Flipkart office', 'Samsung R&D (ORR)', 'Oracle India (ORR)', 'Texas Instruments (Bannerghatta Road)', 'Tesco Technology Centre'],
      schools: [
        { name: 'National Public School HSR Layout', type: 'CBSE', note: 'Well-regarded NPS chain school in the locality' },
        { name: 'Delhi Public School South Bangalore', type: 'CBSE', note: 'Large DPS campus serving south Bangalore' },
        { name: 'Harvest International School', type: 'IGCSE', note: 'IGCSE school in HSR serving expat families' },
      ],
      traffic: {
        peak_hours: 'Moderate to high on BDA Complex Road and Agara Junction 8:30–10 am and 6:30–9 pm; ORR onramp is the key bottleneck',
        metro_access: 'Agara (HSR) station on Purple Line Phase 2 under construction; Silk Board station (Purple Line) — 2 km currently',
        highway_access: 'Outer Ring Road — 1 km; Hosur Road (NH-44) via Silk Board — 3 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Fortis Hospital Bannerghatta Road (4 km)', 'Apollo Spectra Koramangala (3 km)', 'Narayana Health City (8 km)'],
        malls: ['Forum Mall Koramangala (3 km)', 'Market Square Mall (5 km)', 'Soul Space Arena (4 km)'],
        parks: ['Agara Lake (1 km)', 'Kudlu Gate Park (2 km)'],
      },
      investment_note: 'HSR Layout delivers 9–11% appreciation with strong rental demand from ORR IT corridor workers. Rental yields at 4.5–5% make it one of Bangalore\'s better balanced investment localities. Metro Phase 2 construction at Agara is a near-term value catalyst expected to lift prices upon completion.',
    },

    'Bellandur': {
      overview: 'Bellandur is a mid-market residential locality on Bangalore\'s eastern Outer Ring Road corridor, wedged between Sarjapur Road and Marathahalli. It has seen approximately 78% price appreciation in three years driven by proximity to the ORR IT belt and upcoming metro connectivity. Large gated apartment complexes dominate the landscape, catering primarily to mid-level IT professionals.',
      specialties: ['ORR mid-corridor residential', '78% 3-year appreciation', 'Large apartment complexes', 'Proximity to Sarjapur & Marathahalli IT hubs', 'Metro Phase 2 pipeline'],
      major_employers: ['Cessna Business Park tenants (1 km)', 'RGA Tech Park (2 km)', 'Wipro Sarjapur (4 km)', 'IBM Manyata & RMZ offices (ORR)', 'Prestige Tech Park (3 km)'],
      schools: [
        { name: 'NPS Bellandur (National Public School)', type: 'CBSE', note: 'NPS chain; popular with IT families in the area' },
        { name: 'DPS Whitefield (via Sarjapur)', type: 'CBSE', note: 'Large DPS campus accessible from Bellandur' },
      ],
      traffic: {
        peak_hours: 'Very heavy on Bellandur-Sarjapur Road and ORR service road 8–10 am and 6–9 pm; Bellandur lake junction is a chronic bottleneck',
        metro_access: 'Bellandur station on Phase 2 ORR corridor (Purple Line extension) — under construction; Silk Board (Purple Line) — 4 km currently',
        highway_access: 'Outer Ring Road — adjacent; NH-44 via Silk Board — 5 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Sarjapur (3 km)', 'Apollo Spectra Koramangala (6 km)', 'Sakra World Hospital (5 km)'],
        malls: ['Market Square Mall (2 km)', 'Forum Mall Koramangala (7 km)', 'Phoenix Marketcity Whitefield (8 km)'],
        parks: ['Bellandur Lake walkway (local)', 'Eco Space Business Park greens'],
      },
      investment_note: 'Bellandur has delivered exceptional 3-year returns (~78% price increase) and continues at 10–12% p.a. The upcoming metro on the ORR corridor is expected to be a strong price catalyst. Rental yields at 4.5–5%. High traffic is the main livability risk but most residents are car-dependent IT commuters.',
    },

    'Marathahalli': {
      overview: 'Marathahalli is a densely populated mid-market residential and commercial suburb on Bangalore\'s eastern Outer Ring Road, serving as one of the primary bedroom communities for the vast ORR and Whitefield IT belt. It has a large retail and service economy, affordable to mid-range apartment stock, and high rental demand from IT professionals at various salary levels. Connectivity to both Whitefield and Koramangala via ORR is a structural advantage.',
      specialties: ['ORR eastern residential hub', 'High IT worker density', 'Affordable-to-mid apartments', 'Retail & service hub', 'KR Puram rail & Purple Line access'],
      major_employers: ['Bagmane Tech Park (3 km)', 'RMZ Ecoworld (4 km)', 'International Tech Park Whitefield (6 km)', 'Wipro Sarjapur Campus (8 km)', 'Embassy Tech Village (5 km)'],
      schools: [
        { name: 'NPS Marathahalli (National Public School)', type: 'CBSE', note: 'Well-regarded NPS school; strong academic programme' },
        { name: 'Delhi Public School Bangalore East', type: 'CBSE', note: 'DPS serving east Bangalore IT families' },
        { name: 'Ryan International School Marathahalli', type: 'CBSE', note: 'Known for balanced academics and co-curriculars' },
      ],
      traffic: {
        peak_hours: 'Very heavy congestion on ORR and Marathahalli Bridge 8–10 am and 6:30–9 pm; one of Bangalore\'s most congested junctions',
        metro_access: 'KR Puram Metro Station (Purple Line) — 3 km; Marathahalli station proposed in Phase 2 ORR corridor',
        highway_access: 'Outer Ring Road — adjacent; Old Airport Road — 1 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Manipal Hospital Whitefield (4 km)', 'Columbia Asia Hospital Marathahalli (1 km)', 'Sakra World Hospital (3 km)'],
        malls: ['Phoenix Marketcity (4 km)', 'Innovative Multiplex (2 km)', 'VR Bengaluru (5 km)'],
        parks: ['Krishnarajapura Lake (3 km)', 'Bagmane Tech Park lake area'],
      },
      investment_note: 'Marathahalli offers solid 8–10% appreciation and strong 5–5.5% rental yields at mid-range entry prices — making it one of Bangalore\'s better rental income localities. Metro Phase 2 extension on the ORR will be a significant upside trigger. Best for investors targeting mid-income IT tenants.',
    },

    'Hebbal': {
      overview: 'Hebbal is north Bangalore\'s premier residential and commercial gateway, anchored by Manyata Tech Park — one of Bangalore\'s largest IT office parks. It sits at the confluence of NH-44 (Bengaluru–Delhi highway) and Bellary Road, offering superb airport access (15 minutes). Residential demand is driven by Manyata Tech Park employees and families seeking north Bangalore\'s relatively lower density and cleaner air.',
      specialties: ['Manyata Tech Park gateway', 'Airport highway corridor', 'North Bangalore\'s prime address', 'ORR access', 'Emerging luxury residential'],
      major_employers: ['Manyata Tech Park tenants (IBM, Cognizant, Philips, Accenture, Target)', 'Embassy Manyata Business Park', 'Kirloskar Business Park (2 km)'],
      schools: [
        { name: 'Ryan International School Hebbal', type: 'CBSE', note: 'Well-attended CBSE school serving north Bangalore' },
        { name: 'NPS Yeshwanthpur (National Public School)', type: 'CBSE', note: 'Reputed NPS school accessible from Hebbal' },
        { name: 'The International School Bangalore (TISB)', type: 'IB/IGCSE', note: 'Top IB school in north Bangalore, 40-acre campus' },
      ],
      traffic: {
        peak_hours: 'Moderate–heavy near Hebbal Flyover and Manyata junction 8:30–10 am and 6–8 pm; airport road generally free-flowing after 10 am',
        metro_access: 'Proposed Airport Line (Blue Line Phase 3) to pass through Hebbal; no metro currently operational in the area',
        highway_access: 'NH-44 (Bangalore–Delhi) — adjacent; Bellary Road (Airport Road) — adjacent; Bangalore International Airport — 25 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Yeshwanthpur (5 km)', 'Fortis Hospital Bannerghatta (12 km)', 'Baptist Hospital Bellary Road (4 km)'],
        malls: ['Orion Mall (5 km)', 'Elements Mall (2 km)', 'Esteem Mall (4 km)'],
        parks: ['Hebbal Lake (1 km)', 'Lumbini Gardens (2 km)'],
      },
      investment_note: 'Hebbal delivers strong 10–12% appreciation backed by Manyata Tech Park\'s massive employment base. Rental yields at 4.5–5% are solid. Airport corridor positioning makes it attractive for executives and expats. Proposed Airport Metro Line will be a major price catalyst when confirmed and built.',
    },

    'Yelahanka': {
      overview: 'Yelahanka is a rapidly growing north Bangalore suburb along the Bengaluru–Hyderabad highway, historically a quiet military town that is now seeing significant IT and residential expansion. It offers clean air, larger plot sizes, and more affordable prices than inner north Bangalore localities. The proposed High-Speed Rail station and HAL Aerospace presence add long-term infrastructure upside.',
      specialties: ['Affordable north Bangalore', 'HAL & defence establishment proximity', 'ORR north corridor', 'Airport access zone', 'Proposed HSR station'],
      major_employers: ['HAL (Hindustan Aeronautics Limited)', 'Bharath Electronics Ltd (BEL) Jalahalli (10 km)', 'GKVK campus', 'Philips Innovation Campus (Yelahanka)', 'Air Force Station Yelahanka'],
      schools: [
        { name: 'Air Force School Yelahanka', type: 'CBSE', note: 'Defence-run CBSE school, high quality' },
        { name: 'DPS Yelahanka (Delhi Public School)', type: 'CBSE', note: 'Well-regarded DPS campus in north Bangalore' },
        { name: 'Kendriya Vidyalaya Yelahanka', type: 'CBSE', note: 'Central government school serving HAL/Air Force families' },
      ],
      traffic: {
        peak_hours: 'Light to moderate on NH-44 (Bellary Road) except near Yelahanka new town junction; low internal congestion',
        metro_access: 'No metro currently; Green Line extends to Madavara; proposed Phase 3 extension northward to Yelahanka',
        highway_access: 'NH-44 (Bengaluru–Hyderabad) — adjacent; Bangalore International Airport — 18 km; ORR — 6 km',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Yeshwanthpur (12 km)', 'Baptist Hospital (12 km)', 'Air Force Hospital (local)'],
        malls: ['Elements Mall Thanisandra (8 km)', 'Orion Mall (10 km)'],
        parks: ['Yelahanka Lake Park', 'Hebbala Valley Park (4 km)'],
      },
      investment_note: 'Yelahanka offers affordable entry with 7–9% appreciation, driven by northward city expansion and airport corridor demand. Rental yields are modest at 4–4.5% but entry prices are low. Metro extension and HSR station proposals are speculative but high-upside catalysts. Best for 7–10 year horizon investors.',
    },

    'JP Nagar': {
      overview: 'JP Nagar (Jayanagara Professional Quarter) is a large, well-established south Bangalore residential township developed by BDA in the 1980s, spread across 9 phases. It is predominantly owner-occupied by middle-class and upper-middle-class Bangalorean families. The Green Line metro now runs through JP Nagar, significantly improving connectivity. The locality has a mature social fabric with good schools, hospitals, and parks.',
      specialties: ['Large BDA planned township', 'Green Line metro served', 'Established south Bangalore family zone', 'Mid-market to premium residential', 'Low commercial clutter'],
      major_employers: ['NIMHANS (National Institute of Mental Health)', 'Bannerghatta Road IT belt (5 km)', 'Electronics City (12 km)', 'Central Government offices (nearby)'],
      schools: [
        { name: 'National Public School JP Nagar', type: 'CBSE', note: 'NPS chain, very high demand; competitive admissions' },
        { name: 'Sri Sri Ravishankar Vidya Mandir', type: 'CBSE', note: 'Popular CBSE school with strong academics and values programme' },
        { name: 'Vijaya High School', type: 'State/CBSE', note: 'Old-established Bangalore school, strong academic record' },
      ],
      traffic: {
        peak_hours: 'Moderate on 15th Cross Road and Bannerghatta Road intersection; JP Nagar 4th Phase junction can congest during peak hours',
        metro_access: 'JP Nagar Metro Station (Green Line) — operational; multiple stations across JP Nagar phases',
        highway_access: 'Bannerghatta Road — 1 km; Outer Ring Road via Silk Board — 5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Fortis Hospital Bannerghatta Road (3 km)', 'Apollo BGS Hospital (4 km)', 'NIMHANS (1 km)'],
        malls: ['Gopalan Innovation Mall (2 km)', 'Vega City Mall (3 km)', 'Mantri Mall Malleswaram (8 km)'],
        parks: ['Puttenahalli Lake (2 km)', 'Geddalahalli Lake Park (3 km)'],
      },
      investment_note: 'JP Nagar delivers steady 8–9% appreciation with Green Line metro providing a sustained demand floor. Rental yields at 4–4.5% are moderate — it is more an owner-occupation and resale play than a rental income investment. Scarcity of new launches in the mature township keeps prices firm.',
    },

    'Bannerghatta Road': {
      overview: 'Bannerghatta Road is a 20 km residential and commercial corridor stretching south from BTM Layout to the Bannerghatta National Park. It has established IT campuses from Texas Instruments, Accenture, and HP, and a strong mid-to-premium residential market with good schools and hospitals. The southern proximity to the National Park gives parts of the corridor a greener character than most Bangalore localities.',
      specialties: ['South Bangalore IT corridor', 'Texas Instruments & HP campus belt', 'Proximity to Bannerghatta National Park', 'Mid-premium residential', 'Green Line metro extension planned'],
      major_employers: ['Texas Instruments India HQ', 'Hewlett Packard (HP)', 'Accenture', 'IBM', 'Biocon & pharma cluster (nearby)'],
      schools: [
        { name: 'The International School Bangalore (TISB)', type: 'IB/IGCSE', note: '40-acre international school campus; top IB institution in south Bangalore' },
        { name: 'Greenwood High International School', type: 'CBSE/IB/IGCSE', note: 'Multiple campuses; strong academic reputation' },
        { name: 'Bethany High School', type: 'ICSE', note: 'Well-established ICSE school, respected in south Bangalore' },
      ],
      traffic: {
        peak_hours: 'Moderate–high on Bannerghatta Road near JP Nagar junction and Arekere; Bommanahalli junction is a key bottleneck',
        metro_access: 'Yellow Line (R.V. Road–Bommasandra) passes through Bannerghatta Road corridor; Bommasandra terminus operational Aug 2025',
        highway_access: 'Outer Ring Road via Silk Board — 5 km; NICE Road — 3 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Fortis Hospital Bannerghatta (on road)', 'Apollo BGS Hospital (3 km)', 'Narayana Health City (5 km)'],
        malls: ['Vega City Mall (2 km)', 'Gopalan Innovation Mall (3 km)'],
        parks: ['Bannerghatta National Park (8 km)', 'Arekere Lake Park (2 km)'],
      },
      investment_note: 'Bannerghatta Road offers balanced 8–10% appreciation with Yellow Line metro connectivity from 2025 providing a structural boost. Rental yields at 4.5–5% are supported by Texas Instruments and HP employee demand. The greener environment and IT campus proximity make it a good family investment.',
    },

    'Brookefield': {
      overview: 'Brookefield (also written Brookfield) is a mid-premium residential locality in east Bangalore adjacent to Whitefield\'s ITPB, offering more affordable prices than Whitefield while sharing its IT catchment. It has good access to the Purple Line metro via KR Puram and a mix of independent houses, gated communities, and apartment blocks. Popular with mid-level IT professionals who want proximity to the Whitefield belt without peak Whitefield prices.',
      specialties: ['Whitefield fringe at lower prices', 'ITPB & Bagmane Tech Park proximity', 'Purple Line metro access via KR Puram', 'Mix of old houses & new apartments', 'Mid-premium IT professional zone'],
      major_employers: ['ITPB tenants (Oracle, IBM, TCS) — 1 km', 'Bagmane Tech Park (2 km)', 'Kalyani Tech Park (2 km)', 'Manyata Tech Park (15 km via ORR)'],
      schools: [
        { name: 'NPS ITPL (National Public School)', type: 'CBSE', note: 'NPS chain school near ITPB, popular with IT families' },
        { name: 'Delhi Public School Bangalore East', type: 'CBSE', note: 'Large DPS campus serving east Bangalore' },
        { name: 'Ryan International School ITPL', type: 'CBSE', note: 'Well-attended CBSE school near Brookefield' },
      ],
      traffic: {
        peak_hours: 'Heavy at Tin Factory junction and KR Puram Bridge 8–10 am and 6–9 pm; Hope Farm flyover approach also congested',
        metro_access: 'KR Puram Metro Station (Purple Line) — 2 km; Hoodi Station (Purple Line) — 1.5 km',
        highway_access: 'Old Airport Road — 1 km; Outer Ring Road — 3 km via KR Puram',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Whitefield (3 km)', 'Manipal Hospital Whitefield (3 km)', 'Narayana Multispeciality (4 km)'],
        malls: ['Phoenix Marketcity (4 km)', 'VR Bengaluru (5 km)', 'Forum Value Mall (2 km)'],
        parks: ['Hoodi Lake (1 km)', 'Channasandra Lake (2 km)'],
      },
      investment_note: 'Brookefield is an affordable entry into the Whitefield IT catchment at 8–10% appreciation. Rental yields at 4.5–5% with 2BHK rents of ₹22,000–38,000/mo. Purple Line metro at KR Puram and Hoodi has been a consistent price driver since 2023. Good value-for-money play in east Bangalore.',
    },

    'BTM Layout': {
      overview: 'BTM Layout (Bangalore–Tumkur–Mysore Layout) is an affordable, dense residential suburb in south Bangalore popular with young IT professionals and students. It offers budget apartments at prices well below Koramangala or HSR Layout while sharing similar proximity to the Outer Ring Road IT belt. Koramangala and HSR Layout are within 3 km, making it a popular first-home or rental investment zone.',
      specialties: ['Affordable south Bangalore', 'Young IT professional hub', 'ORR & Koramangala proximity', 'High rental demand', 'Budget-friendly apartments'],
      major_employers: ['ORR IT belt (Wipro, Flipkart, Samsung — 3 km)', 'Koramangala startup offices (3 km)', 'Electronic City (12 km)', 'NICE Road tech parks (5 km)'],
      schools: [
        { name: 'Little Kingdom School', type: 'CBSE', note: 'Popular CBSE school in BTM serving families' },
        { name: 'Ryan International School Bannerghatta', type: 'CBSE', note: 'Accessible from BTM Layout' },
      ],
      traffic: {
        peak_hours: 'Heavy at BTM Layout 2nd Stage junction and Silk Board underpass approach 8:30–10 am and 6:30–9 pm',
        metro_access: 'BTM Layout Station proposed on Phase 3 Kalena Agrahara corridor; Silk Board (Purple Line) — 1.5 km currently',
        highway_access: 'Outer Ring Road via Silk Board — 2 km; Hosur Road (NH-44) — 3 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Fortis Hospital Bannerghatta Road (4 km)', 'Apollo Spectra Koramangala (3 km)', 'Sparsh Hospital (3 km)'],
        malls: ['Forum Mall Koramangala (3 km)', 'Market Square Mall (5 km)', 'Vega City Mall (5 km)'],
        parks: ['Madiwala Lake (2 km)', 'Agara Lake (2 km)'],
      },
      investment_note: 'BTM Layout is primarily a rental income play with 5–5.5% gross yields driven by high demand from IT and startup workers. Capital appreciation at 7–8% p.a. is steady but moderate. Very affordable entry prices make it accessible to first-time investors. Silk Board metro proximity is the key value anchor.',
    },

    'Jayanagar': {
      overview: 'Jayanagar is one of Bangalore\'s most prestigious and mature planned townships, developed in the 1960s and known for wide roads, lush tree cover, and a large middle-to-upper-class owner-occupied base. It has minimal new residential supply, a strong sense of community, excellent schools, and some of Bangalore\'s best hospitals. The Green Line metro now runs through Jayanagar, adding a new connectivity dimension to this classic address.',
      specialties: ['Old Bangalore prestige address', 'Green Line metro served', 'Very low new supply', 'Wide roads & tree cover', 'Elite schools & hospitals'],
      major_employers: ['Central Government offices (nearby)', 'NIMHANS (3 km)', 'Judicial establishments', 'Bannerghatta Road IT belt (6 km)', 'Koramangala startup belt (4 km)'],
      schools: [
        { name: 'National Public School Jayanagar (NPS)', type: 'CBSE', note: 'Among Bangalore\'s most sought-after schools; very competitive admissions' },
        { name: 'St. Joseph\'s College of Commerce (nearby)', type: 'Degree/PU', note: 'Prestigious Jesuit institution, not school but major landmark' },
        { name: 'Vijaya High School', type: 'State/CBSE', note: 'Historic school with strong alumni base across Jayanagar' },
      ],
      traffic: {
        peak_hours: 'Moderate; 11th Main Road and South End Circle can slow 9–10 am; Jayanagar is notably less congested than most Bangalore areas',
        metro_access: 'Jayanagar Metro Station (Green Line) — operational; multiple nearby Green Line stations',
        highway_access: 'Bannerghatta Road — 1 km; NICE Road — 4 km via Banashankari',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Jayadeva Institute of Cardiovascular Sciences (1 km)', 'Apollo BGS Hospital (4 km)', 'Sparsh Hospital (3 km)'],
        malls: ['Garuda Mall (3 km)', 'Vega City Mall (4 km)', 'Gopalan Innovation Mall (5 km)'],
        parks: ['Lalbagh Botanical Garden (2 km)', 'Jayanagar 4th Block Park (local)'],
      },
      investment_note: 'Jayanagar is a premium capital-preservation play at 7.5–9% p.a. appreciation with very limited new supply. Rental yields are modest at 3.5–4% given high base prices, but tenant quality is premium. Green Line metro has added a new demand layer from younger professionals. Best for long-term hold investors.',
    },

  },
  // Day 2 (2026-06-22): Pune
  'Pune': {

    'Hinjewadi': {
      overview: 'Hinjewadi hosts Rajiv Gandhi Infotech Park — Pune\'s largest IT zone, spanning 2,800 acres across three phases with 300+ tech companies. It is the undisputed IT capital of Pune, employing hundreds of thousands of professionals. Microsoft invested ₹520 crore here in 2024 for data centre and office expansion. The Metro Line 3 (Hinjewadi–Civil Court) is under construction and will transform connectivity when complete in 2026.',
      specialties: ['Pune\'s largest IT zone — 2,800 acres', 'Rajiv Gandhi Infotech Park Phases 1–3', 'Microsoft data centre investment', 'Metro Line 3 under construction', 'Largest IT workforce concentration in Pune'],
      major_employers: ['Infosys (Phase 1)', 'Wipro (Phase 2)', 'HCL Technologies', 'Accenture', 'Persistent Systems', 'Tech Mahindra'],
      schools: [
        { name: 'Delhi Public School Hinjewadi', type: 'CBSE', note: 'DPS chain; strong academics, popular with IT families' },
        { name: 'Elpro International School', type: 'CBSE/ICSE/IB', note: 'Multi-board school near Hinjewadi with sports facilities' },
        { name: 'Pawar Public School Hinjewadi', type: 'CBSE', note: 'Well-regarded CBSE school serving Hinjewadi residents' },
      ],
      traffic: {
        peak_hours: 'Severely congested on Hinjewadi–Wakad Road and Mumbai–Pune Expressway approach 8:30–10 am and 6:30–9 pm; one of Pune\'s worst commute corridors',
        metro_access: 'Metro Line 3 (Pink Line) under construction — Hinjewadi, Wipro Phase II, Infosys Phase II stations planned; expected 2026',
        highway_access: 'Mumbai–Pune Expressway — 5 km; NH-48 (Mumbai–Bangalore) via Wakad — 3 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Lifepoint Multispeciality Hospital Wakad (4 km)', 'Jupiter Hospital Baner (6 km)', 'Sahyadri Hospital Hadapsar (15 km)'],
        malls: ['Xion Mall Wakad (4 km)', 'Westend Mall Aundh (8 km)', 'Phoenix Marketcity Viman Nagar (12 km)'],
        parks: ['Mula-Mutha River front (8 km)', 'Hinjewadi Phase 3 green belt'],
      },
      investment_note: 'Hinjewadi has seen ~14% appreciation in 2023–24 and a 23% hike in Phase 1 prices over two years. Rental yields at 4.5% are among Pune\'s highest. Metro Line 3 completion in 2026 is expected to be a major price catalyst. Entry prices are moderate — best for 3–5 year hold investors targeting pre-metro upside.',
    },

    'Kharadi': {
      overview: 'Kharadi is Pune\'s fastest-growing eastern IT corridor, anchored by EON Free Zone IT Park, World Trade Centre Pune, and the emerging Weikfield IT Park. It has attracted large GCCs and product companies and offers newer residential stock than older Pune suburbs. Kharadi sits between Viman Nagar (airport) and Hadapsar, giving it excellent connectivity in all directions. Property prices have risen ~12% in 2023–24.',
      specialties: ['EON Free Zone & WTC IT hub', 'Fastest-growing Pune IT corridor', 'Airport proximity', 'New residential stock', 'GCC and product company belt'],
      major_employers: ['Zensar Technologies (HQ)', 'Cybage Software', 'KPIT Technologies', 'Barclays Technology Centre', 'Credit Suisse (now UBS) GCC'],
      schools: [
        { name: 'Orchids The International School Kharadi', type: 'CBSE', note: 'Advanced learning modules; robotics and technology-focused' },
        { name: 'Victorious Kidss Educares', type: 'IB', note: 'Top 10 IB school in Pune; rigorous international curriculum' },
        { name: 'Delhi Public School Kharadi', type: 'CBSE', note: 'DPS chain campus serving east Pune IT professionals' },
      ],
      traffic: {
        peak_hours: 'Heavy on Kharadi Bypass Road and EON IT Park junction 8:30–10 am and 6:30–9 pm',
        metro_access: 'Kharadi included in Phase 2 Pune Metro extension; no metro currently — Ramwadi Station (Aqua Line) — 3 km',
        highway_access: 'Nagar Road (NH-753E) — adjacent; Pune Airport — 5 km; Pune–Solapur Road — 4 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Kharadi (2 km)', 'Noble Hospital (4 km)', 'Jehangir Hospital (8 km)'],
        malls: ['Phoenix Marketcity Nagar Road (3 km)', 'Nexus Westend Mall (10 km)', 'Amanora Mall Hadapsar (6 km)'],
        parks: ['Eon Free Zone IT Park lake area', 'Mula River front (4 km)'],
      },
      investment_note: 'Kharadi has delivered ~12% appreciation in 2023–24 backed by strong GCC demand. Average prices at ~₹9,174/sqft with 4.5–5% rental yields. Phase 2 metro extension to Kharadi, if confirmed, will be a large price catalyst. Strong fundamentals make it one of Pune\'s best mid-term investment bets.',
    },

    'Baner': {
      overview: 'Baner is Pune\'s most upscale mid-city residential address, popular with senior IT professionals and startup founders who want proximity to both Hinjewadi and the old city. It has a vibrant restaurant and café strip, premium apartment stock, and relatively low density compared to Koregaon Park. Baner-Balewadi-Aundh is a contiguous premium belt with seamless connectivity to the Hinjewadi IT corridor.',
      specialties: ['Premium Hinjewadi fringe address', 'Vibrant F&B & café culture', 'Senior IT & startup professional belt', 'Low density premium apartments', 'Metro Line 3 corridor (planned)'],
      major_employers: ['Hinjewadi Phase 1 IT park (5 km)', 'Westfield IT park Baner (local)', 'Infosys BPO Baner', 'L&T Technology Services', 'Persistent Systems (Senapati Bapat Road)'],
      schools: [
        { name: 'The Orchid School Baner', type: 'CBSE', note: 'Well-regarded CBSE school; strong academic and sports programme' },
        { name: 'Delhi Public School Baner', type: 'CBSE', note: 'DPS chain campus; popular with IT-family professionals' },
        { name: 'Mahindra International School', type: 'IB', note: 'Top IB school in Pune; premium international curriculum' },
      ],
      traffic: {
        peak_hours: 'Heavy at Baner Road junction and Pashan–Sus Road crossing 8–10 am and 6–9 pm',
        metro_access: 'Baner and Baner Gaon stations on Metro Line 3 (Pink Line) under construction; expected 2026',
        highway_access: 'Mumbai–Pune Expressway via Wakad — 6 km; NH-48 — 5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Jupiter Hospital Baner (2 km)', 'Sahyadri Hospital Baner (1 km)', 'Deenanath Mangeshkar Hospital (5 km)'],
        malls: ['Westend Mall Aundh (3 km)', 'Xion Mall Wakad (5 km)', 'Balewadi High Street (2 km)'],
        parks: ['Baner Biodiversity Park (1 km)', 'Sus Road lake area'],
      },
      investment_note: 'Baner delivers 10–13% appreciation as a premium Hinjewadi corridor address. Rental yields at 4–4.8% are solid with 2BHK rents of ₹28,000–50,000/mo. Metro Line 3 (Hinjewadi to Civil Court via Baner) is the biggest near-term catalyst. One of Pune\'s top balanced investment localities.',
    },

    'Wakad': {
      overview: 'Wakad is a high-density mid-market residential suburb between Hinjewadi and Pimpri-Chinchwad, offering the closest affordable housing to Hinjewadi IT Park at prices below Baner. It is predominantly apartment-heavy with strong rental demand from mid-level IT professionals. Wakad has Pune\'s highest rental yield among western suburbs and benefits from good road connectivity to the expressway.',
      specialties: ['Closest affordable Hinjewadi fringe', 'Highest rental yield in west Pune', 'Dense apartment stock', 'Mid-IT professional catchment', 'Mumbai-Pune Expressway access'],
      major_employers: ['Hinjewadi Phase 1 IT Park (3 km)', 'Pimpri-Chinchwad industrial belt (6 km)', 'Tata Motors (PCMC)', 'Bharat Forge (PCMC)'],
      schools: [
        { name: 'Vibgyor High School Wakad', type: 'CBSE', note: 'Popular CBSE school; strong co-curricular programme' },
        { name: 'DPS Pimpri', type: 'CBSE', note: 'DPS chain campus serving Wakad and PCMC belt' },
      ],
      traffic: {
        peak_hours: 'Very heavy on Wakad–Hinjewadi Road and Dange Chowk 8–10 am and 6:30–9 pm',
        metro_access: 'Wakad Chowk station on Metro Line 3 (Pink Line) under construction; expected 2026',
        highway_access: 'Mumbai–Pune Expressway — 2 km; NH-48 — 1 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Lifepoint Multispeciality Hospital (1 km)', 'Sahyadri Hospital Hadapsar (12 km)', 'Jupiter Hospital Baner (5 km)'],
        malls: ['Xion Mall Wakad (1 km)', 'D-Mart Wakad (local)', 'Westend Mall Aundh (7 km)'],
        parks: ['Wakad local community parks', 'Mula River corridor (5 km)'],
      },
      investment_note: 'Wakad offers Pune\'s best rental yields in the western belt at 4.8–5.2% with strong mid-income IT tenant demand. Appreciation at 10–12% p.a. is robust. Metro Line 3 completion will be transformative for commute times and prices. Best for rental income investors targeting Hinjewadi IT workers.',
    },

    'Viman Nagar': {
      overview: 'Viman Nagar is a premium residential and commercial suburb adjacent to Pune International Airport, attracting frequent flyers, senior executives, and expats. It sits between Koregaon Park (lifestyle) and Kharadi (IT hub), giving residents the best of both worlds. Giga Space IT Park and proximity to Kharadi\'s EON Zone drive IT worker demand. Property stock is a mix of premium apartments and commercial towers.',
      specialties: ['Airport-adjacent premium address', 'Koregaon Park & Kharadi proximity', 'Expat & senior executive zone', 'Giga Space IT Park', 'Premium lifestyle infrastructure'],
      major_employers: ['Giga Space IT Park (local)', 'Tech Mahindra (Viman Nagar)', 'Global Step', 'Kharadi IT offices (4 km)', 'Pune Airport aerotropolis tenants'],
      schools: [
        { name: 'Victorious Kidss Educares (Viman Nagar)', type: 'IB', note: 'Top-rated IB school in Pune' },
        { name: 'The Lexicon International School', type: 'CBSE/IB', note: 'Well-regarded multi-board school in east Pune' },
      ],
      traffic: {
        peak_hours: 'Moderate on Viman Nagar Main Road; Airport Road can congest during flight arrival peaks',
        metro_access: 'Ramwadi Station (Aqua Line) — 2 km; Airport line proposed in future phases',
        highway_access: 'Nagar Road (NH-753E) — 1 km; Pune Airport — 2 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Columbia Asia Hospital Kharadi (3 km)', 'Jehangir Hospital (5 km)', 'Noble Hospital (5 km)'],
        malls: ['Phoenix Marketcity Nagar Road (2 km)', 'Amanora Mall Hadapsar (7 km)'],
        parks: ['Lunkad Lake (local)', 'Mula River front (4 km)'],
      },
      investment_note: 'Viman Nagar delivers 8–10% appreciation at premium price points backed by airport adjacency and dual employment catchment (Giga Space + Kharadi). Rental yields at 4–4.5% with high tenant quality. Best for investors targeting expats and senior executives who value airport proximity.',
    },

    'Koregaon Park': {
      overview: 'Koregaon Park is Pune\'s most prestigious and cosmopolitan residential address, known for its shaded avenues, colonial bungalows, luxury apartments, top restaurants, and international culture. It is home to the Osho International Meditation Resort, a major international draw. Housing supply is extremely limited and prices are among Pune\'s highest. Primarily an HNI, expat, and luxury lifestyle market.',
      specialties: ['Pune\'s most prestigious address', 'Osho International Resort landmark', 'Luxury bungalow & apartment zone', 'Expat & HNI community', 'Iconic dining & nightlife belt'],
      major_employers: ['Pune CBD offices (Senapati Bapat Rd — 6 km)', 'BPO cluster (Bund Garden Road)', 'Pune Cantonment establishments', 'NGOs & international organisations (Osho ecosystem)'],
      schools: [
        { name: 'St. Anne\'s High School', type: 'CBSE/State', note: 'Established English-medium school near Koregaon Park' },
        { name: 'Bishop\'s School Camp', type: 'ICSE', note: 'One of Pune\'s most prestigious schools, near Koregaon Park' },
        { name: 'St. Mary\'s School', type: 'ICSE', note: 'Heritage Christian school, Pune\'s oldest institutions' },
      ],
      traffic: {
        peak_hours: 'Moderate; North Main Road and Lane 5–6 can congest on weekends due to restaurant traffic',
        metro_access: 'No metro directly; Aqua Line\'s Ramwadi Station — 3 km',
        highway_access: 'Nagar Road — 2 km; Bund Garden Road — 0.5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Jehangir Hospital (2 km)', 'Ruby Hall Clinic (3 km)', 'KEM Hospital (4 km)'],
        malls: ['Phoenix Marketcity (5 km)', 'Central Mall Camp (3 km)', 'High Street Phoenix (Camp)'],
        parks: ['Osho Meditation Resort gardens (local)', 'Bund Garden (1 km)', 'Saras Baug (4 km)'],
      },
      investment_note: 'Koregaon Park is Pune\'s premier capital preservation play at 7–8% appreciation with very limited new supply. Rental yields are modest at 3.5–4% but tenant quality is exceptional (expats, HNIs, senior executives). Best for long-term luxury holding rather than yield-driven investment.',
    },

    'Hadapsar': {
      overview: 'Hadapsar is Pune\'s largest eastern suburb and a major IT and industrial hub, anchored by Magarpatta City — a self-contained integrated township with IT parks, residential towers, schools, and hospitals. It connects to the Pune–Solapur Road and has good access to the airport. The area offers a wide range of housing from affordable to premium within the Magarpatta ecosystem.',
      specialties: ['Magarpatta City integrated township', 'Pune–Solapur Road corridor', 'Large IT and BPO presence', 'Self-contained township infrastructure', 'Mix of affordable and premium housing'],
      major_employers: ['Magarpatta Cybercity IT Park (Wipro, Cognizant, HSBC GCC)', 'Amanora Business District', 'Finolex Industries', 'Mercedes-Benz India (Chakan nearby)'],
      schools: [
        { name: 'Victorious Kidss Educares Hadapsar', type: 'IB', note: 'IB school in Magarpatta township area' },
        { name: 'The Orchid School Hadapsar', type: 'CBSE', note: 'CBSE school serving east Pune residents' },
        { name: 'Ryan International School Hadapsar', type: 'CBSE', note: 'Ryan chain campus in east Pune' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on Magarpatta Road and Solapur Road junction 8:30–10 am and 6–8 pm',
        metro_access: 'Phase 2 metro extension to Hadapsar proposed; no metro currently — nearest Ramwadi (Aqua Line) — 5 km',
        highway_access: 'Pune–Solapur Road (NH-965) — adjacent; Pune Airport — 7 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Sahyadri Hospital Hadapsar (2 km)', 'Columbia Asia Hospital Kharadi (6 km)', 'Amanora Hospital (1 km)'],
        malls: ['Amanora Mall Hadapsar (2 km)', 'Phoenix Marketcity Nagar Road (8 km)'],
        parks: ['Magarpatta City central park (local)', 'Amanora park zone (local)'],
      },
      investment_note: 'Hadapsar has seen 8–10% appreciation annually driven by Magarpatta Cybercity demand. Rental yields at 3.5–4.5% are steady. Magarpatta City township commands a premium for its self-contained infrastructure. Good for investors seeking township-model stability with moderate entry prices.',
    },

    'Aundh': {
      overview: 'Aundh is a well-established premium suburb in north-west Pune, popular with old Pune families, senior government employees, and IT professionals who prefer a quieter lifestyle with excellent social infrastructure. It has top schools, good hospitals, wide roads, and easy access to the Mumbai–Pune Expressway. Metro Line 3 will pass through Aundh, making the already-desirable locality even more connected.',
      specialties: ['Premium north-west Pune address', 'Excellent social infrastructure', 'Metro Line 3 corridor (planned)', 'Old Pune family neighbourhood', 'Wide roads & low density'],
      major_employers: ['Hinjewadi IT Park (8 km)', 'Bharat Electronics Limited (BEL) Pune', 'Pune Cantonment offices', 'Defence establishments (nearby)'],
      schools: [
        { name: 'Symbiosis International School', type: 'IB', note: 'One of Pune\'s top IB schools; part of Symbiosis group' },
        { name: 'Delhi Public School Aundh', type: 'CBSE', note: 'DPS chain campus; very popular with IT families' },
        { name: 'St. Mary\'s School Aundh', type: 'CBSE', note: 'Reputed Christian school in the locality' },
      ],
      traffic: {
        peak_hours: 'Moderate on Aundh Road and ITI Road; expressway access is smooth most times of day',
        metro_access: 'Metro Line 3 stations (Aundh, NICMAR, Ram Nagar) under construction; expected 2026',
        highway_access: 'Mumbai–Pune Expressway (Wakad gate) — 4 km; NH-48 — 5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Deenanath Mangeshkar Hospital (3 km)', 'Jupiter Hospital Baner (4 km)', 'Aditya Birla Hospital (3 km)'],
        malls: ['Westend Mall Aundh (1 km)', 'Elpro City Square (5 km)', 'Xion Mall Wakad (8 km)'],
        parks: ['Aundh community garden', 'Pashan Lake (3 km)', 'Chatushrungi Mandir Hill (2 km)'],
      },
      investment_note: 'Aundh delivers steady 8–10% appreciation with premium pricing backed by Metro Line 3 pipeline and excellent social infrastructure. Rental yields at 3.5–4.5% are moderate. Best for owner-occupation or long-term capital growth rather than yield-maximisation. Very low vacancy ensures price stability.',
    },

    'Kothrud': {
      overview: 'Kothrud is one of Pune\'s most densely populated and well-established suburbs, historically a middle-class stronghold that has upgraded significantly in recent years. It has excellent schools, hospitals, and a strong sense of community. Its strategic position on the western end gives access to both the Hinjewadi IT corridor and Pune\'s educational institutions. Property is predominantly mid-market to upper-mid.',
      specialties: ['Densely established west Pune suburb', 'Educational institution proximity (COEP, MIT)', 'Strong owner-occupier base', 'Mid-market to premium residential', 'Green Line metro planned'],
      major_employers: ['Hinjewadi IT Park (10 km)', 'Bharat Electronics Pashan (4 km)', 'COEP Tech Park (2 km)', 'Cummins India HQ (nearby)', 'Bajaj Auto Akurdi (8 km)'],
      schools: [
        { name: 'Abhinava Vidyalaya', type: 'CBSE/State', note: 'Old-established Kothrud institution with strong alumni network' },
        { name: 'Kendriya Vidyalaya Paud Road', type: 'CBSE', note: 'Central government school serving west Pune' },
        { name: 'MIT Vishwashanti Gurukul', type: 'CBSE/IB', note: 'Large MIT-group school in Kothrud area' },
      ],
      traffic: {
        peak_hours: 'Heavy at Karve Road and Chandni Chowk junction 8:30–10 am and 6–9 pm; Chandni Chowk is Pune\'s notorious bottleneck',
        metro_access: 'No metro currently; Phase 2 Pune Metro Katraj–Chandni Chowk extension proposed through Kothrud',
        highway_access: 'NH-48 (Mumbai–Bangalore) via Chandni Chowk — 3 km; Pune–Satara Road — 4 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Deenanath Mangeshkar Hospital (3 km)', 'Sahayadri Hospital Deccan (4 km)', 'Sahyadri Hospital Kothrud (local)'],
        malls: ['Pune Central Kothrud (2 km)', 'Westend Mall Aundh (6 km)', 'Atul Kamath Mall (3 km)'],
        parks: ['Katraj Snake Park (5 km)', 'Saras Baug (4 km)', 'Hanuman Tekdi Forest Hill'],
      },
      investment_note: 'Kothrud offers reliable 8–9% appreciation at moderate prices with strong owner-occupier demand. Rental yields at 3.5–4% are modest but vacancy is very low. Best suited for owner-occupation or conservative long-term investors. Chandni Chowk traffic remains a livability concern.',
    },

    'Nibm Road': {
      overview: 'NIBM Road (National Institute of Bank Management Road) is a premium south Pune residential corridor popular with senior banking, IT and defence professionals. It offers relatively low density, green surroundings, wide roads, and proximity to both the old city\'s amenities and the eastern IT corridor. Large plotted villas and premium apartments coexist in a quieter, less commercial environment.',
      specialties: ['Premium south Pune address', 'Low density & green surroundings', 'Senior executive & banking community', 'Close to Koregaon Park & Hadapsar', 'Large villa and premium apartment mix'],
      major_employers: ['NIBM (National Institute of Bank Management)', 'Magarpatta Cybercity (8 km)', 'Kharadi EON Zone (10 km)', 'Pune Cantonment offices (5 km)'],
      schools: [
        { name: 'DPS NIBM (Delhi Public School)', type: 'CBSE', note: 'DPS campus serving south Pune premium families' },
        { name: 'The Orchid School NIBM', type: 'CBSE', note: 'Popular CBSE school in the NIBM Road corridor' },
      ],
      traffic: {
        peak_hours: 'Light to moderate on NIBM Road; Undri junction can slow during peak hours',
        metro_access: 'No metro currently; Swargate (Purple Line) — 6 km; Phase 2 southern extension proposed',
        highway_access: 'Pune–Solapur Road via Hadapsar — 5 km; Pune–Satara Road — 4 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Sahyadri Hospital Hadapsar (5 km)', 'Jehangir Hospital (6 km)', 'Ruby Hall Clinic (7 km)'],
        malls: ['Amanora Mall Hadapsar (5 km)', 'Phoenix Marketcity (10 km)', 'Dorabjee\'s Mall (6 km)'],
        parks: ['NIBM campus greenery (local)', 'Katraj Lake (6 km)', 'Sahyadri mountain trails (15 km)'],
      },
      investment_note: 'NIBM Road offers 8–9% appreciation in a premium low-density environment at prices below Koregaon Park. Rental yields at 3.5–4% from senior tenants. Low supply, greenery, and proximity to the old city\'s elite make it a strong capital-preservation play for conservative HNI investors.',
    },

  },
  // Day 2 (2026-06-22): Mumbai
  'Mumbai': {

    'Powai': {
      overview: 'Powai is Mumbai\'s premier planned IT and residential township, built around the scenic Powai Lake inside the Hiranandani Gardens development. It is home to IIT Bombay and Hiranandani Business Park, making it the intellectual and tech hub of central Mumbai. Powai\'s high-quality social infrastructure, planned roads, and lake views command a significant premium. Metro Line 6 (Pink Line) will directly serve IIT Powai and Powai Lake stations.',
      specialties: ['Hiranandani Business Park IT hub', 'IIT Bombay proximity', 'Powai Lake & planned township', 'Metro Line 6 (Pink Line) pipeline', 'Premium gated community stock'],
      major_employers: ['Hiranandani Business Park tenants (TCS, Deloitte, CRISIL, HDFC)', 'IIT Bombay & spinoffs', 'Bisleri Industries HQ', 'Lodha Group offices'],
      schools: [
        { name: 'Hiranandani Foundation School', type: 'ICSE/IB', note: 'Top school in Powai; CISCE and IB curricula; part of Hiranandani group' },
        { name: 'Podar International School Powai', type: 'CBSE', note: 'Top 10 international day school in India for 10 consecutive years; Education World 2024–25' },
        { name: 'Bombay Scottish School Powai', type: 'CBSE', note: 'Historic 1847 institution; one of Mumbai\'s most prestigious schools' },
      ],
      traffic: {
        peak_hours: 'Heavy at Powai Plaza junction and LBS Road cross 8:30–10:30 am and 6:30–9 pm; Jogeshwari–Vikhroli Link Road (JVLR) is the main artery',
        metro_access: 'Metro Line 6 (Pink Line): IIT Powai and Powai Lake stations under construction; Line 1 Ghatkopar Station — 4 km',
        highway_access: 'Eastern Express Highway — 3 km; JVLR — adjacent; Mumbai–Nashik Expressway — 8 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Hiranandani Hospital Powai (1 km)', 'Fortis Hospital Mulund (5 km)', 'Kokilaben Dhirubhai Ambani Hospital (7 km)'],
        malls: ['Galleria Mall Hiranandani (1 km)', 'R-City Mall Ghatkopar (4 km)', 'Viviana Mall Thane (8 km)'],
        parks: ['Powai Lake promenade (local)', 'Sanjay Gandhi National Park (8 km)', 'IIT Bombay campus lake area'],
      },
      investment_note: 'Powai is Mumbai\'s most reliable long-term capital appreciation locality at 10–14% p.a., driven by IIT proximity, Hiranandani Business Park demand, and severe supply constraints. Rental yields at 3.5–4.5% are moderate but tenant quality is exceptional. Metro Line 6 stations at IIT and Powai Lake are major near-term catalysts.',
    },

    'BKC': {
      overview: 'Bandra Kurla Complex is Mumbai\'s only purpose-built planned CBD and the country\'s most prestigious commercial address, housing the RBI, SEBI, NSE, and headquarters of India\'s largest banks, insurance companies, and MNC offices. The Aqua Line metro (Line 3) now directly serves BKC station (operational since Oct 2024), making it the best-connected business district in Mumbai. Residential supply immediately adjacent is extremely scarce and ultra-premium.',
      specialties: ['Mumbai\'s premium planned CBD', 'RBI, SEBI, NSE headquarters', 'Aqua Line (Line 3) metro served', 'Ultra-premium residential adjacency', 'MNC & BFSI headquarters cluster'],
      major_employers: ['RBI (Reserve Bank of India)', 'SEBI', 'NSE & BSE', 'HDFC Bank HQ', 'Citibank India HQ', 'Facebook/Meta India HQ', 'ICICI Bank HQ'],
      schools: [
        { name: 'Mount Litera School International (MLSI)', type: 'IB', note: 'IB school in BKC area; co-educational from playgroup to Class 11' },
        { name: 'Dhirubhai Ambani International School (DAIS)', type: 'IB/IGCSE', note: 'One of India\'s most prestigious international schools; very high fees and demand' },
      ],
      traffic: {
        peak_hours: 'Very heavy at BKC Gate 1, CST Road and Kalanagar junction 9–11 am and 6–9 pm; one of Mumbai\'s most congested nodes',
        metro_access: 'BKC Station (Aqua Line / Metro Line 3) — directly on the corridor; operational since October 2024',
        highway_access: 'Eastern Freeway via Sion — 4 km; Western Express Highway via Bandra — 3 km; SCLR — adjacent',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Lilavati Hospital Bandra (3 km)', 'Hinduja Hospital Mahim (3 km)', 'Kokilaben Hospital (5 km)'],
        malls: ['Linking Road Bandra (3 km)', 'Phoenix Palladium Lower Parel (5 km)', 'High Street Phoenix (5 km)'],
        parks: ['Carter Road Promenade Bandra (3 km)', 'Mahim Nature Park (2 km)'],
      },
      investment_note: 'BKC-adjacent residential is ultra-premium capital preservation with 8–10% appreciation and 3–4% yields. The Aqua Line metro has elevated connectivity to the whole island city and western suburbs. Investment is primarily HNI/institutional — entry prices are among India\'s highest. Best for long-term wealth stores, not yield plays.',
    },

    'Andheri East': {
      overview: 'Andheri East is Mumbai\'s most important mid-market commercial and residential suburb, strategically located between the Western Express Highway, the Mumbai Metro Line 1, and Mumbai Airport. It is home to SEEPZ (software export zone), Marol IT Park, and a large number of corporate offices, making it the hub for mid-to-senior IT professionals who want central Mumbai access without South Mumbai prices.',
      specialties: ['SEEPZ & Marol IT Park hub', 'Airport proximity (2 km)', 'Metro Line 1 & 7 served', 'Mid-premium corporate belt', 'Strong rental demand'],
      major_employers: ['SEEPZ (Software Technology Park)', 'Marol IT Park tenants', 'Reliance Corporate Office', 'HDFC Life', 'Atos India'],
      schools: [
        { name: 'JBCN International School Oshiwara', type: 'IB/IGCSE', note: 'Top 40 IB School globally (Education Advisers 2025); Top IB School in World 2024 & 2025' },
        { name: 'Ryan International School Andheri', type: 'CBSE', note: 'Ryan chain campus; large school serving Andheri families' },
        { name: 'ST. Joseph\'s High School Andheri', type: 'ICSE', note: 'Well-established ICSE school in Andheri West' },
      ],
      traffic: {
        peak_hours: 'Very heavy on Western Express Highway and Andheri Station area 8–10:30 am and 6–9 pm; among Mumbai\'s busiest suburban nodes',
        metro_access: 'Andheri Station (Metro Line 1 — Blue Line) — operational; Western Express Highway Station (Line 1); Gundavali Station (Line 7)',
        highway_access: 'Western Express Highway — adjacent; Mumbai Airport — 2 km; Eastern Express Highway — 5 km via JVLR',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Kokilaben Dhirubhai Ambani Hospital (3 km)', 'Seven Hills Hospital (2 km)', 'Holy Spirit Hospital (2 km)'],
        malls: ['Infiniti Mall Andheri (2 km)', 'Citi Mall (2 km)', 'Oberoi Mall Goregaon (5 km)'],
        parks: ['Joggers Park Bandra (5 km)', 'SEEPZ grounds', 'Juhu Beach (4 km)'],
      },
      investment_note: 'Andheri East offers strong 9–12% appreciation driven by airport proximity, SEEPZ, and metro connectivity. Rental yields at 3.5–4.5% with high occupancy from IT and airline professionals. Metro Line 1 has been a sustained price driver since 2014. Mid-entry price point makes it accessible compared to South Mumbai or BKC.',
    },

    'Goregaon East': {
      overview: 'Goregaon East is an established residential and commercial hub along the Western Express Highway, anchored by the massive Mindspace Business Park and Oberoi Garden City. It sits between Andheri and Malad and benefits from excellent metro connectivity via Lines 2A and 7. A large, well-planned township with schools, hospitals, and retail, it caters to mid-to-premium IT families.',
      specialties: ['Mindspace Business Park hub', 'Oberoi Garden City township', 'Metro Lines 2A & 7 served', 'Western Express Highway frontage', 'Established IT professional community'],
      major_employers: ['Mindspace Business Park tenants (Accenture, Oracle, KPMG)', 'Oberoi Commerz IT offices', 'Crisil (a part of S&P Global)', 'Hathway Cable HQ'],
      schools: [
        { name: 'Oberoi International School (OIS)', type: 'IB/IGCSE', note: 'Premium IB school in Oberoi Garden City; international families' },
        { name: 'Ryan International School Kandivali East', type: 'CBSE', note: 'Large Ryan campus serving Goregaon–Kandivali belt' },
        { name: 'St. Francis D\'Assisi High School', type: 'ICSE', note: 'Well-established ICSE school in Borivali/Goregaon belt' },
      ],
      traffic: {
        peak_hours: 'Heavy on Western Express Highway and Goregaon station area 8–10:30 am and 6–9 pm',
        metro_access: 'Goregaon West Station (Metro Line 2A — Yellow Line) and Oshiwara/Pahadi Goregaon stations operational; Line 7 also serves the area',
        highway_access: 'Western Express Highway — adjacent; Link Road — 1 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Kokilaben Hospital (4 km)', 'Lifeline Hospital Malad (3 km)', 'HN Reliance Hospital (10 km)'],
        malls: ['Oberoi Mall Goregaon (1 km)', 'Infiniti Mall Malad (3 km)', 'Growel\'s 101 Mall Kandivali (4 km)'],
        parks: ['Aarey Milk Colony (2 km)', 'Sanjay Gandhi National Park (5 km)', 'Oberoi Garden City greens'],
      },
      investment_note: 'Goregaon East delivers 9–12% appreciation with dual metro connectivity (Lines 2A and 7) as structural demand anchors. Rental yields at 3.5–4% with strong demand from Mindspace IT employees. Oberoi Garden City commands a township premium. Good balanced investment for mid-premium IT corridor buyers.',
    },

    'Thane': {
      overview: 'Thane West is Mumbai Metropolitan Region\'s fastest-growing suburban city, offering significantly more space at lower prices than Mumbai city while connecting via fast suburban rail to CST and Andheri in under 30 minutes. It is a self-contained city with excellent social infrastructure, multiple lakes, large residential townships, and a growing commercial belt. Upcoming Metro Line 4 and the Thane Ring Metro will further transform connectivity.',
      specialties: ['MMR\'s fastest-growing suburban city', 'Suburban rail to Mumbai in 30 min', 'Multiple lakes & green cover', 'Large township residential stock', 'Metro Line 4 & Ring Metro pipeline'],
      major_employers: ['Majiwada IT Park', 'Wagle Estate industrial & IT belt', 'Lodha commercial developments', 'Viviana Mall commercial ecosystem', 'Thane Municipal Corporation offices'],
      schools: [
        { name: 'CP Goenka International School Thane', type: 'IGCSE/IB', note: 'Premium international school offering IGCSE and IB' },
        { name: 'Hiranandani Foundation School Thane', type: 'ICSE/IB', note: 'Part of Hiranandani group; high quality infrastructure' },
        { name: 'Kendriya Vidyalaya Thane', type: 'CBSE', note: 'Central government school; high quality and affordable' },
      ],
      traffic: {
        peak_hours: 'Heavy on Ghodbunder Road and Thane station area 8–10 am and 6:30–9 pm; Eastern Express Highway from LBS Marg also congested',
        metro_access: 'Metro Line 4 (Wadala–Kasarvadavali) under construction; Thane Integral Ring Metro (29 km, 22 stations) approved Aug 2024',
        highway_access: 'Eastern Express Highway — adjacent; Mumbai–Nashik Highway (NH-160) — 3 km; Ghodbunder Road (to Western suburbs) — 1 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Jupiter Hospital Thane (2 km)', 'Kaushalya Medical Foundation (2 km)', 'Bethany Hospital (3 km)'],
        malls: ['Viviana Mall Thane (2 km)', 'R-Mall Thane (3 km)', 'Hypercity Thane (2 km)'],
        parks: ['Upvan Lake (2 km)', 'Masunda (Talao Pali) Lake (1 km)', 'Yeoor Hills (5 km)'],
      },
      investment_note: 'Thane West offers strong 10–14% appreciation at prices 30–40% below comparable Mumbai localities. Rental yields at 4–5% are among MMR\'s best outside Navi Mumbai. Metro Line 4 and Ring Metro approvals are major value catalysts. Best affordability–appreciation balance in the Mumbai region for mid-budget investors.',
    },

    'Kharghar': {
      overview: 'Kharghar is a well-planned sector in Navi Mumbai developed by CIDCO, offering the best quality-of-life in the MMR at a fraction of Mumbai prices. It has wide roads, golf courses, and excellent schools. The opening of Navi Mumbai International Airport (NMIA) in December 2025 and the approaching Metro Line 8 have triggered 24–27% YoY price appreciation, making it one of India\'s fastest-appreciating residential markets.',
      specialties: ['CIDCO planned township', 'Navi Mumbai International Airport proximity', 'Golf course & sector parks', 'Metro Line 8 pipeline', '24–27% YoY appreciation'],
      major_employers: ['Reliance Corporate Park (nearby Ghansoli)', 'TCS Navi Mumbai campus', 'DY Patil University ecosystem', 'Belapur CBD offices (7 km)'],
      schools: [
        { name: 'Delhi Public School Navi Mumbai', type: 'CBSE', note: 'Large DPS campus; popular with Navi Mumbai IT families' },
        { name: 'Orchids The International School Kharghar', type: 'CBSE', note: 'Technology-focused CBSE school in Kharghar' },
        { name: 'Ryan International School Kharghar', type: 'CBSE', note: 'Ryan chain campus; well-attended CBSE school' },
      ],
      traffic: {
        peak_hours: 'Moderate; Sion–Panvel Expressway approach can congest during peak; NMIA road works temporarily affecting some sectors',
        metro_access: 'Metro Line 8 (NMIA–CST) planned through Kharghar; Belapur Station (Harbour Line) — 5 km; Palm Beach Metro proposed',
        highway_access: 'Sion–Panvel Expressway — 2 km; Mumbai–Pune Expressway via Panvel — 5 km; MTHL (sea bridge to Mumbai) — 8 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['MGM Hospital Kamothe (5 km)', 'Terna Medical College Hospital (3 km)', 'Apollo Clinic Kharghar (local)'],
        malls: ['Glomax Mall Kharghar (2 km)', 'Little World Mall (3 km)', 'Inorbit Mall Vashi (10 km)'],
        parks: ['Kharghar Central Park (sector 23)', 'Golf Course Sector 23 (local)', 'Parsik Hills (3 km)'],
      },
      investment_note: 'Kharghar is seeing 24–27% YoY appreciation — among India\'s highest — driven by the NMIA airport opening (Dec 2025) and MTHL sea bridge access. Entry prices are still 40–60% below comparable Mumbai localities. Rental yields at 4–5%. Ideal for medium-term investors; the airport catalyst is still in early innings.',
    },

    'Vashi': {
      overview: 'Vashi is Navi Mumbai\'s commercial capital and most mature suburb, home to Inorbit Mall, APMC market, and a large established residential population. It has the best connectivity in Navi Mumbai via Harbour Line suburban rail, easy access to Mumbai via MTHL sea bridge, and a growing IT commercial belt along the NH-4B corridor. Social infrastructure is excellent with top schools and hospitals.',
      specialties: ['Navi Mumbai commercial capital', 'Best suburban rail connectivity in NM', 'MTHL sea bridge to Mumbai', 'Inorbit Mall anchor', 'Mature established residential suburb'],
      major_employers: ['Vishwaroop IT Park (ICICI Lombard, Nomura, Alight Solutions)', 'APMC market ecosystem', 'Navi Mumbai Municipal Corporation offices', 'Seawoods Grand Central corporate offices (adjacent)'],
      schools: [
        { name: 'NES International School Vashi', type: 'IB/IGCSE', note: 'International school in Vashi; well-regarded in Navi Mumbai' },
        { name: 'Ryan International School Vashi', type: 'CBSE', note: 'Established Ryan CBSE campus in Vashi' },
        { name: 'St. Joseph\'s High School Vashi', type: 'CBSE', note: 'Christian missionary school with strong academic record' },
      ],
      traffic: {
        peak_hours: 'Moderate; Palm Beach Road is generally free-flowing; Vashi station area gets congested 8:30–10 am',
        metro_access: 'Metro Line 8 (planned) to serve Vashi; Vashi Station (Harbour Line) — on the main Harbour rail corridor',
        highway_access: 'Palm Beach Road — adjacent; NH-4B — 1 km; MTHL (Trans Harbour Link to Mumbai) — 5 km via Sewri',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Apollo Hospital Navi Mumbai (3 km)', 'Meenakshi Hospital Vashi (1 km)', 'DY Patil Hospital Nerul (5 km)'],
        malls: ['Inorbit Mall Vashi (1 km)', 'Centre One Mall Vashi (1 km)', 'Seawoods Grand Central (4 km)'],
        parks: ['Vashi Jetty & Palm Beach promenade (1 km)', 'Flamingo Sanctuary (5 km)', 'Parsik Hills (8 km)'],
      },
      investment_note: 'Vashi offers stable 8–10% appreciation with best-in-class Navi Mumbai connectivity. Rental yields at 4–4.5% are solid with strong demand from APMC traders and IT professionals. MTHL sea bridge has materially reduced travel time to Mumbai, acting as a sustained price catalyst. Best for stable long-term investors in Navi Mumbai.',
    },

    'Lower Parel': {
      overview: 'Lower Parel is Mumbai\'s most dramatic urban transformation — old textile mill lands redeveloped into a premium commercial and residential district housing the highest concentration of luxury malls, media companies, and corporate offices between South Mumbai and BKC. It is the HQ of Hindustan Unilever, and home to offices of Google, McKinsey, and dozens of financial firms. Residential supply is very limited and ultra-premium.',
      specialties: ['Mill land redevelopment district', 'HUL & Google India HQ zone', 'Phoenix Palladium luxury retail', 'Ultra-premium limited residential', 'Financial and media company hub'],
      major_employers: ['Hindustan Unilever HQ', 'Google India (One BKC — nearby)', 'McKinsey & Company India', 'STAR India HQ', 'Lodha commercial tenants (World One)'],
      schools: [
        { name: 'Cathedral and John Connon School', type: 'ICSE/IB', note: 'One of India\'s most prestigious schools; nearby in South Mumbai' },
        { name: 'St. Mary\'s School Mazgaon', type: 'ICSE', note: 'Prestigious old-established school serving South Mumbai' },
      ],
      traffic: {
        peak_hours: 'Severely congested at Senapati Bapat Marg and Delisle Road junction throughout the day; one of Mumbai\'s busiest corridors',
        metro_access: 'Lower Parel Station (Aqua Line / Metro Line 3) — operational, part of the Colaba–Aarey line opened 2025; Mumbai local also serves Elphinstone Road',
        highway_access: 'Eastern Freeway via Byculla — 3 km; Western Express Highway via Worli — 5 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Breach Candy Hospital (4 km)', 'KEM Hospital (2 km)', 'HN Reliance Foundation Hospital (3 km)'],
        malls: ['High Street Phoenix / Phoenix Palladium (local)', 'Palladium Hotel & Mall (local)', 'Inorbit Mall Malad (12 km)'],
        parks: ['Priyadarshini Park Worli (3 km)', 'Mahalaxmi Racecourse (2 km)'],
      },
      investment_note: 'Lower Parel is ultra-premium capital preservation at 8–10% appreciation. Residential units are among Mumbai\'s priciest and rental yields are moderate at 3–3.5% but tenant quality is exceptional. Aqua Line metro has cemented its connectivity advantage. Best for HNI investors seeking South Mumbai adjacency at a relative discount.',
    },

    'Malad West': {
      overview: 'Malad West is a large, well-established western suburb with a strong mid-to-premium residential base, good metro connectivity via Line 2A, and proximity to the Mindspace Business Park in Goregaon. It is popular with mid-level IT professionals and film industry workers (Film City at nearby Goregaon East). Inorbit Mall anchors its retail ecosystem and social infrastructure is mature.',
      specialties: ['Metro Line 2A served', 'Film City & Mindspace proximity', 'Large mid-premium residential base', 'Strong western suburb connectivity', 'Inorbit Mall anchor'],
      major_employers: ['Mindspace Business Park Goregaon (4 km)', 'Film City Goregaon East (5 km)', 'Infinity IT Park Malad (local)', 'Times of India offices (nearby)'],
      schools: [
        { name: 'Orchids The International School Malad', type: 'CBSE', note: 'Technology-forward CBSE school in Malad' },
        { name: 'Ryan International School Kandivali East', type: 'CBSE', note: 'Large Ryan campus accessible from Malad' },
        { name: 'St. Joseph\'s High School Malad', type: 'ICSE', note: 'Established ICSE missionary school in Malad West' },
      ],
      traffic: {
        peak_hours: 'Heavy at Malad Station and S.V. Road junction 8–10:30 am and 6:30–9 pm; SV Road is a chronic Mumbai bottleneck',
        metro_access: 'Lower Malad and Malad West Stations (Metro Line 2A — Yellow Line) — operational',
        highway_access: 'Western Express Highway (Malad interchange) — 2 km; Link Road — adjacent',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Lifeline Hospital Malad (2 km)', 'Kokilaben Hospital (5 km)', 'Riddhi Vinayak Hospital (2 km)'],
        malls: ['Inorbit Mall Malad (1 km)', 'Infiniti Mall Malad (2 km)', 'Oberoi Mall Goregaon (5 km)'],
        parks: ['Mindspace garden area Goregaon (4 km)', 'Aarey Colony (6 km)', 'Malad Creek waterfront'],
      },
      investment_note: 'Malad West offers 9–11% appreciation with dual metro line access (Line 2A) and strong rental demand from Mindspace IT workers and film industry professionals. Rental yields at 3.5–4.5% are solid. Entry prices are 20–30% below Goregaon or Andheri for similar connectivity, making it a good value play.',
    },

  },
  // Day 3 (2026-06-22): Delhi NCR
  'Delhi NCR': {

    'DLF City Phases': {
      overview: 'DLF Cyber City is Gurgaon\'s premier IT and corporate district — a 125-acre Grade A office campus hosting Fortune 500 companies including Google, Microsoft, EY, Deloitte, PwC, Oracle, and American Express. It is the densest concentration of high-value white-collar employment in North India. Residential demand from Cyber City employees drives the entire Golf Course Road–NH-48 corridor. The Yellow Line metro serves the area via Cyber City Station.',
      specialties: ['North India\'s largest IT corporate campus', 'Fortune 500 company cluster', 'Yellow Line metro served', 'Golf Course Road premium residential proximity', '125-acre Grade A office park'],
      major_employers: ['Google India', 'Microsoft India', 'Deloitte', 'PwC India', 'EY India', 'Oracle India', 'American Express India'],
      schools: [
        { name: 'Shiv Nadar School Gurgaon', type: 'CBSE/IB/IGCSE', note: 'Shiv Nadar Foundation school; consistently top-ranked in Gurgaon' },
        { name: 'Lancers International School', type: 'IGCSE/IB', note: '#1 ranked school in Delhi NCR by EducationWorld 2024–25' },
        { name: 'DPS Sector 45 Gurgaon', type: 'CBSE', note: 'Delhi Public School; top CBSE school in Gurgaon' },
      ],
      traffic: {
        peak_hours: 'Severely congested on NH-48 (NH-8) and Cyber City flyover 8:30–10:30 am and 6–9:30 pm; among NCR\'s worst commute corridors',
        metro_access: 'Cyber City Station (Yellow Line / Delhi Metro Rapid Metro) — on-site; MG Road and Iffco Chowk stations nearby',
        highway_access: 'NH-48 (Delhi–Jaipur highway) — adjacent; Delhi–Gurgaon Expressway — 0.5 km; IGI Airport — 12 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Medanta The Medicity (3 km)', 'Artemis Hospital (5 km)', 'Max Hospital Gurgaon (4 km)'],
        malls: ['Ambience Mall Gurgaon (2 km)', 'DLF Mega Mall (1 km)', 'MGF Metropolitan Mall (2 km)'],
        parks: ['Leisure Valley Park (2 km)', 'Aravalli Biodiversity Park (3 km)'],
      },
      investment_note: 'Cyber City–Golf Course Road residential corridor delivers 10–14% appreciation with premium entry pricing. Rental yields at 3.5–4.5% are moderate, but demand is near-zero vacancy from IT professionals. Gurgaon\'s total housing sales jumped 66% in 2024 — fundamentals remain the strongest in NCR. Best for premium capital appreciation.',
    },

    'Golf Course Ext Road': {
      overview: 'Golf Course Road is Gurgaon\'s most prestigious residential address — a 5 km stretch of luxury apartments, five-star hotels, and top-tier commercial buildings between DLF Phase 5 and Sikanderpur. It houses India\'s highest concentration of luxury residential launches per corridor and attracts senior executives and HNIs. The Yellow Line metro runs parallel, making it uniquely walkable for an NCR premium address.',
      specialties: ['Gurgaon\'s luxury residential spine', 'Yellow Line metro walkable', 'DLF Phase 5 premium township', 'Five-star hotel belt', 'HNI & C-suite residential market'],
      major_employers: ['DLF Cyber City tenants (2 km)', 'One Horizon Centre offices', 'DLF Corporate Park', 'Unitech Cyber Park tenants', 'Embassy Golf Links-equivalent offices'],
      schools: [
        { name: 'The Heritage School Gurgaon', type: 'CBSE/IB', note: 'Top-ranked co-ed school; IB and CBSE tracks' },
        { name: 'Pathways World School Aravalli', type: 'IB', note: 'Premier IB school serving Golf Course Road & Sohna Road belt' },
        { name: 'GD Goenka World School Gurgaon', type: 'CBSE/IB', note: 'Large GD Goenka campus; strong academics and sports' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on Golf Course Road during peak hours; Sikanderpur junction and DLF Galleria crossings can bottleneck',
        metro_access: 'Sikanderpur Metro Station (Yellow Line) — 1 km; Sector 53–54 Station — 1 km',
        highway_access: 'NH-48 via Sikanderpur — 2 km; Southern Peripheral Road (SPR) — 2 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Medanta The Medicity (5 km)', 'Max Hospital Sector 56 (3 km)', 'Fortis Hospital (4 km)'],
        malls: ['DLF Promenade (2 km)', 'DLF Mega Mall (3 km)', 'South Point Mall (1 km)'],
        parks: ['Aravalli Biodiversity Park (2 km)', 'Central Park (local)'],
      },
      investment_note: 'Golf Course Road is NCR\'s premium capital appreciation corridor at 10–13% p.a. Entry prices are among Delhi NCR\'s highest outside Lutyens Delhi. Rental yields of 3–4% are modest but vacancy is near zero for premium stock. Metro walkability is a structural demand driver unique among NCR luxury corridors.',
    },

    'Sohna Road': {
      overview: 'Sohna Road is Gurgaon\'s fastest-growing mid-to-premium residential and commercial corridor, stretching south from NH-48 towards Sohna. It offers more affordable prices than Golf Course Road while sharing proximity to Cyber City and the Bhiwadi–Neemrana industrial belt. Large integrated townships and plotted developments dominate. The Southern Peripheral Road (SPR) extension has sharply improved connectivity.',
      specialties: ['Affordable Cyber City fringe', 'Large integrated township belt', 'SPR & NH-248A connectivity', 'Mid-premium IT professional corridor', 'Rapid price appreciation 2022–2025'],
      major_employers: ['DLF Cyber City (7 km)', 'Unitech Cyber Park (5 km)', 'Vatika Business Park', 'Bestech Business Tower', 'Maruti Suzuki (Manesar — 15 km)'],
      schools: [
        { name: 'Pathways World School Aravalli', type: 'IB', note: 'Top IB school on Sohna Road belt' },
        { name: 'DPS Sohna Road', type: 'CBSE', note: 'DPS campus serving the Sohna Road corridor' },
        { name: 'Lotus Valley International School', type: 'CBSE', note: 'Well-regarded CBSE school on Sohna Road' },
      ],
      traffic: {
        peak_hours: 'Heavy on Sohna Road and Rajiv Chowk underpass connection 8:30–10:30 am and 6–9 pm',
        metro_access: 'Nearest: Huda City Centre (Yellow Line) — 6 km; Rapid Metro Gurgaon proposals for extension to Sohna',
        highway_access: 'NH-248A (Sohna–Palwal highway) — adjacent; SPR (Southern Peripheral Road) — 1 km; NH-48 — 5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Medanta The Medicity (8 km)', 'Park Hospital Gurgaon (4 km)', 'Artemis Hospital (6 km)'],
        malls: ['Omaxe Celebration Mall (4 km)', 'Sapphire 90 Mall (3 km)', 'Airia Mall (3 km)'],
        parks: ['Aravalli Range hillside (adjacent)', 'Leisure Valley extension'],
      },
      investment_note: 'Sohna Road offers 10–13% appreciation at 25–30% lower entry prices than Golf Course Road, making it Gurgaon\'s best value IT corridor investment. Rental yields at 4–5% are among NCR\'s better yielding micro-markets. SPR-driven connectivity improvement is sustaining strong demand momentum.',
    },

    'Noida Sector 62–137': {
      overview: 'The Noida Expressway corridor — spanning Sectors 125 to 150 — is Noida\'s premium residential and IT address, anchored by campuses of TCS, Infosys, HCL, Wipro, and Barclays along the expressway. Sector 150 is a sporting and green township command-ing highest prices in Noida, while sectors 132 and 137 are established mid-premium IT worker catchments. Prices have risen 152% since 2019 and continue to climb on Jewar airport expectations.',
      specialties: ['Noida\'s premium IT expressway corridor', 'TCS, HCL, Infosys, Wipro campuses', 'Sector 150 green sports township', 'Jewar airport appreciation catalyst', '152% price rise since 2019'],
      major_employers: ['TCS (Sector 125)', 'HCL Technologies (Sectors 126–128)', 'Infosys (Sector 132)', 'Wipro (Sector 126)', 'Barclays Technology (Sector 137)', 'Samsung R&D (Sector 129)'],
      schools: [
        { name: 'Genesis Global School', type: 'IB/CBSE', note: '#1 International Day/Boarding School Noida, #2 Delhi NCR — CFore Rankings 2024' },
        { name: 'Apeejay School Noida', type: 'CBSE', note: '#1 Noida school by Times School Survey; top STEM and sports results' },
        { name: 'DPS Noida (Delhi Public School)', type: 'CBSE', note: 'Leading DPS campus; consistently high board results' },
      ],
      traffic: {
        peak_hours: 'Moderate on Noida–Greater Noida Expressway itself; sector approach roads can congest 8:30–10 am and 6–9 pm',
        metro_access: 'Aqua Line (Noida–Greater Noida Metro) — multiple stations along expressway including Sector 137, 142, 143, 144, 145, 147, 148, 149; operational since 2019',
        highway_access: 'Noida–Greater Noida Expressway — adjacent; Yamuna Expressway — 15 km; FNG Expressway — 5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Kailash Hospital Sector 27 (10 km)', 'Yatharth Hospital Sector 110 (3 km)', 'Jaypee Hospital Sector 128 (2 km)'],
        malls: ['Logix City Centre Sector 32 (8 km)', 'DLF Mall of India Sector 18 (10 km)', 'Spectrum Metro Mall (8 km)'],
        parks: ['Sector 150 Cricket Stadium greens', 'Botanical Garden Noida (10 km)', 'Okhla Bird Sanctuary (15 km)'],
      },
      investment_note: 'Noida Expressway is NCR\'s best-performing residential corridor — 152% appreciation since 2019. Aqua Line metro gives it connectivity advantage over Gurgaon suburbs. Rental yields at 4–5% are strong. Jewar Airport (expected 2025–26) is driving further demand. Sector 150 commands premium for sports-centric green design.',
    },

    'Noida Sec 44–52': {
      overview: 'Sector 18 (Atta Market) is Noida\'s commercial and retail heart — often called Noida\'s Connaught Place — with showrooms, restaurants, and offices. Sector 62 is Noida\'s established IT hub housing campuses of HCL, Wipro, and dozens of tech firms. Together they form the employment and commercial anchor of central Noida, with Blue Line metro connectivity and strong residential demand in adjacent sectors.',
      specialties: ['Noida\'s Connaught Place — Sector 18 retail', 'Sector 62 IT park belt', 'Blue Line metro connected', 'Central Noida employment hub', 'Strong rental demand'],
      major_employers: ['HCL Technologies Sector 60–62', 'Wipro Noida Sector 63', 'Cognizant Sector 62', 'NIIT Technologies', 'Adobe India Noida'],
      schools: [
        { name: 'DPS Noida (Delhi Public School)', type: 'CBSE', note: 'One of Noida\'s most reputed CBSE schools; strong board results' },
        { name: 'Ryan International School Noida', type: 'CBSE', note: 'Ryan chain campus; large school with good infrastructure' },
        { name: 'Amity International School Noida', type: 'CBSE', note: 'Amity group school; modern campus, competitive academics' },
      ],
      traffic: {
        peak_hours: 'Heavy near Sector 18 roundabout and Sector 62 IT park approach roads 8:30–10 am and 6–9 pm',
        metro_access: 'Sector 18 Station and Botanical Garden Station (Blue Line) — operational; direct Blue Line to Delhi',
        highway_access: 'Noida–Delhi Link Road — 2 km; NH-9 — 3 km; DND Flyway — 5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Kailash Hospital Sector 27 (3 km)', 'Max Hospital Sector 19 (2 km)', 'Fortis Hospital Sector 62 (1 km)'],
        malls: ['DLF Mall of India Sector 18 (1 km)', 'Great India Place (1 km)', 'Logix City Centre (1 km)'],
        parks: ['Botanical Garden (3 km)', 'Sector 18 Garden (local)'],
      },
      investment_note: 'Sector 18/62 belt delivers 8–10% appreciation with strong Blue Line metro connectivity. Rental yields at 4–5% from IT sector tenants in adjacent residential sectors (15, 19, 20, 31, 34). Good mid-market investment for investors targeting Noida IT workforce rentals. Entry prices are 30–40% below comparable Gurgaon localities.',
    },

    'Greater Noida West': {
      overview: 'Greater Noida West, popularly called Noida Extension, is NCR\'s largest affordable housing belt — a vast township of high-rise residential projects offering the lowest per-sqft prices in the region with good expressway connectivity. Over the past five years, delivery of delayed projects has resumed and buyer confidence has been restored. A proposed metro extension and proximity to Noida Expressway IT hubs drive continued demand.',
      specialties: ['NCR\'s largest affordable housing belt', 'Lowest per-sqft prices near Noida', 'Gaur City & Supertech township scale', 'Proposed metro extension', 'Young IT professional first-home market'],
      major_employers: ['Noida Expressway IT campuses (10 km)', 'HCL Noida (12 km)', 'TCS Noida (15 km)', 'Greater Noida Industrial Area (8 km)'],
      schools: [
        { name: 'Ryan International School Greater Noida West', type: 'CBSE', note: 'Ryan campus serving the Noida Extension belt' },
        { name: 'Orchids The International School Greater Noida', type: 'CBSE', note: 'Technology-forward CBSE school in the township' },
      ],
      traffic: {
        peak_hours: 'Heavy on Bisrakh Road and NH-9 approach 8:30–10:30 am and 6–9 pm; DND Flyway alternative available',
        metro_access: 'Aqua Line extension to Sector 2 Greater Noida West proposed; nearest operational: Noida Sector 101 (Aqua Line) — 4 km',
        highway_access: 'NH-9 (Delhi–Meerut Expressway) — 3 km; Noida–Greater Noida Expressway — 5 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Yatharth Super Speciality Hospital (3 km)', 'Sharda Hospital Greater Noida (5 km)', 'Kailash Hospital (8 km)'],
        malls: ['Gaur City Mall (local)', 'DLF Mall of India (12 km)', 'Logix Xpressions Mall (10 km)'],
        parks: ['Gaur City Central Park (local)', 'Botanical Garden Noida (14 km)'],
      },
      investment_note: 'Greater Noida West offers 8–11% appreciation at NCR\'s most affordable entry prices. Rental yields at 4.5–5% are among the region\'s best for the price point. Delivery of stalled projects has improved buyer confidence. Metro extension remains the key catalyst for the next leg of appreciation. Best for budget investors and NRIs seeking yield.',
    },

    'Dwarka Sectors': {
      overview: 'Dwarka is Delhi\'s largest planned residential township, developed by DDA across 29 sectors on the south-west fringe of the capital. It has excellent Blue Line metro connectivity to Connaught Place and Noida, direct access to IGI Airport via NH-48, and a large, stable middle-class and government employee population. The upcoming Dwarka Expressway (fully operational from 2024) has sharply boosted connectivity to Gurgaon.',
      specialties: ['Delhi\'s largest DDA planned township', 'Blue Line metro connectivity', 'Airport corridor (15 min to IGI)', 'Dwarka Expressway to Gurgaon', 'Stable government employee community'],
      major_employers: ['IGI Airport ecosystem (15 min)', 'Aerocity business district (10 km)', 'Gurgaon IT belt via Dwarka Expressway (20 min)', 'Indira Gandhi National Open University (IGNOU) campus'],
      schools: [
        { name: 'DPS Dwarka (Delhi Public School)', type: 'CBSE', note: 'Large DPS campus; one of Dwarka\'s most reputed schools' },
        { name: 'Kendriya Vidyalaya Dwarka', type: 'CBSE', note: 'Central government school; excellent quality at modest fees' },
        { name: 'Ryan International School Dwarka', type: 'CBSE', note: 'Well-attended Ryan campus in Dwarka' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on Dwarka Sector 10 Road and Palam Road during peak hours; airport traffic on NH-48 can cause delays',
        metro_access: 'Multiple Blue Line stations across Dwarka (Sector 10, 11, 12, 13, 14, 21 — Blue Line terminus); direct to Connaught Place, Noida',
        highway_access: 'NH-48 (Delhi–Jaipur) — 1 km; Dwarka Expressway (to Gurgaon) — 2 km; IGI Airport — 12 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Venkateshwar Hospital Dwarka (2 km)', 'Manipal Hospital Dwarka (3 km)', 'AIIMS Trauma Centre (10 km)'],
        malls: ['Pacific Mall Dwarka (3 km)', 'Vegas Mall Dwarka (2 km)', 'Ambience Mall Gurgaon (12 km)'],
        parks: ['Sector 10 & 23 DDA Parks (local)', 'Asola Bhatti Wildlife Sanctuary (15 km)'],
      },
      investment_note: 'Dwarka offers solid 8–10% appreciation driven by airport proximity, Dwarka Expressway opening, and Blue Line metro. Rental yields at 3.5–4.5% are steady from government and airline sector tenants. Aerocity business district growth is the key demand catalyst. One of Delhi\'s best value-for-money residential investments.',
    },

    'South Delhi': {
      overview: 'South Delhi\'s elite triangle — Defence Colony, Greater Kailash (GK 1 & 2), and Saket — represents Delhi\'s most established premium residential address. Wide tree-lined roads, diplomatic community presence, top hospitals (AIIMS), and proximity to South Delhi\'s best schools define the character. Supply is very constrained — most transactions are resale of old bungalows or premium apartments. Prices are among Delhi\'s highest.',
      specialties: ['Delhi\'s most prestigious residential triangle', 'Diplomatic community & embassy proximity', 'AIIMS & Safdarjung Hospital adjacency', 'Very low new supply', 'Metro Yellow & Magenta Lines served'],
      major_employers: ['AIIMS (All India Institute of Medical Sciences)', 'South Delhi government offices', 'Connaught Place CBD (12 km)', 'BKC-equivalent work from home premium market'],
      schools: [
        { name: 'Delhi Public School R.K. Puram', type: 'CBSE', note: 'One of India\'s most famous DPS schools; exceptional board results' },
        { name: 'Modern School Vasant Vihar', type: 'CBSE', note: 'Prestigious CBSE school in South Delhi; strong academic and alumni network' },
        { name: 'The Shri Ram School Vasant Vihar', type: 'CBSE', note: 'One of Delhi\'s most selective and reputed private schools' },
      ],
      traffic: {
        peak_hours: 'Moderate; Ring Road and Outer Ring Road can congest during peak hours; GK markets have internal parking constraints',
        metro_access: 'Lajpat Nagar, Moolchand (Violet Line); Hauz Khas (Yellow+Magenta interchange); Saket (Yellow Line); AIIMS (Yellow Line)',
        highway_access: 'Ring Road — adjacent; Outer Ring Road — 1 km; NH-48 via Dhaula Kuan — 4 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['AIIMS New Delhi (3 km)', 'Safdarjung Hospital (3 km)', 'Max Hospital Saket (1 km)'],
        malls: ['Select Citywalk Saket (2 km)', 'DLF Place Saket (2 km)', 'South Extension market (2 km)'],
        parks: ['Lodhi Garden (3 km)', 'Sanjay Van (2 km)', 'Hauz Khas Village & lake (3 km)'],
      },
      investment_note: 'South Delhi is premium capital preservation — 7–9% appreciation with near-zero new supply. Rental yields at 3–3.5% are modest but tenant quality is exceptional (diplomats, doctors, senior government officials). Best for HNI long-term holders. Properties here almost never depreciate; scarcity is structural.',
    },

  },
  // Day 3 (2026-06-22): Chennai
  'Chennai': {

    'Sholinganallur': {
      overview: 'Old Mahabalipuram Road (OMR) is Chennai\'s primary IT corridor, stretching ~45 km from Madhya Kailash to Siruseri SIPCOT. The northern stretch (Perungudi–Sholinganallur) is the densest IT zone, housing Tidel Park, SIPCOT IT Park, and campuses of Cognizant, Infosys, TCS, and Wipro. Chennai Metro Phase 2 Corridor 3 will bring metro stations to Perungudi, Sholinganallur, and beyond from 2026, which is expected to be transformative for this car-dependent corridor.',
      specialties: ['Chennai\'s primary 45 km IT corridor', 'Tidel Park & SIPCOT IT Park', 'Metro Phase 2 Corridor 3 pipeline', 'Coastal proximity (ECR 3 km)', 'Premium residential stock 2020–2025'],
      major_employers: ['Cognizant Technology Solutions (Sholinganallur)', 'Infosys Chennai', 'TCS (SIPCOT)', 'Wipro (Sholinganallur)', 'CGI Group', 'Hexaware Technologies'],
      schools: [
        { name: 'Gateway International School OMR', type: 'CBSE', note: 'Reputed CBSE school on OMR with international pedagogy approach' },
        { name: 'Shiv Nadar School Chennai', type: 'IB', note: 'Top IB school in Chennai; on OMR near Adyar River; serves Adyar, Besant Nagar, OMR' },
        { name: 'Orchids The International School OMR', type: 'CBSE', note: 'Technology-forward CBSE school serving OMR IT corridor families' },
      ],
      traffic: {
        peak_hours: 'Severely congested on OMR from Perungudi to Sholinganallur 8:30–10:30 am and 6–9 pm; corridor is heavily car-dependent with few alternatives',
        metro_access: 'Phase 2 Corridor 3 (Madhavaram–SIPCOT) under construction — Perungudi, Thoraipakkam, Sholinganallur stations planned; first section expected 2026',
        highway_access: 'East Coast Road (ECR) — 3 km via Sholinganallur; Chennai Port–Maduravoyal Expressway — 15 km; NH-32 — 12 km',
        congestion_level: 'Very High',
      },
      nearby_amenities: {
        hospitals: ['Gleneagles Global Health City (5 km)', 'MIOT International Hospital (10 km)', 'Apollo Hospitals Greams Road (12 km)'],
        malls: ['Phoenix Marketcity Chennai Velachery (8 km)', 'Grand Square Mall Perungudi (2 km)', 'Vivira Mall Navalur (5 km)'],
        parks: ['Perungudi Lake (local)', 'Sholinganallur Marsh Bird Sanctuary (2 km)', 'Adyar River Eco-Park (8 km)'],
      },
      investment_note: 'OMR delivers 8–11% appreciation with the strongest fundamentals in Chennai — largest IT workforce catchment and Phase 2 metro as a near-term catalyst. Rental yields at 4–5% with 2BHK rents of ₹22,000–40,000/mo. Metro Phase 2 opening (from 2026) will be the biggest price inflection point for the corridor in a decade.',
    },

    'Velachery': {
      overview: 'Velachery is Chennai\'s most well-connected mid-city suburb, sitting at the intersection of the Blue Line metro (Airport to Wimco Nagar) and Pallavaram–Taramani Road. It offers affordable-to-mid-range apartments with excellent access to the OMR IT corridor, the airport, and the city centre. A large, established residential population and strong rental demand from IT and BPO workers make it one of Chennai\'s most stable investment micro-markets.',
      specialties: ['Blue Line metro served', 'OMR IT corridor access (5 km)', 'Airport link (10 min to Blue Line terminus)', 'Affordable-to-mid residential market', 'Strong IT worker rental demand'],
      major_employers: ['OMR IT Park companies (5 km)', 'DLF IT Park Guindy (8 km)', 'Tidel Park (8 km)', 'Chennai Financial City (6 km)'],
      schools: [
        { name: 'Sishya School Velachery', type: 'CBSE', note: 'Reputed CBSE school in Velachery' },
        { name: 'SBOA School & Junior College', type: 'CBSE', note: 'Well-attended CBSE school popular in south-central Chennai' },
        { name: 'Kendriya Vidyalaya Velachery', type: 'CBSE', note: 'Central government school; excellent quality at accessible fees' },
      ],
      traffic: {
        peak_hours: 'Heavy on 100 Feet Road Velachery and Pallavaram–Taramani Road 8:30–10 am and 6–9 pm',
        metro_access: 'Velachery Metro Station (Blue Line — Phase 2 to connect directly; Phase 1 St Thomas Mount nearby — 3 km)',
        highway_access: 'GST Road (NH-32) — 4 km; OMR — 5 km; Chennai Airport — 10 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Apollo Hospital Greams (10 km)', 'Vijaya Hospital Vadapalani (6 km)', 'MIOT Hospital (8 km)'],
        malls: ['Phoenix Marketcity Velachery (1 km)', 'Grand Mall (2 km)', 'Saravana Stores nearby'],
        parks: ['Velachery Lake Park (2 km)', 'Adyar Eco Park (6 km)'],
      },
      investment_note: 'Velachery is one of Chennai\'s best-balanced investments — 8–10% appreciation with 4–5% rental yields at very accessible prices. Blue Line metro connectivity to the airport and city centre is a structural demand driver. One of the few Chennai localities where both IT workers and city commuters compete for the same rental stock, keeping vacancy very low.',
    },

    'Anna Nagar': {
      overview: 'Anna Nagar is Chennai\'s premier mid-to-premium residential address — a large BDA-planned township in the north-west developed in the 1970s, known for its wide roads, parks, tree cover, and excellent social infrastructure. It is the city\'s most aspirational owner-occupation address for middle and upper-middle class Chennaites. The Green Line metro (CMBT station) provides direct city-centre connectivity. Very limited new supply keeps prices firm.',
      specialties: ['Bangalore\'s BDA equivalent in Chennai', 'Green Line metro served (CMBT)', 'Excellent school & hospital belt', 'Wide roads & parks', 'Low new supply — strong resale market'],
      major_employers: ['Aminjikarai–Kilpauk commercial offices', 'Anna Nagar retail economy', 'Ambattur Industrial Estate (8 km)', 'KK Nagar BPO offices (5 km)'],
      schools: [
        { name: 'Chinmaya Vidyalaya Anna Nagar', type: 'CBSE', note: 'Renowned CBSE school; holistic education philosophy since 1989' },
        { name: 'Chennai Public School Anna Nagar', type: 'CBSE', note: 'Premium CBSE day school; balanced academic and co-curricular' },
        { name: 'The British School Chennai', type: 'IGCSE/IB', note: 'International school offering IGCSE and IB in Anna Nagar' },
      ],
      traffic: {
        peak_hours: 'Moderate; Anna Nagar 2nd Avenue and Junction can slow 8:30–10 am; internal roads are wide and generally manageable',
        metro_access: 'CMBT Station (Green Line) — 2 km; Koyambedu interchange area is the Green Line northern terminus cluster',
        highway_access: 'NH-48 (Chennai–Bengaluru) — 5 km; Outer Ring Road — 3 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Vijaya Hospital Vadapalani (5 km)', 'MIOT Hospital (6 km)', 'Apollo Hospitals Greams Road (8 km)'],
        malls: ['VR Chennai (5 km)', 'Ampa Skywalk (2 km)', 'Spencer Plaza (7 km)'],
        parks: ['Anna Nagar Tower Park (local)', 'Vadapalani Park (3 km)'],
      },
      investment_note: 'Anna Nagar delivers steady 8–9% appreciation in a mature township with near-zero new supply. Rental yields at 3.5–4.5% are moderate but vacancy is very low. Best for owner-occupation or long-term capital appreciation investors. Green Line metro connectivity adds a structural demand floor.',
    },

    'Adyar': {
      overview: 'Adyar is Chennai\'s most prestigious old-money residential address — a leafy, waterfront suburb alongside the Adyar River, home to the Theosophical Society\'s 260-acre campus. It attracts Chennai\'s elite, professionals, and diplomatic community. Current prices are among the city\'s highest at ~₹17,000/sqft. Very limited new supply and strong aspirational demand make it Chennai\'s equivalent of Bangalore\'s Indiranagar or Mumbai\'s Bandra West.',
      specialties: ['Chennai\'s most prestigious old-money address', 'Adyar River & Theosophical Society campus', 'Elite school belt (Besant Nagar nearby)', 'Very low new supply', 'Close to OMR IT corridor & Besant Nagar Beach'],
      major_employers: ['OMR IT corridor (7 km)', 'Central Government offices (Besant Nagar)', 'Theosophical Society campus', 'Chennai Financial City (8 km)'],
      schools: [
        { name: 'Shiv Nadar School Adyar', type: 'IB', note: 'Top IB school in Chennai; lush green campus on Adyar River bank' },
        { name: 'P.S. Senior Secondary School', type: 'CBSE', note: 'One of Chennai\'s oldest and most reputed CBSE schools' },
        { name: 'Padma Seshadri Bala Bhavan (PSBB)', type: 'CBSE', note: 'Highly regarded CBSE school; very competitive admissions' },
      ],
      traffic: {
        peak_hours: 'Moderate; Adyar Junction and Lattice Bridge Road slow during peak hours; generally less congested than north Chennai',
        metro_access: 'No metro directly — Phase 2 Corridor 5 (Madhavaram–Sholinganallur) will serve Adyar area; closest Phase 1: Little Mount (Blue Line) — 4 km',
        highway_access: 'GST Road via Guindy — 5 km; East Coast Road (ECR) — 3 km; OMR — 7 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Gleneagles Global Health City (3 km)', 'Chettinad Health City (8 km)', 'Apollo Hospitals (9 km)'],
        malls: ['Phoenix Marketcity Velachery (5 km)', 'Ampa Skywalk (8 km)'],
        parks: ['Theosophical Society 260-acre campus (local)', 'Besant Nagar Beach (2 km)', 'Adyar Eco-Park (1 km)'],
      },
      investment_note: 'Adyar is Chennai\'s premium capital preservation play at 8–10% appreciation with the city\'s highest per-sqft prices (~₹17,000). Rental yields at 3–4% are modest but tenant quality is exceptional. Scarcity is structural — almost no new launches. Best for HNI investors seeking Chennai\'s best address with long-term hold.',
    },

    'Porur': {
      overview: 'Porur is a rapidly growing western Chennai suburb anchored by the Ramapuram–Porur IT corridor and large integrated township projects. It offers affordable prices compared to OMR while serving the same IT workforce via the Mount–Poonamallee Road. The Green Line metro (St Thomas Mount to CMBT) passes nearby and Metro Phase 2 Corridor 4 (Lighthouse to Poonamallee) will directly serve the western belt.',
      specialties: ['West Chennai IT corridor', 'Affordable OMR-equivalent pricing', 'Metro Phase 2 Corridor 4 pipeline', 'Large township developments', 'NH-48 airport highway access'],
      major_employers: ['DLF IT Park (Ramapuram — 5 km)', 'Cognizant Ramapuram (5 km)', 'Zoho Corporation (Estancia IT Park — 8 km)', 'Mphasis (nearby IT parks)', 'Chennai Airport ecosystem (10 km)'],
      schools: [
        { name: 'Sri Vani School Porur', type: 'CBSE', note: 'Popular CBSE school in Porur serving west Chennai families' },
        { name: 'Kendriya Vidyalaya Porur', type: 'CBSE', note: 'Central government school in the Porur belt' },
        { name: 'Vidya Mandir School Porur', type: 'CBSE', note: 'Well-regarded CBSE school serving west Chennai' },
      ],
      traffic: {
        peak_hours: 'Heavy on Poonamallee High Road and Porur junction 8:30–10 am and 6–9 pm',
        metro_access: 'Metro Phase 2 Corridor 4 (Lighthouse–Poonamallee) under construction; will serve Porur area; nearest Phase 1: St Thomas Mount (Blue Line) — 5 km',
        highway_access: 'NH-48 (Chennai–Bengaluru highway) — 3 km; Chennai Airport — 10 km; Mount Poonamallee Road — adjacent',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['MIOT International Hospital (2 km)', 'Sri Ramachandra Medical Centre (3 km)', 'Vijaya Hospital (5 km)'],
        malls: ['Mega Mall Ambattur (6 km)', 'Express Avenue (10 km)'],
        parks: ['Porur Lake (2 km)', 'Poonamallee Lake (5 km)'],
      },
      investment_note: 'Porur offers 9–11% appreciation at prices 30–40% below OMR for comparable IT corridor access. Rental yields at 4.5–5% are among Chennai\'s strongest. Metro Phase 2 Corridor 4 is the key near-term catalyst. MIOT and Sri Ramachandra hospital proximity adds a healthcare worker demand stream. Best mid-market investment in west Chennai.',
    },

    'Ambattur': {
      overview: 'Ambattur is Chennai\'s largest industrial suburb and an emerging residential growth zone in north-west Chennai. Ambattur Industrial Estate houses manufacturing and IT-enabled services companies. The area offers the most affordable property in metropolitan Chennai with improving connectivity via the Mount–Poonamallee Road. Younger buyers and first-time homeowners are the primary demand base.',
      specialties: ['Chennai\'s largest industrial estate', 'Most affordable metro-area housing', 'IT-enabled services & manufacturing hub', 'Improving Green Line metro access', 'First-home buyer market'],
      major_employers: ['Ambattur Industrial Estate (IT-ITeS, electronics, manufacturing)', 'Nokia Solutions Ambattur', 'Flextronics', 'Standard Chartered GBS (nearby)', 'TVS Motor Company (nearby)'],
      schools: [
        { name: 'Chettinad Vidyashram Ambattur', type: 'CBSE', note: 'Part of Chettinad Education group; strong CBSE school' },
        { name: 'DAV Boys Senior Secondary School Ambattur', type: 'CBSE', note: 'Long-established DAV school in the Ambattur area' },
      ],
      traffic: {
        peak_hours: 'Heavy near Ambattur Estate Gate and Ambattur Junction 8–10 am and 6–9 pm; industrial vehicle traffic adds to congestion',
        metro_access: 'Green Line metro (Koyambedu–CMBT) accessible via feeder; Phase 2 Corridor 5 planned extension through north Chennai',
        highway_access: 'NH-16 (Chennai–Kolkata highway) — 4 km; Inner Ring Road — 3 km; Chennai Airport — 15 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Stanley Medical College Hospital (8 km)', 'Vijaya Hospital (8 km)', 'Balaji Medical & Diagnostic Centre (3 km)'],
        malls: ['Mega Mall Ambattur (2 km)', 'City Centre Mall Ambattur (3 km)'],
        parks: ['Ambattur Lake (1 km)', 'Kilpauk Garden (6 km)'],
      },
      investment_note: 'Ambattur offers 7–9% appreciation at Chennai\'s most affordable entry prices. Rental yields at 4.5–5% are strong driven by industrial and IT-ITeS workforce demand. Best for budget investors and first-time buyers — low entry price compensates for the modest growth trajectory. Ongoing connectivity improvements are the key upside driver.',
    },

  },
  // Day 3 (2026-06-22): Kolkata
  'Kolkata': {

    'Salt Lake Sector V': {
      overview: 'Salt Lake Sector V is Kolkata\'s Silicon Valley — a 430-acre dedicated IT park in Bidhannagar that is East India\'s largest and most mature technology cluster. With 12.3 million sq ft of Grade A office space, it houses Cognizant, TCS, Wipro, Infosys, SAP, Genpact, Capgemini, and hundreds of IT-ITeS firms. The Green Line metro (East-West corridor) connects Sector V directly to Howrah Maidan, making it India\'s first underwater metro through the Hooghly River.',
      specialties: ['East India\'s largest IT campus — 430 acres', 'Green Line metro — first underwater metro in India', '12.3 mn sqft Grade A office space', 'Cognizant, TCS, Wipro, SAP, Genpact cluster', 'Adjacent to Salt Lake residential township'],
      major_employers: ['Cognizant Technology Solutions', 'TCS (Tata Consultancy Services)', 'Wipro', 'Infosys', 'SAP India (Imagine Tech Park)', 'Genpact (Bengal Intelligent Park)', 'Capgemini'],
      schools: [
        { name: 'Apeejay School Salt Lake', type: 'CBSE', note: 'Well-regarded CBSE school in Salt Lake; strong academics' },
        { name: 'Kalyani Public School Salt Lake', type: 'CBSE', note: 'One of the best-known CBSE schools in Salt Lake' },
        { name: 'IEM Public School Salt Lake', type: 'CBSE/ICSE', note: 'Reputed multi-board school in Salt Lake Bidhannagar' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on Sector V main roads and VIP Road approach 8:30–10:30 am and 6–9 pm',
        metro_access: 'Salt Lake Sector V Station (Green Line — East-West Metro) — terminus; direct to Esplanade, Sealdah, Howrah and underwater Hooghly crossing',
        highway_access: 'VIP Road (Kolkata Airport) — 5 km; EM Bypass — 3 km; Rajarhat Expressway — 2 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['Apollo Gleneagles Hospital (5 km)', 'Tata Medical Centre (7 km)', 'AMRI Hospitals Salt Lake (2 km)'],
        malls: ['City Centre New Town (4 km)', 'Acropolis Mall (6 km)', 'Forum Courtyard (8 km)'],
        parks: ['Salt Lake Central Park (2 km)', 'Eco-Tourism Park New Town (4 km)'],
      },
      investment_note: 'Salt Lake Sector V residential belt (Sectors I–IV) delivers 8–10% appreciation driven by the Green Line metro and India\'s strongest East India IT employment base. Rental yields at 4–5% from Sector V IT workers. Entry prices are significantly lower than comparable IT hubs in Bangalore or Hyderabad — excellent value for investors targeting East India\'s growing IT workforce.',
    },

    'Rajarhat (IT Zone)': {
      overview: 'New Town Rajarhat is Kolkata\'s purpose-built smart city suburb — a vast planned township developed by HIDCO north of Salt Lake, housing Eco Tourism Park, the IT offices of Wipro and LTI Mindtree, and a growing ecosystem of residential towers, schools, and hospitals. Office absorption grew 3.5-fold from 2022 to 2024, with Wipro\'s 1.5 mn sqft and LTI Mindtree\'s 3.85 mn sqft campuses in development. Investors who bought in 2020–22 during metro construction are sitting on 40–50% gains.',
      specialties: ['HIDCO planned smart city township', '3.5× office leasing growth 2022–2024', 'Wipro & LTI Mindtree mega-campuses', 'Eco Tourism Park landmark', 'Orange Line metro & airport proximity'],
      major_employers: ['Wipro (1.5 mn sqft campus)', 'LTI Mindtree (3.85 mn sqft campus)', 'ITC Infotech (1.45 mn sqft)', 'Infosys Business Park (0.3 mn sqft)', 'Tech Mahindra New Town'],
      schools: [
        { name: 'The Newtown School', type: 'CBSE', note: 'Well-regarded CBSE school in New Town township' },
        { name: 'Orchids The International School New Town', type: 'CBSE', note: 'Technology-forward CBSE school in New Town' },
        { name: 'The Heritage School Anandapur', type: 'IB/IGCSE/CISCE', note: 'One of Kolkata\'s top international schools; multi-board curriculum' },
      ],
      traffic: {
        peak_hours: 'Moderate on New Town main roads; airport traffic on VIP Road can affect connectivity during peaks',
        metro_access: 'Orange Line (New Garia–Airport): Nazrul Tirtha to Chinar Park stations through New Town planned; partial section operational; Airport Line under construction',
        highway_access: 'VIP Road to Netaji Subhas Chandra Bose Airport — 8 km; Rajarhat–Newtown Expressway — adjacent; EM Bypass — 5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Tata Medical Centre (3 km)', 'AMRI Hospital Salt Lake (5 km)', 'Apollo Gleneagles (7 km)'],
        malls: ['City Centre New Town (1 km)', 'Acropolis Mall (5 km)'],
        parks: ['Eco-Tourism Park New Town (1 km)', 'Eco Park 480-acre urban park (local)', 'Hidco Lake Gardens'],
      },
      investment_note: 'New Town is Kolkata\'s best appreciation story — investors from 2020–22 have seen 40–50% gains. Current appreciation at 10–12% p.a. is driven by mega-IT campus completions and Orange Line metro. Entry prices at ₹5,000–8,500/sqft are far below comparable smart city suburbs in Bangalore or Pune. Rental yields at 4–5%. Best long-term investment in East India real estate.',
    },

    'Ballygunge': {
      overview: 'Ballygunge is Kolkata\'s most prestigious old-money residential address — a leafy, elite neighbourhood south of Park Street known for large heritage houses, exclusive clubs, premier educational institutions, and a refined Bengali cultural milieu. Property prices at ₹15,000–18,000/sqft rival South Mumbai or South Delhi values. New supply is near-zero and the area has maintained its prestige for over a century.',
      specialties: ['Kolkata\'s most prestigious address', 'Heritage houses & elite clubs', 'Top school belt (La Martinière, South Point)', 'Very limited new supply', 'Cultural & diplomatic community hub'],
      major_employers: ['Park Street–Camac Street commercial offices (2 km)', 'Government of West Bengal Secretariat (3 km)', 'Corporate offices in nearby Alipore', 'Medical institutions (SSKM Hospital nearby)'],
      schools: [
        { name: 'South Point High School', type: 'CBSE', note: 'One of Kolkata\'s most renowned schools; established 1970; very high demand' },
        { name: 'La Martinière for Boys', type: 'ISC/ICSE', note: 'Historic 1836-era elite school; one of India\'s most prestigious institutions' },
        { name: 'Calcutta International School', type: 'IB/Cambridge', note: 'Top IB school in Kolkata; adheres to international standards' },
      ],
      traffic: {
        peak_hours: 'Moderate; Ballygunge Circular Road and Gariahat crossing can slow during market hours; generally less chaotic than north Kolkata',
        metro_access: 'Rabindra Sarobar Station (Blue Line) — 1 km; Jatin Das Park Station — 1.5 km; Blue Line direct to Esplanade and Park Street',
        highway_access: 'EM Bypass — 4 km; Alipore Road — 2 km; Hazra Road — 0.5 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['SSKM Hospital (2 km)', 'Woodlands Medical Centre (2 km)', 'Peerless Hospital (3 km)'],
        malls: ['Gariahat Market (1 km)', 'Acropolis Mall (4 km)', 'Forum Mall Elgin Road (3 km)'],
        parks: ['Rabindra Sarobar Lake & Park (1 km)', 'Victoria Memorial Gardens (3 km)', 'Minto Park (2 km)'],
      },
      investment_note: 'Ballygunge is Kolkata\'s premium capital preservation play — 7–9% appreciation with structural scarcity. Prices at ₹15,000–18,000/sqft are Kolkata\'s highest. Rental yields at 3–4% are modest but tenant quality is exceptional. Near-zero new supply means prices here rarely decline. Best for HNI long-term holders and NRIs seeking a prestigious Kolkata address.',
    },

    'Alipore': {
      overview: 'Alipore is South Kolkata\'s most exclusive address — a quiet, ultra-low-density neighbourhood of colonial bungalows, diplomatic missions, and heritage properties adjacent to Zoological Gardens and the National Library. Extremely limited supply and the highest land values in Kolkata define this address. It is home to senior judiciary, government, and business elite and has a character entirely distinct from any other Indian city neighbourhood.',
      specialties: ['Kolkata\'s most exclusive address', 'Diplomatic missions & consulates', 'Ultra-low density & colonial bungalows', 'National Library & Zoo adjacency', 'Highest land values in Kolkata'],
      major_employers: ['Government of West Bengal establishments', 'Kolkata High Court (3 km)', 'Consulates and diplomatic missions', 'Maidan commercial precinct (4 km)'],
      schools: [
        { name: 'La Martinière for Girls', type: 'ISC/ICSE', note: 'Twin institution to La Martinière for Boys; elite historic school in Alipore' },
        { name: 'Modern High School for Girls', type: 'ICSE', note: 'One of Kolkata\'s most reputed girls\' schools' },
      ],
      traffic: {
        peak_hours: 'Low to moderate; Alipore is one of Kolkata\'s least congested premium areas thanks to low density and wide roads',
        metro_access: 'Jatin Das Park (Blue Line) — 2 km; Rabindra Sarobar (Blue Line) — 2 km',
        highway_access: 'Garden Reach Road — 2 km; Diamond Harbour Road — 3 km; Hastings — 2 km',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['SSKM Hospital (2 km)', 'Woodlands Multi Speciality Hospital (1 km)', 'Fortis Hospital Rash Behari (3 km)'],
        malls: ['Forum Mall Elgin Road (3 km)', 'South City Mall (5 km)'],
        parks: ['Alipore Zoological Garden (0.5 km)', 'National Library grounds (0.5 km)', 'Victoria Memorial (3 km)'],
      },
      investment_note: 'Alipore is Kolkata\'s most exclusive capital store — 7–8% appreciation but transactions are extremely rare. Entry is institutional or HNI only. Rental yields at 3–3.5% are modest given Kolkata\'s luxury supply. The area\'s character and historical importance give it permanent scarcity value unlike any other Kolkata neighbourhood.',
    },

    'Tollygunj': {
      overview: 'Tollygunge is a well-established south Kolkata suburb known for the historic Tollygunge Club (golf & sports), Rabindra Sarobar lake, and proximity to the Bengali film industry (Tollywood). It offers a mature residential environment with excellent Blue Line metro connectivity and good schools and hospitals. Mid-to-premium apartments and older South Kolkata housing stock attract families seeking a quieter, green environment.',
      specialties: ['Tollygunge Club (golf) landmark', 'Rabindra Sarobar lakeside lifestyle', 'Blue Line metro — multiple stations', 'Tollywood (Bengali film industry) adjacency', 'Established south Kolkata family suburb'],
      major_employers: ['Tollygunge Club & hospitality sector', 'South Kolkata commercial offices', 'Alipore govt establishments (3 km)', 'Ballygunge corporate belt (3 km)'],
      schools: [
        { name: 'South Point High School (Tollygunge campus)', type: 'CBSE', note: 'Branch of Kolkata\'s most renowned CBSE school' },
        { name: 'Kendriya Vidyalaya Tollygunge', type: 'CBSE', note: 'Central government school; consistent quality at accessible fees' },
        { name: 'Sishir Bhaduri Memorial High School', type: 'State/CBSE', note: 'Well-regarded local school in south Kolkata' },
      ],
      traffic: {
        peak_hours: 'Moderate; Tollygunge Circular Road and Rashbehari Connector can slow during peak hours; generally better than north Kolkata',
        metro_access: 'Tollygunge Station and Mahanayak Uttam Kumar Station (Blue Line) — on line; direct to Park Street, Esplanade, Dum Dum',
        highway_access: 'EM Bypass — 5 km; Diamond Harbour Road — 3 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Fortis Hospital Rash Behari (2 km)', 'Peerless Hospital (3 km)', 'CMRI Hospital (4 km)'],
        malls: ['South City Mall (2 km)', 'Forum Mall Elgin Road (4 km)', 'Acropolis Mall (7 km)'],
        parks: ['Rabindra Sarobar (1 km)', 'Tollygunge Club golf course & grounds (1 km)'],
      },
      investment_note: 'Tollygunge delivers steady 7–9% appreciation backed by Blue Line metro, Rabindra Sarobar lifestyle, and school proximity. Rental yields at 4–5% are among south Kolkata\'s better numbers. Lower entry price than Ballygunge for comparable connectivity and green environment. Good balanced investment for conservative Kolkata buyers.',
    },

  },
  // Day 3 (2026-06-22): Ahmedabad
  'Ahmedabad': {

    'SG Highway (North)': {
      overview: 'Sarkhej-Gandhinagar Highway (SG Highway) is Ahmedabad\'s commercial and residential spine — a 30-km arterial that has transformed into the city\'s most coveted mixed-use corridor. Lined with Grade A IT parks, retail malls, and premium residences, it is home to the largest concentration of MNC offices in Gujarat. The Blue Line metro (Thaltej Gam–Vastral Gam, operational Dec 2024) and a dense BRTS network form the transit backbone. SG Highway is the first address Ahmedabad buyers look at for work-live proximity.',
      specialties: ['Ahmedabad\'s prime commercial-residential corridor', 'Largest MNC office concentration in Gujarat', 'Blue Line metro — Thaltej end (Dec 2024)', '15–22% annual appreciation zone', 'Parshwanath & Pinnacle business hubs'],
      major_employers: ['TCS (Tata Consultancy Services)', 'Wipro Technologies', 'HCL Technologies', 'Capgemini', 'Parshwanath Business Park', 'Pinnacle Business Park', 'KPMG India'],
      schools: [
        { name: 'Udgam School for Children', type: 'CBSE/IB DP', note: 'One of Ahmedabad\'s best schools; IB Diploma Programme; founded 1965; SG Highway corridor' },
        { name: 'Anand Niketan School', type: 'CBSE', note: 'Highly regarded CBSE school on SG Highway; strong academics and sports' },
        { name: 'Vibgyor High School', type: 'CBSE/ICSE', note: 'Well-known multi-board school; multiple campuses along SG Highway belt' },
        { name: 'Delhi Public School (DPS) Bopal', type: 'CBSE', note: '11-acre co-ed CBSE school; established 1996; near SG Highway south end' },
      ],
      traffic: {
        peak_hours: 'Heavy on SG Highway main road during 8:30–10:30 am and 6–9 pm; Bopal Junction and Prahlad Nagar junction are worst spots; BRTS lanes improve bus flow',
        metro_access: 'Blue Line (East-West): Thaltej Gam (terminus) and Thaltej stations — opened Dec 2024; 12.5 km Bopal-Sanathal extension planned. BRTS: frequent services along entire SG Highway corridor',
        highway_access: '132 Feet Ring Road — intersects at multiple points; Sarkhej-Gandhinagar NH-147 — forms the corridor; Airport via NH-48 — 12 km',
        congestion_level: 'High',
      },
      nearby_amenities: {
        hospitals: ['HCG Cancer Centre SG Highway (2 km)', 'SAL Hospital SG Highway (3 km)', 'Zydus Hospitals (5 km)'],
        malls: ['Iscon Mega Mall (3 km)', 'Westgate Mall SG Highway (2 km)', 'Alpha One Mall (4 km)'],
        parks: ['Vastrapur Lake (4 km)', 'Science City (8 km)', 'Kankaria Lake (12 km)'],
      },
      investment_note: 'SG Highway is Ahmedabad\'s strongest appreciation story — 15–22% per year in premium pockets, 25–35% cumulative over 5 years. Prices at ₹8,000–10,500/sqft are still far below comparable Bangalore or Hyderabad IT corridors. Rental yields at 4–5% from IT professionals make it a strong income play. Blue Line metro at Thaltej unlocks further capital gain. Best all-round Ahmedabad investment for 2024–2027.',
    },

    'Prahlad Nagar': {
      overview: 'Prahlad Nagar is Ahmedabad\'s most sought-after west side premium residential address — a dense, walkable neighbourhood just off SG Highway packed with corporate offices, schools, hospitals, and retail. Flat prices average ₹8,250/sqft with 3 BHK units at ₹1.35–1.85 cr. The area attracts IT professionals working on SG Highway for its walk-to-office culture, strong infrastructure, and curated lifestyle options.',
      specialties: ['Most sought-after west Ahmedabad premium address', 'Walk-to-office from SG Highway IT parks', 'Adjacent to SG Highway IT corridor', '29.9% appreciation in 5 years', 'Blue Line metro at Thaltej (2 km)'],
      major_employers: ['Parshwanath Business Park (SG Highway) — 1 km', 'Pinnacle Business Park — 2 km', 'Vodafone Corporate House, Prahlad Nagar Corporate Road', 'KPMG & IT companies on Corporate Road'],
      schools: [
        { name: 'DAV International School', type: 'CBSE/IB', note: 'Located on Prahlad Nagar Corporate Road; international curriculum; well-regarded in west Ahmedabad' },
        { name: 'Udgam School for Children', type: 'CBSE/IB DP', note: 'One of Gujarat\'s best schools; accessible from Prahlad Nagar' },
        { name: 'Anand Niketan School', type: 'CBSE', note: 'Top CBSE school; Prahlad Nagar belt; strong academics and sports' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on 100 Ft Road and SG Highway approach; internal colony roads are calmer',
        metro_access: 'Blue Line: Thaltej Station — 2 km via SG Highway. BRTS available on SG Highway (0.5 km)',
        highway_access: 'SG Highway — 0.5 km; 132 Ft Ring Road — 1 km; Airport via SG Highway — 10 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Sterling Hospitals (1.5 km)', 'HCG Cancer Centre (2 km)', 'Zydus Hospital (3 km)'],
        malls: ['Westgate Mall (1 km)', 'Iscon Mega Mall (2 km)', 'Alpha One Mall (4 km)'],
        parks: ['Vastrapur Lake (2 km)', 'Prahlad Nagar Garden (local)', 'Law Garden (3 km)'],
      },
      investment_note: 'Prahlad Nagar delivers reliable 10–14% annual appreciation driven by SG Highway employment proximity and scarce supply. Prices at ₹8,250/sqft have grown 29.9% in 5 years with 14.6% in the last 3 years. Rental yield at 3% is modest but tenants are high-income IT professionals ensuring low vacancy. Good buy-and-hold for investors wanting stability and prestige within west Ahmedabad.',
    },

    'GIFT City': {
      overview: 'GIFT City (Gujarat International Finance Tec-City) is India\'s first operational smart city and International Financial Services Centre (IFSC), located on the Ahmedabad-Gandhinagar Expressway, 15 km north of Ahmedabad. It hosts 250+ financial firms and global MNCs including Oracle, Bank of America, and TCS, governed by IFSCA under a special regulatory framework. The Violet Line metro spur (GNLU–GIFT City, opened Sept 2024) provides direct metro access. Property prices surged 61.5% in 3 years — India\'s highest appreciation rate for any new township.',
      specialties: ['India\'s first IFSC and operational smart city', 'Violet Line metro spur — direct to GIFT City (Sept 2024)', 'Oracle, Bank of America, TCS, HDFC, SBI', '61.5% price appreciation in 3 years', 'IIT Gandhinagar, GNLU, international universities nearby'],
      major_employers: ['Oracle Financial Services', 'Bank of America (BofA Continuum)', 'TCS GDC GIFT City', 'HDFC Bank IFSC unit', 'SBI IFSC unit', 'NSE IFSC', 'BSE International Exchange'],
      schools: [
        { name: 'Jamnabai Narsee International School', type: 'IB/IGCSE', note: 'Top IB school near GIFT City; strong for families of IFSC financial sector professionals' },
        { name: 'Podar International School', type: 'CBSE/IB', note: 'Reputed multi-board school serving the Gandhinagar-GIFT City belt' },
      ],
      traffic: {
        peak_hours: 'Low to moderate; GIFT City is a purpose-built township with wide roads; Expressway is smooth and uncongested',
        metro_access: 'Violet Line spur: GNLU Station to GIFT City Station — opened September 2024. Yellow Line: Motera to Mahatma Mandir Gandhinagar — fully open January 2026 (direct Ahmedabad–Gandhinagar metro)',
        highway_access: 'Ahmedabad-Gandhinagar Expressway — adjacent (5 min to Ahmedabad); SG Highway — 10 km; BRTS interchange at Koba',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['SMVS Swaminarayan Hospital (3 km)', 'SGS Super Speciality Hospital (4 km)', 'SCAI Superspeciality Hospital (3 km)'],
        malls: ['GIFT City retail zone (internal)', 'Gandhinagar commercial precinct (5 km)'],
        parks: ['GIFT City landscaped gardens (internal)', 'Sabarmati Riverfront (12 km)'],
      },
      investment_note: 'GIFT City is Ahmedabad\'s highest-conviction long-term bet — 61.5% rise in 3 years, 10.5% last year, pricing at ₹8,500–12,800/sqft. The IFSCA regulatory advantage and USD-denominated financial sector jobs create uniquely durable demand. Violet Line metro is already priced in; Yellow Line Gandhinagar connectivity adds further appeal. Best for investors targeting the 5–10 year India financial infrastructure cycle.',
    },

    'Bopal': {
      overview: 'Bopal and South Bopal are the most popular affordable-to-mid-premium residential suburbs of west Ahmedabad, attracting IT families working on SG Highway and young professionals priced out of Prahlad Nagar. The area has grown from a peripheral village to a dense township over 15 years, with wide roads, a strong school belt (DPS, Apollo International), and BRTS connectivity. A planned 12.5 km metro extension to Sanathal via Bopal and Shela is the next major value unlock.',
      specialties: ['Best affordable west Ahmedabad for IT families', 'DPS Bopal (11-acre campus) & Apollo International School', 'BRTS connectivity; planned 12.5 km metro extension to Bopal', 'SG Highway IT parks within 7 km', '28.6% appreciation in 5 years at entry pricing'],
      major_employers: ['SG Highway IT parks — 7 km', 'Parshwanath Business Hub (Bodakdev) — 5 km', 'Sun Pharma Ahmedabad — 10 km', 'Ahmedabad retail and logistics sector'],
      schools: [
        { name: 'Delhi Public School (DPS) Bopal', type: 'CBSE', note: '11-acre co-ed CBSE school; established 1996; Ahmedabad\'s most popular DPS campus' },
        { name: 'Apollo International School (AIS)', type: 'CBSE', note: 'Located in South Bopal; co-ed CBSE; growing reputation in west Ahmedabad' },
        { name: 'New Tulip International School', type: 'CBSE', note: 'English medium CBSE school; well established in Bopal residential belt' },
        { name: 'Shivashish School', type: 'CBSE', note: 'Popular CBSE school in Bopal; affordable fees; solid academics' },
      ],
      traffic: {
        peak_hours: 'Moderate on Bopal-Ghuma Road and South Bopal main road; Shela junction can slow; BRTS from SG Highway is main commute route',
        metro_access: 'Nearest metro: Thaltej Gam Station (Blue Line) — 8 km via SG Highway. Planned: 12.5 km metro spur to Sanathal via Bopal and Shela (under planning, no confirmed date)',
        highway_access: 'SG Highway — 5 km; 132 Ft Ring Road — 4 km; Satellite–Bopal Road — main arterial',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Zydus Hospital (6 km)', 'HCG Hospital SG Highway (7 km)', 'Parth Children Hospital Bopal (local)'],
        malls: ['Westgate Mall (6 km)', 'Applewoods Township retail (local)', 'Iscon Mega Mall (8 km)'],
        parks: ['Vastrapur Lake (7 km)', 'Bopal-Ghuma open spaces', 'Science City (10 km)'],
      },
      investment_note: 'Bopal/South Bopal offers Ahmedabad\'s best value: entry at ₹4,650–6,500/sqft, 4% rental yield (among the city\'s best), and 28.6% over 5 years. The planned metro extension to Bopal is the next catalyst that could drive 20–30% appreciation on announcement. DPS Bopal and Apollo International are strong family demand magnets. Best entry-level west Ahmedabad investment with high upside optionality.',
    },

    'Navrangpura': {
      overview: 'Satellite and Navrangpura form Ahmedabad\'s premium central-west belt — mature, densely developed neighbourhoods home to IIM Ahmedabad, Gujarat University, Law Garden, and the city\'s corporate and professional class. Satellite averages ₹8,200–8,500/sqft with 10.4% appreciation last year. The Blue Line metro passes through Navrangpura (Shreyas and Commerce Six Roads stations), making it one of the best-connected central zones. CG Road is Ahmedabad\'s finest dining and retail street.',
      specialties: ['IIM Ahmedabad adjacency (4 km)', 'Gujarat University & top colleges in Navrangpura', 'Blue Line metro — Shreyas & Commerce Six Roads stations', 'Law Garden & CG Road retail/dining', 'Premium central address with no new land supply'],
      major_employers: ['IIM Ahmedabad campus (faculty, admin)', 'Gujarat High Court (Navrangpura) — 3 km', 'CG Road commercial offices', 'Gujarat University staff', 'Insurance & banking offices along Navrangpura Road'],
      schools: [
        { name: 'Udgam School for Children', type: 'CBSE/IB DP', note: 'Ahmedabad\'s best known IB school; flagship campus near Navrangpura; top choice in the area' },
        { name: 'H.B. Kapadia New High School', type: 'CBSE/ICSE/IB', note: 'Established multi-board institution in Navrangpura; strong track record' },
        { name: 'Sheth Motilal Hirabhai Bhavan', type: 'IB/IGCSE', note: 'Top IB/IGCSE school at Ellis Bridge near Navrangpura' },
        { name: 'Anand Niketan School', type: 'CBSE', note: 'Well-regarded CBSE school with Satellite branch; strong co-curriculars' },
      ],
      traffic: {
        peak_hours: 'Moderate to heavy on CG Road and Nehru Bridge approaches; internal SG Highway and satellite road manageable with BRTS',
        metro_access: 'Blue Line (East-West): Commerce Six Roads Station and Shreyas Station — operational; direct to Thaltej (west) and Vastral Gam (east). BRTS well developed on Satellite Road',
        highway_access: '132 Ft Ring Road — 1 km; SG Highway — 3 km; Ashram Road (riverfront) — 2 km',
        congestion_level: 'Moderate',
      },
      nearby_amenities: {
        hospitals: ['Shalby Hospital (SG Highway — 4 km)', 'Apollo Hospitals (Bhat — 5 km)', 'Rajasthan Hospital Shahibaug (7 km)'],
        malls: ['Iscon Mega Mall (2 km)', 'Alpha One Mall (3 km)', 'The Grand Highstreet Satellite (local)'],
        parks: ['Vastrapur Lake (3 km)', 'Law Garden (1 km)', 'Sabarmati Riverfront (3 km)'],
      },
      investment_note: 'Satellite/Navrangpura delivers 10–12% annual appreciation backed by IIM Ahmedabad premium, Blue Line metro, and near-zero new land supply. Prices at ₹7,500–8,500/sqft are strong but still 50–60% below Mumbai equivalents. Rental yields at 3.5–4.5% from students, young professionals, and academics. Best for buyers wanting a premium central Ahmedabad address with institutional prestige.',
    },

    'Bodakdev': {
      overview: 'Bodakdev is west Ahmedabad\'s most upscale residential enclave — a leafy, low-density suburb between SG Highway and Satellite with luxury villa row houses, premium high-rises, and the headquarters of Zydus Lifesciences. Home to Ahmedabad International School (IB/IGCSE) and Zydus School for Excellence, it attracts senior executives and Gujarat\'s business families. The Blue Line metro at Thaltej Gam (2 km, opened Dec 2024) has driven 10–12% price appreciation since opening.',
      specialties: ['Ahmedabad\'s most upscale residential enclave', 'Low density — luxury villas & premium high-rises', 'Ahmedabad International School (IB/IGCSE)', 'Zydus Lifesciences headquarters adjacency', 'Blue Line metro at Thaltej — 2 km (Dec 2024)'],
      major_employers: ['Zydus Lifesciences (headquarters)', 'SG Highway IT parks — 3 km', 'Sun Pharma Ahmedabad — 8 km', 'Large Gujarat corporate offices nearby'],
      schools: [
        { name: 'Ahmedabad International School', type: 'IB/IGCSE', note: 'Top international school in Ahmedabad; IB MYP and Diploma; premium campus in Bodakdev' },
        { name: 'Zydus School for Excellence', type: 'CBSE', note: 'Founded by Zydus Group; modern campus with strong CBSE programme in Bodakdev' },
        { name: 'Udgam School for Children', type: 'CBSE/IB DP', note: 'One of Gujarat\'s best schools; accessible from Bodakdev' },
      ],
      traffic: {
        peak_hours: 'Low to moderate; Bodakdev\'s internal roads are wide and low-density; SG Highway approach can be heavy during peaks',
        metro_access: 'Blue Line: Thaltej Gam Station (eastern terminus of west extension, opened Dec 2024) — 2 km drive; BRTS available on adjacent SG Highway',
        highway_access: 'SG Highway — 1 km; 132 Ft Ring Road — 2 km; Sindhubhavan Road — 0.5 km (main arterial)',
        congestion_level: 'Low',
      },
      nearby_amenities: {
        hospitals: ['HCG Cancer Centre (2 km)', 'Sterling Hospital Ahmedabad (3 km)', 'Zydus Hospitals (2 km)'],
        malls: ['Westgate Mall (3 km)', 'Iscon Mega Mall (4 km)', 'Sindhubhavan Road retail strip (local)'],
        parks: ['Vastrapur Lake (3 km)', 'Bodakdev Garden (local)', 'Science City (8 km)'],
      },
      investment_note: 'Bodakdev is Ahmedabad\'s prestige capital preservation play — 10–12% steady appreciation, very limited new supply, and a tenant base of senior executives and business families. Prices at ₹12,000–18,000/sqft for premium units are Ahmedabad\'s highest outside GIFT City. Rental yields at 3–3.5% are modest but tenant quality is exceptional. Best for HNI buyers seeking a prestigious low-density Ahmedabad address.',
    },

  },
};
