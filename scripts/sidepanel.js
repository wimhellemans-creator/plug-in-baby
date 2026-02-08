// Coach Zinssner - Side Panel Logic

(function() {
  'use strict';

  // State
  let currentText = '';
  let suggestions = [];
  let workingText = '';

  // DOM elements
  const statusBar = document.getElementById('status-bar');
  const statusText = document.getElementById('status-text');
  const sourceText = document.getElementById('source-text');
  const wordCount = document.getElementById('word-count');
  const btnDetect = document.getElementById('btn-detect');
  const btnReview = document.getElementById('btn-review');
  const suggestionsSection = document.getElementById('suggestions-section');
  const suggestionsList = document.getElementById('suggestions-list');
  const suggestionCount = document.getElementById('suggestion-count');
  const btnAcceptAll = document.getElementById('btn-accept-all');
  const btnRejectAll = document.getElementById('btn-reject-all');
  const resultSection = document.getElementById('result-section');
  const resultText = document.getElementById('result-text');
  const btnApply = document.getElementById('btn-apply');
  const btnCopy = document.getElementById('btn-copy');
  const loading = document.getElementById('loading');
  const btnSettings = document.getElementById('btn-settings');

  // Initialize
  init();

  function init() {
    btnDetect.addEventListener('click', detectText);
    btnReview.addEventListener('click', reviewText);
    btnAcceptAll.addEventListener('click', acceptAll);
    btnRejectAll.addEventListener('click', rejectAll);
    btnApply.addEventListener('click', applyToPage);
    btnCopy.addEventListener('click', copyResult);
    btnSettings.addEventListener('click', openSettings);

    // Check if API key is configured
    try {
      chrome.storage.local.get(['apiKey'], (result) => {
        if (!result || !result.apiKey) {
          setStatus('Configureer eerst je API-sleutel in Instellingen.', 'error');
        }
      });
    } catch (e) {
      setStatus('Configureer eerst je API-sleutel in Instellingen.', 'error');
    }
  }

  function setStatus(message, type = '') {
    statusText.textContent = message;
    statusBar.className = 'status-bar' + (type ? ' ' + type : '');
  }

  // Detect text from the current tab
  async function detectText() {
    setStatus('Tekst detecteren...', '');
    btnDetect.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_TEXT' });

      if (response && response.text && response.text.length > 0) {
        currentText = response.text;
        workingText = response.text;
        sourceText.textContent = currentText;
        updateWordCount();
        btnReview.disabled = false;

        const typeLabels = {
          'hln-cms': 'HLN/DPG Media editor',
          'google-docs': 'Google Docs',
          'gmail': 'Gmail',
          'outlook': 'Outlook',
          'contenteditable': 'teksteditor',
          'textarea': 'tekstveld',
          'selection': 'geselecteerde tekst'
        };
        const label = typeLabels[response.editorType] || response.editorType;
        setStatus(`Tekst gedetecteerd uit: ${label}`, 'success');
      } else {
        setStatus('Geen tekst gevonden. Selecteer tekst op de pagina of open een editor.', 'error');
      }
    } catch (err) {
      setStatus('Kon geen verbinding maken met de pagina. Vernieuw de pagina en probeer opnieuw.', 'error');
    }

    btnDetect.disabled = false;
  }

  // Send text for review
  async function reviewText() {
    if (!currentText) return;

    // Reset
    suggestionsSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    suggestionsList.innerHTML = '';
    suggestions = [];

    loading.classList.remove('hidden');
    btnReview.disabled = true;
    setStatus('Coach Zinssner leest je tekst na...', '');

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'REVIEW_TEXT',
        text: currentText
      });

      loading.classList.add('hidden');

      if (response.error) {
        setStatus(response.error, 'error');
        btnReview.disabled = false;
        return;
      }

      // Show diagnosis if available
      const diagnosisSection = document.getElementById('diagnosis-section');
      const diagnosisText = document.getElementById('diagnosis-text');
      if (response.diagnosis) {
        diagnosisText.textContent = response.diagnosis;
        diagnosisSection.classList.remove('hidden');
      } else {
        diagnosisSection.classList.add('hidden');
      }

      suggestions = response.suggestions.map((s, i) => ({
        ...s,
        id: i,
        status: 'pending' // pending, accepted, rejected
      }));

      if (suggestions.length === 0) {
        setStatus('Uitstekend! Coach Zinssner heeft geen verbeteringen gevonden.', 'success');
        btnReview.disabled = false;
        return;
      }

      renderSuggestions();
      suggestionsSection.classList.remove('hidden');
      suggestionCount.textContent = suggestions.length;
      setStatus(`${suggestions.length} suggestie(s) gevonden. Klik ✓ om te aanvaarden of ✗ om te verwerpen.`, 'success');

    } catch (err) {
      loading.classList.add('hidden');
      setStatus('Er ging iets mis: ' + err.message, 'error');
    }

    btnReview.disabled = false;
  }

  // Render suggestion cards
  function renderSuggestions() {
    suggestionsList.innerHTML = '';

    suggestions.forEach((suggestion) => {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.id = `suggestion-${suggestion.id}`;

      if (suggestion.status !== 'pending') {
        card.classList.add(suggestion.status);
      }

      const typeLabels = {
        'opvulwoord': 'Opvulwoord',
        'constructie': 'Constructie',
        'bijwoord': 'Bijwoord',
        'bijvoeglijk': 'Bijvoeglijk nw.',
        'verzwakker': 'Verzwakker',
        'passief': 'Passief',
        'redundantie': 'Redundantie',
        'interpunctie': 'Interpunctie',
        'werkwoord': 'Werkwoord',
        'quote': 'Quote',
        'overstatement': 'Overstatement',
        'spelling': 'Spelling',
        'grammatica': 'Grammatica',
        'stijl': 'Stijl',
        'beknoptheid': 'Beknoptheid',
        'helderheid': 'Helderheid',
        'structuur': 'Structuur'
      };

      const isDelete = !suggestion.replacement || suggestion.replacement.trim() === '';
      const replacementHtml = isDelete
        ? '<div class="suggestion-delete">SCHRAPPEN</div>'
        : `<div class="suggestion-replacement">${escapeHtml(suggestion.replacement)}</div>`;

      const explanationHtml = suggestion.explanation
        ? `<div class="suggestion-explanation">${escapeHtml(suggestion.explanation)}</div>`
        : '';

      card.innerHTML = `
        <div class="suggestion-type">${typeLabels[suggestion.type] || suggestion.type}</div>
        <div class="suggestion-original">${escapeHtml(suggestion.original)}</div>
        ${replacementHtml}
        ${explanationHtml}
        <div class="suggestion-actions">
          <button class="btn-accept" title="Aanvaarden" data-id="${suggestion.id}" ${suggestion.status !== 'pending' ? 'disabled' : ''}>✓</button>
          <button class="btn-reject" title="Verwerpen" data-id="${suggestion.id}" ${suggestion.status !== 'pending' ? 'disabled' : ''}>✗</button>
        </div>
      `;

      // Add event listeners
      const btnAccept = card.querySelector('.btn-accept');
      const btnReject = card.querySelector('.btn-reject');

      btnAccept.addEventListener('click', () => acceptSuggestion(suggestion.id));
      btnReject.addEventListener('click', () => rejectSuggestion(suggestion.id));

      suggestionsList.appendChild(card);
    });
  }

  // Accept a single suggestion - immediately apply to working text
  async function acceptSuggestion(id) {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion || suggestion.status !== 'pending') return;

    suggestion.status = 'accepted';

    // Apply replacement to working text
    workingText = workingText.replace(suggestion.original, suggestion.replacement);

    // Try to apply directly to the page
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_REPLACEMENT',
        original: suggestion.original,
        replacement: suggestion.replacement
      });
    } catch (e) {
      // Page might not be accessible, that's OK - we still have the working text
    }

    updateSuggestionCard(id);
    updateResult();
    updateProgress();
  }

  // Reject a single suggestion
  function rejectSuggestion(id) {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion || suggestion.status !== 'pending') return;

    suggestion.status = 'rejected';
    updateSuggestionCard(id);
    updateProgress();
  }

  // Update a single suggestion card's visual state
  function updateSuggestionCard(id) {
    const suggestion = suggestions.find(s => s.id === id);
    const card = document.getElementById(`suggestion-${id}`);
    if (!card || !suggestion) return;

    card.className = `suggestion-card ${suggestion.status}`;
    card.querySelector('.btn-accept').disabled = true;
    card.querySelector('.btn-reject').disabled = true;
  }

  // Accept all pending suggestions
  async function acceptAll() {
    const pending = suggestions.filter(s => s.status === 'pending');
    for (const suggestion of pending) {
      await acceptSuggestion(suggestion.id);
    }
  }

  // Reject all pending suggestions
  function rejectAll() {
    const pending = suggestions.filter(s => s.status === 'pending');
    pending.forEach(s => rejectSuggestion(s.id));
  }

  // Update progress after accepting/rejecting
  function updateProgress() {
    const total = suggestions.length;
    const handled = suggestions.filter(s => s.status !== 'pending').length;
    const accepted = suggestions.filter(s => s.status === 'accepted').length;
    const rejected = suggestions.filter(s => s.status === 'rejected').length;

    suggestionCount.textContent = `${handled}/${total}`;

    if (handled === total) {
      setStatus(`Klaar! ${accepted} aanvaard, ${rejected} verworpen.`, 'success');
    }
  }

  // Update result section with the working text
  function updateResult() {
    resultText.textContent = workingText;
    resultSection.classList.remove('hidden');
  }

  // Apply the full result text to the page
  async function applyToPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_FULL_TEXT',
        text: workingText
      });

      if (response && response.success) {
        setStatus('Tekst succesvol toegepast op de pagina!', 'success');
      } else {
        setStatus('Kon de tekst niet toepassen. Gebruik "Kopieer" als alternatief.', 'error');
      }
    } catch (e) {
      setStatus('Kon geen verbinding maken met de pagina. Gebruik "Kopieer".', 'error');
    }
  }

  // Copy result to clipboard
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(workingText);
      const originalText = btnCopy.textContent;
      btnCopy.textContent = 'Gekopieerd!';
      setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
    } catch (e) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = workingText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      btnCopy.textContent = 'Gekopieerd!';
      setTimeout(() => { btnCopy.textContent = 'Kopieer'; }, 2000);
    }
  }

  // Open settings page
  function openSettings() {
    chrome.runtime.openOptionsPage();
  }

  // Update word count display
  function updateWordCount() {
    const words = currentText.split(/\s+/).filter(w => w.length > 0).length;
    wordCount.textContent = `${words} woorden`;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
