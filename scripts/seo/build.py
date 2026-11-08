#!/usr/bin/env python3
"""Build GoWinDhan's content pages and sitemap.

    python3 scripts/seo/build.py

Writes into frontend/:
  buy-vs-rent.html                      Rent or Buy Index (every researched locality)
  buy-vs-rent/<city>.html               one page per city
  buy-vs-rent/<city>/<locality>.html    one page per researched locality
  emi-calculator.html                   EMI calculator + tables
  guides.html, guides/<slug>.html       guides
  sitemap.xml

Every number comes from the site's own data and engine:
  - locality data: LOCALITY_DATA / LOCALITY_METRICS in frontend/static/js/app.js and
    frontend/static/js/locality-insights.js (read with scripts/extract-data.js)
  - typical 2BHK price and rent: scripts/seo/typicals.json (edit by hand)
  - buy vs rent results: api/_lib/simulation.js (run with scripts/seo/compute.js)
Needs macOS (uses JavaScriptCore to run the JS). Re-run after changing any of the above,
then commit the generated files.
"""
import html, json, os, re, statistics, subprocess, tempfile
from urllib.parse import urlencode

from guides import GUIDES  # noqa: E402  (same folder)

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
FE = os.path.join(REPO, 'frontend')
JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc'
SITE = 'https://www.gowindhan.com'
YEAR = '2026'
UPDATED = 'November 2026'
UPDATED_ISO = '2026-11-08'
CSS = '<link rel="stylesheet" href="/static/css/style.css?v=features63">\n<link rel="stylesheet" href="/static/css/page.css?v=2">'

# Same defaults as the calculator on the home page.
A = dict(rate=8.5, tenure=20, down=20, maint=0.5, fund=12.0, fund_label='Nifty 50', buyingCost=7)
CLOSE = 0.5   # trend within this many points of break-even growth = "close call"


# ── helpers ────────────────────────────────────────────────────────────
esc = html.escape


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('–', '-')).strip('-')


def inr(n):
    neg = n < 0
    s = str(int(round(abs(n))))
    if len(s) > 3:
        head = re.sub(r'(\d)(?=(\d\d)+$)', r'\1,', s[:-3])
        s = head + ',' + s[-3:]
    return ('−' if neg else '') + '₹' + s


def short(n):
    a, sign = abs(n), ('−' if n < 0 else '')
    if a >= 1e7:
        return f'{sign}₹{a / 1e7:.2f} Cr'
    if a >= 1e5:
        v = f'{a / 1e5:.1f}'.rstrip('0').rstrip('.')
        return f'{sign}₹{v} L'
    return sign + inr(a)


def pct(x, d=1):
    return f'{x:.{d}f}%'


def run_js(script, *args):
    out = subprocess.run([JSC, script, '--', *args], capture_output=True, text=True, check=True).stdout
    return json.loads(out.strip().splitlines()[-1])


def simulate(scenarios):
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump(scenarios, f)
    try:
        res = run_js(os.path.join(HERE, 'compute.js'), REPO, f.name)
    finally:
        os.unlink(f.name)
    return {r['id']: r for r in res}


def scenario(id, price, rent, app, rent_growth, **kw):
    s = dict(id=id, price=price, rent=rent, app=app, rentGrowth=rent_growth, rate=A['rate'], maint=A['maint'],
             fund=A['fund'], tenure=A['tenure'], down=A['down'], buyingCost=A['buyingCost'])
    s.update(kw)
    return s


def calc_link(price, rent, app, rent_growth, city=None, loc=None):
    p = dict(hp=int(price), r=int(rent), ri=A['rate'], a=app, ra=rent_growth, m=A['maint'],
             bc=A['buyingCost'], t=A['tenure'], dp=A['down'])
    if city:
        p['city'] = city
    if loc:
        p['loc'] = loc
    return '/?' + urlencode(p)


def verdict_of(app, r):
    be = r['breakeven']
    if be is not None and abs(app - be) < CLOSE:
        return 'close', 'Close call'
    return ('buy', 'Buying wins') if r['buyingWins'] else ('rent', 'Rent and Invest wins')


def pill(kind, label):
    cls = {'buy': 'buy', 'rent': 'rent'}.get(kind, '')
    return f'<span class="pill {cls}">{esc(label)}</span>' if cls else f'<span class="pill" style="background:var(--amber-100);color:var(--amber-600)">{esc(label)}</span>'


# ── page shell ─────────────────────────────────────────────────────────
NAV = '''<nav>
  <a class="nav-logo" href="/" aria-label="GoWinDhan home">
    <svg class="nav-logo-icon" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0"  y="18" width="9" height="10" rx="2.5" fill="#93c5fd"/>
      <rect x="12" y="10" width="9" height="18" rx="2.5" fill="#60a5fa"/>
      <rect x="24" y="2"  width="9" height="26" rx="2.5" fill="#f59e0b"/>
    </svg>
    Go<span class="logo-win">Win</span><span class="logo-dhan">Dhan</span>
  </a>
  <div class="nav-links">
    <a href="/" class="hide-sm">Calculator</a>
    <a href="/buy-vs-rent"{a_cities}>Cities</a>
    <a href="/guides"{a_guides}>Guides</a>
    <a href="/about" class="hide-sm">About</a>
  </div>
</nav>'''


def footer(cities):
    city_links = '\n    '.join(f'<a href="/buy-vs-rent/{slug(c)}">Buy vs rent in {esc(c)}</a>' for c in cities)
    return f'''<footer>
  <div class="footer-links">
    <a href="/">Calculator</a>
    <a href="/buy-vs-rent">Rent or Buy Index</a>
    <a href="/emi-calculator">EMI calculator</a>
    <a href="/guides">Guides</a>
    <a href="/how-it-works">How it works</a>
    <a href="/about">About</a>
    <a href="/about#contact">Contact</a>
  </div>
  <div class="footer-links">
    {city_links}
  </div>
  <div class="footer-legal">
    GoWinDhan is an educational tool, not financial advice. Figures are estimates — consult a SEBI-registered advisor before major financial decisions.
  </div>
</footer>'''


def breadcrumbs(items):
    """items: [(name, path-or-None)]. Returns (html, schema)."""
    parts = []
    for i, (name, path) in enumerate(items):
        if i:
            parts.append('<span aria-hidden="true">›</span>')
        parts.append(f'<a href="{path}">{esc(name)}</a>' if path and i < len(items) - 1 else f'<span>{esc(name)}</span>')
    schema = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': name, **({'item': SITE + (path if path != '/' else '/')} if path else {})}
        for i, (name, path) in enumerate(items)]}
    return f'<div class="crumbs">{"".join(parts)}</div>', schema


def faq_block(qas):
    body = '\n'.join(f'<details><summary>{esc(q)}</summary><p>{a}</p></details>' for q, a in qas)
    schema = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub(r'<[^>]+>', '', a)}}
        for q, a in qas]}
    return f'<h2>Questions people ask</h2>\n<div class="faq">\n{body}\n</div>', schema


def write_page(path, title, desc, body, schemas, cities, section=None, wide=False, og_title=None, extra_head=''):
    url = SITE + path
    ld = '\n'.join(f'<script type="application/ld+json">\n{json.dumps(s, ensure_ascii=False, indent=1)}\n</script>' for s in schemas)
    nav = NAV.format(a_cities=' aria-current="page"' if section == 'cities' else '',
                     a_guides=' aria-current="page"' if section == 'guides' else '')
    doc = f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{esc(og_title or title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:site_name" content="GoWinDhan">
<meta property="og:locale" content="en_IN">
<meta property="og:image" content="{SITE}/static/img/og-card.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE}/static/img/og-card.jpg">
{ld}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sniglet:wght@400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/static/img/gwd-bars-logo.png">
{CSS}
{extra_head}</head>
<body>

{nav}

<main class="page{' wide' if wide else ''}">
{body}
</main>

{footer(cities)}

</body>
</html>
'''
    out = os.path.join(FE, path.lstrip('/') + '.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w') as f:
        f.write(doc)
    return path


ASSUMPTIONS = (f'Typical 2BHK prices and rents are our estimates for {YEAR}, not listings. '
               f'Loan at {A["rate"]}% for {A["tenure"]} years with {A["down"]}% down; '
               f'{A["buyingCost"]}% stamp duty + registration (actual rates vary by state); '
               f'maintenance {A["maint"]}% of the home value a year; the renter invests in a {A["fund_label"]} index fund at {A["fund"]:.0f}% a year. '
               'Price and rent growth follow each locality’s 2014–2024 trend, which may not continue. Figures are before tax and not adjusted for inflation.')


# ── locality page ──────────────────────────────────────────────────────
def locality_page(city, loc, ins, ld, typ, r, siblings, city_note, cities):
    cslug, lslug = slug(city), slug(loc)
    price, rent, sqft = typ['price'], typ['rent'], typ['sqft']
    app, rg = ld['app'], ld['rent']
    kind, label = verdict_of(app, r)
    be = r['breakeven']
    ptr = price / (rent * 12)
    yld = rent * 12 / price * 100
    edge = r['edge']
    gap = -r['cfYear1']
    link = calc_link(price, rent, app, rg, city, loc)

    if kind == 'buy':
        head = f'Buying a 2BHK in {loc} comes out ahead'
        lead = (f'If prices keep rising at {loc}’s 10-year trend of {pct(app)} a year, buying leaves you about '
                f'<strong>{short(edge)}</strong> richer after {A["tenure"]} years than renting and investing the difference.')
    elif kind == 'rent':
        head = f'Renting and investing comes out ahead in {loc}'
        lead = (f'Even if prices keep rising at {loc}’s 10-year trend of {pct(app)} a year, renting and investing the money '
                f'you would have spent on the home leaves you about <strong>{short(-edge)}</strong> richer after {A["tenure"]} years.')
    else:
        head = f'Buying vs renting in {loc} is a close call'
        lead = (f'At {loc}’s 10-year price trend of {pct(app)} a year, the two choices end up within '
                f'<strong>{short(abs(edge))}</strong> of each other after {A["tenure"]} years ({"buying" if edge > 0 else "renting"} slightly ahead). '
                'Small changes in price growth, rent or your loan rate decide it.')
    if be is None:
        be_line = f'Buying {"wins" if r["buyingWins"] else "loses"} at any price growth between −10% and 30% a year.'
    else:
        diff = app - be
        be_line = (f'Buying wins only if prices grow faster than <strong>{pct(be)}</strong> a year. '
                   f'{loc}’s 10-year trend is {abs(diff):.1f} points {"above" if diff >= 0 else "below"} that.')

    crumbs, bc_schema = breadcrumbs([('Home', '/'), ('Buy vs rent', '/buy-vs-rent'),
                                      (city, f'/buy-vs-rent/{cslug}'), (loc, None)])
    stats = [
        (f'Typical 2BHK price ({sqft:,} sq ft)', short(price)),
        ('Typical 2BHK rent', inr(rent) + '/mo'),
        ('Gross rental yield', pct(yld)),
        ('Price-to-rent ratio', f'{ptr:.0f} years'),
        ('Price growth, 10-yr avg', pct(app) + '/yr'),
        ('Rent growth, 10-yr avg', pct(rg) + '/yr'),
        (f'EMI ({A["tenure"]} yrs, {A["rate"]}%)', inr(r['emi'])),
        ('Cash needed on day 1', short(r['upfront'])),
    ]
    stat_html = '\n'.join(f'<div class="stat"><div class="s-label">{esc(a)}</div><div class="s-value">{b}</div></div>' for a, b in stats)

    rows = [
        (f'Cash on day 1 ({A["down"]}% down + {A["buyingCost"]}% stamp duty)', inr(r['upfront'])),
        ('Monthly EMI', inr(r['emi'])),
        ('Owning costs more than renting in year 1 by' if gap > 0 else 'Owning costs less than renting in year 1 by', inr(abs(gap)) + '/mo'),
        (f'Home value after {A["tenure"]} years', short(r['finalHome'])),
        ('Buyer’s wealth (home, loan repaid, + any invested surplus)', short(r['homeWealth'])),
        (f'Renter’s {A["fund_label"]} portfolio', short(r['renter'])),
        ('Difference', ('Buying ahead by ' if edge > 0 else 'Renting ahead by ') + short(abs(edge))),
        ('Buyer’s annual return (IRR)', (pct(r['irr']) if r['irr'] is not None else '—') + f' vs {A["fund"]:.0f}% for the fund'),
    ]
    table = '\n'.join(f'<tr><th>{esc(a)}</th><td>{b}</td></tr>' for a, b in rows)

    about = [f'<p>{esc(ins["overview"])}</p>']
    if ins.get('specialties'):
        about.append('<ul class="chips">' + ''.join(f'<li>{esc(s)}</li>' for s in ins['specialties']) + '</ul>')
    if ins.get('major_employers'):
        about.append(f'<p><strong>Major employers nearby:</strong> {esc(", ".join(ins["major_employers"]))}.</p>')
    tr = ins.get('traffic') or {}
    conn = [(k, tr.get(f)) for k, f in [('Metro', 'metro_access'), ('Highway', 'highway_access'), ('Peak traffic', 'peak_hours'), ('Congestion', 'congestion_level')] if tr.get(f)]
    if conn:
        about.append('<h3>Getting around</h3><ul>' + ''.join(f'<li><strong>{k}:</strong> {esc(v)}</li>' for k, v in conn) + '</ul>')
    if ins.get('schools'):
        about.append('<h3>Schools</h3><ul>' + ''.join(
            f'<li>{esc(s["name"])} ({esc(s.get("type", ""))}){" — " + esc(s["note"]) if s.get("note") else ""}</li>' for s in ins['schools']) + '</ul>')
    am = ins.get('nearby_amenities') or {}
    am_rows = [(k, am.get(f)) for k, f in [('Hospitals', 'hospitals'), ('Malls', 'malls'), ('Parks', 'parks')] if am.get(f)]
    if am_rows:
        about.append('<h3>Nearby</h3><ul>' + ''.join(f'<li><strong>{k}:</strong> {esc(", ".join(v))}</li>' for k, v in am_rows) + '</ul>')
    if ins.get('investment_note'):
        about.append(f'<h3>Investment view</h3><p>{esc(ins["investment_note"])}</p>')

    sib = '\n'.join(f'<li><a href="/buy-vs-rent/{cslug}/{slug(n)}">{esc(n)}</a> {pill(*v)}</li>' for n, v in siblings if n != loc)

    faq, faq_schema = faq_block([
        (f'Is it better to buy or rent in {loc}?',
         f'{re.sub(r"<[^>]+>", "", lead)} {re.sub(r"<[^>]+>", "", be_line)} This assumes a typical 2BHK at about {short(price)}, '
         f'{A["rate"]}% home loan for {A["tenure"]} years and a {A["fund_label"]} index fund at {A["fund"]:.0f}% a year for the renter.'),
        (f'What is the rental yield in {loc}?',
         f'About {pct(yld)} gross for a typical 2BHK: roughly {inr(rent)} a month on a home worth about {short(price)}. '
         f'That is a price-to-rent ratio of {ptr:.0f}, meaning the home costs {ptr:.0f} years of rent.'),
        (f'What is the EMI on a 2BHK in {loc}?',
         f'About {inr(r["emi"])} a month on a {short(r["loan"])} loan ({A["down"]}% down on a {short(price)} home) at {A["rate"]}% for {A["tenure"]} years. '
         f'In year 1, owning costs about {inr(abs(gap))} a month {"more" if gap > 0 else "less"} than renting the same flat, after maintenance.'),
        (f'How fast have property prices grown in {loc}?',
         f'About {pct(app)} a year on average over 2014–2024, with rents growing about {pct(rg)} a year ({esc(city_note)}). Past growth is not a promise of future growth.'),
    ])

    body = f'''{crumbs}
<div class="page-eyebrow">Buy vs rent · {esc(city)}</div>
<h1>Buy or rent in {esc(loc)}, {esc(city)}? ({YEAR})</h1>
<p class="updated">Updated {UPDATED} · Typical 2BHK, {A["tenure"]}-year view</p>

<div class="verdict-box {kind if kind != 'close' else ''}">
  <div class="vb-label">Our verdict {pill(kind, label)}</div>
  <div class="vb-head">{esc(head)}</div>
  <p>{lead}</p>
  <p>{be_line}</p>
</div>

<a class="page-cta" href="{esc(link)}">Run {esc(loc)} with your own numbers →</a>

<h2>{esc(loc)} in numbers</h2>
<div class="stat-grid">
{stat_html}
</div>

<h2>The {A["tenure"]}-year comparison</h2>
<p>The buyer pays the down payment and stamp duty on day 1, then the EMI and maintenance each month. The renter puts the same day-1 money into a {A["fund_label"]} index fund, pays rent, and each month invests whatever the buyer spends over rent. Whoever spends less in a month invests the difference, so both start and continue with the same money.</p>
<table class="example">
{table}
</table>
<p>Rent avoided is the buyer’s return on the flat, on top of price growth. Here that is a {pct(yld)} yield, against a {A["rate"]}% loan rate, which is why price growth has to do most of the work for buying to win.</p>

<h2>About {esc(loc)}</h2>
{"".join(about)}

<h2>Other localities in {esc(city)}</h2>
<ul class="link-grid">
{sib}
</ul>
<p><a href="/buy-vs-rent/{cslug}">See all {esc(city)} localities side by side →</a></p>

{faq}

<div class="callout warn"><strong>How we worked this out.</strong> {esc(ASSUMPTIONS)} <a href="/how-it-works">How the calculator works</a>.</div>
'''
    title = f'Buy or Rent in {loc}, {city}? {YEAR} Verdict for a 2BHK | GoWinDhan'
    desc = (f'{label} in {loc}: 2BHK ~{short(price)}, rent ~{inr(rent)}/mo ({pct(yld)} yield). '
            f'Buying needs {pct(be) + "/yr" if be is not None else "trend"} price growth. EMI and 20-year comparison.')
    return write_page(f'/buy-vs-rent/{cslug}/{lslug}', title, desc, body, [bc_schema, faq_schema], cities, section='cities')


# ── city page ──────────────────────────────────────────────────────────
def locality_table(rows, show_city=False):
    head = ('<th>Locality</th>' + ('<th>City</th>' if show_city else '') +
            '<th>Verdict</th><th>2BHK price</th><th>Rent / mo</th><th>Gross yield</th><th>Price growth (10-yr)</th><th>Buying wins above</th>')
    body = []
    for x in rows:
        cells = f'<td><a href="/buy-vs-rent/{slug(x["city"])}/{slug(x["loc"])}">{esc(x["loc"])}</a></td>'
        if show_city:
            cells += f'<td>{esc(x["city"])}</td>'
        be = x['r']['breakeven']
        cells += (f'<td>{pill(*x["verdict"])}</td><td>{short(x["price"])}</td><td>{inr(x["rent"])}</td><td>{pct(x["yield"])}</td>'
                  f'<td>{pct(x["app"])}</td><td>{pct(be) if be is not None else "—"}</td>')
        body.append(f'<tr>{cells}</tr>')
    return f'<div class="table-wrap"><table class="data-table"><thead><tr>{head}</tr></thead><tbody>\n' + '\n'.join(body) + '\n</tbody></table></div>'


def city_page(city, rows, other_locs, note, cities):
    cslug = slug(city)
    n = len(rows)
    nbuy = sum(1 for x in rows if x['verdict'][0] == 'buy')
    nclose = sum(1 for x in rows if x['verdict'][0] == 'close')
    med_y = statistics.median(x['yield'] for x in rows)
    med_ptr = statistics.median(x['price'] / (x['rent'] * 12) for x in rows)
    bes = [x['r']['breakeven'] for x in rows if x['r']['breakeven'] is not None]
    med_be = statistics.median(bes)
    best = rows[0]
    worst = rows[-1]
    crumbs, bc_schema = breadcrumbs([('Home', '/'), ('Buy vs rent', '/buy-vs-rent'), (city, None)])
    nrent = n - nbuy - nclose
    if nbuy == 0 and nclose == 0:
        city_summary = 'Even if prices keep rising at their 10-year trends, renting and investing the difference comes out ahead in <strong>every one</strong>.'
    elif nbuy == 0:
        city_summary = (f'If prices keep rising at their 10-year trends, buying does not clearly win anywhere: <strong>{nclose}</strong> '
                        f'{"is a close call" if nclose == 1 else "are close calls"} and renting and investing wins in the other {nrent}.')
    else:
        close_txt = ''
        if nclose:
            close_txt = f', <strong>{nclose}</strong> ' + ('is a close call' if nclose == 1 else 'are close calls') + ','
        rest_txt = f'the other {nrent}' if nrent else 'none'
        city_summary = (f'If prices keep rising at their 10-year trends, buying comes out ahead in <strong>{nbuy}</strong>'
                        f'{close_txt} and renting and investing wins in {rest_txt}.')
    others = ''
    if other_locs:
        others = (f'<h2>More {esc(city)} localities in the calculator</h2><p>The calculator also has 10-year price and rent trends for these {esc(city)} localities. '
                  'Pick one in the calculator’s locality list to fill in its trends:</p><ul class="link-grid">' +
                  ''.join(f'<li>{esc(l)} <span style="color:var(--ink-faint)">· {pct(v["app"])}/yr</span></li>' for l, v in other_locs) + '</ul>')
    city_links = ''.join(f'<li><a href="/buy-vs-rent/{slug(c)}">{esc(c)}</a></li>' for c in cities if c != city)

    faq, faq_schema = faq_block([
        (f'Is it better to buy or rent in {city}?',
         f'It depends on the locality. In our {YEAR} model of a typical 2BHK, buying comes out ahead in {nbuy} of {n} {city} localities '
         f'if prices keep rising at their 10-year trend{f", and {nclose} are close calls" if nclose else ""}. Buying wins where prices have grown faster than about {pct(med_be)} a year, the median break-even here.'),
        (f'What is the rental yield in {city}?',
         f'Gross rental yields for a typical 2BHK in our {city} localities are around {pct(med_y)} (median), so a home costs about {med_ptr:.0f} years of rent.'),
        (f'Where does buying make the most sense in {city}?',
         f'{best["loc"]}, where the 10-year price trend ({pct(best["app"])}) is furthest above the growth buying needs. '
         f'Renting and investing is strongest in {worst["loc"]}.'),
    ])

    body = f'''{crumbs}
<div class="page-eyebrow">Buy vs rent · {esc(city)}</div>
<h1>Buy or rent in {esc(city)}? Verdict for {n} localities ({YEAR})</h1>
<p class="updated">Updated {UPDATED}</p>
<p class="lede">We ran GoWinDhan’s buy vs rent model on a typical 2BHK in {n} {esc(city)} localities. {city_summary}</p>

<div class="stat-grid">
<div class="stat"><div class="s-label">Localities where buying wins</div><div class="s-value">{nbuy} of {n}</div></div>
<div class="stat"><div class="s-label">Median gross rental yield</div><div class="s-value">{pct(med_y)}</div></div>
<div class="stat"><div class="s-label">Median price-to-rent ratio</div><div class="s-value">{med_ptr:.0f} years</div></div>
<div class="stat"><div class="s-label">Median growth buying needs</div><div class="s-value">{pct(med_be)}/yr</div></div>
</div>

<h2>Every locality, side by side</h2>
{locality_table(rows)}
<p class="table-note">Sorted from most to least favourable for buying. “Buying wins above” is the yearly price growth at which buying and renting end level after {A["tenure"]} years. Trends: {esc(note)}.</p>

<h2>How to read this</h2>
<p>A home pays you back in two ways: the rent you no longer pay and the rise in its price. In {esc(city)} the rent part is about {pct(med_y)} a year, well below a {A["rate"]}% home loan, so price growth has to do most of the work. Where a locality’s past growth sits above the “buying wins above” figure, buying has come out ahead; where it sits below, renting and investing the difference in a {A["fund_label"]} index fund has.</p>
<p>These are typical flats and past trends. Your own flat, rent and loan rate can change the answer, so <a href="/">run your numbers in the calculator</a>.</p>

{others}

{faq}

<h2>Other cities</h2>
<ul class="link-grid">{city_links}<li><a href="/buy-vs-rent">All cities: Rent or Buy Index</a></li></ul>

<div class="callout warn"><strong>How we worked this out.</strong> {esc(ASSUMPTIONS)} <a href="/how-it-works">How the calculator works</a>.</div>
'''
    title = f'Buy or Rent in {city}? {YEAR} Locality-by-Locality Verdict | GoWinDhan'
    desc = (f'Buy or rent in {city}? Buying wins in {nbuy} of {n} localities in our {YEAR} model of a typical 2BHK. '
            f'Prices, rents and yields for each.')
    return write_page(f'/buy-vs-rent/{cslug}', title, desc, body, [bc_schema, faq_schema], cities, section='cities', wide=True)


# ── index page ─────────────────────────────────────────────────────────
def index_page(all_rows, by_city, cities):
    n = len(all_rows)
    nbuy = sum(1 for x in all_rows if x['verdict'][0] == 'buy')
    nclose = sum(1 for x in all_rows if x['verdict'][0] == 'close')
    summary = []
    for c in cities:
        rows = by_city[c]
        bes = [x['r']['breakeven'] for x in rows if x['r']['breakeven'] is not None]
        summary.append(f'<tr><td><a href="/buy-vs-rent/{slug(c)}">{esc(c)}</a></td><td>{len(rows)}</td>'
                       f'<td>{sum(1 for x in rows if x["verdict"][0] == "buy")}</td>'
                       f'<td>{pct(statistics.median(x["yield"] for x in rows))}</td>'
                       f'<td>{statistics.median(x["price"] / (x["rent"] * 12) for x in rows):.0f}</td>'
                       f'<td>{pct(statistics.median(bes))}</td></tr>')
    top = [x for x in all_rows if x['verdict'][0] == 'buy'][:5]
    bottom = list(reversed(all_rows))[:5]
    li = lambda xs: ''.join(f'<li><a href="/buy-vs-rent/{slug(x["city"])}/{slug(x["loc"])}">{esc(x["loc"])}, {esc(x["city"])}</a>: '
                            f'10-yr trend {pct(x["app"])}, buying needs {pct(x["r"]["breakeven"]) if x["r"]["breakeven"] is not None else "—"}</li>' for x in xs)
    crumbs, bc_schema = breadcrumbs([('Home', '/'), ('Buy vs rent', None)])
    allbe = sorted(x['r']['breakeven'] for x in all_rows if x['r']['breakeven'] is not None)
    q1, q3 = allbe[len(allbe) // 4], allbe[3 * len(allbe) // 4]
    ptrs = [x['price'] / (x['rent'] * 12) for x in all_rows]
    dataset = {'@context': 'https://schema.org', '@type': 'Dataset', 'name': f'GoWinDhan Rent or Buy Index {YEAR}',
               'description': f'Buy vs rent verdict, typical 2BHK price and rent, gross rental yield and break-even price growth for {n} localities in {len(cities)} Indian cities.',
               'url': SITE + '/buy-vs-rent', 'creator': {'@type': 'Organization', 'name': 'GoWinDhan', 'url': SITE + '/'},
               'dateModified': UPDATED_ISO, 'spatialCoverage': 'India', 'isAccessibleForFree': True}
    faq, faq_schema = faq_block([
        ('Is it better to buy or rent a house in India?',
         f'In our {YEAR} model of a typical 2BHK, buying comes out ahead in {nbuy} of {n} localities across {len(cities)} cities if prices keep rising at their 10-year trends. '
         'Buying wins mainly in fast-growing IT corridors; in expensive, slower-growing markets like most of Mumbai and South Delhi, renting and investing the difference wins.'),
        ('What price growth does buying need to beat renting?',
         f'With a {A["rate"]}% loan and a {A["fund_label"]} fund at {A["fund"]:.0f}%, half our localities need prices to grow between {pct(q1)} and {pct(q3)} a year for buying to win, '
         'because rental yields of 3–4.5% are well below the loan rate.'),
        ('What is a good price-to-rent ratio in India?',
         f'Price-to-rent ratio is the home price divided by a year’s rent. Our localities range from about {min(ptrs):.0f} to {max(ptrs):.0f}. The lower it is, the more the rent you save pays back the price, '
         'and the less price growth buying needs. See our <a href="/guides/price-to-rent-ratio-india">price-to-rent guide</a>.'),
    ])
    body = f'''{crumbs}
<div class="page-eyebrow">Rent or Buy Index {YEAR}</div>
<h1>Buy or rent? Verdicts for {n} localities across {len(cities)} Indian cities</h1>
<p class="updated">Updated {UPDATED}</p>
<p class="lede">For each locality we priced a typical 2BHK, estimated its rent, and ran GoWinDhan’s {A["tenure"]}-year buy vs rent model. If prices keep growing at their 10-year trends, buying comes out ahead in <strong>{nbuy}</strong> of {n} localities{f" and <strong>{nclose}</strong> are close calls" if nclose else ""}.</p>

<h2>By city</h2>
<div class="table-wrap"><table class="data-table"><thead><tr><th>City</th><th>Localities</th><th>Buying wins</th><th>Median yield</th><th>Median price-to-rent</th><th>Median growth buying needs</th></tr></thead><tbody>
{"".join(summary)}
</tbody></table></div>

<h2>Where buying has the strongest case</h2>
<ol>{li(top)}</ol>
<h2>Where renting and investing has the strongest case</h2>
<ol>{li(bottom)}</ol>

<h2>All {n} localities</h2>
{locality_table(all_rows, show_city=True)}
<p class="table-note">Sorted from most to least favourable for buying: by how far the 10-year price trend sits above the growth buying needs.</p>

<h2>Method</h2>
<ul>
<li><strong>Typical 2BHK price:</strong> the middle of each locality’s price-per-sq-ft range times a typical 2BHK size for the city ({esc(", ".join(f"{c} {s:,} sq ft" for c, s in SQFT_SEEN.items()))}).</li>
<li><strong>Rent:</strong> the 2BHK rent from our locality research where we have one, otherwise the price times the locality’s gross yield, capped at 4.5%.</li>
<li><strong>Growth:</strong> each locality’s 2014–2024 price and rent growth, blended from RBI House Price Index, Anarock, Knight Frank and 99acres data.</li>
<li><strong>Model:</strong> {esc(ASSUMPTIONS)}</li>
</ul>
<p>The full method, with every formula, is on <a href="/how-it-works">How it works</a>. You can rerun any locality with your own numbers from its page.</p>

{faq}
'''
    title = f'Rent or Buy Index {YEAR}: Buy vs Rent Verdict for {n} Localities in India | GoWinDhan'
    desc = (f'Buy or rent in India? Verdicts for {n} localities across {len(cities)} cities, with 2BHK prices, rents, '
            'yields and the price growth buying needs.')
    return write_page('/buy-vs-rent', title, desc, body, [bc_schema, dataset, faq_schema], cities, section='cities', wide=True)


SQFT_SEEN = {}


def main():
    data = run_js(os.path.join(REPO, 'scripts', 'extract-data.js'), REPO)
    typ = json.load(open(os.path.join(HERE, 'typicals.json')))
    cities = list(typ.keys())

    scen = []
    for c, locs in typ.items():
        for l, t in locs.items():
            ld = data['data'][c]['localities'][l]
            scen.append(scenario(f'{c}|{l}', t['price'], t['rent'], ld['app'], ld['rent']))
            SQFT_SEEN.setdefault(c, t['sqft'])
    for g in GUIDES:
        scen += g.scenarios(scenario)
    res = simulate(scen)

    pages = []
    all_rows, by_city = [], {}
    for c, locs in typ.items():
        rows = []
        for l, t in locs.items():
            ld = data['data'][c]['localities'][l]
            r = res[f'{c}|{l}']
            be = r['breakeven']
            rows.append(dict(city=c, loc=l, price=t['price'], rent=t['rent'], yield_=None, app=ld['app'], rg=ld['rent'], r=r,
                             verdict=verdict_of(ld['app'], r), margin=(ld['app'] - be) if be is not None else (99 if r['buyingWins'] else -99)))
            rows[-1]['yield'] = t['rent'] * 12 / t['price'] * 100
        rows.sort(key=lambda x: -x['margin'])
        by_city[c] = rows
        all_rows += rows
        sib = [(x['loc'], x['verdict']) for x in rows]
        note = data['data'][c]['note']
        for x in rows:
            pages.append(locality_page(c, x['loc'], data['insights'][c][x['loc']], data['data'][c]['localities'][x['loc']],
                                       typ[c][x['loc']], x['r'], sib, note, cities))
        other = [(l, v) for l, v in data['data'][c]['localities'].items() if l not in locs]
        pages.append(city_page(c, rows, other, note, cities))
    all_rows.sort(key=lambda x: -x['margin'])
    pages.append(index_page(all_rows, by_city, cities))

    ctx = dict(A=A, res=res, all_rows=all_rows, by_city=by_city, cities=cities, inr=inr, short=short, pct=pct, esc=esc,
               slug=slug, calc_link=calc_link, breadcrumbs=breadcrumbs, faq_block=faq_block, write_page=write_page,
               YEAR=YEAR, UPDATED=UPDATED, UPDATED_ISO=UPDATED_ISO, SITE=SITE)
    for g in GUIDES:
        pages.append(g.build(ctx))
    from guides import build_hub, build_emi
    pages.append(build_hub(ctx))
    pages.append(build_emi(ctx))

    write_sitemap(pages)
    print(f'Wrote {len(pages)} pages + sitemap.xml')


def write_sitemap(pages):
    static = [('/', '1.0', 'weekly'), ('/how-it-works', '0.8', 'monthly'), ('/about', '0.6', 'monthly')]
    prio = lambda p: ('0.9' if p in ('/buy-vs-rent', '/emi-calculator') else '0.8' if p.count('/') <= 2 else '0.7')
    entries = static + [(p, prio(p), 'monthly') for p in sorted(pages)]
    body = '\n'.join(f'  <url>\n    <loc>{SITE}{p if p != "/" else "/"}</loc>\n    <lastmod>{UPDATED_ISO}</lastmod>\n'
                     f'    <changefreq>{cf}</changefreq>\n    <priority>{pr}</priority>\n  </url>' for p, pr, cf in entries)
    with open(os.path.join(FE, 'sitemap.xml'), 'w') as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n')


if __name__ == '__main__':
    main()
