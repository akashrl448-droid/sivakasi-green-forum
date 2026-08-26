const { db } = require('./index');

const newProjects = [
  // ==================== COMPLETED (6 Projects) ====================
  {
    title: 'Miyawaki Island',
    slug: 'miyawaki-island',
    category: 'completed',
    project_category_tag: 'Afforestation',
    location: 'Periyakulam Kanmai, Sivakasi',
    short_description: '2,000 native trees planted on 7,500 sq ft creating a self-sustaining urban mini-forest.',
    description: 'Transforming a barren patch of land along the Periyakulam water body into an ultra-dense, multi-layered native forest using Akira Miyawaki methodologies. The forest now thrives with over 35 indigenous species including Neem, Mahua, Pongamia, and Banyan.',
    cover_image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&q=80'
    ]),
    start_date: '2020-09-01',
    end_date: '2021-03-01',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Establish 2,000 native saplings in 7,500 sq ft',
      'Lower localized temperature by 2-3 degrees Celsius',
      'Create a habitat corridor for urban pollinators and nesting birds',
      'Conduct community planting masterclasses for 300+ volunteers'
    ]),
    impact: '100% canopy closure achieved; 40+ species of birds and butterflies documented on site.',
    progress: 100,
    status: 'published',
    display_order: 1
  },
  {
    title: 'Sengulam Kanmai Desilting',
    slug: 'sengulam-kanmai-desilting',
    category: 'completed',
    project_category_tag: 'Water Restoration',
    location: 'Sengulam Reservoir, Sivakasi',
    short_description: 'Desilting and sewage separation across 72 acres to revive fresh local water reservoir storage.',
    description: 'Sengulam Kanmai had suffered from decades of industrial runoff accumulation and silt buildup. SGF excavated over 45,000 cubic meters of silt, restored embankment bunds, and diverted domestic drains through bio-retention filters.',
    cover_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&q=80'
    ]),
    start_date: '2021-12-01',
    end_date: '2022-08-01',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Excavate 45,000 cu.m of fertile silt and distribute to local farmers',
      'Reinforce 1.8 km of perimeter bund with stone riprap and vetiver',
      'Increase monsoon water storage capacity by 65 million liters'
    ]),
    impact: 'Storage capacity boosted by 65M liters, recharging 80+ agricultural wells in the surrounding belt.',
    progress: 100,
    status: 'published',
    display_order: 2
  },
  {
    title: 'Chinna Kulam Revival',
    slug: 'chinna-kulam-revival',
    category: 'completed',
    project_category_tag: 'Water Restoration',
    location: 'Chinna Kulam, Sivakasi',
    short_description: 'Restoring native aquatic plant life and shoreline habitat along the Chinna Kulam basin.',
    description: 'Chinna Kulam was overgrown with invasive water hyacinth and choked with debris. Our volunteer drives cleared the surface, constructed sediment settling traps, and introduced native lilies and wetland reeds.',
    cover_image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&q=80',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=700&q=80'
    ]),
    start_date: '2023-03-01',
    end_date: '2023-11-01',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Eradicate 100% invasive weed biomass',
      'Introduce floating wetland bio-filter beds',
      'Create pedestrian walking track and native shade tree perimeter'
    ]),
    impact: 'Pond water clarity improved by 70%, dissolved oxygen doubled, and local aquatic life restored.',
    progress: 100,
    status: 'published',
    display_order: 3
  },
  {
    title: 'School Green Cover Drive',
    slug: 'school-green-cover-drive',
    category: 'completed',
    project_category_tag: 'Afforestation',
    location: '14 Schools across Sivakasi Taluk',
    short_description: 'Plantation of 1,850 native shade and fruit-bearing trees across 14 government school campuses.',
    description: 'Engaged over 3,200 school children in environmental stewardship by establishing school orchards and native micro-woodlots. Each school formed an active student Eco-Club equipped with drip irrigation kits.',
    cover_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80',
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=700&q=80'
    ]),
    start_date: '2023-01-10',
    end_date: '2023-06-15',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Plant 1,850 native fruit and shade trees',
      'Form 14 active Eco-Clubs in government schools',
      'Provide organic gardening and composting workshops'
    ]),
    impact: '1,850 trees thriving with 92% survival rate; 3,200 students actively participating in weekly maintenance.',
    progress: 100,
    status: 'published',
    display_order: 4
  },
  {
    title: 'Thiruthangal Roadside Avenue Planting',
    slug: 'thiruthangal-roadside-avenue-planting',
    category: 'completed',
    project_category_tag: 'Urban Greening',
    location: 'Thiruthangal Link Highway',
    short_description: '4.5 km green corridor of Neem, Pungai, and Vaagai trees along the approach highway.',
    description: 'To counter vehicle emissions and extreme road surface temperatures, SGF collaborated with highway authorities to plant 750 sturdy, mature saplings protected with tree guards.',
    cover_image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=700&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80'
    ]),
    start_date: '2023-08-01',
    end_date: '2024-02-20',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Establish 4.5 km of continuous shade tree canopy',
      'Install metal tree guards and automated solar water tankers',
      'Significantly reduce road dust particulate matter'
    ]),
    impact: '750 trees established with 88% survival rate, creating a cooling microclimate along the busy commuter route.',
    progress: 100,
    status: 'published',
    display_order: 5
  },
  {
    title: 'Sivakasi Heritage Well Mapping & Revival',
    slug: 'sivakasi-heritage-well-mapping-revival',
    category: 'completed',
    project_category_tag: 'Water Restoration',
    location: 'Old Town Sivakasi',
    short_description: 'Comprehensive hydrogeological mapping of 35 heritage open wells and restoration of 12 key public wells.',
    description: 'Documented historical open wells that once supplied Sivakasi with potable spring water. Cleaned out debris, sanitized shafts, rebuilt parapet walls, and directed rooftop runoff into recharge channels.',
    cover_image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=700&q=80',
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80'
    ]),
    start_date: '2024-01-15',
    end_date: '2024-09-30',
    expected_completion_date: null,
    objectives: JSON.stringify([
      'Map 35 heritage wells with GPS and water quality metrics',
      'Desilt and structurally reinforce 12 prime public wells',
      'Install safety covers and manual pulley systems for community access'
    ]),
    impact: '12 heritage wells revived, providing supplementary water to 2,400 households during dry summer seasons.',
    progress: 100,
    status: 'published',
    display_order: 6
  },

  // ==================== ONGOING (6 Projects) ====================
  {
    title: 'Delta Floodplain Reconnection',
    slug: 'delta-floodplain-reconnection',
    category: 'ongoing',
    project_category_tag: 'Water Restoration',
    location: 'North Delta Region, Sivakasi',
    short_description: 'Reconnecting 340 acres of historic floodplain to reduce flood risk and rebuild native wetland habitat.',
    description: 'For four decades, a disconnected levee cut off 340 acres of natural floodplain from the catchment channel. SGF is reopening this connection in phased breaches to allow seasonal waters to nourish aquifers.',
    cover_image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=700&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=700&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80'
    ]),
    start_date: '2025-03-01',
    end_date: null,
    expected_completion_date: '2026-12-01',
    objectives: JSON.stringify([
      'Reconnect 340 acres of historic floodplain to the channel',
      'Reduce peak monsoon flood levels for 3 downstream villages',
      'Re-establish native wetland vegetation and nursery grounds'
    ]),
    impact: '220 acres successfully reconnected; levee breach phase 2 complete ahead of schedule.',
    progress: 65,
    status: 'published',
    display_order: 7
  },
  {
    title: 'Periyakulam Miyawaki — Phase II',
    slug: 'periyakulam-miyawaki-phase-2',
    category: 'ongoing',
    project_category_tag: 'Afforestation',
    location: 'Periyakulam West Bund',
    short_description: 'Expanding the original mini-forest by another 5,000 sq ft with 1,200 additional native saplings.',
    description: 'Building on the runaway success of our 2021 Miyawaki Island, Phase II expands the dense green canopy along the west embankment, incorporating medicinal herbs and endangered indigenous trees.',
    cover_image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=700&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80'
    ]),
    start_date: '2025-07-01',
    end_date: null,
    expected_completion_date: '2027-02-01',
    objectives: JSON.stringify([
      'Plant 1,200 dense saplings across 5,000 sq ft',
      'Install smart solar-powered micro-drip irrigation',
      'Integrate 15 rare indigenous medicinal tree species'
    ]),
    impact: '480 saplings already planted by 120 community volunteers; root anchoring complete.',
    progress: 40,
    status: 'published',
    display_order: 8
  },
  {
    title: 'Vellaikulam Lake Restoration Project',
    slug: 'vellaikulam-lake-restoration',
    category: 'ongoing',
    project_category_tag: 'Water Restoration',
    location: 'Vellaikulam, Sivakasi',
    short_description: 'Deep desilting of 48-acre storage basin, strengthening inlet feeder channels, and creating an outer tree bund.',
    description: 'A critical watershed recharge reservoir for Sivakasi. Our heavy machinery teams and volunteer corps are clearing silt, opening encroached feeder canals, and planting 1,000 Palmyra palms along the bund to prevent erosion.',
    cover_image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&q=80'
    ]),
    start_date: '2025-06-01',
    end_date: null,
    expected_completion_date: '2026-11-30',
    objectives: JSON.stringify([
      'Desilt 30,000 cu.m of bottom sediment',
      'Reconstruct 2 inlet sluice gates and surplus overflow weirs',
      'Plant 1,000 Palmyra seed nuts on bund perimeters'
    ]),
    impact: 'Feeder channel cleared for 2.2 km; storage capacity already expanded by 30%.',
    progress: 55,
    status: 'published',
    display_order: 9
  },
  {
    title: 'Anaiyur Wetland Bio-Shield & Bird Sanctuary',
    slug: 'anaiyur-wetland-bio-shield',
    category: 'ongoing',
    project_category_tag: 'Biodiversity',
    location: 'Anaiyur Tank Basin',
    short_description: 'Creating a 2.8 km native vegetation perimeter fence and nesting islands for migratory wetland birds.',
    description: 'Anaiyur tank hosts pelicans, painted storks, and spot-billed ducks each winter. We are constructing 3 raised nesting mounds in the center of the lake and planting dense bamboo and reed screens along disturbed shorelines.',
    cover_image: 'https://images.unsplash.com/photo-1552799446-159ba9523315?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1552799446-159ba9523315?w=700&q=80',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=700&q=80'
    ]),
    start_date: '2025-09-01',
    end_date: null,
    expected_completion_date: '2026-08-31',
    objectives: JSON.stringify([
      'Construct 3 floating and earthen nesting islands',
      'Plant 3,000 wetland reeds and bio-barrier bamboo clumps',
      'Set up volunteer weekend bird watching and monitoring station'
    ]),
    impact: '2 nesting mounds completed; winter bird count up 30% with 24 documented species.',
    progress: 50,
    status: 'published',
    display_order: 10
  },
  {
    title: 'Sivakasi Industrial Green Buffer Corridor',
    slug: 'sivakasi-industrial-green-buffer-corridor',
    category: 'ongoing',
    project_category_tag: 'Urban Greening',
    location: 'Sivakasi East Industrial Zone',
    short_description: 'Establishing a dense 3-tier bio-filter forest around industrial manufacturing clusters to trap particulate matter.',
    description: 'A collaborative public-private partnership with local printing and manufacturing units. SGF designed a multi-canopy windbreak and dust absorption forest belt spanning 3 kilometers.',
    cover_image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80',
      'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=700&q=80'
    ]),
    start_date: '2025-10-15',
    end_date: null,
    expected_completion_date: '2027-03-31',
    objectives: JSON.stringify([
      'Plant 5,000 tall canopy and dust-filtering trees',
      'Create 3 km natural noise and particulate barrier',
      'Involve 20+ industrial units in corporate environmental responsibility'
    ]),
    impact: '1,750 trees established with solar pumping stations; air quality monitoring baseline active.',
    progress: 35,
    status: 'published',
    display_order: 11
  },
  {
    title: 'Urban Waterbody Bioremediation Pilot',
    slug: 'urban-waterbody-bioremediation-pilot',
    category: 'ongoing',
    project_category_tag: 'Water Restoration',
    location: 'Industrial Channel Canal, Sivakasi',
    short_description: 'Deploying eco-friendly floating wetland islands (FTWs) and bacterial bio-filters to digest organic contaminants naturally.',
    description: 'A cutting-edge non-chemical water treatment pilot along the urban stormwater drainage network. Floating rafts fabricated from recycled mesh carry native Canna and Vetiver plants whose roots filter heavy metals and excess nitrates.',
    cover_image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80'
    ]),
    start_date: '2026-01-10',
    end_date: null,
    expected_completion_date: '2026-10-31',
    objectives: JSON.stringify([
      'Launch 24 modular floating wetland treatment beds',
      'Reduce biological oxygen demand (BOD) by 55% in channel flow',
      'Eliminate foul odor emissions in adjoining residential zones'
    ]),
    impact: '12 wetland rafts active; initial test shows 42% reduction in ammonia levels.',
    progress: 45,
    status: 'published',
    display_order: 12
  },

  // ==================== UPCOMING (6 Projects) ====================
  {
    title: 'North Fork Check Dam & Stream Network',
    slug: 'north-fork-check-dam-network',
    category: 'upcoming',
    project_category_tag: 'Water Harvesting',
    location: 'North Watershed Catchment, Sivakasi',
    short_description: 'Construction of 8 boulder check-dams along seasonal stream paths to slow runoff and recharge water tables.',
    description: 'During intense northeast monsoon rains, rainwater swiftly runs off barren slopes without recharging underground aquifers. This project builds 8 cascading loose-boulder check dams and vegetative silt traps to retain groundwater.',
    cover_image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=700&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2027-02-01',
    objectives: JSON.stringify([
      'Construct 8 cascading boulder check dams',
      'Recharge 45 surrounding agricultural borewells',
      'Trap topsoil silt before it reaches downstream reservoirs'
    ]),
    impact: 'Estimated to retain 60 million liters of water annually and stabilize groundwater depth within 2 km radius.',
    progress: 0,
    status: 'published',
    display_order: 13
  },
  {
    title: 'Community Rainwater Harvesting Network',
    slug: 'community-rainwater-harvesting-network',
    category: 'upcoming',
    project_category_tag: 'Water Conservation',
    location: '200 Residential & School Clusters, Sivakasi',
    short_description: 'Installing rooftop rainwater recharge pits and filtration systems across 200 low-income households and public buildings.',
    description: 'Directing clean rooftop runoff into deep percolation pits equipped with gravel-sand-charcoal biofilters, reversing localized groundwater depletion in urban neighbourhoods.',
    cover_image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&q=80',
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2027-04-15',
    objectives: JSON.stringify([
      'Equip 200 buildings with rooftop harvesting systems',
      'Train 50 local plumbers in low-cost recharge design',
      'Prevent urban street waterlogging during monsoons'
    ]),
    impact: 'Estimated 15 million liters recharged per year directly into the shallow aquifer.',
    progress: 0,
    status: 'published',
    display_order: 14
  },
  {
    title: 'Riverbank Bamboo & Vetiver Buffer Zone',
    slug: 'riverbank-bamboo-vetiver-buffer',
    category: 'upcoming',
    project_category_tag: 'Soil & River Conservation',
    location: 'Arjuna River Tributary',
    short_description: 'Planting 6,000 Bambusa tulda clumpings and Vetiver grass strips along 4.2 km eroded stream banks.',
    description: 'Eroding riverbanks cause heavy silt deposition in water bodies and threaten adjoining farmlands. This project utilizes deep-rooted Vetiver grass and native bamboo species to naturally bind soil.',
    cover_image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=700&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2027-07-01',
    objectives: JSON.stringify([
      'Plant 6,000 bamboo clumps along 4.2 km riverbank',
      'Establish 10,000 Vetiver slips for soil bio-engineering',
      'Engage local farmers in sustainable bamboo harvesting'
    ]),
    impact: '4.2 km riverbank stabilized; 75% reduction in monsoon silt runoff.',
    progress: 0,
    status: 'published',
    display_order: 15
  },
  {
    title: 'Sacred Groves Eco-Restoration Project',
    slug: 'sacred-groves-eco-restoration',
    category: 'upcoming',
    project_category_tag: 'Biodiversity',
    location: '5 Rural Temple Groves around Sivakasi',
    short_description: 'Reviving traditional biodiversity hotspots through endemic rare flora preservation and invasive weed eradication.',
    description: 'Traditional sacred groves hold ancient medicinal trees and act as micro-refuges for wildlife. We will eradicate invasive Prosopis juliflora (Seemai Karuvelam) and plant 40 rare native medicinal tree species.',
    cover_image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2027-10-01',
    objectives: JSON.stringify([
      'Remove 100% invasive Prosopis across 25 acres',
      'Plant 2,500 saplings of 40 rare medicinal tree species',
      'Install educational botanical plaques for students and pilgrims'
    ]),
    impact: '25 acres of ancient ecological heritage restored for long-term community stewardship.',
    progress: 0,
    status: 'published',
    display_order: 16
  },
  {
    title: 'Urban Micro-Nursery & Seed Bomb Initiative',
    slug: 'urban-micro-nursery-seed-bomb',
    category: 'upcoming',
    project_category_tag: 'Afforestation',
    location: 'Sivakasi Community Center & Taluk Wastelands',
    short_description: 'Producing 50,000 native seed balls and raising 10,000 indigenous saplings for monsoon aerial seeding.',
    description: 'Mobilizing youth and women self-help groups to create 50,000 clay-and-compost seed balls containing Tamarind, Neem, Jamun, and Palmyra seeds, dispersed across arid hillocks before pre-monsoon showers.',
    cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2027-11-15',
    objectives: JSON.stringify([
      'Produce and disperse 50,000 native seed balls',
      'Establish a community seedling bank with 10,000 free saplings',
      'Organize 10 youth workshops across Sivakasi colleges'
    ]),
    impact: 'Affordable mass greening method targeting inaccessible wastelands and railway tracks.',
    progress: 0,
    status: 'published',
    display_order: 17
  },
  {
    title: 'Solar Micro-Irrigation & Agro-Forestry Corridor',
    slug: 'solar-micro-irrigation-agroforestry',
    category: 'upcoming',
    project_category_tag: 'Sustainable Agriculture',
    location: 'Sivakasi Rural Agricultural Belt',
    short_description: 'Empowering 50 smallholder farmers with solar-powered micro-drip networks and 5,000 drought-resilient fruit and timber trees.',
    description: 'Promoting dryland agroforestry combining Guava, Amla, Pomegranate, and Teak trees with solar drip irrigation. This reduces groundwater extraction by 60% while creating a productive green livelihood buffer.',
    cover_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80'
    ]),
    start_date: null,
    end_date: null,
    expected_completion_date: '2028-01-20',
    objectives: JSON.stringify([
      'Equip 50 small farms with solar micro-drip irrigation kits',
      'Plant 5,000 drought-resilient fruit and multi-purpose timber trees',
      'Conduct soil regeneration and bio-compost training sessions'
    ]),
    impact: 'Saves 40 million liters of agricultural water per season while restoring 120 acres of degraded farm soils.',
    progress: 0,
    status: 'published',
    display_order: 18
  }
];

function populate() {
  console.log(`Starting insertion and curation of ${newProjects.length} projects...`);
  
  // Clean up any test dummy projects with non-standard slugs
  db.prepare(`DELETE FROM projects WHERE slug IN ('thee', 'theetheee', 'test', 'sample')`).run();

  const upsert = db.prepare(`
    INSERT INTO projects (
      title, slug, category, project_category_tag, location,
      short_description, description, cover_image, gallery,
      start_date, end_date, expected_completion_date,
      objectives, impact, progress, status, display_order
    ) VALUES (
      @title, @slug, @category, @project_category_tag, @location,
      @short_description, @description, @cover_image, @gallery,
      @start_date, @end_date, @expected_completion_date,
      @objectives, @impact, @progress, @status, @display_order
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      project_category_tag = excluded.project_category_tag,
      location = excluded.location,
      short_description = excluded.short_description,
      description = excluded.description,
      cover_image = excluded.cover_image,
      gallery = excluded.gallery,
      start_date = excluded.start_date,
      end_date = excluded.end_date,
      expected_completion_date = excluded.expected_completion_date,
      objectives = excluded.objectives,
      impact = excluded.impact,
      progress = excluded.progress,
      status = excluded.status,
      display_order = excluded.display_order,
      updated_at = CURRENT_TIMESTAMP
  `);

  const tx = db.transaction((list) => {
    for (const p of list) {
      upsert.run(p);
    }
  });

  tx(newProjects);

  const counts = db.prepare(`
    SELECT category, status, COUNT(*) as count 
    FROM projects 
    GROUP BY category, status
  `).all();
  
  console.log('Project database status:');
  console.table(counts);
}

if (require.main === module) {
  populate();
}

module.exports = { newProjects, populate };
