let headerHeight = 0;

window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('mainNav');
  if (!mainNav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  // 使用 ResizeObserver 避免強制重繪 (Forced Reflow)
  const ro = new ResizeObserver(entries => {
    headerHeight = entries[0].target.offsetHeight;
  });

  ro.observe(mainNav);

  function updateNav() {
    const currentY = window.scrollY;
    const isScrollingUp = currentY < lastScrollY;
    const isPastHeader = currentY > headerHeight;

    // 簡潔的邏輯切換
    mainNav.classList.toggle('is-fixed', isPastHeader);
    mainNav.classList.toggle('is-visible', isScrollingUp && isPastHeader);

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
});
