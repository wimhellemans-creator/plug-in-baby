# Coach Zinssner — Volledige Projectcode

Alle code voor het Coach Zinssner-project. Drie standalone HTML-bestanden, geen dependencies.

---

## 1. app.html — Coach Zinssner (schrijfcoach)

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coach Zinssner</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #1a1a1a;
      background: #f0f1f3;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Top bar ── */
    .topbar {
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      font-size: 18px;
      font-weight: 700;
      color: #c0392b;
      letter-spacing: -0.3px;
    }

    .logo-sub {
      font-size: 11px;
      color: #999;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .api-key-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .api-key-group label {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
    }

    .api-key-input {
      width: 260px;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 12px;
      font-family: monospace;
    }

    .api-key-input:focus {
      outline: none;
      border-color: #c0392b;
    }

    .api-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      flex-shrink: 0;
    }

    .api-status.connected { background: #28a745; }
    .api-status.error { background: #dc3545; }

    /* ── Main layout ── */
    .main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── Editor (center) ── */
    .editor-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-right: 1px solid #e0e0e0;
    }

    .editor-toolbar {
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .editor-toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-upload {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 12px;
      background: #fff;
      cursor: pointer;
      color: #333;
    }

    .btn-upload:hover { background: #f0f0f0; }

    .editor-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #888;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stat-value {
      font-weight: 600;
      color: #555;
      font-variant-numeric: tabular-nums;
    }

    #editor {
      flex: 1;
      padding: 32px 48px;
      font-size: 16px;
      line-height: 1.8;
      outline: none;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    #editor:empty::before {
      content: "Plak of typ je tekst hier, of gebruik 'Bestand uploaden' hierboven...";
      color: #bbb;
    }

    #editor .czn-highlight {
      background: rgba(192, 57, 43, 0.12);
      border-bottom: 2px solid rgba(192, 57, 43, 0.4);
      border-radius: 2px;
      transition: all 0.25s ease;
      cursor: default;
    }

    #editor .czn-highlight.active {
      background: rgba(192, 57, 43, 0.25);
      border-bottom-color: #c0392b;
    }

    #editor .czn-applied {
      background: rgba(40, 167, 69, 0.25);
      border-radius: 2px;
      transition: background 2s ease;
    }

    #editor .czn-applied.fade { background: transparent; }

    /* ── Coach panel (right) ── */
    .coach-panel {
      width: 400px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: #fafafa;
      overflow: hidden;
    }

    .coach-header {
      padding: 16px 20px;
      border-bottom: 2px solid #c0392b;
      background: #fff;
      flex-shrink: 0;
    }

    .coach-header h2 {
      font-size: 16px;
      font-weight: 700;
      color: #c0392b;
    }

    .coach-header p {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
    }

    .coach-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    .coach-footer {
      padding: 12px 20px;
      border-top: 1px solid #e0e0e0;
      background: #fff;
      flex-shrink: 0;
      display: flex;
      gap: 8px;
    }

    /* ── Status ── */
    .status-msg {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #856404;
    }

    .status-msg.success { background: #d4edda; border-color: #28a745; color: #155724; }
    .status-msg.error { background: #f8d7da; border-color: #dc3545; color: #721c24; }
    .status-msg.info { background: #e8f4fd; border-color: #bee5eb; color: #0c5460; }

    /* ── Diagnosis ── */
    .diagnosis {
      background: #fff;
      border-left: 3px solid #c0392b;
      padding: 10px 14px;
      margin-bottom: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      border-radius: 0 6px 6px 0;
      font-style: italic;
      display: none;
    }

    .diagnosis.visible { display: block; }

    /* ── Round info ── */
    .round-info {
      display: none;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 12px;
      color: #666;
    }

    .round-info.visible { display: flex; }

    .round-badge {
      background: #c0392b;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .progress-text { font-variant-numeric: tabular-nums; }

    /* ── Suggestion card ── */
    .suggestion-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      transition: all 0.35s ease;
      position: relative;
      cursor: pointer;
    }

    .suggestion-card.removing {
      opacity: 0;
      transform: translateX(60px);
      max-height: 0;
      padding: 0 12px;
      margin-bottom: 0;
      overflow: hidden;
    }

    .suggestion-type {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #c0392b;
      margin-bottom: 4px;
    }

    .suggestion-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 8px;
      margin-bottom: 2px;
    }

    .suggestion-label.was { color: #999; }
    .suggestion-label.wordt { color: #28a745; }

    .suggestion-original {
      background: #fff5f5;
      border-left: 3px solid #dc3545;
      padding: 6px 10px;
      margin: 0 0 4px;
      font-size: 13px;
      border-radius: 0 4px 4px 0;
      text-decoration: line-through;
      color: #888;
    }

    .suggestion-replacement {
      background: #f0fff4;
      border-left: 3px solid #28a745;
      padding: 6px 10px;
      margin: 0 0 4px;
      font-size: 13px;
      border-radius: 0 4px 4px 0;
      color: #1a1a1a;
      font-weight: 500;
    }

    .suggestion-delete {
      background: #fff0f0;
      border-left: 3px solid #dc3545;
      padding: 6px 10px;
      margin: 0 0 4px;
      font-size: 12px;
      font-weight: 700;
      color: #dc3545;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 0 4px 4px 0;
    }

    .suggestion-card:hover {
      border-color: #c0392b;
    }

    .suggestion-explanation {
      font-size: 12px;
      color: #666;
      margin: 6px 0 8px;
      font-style: italic;
    }

    .suggestion-actions {
      display: flex;
      gap: 8px;
    }

    .btn-accept, .btn-reject {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 2px solid;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: #fff;
    }

    .btn-accept { border-color: #28a745; color: #28a745; }
    .btn-accept:hover { background: #28a745; color: #fff; transform: scale(1.1); }

    .btn-reject { border-color: #dc3545; color: #dc3545; }
    .btn-reject:hover { background: #dc3545; color: #fff; transform: scale(1.1); }

    /* ── Buttons ── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary { background: #c0392b; color: #fff; flex: 1; justify-content: center; }
    .btn-primary:hover:not(:disabled) { background: #a93226; }

    .btn-secondary {
      background: #e9ecef;
      color: #495057;
      flex: 1;
      justify-content: center;
    }

    .btn-secondary:hover:not(:disabled) { background: #dee2e6; }

    /* ── Loading ── */
    .loading {
      text-align: center;
      padding: 32px 16px;
      color: #888;
      display: none;
    }

    .loading.visible { display: block; }

    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid #e0e0e0;
      border-top-color: #c0392b;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 10px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Empty state ── */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #aaa;
    }

    .empty-state .icon { font-size: 36px; margin-bottom: 12px; }
    .empty-state p { font-size: 13px; line-height: 1.6; }

    /* ── Responsive ── */
    @media (max-width: 860px) {
      .main { flex-direction: column; }
      .coach-panel { width: 100%; border-top: 1px solid #e0e0e0; }
      .editor-panel { border-right: none; }
      #editor { padding: 20px 24px; }
      .api-key-input { width: 180px; }
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #aaa; }
  </style>
</head>
<body>

  <!-- Top bar -->
  <div class="topbar">
    <div class="topbar-left">
      <span class="logo">Coach Zinssner</span>
      <span class="logo-sub">schrijfcoach voor heldere teksten</span>
    </div>
    <div class="topbar-right">
      <div class="api-key-group">
        <label for="api-key">API key:</label>
        <input type="password" id="api-key" class="api-key-input" placeholder="sk-ant-..." />
        <div id="api-status" class="api-status" title="Niet verbonden"></div>
      </div>
    </div>
  </div>

  <!-- Main layout -->
  <div class="main">

    <!-- Center: Editor -->
    <div class="editor-panel">
      <div class="editor-toolbar">
        <div class="editor-toolbar-left">
          <button id="btn-upload" class="btn-upload">Bestand uploaden</button>
          <button id="btn-paste" class="btn-upload">Plakken</button>
          <button id="btn-clear" class="btn-upload">Wissen</button>
          <input type="file" id="file-input" accept=".txt,.md,.html,.doc,.rtf" hidden />
        </div>
        <div class="editor-stats">
          <div class="stat-item">
            <span>Woorden:</span>
            <span class="stat-value" id="word-count">0</span>
          </div>
          <div class="stat-item">
            <span>Tekens:</span>
            <span class="stat-value" id="char-count">0</span>
          </div>
        </div>
      </div>
      <div id="editor" contenteditable="true"></div>
    </div>

    <!-- Right: Coach panel -->
    <div class="coach-panel">
      <div class="coach-header">
        <h2>Zinssner</h2>
        <p>clarity &middot; simplicity &middot; brevity &middot; humanity</p>
      </div>

      <div class="coach-body" id="coach-body">
        <div id="status" class="status-msg info">
          Typ of plak een tekst links en klik op "Nalezen".
        </div>

        <div id="diagnosis" class="diagnosis"></div>

        <div id="round-info" class="round-info">
          <span>Ronde <span id="round-number">1</span></span>
          <span class="progress-text"><span id="progress-done">0</span> / <span id="progress-total">0</span></span>
        </div>

        <div id="loading" class="loading">
          <div class="spinner"></div>
          <span>Coach Zinssner leest na...</span>
        </div>

        <div id="suggestions-list"></div>

        <div id="empty-state" class="empty-state">
          <div class="icon">&#9998;</div>
          <p>Hier verschijnen straks de suggesties<br>van Coach Zinssner.</p>
        </div>
      </div>

      <div class="coach-footer">
        <button id="btn-review" class="btn btn-primary">Nalezen</button>
        <button id="btn-new-round" class="btn btn-secondary" disabled>Nieuwe ronde</button>
      </div>
    </div>

  </div>

  <script>
    // ════════════════════════════════════════
    //  COACH ZINSSNER SYSTEM PROMPT
    // ════════════════════════════════════════
    const SYSTEM_PROMPT = `# Zinsser-verbeteraar

Je bent een ervaren eindredacteur met een scherp oog voor heldere, krachtige journalistiek. Je helpt schrijvers om hun teksten te verbeteren volgens de principes van William Zinsser (*On Writing Well*): **clarity, simplicity, brevity, humanity**.

## Jouw filosofie

Elk woord moet zijn plek verdienen. Goed schrijven is helder schrijven, en helder schrijven begint met helder denken.

Dat betekent:
- Strip elke zin tot de essentiële componenten
- Kort woord boven lang woord
- Actieve vorm boven passief
- Sterke zelfstandige naamwoorden en werkwoorden; zuinig met bijvoeglijke naamwoorden en bijwoorden
- Concrete, specifieke taal — vermijd vage concepten

**Maar je bent geen snoeimachine.** Je snapt dat een goed citaat, een treffend detail, een moment van warmte het verhaal máákt. Die blijven staan. Het doel is niet inkorten, maar beter schrijven. Dat de tekst korter wordt, is een gevolg — geen doel op zich.

## Waar je op let

### 1. Woorden zonder functie
Elk woord moet iets toevoegen. Test elke zin: kan dit korter zonder betekenis te verliezen?

**Typische opvulwoorden om kritisch te bekijken:**
- *echter, overigens, uiteraard, eigenlijk, wel, toch, zeker, immers, namelijk, dus, ook, nog, reeds*

Deze zijn niet per definitie fout, maar vereisen de vraag: voegt dit iets toe?

### 2. Lange woorden en omslachtige constructies
Vervang waar mogelijk:
- "is te vinden in" → "ligt in"
- "met dank aan" → "door"
- "beter gekend als" → "of"
- "in eerste instantie" → schrappen
- "na verloop van tijd" → schrappen of concreter
- "blijken niet te werken" → "werken niet"
- "het probleem van" → schrappen

### 3. Bijwoorden
Vaak overbodig. De betekenis zit al in het werkwoord, of je hebt een sterker werkwoord nodig.
- *"glimlachte vrolijk"* — glimlachen is al vrolijk
- *"rende snel"* — rennen is al snel
- *"klemde zijn kaken stevig op elkaar"* — "stevig" is overbodig

### 4. Bijvoeglijke naamwoorden
Vaak overbodig. De betekenis zit al in het zelfstandig naamwoord, of je hebt een preciezer woord nodig.
- *"hoge wolkenkrabber"* — wolkenkrabbers zijn hoog
- *"gele narcis"* — narcissen zijn geel

Behoud bijvoeglijke naamwoorden die wél een functie hebben — die iets toevoegen wat de lezer anders niet zou weten.

### 5. Verzwakkers
Woordjes die een gedachte langer én zwakker maken:
- *een beetje, ietwat, erg, zeer, nogal, ongeveer, zoal, weliswaar, vrij, best wel, eigenlijk, misschien wel*

Als ze een echte functie hebben: houden. Als ze lucht vullen: schrappen.

### 6. Passieve constructies
Actief is bijna altijd beter. Passief verhult wie wat doet.
- "De beslissing werd genomen door de minister" → "De minister nam de beslissing"
- "Er wordt verwacht dat..." → "We verwachten dat..." of concreter: wie verwacht?

Passief mag als er geen elegante actieve variant is, of als de handelende persoon onbekend of onbelangrijk is.

### 7. Redundantie
- Zinnen die herhalen wat de vorige zin al zei
- Concepten die dubbel worden uitgelegd
- Passages die niets nieuws toevoegen

Als je iets net hebt uitgelegd, hoef je het niet nog een keer uit te leggen.

### 8. Interpunctie
- **Punt**: de meeste schrijvers arriveren er niet snel genoeg. Lange zin? Maak er twee of drie van. Een punt is vaak beter dan een komma.
- **Uitroepteken**: spaarzaam. Alleen als het echt iets toevoegt.
- **Puntkomma**: vergeet hem. Vervang door punt, dubbelpunt, komma of gedachtestreepje.

### 9. Synoniemen voor "zegt"
Pas op met *verklaart, stelt, legt uit, brieste, vulde aan, verduidelijkt*... "Zegt" is vaak de beste keuze. Als iemand iets uitlegt, doe dat dan — maar leg niet uit dát je uitlegt.

### 10. Herhaling van sprekernamen
Als de lezer weet wie spreekt, hoef je de naam niet te herhalen. Dat is vermoeiend en slechte stijl.

### 11. Quotes inkorten
Expertcitaten mogen korter, maar de betekenis moet intact blijven. Nietszeggende delen weg, de kern blijft. Naam en functie altijd behouden.

### 12. Overstatements
Als het feit al straf genoeg is, niet overdrijven. Journalistiek is geloofwaardig, waarachtig, echt.

## Wat je NIET doet

- Je raakt niet aan online-specifieke elementen: paywall-markers, "lees ook"-secties, verwijzingen naar foto's of video's
- Je voert nooit wijzigingen door zonder goedkeuring
- Je schrapt niet eigenmachtig wat het verhaal zijn ziel geeft: rake citaten, menselijke details, de stem van de geïnterviewde
- Je herschrijft niet de stijl van de auteur — je snoeit, je vervangt niet
- Je schrapt geen belangrijke informatie of nuances
- Je verdraait geen woorden in quotes — inkorten mag, vervalsen niet

## Toon

Zakelijk maar warm. Je legt kort uit waarom je iets voorstelt als dat niet evident is, maar je houdt het bondig. Je bent een collega die meedenkt, geen schoolmeester die corrigeert.

---

## OUTPUTFORMAAT (STRIKT)

Je antwoordt ALTIJD en UITSLUITEND in geldig JSON-formaat. Geen tekst buiten de JSON.

Begin met een diagnose-object, gevolgd door de suggesties. Rangschik op evidentie — wat het meest voor de hand ligt, komt eerst.

Geef je antwoord als JSON:
{
  "diagnosis": "Korte diagnose van de tekst in 2-3 zinnen: wat voor type stuk is dit, en waar zie je de meeste ruimte?",
  "suggestions": [
    {
      "type": "opvulwoord|constructie|bijwoord|bijvoeglijk|verzwakker|passief|redundantie|interpunctie|werkwoord|quote|overstatement|spelling|grammatica",
      "original": "de originele passage die vervangen moet worden (LETTERLIJK uit de brontekst)",
      "replacement": "de voorgestelde versie (of leeg voor SCHRAPPEN)",
      "explanation": "korte toelichting, alleen als het niet vanzelf spreekt"
    }
  ]
}

Regels voor de JSON:
- "original" moet LETTERLIJK in de brontekst voorkomen, karakter per karakter
- Als iets geschrapt moet worden zonder vervanging, gebruik dan "replacement": ""
- Rangschik suggesties van meest evident naar minst evident
- Focus op de suggesties die de tekst écht beter maken, niet op pietluttige details
- Als de tekst perfect is: { "diagnosis": "...", "suggestions": [] }
- Geen markdown, geen tekst buiten de JSON`;

    // ════════════════════════════════════════
    //  STATE
    // ════════════════════════════════════════
    let suggestions = [];
    let roundNumber = 0;
    let handledCount = 0;
    let totalCount = 0;

    // ════════════════════════════════════════
    //  DOM
    // ════════════════════════════════════════
    const editor = document.getElementById('editor');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const apiKeyInput = document.getElementById('api-key');
    const apiStatus = document.getElementById('api-status');
    const statusEl = document.getElementById('status');
    const diagnosisEl = document.getElementById('diagnosis');
    const roundInfo = document.getElementById('round-info');
    const roundNumberEl = document.getElementById('round-number');
    const progressDone = document.getElementById('progress-done');
    const progressTotal = document.getElementById('progress-total');
    const loadingEl = document.getElementById('loading');
    const suggestionsList = document.getElementById('suggestions-list');
    const emptyState = document.getElementById('empty-state');
    const btnReview = document.getElementById('btn-review');
    const btnNewRound = document.getElementById('btn-new-round');
    const btnUpload = document.getElementById('btn-upload');
    const btnPaste = document.getElementById('btn-paste');
    const btnClear = document.getElementById('btn-clear');
    const fileInput = document.getElementById('file-input');

    // ════════════════════════════════════════
    //  INIT
    // ════════════════════════════════════════
    // Restore API key from localStorage
    const savedKey = localStorage.getItem('czn_api_key');
    if (savedKey) {
      apiKeyInput.value = savedKey;
      apiStatus.classList.add('connected');
      apiStatus.title = 'API key opgeslagen';
    }

    apiKeyInput.addEventListener('change', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('czn_api_key', key);
        apiStatus.className = 'api-status connected';
        apiStatus.title = 'API key opgeslagen';
      } else {
        localStorage.removeItem('czn_api_key');
        apiStatus.className = 'api-status';
        apiStatus.title = 'Niet verbonden';
      }
    });

    editor.addEventListener('input', updateStats);
    btnReview.addEventListener('click', startReview);
    btnNewRound.addEventListener('click', startReview);
    btnUpload.addEventListener('click', () => fileInput.click());
    btnPaste.addEventListener('click', pasteFromClipboard);
    btnClear.addEventListener('click', () => { editor.innerText = ''; updateStats(); });
    fileInput.addEventListener('change', handleFileUpload);

    updateStats();

    // ════════════════════════════════════════
    //  STATS
    // ════════════════════════════════════════
    function updateStats() {
      const text = editor.innerText.trim();
      const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      const chars = text.length;
      wordCountEl.textContent = words.toLocaleString('nl-BE');
      charCountEl.textContent = chars.toLocaleString('nl-BE');
    }

    // ════════════════════════════════════════
    //  FILE UPLOAD
    // ════════════════════════════════════════
    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        editor.innerText = ev.target.result;
        updateStats();
        setStatus('Bestand geladen: ' + file.name, 'success');
      };
      reader.readAsText(file);
      fileInput.value = '';
    }

    async function pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        editor.innerText = text;
        updateStats();
        setStatus('Tekst geplakt vanuit klembord.', 'success');
      } catch (e) {
        setStatus('Kon niet plakken. Gebruik Ctrl+V in het tekstvak.', 'error');
      }
    }

    // ════════════════════════════════════════
    //  STATUS
    // ════════════════════════════════════════
    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'status-msg' + (type ? ' ' + type : '');
    }

    // ════════════════════════════════════════
    //  REVIEW
    // ════════════════════════════════════════
    async function startReview() {
      const text = editor.innerText.trim();
      if (!text) {
        setStatus('Typ of plak eerst een tekst in de editor.', 'error');
        return;
      }

      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        setStatus('Vul eerst je Anthropic API-sleutel in (rechtsboven).', 'error');
        apiKeyInput.focus();
        return;
      }

      // Clear old highlights from editor
      editor.querySelectorAll('.czn-highlight').forEach(el => {
        const textNode = document.createTextNode(el.textContent);
        el.parentNode.replaceChild(textNode, el);
      });
      editor.normalize();

      // Reset suggestions panel
      suggestionsList.innerHTML = '';
      suggestions = [];
      handledCount = 0;
      emptyState.style.display = 'none';
      diagnosisEl.classList.remove('visible');
      roundInfo.classList.remove('visible');
      btnReview.disabled = true;
      btnNewRound.disabled = true;
      loadingEl.classList.add('visible');

      roundNumber++;
      setStatus('Coach Zinssner leest je tekst na...', '');

      try {
        const result = await callClaude(apiKey, text);

        loadingEl.classList.remove('visible');

        // Show diagnosis
        if (result.diagnosis) {
          diagnosisEl.textContent = result.diagnosis;
          diagnosisEl.classList.add('visible');
        }

        suggestions = result.suggestions.map((s, i) => ({ ...s, id: i, status: 'pending' }));
        totalCount = suggestions.length;

        if (totalCount === 0) {
          setStatus('Uitstekend! Coach Zinssner heeft geen verbeteringen gevonden.', 'success');
          btnNewRound.disabled = false;
          btnReview.disabled = false;
          return;
        }

        // Show round info
        roundNumberEl.textContent = roundNumber;
        progressDone.textContent = '0';
        progressTotal.textContent = totalCount;
        roundInfo.classList.add('visible');

        // Render cards with stagger
        suggestions.forEach((s, i) => {
          setTimeout(() => renderCard(s), i * 120);
        });

        setStatus(totalCount + ' suggestie(s) gevonden. Klik ✓ of ✗.', 'success');

        // Mark API as connected
        apiStatus.className = 'api-status connected';
        apiStatus.title = 'Verbonden';

      } catch (err) {
        loadingEl.classList.remove('visible');
        setStatus(err.message, 'error');

        if (err.message.includes('API') || err.message.includes('401')) {
          apiStatus.className = 'api-status error';
          apiStatus.title = 'Fout';
        }
      }

      btnReview.disabled = false;
    }

    // ════════════════════════════════════════
    //  CLAUDE API CALL
    // ════════════════════════════════════════
    async function callClaude(apiKey, text) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{
            role: 'user',
            content: 'Lees de volgende tekst na en geef je diagnose en suggesties als JSON:\n\n' + text
          }]
        })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Ongeldige API-sleutel. Controleer je invoer rechtsboven.');
        if (response.status === 429) throw new Error('Te veel verzoeken. Wacht even en probeer opnieuw.');
        const body = await response.text();
        throw new Error('API-fout (' + response.status + '): ' + body.substring(0, 200));
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { diagnosis: parsed.diagnosis || '', suggestions: parsed.suggestions || [] };
      }

      try {
        const parsed = JSON.parse(content);
        return { diagnosis: parsed.diagnosis || '', suggestions: parsed.suggestions || [] };
      } catch (e) {
        throw new Error('Coach Zinssner gaf een onverwacht antwoord. Probeer opnieuw.');
      }
    }

    // ════════════════════════════════════════
    //  RENDER SUGGESTION CARD
    // ════════════════════════════════════════
    const TYPE_LABELS = {
      'opvulwoord': 'Opvulwoord', 'constructie': 'Constructie', 'bijwoord': 'Bijwoord',
      'bijvoeglijk': 'Bijvoeglijk nw.', 'verzwakker': 'Verzwakker', 'passief': 'Passief',
      'redundantie': 'Redundantie', 'interpunctie': 'Interpunctie', 'werkwoord': 'Werkwoord',
      'quote': 'Quote', 'overstatement': 'Overstatement', 'spelling': 'Spelling',
      'grammatica': 'Grammatica', 'stijl': 'Stijl', 'helderheid': 'Helderheid'
    };

    function renderCard(s) {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.id = 'card-' + s.id;
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';

      const isDelete = !s.replacement || s.replacement.trim() === '';
      const wordtLabel = isDelete ? 'Schrappen' : 'Wordt:';
      const replHtml = isDelete
        ? '<div class="suggestion-delete">SCHRAPPEN</div>'
        : '<div class="suggestion-replacement">' + esc(s.replacement) + '</div>';
      const explHtml = s.explanation
        ? '<div class="suggestion-explanation">' + esc(s.explanation) + '</div>'
        : '';

      card.innerHTML =
        '<div class="suggestion-type">' + (TYPE_LABELS[s.type] || s.type) + '</div>' +
        '<div class="suggestion-label was">Was:</div>' +
        '<div class="suggestion-original">' + esc(s.original) + '</div>' +
        '<div class="suggestion-label wordt">' + wordtLabel + '</div>' +
        replHtml + explHtml +
        '<div class="suggestion-actions">' +
          '<button class="btn-accept" title="Aanvaarden">✓</button>' +
          '<button class="btn-reject" title="Verwerpen">✗</button>' +
        '</div>';

      card.querySelector('.btn-accept').addEventListener('click', () => acceptCard(s.id));
      card.querySelector('.btn-reject').addEventListener('click', () => rejectCard(s.id));

      // Hover: highlight corresponding text in editor
      card.addEventListener('mouseenter', () => activateHighlight(s.id));
      card.addEventListener('mouseleave', () => deactivateHighlight(s.id));

      // Click: scroll editor to the highlighted passage
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-accept, .btn-reject')) return;
        scrollToHighlight(s.id);
      });

      suggestionsList.appendChild(card);

      // Highlight the original text in the editor
      highlightInEditor(s.id, s.original);

      requestAnimationFrame(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }

    // ════════════════════════════════════════
    //  HIGHLIGHTING IN EDITOR
    // ════════════════════════════════════════
    function highlightInEditor(id, original) {
      // Strategy 1: exact match in a single text node (fast path)
      if (highlightSingleNode(id, original)) return;

      // Strategy 2: multi-line passage — highlight each line separately
      const lines = original.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1) {
        let found = 0;
        for (const line of lines) {
          if (highlightSingleNode(id, line)) found++;
        }
        if (found > 0) return;
      }

      // Strategy 3: normalized whitespace match within single text nodes
      highlightNormalized(id, original);
    }

    function highlightSingleNode(id, text) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const idx = node.textContent.indexOf(text);
        if (idx === -1) continue;
        wrapMatch(node, idx, text.length, id);
        return true;
      }
      return false;
    }

    function highlightNormalized(id, original) {
      const normOrig = original.replace(/\s+/g, ' ').trim();
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const nodeText = node.textContent;
        let normText = '';
        const posMap = [];
        let i = 0;
        while (i < nodeText.length) {
          if (/\s/.test(nodeText[i])) {
            if (normText.length === 0 || normText[normText.length - 1] !== ' ') {
              posMap.push(i);
              normText += ' ';
            }
            i++;
          } else {
            posMap.push(i);
            normText += nodeText[i];
            i++;
          }
        }
        const normIdx = normText.indexOf(normOrig);
        if (normIdx === -1) continue;
        const origStart = posMap[normIdx];
        const normEnd = normIdx + normOrig.length;
        const origEnd = normEnd < posMap.length ? posMap[normEnd] : nodeText.length;
        wrapMatch(node, origStart, origEnd - origStart, id);
        return true;
      }
      return false;
    }

    function wrapMatch(textNode, offset, length, id) {
      const text = textNode.textContent;
      const before = text.substring(0, offset);
      const match = text.substring(offset, offset + length);
      const after = text.substring(offset + length);
      const span = document.createElement('span');
      span.className = 'czn-highlight';
      span.dataset.suggestionId = id;
      span.textContent = match;
      const parent = textNode.parentNode;
      if (before) parent.insertBefore(document.createTextNode(before), textNode);
      parent.insertBefore(span, textNode);
      if (after) parent.insertBefore(document.createTextNode(after), textNode);
      parent.removeChild(textNode);
    }

    function activateHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.add('active'));
      if (els.length > 0) els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function deactivateHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.remove('active'));
    }

    function scrollToHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.add('active'));
      if (els.length > 0) els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function removeHighlight(id) {
      const spans = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      spans.forEach(el => {
        el.parentNode.replaceChild(document.createTextNode(el.textContent), el);
      });
      if (spans.length > 0) editor.normalize();
    }

    // ════════════════════════════════════════
    //  ACCEPT / REJECT
    // ════════════════════════════════════════
    function acceptCard(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'accepted';

      const replacement = s.replacement || '';
      let applied = false;

      // Try 1: Replace highlight span(s) — may be multiple for multi-line highlights
      const spans = Array.from(editor.querySelectorAll('[data-suggestion-id="' + id + '"]'));
      if (spans.length > 0) {
        if (replacement) {
          const appliedSpan = document.createElement('span');
          appliedSpan.className = 'czn-applied';
          appliedSpan.textContent = replacement;
          spans[0].parentNode.replaceChild(appliedSpan, spans[0]);
          setTimeout(() => appliedSpan.classList.add('fade'), 2000);
          for (let i = 1; i < spans.length; i++) {
            spans[i].parentNode.removeChild(spans[i]);
          }
        } else {
          // SCHRAPPEN: remove all spans, clean up empty containers
          for (const span of spans) {
            const parent = span.parentNode;
            parent.removeChild(span);
            if (parent !== editor && !parent.textContent.trim()) {
              parent.parentNode.removeChild(parent);
            }
          }
        }
        editor.normalize();
        applied = true;
      }

      // Try 2: Fallback text-node search
      if (!applied) {
        applied = applyToEditor(s.original, replacement);
      }

      // Try 3: innerHTML-based replacement (handles cross-node HTML)
      if (!applied) {
        applied = applyViaInnerHTML(s.original, replacement);
      }

      updateStats();
      removeCard(id);
      advanceProgress();
    }

    function rejectCard(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'rejected';

      // Remove highlight, restore plain text
      removeHighlight(id);

      removeCard(id);
      advanceProgress();
    }

    function removeCard(id) {
      const card = document.getElementById('card-' + id);
      if (!card) return;
      card.classList.add('removing');
      setTimeout(() => card.remove(), 400);
    }

    function advanceProgress() {
      handledCount++;
      progressDone.textContent = handledCount;

      if (handledCount === totalCount) {
        const accepted = suggestions.filter(s => s.status === 'accepted').length;
        const rejected = suggestions.filter(s => s.status === 'rejected').length;
        setStatus('Ronde ' + roundNumber + ' klaar! ' + accepted + ' aanvaard, ' + rejected + ' verworpen.', 'success');
        btnNewRound.disabled = false;
      }
    }

    // ════════════════════════════════════════
    //  FALLBACK: TEXT-NODE SEARCH
    // ════════════════════════════════════════
    function applyToEditor(original, replacement) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;

      while (node = walker.nextNode()) {
        const idx = node.textContent.indexOf(original);
        if (idx === -1) continue;

        const before = node.textContent.substring(0, idx);
        const after = node.textContent.substring(idx + original.length);

        if (replacement) {
          const span = document.createElement('span');
          span.className = 'czn-applied';
          span.textContent = replacement;
          const afterNode = document.createTextNode(after);
          node.textContent = before;
          node.parentNode.insertBefore(span, node.nextSibling);
          node.parentNode.insertBefore(afterNode, span.nextSibling);
          setTimeout(() => span.classList.add('fade'), 2000);
        } else {
          node.textContent = before + after;
        }
        editor.normalize();
        return true;
      }
      return false;
    }

    // ════════════════════════════════════════
    //  FALLBACK: innerHTML (cross-node HTML)
    // ════════════════════════════════════════
    function applyViaInnerHTML(original, replacement) {
      const html = editor.innerHTML;

      // Direct match in innerHTML
      const escapedOrig = esc(original);
      if (html.includes(escapedOrig)) {
        applyHTMLReplace(html, escapedOrig, replacement);
        return true;
      }

      // Multi-line: original has \n but innerHTML has </div><div> or <br> between lines
      const lines = original.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1) {
        const pattern = lines.map(l => escRegex(esc(l))).join('[\\s\\S]*?');
        const regex = new RegExp(pattern);
        const match = html.match(regex);
        if (match) {
          applyHTMLReplace(html, match[0], replacement, true);
          return true;
        }
      }

      // Normalized whitespace match via innerText
      const fullText = editor.innerText;
      const normOrig = original.replace(/\s+/g, ' ').trim();
      const normText = fullText.replace(/\s+/g, ' ');
      const normIdx = normText.indexOf(normOrig);
      if (normIdx === -1) return false;

      // Map normalized position back to actual text positions
      let origPos = 0, normPos = 0;
      while (normPos < normIdx && origPos < fullText.length) {
        if (/\s/.test(fullText[origPos])) {
          while (origPos < fullText.length && /\s/.test(fullText[origPos])) origPos++;
          normPos++;
        } else { origPos++; normPos++; }
      }
      const matchStart = origPos;
      while (normPos < normIdx + normOrig.length && origPos < fullText.length) {
        if (/\s/.test(fullText[origPos])) {
          while (origPos < fullText.length && /\s/.test(fullText[origPos])) origPos++;
          normPos++;
        } else { origPos++; normPos++; }
      }
      const actualText = fullText.substring(matchStart, origPos);

      // Build regex from actual text lines for cross-node matching
      const actualLines = actualText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (actualLines.length > 1) {
        const pattern = actualLines.map(l => escRegex(esc(l))).join('[\\s\\S]*?');
        const regex = new RegExp(pattern);
        const match = html.match(regex);
        if (match) {
          applyHTMLReplace(html, match[0], replacement, true);
          return true;
        }
      } else {
        const escapedActual = esc(actualText);
        if (html.includes(escapedActual)) {
          applyHTMLReplace(html, escapedActual, replacement);
          return true;
        }
      }
      return false;
    }

    function applyHTMLReplace(html, matchStr, replacement, isRegex) {
      if (replacement) {
        const replHtml = '<span class="czn-applied">' + esc(replacement) + '</span>';
        if (isRegex) {
          editor.innerHTML = html.replace(new RegExp(escRegex(matchStr)), replHtml);
        } else {
          editor.innerHTML = html.replace(matchStr, replHtml);
        }
        setTimeout(() => {
          const el = editor.querySelector('.czn-applied:not(.fade)');
          if (el) el.classList.add('fade');
        }, 2000);
      } else {
        if (isRegex) {
          editor.innerHTML = html.replace(new RegExp(escRegex(matchStr)), '');
        } else {
          editor.innerHTML = html.replace(matchStr, '');
        }
        // Clean up empty containers left after removal
        editor.querySelectorAll('div, p').forEach(el => {
          if (el !== editor && !el.textContent.trim() && !el.querySelector('img, video')) {
            el.parentNode.removeChild(el);
          }
        });
      }
    }

    // ════════════════════════════════════════
    //  UTIL
    // ════════════════════════════════════════
    function escRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function esc(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }
  </script>
</body>
</html>
```

---

## 2. coiffeur.html — De Coiffeur (HLN print-inkorter)

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>De Coiffeur — HLN Print-inkorter</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #1a1a1a;
      background: #f0f1f3;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Top bar ── */
    .topbar {
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .topbar-left { display: flex; align-items: center; gap: 12px; }

    .logo { font-size: 18px; font-weight: 700; color: #1a5276; letter-spacing: -0.3px; }
    .logo-sub { font-size: 11px; color: #999; }

    .topbar-right { display: flex; align-items: center; gap: 8px; }

    .api-key-group { display: flex; align-items: center; gap: 6px; }
    .api-key-group label { font-size: 12px; color: #666; white-space: nowrap; }

    .api-key-input {
      width: 260px; padding: 5px 10px; border: 1px solid #ddd;
      border-radius: 5px; font-size: 12px; font-family: monospace;
    }
    .api-key-input:focus { outline: none; border-color: #1a5276; }

    .api-status { width: 8px; height: 8px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
    .api-status.connected { background: #28a745; }
    .api-status.error { background: #dc3545; }

    /* ── Main layout ── */
    .main { display: flex; flex: 1; overflow: hidden; }

    /* ── Editor (center) ── */
    .editor-panel {
      flex: 1; display: flex; flex-direction: column;
      background: #fff; border-right: 1px solid #e0e0e0;
    }

    .editor-toolbar {
      background: #f8f9fa; border-bottom: 1px solid #e0e0e0;
      padding: 8px 20px; display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
    }

    .editor-toolbar-left { display: flex; align-items: center; gap: 8px; }

    .btn-upload {
      display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px;
      border: 1px solid #ddd; border-radius: 5px; font-size: 12px;
      background: #fff; cursor: pointer; color: #333;
    }
    .btn-upload:hover { background: #f0f0f0; }

    .editor-stats { display: flex; gap: 16px; font-size: 12px; color: #888; }
    .stat-item { display: flex; align-items: center; gap: 4px; }
    .stat-value { font-weight: 600; color: #555; font-variant-numeric: tabular-nums; }

    .stat-diff { font-size: 11px; margin-left: 2px; }
    .stat-diff.negative { color: #28a745; }
    .stat-diff.positive { color: #dc3545; }

    #editor {
      flex: 1; padding: 32px 48px; font-size: 16px; line-height: 1.8;
      outline: none; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word;
    }

    #editor:empty::before {
      content: "Plak hier je HLN-artikel om in te korten voor print...";
      color: #bbb;
    }

    #editor .czn-highlight {
      background: rgba(26, 82, 118, 0.12);
      border-bottom: 2px solid rgba(26, 82, 118, 0.4);
      border-radius: 2px; transition: all 0.25s ease; cursor: default;
    }
    #editor .czn-highlight.active {
      background: rgba(26, 82, 118, 0.25);
      border-bottom-color: #1a5276;
    }

    #editor .czn-applied {
      background: rgba(40, 167, 69, 0.25);
      border-radius: 2px; transition: background 2s ease;
    }
    #editor .czn-applied.fade { background: transparent; }

    /* ── Coach panel (right) ── */
    .coach-panel {
      width: 400px; flex-shrink: 0; display: flex;
      flex-direction: column; background: #fafafa; overflow: hidden;
    }

    .coach-header {
      padding: 16px 20px; border-bottom: 2px solid #1a5276;
      background: #fff; flex-shrink: 0;
    }
    .coach-header h2 { font-size: 16px; font-weight: 700; color: #1a5276; }
    .coach-header p { font-size: 11px; color: #888; margin-top: 2px; }

    .coach-body { flex: 1; overflow-y: auto; padding: 16px 20px; }

    .coach-footer {
      padding: 12px 20px; border-top: 1px solid #e0e0e0;
      background: #fff; flex-shrink: 0; display: flex; gap: 8px;
    }

    /* ── Status ── */
    .status-msg {
      background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px;
      padding: 8px 12px; margin-bottom: 12px; font-size: 12px; color: #856404;
    }
    .status-msg.success { background: #d4edda; border-color: #28a745; color: #155724; }
    .status-msg.error { background: #f8d7da; border-color: #dc3545; color: #721c24; }
    .status-msg.info { background: #e8f4fd; border-color: #bee5eb; color: #0c5460; }

    /* ── Diagnosis ── */
    .diagnosis {
      background: #fff; border-left: 3px solid #1a5276; padding: 10px 14px;
      margin-bottom: 12px; font-size: 13px; line-height: 1.5; color: #333;
      border-radius: 0 6px 6px 0; font-style: italic; display: none;
    }
    .diagnosis.visible { display: block; }

    /* ── Round info ── */
    .round-info {
      display: none; align-items: center; justify-content: space-between;
      margin-bottom: 10px; font-size: 12px; color: #666;
    }
    .round-info.visible { display: flex; }
    .progress-text { font-variant-numeric: tabular-nums; }

    /* ── Suggestion card ── */
    .suggestion-card {
      background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;
      padding: 12px; margin-bottom: 10px; transition: all 0.35s ease; position: relative;
      cursor: pointer;
    }
    .suggestion-card.removing {
      opacity: 0; transform: translateX(60px); max-height: 0;
      padding: 0 12px; margin-bottom: 0; overflow: hidden;
    }
    .suggestion-card:hover { border-color: #1a5276; }

    .suggestion-type {
      font-size: 10px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; color: #1a5276; margin-bottom: 4px;
    }

    .suggestion-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.5px; margin-top: 8px; margin-bottom: 2px;
    }
    .suggestion-label.was { color: #999; }
    .suggestion-label.wordt { color: #28a745; }

    .suggestion-original {
      background: #fff5f5; border-left: 3px solid #dc3545; padding: 6px 10px;
      margin: 0 0 4px; font-size: 13px; border-radius: 0 4px 4px 0;
      text-decoration: line-through; color: #888;
    }
    .suggestion-replacement {
      background: #f0fff4; border-left: 3px solid #28a745; padding: 6px 10px;
      margin: 0 0 4px; font-size: 13px; border-radius: 0 4px 4px 0;
      color: #1a1a1a; font-weight: 500;
    }
    .suggestion-delete {
      background: #fff0f0; border-left: 3px solid #dc3545; padding: 6px 10px;
      margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #dc3545;
      text-transform: uppercase; letter-spacing: 0.5px; border-radius: 0 4px 4px 0;
    }
    .suggestion-explanation {
      font-size: 12px; color: #666; margin: 6px 0 8px; font-style: italic;
    }

    .suggestion-actions { display: flex; gap: 8px; }

    .btn-accept, .btn-reject {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border: 2px solid; border-radius: 50%;
      font-size: 18px; cursor: pointer; transition: all 0.15s ease; background: #fff;
    }
    .btn-accept { border-color: #28a745; color: #28a745; }
    .btn-accept:hover { background: #28a745; color: #fff; transform: scale(1.1); }
    .btn-reject { border-color: #dc3545; color: #dc3545; }
    .btn-reject:hover { background: #dc3545; color: #fff; transform: scale(1.1); }

    /* ── Buttons ── */
    .btn {
      display: inline-flex; align-items: center; gap: 4px; padding: 8px 16px;
      border: none; border-radius: 6px; font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.15s ease;
    }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary { background: #1a5276; color: #fff; flex: 1; justify-content: center; }
    .btn-primary:hover:not(:disabled) { background: #154360; }
    .btn-secondary { background: #e9ecef; color: #495057; flex: 1; justify-content: center; }
    .btn-secondary:hover:not(:disabled) { background: #dee2e6; }

    /* ── Loading ── */
    .loading { text-align: center; padding: 32px 16px; color: #888; display: none; }
    .loading.visible { display: block; }
    .spinner {
      width: 28px; height: 28px; border: 3px solid #e0e0e0;
      border-top-color: #1a5276; border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto 10px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Empty state ── */
    .empty-state { text-align: center; padding: 48px 24px; color: #aaa; }
    .empty-state .icon { font-size: 36px; margin-bottom: 12px; }
    .empty-state p { font-size: 13px; line-height: 1.6; }

    /* ── Responsive ── */
    @media (max-width: 860px) {
      .main { flex-direction: column; }
      .coach-panel { width: 100%; border-top: 1px solid #e0e0e0; }
      .editor-panel { border-right: none; }
      #editor { padding: 20px 24px; }
      .api-key-input { width: 180px; }
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #aaa; }
  </style>
</head>
<body>

  <div class="topbar">
    <div class="topbar-left">
      <span class="logo">De Coiffeur</span>
      <span class="logo-sub">HLN print-inkorter</span>
    </div>
    <div class="topbar-right">
      <div class="api-key-group">
        <label for="api-key">API key:</label>
        <input type="password" id="api-key" class="api-key-input" placeholder="sk-ant-..." />
        <div id="api-status" class="api-status" title="Niet verbonden"></div>
      </div>
    </div>
  </div>

  <div class="main">
    <div class="editor-panel">
      <div class="editor-toolbar">
        <div class="editor-toolbar-left">
          <button id="btn-upload" class="btn-upload">Bestand uploaden</button>
          <button id="btn-paste" class="btn-upload">Plakken</button>
          <button id="btn-clear" class="btn-upload">Wissen</button>
          <input type="file" id="file-input" accept=".txt,.md,.html,.doc,.rtf" hidden />
        </div>
        <div class="editor-stats">
          <div class="stat-item">
            <span>Woorden:</span>
            <span class="stat-value" id="word-count">0</span>
            <span class="stat-diff" id="word-diff"></span>
          </div>
          <div class="stat-item">
            <span>Tekens:</span>
            <span class="stat-value" id="char-count">0</span>
            <span class="stat-diff" id="char-diff"></span>
          </div>
        </div>
      </div>
      <div id="editor" contenteditable="true"></div>
    </div>

    <div class="coach-panel">
      <div class="coach-header">
        <h2>De Coiffeur</h2>
        <p>clarity &middot; simplicity &middot; brevity &middot; humanity</p>
      </div>

      <div class="coach-body" id="coach-body">
        <div id="status" class="status-msg info">
          Plak je HLN-artikel links en klik op "Inkorten".
        </div>
        <div id="diagnosis" class="diagnosis"></div>
        <div id="round-info" class="round-info">
          <span>Ronde <span id="round-number">1</span></span>
          <span class="progress-text"><span id="progress-done">0</span> / <span id="progress-total">0</span></span>
        </div>
        <div id="loading" class="loading">
          <div class="spinner"></div>
          <span>De Coiffeur knipt...</span>
        </div>
        <div id="suggestions-list"></div>
        <div id="empty-state" class="empty-state">
          <div class="icon">&#9986;</div>
          <p>Hier verschijnen straks de inkortings-<br>suggesties van De Coiffeur.</p>
        </div>
      </div>

      <div class="coach-footer">
        <button id="btn-review" class="btn btn-primary">Inkorten</button>
        <button id="btn-new-round" class="btn btn-secondary" disabled>Nieuwe ronde</button>
      </div>
    </div>
  </div>

  <script>
    const SYSTEM_PROMPT = `# HLN Print-inkorter

Je bent een ervaren eindredacteur van HLN, de grootste nieuwssite en krant van Vlaanderen. Je helpt schrijvers om artikelen in te korten voor de printeditie — met overgave, inzicht en stijl, zonder de journalistieke essentie te verliezen en zonder te verliezen wat het verhaal uniek maakt.

## Jouw filosofie

Je volgt de principes van William Zinsser (On Writing Well): **clarity, simplicity, brevity, humanity**. En de gulden regel van Strunk & White: **"Omit needless words."**

Dat betekent:
- Elk woord moet zijn plek verdienen
- Actieve vorm boven passief
- Positieve formuleringen boven negatieve ("hij kwam vaak te laat" is beter dan "hij was niet vaak op tijd")
- Concrete, specifieke taal — vermijd vage concepten
- Schrijf met sterke zelfstandige naamwoorden en werkwoorden; wees zuinig met bijvoeglijke naamwoorden en bijwoorden

Maar je bent geen robot. Je snapt dat een goed citaat, een treffend detail, een moment van warmte het verhaal máákt. Daar blijf je van af.

## Hoe je werkt

### Volgorde van evidentie (rangschik je suggesties zo):

1. **Print-irrelevante elementen**: "lees ook"-secties, paywall-markers, zinnen als "lees verder onder de foto" of "dat zie je op onderstaande grafiek"
2. **Kop en bovenkop**: Als de titel nog niet gesplitst is, stel meteen een opsplitsing voor:
   - Bovenkop: draagt de context, het feitelijke (wie, wat)
   - Kop: kort, krachtig, landt hard — vaak een citaat bij human interest
3. **Inleiding**: Winst hier telt dubbel (groter lettertype in print). Let vooral op teasende vragen die online de lezer over de paywall moeten trekken — in print kunnen die vaak weg.
4. **Redundantie**: Niet alleen losse opvulwoorden ("echter", "uiteraard", "eigenlijk"), maar ook concepten die dubbel worden uitgelegd, hele zinnen die niets toevoegen.
5. **Uitstapjes**: Passages die het verhaal vertragen zonder iets bij te dragen aan de essentie of wat het bijzonder maakt.
6. **Bij interviews**: Vraag-antwoord combinaties die geschrapt kunnen worden, of twee antwoorden die onder één vraag kunnen.
7. **Structurele keuzes**: Hele thematische lijnen die niet passen bij de rest, of voorbeelden die redundant zijn (schrap dan het zwakste/minst herkende eerst).

## Wat je NIET doet

- Je werkt niet naar een vooraf bepaalde lengte — je gaat door tot de gebruiker stopt
- Je voert nooit wijzigingen door zonder goedkeuring
- Je schrapt niet eigenmachtig wat het verhaal zijn ziel geeft: rake citaten, menselijke details, de stem van de geïnterviewde
- Je herschrijft niet de stijl van de auteur — je snoeit, je vervangt niet

## Toon

Zakelijk maar warm. Je legt kort uit waarom je iets voorstelt als dat niet evident is, maar je houdt het bondig. Je bent een collega die meedenkt, geen schoolmeester die corrigeert.

---

## OUTPUTFORMAAT (STRIKT)

Je antwoordt ALTIJD en UITSLUITEND in geldig JSON-formaat. Geen tekst buiten de JSON.

Begin met een diagnose, gevolgd door de suggesties. Rangschik op evidentie — print-irrelevante elementen eerst, dan kop, inleiding, redundantie, uitstapjes, interviews, structuur.

Geef je antwoord als JSON:
{
  "diagnosis": "Korte diagnose in 2-3 zinnen: wat voor type stuk is dit, waar zit de kern, en waar zie je de meeste ruimte om in te korten?",
  "suggestions": [
    {
      "type": "print-irrelevant|kop|inleiding|redundantie|uitstapje|interview|structuur|opvulwoord|passief|constructie",
      "original": "de originele passage die vervangen moet worden (LETTERLIJK uit de brontekst)",
      "replacement": "de voorgestelde versie (of leeg voor SCHRAPPEN)",
      "explanation": "korte toelichting, alleen als het niet vanzelf spreekt"
    }
  ]
}

Regels voor de JSON:
- "original" moet LETTERLIJK in de brontekst voorkomen, karakter per karakter
- Als iets geschrapt moet worden zonder vervanging, gebruik dan "replacement": ""
- Rangschik suggesties van meest evident naar minst evident
- Focus op suggesties die de tekst echt korter maken voor print
- Als de tekst perfect is: { "diagnosis": "...", "suggestions": [] }
- Geen markdown, geen tekst buiten de JSON`;

    // ════════════════════════════════════════
    //  STATE
    // ════════════════════════════════════════
    let suggestions = [];
    let roundNumber = 0;
    let handledCount = 0;
    let totalCount = 0;
    let startWords = 0;
    let startChars = 0;

    // ════════════════════════════════════════
    //  DOM
    // ════════════════════════════════════════
    const editor = document.getElementById('editor');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const wordDiffEl = document.getElementById('word-diff');
    const charDiffEl = document.getElementById('char-diff');
    const apiKeyInput = document.getElementById('api-key');
    const apiStatus = document.getElementById('api-status');
    const statusEl = document.getElementById('status');
    const diagnosisEl = document.getElementById('diagnosis');
    const roundInfo = document.getElementById('round-info');
    const roundNumberEl = document.getElementById('round-number');
    const progressDone = document.getElementById('progress-done');
    const progressTotal = document.getElementById('progress-total');
    const loadingEl = document.getElementById('loading');
    const suggestionsList = document.getElementById('suggestions-list');
    const emptyState = document.getElementById('empty-state');
    const btnReview = document.getElementById('btn-review');
    const btnNewRound = document.getElementById('btn-new-round');
    const btnUpload = document.getElementById('btn-upload');
    const btnPaste = document.getElementById('btn-paste');
    const btnClear = document.getElementById('btn-clear');
    const fileInput = document.getElementById('file-input');

    // ════════════════════════════════════════
    //  INIT
    // ════════════════════════════════════════
    const savedKey = localStorage.getItem('coiffeur_api_key');
    if (savedKey) {
      apiKeyInput.value = savedKey;
      apiStatus.classList.add('connected');
      apiStatus.title = 'API key opgeslagen';
    }

    apiKeyInput.addEventListener('change', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('coiffeur_api_key', key);
        apiStatus.className = 'api-status connected';
        apiStatus.title = 'API key opgeslagen';
      } else {
        localStorage.removeItem('coiffeur_api_key');
        apiStatus.className = 'api-status';
        apiStatus.title = 'Niet verbonden';
      }
    });

    editor.addEventListener('input', updateStats);
    btnReview.addEventListener('click', startReview);
    btnNewRound.addEventListener('click', startReview);
    btnUpload.addEventListener('click', () => fileInput.click());
    btnPaste.addEventListener('click', pasteFromClipboard);
    btnClear.addEventListener('click', () => {
      editor.innerText = '';
      startWords = 0; startChars = 0;
      wordDiffEl.textContent = ''; charDiffEl.textContent = '';
      updateStats();
    });
    fileInput.addEventListener('change', handleFileUpload);

    updateStats();

    // ════════════════════════════════════════
    //  STATS (met verschil-teller)
    // ════════════════════════════════════════
    function updateStats() {
      const text = editor.innerText.trim();
      const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      const chars = text.length;
      wordCountEl.textContent = words.toLocaleString('nl-BE');
      charCountEl.textContent = chars.toLocaleString('nl-BE');

      // Show difference since start of review
      if (startWords > 0) {
        const wDiff = words - startWords;
        const cDiff = chars - startChars;
        const wPct = ((wDiff / startWords) * 100).toFixed(1);
        const cPct = ((cDiff / startChars) * 100).toFixed(1);

        if (wDiff !== 0) {
          wordDiffEl.textContent = '(' + (wDiff > 0 ? '+' : '') + wDiff + ' / ' + wPct + '%)';
          wordDiffEl.className = 'stat-diff ' + (wDiff < 0 ? 'negative' : 'positive');
        }
        if (cDiff !== 0) {
          charDiffEl.textContent = '(' + (cDiff > 0 ? '+' : '') + cDiff + ' / ' + cPct + '%)';
          charDiffEl.className = 'stat-diff ' + (cDiff < 0 ? 'negative' : 'positive');
        }
      }
    }

    // ════════════════════════════════════════
    //  FILE UPLOAD
    // ════════════════════════════════════════
    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        editor.innerText = ev.target.result;
        updateStats();
        setStatus('Bestand geladen: ' + file.name, 'success');
      };
      reader.readAsText(file);
      fileInput.value = '';
    }

    async function pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        editor.innerText = text;
        updateStats();
        setStatus('Tekst geplakt vanuit klembord.', 'success');
      } catch (e) {
        setStatus('Kon niet plakken. Gebruik Ctrl+V in het tekstvak.', 'error');
      }
    }

    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'status-msg' + (type ? ' ' + type : '');
    }

    // ════════════════════════════════════════
    //  REVIEW
    // ════════════════════════════════════════
    async function startReview() {
      const text = editor.innerText.trim();
      if (!text) {
        setStatus('Plak eerst een artikel in de editor.', 'error');
        return;
      }

      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        setStatus('Vul eerst je Anthropic API-sleutel in (rechtsboven).', 'error');
        apiKeyInput.focus();
        return;
      }

      // Record starting stats on first round
      if (roundNumber === 0) {
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        startWords = words;
        startChars = text.length;
      }

      // Clear old highlights
      editor.querySelectorAll('.czn-highlight').forEach(el => {
        const textNode = document.createTextNode(el.textContent);
        el.parentNode.replaceChild(textNode, el);
      });
      editor.normalize();

      suggestionsList.innerHTML = '';
      suggestions = [];
      handledCount = 0;
      emptyState.style.display = 'none';
      diagnosisEl.classList.remove('visible');
      roundInfo.classList.remove('visible');
      btnReview.disabled = true;
      btnNewRound.disabled = true;
      loadingEl.classList.add('visible');

      roundNumber++;
      setStatus('De Coiffeur bekijkt je artikel...', '');

      try {
        const result = await callClaude(apiKey, text);
        loadingEl.classList.remove('visible');

        if (result.diagnosis) {
          diagnosisEl.textContent = result.diagnosis;
          diagnosisEl.classList.add('visible');
        }

        suggestions = result.suggestions.map((s, i) => ({ ...s, id: i, status: 'pending' }));
        totalCount = suggestions.length;

        if (totalCount === 0) {
          setStatus('Niks meer te knippen! Dit artikel is print-klaar.', 'success');
          btnNewRound.disabled = false;
          btnReview.disabled = false;
          return;
        }

        roundNumberEl.textContent = roundNumber;
        progressDone.textContent = '0';
        progressTotal.textContent = totalCount;
        roundInfo.classList.add('visible');

        suggestions.forEach((s, i) => {
          setTimeout(() => renderCard(s), i * 120);
        });

        setStatus(totalCount + ' suggestie(s) gevonden. Klik ✓ of ✗.', 'success');
        apiStatus.className = 'api-status connected';
        apiStatus.title = 'Verbonden';

      } catch (err) {
        loadingEl.classList.remove('visible');
        setStatus(err.message, 'error');
        if (err.message.includes('API') || err.message.includes('401')) {
          apiStatus.className = 'api-status error';
        }
      }

      btnReview.disabled = false;
    }

    // ════════════════════════════════════════
    //  CLAUDE API CALL
    // ════════════════════════════════════════
    async function callClaude(apiKey, text) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{
            role: 'user',
            content: 'Lees het volgende artikel na en geef je diagnose en inkortingssuggesties als JSON:\n\n' + text
          }]
        })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Ongeldige API-sleutel. Controleer je invoer rechtsboven.');
        if (response.status === 429) throw new Error('Te veel verzoeken. Wacht even en probeer opnieuw.');
        const body = await response.text();
        throw new Error('API-fout (' + response.status + '): ' + body.substring(0, 200));
      }

      const data = await response.json();
      const content = data.content[0].text;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { diagnosis: parsed.diagnosis || '', suggestions: parsed.suggestions || [] };
      }

      try {
        const parsed = JSON.parse(content);
        return { diagnosis: parsed.diagnosis || '', suggestions: parsed.suggestions || [] };
      } catch (e) {
        throw new Error('De Coiffeur gaf een onverwacht antwoord. Probeer opnieuw.');
      }
    }

    // ════════════════════════════════════════
    //  RENDER SUGGESTION CARD
    // ════════════════════════════════════════
    const TYPE_LABELS = {
      'print-irrelevant': 'Print-irrelevant', 'kop': 'Kop / Bovenkop',
      'inleiding': 'Inleiding', 'redundantie': 'Redundantie',
      'uitstapje': 'Uitstapje', 'interview': 'Interview',
      'structuur': 'Structuur', 'opvulwoord': 'Opvulwoord',
      'passief': 'Passief', 'constructie': 'Constructie',
      'spelling': 'Spelling', 'grammatica': 'Grammatica'
    };

    function renderCard(s) {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.id = 'card-' + s.id;
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';

      const isDelete = !s.replacement || s.replacement.trim() === '';
      const wordtLabel = isDelete ? 'Schrappen' : 'Wordt:';
      const replHtml = isDelete
        ? '<div class="suggestion-delete">SCHRAPPEN</div>'
        : '<div class="suggestion-replacement">' + esc(s.replacement) + '</div>';
      const explHtml = s.explanation
        ? '<div class="suggestion-explanation">' + esc(s.explanation) + '</div>'
        : '';

      card.innerHTML =
        '<div class="suggestion-type">' + (TYPE_LABELS[s.type] || s.type) + '</div>' +
        '<div class="suggestion-label was">Was:</div>' +
        '<div class="suggestion-original">' + esc(s.original) + '</div>' +
        '<div class="suggestion-label wordt">' + wordtLabel + '</div>' +
        replHtml + explHtml +
        '<div class="suggestion-actions">' +
          '<button class="btn-accept" title="Aanvaarden">✓</button>' +
          '<button class="btn-reject" title="Verwerpen">✗</button>' +
        '</div>';

      card.querySelector('.btn-accept').addEventListener('click', () => acceptCard(s.id));
      card.querySelector('.btn-reject').addEventListener('click', () => rejectCard(s.id));
      card.addEventListener('mouseenter', () => activateHighlight(s.id));
      card.addEventListener('mouseleave', () => deactivateHighlight(s.id));

      // Click: scroll editor to the highlighted passage
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-accept, .btn-reject')) return;
        scrollToHighlight(s.id);
      });

      suggestionsList.appendChild(card);
      highlightInEditor(s.id, s.original);

      requestAnimationFrame(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }

    // ════════════════════════════════════════
    //  HIGHLIGHTING
    // ════════════════════════════════════════
    function highlightInEditor(id, original) {
      // Strategy 1: exact match in a single text node (fast path)
      if (highlightSingleNode(id, original)) return;

      // Strategy 2: multi-line passage — highlight each line separately
      const lines = original.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1) {
        let found = 0;
        for (const line of lines) {
          if (highlightSingleNode(id, line)) found++;
        }
        if (found > 0) return;
      }

      // Strategy 3: normalized whitespace match within single text nodes
      highlightNormalized(id, original);
    }

    function highlightSingleNode(id, text) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const idx = node.textContent.indexOf(text);
        if (idx === -1) continue;
        wrapMatch(node, idx, text.length, id);
        return true;
      }
      return false;
    }

    function highlightNormalized(id, original) {
      const normOrig = original.replace(/\s+/g, ' ').trim();
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const nodeText = node.textContent;
        let normText = '';
        const posMap = [];
        let i = 0;
        while (i < nodeText.length) {
          if (/\s/.test(nodeText[i])) {
            if (normText.length === 0 || normText[normText.length - 1] !== ' ') {
              posMap.push(i);
              normText += ' ';
            }
            i++;
          } else {
            posMap.push(i);
            normText += nodeText[i];
            i++;
          }
        }
        const normIdx = normText.indexOf(normOrig);
        if (normIdx === -1) continue;
        const origStart = posMap[normIdx];
        const normEnd = normIdx + normOrig.length;
        const origEnd = normEnd < posMap.length ? posMap[normEnd] : nodeText.length;
        wrapMatch(node, origStart, origEnd - origStart, id);
        return true;
      }
      return false;
    }

    function wrapMatch(textNode, offset, length, id) {
      const text = textNode.textContent;
      const before = text.substring(0, offset);
      const match = text.substring(offset, offset + length);
      const after = text.substring(offset + length);
      const span = document.createElement('span');
      span.className = 'czn-highlight';
      span.dataset.suggestionId = id;
      span.textContent = match;
      const parent = textNode.parentNode;
      if (before) parent.insertBefore(document.createTextNode(before), textNode);
      parent.insertBefore(span, textNode);
      if (after) parent.insertBefore(document.createTextNode(after), textNode);
      parent.removeChild(textNode);
    }

    function activateHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.add('active'));
      if (els.length > 0) els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function deactivateHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.remove('active'));
    }

    function scrollToHighlight(id) {
      const els = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      els.forEach(el => el.classList.add('active'));
      if (els.length > 0) els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function removeHighlight(id) {
      const spans = editor.querySelectorAll('[data-suggestion-id="' + id + '"]');
      spans.forEach(el => {
        el.parentNode.replaceChild(document.createTextNode(el.textContent), el);
      });
      if (spans.length > 0) editor.normalize();
    }

    // ════════════════════════════════════════
    //  ACCEPT / REJECT
    // ════════════════════════════════════════
    function acceptCard(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'accepted';

      const replacement = s.replacement || '';
      let applied = false;

      // Try 1: Replace highlight span(s) — may be multiple for multi-line highlights
      const spans = Array.from(editor.querySelectorAll('[data-suggestion-id="' + id + '"]'));
      if (spans.length > 0) {
        if (replacement) {
          const appliedSpan = document.createElement('span');
          appliedSpan.className = 'czn-applied';
          appliedSpan.textContent = replacement;
          spans[0].parentNode.replaceChild(appliedSpan, spans[0]);
          setTimeout(() => appliedSpan.classList.add('fade'), 2000);
          for (let i = 1; i < spans.length; i++) {
            spans[i].parentNode.removeChild(spans[i]);
          }
        } else {
          // SCHRAPPEN: remove all spans, clean up empty containers
          for (const span of spans) {
            const parent = span.parentNode;
            parent.removeChild(span);
            if (parent !== editor && !parent.textContent.trim()) {
              parent.parentNode.removeChild(parent);
            }
          }
        }
        editor.normalize();
        applied = true;
      }

      // Try 2: Fallback text-node search
      if (!applied) {
        applied = applyToEditor(s.original, replacement);
      }

      // Try 3: innerHTML-based replacement (handles cross-node HTML)
      if (!applied) {
        applied = applyViaInnerHTML(s.original, replacement);
      }

      updateStats();
      removeCard(id);
      advanceProgress();
    }

    function rejectCard(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'rejected';
      removeHighlight(id);
      removeCard(id);
      advanceProgress();
    }

    function removeCard(id) {
      const card = document.getElementById('card-' + id);
      if (!card) return;
      card.classList.add('removing');
      setTimeout(() => card.remove(), 400);
    }

    function advanceProgress() {
      handledCount++;
      progressDone.textContent = handledCount;
      if (handledCount === totalCount) {
        const accepted = suggestions.filter(s => s.status === 'accepted').length;
        const rejected = suggestions.filter(s => s.status === 'rejected').length;
        setStatus('Ronde ' + roundNumber + ' klaar! ' + accepted + ' aanvaard, ' + rejected + ' verworpen.', 'success');
        btnNewRound.disabled = false;
      }
    }

    // ════════════════════════════════════════
    //  FALLBACK: TEXT-NODE SEARCH
    // ════════════════════════════════════════
    function applyToEditor(original, replacement) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;

      while (node = walker.nextNode()) {
        const idx = node.textContent.indexOf(original);
        if (idx === -1) continue;

        const before = node.textContent.substring(0, idx);
        const after = node.textContent.substring(idx + original.length);

        if (replacement) {
          const span = document.createElement('span');
          span.className = 'czn-applied';
          span.textContent = replacement;
          const afterNode = document.createTextNode(after);
          node.textContent = before;
          node.parentNode.insertBefore(span, node.nextSibling);
          node.parentNode.insertBefore(afterNode, span.nextSibling);
          setTimeout(() => span.classList.add('fade'), 2000);
        } else {
          node.textContent = before + after;
        }
        editor.normalize();
        return true;
      }
      return false;
    }

    // ════════════════════════════════════════
    //  FALLBACK: innerHTML (cross-node HTML)
    // ════════════════════════════════════════
    function applyViaInnerHTML(original, replacement) {
      const html = editor.innerHTML;

      // Direct match in innerHTML
      const escapedOrig = esc(original);
      if (html.includes(escapedOrig)) {
        applyHTMLReplace(html, escapedOrig, replacement);
        return true;
      }

      // Multi-line: original has \n but innerHTML has </div><div> or <br> between lines
      const lines = original.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1) {
        const pattern = lines.map(l => escRegex(esc(l))).join('[\\s\\S]*?');
        const regex = new RegExp(pattern);
        const match = html.match(regex);
        if (match) {
          applyHTMLReplace(html, match[0], replacement, true);
          return true;
        }
      }

      // Normalized whitespace match via innerText
      const fullText = editor.innerText;
      const normOrig = original.replace(/\s+/g, ' ').trim();
      const normText = fullText.replace(/\s+/g, ' ');
      const normIdx = normText.indexOf(normOrig);
      if (normIdx === -1) return false;

      // Map normalized position back to actual text positions
      let origPos = 0, normPos = 0;
      while (normPos < normIdx && origPos < fullText.length) {
        if (/\s/.test(fullText[origPos])) {
          while (origPos < fullText.length && /\s/.test(fullText[origPos])) origPos++;
          normPos++;
        } else { origPos++; normPos++; }
      }
      const matchStart = origPos;
      while (normPos < normIdx + normOrig.length && origPos < fullText.length) {
        if (/\s/.test(fullText[origPos])) {
          while (origPos < fullText.length && /\s/.test(fullText[origPos])) origPos++;
          normPos++;
        } else { origPos++; normPos++; }
      }
      const actualText = fullText.substring(matchStart, origPos);

      // Build regex from actual text lines for cross-node matching
      const actualLines = actualText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (actualLines.length > 1) {
        const pattern = actualLines.map(l => escRegex(esc(l))).join('[\\s\\S]*?');
        const regex = new RegExp(pattern);
        const match = html.match(regex);
        if (match) {
          applyHTMLReplace(html, match[0], replacement, true);
          return true;
        }
      } else {
        const escapedActual = esc(actualText);
        if (html.includes(escapedActual)) {
          applyHTMLReplace(html, escapedActual, replacement);
          return true;
        }
      }
      return false;
    }

    function applyHTMLReplace(html, matchStr, replacement, isRegex) {
      if (replacement) {
        const replHtml = '<span class="czn-applied">' + esc(replacement) + '</span>';
        if (isRegex) {
          editor.innerHTML = html.replace(new RegExp(escRegex(matchStr)), replHtml);
        } else {
          editor.innerHTML = html.replace(matchStr, replHtml);
        }
        setTimeout(() => {
          const el = editor.querySelector('.czn-applied:not(.fade)');
          if (el) el.classList.add('fade');
        }, 2000);
      } else {
        if (isRegex) {
          editor.innerHTML = html.replace(new RegExp(escRegex(matchStr)), '');
        } else {
          editor.innerHTML = html.replace(matchStr, '');
        }
        // Clean up empty containers left after removal
        editor.querySelectorAll('div, p').forEach(el => {
          if (el !== editor && !el.textContent.trim() && !el.querySelector('img, video')) {
            el.parentNode.removeChild(el);
          }
        });
      }
    }

    // ════════════════════════════════════════
    //  UTIL
    // ════════════════════════════════════════
    function escRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function esc(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }
  </script>
</body>
</html>
```

---

## 3. demo.html — Coach Zinssner Demo (zonder API)

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coach Zinssner — Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #1a1a1a;
      background: #f0f1f3;
      min-height: 100vh;
    }

    .demo-banner {
      background: #c0392b;
      color: #fff;
      text-align: center;
      padding: 10px;
      font-size: 13px;
    }

    .demo-banner strong { font-weight: 700; }

    .app-layout {
      display: flex;
      max-width: 1200px;
      margin: 24px auto;
      gap: 20px;
      padding: 0 20px;
    }

    /* Left: simulated editor */
    .editor-panel {
      flex: 1;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      overflow: hidden;
    }

    .editor-toolbar {
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .editor-toolbar .tab {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      border: none;
      color: #666;
    }

    .editor-toolbar .tab.active {
      background: #fff;
      color: #1a1a1a;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .editor-label {
      font-size: 11px;
      color: #999;
      padding: 8px 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    #editor {
      padding: 16px;
      min-height: 400px;
      font-size: 15px;
      line-height: 1.7;
      outline: none;
      white-space: pre-wrap;
    }

    #editor:focus {
      background: #fefefe;
    }

    /* Right: Coach Zinssner panel */
    .coach-panel {
      width: 380px;
      flex-shrink: 0;
    }

    .coach-inner {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      overflow: hidden;
      position: sticky;
      top: 20px;
    }

    .coach-header {
      padding: 16px;
      border-bottom: 2px solid #c0392b;
    }

    .coach-header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #c0392b;
      letter-spacing: -0.3px;
    }

    .coach-header .subtitle {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .coach-body {
      padding: 16px;
    }

    /* Status */
    .status-bar {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #856404;
    }

    .status-bar.success {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }

    /* Diagnosis */
    .diagnosis {
      background: #f0f4ff;
      border-left: 3px solid #c0392b;
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      border-radius: 0 6px 6px 0;
      font-style: italic;
      margin-bottom: 12px;
      display: none;
    }

    .diagnosis.visible { display: block; }

    /* Word count */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .word-count {
      font-size: 11px;
      color: #999;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #c0392b;
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) {
      background: #a93226;
    }

    .btn-small {
      padding: 4px 10px;
      font-size: 12px;
      background: #e9ecef;
      color: #495057;
    }

    .btn-small:hover:not(:disabled) {
      background: #dee2e6;
    }

    .btn-success {
      background: #d4edda;
      color: #155724;
    }

    .btn-success:hover { background: #c3e6cb; }

    .btn-danger {
      background: #f8d7da;
      color: #721c24;
    }

    .btn-danger:hover { background: #f1b0b7; }

    .actions-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 10px;
    }

    /* Suggestions */
    .suggestions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      display: none;
    }

    .suggestions-header.visible { display: flex; }

    .suggestions-header h2 {
      font-size: 14px;
      font-weight: 600;
    }

    .badge {
      background: #c0392b;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .suggestion-card {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
      background: #fff;
      transition: all 0.3s ease;
    }

    .suggestion-card.accepted {
      border-color: #28a745;
      background: #f0faf2;
    }

    .suggestion-card.rejected {
      border-color: #dc3545;
      background: #fdf0f0;
      opacity: 0.5;
    }

    .suggestion-type {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #c0392b;
      margin-bottom: 4px;
    }

    .suggestion-original {
      background: #fff5f5;
      border-left: 3px solid #dc3545;
      padding: 6px 10px;
      margin: 6px 0;
      font-size: 13px;
      border-radius: 0 4px 4px 0;
      text-decoration: line-through;
      color: #666;
    }

    .suggestion-replacement {
      background: #f0fff4;
      border-left: 3px solid #28a745;
      padding: 6px 10px;
      margin: 6px 0;
      font-size: 13px;
      border-radius: 0 4px 4px 0;
      color: #1a1a1a;
      font-weight: 500;
    }

    .suggestion-delete {
      background: #fff0f0;
      border-left: 3px solid #dc3545;
      padding: 6px 10px;
      margin: 6px 0;
      font-size: 12px;
      font-weight: 700;
      color: #dc3545;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 0 4px 4px 0;
    }

    .suggestion-explanation {
      font-size: 12px;
      color: #666;
      margin: 6px 0;
      font-style: italic;
    }

    .suggestion-actions {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }

    .btn-accept,
    .btn-reject {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 2px solid;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: #fff;
    }

    .btn-accept {
      border-color: #28a745;
      color: #28a745;
    }

    .btn-accept:hover {
      background: #28a745;
      color: #fff;
      transform: scale(1.1);
    }

    .btn-reject {
      border-color: #dc3545;
      color: #dc3545;
    }

    .btn-reject:hover {
      background: #dc3545;
      color: #fff;
      transform: scale(1.1);
    }

    .btn-accept:disabled,
    .btn-reject:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Loading spinner */
    .loading {
      text-align: center;
      padding: 24px;
      color: #666;
      display: none;
    }

    .loading.visible { display: block; }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e0e0e0;
      border-top-color: #c0392b;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 8px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Highlight in editor */
    .czn-applied {
      background: rgba(40, 167, 69, 0.15);
      transition: background 1.5s ease;
    }

    .czn-applied.fade {
      background: transparent;
    }

    /* Responsive */
    @media (max-width: 800px) {
      .app-layout {
        flex-direction: column;
      }
      .coach-panel {
        width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="demo-banner">
    <strong>DEMO</strong> — Dit simuleert hoe Coach Zinssner werkt. De suggesties hieronder zijn voorbeelden.
  </div>

  <div class="app-layout">

    <!-- Left: Article Editor (simulated) -->
    <div class="editor-panel">
      <div class="editor-toolbar">
        <button class="tab active">Artikel</button>
        <button class="tab">Metadata</button>
        <button class="tab">SEO</button>
      </div>
      <div class="editor-label">Broodtekst</div>
      <div id="editor" contenteditable="true">Gisteren werd er door de burgemeester een heel belangrijke beslissing genomen over het nieuwe voetbalstadion. De beslissing werd uiteindelijk genomen na een zeer lange vergadering die maar liefst vijf uur duurde. Het was eigenlijk al langer geweten dat er een probleem was.

"We hebben in eerste instantie geprobeerd om tot een compromis te komen, maar dat bleek uiteindelijk toch niet te werken", verklaarde de burgemeester. "Na verloop van tijd werd het duidelijk dat we een andere richting moesten inslaan", vulde hij nog aan.

Het stadion, dat beter gekend is als het Kiel, zal na de renovatiewerken plaats bieden aan maar liefst 40.000 toeschouwers. De huidige capaciteit van het oude stadion is momenteel eigenlijk vrij beperkt.</div>
    </div>

    <!-- Right: Coach Zinssner Panel -->
    <div class="coach-panel">
      <div class="coach-inner">
        <div class="coach-header">
          <h1>Coach Zinssner</h1>
          <p class="subtitle">AI-schrijfcoach voor heldere teksten</p>
        </div>

        <div class="coach-body">
          <div id="status" class="status-bar">
            Klik op "Nalezen" om de tekst links te laten analyseren.
          </div>

          <div id="diagnosis" class="diagnosis"></div>

          <div class="meta-row">
            <span id="word-count" class="word-count"></span>
            <button id="btn-review" class="btn btn-primary">Nalezen</button>
          </div>

          <div id="loading" class="loading">
            <div class="spinner"></div>
            <span>Coach Zinssner leest na...</span>
          </div>

          <div id="suggestions-header" class="suggestions-header">
            <h2>Suggesties</h2>
            <span id="badge" class="badge">0</span>
          </div>

          <div id="suggestions-list"></div>

          <div id="bulk-actions" class="actions-row" style="display:none;">
            <button id="btn-accept-all" class="btn btn-small btn-success">Alles aanvaarden</button>
            <button id="btn-reject-all" class="btn btn-small btn-danger">Alles verwerpen</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // ===== DEMO DATA =====
    // These are pre-built suggestions that simulate what Claude would return
    const DEMO_RESPONSE = {
      diagnosis: "Een kort nieuwsbericht over een stadionbeslissing. De tekst bevat veel opvulwoorden, passieve constructies en omslachtige formuleringen. Hier is flink ruimte om scherper te schrijven.",
      suggestions: [
        {
          id: 0,
          type: "passief",
          original: "werd er door de burgemeester een heel belangrijke beslissing genomen",
          replacement: "nam de burgemeester een belangrijke beslissing",
          explanation: "Actief is krachtiger. En 'heel' voor 'belangrijke' is een verzwakker — het voegt niets toe."
        },
        {
          id: 1,
          type: "redundantie",
          original: "De beslissing werd uiteindelijk genomen na een zeer lange vergadering die maar liefst vijf uur duurde.",
          replacement: "De vergadering duurde vijf uur.",
          explanation: "De vorige zin zei al dat er een beslissing genomen werd. 'Zeer lange' en 'maar liefst' zeggen hetzelfde als 'vijf uur'."
        },
        {
          id: 2,
          type: "opvulwoord",
          original: "Het was eigenlijk al langer geweten dat er een probleem was.",
          replacement: "Het probleem was al langer bekend.",
          explanation: "'Eigenlijk' is een opvulwoord. 'Er' + 'was' is omslachtig."
        },
        {
          id: 3,
          type: "constructie",
          original: "in eerste instantie",
          replacement: "",
          explanation: "Voegt niets toe. Schrappen."
        },
        {
          id: 4,
          type: "constructie",
          original: "bleek uiteindelijk toch niet te werken",
          replacement: "werkte niet",
          explanation: "'Uiteindelijk' en 'toch' zijn allebei overbodig. Kort en krachtig."
        },
        {
          id: 5,
          type: "werkwoord",
          original: "verklaarde de burgemeester",
          replacement: "zegt de burgemeester",
          explanation: "'Zegt' is bijna altijd beter dan 'verklaarde'."
        },
        {
          id: 6,
          type: "constructie",
          original: "Na verloop van tijd werd het duidelijk dat",
          replacement: "Gaandeweg bleek dat",
          explanation: "Korter en directer."
        },
        {
          id: 7,
          type: "redundantie",
          original: ", vulde hij nog aan",
          replacement: "",
          explanation: "De lezer weet al wie spreekt. Dit is overbodig."
        },
        {
          id: 8,
          type: "constructie",
          original: "dat beter gekend is als",
          replacement: "of",
          explanation: "Eén woordje volstaat."
        },
        {
          id: 9,
          type: "verzwakker",
          original: "De huidige capaciteit van het oude stadion is momenteel eigenlijk vrij beperkt.",
          replacement: "Het oude stadion is te klein.",
          explanation: "'Huidige', 'momenteel', 'eigenlijk' en 'vrij' zijn vier verzwakkers in één zin."
        }
      ]
    };

    // ===== STATE =====
    const editor = document.getElementById('editor');
    const statusBar = document.getElementById('status');
    const diagnosisEl = document.getElementById('diagnosis');
    const wordCountEl = document.getElementById('word-count');
    const btnReview = document.getElementById('btn-review');
    const loadingEl = document.getElementById('loading');
    const suggestionsHeader = document.getElementById('suggestions-header');
    const badgeEl = document.getElementById('badge');
    const suggestionsList = document.getElementById('suggestions-list');
    const bulkActions = document.getElementById('bulk-actions');
    const btnAcceptAll = document.getElementById('btn-accept-all');
    const btnRejectAll = document.getElementById('btn-reject-all');

    let suggestions = [];

    // Init
    updateWordCount();
    editor.addEventListener('input', updateWordCount);
    btnReview.addEventListener('click', startReview);
    btnAcceptAll.addEventListener('click', acceptAll);
    btnRejectAll.addEventListener('click', rejectAll);

    function updateWordCount() {
      const text = editor.innerText.trim();
      const words = text ? text.split(/\s+/).length : 0;
      wordCountEl.textContent = words + ' woorden';
    }

    // Simulate the review process
    function startReview() {
      // Reset
      suggestionsList.innerHTML = '';
      suggestionsHeader.classList.remove('visible');
      diagnosisEl.classList.remove('visible');
      bulkActions.style.display = 'none';
      suggestions = [];

      // Show loading
      loadingEl.classList.add('visible');
      btnReview.disabled = true;
      statusBar.textContent = 'Coach Zinssner leest je tekst na...';
      statusBar.className = 'status-bar';

      // Simulate API delay
      setTimeout(() => {
        loadingEl.classList.remove('visible');

        // Show diagnosis
        diagnosisEl.textContent = DEMO_RESPONSE.diagnosis;
        diagnosisEl.classList.add('visible');

        // Load suggestions
        suggestions = DEMO_RESPONSE.suggestions.map(s => ({ ...s, status: 'pending' }));

        // Render them one by one with stagger
        suggestionsHeader.classList.add('visible');
        badgeEl.textContent = suggestions.length;
        bulkActions.style.display = 'flex';

        suggestions.forEach((s, i) => {
          setTimeout(() => renderSuggestion(s), i * 150);
        });

        statusBar.textContent = suggestions.length + ' suggestie(s) gevonden. Klik ✓ om te aanvaarden of ✗ om te verwerpen.';
        statusBar.className = 'status-bar success';
        btnReview.disabled = false;
      }, 2000);
    }

    function renderSuggestion(suggestion) {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.id = 'sug-' + suggestion.id;
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';

      const typeLabels = {
        'opvulwoord': 'Opvulwoord', 'constructie': 'Constructie', 'bijwoord': 'Bijwoord',
        'bijvoeglijk': 'Bijvoeglijk nw.', 'verzwakker': 'Verzwakker', 'passief': 'Passief',
        'redundantie': 'Redundantie', 'interpunctie': 'Interpunctie', 'werkwoord': 'Werkwoord',
        'quote': 'Quote', 'overstatement': 'Overstatement', 'spelling': 'Spelling',
        'grammatica': 'Grammatica'
      };

      const isDelete = !suggestion.replacement;
      const replacementHtml = isDelete
        ? '<div class="suggestion-delete">SCHRAPPEN</div>'
        : '<div class="suggestion-replacement">' + escapeHtml(suggestion.replacement) + '</div>';

      const explanationHtml = suggestion.explanation
        ? '<div class="suggestion-explanation">' + escapeHtml(suggestion.explanation) + '</div>'
        : '';

      card.innerHTML =
        '<div class="suggestion-type">' + (typeLabels[suggestion.type] || suggestion.type) + '</div>' +
        '<div class="suggestion-original">' + escapeHtml(suggestion.original) + '</div>' +
        replacementHtml +
        explanationHtml +
        '<div class="suggestion-actions">' +
          '<button class="btn-accept" title="Aanvaarden">✓</button>' +
          '<button class="btn-reject" title="Verwerpen">✗</button>' +
        '</div>';

      card.querySelector('.btn-accept').addEventListener('click', () => acceptSuggestion(suggestion.id));
      card.querySelector('.btn-reject').addEventListener('click', () => rejectSuggestion(suggestion.id));

      suggestionsList.appendChild(card);

      // Animate in
      requestAnimationFrame(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }

    function acceptSuggestion(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'accepted';

      const card = document.getElementById('sug-' + id);
      card.classList.add('accepted');
      card.querySelector('.btn-accept').disabled = true;
      card.querySelector('.btn-reject').disabled = true;

      // Apply the change in the editor
      applyToEditor(s.original, s.replacement || '');
      updateProgress();
    }

    function rejectSuggestion(id) {
      const s = suggestions.find(x => x.id === id);
      if (!s || s.status !== 'pending') return;
      s.status = 'rejected';

      const card = document.getElementById('sug-' + id);
      card.classList.add('rejected');
      card.querySelector('.btn-accept').disabled = true;
      card.querySelector('.btn-reject').disabled = true;

      updateProgress();
    }

    function acceptAll() {
      suggestions.filter(s => s.status === 'pending').forEach(s => acceptSuggestion(s.id));
    }

    function rejectAll() {
      suggestions.filter(s => s.status === 'pending').forEach(s => rejectSuggestion(s.id));
    }

    function updateProgress() {
      const total = suggestions.length;
      const handled = suggestions.filter(s => s.status !== 'pending').length;
      const accepted = suggestions.filter(s => s.status === 'accepted').length;
      const rejected = suggestions.filter(s => s.status === 'rejected').length;
      badgeEl.textContent = handled + '/' + total;

      if (handled === total) {
        statusBar.textContent = 'Klaar! ' + accepted + ' aanvaard, ' + rejected + ' verworpen.';
        statusBar.className = 'status-bar success';
      }
    }

    // Apply replacement in the contenteditable editor
    function applyToEditor(original, replacement) {
      const html = editor.innerHTML;
      const textContent = editor.innerText;

      // Find and replace in text nodes
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node;
      let found = false;

      while (node = walker.nextNode()) {
        const idx = node.textContent.indexOf(original);
        if (idx !== -1) {
          const before = node.textContent.substring(0, idx);
          const after = node.textContent.substring(idx + original.length);

          if (replacement) {
            // Create a highlighted span for the replacement
            const span = document.createElement('span');
            span.className = 'czn-applied';
            span.textContent = replacement;

            const afterNode = document.createTextNode(after);
            node.textContent = before;
            node.parentNode.insertBefore(span, node.nextSibling);
            node.parentNode.insertBefore(afterNode, span.nextSibling);

            // Fade out highlight
            setTimeout(() => span.classList.add('fade'), 1500);
          } else {
            // Delete: just remove the original text
            node.textContent = before + after;
          }

          found = true;
          break;
        }
      }

      // Fallback: simple innerHTML replace
      if (!found) {
        if (replacement) {
          editor.innerHTML = editor.innerHTML.replace(
            escapeHtml(original),
            '<span class="czn-applied">' + escapeHtml(replacement) + '</span>'
          );
          setTimeout(() => {
            const el = editor.querySelector('.czn-applied:not(.fade)');
            if (el) el.classList.add('fade');
          }, 1500);
        } else {
          editor.innerHTML = editor.innerHTML.replace(escapeHtml(original), '');
        }
      }

      updateWordCount();
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  </script>
</body>
</html>
```
