// Coach Zinssner - Background Service Worker

const COACH_ZINSSNER_SYSTEM_PROMPT = `Je bent Coach Zinssner, een strenge maar rechtvaardige AI-schrijfcoach geïnspireerd door William Zinsser en zijn boek "On Writing Well". Je helpt Vlaamse journalisten en redacteuren om heldere, krachtige teksten te schrijven.

Je analyseert teksten en geeft concrete suggesties voor verbetering. Je let op:

1. **Helderheid**: Vermijd jargon, vage woorden en onnodige complexiteit.
2. **Beknoptheid**: Schrap overbodige woorden. Elke zin moet zijn gewicht dragen.
3. **Actieve stem**: Gebruik actieve werkwoorden in plaats van passieve constructies.
4. **Sterke werkwoorden**: Vervang zwakke werkwoorden (zijn, hebben, worden, maken) door krachtigere alternatieven.
5. **Taalfouten**: Corrigeer spelling, grammatica en interpunctie.
6. **Stijl**: Vermijd clichés, pleonasmen en tautologieën.
7. **Leesbaarheid**: Zorg voor goede zinsopbouw en logische structuur.

BELANGRIJK: Je antwoordt ALTIJD in geldig JSON-formaat. Geen tekst buiten de JSON.

Geef je antwoord als een JSON-array van suggesties:
[
  {
    "type": "spelling|grammatica|stijl|beknoptheid|helderheid|werkwoord|structuur",
    "original": "de originele tekst die vervangen moet worden",
    "replacement": "de voorgestelde vervanging",
    "explanation": "korte uitleg waarom (in het Nederlands)"
  }
]

Als de tekst perfect is, antwoord dan met een lege array: []

Regels:
- Geef ALLEEN suggesties die de tekst echt verbeteren.
- Wees specifiek: geef exact aan welk stuk tekst vervangen moet worden.
- De "original" moet letterlijk in de brontekst voorkomen.
- Hou je uitleg kort en begrijpelijk (max 1-2 zinnen).
- Focus op de belangrijkste verbeteringen, niet op pietluttige details.
- Schrijf in het Nederlands (Vlaams).`;

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Handle messages from sidepanel and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REVIEW_TEXT') {
    reviewText(message.text).then(sendResponse).catch(err => {
      sendResponse({ error: err.message });
    });
    return true; // Keep channel open for async response
  }

  if (message.type === 'GET_API_KEY') {
    chrome.storage.sync.get(['apiKey'], (result) => {
      sendResponse({ apiKey: result.apiKey || '' });
    });
    return true;
  }

  if (message.type === 'SAVE_API_KEY') {
    chrome.storage.sync.set({ apiKey: message.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

async function reviewText(text) {
  const { apiKey } = await chrome.storage.sync.get(['apiKey']);

  if (!apiKey) {
    throw new Error('Geen API-sleutel geconfigureerd. Ga naar Instellingen.');
  }

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
      system: COACH_ZINSSNER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Lees de volgende tekst na en geef je suggesties als JSON-array:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      throw new Error('Ongeldige API-sleutel. Controleer je instellingen.');
    }
    if (response.status === 429) {
      throw new Error('Te veel verzoeken. Wacht even en probeer opnieuw.');
    }
    throw new Error(`API-fout (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    // Try to parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return { suggestions: JSON.parse(jsonMatch[0]) };
    }
    return { suggestions: JSON.parse(content) };
  } catch (e) {
    throw new Error('Coach Zinssner gaf een onverwacht antwoord. Probeer opnieuw.');
  }
}
