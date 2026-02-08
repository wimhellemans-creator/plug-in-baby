// Coach Zinssner - Content Script
// Handles text extraction and modification on web pages

(function() {
  'use strict';

  // Detect the type of editor on the current page
  function detectEditorType() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    // HLN / DPG Media CMS (Jeeves/CUE based editors)
    if (hostname.includes('hln.be') || hostname.includes('dpgmedia') ||
        hostname.includes('cue.') || hostname.includes('jeeves')) {
      return 'hln-cms';
    }

    // Google Docs
    if (hostname.includes('docs.google.com')) {
      return 'google-docs';
    }

    // Gmail
    if (hostname.includes('mail.google.com')) {
      return 'gmail';
    }

    // Outlook Web
    if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com')) {
      return 'outlook';
    }

    // Generic contenteditable or textarea
    return 'generic';
  }

  // Extract text from the current page/editor
  function extractText() {
    const editorType = detectEditorType();

    switch (editorType) {
      case 'hln-cms':
        return extractHLNText();
      case 'google-docs':
        return extractGoogleDocsText();
      case 'gmail':
        return extractGmailText();
      case 'outlook':
        return extractOutlookText();
      default:
        return extractGenericText();
    }
  }

  // HLN / DPG Media CMS text extraction
  function extractHLNText() {
    // Try common CMS editor selectors
    const selectors = [
      '[data-testid="article-body"]',
      '.article-editor',
      '.editor-content',
      '.ck-editor__main',
      '.ProseMirror',
      '[contenteditable="true"]',
      '.rich-text-editor',
      'article',
      '.article-body',
      '.story-body'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.innerText.trim().length > 10) {
        return {
          text: el.innerText.trim(),
          element: selector,
          editorType: 'hln-cms'
        };
      }
    }

    return extractGenericText();
  }

  // Google Docs text extraction
  function extractGoogleDocsText() {
    // Google Docs renders text in .kix-lineview elements
    const lines = document.querySelectorAll('.kix-lineview');
    if (lines.length > 0) {
      const text = Array.from(lines).map(l => l.innerText).join('\n');
      if (text.trim().length > 0) {
        return {
          text: text.trim(),
          element: '.kix-lineview',
          editorType: 'google-docs'
        };
      }
    }

    // Fallback: try the editor container
    const editor = document.querySelector('.kix-appview-editor');
    if (editor) {
      return {
        text: editor.innerText.trim(),
        element: '.kix-appview-editor',
        editorType: 'google-docs'
      };
    }

    return extractGenericText();
  }

  // Gmail compose text extraction
  function extractGmailText() {
    // Gmail compose body
    const composeBody = document.querySelector('[g_editable="true"]') ||
                        document.querySelector('.Am.Al.editable') ||
                        document.querySelector('[aria-label="Berichttekst"]') ||
                        document.querySelector('[aria-label="Message Body"]');

    if (composeBody) {
      return {
        text: composeBody.innerText.trim(),
        element: composeBody.getAttribute('class') || '[g_editable]',
        editorType: 'gmail'
      };
    }

    return extractGenericText();
  }

  // Outlook Web text extraction
  function extractOutlookText() {
    const editor = document.querySelector('[aria-label="Berichttekst"]') ||
                   document.querySelector('[aria-label="Message body"]') ||
                   document.querySelector('[role="textbox"][contenteditable="true"]');

    if (editor) {
      return {
        text: editor.innerText.trim(),
        element: 'outlook-editor',
        editorType: 'outlook'
      };
    }

    return extractGenericText();
  }

  // Generic text extraction: selected text or largest contenteditable/textarea
  function extractGenericText() {
    // First check for selected text
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 10) {
      return {
        text: selection.toString().trim(),
        element: 'selection',
        editorType: 'selection'
      };
    }

    // Try contenteditable elements
    const editables = document.querySelectorAll('[contenteditable="true"]');
    let bestEditable = null;
    let bestLength = 0;

    editables.forEach(el => {
      const len = el.innerText.trim().length;
      if (len > bestLength) {
        bestLength = len;
        bestEditable = el;
      }
    });

    if (bestEditable && bestLength > 10) {
      return {
        text: bestEditable.innerText.trim(),
        element: 'contenteditable',
        editorType: 'contenteditable'
      };
    }

    // Try textareas
    const textareas = document.querySelectorAll('textarea');
    let bestTextarea = null;
    bestLength = 0;

    textareas.forEach(el => {
      const len = el.value.trim().length;
      if (len > bestLength) {
        bestLength = len;
        bestTextarea = el;
      }
    });

    if (bestTextarea && bestLength > 10) {
      return {
        text: bestTextarea.value.trim(),
        element: 'textarea',
        editorType: 'textarea'
      };
    }

    return {
      text: '',
      element: null,
      editorType: 'none'
    };
  }

  // Apply a single text replacement to the page
  function applyReplacement(original, replacement) {
    const editorType = detectEditorType();

    // Try contenteditable elements first
    const editables = document.querySelectorAll('[contenteditable="true"]');
    for (const el of editables) {
      if (replaceInElement(el, original, replacement)) {
        return true;
      }
    }

    // Try textareas
    const textareas = document.querySelectorAll('textarea');
    for (const ta of textareas) {
      if (ta.value.includes(original)) {
        ta.value = ta.value.replace(original, replacement);
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }

    // Try ProseMirror, CKEditor or other rich editors
    const richEditors = document.querySelectorAll('.ProseMirror, .ck-editor__main, .editor-content');
    for (const el of richEditors) {
      if (replaceInElement(el, original, replacement)) {
        return true;
      }
    }

    return false;
  }

  // Replace text in a contenteditable element while preserving structure
  function replaceInElement(element, original, replacement) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    // First try simple single-node replacement
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes(original)) {
        node.textContent = node.textContent.replace(original, replacement);
        // Trigger input event so editors detect the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }
    }

    // If original spans multiple nodes, try innerHTML replacement
    if (element.innerHTML.includes(original)) {
      element.innerHTML = element.innerHTML.replace(original, replacement);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    // Try with normalized whitespace
    const normalizedOriginal = original.replace(/\s+/g, ' ');
    const innerText = element.innerText;
    if (innerText.includes(normalizedOriginal)) {
      // Use innerText approach as fallback
      const fullText = element.innerText;
      const newText = fullText.replace(normalizedOriginal, replacement);
      // Only use this if it's a simple text container
      if (element.children.length === 0) {
        element.textContent = newText;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }
    }

    return false;
  }

  // Show a notification on the page
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.czn-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `czn-notification czn-${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  // Listen for messages from the side panel
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACT_TEXT') {
      const result = extractText();
      sendResponse(result);
      return true;
    }

    if (message.type === 'APPLY_REPLACEMENT') {
      const success = applyReplacement(message.original, message.replacement);
      if (success) {
        showNotification('Wijziging doorgevoerd');
      } else {
        showNotification('Kon de tekst niet vinden op de pagina', 'error');
      }
      sendResponse({ success });
      return true;
    }

    if (message.type === 'APPLY_FULL_TEXT') {
      // Replace the full text in the editor
      const extracted = extractText();
      if (extracted.element === 'textarea') {
        const textareas = document.querySelectorAll('textarea');
        for (const ta of textareas) {
          if (ta.value.trim() === extracted.text || ta.value.includes(extracted.text.substring(0, 50))) {
            ta.value = message.text;
            ta.dispatchEvent(new Event('input', { bubbles: true }));
            ta.dispatchEvent(new Event('change', { bubbles: true }));
            showNotification('Alle wijzigingen doorgevoerd');
            sendResponse({ success: true });
            return true;
          }
        }
      } else {
        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const el of editables) {
          if (el.innerText.trim() === extracted.text || el.innerText.includes(extracted.text.substring(0, 50))) {
            el.innerText = message.text;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            showNotification('Alle wijzigingen doorgevoerd');
            sendResponse({ success: true });
            return true;
          }
        }
      }
      showNotification('Kon de editor niet vinden', 'error');
      sendResponse({ success: false });
      return true;
    }
  });
})();
