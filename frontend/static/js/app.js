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

initHpSliderPair('homePrice', 'homePriceSlider', () => {
  updateHomePriceFmt();
  updateLiveEmi();
});
initHpSliderPair('rent', 'rentSlider');
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
    'pane-cashflow','pane-breakdown','pane-benchmarks','pane-scenarios'
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
    // tab-amort lives inside #results which is hidden until first calculation
    if (tab === 'amort') {
      document.getElementById('results').classList.remove('hidden');
    }
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
    },
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
    'Down payment (day 1) + monthly outflow compounded at 10.5%/yr');

  drawInvestmentWealthChart(data.amortisation, s.down_payment);
  drawCostChart(data.amortisation);
  drawPieCharts(data);
  drawCashflowChart(data.amortisation);
  buildRentTable(data.amortisation, s.total_paid);
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
  if (snpEdge >= 0) {
    snpTag = ['good', 'Home beats S&P 500'];
    snpMsg = `Investing the monthly outflow into S&P 500 at 10.5% would grow to <strong>${fmt(snpFinal)}</strong>. Home wealth (equity + rent surplus) of <strong>${fmt(homeWealth)}</strong> leads by <strong>${fmt(snpEdge)}</strong> — buying wins.`;
  } else {
    snpTag = ['bad', 'S&P 500 renter wins'];
    snpMsg = `Investing the monthly outflow into S&P 500 at 10.5% would grow to <strong>${fmt(snpFinal)}</strong> — <strong>${fmt(Math.abs(snpEdge))} more</strong> than home wealth (equity + rent surplus) of <strong>${fmt(homeWealth)}</strong>. The market outpaces property here.`;
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

  /* ── LEFT chart: yearly money committed ── */
  const leftLabels = ['Yr 0', ...yearData.map(d => 'Yr ' + d.year)];
  const annualOutflow = [downPayment, ...yearData.map(d => Math.max(0, -d.annual_net_cf))];

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
        datasets: [{
          label: 'Cash committed',
          data: annualOutflow,
          backgroundColor: leftLabels.map((_, i) => i === 0 ? 'rgba(190,18,60,0.88)' : 'rgba(244,63,94,0.70)'),
          borderRadius: { topLeft: 3, topRight: 3 },
          borderSkipped: 'bottom',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 18, right: 6, bottom: 4 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(8,10,20,0.93)',
            titleColor: '#f1f5f9', bodyColor: '#94a3b8',
            padding: 12, cornerRadius: 10, boxPadding: 5,
            callbacks: {
              title: items => leftLabels[items[0].dataIndex],
              label(c) {
                if (c.dataIndex === 0) return '  Down payment:  ' + fmtCr(downPayment);
                const v = annualOutflow[c.dataIndex];
                return v > 500 ? '  Net outflow:  ' + fmtCr(v) : '  Rent ≥ EMI — no outflow';
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#9ba3ae', font: { size: 10 }, maxTicksLimit: 12 },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#9ba3ae', font: { size: 10.5 }, maxTicksLimit: 6, padding: 6,
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
            backgroundColor: 'rgba(79,111,216,0.82)',
            borderRadius: 0,
            borderSkipped: false,
            stack: 'wealth',
          },
          {
            label: 'Rent surplus (cumul.)',
            data: surplusData,
            backgroundColor: 'rgba(16,185,129,0.78)',
            borderRadius: { topLeft: 3, topRight: 3 },
            borderSkipped: false,
            stack: 'wealth',
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 10, right: 6, bottom: 4 } },
        plugins: {
          legend: {
            display: true, position: 'bottom',
            labels: {
              font: { size: 10.5 }, padding: 14,
              boxWidth: 10, boxHeight: 10,
              color: '#4a4e5a',
              usePointStyle: true, pointStyle: 'rect',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(8,10,20,0.93)',
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
                const total = equityData[idx] + surplusData[idx];
                return ['', '  Total wealth:  ' + fmtCr(total)];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#9ba3ae', font: { size: 10 }, maxTicksLimit: 12 },
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#9ba3ae', font: { size: 10.5 }, maxTicksLimit: 6, padding: 6,
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

/* ── Rent savings table ── */
function buildRentTable(yearData, totalOutflow) {
  const rows = yearData.map((d, i) => {
    const pct  = totalOutflow > 0 ? (d.cum_rent_saved / totalOutflow * 100).toFixed(1) : '—';
    const prev = i > 0 ? yearData[i - 1].rent_saved_year : null;
    const yoy  = prev && prev > 0
      ? `<span style="color:var(--emerald);font-weight:600">+${((d.rent_saved_year / prev - 1) * 100).toFixed(1)}%</span>`
      : '<span style="color:var(--ink-faint)">—</span>';
    return `<tr>
      <td>Year ${d.year}</td>
      <td class="td-pos">${fmt(d.rent_saved_year)}</td>
      <td>${yoy}</td>
      <td class="td-pos">${fmt(d.cum_rent_saved)}</td>
      <td>${pct}%</td>
    </tr>`;
  }).join('');

  const last   = yearData[yearData.length - 1];
  const total  = yearData.reduce((s, d) => s + d.rent_saved_year, 0);
  const totPct = totalOutflow > 0 ? (last.cum_rent_saved / totalOutflow * 100).toFixed(1) : '—';
  const totals = `<tr class="totals-row">
    <td>Total</td>
    <td class="td-pos">${fmt(total)}</td>
    <td>—</td>
    <td class="td-pos">${fmt(last.cum_rent_saved)}</td>
    <td>${totPct}%</td>
  </tr>`;

  document.getElementById('rentBody').innerHTML = rows + totals;
}

/* ── Amortisation table ── */
function buildAmortTable(yearData, breakEvenYear) {
  const rows = yearData.map(d => `
    <tr class="${d.year === breakEvenYear ? 'be-row' : ''}">
      <td>Year ${d.year}</td>
      <td>${fmt(d.emi_paid)}</td>
      <td class="td-pos">${fmt(d.principal)}</td>
      <td class="td-neg">${fmt(d.interest)}</td>
      <td class="td-neg">${fmt(d.maintenance)}</td>
      <td>${fmt(d.loan_balance)}</td>
      <td>${fmt(d.home_value)}</td>
      <td class="${d.net_equity >= 0 ? 'td-pos' : 'td-neg'}">${fmt(d.net_equity)}</td>
      <td class="td-pos">${fmt(d.rent_saved_year)}</td>
      <td class="td-pos">${fmt(d.cum_rent_saved)}</td>
    </tr>
  `).join('');

  const last = yearData[yearData.length - 1];
  const totals = {
    emi:   yearData.reduce((s, d) => s + d.emi_paid,        0),
    prin:  yearData.reduce((s, d) => s + d.principal,       0),
    int:   yearData.reduce((s, d) => s + d.interest,        0),
    maint: yearData.reduce((s, d) => s + d.maintenance,     0),
    rent:  yearData.reduce((s, d) => s + d.rent_saved_year, 0),
  };
  const totalsRow = `
    <tr class="totals-row">
      <td>Totals</td>
      <td>${fmt(totals.emi)}</td>
      <td>${fmt(totals.prin)}</td>
      <td>${fmt(totals.int)}</td>
      <td>${fmt(totals.maint)}</td>
      <td>${fmt(last.loan_balance)}</td>
      <td>${fmt(last.home_value)}</td>
      <td>${fmt(last.net_equity)}</td>
      <td>${fmt(totals.rent)}</td>
      <td>${fmt(last.cum_rent_saved)}</td>
    </tr>`;

  document.getElementById('amortBody').innerHTML = rows + totalsRow;
}

/* ── Home investing vs Stock investing table ── */
function buildHomeVsStockTable(yearData, summary) {
  const tbody = document.getElementById('homeVsStockBody');
  const note  = document.getElementById('homeVsStockNote');

  const crossNote = summary.cf_positive_year
    ? `Rent first exceeds EMI + maintenance in <strong>Year ${summary.cf_positive_year}</strong> — outflow investing stops there, but the S&amp;P 500 portfolio keeps compounding for the rest of the tenure.`
    : `Rent never exceeds EMI + maintenance in this tenure — the outflow is invested into S&amp;P 500 every year.`;
  note.innerHTML = `Down payment is invested on day 1. Each month, <strong>EMI + maintenance − rent</strong> is the outflow — invested into S&amp;P 500 at 10.5%/yr. ${crossNote} Home wealth = final equity + net cash flow (total rent saved − total EMI − total maintenance).`;

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
  syncSliderFromInput('homePriceSlider', 10000000);
  syncSliderFromInput('rentSlider', 30000);
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
        { label: 'S&P 500 renter (10.5%)', data: pad(cdA.snp_portfolio,   maxT), borderColor: '#6DA4C4', tension: 0.4, fill: false, pointRadius: 0, pointHoverRadius: 4, borderWidth: 1.5, borderDash: [3, 3] },
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
  if (tab === 'amort') document.getElementById('results').classList.remove('hidden');
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
(function() {
  const input = document.getElementById('supportSearch');
  if (!input) return;
  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
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
    // Highlight matching category cards
    document.querySelectorAll('.sp-cat').forEach(cat => {
      const keywords = (cat.dataset.filter || '') + ' ' + cat.querySelector('.sp-cat-name').textContent.toLowerCase();
      cat.style.opacity = (!q || keywords.includes(q)) ? '1' : '0.35';
    });
  });
}());

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

  const cities = Object.keys(LOCALITY_DATA).sort();
  cities.forEach(c => {
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

  const cityData = typeof LOCALITY_INSIGHTS !== 'undefined' && LOCALITY_INSIGHTS[city];
  const d = cityData && cityData[locality];
  if (!d || Object.keys(d).length === 0) {
    errEl.textContent = 'Insights for ' + locality + ', ' + city + ' are being researched and will be added soon.';
    errEl.classList.remove('hidden');
    return;
  }
  renderInsights(city, locality, d);
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

  grid.innerHTML = `
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
    ${amenitiesHtml}
    <div class="ins-panel ins-panel-invest">
      <div class="ins-panel-title">📈 Investment Outlook</div>
      <div class="ins-invest-note">${d.investment_note || '—'}</div>
    </div>
  `;

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
  if (p.get('hp')) { setHpInput('homePrice', +p.get('hp')); syncSliderFromInput('homePriceSlider', +p.get('hp')); updateHomePriceFmt(); }
  if (p.get('r'))  { setHpInput('rent', +p.get('r'));       syncSliderFromInput('rentSlider', +p.get('r')); }

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
