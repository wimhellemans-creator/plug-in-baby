// ============================================
// HLN Nieuwsmonitor - Main Application
// ============================================

(function () {
    'use strict';

    // ---- Default Sites ----
    const DEFAULT_SITES = [
        { id: 'hln', name: 'HLN', url: 'https://www.hln.be/' },
        { id: 'vrtnws', name: 'VRT NWS', url: 'https://www.vrt.be/vrtnws/nl/' },
        { id: 'demorgen', name: 'De Morgen', url: 'https://www.demorgen.be/' },
        { id: 'standaard', name: 'De Standaard', url: 'https://www.standaard.be/' },
        { id: 'nieuwsblad', name: 'Het Nieuwsblad', url: 'https://www.nieuwsblad.be/' },
        { id: 'tijd', name: 'De Tijd', url: 'https://www.tijd.be/' },
        { id: 'gva', name: 'Gazet van Antwerpen', url: 'https://www.gva.be/' },
        { id: 'hbvl', name: 'Het Belang van Limburg', url: 'https://www.hbvl.be/' },
        { id: 'knack', name: 'Knack', url: 'https://www.knack.be/' },
        { id: 'humo', name: 'Humo', url: 'https://www.humo.be/' },
    ];

    // ---- Screenshot Service ----
    // thum.io generates live screenshots of websites - free, no API key needed
    const SCREENSHOT_WIDTH = 1280;
    const REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh screenshots every 5 minutes

    function getScreenshotUrl(siteUrl) {
        return `https://image.thum.io/get/width/${SCREENSHOT_WIDTH}/crop/800/noanimate/${siteUrl}`;
    }

    // ---- State ----
    let state = {
        selectedSiteIds: [],  // IDs of sites shown on dashboard
        customSites: [],      // { id, name, url }
        expandedSiteId: null, // Currently expanded site, or null
    };

    let refreshTimer = null;

    // ---- LocalStorage ----
    const STORAGE_KEY = 'hln-newsmonitor-state';

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state.selectedSiteIds = parsed.selectedSiteIds || DEFAULT_SITES.map(s => s.id);
                state.customSites = parsed.customSites || [];
            } else {
                // First visit: select first 6 by default
                state.selectedSiteIds = DEFAULT_SITES.slice(0, 6).map(s => s.id);
            }
        } catch {
            state.selectedSiteIds = DEFAULT_SITES.slice(0, 6).map(s => s.id);
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            selectedSiteIds: state.selectedSiteIds,
            customSites: state.customSites,
        }));
    }

    // ---- Helpers ----
    function getAllSites() {
        return [...DEFAULT_SITES, ...state.customSites];
    }

    function getSelectedSites() {
        return state.selectedSiteIds
            .map(id => getAllSites().find(s => s.id === id))
            .filter(Boolean);
    }

    function getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        } catch {
            return '';
        }
    }

    function generateId(name) {
        return 'custom-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    }

    // Cache-bust parameter for refreshing screenshots
    function cacheBuster() {
        return Math.floor(Date.now() / 60000); // Changes every minute
    }

    // ---- DOM References ----
    const viewGrid = document.getElementById('view-grid');
    const viewExpanded = document.getElementById('view-expanded');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const defaultSitesList = document.getElementById('default-sites-list');
    const customSitesList = document.getElementById('custom-sites-list');
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnAddSite = document.getElementById('btn-add-site');
    const inputSiteName = document.getElementById('input-site-name');
    const inputSiteUrl = document.getElementById('input-site-url');
    const btnBack = document.getElementById('btn-back');
    const btnOpenExternal = document.getElementById('btn-open-external');
    const expandedIframe = document.getElementById('expanded-iframe');
    const expandedSiteName = document.getElementById('expanded-site-name');
    const sidebarTiles = document.getElementById('sidebar-tiles');
    const btnRefresh = document.getElementById('btn-refresh');
    const refreshStatus = document.getElementById('refresh-status');

    // ---- Settings Panel ----
    function openSettings() {
        settingsPanel.classList.remove('hidden');
        settingsOverlay.classList.remove('hidden');
        renderSettingsLists();
    }

    function closeSettings() {
        settingsPanel.classList.add('hidden');
        settingsOverlay.classList.add('hidden');
    }

    btnSettings.addEventListener('click', openSettings);
    btnCloseSettings.addEventListener('click', closeSettings);
    settingsOverlay.addEventListener('click', closeSettings);

    function renderSettingsLists() {
        // Default sites
        defaultSitesList.innerHTML = DEFAULT_SITES.map(site => `
            <label class="site-check-item">
                <input type="checkbox" data-site-id="${site.id}"
                    ${state.selectedSiteIds.includes(site.id) ? 'checked' : ''} />
                <div class="site-check-label">
                    <span class="site-check-name">${site.name}</span>
                    <span class="site-check-url">${site.url}</span>
                </div>
            </label>
        `).join('');

        // Custom sites
        if (state.customSites.length === 0) {
            customSitesList.innerHTML = '<p style="color: var(--gray-500); font-size: 13px; padding: 8px 12px;">Nog geen eigen sites toegevoegd.</p>';
        } else {
            customSitesList.innerHTML = state.customSites.map(site => `
                <label class="site-check-item">
                    <input type="checkbox" data-site-id="${site.id}"
                        ${state.selectedSiteIds.includes(site.id) ? 'checked' : ''} />
                    <div class="site-check-label">
                        <span class="site-check-name">${site.name}</span>
                        <span class="site-check-url">${site.url}</span>
                    </div>
                    <button class="btn-remove-site" data-remove-id="${site.id}" title="Verwijderen">&times;</button>
                </label>
            `).join('');
        }

        // Event listeners for checkboxes
        settingsPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const siteId = e.target.dataset.siteId;
                if (e.target.checked) {
                    if (!state.selectedSiteIds.includes(siteId)) {
                        state.selectedSiteIds.push(siteId);
                    }
                } else {
                    state.selectedSiteIds = state.selectedSiteIds.filter(id => id !== siteId);
                }
                saveState();
                renderGrid();
            });
        });

        // Event listeners for remove buttons
        settingsPanel.querySelectorAll('.btn-remove-site').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const removeId = e.currentTarget.dataset.removeId;
                state.customSites = state.customSites.filter(s => s.id !== removeId);
                state.selectedSiteIds = state.selectedSiteIds.filter(id => id !== removeId);
                saveState();
                renderSettingsLists();
                renderGrid();
            });
        });
    }

    // ---- Add Custom Site ----
    btnAddSite.addEventListener('click', () => {
        const name = inputSiteName.value.trim();
        let url = inputSiteUrl.value.trim();

        if (!name || !url) return;

        // Add https if missing
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const newSite = {
            id: generateId(name),
            name: name,
            url: url,
        };

        state.customSites.push(newSite);
        state.selectedSiteIds.push(newSite.id);
        saveState();

        inputSiteName.value = '';
        inputSiteUrl.value = '';
        renderSettingsLists();
        renderGrid();
    });

    // Allow Enter key in inputs
    [inputSiteName, inputSiteUrl].forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btnAddSite.click();
        });
    });

    // ---- Grid Rendering ----
    function renderGrid() {
        const sites = getSelectedSites();

        if (sites.length === 0) {
            viewGrid.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <p>Geen sites geselecteerd.<br>Klik op het tandwiel om sites toe te voegen.</p>
                    <button class="btn-primary" onclick="document.getElementById('btn-settings').click()">Sites beheren</button>
                </div>
            `;
            return;
        }

        const cb = cacheBuster();
        viewGrid.innerHTML = sites.map(site => `
            <div class="tile" data-site-id="${site.id}" title="${site.name} - Klik om te vergroten">
                <div class="tile-header">
                    <img class="tile-favicon" src="${getFaviconUrl(site.url)}" alt="" onerror="this.style.display='none'" />
                    <span class="tile-name">${site.name}</span>
                    <span class="tile-live-dot"></span>
                </div>
                <div class="tile-body">
                    <img class="tile-screenshot"
                         src="${getScreenshotUrl(site.url)}&cb=${cb}"
                         alt="Screenshot van ${site.name}"
                         loading="lazy" />
                    <div class="tile-loading">
                        <div class="spinner"></div>
                        <span>Laden...</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners to tiles
        viewGrid.querySelectorAll('.tile').forEach(tile => {
            tile.addEventListener('click', () => {
                expandSite(tile.dataset.siteId);
            });
        });

        // Handle screenshot load/error
        viewGrid.querySelectorAll('.tile-screenshot').forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                const loader = img.closest('.tile-body').querySelector('.tile-loading');
                if (loader) loader.style.display = 'none';
            });
            img.addEventListener('error', () => {
                img.classList.add('error');
                const loader = img.closest('.tile-body').querySelector('.tile-loading');
                if (loader) {
                    loader.innerHTML = '<span>Screenshot niet beschikbaar</span>';
                }
            });
        });

        updateRefreshStatus();
        startAutoRefresh();
    }

    // ---- Auto Refresh ----
    function startAutoRefresh() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = setInterval(() => {
            if (!state.expandedSiteId) {
                refreshScreenshots();
            }
        }, REFRESH_INTERVAL);
    }

    function refreshScreenshots() {
        const cb = cacheBuster();
        viewGrid.querySelectorAll('.tile-screenshot').forEach(img => {
            const tile = img.closest('.tile');
            const siteId = tile.dataset.siteId;
            const site = getAllSites().find(s => s.id === siteId);
            if (site) {
                img.classList.remove('loaded');
                const loader = img.closest('.tile-body').querySelector('.tile-loading');
                if (loader) {
                    loader.style.display = '';
                    loader.innerHTML = '<div class="spinner"></div><span>Vernieuwen...</span>';
                }
                img.src = `${getScreenshotUrl(site.url)}&cb=${cb}&r=${Math.random()}`;
            }
        });
        updateRefreshStatus();
    }

    function updateRefreshStatus() {
        if (refreshStatus) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
            refreshStatus.textContent = `Laatst vernieuwd: ${timeStr}`;
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            refreshScreenshots();
        });
    }

    // ---- Expanded View ----
    function expandSite(siteId) {
        const site = getAllSites().find(s => s.id === siteId);
        if (!site) return;

        state.expandedSiteId = siteId;

        // Hide grid, show expanded
        viewGrid.classList.add('hidden');
        viewExpanded.classList.remove('hidden');

        // Set main iframe - try loading the actual site
        expandedSiteName.textContent = site.name;
        expandedIframe.src = site.url;

        // Show fallback screenshot behind iframe in case iframe is blocked
        const expandedFallback = document.getElementById('expanded-fallback');
        if (expandedFallback) {
            expandedFallback.style.backgroundImage = `url(${getScreenshotUrl(site.url)})`;
            expandedFallback.querySelector('.fallback-site-name').textContent = site.name;
        }

        // Detect if iframe fails to load content
        expandedIframe.onload = () => {
            try {
                const doc = expandedIframe.contentDocument;
                // If we can access it and it's empty, show fallback
                if (doc && doc.body && doc.body.innerHTML === '') {
                    showExpandedFallback();
                } else {
                    hideExpandedFallback();
                }
            } catch {
                // Cross-origin: iframe might still render fine
                hideExpandedFallback();
            }
        };

        expandedIframe.onerror = () => {
            showExpandedFallback();
        };

        // Set external link
        btnOpenExternal.onclick = () => {
            window.open(site.url, '_blank');
        };

        // Render sidebar with other selected sites (using screenshots)
        const otherSites = getSelectedSites().filter(s => s.id !== siteId);
        const cb = cacheBuster();
        sidebarTiles.innerHTML = otherSites.map(s => `
            <div class="sidebar-tile" data-site-id="${s.id}" title="${s.name}">
                <div class="sidebar-tile-header">
                    <img class="tile-favicon" src="${getFaviconUrl(s.url)}" alt="" onerror="this.style.display='none'" />
                    <span>${s.name}</span>
                </div>
                <div class="sidebar-tile-body">
                    <img class="sidebar-screenshot"
                         src="${getScreenshotUrl(s.url)}&cb=${cb}"
                         alt="${s.name}"
                         loading="lazy" />
                </div>
            </div>
        `).join('');

        // Click handlers for sidebar tiles
        sidebarTiles.querySelectorAll('.sidebar-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                expandSite(tile.dataset.siteId);
            });
        });
    }

    function showExpandedFallback() {
        const fb = document.getElementById('expanded-fallback');
        if (fb) fb.classList.add('active');
        expandedIframe.style.display = 'none';
    }

    function hideExpandedFallback() {
        const fb = document.getElementById('expanded-fallback');
        if (fb) fb.classList.remove('active');
        expandedIframe.style.display = '';
    }

    function collapseView() {
        state.expandedSiteId = null;

        // Clear expanded iframe to stop loading
        expandedIframe.src = 'about:blank';
        sidebarTiles.innerHTML = '';

        // Show grid, hide expanded
        viewExpanded.classList.add('hidden');
        viewGrid.classList.remove('hidden');

        // Re-render grid to refresh
        renderGrid();
    }

    btnBack.addEventListener('click', collapseView);

    // ---- Initialize ----
    loadState();
    renderGrid();

})();
