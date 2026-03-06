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
  }
];

// Categorie metadata
const categories = [
  { id: "stoemp", name: "Stoemp", icon: "🥔", color: "#ea580c" },
  { id: "doordeweeks", name: "Doordeweeks", icon: "🍽️", color: "#16a34a" }
];
