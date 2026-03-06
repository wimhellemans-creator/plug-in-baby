const recipes = [
  // === STOEMP ===
  {
    id: 1,
    name: "Peekesstoemp",
    category: "stoemp",
    time: "40 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥕",
    description: "De stoemp der stoempen. Patatten en wortelen, gestampt met een berg boter. Meer moet dat niet zijn.",
    ingredients: [
      "600 g zachtkokende patatten",
      "600 g wortelen",
      "bakboter",
      "olijfolie",
      "peper en zout"
    ],
    steps: [
      "Schil de patatten en breng ze in een pot met ruim water aan de kook.",
      "Schil de wortelen. Snijd ze middendoor en dan in halve maantjes. De topjes en de schillen mag je aan de konijnen geven \u2013 stel: je hebt konijnen.",
      "Neem een iets grotere pot voor de wortelen \u2013 daarin maken we straks de stoemp. Kook de wortelen tot ze halfgaar zijn.",
      "Giet de wortelen af in een vergiet. Doe ze terug in de pot met een stevige klod boter, wat olijfolie, royaal peper en zout. Zet het vuur zacht, zodat de wortelen kunnen gaan sudderen. En doe het deksel op de pot.",
      "Check of de patatjes al klaar zijn: kan je er vlotjes door prikken met een vork? Als je twijfelt of ze al zacht genoeg zijn, zijn ze nog niet zacht genoeg. Beter iets te lang dan te kort. Het moet zo meteen puree worden, remember.",
      "Als de patatjes klaar zijn, giet je ze af in een vergiet. Zet het vuur van de wortels af en kap de patatjes erbij.",
      "Wellicht kan er nog een extra klod boter bij. Stamp alles fijn met een \u2018stoemper\u2019.",
      "Proef al eens: moet er nog zout bij (allicht)? Peper (kan)? Moet het smijziger (when in doubt: more butter)?",
      "Klaar!"
    ],
    tip: "Worst = best: bij een goeie stoemp kan je veel eten, maar het vlezeke zal toch van goeden huize moeten zijn om er beter bij te passen dan een klassieke chipolata. Nog wat mosterd erbij: zalig."
  },
  {
    id: 2,
    name: "Spinaziestoemp",
    category: "stoemp",
    time: "30 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥬",
    description: "Groen-geel comfort. Diepvriesspinazie met patatten, gestampt tot iets prachtigs. Niet te fijn ook niet.",
    ingredients: [
      "600 g zachtkokende patatten",
      "300 g diepvriesspinazie",
      "bakboter",
      "peper en zout"
    ],
    steps: [
      "Schil de patatten en breng ze in een pot met ruim water aan de kook.",
      "Doe de diepvriesspinazie met een goeie klod boter en peper en zout in een potje en stoof zacht tot alles gesmolten is.",
      "Prik in de patatten: als je er vlotjes door kan, mag je ze afgieten. Ik gok na 20 minuten of zo.",
      "Doe de patatten bij de spinazie en stamp met een stoemper tot een groen-geel geheel. Niet te fijn ook niet.",
      "Proef eens: moet er nog zout of peper bij? Wellicht wel wat zout.",
      "Nog eens roeren en klaar!"
    ],
    tip: "Super flexibel: spinaziestoemp is lekker bij zowat alle soorten vis, ook die van kapitein Iglo, maar ook met een lapje spek of natuurlijk een worstje. Een beetje azijn erop of wat mosterd erbij kan ook goed smaken.\n\nNog stoemp? Ja, je k\u00e1n nog andere groenten stoempen: knolselder, prei, erwtjes volgens de Engelsen\u2026 en dat kan allemaal heel lekker zijn misschien. Maar geloof me, als het erop aankomt op een doordeweekse dinsdag, keer je altijd terug naar peekes en spinazie. Dat zijn gewoon de beste twee."
  },

  // === DOORDEWEEKS ===
  {
    id: 3,
    name: "Laagjes",
    category: "doordeweeks",
    time: "60 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥘",
    description: "Puree, gehakt, broccoli. Gestapeld in een ovenschotel. Dit is een gerecht dat je op voorhand klaarzet voor later.",
    ingredients: [
      "1 kg pureepatatten",
      "500 g gemengd gehakt",
      "1 stronk broccoli",
      "bakboter",
      "melk",
      "peper en zout"
    ],
    steps: [
      "Schil de patatten. Snijd de roosjes van de broccoli en gooi de dikke steel weg.",
      "Kook de patatten tot ze goed gaar zijn.",
      "Kruid het gehakt met wat peper en zout. Doe wat boter in een pan. Zet het vuur hoog en bak het gehakt erin, terwijl je af en toe roert om het uiteen te trekken in kleine stukjes.",
      "Breng een pannetje gezouten water aan de kook. Gooi de broccoliroosjes erin en blancheer (kook) ze enkele minuten.",
      "Giet de broccoliroosjes af en laat ze \u2018schrikken\u2019 met koud water.",
      "Intussen zouden de patatten stilaan gekookt moeten zijn. Giet ze af en doe ze terug in de pot. Doe er een goeie klod boter bij, flink peper en zout en ga er met de stamper door tot je een puree hebt. Doe er een goeie scheut melk bij en pureer nog eens, zodat het echt \u2018smijzig\u2019 wordt. Als je niet weet wat \u2018smijzig\u2019 is, denk aan de binnenkant van een kroketje. Als je dat niet kent, kan ik je niet helpen.",
      "Tijd om te stapelen. Neem een ovenschotel en kap onderaan het gehakt erin. Verspreid dan de broccoliroosjes erover. En werk af met een dikke laag puree.",
      "Je kan het nu gewoon zo eten, maar waarom zou je dan laagjes maken? Dit is een gerecht dat je op voorhand klaarzet voor later\u2026",
      "Dus: enkele uren later\u2026 Zet de oven op 180 graden. Zet de schotel er nog een kwartiertje in, eventueel met wat gemalen kaas erop die dan kan smelten.",
      "Klaar!"
    ],
    tip: null
  },
  {
    id: 4,
    name: "Gehaktkoekjes met patatjes en groentekrans",
    category: "doordeweeks",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍽️",
    description: "Gehaktkoekjes, gekookte patatjes, wortelen met erwtjes en broccoli. Eten zoals het hoort op een doordeweekse avond.",
    ingredients: [
      "500 g gehakt",
      "2 (oude) boterhammen",
      "1 kletske melk",
      "500 g patatten",
      "500 g wortelen",
      "Twee handen diepvrieserwtjes",
      "1 broccoli (of iets anders dat nog in de ijskast zit)",
      "1 klontje bakboter",
      "peper en zout"
    ],
    steps: [
      "Scheur de boterhammen in stukken in een kom (zonder de korsten). Doe er een kletske melk bij. Kap het gehakt, wat peper en zout erbij en meng alles goed door elkaar.",
      "Maak bolletjes van het gehakt en druk ze dan plat om er koekjes van te maken. Probeer ze allemaal ongeveer even groot te maken: dan zijn ze tegelijk klaar \u00e9n is er straks geen ruzie over wie de grootste krijgt.",
      "Doe wat boter in een pan, zet het vuur halfhoog en bak de gehaktkoekjes - terwijl je ze af en toe omdraait - rustig tot ze helemaal gaar zijn.",
      "Schil de patatten \u2013 of niet: het is uw leven \u2013 en breng ze in een pot met ruim water aan de kook. Hoelang? Dat weet ik ook niet echt, ik gok een kwartier. Maar elk zakje patatten is anders. Een beetje zoals een vrouw (m/v/x): als je denkt dat je het weet, ben je verkeerd. Geregeld prikken is dus de boodschap. Zijn ze klaar? Afgieten, in een kommetje doen en wat zout erop.",
      "Schil de wortelen. Snijd ze zoals je zelf wil. Kook ze in wat water tot ze bijna gaar zijn. Doe er dan de erwtjes bij. Laat ze nog even koken tot de wortels helemaal klaar zijn. Giet af en doe er wat peper en zout bij.",
      "Breng in een pot wat gezouten water aan de kook. Als het goed kookt, doe je er de broccoliroosjes in. Laat die een minuut \u00e0 twee, drie koken en giet ze dan af."
    ],
    tip: "Op voorhand: wat leuk is aan dit soort eten, je kan dit uren op voorhand maken en alles tegen etenstijd gewoon rap in de microgolf steken. Handig voor als je \u2013 ik zeg maar wat \u2013 bijvoorbeeld \u2019s avonds gazetten moet maken."
  },
  {
    id: 5,
    name: "Donderdagse pannenkoeken",
    category: "doordeweeks",
    time: "30 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥞",
    description: "Pannenkoeken. Op donderdag. Punt. Anders is onze Warre niet content.",
    ingredients: [
      "1/2 liter melk",
      "2 eieren",
      "200 g patisseriebloem",
      "een beetje zout",
      "bakboter"
    ],
    steps: [
      "Neem een grote mengkom en doe de melk, de eieren, een beetje zout en de bloem erin.",
      "Klop alles tot \u00e9\u00e9n geheel.",
      "Smelt een klontje boter in een tefalpan.",
      "Roer de gesmolten boter door het deeg.",
      "En dan bakken! Zorg dat de pan goed warm is, zodat het vooruitgaat.",
      "Doe telkens een klein beetje boter in de pan en giet er dan met een pollepel een dun laagje deeg in.",
      "Even geduld.",
      "Draai de pannenkoek om met een spatel en bak ook de andere kant.",
      "En dat herhaal je dan tot al het deeg op is en je een mooi stapeltje pannenkoeken hebt."
    ],
    tip: "Heilige Donderdag: er zijn mensen die denken dat je pannenkoeken op eender welke dag kan eten, en dat kan dan misschien ook wel zo zijn\u2026 Maar het mo\u00e9t op donderdag, anders is onze Warre niet content. En dat geldt ook als je al pannenkoeken gegeten hebt op woensdag."
  },

  // === SOEPEN ===
  {
    id: 6,
    name: "Tomatensoep",
    category: "soepen",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍅",
    description: "Verse tomatensoep. Met een thee-eitje voor de kruiden. Vergeet het er niet uit te vissen.",
    ingredients: [
      "1 kg tomaten",
      "1 ajuin",
      "1 teentje look",
      "2 stengels selder",
      "groentebouillon",
      "peper en zout",
      "tijm en laurier",
      "70 g tomatenpuree"
    ],
    steps: [
      "Breng in een pot ongeveer een liter water aan de kook.",
      "Doe het \u2018kroontje\u2019 van de tomaten en maak onderaan, aan de \u2018punt\u2019, twee kleine insnijdingen, zodat je een kruisje hebt gekerfd.",
      "Leg de tomaten in het kokende water. Wacht een minuutje of zo tot het vel van de tomaten vanzelf loskomt. Giet de tomaten in een vergiet en droog de pot af.",
      "Schil en snijd de ajuin, de look en de selder - dat moet zeker niet fijn!",
      "Zet het vuur halfhoog. Giet wat olijfolie in de pot en doe de ajuin, de look en de selder erbij. Laat die even stoven.",
      "Doe wat takjes tijm en een blaadje laurier in een thee-ei, en gooi dat ook mee in de pot - extra bonuspunten als je scoort vanop een afstandje. En een beetje peper en zout mag er ook al bij.",
      "Neem een potje voor het afval dat je nu gaat cre\u00ebren\u2026 Ontvel de tomaten, snijd het midden eruit en duw de pitjes en dat harde stuk in het midden eruit.",
      "Gooi de \u2018goede\u2019 stukken tomaat in de pot.",
      "Giet er een liter water en twee bouillonketeltjes van Knorr bij en breng aan de kook.",
      "Doe er ook nog een potje tomatenpuree bij.",
      "Na een kwartiertje of zo is het tijd om te mixen. Pas op! Vergeet het thee-eitje er niet eerst uit te vissen. Mix dan met een staafmixer tot alle brokken weg zijn.",
      "Laat na het mixen nog een minuutje of vijf doorkoken.",
      "Proef of er nog peper of zout bij moet (tip: wellicht wel) en klaar!"
    ],
    tip: null
  },
  {
    id: 7,
    name: "Pompoensoep",
    category: "soepen",
    time: "45 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🎃",
    description: "Met appel, bleekselder en een Easter egg van Donald Trump. Serieus.",
    ingredients: [
      "1 geen te grote flespompoen (butternut)",
      "1 ajuin",
      "1 teentje look",
      "1 appel",
      "2 stengels bleekselder",
      "1 l groentebouillon",
      "tijm en laurier",
      "peper en zout",
      "olijfolie"
    ],
    steps: [
      "Pel de ajuin en de look en snijd grof. Schil de selder en snijd grof. Schil de appel en snijd het klokhuis eruit.",
      "Doe een beetje olijfolie in een pot, zet het vuur zacht en laat de ajuin, look, selder en appel enkele minuten stoven. Doe er ook al een beetje peper en zout bij.",
      "Doe twee blaadjes laurier en wat takjes tijm in een thee-ei. Of doe zoals de \u2018echten\u2019 en bind ze samen met wat touw \u2013 maar wie heeft er nu touw in huis? Behalve MacGyver dan? Serieus? \u2013 en gooi dat al mee in de pot.",
      "Snijd de pompoen in twee: het dunne bovenste deel en het dikke onderste deel. Bij het dunne deel \u2013 daarin zitten g\u00e9\u00e9n pitjes, hoera! \u2013 moet je enkel de schil wegsnijden, en dan alles in grove blokjes. Gooi die al mee in de pot.",
      "Dilemma: wat te doen met de onderkant? Heb je veel energie en geen zin om perfect eten te verspillen? Snijd die dan in vier stukken, snijd de schil weg, verwijder de pitjes en snijd het vruchtvlees weer in dikke blokjes die je in de pan gooit. Vind je dat veel werk en is het wel goed geweest, dan smijt je dit deel gewoon in de vuilbak.",
      "Giet een liter bouillon (een liter water en twee bouillonblokjes dus, je moet niks liggen trekken) in de pan en laat een kwartiertje koken.",
      "Haal van het vuur. Verwijder het thee-ei (of het bouquet garni voor de uitslovers), en mix alles glad met een staafmixer. Easter egg: als het goed zit, zie je nu de oranje kop met geel haar van Donald Trump in de pot.",
      "Laat nog even doorkoken op hoog vuur. Klaar. Ook lekker met wat geitenkaas erin, voor wie dat graag eet."
    ],
    tip: null
  },

  {
    id: 8,
    name: "Knolseldersoep",
    category: "soepen",
    time: "40 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥣",
    description: "Beige soep in een beige kom. Maar dan wel hemels lekker. Serveer in een donker potje voor het wow-effect.",
    ingredients: [
      "1/2 knolselder",
      "1 ajuin",
      "1 patat",
      "1 l groentebouillon",
      "1 teentje look",
      "tijm en laurier",
      "peper en zout",
      "olijfolie"
    ],
    steps: [
      "Schil de patat, pel de ajuin en de look en snijd alles grof.",
      "Zet een pot op een zacht vuur. Doe er wat olijfolie in. En laat de patat, ajuin en look een paar minuten stoven.",
      "Doe twee blaadjes laurier en wat takjes tijm in een thee-ei (dat zou je tegen nu al wel in huis moeten hebben) en leg dat mee in de pot.",
      "Snijd de pel van de knolselder en snijd in grove blokjes. Kap de blokjes mee in de pot en laat een paar minuten meestoven.",
      "Kap de bouillon (1 l water en twee bouillonblokjes) mee in de pot. Zet het vuur hoog en laat alles een 20 minuten koken.",
      "Haal de pot van het vuur en mix alles tot een gladde soep.",
      "Kruid met peper en zout naar smaak. Klaar!"
    ],
    tip: "Soms is de soep te dik. Dan kan je twee dingen doen. Ofwel ga je daar een beetje over liggen wenen, ofwel roer je er nog een glas (of twee) water door tot ze de gewenste dikte heeft.\n\nHet ziet er saai uit. Dat is gewoon zo, knolseldersoep is beige en beige is\u2026 behang. Dus: serveer de soep sowieso al in een donkerder potje, dat geeft contrast. Doe er eventueel wat garnaaltjes in, wat peterselie of zelfs gewoon wat rood paprikapoeder bij het serveren voor een \u2013 nou nou, niet overdrijven \u2013 wow-effect."
  },

  {
    id: 9,
    name: "Bloemkool met witte saus",
    category: "doordeweeks",
    time: "30 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🥦",
    description: "Bloemkool met witte saus is met gekookte patatjes en een worstje. Ik wil er niks meer over horen.",
    ingredients: [
      "1 kleine bloemkool",
      "1/2 l melk (of wat meer)",
      "40 g bakboter",
      "40 g bloem",
      "peper en zout"
    ],
    steps: [
      "Snijd het groen en de onderkant van de dikke steel van de bloemkool.",
      "Doe de bloemkool(roosjes) in een grote pot met ruim water. Breng aan de kook. Blijf in de buurt van de pot! Na enkele minuten koken is de bloemkool wellicht klaar. Giet ze dan meteen af. Laat ze niet - ik herhaal: niet - plat koken.",
      "Weeg de bloem en de bakboter netjes af: dat moet evenveel zijn.",
      "Doe de bloem en de boter samen in een pannetje met een hoge rand. Roer alles goed met een klopper tot je een soort \u2018koekjesdeeg\u2019 krijgt in de pan.",
      "Giet dan de melk erbij en blijf de hele tijd roeren in de vorm van een 8 \u2013 of het symbool voor oneindig, voor de wiskundigen onder ons.",
      "Doe er intussen al wat zout en ruim peper bij.",
      "Zodra de lijnen van uw geroer in de saus blijven staan, en ze dus wat dikker is, is de bechamel goed. Proef! En haal meteen van het vuur als het ok\u00e9 is. (Is ze te dik, dan giet je er nog wat meer melk onder en roer je nog even verder.)",
      "Giet over de bloemkool, en klaar!"
    ],
    tip: "Hier gaan we niet moeilijk over doen. Bloemkool met witte saus is met gekookte patatjes en een worstje. Ik wil er niks meer over horen."
  },
  {
    id: 10,
    name: "Ballekes in tomatensaus",
    category: "doordeweeks",
    time: "60 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍖",
    description: "Gehaktballetjes in een rijke tomatensaus. Lekker met gekookte patatjes en prinsessenboontjes, maar er zijn ook barbaren die dat liever met pasta eten.",
    ingredients: [
      "2 (oude) boterhammen",
      "een kletske melk",
      "500 g gehakt",
      "bakboter",
      "2 blikken van 400 g tomaten in blokjes (Elvea als het er is) of 1 fles passata",
      "peper",
      "zout"
    ],
    steps: [
      "Scheur het brood (niet de korsten) in kleine stukjes in een kom. Doe er het kletske melk bij, meng met het brood. (Het kan ook zonder brood en melk, maar het is lekkerder m\u00e9t.)",
      "Doe het gehakt bij het brood, kruid met peper en zout. Goed mengen.",
      "Pak een apart bord. Rol balletjes (kies zelf maar hoe groot) en leg ze op het bord.",
      "Smelt wat bakboter in een tefalpan. Zet het vuur hoog.",
      "Bak de balletjes tot ze helemaal rondom bruin zien. Dat wil dus ook zeggen: geregeld eens omdraaien. En wat \u2018spelen\u2019 met het vuur: als ze te rap bruinen, wat stiller zetten en zo. Dat moet je wat aanvoelen.",
      "Doe de tomaten of de passata bij de balletjes. Wellicht kan de saus ook nog wat peper en zout gebruiken, maar niet overdrijven in het begin: je kan altijd nog toevoegen \u2013 wegnemen is moeilijker.",
      "Zet het vuur wat lager en laat een halfuurtje pruttelen of zo. Klaar!"
    ],
    tip: "De juiste manier: lekker met gekookte patatjes en prinsessenboontjes, maar er zijn ook barbaren die dat liever met pasta, rijst of zelfs puree eten\u2026 Je doet al op, maar weet wat ik ervan denk."
  },
  {
    id: 11,
    name: "Valse barbecue met couscous",
    category: "doordeweeks",
    time: "45 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🔥",
    description: "Gegrilde groenten en vlees van de grillpan, met couscous en sla. Voor als het buiten regent maar je toch zin hebt in barbecue.",
    ingredients: [
      "BBQ-vleesjes (of kipfilet)",
      "1 pollepel couscous",
      "2 paprika\u2019s",
      "1/2 courgette",
      "1/2 aubergine",
      "pakje sla",
      "citroen",
      "olijfolie",
      "peper en zout",
      "kippenkruiden/paprika"
    ],
    steps: [
      "Schil de paprika, snijd het \u2018hoedje\u2019 eraf, verwijder de zaadjes. En snijd in grove stukken. Snijd de courgette en aubergine in dunne schijfjes.",
      "Laat een grillpan op het vuur eerst goed warm worden, en grill de groentjes dan. Wellicht moet dat in een keer of drie, want elk stukje moet de bodem van de pan raken, zodat je die mooie, zwarte strepen krijgt.",
      "Doe de gegrilde groenten samen in \u00e9\u00e9n kom en kruid met (genoeg) peper en zout.",
      "Als de vleesjes al gemarineerd zijn: goed zo. Indien niet: kruid met peper, zout, eventueel kippenkruiden of paprika en wrijf in met olijfolie.",
      "Bak alles in de grillpan, maar zorg dat ze niet overvol ligt (bak dan in twee of drie keer). H\u00e9t voordeel tegenover \u00e9chte barbecue: je kan \u2018spelen\u2019 met het vuur, het zachter zetten voor de worstjes bijvoorbeeld, zodat voor \u00e9\u00e9n keer niet alles verbrandt\u2026",
      "Breng een goeie pollepel water aan de kook, dat mag in een waterkoker. Doe de couscous in een kommetje. Giet het kokende water erover en wat zout, zet er een deksel (of een bord) op en laat enkele minuten wellen.",
      "Doe de sla in een kom met wat peper en zout. Pers de citroen erover uit en giet er (eventueel, maar niet per se \u2013 denk aan de kilo\u2019s) een goeie scheut olijfolie over. Hussel alles goed door elkaar. En klaar!"
    ],
    tip: "Sausje vs. ketchup: Annelies maakt hier altijd een lekker yoghurtsausje bij. Ze mengt daarvoor yoghurt, olijfolie en lookpoeder en ras el hanout. Maar persoonlijk vind ik gewoon ketchup uit de fles of samoerai net zo goed."
  },
  {
    id: 12,
    name: "Fishcakes met salsa en geroosterde krielpatatjes",
    category: "doordeweeks",
    time: "60 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🐟",
    description: "Zelfgemaakte viskoekjes met verse salsa en krielpatatjes uit de oven. Dit is allicht mijn favoriete manier om patatjes te maken \u2013 past bij \u00e1lles.",
    ingredients: [
      "500 g krielpatatjes",
      "1 zalmfilet",
      "1 wittevisfilet",
      "1 citroen",
      "panko (of ander broodkruim)",
      "bladpeterselie",
      "1 rode peper",
      "2 lente-uien",
      "2 tomaten",
      "5 cm komkommer",
      "1 paprika",
      "1 limoen",
      "basilicum",
      "olijfolie",
      "wijnazijn",
      "peper en zout"
    ],
    steps: [
      "Doe de patatjes in een pot met water en laat koken tot je erin kan prikken, maar ze nog niet uiteenvallen. Nog net niet gaar is ideaal.",
      "Zet de oven op 220\u00b0.",
      "Zet de patatjes nog een minuutje of 20 bovenaan in de oven, tot ze mooi bruin kleuren. Haal uit de oven en strooi er wat zout over. Dit is allicht mijn favoriete manier om patatjes te maken \u2013 past bij \u00e1lles.",
      "Snijd de zalm en de witte vis in grove stukken. Snijd een handvol peterselie grof. Rasp de zeste van de citroen. Doe alles samen met het sap van een halve citroen, een stevige hand panko en wat peper en zout in een keukenrobot en mix tot een grof mengsel.",
      "Rol balletjes van het vismengsel, die je dan plat duwt tot koekjes.",
      "Doe olijfolie in een pan, bak de viskoekjes langs beide kanten, eerst op hoog vuur om ze dicht te \u2018schroeien\u2019, dan op lager vuur om ze ook vanbinnen te laten garen. Alles bijeen duurt dat een kwartiertje of zo.",
      "Verwijder de zaadjes uit de rode peper. Schil de paprika. Snijd de rode peper, lente-ui, tomaten, komkommer en paprika fijn (of laat de keukenrobot dat doen, al krijg je dan meer een moesje). Meng in een kommetje met het sap van de limoen, een handvol basilicum, een scheut olijfolie, een scheut azijn en peper en zout naar smaak."
    ],
    tip: null
  },
  {
    id: 13,
    name: "Makkelijke mosselen",
    category: "doordeweeks",
    time: "20 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🦪",
    description: "Mosselen met look, peterselie en verder niks. Simpeler wordt het niet.",
    ingredients: [
      "1 kg mosselen",
      "4 teentjes look",
      "1/2 bussel peterselie",
      "zout en peper",
      "olijfolie"
    ],
    steps: [
      "Spoel de mosselen grondig in koud water. Haal alle \u2018harige\u2019 dingen, andere schelpjes\u2026 eraf. Laat het water weglopen en spoel nog eens in koud water.",
      "Pel de look en snijd in plakjes.",
      "Snij de peterselie fijn.",
      "Doe wat olijfolie in een pot met een deksel, zet het vuur halfhoog en bak de look er een minuutje of zo in.",
      "Kap de mosselen en de peterselie erbij. Kruid met genoeg peper en zout.",
      "Zet het deksel op de pot, neem met een keukenhanddoek de handvaten van de pot en het deksel vast en schud alles een paar keer door elkaar.",
      "Zet het vuur volle bak nu.",
      "Als de mosselen allemaal open zijn, zijn ze gaar. Schud alles nog eens goed door elkaar. En klaar!",
      "Serveer in een mooi kommetje of als je een echte mosselpot hebt, daarin dan. Zet ook altijd een kommetje klaar om de schelpen in te gooien."
    ],
    tip: "Dit is genoeg voor een aperitiefhapje voor een man of vier pakt. Als je mosselen als hoofdgerecht wil, moet je rekenen op zo \u00e9\u00e9n portie per persoon (en er verse mayonaise \u2013 recept: zie tong \u2013 bij serveren)."
  },
  {
    id: 14,
    name: "Tong met ovenpatatjes",
    category: "doordeweeks",
    time: "50 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🐠",
    description: "Gebakken tong met krokante ovenpatatjes en een frisse salade. Plus het recept voor zelfgemaakte mayonaise.",
    ingredients: [
      "1 gekuiste tong p.p.",
      "500 g patatjes",
      "1 zakje sla",
      "bakboter",
      "peper en zout",
      "citroen",
      "2 teentjes look",
      "olijfolie"
    ],
    steps: [
      "Zet de oven op 200\u00b0C.",
      "Snijd de patatjes (met schil) en schijfjes of kwartjes. Doe wat olijfolie in een ovenvaste schotel. Leg de patatjes erin, samen met de teentjes look. Kruid met peper en zout. Giet er nog wat olie over en zet 30 \u00e0 40 minuten in de oven, of tot ze goudbruin zijn. Begin pas aan de vis en de sla als de patatjes al (of bijna) klaar zijn.",
      "Kruid de vis langs beide kanten met een beetje peper en zout. Smelt een klontje boter in een tefalpan op hoog vuur. Bak de vis in de pan, dat duurt ongeveer drie minuten aan elke kant. Maar zoals altijd: blijf erbij, als je ziet dat ie langs een kant een beetje bruin kleurt zoals op de foto mag je hem omdraaien. Als ook de andere kant er goed uitziet, leg je de tongen al op de borden.",
      "Doe de sla in een kom. Doe er wat zout en peper op. Pers de citroen erover uit en giet er (desgewenst, maar het moet ni\u00e9t) een goeie scheut olijfolie over. Meng alles goed door elkaar.",
      "Schep wat patatjes en de sla bij de vis op het bord: klaar!"
    ],
    tip: "Is dat\u2026 zelfgemaakte mayonaise? Jawel, en da\u2019s echt makkelijk om te maken! Daarvoor meng je in een mengbeker \u2013 of nog makkelijker: een blender! \u2013 1 ei, het sap van 1 citroen, 2 eetlepels dijonmosterd en wat peper en zout. Dan neem je een staafmixer \u2013 of zet je de blender aan \u2013 en giet je er 250 ml (voor de kenners: een bierglas) slaolie bij, terwijl je alles stevig blijft mixen, niet te lang zelfs. Mislukt nooit. Proef nog eens of er nog wat peper, zout of citroen bij moet\u2026 et voil\u00e0! Devos-Lemmens is er niks tegen."
  },
  {
    id: 15,
    name: "Zalm met chorizo en kerstomaten",
    category: "doordeweeks",
    time: "25 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍣",
    description: "Zalm met chorizo, kerstomaten en basilicum. Op een bedje van rijst. Te kort gebakken rijst is niet te eten.",
    ingredients: [
      "2 zalmhaasjes",
      "300 g kerstomaatjes",
      "basilicum",
      "10 cm chorizo",
      "olijfolie",
      "een zakje rijst",
      "wijnazijn",
      "peper en zout",
      "olijfolie"
    ],
    steps: [
      "Snijd de tomaatjes doormidden en doe ze in een kommetje met een goeie scheut azijn, wat zout en peper.",
      "Kook de rijst zoals op de verpakking staat (en bij twijfel een minuutje langer dan er staat \u2013 te kort gebakken rijst is niet te eten).",
      "Doe een scheutje olijfolie in een tefalpan, zet het vuur hoog en bak de zalm langs beide kanten.",
      "Snijd de chorizo in schijfjes en bak die nog twee minuten mee met de zalm.",
      "Kap de tomaatjes en de azijn bij de zalm en chorizo en laat nog een minuutje of zo meebakken.",
      "Leg alles op het bord, samen met nog enkele blaadjes basilicum.",
      "Klaar!"
    ],
    tip: null
  },
  {
    id: 16,
    name: "Zalig kruidige kleefrijst",
    category: "doordeweeks",
    time: "25 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍚",
    description: "Keisimpel en belachelijk lekker. Rijst met gember, pinda\u2019s, koriander en limoen.",
    ingredients: [
      "1 zakje rijst",
      "arachideolie",
      "5 cm gember",
      "3 teentjes look",
      "2 rode pepers",
      "koriander",
      "gezouten, geroosterde pinda\u2019s",
      "sesamzaad",
      "1 limoen",
      "zout"
    ],
    steps: [
      "Schil de gember en snijd in julienne (Frans voor: in dunne reepjes). Snijd de topjes van de pepers, verwijder de pitjes en snijd in julienne (je weet nu wat dat is). Snijd de look in dunne plakjes.",
      "Kook de rijst, 2 minuten langer dan op de verpakking staat, giet af, en doe in een kom.",
      "Doe wat arachideolie in een Tefalpan. Zet het vuur hoog. Doe de gember, rode peper en look in de pan. Bak een kleine 5 minuten terwijl je geregeld roert, tot de look en de gember goudbruin kleurt.",
      "Doe een handvol pinda\u2019s, best wat koriander, wat sesamzaad en genoeg zout in de pan. Roer nog eens goed, en bak alles nog een minuutje of twee.",
      "Kap het mengsel uit de pan over de rijst. Pers er het sap van de limoen over.",
      "Klaar! Keisimpel en belachelijk lekker. Zeker met een stukje gebakken witte vis erbij (of tofoe of zo, als dat uw ding is)."
    ],
    tip: null
  },
  {
    id: 17,
    name: "Asperges met ei en zalm",
    category: "doordeweeks",
    time: "30 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🌿",
    description: "Witte asperges met gehakt ei, peterselie en gerookte zalm. Lente op een bord.",
    ingredients: [
      "2 eieren",
      "500 g witte asperges",
      "peterselie",
      "een pakje gerookte zalm",
      "peper",
      "zout",
      "goeie boter (eventueel)"
    ],
    steps: [
      "Kook de eitjes gedurende een kwartier of zo, zodat ze zeker hardgekookt zijn. Laat ze afkoelen.",
      "Schil de asperges (maar laat de topjes eraan) en breek de houterige uiteinden af.",
      "Breng de asperges in een grote pot met ruim water en zout aan de kook. Opgepast: niet weglopen nu.",
      "Zodra het water kookt, zet je het vuur af. Laat de asperges nog 5 \u00e0 10 minuten liggen in de pot, daarna zijn ze klaar.",
      "Pel de eitjes en snijd ze in kleine blokjes, dat mag (of mo\u00e9t) rommelig. Snijd de peterselie fijn en meng met het ei. Kruid met wat peper en zout.",
      "Leg de asperges op het bord. Verdeel het ei-peterseliemengsel erover. (*)",
      "Leg er nog enkele mooie stukjes gerookte zalm bij.",
      "Klaar!"
    ],
    tip: "(*) M\u00e9t goeie boter: voor traditionele asperges \u00e0 la flamande moet er ook nog boter bij (en geen zalm, maar het is altijd lekkerder met zalm), maar dat maakt het gerecht natuurlijk meteen een pak vettiger/zwaarder. Smelt daarvoor aan het eind gewoon wat boter in een pannetje en giet het over de asperges nadat je het ei en de peterselie erbij hebt gedaan."
  },
  {
    id: 18,
    name: "Prei met zalm",
    category: "doordeweeks",
    time: "30 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥬",
    description: "Gestoofde prei met gerookte zalm, vinaigrette en geroosterde pijnboompitten.",
    ingredients: [
      "1 stengel prei per persoon",
      "2 schijfjes gerookte zalm p.p.",
      "1 eetlepel goeie boter p.p.",
      "olijfolie",
      "mosterd",
      "citroen",
      "pijnboompitten",
      "peper en zout"
    ],
    steps: [
      "Snijd de onderkant van de prei en verwijder de te donkergroene delen (of nog beter: koop gewoon prei waar dat al bij gebeurd is). Maak een insnede over de lengte van de prei, zodat je het eventuele zand er nog uit kan spoelen onder de kraan.",
      "Breng 1/2 liter water (per prei) aan de kook.",
      "Snijd de prei in 3 stukken. Leg in het kokende water, samen met de boter en ruim zout. Breng opnieuw aan de kook. Zet het vuur dan meteen laag en laat 15 minuten sudderen.",
      "Rooster de pijnboompitjes kort in een klein pannetje. Zodra ze bruin kleuren, kap je ze in een kommetje.",
      "Meng een lepeltje mosterd, wat olijfolie en het sap van een halve citroen (= vinaigrette).",
      "Laat de prei even uitlekken in een vergiet.",
      "Leg dan de prei op een bord. Giet wat vinaigrette erover. Leg de zalm en de pijnboompitten erop.",
      "Klaar!"
    ],
    tip: null
  },
  {
    id: 19,
    name: "Gestoomde zalm met broccoli en rijstnoedels",
    category: "doordeweeks",
    time: "25 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥢",
    description: "Zalm en broccoli gestoomd in een vergiet, met rijstnoedels gekookt in groene thee. Fancy harmonica optioneel.",
    ingredients: [
      "1 stuk zalmhaasje p.p.",
      "1 broccoli",
      "pakje rijstnoedels",
      "potje ingemaakte gember",
      "teriyaki-saus",
      "zakje groene thee",
      "2 lente-uitjes"
    ],
    steps: [
      "Zoek zo\u2019n grote pastapot (van de Ikea bijvoorbeeld) waarin een vergiet past. Of zoek een vergiet dat toevallig net past in \u00e9\u00e9n van je potten. Of als je een stoommand hebt, gebruik die dan (maar niet kopen: want wanneer ga je die nog eens gebruiken?)",
      "Doe een centimetertje water in de pot (zodat het vergiet nog droog blijft). En zet hem met het deksel erop op een hoog vuur.",
      "Zodra het stoomt in de pot, leg je de stukken zalm in het midden erin, en drapeer je de roosjes van de broccoli errond. Zet het deksel er weer op en laat ongeveer 5 minuten stomen, tot alles net gaar is.",
      "Kook de rijstnoedels zoals op de verpakking staat, maar steek het zakje groene thee wel mee in de pot voor extra smaak.",
      "Snijd de lente-uitjes in ringetjes.",
      "Leg de zalm, de broccoli en de noedels op een bord.",
      "Leg wat van de gember op de zalm, giet een goeie scheut teriyaki-saus over de zalm en de noedels en strooi over het geheel nog wat lente-uitjes.",
      "Klaar!"
    ],
    tip: "Fancy harmonica: om het er nog beter te laten uitzien, maak je in de zalmhaasjes insnijdingen om de 2 cm ongeveer voor je ze in pot legt. Als het klaar is, heb je dan een soort \u2018harmonica\u2019. Proeft wel gewoon hetzelfde."
  },
  {
    id: 20,
    name: "Zalm met groene groentjes en soja-honing in de oven",
    category: "doordeweeks",
    time: "40 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🥦",
    description: "Alles op \u00e9\u00e9n schaal de oven in. Als je wat meer of minder hebt van \u2019t een of \u2019t ander: no problemo, zoals ze zeggen in Noorwegen.",
    ingredients: [
      "1 stuk zalmhaasje p.p.",
      "1 kleine broccoli",
      "pakje aspergetipjes",
      "100 g sugarsnaps",
      "100 g diepvrieserwten",
      "zout en peper",
      "sesamolie",
      "sojasaus",
      "honing",
      "5 cm verse gember",
      "1 limoen",
      "2 lente-uitjes",
      "1 handje pinda\u2019s",
      "1 rode peper"
    ],
    steps: [
      "Zet de oven op 180\u00b0.",
      "Snijd de broccoli in kleine roosjes. Schil en rasp de gember. Snijd de lente-uitjes en rode peper in ringetjes. Hak de pindanoten grof.",
      "Meng broccoli, asperges, sugarsnaps, erwtjes met wat zout en peper en een goede scheut sesamolie in een ovenschaal. Leg de zalm ertussen. De hoeveelheden doen er niet zoveel toe: als je wat meer of minder hebt van \u2019t een of \u2019t ander: no problemo, zoals ze zeggen in Noorwegen.",
      "Roer ongeveer 1 eetlepel sojasaus, 1 eetlepel sesamolie en 1 eetlepel honing door elkaar en sprenkel het sausje over de zalm.",
      "Zet de schaal 25 minuten in de oven.",
      "Roer ondertussen in een potje geraspte gember, lente-ui, rode peper, het sap van de limoen en 1 eetlepel sesamolie door elkaar tot een dressing.",
      "Haal de schaal uit de oven. Giet de dressing over de zalm. Strooi de pinda\u2019s er nog over.",
      "Klaar! (Een zakje rijst voor erbij zal wel lukken, zeker?)"
    ],
    tip: null
  },

  // === PASTA ===
  {
    id: 21,
    name: "Spaghetti bolognese",
    category: "pasta",
    time: "60 min",
    servings: 4,
    difficulty: "makkelijk",
    image: "🍝",
    description: "De klassieker. Soms moet het wat langer, soms korter. Platte pasta is een ramp!",
    ingredients: [
      "500 g pasta",
      "500 g gehakt",
      "1 ajuin",
      "1 grote wortel",
      "1 stengel selder",
      "1 teentje look (of meer)",
      "2 blikken van 400 g tomaten in blokjes (Elvea) of een grote fles passata",
      "olijfolie",
      "peper en zout"
    ],
    steps: [
      "Snipper de ajuin. Snijd de look in stukjes.",
      "Doe olijfolie in een grote pot op halfhoog vuur. Laat de ajuin en de look erin stoven.",
      "Schil de wortel en de selder en snijd in stukjes, zo fijn als het je kan schelen. Kap bij de ajuin in de pot.",
      "Duw na een minuutje of vijf de groentjes naar de zijkant van de pot. Voeg nog wat olijfolie toe, zet het vuur hoger, verkruimel het gehakt en bak het mee in de pot.",
      "Kruid met peper en zout.",
      "Roer na een minuutje of zo de groenten en het vlees door elkaar. Blijf bakken (en af en toe roeren) tot al het gehakt bruin ziet.",
      "Kap de tomaten en het sap (of de passata) erbij. Roer alles eens goed door elkaar. Zet het vuur laag en laat een halfuurtje pruttelen.",
      "Als het nog wat te waterig oogt, haal je het deksel er even af om de saus te laten inkoken. Is het ok\u00e9, dan laat je het deksel erop. Bijkruiden mag ook nu.",
      "Roer er aan het eind nog een beetje olijfolie door.",
      "Kook de pasta in ruim gezouten water volgens de aanwijzingen op de verpakking. Maar blijf er wel bij. Soms moet het wat langer, soms korter. Echt weet je dat nooit. Geregeld proeven is het enige dat echt helpt om te weten wanneer de pasta klaar is. En als hij klaar is, giet je hem meteen af! Platte pasta is een ramp!",
      "Doe pasta, saus en eventueel kaas in een bord: klaar!"
    ],
    tip: null
  },
  {
    id: 22,
    name: "Spaghetti carbonara",
    category: "pasta",
    time: "25 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🍝",
    description: "Supermakkelijk, supersnel klaar en zoooooooo lekker. Maar ook niet mager.",
    ingredients: [
      "400 g guanciale (of pancetta als je dat niet vindt)",
      "500 g spaghetti",
      "3 eieren",
      "6 eierdooiers",
      "90 g parmezaan",
      "90 g pecorino",
      "peper en zout"
    ],
    steps: [
      "Snijd de guanciale in blokjes.",
      "Rasp de parmezaan en de pecorino. Meng in een kom met de eieren, de dooiers en goed veel vers gemalen zwarte peper.",
      "Vul een grote pot met gezouten water en breng aan de kook.",
      "Als het water kookt, doe je de pasta erin. Kook zoals op de verpakking staat. Maar zoals altijd: proeven!",
      "Zet een grote pan op hoog vuur en bak de guanciale erin. Daar moet je geen boter of olijfolie bij doen, dat is al vet genoeg van zijn eigen. Doe er als ze gebakken zijn, een of twee lepels van het kookvocht van de pasta bij.",
      "Als de pasta klaar is, is het tijd voor de magie. Giet hem natuurlijk eerst af. Kap dan de pasta mee in de pan bij de guanciale en roer door elkaar. Kap het eierkaasmengsel erover en roer alles nog eens door elkaar. (Als dat niet lukt in de pan, wegens te klein, doe het dan in een grote serveerschotel.)",
      "Klaar. Echt waar, meer is er niet aan."
    ],
    tip: "Supermakkelijk, supersnel klaar en zoooooooo lekker. Maar ook niet mager en zooooooo moeilijk om er geen tweede, derde of vierde bord van te nemen\u2026 Soms mag dat, maar nu ook niet elke dag."
  },
  {
    id: 23,
    name: "Macaroni met ham en kaassaus",
    category: "pasta",
    time: "30 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🧀",
    description: "Proficiat, je kan nu b\u00e9chamel maken. Ook bekend als de witte saus voor op bloemkool of dat witte laagje in de lasagne.",
    ingredients: [
      "250 g macaroni",
      "1/2 l melk",
      "150 g hamblokjes",
      "2 handjes gemalen kaas",
      "30 g boter",
      "30 g bloem",
      "peper en zout"
    ],
    steps: [
      "Breng in een pot water met wat zout aan de kook. Doe de macaroni erin en kook zoals op de verpakking staat. Blijf in de buurt, want platgekookt is echt niet lekker. De pasta moet nog beet hebben.",
      "Weeg de boter en de bloem af. Belangrijk: dat moet evenveel zijn. Doe ze samen in een pot op halfhoog vuur. Blijf roeren in een 8-vorm tot je een brij krijgt die wat weg heeft van koekjesdeeg. Alle bloem moet opgenomen zijn door de boter.",
      "Giet de melk er voorzichtig bij en blijf roeren. Voeg ook wat peper en zout toe.",
      "Als de lijnen van je klopper even in de saus blijven staan, is de saus klaar. Die moet zeker niet te dik zijn. Is ze dat wel, dan roer je er best nog wat melk door. Proficiat, je kan nu b\u00e9chamel maken. Ook bekend als de witte saus voor op bloemkool of dat witte laagje in de lasagne.",
      "Roer de hamblokjes en de gemalen kaas erdoor. En meteen daarna ook nog de macaroni. Klaar!"
    ],
    tip: "Over porties: natuurlijk mag je verhoudingsgewijs alles aanpassen, maar in dit boek hou ik de porties bewust niet te groot. De reden: koken voor veel volk is een stuk moeilijker dan koken voor weinig. De eerste keer test je de recepten dus altijd best uit voor een kleiner gezelschap. Bovendien: je moet niet van tafel rollen, natuurlijk \u2013 hoe verleidelijk dat soms ook kan zijn\u2026"
  },
  {
    id: 24,
    name: "Snelle pasta met harissa, kerstomaten en mozzarella",
    category: "pasta",
    time: "30 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍝",
    description: "Zo snel en zo simpel is het. Harissa, kerstomaten, kappertjes en mozzarella. Klaar.",
    ingredients: [
      "250 g pasta (of wat meer)",
      "1 ajuin",
      "3 eetlepels rozenharissa",
      "400 g kerstomaten",
      "20 g fijne kappertjes",
      "basilicum",
      "olijfolie",
      "zout",
      "een bol mozzarella"
    ],
    steps: [
      "Kook de pasta zoals op de verpakking staat, zoals altijd in gezouten water.",
      "Snijd de ajuin in plakken. Halveer de tomaatjes.",
      "Giet een scheut olijfolie in een pan/pot met deksel. Zet het vuur hoog. Bak de ajuin er enkele minuten in tot hij een beetje bruin kleurt.",
      "Kap de harissa, tomaatjes, kappertjes en een snuif zout in de pan en laat een paar minuten fruiten, zoals dat heet. Of gewoon bakken, want meer is het niet. Roer regelmatig en duw zelfs wat op de tomaten, die mogen een beetje uiteenvallen.",
      "Roer er een klein glas water door en breng de saus aan de kook.",
      "Draai dan het vuur lager, zet het deksel op de pot en laat 10 minuten pruttelen.",
      "Haal het deksel weer van de pan en laat nog 5 minuten pruttelen, zodat de saus wat dikker wordt.",
      "Kap de pasta bij de saus en roer alles door elkaar.",
      "Schep op de borden en leg er nog enkele plakjes mozzarella en wat blaadjes basilicum op.",
      "Zo snel en zo simpel is het. Klaar!"
    ],
    tip: null
  },
  {
    id: 25,
    name: "Zotte eenpans-orecchiette",
    category: "pasta",
    time: "30 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍝",
    description: "Alles in \u00e9\u00e9n pot. Kikkererwten, kappertjes, kerstomaten en orecchiette. Voor de latinisten: bijna een puttanesca.",
    ingredients: [
      "olijfolie",
      "6 tenen look",
      "400 g kikkererwten",
      "2 theelepels paprikapoeder",
      "2 theelepels gemalen komijn",
      "1 eetlepel tomatenpuree",
      "1 handvol peterselie",
      "1 citroen",
      "3 eetlepels kappertjes",
      "250 g kerstomaatjes",
      "1 eetlepel kristalsuiker",
      "250 g orecchiette",
      "700 ml groente- of kippenbouillon",
      "zout en peper"
    ],
    steps: [
      "Smelt olijfolie in een grote pot op een hoog vuur.",
      "Pers de look en gooi hem in de pot samen met de kikkererwten, het paprikapoeder, de komijn, de tomatenpuree en een snuifje zout. Bak alles een minuutje of tien, terwijl je regelmatig roert.",
      "Snijd de peterselie grof, hak de kappertjes en rasp de zeste (de schil) van de citroen. Gooi mee in de pot, samen met de kerstomaatjes en roer alles goed door elkaar. Laat nog een minuutje of twee meebakken.",
      "Voeg de pasta en de bouillon toe en breng aan de kook met het deksel op de pot. Als alles kookt, haal je het deksel eraf, zet je het vuur halfhoog en laat je de pasta nog 12 \u00e0 14 minuten \u2013 check de verpakking en proef! \u2013 koken tot hij al dente is.",
      "Giet er nog een scheut olijfolie over en royaal versgemalen zwarte peper, en klaar!"
    ],
    tip: "(N)olijf? Voor de liefhebbers (waartoe ik mezelf absoluut niet reken) kan het lekker zijn om bij stap 3 ook 100 g ontpitte en gehalveerde olijven toe te voegen. Dan kom je ook dichter bij de smaak van een traditionele pasta puttanesca \u2013 voor de latinisten onder ons: inderdaad, hoerenpasta."
  },
  {
    id: 26,
    name: "Pasta alla Norma",
    category: "pasta",
    time: "50 min",
    servings: 4,
    difficulty: "gemiddeld",
    image: "🍆",
    description: "Geroosterde aubergine met tomatensaus, basilicum en pecorino. Zoals ze in Rome zeggen: bon app\u00e9tit!",
    ingredients: [
      "2 aubergines",
      "2 blikken van 400 g tomaten in blokjes",
      "350 g pasta",
      "basilicum",
      "pecorino",
      "olijfolie",
      "5 tenen look",
      "1 rode peper",
      "oregano",
      "zout en peper",
      "witte kristalsuiker"
    ],
    steps: [
      "Verwarm de oven voor op 220\u00b0.",
      "Snijd de aubergines in plakken van 1 cm dik. Leg ze in een kom met een stevige scheut olijfolie, een handje zout en goed wat peper. Meng alles.",
      "Leg de aubergineschijfjes op een met bakpapier beklede bakplaat. Steek de aubergine zo\u2019n 30 minuten in de oven. Tot ze goed bruin zien. Zien ze helemaal zwart, dan heb je ze er te lang in gelaten \u2013 heb ik tot mijn scha en schande moeten leren.",
      "Snijd de look in fijne plakjes. Verwijder de pitjes van de rode peper en snijd fijn.",
      "Giet wat olijfolie in een grote pan, zet op halfhoog vuur. Doe de look en de peper in de pan. Laat twee minuten bakken, tot de look lichtjes bruin kleurt.",
      "Kap dan de tomaten, wat oregano (een paar takjes of anders wat gemalen uit een potje), een lepeltje suiker en een handje zout in de pan en roer alles door elkaar.",
      "Laat 10 minuten zachtjes pruttelen, tot de saus wat dikker geworden is. Roer dan de aubergines erdoor.",
      "Kook de pasta al dente, zoals op de verpakking staat aangegeven (maar vooral: proeven).",
      "Doe alles samen in een kom. Doe er wat verse blaadjes basilicum bij en rasp er wat (veel!) pecorino over.",
      "Klaar! Zoals ze in Rome zeggen: bon app\u00e9tit!"
    ],
    tip: null
  },
  {
    id: 27,
    name: "Pasta met pancetta en kerstomaatjes",
    category: "pasta",
    time: "25 min",
    servings: 2,
    difficulty: "makkelijk",
    image: "🍝",
    description: "Spaghetti met pancetta, kerstomaatjes, rucola en basilicum. Parmezaan erover en klaar.",
    ingredients: [
      "350 g spaghetti",
      "4 sneetjes pancetta van een halve cm dik",
      "1 sjalotje",
      "1 teentje look",
      "400 g kerstomaatjes",
      "rucola",
      "basilicum",
      "parmezaan",
      "olijfolie",
      "peper"
    ],
    steps: [
      "Snipper de sjalot en de look. Snijd pancetta in blokjes. Halveer de kerstomaatjes.",
      "Zet een grote pot water op hoog vuur voor de pasta. Als het water kookt, doe je er een goeie hand zout in en kap je de pasta erbij, die je dan ineens beetgaar kookt. Check de verpakking en proef om te weten hoelang dat moet.",
      "Doe wat olijfolie in een pannetje, zet het vuur halfhoog en stoof de look en de sjalot tot die glazig is.",
      "Zet het vuur wat hoger en bak de pancettablokjes erbij.",
      "Gooi de tomatenblokjes mee in de pan en laat even meestoven, niet te lang.",
      "Ik gok dat het nu stilaan tijd is om de pasta af te gieten.",
      "Doe de pasta in een grote kom. Kap het pancetta-tomatenmengsel erover. Roer er een handvol rucola en een handvol basilicum door. Kruid met wat peper van de molen.",
      "Rasp er ten slotte nog stevig wat parmezaan over. En klaar!"
    ],
    tip: null
  },
  {
    id: 28,
    name: "Echte tomatensaus",
    category: "pasta",
    time: "150 min",
    servings: 6,
    difficulty: "makkelijk",
    image: "🍅",
    description: "Het grote \u2018geheim\u2019: geduld. Anderhalf uur \u00e0 twee uur laten pruttelen. Dat is alles.",
    ingredients: [
      "geduld",
      "1 ajuin",
      "1 rode peper (of 0/meer)",
      "500 g kerstomaatjes",
      "2 blikken tomaten in blokjes of een fles passata (van een goed merk)",
      "olijfolie",
      "peper en zout",
      "suiker"
    ],
    steps: [
      "Snipper de ajuin. Doe wat olijfolie in een pot en laat de ajuin stoven op een zacht vuur.",
      "Verwijder de steel en de pitjes van de rode peper en snijd in heel fijne blokjes. Gooi die bij de ajuin om mee te stoven. Of niet als je echt niet van een beetje pikant houdt. Of meerder pepers (pitjes en al voor extra) als je net w\u00e9l van pikant houdt.",
      "Halveer de kerstomaatjes.",
      "Als de ajuin al wat glazig is, gooi je ze mee in de pot. Doe er ook nog wat extra olijfolie bij. Duw met de achterkant van de lepel tegen de tomaatjes, zodat ze hier en daar wat openbarsten.",
      "Giet de tomaten in blik mee in de pot. Kruid met peper en zout. En doe er ook een lepeltje suiker bij, om het zurige van de tomaten wat te counteren. Roer alles goed door elkaar.",
      "En dan nu het grote \u2018geheim\u2019: zet het vuur laag, doe het deksel op de pot en laat anderhalf uur \u00e0 twee uur pruttelen.",
      "Proef of er nog zout, peper\u2026 bij moet. Gooi er eventueel nog wat blaadjes basilicum bij, en klaar!"
    ],
    tip: null
  }
];

// Categorie metadata
const categories = [
  { id: "stoemp", name: "Stoemp", icon: "🥔", color: "#ea580c" },
  { id: "soepen", name: "Soepen", icon: "🥣", color: "#ca8a04" },
  { id: "doordeweeks", name: "Doordeweeks", icon: "🍽️", color: "#16a34a" },
  { id: "pasta", name: "Pasta", icon: "🍝", color: "#dc2626" }
];
