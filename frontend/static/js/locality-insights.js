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
      investment_note: 'Kondapur offers a balanced investment with 9% appreciation and 5.5–6% rental yield — entry prices are lower than Gachibowli making the yield more attractive for rental investors. Metro connectivity has been a sustained value driver since 2018.',
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

  // Cities to be added in subsequent days:
  'Bangalore': {},
  'Pune': {},
  'Mumbai': {},
  'Delhi NCR': {},
  'Chennai': {},
  'Kolkata': {},
  'Ahmedabad': {},
};
