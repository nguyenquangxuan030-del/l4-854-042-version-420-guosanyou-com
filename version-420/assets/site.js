const mobilePanel = document.querySelector('[data-mobile-panel]');
const menuToggle = document.querySelector('[data-menu-toggle]');

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('open');
  });
}

const backTop = document.querySelector('[data-back-top]');

if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 420);
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const tabs = Array.from(hero.querySelectorAll('[data-hero-tab]'));
  let current = 0;
  let timer = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === current);
    });
    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle('active', tabIndex === current);
    });
  };

  const start = () => {
    timer = window.setInterval(() => showSlide(current + 1), 5000);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      stop();
      showSlide(index);
      start();
    });
  });

  if (slides.length > 1) {
    start();
  }
}

const applyQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  const searchInputs = document.querySelectorAll('[data-filter-search]');

  if (query) {
    searchInputs.forEach((input) => {
      input.value = query;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
};

const setupFilterPanel = (panel) => {
  const search = panel.querySelector('[data-filter-search]');
  const type = panel.querySelector('[data-filter-type]');
  const year = panel.querySelector('[data-filter-year]');
  const list = document.querySelector('[data-filter-list]');

  if (!list) {
    return;
  }

  const cards = Array.from(list.querySelectorAll('.movie-card, .rank-item'));

  const filter = () => {
    const keyword = (search?.value || '').trim().toLowerCase();
    const selectedType = type?.value || '全部类型';
    const selectedYear = year?.value || '全部年份';

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const cardType = card.dataset.type || text;
      const cardYear = card.dataset.year || text;
      const keywordOk = !keyword || text.includes(keyword);
      const typeOk = selectedType === '全部类型' || cardType.includes(selectedType);
      const yearOk = selectedYear === '全部年份' || (selectedYear === '经典' ? Number(cardYear) < 2010 : cardYear.includes(selectedYear));
      card.classList.toggle('hidden-by-filter', !(keywordOk && typeOk && yearOk));
    });
  };

  [search, type, year].forEach((control) => {
    if (control) {
      control.addEventListener('input', filter);
      control.addEventListener('change', filter);
    }
  });
};

document.querySelectorAll('[data-filter-panel]').forEach(setupFilterPanel);
applyQuery();
