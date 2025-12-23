let headerHeight = 0;

window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('mainNav');
  if (!mainNav) return;
  mainNav.style.transition = 'none';
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNav = () => {
    const currentY = window.scrollY;

    if (headerHeight === 0) return;

    const isPastHeader = currentY > headerHeight;
    const isScrollingUp = currentY < lastScrollY;

    if (isPastHeader) {
      mainNav.classList.add('is-fixed');
      // 只有往上捲動時才顯示
      mainNav.classList.toggle('is-visible', isScrollingUp);
    } else {
      // 在頂部時，確保所有狀態移除
      mainNav.classList.remove('is-fixed', 'is-visible');
    }

    lastScrollY = currentY;
  };

  const ro = new ResizeObserver(entries => {
    const rect = entries[0].contentRect;
    headerHeight = rect.height || mainNav.offsetHeight;

    updateNav();

    // 3. 判定完成後，恢復 CSS Transition (延遲一幀確保不會閃爍)
    requestAnimationFrame(() => {
      mainNav.style.transition = '';
    });
  });

  ro.observe(mainNav);

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
