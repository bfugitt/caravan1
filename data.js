/* ==========================================================================
   CARAVAN AND SEA ROUTES: content file.
   Everything a teacher might want to read or change is in this file.
   Standards connection: California HSS Grade 7 (7.2 Islamic civilizations,
   7.3 China, 7.4 Ghana and Mali), plus chronological and spatial thinking.
   ========================================================================== */
window.CARAVAN = {
  title: "Caravan and Sea Routes",
  subtitle: "Trade in the Medieval World",

  start: { coins: 400, days: 520, capacity: 20, startMonth: 2 },   // startMonth 2 = March
  upgrade: { extra: 8, cost: 150, max: 2 },
  stars: { fortune: [700, 1400], knowledge: [7, 12], travel: [4, 6] },   // two thresholds for 2 and 3 stars
  rescue: { coins: 60 },               // a once-per-game loan if you are stuck with no coins and no cargo
  priceStep: 0.02,                      // each unit you buy or sell moves the price by 2%
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

  intro: [
    "You are a merchant in the medieval world, between about A.D. 700 and 1450. Roads and sea lanes link West Africa, the Islamic world, India, and China.",
    "Buy goods where they are plentiful and cheap. Sell them where people want them. Along the way, visit great cities, learn their stories, and keep a Merchant's Journal.",
    "You have about 520 days. Watch the seasons: deserts, mountains, and monsoon winds all change how and when you can travel."
  ],
  aboutNote: "This game is a simplified model made for learning. The cities on this map flourished in different centuries, and the game puts them together in one trading world. Prices, travel times, and events are simplified to show how geography shapes trade. Real merchants dealt with languages, laws, and risks far more complicated than a game can show.",

  glossary: [
    { word: "caravan", meaning: "a group of travelers and animals, like camels, who journey together for safety" },
    { word: "caravanserai", meaning: "a walled inn along a trade route where travelers and animals could rest and trade" },
    { word: "oasis", meaning: "a place in the desert with water, where plants grow" },
    { word: "monsoon", meaning: "a seasonal wind that blows one direction in part of the year and the opposite way in another" },
    { word: "toll", meaning: "a tax paid to a ruler for using a road or a port" },
    { word: "scarce", meaning: "hard to find. Scarce goods usually cost more." },
    { word: "supply and demand", meaning: "prices go up when many people want something (demand) and there is little of it (supply). They go down when there is a lot of it." }
  ],

  goods: [
    { id: "gold",      name: "Gold",         emoji: "🪙", base: 100, w: 1, tip: "Light and valuable." },
    { id: "salt",      name: "Salt",         emoji: "🧂", base: 24,  w: 3, tip: "Heavy, but some places have almost none." },
    { id: "silk",      name: "Silk",         emoji: "🧵", base: 70,  w: 1, tip: "Made in China, wanted everywhere." },
    { id: "paper",     name: "Paper",        emoji: "📜", base: 40,  w: 1, tip: "Used for books, records, and letters." },
    { id: "tea",       name: "Tea",          emoji: "🍵", base: 35,  w: 1, tip: "A Chinese drink that spread slowly westward." },
    { id: "porcelain", name: "Porcelain",    emoji: "🏺", base: 90,  w: 2, tip: "Fine Chinese pottery. Heavy and fragile." },
    { id: "spices",    name: "Spices",       emoji: "🌶️", base: 60,  w: 1, tip: "Pepper and more, grown in India and farther east." },
    { id: "glass",     name: "Glass",        emoji: "🥂", base: 60,  w: 2, tip: "Made in Egypt, Syria, and Venice." },
    { id: "wool",      name: "Wool cloth",   emoji: "🐑", base: 50,  w: 2, tip: "A European product." }
  ],

  /* Cities.  mult = price multiplier for each good (low = plentiful here, high = wanted here).
     tax = share of a sale paid to the local ruler.  lx, ly = label offset on the map. */
  cities: [
    { id: "timbuktu", name: "Timbuktu", lon: -3.0, lat: 16.8, lx: 0, ly: 22, anchor: "middle", tax: 0.10,
      region: "West Africa (Mali)", era: "Mali Empire, about the 1200s to 1400s",
      mult: { gold: 0.5, salt: 3.0, silk: 1.8, paper: 1.8, tea: 1.3, porcelain: 2.0, spices: 1.4, glass: 1.7, wool: 1.5 },
      homeBlurb: "You are a merchant of Timbuktu, on the edge of the Sahara. Gold is plentiful at home, but salt is scarce.",
      card: { title: "Timbuktu: where the desert meets the river",
        text: "Timbuktu was a crossroads where Saharan caravan routes met the lands along the Niger River. Mali's rulers, including Mansa Musa (MAHN-sah MOO-sah), grew powerful by taxing the trade in gold and salt. Scholars in Timbuktu copied books and taught Islamic law and learning, and Arabic became important for trade, government, and scholarship." },
      quiz: { q: "Why was Timbuktu a good place for trade?", options: ["It was a seaport on the Mediterranean.", "Desert caravan routes and river routes met there.", "It was the only city in West Africa."], answer: 1,
        explain: "Timbuktu stood where caravans from across the Sahara met the Niger River region, so goods and ideas passed through." } },

    { id: "sijilmasa", name: "Sijilmasa", say: "see-jil-MAH-suh", lon: -4.3, lat: 31.3, lx: -8, ly: -12, anchor: "middle", tax: 0.06,
      region: "North Africa (Morocco)", era: "about the 700s to 1300s",
      mult: { gold: 1.0, salt: 0.6, silk: 1.6, paper: 1.2, tea: 1.4, porcelain: 1.7, spices: 1.4, glass: 1.3, wool: 1.1 },
      card: { title: "Sijilmasa: the Sahara's northern gate",
        text: "This oasis city, in what is now Morocco, was the northern end of an important Sahara caravan route. Camel caravans brought gold north from West Africa and carried salt and other goods south. Gold that reached North Africa could be made into coins." },
      quiz: { q: "Which goods traveled in opposite directions across the Sahara?", options: ["Gold north, salt south", "Paper north, silk south", "Tea north, glass south"], answer: 0,
        explain: "West Africa had gold and little salt. The Sahara had salt. Each place wanted what the other had." } },

    { id: "cairo", name: "Cairo", lon: 31.2, lat: 30.0, lx: 4, ly: 22, anchor: "middle", tax: 0.07,
      region: "Egypt", era: "Mamluk Sultanate, about 1250 to 1517",
      mult: { gold: 1.3, salt: 1.0, silk: 1.3, paper: 1.0, tea: 1.4, porcelain: 1.7, spices: 1.2, glass: 0.9, wool: 1.3 },
      homeBlurb: "You are a merchant of Cairo, a city between two seas. Glass is cheap at home, and goods from many lands pass through.",
      card: { title: "Cairo: between two seas",
        text: "Cairo was a huge, busy city beside the Nile. It lay between the Mediterranean Sea and the Red Sea, so goods from the Indian Ocean passed through on their way to Europe. Cairo was also a great center of learning, and pilgrims bound for Mecca gathered there." },
      quiz: { q: "Why did so many goods pass through Cairo?", options: ["It was between the Mediterranean and the Red Sea.", "It had the only desert in Africa.", "It was the capital of China."], answer: 0,
        explain: "Cairo's location linked sea routes to Europe with sea routes to the Indian Ocean, so merchants had to pass through." } },

    { id: "mecca", name: "Mecca", lon: 39.8, lat: 21.4, lx: -4, ly: 22, anchor: "middle", tax: 0.05,
      region: "Arabia", era: "the center of Islam since the 600s",
      mult: { gold: 1.4, salt: 1.2, silk: 1.3, paper: 1.3, tea: 1.3, porcelain: 1.6, spices: 0.9, glass: 1.2, wool: 1.0 },
      card: { title: "Mecca: the city of pilgrimage",
        text: "Mecca is the holiest city of Islam. Muslims who are able try to make the pilgrimage called the hajj at least once in their lives. Pilgrims came from West Africa, Egypt, Iraq, India, and beyond. They shared news, ideas, and goods, which helped connect distant parts of the Islamic world." },
      quiz: { q: "How did the hajj help connect distant places?", options: ["Pilgrims from many lands met and shared news, ideas, and goods.", "It closed the roads to travelers.", "It made everyone speak a different language."], answer: 0,
        explain: "Each year people from far-apart regions traveled to the same place, so the hajj spread news and ideas as well as trade." } },

    { id: "baghdad", name: "Baghdad", lon: 44.4, lat: 33.3, lx: 4, ly: -12, anchor: "middle", tax: 0.07,
      region: "Iraq", era: "Abbasid caliphate, about the 700s to 1200s",
      mult: { gold: 1.3, salt: 1.1, silk: 1.0, paper: 0.8, tea: 1.6, porcelain: 1.5, spices: 1.1, glass: 1.2, wool: 1.3 },
      card: { title: "Baghdad: a city of books",
        text: "Baghdad was the capital of the Abbasid caliphs. Scholars gathered there to translate books from Greek, Persian, and Indian writers, and added their own discoveries in math, medicine, and astronomy. A paper mill was working in Baghdad by about A.D. 794. Paper was cheaper to make than parchment, so books were easier to copy." },
      quiz: { q: "Why did paper help scholars in Baghdad?", options: ["Paper was cheaper and easier to make than parchment.", "Paper could only be used for money.", "Paper was heavier than stone."], answer: 0,
        explain: "Parchment came from animal skins and was costly. Paper made it possible to copy many more books." } },

    { id: "samarkand", name: "Samarkand", say: "SAM-er-kand", lon: 67.0, lat: 39.6, lx: 0, ly: -12, anchor: "middle", tax: 0.06,
      region: "Central Asia", era: "an important Silk Road city, about the 700s to 1400s",
      mult: { gold: 1.4, salt: 1.2, silk: 0.8, paper: 0.7, tea: 1.5, porcelain: 1.2, spices: 1.2, glass: 1.5, wool: 1.4 },
      card: { title: "Samarkand: an oasis on the Silk Road",
        text: "Samarkand lay in Central Asia, where roads from China, India, Persia, and the Mediterranean met. Merchants there spoke many languages. The \"Silk Road\" was not one road but a network of many routes. Samarkand became famous for its paper, a craft that had come west from China." },
      quiz: { q: "What was the Silk Road?", options: ["One straight paved highway.", "A network of many trade routes linking China to the west.", "A river in Central Asia."], answer: 1,
        explain: "The Silk Road was a web of routes. Goods and ideas often passed through many merchants' hands on the way." } },

    { id: "changan", name: "Chang'an", say: "chahng-AHN", lon: 108.9, lat: 34.3, lx: 0, ly: -12, anchor: "middle", tax: 0.06,
      region: "China", era: "capital of the Tang dynasty, A.D. 618 to 907",
      mult: { gold: 1.2, salt: 1.1, silk: 0.5, paper: 0.6, tea: 0.6, porcelain: 0.6, spices: 1.0, glass: 1.8, wool: 1.7 },
      card: { title: "Chang'an: capital of the Tang",
        text: "Chang'an was one of the largest cities in the world. Merchants from Central Asia, Persia, and beyond came to its markets. Chinese craftspeople invented woodblock printing: they carved a whole page into a block of wood, inked it, and pressed paper onto it to print copies. Silk, paper, and tea from China were wanted far away." },
      quiz: { q: "How does woodblock printing work?", options: ["A page is carved into wood, inked, and pressed onto paper.", "Letters are written one at a time by a robot.", "Paper is poured into a metal mold."], answer: 0,
        explain: "Carving a whole page into one block let printers make many copies of the same page." } },

    { id: "quanzhou", name: "Quanzhou", say: "chwan-JOH", lon: 118.7, lat: 24.9, lx: 6, ly: 22, anchor: "middle", tax: 0.07,
      region: "China (southeast coast)", era: "a great seaport of the Song and Yuan dynasties, about the 900s to 1300s",
      mult: { gold: 1.2, salt: 1.0, silk: 0.55, paper: 0.7, tea: 0.5, porcelain: 0.5, spices: 0.9, glass: 1.7, wool: 1.8 },
      homeBlurb: "You are a merchant of Quanzhou, a busy Chinese port. Silk, tea, and porcelain are cheap at home.",
      card: { title: "Quanzhou: a great seaport",
        text: "Quanzhou was a busy port on China's southeast coast. Ships sailed from here across the South China Sea and into the Indian Ocean. Chinese sailors used the magnetic compass to find direction. Merchants from Arabia, India, and Persia lived in the city, and ships carried porcelain and silk to distant ports." },
      quiz: { q: "Which tool helped Chinese sailors find direction at sea?", options: ["The telescope", "The magnetic compass", "The clock"], answer: 1,
        explain: "A magnetized needle points north-south, which helped sailors find direction when land was out of sight." } },

    { id: "calicut", name: "Calicut", say: "KAL-ih-kut", lon: 75.8, lat: 11.2, lx: -4, ly: 24, anchor: "middle", tax: 0.07,
      region: "India (Malabar coast)", era: "a leading Indian Ocean port, about the 1200s to 1400s",
      mult: { gold: 1.3, salt: 1.0, silk: 1.1, paper: 1.1, tea: 1.1, porcelain: 1.3, spices: 0.4, glass: 1.3, wool: 0.8 },
      card: { title: "Calicut: the pepper port",
        text: "Calicut (also called Kozhikode) lies on India's southwest coast, about halfway across the Indian Ocean trade world. Pepper and other spices grew nearby. Monsoon winds blew ships toward India in summer and back toward Arabia in winter, so merchants planned trips by the season. Zheng He's treasure fleets from Ming China visited this coast in the early 1400s." },
      quiz: { q: "Why did sailors plan Indian Ocean trips by the season?", options: ["The monsoon winds changed direction during the year.", "The ocean froze in winter.", "Ships could only sail on holidays."], answer: 0,
        explain: "Seasonal winds pushed ships one way in one part of the year and the other way later, so timing mattered." } },

    { id: "venice", name: "Venice", lon: 12.3, lat: 45.4, lx: 0, ly: -12, anchor: "middle", tax: 0.08,
      region: "Italy (Europe)", era: "a leading trading city, about the 1000s to 1400s",
      mult: { gold: 1.6, salt: 1.1, silk: 1.8, paper: 1.4, tea: 0.9, porcelain: 2.0, spices: 2.0, glass: 0.5, wool: 0.7 },
      homeBlurb: "You are a merchant of Venice. Glass and wool cloth are cheap at home, and wealthy Europeans pay well for spices and silk.",
      card: { title: "Venice: a city of merchants",
        text: "Venice was built on islands in a lagoon on Italy's coast. Its ships carried goods between Europe and the eastern Mediterranean, including Egypt. Venetian merchants bought spices and silk from the East and sold them across Europe. Venice was also famous for its glassmakers. Marco Polo, a Venetian merchant's son, traveled to China in the 1200s and wrote about what he saw." },
      quiz: { q: "How did Venice become rich?", options: ["By growing spices at home.", "By carrying and selling goods between Europe and the East.", "By mining gold in the Alps."], answer: 1,
        explain: "Venice had little farmland, but its ships and merchants moved goods across the sea for profit." } }
  ],

  /* Routes.  type picks which events can happen.  via = map points the line follows (lon, lat).
     wind: months (0 = January) when sailing that direction is favored.  */
  routes: [
    { a: "timbuktu", b: "sijilmasa", days: 55, cost: 25, type: "sahara",
      via: [], name: "Trans-Saharan caravan route" },
    { a: "sijilmasa", b: "cairo", days: 70, cost: 30, type: "desert",
      via: [[10, 33.5], [21, 31.5]], name: "North African caravan road" },
    { a: "cairo", b: "venice", days: 30, cost: 25, type: "sea_med", sea: true,
      via: [[29.9, 31.5], [24, 34.5], [19.5, 38.5], [18.8, 40.3], [16.5, 42.2], [14.2, 43.8]], name: "Mediterranean sea route",
      wind: { ab: [3, 4, 5, 6, 7, 8, 9], ba: [3, 4, 5, 6, 7, 8, 9] },
      windNote: "In the Mediterranean, stormy winter weather made sailing risky. The safest sailing season was spring through fall." },
    { a: "cairo", b: "mecca", days: 40, cost: 20, type: "desert",
      via: [[35, 29.4], [39.6, 24.5]], name: "Pilgrim road" },
    { a: "cairo", b: "baghdad", days: 35, cost: 25, type: "desert",
      via: [[34.5, 31], [36.3, 33.5]], name: "Road through Syria" },
    { a: "mecca", b: "baghdad", days: 40, cost: 20, type: "desert",
      via: [[43, 26], [44.5, 30]], name: "Pilgrim road from Iraq" },
    { a: "mecca", b: "calicut", days: 45, cost: 30, type: "sea_ocean", sea: true,
      via: [[39.0, 21.2], [41.5, 16.5], [43.4, 12.7], [50, 12.3], [62, 12]], name: "Red Sea and Arabian Sea route",
      wind: { ab: [4, 5, 6, 7, 8], ba: [10, 11, 0, 1, 2] },
      windNote: "Monsoon winds: ships sailed from Arabia to India with the summer southwest monsoon, and returned with the winter northeast monsoon." },
    { a: "baghdad", b: "samarkand", days: 60, cost: 30, type: "mountain",
      via: [[48, 34], [51.4, 35.7], [59.6, 36.3]], name: "Silk Road through Persia" },
    { a: "samarkand", b: "changan", days: 100, cost: 40, type: "mountain",
      via: [[76, 39.5], [83, 41.7], [89.2, 42.9], [94.7, 40.1], [103.8, 36.1]], name: "Silk Road across Central Asia" },
    { a: "changan", b: "quanzhou", days: 45, cost: 20, type: "road",
      via: [[112, 31], [115, 28], [117, 26]], name: "Roads and rivers of China" },
    { a: "quanzhou", b: "calicut", days: 75, cost: 35, type: "sea_ocean", sea: true,
      via: [[116.5, 22.5], [112, 16], [107, 9], [105, 5.5], [101, 3.2], [95, 5.5], [87, 5.8], [80.5, 5.2], [76, 8]], name: "South China Sea and Indian Ocean route",
      wind: { ab: [10, 11, 0, 1, 2], ba: [4, 5, 6, 7, 8] },
      windNote: "Monsoon winds: ships sailed west from China in winter and returned east in summer." }
  ],

  /* Events on the road.  types = route types where it can happen.
     Each choice has outcomes (chances add up to 1).  Effects: coins, coinsPct (share of your coins), days, lossPct (share of cargo lost). */
  events: [
    { id: "sandstorm", types: ["sahara", "desert"], emoji: "🌪️", title: "A sandstorm",
      text: "The sky turns brown. Wind throws sand in your face, and the camels kneel down.",
      choices: [
        { label: "Make camp and wait it out", desc: "Lose 5 days, but keep your goods safe.",
          outcomes: [{ p: 1, effects: { days: 5 }, text: "Caravans waited out sandstorms, with people and camels sheltering and faces covered. You lost five days but kept everything." }] },
        { label: "Push on through the storm", desc: "Save time, but you might lose some cargo.",
          outcomes: [{ p: 0.55, effects: {}, text: "Lucky! You made it through with your caravan together." },
                     { p: 0.45, effects: { lossPct: 0.2 }, text: "Some camels scattered in the storm and part of your cargo was lost." }] }
      ] },
    { id: "water", types: ["sahara", "desert"], emoji: "💧", title: "Water is running low",
      text: "Wells are far apart in the desert. Your water skins are getting light.",
      choices: [
        { label: "Hire a local guide (35 coins)", desc: "Guides knew where the wells were hidden.",
          outcomes: [{ p: 1, effects: { coins: -35 }, text: "Local guides, including Berber and Tuareg guides in the Sahara, knew where wells were hidden. It was money well spent." }] },
        { label: "Trust your own sense of direction", desc: "Save coins, but you might get lost.",
          outcomes: [{ p: 0.5, effects: {}, text: "You found the well just in time." },
                     { p: 0.5, effects: { days: 8, lossPct: 0.1 }, text: "You wandered before finding water. It cost 8 days, and the weakened camels could not carry everything." }] }
      ] },
    { id: "oasis", types: ["sahara", "desert"], emoji: "🌴", title: "An oasis",
      text: "Date palms rise ahead, and a well sparkles in the shade.",
      choices: [
        { label: "Rest and trade at the oasis", desc: "Gain 25 coins from small trades. Lose 2 days.",
          outcomes: [{ p: 1, effects: { coins: 25, days: 2 }, text: "Oases were meeting places. Travelers traded dates, water, and news, and animals rested." }] }
      ] },
    { id: "toll", types: ["sahara", "desert", "mountain", "road"], emoji: "🛂", title: "Officials ask for a tax",
      text: "Officials of the local ruler stop your caravan. They ask for a tax on your goods.",
      choices: [
        { label: "Pay the tax", desc: "Pay about 8% of your coins.",
          outcomes: [{ p: 1, effects: { coinsPct: 0.08 }, text: "Rulers earned great wealth by taxing trade. In return, they were expected to keep roads and markets safe." }] },
        { label: "Take a longer road around", desc: "Lose 8 days.",
          outcomes: [{ p: 1, effects: { days: 8 }, text: "The longer way kept your coins but cost you time. Merchants always weighed time against money." }] }
      ] },
    { id: "snow", types: ["mountain"], emoji: "🏔️", title: "Snow in the mountain pass",
      text: "Snow covers the high pass ahead. The animals struggle in the cold.",
      choices: [
        { label: "Wait for the snow to ease", desc: "Lose 7 days.",
          outcomes: [{ p: 1, effects: { days: 7 }, text: "You waited safely. High passes in Central Asia could close for days when snow fell." }] },
        { label: "Cross anyway", desc: "Save time, but you might lose some cargo.",
          outcomes: [{ p: 0.6, effects: {}, text: "You crossed the pass safely." },
                     { p: 0.4, effects: { lossPct: 0.15 }, text: "Some animals slipped and part of the cargo was lost." }] }
      ] },
    { id: "bandits", types: ["mountain", "desert", "road"], emoji: "⚠️", title: "Robbers on the road",
      text: "Travelers say robbers are watching the road ahead.",
      choices: [
        { label: "Hire guards (40 coins)", desc: "Safer, but it costs coins.",
          outcomes: [{ p: 1, effects: { coins: -40 }, text: "Guards kept the caravan safe. Merchants often paid for protection or traveled in large groups." }] },
        { label: "Travel quietly and hope", desc: "Save coins, but you might lose cargo.",
          outcomes: [{ p: 0.55, effects: {}, text: "You slipped past without trouble." },
                     { p: 0.45, effects: { lossPct: 0.25 }, text: "Robbers took part of your cargo." }] }
      ] },
    { id: "caravanserai", types: ["mountain", "desert", "road"], emoji: "🏛️", title: "A caravanserai",
      text: "You reach a caravanserai: a walled inn with a courtyard, stables, and rooms for travelers.",
      choices: [
        { label: "Stay the night (10 coins)", desc: "Rest safely. Lose 1 day.",
          outcomes: [{ p: 1, effects: { coins: -10, days: 1 }, text: "Caravanserais gave travelers shelter, food, and water, plus safe places to trade goods and share news." }] },
        { label: "Keep going", desc: "No change.",
          outcomes: [{ p: 1, effects: {}, text: "You pressed on." }] }
      ] },
    { id: "pass", types: ["mountain"], emoji: "📜", title: "A travel pass",
      text: "Mongol rulers conquered a huge area, often by violence. Once they ruled it, they protected the main roads and gave some travelers official passes. An official offers you one.",
      choices: [
        { label: "Accept the pass", desc: "Arrive 10 days sooner.",
          outcomes: [{ p: 1, effects: { days: -10 }, text: "With an official pass, officials along the road helped travelers with food, horses, and safe passage. This made long-distance travel easier for a time." }] }
      ] },
    { id: "storm", types: ["sea_med", "sea_ocean"], emoji: "⛈️", title: "A storm at sea",
      text: "Dark clouds roll in. The waves grow huge and the ship rolls.",
      choices: [
        { label: "Throw some cargo overboard", desc: "Lose about 20% of your cargo.",
          outcomes: [{ p: 1, effects: { lossPct: 0.2 }, text: "Lightening the ship helped it ride the waves. Sailors sometimes gave up cargo to save the ship." }] },
        { label: "Ride out the storm", desc: "Risky: might lose more, or nothing.",
          outcomes: [{ p: 0.5, effects: {}, text: "The ship held together. You were lucky." },
                     { p: 0.5, effects: { lossPct: 0.35, days: 4 }, text: "The storm damaged the ship. You lost cargo and spent 4 days making repairs." }] }
      ] },
    { id: "calm", types: ["sea_med", "sea_ocean"], emoji: "🌫️", title: "Becalmed",
      text: "The wind dies. The sails hang limp, and the ship barely moves.",
      choices: [
        { label: "Wait for the wind", desc: "Lose 6 days.",
          outcomes: [{ p: 1, effects: { days: 6 }, text: "Ships under sail depended on the wind. Calm days could mean long delays." }] }
      ] },
    { id: "pirates", types: ["sea_med", "sea_ocean"], emoji: "🏴", title: "Suspicious ships",
      text: "Ships with no flags follow yours. They may be pirates.",
      choices: [
        { label: "Pay for an armed escort (45 coins)", desc: "Safer, but it costs coins.",
          outcomes: [{ p: 1, effects: { coins: -45 }, text: "Merchants sometimes paid for protection at sea, as they did on land." }] },
        { label: "Try to outrun them", desc: "Save coins, but risk losing cargo.",
          outcomes: [{ p: 0.6, effects: {}, text: "Your ship outran them." },
                     { p: 0.4, effects: { lossPct: 0.25 }, text: "They caught up and took part of your cargo." }] }
      ] }
  ],

  /* Special event: Mansa Musa's pilgrimage, on a first visit to Cairo after day 60. */
  mansa: {
    city: "cairo", afterDay: 60, shockPct: 0.8, shockDays: 150,
    title: "A great caravan arrives",
    text: "Word spreads through Cairo: Mansa Musa, the ruler of Mali, has arrived on his pilgrimage to Mecca with a huge caravan. He is giving away gold. A chronicler who visited Cairo years later wrote that gold's value there fell because so much arrived at once.",
    lesson: "This is supply and demand. When a lot of gold arrives at once, each piece is worth a little less. Historians say the gold price really did fall for a time, but some retellings exaggerate how big or how long the drop was. Gold is cheaper in Cairo for a while. Could you profit from that?"
  },

  /* Idea cards: unlocked the first time you sell a good in a city. */
  spreads: [
    { good: "paper", city: "baghdad", title: "Paper travels west",
      text: "Paper was invented in China. By the 700s it was used in Central Asia, and a paper mill was working in Baghdad by about 794. A famous story says Chinese prisoners taught papermaking to Samarkand after the Battle of Talas in 751, but historians doubt it, because paper was already known in Central Asia. Muslim papermakers also changed the recipe, using rags instead of tree bark." },
    { good: "paper", city: "venice", title: "Paper reaches Europe",
      text: "Paper reached Europe through the Islamic world. The first paper mill in Spain is recorded in 1056, and Italian cities later made paper too. Paper was cheaper than parchment, which helped books and records become more common." },
    { good: "paper", city: "timbuktu", title: "Books across the Sahara",
      text: "In Timbuktu, scholars copied and collected manuscripts on subjects such as law, astronomy, and poetry. Paper was brought in by caravan, which shows that trade carried the materials of learning as well as goods." },
    { good: "tea", city: "samarkand", title: "Tea travels",
      text: "Tea drinking spread widely in China during the Tang and Song periods. Tea was traded to people in Central Asia and Tibet, where it became a valued drink. Goods like tea carried Chinese customs far from China." },
    { good: "silk", city: "venice", title: "Silk reaches Europe",
      text: "Chinese silk was prized by Europe's wealthy. Over time Italian cities learned to make silk cloth themselves. This is an example of how a luxury good can lead to new crafts in far-away places." },
    { good: "porcelain", city: "cairo", title: "Chinese pottery in Egypt",
      text: "Pieces of Chinese pottery have been found at sites in and near Cairo. They show how far Chinese goods traveled by sea and land, long before modern ships." },
    { good: "spices", city: "venice", title: "Spices to Europe",
      text: "Pepper and other spices grown on India's coast passed through the Indian Ocean and Egypt to reach Italy. Merchants in cities like Venice grew rich selling them. Spices were valuable because they were scarce in Europe." },
    { good: "gold", city: "sijilmasa", title: "From Mali's gold to coins",
      text: "Gold from West Africa crossed the Sahara and was made into coins in North Africa. Later, a European map from about 1375, the Catalan Atlas, showed the ruler of Mali holding a nugget of gold, which tells us that Europeans had heard about Mali's wealth." },
    { good: "salt", city: "timbuktu", title: "Salt for the south",
      text: "Salt was mined in the Sahara and carried south by camel caravans. People in West Africa's grasslands and forests had little salt of their own, so it was valuable there." }
  ],

  final: {
    leftOut: "What this game leaves out: caravans also carried enslaved people, a painful part of this history that is not a trade good in the game. Wars and conquests, like the Mongol invasions, shaped these routes. The Black Death later traveled along trade routes. Women, farmers, and craftspeople, who made the goods in your market, also had important roles.",
    reflection: [
      "How did geography (deserts, mountains, seas, and winds) shape where merchants went and when?",
      "Which ideas or inventions traveled along with goods? Why did trade carry ideas, too?",
      "Why did the price of the same good change from city to city?"
    ]
  },

  teacher: {
    standards: "California HSS Grade 7: 7.2 (Islamic civilizations: trade, the hajj, and the exchange of learning), 7.3 (China: Tang, Song, Mongol, and Ming trade by land and sea; paper, printing, tea, and the compass), 7.4 (Ghana and Mali: the trans-Saharan trade, Timbuktu, and Mansa Musa), and the chronological and spatial thinking skills.",
    simplifications: [
      "Time is compressed: Baghdad's peak (700s to 1200s), Mali (1200s to 1300s), the Mongol period (1200s to 1300s), and Zheng He (early 1400s) are shown together. Each city card gives its era.",
      "Prices and travel times are invented to show scarcity, distance, and risk, not real historical prices.",
      "Monsoon timing is simplified: summer southwest monsoon toward India, winter northeast monsoon back toward Arabia. Chinese ships went west in winter and east in summer.",
      "The Mansa Musa event follows al-Umari's report of a lower gold price in Cairo, but the size and length of the effect are debated, and the game uses a modest, short drop.",
      "The Battle of Talas story about the spread of papermaking is presented as a debated tradition, not a proven fact.",
      "The trade in enslaved people is mentioned honestly on the final screen but is not a game mechanic."
    ]
  }
};
