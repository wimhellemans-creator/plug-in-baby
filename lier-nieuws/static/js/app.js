// State
let currentPage = 1;
let totalPages = 1;
let isSearching = false;
let currentMunicipality = localStorage.getItem("municipality") || "lier";

// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const sourcesBtn = document.getElementById("sourcesBtn");
const articlesContainer = document.getElementById("articles");
const emptyState = document.getElementById("emptyState");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const paginationContainer = document.getElementById("pagination");
const articleCount = document.getElementById("articleCount");
const sourceCount = document.getElementById("sourceCount");
const toastContainer = document.getElementById("toastContainer");

// Modal elements
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const sourcesTableBody = document.getElementById("sourcesTableBody");
const addSourceForm = document.getElementById("addSourceForm");

const diagnoseBtn = document.getElementById("diagnoseBtn");

// Settings modal elements
const settingsBtn = document.getElementById("settingsBtn");
const settingsModalOverlay = document.getElementById("settingsModalOverlay");
const settingsModalClose = document.getElementById("settingsModalClose");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const toggleKeyVisibility = document.getElementById("toggleKeyVisibility");
const apiKeyStatus = document.getElementById("apiKeyStatus");
const apiKeyMessage = document.getElementById("apiKeyMessage");

// Municipality switcher elements
const municipalitySwitcher = document.getElementById("municipalitySwitcher");
const municipalityName = document.getElementById("municipalityName");
const municipalityDropdown = document.getElementById("municipalityDropdown");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    setMunicipalityDisplay();
    loadArticles();
    loadSourceCount();
});

// Event listeners
searchBtn.addEventListener("click", startSearch);
sourcesBtn.addEventListener("click", openSourcesModal);
diagnoseBtn.addEventListener("click", runDiagnose);
settingsBtn.addEventListener("click", openSettingsModal);
settingsModalClose.addEventListener("click", closeSettingsModal);
settingsModalOverlay.addEventListener("click", (e) => {
    if (e.target === settingsModalOverlay) closeSettingsModal();
});
saveApiKeyBtn.addEventListener("click", saveApiKey);
toggleKeyVisibility.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
        apiKeyInput.type = "text";
        toggleKeyVisibility.textContent = "Verberg";
    } else {
        apiKeyInput.type = "password";
        toggleKeyVisibility.textContent = "Toon";
    }
});
modalClose.addEventListener("click", closeSourcesModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeSourcesModal();
});
addSourceForm.addEventListener("submit", addSource);

// Municipality switcher
municipalitySwitcher.addEventListener("click", (e) => {
    e.stopPropagation();
    municipalityDropdown.classList.toggle("active");
});

document.addEventListener("click", () => {
    municipalityDropdown.classList.remove("active");
});

document.querySelectorAll(".municipality-option").forEach((option) => {
    option.addEventListener("click", (e) => {
        e.stopPropagation();
        const newMunicipality = option.dataset.id;
        if (newMunicipality !== currentMunicipality) {
            currentMunicipality = newMunicipality;
            localStorage.setItem("municipality", currentMunicipality);
            setMunicipalityDisplay();
            currentPage = 1;
            loadArticles();
            loadSourceCount();
        }
        municipalityDropdown.classList.remove("active");
    });
});

function setMunicipalityDisplay() {
    const option = document.querySelector(`.municipality-option[data-id="${currentMunicipality}"]`);
    if (option) {
        municipalityName.textContent = option.textContent;
    }
    // Update page title
    document.title = `${municipalityName.textContent} Nieuws Radar - HLN Regiodesk`;
    // Highlight active option
    document.querySelectorAll(".municipality-option").forEach((opt) => {
        opt.classList.toggle("active", opt.dataset.id === currentMunicipality);
    });
}

// Load articles
async function loadArticles(page = 1) {
    try {
        const resp = await fetch(`/api/articles?page=${page}&municipality=${currentMunicipality}`);
        const data = await resp.json();

        currentPage = page;
        totalPages = data.total_pages;

        articleCount.textContent = data.total;

        if (data.articles.length === 0) {
            articlesContainer.innerHTML = "";
            emptyState.style.display = "block";
            paginationContainer.innerHTML = "";
            return;
        }

        emptyState.style.display = "none";
        renderArticles(data.articles);
        renderPagination();
    } catch (err) {
        showToast("Fout bij laden van artikelen: " + err.message, "error");
    }
}

// Render articles
function renderArticles(articles) {
    articlesContainer.innerHTML = articles
        .map(
            (a) => `
        <div class="article-card" data-id="${a.id}">
            <div class="card-header">
                <div class="card-header-left">
                    ${a.label ? `<span class="card-label label-${(a.label || '').toLowerCase()}">${escapeHtml(a.label)}</span>` : ""}
                    <h3>${escapeHtml(a.title)}</h3>
                </div>
                <span class="card-date">${formatDate(a.original_date)}</span>
            </div>
            <p class="card-summary">${escapeHtml(a.summary)}</p>
            <ul class="card-bullets">
                ${parseBullets(a.bullets)
                    .map((b) => `<li>${escapeHtml(b)}</li>`)
                    .join("")}
            </ul>
            <div class="card-footer">
                <div class="card-footer-links">
                    <a href="${escapeHtml(a.original_url)}" target="_blank" rel="noopener" class="card-source">
                        &#8599; Bekijk bron
                    </a>
                    <button class="btn-generate" onclick="generateArticle(${a.id})" title="Genereer een artikelvoorstel">
                        &#9998; Voorstel artikel
                    </button>
                </div>
                <div class="card-actions">
                    <button class="btn-icon delete" onclick="deleteArticle(${a.id})" title="Verwijder">&#10005;</button>
                </div>
            </div>
        </div>
    `
        )
        .join("");
}

// Parse bullets (stored as JSON string or newline-separated)
function parseBullets(bullets) {
    try {
        const parsed = JSON.parse(bullets);
        if (Array.isArray(parsed)) return parsed;
    } catch {}
    return bullets.split("\n").filter((b) => b.trim());
}

// Render pagination
function renderPagination() {
    if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
    }

    let html = "";
    html += `<button ${currentPage === 1 ? "disabled" : ""} onclick="loadArticles(${currentPage - 1})">&laquo; Vorige</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            html += `<button class="${i === currentPage ? "active" : ""}" onclick="loadArticles(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<button disabled>...</button>`;
        }
    }

    html += `<button ${currentPage === totalPages ? "disabled" : ""} onclick="loadArticles(${currentPage + 1})">Volgende &raquo;</button>`;

    paginationContainer.innerHTML = html;
}

// Start search
async function startSearch() {
    if (isSearching) return;
    isSearching = true;

    searchBtn.disabled = true;
    searchBtn.innerHTML = "&#9203; Bezig met zoeken...";
    progressContainer.classList.add("active");
    progressBar.style.width = "0%";
    progressText.textContent = "Zoekactie wordt gestart...";

    try {
        const resp = await fetch(`/api/search?municipality=${currentMunicipality}`, { method: "POST" });
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop(); // keep incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const event = JSON.parse(line.substring(6));
                        handleSearchEvent(event);
                    } catch {}
                }
            }
        }
    } catch (err) {
        showToast("Fout bij zoeken: " + err.message, "error");
    } finally {
        isSearching = false;
        searchBtn.disabled = false;
        searchBtn.innerHTML = "&#128270; Ga op zoek naar nieuws";

        setTimeout(() => {
            progressContainer.classList.remove("active");
        }, 2000);

        loadArticles(1);
        loadSourceCount();
    }
}

// Handle search events (SSE)
function handleSearchEvent(event) {
    switch (event.type) {
        case "progress":
            const pct = Math.round((event.current / event.total) * 70); // 70% for scraping
            progressBar.style.width = pct + "%";
            progressText.textContent = `Scraping ${event.current}/${event.total}: ${event.source}`;
            break;
        case "analyzing":
            progressBar.style.width = "75%";
            progressText.textContent =
                "AI analyseert de gevonden content...";
            break;
        case "saving":
            progressBar.style.width = "90%";
            progressText.textContent = `${event.count} nieuwe leads gevonden, worden opgeslagen...`;
            break;
        case "done":
            progressBar.style.width = "100%";
            progressText.textContent = `Klaar! ${event.new_articles} nieuwe leads gevonden.`;
            if (event.new_articles > 0) {
                showToast(
                    `${event.new_articles} nieuwe leads gevonden!`,
                    "success"
                );
            } else {
                showToast("Geen nieuwe leads gevonden.", "info");
            }
            break;
        case "error":
            progressText.textContent = `Fout: ${event.message}`;
            showToast(event.message, "error");
            break;
    }
}

// Delete article
async function deleteArticle(id) {
    if (!confirm("Dit artikel verwijderen van het board?")) return;
    try {
        await fetch(`/api/articles/${id}`, { method: "DELETE" });
        loadArticles(currentPage);
        showToast("Artikel verwijderd", "info");
    } catch (err) {
        showToast("Fout bij verwijderen: " + err.message, "error");
    }
}

// Sources management
async function openSourcesModal() {
    modalOverlay.classList.add("active");
    await loadSources();
}

function closeSourcesModal() {
    modalOverlay.classList.remove("active");
    loadSourceCount();
}

async function loadSources() {
    try {
        const resp = await fetch(`/api/sources?municipality=${currentMunicipality}`);
        const sources = await resp.json();
        renderSources(sources);
    } catch (err) {
        showToast("Fout bij laden bronnen: " + err.message, "error");
    }
}

function renderSources(sources) {
    sourcesTableBody.innerHTML = sources
        .map(
            (s) => `
        <tr>
            <td><span class="category-badge">${escapeHtml(s.category)}</span></td>
            <td>${escapeHtml(s.description)}</td>
            <td class="url-cell"><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.url)}</a></td>
            <td>
                <label class="toggle-switch">
                    <input type="checkbox" ${s.active ? "checked" : ""} onchange="toggleSource(${s.id}, this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>
            <td>
                <button class="btn-icon delete" onclick="deleteSource(${s.id})" title="Verwijder">&#10005;</button>
            </td>
        </tr>
    `
        )
        .join("");
}

async function addSource(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        category: formData.get("category"),
        description: formData.get("description"),
        url: formData.get("url"),
        municipality: currentMunicipality,
    };

    if (!data.category || !data.description || !data.url) {
        showToast("Vul alle velden in", "error");
        return;
    }

    try {
        const resp = await fetch("/api/sources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (resp.ok) {
            e.target.reset();
            await loadSources();
            showToast("Bron toegevoegd!", "success");
        } else {
            const err = await resp.json();
            showToast(err.error || "Fout bij toevoegen", "error");
        }
    } catch (err) {
        showToast("Fout bij toevoegen: " + err.message, "error");
    }
}

async function toggleSource(id, active) {
    try {
        await fetch(`/api/sources/${id}/toggle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active }),
        });
    } catch (err) {
        showToast("Fout bij wijzigen: " + err.message, "error");
    }
}

async function deleteSource(id) {
    if (!confirm("Deze bron verwijderen?")) return;
    try {
        await fetch(`/api/sources/${id}`, { method: "DELETE" });
        await loadSources();
        showToast("Bron verwijderd", "info");
    } catch (err) {
        showToast("Fout bij verwijderen: " + err.message, "error");
    }
}

async function loadSourceCount() {
    try {
        const resp = await fetch(`/api/sources?municipality=${currentMunicipality}`);
        const sources = await resp.json();
        sourceCount.textContent = sources.filter((s) => s.active).length;
    } catch {}
}

// Diagnose
async function runDiagnose() {
    diagnoseBtn.disabled = true;
    diagnoseBtn.innerHTML = "&#9203; Testen...";
    progressContainer.classList.add("active");
    progressBar.style.width = "50%";
    progressText.textContent = "Diagnose wordt uitgevoerd...";

    try {
        const resp = await fetch(`/api/diagnose?municipality=${currentMunicipality}`);
        const results = await resp.json();

        progressBar.style.width = "100%";

        const icons = { ok: "\u2705", fail: "\u274c", warn: "\u26a0\ufe0f" };
        const messages = results.map(
            (r) => `${icons[r.status] || "?"} ${r.step}: ${r.message}`
        );
        progressText.innerHTML = messages.join("<br>");

        const hasFail = results.some((r) => r.status === "fail");
        if (hasFail) {
            showToast("Er zijn problemen gevonden - bekijk de diagnose hierboven", "error");
        } else {
            showToast("Alles ziet er goed uit!", "success");
        }
    } catch (err) {
        progressText.textContent = "Diagnose mislukt: " + err.message;
        showToast("Diagnose mislukt: " + err.message, "error");
    } finally {
        diagnoseBtn.disabled = false;
        diagnoseBtn.innerHTML = "&#9889; Diagnose";
    }
}

// Settings management
async function openSettingsModal() {
    settingsModalOverlay.classList.add("active");
    apiKeyInput.value = "";
    apiKeyMessage.className = "settings-message";
    apiKeyMessage.textContent = "";
    await loadApiKeyStatus();
}

function closeSettingsModal() {
    settingsModalOverlay.classList.remove("active");
}

async function loadApiKeyStatus() {
    try {
        const resp = await fetch("/api/settings/apikey");
        const data = await resp.json();
        if (data.has_key) {
            apiKeyStatus.className = "settings-key-status has-key";
            apiKeyStatus.textContent = "Huidige key: " + data.masked;
        } else {
            apiKeyStatus.className = "settings-key-status no-key";
            apiKeyStatus.textContent = "Geen API key ingesteld. Vul hieronder je key in.";
        }
    } catch (err) {
        apiKeyStatus.className = "settings-key-status no-key";
        apiKeyStatus.textContent = "Kon status niet ophalen.";
    }
}

async function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) {
        apiKeyMessage.className = "settings-message error";
        apiKeyMessage.textContent = "Vul een API key in.";
        return;
    }

    saveApiKeyBtn.disabled = true;
    saveApiKeyBtn.textContent = "Opslaan...";

    try {
        const resp = await fetch("/api/settings/apikey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: key }),
        });
        const data = await resp.json();

        if (resp.ok) {
            apiKeyMessage.className = "settings-message success";
            apiKeyMessage.textContent = data.message;
            apiKeyInput.value = "";
            await loadApiKeyStatus();
            showToast("API key opgeslagen!", "success");
        } else {
            apiKeyMessage.className = "settings-message error";
            apiKeyMessage.textContent = data.error;
        }
    } catch (err) {
        apiKeyMessage.className = "settings-message error";
        apiKeyMessage.textContent = "Fout bij opslaan: " + err.message;
    } finally {
        saveApiKeyBtn.disabled = false;
        saveApiKeyBtn.textContent = "Opslaan";
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === "onbekend") return "Datum onbekend";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("nl-BE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}

// Article generation modal
const articleModalOverlay = document.getElementById("articleModalOverlay");
const articleModalClose = document.getElementById("articleModalClose");
const articleModalContent = document.getElementById("articleModalContent");
const copyArticleBtn = document.getElementById("copyArticleBtn");

articleModalClose.addEventListener("click", closeArticleModal);
articleModalOverlay.addEventListener("click", (e) => {
    if (e.target === articleModalOverlay) closeArticleModal();
});
copyArticleBtn.addEventListener("click", copyArticleToClipboard);

function closeArticleModal() {
    articleModalOverlay.classList.remove("active");
}

async function generateArticle(id) {
    // Open modal immediately with loading state
    articleModalOverlay.classList.add("active");
    articleModalContent.innerHTML = '<div class="article-loading">Artikel wordt geschreven...</div>';
    copyArticleBtn.style.display = "none";

    try {
        const resp = await fetch(`/api/articles/${id}/generate`, { method: "POST" });
        const data = await resp.json();

        if (!resp.ok) {
            articleModalContent.innerHTML = `<div class="article-error">Fout: ${escapeHtml(data.error || "Onbekende fout")}</div>`;
            return;
        }

        // Render markdown-like content as HTML
        articleModalContent.innerHTML = renderArticleMarkdown(data.article_text);
        copyArticleBtn.style.display = "inline-flex";
        copyArticleBtn.dataset.rawText = data.article_text;
    } catch (err) {
        articleModalContent.innerHTML = `<div class="article-error">Fout bij genereren: ${escapeHtml(err.message)}</div>`;
    }
}

function renderArticleMarkdown(text) {
    // Simple markdown to HTML: headings, bold, italic, hr, paragraphs
    let html = text
        .replace(/^# (.+)$/gm, '<h1 class="article-title">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$2</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^---$/gm, '<hr>');

    // Split into paragraphs (double newline)
    html = html.split(/\n\n+/).map(block => {
        block = block.trim();
        if (!block) return "";
        if (block.startsWith("<h1") || block.startsWith("<h2") || block.startsWith("<hr")) return block;
        return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    }).join("\n");

    return html;
}

async function copyArticleToClipboard() {
    const rawText = copyArticleBtn.dataset.rawText;
    if (!rawText) return;
    try {
        await navigator.clipboard.writeText(rawText);
        showToast("Artikel gekopieerd naar klembord!", "success");
    } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = rawText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Artikel gekopieerd naar klembord!", "success");
    }
}

function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
