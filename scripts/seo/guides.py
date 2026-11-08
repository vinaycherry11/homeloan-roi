"""Guides, guides hub and EMI calculator page for scripts/seo/build.py.

Each guide has scenarios() (buy vs rent runs it needs from the site's engine, may be empty)
and build(ctx) (writes the page, returns its path). Loan maths that doesn't need the
buy vs rent engine is done here with the same formulas the site uses.
"""
import statistics

AUTHOR = {'@type': 'Person', 'name': 'Sri Naga Vinay Mutyala', 'url': 'https://www.gowindhan.com/about'}


def emi(P, rate, years):
    r, n = rate / 1200, years * 12
    return P / n if r == 0 else P * r * (1 + r) ** n / ((1 + r) ** n - 1)


def fund_monthly(annual):
    return (1 + annual / 100) ** (1 / 12) - 1


def balance_after(P, rate, years, months):
    r, E, b = rate / 1200, emi(P, rate, years), P
    for _ in range(months):
        b = b * (1 + r) - E
    return max(0.0, b)


def article(ctx, path, title, headline, desc, body, extra_schemas=()):
    SITE = ctx['SITE']
    crumbs, bc = ctx['breadcrumbs']([('Home', '/'), ('Guides', '/guides'), (headline, None)])
    schema = {'@context': 'https://schema.org', '@type': 'Article', 'headline': headline, 'description': desc,
              'datePublished': ctx['UPDATED_ISO'], 'dateModified': ctx['UPDATED_ISO'], 'author': AUTHOR,
              'publisher': {'@type': 'Organization', 'name': 'GoWinDhan', 'logo': {'@type': 'ImageObject', 'url': SITE + '/static/img/gwd-bars-logo.png'}},
              'mainEntityOfPage': SITE + path, 'image': SITE + '/static/img/og-card.jpg', 'inLanguage': 'en-IN'}
    full = f'''{crumbs}
<div class="page-eyebrow">Guide</div>
<h1>{ctx["esc"](headline)}</h1>
<p class="updated">By <a href="/about">Sri Naga Vinay Mutyala</a> · Updated {ctx["UPDATED"]}</p>
{body}
<h2>More guides</h2>
<ul>{more_links(path)}</ul>
<div class="callout warn">This guide is for education, not financial advice. Figures are before tax and not adjusted for inflation. Consult a SEBI-registered advisor before a major decision.</div>
'''
    return ctx['write_page'](path, title, desc, full, [bc, schema, *extra_schemas], ctx['cities'], section='guides')


def more_links(current):
    return ''.join(f'<li><a href="{g.path}">{g.headline}</a></li>' for g in GUIDES if g.path != current) + \
        '<li><a href="/emi-calculator">Home loan EMI calculator</a></li><li><a href="/buy-vs-rent">Rent or Buy Index: verdicts by locality</a></li>'


def table(head, rows, cls='data-table'):
    th = ''.join(f'<th>{h}</th>' for h in head)
    tr = '\n'.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="table-wrap"><table class="{cls}"><thead><tr>{th}</tr></thead><tbody>\n{tr}\n</tbody></table></div>'


# ── 1. Buy a house or rent and invest in SIP ───────────────────────────
class BuyVsSip:
    path = '/guides/buy-house-or-rent-and-invest-sip'
    headline = 'Buy a house or rent and invest in a SIP? A worked example'
    PRICE, RENT, RG = 10_000_000, 30_000, 5
    APPS = [4, 5, 6, 7, 8, 9, 10]
    FUNDS = [8, 10, 12, 14]

    def scenarios(self, sc):
        out = [sc(f'sip|a{a}', self.PRICE, self.RENT, a, self.RG) for a in self.APPS]
        out += [sc(f'sip|f{f}', self.PRICE, self.RENT, 7, self.RG, fund=f) for f in self.FUNDS]
        return out

    def build(self, ctx):
        A, res, inr, short, pct, faq_block = ctx['A'], ctx['res'], ctx['inr'], ctx['short'], ctx['pct'], ctx['faq_block']
        base = res['sip|a6']
        be = base['breakeven']
        rows = []
        for a in self.APPS:
            r = res[f'sip|a{a}']
            rows.append([f'{a}% a year', short(r['homeWealth']), short(r['renter']),
                         ('<span class="pill buy">Buy +' if r['edge'] > 0 else '<span class="pill rent">Rent +') + short(abs(r['edge'])) + '</span>'])
        frows = []
        for f in self.FUNDS:
            r = res[f'sip|f{f}']
            frows.append([f'{f}% a year', short(r['renter']), short(r['homeWealth']),
                          ('<span class="pill buy">Buy +' if r['edge'] > 0 else '<span class="pill rent">Rent +') + short(abs(r['edge'])) + '</span>'])
        gap = -base['cfYear1']
        link = ctx['calc_link'](self.PRICE, self.RENT, 6, self.RG)
        fast = [x for x in ctx['all_rows'] if x['app'] > be]
        by = {}
        for x in fast:
            by[x['city']] = by.get(x['city'], 0) + 1
        parts = [f'{v} in {c}' for c, v in sorted(by.items(), key=lambda kv: -kv[1])]
        faster_txt = (f'Over 2014–2024, {len(fast)} of the {len(ctx["all_rows"])} localities we track grew faster than that: '
                      + (', '.join(parts[:-1]) + ' and ' + parts[-1] if len(parts) > 1 else (parts[0] if parts else 'none')) + '.')
        faq, fs = faq_block([
            ('Is it better to buy a house or invest in SIP in India?',
             f'For a ₹1 crore flat renting at ₹30,000 a month, renting and investing in a Nifty 50 index fund SIP wins unless home prices grow faster than about {pct(be)} a year over 20 years. '
             'Above that, buying wins. The answer depends mostly on price growth, the rent you would pay and your loan rate.'),
            ('Why does renting and investing often win?',
             f'Rent is usually only 3–4% of a home’s price a year in Indian cities, while a home loan costs {A["rate"]}%. '
             'The rent you save does not cover the interest, so the flat’s price has to rise quickly to make up the gap.'),
            ('Does rent and invest really work in practice?',
             'Only if you actually invest the difference every month and leave it invested. If the money gets spent, buying usually wins because EMIs force you to save.'),
        ])
        body = f'''<p class="lede">The short answer: for a typical Indian city flat, renting and investing the difference in an index fund SIP comes out ahead <em>unless</em> home prices grow faster than about {pct(be)} a year. Here is the full worked example, with every assumption, so you can see why.</p>

<h2>The setup</h2>
<p>Two people have the same money. One buys a ₹1 crore flat; the other rents the same flat for ₹30,000 a month and invests instead.</p>
<table class="example">
<tr><th>Flat price</th><td>₹1 crore</td></tr>
<tr><th>Rent for the same flat</th><td>₹30,000/month (3.6% of the price a year), rising 5% a year</td></tr>
<tr><th>Home loan</th><td>{A["down"]}% down, {A["rate"]}% for {A["tenure"]} years: EMI {inr(base["emi"])}</td></tr>
<tr><th>Stamp duty + registration</th><td>{A["buyingCost"]}% ({inr(self.PRICE * A["buyingCost"] / 100)})</td></tr>
<tr><th>Maintenance</th><td>{A["maint"]}% of the home value a year</td></tr>
<tr><th>Renter’s investment</th><td>{A["fund_label"]} index fund SIP at {A["fund"]:.0f}% a year</td></tr>
</table>
<p>On day 1 the buyer pays {inr(base["upfront"])} (down payment plus stamp duty). The renter invests that same amount. Each month the buyer pays EMI and maintenance, about {inr(gap)} more than the rent in year 1, and the renter invests that difference as a SIP. So both spend exactly the same money every month; the only question is what it turns into.</p>

<h2>Result after 20 years, by home price growth</h2>
{table(["Home price growth", "Buyer’s wealth (home, loan repaid)", "Renter’s SIP portfolio", "Who is ahead"], rows)}
<p>The two end level at about <strong>{pct(be)}</strong> a year of price growth. {faster_txt} See the <a href="/buy-vs-rent">Rent or Buy Index</a> for every locality.</p>

<h2>What if the SIP returns less?</h2>
<p>Holding home price growth at 7% a year:</p>
{table(["SIP return", "Renter’s portfolio", "Buyer’s wealth", "Who is ahead"], frows)}
<p>The fund return matters as much as the home’s price growth. Equity returns are not guaranteed, and a renter in a bad decade can lose. But a fund at {A["fund"]:.0f}% only has to beat a home that also earns you about 3.6% a year in rent saved.</p>

<h2>What decides it</h2>
<ol>
<li><strong>Price growth.</strong> The single biggest factor. Each extra point a year changes the result by tens of lakhs over 20 years.</li>
<li><strong>Rent compared with price.</strong> The higher the rent relative to the price (the rental yield), the better buying looks. See our <a href="/guides/price-to-rent-ratio-india">price-to-rent guide</a>.</li>
<li><strong>Loan rate.</strong> A lower rate makes buying cheaper every month.</li>
<li><strong>Discipline.</strong> Rent-and-invest only works if the renter invests the difference every month. EMIs force the buyer to save; nothing forces the renter.</li>
</ol>

<h2>Reasons to buy that aren’t in the numbers</h2>
<p>Security of tenure, no landlord, freedom to renovate, and a home that is paid off by retirement are real benefits. If they matter to you, it is reasonable to accept a lower financial return for them. The calculator tells you what that choice costs, so you can decide with your eyes open.</p>

<a class="page-cta" href="{ctx["esc"](link)}">Try it with your own flat →</a>

{faq}
'''
        return article(ctx, self.path, 'Buy a House or Rent and Invest in SIP? Worked Example (2026) | GoWinDhan', self.headline,
                       f'Buy or rent and invest in a SIP? For a ₹1 crore flat renting at ₹30,000, renting and investing wins unless prices grow faster than {pct(be)} a year. Full 20-year worked example.',
                       body, [fs])


# ── 2. 20 vs 30 year home loan ─────────────────────────────────────────
class TwentyVsThirty:
    path = '/guides/home-loan-20-vs-30-years'
    headline = 'Home loan for 20 or 30 years? What the longer tenure really costs'

    def scenarios(self, sc):
        return []

    def build(self, ctx):
        inr, short, pct, faq_block = ctx['inr'], ctx['short'], ctx['pct'], ctx['faq_block']
        rate = ctx['A']['rate']
        rows = []
        for P in [5_000_000, 7_500_000, 10_000_000]:
            for y in [15, 20, 25, 30]:
                E = emi(P, rate, y)
                rows.append([short(P), f'{y} years', inr(E), short(E * y * 12 - P), short(E * y * 12)])
        P = 5_000_000
        e20, e30 = emi(P, rate, 20), emi(P, rate, 30)
        d = e20 - e30
        bal = balance_after(P, rate, 30, 240)
        inv = []
        for f in [8, 10, 12]:
            m = fund_monthly(f)
            corpus = sum(d * (1 + m) ** k for k in range(1, 241))
            inv.append([f'{f}% a year', short(corpus), short(bal), ('<span class="pill buy">30 years + invest ahead by ' if corpus > bal else '<span class="pill rent">20 years ahead by ') + short(abs(corpus - bal)) + '</span>'])
        faq, fs = faq_block([
            ('Is a 30-year home loan a bad idea?',
             f'Not by itself. On a ₹50 lakh loan at {rate}%, 30 years costs {short(e30 * 360 - P)} in interest against {short(e20 * 240 - P)} for 20 years, but the EMI is {inr(d)} lower. '
             'If you invest that difference every month, the longer loan can come out ahead. If you spend it, the shorter loan is cheaper.'),
            ('Can I take 30 years and prepay later?',
             'Yes. Most floating-rate home loans in India have no prepayment penalty for individuals, so a longer tenure with voluntary prepayments gives you a lower required EMI and the option to pay faster.'),
        ])
        body = f'''<p class="lede">A longer home loan cuts your EMI but adds a lot of interest. On a ₹50 lakh loan at {rate}%, going from 20 to 30 years lowers the EMI by {inr(d)} a month and adds {short(e30 * 360 - e20 * 240)} of interest. Whether that is a bad deal depends on what you do with the {inr(d)}.</p>

<h2>EMI and total interest by tenure ({rate}%)</h2>
{table(["Loan", "Tenure", "EMI", "Total interest", "Total paid"], rows)}
<p>Interest grows much faster than the EMI falls: the loan is outstanding for longer, and early EMIs are mostly interest.</p>

<h2>The fair comparison: take 30 years and invest the difference</h2>
<p>Comparing interest alone ignores that the 30-year borrower keeps {inr(d)} a month. Suppose they invest it every month for 20 years. At the end of year 20, the 20-year borrower is debt-free; the 30-year borrower still owes {short(bal)} but has a portfolio.</p>
{table(["Investment return", "Portfolio after 20 years", "Loan still owed", "Result at year 20"], inv)}
<p>At equity-like returns the longer loan plus investing comes out ahead, because the portfolio grows faster than the {rate}% the loan costs. At FD-like returns it does not. Two caveats: the investing has to actually happen every month for 20 years, and equity returns can disappoint.</p>

<h2>How to choose</h2>
<ul>
<li><strong>Pick the shorter tenure</strong> if the EMI is comfortable and you would not reliably invest the difference.</li>
<li><strong>Pick the longer tenure</strong> if a lower EMI gives you breathing room, and prepay or invest when you can. You can always pay faster; you cannot easily make a loan longer.</li>
<li>Keep an emergency fund of 6 months of EMI and expenses before choosing the shortest tenure you can afford.</li>
</ul>
<p>Use the <a href="/emi-calculator">EMI calculator</a> for your loan amount, or the <a href="/">buy vs rent calculator</a>, which lets you change the tenure and see the effect on your wealth.</p>

{faq}
'''
        return article(ctx, self.path, 'Home Loan 20 vs 30 Years: EMI and Interest Compared (2026) | GoWinDhan', self.headline,
                       f'20-year vs 30-year home loan in India: on ₹50 lakh at {rate}%, 30 years cuts the EMI by {inr(d)} but adds {short(e30 * 360 - e20 * 240)} interest. When the longer loan wins.',
                       body, [fs])


# ── 3. Prepay home loan or invest ──────────────────────────────────────
class PrepayOrInvest:
    path = '/guides/prepay-home-loan-or-invest'
    headline = 'Prepay your home loan or invest the money? Worked example'
    P, YEARS, EXTRA = 5_000_000, 20, 10_000

    def scenarios(self, sc):
        return []

    def simulate(self, rate, fund):
        P, n, X = self.P, self.YEARS * 12, self.EXTRA
        r, E, m = rate / 1200, emi(P, rate, self.YEARS), fund_monthly(fund)
        # A: prepay X every month; once the loan is gone, invest EMI + X until month n.
        b, corpus, closed, interest = P, 0.0, None, 0.0
        for k in range(1, n + 1):
            if b > 0:
                i = b * r
                interest += i
                pay = min(E + X, b + i)
                b = b + i - pay
                left = E + X - pay
                if b <= 0.5 and closed is None:
                    closed, b = k, 0
                corpus = corpus * (1 + m) + left
            else:
                corpus = corpus * (1 + m) + E + X
        prepay = corpus
        # B: pay the EMI as normal, invest X every month.
        invest = sum(X * (1 + m) ** j for j in range(n))
        normal_interest = E * n - P
        return dict(closed=closed, prepay=prepay, invest=invest, saved=normal_interest - interest, E=E)

    def build(self, ctx):
        inr, short, pct, faq_block = ctx['inr'], ctx['short'], ctx['pct'], ctx['faq_block']
        rate = ctx['A']['rate']
        base = self.simulate(rate, 12)
        yrs = base['closed'] / 12
        rows = []
        for f in [7, 8.5, 10, 12]:
            s = self.simulate(rate, f)
            ahead = s['invest'] - s['prepay']
            rows.append([f'{f}% a year', short(s['prepay']), short(s['invest']),
                         ('<span class="pill buy">Invest ahead by ' if ahead > 0 else '<span class="pill rent">Prepay ahead by ') + short(abs(ahead)) + '</span>'])
        rrows = []
        for lr in [7.5, 8.5, 9.5, 10.5]:
            s = self.simulate(lr, 12)
            ahead = s['invest'] - s['prepay']
            rrows.append([f'{lr}%', f'{s["closed"] / 12:.1f} years', short(s['saved']),
                          ('<span class="pill buy">Invest +' if ahead > 0 else '<span class="pill rent">Prepay +') + short(abs(ahead)) + '</span>'])
        faq, fs = faq_block([
            ('Should I prepay my home loan or invest?',
             f'Compare your loan rate with the after-tax return you can reliably earn. Prepaying gives a guaranteed return equal to your loan rate ({rate}% here). '
             'Investing in equity has beaten that over long periods, but with ups and downs. If the return you expect is not clearly above your loan rate, prepay.'),
            ('Is prepaying a home loan a good idea?',
             f'It is a safe, guaranteed return. Prepaying ₹10,000 a month on a ₹50 lakh, {rate}% loan closes it in about {yrs:.1f} years instead of 20 and saves about {short(base["saved"])} of interest.'),
            ('Does tax change the answer?',
             'It can. Under the old tax regime, home-loan interest on a self-occupied home is deductible up to ₹2 lakh a year, which lowers the loan’s real cost. '
             'Equity gains are taxed when you sell. Both tilt the comparison, so check your own tax position.'),
        ])
        body = f'''<p class="lede">You have a ₹50 lakh home loan at {rate}% for 20 years and ₹10,000 a month to spare. Prepay the loan, or start a SIP? Prepaying closes the loan in about {yrs:.1f} years and saves about {short(base["saved"])} of interest. Investing comes out ahead only if your investments earn clearly more than {rate}%.</p>

<h2>The comparison</h2>
<p>To keep it fair, both options spend the same money every month for 20 years: EMI of {inr(base["E"])} plus ₹10,000.</p>
<ul>
<li><strong>Prepay:</strong> pay {inr(base["E"] + self.EXTRA)} a month until the loan is gone, then invest that full amount every month until year 20.</li>
<li><strong>Invest:</strong> pay the normal EMI and invest ₹10,000 a month for 20 years.</li>
</ul>
<p>At year 20 both are debt-free. What differs is the size of the portfolio.</p>

<h2>Portfolio after 20 years, by investment return ({rate}% loan)</h2>
{table(["Investment return", "Prepay first, then invest", "Invest from day 1", "Result"], rows)}
<p>The break-even is close to the loan rate itself: if your money earns more than {rate}%, investing wins; less, and prepaying wins. Prepaying is a guaranteed {rate}% return; equity is not guaranteed.</p>

<h2>Does your loan rate change it?</h2>
<p>With investments earning 12% a year:</p>
{table(["Loan rate", "Loan closes in (prepaying)", "Interest saved by prepaying", "Result"], rrows)}

<h2>A sensible middle path</h2>
<ul>
<li>Build an emergency fund first.</li>
<li>If your loan rate is high (above about 9.5%), prepaying is hard to beat on a risk-adjusted basis.</li>
<li>If it is low and you have a long horizon, investing has the edge, but split the money if the volatility would worry you.</li>
<li>When prepaying, ask the bank to <em>reduce the tenure</em>, not the EMI. That is what saves the most interest.</li>
</ul>
<p>See also: <a href="/guides/home-loan-20-vs-30-years">20 vs 30 year home loans</a> and the <a href="/emi-calculator">EMI calculator</a>.</p>

{faq}
'''
        return article(ctx, self.path, 'Prepay Home Loan or Invest in SIP? Worked Example (2026) | GoWinDhan', self.headline,
                       f'Prepay your home loan or invest? On ₹50 lakh at {rate}%, prepaying ₹10,000 a month saves {short(base["saved"])} of interest; investing wins only if returns beat {rate}%.',
                       body, [fs])


# ── 4. Price-to-rent ratio ─────────────────────────────────────────────
class PriceToRent:
    path = '/guides/price-to-rent-ratio-india'
    headline = 'Price-to-rent ratio in India: what it tells you about buying vs renting'

    def scenarios(self, sc):
        return []

    def build(self, ctx):
        inr, short, pct, esc, slug, faq_block = ctx['inr'], ctx['short'], ctx['pct'], ctx['esc'], ctx['slug'], ctx['faq_block']
        rows = ctx['all_rows']
        for x in rows:
            x['ptr'] = x['price'] / (x['rent'] * 12)
        bands = [(0, 23.5, 'Below 23.5'), (23.5, 26, '23.5 to 26'), (26, 29, '26 to 29'), (29, 99, '29 and above')]
        brows = []
        for lo, hi, label in bands:
            xs = [x for x in rows if lo <= x['ptr'] < hi]
            if not xs:
                continue
            bes = [x['r']['breakeven'] for x in xs if x['r']['breakeven'] is not None]
            brows.append([label, str(len(xs)), f'{sum(1 for x in xs if x["verdict"][0] == "buy")} of {len(xs)}',
                          pct(statistics.median(bes)) if bes else '—'])
        city_rows = []
        for c in ctx['cities']:
            xs = ctx['by_city'][c]
            p = sorted(x['ptr'] for x in xs)
            city_rows.append([f'<a href="/buy-vs-rent/{slug(c)}">{esc(c)}</a>', f'{statistics.median(p):.0f}', f'{p[0]:.0f} to {p[-1]:.0f}'])
        lo_x = min(rows, key=lambda x: x['ptr'])
        hi_x = max(rows, key=lambda x: x['ptr'])
        faq, fs = faq_block([
            ('What is the price-to-rent ratio?',
             'The price of a home divided by one year’s rent for it. A ₹1 crore flat renting for ₹30,000 a month (₹3.6 lakh a year) has a ratio of about 28: it costs 28 years of rent.'),
            ('What is a good price-to-rent ratio for buying?',
             'Lower is better for buyers. In our data, localities below about 23.5 need noticeably less price growth for buying to win than those above 29. '
             'But no ratio alone settles it: price growth and your loan rate matter just as much.'),
            ('What is the rental yield?',
             'Rental yield is the flip side: one year’s rent divided by the price. A ratio of 28 is a yield of about 3.6%. Indian city homes typically yield 3–4.5% gross, well below home-loan rates.'),
        ])
        body = f'''<p class="lede">The price-to-rent ratio is the home’s price divided by a year’s rent. It tells you how many years of rent the home costs, and so how much the rent you save pays you back. In our data on {len(rows)} localities it ranges from {lo_x["ptr"]:.0f} ({esc(lo_x["loc"])}, {esc(lo_x["city"])}) to {hi_x["ptr"]:.0f} ({esc(hi_x["loc"])}, {esc(hi_x["city"])}).</p>

<h2>How to work it out</h2>
<div class="formula">Price-to-rent ratio = Home price ÷ (Monthly rent × 12)<br>Gross rental yield = 1 ÷ ratio = (Monthly rent × 12) ÷ Home price</div>
<p>Example: a ₹1 crore flat renting for ₹30,000 a month. ₹1,00,00,000 ÷ ₹3,60,000 = <strong>27.8</strong>, a gross yield of <strong>3.6%</strong>.</p>

<h2>Why it matters</h2>
<p>When you buy, you stop paying rent. That saved rent is your return on the home, on top of any price rise. At a ratio of 28, the saved rent is 3.6% of the price a year, while a home loan costs around 8.5%. The gap has to be made up by price growth. The higher the ratio, the more growth you need.</p>

<h2>What our data shows</h2>
{table(["Price-to-rent ratio", "Localities", "Buying wins at the 10-yr trend", "Median growth buying needs"], brows)}
<p>Lower ratios need less price growth for buying to win. But the ratio is not the whole story: whether a locality actually delivers that growth decides the verdict.</p>

<h2>By city</h2>
{table(["City", "Median ratio", "Range"], city_rows)}

<h2>Rules of thumb (and their limits)</h2>
<ul>
<li>Below about 20: buying looks good on the numbers almost anywhere. Rare in Indian metros today.</li>
<li>20 to 30: depends on price growth. This is most of urban India.</li>
<li>Above 30: renting and investing usually wins unless prices rise fast.</li>
</ul>
<p>These ignore your loan rate, tenure, and how much the price will actually grow. For a proper answer, put your numbers into the <a href="/">buy vs rent calculator</a> or look up your locality in the <a href="/buy-vs-rent">Rent or Buy Index</a>.</p>

{faq}
'''
        return article(ctx, self.path, 'Price-to-Rent Ratio in India: Buy vs Rent Rule of Thumb (2026) | GoWinDhan', self.headline,
                       f'Price-to-rent ratio explained with data from {len(rows)} Indian localities: how to calculate it, what is good, and how it changes the buy vs rent decision.',
                       body, [fs])


# ── 5. Cost of a ₹50 lakh home loan ────────────────────────────────────
class FiftyLakh:
    path = '/guides/50-lakh-home-loan-emi-and-interest'
    headline = '₹50 lakh home loan: EMI, total interest and what you really pay'
    P = 5_000_000

    def scenarios(self, sc):
        return []

    def build(self, ctx):
        inr, short, pct, faq_block = ctx['inr'], ctx['short'], ctx['pct'], ctx['faq_block']
        rate, P = ctx['A']['rate'], self.P
        E = emi(P, rate, 20)
        r = rate / 1200
        b, yrows, cum_i = P, [], 0
        for y in range(1, 21):
            yi = yp = 0
            for _ in range(12):
                i = b * r
                yi += i
                yp += E - i
                b -= E - i
            cum_i += yi
            if y in (1, 2, 5, 10, 15, 20):
                yrows.append([f'Year {y}', inr(yi), inr(yp), f'{yi / (E * 12) * 100:.0f}%', short(max(b, 0))])
        rrows = [[f'{x}%', inr(emi(P, x, 20)), short(emi(P, x, 20) * 240 - P)] for x in [7.5, 8, 8.5, 9, 9.5, 10]]
        trows = [[f'{y} years', inr(emi(P, rate, y)), short(emi(P, rate, y) * y * 12 - P)] for y in [10, 15, 20, 25, 30]]
        total_i = E * 240 - P
        faq, fs = faq_block([
            ('What is the EMI for a ₹50 lakh home loan?',
             f'At {rate}% for 20 years, about {inr(E)} a month. At 8% it is {inr(emi(P, 8, 20))}; at 9% it is {inr(emi(P, 9, 20))}.'),
            ('How much interest will I pay on a ₹50 lakh home loan?',
             f'About {short(total_i)} over 20 years at {rate}%, so you repay {short(E * 240)} in total, {E * 240 / P:.1f} times what you borrowed.'),
            ('What salary do I need for a ₹50 lakh home loan?',
             f'Banks usually keep all EMIs under about 40–50% of take-home pay. An EMI of {inr(E)} suggests a take-home income of roughly {inr(E / 0.45)} a month or more, before other loans.'),
        ])
        body = f'''<p class="lede">A ₹50 lakh home loan at {rate}% for 20 years has an EMI of <strong>{inr(E)}</strong>. Over the full term you pay about <strong>{short(total_i)}</strong> in interest, so the loan costs {short(E * 240)} in total.</p>

<h2>Where the money goes, year by year</h2>
{table(["Year", "Interest paid", "Principal repaid", "Share of EMI that is interest", "Loan left at year end"], yrows)}
<p>In the first year about {yrows[0][3]} of every EMI is interest. That is why prepaying early saves the most, and why the loan barely shrinks in the first few years.</p>

<h2>EMI at different interest rates (20 years)</h2>
{table(["Rate", "EMI", "Total interest"], rrows)}
<p>Each 0.5% on the rate changes the EMI by roughly ₹1,500–1,600 a month and total interest by about ₹4 lakh. It is worth negotiating, and switching lenders if your rate is well above new-borrower rates.</p>

<h2>EMI at different tenures ({rate}%)</h2>
{table(["Tenure", "EMI", "Total interest"], trows)}
<p>Longer tenures cut the EMI but sharply raise the interest. See <a href="/guides/home-loan-20-vs-30-years">20 vs 30 year loans</a> for when the longer tenure still makes sense.</p>

<h2>Costs on top of the loan</h2>
<ul>
<li><strong>Down payment:</strong> banks lend up to 75–90% of the property value, so a ₹50 lakh loan usually goes with a ₹60–65 lakh home and a ₹10–15 lakh down payment.</li>
<li><strong>Stamp duty and registration:</strong> roughly 5–8% of the property value depending on the state, paid upfront and not covered by the loan.</li>
<li><strong>Processing fee, insurance and maintenance</strong> add more.</li>
</ul>
<p>Before deciding, check whether buying actually beats renting for your flat in the <a href="/">buy vs rent calculator</a>, or use the <a href="/emi-calculator">EMI calculator</a> for any loan amount.</p>

{faq}
'''
        return article(ctx, self.path, '₹50 Lakh Home Loan EMI, Total Interest and Real Cost (2026) | GoWinDhan', self.headline,
                       f'₹50 lakh home loan at {rate}% for 20 years: EMI {inr(E)}, total interest {short(total_i)}. Year-by-year split, EMI at every rate and tenure.',
                       body, [fs])


GUIDES = [BuyVsSip(), PrepayOrInvest(), TwentyVsThirty(), PriceToRent(), FiftyLakh()]


# ── guides hub ─────────────────────────────────────────────────────────
def build_hub(ctx):
    esc = ctx['esc']
    blurbs = {
        BuyVsSip.path: 'A ₹1 crore flat, worked through for 20 years. When renting and investing beats buying, and by how much.',
        PrepayOrInvest.path: 'Spare ₹10,000 a month? Compare prepaying the loan with a SIP, at different returns and loan rates.',
        TwentyVsThirty.path: 'What a longer tenure really costs, and when taking it and investing the difference comes out ahead.',
        PriceToRent.path: 'The quickest way to judge a city or flat, with data from 79 localities.',
        FiftyLakh.path: 'EMI, total interest, and the year-by-year interest split on a ₹50 lakh loan.',
    }
    cards = ''.join(f'<a class="card" href="{g.path}"><strong>{esc(g.headline)}</strong><span>{esc(blurbs[g.path])}</span></a>' for g in GUIDES)
    crumbs, bc = ctx['breadcrumbs']([('Home', '/'), ('Guides', None)])
    body = f'''{crumbs}
<div class="page-eyebrow">Guides</div>
<h1>Buy vs rent and home loan guides</h1>
<p class="lede">Plain-language answers to the money questions around buying a home in India, each worked through with real numbers.</p>
<div class="card-grid">{cards}</div>
<h2>Tools</h2>
<div class="card-grid">
<a class="card" href="/"><strong>Buy vs rent calculator</strong><span>Your flat, your rent, your loan: see which leaves you richer, year by year.</span></a>
<a class="card" href="/buy-vs-rent"><strong>Rent or Buy Index</strong><span>Verdicts for 79 localities in 8 cities, with prices, rents and yields.</span></a>
<a class="card" href="/emi-calculator"><strong>EMI calculator</strong><span>EMI, total interest and repayment for any home loan.</span></a>
</div>
'''
    return ctx['write_page']('/guides', 'Home Buying and Home Loan Guides for India | GoWinDhan',
                             'Guides on buying vs renting, SIP vs home, prepaying a home loan, loan tenure and price-to-rent ratio in India, each with worked numbers.',
                             body, [bc], ctx['cities'], section='guides')


# ── EMI calculator page ────────────────────────────────────────────────
def build_emi(ctx):
    inr, short, faq_block = ctx['inr'], ctx['short'], ctx['faq_block']
    rate = ctx['A']['rate']
    amounts = [2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 20_000_000]
    tenures = [10, 15, 20, 25, 30]
    rows = [[short(P)] + [inr(emi(P, rate, y)) for y in tenures] for P in amounts]
    rrows = [[f'{x}%'] + [inr(emi(5_000_000, x, y)) for y in (15, 20, 30)] for x in [7.5, 8, 8.5, 9, 9.5, 10, 10.5]]
    e = emi(5_000_000, rate, 20)
    faq, fs = faq_block([
        ('How is home loan EMI calculated?',
         'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan, r is the yearly rate ÷ 12 ÷ 100 and n is the number of months. Indian banks use this reducing-balance formula.'),
        ('What is the EMI for a ₹50 lakh home loan for 20 years?',
         f'About {inr(e)} a month at {rate}%. Total interest over 20 years is about {short(e * 240 - 5_000_000)}.'),
        ('Does a lower EMI mean a cheaper loan?',
         'No. A longer tenure lowers the EMI but increases the total interest a lot. Compare total interest, not just the EMI.'),
        ('Is the EMI the full cost of owning a home?',
         'No. You also pay the down payment, stamp duty and registration, maintenance and property tax. To see whether buying beats renting overall, use the buy vs rent calculator.'),
    ])
    crumbs, bc = ctx['breadcrumbs']([('Home', '/'), ('EMI calculator', None)])
    app_schema = {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'GoWinDhan Home Loan EMI Calculator',
                  'url': ctx['SITE'] + '/emi-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Any',
                  'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'INR'}}
    body = f'''{crumbs}
<div class="page-eyebrow">Calculator</div>
<h1>Home loan EMI calculator</h1>
<p class="updated">Updated {ctx["UPDATED"]}</p>
<p class="lede">Enter your loan amount, interest rate and tenure to see your monthly EMI, the total interest and the total you will repay.</p>

<form class="emi-form" id="emiForm" onsubmit="return false">
  <label>Loan amount (₹)<input id="eP" type="text" inputmode="numeric" value="50,00,000" autocomplete="off"></label>
  <label>Interest rate (% a year)<input id="eR" type="number" inputmode="decimal" value="{rate}" min="0" max="30" step="0.05"></label>
  <label>Tenure (years)<input id="eN" type="number" inputmode="numeric" value="20" min="1" max="40" step="1"></label>
</form>
<div class="stat-grid" aria-live="polite">
  <div class="stat"><div class="s-label">Monthly EMI</div><div class="s-value" id="oE">—</div></div>
  <div class="stat"><div class="s-label">Total interest</div><div class="s-value" id="oI">—</div></div>
  <div class="stat"><div class="s-label">Total repaid</div><div class="s-value" id="oT">—</div></div>
  <div class="stat"><div class="s-label">Interest share of EMI in month 1</div><div class="s-value" id="oS">—</div></div>
</div>
<p>Next step: the EMI is only part of the cost. <a href="/">See whether buying beats renting and investing</a> for your flat.</p>

<h2>EMI table at {rate}%</h2>
{table(["Loan", *[f"{y} years" for y in tenures]], rows)}

<h2>EMI on ₹50 lakh at different rates</h2>
{table(["Rate", "15 years", "20 years", "30 years"], rrows)}

<h2>How EMI works</h2>
<div class="formula">EMI = P × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)</div>
<p>P is the loan amount, r is the monthly rate (yearly rate ÷ 12 ÷ 100) and n is the number of monthly payments. Each month, interest is charged on the balance still owed and the rest of the EMI repays the loan. Early EMIs are mostly interest; later ones are mostly principal. The <a href="/guides/50-lakh-home-loan-emi-and-interest">₹50 lakh loan guide</a> shows the split year by year.</p>

{faq}

<script>
(function () {{
  var P = document.getElementById('eP'), R = document.getElementById('eR'), N = document.getElementById('eN');
  function num(v) {{ return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0; }}
  function rs(v) {{ return '₹' + Math.round(v).toLocaleString('en-IN'); }}
  function run() {{
    var p = num(P.value), r = num(R.value) / 1200, n = Math.round(num(N.value) * 12);
    if (!p || !n) {{ ['oE','oI','oT','oS'].forEach(function (id) {{ document.getElementById(id).textContent = '—'; }}); return; }}
    var g = Math.pow(1 + r, n), e = r ? p * r * g / (g - 1) : p / n;
    document.getElementById('oE').textContent = rs(e);
    document.getElementById('oI').textContent = rs(e * n - p);
    document.getElementById('oT').textContent = rs(e * n);
    document.getElementById('oS').textContent = Math.round(p * r / e * 100) + '%';
  }}
  P.addEventListener('input', function () {{
    var d = String(P.value).replace(/[^0-9]/g, '');
    P.value = d ? Number(d).toLocaleString('en-IN') : '';
    run();
  }});
  R.addEventListener('input', run); N.addEventListener('input', run);
  run();
}})();
</script>
'''
    return ctx['write_page']('/emi-calculator', 'Home Loan EMI Calculator India: EMI, Interest and Tables (2026) | GoWinDhan',
                             f'Free home loan EMI calculator for India. Monthly EMI, total interest and total repayment, plus EMI tables for ₹20 lakh to ₹2 crore at {rate}%.',
                             body, [bc, app_schema, fs], ctx['cities'])
