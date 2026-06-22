/* ── State ── */
let costChart = null, sensHeatmap = null, cashflowChart = null, investWealthChartObj = null, iwOutflowChartObj = null;
let outflowPieChart = null, returnsPieChart = null;
let chatHistory = [];
let lastCalcResult = null;
let chatOpen = false;
let lastSensData = null;
let lastSensInputs = null;

/* ── Home price — comma-formatted INR text input ── */
function parseHpRs(id) {
  return parseInt(document.getElementById(id).value.replace(/[^\d]/g, '') || '0', 10);
}

function fmtHpInput(raw) {
  const n = parseInt(String(raw).replace(/[^\d]/g, '') || '0', 10);
  return n > 0 ? n.toLocaleString('en-IN') : '';
}

let _hpSyncing = false;

function setHpInput(id, num) {
  const el = document.getElementById(id);
  if (!el) return;
  _hpSyncing = true;
  el.value = fmtHpInput(num);
  _hpSyncing = false;
}

function attachHpFormatter(id, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function () {
    if (_hpSyncing) return;
    const digits  = this.value.replace(/[^\d]/g, '');
    const formatted = digits ? parseInt(digits, 10).toLocaleString('en-IN') : '';
    // preserve cursor offset from right so typing feels natural
    const trailLen = this.value.length - (this.selectionEnd ?? this.value.length);
    _hpSyncing = true;
    this.value = formatted;
    _hpSyncing = false;
    const newPos = Math.max(0, formatted.length - trailLen);
    if (typeof this.setSelectionRange === 'function') {
      try { this.setSelectionRange(newPos, newPos); } catch (_) { /* unfocused input */ }
    }
    if (onChange) onChange();
  });
}

/* ── Home price live format hint ── */
function updateHomePriceFmt() {
  const v  = parseHpRs('homePrice');
  const el = document.getElementById('homePriceFmt');
  el.textContent = v >= 100000 ? fmt(v) : 'Enter amount (min ₹1 L)';
  el.style.color = v >= 100000 ? 'var(--ink-muted)' : 'var(--rose-600)';
}
/* ── Home price & rent sliders ── */
function syncSliderFromInput(sliderId, value) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const min = +slider.min, max = +slider.max;
  slider.value = Math.min(max, Math.max(min, value));
}

function initHpSliderPair(inputId, sliderId, onUpdate) {
  const slider = document.getElementById(sliderId);
  if (!slider) {
    attachHpFormatter(inputId, onUpdate);
    return;
  }
  const syncFromSlider = () => {
    setHpInput(inputId, +slider.value);
    if (onUpdate) onUpdate();
  };
  slider.addEventListener('input', syncFromSlider);
  slider.addEventListener('change', syncFromSlider);
  attachHpFormatter(inputId, () => {
    syncSliderFromInput(sliderId, parseHpRs(inputId));
    if (onUpdate) onUpdate();
  });
  syncSliderFromInput(sliderId, parseHpRs(inputId));
}

// Piecewise home-price slider
// pos   0–198 → ₹10 L  to ₹10 Cr  (₹5 L / step)
// pos 198–248 → ₹10 Cr to ₹20 Cr  (₹20 L / step, extended zone unlocks at ~₹9.8 Cr)
const HP_BREAK_POS   = 198;
const HP_MAX_POS     = 248;
const HP_BREAK_PCT   = (HP_BREAK_POS / HP_MAX_POS * 100).toFixed(2) + '%'; // ~79.84%
const HP_UNLOCK_POS  = 196; // ~₹9.8 Cr — dragging here unlocks the extended zone
const HP_RELOCK_POS  = 180; // ~₹9 Cr  — re-locks when user backs well off
const HP_MIN_PRICE   = 1000000;   // ₹10 L
const HP_BREAK_PRICE = 100000000; // ₹10 Cr
const HP_STEP_LOW    = 500000;    // ₹5 L per step (normal range)
const HP_STEP_HIGH   = 2000000;   // ₹20 L per step (extended range)

let hpExtUnlocked = false;

function homePosToPrice(pos) {
  if (pos <= HP_BREAK_POS) return HP_MIN_PRICE + pos * HP_STEP_LOW;
  return HP_BREAK_PRICE + (pos - HP_BREAK_POS) * HP_STEP_HIGH;
}

function homePriceToPos(price) {
  if (price <= HP_BREAK_PRICE) return Math.round((price - HP_MIN_PRICE) / HP_STEP_LOW);
  return HP_BREAK_POS + Math.round((price - HP_BREAK_PRICE) / HP_STEP_HIGH);
}

function updateHomePriceSliderTrack(slider) {
  const pos = +slider.value;
  slider.style.setProperty('--hp-fill',  (pos / HP_MAX_POS * 100).toFixed(2) + '%');
  slider.style.setProperty('--hp-break', HP_BREAK_PCT);

  const label = document.getElementById('homePriceSliderMax');

  if (!hpExtUnlocked) {
    if (pos > HP_BREAK_POS) {
      slider.value = HP_BREAK_POS;
      slider.style.setProperty('--hp-fill', (HP_BREAK_POS / HP_MAX_POS * 100).toFixed(2) + '%');
    }
    if (pos >= HP_UNLOCK_POS) {
      hpExtUnlocked = true;
      slider.classList.add('hp-ext-active');
      if (label) label.textContent = '₹20 Cr';
    }
  } else if (pos <= HP_RELOCK_POS) {
    hpExtUnlocked = false;
    slider.classList.remove('hp-ext-active');
    if (label) label.textContent = '₹10 Cr';
  }
}

function syncHomePriceSliderFromPrice(price) {
  const slider = document.getElementById('homePriceSlider');
  if (!slider) return;
  const pos = Math.min(HP_MAX_POS, Math.max(0, homePriceToPos(price)));
  slider.value = pos;
  if (pos > HP_UNLOCK_POS && !hpExtUnlocked) {
    hpExtUnlocked = true;
    slider.classList.add('hp-ext-active');
    const label = document.getElementById('homePriceSliderMax');
    if (label) label.textContent = '₹20 Cr';
  }
  updateHomePriceSliderTrack(slider);
}

(function initHomePriceSlider() {
  const slider = document.getElementById('homePriceSlider');
  if (!slider) { attachHpFormatter('homePrice', () => { updateHomePriceFmt(); updateLiveEmi(); }); return; }
  const onSliderMove = () => {
    updateHomePriceSliderTrack(slider);
    setHpInput('homePrice', homePosToPrice(+slider.value));
    updateHomePriceFmt();
    updateLiveEmi();
  };
  slider.addEventListener('input',  onSliderMove);
  slider.addEventListener('change', onSliderMove);
  attachHpFormatter('homePrice', () => {
    syncHomePriceSliderFromPrice(parseHpRs('homePrice'));
    updateHomePriceFmt();
    updateLiveEmi();
  });
  syncHomePriceSliderFromPrice(parseHpRs('homePrice'));
}());
// Piecewise rent slider
// pos   0–98  → ₹10 K to ₹5 L   (₹5 K / step)
// pos  98–158 → ₹5 L  to ₹20 L  (₹25 K / step, extended zone unlocks at ~₹4.9 L)
const RENT_BREAK_POS  = 98;
const RENT_MAX_POS    = 128;
const RENT_BREAK_PCT  = (RENT_BREAK_POS / RENT_MAX_POS * 100).toFixed(2) + '%'; // ~76.56%
const RENT_UNLOCK_POS = 96;    // ~₹4.9 L
const RENT_RELOCK_POS = 85;    // ~₹4.35 L
const RENT_MIN        = 10000;  // ₹10 K
const RENT_BREAK      = 500000; // ₹5 L
const RENT_STEP_LOW   = 5000;   // ₹5 K / step
const RENT_STEP_HIGH  = 50000;  // ₹50 K / step

let rentExtUnlocked = false;

function rentPosToValue(pos) {
  if (pos <= RENT_BREAK_POS) return RENT_MIN + pos * RENT_STEP_LOW;
  return RENT_BREAK + (pos - RENT_BREAK_POS) * RENT_STEP_HIGH;
}

function rentValueToPos(val) {
  if (val <= RENT_BREAK) return Math.round((val - RENT_MIN) / RENT_STEP_LOW);
  return RENT_BREAK_POS + Math.round((val - RENT_BREAK) / RENT_STEP_HIGH);
}

function updateRentSliderTrack(slider) {
  const pos = +slider.value;
  slider.style.setProperty('--rent-fill',  (pos / RENT_MAX_POS * 100).toFixed(2) + '%');
  slider.style.setProperty('--rent-break', RENT_BREAK_PCT);

  const label = document.getElementById('rentSliderMax');

  if (!rentExtUnlocked) {
    if (pos > RENT_BREAK_POS) {
      slider.value = RENT_BREAK_POS;
      slider.style.setProperty('--rent-fill', (RENT_BREAK_POS / RENT_MAX_POS * 100).toFixed(2) + '%');
    }
    if (pos >= RENT_UNLOCK_POS) {
      rentExtUnlocked = true;
      slider.classList.add('rent-ext-active');
      if (label) label.textContent = '₹20 L';
    }
  } else if (pos <= RENT_RELOCK_POS) {
    rentExtUnlocked = false;
    slider.classList.remove('rent-ext-active');
    if (label) label.textContent = '₹5 L';
  }
}

function syncRentSliderFromValue(val) {
  const slider = document.getElementById('rentSlider');
  if (!slider) return;
  const pos = Math.min(RENT_MAX_POS, Math.max(0, rentValueToPos(val)));
  slider.value = pos;
  if (pos > RENT_UNLOCK_POS && !rentExtUnlocked) {
    rentExtUnlocked = true;
    slider.classList.add('rent-ext-active');
    const label = document.getElementById('rentSliderMax');
    if (label) label.textContent = '₹20 L';
  }
  updateRentSliderTrack(slider);
}

(function initRentSlider() {
  const slider = document.getElementById('rentSlider');
  if (!slider) { attachHpFormatter('rent', () => {}); return; }
  const onSliderMove = () => {
    updateRentSliderTrack(slider);
    setHpInput('rent', rentPosToValue(+slider.value));
  };
  slider.addEventListener('input',  onSliderMove);
  slider.addEventListener('change', onSliderMove);
  attachHpFormatter('rent', () => {
    syncRentSliderFromValue(parseHpRs('rent'));
  });
  syncRentSliderFromValue(parseHpRs('rent'));
}());

updateHomePriceFmt();

/* ── Nav hamburger (mobile) ── */
(function() {
  const hamburger  = document.getElementById('navHamburger');
  const drawer     = document.getElementById('navDrawer');
  const backdrop   = document.getElementById('navBackdrop');
  const closeBtn   = document.getElementById('navDrawerClose');

  function openNav() {
    drawer.classList.add('open');
    backdrop.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeNav() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  hamburger && hamburger.addEventListener('click', function() {
    drawer.classList.contains('open') ? closeNav() : openNav();
  });
  backdrop && backdrop.addEventListener('click', closeNav);
  closeBtn && closeBtn.addEventListener('click', closeNav);

  // Close drawer when a tab is picked from the drawer
  drawer && drawer.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', closeNav);
  });

  // Auto-close drawer when viewport expands past mobile breakpoint
  window.addEventListener('resize', function() {
    if (window.innerWidth > 640 && drawer && drawer.classList.contains('open')) closeNav();
  });
}());

/* ── Results stepper pane switching + prev/next ── */
(function() {
  const prevBtn   = document.getElementById('panePrev');
  const nextBtn   = document.getElementById('paneNext');
  const indicator = document.getElementById('paneIndicator');

  const PANES = [
    'pane-verdict','pane-returns','pane-chart','pane-hvs',
    'pane-cashflow','pane-breakdown','pane-schedule','pane-benchmarks','pane-scenarios'
  ];

  function activatePane(id) {
    const idx = PANES.indexOf(id);
    document.querySelectorAll('.stepper-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.pane === id);
    });
    document.querySelectorAll('.result-pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById(id);
    if (pane) pane.classList.add('active');
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) nextBtn.disabled = idx >= PANES.length - 1;
    if (indicator) indicator.textContent = (idx + 1) + ' / ' + PANES.length;
    // scroll active tab into view
    const activeTab = document.querySelector(`.stepper-tab[data-pane="${id}"]`);
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.stepper-tab');
    if (!btn || !btn.dataset.pane) return;
    activatePane(btn.dataset.pane);
  });

  prevBtn && prevBtn.addEventListener('click', function() {
    const cur = PANES.findIndex(id => document.getElementById(id) && document.getElementById(id).classList.contains('active'));
    if (cur > 0) activatePane(PANES[cur - 1]);
  });
  nextBtn && nextBtn.addEventListener('click', function() {
    const cur = PANES.findIndex(id => document.getElementById(id) && document.getElementById(id).classList.contains('active'));
    if (cur < PANES.length - 1) activatePane(PANES[cur + 1]);
  });
}());

/* ── Tab switching ── */
document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    // sync active state across main nav + drawer tabs
    document.querySelectorAll('.nav-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    const hideCalcUi = tab === 'compare' || tab === 'insights' || tab === 'support';
    ['inputsPanel', 'loanPanel', 'metricsHighlight', 'calcRow'].forEach(id => {
      document.getElementById(id).style.display = hideCalcUi ? 'none' : '';
    });
  });
});

/* ── Slider sync ── */
document.getElementById('tenure').addEventListener('input', () => {
  document.getElementById('tenureLabel').textContent = document.getElementById('tenure').value + ' years';
  updateLiveEmi();
});
document.getElementById('downPct').addEventListener('input', () => {
  document.getElementById('downLabel').textContent = document.getElementById('downPct').value + '%';
  updateLiveEmi();
});

/* ── Live EMI preview ── */
function updateLiveEmi() {
  const price    = parseHpRs('homePrice');
  const rate     = parseFloat(document.getElementById('interestRate').value) || 0;
  const tenure   = parseInt(document.getElementById('tenure').value)         || 20;
  const downPct  = parseFloat(document.getElementById('downPct').value)      || 20;
  const down     = price * downPct / 100;
  const loan     = price - down;
  const r        = rate / 12 / 100;
  const n        = tenure * 12;
  const emi      = (r > 0 && loan > 0) ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : (loan > 0 ? loan / n : 0);
  // use local formatting (fmt isn't defined yet, so inline it)
  function fmtLocal(v) {
    const a = Math.abs(v);
    if (a >= 1e7) return '₹' + (a / 1e7).toFixed(2) + ' Cr';
    if (a >= 1e5) return '₹' + (a / 1e5).toFixed(1) + ' L';
    return '₹' + Math.round(a).toLocaleString('en-IN');
  }
  document.getElementById('liveEmiValue').textContent = emi > 0 ? fmtLocal(Math.round(emi)) : '—';
  document.getElementById('liveEmiLoan').textContent   = loan > 0 ? 'Loan ' + fmtLocal(loan) : '—';
  document.getElementById('liveEmiDown').textContent   = down > 0 ? 'Down ' + fmtLocal(down) : '—';
  document.getElementById('liveEmiTenure').textContent = tenure + ' yr @ ' + rate + '%';
  updateMetricsHighlight();
}
document.getElementById('interestRate').addEventListener('input', updateLiveEmi);
document.getElementById('interestRate').addEventListener('change', updateLiveEmi);
attachHpFormatter('a_homePrice');
attachHpFormatter('b_homePrice');
updateLiveEmi();

/* ── Touchend fallback for mobile (prevents missed taps in DevTools emulation) ── */
(function() {
  function addTouchEnd(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    let _guard = false;
    el.addEventListener('touchend', function(e) {
      e.preventDefault(); // stop synthesised click so onclick doesn't double-fire
      if (_guard) return;
      _guard = true;
      setTimeout(() => { _guard = false; }, 400);
      fn();
    });
  }
  addTouchEnd('calcBtn',    function() { calculate(); });
  addTouchEnd('compareBtn', function() { compareProperties(); });
}());

/* ── Metrics highlight strip ── */
function updateMetricsHighlight() {
  const price   = parseHpRs('homePrice');
  const rate    = parseFloat(document.getElementById('interestRate').value) || 0;
  const tenure  = parseInt(document.getElementById('tenure').value) || 20;
  const downPct = parseFloat(document.getElementById('downPct').value) || 20;
  const rent    = parseFloat(document.getElementById('rent').value) || 0;
  const down    = price * downPct / 100;
  const loan    = price - down;
  const r       = rate / 12 / 100;
  const n       = tenure * 12;
  const emi     = (r > 0 && loan > 0) ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : (loan > 0 ? loan / n : 0);

  function fmtM(v) {
    const a = Math.abs(v);
    if (a >= 1e7) return '₹' + (a / 1e7).toFixed(2) + ' Cr';
    if (a >= 1e5) return '₹' + (a / 1e5).toFixed(1) + ' L';
    return '₹' + Math.round(a).toLocaleString('en-IN');
  }

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('mhHomePrice', price > 0 ? fmtM(price) : '—');
  set('mhLoan',      loan  > 0 ? fmtM(loan)  : '—');
  set('mhDown',      down  > 0 ? fmtM(down)  : '—');
  set('mhEmi',       emi   > 0 ? fmtM(Math.round(emi)) : '—');
  set('mhRent',      rent  > 0 ? fmtM(rent)  : '—');
  set('mhRate',      rate  > 0 ? rate + '%'  : '—');
  set('mhTenure',    tenure + ' yr');
}

/* ── Locality preset data — blended 10-yr trend (2014–2024)
   Recalibrated from RBI House Price Index, NHB Residex, Anarock, 99acres & Knight Frank data.
   No continuous official index exists back to 2004 (NHB Residex base was reset twice; RBI HPI
   starts 2010 and excludes Hyderabad/Pune), so ranges are anchored to decadal city CAGR
   (Anarock/Business Standard, ~3-7% for most cities, ~7% for Hyderabad) at the floor and the
   single hottest IT/BFSI corridor's defensible 10-yr CAGR at the ceiling — not a cherry-picked
   single boom year. Rent appreciation is anchored near CPI Housing inflation (urban, ~2-4.5%/yr)
   plus a premium for IT-corridor demand, not the 2022-23 post-pandemic rent-reset spike. ── */
const LOCALITY_DATA = {
  'Hyderabad': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Narsingi':           { app: 11.0, rent:  7.0, note: 'Fastest-growing corridor · Financial District fringe' },
      'Financial District': { app: 10.4, rent:  6.6, note: 'BFSI & IT HQ cluster · Nanakramguda spine' },
      'Puppalaguda':        { app: 10.8, rent:  7.0, note: 'Mid-market Financial District fringe · high demand' },
      'Gachibowli':         { app: 10.1, rent:  6.4, note: 'IT & BFSI hub · highest-density office stock' },
      'Hitech City':        { app:  9.9, rent:  6.2, note: 'HITEC City IT campus · co-working & residential' },
      'Manikonda':          { app: 10.4, rent:  6.6, note: 'Rapid infill development · premium to Gachibowli' },
      'Madhapur':           { app:  9.7, rent:  6.4, note: 'Cyberabad core · high street & office blend' },
      'Kondapur':           { app:  9.3, rent:  5.8, note: 'Westside corridor · mid-premium family segment' },
      'Miyapur':            { app:  7.8, rent:  5.0, note: 'Metro Phase 1 terminus · affordable growth zone' },
      'KPHB Colony':        { app:  7.4, rent:  4.6, note: 'Metro connectivity hub · steady mid-segment' },
      'Chanda Nagar':       { app:  7.6, rent:  4.6, note: 'IT worker suburb · balanced supply-demand' },
      'Banjara Hills':      { app:  8.2, rent:  4.6, note: 'Premium residential · commercial crossover' },
      'Jubilee Hills':      { app:  8.5, rent:  5.0, note: 'High-income enclave · low supply, firm prices' },
      'Kukatpally':         { app:  8.2, rent:  5.2, note: 'Metro junction suburb · transit-led appreciation' },
      'Bachupally':         { app:  7.6, rent:  4.6, note: 'Outer Ring Road corridor · planned township' },
      'Kompally':           { app:  7.1, rent:  4.2, note: 'North Hyderabad ORR node · emerging suburb' },
      'LB Nagar':           { app:  6.5, rent:  4.0, note: 'Metro SE corridor · affordable working-class' },
      'Secunderabad':       { app:  6.7, rent:  4.2, note: 'Twin-city heritage · Cantonment stability' },
      'Ameerpet':           { app:  7.1, rent:  4.6, note: 'Education & coaching hub · steady rental demand' },
      'Attapur':            { app:  6.7, rent:  4.0, note: 'Airport-adjacent suburb · infrastructure play' },
    },
  },
  'Bangalore': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Marathahalli':      { app: 11.0, rent:  6.8, note: 'OUTER Ring Road pivot · highest IT worker density' },
      'Sarjapur Road':     { app: 10.3, rent:  6.5, note: 'SE corridor to Electronic City · luxury township' },
      'Devanahalli':       { app: 10.3, rent:  5.8, note: 'Aerospace SEZ & airport · logistics-driven boom' },
      'Whitefield':        { app:  9.7, rent:  6.3, note: 'ITPB & EPIP Zone · Bangalore\'s tech birthplace' },
      'Thanisandra':       { app:  9.3, rent:  5.8, note: 'NH-7 corridor · fast-depleting inventory' },
      'HSR Layout':        { app:  9.3, rent:  5.8, note: 'Startup capital · Bommanahalli IT belt fringe' },
      'Hebbal':            { app:  8.8, rent:  5.8, note: 'Airport flyover node · luxury & premium segment' },
      'Kanakapura Road':   { app:  8.2, rent:  5.2, note: 'Metro Phase 2 corridor · south Bangalore growth' },
      'Koramangala':       { app:  8.2, rent:  4.9, note: 'Startup & F&B epicentre · low supply, high demand' },
      'JP Nagar':          { app:  8.2, rent:  5.2, note: 'South Bangalore established · metro connectivity' },
      'Bannerghatta Road': { app:  7.1, rent:  4.9, note: 'Electronics City corridor · value mid-segment' },
      'Yelahanka':         { app:  7.5, rent:  4.9, note: 'North suburb · defence & airport catchment' },
      'Jayanagar':         { app:  7.5, rent:  4.9, note: 'Heritage premium enclave · very low new supply' },
      'Indiranagar':       { app:  8.2, rent:  4.9, note: 'Lifestyle precinct · metro-boosted rents' },
      'Electronic City':   { app:  7.1, rent:  5.4, note: 'IT SEZ core · highest gross rental yield' },
      'Malleshwaram':      { app:  6.7, rent:  4.5, note: 'Old Bangalore premium · cultural hub' },
      'Rajajinagar':       { app:  6.0, rent:  4.1, note: 'West Bangalore mid-segment · metro access' },
      'Banashankari':      { app:  6.7, rent:  4.5, note: 'South established suburb · family preferred' },
      'Bellary Road':      { app:  8.2, rent:  5.2, note: 'NH-44 north corridor · airport & warehousing' },
      'Cunningham Road':   { app:  6.0, rent:  3.8, note: 'Central Bangalore premium · commercial fringe' },
      'Bellandur':         { app:  9.5, rent:  5.8, note: 'Outer Ring Road hub · Sarjapur Road growth zone' },
      'Brookefield':       { app:  9.5, rent:  6.3, note: 'Whitefield IT extension · premium gated communities' },
      'BTM Layout':        { app:  8.2, rent:  4.9, note: 'South Bangalore mid-premium · startup & F&B belt' },
    },
  },
  'Pune': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Hinjewadi':       { app:  9.0, rent:  6.0, note: 'Rajiv Gandhi IT Park · Pune\'s top IT micro-market' },
      'Kharadi':         { app:  9.0, rent:  6.0, note: 'EON IT Park · fastest land price appreciation' },
      'Wakad':           { app:  8.1, rent:  5.4, note: 'Hinjewadi fringe · family-friendly & well-served' },
      'Sus Road':        { app:  8.1, rent:  5.4, note: 'Luxury township belt · Baner-Pashan upscale' },
      'Viman Nagar':     { app:  8.1, rent:  5.4, note: 'Airport proximity · premium expat catchment' },
      'Kalyani Nagar':   { app:  7.8, rent:  5.0, note: 'Koregaon Park fringe · premium address' },
      'Baner':           { app:  7.8, rent:  5.0, note: 'Aundh-Baner corridor · lifestyle & IT blend' },
      'Pimple Saudagar': { app:  7.8, rent:  5.0, note: 'North Pune growth node · NH-48 connectivity' },
      'Hadapsar':        { app:  7.3, rent:  4.8, note: 'Magarpatta & EON cluster · value IT segment' },
      'Ravet':           { app:  7.3, rent:  4.8, note: 'Pimpri-Chinchwad IT fringe · industrial buffer' },
      'Bavdhan':         { app:  7.3, rent:  4.8, note: 'Western hillside suburb · gated communities' },
      'Aundh':           { app:  7.3, rent:  4.8, note: 'North Pune premium · educational institutions' },
      'Wagholi':         { app:  6.7, rent:  4.5, note: 'Eastern affordable belt · strong absorption' },
      'Nibm Road':       { app:  6.4, rent:  4.5, note: 'South Pune mid-premium · low inventory' },
      'Undri':           { app:  6.4, rent:  4.1, note: 'Affordable south Pune · infrastructure catch-up' },
      'Kondhwa':         { app:  6.0, rent:  4.1, note: 'South Pune established · NIBM road corridor' },
      'Shivane':         { app:  6.0, rent:  4.1, note: 'Kothrud fringe · affordable township projects' },
      'Kothrud':         { app:  5.5, rent:  4.1, note: 'West Pune heritage suburb · steady demand' },
      'Ambegaon':        { app:  5.5, rent:  3.8, note: 'Katraj belt · budget residential catchment' },
      'Talegaon':        { app:  5.0, rent:  3.5, note: 'Mumbai-Pune Expressway node · second-home play' },
      'Koregaon Park':   { app:  7.8, rent:  5.0, note: 'Old Pune premium · luxury apartments & expat address' },
    },
  },
  'Mumbai': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Ulwe':         { app:  8.0, rent:  5.8, note: 'Navi Mumbai International Airport fringe · rapid rise' },
      'Lower Parel':  { app:  7.4, rent:  4.8, note: 'Mill land redevelopment · luxury & BFSI hub' },
      'Mira Road':    { app:  7.4, rent:  5.8, note: 'Affordable North Mumbai · Metro 9 upcoming' },
      'Kharghar':     { app:  6.9, rent:  5.2, note: 'Navi Mumbai planned node · CBD fringe' },
      'Panvel':       { app:  6.0, rent:  4.8, note: 'Airport & MTHL anchor · fastest Navi Mumbai' },
      'Ghatkopar':    { app:  6.9, rent:  5.2, note: 'Metro Line 1 terminus · eastern suburb hub' },
      'Mulund':       { app:  6.0, rent:  4.8, note: 'LBS Marg corridor · Thane connectivity' },
      'Chembur':      { app:  6.0, rent:  4.8, note: 'Monorail & metro junction · central east' },
      'BKC':          { app:  6.9, rent:  4.8, note: 'Bandra Kurla Complex · premium commercial district' },
      'Navi Mumbai':  { app:  4.6, rent:  3.8, note: 'NAINA project + airport · suburban township' },
      'Thane':        { app:  5.1, rent:  3.8, note: 'Twin-city growth engine · infra-driven values' },
      'Powai':        { app:  6.0, rent:  4.8, note: 'Tech & startup campus · IIT & Hiranandani' },
      'Borivali':     { app:  5.1, rent:  4.4, note: 'Western suburbs terminus · metro connectivity' },
      'Kandivali':    { app:  5.1, rent:  4.4, note: 'Malad-Kandivali corridor · affordable mid-seg' },
      'Dombivli':     { app:  4.6, rent:  3.8, note: 'KDMC affordable belt · strong absorption' },
      'Kalyan':       { app:  4.0, rent:  3.2, note: 'Outer suburbs · value residential hub' },
      'Andheri West': { app:  6.0, rent:  4.4, note: 'Western suburbs hub · Metro Line 1 & 2' },
      'Andheri East': { app:  4.6, rent:  3.8, note: 'MIDC & SEEPZ zone · commercial conversion' },
      'Bandra':       { app:  4.6, rent:  3.2, note: 'Premium island address · capital gains story' },
      'Worli':        { app:  6.0, rent:  3.8, note: 'Sea Link connectivity · luxury redevelopment' },
      'Goregaon East':{ app:  5.1, rent:  4.4, note: 'Western suburbs mid-segment · Mindspace IT park & film city' },
      'Malad West':   { app:  5.1, rent:  4.4, note: 'Western suburbs mid-premium · Metro Line 2A served' },
      'Vashi':        { app:  6.9, rent:  5.2, note: 'Navi Mumbai CBD · APMC & planned township node' },
    },
  },
  'Delhi NCR': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Dwarka Expressway':       { app:  9.0, rent:  5.5, note: 'NH-48 corridor · under-supplied micro-market' },
      'New Gurgaon (Sec 82+)':   { app:  8.1, rent:  6.2, note: 'Latest planned nodes · SPR & CPR arteries' },
      'Golf Course Ext Road':    { app:  9.0, rent:  5.5, note: 'Southern Gurgaon premium · corporate campus' },
      'Greater Noida West':      { app:  8.1, rent:  6.2, note: 'Affordable NCR belt · RERA-cleared projects' },
      'Sohna Road':              { app:  7.5, rent:  5.5, note: 'Mid-premium Gurgaon south · township developments' },
      'Yamuna Expressway':       { app:  6.0, rent:  4.8, note: 'F1 circuit & industrial node · long-term play' },
      'Noida Sector 62–137':     { app:  6.0, rent:  5.5, note: 'IT & corporate cluster · Aqua Line metro' },
      'Manesar':                 { app:  7.5, rent:  5.5, note: 'Industrial township · multinational anchors' },
      'DLF City Phases':         { app:  8.1, rent:  4.8, note: 'Golf Course Road premium · Gurgaon legacy' },
      'Greater Noida (Main)':    { app:  6.9, rent:  5.5, note: 'Planned city · Pari Chowk commercial hub' },
      'Noida Extension (Sec 1)': { app:  6.9, rent:  5.5, note: 'High-absorption budget belt · Metro upcoming' },
      'Indirapuram':             { app:  6.0, rent:  4.8, note: 'Ghaziabad mid-market · Blue Line metro' },
      'Raj Nagar Extension':     { app:  5.1, rent:  4.4, note: 'Budget NCR · large township supply' },
      'South Delhi':             { app:  6.0, rent:  3.2, note: 'Legacy luxury · very low new supply' },
      'Vasant Kunj':             { app:  6.0, rent:  3.9, note: 'Central south Delhi · metro-served premium' },
      'Dwarka Sectors':          { app:  5.1, rent:  3.9, note: 'Planned township DDA · metro connectivity' },
      'Rohini':                  { app:  4.5, rent:  3.2, note: 'North Delhi affordable · older township' },
      'Faridabad (Sec 85+)':     { app:  4.5, rent:  3.9, note: 'Southern NCR industrial fringe · value play' },
      'Noida Sec 44–52':         { app:  6.0, rent:  4.8, note: 'Established Noida belt · Blue Line served' },
      'Sohna':                   { app:  7.5, rent:  5.5, note: 'Emerging township town · Gurgaon spillover' },
    },
  },
  'Chennai': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Thoraipakkam':    { app:  8.8, rent:  6.0, note: 'OMR peak IT belt · highest-density tech cluster' },
      'Sholinganallur':  { app:  8.3, rent:  5.7, note: 'OMR South anchor · Cognizant & Infosys campus' },
      'Perungudi':       { app:  8.0, rent:  5.3, note: 'OMR Phase 1 gateway · TIDEL Park proximity' },
      'Porur':           { app:  7.6, rent:  4.9, note: 'Western IT hub · DLF & Olympia tech parks' },
      'Velachery':       { app:  7.1, rent:  4.6, note: 'South-central metro node · Phoenix Marketcity' },
      'Kovilambakkam':   { app:  6.7, rent:  4.6, note: 'Velachery overspill · affordable south corridor' },
      'Pallikaranai':    { app:  7.1, rent:  4.9, note: 'OMR bypass node · wetland-to-residential shift' },
      'Neelankarai':     { app:  6.7, rent:  4.6, note: 'ECR & OMR junction · beach-side premium' },
      'Guindy':          { app:  7.1, rent:  4.9, note: 'Industrial-to-IT transition · TIDEL & IIT fringe' },
      'Ambattur':        { app:  6.0, rent:  4.3, note: 'Industrial belt IT transition · value play' },
      'Poonamallee':     { app:  6.0, rent:  3.9, note: 'NH-48 western suburb · IT park upcoming' },
      'Iyyappanthangal': { app:  6.3, rent:  4.3, note: 'Porur fringe · DLF & Ramapuram IT belt' },
      'Anna Nagar':      { app:  6.3, rent:  4.3, note: 'Premier north Chennai suburb · established' },
      'T Nagar':         { app:  7.1, rent:  4.6, note: 'Commercial heart · premium residential pockets' },
      'Adyar':           { app:  6.7, rent:  4.3, note: 'Old-money south Chennai · low supply, firm prices' },
      'Mylapore':        { app:  6.7, rent:  4.3, note: 'Heritage premium enclave · cultural hub' },
      'Chromepet':       { app:  6.0, rent:  3.9, note: 'Airport adjacency · mid-segment residential' },
      'Tambaram':        { app:  5.5, rent:  3.5, note: 'Southern railway hub · affordable catchment' },
      'Padi':            { app:  5.5, rent:  3.9, note: 'NH-16 northern corridor · industrial-to-resi' },
      'Perambur':        { app:  5.0, rent:  3.5, note: 'North Chennai industrial transition · value' },
    },
  },
  'Kolkata': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Rajarhat (IT Zone)':       { app:  8.0, rent:  5.5, note: 'New Town IT & BFSI hub · fastest Kolkata growth' },
      'New Town AA-Block':        { app:  7.3, rent:  5.1, note: 'Smart City core · planned infra & metro upcoming' },
      'New Town Action Area II':  { app:  6.4, rent:  4.3, note: 'Mixed-use township · HIDCO planned growth' },
      'Salt Lake Sector V':       { app:  5.6, rent:  4.3, note: 'IT campus cluster · Webel Bhavan zone' },
      'Salt Lake Sec I–IV':       { app:  4.5, rent:  3.4, note: 'Established suburb · DLF & residential belt' },
      'Kaikhali':                 { app:  6.4, rent:  4.3, note: 'Airport fringe · metro Phase 2 coming' },
      'Dum Dum':                  { app:  5.6, rent:  3.7, note: 'Airport & metro junction · mid-segment' },
      'Madhyamgram':              { app:  5.6, rent:  3.7, note: 'North Kolkata suburban growth · affordable' },
      'Barasat':                  { app:  4.9, rent:  3.4, note: 'BT Road north · industrial satellite town' },
      'Haiderpool / New Kolkata': { app:  6.8, rent:  4.8, note: 'JB Nagar new township · integrated development' },
      'Tollygunj':                { app:  5.6, rent:  4.3, note: 'South Kolkata premium · metro connected' },
      'Ballygunge':               { app:  6.4, rent:  4.3, note: 'Premium address · low supply, steady capital gains' },
      'Alipore':                  { app:  5.6, rent:  3.7, note: 'Old-money enclave · ultra-low new supply' },
      'Kasba':                    { app:  4.5, rent:  3.7, note: 'EM Bypass corridor · mid-segment preferred' },
      'Garia':                    { app:  4.9, rent:  3.7, note: 'South suburban metro terminal · affordable' },
      'Joka':                     { app:  5.6, rent:  3.7, note: 'IIM Calcutta fringe · institutional catchment' },
      'Narendrapur':              { app:  4.5, rent:  3.4, note: 'Suburban south · plotted & villa development' },
      'Andul Road':               { app:  4.5, rent:  3.0, note: 'West Howrah fringe · affordable township' },
      'Sonarpur':                 { app:  4.5, rent:  3.0, note: 'South fringe · mid-range plotted development' },
      'Behala':                   { app:  4.0, rent:  3.0, note: 'South Kolkata suburb · stable working-class' },
    },
  },
  'Ahmedabad': {
    note: 'Blended 10-yr trend (2014–2024) · RBI House Price Index, Anarock Research, 99acres, Knight Frank',
    localities: {
      'Thaltej':            { app:  9.0, rent:  6.2, note: 'Premium west · high-end gated community belt' },
      'SG Highway (North)': { app:  8.0, rent:  5.5, note: 'Commercial & residential spine · top performer' },
      'Gota':               { app:  7.6, rent:  5.0, note: 'Suburban north-west node · BRTS served' },
      'Motera':             { app:  7.0, rent:  4.7, note: 'Stadium precinct · Sabarmati Riverfront lift' },
      'Bopal':              { app:  8.0, rent:  5.5, note: 'Affordable west suburb · family township belt' },
      'Vastrapur':          { app:  7.6, rent:  5.0, note: 'Lake-front premium · central west address' },
      'Bodakdev':           { app:  7.0, rent:  4.7, note: 'Satellite fringe premium · expat & NRI pref.' },
      'Chandkheda':         { app:  6.4, rent:  4.4, note: 'North industrial buffer · budget residential' },
      'Prahlad Nagar':      { app:  7.0, rent:  4.7, note: 'Commercial hub fringe · mid-premium towers' },
      'Ambawadi':           { app:  7.0, rent:  4.7, note: 'Central premium · educational & medical hub' },
      'Navrangpura':        { app:  7.0, rent:  4.7, note: 'CBD fringe · co-working & startup ecosystem' },
      'Satellite':          { app:  6.4, rent:  4.4, note: 'Established residential · consistent demand' },
      'Paldi':              { app:  6.4, rent:  4.4, note: 'South central established · metro BRTS access' },
      'Naranpura':          { app:  6.0, rent:  4.4, note: 'Central north suburb · stable mid-segment' },
      'Maninagar':          { app:  5.6, rent:  3.9, note: 'East Ahmedabad transit hub · old established' },
      'Vastral':            { app:  5.6, rent:  3.9, note: 'Eastern fringe · GIFT City corridor play' },
      'Naroda':             { app:  5.6, rent:  3.9, note: 'Industrial township fringe · value catchment' },
      'Nikol':              { app:  5.0, rent:  3.5, note: 'East suburb · affordable lower-income belt' },
      'Vatva':              { app:  5.0, rent:  3.5, note: 'GIDC industrial zone fringe · value segment' },
      'Isanpur':            { app:  5.0, rent:  3.5, note: 'East corridor affordable · starter home belt' },
      'GIFT City':          { app: 10.5, rent:  4.5, note: 'India\'s first IFSC smart city · Oracle, BofA, TCS · Violet Line metro' },
    },
  },
};

/* ── Locality property metrics — covers every locality in LOCALITY_DATA (canonical names) ── */
const LOCALITY_METRICS = {
  'Hyderabad': {
    'Gachibowli':         { price: '₹7,500–11,000/sqft',  yield: '6.4%', appr: '10.1% p.a.' },
    'Hitech City':        { price: '₹9,000–13,500/sqft',  yield: '6.2%', appr: '9.9% p.a.'  },
    'Financial District': { price: '₹10,000–15,000/sqft', yield: '6.6%', appr: '10.4% p.a.' },
    'Narsingi':           { price: '₹6,500–9,000/sqft',   yield: '7.0%', appr: '11.0% p.a.' },
    'Puppalaguda':        { price: '₹6,500–9,500/sqft',   yield: '7.0%', appr: '10.8% p.a.' },
    'Manikonda':          { price: '₹7,000–10,000/sqft',  yield: '6.6%', appr: '10.4% p.a.' },
    'Madhapur':           { price: '₹9,000–13,000/sqft',  yield: '6.4%', appr: '9.7% p.a.'  },
    'Kondapur':           { price: '₹7,000–10,000/sqft',  yield: '5.8%', appr: '9.3% p.a.', recentApp: 10.5 },
    'Miyapur':            { price: '₹5,000–7,000/sqft',   yield: '5.0%', appr: '7.8% p.a.'  },
    'KPHB Colony':        { price: '₹4,500–6,500/sqft',   yield: '4.6%', appr: '7.4% p.a.'  },
    'Chanda Nagar':       { price: '₹4,500–6,500/sqft',   yield: '4.6%', appr: '7.6% p.a.'  },
    'Banjara Hills':      { price: '₹11,000–18,000/sqft', yield: '4.6%', appr: '8.2% p.a.'  },
    'Jubilee Hills':      { price: '₹13,000–22,000/sqft', yield: '5.0%', appr: '8.5% p.a.'  },
    'Kukatpally':         { price: '₹5,000–7,000/sqft',   yield: '5.2%', appr: '8.2% p.a.'  },
    'Bachupally':         { price: '₹4,000–6,000/sqft',   yield: '4.6%', appr: '7.6% p.a.'  },
    'Kompally':           { price: '₹3,500–5,500/sqft',   yield: '4.2%', appr: '7.1% p.a.'  },
    'LB Nagar':           { price: '₹3,500–5,500/sqft',   yield: '4.0%', appr: '6.5% p.a.'  },
    'Secunderabad':       { price: '₹5,000–8,000/sqft',   yield: '4.2%', appr: '6.7% p.a.'  },
    'Ameerpet':           { price: '₹6,000–9,000/sqft',   yield: '4.6%', appr: '7.1% p.a.'  },
    'Attapur':            { price: '₹3,500–5,500/sqft',   yield: '4.0%', appr: '6.7% p.a.'  },
  },
  'Bangalore': {
    'Marathahalli':       { price: '₹7,000–10,500/sqft',  yield: '6.8%', appr: '11.0% p.a.' },
    'Sarjapur Road':      { price: '₹7,500–11,000/sqft',  yield: '6.5%', appr: '10.3% p.a.' },
    'Devanahalli':        { price: '₹5,500–8,500/sqft',   yield: '5.8%', appr: '10.3% p.a.' },
    'Whitefield':         { price: '₹7,000–10,500/sqft',  yield: '6.3%', appr: '9.7% p.a.'  },
    'Thanisandra':        { price: '₹5,000–7,500/sqft',   yield: '5.8%', appr: '9.3% p.a.'  },
    'HSR Layout':         { price: '₹9,000–13,000/sqft',  yield: '5.8%', appr: '9.3% p.a.'  },
    'Bellandur':          { price: '₹8,000–12,000/sqft',  yield: '5.8%', appr: '9.5% p.a.'  },
    'Brookefield':        { price: '₹7,500–11,500/sqft',  yield: '6.3%', appr: '9.5% p.a.'  },
    'Hebbal':             { price: '₹8,000–12,500/sqft',  yield: '5.8%', appr: '8.8% p.a.'  },
    'Kanakapura Road':    { price: '₹4,500–7,000/sqft',   yield: '5.2%', appr: '8.2% p.a.'  },
    'Koramangala':        { price: '₹11,000–17,000/sqft', yield: '4.9%', appr: '8.2% p.a.'  },
    'JP Nagar':           { price: '₹7,500–11,000/sqft',  yield: '5.2%', appr: '8.2% p.a.'  },
    'Indiranagar':        { price: '₹12,000–18,000/sqft', yield: '4.9%', appr: '8.2% p.a.'  },
    'BTM Layout':         { price: '₹8,000–12,000/sqft',  yield: '4.9%', appr: '8.2% p.a.'  },
    'Bellary Road':       { price: '₹5,500–8,000/sqft',   yield: '5.2%', appr: '8.2% p.a.'  },
    'Bannerghatta Road':  { price: '₹6,000–9,000/sqft',   yield: '4.9%', appr: '7.1% p.a.'  },
    'Yelahanka':          { price: '₹5,500–8,000/sqft',   yield: '4.9%', appr: '7.5% p.a.'  },
    'Jayanagar':          { price: '₹10,000–16,000/sqft', yield: '4.9%', appr: '7.5% p.a.'  },
    'Banashankari':       { price: '₹6,500–9,500/sqft',   yield: '4.5%', appr: '6.7% p.a.'  },
    'Malleshwaram':       { price: '₹13,000–20,000/sqft', yield: '4.5%', appr: '6.7% p.a.'  },
    'Electronic City':    { price: '₹4,500–6,500/sqft',   yield: '5.4%', appr: '7.1% p.a.'  },
    'Rajajinagar':        { price: '₹8,000–12,000/sqft',  yield: '4.1%', appr: '6.0% p.a.'  },
    'Cunningham Road':    { price: '₹18,000–28,000/sqft', yield: '3.8%', appr: '6.0% p.a.'  },
  },
  'Pune': {
    'Hinjewadi':          { price: '₹6,500–9,500/sqft',   yield: '6.0%', appr: '9.0% p.a.'  },
    'Kharadi':            { price: '₹7,000–10,500/sqft',  yield: '6.0%', appr: '9.0% p.a.'  },
    'Wakad':              { price: '₹6,500–9,000/sqft',   yield: '5.4%', appr: '8.1% p.a.'  },
    'Sus Road':           { price: '₹9,000–14,000/sqft',  yield: '5.4%', appr: '8.1% p.a.'  },
    'Viman Nagar':        { price: '₹8,500–12,500/sqft',  yield: '5.4%', appr: '8.1% p.a.'  },
    'Kalyani Nagar':      { price: '₹10,000–15,000/sqft', yield: '5.0%', appr: '7.8% p.a.'  },
    'Koregaon Park':      { price: '₹12,000–18,000/sqft', yield: '5.0%', appr: '7.8% p.a.'  },
    'Baner':              { price: '₹8,000–12,000/sqft',  yield: '5.0%', appr: '7.8% p.a.'  },
    'Pimple Saudagar':    { price: '₹6,500–9,000/sqft',   yield: '5.0%', appr: '7.8% p.a.'  },
    'Hadapsar':           { price: '₹5,500–8,000/sqft',   yield: '4.8%', appr: '7.3% p.a.'  },
    'Ravet':              { price: '₹5,000–7,500/sqft',   yield: '4.8%', appr: '7.3% p.a.'  },
    'Bavdhan':            { price: '₹6,000–9,000/sqft',   yield: '4.8%', appr: '7.3% p.a.'  },
    'Aundh':              { price: '₹8,000–12,000/sqft',  yield: '4.8%', appr: '7.3% p.a.'  },
    'Wagholi':            { price: '₹4,500–6,500/sqft',   yield: '4.5%', appr: '6.7% p.a.'  },
    'Nibm Road':          { price: '₹6,500–9,500/sqft',   yield: '4.5%', appr: '6.4% p.a.'  },
    'Undri':              { price: '₹4,500–7,000/sqft',   yield: '4.1%', appr: '6.4% p.a.'  },
    'Kondhwa':            { price: '₹5,000–7,500/sqft',   yield: '4.1%', appr: '6.0% p.a.'  },
    'Shivane':            { price: '₹4,500–6,500/sqft',   yield: '4.1%', appr: '6.0% p.a.'  },
    'Kothrud':            { price: '₹9,000–13,000/sqft',  yield: '4.1%', appr: '5.5% p.a.'  },
    'Ambegaon':           { price: '₹3,500–5,500/sqft',   yield: '3.8%', appr: '5.5% p.a.'  },
    'Talegaon':           { price: '₹3,000–5,000/sqft',   yield: '3.5%', appr: '5.0% p.a.'  },
  },
  'Mumbai': {
    'Ulwe':               { price: '₹7,000–10,000/sqft',  yield: '5.8%', appr: '8.0% p.a.'  },
    'Lower Parel':        { price: '₹30,000–50,000/sqft', yield: '4.8%', appr: '7.4% p.a.'  },
    'Mira Road':          { price: '₹9,000–13,000/sqft',  yield: '5.8%', appr: '7.4% p.a.'  },
    'Kharghar':           { price: '₹8,000–12,000/sqft',  yield: '5.2%', appr: '6.9% p.a.'  },
    'Vashi':              { price: '₹12,000–18,000/sqft', yield: '5.2%', appr: '6.9% p.a.'  },
    'Ghatkopar':          { price: '₹16,000–22,000/sqft', yield: '5.2%', appr: '6.9% p.a.'  },
    'BKC':                { price: '₹35,000–55,000/sqft', yield: '4.8%', appr: '6.9% p.a.'  },
    'Panvel':             { price: '₹5,500–8,500/sqft',   yield: '4.8%', appr: '6.0% p.a.'  },
    'Chembur':            { price: '₹16,000–23,000/sqft', yield: '4.8%', appr: '6.0% p.a.'  },
    'Mulund':             { price: '₹14,000–20,000/sqft', yield: '4.8%', appr: '6.0% p.a.'  },
    'Andheri West':       { price: '₹22,000–32,000/sqft', yield: '4.4%', appr: '6.0% p.a.'  },
    'Worli':              { price: '₹40,000–70,000/sqft', yield: '3.8%', appr: '6.0% p.a.'  },
    'Powai':              { price: '₹18,000–25,000/sqft', yield: '4.8%', appr: '6.0% p.a.'  },
    'Goregaon East':      { price: '₹18,000–26,000/sqft', yield: '4.4%', appr: '5.1% p.a.'  },
    'Thane':              { price: '₹13,000–20,000/sqft', yield: '3.8%', appr: '5.1% p.a.'  },
    'Borivali':           { price: '₹15,000–22,000/sqft', yield: '4.4%', appr: '5.1% p.a.'  },
    'Kandivali':          { price: '₹16,000–22,000/sqft', yield: '4.4%', appr: '5.1% p.a.'  },
    'Malad West':         { price: '₹18,000–26,000/sqft', yield: '4.4%', appr: '5.1% p.a.'  },
    'Andheri East':       { price: '₹20,000–28,000/sqft', yield: '3.8%', appr: '4.6% p.a.'  },
    'Navi Mumbai':        { price: '₹7,000–12,000/sqft',  yield: '3.8%', appr: '4.6% p.a.'  },
    'Dombivli':           { price: '₹7,000–10,000/sqft',  yield: '3.8%', appr: '4.6% p.a.'  },
    'Bandra':             { price: '₹35,000–60,000/sqft', yield: '3.2%', appr: '4.6% p.a.'  },
    'Kalyan':             { price: '₹5,500–8,000/sqft',   yield: '3.2%', appr: '4.0% p.a.'  },
  },
  'Delhi NCR': {
    'Dwarka Expressway':      { price: '₹8,000–12,000/sqft',  yield: '5.5%', appr: '9.0% p.a.'  },
    'New Gurgaon (Sec 82+)':  { price: '₹7,000–11,000/sqft',  yield: '6.2%', appr: '8.1% p.a.'  },
    'Golf Course Ext Road':   { price: '₹14,000–22,000/sqft', yield: '5.5%', appr: '9.0% p.a.'  },
    'Greater Noida West':     { price: '₹4,500–7,000/sqft',   yield: '6.2%', appr: '8.1% p.a.'  },
    'Sohna Road':             { price: '₹7,500–11,000/sqft',  yield: '5.5%', appr: '7.5% p.a.'  },
    'Manesar':                { price: '₹4,500–7,000/sqft',   yield: '5.5%', appr: '7.5% p.a.'  },
    'Sohna':                  { price: '₹5,000–7,500/sqft',   yield: '5.5%', appr: '7.5% p.a.'  },
    'DLF City Phases':        { price: '₹12,000–18,000/sqft', yield: '4.8%', appr: '8.1% p.a.'  },
    'Greater Noida (Main)':   { price: '₹4,000–6,500/sqft',   yield: '5.5%', appr: '6.9% p.a.'  },
    'Noida Extension (Sec 1)':{ price: '₹4,000–6,500/sqft',   yield: '5.5%', appr: '6.9% p.a.'  },
    'Noida Sector 62–137':    { price: '₹7,000–10,000/sqft',  yield: '5.5%', appr: '6.0% p.a.'  },
    'Indirapuram':            { price: '₹5,500–8,000/sqft',   yield: '4.8%', appr: '6.0% p.a.'  },
    'Noida Sec 44–52':        { price: '₹5,500–8,500/sqft',   yield: '4.8%', appr: '6.0% p.a.'  },
    'Yamuna Expressway':      { price: '₹4,000–6,500/sqft',   yield: '4.8%', appr: '6.0% p.a.'  },
    'South Delhi':            { price: '₹20,000–45,000/sqft', yield: '3.2%', appr: '6.0% p.a.'  },
    'Vasant Kunj':            { price: '₹15,000–25,000/sqft', yield: '3.9%', appr: '6.0% p.a.'  },
    'Dwarka Sectors':         { price: '₹8,000–12,000/sqft',  yield: '3.9%', appr: '5.1% p.a.'  },
    'Raj Nagar Extension':    { price: '₹3,500–5,500/sqft',   yield: '4.4%', appr: '5.1% p.a.'  },
    'Rohini':                 { price: '₹6,000–9,000/sqft',   yield: '3.2%', appr: '4.5% p.a.'  },
    'Faridabad (Sec 85+)':    { price: '₹4,000–6,000/sqft',   yield: '3.9%', appr: '4.5% p.a.'  },
  },
  'Chennai': {
    'Thoraipakkam':       { price: '₹6,000–9,500/sqft',   yield: '6.0%', appr: '8.8% p.a.'  },
    'Sholinganallur':     { price: '₹5,500–9,000/sqft',   yield: '5.7%', appr: '8.3% p.a.'  },
    'Perungudi':          { price: '₹5,500–9,000/sqft',   yield: '5.3%', appr: '8.0% p.a.'  },
    'Porur':              { price: '₹6,000–8,500/sqft',   yield: '4.9%', appr: '7.6% p.a.'  },
    'Velachery':          { price: '₹7,000–10,000/sqft',  yield: '4.6%', appr: '7.1% p.a.'  },
    'Pallikaranai':       { price: '₹5,000–7,500/sqft',   yield: '4.9%', appr: '7.1% p.a.'  },
    'Kovilambakkam':      { price: '₹5,000–7,500/sqft',   yield: '4.6%', appr: '6.7% p.a.'  },
    'Neelankarai':        { price: '₹8,000–12,000/sqft',  yield: '4.6%', appr: '6.7% p.a.'  },
    'Guindy':             { price: '₹7,000–10,000/sqft',  yield: '4.9%', appr: '7.1% p.a.'  },
    'Iyyappanthangal':    { price: '₹4,500–7,000/sqft',   yield: '4.3%', appr: '6.3% p.a.'  },
    'Anna Nagar':         { price: '₹11,000–16,000/sqft', yield: '4.3%', appr: '6.3% p.a.'  },
    'T Nagar':            { price: '₹9,000–15,000/sqft',  yield: '4.6%', appr: '7.1% p.a.'  },
    'Adyar':              { price: '₹13,000–20,000/sqft', yield: '4.3%', appr: '6.7% p.a.'  },
    'Mylapore':           { price: '₹9,000–15,000/sqft',  yield: '4.3%', appr: '6.7% p.a.'  },
    'Chromepet':          { price: '₹4,500–7,000/sqft',   yield: '3.9%', appr: '6.0% p.a.'  },
    'Ambattur':           { price: '₹4,500–6,500/sqft',   yield: '4.3%', appr: '6.0% p.a.'  },
    'Poonamallee':        { price: '₹3,500–5,500/sqft',   yield: '3.9%', appr: '6.0% p.a.'  },
    'Tambaram':           { price: '₹3,500–5,500/sqft',   yield: '3.5%', appr: '5.5% p.a.'  },
    'Padi':               { price: '₹3,500–5,500/sqft',   yield: '3.9%', appr: '5.5% p.a.'  },
    'Perambur':           { price: '₹3,000–5,000/sqft',   yield: '3.5%', appr: '5.0% p.a.'  },
  },
  'Kolkata': {
    'Rajarhat (IT Zone)':       { price: '₹5,000–8,500/sqft',  yield: '5.5%', appr: '8.0% p.a.'  },
    'New Town AA-Block':        { price: '₹5,500–9,000/sqft',  yield: '5.1%', appr: '7.3% p.a.'  },
    'New Town Action Area II':  { price: '₹5,000–8,000/sqft',  yield: '4.3%', appr: '6.4% p.a.'  },
    'Salt Lake Sector V':       { price: '₹6,000–9,000/sqft',  yield: '4.3%', appr: '5.6% p.a.'  },
    'Salt Lake Sec I–IV':       { price: '₹6,000–9,000/sqft',  yield: '3.4%', appr: '4.5% p.a.'  },
    'Kaikhali':                 { price: '₹4,000–6,000/sqft',  yield: '4.3%', appr: '6.4% p.a.'  },
    'Haiderpool / New Kolkata': { price: '₹4,500–7,000/sqft',  yield: '4.8%', appr: '6.8% p.a.'  },
    'Tollygunj':                { price: '₹7,000–10,000/sqft', yield: '4.3%', appr: '5.6% p.a.'  },
    'Ballygunge':               { price: '₹15,000–18,000/sqft', yield: '4.3%', appr: '6.4% p.a.' },
    'Alipore':                  { price: '₹18,000–25,000/sqft', yield: '3.7%', appr: '5.6% p.a.' },
    'Kasba':                    { price: '₹5,000–7,500/sqft',  yield: '3.7%', appr: '4.5% p.a.'  },
    'Dum Dum':                  { price: '₹3,500–5,500/sqft',  yield: '3.7%', appr: '5.6% p.a.'  },
    'Garia':                    { price: '₹4,000–6,000/sqft',  yield: '3.7%', appr: '4.9% p.a.'  },
    'Joka':                     { price: '₹3,500–5,500/sqft',  yield: '3.7%', appr: '5.6% p.a.'  },
    'Barasat':                  { price: '₹2,500–4,000/sqft',  yield: '3.4%', appr: '4.9% p.a.'  },
    'Madhyamgram':              { price: '₹3,000–4,500/sqft',  yield: '3.7%', appr: '5.6% p.a.'  },
    'Narendrapur':              { price: '₹3,000–4,500/sqft',  yield: '3.4%', appr: '4.5% p.a.'  },
    'Andul Road':               { price: '₹2,500–4,000/sqft',  yield: '3.0%', appr: '4.5% p.a.'  },
    'Sonarpur':                 { price: '₹2,500–4,000/sqft',  yield: '3.0%', appr: '4.5% p.a.'  },
    'Behala':                   { price: '₹3,000–5,000/sqft',  yield: '3.0%', appr: '4.0% p.a.'  },
  },
  'Ahmedabad': {
    'Thaltej':            { price: '₹9,000–13,000/sqft',  yield: '6.2%', appr: '9.0% p.a.'  },
    'SG Highway (North)': { price: '₹8,000–10,500/sqft',  yield: '5.5%', appr: '8.0% p.a.'  },
    'Gota':               { price: '₹4,500–6,500/sqft',   yield: '5.0%', appr: '7.6% p.a.'  },
    'Bopal':              { price: '₹4,650–6,500/sqft',   yield: '5.5%', appr: '8.0% p.a.'  },
    'Vastrapur':          { price: '₹8,000–11,000/sqft',  yield: '5.0%', appr: '7.6% p.a.'  },
    'Prahlad Nagar':      { price: '₹7,500–9,500/sqft',   yield: '4.7%', appr: '7.0% p.a.'  },
    'Ambawadi':           { price: '₹7,500–10,000/sqft',  yield: '4.7%', appr: '7.0% p.a.'  },
    'Navrangpura':        { price: '₹7,500–8,500/sqft',   yield: '4.7%', appr: '7.0% p.a.'  },
    'Bodakdev':           { price: '₹12,000–18,000/sqft', yield: '4.7%', appr: '7.0% p.a.'  },
    'GIFT City':          { price: '₹8,500–12,800/sqft',  yield: '4.5%', appr: '10.5% p.a.' },
    'Motera':             { price: '₹5,000–7,500/sqft',   yield: '4.7%', appr: '7.0% p.a.'  },
    'Satellite':          { price: '₹7,500–8,500/sqft',   yield: '4.4%', appr: '6.4% p.a.'  },
    'Paldi':              { price: '₹5,000–7,500/sqft',   yield: '4.4%', appr: '6.4% p.a.'  },
    'Naranpura':          { price: '₹5,500–8,000/sqft',   yield: '4.4%', appr: '6.0% p.a.'  },
    'Chandkheda':         { price: '₹3,500–5,500/sqft',   yield: '4.4%', appr: '6.4% p.a.'  },
    'Maninagar':          { price: '₹4,000–6,000/sqft',   yield: '3.9%', appr: '5.6% p.a.'  },
    'Vastral':            { price: '₹3,500–5,500/sqft',   yield: '3.9%', appr: '5.6% p.a.'  },
    'Naroda':             { price: '₹3,000–5,000/sqft',   yield: '3.9%', appr: '5.6% p.a.'  },
    'Nikol':              { price: '₹3,000–4,500/sqft',   yield: '3.5%', appr: '5.0% p.a.'  },
    'Vatva':              { price: '₹2,500–4,000/sqft',   yield: '3.5%', appr: '5.0% p.a.'  },
    'Isanpur':            { price: '₹2,500–4,000/sqft',   yield: '3.5%', appr: '5.0% p.a.'  },
  },
};

/* ── Populate locality dropdowns ── */
(function initLocPreset() {
  const cityEl     = document.getElementById('locCity');
  const localEl    = document.getElementById('locLocality');
  const appliedEl  = document.getElementById('locApplied');
  const appValEl   = document.getElementById('locAppVal');
  const rentValEl  = document.getElementById('locRentVal');
  const srcEl      = document.getElementById('locSrc');
  const clearBtn   = document.getElementById('locClearBtn');
  if (!cityEl) return;

  // Populate cities
  Object.keys(LOCALITY_DATA).sort().forEach(city => {
    const o = document.createElement('option');
    o.value = city; o.textContent = city;
    cityEl.appendChild(o);
  });

  cityEl.addEventListener('change', () => {
    const city = cityEl.value;
    localEl.innerHTML = '<option value="">— Select locality —</option>';
    localEl.disabled = !city;
    appliedEl.style.display = 'none';
    if (!city) return;
    Object.keys(LOCALITY_DATA[city].localities).forEach(loc => {
      const o = document.createElement('option');
      o.value = loc; o.textContent = loc;
      localEl.appendChild(o);
    });
  });

  localEl.addEventListener('change', () => {
    const city = cityEl.value;
    const loc  = localEl.value;
    if (!city || !loc) { appliedEl.style.display = 'none'; return; }
    const d = LOCALITY_DATA[city].localities[loc];

    // Apply to form
    document.getElementById('appreciation').value    = d.app;
    document.getElementById('rentAppreciation').value = d.rent;

    // Show applied strip
    appValEl.textContent  = d.app  + '%';
    rentValEl.textContent = d.rent + '%';
    srcEl.textContent     = d.note + '  ·  ' + LOCALITY_DATA[city].note;
    appliedEl.style.display = 'flex';
  });

  clearBtn.addEventListener('click', () => {
    cityEl.value = '';
    localEl.innerHTML = '<option value="">— Select city first —</option>';
    localEl.disabled = true;
    appliedEl.style.display = 'none';
  });
}());

/* ── Jump-nav: activate on results show, highlight current section ── */
(function initJumpNav() {
  const nav = document.getElementById('resultsJumpNav');
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll('.rj-item'));
  const targets = items.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(a => a.classList.remove('active'));
        const link = nav.querySelector(`[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  targets.forEach(t => observer.observe(t));
}());

/* ── Scroll hints for wide tables on mobile ── */
function initScrollHints() {
  document.querySelectorAll('.amort-wrapper').forEach(wrapper => {
    if (wrapper.dataset.hintAdded) return;
    wrapper.dataset.hintAdded = '1';
    const hint = document.createElement('p');
    hint.className = 'scroll-hint';
    hint.textContent = '← swipe table to see all columns →';
    wrapper.parentNode.insertBefore(hint, wrapper.nextSibling);
    wrapper.addEventListener('scroll', () => { hint.style.opacity = '0'; }, { once: true });
  });
}

/* ── Number formatting ── */
function fmt(n) {
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (a >= 1e7) return s + '₹' + (a / 1e7).toFixed(2) + ' Cr';
  if (a >= 1e5) return s + '₹' + (a / 1e5).toFixed(1) + ' L';
  return s + '₹' + Math.round(a).toLocaleString('en-IN');
}
function fmtPct(n) { return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'; }

/* ── Benchmark fund helper ── */
function getSelectedFund() {
  const sel = document.getElementById('benchmarkFund');
  if (!sel) return { label: 'Nifty 50', cagr: 12.0 };
  const opt = sel.options[sel.selectedIndex];
  return { label: opt.text.replace(/\s*\(.*\)$/, ''), cagr: parseFloat(opt.dataset.cagr) };
}

function updateBenchmarkLabels() {
  const fund = getSelectedFund();
  const el = id => document.getElementById(id);
  if (el('benchmarkFundKpiLabel')) el('benchmarkFundKpiLabel').textContent = fund.label;
  if (el('kpiStockNetGainSub')) el('kpiStockNetGainSub').textContent = `Down payment (day 1) + monthly outflow invested at ${fund.cagr}%/yr`;
  if (el('hvsColFundNote1')) el('hvsColFundNote1').textContent = fund.label;
  if (el('hvsColFundNote2')) el('hvsColFundNote2').textContent = fund.label;
}

/* ── Collect inputs ── */
function getInputs() {
  return {
    home_price: parseHpRs('homePrice'),
    monthly_rent: parseHpRs('rent'),
    interest_rate: parseFloat(document.getElementById('interestRate').value),
    annual_appreciation: parseFloat(document.getElementById('appreciation').value),
    rent_appreciation: parseFloat(document.getElementById('rentAppreciation').value),
    maintenance_pct: parseFloat(document.getElementById('maintenance').value),
    stock_return: parseFloat(document.getElementById('stockReturn').value),
    benchmark_return: getSelectedFund().cagr,
    tenure_years: parseInt(document.getElementById('tenure').value),
    down_payment_pct: parseFloat(document.getElementById('downPct').value),
  };
}

/* ── Validate inputs ── */
function validate(inputs) {
  const errs = [];
  if (!inputs.home_price || inputs.home_price < 100000) errs.push('Home price must be at least ₹1 lakh');
  if (!inputs.monthly_rent || inputs.monthly_rent < 1000) errs.push('Monthly rent must be at least ₹1,000');
  if (!inputs.interest_rate || inputs.interest_rate <= 0) errs.push('Interest rate required');
  if (isNaN(inputs.annual_appreciation)) errs.push('Appreciation rate required');
  return errs;
}

/* ── Main calculate ── */
async function calculate() {
  const inputs = getInputs();
  const errs = validate(inputs);

  const errEl = document.getElementById('apiError');
  if (errs.length) {
    errEl.textContent = errs[0];
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');

  // loading state
  const btn = document.getElementById('calcBtn');
  document.getElementById('btnText').textContent = 'Calculating…';
  document.getElementById('btnSpinner').classList.remove('hidden');
  btn.disabled = true;

  try {
    /* ── Main calculation ── */
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Server error');
    }
    const { data } = await res.json();

    /* ── Sensitivity (parallel) ── */
    const sensRes = await fetch('/api/sensitivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...inputs,
        tenures: [5, 10, 15, 20, 25, 30],
        down_payments: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        current_tenure: inputs.tenure_years,
        current_down_pct: inputs.down_payment_pct,
      }),
    });
    const sensData = sensRes.ok ? (await sensRes.json()).data : null;

    renderResults(data, inputs, sensData);

  } catch (e) {
    errEl.textContent = '⚠ ' + (e.message || 'Could not connect to server. Is the backend running?');
    errEl.classList.remove('hidden');
  } finally {
    document.getElementById('btnText').textContent = 'Run analysis';
    document.getElementById('btnSpinner').classList.add('hidden');
    btn.disabled = false;
  }
}

/* ── Render all results ── */
function renderResults(data, inputs, sensData) {
  const s = data.summary;

  // hero
  const heroEl = document.getElementById('heroRoi');
  const heroRate = s.cagr_dcf_real_pct ?? s.cagr_dcf_pct;
  heroEl.textContent = fmtPct(heroRate);
  heroEl.className = 'hero-stat-num ' + (heroRate >= 0 ? 'positive' : 'negative');

  // show results section + jump nav + scroll hints
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('resultsJumpNav').classList.add('visible');
  initScrollHints();

  // verdict strip
  const strip = document.getElementById('verdictStrip');
  strip.className = 'verdict-strip ' + (s.buying_wins ? 'buy' : 'rent');
  document.getElementById('verdictIcon').textContent = s.buying_wins ? '🏠' : '📈';
  document.getElementById('verdictTitle').textContent = s.buying_wins
    ? 'Buying this property is a good investment'
    : 'Renting + investing would likely serve you better';
  document.getElementById('verdictDesc').textContent = s.buying_wins
    ? `Your home equity outpaces a stock portfolio by ${fmt(Math.abs(s.rent_vs_buy))} over ${inputs.tenure_years} years — buying wins the wealth race here.`
    : `A renter who invests the difference ends up ${fmt(Math.abs(s.rent_vs_buy))} ahead of your home equity — the market beats this property.`;

  const cagrChip = document.getElementById('verdictCagr');
  cagrChip.textContent = fmtPct(heroRate) + ' p.a. CAGR';
  cagrChip.className = 'verdict-chip ' + (heroRate >= 0 ? 'pos' : 'neg');
  document.getElementById('verdictRentSaved').textContent = fmt(s.cumulative_rent_saved) + ' rental income over tenure';

  // ── Loan summary strip (plain English) ──
  const totalInterestPaid = Math.round(data.amortisation.reduce((sum, d) => sum + d.interest, 0));
  const yr1 = data.amortisation[0] || {};
  const sec24b = Math.min(yr1.interest  || 0, 200000); // max ₹2L/yr deductible under Sec 24(b)
  const sec80c  = Math.min(yr1.principal || 0, 150000); // max ₹1.5L/yr deductible under Sec 80C
  const taxSaving = Math.round((sec24b + sec80c) * 0.30);
  const finalHomeVal = (data.amortisation[data.amortisation.length - 1] || {}).home_value || 0;

  document.getElementById('lssEmi').textContent         = fmt(s.monthly_emi);
  document.getElementById('lssInterest').textContent    = fmt(totalInterestPaid);
  document.getElementById('lssInterestSub').textContent = `over ${inputs.tenure_years} yrs · ${Math.round(totalInterestPaid / s.loan_amount * 100)}% on top of ₹${(s.loan_amount/1e5).toFixed(0)}L loan`;
  document.getElementById('lssHomeVal').textContent     = fmt(finalHomeVal);
  document.getElementById('lssHomeValSub').textContent  = `at ${inputs.annual_appreciation}%/yr · today it's ${fmt(inputs.home_price)}`;
  document.getElementById('lssTax').textContent         = taxSaving > 0 ? fmt(taxSaving) : '—';
  document.getElementById('lssTaxSub').textContent      = taxSaving > 0
    ? `30% slab · ₹${(sec24b/1000).toFixed(0)}k Sec 24B + ₹${(sec80c/1000).toFixed(0)}k Sec 80C (yr 1)`
    : 'No deductible surplus in year 1';

  // store for chatbot context
  lastCalcResult = {
    home_price: inputs.home_price,
    down_pct: inputs.down_payment_pct,
    loan_amount: s.loan_amount,
    monthly_emi: s.monthly_emi,
    interest_rate: inputs.interest_rate,
    tenure_years: inputs.tenure_years,
    annual_appreciation: inputs.annual_appreciation,
    rental_yield: inputs.rental_yield,
    stock_return: inputs.stock_return,
    total_interest: totalInterestPaid,
    tax_saving: taxSaving,
    cagr_dcf: s.cagr_dcf_pct,
    break_even_year: s.break_even_year,
    home_wealth_final: finalHomeVal,
    buying_wins: s.buying_wins,
    rent_vs_buy: s.rent_vs_buy,
  };

  // ── DCF ──
  // Row 1 — cash basis
  set('kpiPvOut', fmt(s.cash_out_of_pocket), '', 'Down payment + net outflows where EMI+maint exceeded rent (nominal cash, not discounted)');
  set('kpiWealth', fmt(s.wealth_return), s.wealth_return >= s.cash_out_of_pocket ? 'up' : 'down', 'Final equity + positive net cashflows when rent exceeded EMI+maint');
  const gain = s.wealth_return - s.cash_out_of_pocket;
  const roiPct = s.cash_out_of_pocket > 0 ? (gain / s.cash_out_of_pocket * 100) : 0;
  set('kpiGain', fmt(gain), gain >= 0 ? 'up' : 'down', (roiPct >= 0 ? '+' : '') + roiPct.toFixed(1) + '% return on cash out of pocket');
  // Row 2 — DCF basis
  set('kpiDown0', fmt(s.down_payment), '', 'Paid on day of purchase — already at present value, no discounting needed');
  set('kpiPvOutflows', fmt(s.pv_outflows_only || 0), '', 'Monthly (EMI+maint−rent) where >0, discounted to Year 0 at ' + inputs.stock_return + '% benchmark');
  set('kpiCagrDcf', fmtPct(s.cagr_dcf_real_pct ?? s.cagr_dcf_pct), (s.cagr_dcf_real_pct ?? s.cagr_dcf_pct) >= 0 ? 'up' : 'down', 'Wealth ÷ (down + PV outflows), annualised — compare to MF / FD rates (' + inputs.stock_return + '% benchmark)');

  // ── Home investing vs Stock investing ──
  const homeWealthFinal = s.wealth_return;
  set('kpiHomeNetGain', fmt(homeWealthFinal), homeWealthFinal >= s.stock_net_gain ? 'up' : 'down',
    'Final equity ' + fmt(s.final_home_value) + ' + rent surplus after crossover');
  set('kpiStockNetGain', fmt(s.stock_net_gain), s.stock_net_gain > homeWealthFinal ? 'up' : 'down',
    `Down payment (day 1) + monthly outflow compounded at ${inputs.benchmark_return}%/yr`);

  drawInvestmentWealthChart(data.amortisation, s.down_payment);
  drawCostChart(data.amortisation);
  drawPieCharts(data);
  drawCashflowChart(data.amortisation);
  buildAmortTable(data.amortisation, s.break_even_year);
  buildHomeVsStockTable(data.amortisation, s);
  if (sensData) {
    lastSensData = sensData;
    lastSensInputs = inputs;
    initEmiFilters(sensData);
    drawHeatmap('sensChartCagr', 'sensLegendCagr', sensData, 'cagr_dcf', 1, '%', inputs, null, null);
  }
  drawBenchmarks(s, inputs);
  buildInsights(data, inputs);

  const _resultsEl = document.getElementById('results');
  const _navH = (document.querySelector('nav')?.offsetHeight || 58) + 8;
  window.scrollTo({ top: _resultsEl.getBoundingClientRect().top + window.scrollY - _navH, behavior: 'smooth' });
}

/* ── Smart insights ── */
function buildInsights(data, inputs) {
  const s = data.summary;
  const n = inputs.tenure_years;
  const totalInterest = data.amortisation.reduce((sum, d) => sum + d.interest, 0);
  const prRatio    = inputs.home_price / (inputs.monthly_rent * 12);
  const rentYield  = inputs.monthly_rent * 12 / inputs.home_price * 100;
  const emiToRent  = s.monthly_emi / inputs.monthly_rent;
  const monthlyPremium = s.monthly_emi - inputs.monthly_rent;
  const leverage   = inputs.home_price / s.down_payment;
  const downOpCost = s.down_payment * Math.pow(1 + inputs.stock_return / 100, n);
  const minAppreciation = Math.max(0, inputs.interest_rate - rentYield).toFixed(1);

  // 1. Price-to-Rent ratio
  let prTag, prMsg;
  if (prRatio < 15) {
    prTag = ['good', 'Buying strongly favored'];
    prMsg = `P/R ratio of <strong>${prRatio.toFixed(1)}</strong> — historically, ratios below 15 make buying the clear financial winner over renting.`;
  } else if (prRatio < 20) {
    prTag = ['warn', 'Marginally favors buying'];
    prMsg = `P/R ratio of <strong>${prRatio.toFixed(1)}</strong> — borderline. Returns depend heavily on whether property appreciates as expected.`;
  } else if (prRatio < 25) {
    prTag = ['warn', 'Neutral zone'];
    prMsg = `P/R ratio of <strong>${prRatio.toFixed(1)}</strong> — elevated. Renting and investing the difference could match or beat buying if markets do well.`;
  } else {
    prTag = ['bad', 'Renting may outperform'];
    prMsg = `P/R ratio of <strong>${prRatio.toFixed(1)}</strong> — high. Ratios above 25 historically favour renting and investing over buying.`;
  }

  // 2. Interest burden
  const intPct = (totalInterest / s.loan_amount * 100).toFixed(0);
  const intTag = totalInterest / s.loan_amount > 0.8 ? ['warn', 'Heavy interest cost'] : ['info', 'Moderate interest cost'];
  const intMsg = `You'll pay <strong>${fmt(totalInterest)}</strong> in interest over ${n} years — <strong>${intPct}%</strong> on top of your <strong>${fmt(s.loan_amount)}</strong> principal. The bank earns nearly as much as you borrow.`;

  // 3. EMI vs Rent (monthly premium)
  let emiTag, emiMsg;
  if (monthlyPremium <= 0) {
    emiTag = ['good', 'EMI cheaper than rent'];
    emiMsg = `Your EMI <strong>(${fmt(s.monthly_emi)})</strong> is <strong>lower</strong> than rent <strong>(${fmt(inputs.monthly_rent)})</strong> — the high down payment means owning costs you less monthly than renting.`;
  } else if (emiToRent <= 1.3) {
    emiTag = ['good', 'Affordable ownership premium'];
    emiMsg = `Your EMI <strong>(${fmt(s.monthly_emi)})</strong> is <strong>${emiToRent.toFixed(1)}×</strong> your rent. The <strong>${fmt(monthlyPremium)}/mo</strong> extra buys you equity and appreciation.`;
  } else if (emiToRent <= 2) {
    emiTag = ['warn', 'Moderate ownership premium'];
    emiMsg = `Your EMI <strong>(${fmt(s.monthly_emi)})</strong> is <strong>${emiToRent.toFixed(1)}×</strong> rent. You pay <strong>${fmt(monthlyPremium)}/mo</strong> extra to own — appreciation must justify this gap.`;
  } else {
    emiTag = ['bad', 'High ownership premium'];
    emiMsg = `Your EMI <strong>(${fmt(s.monthly_emi)})</strong> is <strong>${emiToRent.toFixed(1)}×</strong> rent. The <strong>${fmt(monthlyPremium)}/mo</strong> premium is steep — rent yield of ${rentYield.toFixed(1)}% vs loan rate of ${inputs.interest_rate}% creates a structural gap.`;
  }

  // 4. Rent yield vs loan rate
  const yieldGap = (inputs.interest_rate - rentYield).toFixed(1);
  let yieldTag, yieldMsg;
  if (rentYield >= inputs.interest_rate) {
    yieldTag = ['good', 'Yield covers loan rate'];
    yieldMsg = `Gross rent yield of <strong>${rentYield.toFixed(1)}%</strong> exceeds the loan rate of <strong>${inputs.interest_rate}%</strong>. Even zero appreciation would generate positive cash flow — a rare and favourable scenario.`;
  } else {
    yieldTag = ['warn', `Need ${minAppreciation}%+ appreciation`];
    yieldMsg = `Gross rent yield of <strong>${rentYield.toFixed(1)}%</strong> is below the loan rate of <strong>${inputs.interest_rate}%</strong> — a gap of <strong>${yieldGap}%</strong>. You need property to appreciate at least <strong>${minAppreciation}%/yr</strong> to cover the shortfall vs renting.`;
  }

  // 5. Home investing vs Stock investing (S&P 500)
  const snpFinal   = s.stock_net_gain;
  const homeWealth = s.wealth_return;
  const snpEdge    = homeWealth - snpFinal;
  let snpTag, snpMsg;
  const verdictFund = getSelectedFund();
  if (snpEdge >= 0) {
    snpTag = ['good', `Home beats ${verdictFund.label}`];
    snpMsg = `Investing the monthly outflow into ${verdictFund.label} at ${verdictFund.cagr}% would grow to <strong>${fmt(snpFinal)}</strong>. Home wealth (equity + rent surplus) of <strong>${fmt(homeWealth)}</strong> leads by <strong>${fmt(snpEdge)}</strong> — buying wins.`;
  } else {
    snpTag = ['bad', `${verdictFund.label} renter wins`];
    snpMsg = `Investing the monthly outflow into ${verdictFund.label} at ${verdictFund.cagr}% would grow to <strong>${fmt(snpFinal)}</strong> — <strong>${fmt(Math.abs(snpEdge))} more</strong> than home wealth (equity + rent surplus) of <strong>${fmt(homeWealth)}</strong>. The market outpaces property here.`;
  }

  const cards = [
    { icon: '📊', title: 'Price-to-Rent Ratio',       body: prMsg,    tag: prTag   },
    { icon: '💸', title: 'Interest burden',            body: intMsg,   tag: intTag  },
    { icon: '🏷️', title: 'EMI vs Monthly rent',       body: emiMsg,   tag: emiTag  },
    { icon: '📉', title: 'Rent yield vs loan rate',    body: yieldMsg, tag: yieldTag },
    { icon: '📈', title: 'Home vs S&P 500 renter',     body: snpMsg,   tag: snpTag  },
  ];

  document.getElementById('insightGrid').innerHTML = cards.map(c => `
    <div class="insight-card">
      <div class="insight-icon">${c.icon}</div>
      <div class="insight-title">${c.title}</div>
      <div class="insight-body">${c.body}</div>
      <span class="insight-tag ${c.tag[0]}">${c.tag[1]}</span>
    </div>
  `).join('');
}

function set(id, val, cls, sub) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = val;
  el.className = 'kpi-value' + (cls ? ' ' + cls : '');
  if (sub) {
    const subEl = document.getElementById(id + 'Sub');
    if (subEl) subEl.textContent = sub;
  }
}

/* ── Gradient fill plugin (runs before each draw, no update loop) ── */
const GRADIENT_PLUGIN = {
  id: 'gradients',
  beforeDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    chart.data.datasets.forEach((ds, i) => {
      if (!ds._gt) return;
      const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      g.addColorStop(0, ds._gt);
      g.addColorStop(1, ds._gb || 'rgba(0,0,0,0)');
      chart.data.datasets[i].backgroundColor = g;
    });
  },
};

/* ── Investment vs Wealth — two side-by-side subplots ── */
function drawInvestmentWealthChart(yearData, downPayment) {
  if (investWealthChartObj) { investWealthChartObj.destroy(); investWealthChartObj = null; }
  if (iwOutflowChartObj) { iwOutflowChartObj.destroy(); iwOutflowChartObj = null; }

  const fmtCr = v => {
    const a = Math.abs(v);
    if (a >= 1e7) return '₹' + (a / 1e7).toFixed(1).replace(/\.0$/, '') + ' Cr';
    if (a >= 1e5) return '₹' + Math.round(a / 1e5) + ' L';
    return '₹' + Math.round(a).toLocaleString('en-IN');
  };

  /* ── LEFT chart: cumulative money committed ── */
  const leftLabels = ['Yr 0', ...yearData.map(d => 'Yr ' + d.year)];
  const annualOutflow = [downPayment, ...yearData.map(d => Math.max(0, -d.annual_net_cf))];

  // Build cumulative and previous-cumulative for stacked bars
  const cumulativeCommitted = [];
  let runningCommitted = 0;
  for (const v of annualOutflow) { runningCommitted += v; cumulativeCommitted.push(runningCommitted); }
  const prevCommitted = [0, ...cumulativeCommitted.slice(0, -1)];

  // First index in leftLabels where outflows stop (rent ≥ EMI+maint)
  let cfFlipIdx = -1;
  for (let i = 0; i < yearData.length; i++) {
    if (yearData[i].annual_net_cf >= 0) { cfFlipIdx = i + 1; break; }
  }

  const outflowPlugin = {
    id: 'outflowPlugin',
    afterDraw(chart) {
      const { ctx, chartArea: ca, scales: { x } } = chart;
      ctx.save();
      // Label the Yr 0 bar as "Down payment"
      const x0 = x.getPixelForValue(0);
      ctx.font = '600 9px "Inter",sans-serif';
      ctx.fillStyle = 'rgba(159,18,57,0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Down pmt', x0, ca.top + 11);
      // Dashed line + label at the year rent covers costs
      if (cfFlipIdx > 0 && cfFlipIdx < leftLabels.length) {
        const xp = x.getPixelForValue(cfFlipIdx);
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(16,185,129,0.65)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(xp, ca.top); ctx.lineTo(xp, ca.bottom);
        ctx.stroke(); ctx.setLineDash([]);
        ctx.font = '600 9px "Inter",sans-serif';
        ctx.fillStyle = 'rgba(5,150,105,0.9)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('Rent ≥ EMI', xp + 4, ca.top + 4);
      }
      ctx.restore();
    },
  };

  const leftCanvas = document.getElementById('iwOutflowChart');
  if (leftCanvas) {
    iwOutflowChartObj = new Chart(leftCanvas, {
      type: 'bar',
      plugins: [outflowPlugin],
      data: {
        labels: leftLabels,
        datasets: [
          {
            label: 'Prior years (cumul.)',
            data: prevCommitted,
            backgroundColor: 'rgba(244,63,94,0.22)',
            borderRadius: 0,
            borderSkipped: 'bottom',
            stack: 'committed',
          },
          {
            label: "This year's addition",
            data: annualOutflow,
            backgroundColor: leftLabels.map((_, i) => i === 0 ? 'rgba(159,18,57,0.92)' : 'rgba(225,29,72,0.88)'),
            borderRadius: { topLeft: 4, topRight: 4 },
            borderSkipped: 'bottom',
            stack: 'committed',
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 8, right: 6, bottom: 4 } },
        plugins: {
          legend: {
            display: true, position: 'top', align: 'end',
            labels: {
              font: { size: 11, family: "'Inter',sans-serif" },
              padding: 14, boxWidth: 12, boxHeight: 12,
              borderRadius: 3, useBorderRadius: true,
              color: '#374151',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#f1f5f9', bodyColor: '#94a3b8',
            padding: 12, cornerRadius: 10, boxPadding: 5,
            filter: item => item.dataset.label !== 'Prior years (cumul.)',
            callbacks: {
              title: items => leftLabels[items[0].dataIndex],
              label(c) {
                const idx = c.dataIndex;
                const yearly = annualOutflow[idx];
                const total = cumulativeCommitted[idx];
                if (idx === 0) return ['  Down payment:  ' + fmtCr(downPayment), '  Cumulative:  ' + fmtCr(total)];
                if (yearly <= 500) return '  Rent ≥ EMI — no outflow  |  Total: ' + fmtCr(total);
                return ['  This year:  ' + fmtCr(yearly), '  Cumulative:  ' + fmtCr(total)];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#64748b', font: { size: 11, family: "'Inter',sans-serif" }, maxTicksLimit: 12 },
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.07)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#64748b', font: { size: 11, family: "'Inter',sans-serif" }, maxTicksLimit: 6, padding: 6,
              callback: v => fmtCr(v),
            },
          },
        },
      },
    });
  }

  /* ── RIGHT chart: equity + cumulative rent surplus ── */
  const rightLabels = yearData.map(d => 'Yr ' + d.year);
  const equityData = yearData.map(d => d.net_equity);
  let cumSurplus = 0;
  const surplusData = yearData.map(d => {
    cumSurplus += Math.max(0, d.annual_net_cf);
    return cumSurplus;
  });

  const rightCanvas = document.getElementById('iwWealthChart');
  if (rightCanvas) {
    investWealthChartObj = new Chart(rightCanvas, {
      type: 'bar',
      data: {
        labels: rightLabels,
        datasets: [
          {
            label: 'Home equity',
            data: equityData,
            backgroundColor: 'rgba(79,70,229,0.85)',
            borderRadius: { bottomLeft: 4, bottomRight: 4, topLeft: 0, topRight: 0 },
            borderSkipped: false,
            stack: 'wealth',
          },
          {
            label: 'Rent surplus (cumul.)',
            data: surplusData,
            backgroundColor: 'rgba(13,148,136,0.85)',
            borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
            borderSkipped: false,
            stack: 'wealth',
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 8, right: 6, bottom: 4 } },
        plugins: {
          legend: {
            display: true, position: 'top', align: 'end',
            labels: {
              font: { size: 11, family: "'Inter',sans-serif" },
              padding: 14, boxWidth: 12, boxHeight: 12,
              borderRadius: 3, useBorderRadius: true,
              color: '#374151',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#f1f5f9', bodyColor: '#94a3b8',
            padding: 12, cornerRadius: 10, boxPadding: 5,
            callbacks: {
              title: items => rightLabels[items[0].dataIndex],
              label(c) {
                const idx = c.dataIndex;
                if (c.datasetIndex === 0) return '  Equity:          ' + fmtCr(equityData[idx]);
                const s = surplusData[idx];
                return s > 500 ? '  Rent surplus:  +' + fmtCr(s) : null;
              },
              afterBody(items) {
                const idx = items[0].dataIndex;
                const eq = equityData[idx];
                const sur = surplusData[idx];
                const total = eq + sur;
                const eqPct = total > 0 ? Math.round(eq / total * 100) : 0;
                return ['', `  Equity ${eqPct}%  ·  Surplus ${100 - eqPct}%`, '  Total wealth:  ' + fmtCr(total)];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#64748b', font: { size: 11, family: "'Inter',sans-serif" }, maxTicksLimit: 12 },
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.07)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#64748b', font: { size: 11, family: "'Inter',sans-serif" }, maxTicksLimit: 6, padding: 6,
              callback: v => fmtCr(v),
            },
          },
        },
      },
    });
  }
}

/* ── Charts ── */
function drawCostChart(yearData) {
  if (costChart) costChart.destroy();
  costChart = new Chart(document.getElementById('costChart'), {
    type: 'bar',
    data: {
      labels: yearData.map(d => 'Yr ' + d.year),
      datasets: [
        { label: 'Principal',   data: yearData.map(d => d.principal),   backgroundColor: 'rgba(85,128,168,0.82)',  borderColor: '#5580A8', borderWidth: 0, borderRadius: 4, borderSkipped: false, stack: 'a' },
        { label: 'Interest',    data: yearData.map(d => d.interest),    backgroundColor: 'rgba(181,92,98,0.82)',   borderColor: '#B55C62', borderWidth: 0, borderRadius: 4, borderSkipped: false, stack: 'a' },
        { label: 'Maintenance', data: yearData.map(d => d.maintenance), backgroundColor: 'rgba(181,136,60,0.82)', borderColor: '#B5883C', borderWidth: 0, borderRadius: 4, borderSkipped: false, stack: 'a' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 18, boxWidth: 12, boxHeight: 12, borderRadius: 3, useBorderRadius: true, color: '#4a4e5a' } },
        tooltip: {
          backgroundColor: 'rgba(20,27,40,0.92)', titleColor: '#e2e8f0', bodyColor: '#94a3b8',
          padding: 12, cornerRadius: 10, boxPadding: 5,
          callbacks: { label: c => '  ' + c.dataset.label + '  ' + fmt(c.parsed.y) },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: '#9ba3ae', font: { size: 10 }, maxTicksLimit: 12 } },
        y: { stacked: true, grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#9ba3ae', font: { size: 11 }, callback: v => fmt(v) } },
      },
    },
  });
}

/* ── Amortisation table ── */
function buildAmortTable(yearData, breakEvenYear) {
  const rows = yearData.map(d => `
    <tr class="${d.year === breakEvenYear ? 'be-row' : ''}">
      <td>Year ${d.year}</td>
      <td>${fmt(d.emi_paid)}</td>
      <td class="td-pos">${fmt(d.principal)}</td>
      <td class="td-neg">${fmt(d.interest)}</td>
      <td>${fmt(d.loan_balance)}</td>
      <td>${fmt(d.home_value)}</td>
      <td class="${d.net_equity >= 0 ? 'td-pos' : 'td-neg'}">${fmt(d.net_equity)}</td>
      <td class="td-neg">${fmt(d.maintenance)}</td>
    </tr>
  `).join('');

  const last = yearData[yearData.length - 1];
  const totals = {
    emi:   yearData.reduce((s, d) => s + d.emi_paid,    0),
    prin:  yearData.reduce((s, d) => s + d.principal,   0),
    int:   yearData.reduce((s, d) => s + d.interest,    0),
    maint: yearData.reduce((s, d) => s + d.maintenance, 0),
  };
  const totalsRow = `
    <tr class="totals-row">
      <td>Totals</td>
      <td>${fmt(totals.emi)}</td>
      <td>${fmt(totals.prin)}</td>
      <td>${fmt(totals.int)}</td>
      <td>${fmt(last.loan_balance)}</td>
      <td>${fmt(last.home_value)}</td>
      <td>${fmt(last.net_equity)}</td>
      <td>${fmt(totals.maint)}</td>
    </tr>`;

  document.getElementById('amortBody').innerHTML = rows + totalsRow;
}

/* ── Monthly amortisation data for PDF ── */
function generateMonthlyAmort() {
  const inp = getInputs();
  const price   = inp.home_price;
  const downPct = inp.down_payment_pct;
  const P       = price * (1 - downPct / 100);
  const r       = inp.interest_rate;
  const n       = inp.tenure_years;
  const maintPct = inp.maintenance_pct;
  const appreciation = inp.annual_appreciation;

  const monthlyRate = r / 100 / 12;
  const totalMonths = n * 12;
  const emi = monthlyRate > 0
    ? P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : P / totalMonths;

  const rows = [];
  let balance = P;
  let homeVal = price;

  for (let mo = 1; mo <= totalMonths; mo++) {
    const yr = Math.ceil(mo / 12);
    if (mo > 1 && (mo - 1) % 12 === 0) {
      homeVal *= (1 + appreciation / 100);
    }
    const maint    = homeVal * maintPct / 100 / 12;
    const intPart  = balance * monthlyRate;
    const prinPart = Math.min(emi - intPart, balance);
    balance = Math.max(0, balance - prinPart);
    rows.push({ mo, yr, emi, principal: prinPart, interest: intPart, balance, homeVal, maint });
  }
  return rows;
}

function downloadAmortPDF() {
  const rows = generateMonthlyAmort();
  if (!rows.length) { alert('Please calculate first.'); return; }

  const fmtR = v => '₹' + Math.round(v).toLocaleString('en-IN');

  const tableRows = rows.map(r => `
    <tr>
      <td>${r.yr}</td><td>${r.mo}</td>
      <td>${fmtR(r.emi)}</td>
      <td>${fmtR(r.principal)}</td>
      <td>${fmtR(r.interest)}</td>
      <td>${fmtR(r.balance)}</td>
      <td>${fmtR(r.homeVal)}</td>
      <td>${fmtR(r.homeVal - r.balance)}</td>
      <td>${fmtR(r.maint)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Monthly Amortisation Schedule</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; margin: 16px; color: #1a1a2e; }
  h2 { font-size: 15px; margin-bottom: 4px; }
  p.sub { color: #555; margin: 0 0 12px; font-size: 10px; }
  table { border-collapse: collapse; width: 100%; }
  th { background: #1a237e; color: #fff; padding: 5px 7px; text-align: right; font-size: 10px; }
  th:first-child, th:nth-child(2) { text-align: center; }
  td { padding: 4px 7px; text-align: right; border-bottom: 1px solid #e8eaf6; }
  td:first-child, td:nth-child(2) { text-align: center; }
  tr:nth-child(even) { background: #f5f5ff; }
  tr:last-child td { border-bottom: none; }
  @media print { body { margin: 0; } }
</style></head><body>
<h2>Monthly Amortisation Schedule</h2>
<p class="sub">Generated on ${new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
<table>
<thead><tr>
  <th>Year</th><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th>
  <th>Loan Balance</th><th>Home Value</th><th>Net Equity</th><th>Maintenance</th>
</tr></thead>
<tbody>${tableRows}</tbody>
</table>
</body></html>`;

  const w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

/* ── Home investing vs Stock investing table ── */
function buildHomeVsStockTable(yearData, summary) {
  const tbody = document.getElementById('homeVsStockBody');
  const note  = document.getElementById('homeVsStockNote');

  const fund = getSelectedFund();
  const crossNote = summary.cf_positive_year
    ? `Rent first exceeds EMI + maintenance in <strong>Year ${summary.cf_positive_year}</strong> — outflow investing stops there, but the ${fund.label} portfolio keeps compounding for the rest of the tenure.`
    : `Rent never exceeds EMI + maintenance in this tenure — the outflow is invested into ${fund.label} every year.`;
  note.innerHTML = `Down payment is invested on day 1. Each month, <strong>EMI + maintenance − rent</strong> is the outflow — invested into ${fund.label} at ${fund.cagr}%/yr. ${crossNote} Home wealth = final equity + net cash flow (total rent saved − total EMI − total maintenance).`;

  let rows = '';

  yearData.forEach(d => {
    const emiPlusMaint = d.emi_paid + d.maintenance;
    const outflow      = emiPlusMaint - d.rent_saved_year;
    const invested     = d.outflow_invested_year || 0;
    const isCross = d.year === summary.cf_positive_year;

    rows += `
      <tr class="${isCross ? 'sip-crossover' : ''}">
        <td>Year ${d.year}${isCross ? ' <span class="sip-cross-badge">crossover</span>' : ''}</td>
        <td class="td-neg">${fmt(emiPlusMaint)}</td>
        <td class="td-pos">${fmt(d.rent_saved_year)}</td>
        <td class="${outflow >= 0 ? 'td-neg' : 'td-pos'}">${outflow >= 0 ? '+' : ''}${fmt(outflow)}</td>
        <td class="${invested > 0 ? 'td-sip' : 'td-faint'}">${invested > 0 ? fmt(invested) : '—'}</td>
        <td class="td-sip">${fmt(d.snp_portfolio_value || 0)}</td>
        <td class="td-pos">${fmt(d.net_equity)}</td>
      </tr>`;
  });

  const last = yearData[yearData.length - 1];
  rows += `
    <tr class="totals-row">
      <td>Total / Final</td>
      <td class="td-neg">${fmt(yearData.reduce((s, d) => s + d.emi_paid + d.maintenance, 0))}</td>
      <td class="td-pos">${fmt(yearData.reduce((s, d) => s + d.rent_saved_year, 0))}</td>
      <td>—</td>
      <td>—</td>
      <td class="td-sip">${fmt(last.snp_portfolio_value || 0)}</td>
      <td class="td-pos">${fmt(last.net_equity)}</td>
    </tr>`;

  tbody.innerHTML = rows;
}

/* ── Generic heatmap (tenure × down payment) ── */
function drawHeatmap(canvasId, legendId, sensData, valueKey, decimals, suffix, inputs, emiMin, emiMax) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const { rows, down_payments } = sensData;
  const tenures = rows.map(r => r.tenure);
  const nT = tenures.length;
  const nD = down_payments.length;

  const ML = 62, MT = 16, MB = 54, MR = 18;
  const CELL_W = 72, CELL_H = 46;
  const W = ML + nT * CELL_W + MR;
  const H = MT + nD * CELL_H + MB;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const allVals = rows.flatMap(r => r.cells.map(c => c[valueKey]));
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);

  function cellColor(v) {
    const t = maxV === minV ? 0.5 : (v - minV) / (maxV - minV);
    // Muted rose (#B55C62) → steel blue (#5580A8) → sage (#4D8E72)
    const r = t < 0.5 ? Math.round(181 + (85  - 181) * (t * 2))       : Math.round(85  + (77  - 85)  * ((t - 0.5) * 2));
    const g = t < 0.5 ? Math.round(92  + (128 - 92)  * (t * 2))       : Math.round(128 + (142 - 128) * ((t - 0.5) * 2));
    const b = t < 0.5 ? Math.round(98  + (168 - 98)  * (t * 2))       : Math.round(168 + (114 - 168) * ((t - 0.5) * 2));
    return `rgb(${r},${g},${b})`;
  }

  // Draw cells — 5% at bottom, 50% at top (flip screen row)
  rows.forEach(row => {
    const tIdx = tenures.indexOf(row.tenure);
    row.cells.forEach(cell => {
      const dIdx = down_payments.indexOf(cell.down_pct);
      const screenRow = nD - 1 - dIdx;
      const x = ML + tIdx * CELL_W;
      const y = MT + screenRow * CELL_H;
      const v = cell[valueKey];

      const emiInRange = (emiMin == null && emiMax == null) ||
        (cell.monthly_emi != null && (emiMin == null || cell.monthly_emi >= emiMin) && (emiMax == null || cell.monthly_emi <= emiMax));
      const alpha = emiInRange ? 1 : 0.18;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = cellColor(v);
      ctx.fillRect(x + 1, y + 1, CELL_W - 2, CELL_H - 2);

      if (cell.is_current) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x + 2.5, y + 2.5, CELL_W - 5, CELL_H - 5);
        ctx.lineWidth = 1;
      }

      ctx.fillStyle = '#fff';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.toFixed(decimals) + suffix, x + CELL_W / 2, y + CELL_H / 2);
      ctx.globalAlpha = 1;
    });
  });

  // X-axis tick labels
  ctx.fillStyle = '#4b5563';
  ctx.font = '12px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  tenures.forEach((t, i) => {
    ctx.fillText(t + ' yr', ML + i * CELL_W + CELL_W / 2, MT + nD * CELL_H + 8);
  });

  // X-axis title
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#1f2937';
  ctx.textBaseline = 'bottom';
  ctx.fillText('← Tenure (years) →', W / 2, H - 4);

  // Y-axis tick labels (50% at top, 5% at bottom)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.font = '12px "Inter", sans-serif';
  ctx.fillStyle = '#4b5563';
  down_payments.slice().reverse().forEach((d, screenRow) => {
    ctx.fillText(d + '%', ML - 9, MT + screenRow * CELL_H + CELL_H / 2);
  });

  // Y-axis title (rotated)
  ctx.save();
  ctx.translate(12, MT + (nD * CELL_H) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#1f2937';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('↑ Down payment %', 0, 0);
  ctx.restore();

  // Colour legend
  const legend = document.getElementById(legendId);
  if (legend) {
    legend.innerHTML = `
      <span style="font-size:11px;color:#6b7280">Low (${minV.toFixed(decimals)}${suffix})</span>
      <div class="sens-legend-bar"></div>
      <span style="font-size:11px;color:#6b7280">High (${maxV.toFixed(decimals)}${suffix})</span>
    `;
  }

  // ── Hover tooltip showing EMI ──
  canvas.style.cursor = 'crosshair';
  const tt = document.getElementById('heatmapTooltip');
  if (!tt) return;
  const metricLabel = valueKey === 'cagr_dcf' ? 'CAGR (DCF)' : 'ROI';

  function showTt(show) { tt.style.display = show ? 'block' : 'none'; }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tIdx = Math.floor((mouseX - ML) / CELL_W);
    const screenRow = Math.floor((mouseY - MT) / CELL_H);

    if (tIdx >= 0 && tIdx < nT && screenRow >= 0 && screenRow < nD) {
      const row = rows[tIdx];
      const dIdx = nD - 1 - screenRow;
      const cell = row && row.cells[dIdx];
      if (!cell) { showTt(false); return; }

      let emiVal = cell.monthly_emi;
      if (emiVal == null && inputs) {
        const loan = inputs.home_price * (1 - cell.down_pct / 100);
        const rM = inputs.interest_rate / 12 / 100;
        const n  = row.tenure * 12;
        emiVal = rM > 0
          ? Math.round(loan * rM * Math.pow(1 + rM, n) / (Math.pow(1 + rM, n) - 1))
          : Math.round(loan / n);
      }
      const emi = (emiVal != null) ? fmt(emiVal) : '—';
      const val = cell[valueKey].toFixed(decimals) + suffix;

      tt.innerHTML = `
        <div class="hm-tt-emi">${emi}</div>
        <div class="hm-tt-emlabel">Monthly EMI</div>
        <div class="hm-tt-divider"></div>
        <div class="hm-tt-row"><span class="hm-k">${metricLabel}</span><span class="hm-v">${val}</span></div>
        <div class="hm-tt-row"><span class="hm-k">Tenure</span><span class="hm-v">${row.tenure} yrs</span></div>
        <div class="hm-tt-row"><span class="hm-k">Down pmt</span><span class="hm-v">${cell.down_pct}%</span></div>
      `;

      let tx = e.clientX + 18, ty = e.clientY - 14;
      if (tx + 195 > window.innerWidth)  tx = e.clientX - 205;
      if (ty + 160 > window.innerHeight) ty = e.clientY - 160;
      tt.style.left = tx + 'px';
      tt.style.top  = ty + 'px';
      showTt(true);
    } else {
      showTt(false);
    }
  }

  function onMouseLeave() { showTt(false); }

  canvas.removeEventListener('mousemove', canvas._hmMove);
  canvas.removeEventListener('mouseleave', canvas._hmLeave);
  canvas._hmMove = onMouseMove;
  canvas._hmLeave = onMouseLeave;
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);
}

/* ── Pie charts: outflow breakdown & returns breakdown ── */
function drawPieCharts(data) {
  const s = data.summary;
  const yd = data.amortisation;

  const totalInterest  = Math.round(yd.reduce((a, d) => a + d.interest,    0));
  const totalPrincipal = Math.round(yd.reduce((a, d) => a + d.principal,   0));
  const totalMaint     = Math.round(yd.reduce((a, d) => a + d.maintenance, 0));

  // Center-text plugin (inline local plugin, no global registration needed)
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart, _args, opts) {
      if (!opts || !opts.lines) return;
      const { ctx, chartArea: { left, right, top, bottom } } = chart;
      const cx = (left + right) / 2, cy = (top + bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      opts.lines.forEach((line, i) => {
        ctx.fillStyle = line.color || '#0f172a';
        ctx.font = `${line.weight || '600'} ${line.size || 13}px Inter, sans-serif`;
        const offset = (i - (opts.lines.length - 1) / 2) * (line.gap || 18);
        ctx.fillText(line.text, cx, cy + offset);
      });
      ctx.restore();
    },
  };

  function makeDoughnut(canvasId, items, total, centerLines) {
    return new Chart(document.getElementById(canvasId), {
      type: 'doughnut',
      plugins: [centerTextPlugin],
      data: {
        labels: items.map(d => d.label),
        datasets: [{
          data: items.map(d => d.value),
          backgroundColor: items.map(d => d.color),
          borderColor: '#ffffff',
          borderWidth: 2.5,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3,
          hoverOffset: 12,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '67%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: c => '  ' + c.label + ': ' + fmt(c.parsed) + '  (' + (c.parsed / total * 100).toFixed(1) + '%)',
            },
          },
          centerText: { lines: centerLines },
        },
        animation: { animateRotate: true, duration: 700, easing: 'easeInOutQuart' },
      },
    });
  }

  // ── Outflow pie ──
  const outItems = [
    { label: 'Down payment',    value: s.down_payment,  color: '#5580A8' },
    { label: 'Interest paid',   value: totalInterest,   color: '#B55C62' },
    { label: 'Principal repaid', value: totalPrincipal, color: '#4D8E72' },
    { label: 'Maintenance',     value: totalMaint,      color: '#B5883C' },
  ];
  const totalOut = outItems.reduce((a, d) => a + d.value, 0);
  document.getElementById('outflowPieSub').textContent = 'Total paid: ' + fmt(totalOut);
  if (outflowPieChart) outflowPieChart.destroy();
  outflowPieChart = makeDoughnut('outflowPie', outItems, totalOut, [
    { text: fmt(totalOut), size: 13, weight: '700', color: '#0f172a', gap: 18 },
    { text: 'total paid',  size: 10, weight: '400', color: '#94a3b8', gap: 18 },
  ]);
  document.getElementById('outflowLegend').innerHTML = outItems.map(d => `
    <div class="pie-leg-item">
      <span class="pie-dot" style="background:${d.color}"></span>
      <div class="pie-leg-info">
        <div class="pie-leg-label">${d.label}</div>
        <div class="pie-leg-stats">${(d.value / totalOut * 100).toFixed(1)}% &middot; ${fmt(d.value)}</div>
      </div>
    </div>`).join('');

  // ── Returns pie ──
  let surplusGain = (s.surplus_growth != null) ? s.surplus_growth : Math.max(0, (s.surplus_snp_final || 0) - (s.surplus_invested || 0));
  if (surplusGain === 0 && yd.some(d => d.annual_net_cf > 0)) {
    const SNP_R      = 10.5 / 12 / 100;
    const SNP_ANNUAL = Math.pow(1 + SNP_R, 12);
    let clientSip = 0, clientInvested = 0;
    yd.forEach(d => {
      const surplus = Math.max(0, d.annual_net_cf);
      clientInvested += surplus;
      clientSip = clientSip * SNP_ANNUAL + surplus / 12 * (SNP_ANNUAL - 1) / SNP_R;
    });
    surplusGain = Math.max(0, Math.round(clientSip - clientInvested));
  }
  const retItems = [
    { label: 'Home equity',   value: s.final_home_value,      color: '#5580A8' },
    { label: 'Rental income', value: s.cumulative_rent_saved, color: '#4D8E72' },
  ];
  if (surplusGain > 0) retItems.push({ label: 'S&P SIP gain', value: surplusGain, color: '#7970A2' });
  const totalReturns = retItems.reduce((a, d) => a + d.value, 0);
  document.getElementById('returnsPieSub').textContent = 'Total returns: ' + fmt(totalReturns);
  if (returnsPieChart) returnsPieChart.destroy();
  returnsPieChart = makeDoughnut('returnsPie', retItems, totalReturns, [
    { text: fmt(totalReturns),  size: 13, weight: '700', color: '#0f172a', gap: 18 },
    { text: 'total returns',    size: 10, weight: '400', color: '#94a3b8', gap: 18 },
  ]);
  document.getElementById('returnsLegend').innerHTML = retItems.map(d => `
    <div class="pie-leg-item">
      <span class="pie-dot" style="background:${d.color}"></span>
      <div class="pie-leg-info">
        <div class="pie-leg-label">${d.label}</div>
        <div class="pie-leg-stats">${(d.value / totalReturns * 100).toFixed(1)}% &middot; ${fmt(d.value)}</div>
      </div>
    </div>`).join('');
}


function drawCashflowChart(yearData) {
  // Compute SIP portfolio client-side (post-crossover surplus reinvested monthly)
  const SNP_R = 10.5 / 12 / 100;
  const SNP_ANNUAL = Math.pow(1 + SNP_R, 12);
  let clientSip = 0;
  const sipValues = yearData.map(d => {
    const surplus = Math.max(0, d.annual_net_cf);
    clientSip = clientSip * SNP_ANNUAL + surplus / 12 * (SNP_ANNUAL - 1) / SNP_R;
    return (d.surplus_snp_value > 0) ? d.surplus_snp_value : Math.round(clientSip);
  });
  const hasSipData = sipValues.some(v => v > 0);

  if (cashflowChart) cashflowChart.destroy();
  const datasets = [
    {
      label: 'Rent received',
      data: yearData.map(d => d.rent_saved_year),
      backgroundColor: 'rgba(77,142,114,0.55)',
      borderColor: '#4D8E72', borderWidth: 0, borderRadius: 5, borderSkipped: false,
      yAxisID: 'y',
    },
    {
      label: 'EMI + maintenance',
      data: yearData.map(d => d.emi_paid + d.maintenance),
      backgroundColor: 'rgba(181,92,98,0.5)',
      borderColor: '#B55C62', borderWidth: 0, borderRadius: 5, borderSkipped: false,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Cumulative net cash flow',
      data: yearData.map(d => d.cum_net_cf),
      borderColor: '#5580A8', backgroundColor: 'transparent',
      tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#5580A8', borderWidth: 2.5,
      borderDash: [6, 3], yAxisID: 'y2',
    },
  ];
  if (hasSipData) {
    datasets.push({
      type: 'line',
      label: 'SIP portfolio (S&P 500)',
      data: sipValues,
      borderColor: '#7970A2', backgroundColor: 'rgba(121,112,162,0.08)',
      tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#7970A2', borderWidth: 2,
      fill: true, yAxisID: 'y2',
    });
  }
  cashflowChart = new Chart(document.getElementById('cashflowChart'), {
    type: 'bar',
    plugins: [GRADIENT_PLUGIN],
    data: {
      labels: yearData.map(d => 'Yr ' + d.year),
      datasets,
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeInOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(20,27,40,0.92)', titleColor: '#e2e8f0', bodyColor: '#94a3b8',
          padding: 12, cornerRadius: 10, boxPadding: 5,
          callbacks: { label: c => '  ' + c.dataset.label + '  ' + fmt(c.parsed.y) },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9ba3ae', font: { size: 10 }, maxTicksLimit: 12 } },
        y: {
          grid: { color: 'rgba(0,0,0,0.03)' },
          ticks: { color: '#9ba3ae', font: { size: 11 }, callback: v => fmt(v) },
          title: { display: true, text: 'Annual ₹', font: { size: 10, weight: '500' }, color: '#9ba3ae' },
        },
        y2: {
          position: 'right', grid: { display: false },
          ticks: { color: '#5580A8', font: { size: 11 }, callback: v => fmt(v) },
          title: { display: true, text: 'Cumulative ₹', font: { size: 10, weight: '500' }, color: '#5580A8' },
        },
      },
    },
  });
}

/* ── Reset ── */
function resetAll() {
  const defaults = {
    interestRate: 8.5,
    appreciation: 6, rentAppreciation: 5, maintenance: 1,
    stockReturn: 12,
  };
  Object.entries(defaults).forEach(([id, val]) => { document.getElementById(id).value = val; });
  setHpInput('homePrice', 10000000);
  setHpInput('rent', 30000);
  syncHomePriceSliderFromPrice(10000000);
  syncRentSliderFromValue(30000);
  document.getElementById('tenure').value = 20;
  document.getElementById('downPct').value = 20;
  document.getElementById('tenureLabel').textContent = '20 years';
  document.getElementById('downLabel').textContent = '20%';
  const hr = document.getElementById('heroRoi');
  hr.textContent = '—'; hr.className = 'hero-stat-num';
  document.getElementById('results').classList.add('hidden');
  document.getElementById('resultsJumpNav').classList.remove('visible');
  document.getElementById('apiError').classList.add('hidden');
  document.getElementById('insightGrid').innerHTML = '';
  const bmi = document.getElementById('benchmarkInsight');
  if (bmi) { bmi.innerHTML = ''; bmi.style.display = 'none'; }
  if (investWealthChartObj) { investWealthChartObj.destroy(); investWealthChartObj = null; }
  if (iwOutflowChartObj)   { iwOutflowChartObj.destroy();   iwOutflowChartObj = null; }
  if (costChart)       { costChart.destroy();       costChart = null; }
  if (cashflowChart)   { cashflowChart.destroy();   cashflowChart = null; }
  if (outflowPieChart) { outflowPieChart.destroy(); outflowPieChart = null; }
  if (returnsPieChart) { returnsPieChart.destroy(); returnsPieChart = null; }
  if (benchmarkChart)  { benchmarkChart.destroy();  benchmarkChart = null; }
  ['sensChartCagr'].forEach(id => {
    const c = document.getElementById(id);
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  });
  ['sensLegendCagr'].forEach(id => {
    const l = document.getElementById(id); if (l) l.innerHTML = '';
  });
  updateLiveEmi();
}

/* ── Benchmark comparison ── */
let benchmarkChart = null;

const BENCHMARKS = [
  { label: 'S&P 500',       cagr: 10.5, color: '#6DA4C4', note: '30yr avg · USD',       home: false },
  { label: 'Nifty 50',      cagr: 12.0, color: '#7970A2', note: '20yr avg · INR',        home: false },
  { label: 'Large Cap MF',  cagr: 13.0, color: '#8B7EB8', note: 'Hist. avg · India',     home: false },
  { label: 'Bank FD',       cagr:  7.0, color: '#8E9BAA', note: 'Current rate',          home: false },
  { label: 'PPF',           cagr:  7.1, color: '#7A8B96', note: 'Govt. guaranteed rate', home: false },
];

function drawBenchmarks(summary, inputs) {
  const pv  = summary.pv_outflow;
  const n   = inputs.tenure_years;
  const homeBenefit = summary.final_home_value + summary.cumulative_rent_saved;
  const homeCagr    = summary.cagr_dcf_pct;

  // Build rows: benchmarks + home
  const rows = BENCHMARKS.map(bm => ({
    ...bm,
    finalValue: pv * Math.pow(1 + bm.cagr / 100, n),
  }));
  rows.push({ label: 'Home buying', cagr: homeCagr, color: '#5580A8', note: 'DCF-adj. CAGR · incl. rent saved', home: true, finalValue: homeBenefit });

  // Sort descending by final value
  rows.sort((a, b) => b.finalValue - a.finalValue);

  // Update header text
  document.getElementById('bmCapital').textContent = fmt(pv);
  document.getElementById('bmTenure').textContent  = n;

  // ── Chart ──
  if (benchmarkChart) benchmarkChart.destroy();
  benchmarkChart = new Chart(document.getElementById('benchmarkChart'), {
    type: 'bar',
    data: {
      labels: rows.map(r => r.label),
      datasets: [{
        data: rows.map(r => r.finalValue),
        backgroundColor: rows.map(r => r.home ? r.color + 'e0' : r.color + 'a0'),
        borderColor:     rows.map(r => r.color),
        borderWidth: rows.map(r => r.home ? 2 : 1),
        borderRadius: 7,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(20,27,40,0.92)', titleColor: '#e2e8f0', bodyColor: '#94a3b8',
          padding: 12, cornerRadius: 10, boxPadding: 5,
          callbacks: {
            title: c => rows[c[0].dataIndex]?.label,
            label: c => {
              const r = rows[c.dataIndex];
              return ['  Final value  ' + fmt(c.parsed.x), '  CAGR  ' + r.cagr.toFixed(1) + '%  ·  ' + r.note];
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.03)' },
          ticks: { color: '#9ba3ae', font: { size: 11 }, callback: v => fmt(v) },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: r => rows[r.index]?.home ? '#5580A8' : '#4a5568',
            font: r => ({ size: 12, weight: rows[r.index]?.home ? '700' : '500', family: "'Inter', sans-serif" }),
          },
        },
      },
    },
  });

  // ── Table ──
  let html = `<thead><tr>
    <th>#</th><th>Asset</th><th>CAGR</th><th>Final value</th><th>vs Home</th>
  </tr></thead><tbody>`;

  const homeVal = homeBenefit;
  rows.forEach((r, i) => {
    const rank   = i + 1;
    const delta  = r.finalValue - homeVal;
    const isHome = r.home;
    const rankCls = isHome ? 'home-rank' : rank <= 3 ? `rank-${rank}` : '';
    const deltaTxt = isHome ? '<span class="bm-delta neu">—</span>'
      : delta >= 0
        ? `<span class="bm-delta pos">+${fmt(delta)}</span>`
        : `<span class="bm-delta neg">−${fmt(Math.abs(delta))}</span>`;
    const cagrColor = r.cagr >= homeCagr ? 'color:var(--emerald)' : r.home ? '' : 'color:var(--rose)';

    html += `<tr class="${isHome ? 'bm-home' : ''}">
      <td class="bm-rank"><span class="rank-badge ${rankCls}">${rank}</span></td>
      <td>
        <div class="bm-asset">
          <span class="bm-dot" style="background:${r.color}"></span>
          <span class="bm-label">${r.label}</span>
          <span class="bm-note">${r.note}</span>
        </div>
      </td>
      <td class="bm-cagr" style="${cagrColor}">${r.cagr.toFixed(1)}%</td>
      <td class="bm-val">${fmt(r.finalValue)}</td>
      <td>${deltaTxt}</td>
    </tr>`;
  });
  html += '</tbody>';
  document.getElementById('benchmarkTable').innerHTML = html;

  // Auto-generated benchmark insight
  const homeIdx  = rows.findIndex(r => r.home);
  const homeRank = homeIdx + 1;
  const total    = rows.length;
  const trails   = rows.slice(0, homeIdx).filter(r => !r.home).map(r => r.label);
  const beats    = rows.slice(homeIdx + 1).filter(r => !r.home).map(r => r.label);
  const inEl      = document.getElementById('benchmarkInsight');
  let insightTxt  = `Home buying ranks <strong>#${homeRank} of ${total}</strong> assets by final wealth after ${n} years. `;
  if (trails.length === 0) {
    insightTxt += `It <strong>tops all benchmarks</strong> — your DCF-adjusted CAGR of ${homeCagr.toFixed(1)}% beats every alternative.`;
  } else if (beats.length === 0) {
    insightTxt += `It <strong>trails every benchmark</strong> — investing the same capital in ${trails[0]} would have generated more wealth.`;
  } else {
    insightTxt += `It beats <strong>${beats.join(', ')}</strong> but trails <strong>${trails.join(', ')}</strong>.`;
    if (homeCagr < 10) {
      insightTxt += ` At ${homeCagr.toFixed(1)}% CAGR, even a Bank FD strategy deserves consideration if capital preservation matters.`;
    } else if (homeCagr >= 12) {
      insightTxt += ` A ${homeCagr.toFixed(1)}% CAGR is competitive — this home is pulling its weight as an investment.`;
    }
  }
  inEl.innerHTML = insightTxt;
  inEl.style.display = 'block';
}

/* ── Comparison ── */
let compareChart = null;

const COMPARE_METRICS = [
  { key: 'monthly_emi',           label: 'Monthly EMI',        note: 'Your monthly outflow',                   fmt: fmt,    lowerWins: true  },
  { key: 'total_paid',            label: 'Total cash paid',    note: 'EMI + maintenance + down payment',        fmt: fmt,    lowerWins: true  },
  { key: 'pv_outflow',            label: 'PV of outflows',     note: 'DCF-equivalent lump sum today',           fmt: fmt,    lowerWins: true  },
  { key: 'final_home_value',      label: 'Final home value',   note: 'Home equity at end of tenure',            fmt: fmt,    lowerWins: false },
  { key: 'net_gain',              label: 'Net gain',           note: 'Equity + rent saved − total paid',        fmt: fmt,    lowerWins: false },
  { key: 'roi_pct',               label: 'ROI (nominal)',      note: 'Total return on cash outflows',           fmt: fmtPct, lowerWins: false },
  { key: 'cagr_dcf_pct',          label: 'CAGR (DCF)',         note: 'Annualised, PV-adjusted — compare to MFs',fmt: fmtPct, lowerWins: false },
  { key: 'cumulative_rent_saved', label: 'Rent saved',         note: 'Total rent avoided over tenure',          fmt: fmt,    lowerWins: false },
  { key: 'rent_vs_buy',           label: 'Buy vs rent edge',   note: 'Home equity minus renter portfolio',      fmt: fmt,    lowerWins: false },
  { key: 'break_even_year',       label: 'Break-even year',    note: 'Equity + rent saved ≥ total paid',        fmt: v => v ? 'Year ' + v : 'Never', lowerWins: true },
];

function getCompareInputs(p) {
  return {
    home_price:          parseHpRs(p + '_homePrice'),
    monthly_rent:        parseFloat(document.getElementById(p + '_rent').value),
    interest_rate:       parseFloat(document.getElementById(p + '_interestRate').value),
    annual_appreciation: parseFloat(document.getElementById(p + '_appreciation').value),
    rent_appreciation:   parseFloat(document.getElementById(p + '_rentAppreciation').value),
    maintenance_pct:     parseFloat(document.getElementById(p + '_maintenance').value),
    stock_return:        parseFloat(document.getElementById(p + '_stockReturn').value),
    benchmark_return:    getSelectedFund().cagr,
    tenure_years:        parseInt(document.getElementById(p + '_tenure').value),
    down_payment_pct:    parseFloat(document.getElementById(p + '_downPct').value),
  };
}

function copyFromCalculator() {
  const fields = ['interestRate', 'appreciation', 'rentAppreciation', 'maintenance', 'stockReturn'];
  fields.forEach(id => { document.getElementById('a_' + id).value = document.getElementById(id).value; });
  document.getElementById('a_homePrice').value = fmtHpInput(parseHpRs('homePrice'));
  document.getElementById('a_rent').value = parseHpRs('rent');
  document.getElementById('a_tenure').value  = document.getElementById('tenure').value;
  document.getElementById('a_downPct').value = document.getElementById('downPct').value;
  document.getElementById('a_tenureLabel').textContent = document.getElementById('tenureLabel').textContent;
  document.getElementById('a_downLabel').textContent   = document.getElementById('downLabel').textContent;
}

function copyAtoB() {
  const fields = ['rent', 'interestRate', 'appreciation', 'rentAppreciation', 'maintenance', 'stockReturn'];
  fields.forEach(id => { document.getElementById('b_' + id).value = document.getElementById('a_' + id).value; });
  document.getElementById('b_homePrice').value = fmtHpInput(parseHpRs('a_homePrice'));
  document.getElementById('b_tenure').value  = document.getElementById('a_tenure').value;
  document.getElementById('b_downPct').value = document.getElementById('a_downPct').value;
  document.getElementById('b_tenureLabel').textContent = document.getElementById('a_tenureLabel').textContent;
  document.getElementById('b_downLabel').textContent   = document.getElementById('a_downLabel').textContent;
}

async function compareProperties() {
  const inA = getCompareInputs('a');
  const inB = getCompareInputs('b');
  const errs = [
    ...validate(inA).map(e => 'A: ' + e),
    ...validate(inB).map(e => 'B: ' + e),
  ];
  const errEl = document.getElementById('compareError');
  if (errs.length) { errEl.textContent = errs[0]; errEl.classList.remove('hidden'); return; }
  errEl.classList.add('hidden');

  const btn = document.getElementById('compareBtn');
  document.getElementById('compareBtnText').textContent = 'Comparing…';
  document.getElementById('compareBtnSpinner').classList.remove('hidden');
  btn.disabled = true;

  try {
    const post = inputs => fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    }).then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.detail || 'Server error')));

    const [resA, resB] = await Promise.all([post(inA), post(inB)]);
    renderComparison(resA.data, resB.data, inA, inB);
  } catch (e) {
    errEl.textContent = '⚠ ' + (e.message || e || 'Could not connect to server.');
    errEl.classList.remove('hidden');
  } finally {
    document.getElementById('compareBtnText').textContent = 'Compare properties';
    document.getElementById('compareBtnSpinner').classList.add('hidden');
    btn.disabled = false;
  }
}

function renderComparison(dataA, dataB, inA, inB) {
  const sA = dataA.summary, sB = dataB.summary;

  // Count winners
  let winsA = 0, winsB = 0;
  COMPARE_METRICS.forEach(m => {
    const vA = sA[m.key], vB = sB[m.key];
    if (vA == null || vB == null) return;
    // For break_even_year: null = "Never" which is worst
    const nA = vA === null ? Infinity : vA;
    const nB = vB === null ? Infinity : vB;
    if (m.lowerWins) { if (nA < nB) winsA++; else if (nB < nA) winsB++; }
    else             { if (vA > vB) winsA++; else if (vB > vA) winsB++; }
  });

  const total = winsA + winsB;
  const winner = winsA > winsB ? 'A' : winsB > winsA ? 'B' : null;
  const banner = document.getElementById('compareWinner');
  banner.className = 'winner-banner ' + (winner === 'A' ? 'win-a' : winner === 'B' ? 'win-b' : 'win-tie');
  if (winner) {
    const wins = winner === 'A' ? winsA : winsB;
    banner.innerHTML = `
      <div class="winner-icon">${winner === 'A' ? '🏆' : '🥇'}</div>
      <div class="winner-text">
        Property <strong>${winner}</strong> is the stronger investment
        <span class="winner-sub">Wins <strong>${wins} of ${total}</strong> metrics · CAGR ${winner === 'A' ? fmtPct(sA.cagr_dcf_pct) : fmtPct(sB.cagr_dcf_pct)} vs ${winner === 'A' ? fmtPct(sB.cagr_dcf_pct) : fmtPct(sA.cagr_dcf_pct)}</span>
      </div>`;
  } else {
    banner.innerHTML = `<div class="winner-icon">⚖️</div><div class="winner-text"><strong>Too close to call</strong><span class="winner-sub">Both properties tied on ${total} metrics</span></div>`;
  }

  // Build metrics table
  let html = `<table class="compare-table">
    <thead><tr>
      <th>Metric</th>
      <th class="col-a">Property A</th>
      <th class="col-b">Property B</th>
      <th>Winner</th>
    </tr></thead><tbody>`;

  COMPARE_METRICS.forEach(m => {
    const vA = sA[m.key], vB = sB[m.key];
    const nA = (vA === null || vA === undefined) ? Infinity : vA;
    const nB = (vB === null || vB === undefined) ? Infinity : vB;
    let w = 'tie';
    if (nA !== nB) {
      if (m.lowerWins) w = nA < nB ? 'a' : 'b';
      else             w = vA > vB  ? 'a' : 'b';
    }
    const fA = m.fmt(vA != null ? vA : null);
    const fB = m.fmt(vB != null ? vB : null);
    html += `<tr>
      <td class="metric-name"><span class="mn-label">${m.label}</span><span class="mn-note">${m.note}</span></td>
      <td class="val-a ${w === 'a' ? 'is-winner' : ''}">${fA}</td>
      <td class="val-b ${w === 'b' ? 'is-winner' : ''}">${fB}</td>
      <td class="badge-cell">${w !== 'tie' ? `<span class="badge badge-${w}">${w.toUpperCase()}</span>` : '<span class="badge-tie">—</span>'}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('compareMetrics').innerHTML = html;

  drawCompareChart(dataA.chart_data, inA.tenure_years, dataB.chart_data, inB.tenure_years);

  document.getElementById('compareResults').classList.remove('hidden');
  document.getElementById('compareResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function drawCompareChart(cdA, tenA, cdB, tenB) {
  if (compareChart) compareChart.destroy();
  const maxT = Math.max(tenA, tenB);
  const labels = Array.from({ length: maxT }, (_, i) => 'Yr ' + (i + 1));
  const pad = (arr, len) => { const r = [...arr]; while (r.length < len) r.push(null); return r; };

  compareChart = new Chart(document.getElementById('compareChart'), {
    type: 'line',
    plugins: [GRADIENT_PLUGIN],
    data: {
      labels,
      datasets: [
        { label: 'A — Home equity',        data: pad(cdA.equity,           maxT), borderColor: '#5580A8', _gt: 'rgba(85,128,168,0.25)',  _gb: 'rgba(85,128,168,0.01)',  tension: 0.4, fill: true,  pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 },
        { label: 'B — Home equity',        data: pad(cdB.equity,           maxT), borderColor: '#7970A2', _gt: 'rgba(121,112,162,0.22)', _gb: 'rgba(121,112,162,0.01)', tension: 0.4, fill: true,  pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 },
        { label: 'A — Renter portfolio',   data: pad(cdA.renter_portfolio, maxT), borderColor: '#5580A8', tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 4, borderWidth: 1.5, borderDash: [5, 3] },
        { label: 'B — Renter portfolio',   data: pad(cdB.renter_portfolio, maxT), borderColor: '#7970A2', tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 4, borderWidth: 1.5, borderDash: [5, 3] },
        { label: `${getSelectedFund().label} renter (${getSelectedFund().cagr}%)`, data: pad(cdA.snp_portfolio, maxT), borderColor: '#6DA4C4', tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 4, borderWidth: 1.5, borderDash: [3, 3] },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 14, boxWidth: 12, color: '#374151' } },
        tooltip: {
          backgroundColor: 'rgba(20,27,40,0.92)', titleColor: '#e2e8f0', bodyColor: '#94a3b8',
          padding: 12, cornerRadius: 10, boxPadding: 5,
          callbacks: { label: c => '  ' + c.dataset.label + '  ' + fmt(c.parsed.y) },
        },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#9ba3ae', font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#9ba3ae', font: { size: 11 }, callback: v => fmt(v) } },
      },
    },
  });
}

/* ── Compare slider sync ── */
['a', 'b'].forEach(p => {
  document.getElementById(p + '_tenure').addEventListener('input', () => {
    document.getElementById(p + '_tenureLabel').textContent = document.getElementById(p + '_tenure').value + ' years';
  });
  document.getElementById(p + '_downPct').addEventListener('input', () => {
    document.getElementById(p + '_downLabel').textContent = document.getElementById(p + '_downPct').value + '%';
  });
});

/* ── Allow Enter key to trigger calculate ── */
document.querySelectorAll('input[type="number"]').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
});

/* ── CHAT WIDGET ─────────────────────────────────────────────────────── */

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chatPanel');
  const fabChat = document.querySelector('.fab-icon-chat');
  const fabClose = document.querySelector('.fab-icon-close');
  const unread = document.getElementById('chatUnread');
  panel.setAttribute('aria-hidden', chatOpen ? 'false' : 'true');
  fabChat.classList.toggle('hidden', chatOpen);
  fabClose.classList.toggle('hidden', !chatOpen);

  if (chatOpen) {
    unread.classList.remove('visible');
    setTimeout(() => document.getElementById('chatInput').focus(), 220);
    scrollChatToBottom();
  }
}

function scrollChatToBottom() {
  const el = document.getElementById('chatMessages');
  if (el) el.scrollTop = el.scrollHeight;
}

// ── Help & Support tab ──────────────────────────────

// Switch tab programmatically (used in FAQ inline links)
function switchToTab(tab) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById('tab-' + tab);
  if (section) section.classList.add('active');
  const hideCalcUi = tab === 'compare' || tab === 'insights' || tab === 'support';
  ['inputsPanel','loanPanel','metricsHighlight','calcRow'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = hideCalcUi ? 'none' : '';
  });
}

// FAQ accordion
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.sp-faq-q');
  if (!btn) return;
  const item = btn.closest('.sp-faq');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.sp-faq.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
});

// Support search — filters FAQ items and highlights categories
function runSupportSearch(q) {
  q = (q || '').trim().toLowerCase();
  const faqs = document.querySelectorAll('#spFaqs .sp-faq');
  const empty = document.getElementById('spFaqEmpty');
  let visible = 0;
  faqs.forEach(faq => {
    const text = (faq.querySelector('.sp-faq-q').textContent + ' ' + (faq.dataset.keywords || '')).toLowerCase();
    const show = !q || text.includes(q);
    faq.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (empty) empty.classList.toggle('hidden', visible > 0 || !q);
  document.querySelectorAll('.sp-cat').forEach(cat => {
    const keywords = (cat.dataset.filter || '') + ' ' + cat.querySelector('.sp-cat-name').textContent.toLowerCase();
    cat.classList.toggle('active', !!q && keywords.includes(q));
    cat.style.opacity = (!q || keywords.includes(q)) ? '1' : '0.35';
  });
}

(function() {
  const input = document.getElementById('supportSearch');
  if (!input) return;
  input.addEventListener('input', function() { runSupportSearch(this.value); });
}());

// ── Guide Modal ───────────────────────────────────────────────────────────────

const GUIDE_CONTENT = {
  'first-time-buyer': {
    tag: 'Beginner', title: "First-Time Homebuyer's Complete Guide",
    meta: ['📖 8 min read', '🏠 Home Loans'],
    body: `
      <h3>Step 1 — Set your budget before you look</h3>
      <p>Start with your take-home income, not your gross salary. Banks allow total EMIs up to 40–50% of gross income (FOIR). A safe rule: keep your home loan EMI under 30% of monthly take-home. Add stamp duty (5–8%), registration (1%), brokerage (1–2%), and interiors (₹3–10L) to your cash requirement.</p>
      <div class="guide-tip">💡 <strong>Tip:</strong> Budget for 10–12% over the property price to cover all transaction costs before you start shortlisting properties.</div>

      <h3>Step 2 — Get pre-approved before negotiating</h3>
      <p>A pre-approval letter from a bank tells you exactly how much loan you qualify for and gives you negotiating credibility with sellers. It requires income proof, PAN, Aadhaar, and last 6-month bank statements. Pre-approval is typically valid for 3–6 months.</p>

      <h3>Step 3 — Builder and property due diligence</h3>
      <ul>
        <li>Verify RERA registration at your state's RERA portal — never buy from an unregistered project.</li>
        <li>Check the title chain for the last 30 years via an encumbrance certificate from the sub-registrar's office.</li>
        <li>Confirm the approved building plan matches what's being built — check Floor Space Index (FSI) compliance.</li>
        <li>For under-construction: check builder's past project delivery track record and bank tie-ups.</li>
      </ul>

      <h3>Step 4 — Understand the sale agreement</h3>
      <p>The sale agreement locks in the price, payment schedule, possession date, and penalty clauses. Key things to negotiate: interest on delay (minimum SBI PLR + 2%), carpet area vs built-up vs super built-up clarity, and maintenance corpus terms.</p>
      <div class="guide-warn">⚠️ <strong>Important:</strong> Never pay more than 10% as booking amount before signing a registered sale agreement. Verbal commitments are unenforceable.</div>

      <h3>Step 5 — Loan disbursement and registration</h3>
      <p>For ready-to-move properties: loan is disbursed in one shot on registration. For under-construction: disbursed in stages linked to construction milestones — you pay Pre-EMI (interest only) until full disbursement. Register the property within 4 months of the sale agreement to avoid penalty.</p>

      <h3>Step 6 — Possession and snagging</h3>
      <p>Before accepting possession, do a thorough snagging walk-through: check all electrical fittings, plumbing, flooring, and common areas. Document defects in writing. Under RERA, builders have a 5-year defect liability — any structural defect must be repaired free of cost within that period.</p>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="switchToTab('calc'); closeGuideModal()">Open Calculator</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  },
  'home-vs-sip': {
    tag: 'Strategy', title: 'Home Loan vs SIP: Which Builds More Wealth?',
    meta: ['📖 12 min read', '📊 Investment'],
    body: `
      <h3>The core question</h3>
      <p>If you have ₹20L for a down payment and ₹50,000/month available for investment, does putting it into a home loan or a Nifty 50 SIP build more wealth over 20 years? The answer depends on five key variables: property appreciation, rental yield, loan interest rate, equity return, and how long you hold.</p>

      <h3>How to think about it correctly</h3>
      <p>Most comparisons are wrong because they compare apples to oranges. The right framework:</p>
      <ul>
        <li><strong>Buying path:</strong> ₹20L down payment + ₹50K/month EMI → you own a property worth X after 20 years, with zero loan outstanding.</li>
        <li><strong>Renting + SIP path:</strong> ₹20L invested in Nifty 50 lump sum + (EMI − rent paid each month) invested as SIP → you have a portfolio worth Y after 20 years.</li>
        <li>The fair comparison is X vs Y — not just the property value vs the SIP value.</li>
      </ul>

      <h3>What the data shows (India, 2004–2024)</h3>
      <ul>
        <li>Nifty 50 delivered ~12.5% CAGR over 20 years — but with significant volatility.</li>
        <li>Residential property in metro IT corridors (Hyderabad, Pune, Bangalore) delivered 8–11% CAGR including rental yield.</li>
        <li>Mumbai premium markets delivered 5–7% price appreciation but only 2–2.5% rental yield — equity typically wins here.</li>
        <li>Hyderabad's Gachibowli, Financial District: ~10–11% price CAGR + 3% yield = 13–14% total return. Home often wins here.</li>
      </ul>
      <div class="guide-tip">💡 The home wins when: price-to-rent ratio &lt; 20, appreciation &gt; 7%/yr, and you hold for 15+ years. The SIP wins when: P/R ratio &gt; 25, you need liquidity, or you're disciplined about investing the rent savings.</div>

      <h3>The leverage advantage of property</h3>
      <p>Property is bought with leverage — you put in ₹20L and control a ₹1 Cr asset. If the property rises 8%/yr, your ₹1 Cr becomes ₹4.66 Cr in 20 years. Your actual cash return on the ₹20L down payment is far higher than 8%/yr — that's the power of leverage. SIPs don't give you this leverage.</p>

      <h3>The liquidity disadvantage of property</h3>
      <p>A Nifty SIP can be redeemed in 2 days. Selling a property takes 2–6 months, costs 1–3% in transaction fees, and may require capital gains tax (LTCG at 20% with indexation after 2 years). Factor this illiquidity premium into your comparison.</p>

      <h3>Use GoWinDhan to model your scenario</h3>
      <p>The calculator gives you the exact DCF-adjusted CAGR for your inputs — this is the apples-to-apples number to compare against your SIP return expectation.</p>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="switchToTab('calc'); closeGuideModal()">Run the comparison</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  },
  'city-appreciation': {
    tag: 'Advanced', title: 'Property Appreciation Across Indian Cities',
    meta: ['📖 10 min read', '🏙️ Markets'],
    body: `
      <h3>Methodology</h3>
      <p>Data below is a blended estimate based on NHB Residex, Anarock Research, Knight Frank India, and 99acres transaction data for 2014–2024. CAGR figures represent median residential property price appreciation — individual micro-markets vary significantly.</p>

      <h3>Hyderabad — 9–11% CAGR</h3>
      <p>Hyderabad has been India's top-performing major residential market over the last decade. The IT boom in the Financial District, Gachibowli, Kondapur, and Narsingi has driven 10–11% price CAGR. Rental yields of 3–3.5% make it one of the few Indian markets where buying often beats renting on pure numbers.</p>
      <ul>
        <li><strong>Top micro-markets:</strong> Narsingi, Puppalaguda, Financial District (~11%), Gachibowli, Manikonda (~10%)</li>
        <li><strong>Mid-performers:</strong> Kondapur, Miyapur, Kukatpally (~8–9%)</li>
        <li><strong>Emerging:</strong> Shamshabad, Adibatla, Keesara (~7–9%)</li>
      </ul>

      <h3>Bangalore — 7–10% CAGR</h3>
      <p>North Bangalore (Hebbal, Devanahalli) and East Bangalore (Whitefield, Sarjapur) have delivered strong returns driven by IT parks and airport proximity. South Bangalore remains premium but has seen slower appreciation.</p>
      <ul>
        <li><strong>Top:</strong> Devanahalli, Hebbal, Whitefield (~9–10%)</li>
        <li><strong>Mid:</strong> Sarjapur Road, Electronic City (~7–8%)</li>
        <li><strong>Slower:</strong> Indiranagar, Koramangala (~5–6% — already priced in)</li>
      </ul>

      <h3>Mumbai — 4–7% CAGR</h3>
      <p>Mumbai's high base prices mean lower price CAGR but stable demand. The Western Suburbs (Goregaon, Malad, Borivali) and Navi Mumbai have outperformed. South Mumbai and Bandra have appreciated slowly but command premium rents.</p>
      <ul>
        <li><strong>Top:</strong> Panvel, Navi Mumbai, Thane (~7%)</li>
        <li><strong>Mid:</strong> Goregaon, Malad, Kandivali (~5–6%)</li>
        <li><strong>Slower:</strong> South Mumbai, Bandra (~3–4%)</li>
      </ul>

      <h3>Pune — 7–9% CAGR</h3>
      <p>Pune has benefited from IT, manufacturing, and education. Hinjewadi, Wakad, and Kharadi are the top IT corridors.</p>

      <h3>Delhi NCR — 5–8% CAGR</h3>
      <p>Gurugram (Golf Course Road, Dwarka Expressway) and Noida (Sector 150, Expressway) have led returns. Central Delhi has been flat.</p>

      <h3>Chennai — 6–8% CAGR</h3>
      <p>OMR (Old Mahabalipuram Road) corridor and Perambur have seen strong IT-driven demand. Sholinganallur and Siruseri lead.</p>

      <div class="guide-tip">💡 Use GoWinDhan's Locality Insights tab to explore 160+ micro-markets with blended 10-year trend data pre-filled into the calculator.</div>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="switchToTab('insights'); closeGuideModal()">Explore Locality Insights</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  },
  'pmay': {
    tag: 'Beginner', title: 'PMAY 2.0 Subsidy — Complete Application Guide',
    meta: ['📖 6 min read', '🎯 Schemes'],
    body: `
      <h3>What is PMAY 2.0?</h3>
      <p>Pradhan Mantri Awas Yojana (Urban) 2.0 is the government's affordable housing mission. It provides an interest subsidy (Credit Linked Subsidy Scheme — CLSS) that is credited directly to your loan account, reducing your outstanding principal and lowering your EMI from Day 1.</p>

      <h3>Who is eligible?</h3>
      <ul>
        <li>You (or any family member) must not own a pucca house anywhere in India.</li>
        <li>Must be a first-time homebuyer for this property.</li>
        <li>Property must be in an urban area (municipal corporation / town area).</li>
        <li>Applicable only for new homes — resale flats may not qualify (check with your bank).</li>
      </ul>

      <h3>Income categories and subsidy amounts</h3>
      <ul>
        <li><strong>EWS</strong> (annual income ≤ ₹3L): 6.5% subsidy on loan up to ₹6L → saves ~₹2.67L</li>
        <li><strong>LIG</strong> (income ₹3L–₹6L): 6.5% subsidy on loan up to ₹6L → saves ~₹2.67L</li>
        <li><strong>MIG-I</strong> (income ₹6L–₹12L): 4% subsidy on loan up to ₹9L → saves ~₹2.35L</li>
        <li><strong>MIG-II</strong> (income ₹12L–₹18L): 3% subsidy on loan up to ₹12L → saves ~₹2.30L</li>
      </ul>
      <div class="guide-tip">💡 The subsidy is credited as a lump sum to your loan account within 3–4 months of the first disbursement. This directly reduces your outstanding principal, lowering all future EMIs.</div>

      <h3>How to apply — step by step</h3>
      <ul>
        <li><strong>Step 1:</strong> Choose a bank or HFC (Housing Finance Company) that is an approved Primary Lending Institution (PLI) under PMAY — all major banks qualify.</li>
        <li><strong>Step 2:</strong> Inform the bank that you want PMAY subsidy at the time of loan application. Fill in the PMAY self-declaration form (no separate portal application needed via banks).</li>
        <li><strong>Step 3:</strong> Bank verifies your eligibility and submits the claim to NHB (National Housing Bank) or HUDCO.</li>
        <li><strong>Step 4:</strong> Subsidy is credited to your loan account within 3–6 months. Your EMI reduces or tenure shortens based on your bank's policy.</li>
      </ul>

      <h3>Documents required for PMAY</h3>
      <ul>
        <li>Aadhaar card (mandatory — linked to loan)</li>
        <li>Income proof (ITR / salary slips / Form 16)</li>
        <li>Self-declaration of not owning a pucca house</li>
        <li>Property documents (sale agreement / allotment letter)</li>
      </ul>
      <div class="guide-warn">⚠️ PMAY 2.0 eligibility and subsidy rates are subject to government updates. Verify current figures with your bank or the official PMAY portal before applying.</div>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="openFaq('spFaq10'); closeGuideModal()">View PMAY FAQ</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  },
  'tax-savings': {
    tag: 'Intermediate', title: 'Maximising Tax Savings on Your Home Loan',
    meta: ['📖 9 min read', '📋 Tax'],
    body: `
      <h3>The two main deductions (Old Regime only)</h3>
      <ul>
        <li><strong>Section 24(b) — Interest deduction:</strong> Up to ₹2 lakh/year on interest paid for a self-occupied property. No upper limit for let-out property, but loss set-off against other income is capped at ₹2L/year.</li>
        <li><strong>Section 80C — Principal deduction:</strong> Up to ₹1.5 lakh/year on principal repayment, within the overall 80C limit (which also includes LIC, PPF, ELSS, etc.).</li>
      </ul>
      <div class="guide-tip">💡 Combined max deduction = ₹3.5L/year. At 30% tax slab: saves up to ₹1.05L/year = ₹8,750/month — meaningful EMI relief.</div>

      <h3>Section 80EEA — First-time buyer bonus (check current validity)</h3>
      <p>An additional ₹1.5L deduction on interest for first-time buyers where stamp duty value ≤ ₹45L. This was introduced for loans sanctioned between April 2019 and March 2022. Verify with your CA whether this still applies to your situation.</p>

      <h3>Old regime vs new regime — which to choose?</h3>
      <p>The new tax regime (default from FY 2023-24) offers lower tax rates but removes all deductions including 80C and 24(b). A simple test: if your total deductions (including 80C, 80D, HRA, 24b) exceed the standard deduction advantage of the new regime, stick to the old regime.</p>
      <ul>
        <li>Income ₹10L, home loan interest ₹2L, 80C ₹1.5L → old regime likely better</li>
        <li>Income ₹15L, minimal deductions → new regime may be better</li>
        <li>Always calculate both — your CA or the income tax portal can compute this</li>
      </ul>

      <h3>Joint loan co-ownership strategy (the best tax hack)</h3>
      <p>If both spouses are salaried taxpayers in the old regime, taking a joint loan where both are co-owners doubles the deduction:</p>
      <ul>
        <li>Each can claim 24(b) up to ₹2L/year = ₹4L total interest deduction</li>
        <li>Each can claim 80C up to ₹1.5L/year = ₹3L total principal deduction</li>
        <li>At 30% slab each: combined annual tax saving up to ₹2.1L = ₹17,500/month</li>
      </ul>
      <div class="guide-warn">⚠️ Both co-applicants must be co-owners in the property's registered title deed. Loan co-applicant alone is not sufficient — the ownership document is what the IT department looks for.</div>

      <h3>Let-out property — different rules</h3>
      <p>If you rent out the property you bought on loan: the actual interest paid (no ₹2L cap) is deductible from rental income. If this creates a loss, up to ₹2L can be set off against salary income in the same year. The remaining loss can be carried forward for 8 years.</p>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="openFaq('spFaq5'); closeGuideModal()">View Tax FAQ</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  },
  'due-diligence': {
    tag: 'Checklist', title: 'Property Due Diligence Checklist (2025)',
    meta: ['📖 7 min read', '🔑 Legal'],
    body: `
      <h3>Legal title checks</h3>
      <ul>
        <li>☐ Title deed chain verified for the last 30 years (engage a property lawyer)</li>
        <li>☐ Encumbrance Certificate (EC) obtained from sub-registrar's office — confirms no existing mortgage or lien</li>
        <li>☐ Seller is the rightful owner — cross-check with revenue records (Pahani/Khata)</li>
        <li>☐ No disputes or litigation in court (check at District Court records)</li>
        <li>☐ Agricultural land converted to residential use (NA/non-agricultural order) if applicable</li>
      </ul>

      <h3>RERA and approvals</h3>
      <ul>
        <li>☐ Project registered on your state RERA portal — note registration number</li>
        <li>☐ Approved building plan from municipal authority (GHMC, BBMP, PCMC etc.)</li>
        <li>☐ Building plan matches actual construction — check floor count and FSI compliance</li>
        <li>☐ Commencement Certificate (CC) issued by municipal body</li>
        <li>☐ For completed buildings: Occupancy Certificate (OC) obtained</li>
        <li>☐ No deviation from sanctioned plan (builder self-certification is insufficient — verify independently)</li>
      </ul>

      <h3>Builder track record</h3>
      <ul>
        <li>☐ Minimum 3 completed projects delivered on schedule</li>
        <li>☐ No cases pending at consumer court or RERA adjudicating authority</li>
        <li>☐ Bank tie-up (approved by SBI/HDFC/ICICI) — banks conduct their own due diligence</li>
        <li>☐ Check Glassdoor / MagicBricks / Proptiger reviews from existing residents</li>
      </ul>

      <h3>Society / apartment checks</h3>
      <ul>
        <li>☐ NOC from Resident Welfare Association (for resale flats)</li>
        <li>☐ Share certificate (for cooperative housing societies)</li>
        <li>☐ No pending dues on the property (maintenance arrears, electricity)</li>
        <li>☐ Maintenance corpus amount and monthly charges confirmed in writing</li>
        <li>☐ Lift, water, power backup, parking allocation confirmed</li>
      </ul>

      <h3>Financial / registration</h3>
      <ul>
        <li>☐ Carpet area (not super built-up) confirmed in writing with formula</li>
        <li>☐ Sale agreement reviewed by your lawyer before signing</li>
        <li>☐ Stamp duty calculated on circle rate or agreement value (whichever is higher)</li>
        <li>☐ Property registered within 4 months of agreement to avoid penalty</li>
        <li>☐ TDS on property deducted if purchase value &gt; ₹50L (1% of value, Form 26QB)</li>
      </ul>
      <div class="guide-warn">⚠️ Never skip the lawyer review for title documents — a clear title is the single most important factor in property purchase. Spending ₹10–25K on a property lawyer can save you from a ₹50L+ dispute later.</div>
      <div class="guide-modal-cta">
        <button class="cta-primary" onclick="openFaq('spFaq15'); closeGuideModal()">View RERA FAQ</button>
        <button class="cta-secondary" onclick="closeGuideModal()">Close</button>
      </div>`
  }
};

function openGuideModal(guideKey) {
  const guide = GUIDE_CONTENT[guideKey];
  if (!guide) return;
  document.getElementById('guideModalTag').textContent = guide.tag;
  document.getElementById('guideModalTitle').textContent = guide.title;
  document.getElementById('guideModalMeta').innerHTML = guide.meta.map(m => `<span>${m}</span>`).join('');
  document.getElementById('guideModalBody').innerHTML = guide.body;
  const modal = document.getElementById('guideModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGuideModal(event) {
  if (event && event.target !== document.getElementById('guideModal')) return;
  const modal = document.getElementById('guideModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeGuideModal();
});

// Popular Guides — click to open modal
document.addEventListener('click', function(e) {
  const guide = e.target.closest('.sp-guide[data-guide]');
  if (!guide) return;
  openGuideModal(guide.dataset.guide);
});

// openFaq helper — opens a specific FAQ item and scrolls to it
function openFaq(id) {
  document.querySelectorAll('.sp-faq.open').forEach(el => el.classList.remove('open'));
  const faq = document.getElementById(id);
  if (!faq) return;
  faq.classList.add('open');
  setTimeout(() => faq.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
}

// Browse by Topic — click a category card to filter FAQs
document.addEventListener('click', function(e) {
  const cat = e.target.closest('.sp-cat');
  if (!cat) return;
  const catName = cat.querySelector('.sp-cat-name').textContent.trim();
  const input = document.getElementById('supportSearch');
  if (input) {
    input.value = catName;
    runSupportSearch(catName);
  }
  const faqSection = document.getElementById('spFaqs');
  if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function collapseHelpTop() {
  const el = document.getElementById('chatHelpTop');
  if (el && !el.classList.contains('collapsed')) el.classList.add('collapsed');
  const chips = document.getElementById('chatChips');
  if (chips) chips.style.display = 'none';
}

// Quick suggestion chips — click to auto-send
document.addEventListener('click', function(e) {
  const chip = e.target.closest('.chat-chip, .chat-help-topic');
  if (!chip) return;
  const msg = chip.dataset.msg;
  if (!msg) return;
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = msg;
    sendChat();
  }
});

function appendChatMessage(role, text) {
  const container = document.getElementById('chatMessages');
  const row = document.createElement('div');
  row.className = 'chat-msg-row ' + (role === 'user' ? 'user' : 'bot');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  container.appendChild(row);
  scrollChatToBottom();
}

function buildCalcContext() {
  if (!lastCalcResult) return null;
  const r = lastCalcResult;
  const hp = (r.home_price / 1e7).toFixed(2);
  const loan = (r.loan_amount / 1e5).toFixed(0);
  const emi = Math.round(r.monthly_emi).toLocaleString('en-IN');
  const interest = (r.total_interest / 1e5).toFixed(1);
  const homeVal = (r.home_wealth_final / 1e7).toFixed(2);
  return [
    `Home price: Rs ${hp} Cr`,
    `Down payment: ${r.down_pct}% (loan: Rs ${loan}L)`,
    `EMI: Rs ${emi}/month at ${r.interest_rate}% for ${r.tenure_years} years`,
    `Property appreciation: ${r.annual_appreciation}% per year`,
    `Rental yield: ${r.rental_yield}%`,
    `Benchmark stock return: ${r.stock_return}%`,
    `Total interest to bank: Rs ${interest}L over tenure`,
    `Estimated tax saving (yr 1): Rs ${Math.round(r.tax_saving).toLocaleString('en-IN')}`,
    `DCF-adjusted CAGR: ${r.cagr_dcf !== undefined ? r.cagr_dcf.toFixed(2) : 'N/A'}% p.a.`,
    `Break-even year: ${r.break_even_year || 'beyond tenure'}`,
    `Home wealth at end of tenure: Rs ${homeVal} Cr`,
    `Verdict: ${r.buying_wins ? 'Buying wins' : 'Renting + investing wins'} by Rs ${Math.round(Math.abs(r.rent_vs_buy)).toLocaleString('en-IN')}`,
  ].join('\n');
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  collapseHelpTop();
  input.value = '';
  appendChatMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  document.getElementById('chatTyping').classList.remove('hidden');
  scrollChatToBottom();

  try {
    const body = {
      messages: chatHistory.slice(-12),
      context: buildCalcContext(),
    };
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    document.getElementById('chatTyping').classList.add('hidden');

    const reply = data.reply || data.error || 'Something went wrong. Please try again.';
    appendChatMessage('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });

    if (!chatOpen) {
      document.getElementById('chatUnread').classList.add('visible');
    }
  } catch {
    document.getElementById('chatTyping').classList.add('hidden');
    appendChatMessage('bot', 'Connection error — please check your internet and try again.');
  }
}

/* ── EMI Filter Sliders for Heatmaps ── */
function initEmiFilters(sensData) {
  const allEmi = sensData.rows.flatMap(r => r.cells.map(c => c.monthly_emi)).filter(v => v != null);
  if (!allEmi.length) return;
  const minE = Math.min(...allEmi);
  const maxE = Math.max(...allEmi);

  ['Cagr'].forEach(tag => {
    const minEl = document.getElementById('emiMin' + tag);
    const maxEl = document.getElementById('emiMax' + tag);
    const minVal = document.getElementById('emiMin' + tag + 'Val');
    const maxVal = document.getElementById('emiMax' + tag + 'Val');
    if (!minEl) return;

    minEl.min = minE; minEl.max = maxE; minEl.step = Math.round((maxE - minE) / 100) || 1000;
    maxEl.min = minE; maxEl.max = maxE; maxEl.step = minEl.step;
    minEl.value = minE; maxEl.value = maxE;
    if (minVal) minVal.textContent = fmt(minE);
    if (maxVal) maxVal.textContent = fmt(maxE);

    function onFilterChange() {
      const lo = parseInt(minEl.value);
      const hi = parseInt(maxEl.value);
      if (lo > hi) { minEl.value = hi; return; }
      if (minVal) minVal.textContent = fmt(lo);
      if (maxVal) maxVal.textContent = fmt(hi);
      drawHeatmap('sensChartCagr', 'sensLegendCagr', lastSensData, 'cagr_dcf', 1, '%', lastSensInputs, lo, hi);
    }
    minEl.addEventListener('input', onFilterChange);
    maxEl.addEventListener('input', onFilterChange);
  });
}

/* ── Locality Insights ── */
(function initInsightsTab() {
  const cityEl = document.getElementById('insCity');
  const localityEl = document.getElementById('insLocality');
  const fetchBtn = document.getElementById('insFetchBtn');
  if (!cityEl) return;

  Object.keys(LOCALITY_DATA).sort().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    cityEl.appendChild(opt);
  });

  cityEl.addEventListener('change', () => {
    const city = cityEl.value;
    localityEl.innerHTML = '<option value="">— Select locality —</option>';
    localityEl.disabled = !city;
    fetchBtn.disabled = true;
    if (!city) return;
    const locs = Object.keys(LOCALITY_DATA[city].localities || {}).sort();
    locs.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l; opt.textContent = l;
      localityEl.appendChild(opt);
    });
    localityEl.disabled = false;
  });

  localityEl.addEventListener('change', () => {
    fetchBtn.disabled = !localityEl.value;
  });
})();

function fetchInsights() {
  const city = document.getElementById('insCity').value;
  const locality = document.getElementById('insLocality').value;
  if (!city || !locality) return;

  const errEl = document.getElementById('insError');
  const resEl = document.getElementById('insResults');
  errEl.classList.add('hidden');
  resEl.classList.add('hidden');

  const cityInsights = typeof LOCALITY_INSIGHTS !== 'undefined' && LOCALITY_INSIGHTS[city];
  const d = cityInsights && cityInsights[locality];

  if (d && Object.keys(d).length > 0) {
    renderInsights(city, locality, d);
    return;
  }

  // Minimal card for localities with LOCALITY_DATA but no full research yet
  const ldLoc = LOCALITY_DATA[city] && LOCALITY_DATA[city].localities[locality];
  if (ldLoc) {
    renderInsights(city, locality, {
      _minimal: true,
      overview: locality + ' is a ' + ldLoc.note.toLowerCase().replace(' · ', ' area of ') + ' in ' + city + '.',
      investment_note: 'Appreciation trend: ~' + ldLoc.app + '% p.a. · Gross rental yield: ~' + ldLoc.rent + '%. Detailed locality research is being prepared and will be published soon.',
    });
    return;
  }

  errEl.textContent = 'No data found for ' + locality + ', ' + city + '.';
  errEl.classList.remove('hidden');
}

function buildPriceChart(city, locality, metrics) {
  const canvas = document.getElementById('priceChartCanvas');
  if (!canvas || !metrics || !metrics.recentApp) return;
  const ldLoc = LOCALITY_DATA[city] && LOCALITY_DATA[city].localities[locality];
  if (!ldLoc) return;

  const baseApp = ldLoc.app;
  const recentApp = metrics.recentApp;

  const nums = (metrics.price || '').replace(/[₹,]/g, '').match(/\d+/g);
  if (!nums || nums.length < 2) return;
  const current = Math.round((+nums[0] + +nums[1]) / 2);

  const existing = typeof Chart !== 'undefined' && Chart.getChart && Chart.getChart(canvas);
  if (existing) existing.destroy();

  // 2015–2030; pivot at index 10 = 2025
  const labels = [];
  for (let y = 2015; y <= 2030; y++) labels.push(y);
  const pivotIdx = 10;

  const base2015 = current / Math.pow(1 + baseApp / 100, pivotIdx);
  const cagrLine = labels.map((_, i) => Math.round(base2015 * Math.pow(1 + baseApp / 100, i)));
  const recentLine = labels.map((_, i) =>
    i < pivotIdx ? null : Math.round(current * Math.pow(1 + recentApp / 100, i - pivotIdx))
  );

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `10-yr avg (${baseApp}% p.a.)`,
          data: cagrLine,
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30,136,229,0.07)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: (ctx) => ctx.dataIndex === pivotIdx ? 5 : 2,
          pointBackgroundColor: '#1e88e5',
        },
        {
          label: `Recent pace (~${recentApp}%)`,
          data: recentLine,
          borderColor: '#16a34a',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 2,
          pointBackgroundColor: '#16a34a',
        }
      ]
    },
    plugins: [{
      id: 'nowLine',
      afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const x = scales.x.getPixelForValue(pivotIdx);
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶ Projected', x, chartArea.top - 6);
        ctx.restore();
      }
    }],
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 11 }, boxWidth: 18, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: ctx => ctx.parsed.y == null ? null :
              `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}/sqft`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
        y: {
          ticks: {
            font: { size: 10 },
            callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
          }
        }
      }
    }
  });
}

function renderInsights(city, locality, d) {
  const badge = document.getElementById('insLocationBadge');
  badge.textContent = locality + ', ' + city;

  const overview = document.getElementById('insOverview');
  overview.textContent = d.overview || '';

  const grid = document.getElementById('insGrid');
  const fmtList = arr => (arr || []).map(s => `<div class="ins-list-item">• ${s}</div>`).join('');

  let trafficHtml = '';
  if (d.traffic) {
    const t = d.traffic;
    trafficHtml = `
      <div class="ins-panel">
        <div class="ins-panel-title">🚦 Traffic</div>
        <div class="ins-traffic-grid">
          <div><strong>Peak hours</strong><br>${t.peak_hours || '—'}</div>
          <div><strong>Metro access</strong><br>${t.metro_access || '—'}</div>
          <div><strong>Highway access</strong><br>${t.highway_access || '—'}</div>
          <div><strong>Congestion</strong><br><span class="ins-congestion ins-cong-${(t.congestion_level||'').toLowerCase().replace(/ /g,'')}">${t.congestion_level || '—'}</span></div>
        </div>
      </div>`;
  }

  let amenitiesHtml = '';
  if (d.nearby_amenities) {
    const a = d.nearby_amenities;
    amenitiesHtml = `
      <div class="ins-panel">
        <div class="ins-panel-title">🏪 Nearby Amenities</div>
        ${a.hospitals?.length ? `<div class="ins-amenity-group"><strong>🏥 Hospitals</strong>${fmtList(a.hospitals)}</div>` : ''}
        ${a.malls?.length ? `<div class="ins-amenity-group"><strong>🛍️ Malls & Retail</strong>${fmtList(a.malls)}</div>` : ''}
        ${a.parks?.length ? `<div class="ins-amenity-group"><strong>🌳 Parks</strong>${fmtList(a.parks)}</div>` : ''}
      </div>`;
  }

  const m = (LOCALITY_METRICS[city] || {})[locality];
  const metricsHtml = m ? `
    <div class="ins-panel ins-panel-metrics">
      <div class="ins-panel-title">📊 Property Metrics</div>
      <div class="ins-metrics-row">
        <div class="ins-metric">
          <div class="ins-metric-label">Price Range</div>
          <div class="ins-metric-value">${m.price}</div>
        </div>
        <div class="ins-metric">
          <div class="ins-metric-label">Rental Yield</div>
          <div class="ins-metric-value ins-metric-yield">${m.yield}</div>
        </div>
        <div class="ins-metric">
          <div class="ins-metric-label">Appreciation (10-yr avg)</div>
          <div class="ins-metric-value ins-metric-appr">${m.appr}</div>
        </div>
      </div>
    </div>` : '';

  const chartHtml = (m && m.recentApp) ? `
    <div class="ins-panel ins-panel-chart">
      <div class="ins-panel-title">📉 Price Trend (2015–2030)</div>
      <canvas id="priceChartCanvas"></canvas>
    </div>` : '';

  const detailPanels = d._minimal ? '' : `
    <div class="ins-panel">
      <div class="ins-panel-title">⭐ Specialties</div>
      <div class="ins-specs">${(d.specialties || []).map(s => `<span class="ins-spec-chip">${s}</span>`).join('')}</div>
    </div>
    <div class="ins-panel">
      <div class="ins-panel-title">🏢 Major Employers</div>
      ${fmtList(d.major_employers)}
    </div>
    <div class="ins-panel">
      <div class="ins-panel-title">🏫 Schools</div>
      ${(d.schools || []).map(s => `<div class="ins-list-item">• <strong>${s.name}</strong> <span class="ins-school-type">${s.type}</span>${s.note ? ' — ' + s.note : ''}</div>`).join('')}
    </div>
    ${trafficHtml}
    ${amenitiesHtml}`;

  grid.innerHTML = `
    ${metricsHtml}
    ${chartHtml}
    ${detailPanels}
    <div class="ins-panel ins-panel-invest">
      <div class="ins-panel-title">📈 Investment Outlook</div>
      <div class="ins-invest-note">${d.investment_note || '—'}</div>
      ${d._minimal ? '<p class="ins-research-note">Detailed locality research — schools, employers, traffic, amenities — is being added and will be published soon.</p>' : ''}
    </div>
  `;

  if (m && m.recentApp) buildPriceChart(city, locality, m);

  document.getElementById('insResults').classList.remove('hidden');
}

/* ── Shareable URL ── */
function buildShareUrl() {
  const p = new URLSearchParams({
    hp: parseHpRs('homePrice'),
    r:  parseHpRs('rent'),
    ri: document.getElementById('interestRate').value,
    a:  document.getElementById('appreciation').value,
    ra: document.getElementById('rentAppreciation').value,
    m:  document.getElementById('maintenance').value,
    sr: document.getElementById('stockReturn').value,
    t:  document.getElementById('tenure').value,
    dp: document.getElementById('downPct').value,
  });
  const city = document.getElementById('locCity').value;
  const loc  = document.getElementById('locLocality').value;
  if (city) p.set('city', encodeURIComponent(city));
  if (loc)  p.set('loc',  encodeURIComponent(loc));
  return `${location.origin}${location.pathname}?${p.toString()}`;
}

function shareResult() {
  const url = buildShareUrl();
  const btn = document.getElementById('shareBtn');
  const copy = () => {
    btn.textContent = '✓ Link copied!';
    btn.classList.add('share-copied');
    setTimeout(() => { btn.textContent = '🔗 Share'; btn.classList.remove('share-copied'); }, 2500);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(copy).catch(() => prompt('Copy this link:', url));
  } else {
    prompt('Copy this link:', url);
  }
}

function toggleShareMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('shareMenu');
  menu.classList.toggle('open');
  const close = () => { menu.classList.remove('open'); document.removeEventListener('click', close); };
  if (menu.classList.contains('open')) setTimeout(() => document.addEventListener('click', close), 0);
}

function printPdf() {
  window.print();
}

function emailResult() {
  const url = buildShareUrl();
  const subject = encodeURIComponent('Home Loan ROI Analysis — GoWinDhan');
  const body = encodeURIComponent(
    'Hi,\n\nI ran a home loan ROI analysis on GoWinDhan. Check out the results here:\n\n' + url +
    '\n\nYou can tweak the inputs to see how different scenarios compare.\n\nPowered by GoWinDhan.com'
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function loadFromUrl() {
  const p = new URLSearchParams(location.search);
  if (!p.has('hp') && !p.has('r')) return;

  const setNum = (id, key, fallback) => {
    const v = p.get(key);
    if (v !== null) {
      const el = document.getElementById(id);
      if (el) el.value = v;
    }
  };

  // INR text inputs
  if (p.get('hp')) { setHpInput('homePrice', +p.get('hp')); syncHomePriceSliderFromPrice(+p.get('hp')); updateHomePriceFmt(); }
  if (p.get('r'))  { setHpInput('rent', +p.get('r'));       syncRentSliderFromValue(+p.get('r')); }

  // Number inputs
  setNum('interestRate',    'ri');
  setNum('appreciation',    'a');
  setNum('rentAppreciation','ra');
  setNum('maintenance',     'm');
  setNum('stockReturn',     'sr');

  // Sliders with labels
  if (p.get('t')) {
    document.getElementById('tenure').value = p.get('t');
    document.getElementById('tenureLabel').textContent = p.get('t') + ' years';
  }
  if (p.get('dp')) {
    document.getElementById('downPct').value = p.get('dp');
    document.getElementById('downLabel').textContent = p.get('dp') + '%';
  }

  // Location preset
  const city = p.get('city') ? decodeURIComponent(p.get('city')) : null;
  const loc  = p.get('loc')  ? decodeURIComponent(p.get('loc'))  : null;
  if (city) {
    const cityEl = document.getElementById('locCity');
    if (cityEl) {
      cityEl.value = city;
      cityEl.dispatchEvent(new Event('change'));   // populates locality dropdown
      if (loc) {
        setTimeout(() => {
          const locEl = document.getElementById('locLocality');
          if (locEl) { locEl.value = loc; locEl.dispatchEvent(new Event('change')); }
        }, 0);
      }
    }
  }

  updateLiveEmi();
  setTimeout(calculate, 120);
}

loadFromUrl();

// Re-run calculation when benchmark fund is changed so results stay in sync
(function () {
  const sel = document.getElementById('benchmarkFund');
  if (!sel) return;
  sel.addEventListener('change', function () {
    updateBenchmarkLabels();
    const results = document.getElementById('results');
    if (results && !results.classList.contains('hidden')) calculate();
  });
  updateBenchmarkLabels();
}());
