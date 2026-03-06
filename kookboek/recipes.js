const recipes = [
  // === VLAAMSE KLASSIEKERS ===
  {
    id: 1,
    name: "Stoofvlees",
    category: "vlaamse-klassiekers",
    time: "180 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍖",
    description: "Klassiek Vlaams stoofvlees met een dikke saus van bruin bier en ontbijtkoek.",
    ingredients: [
      "800g rundsstoofvlees",
      "3 uien",
      "2 teentjes knoflook",
      "33cl bruin bier",
      "2 sneden ontbijtkoek",
      "2 el mosterd",
      "2 el rode wijnazijn",
      "2 laurierblaadjes",
      "3 kruidnagels",
      "boter",
      "zout en peper"
    ],
    steps: [
      "Snijd het vlees in blokken en dep droog. Kruid met zout en peper.",
      "Braad het vlees rondom bruin in boter. Doe in porties, niet te veel tegelijk. Leg apart.",
      "Snipper de uien en stoof ze glazig in dezelfde pan.",
      "Voeg de knoflook toe en bak 1 minuut mee.",
      "Leg het vlees terug, voeg het bier toe, en roer.",
      "Besmeer de ontbijtkoek met mosterd en leg bovenop.",
      "Voeg laurier, kruidnagels en azijn toe.",
      "Laat 2,5 tot 3 uur sudderen op laag vuur met deksel.",
      "Roer af en toe. De ontbijtkoek lost op en bindt de saus.",
      "Serveer met frieten en een salade."
    ]
  },
  {
    id: 2,
    name: "Waterzooi",
    category: "vlaamse-klassiekers",
    time: "60 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🍲",
    description: "Gentse waterzooi met kip, groenten en een romige bouillon.",
    ingredients: [
      "1 hele kip (of 4 kippendijtjes)",
      "3 wortelen",
      "2 preien",
      "4 aardappelen",
      "1 ui",
      "2 stengels selder",
      "200ml room",
      "2 eierdooiers",
      "1l kippenbouillon",
      "boter",
      "peterselie",
      "zout en peper"
    ],
    steps: [
      "Kook de kip gaar in de bouillon (30 min). Haal eruit en ontvel/ontbeen.",
      "Snijd alle groenten in stukken.",
      "Smelt boter en stoof de ui, wortel, prei en selder 5 minuten.",
      "Voeg de bouillon toe en kook de groenten en aardappelen gaar.",
      "Klop de eierdooiers los met de room.",
      "Haal de pan van het vuur en roer het roommengsel erdoor.",
      "Voeg het kipvlees toe en verwarm zachtjes (niet koken!).",
      "Bestrooi met peterselie en serveer met brood."
    ]
  },
  {
    id: 3,
    name: "Vol-au-vent",
    category: "vlaamse-klassiekers",
    time: "90 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🥧",
    description: "Romige vol-au-vent met kip, balletjes en champignons in een rijke saus.",
    ingredients: [
      "500g kipfilet",
      "200g kalfszwezerik (optioneel)",
      "250g champignons",
      "16 gehaktballetjes",
      "50g boter",
      "50g bloem",
      "500ml kippenbouillon",
      "200ml room",
      "1 citroen (sap)",
      "1 eierdooier",
      "4 bladerdeegbakjes",
      "zout, peper, nootmuskaat"
    ],
    steps: [
      "Pocheer de kipfilet in bouillon. Snijd in stukjes.",
      "Bak de gehaktballetjes rondom bruin.",
      "Bak de champignons in boter.",
      "Maak een roux: smelt boter, voeg bloem toe, bak 2 min.",
      "Voeg geleidelijk de bouillon toe al roerend.",
      "Voeg room, citroensap, nootmuskaat toe.",
      "Bind af met een eierdooier (pan van het vuur).",
      "Voeg kip, balletjes en champignons toe aan de saus.",
      "Verwarm de bladerdeegbakjes in de oven.",
      "Schep de vulling in de bakjes en serveer met frieten of puree."
    ]
  },
  {
    id: 4,
    name: "Hutsepot",
    category: "vlaamse-klassiekers",
    time: "150 min",
    servings: 6,
    difficulty: "makkelijk",
    image: "🥘",
    description: "Stevige winterse hutspot met verschillende groenten en worst.",
    ingredients: [
      "500g varkensribben",
      "300g rookworst",
      "500g aardappelen",
      "3 wortelen",
      "2 preien",
      "¼ kool",
      "2 uien",
      "2 laurierblaadjes",
      "tijm",
      "zout en peper"
    ],
    steps: [
      "Breng een grote pot water aan de kook met de ribben en laurier.",
      "Laat 1 uur trekken op laag vuur.",
      "Voeg de grofgesneden groenten toe.",
      "Kook nog 45 minuten tot alles gaar is.",
      "Voeg de rookworst toe de laatste 20 minuten.",
      "Stamp lichtjes aan of serveer als soep met het vlees ernaast.",
      "Serveer met mosterd en brood."
    ]
  },

  // === PASTA ===
  {
    id: 5,
    name: "Spaghetti Bolognese",
    category: "pasta",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍝",
    description: "De klassieker die iedereen lust. Met een rijke tomatensaus en gehakt.",
    ingredients: [
      "400g spaghetti",
      "500g gehakt (rund of gemengd)",
      "1 ui",
      "2 teentjes knoflook",
      "2 wortelen",
      "2 stengels selder",
      "400g gepelde tomaten (blik)",
      "2 el tomatenpuree",
      "1 glas rode wijn",
      "oregano, basilicum",
      "olijfolie",
      "Parmezaan",
      "zout en peper"
    ],
    steps: [
      "Snipper ui, knoflook, wortel en selder fijn.",
      "Fruit de ui en knoflook in olijfolie.",
      "Voeg het gehakt toe en bak rul.",
      "Voeg wortel en selder toe, bak 3 minuten mee.",
      "Voeg tomatenpuree toe en roer goed.",
      "Blus met rode wijn en laat even inkoken.",
      "Voeg de gepelde tomaten en kruiden toe.",
      "Laat 25 minuten zachtjes pruttelen.",
      "Kook de spaghetti al dente.",
      "Serveer met geraspte Parmezaan."
    ]
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    category: "pasta",
    time: "25 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🍝",
    description: "Authentieke carbonara met ei, Pecorino, guanciale en zwarte peper.",
    ingredients: [
      "400g spaghetti of rigatoni",
      "200g guanciale (of pancetta)",
      "4 eierdooiers + 1 heel ei",
      "80g Pecorino Romano",
      "zwarte peper",
      "zout"
    ],
    steps: [
      "Kook de pasta in ruim gezouten water.",
      "Snijd de guanciale in reepjes en bak knapperig uit (zonder olie).",
      "Klop de eierdooiers + ei met de geraspte Pecorino en peper.",
      "Giet de pasta af, bewaar een kopje kookwater.",
      "Doe de hete pasta bij de guanciale (pan VAN het vuur).",
      "Voeg het eimengsel toe en roer snel. De warmte gaart het ei.",
      "Voeg kookwater toe tot je de gewenste romigheid hebt.",
      "Serveer direct met extra Pecorino en peper."
    ]
  },
  {
    id: 7,
    name: "Lasagne",
    category: "pasta",
    time: "90 min",
    servings: 6,
    difficulty: "gemiddeld",
    image: "🍝",
    description: "Klassieke lasagne met lagen pasta, ragù en bechamelsaus.",
    ingredients: [
      "12 lasagnebladen",
      "500g gehakt",
      "1 ui, 1 wortel, 1 selder",
      "400g tomatenpassata",
      "2 el tomatenpuree",
      "50g boter",
      "50g bloem",
      "500ml melk",
      "100g geraspte kaas",
      "nootmuskaat",
      "olijfolie",
      "zout en peper"
    ],
    steps: [
      "Maak de ragù: fruit ui, wortel, selder. Voeg gehakt toe, bak rul.",
      "Voeg passata en tomatenpuree toe. Laat 20 min sudderen.",
      "Maak bechamelsaus: smelt boter, voeg bloem toe, voeg geleidelijk melk toe.",
      "Breng op smaak met nootmuskaat, zout, peper.",
      "Vet een ovenschaal in. Laag bechamel op de bodem.",
      "Wissel af: lasagnebladen, ragù, bechamel. Herhaal 3-4 keer.",
      "Eindig met bechamel en bestrooi met kaas.",
      "Bak 35-40 min op 180°C tot goudbruin.",
      "Laat 10 minuten rusten voor het snijden."
    ]
  },

  // === SALADES ===
  {
    id: 8,
    name: "Caesar Salade",
    category: "salades",
    time: "20 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥗",
    description: "Krokante salade met romaine, kip, croutons en een romige dressing.",
    ingredients: [
      "1 krop romaine sla",
      "2 kipfilets",
      "4 sneden oud brood",
      "50g Parmezaan",
      "2 ansjovisfilets",
      "1 teentje knoflook",
      "1 eierdooier",
      "1 el mosterd",
      "sap van 1 citroen",
      "100ml olijfolie",
      "zout en peper"
    ],
    steps: [
      "Snijd het brood in blokjes en bak krokant in olijfolie met knoflook.",
      "Gril of bak de kipfilets gaar. Snijd in reepjes.",
      "Maak de dressing: mix ansjovis, eierdooier, mosterd, citroensap.",
      "Voeg langzaam de olijfolie toe al mixend (emulsie).",
      "Scheur de sla in stukken.",
      "Meng sla met dressing, voeg kip en croutons toe.",
      "Scheer er Parmezaan overheen met een dunschiller.",
      "Serveer direct."
    ]
  },
  {
    id: 9,
    name: "Griekse Salade",
    category: "salades",
    time: "15 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥗",
    description: "Frisse salade met tomaat, komkommer, olijven en feta.",
    ingredients: [
      "4 tomaten",
      "1 komkommer",
      "1 rode ui",
      "200g feta",
      "100g zwarte olijven (Kalamata)",
      "1 groene paprika",
      "oregano",
      "olijfolie extra vierge",
      "rode wijnazijn",
      "zout"
    ],
    steps: [
      "Snijd tomaten in partjes, komkommer in halve plakken.",
      "Snijd de ui in dunne ringen en de paprika in reepjes.",
      "Schik alles op een bord.",
      "Verdeel de olijven erover.",
      "Leg een blok feta bovenop (of verkruimel).",
      "Besprenkel met olijfolie en een scheutje azijn.",
      "Bestrooi met oregano en zout.",
      "Serveer met knapperig brood."
    ]
  },
  {
    id: 10,
    name: "Lauwe Geitenkaassalade",
    category: "salades",
    time: "20 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥗",
    description: "Salade met warme geitenkaas op toast, walnoten, honing en rucola.",
    ingredients: [
      "100g rucola",
      "1 buche geitenkaas",
      "4 sneden stokbrood",
      "handvol walnoten",
      "1 peer",
      "honing",
      "balsamico",
      "olijfolie",
      "zout en peper"
    ],
    steps: [
      "Snijd de geitenkaas in 4 plakken, leg op stokbroodsneden.",
      "Besprenkel met honing en grill 3-4 min in de oven (200°C).",
      "Snijd de peer in dunne schijfjes.",
      "Verdeel de rucola over de borden.",
      "Leg de warme toasts erop.",
      "Verdeel peer en walnoten.",
      "Besprenkel met balsamico en olijfolie."
    ]
  },

  // === SOEPEN ===
  {
    id: 11,
    name: "Tomatensoep",
    category: "soepen",
    time: "40 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍅",
    description: "Fluweelzachte tomatensoep met basilicum. Comfort food op z'n best.",
    ingredients: [
      "1kg rijpe tomaten (of 2 blikken)",
      "1 ui",
      "2 teentjes knoflook",
      "500ml groentebouillon",
      "2 el tomatenpuree",
      "bosje basilicum",
      "100ml room",
      "1 tl suiker",
      "olijfolie",
      "zout en peper"
    ],
    steps: [
      "Halveer de tomaten en leg op een bakplaat. Besprenkel met olie.",
      "Rooster 20 min op 200°C.",
      "Fruit ui en knoflook in een pan.",
      "Voeg de geroosterde tomaten, tomatenpuree en bouillon toe.",
      "Laat 15 minuten koken.",
      "Mix glad met een staafmixer.",
      "Voeg room en suiker toe. Breng op smaak.",
      "Serveer met verse basilicum en een scheutje room."
    ]
  },
  {
    id: 12,
    name: "Pompoensoep",
    category: "soepen",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🎃",
    description: "Zoete, fluwelen pompoensoep met een vleugje nootmuskaat.",
    ingredients: [
      "1 flespompoen (ca. 800g)",
      "1 ui",
      "2 teentjes knoflook",
      "1 aardappel",
      "750ml groentebouillon",
      "100ml room",
      "nootmuskaat",
      "olijfolie",
      "zout en peper",
      "pompoenpitten (garnering)"
    ],
    steps: [
      "Schil de pompoen en snijd in blokken. Idem met de aardappel.",
      "Fruit de ui en knoflook.",
      "Voeg pompoen en aardappel toe, bak 5 minuten mee.",
      "Voeg bouillon toe en kook 20-25 minuten.",
      "Mix glad.",
      "Voeg room en nootmuskaat toe.",
      "Serveer met geroosterde pompoenpitten en een draai peper."
    ]
  },
  {
    id: 13,
    name: "Erwtensoep (Snert)",
    category: "soepen",
    time: "120 min",
    servings: 6,
    difficulty: "makkelijk",
    image: "🥣",
    description: "Dikke, stevige erwtensoep met rookworst. Perfecte winterkost.",
    ingredients: [
      "500g spliterwten",
      "1 rookworst",
      "2 preien",
      "4 aardappelen",
      "2 wortelen",
      "1 knolselder",
      "200g spek (gerookt)",
      "1,5l water",
      "laurier, tijm",
      "zout en peper",
      "roggebrood (erbij)"
    ],
    steps: [
      "Week de erwten minimaal 8 uur.",
      "Kook de erwten met het spek en de kruiden in ruim water.",
      "Na 1 uur: voeg de gesneden groenten toe.",
      "Kook nog 45 minuten tot alles zacht is.",
      "Stamp gedeeltelijk aan voor een dikke textuur.",
      "Snijd de rookworst in plakken en verwarm mee.",
      "Serveer met roggebrood en mosterd."
    ]
  },

  // === OVENSCHOTELS ===
  {
    id: 14,
    name: "Moussaka",
    category: "ovenschotels",
    time: "90 min",
    servings: 6,
    difficulty: "gemiddeld",
    image: "🍆",
    description: "Griekse ovenschotel met aubergine, gehakt en bechamelsaus.",
    ingredients: [
      "3 aubergines",
      "500g lamsgehakt (of rund)",
      "1 ui",
      "2 teentjes knoflook",
      "400g tomatenpassata",
      "1 tl kaneel",
      "50g boter",
      "50g bloem",
      "500ml melk",
      "1 ei",
      "100g kaas",
      "olijfolie",
      "zout en peper"
    ],
    steps: [
      "Snijd aubergines in plakken, bestrooi met zout. Laat 30 min uitlekken.",
      "Bak de plakken goudbruin in olijfolie.",
      "Fruit ui en knoflook, voeg gehakt toe en bak rul.",
      "Voeg passata en kaneel toe. Laat 15 min sudderen.",
      "Maak bechamelsaus en klop er een ei doorheen.",
      "Leg lagen: aubergine, gehakt, aubergine, gehakt.",
      "Eindig met bechamel en kaas.",
      "Bak 40 min op 180°C."
    ]
  },
  {
    id: 15,
    name: "Witloof met Hesp en Kaassaus",
    category: "ovenschotels",
    time: "60 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🧀",
    description: "Belgisch comfort food: witloof gewikkeld in hesp, overgoten met kaassaus.",
    ingredients: [
      "8 stronken witloof",
      "8 sneden hesp (ham)",
      "50g boter",
      "50g bloem",
      "500ml melk",
      "150g geraspte Gruyère",
      "nootmuskaat",
      "zout en peper"
    ],
    steps: [
      "Kook de witloof 15 minuten in licht gezouten water.",
      "Laat goed uitlekken (druk het vocht eruit).",
      "Wikkel elke stronk in een snede hesp.",
      "Leg in een ingevet ovenschaal.",
      "Maak kaassaus: smelt boter, voeg bloem toe, voeg melk toe al roerend.",
      "Voeg 100g kaas, nootmuskaat, zout en peper toe.",
      "Giet de saus over het witloof.",
      "Bestrooi met de rest van de kaas.",
      "Bak 25 min op 200°C tot goudbruin en bubbelend."
    ]
  },
  {
    id: 16,
    name: "Ovenpasta met Broccoli en Zalm",
    category: "ovenschotels",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥦",
    description: "Snelle en gezonde ovenpasta met zalm, broccoli en een romig sausje.",
    ingredients: [
      "300g penne",
      "300g zalmfilet",
      "1 broccoli",
      "200ml room",
      "100g geraspte kaas",
      "1 citroen",
      "dille",
      "zout en peper"
    ],
    steps: [
      "Kook de pasta bijna al dente. Voeg de broccoliroosjes de laatste 3 min toe.",
      "Giet af en doe in een ovenschaal.",
      "Snijd de zalm in stukken en verdeel over de pasta.",
      "Meng room met citroensap, dille, zout en peper.",
      "Giet over de schotel.",
      "Bestrooi met kaas.",
      "Bak 20 min op 200°C."
    ]
  },

  // === SNELLE MAALTIJDEN ===
  {
    id: 17,
    name: "Croque Monsieur",
    category: "snelle-maaltijden",
    time: "15 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥪",
    description: "Krokant tosti-broodje met ham en kaas, met bechamelsaus.",
    ingredients: [
      "4 sneden wit brood",
      "4 sneden ham",
      "100g geraspte Gruyère",
      "20g boter",
      "20g bloem",
      "200ml melk",
      "nootmuskaat",
      "zout en peper"
    ],
    steps: [
      "Maak een snelle bechamel: smelt boter, bloem, melk.",
      "Besmeer 2 sneden brood met bechamel.",
      "Beleg met ham en kaas.",
      "Leg er een snede brood op.",
      "Smeer de bovenkant in met bechamel en bestrooi met kaas.",
      "Bak in de oven op 200°C, 10 minuten, tot goudbruin.",
      "Voeg een gebakken ei toe voor een Croque Madame!"
    ]
  },
  {
    id: 18,
    name: "Shakshuka",
    category: "snelle-maaltijden",
    time: "25 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍳",
    description: "Eieren gepocheerd in een pittige tomatensaus. Perfect voor brunch of avondeten.",
    ingredients: [
      "4 eieren",
      "400g gepelde tomaten (blik)",
      "1 ui",
      "1 rode paprika",
      "2 teentjes knoflook",
      "1 tl komijn",
      "1 tl paprikapoeder",
      "snufje chilivlokken",
      "verse koriander",
      "olijfolie",
      "zout en peper",
      "brood (erbij)"
    ],
    steps: [
      "Fruit ui, paprika en knoflook in olijfolie.",
      "Voeg komijn, paprikapoeder en chili toe. Bak 1 minuut.",
      "Voeg de tomaten toe en laat 10 minuten inkoken.",
      "Maak 4 kuiltjes en breek er de eieren in.",
      "Deksel erop, laat 5-7 minuten sudderen tot de eieren gestold zijn.",
      "Bestrooi met koriander.",
      "Serveer uit de pan met knapperig brood."
    ]
  },
  {
    id: 19,
    name: "Pad Thai",
    category: "snelle-maaltijden",
    time: "30 min",
    servings: 2,
    difficulty: "gemiddeld",
    image: "🍜",
    description: "Thaise roerbaknoedels met garnalen, pinda's en limoen.",
    ingredients: [
      "200g rijstnoedels",
      "200g garnalen",
      "2 eieren",
      "100g taugé",
      "3 lente-uitjes",
      "2 el vissaus",
      "1 el tamarindepasta",
      "1 el suiker",
      "1 limoen",
      "50g pinda's (gehakt)",
      "knoflook",
      "chilipeper",
      "olie"
    ],
    steps: [
      "Week de rijstnoedels in warm water (volgens verpakking).",
      "Meng vissaus, tamarinde en suiker voor de saus.",
      "Bak knoflook en garnalen in een wok op hoog vuur.",
      "Duw opzij, bak de eieren roerend.",
      "Voeg noedels en saus toe. Roerbak 2 minuten.",
      "Voeg taugé en lente-ui toe.",
      "Serveer met pinda's, limoen en chili."
    ]
  },
  {
    id: 20,
    name: "Wraps met Kip en Avocado",
    category: "snelle-maaltijden",
    time: "20 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🌯",
    description: "Snelle wraps met gegrilde kip, avocado, sla en yoghurtdressing.",
    ingredients: [
      "2 tortillawraps",
      "2 kipfilets",
      "1 avocado",
      "1 tomaat",
      "handvol sla",
      "3 el Griekse yoghurt",
      "1 teentje knoflook",
      "sap van ½ citroen",
      "paprikapoeder, komijn",
      "olijfolie",
      "zout en peper"
    ],
    steps: [
      "Kruid de kip met paprika, komijn, zout en peper.",
      "Bak of gril de kip gaar. Snijd in reepjes.",
      "Maak de dressing: meng yoghurt, knoflook, citroensap.",
      "Snijd avocado en tomaat.",
      "Verwarm de wraps kort.",
      "Beleg: sla, kip, avocado, tomaat, dressing.",
      "Rol stevig op en snijd diagonaal door."
    ]
  },

  // === DESSERTS ===
  {
    id: 21,
    name: "Rijstpap",
    category: "desserts",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍚",
    description: "Romige rijstpap met kaneel en bruine suiker. Puur comfort.",
    ingredients: [
      "200g rondkorrelige rijst",
      "1l volle melk",
      "100g suiker",
      "1 vanillestokje",
      "snufje zout",
      "kaneel",
      "bruine suiker"
    ],
    steps: [
      "Breng de melk aan de kook met het vanillestokje en zout.",
      "Voeg de rijst toe en roer goed.",
      "Laat 30-35 min zachtjes koken op laag vuur. Roer regelmatig!",
      "Voeg de suiker toe aan het einde.",
      "Serveer warm of koud met kaneel en bruine suiker."
    ]
  },
  {
    id: 22,
    name: "Chocolademousse",
    category: "desserts",
    time: "30 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🍫",
    description: "Luchtige, intense chocolademousse. Slechts 3 ingrediënten.",
    ingredients: [
      "200g pure chocolade (70%)",
      "4 eieren",
      "snufje zout"
    ],
    steps: [
      "Smelt de chocolade au bain-marie. Laat licht afkoelen.",
      "Scheid de eieren.",
      "Klop de eiwitten met een snufje zout tot stijve pieken.",
      "Roer de dooiers door de gesmolten chocolade.",
      "Spatel voorzichtig ⅓ van het eiwit door het chocolademengsel.",
      "Spatel dan de rest erbij. Niet te veel roeren!",
      "Verdeel over glaasjes en laat minstens 4 uur opstijven in de koelkast."
    ]
  },
  {
    id: 23,
    name: "Appeltaart",
    category: "desserts",
    time: "75 min",
    servings: 8,
    difficulty: "gemiddeld",
    image: "🍎",
    description: "Klassieke appeltaart met een krokante bodem en zachte appelvulling.",
    ingredients: [
      "300g bloem",
      "150g koude boter",
      "100g suiker",
      "1 ei",
      "snufje zout",
      "1kg appels (Jonagold)",
      "50g rozijnen",
      "2 tl kaneel",
      "sap van 1 citroen",
      "2 el suiker extra",
      "abrikozenjam (afglazuren)"
    ],
    steps: [
      "Maak het deeg: meng bloem, boter, suiker, ei en zout tot een bal.",
      "Laat 30 min rusten in de koelkast.",
      "Schil de appels, snijd in partjes. Meng met kaneel, suiker, citroensap en rozijnen.",
      "Rol ⅔ van het deeg uit en bekleed een springvorm.",
      "Vul met de appels.",
      "Rol de rest uit, snijd in repen en maak een rasterpatroon.",
      "Bak 45 min op 180°C.",
      "Bestrijk met verwarmde abrikozenjam voor glans."
    ]
  },
  {
    id: 24,
    name: "Wafels",
    category: "desserts",
    time: "30 min",
    servings: 8,
    difficulty: "makkelijk",
    image: "🧇",
    description: "Luchtige Belgische wafels. Krokant van buiten, zacht van binnen.",
    ingredients: [
      "250g bloem",
      "3 eieren",
      "50g suiker",
      "100g gesmolten boter",
      "250ml melk",
      "1 zakje vanillesuiker",
      "1 tl bakpoeder",
      "snufje zout",
      "poedersuiker, slagroom, fruit (garnering)"
    ],
    steps: [
      "Meng bloem, bakpoeder, suiker en zout.",
      "Klop de eieren los en voeg toe samen met de melk.",
      "Voeg de gesmolten boter toe en meng tot een glad beslag.",
      "Laat 15 minuten rusten.",
      "Verwarm het wafelijzer.",
      "Bak de wafels goudbruin.",
      "Serveer met poedersuiker, slagroom en vers fruit."
    ]
  }
];

// Categorie metadata
const categories = [
  { id: "vlaamse-klassiekers", name: "Vlaamse Klassiekers", icon: "🇧🇪", color: "#dc2626" },
  { id: "pasta", name: "Pasta", icon: "🍝", color: "#ea580c" },
  { id: "salades", name: "Salades", icon: "🥗", color: "#16a34a" },
  { id: "soepen", name: "Soepen", icon: "🥣", color: "#ca8a04" },
  { id: "ovenschotels", name: "Ovenschotels", icon: "🫕", color: "#9333ea" },
  { id: "snelle-maaltijden", name: "Snelle Maaltijden", icon: "⚡", color: "#0891b2" },
  { id: "desserts", name: "Desserts", icon: "🍰", color: "#e11d48" }
];
