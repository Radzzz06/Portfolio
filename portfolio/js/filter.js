const filterBar = document.getElementById('filter-bar');
const projectsGrid = document.getElementById('projects-grid');
const noResults = document.getElementById('no-results');

// Stores currently selected tags.
const activeTags = new Set();

function applyFilter() {
  if (!projectsGrid) return;
  const cards = projectsGrid.querySelectorAll('.project-card');
  let visibleCount = 0;
  cards.forEach((card) => {
    const shouldShow = shouldCardBeVisible(card);
    if (shouldShow) {
      card.removeAttribute('data-hidden');
      // Restart card animation when it becomes visible
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = '';
      visibleCount++;
    } else {
      card.setAttribute('data-hidden', 'true');
    }
  });
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

function shouldCardBeVisible(card) {
  // No selected tags means "show all"
  if (activeTags.size === 0) return true;
  const cardTagsRaw = card.getAttribute('data-tags') || '';
  const cardTags = new Set(cardTagsRaw.trim().toLowerCase().split(/\s+/));
  // Card must contain every selected tag
  for (const tag of activeTags) {
    if (!cardTags.has(tag)) return false;
  }
  return true;
}

function updateButtonStates() {
  if (!filterBar) return;
  const buttons = filterBar.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    const tag = (btn.getAttribute('data-tag') || '').toLowerCase();
    if (tag === 'all') {
      const isActive = activeTags.size === 0;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    } else {
      const isActive = activeTags.has(tag);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }
  });
}

// Keep current filter in URL so page is shareable/bookmarkable
function updateURL() {
  const url = new URL(window.location.href);
  if (activeTags.size === 0) {
    url.searchParams.delete('tags');
  } else {
    url.searchParams.set('tags', [...activeTags].join(','));
  }
  history.pushState(
    { tags: [...activeTags] },
    `Projects — filtered by ${[...activeTags].join(', ') || 'all'}`,
    url.toString(),
  );
}

// Read filter from URL on first load
function readURLAndApply() {
  const url = new URL(window.location.href);
  const tagsParam = url.searchParams.get('tags');
  activeTags.clear();
  if (tagsParam) {
    tagsParam.split(',').forEach((tag) => {
      const trimmed = tag.trim().toLowerCase();
      if (trimmed) activeTags.add(trimmed);
    });
  }
  applyFilter();
  updateButtonStates();
}

function handleFilterClick(event) {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;
  const tag = (btn.getAttribute('data-tag') || '').toLowerCase();
  if (tag === 'all') {
    activeTags.clear();
  } else {
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
    } else {
      activeTags.add(tag);
    }
  }
  applyFilter();
  updateButtonStates();
  updateURL();
}

// Re-apply filters when browser back/forward is used
function handlePopState(event) {
  activeTags.clear();
  if (event.state && event.state.tags) {
    event.state.tags.forEach((tag) => activeTags.add(tag));
  }
  applyFilter();
  updateButtonStates();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!filterBar || !projectsGrid) return;
  // One parent listener handles all filter buttons
  filterBar.addEventListener('click', handleFilterClick);
  window.addEventListener('popstate', handlePopState);
  readURLAndApply();
});