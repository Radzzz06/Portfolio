document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline');
  // Run only on about page
  if (!timeline) return;
  // One listener on list handles all item clicks
  timeline.addEventListener('click', handleTimelineClick);
  // Keyboard support for focused items
  timeline.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTimelineClick(event);
    }
  });
});

function handleTimelineClick(event) {
  // Find which timeline item was interacted with
  const header = event.target.closest('.timeline__header');
  if (!header) return;
  const item = header.closest('.timeline__item');
  if (!item) return;
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  // Keep accordion behavior: close others first
  const allItems = item.closest('.timeline').querySelectorAll('.timeline__item');
  allItems.forEach((other) => {
    other.classList.remove('expanded');
    const otherHeader = other.querySelector('.timeline__header');
    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
  });
  // Toggle selected item
  if (isExpanded) {
    item.classList.remove('expanded');
    header.setAttribute('aria-expanded', 'false');
  } else {
    item.classList.add('expanded');
    header.setAttribute('aria-expanded', 'true');
  }
}