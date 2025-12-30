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

window.addEventListener('load', () => {
  if (window.quicklink) {
    // 優先使用 requestIdleCallback，在瀏覽器空閒時預抓連結
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => quicklink.listen());
    } else {
      // 否則至少延遲一個 frame
      setTimeout(() => quicklink.listen(), 200);
    }
  }
});

(function() {
  // 只在頁面有 <pre><code> 才載入 Prism
  if (document.querySelector('pre code')) {
    // 延遲載入 CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.css';
    link.media = 'print'; // 避免阻塞渲染
    link.onload = () => { link.media = 'all'; };
    document.head.appendChild(link);

    // 設定 Prism 為手動模式，避免自動 highlight
    window.Prism = { manual: true };

    // 載入 Prism core
    const core = document.createElement('script');
    core.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js';
    core.defer = true;
    core.onload = () => {
      // 載入 Autoloader
      const autoloader = document.createElement('script');
      autoloader.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js';
      autoloader.defer = true;
      autoloader.onload = () => {
        // 設定語言模組來源路徑
        Prism.plugins.autoloader.languages_path =
          'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';

        // 延遲 highlight
        requestIdleCallback(() => Prism.highlightAll());
      };
      document.body.appendChild(autoloader);
    };
    document.body.appendChild(core);
  }
})();
