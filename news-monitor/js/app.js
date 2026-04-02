// ============================================
// HLN Nieuwsmonitor - Main Application
// ============================================

(function () {
    'use strict';

    // ---- Default Sites ----
    // iframeDirect: true = site allows iframes natively (no proxy needed)
    const DEFAULT_SITES = [
        { id: 'hln', name: 'HLN', url: 'https://www.hln.be/', iframeDirect: false },
        { id: 'vrtnws', name: 'VRT NWS', url: 'https://www.vrt.be/vrtnws/nl/', iframeDirect: true },
        { id: 'demorgen', name: 'De Morgen', url: 'https://www.demorgen.be/', iframeDirect: false },
        { id: 'standaard', name: 'De Standaard', url: 'https://www.standaard.be/', iframeDirect: false },
        { id: 'nieuwsblad', name: 'Het Nieuwsblad', url: 'https://www.nieuwsblad.be/', iframeDirect: false },
        { id: 'tijd', name: 'De Tijd', url: 'https://www.tijd.be/', iframeDirect: true },
        { id: 'gva', name: 'Gazet van Antwerpen', url: 'https://www.gva.be/', iframeDirect: false },
        { id: 'hbvl', name: 'Het Belang van Limburg', url: 'https://www.hbvl.be/', iframeDirect: false },
        { id: 'knack', name: 'Knack', url: 'https://www.knack.be/', iframeDirect: false },
        { id: 'humo', name: 'Humo', url: 'https://www.humo.be/', iframeDirect: false },
    ];

    // ---- State ----
    let state = {
        selectedSiteIds: [],
        customSites: [],
        expandedSiteId: null,
    };

    let proxyAvailable = false;
    let refreshTimer = null;

    // ---- Server Endpoints ----
    function getSnapshotUrl(siteUrl) {
        return `/snapshot?url=${encodeURIComponent(siteUrl)}`;
    }

    function getProxyUrl(siteUrl) {
        return `/proxy?url=${encodeURIComponent(siteUrl)}`;
    }

    // ---- Proxy Detection ----
    async function detectProxy() {
        try {
            const resp = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
            const data = await resp.json();
            proxyAvailable = data.proxy === true;
        } catch {
            proxyAvailable = false;
        }
        updateProxyBadge();
    }

    // Grid tiles: direct iframe for allowed sites, snapshot for blocked sites
    function getGridSrc(site) {
        if (site.iframeDirect) {
            return { type: 'iframe', src: site.url };
        }
        if (proxyAvailable) {
            return { type: 'snapshot', src: getSnapshotUrl(site.url) };
        }
        return null;
    }

    // Expanded view: direct or proxy iframe for full interactivity
    function getExpandedIframeSrc(site) {
        if (site.iframeDirect) {
            return site.url;
        }
        if (proxyAvailable) {
            return getProxyUrl(site.url);
        }
        return null;
    }

    function updateProxyBadge() {
        const badge = document.getElementById('proxy-badge');
        if (badge) {
            if (proxyAvailable) {
                badge.textContent = 'LIVE';
                badge.className = 'proxy-badge live';
                badge.title = 'Server actief - alle sites beschikbaar';
            } else {
                badge.textContent = 'OFFLINE';
                badge.className = 'proxy-badge screenshots';
                badge.title = 'Server niet gevonden. Start met: start-nieuwsmonitor.bat';
            }
        }
    }

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

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const newSite = {
            id: generateId(name),
            name: name,
            url: url,
            iframeDirect: false,
        };

        state.customSites.push(newSite);
        state.selectedSiteIds.push(newSite.id);
        saveState();

        inputSiteName.value = '';
        inputSiteUrl.value = '';
        renderSettingsLists();
        renderGrid();
    });

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

        viewGrid.innerHTML = sites.map(site => {
            const gridInfo = getGridSrc(site);

            if (!gridInfo) {
                // No server available
                return `
                    <div class="tile tile-offline" data-site-id="${site.id}" title="${site.name}">
                        <div class="tile-header">
                            <img class="tile-favicon" src="${getFaviconUrl(site.url)}" alt="" onerror="this.style.display='none'" />
                            <span class="tile-name">${site.name}</span>
                        </div>
                        <div class="tile-body">
                            <div class="tile-loading">
                                <span>Server niet actief</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Both iframe-direct and snapshot sites use scaled-down iframes in the grid
            return `
                <div class="tile" data-site-id="${site.id}" title="${site.name} - Klik om te vergroten">
                    <div class="tile-header">
                        <img class="tile-favicon" src="${getFaviconUrl(site.url)}" alt="" onerror="this.style.display='none'" />
                        <span class="tile-name">${site.name}</span>
                        <span class="tile-live-dot"></span>
                    </div>
                    <div class="tile-body tile-body-iframe">
                        <div class="tile-iframe-wrapper">
                            <iframe src="${gridInfo.src}" sandbox="allow-scripts allow-same-origin allow-forms" loading="lazy" tabindex="-1"></iframe>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Click listeners
        viewGrid.querySelectorAll('.tile').forEach(tile => {
            tile.addEventListener('click', () => {
                expandSite(tile.dataset.siteId);
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
                refreshGrid();
            }
        }, 5 * 60 * 1000);
    }

    function refreshGrid() {
        // Refresh all iframes
        viewGrid.querySelectorAll('.tile-body-iframe iframe').forEach(iframe => {
            const src = iframe.src;
            iframe.src = 'about:blank';
            setTimeout(() => { iframe.src = src; }, 100);
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
        btnRefresh.addEventListener('click', refreshGrid);
    }

    // ---- Expanded View ----
    function expandSite(siteId) {
        const site = getAllSites().find(s => s.id === siteId);
        if (!site) return;

        state.expandedSiteId = siteId;

        viewGrid.classList.add('hidden');
        viewExpanded.classList.remove('hidden');

        expandedSiteName.textContent = site.name;

        const iframeSrc = getExpandedIframeSrc(site);
        const expandedFallback = document.getElementById('expanded-fallback');

        if (iframeSrc) {
            expandedIframe.src = iframeSrc;
            expandedIframe.style.display = '';
            if (expandedFallback) expandedFallback.classList.remove('active');
        } else {
            expandedIframe.src = 'about:blank';
            expandedIframe.style.display = 'none';
            if (expandedFallback) {
                expandedFallback.classList.add('active');
                expandedFallback.querySelector('.fallback-site-name').textContent = site.name;
            }
        }

        btnOpenExternal.onclick = () => {
            window.open(site.url, '_blank');
        };

        // Sidebar: snapshot iframes for all other sites
        const otherSites = getSelectedSites().filter(s => s.id !== siteId);
        sidebarTiles.innerHTML = otherSites.map(s => {
            const sidebarSrc = s.iframeDirect ? s.url : (proxyAvailable ? getSnapshotUrl(s.url) : null);
            if (!sidebarSrc) return '';
            return `
                <div class="sidebar-tile" data-site-id="${s.id}" title="${s.name}">
                    <div class="sidebar-tile-header">
                        <img class="tile-favicon" src="${getFaviconUrl(s.url)}" alt="" onerror="this.style.display='none'" />
                        <span>${s.name}</span>
                    </div>
                    <div class="sidebar-tile-body sidebar-tile-body-iframe">
                        <div class="tile-iframe-wrapper">
                            <iframe src="${sidebarSrc}" sandbox="allow-scripts allow-same-origin" loading="lazy" tabindex="-1"></iframe>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        sidebarTiles.querySelectorAll('.sidebar-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                expandSite(tile.dataset.siteId);
            });
        });
    }

    function collapseView() {
        state.expandedSiteId = null;
        expandedIframe.src = 'about:blank';
        sidebarTiles.innerHTML = '';

        viewExpanded.classList.add('hidden');
        viewGrid.classList.remove('hidden');

        renderGrid();
    }

    btnBack.addEventListener('click', collapseView);

    // ---- Initialize ----
    async function init() {
        loadState();
        await detectProxy();
        renderGrid();
    }

    init();

})();
