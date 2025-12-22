window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('mainNav');
  if (!mainNav) return;
  let lastScrollY = window.scrollY;

  let ticking = false;
  // 只讀一次 layout（安全）
  let headerHeight = mainNav.offsetHeight;

  function onScroll() {
    const currentY = window.scrollY;
    if (currentY < lastScrollY) {
      // 向上捲動
      if (currentY > headerHeight) {
        mainNav.classList.add('is-fixed', 'is-visible');
      } else {
        mainNav.classList.remove('is-fixed', 'is-visible');
      }
    } else {
      // 向下捲動
      mainNav.classList.remove('is-visible');
      if (currentY > headerHeight) {
        mainNav.classList.add('is-fixed');
      } else {
        mainNav.classList.remove('is-fixed');
      }
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 若有 RWD 或字型載入導致高度變動，重新計算一次
  window.addEventListener('resize', () => {
    headerHeight = mainNav.offsetHeight;
  }, { passive: true });
});

