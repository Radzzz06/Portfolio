document.addEventListener('DOMContentLoaded', () => {
  // Elements that should animate when visible
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;
  // Observer adds .in-view when an element enters viewport
  const observer = new IntersectionObserver(
    handleIntersection,
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  );
  revealElements.forEach((el) => observer.observe(el));

  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Animate once, then stop observing
        observer.unobserve(entry.target);
      }
    });
  }
});