const apiKeyInput = document.getElementById('api-key');
const btnSave = document.getElementById('btn-save');
const messageEl = document.getElementById('message');

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
}

// Determine which storage API is available
function getStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage.local || chrome.storage.sync;
  }
  return null;
}

// Register click handler FIRST (before anything that might fail)
btnSave.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();

  if (!key) {
    showMessage('Vul een API-sleutel in.', 'error');
    return;
  }

  if (!key.startsWith('sk-')) {
    showMessage('Dit lijkt geen geldige Anthropic API-sleutel. Die begint met "sk-".', 'error');
    return;
  }

  const storage = getStorage();
  if (!storage) {
    showMessage('Chrome storage is niet beschikbaar. Controleer of de extensie correct geladen is.', 'error');
    return;
  }

  try {
    storage.set({ apiKey: key }, () => {
      if (chrome.runtime && chrome.runtime.lastError) {
        showMessage('Fout bij opslaan: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showMessage('API-sleutel opgeslagen! Je kunt Coach Zinssner nu gebruiken.', 'success');
      }
    });
  } catch (e) {
    showMessage('Kan niet opslaan. Fout: ' + e.message, 'error');
  }
});

// THEN try to load existing key
try {
  const storage = getStorage();
  if (storage) {
    storage.get(['apiKey'], (result) => {
      if (result && result.apiKey) {
        apiKeyInput.value = result.apiKey;
      }
    });
  }
} catch (e) {
  // Loading failed, that's OK — user can still type and save
}
