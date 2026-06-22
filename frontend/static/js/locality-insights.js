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
  'Pune': {},
  'Mumbai': {},
  'Delhi NCR': {},
  'Chennai': {},
  'Kolkata': {},
  'Ahmedabad': {},
};
