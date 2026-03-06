// === STATE ===
let currentView = 'home';
let currentCategory = 'all';
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('kookboek-favs') || '[]');
let currentRecipeId = null;

// === DOM ELEMENTS ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const searchInput = $('#searchInput');
const searchClear = $('#searchClear');
const categoriesScroll = $('#categoriesScroll');
const recipeGrid = $('#recipeGrid');
const recipeCount = $('#recipeCount');
const sectionTitle = $('#sectionTitle');
const emptyState = $('#emptyState');
const recipeSection = $('#recipeSection');
const modalOverlay = $('#modalOverlay');
const modalContent = $('#modalContent');
const modalClose = $('#modalClose');
const modalHero = $('#modalHero');
const modalBody = $('#modalBody');
const modalFavBtn = $('#modalFavBtn');
const randomBtn = $('#randomBtn');
const randomModal = $('#randomModal');
const randomEmoji = $('#randomEmoji');
const randomName = $('#randomName');
const randomDesc = $('#randomDesc');
const randomAgain = $('#randomAgain');
const randomOpen = $('#randomOpen');
const toast = $('#toast');
const installBanner = $('#installBanner');
const installBtn = $('#installBtn');

// === INIT ===
function init() {
  renderCategories();
  renderRecipes();
  setupEventListeners();
  registerServiceWorker();
}

// === CATEGORIES ===
function renderCategories() {
  categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'category-chip';
    chip.dataset.category = cat.id;
    chip.innerHTML = `<span class="cat-icon">${cat.icon}</span> ${cat.name}`;
    categoriesScroll.appendChild(chip);
  });
}

// === RECIPES ===
function getFilteredRecipes() {
  let filtered = [...recipes];

  // Filter by view (favorites)
  if (currentView === 'favorites') {
    filtered = filtered.filter(r => favorites.includes(r.id));
  }

  // Filter by category
  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => r.category === currentCategory);
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(r => {
      const nameMatch = r.name.toLowerCase().includes(q);
      const ingredientMatch = r.ingredients.some(ing => ing.toLowerCase().includes(q));
      const descMatch = r.description.toLowerCase().includes(q);
      return nameMatch || ingredientMatch || descMatch;
    });
  }

  return filtered;
}

function renderRecipes() {
  const filtered = getFilteredRecipes();
  recipeGrid.innerHTML = '';

  // Update section title
  if (currentView === 'favorites') {
    sectionTitle.innerHTML = `Favorieten <span class="count">(${filtered.length})</span>`;
  } else if (currentCategory !== 'all') {
    const cat = categories.find(c => c.id === currentCategory);
    sectionTitle.innerHTML = `${cat.icon} ${cat.name} <span class="count">(${filtered.length})</span>`;
  } else if (searchQuery.trim()) {
    sectionTitle.innerHTML = `Zoekresultaten <span class="count">(${filtered.length})</span>`;
  } else {
    sectionTitle.innerHTML = `Alle recepten <span class="count">(${filtered.length})</span>`;
  }

  // Show/hide empty state
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    recipeSection.querySelector('.recipe-grid').classList.add('hidden');

    if (currentView === 'favorites') {
      emptyState.querySelector('.empty-icon').textContent = '❤️';
      emptyState.querySelector('p').textContent = 'Nog geen favorieten. Tik op het hartje bij een recept!';
    } else {
      emptyState.querySelector('.empty-icon').textContent = '🔍';
      emptyState.querySelector('p').textContent = 'Geen recepten gevonden';
    }
  } else {
    emptyState.classList.add('hidden');
    recipeSection.querySelector('.recipe-grid').classList.remove('hidden');
  }

  filtered.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.id = recipe.id;

    const isFav = favorites.includes(recipe.id);

    card.innerHTML = `
      <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${recipe.id}">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <div class="recipe-card-image">${recipe.image}</div>
      <div class="recipe-card-body">
        <div class="recipe-card-name">${recipe.name}</div>
        <div class="recipe-card-meta">
          <span>⏱ ${recipe.time}</span>
          <span>👥 ${recipe.servings}</span>
        </div>
      </div>
    `;

    recipeGrid.appendChild(card);
  });
}

// === RECIPE DETAIL ===
function openRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  currentRecipeId = id;
  const isFav = favorites.includes(id);

  modalHero.textContent = recipe.image;
  modalFavBtn.innerHTML = isFav ? '❤️' : '🤍';
  modalFavBtn.classList.toggle('active', isFav);

  const cat = categories.find(c => c.id === recipe.category);

  modalBody.innerHTML = `
    <h2>${recipe.name}</h2>
    <p class="description">${recipe.description}</p>
    <div class="modal-meta">
      <span class="meta-badge">⏱ ${recipe.time}</span>
      <span class="meta-badge">👥 ${recipe.servings} personen</span>
      <span class="meta-badge">${getDifficultyIcon(recipe.difficulty)} ${recipe.difficulty}</span>
      ${cat ? `<span class="meta-badge">${cat.icon} ${cat.name}</span>` : ''}
    </div>

    <h3>🛒 Ingrediënten</h3>
    <ul class="ingredients-list">
      ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>

    <h3>👨‍🍳 Bereiding</h3>
    <ol class="steps-list">
      ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
    </ol>

    ${recipe.tip ? `<div class="recipe-tip"><strong>💡 Tip</strong><p>${recipe.tip.replace(/\n\n/g, '</p><p>')}</p></div>` : ''}
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Ingredient checkboxes
  modalBody.querySelectorAll('.ingredients-list li').forEach(li => {
    li.addEventListener('click', () => li.classList.toggle('checked'));
  });
}

function closeRecipe() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  currentRecipeId = null;
}

function getDifficultyIcon(diff) {
  if (diff === 'makkelijk') return '🟢';
  if (diff === 'gemiddeld') return '🟡';
  return '🔴';
}

// === FAVORITES ===
function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
    showToast('Toegevoegd aan favorieten ❤️');
  } else {
    favorites.splice(idx, 1);
    showToast('Verwijderd uit favorieten');
  }
  localStorage.setItem('kookboek-favs', JSON.stringify(favorites));
  renderRecipes();

  // Update modal fav button if open
  if (currentRecipeId === id) {
    const isFav = favorites.includes(id);
    modalFavBtn.innerHTML = isFav ? '❤️' : '🤍';
    modalFavBtn.classList.toggle('active', isFav);
  }
}

// === RANDOM SUGGESTION ===
function showRandomSuggestion() {
  const recipe = recipes[Math.floor(Math.random() * recipes.length)];
  randomEmoji.textContent = recipe.image;
  randomName.textContent = recipe.name;
  randomDesc.textContent = recipe.description;
  randomModal.classList.add('open');
  randomModal.dataset.recipeId = recipe.id;
}

// === TOAST ===
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    searchClear.classList.toggle('visible', searchQuery.length > 0);
    renderRecipes();
  });

  searchClear.addEventListener('click', () => {
    searchQuery = '';
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderRecipes();
    searchInput.focus();
  });

  // Categories
  categoriesScroll.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;

    $$('.category-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.dataset.category;
    renderRecipes();
  });

  // Recipe cards (delegation)
  recipeGrid.addEventListener('click', (e) => {
    // Fav button
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(Number(favBtn.dataset.favId));
      return;
    }

    // Card click
    const card = e.target.closest('.recipe-card');
    if (card) {
      openRecipe(Number(card.dataset.id));
    }
  });

  // Modal
  modalClose.addEventListener('click', closeRecipe);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeRecipe();
  });
  modalFavBtn.addEventListener('click', () => {
    if (currentRecipeId) toggleFavorite(currentRecipeId);
  });

  // Random
  randomBtn.addEventListener('click', showRandomSuggestion);
  randomAgain.addEventListener('click', showRandomSuggestion);
  randomOpen.addEventListener('click', () => {
    const id = Number(randomModal.dataset.recipeId);
    randomModal.classList.remove('open');
    openRecipe(id);
  });
  randomModal.addEventListener('click', (e) => {
    if (e.target === randomModal) randomModal.classList.remove('open');
  });

  // Bottom nav
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      currentCategory = 'all';

      // Reset category chips
      $$('.category-chip').forEach(c => c.classList.remove('active'));
      $$('.category-chip')[0].classList.add('active');

      // Show/hide elements per view
      const introSection = $('#introSection');
      if (currentView === 'favorites') {
        randomBtn.classList.add('hidden');
        categoriesScroll.classList.add('hidden');
        installBanner.classList.remove('visible');
        if (introSection) introSection.classList.add('hidden');
      } else {
        randomBtn.classList.remove('hidden');
        categoriesScroll.classList.remove('hidden');
        if (introSection) introSection.classList.remove('hidden');
      }

      renderRecipes();
    });
  });

  // Back button (close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (randomModal.classList.contains('open')) {
        randomModal.classList.remove('open');
      } else if (modalOverlay.classList.contains('open')) {
        closeRecipe();
      }
    }
  });

  // PWA Install
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.add('visible');
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        installBanner.classList.remove('visible');
        showToast('Kookboek geïnstalleerd! 🎉');
      }
      deferredPrompt = null;
    }
  });

  window.addEventListener('appinstalled', () => {
    installBanner.classList.remove('visible');
  });
}

// === SERVICE WORKER ===
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// === GO! ===
init();
