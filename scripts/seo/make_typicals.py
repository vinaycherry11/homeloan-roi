"""One-off: draft typical 2BHK price and rent for each researched locality.

Price = typical 2BHK size for the city x midpoint of the locality's price/sqft range.
Rent  = midpoint of the 2BHK rent quoted in the locality note when there is one,
        otherwise price x the gross yield quoted in the note (midpoint, capped 2.5-4.5%),
        otherwise price x the city's typical gross yield.
Writes scripts/seo/typicals.json, which is the file to edit by hand afterwards.
Localities already in typicals.json are kept as they are, so hand edits survive a rerun;
only localities that are new get an estimate.
"""
import json, os, re, sys
data = json.load(open(sys.argv[1]))
SQFT = {'Hyderabad': 1200, 'Bangalore': 1150, 'Pune': 1000, 'Mumbai': 750, 'Delhi NCR': 1300,
        'Chennai': 1050, 'Kolkata': 1000, 'Ahmedabad': 1150}
CITY_YIELD = {'Hyderabad': 3.5, 'Bangalore': 3.8, 'Pune': 3.8, 'Mumbai': 3.2, 'Delhi NCR': 3.2,
              'Chennai': 3.8, 'Kolkata': 3.5, 'Ahmedabad': 3.5}
num = lambda t: float(t.replace(',', ''))
OUT = 'scripts/seo/typicals.json'
old = json.load(open(OUT)) if os.path.exists(OUT) else {}
out = {}
for city, locs in data['insights'].items():
    out[city] = {}
    for loc, ins in locs.items():
        if loc in old.get(city, {}):
            out[city][loc] = old[city][loc]; continue
        m = data['metrics'][city][loc]
        lo, hi = [num(x) for x in re.findall(r'[\d,]+', m['price'])[:2]]
        sqft = SQFT[city]
        price = round(sqft * (lo + hi) / 2 / 500000) * 500000
        note = ins['investment_note']
        rr = re.search(r'2BHK[^.]*?₹([\d,]+)\s*[–-]\s*([\d,]+)/mo', note)
        yr = re.search(r'(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?%\s*(?:gross\s*)?(?:rental\s*)?yield|yields?[^.%]*?(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?%', note, re.I)
        if rr:
            rent = (num(rr.group(1)) + num(rr.group(2))) / 2; src = 'note-rent'
        elif yr:
            g = [x for x in yr.groups() if x]
            y = min(4.5, max(2.5, sum(map(float, g)) / len(g))); rent = price * y / 100 / 12; src = 'note-yield'
        else:
            rent = price * CITY_YIELD[city] / 100 / 12; src = 'city-yield'
        rent = round(rent / 1000) * 1000
        cap = price * 0.045 / 12          # keep every estimate at or below a 4.5% gross yield
        if rent > cap: rent = cap // 1000 * 1000
        rent = int(rent)
        out[city][loc] = {'sqft': sqft, 'price': price, 'rent': rent,
                          'yield': round(rent * 12 / price * 100, 2), 'rent_source': src}
json.dump(out, open(OUT, 'w'), indent=1, ensure_ascii=False)
for c, ls in out.items():
    for l, v in ls.items():
        print(f"{c:10} {l:24} ₹{v['price']/1e5:6.0f}L  rent ₹{v['rent']:>7,}  {v['yield']:4.2f}%  {v['rent_source']}")
