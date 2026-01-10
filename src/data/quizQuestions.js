export const quizQuestions = [
  {
    id: 1,
    question: "De Probleemoplosser",
    situation: "Er gaat iets mis in de levering aan een belangrijke klant. Wat doe jij liever?",
    options: [
      {
        text: "Ik duik de systemen in en analyseer de cijfers om precies te zien waar en wanneer het misging.",
        scores: { data: 1, visie: 0, zelf: 0, samen: 0 }
      },
      {
        text: "Ik bekijk het proces en bedenk een nieuw plan om dit soort problemen in de toekomst te voorkomen.",
        scores: { data: 0, visie: 1, zelf: 0, samen: 0 }
      }
    ]
  },
  {
    id: 2,
    question: "De Projectstijl",
    situation: "Je moet een advies schrijven voor de inrichting van een nieuw, efficiënter magazijn. Hoe begin je?",
    options: [
      {
        text: "Ik ga eerst zelf op onderzoek uit, lees rapporten en werk een mogelijke oplossing uit.",
        scores: { data: 0, visie: 0, zelf: 1, samen: 0 }
      },
      {
        text: "Ik roep direct de betrokken mensen bij elkaar om ideeën te verzamelen en samen een plan te maken.",
        scores: { data: 0, visie: 0, zelf: 0, samen: 1 }
      }
    ]
  },
  {
    id: 3,
    question: "De Toekomstblik",
    situation: "Je leest over een nieuwe trend, bijvoorbeeld het inzetten van drones in de stadslogistiek. Wat denk je?",
    options: [
      {
        text: "Gaaf! Ik zie meteen voor me hoe dit de hele wereld gaat veranderen.",
        scores: { data: 0, visie: 1, zelf: 0, samen: 0 }
      },
      {
        text: "Interessant, maar is het rendabel? Ik wil eerst de feiten en prestaties zien.",
        scores: { data: 1, visie: 0, zelf: 0, samen: 0 }
      }
    ]
  },
  {
    id: 4,
    question: "De Rol in het Team",
    situation: "Tijdens een groepsproject loopt de samenwerking stroef. Wat is jouw natuurlijke reactie?",
    options: [
      {
        text: "Ik neem de leiding, ga het gesprek aan en zorg dat de neuzen weer dezelfde kant op staan.",
        scores: { data: 0, visie: 0, zelf: 0, samen: 1 }
      },
      {
        text: "Ik focus me op de inhoud en zorg dat mijn deel van het werk in ieder geval perfect in orde is.",
        scores: { data: 0, visie: 0, zelf: 1, samen: 0 }
      }
    ]
  },
  {
    id: 5,
    question: "De Groene Keuze",
    situation: "Het bedrijf wil verduurzamen en de CO2-uitstoot verlagen. Wat is jouw eerste stap?",
    options: [
      {
        text: "Ik reken precies uit wat de uitstoot van ons wagenpark nu is en hoeveel procent we besparen met elektrische bussen.",
        scores: { data: 1, visie: 0, zelf: 0, samen: 0 }
      },
      {
        text: "Ik zie kansen voor een compleet nieuwe, circulaire keten waarbij we afval van de klant ophalen als nieuwe grondstof.",
        scores: { data: 0, visie: 1, zelf: 0, samen: 0 }
      }
    ]
  },
  {
    id: 6,
    question: "Code Rood",
    situation: "Een belangrijke leverancier valt plotseling om en kan niet leveren. Wat doe je?",
    options: [
      {
        text: "Ik zoek meteen contact met andere partijen in de keten en bel collega's om samen een noodoplossing te regelen.",
        scores: { data: 0, visie: 0, zelf: 0, samen: 1 }
      },
      {
        text: "Ik duik in onze database om te zoeken naar alternatieve leveranciers die aan de eisen voldoen en maak een lijst met opties.",
        scores: { data: 0, visie: 0, zelf: 1, samen: 0 }
      }
    ]
  }
];

export const quizResults = {
  regisseur: {
    roleName: "Regisseur",
    title: "Jij bent een geboren Regisseur!",
    shortDescription: "Je houdt het overzicht en verbindt mensen. Je zoekt naar verbetermogelijkheden en initieert samenwerkingen binnen en buiten het bedrijf.",
    description: "Jij houdt het overzicht en verbindt mensen. Je zoekt naar verbetermogelijkheden en initieert samenwerkingen binnen en buiten het bedrijf. Jij bent niet bang om beslissingen te nemen en houdt rekening met de belangen van iedereen.",
    match: "Dit profiel past perfect bij de opleiding Logistics Management. Hier leer je hoe je de spin in het web wordt van logistieke ketens.",
    icon: "🎬"
  },
  innovator: {
    roleName: "Innovator",
    title: "Jij bent een echte Innovator!",
    shortDescription: "Je kijkt naar de toekomst en het grotere geheel. Je denkt 'out of the box' en signaleert nieuwe kansen om waarde toe te voegen.",
    description: "Jij kijkt naar de toekomst en het grotere geheel. Je denkt 'out of the box' en signaleert nieuwe kansen om waarde toe te voegen. Je doet graag zelf onderzoek om met verrassingende, vernieuwende concepten te komen.",
    match: "Dit profiel past uitstekend bij Logistics Management. Je leert hier hoe je processen opnieuw kunt ontwerpen voor de toekomst.",
    icon: "💡"
  },
  analist: {
    roleName: "Analist",
    title: "Jij bent een scherpe Analist!",
    shortDescription: "Je gaat voor de feiten. Je ontwikkelt datamodellen en scenario's om precies te voorspellen wat de impact van een beslissing is.",
    description: "Jij gaat voor de feiten. Je ontwikkelt datamodellen en scenario's om precies te voorspellen wat de impact van een beslissing is. Met jouw inzicht zorg je dat processen meetbaar beter worden (sneller, goedkoper of duurzamer).",
    match: "Je past heel goed bij Logistics Management, waar je leert sturen op cijfers (KPI's). Tip: Vind je het programmeren zelf leuker dan het managen? Kijk dan ook eens naar Logistics Engineering.",
    icon: "📊"
  },
  technoloog: {
    roleName: "Technoloog",
    title: "Jij bent een Technoloog!",
    shortDescription: "Je houdt ervan om nieuwe technologieën te implementeren en systemen werkend te krijgen in een complexe omgeving.",
    description: "Jij houdt ervan om nieuwe technologieën te implementeren en systemen werkend te krijgen in een complexe omgeving. Je werkt samen met teams om technische oplossingen direct toe te passen.",
    match: "Let op! Dit profiel leunt sterk naar de opleiding Logistics Engineering. Vind je vooral de techniek gaaf? Kijk dan daar eens. Wil je de techniek vooral gebruiken om bedrijfsprocessen aan te sturen? Dan ben je bij Logistics Management ook van harte welkom!",
    icon: "🔧"
  }
};

export const introText = "Logistiek is overal. Van het bezorgen van je pakketje tot het verduurzamen van wereldwijde ketens. Maar welke rol past bij jou? Ben jij de regelaar, de uitvinder, de cijferaar of de techneut? Doe de check in 6 vragen!";
