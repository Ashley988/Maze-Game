/***** Daten: Kategorien und Wörter *****/
const categories = {
    "Allgemeines": ["Haus", "Wohnung", "Zimmer", "Küche", "Badezimmer", "Toilette", "Fenster", "Tür", "Dach", "Wand", "Boden", "Tisch", "Stuhl", "Bett", "Schrank", "Sofa", "Lampe", "Teppich", "Spiegel", "Uhr", "Fernseher", "Computer", "Handy", "Telefon", "Radio", "Kühlschrank", "Herd", "Waschmaschine", "Kamera", "Buch", "Zeitung", "Brief", "Foto", "Bild", "Stift", "Bleistift", "Kugelschreiber", "Papier", "Schere", "Messer", "Gabel", "Löffel", "Teller", "Tasse", "Glas", "Flasche", "Topf", "Pfanne", "Schuh", "Hose", "Hemd", "Jacke", "Kleid", "Rock", "Hut", "Handschuh", "Brille", "Ring", "Kette", "Tasche", "Rucksack", "Auto", "Fahrrad", "Bus", "Zug", "Flugzeug", "Schiff", "Motorrad", "Straße", "Brücke", "Ampel", "Park", "Garten", "Bank", "Schule", "Universität", "Krankenhaus", "Kirche", "Supermarkt", "Kino", "Theater", "Museum", "Bibliothek", "Rathaus", "Burg", "Bahnhof", "Flughafen", "Hafen", "Geld", "Münze", "Kreditkarte", "Schlüssel", "Briefkasten", "Geschenk", "Ball", "Puppe", "Spielzeug", "Musik", "Lied", "Gitarre", "Klavier", "Trommel", "Film", "Kunst", "Gemälde"],
    "Natur": ["Baum", "Blume", "Pflanze", "Gras", "Wald", "Pilz", "Strauch", "Blatt", "Rose", "Tulpe", "Eiche", "Löwenzahn", "Kaktus", "Alge", "See", "Meer", "Fluss", "Bach", "Teich", "Ozean", "Wasserfall", "Strand", "Insel", "Wüste", "Gebirge", "Berg", "Tal", "Hügel", "Felsen", "Höhle", "Stein", "Sand", "Erde", "Planet", "Sonne", "Mond", "Stern", "Sternschnuppe", "Komet", "Himmel", "Wolke", "Regen", "Schnee", "Hagel", "Sturm", "Wind", "Nebel", "Regenbogen", "Donner", "Blitz", "Feuer", "Lava", "Vulkan", "Erdbeben", "Tornado", "Gewitter", "Eis", "Frost", "Feld", "Busch", "Gletscher", "Koralle", "Riff", "Dschungel", "Sumpf", "Moor", "Klippe", "Geysir", "Polarlicht", "Aurora", "Steppen", "Savanne", "Oase", "Ufer", "Welle", "Strömung", "Nacht", "Morgengrauen", "Sonnenaufgang", "Sonnenuntergang", "Dämmerung", "Schatten", "Wasser", "Luft", "Hitze", "Kälte", "Tanne", "Kiefer", "Orchidee", "Lilie", "Galaxie", "Universum", "Schlucht", "Dunst", "Wirbelsturm", "Meteorit", "Laub", "Samen", "Ast", "Boden"],
    "Arbeit": ["Pilot", "Arzt", "Zahnarzt", "Friseur", "Rechtsanwalt", "Verkäufer", "Busfahrer", "Lehrer", "Professor", "Assistent", "Schriftsteller", "Redakteur", "Architekt", "Automechaniker", "Bäcker", "Bankangestellter", "Maurer", "Makler", "Programmierer", "Koch", "Angestellter", "Arbeiter", "Tischler", "Journalist", "Musiker", "Krankenpfleger", "Fotograf", "Sekretär", "Taxifahrer", "LKW-Fahrer", "Kellner", "Polizist", "Feuerwehrmann", "Ingenieur", "Briefträger", "Schauspieler", "Sänger", "Maler", "Künstler", "Astronaut", "Bauer", "Pfarrer", "Richter", "Direktor", "Mechaniker", "Elektriker", "Apotheker", "Physiker", "Chemiker", "Biologe", "Mathematiker", "Psychologe", "Forscher", "Dolmetscher", "Übersetzer", "Entwickler", "Designer", "Grafiker", "Modell", "Chef", "Flugbegleiter", "Lokführer", "Kapitän", "Matrose", "Kassierer", "Bibliothekar", "Zimmermann", "Dachdecker", "Klempner", "Gärtner", "Florist", "Barkeeper", "Bergmann", "Förster", "Jäger", "Fischer", "Bauarbeiter", "Müllmann", "Trainer", "Sportler", "Detektiv", "DJ", "Buchhalter", "Buchhändler", "Schaffner", "Bürgermeister", "Politiker", "Tierarzt", "Projektleiter", "Bildhauer", "Regisseur", "Autor", "Clown", "Zauberer", "Sanitäter", "Hausmeister", "Schneider", "Wissenschaftler", "Komiker", "Spion"],
    "Gefühle": ["Liebe", "Hass", "Freude", "Trauer", "Wut", "Ärger", "Angst", "Überraschung", "Neid", "Eifersucht", "Stolz", "Scham", "Verlegenheit", "Reue", "Verzweiflung", "Hoffnung", "Langeweile", "Heimweh", "Fernweh", "Nervosität", "Aufregung", "Begeisterung", "Einsamkeit", "Zufriedenheit", "Neugier", "Erleichterung", "Dankbarkeit", "Ekel", "Vertrauen", "Misstrauen", "Gier", "Geduld", "Frustration", "Stress", "Zuversicht", "Kummer", "Mitleid", "Melancholie", "Rachsucht", "Vergnügen", "Erstaunen", "Zuneigung", "Leidenschaft", "Glück", "Panik", "Sehnsucht", "Enttäuschung", "Empörung", "Sorge", "Gelassenheit", "Zorn", "Unruhe", "Verachtung", "Ehrfurcht", "Spaß", "Laune", "Bitterkeit", "Scheu", "Schadenfreude", "Verliebtheit", "glücklich", "traurig", "wütend", "verärgert", "überrascht", "neidisch", "eifersüchtig", "stolz (adj)", "beschämt", "verlegen", "nervös", "aufgeregt", "gelangweilt", "zufrieden (adj)", "unzufrieden (adj)", "enttäuscht", "erschrocken", "ängstlich", "ruhig (feeling calm)", "verliebt"],
    "Farben": ["Altrosa", "Anthrazit", "Aquamarin", "Azurblau", "Beige", "Blassrosa", "Blau", "Blaugrün", "Champagner", "Creme", "Cyan", "Dottergelb", "Dunkelblau", "Dunkelgelb", "Dunkelgrün", "Eierschale", "Elfenbein", "Erdbeerrot", "Flamingorosa", "Flieder", "Fuchsia", "Gelb", "Gold", "Grau", "Grün", "Hellgelb", "Heidelbeerblau", "Himbeerrot", "Himmelblau", "Hyazinthe", "Indigo", "Jadegrün", "Jägergrün", "Kamelbraun", "Karamell", "Karminrot", "Kastanie", "Kirschrot", "Kobaltblau", "Korallenrot", "Kurkumagelb", "Lachs", "Limettengrün", "Magenta", "Marrone", "Mauve", "Mittelbraun", "Nachtblau", "Naturweiß", "Neongrün", "Nude", "Nussbraun", "Ocker", "Olivgrün", "Orange", "Pastellgelb", "Petrol", "Platin", "Purpur", "Quarzgrau", "Rosa", "Roségold", "Rostbraun", "Rubinrot", "Saffran", "Sandfarbe", "Schiefergrau", "Schwarz", "Silber", "Smaragdgrün", "Tannengrün", "Türkis", "Ultramarinblau", "Violett", "Weiß", "Xanthós", "Zimtbraun", "Zinnoberrot", "Zitronengelb", "Zyklame", "Rot", "Braun", "Lila", "Pink", "Hellblau", "Hellgrün", "Dunkelrot", "Kupfer", "Hellbraun", "Hellgrau", "Dunkelgrau", "Bordeauxrot", "Mintgrün", "Lavendel", "Apricot", "Neonpink", "Sepia", "Terrakotta", "Khaki", "Bronze"],
    "Adjektive": ["gut", "schlecht", "schön", "hässlich", "groß", "klein", "lang", "kurz", "hoch", "niedrig", "laut", "leise", "schnell", "langsam", "schwer", "leicht", "teuer", "billig", "voll", "leer", "hell", "dunkel", "kalt", "warm", "heiß", "neu", "alt", "jung", "stark", "schwach", "sauber", "schmutzig", "dreckig", "rund", "eckig", "hart", "weich", "tief", "flach", "dumm", "klug", "nah", "fern", "still", "ruhig", "freundlich", "unfreundlich", "mutig", "feige", "lustig", "witzig", "ernst", "fröhlich", "traurig", "langweilig", "spannend", "interessant", "einfach", "kompliziert", "dick", "dünn", "eng", "weit", "trocken", "nass", "hungrig", "satt", "durstig", "müde", "wach", "faul", "fleißig", "reich", "arm", "gefährlich", "sicher", "nervös", "vorsichtig", "ungeduldig", "geduldig", "zufrieden", "unzufrieden", "optimistisch", "pessimistisch", "bekannt", "unbekannt", "kaputt", "ganz", "richtig", "falsch", "bunt", "farblos", "gerade", "krumm", "wild", "zahm", "scharf", "stumpf", "glatt", "rau", "lecker", "eklig", "locker", "fest", "entspannt", "gestresst"],
    "Verben": ["gehen", "laufen", "rennen", "springen", "sitzen", "stehen", "liegen", "essen", "trinken", "schlafen", "wachen", "schreiben", "lesen", "sprechen", "sagen", "hören", "sehen", "schauen", "geben", "nehmen", "bringen", "holen", "werfen", "fangen", "kaufen", "verkaufen", "bezahlen", "bekommen", "arbeiten", "lernen", "spielen", "singen", "tanzen", "lachen", "weinen", "denken", "glauben", "wissen", "verstehen", "vergessen", "erinnern", "finden", "suchen", "fragen", "antworten", "beginnen", "enden", "öffnen", "schließen", "anmachen", "ausmachen", "aufstehen", "hinsetzen", "kommen", "fahren", "fliegen", "reiten", "schwimmen", "tauchen", "steigen", "fallen", "einsteigen", "aussteigen", "ziehen", "drücken", "schieben", "tragen", "halten", "klatschen", "schlagen", "treten", "kämpfen", "siegen", "verlieren", "gewinnen", "bauen", "brechen", "schneiden", "kochen", "backen", "waschen", "putzen", "malen", "zeichnen", "fotografieren", "telefonieren", "feiern", "küssen", "umarmen", "heiraten", "leben", "sterben", "träumen", "hoffen", "fühlen", "riechen", "scheinen", "brennen", "frieren", "schmelzen", "regnen", "schneien", "explodieren"],
    "Tiere": ["Aal", "Affe", "Ameisenbär", "Achatschnecke", "Amsel", "Adler", "Anaconda", "Aasgeier", "Blauwal", "Bär", "Braunbär", "Brillenbär", "Bison", "Blaumeise", "Bergziege", "Biene", "Blindschleiche", "Borkenkäfer", "Biber", "Blattlaus", "Chamäleon", "Chihuahua", "Corgi", "Chinchilla", "Clownfisch", "Dromedar", "Drossel", "Dingo", "Dachs", "Dackel", "Delfin", "Eidechse", "Eisbär", "Esel", "Erdmolch", "Eichhörnchen", "Elefant", "Elch", "Fliege", "Fischotter", "Fledermaus", "Fisch", "Flamingo", "Feldmaus", "Fink", "Fuchs", "Floh", "Falke", "Giraffe", "Gürteltier", "Graureiher", "Graugans", "Gelse", "Gepard", "Guppi", "Glühwürmchen", "Gazelle", "Grüne Mamba", "Hund", "Hase", "Heuschrecke", "Haifisch", "Hammerhai", "Hirsch", "Hirschkäfer", "Humboldtpinguin", "Hyäne", "Hängebauchschwein", "Iltis", "Igel", "Indri", "Jaguar", "Japanische Riesenseespinne", "Junikäfer", "Jakobsmuschel", "Krokodil", "Kakadu", "Katze", "Kaninchen", "Kuh", "Känguru", "Karibu", "Koala", "Klapperschlange", "Königspinguin", "Kobra", "Königskobra", "Kamel", "Kolibri", "Löwe", "Laus", "Lachs", "Leguan", "Leopard", "Luchs", "Maus", "Meerschweinchen", "Mantarochen", "Maultier", "Maikäfer", "Marienkäfer", "Mähnenrobbe", "Magellan-Pinguin", "Mops", "Maulwurf", "Murmeltier", "Nilpferd", "Nashorn", "Nasenbär", "Nacktschnecke", "Nachtfalter", "Okapi", "Orang-Utan", "Otter", "Orca", "Opossum", "Pelikan", "Pinguin", "Pottwal", "Python", "Panda", "Pudel", "Qualle", "Rosenkäfer", "Rhinozeros", "Regenwurm", "Rotkehlchen", "Rentier", "Ratte", "Rotfuchs", "Rochen", "Reh", "Ringelnatter", "Roter Koala", "Robbe", "Schaf", "Schmetterling", "Schneeeule", "Schildkröte", "Schlange", "Schnecke", "Stabheuschrecke", "Stier", "Stachelrochen", "Schimpanse", "Skorpion", "Streifenhörnchen", "Schwein", "Tiger", "Trampeltier", "Texas-Krötenechse", "Tapir", "Uhu", "Unke", "Ur", "Vampirfledermaus", "Vogelspinne", "Walross", "Wasserschildkröte", "Wühlmaus", "Wüstenspringmaus", "Weißer Hai", "Wildziege", "Wisent", "Wespe", "Wanze", "Weinbergschnecke", "Wildgans", "Wildschwein", "Wolf", "Waran", "Warzenschwein", "Xenopus", "Yak", "Yorkshire Terrier", "Zebra", "Zitronenfalter", "Zitteraal", "Ziege", "Ziesel", "Zwergspitz"],
    "Essen & Trinken": ["Apfel", "Banane", "Orange", "Erdbeere", "Traube", "Zitrone", "Kirsche", "Melone", "Pfirsich", "Birne", "Ananas", "Kiwi", "Mango", "Tomate", "Kartoffel", "Karotte", "Gurke", "Salat", "Brokkoli", "Blumenkohl", "Kürbis", "Zwiebel", "Knoblauch", "Paprika", "Pilz", "Champignon", "Brot", "Käse", "Ei", "Milch", "Butter", "Fleisch", "Schinken", "Wurst", "Wasser", "Tee", "Kaffee", "Bier", "Wein", "Saft", "Cola", "Limonade", "Schokolade", "Kuchen", "Keks", "Bonbon", "Eis", "Acerola", "Apfelbeere", "Aubergine", "Avocado", "Blaubeere", "Bohne", "Brombeere", "Buschbohne", "Butterkohl", "Cantaloupe-Melone", "Chili", "Chirimoya", "Clementine", "Cranberry", "Dattel", "Erdnuss", "Fenchel", "Gemüsezwiebel", "Gewürzgurke", "Grüne Bohne", "Grünkohl", "Hallimasch", "Heidelbeere", "Ingwer", "Johannisbeere", "Kaki", "Kichererbse", "Kidneybohne", "Knollensellerie", "Kohl", "Kohlrabi", "Kohlrübe", "Kumquat", "Litschi", "Macadamia", "Mangold", "Maracuja", "Mohrrübe", "Moltebeere", "Moosbeere", "Möhre", "Neuseelandspinat", "Novemberbirne", "Okra", "Olive", "Papaya", "Passionsfrucht", "Peperoni", "Pfifferling", "Pflaume", "Physalis", "Pistazie", "Plattpfirsich", "Porree", "Preiselbeere", "Radicchio", "Rettich", "Rhabarber", "Romanasalat", "Romanesco", "Romanesko", "Rosenkohl", "Rotkohl", "Runkelrübe", "Rübstiel", "Saubohne", "Schwarzwurzel", "Sharonfrucht", "Sojabohne", "Speierling", "Spitzkohl", "Steckrübe", "Reis"],
    "Sport & Freizeit": ["Fußball", "Basketball", "Volleyball", "Handball", "Baseball", "Rugby", "Eishockey", "Cricket", "Tennis", "Tischtennis", "Badminton", "Golf", "Boxen", "Karate", "Judo", "Ringen", "Gewichtheben", "Leichtathletik", "Marathon", "Skifahren", "Snowboarden", "Surfen", "Segeln", "Schwimmen", "Tauchen", "Klettern", "Wandern", "Reiten", "Skateboard", "Rollschuh", "Bogenschießen", "Schießen", "Autorennen", "Radrennen", "Angeln", "Camping", "Picknick", "Schach", "Brettspiel", "Puzzle", "Bowling", "Billard", "Darts", "Kartenspiel", "Poker", "Videospiel", "Kino", "Konzert", "Musik", "Lesen", "Schreiben", "Malen", "Fotografie", "Kochen", "Backen", "Gartenarbeit", "Tanzen", "Singen", "Fechten", "Turnen", "Motorradrennen", "Yoga", "Joggen", "Fitnessstudio", "Feiern"]
};
/* Vor Spielstart: Shuffle alle Kategorien (Fisher-Yates) */
for (let cat in categories) {
  shuffleArray(categories[cat]);
}

/***** Spielzustand Variablen *****/
let players = [];           // Array von Spielerobjekten {name:..., score:...}
let currentPlayerIndex = 0; // Index des gerade aktiven Spielers
let currentRound = 1;       // Laufende Rundennummer (1 bis 3)
let currentCategory = "";   // Gewählte Kategorie in der laufenden Runde
let timeLeft = 0;           // Verbleibende Sekunden im Timer
let timerInterval = null;   // Intervall ID für den Countdown-Timer
// Indexstände für Kategorien, um nicht erneut gleiche Wörter in einer neuen Runde zu verwenden
const categoryIndex = {};
for (let cat in categories) {
  categoryIndex[cat] = 0;
}

/***** DOM-Elemente abrufen *****/
const setupScreen = document.getElementById("setupScreen");
const playerCountSelect = document.getElementById("playerCount");
const nameInputsDiv = document.getElementById("nameInputs");
const startGameBtn = document.getElementById("startGameBtn");

const categoryScreen = document.getElementById("categoryScreen");
const categoryPrompt = document.getElementById("categoryPrompt");
const categoryButtonsDiv = document.getElementById("categoryButtons");

const gameScreen = document.getElementById("gameScreen");
const countdownDisplay = document.getElementById("countdown");
const gamePlayDiv = document.getElementById("gamePlay");
const timerDisplay = document.getElementById("timer");
const wordDisplay = document.getElementById("wordDisplay");
const passBtn = document.getElementById("passBtn");
const nextBtn = document.getElementById("nextBtn");

const nextPlayerScreen = document.getElementById("nextPlayerScreen");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");

const resultScreen = document.getElementById("resultScreen");
const scoreBoardDiv = document.getElementById("scoreBoard");
const restartBtn = document.getElementById("restartBtn");

/***** Hilfsfunktionen *****/

/** Fisher-Yates Shuffle: mischt das gegebene Array in zufälliger Reihenfolge [oai_citation:3‡w3schools.com](https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort_random2#:~:text=JavaScript%20Array%20Sort%20,Try%20it) */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Tausche array[i] mit array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/** Timer-Anzeige aktualisieren im Format mm:ss */
function updateTimerDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  // Format mit führender Null bei Sekunden < 10
  timerDisplay.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

/** Nächstes Wort aus der aktuellen Kategorie anzeigen */
function showNextWord() {
  if (!currentCategory) return;
  const words = categories[currentCategory];
  let idx = categoryIndex[currentCategory];
  // Wenn wir am Ende der Wortliste sind, wieder von vorne oder neu mischen
  if (idx >= words.length) {
    shuffleArray(words);
    categoryIndex[currentCategory] = 0;
    idx = 0;
  }
  // Zeige das Wort und erhöhe Index
  wordDisplay.textContent = words[idx];
  categoryIndex[currentCategory] += 1;
}

/** Startet den 90-Sekunden Timer für die aktuelle Runde */
function startTimer() {
  timeLeft = 90;
  updateTimerDisplay(timeLeft);
  // Intervall jede Sekunde
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (timeLeft <= 0) {
      // Zeit abgelaufen
      clearInterval(timerInterval);
      endRound();
    }
  }, 1000);
}

/** Beendet die laufende Runde (Zeit abgelaufen oder vorzeitig, falls benötigt) */
function endRound() {
  // Stoppe Timer und Buttons
  clearInterval(timerInterval);
  timerInterval = null;
  // Verstecke Spielanzeige und zeige "Weiter zur nächsten Person"
  gamePlayDiv.classList.add("hidden");
  nextPlayerScreen.classList.remove("hidden");
  // (Das Wort bleibt zuletzt angezeigt, das ist okay, oder man könnte es leeren)
}

/** Wechselt zum nächsten Spieler bzw. Endergebnis nach allen Runden */
function nextPlayerOrFinish() {
  // Rundenwechsel: zum nächsten Spieler
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    // Alle Spieler dieser Runde durch, gehe zur nächsten Rundennummer
    currentPlayerIndex = 0;
    currentRound++;
  }
  // Prüfen ob das Spiel vorbei ist (alle 3 Runden pro Spieler gespielt)
  if (currentRound > 3) {
    showFinalResults();
  } else {
    // Nächsten Spieler starten lassen
    showCategorySelection();
  }
}

/** Zeigt das Endergebnis und Gewinner an */
function showFinalResults() {
  // Sortiere optional nach Punkten (hier behalten wir Originalreihenfolge bei)
  scoreBoardDiv.innerHTML = "";
  // Besten Punktwert ermitteln
  let highScore = 0;
  players.forEach(p => {
    if (p.score > highScore) highScore = p.score;
  });
  // Jeden Spieler auflisten
  players.forEach(p => {
    const pElem = document.createElement("p");
    pElem.textContent = `${p.name}: ${p.score} Punkte`;
    if (p.score === highScore && highScore > 0) {
      // Gewinner markieren (Trophy Emoji hinzufügen und Klasse)
      pElem.textContent += " 🏆";
      pElem.classList.add("winner");
    }
    scoreBoardDiv.appendChild(pElem);
  });
  // Zeige Ergebnis-Screen
  nextPlayerScreen.classList.add("hidden");
  categoryScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
}

/***** Event Handler Funktionen *****/

/** Aktualisiert die Namens-Eingabefelder nach Auswahl der Spieleranzahl */
function onPlayerCountChange() {
  const count = parseInt(playerCountSelect.value);
  // Lösche existierende Input-Felder
  nameInputsDiv.innerHTML = "";
  // Erstelle für jeden Spieler ein Textfeld
  for (let i = 1; i <= count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Name Spieler ${i}`;
    input.id = `playerName${i}`;
    nameInputsDiv.appendChild(input);
  }
}

/** Startet das Spiel nach Klick auf "Spiel Starten" */
function startGame() {
  const count = parseInt(playerCountSelect.value);
  players = [];
  let emptyName = false;
  // Sammle Namen ein und erzeuge Spielerobjekte
  for (let i = 1; i <= count; i++) {
    const nameInput = document.getElementById(`playerName${i}`);
    let name = nameInput.value.trim();
    if (name === "") {
      name = `Spieler${i}`; // Standardname vergeben falls Feld leer
      emptyName = true;
    }
    players.push({ name: name, score: 0 });
  }
  if (emptyName) {
    alert("Hinweis: Leere Namen wurden automatisch benannt.");
  }
  // Zum Kategorie-Auswahl Screen wechseln
  setupScreen.classList.add("hidden");
  showCategorySelection();
}

/** Kategorie-Auswahl für aktuellen Spieler anzeigen */
function showCategorySelection() {
  // Setze Aufforderung: "[Name], wähle eine Kategorie:"
  const currentPlayerName = players[currentPlayerIndex].name;
  categoryPrompt.textContent = `${currentPlayerName}, wähle eine Kategorie:`;
  // Zeige Kategorie-Screen und verstecke andere
  categoryScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  nextPlayerScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
}

/** Startet die Spielrunde, wenn eine Kategorie gewählt wurde */
function startRoundWithCategory(catName) {
  currentCategory = catName;
  // Verstecke Kategorieauswahl
  categoryScreen.classList.add("hidden");
  // Zeige den Countdown im Spielscreen
  gamePlayDiv.classList.add("hidden");
  countdownDisplay.textContent = ""; // Clear any previous
  gameScreen.classList.remove("hidden");
  countdownDisplay.classList.remove("hidden");
  // 3-2-1 Countdown anzeigen
  let count = 3;
  countdownDisplay.textContent = count;
  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownDisplay.textContent = count;
    } else {
      // Countdown fertig
      clearInterval(countdownInterval);
      countdownDisplay.classList.add("hidden");
      gamePlayDiv.classList.remove("hidden");
      // Starte erste Wortanzeige und Timer
      showNextWord();
      startTimer();
    }
  }, 1000);
}

/** Behandlung des "Weiter" Buttons – Punkt + nächstes Wort */
function onNextWordGuessed() {
  // Punkt für aktuellen Spieler
  players[currentPlayerIndex].score += 1;
  // Nächstes Wort anzeigen
  showNextWord();
}

/** Behandlung des "Passen" Buttons – kein Punkt, aber Wort skippen */
function onPassWord() {
  // Einfach nächstes Wort ohne Score-Änderung
  showNextWord();
}

/** Behandlung des "Weiter zur nächsten Person" Buttons */
function onNextPlayer() {
  // Nächster Spieler oder Runde
  nextPlayerScreen.classList.add("hidden");
  nextPlayerOrFinish();
}

/** Spielneustart (Seite zurücksetzen) */
function onRestartGame() {
  // Seite neu laden (oder alles manuell zurücksetzen)
  location.reload();
}

/***** Initialisierung *****/

// Fülle zunächst die Eingabefelder für Spielernamen (Standard 2 Spieler)
onPlayerCountChange();
// Verbinde Events
playerCountSelect.addEventListener("change", onPlayerCountChange);
startGameBtn.addEventListener("click", startGame);
passBtn.addEventListener("click", onPassWord);
nextBtn.addEventListener("click", onNextWordGuessed);
nextPlayerBtn.addEventListener("click", onNextPlayer);
restartBtn.addEventListener("click", onRestartGame);

// Erzeuge Kategorie-Buttons dynamisch
Object.keys(categories).forEach(catName => {
  const btn = document.createElement("button");
  btn.textContent = catName;
  btn.addEventListener("click", () => startRoundWithCategory(catName));
  categoryButtonsDiv.appendChild(btn);
});