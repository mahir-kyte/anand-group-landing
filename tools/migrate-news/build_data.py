"""Builds the newsroom CMS feed (news.json) from ANAND's live site data.

Inputs (all fetched from anandgroupindia.com):
  lists.json      - Ajax Load More listings: latest-at-anand, media-coverage, newsletter, per-company listings
  details/<id>.html - full article pages (news-detalis/?arid=<id>)
  scraped pages   - old permalinks (for redirects), matched by title
"""
import json, re, html, os, glob, unicodedata
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SCRAPE = '/Users/mahirmalde/Documents/Documents/Work/Kyte/Anand Group/Anand & Gabriel/Anand Scraping/anandgroupindia_audit/pages'
BASE = 'https://www.anandgroupindia.com'

d = json.load(open(os.path.join(HERE, 'lists.json')))

def clean_ws(s):
    return re.sub(r'\s+', ' ', html.unescape(s or '')).strip()

def norm(s):
    s = unicodedata.normalize('NFKD', clean_ws(s)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()

def slugify(s, n=80):
    s = norm(s).replace(' ', '-')
    return s[:n].rstrip('-')

def parse_date(s):
    s = clean_ws(s)
    s = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', s)
    for fmt in ('%d %B, %Y', '%d %B %Y', '%d %b, %Y', '%B %d, %Y'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%d')
        except ValueError:
            pass
    return None

PUBLISHERS = {
    'livemint.com': 'Mint', 'economictimes.indiatimes.com': 'The Economic Times', 'auto.economictimes.indiatimes.com': 'ETAuto',
    'thehindubusinessline.com': 'BusinessLine', 'autocarpro.in': 'Autocar Professional', 'ptinews.com': 'PTI',
    'business-standard.com': 'Business Standard', 'financialexpress.com': 'Financial Express', 'thehindu.com': 'The Hindu',
    'moneycontrol.com': 'Moneycontrol', 'timesofindia.indiatimes.com': 'The Times of India', 'hindustantimes.com': 'Hindustan Times',
    'autocarindia.com': 'Autocar India', 'cnbctv18.com': 'CNBC-TV18', 'zeebiz.com': 'Zee Business', 'forbesindia.com': 'Forbes India',
    'fortuneindia.com': 'Fortune India', 'outlookindia.com': 'Outlook', 'indianexpress.com': 'The Indian Express',
    'newindianexpress.com': 'The New Indian Express', 'businesstoday.in': 'Business Today', 'ndtv.com': 'NDTV', 'ndtvprofit.com': 'NDTV Profit',
    'etauto.com': 'ETAuto', 'autocomponentsindia.com': 'Auto Components India', 'motorindiaonline.in': 'Motor India',
    'expressmobility.financialexpress.com': 'Express Mobility', 'thestatesman.com': 'The Statesman', 'deccanherald.com': 'Deccan Herald',
    'dnaindia.com': 'DNA', 'businessworld.in': 'BW Businessworld', 'bwautoworld.com': 'BW Auto World', 'rushlane.com': 'Rushlane',
    'autopunditz.com': 'Autopunditz', 'autonews.gaadiwaadi.com': 'Gaadiwaadi', 'evreporter.com': 'EVreporter', 'autotechreview.com': 'Auto Tech Review',
    'reuters.com': 'Reuters', 'bloomberg.com': 'Bloomberg', 'yourstory.com': 'YourStory', 'entrepreneur.com': 'Entrepreneur',
    'afaqs.com': 'afaqs!', 'exchange4media.com': 'exchange4media', 'peoplematters.in': 'People Matters', 'hr.economictimes.indiatimes.com': 'ETHRWorld',
    'energy.economictimes.indiatimes.com': 'ETEnergyWorld', 'economictimes.com': 'The Economic Times', 'dailypioneer.com': 'The Pioneer',
    'tribuneindia.com': 'The Tribune', 'freepressjournal.in': 'Free Press Journal', 'lokmat.com': 'Lokmat', 'bhaskar.com': 'Dainik Bhaskar',
}

def publisher(url):
    m = re.match(r'https?://([^/]+)', url or '')
    if not m:
        return None
    host = m.group(1).lower().removeprefix('www.').removeprefix('m.')
    if host in PUBLISHERS:
        return PUBLISHERS[host]
    for k, v in PUBLISHERS.items():
        if host.endswith('.' + k) or host == k:
            return v
    if 'anandgroupindia.com' in host:
        return None
    base = host.split('.')[0]
    return base.capitalize()

def split_items(h):
    return [b for b in re.split(r'<div class="col-lg-[^"]*">', h) if 'spotContent' in b]

def parse_listing_item(b):
    t = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', b)
    title = clean_ws(re.sub(r'<[^>]+>', ' ', t.group(1))) if t else ''
    h6 = re.search(r'<h6>([\s\S]*?)</h6>', b)
    date, cats = None, []
    if h6:
        parts = re.findall(r'<b>([\s\S]*?)</b>', h6.group(1))
        if parts:
            date = parse_date(parts[0])
        if len(parts) > 1:
            cats = [c.strip() for c in clean_ws(parts[1]).split(',') if c.strip()]
    arid = re.search(r'arid=(\d+)', b)
    ext = re.search(r'<a href="(https?://(?!www\.anandgroupindia\.com)[^"]+)"[^>]*class="readmore"', b)
    pdf = re.search(r'class="downloadPdf"[^>]*href="([^"]+)"|href="([^"]+\.pdf)"', b)
    pdf = (pdf.group(1) or pdf.group(2)) if pdf else None
    # excerpt: the text in the first readmore block (or the free text), minus the repeated bold title
    block = re.search(r'<div class="readmorewithcontent groupPost">([\s\S]*?)<a ', b)
    if block:
        ex = re.sub(r'^\s*<b>[\s\S]*?</b>', '', block.group(1))
    else:
        after = b[h6.end():] if h6 else b
        ex = re.split(r'<a ', after)[0]
    excerpt = clean_ws(re.sub(r'<[^>]+>', ' ', ex))
    return {'title': title, 'date': date, 'categories': cats, 'arid': arid.group(1) if arid else None,
            'externalUrl': ext.group(1) if ext else None, 'pdf': pdf, 'excerpt': excerpt}

ALLOWED = {'p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'blockquote', 'img', 'figure', 'figcaption', 'table', 'tr', 'td', 'th', 'tbody', 'thead'}

def clean_body(raw):
    raw = re.sub(r'<noscript>[\s\S]*?</noscript>', '', raw)
    raw = re.sub(r'<(script|style)[\s\S]*?</\1>', '', raw)
    # unify lazy images to real src
    def img_sub(m):
        tag = m.group(0)
        src = re.search(r'data-lazy-src=["\']?([^"\' >]+)', tag) or re.search(r'\ssrc=["\']?(https?://[^"\' >]+)', tag)
        if not src or src.group(1).startswith('data:'):
            return ''
        return '<img src="%s" alt="">' % src.group(1)
    raw = re.sub(r'<img\b[^>]*>', img_sub, raw)
    def tag_sub(m):
        slash, name, attrs = m.group(1), m.group(2).lower(), m.group(3) or ''
        if name not in ALLOWED:
            return ''
        if name == 'b': name = 'strong'
        if name == 'i': name = 'em'
        if slash:
            return '</%s>' % name
        if name == 'a':
            href = re.search(r'href=["\']?([^"\' >]+)', attrs)
            return '<a href="%s">' % html.escape(html.unescape(href.group(1))) if href else '<a>'
        if name == 'img':
            return m.group(0)
        return '<%s>' % name
    raw = re.sub(r'<(/?)([a-zA-Z0-9]+)((?:\s[^>]*)?)/?>', tag_sub, raw)
    raw = raw.replace('&nbsp;', ' ')
    raw = re.sub(r'<p>\s*(<br>\s*)*</p>', '', raw)
    raw = re.sub(r'(<br>\s*){2,}', '<br>', raw)
    raw = re.sub(r'<(strong|em)>\s*</\1>', '', raw)
    raw = re.sub(r'[ \t\r\f\v]+', ' ', raw)
    raw = re.sub(r'\n\s*', '\n', raw).strip()
    return raw

def parse_detail(arid):
    f = os.path.join(HERE, 'details', f'{arid}.html')
    if not os.path.exists(f) or os.path.getsize(f) < 1000:
        return None
    s = open(f, encoding='utf-8', errors='ignore').read()
    i = s.find('class=postContent')
    if i < 0:
        i = s.find('class="postContent')
    if i < 0:
        return None
    thumb_seg = s[s.find('class=postImg'):i]
    thumb = re.search(r'(?:data-lazy-src|src)=["\']?(https?://[^"\' >]+uploads[^"\' >]+)', thumb_seg)
    seg = s[i:]
    end = min([x for x in [seg.find('class=shareAllThis'), seg.find('<footer'), seg.find('class=backBtn')] if x > 0] or [len(seg)])
    seg = seg[:end]
    h = re.search(r'<h2[^>]*>([\s\S]*?)</h2>', seg)
    title = clean_ws(re.sub(r'<[^>]+>', ' ', h.group(1))) if h else ''
    pub = re.search(r'Published On:\s*</b>\s*([^<]+)<', seg)
    date = parse_date(pub.group(1)) if pub else None
    body_start = seg.find('</h4>') + 5 if '</h4>' in seg else (h.end() if h else 0)
    body = clean_body(seg[body_start:])
    # drop a trailing unclosed div remains
    body = re.sub(r'<div[\s\S]*$', '', body).strip()
    imgs = re.findall(r'<img src="([^"]+)"', body)
    return {'title': title, 'date': date, 'thumb': thumb.group(1) if thumb else None, 'body': body, 'images': imgs}

# legacy permalinks (for 301 redirects), matched by normalised title
legacy = {}
for f in glob.glob(os.path.join(SCRAPE, 'latest-at-anand_*.txt')) + glob.glob(os.path.join(SCRAPE, 'anand-in-media_*.txt')):
    head = open(f, encoding='utf-8', errors='ignore').read(2000)
    u = re.search(r'^URL: (\S+)', head, re.M)
    t = re.search(r'^Title: (.+?)(?: - ANAND Group)?$', head, re.M)
    if u and t:
        legacy.setdefault(norm(t.group(1)), u.group(1))

# company membership, keyed by normalised title + date
companies = d['companies']
membership = {}
for key, h in d['by_company'].items():
    feed, cid = key.split(':')
    name = clean_ws(companies[cid])
    for b in split_items(h):
        it = parse_listing_item(b)
        membership.setdefault((norm(it['title']), it['date']), set()).add(name)

items, seen = [], {}

def add(it, source_feed):
    k = (norm(it['title']), it['date'])
    if k in seen:
        # merge categories from both feeds
        prev = seen[k]
        prev['categories'] = sorted(set(prev['categories']) | set(it['categories']))
        return
    seen[k] = it
    items.append(it)

for feed in ('latest', 'media'):
    for b in split_items(d[feed]['html']):
        it = parse_listing_item(b)
        if not it['title']:
            continue
        cats = it['categories'] or (['Media Coverage'] if feed == 'media' else [])
        kind = 'coverage' if ('Media Coverage' in cats or feed == 'media') and not it['arid'] else 'article'
        rec = {
            'id': None, 'slug': None, 'type': kind,
            'title': it['title'], 'date': it['date'],
            'categories': [c for c in cats if c != 'Media Coverage'] if kind == 'article' else ['Media Coverage'],
            'companies': sorted(membership.get((norm(it['title']), it['date']), [])),
            'excerpt': it['excerpt'],
            'image': None, 'imageAlt': '',
            'body': None,
            'publisher': publisher(it['externalUrl']) if it['externalUrl'] else None,
            'externalUrl': it['externalUrl'],
            'pdf': it['pdf'],
            'legacyUrl': None,
        }
        if it['arid']:
            rec['id'] = int(it['arid'])
            rec['legacyUrl'] = f"{BASE}/newsroom-media/latest-at-anand/news-detalis/?arid={it['arid']}"
            det = parse_detail(it['arid'])
            if det:
                rec['body'] = det['body']
                img = det['thumb'] or (det['images'][0] if det['images'] else None)
                rec['image'] = img
                if img and not det['thumb']:
                    # the first inline image becomes the hero; remove it from the body so it isn't shown twice
                    rec['body'] = re.sub(r'<p>\s*<img src="%s" alt="">\s*</p>|<img src="%s" alt="">' % (re.escape(img), re.escape(img)), '', rec['body'], count=1).strip()
                rec['gallery'] = [x for x in det['images'] if x != img]
        permalink = legacy.get(norm(it['title']))
        if permalink:
            rec['legacyPermalink'] = permalink
        rec['slug'] = slugify(it['title'])
        add(rec, feed)

# unique slugs
used = {}
for it in items:
    s = it['slug'] or 'item'
    if s in used:
        used[s] += 1
        s = f"{s}-{it['date'][:4] if it['date'] else used[s]}"
    used.setdefault(s, 0)
    it['slug'] = s
    if it['id'] is None:
        it['id'] = s

# derive a short excerpt from the body when the listing had none
for it in items:
    if not it['excerpt'] and it['body']:
        txt = clean_ws(re.sub(r'<[^>]+>', ' ', it['body']))
        it['excerpt'] = (txt[:220].rsplit(' ', 1)[0] + '…') if len(txt) > 220 else txt
    if it['excerpt'] and len(it['excerpt']) > 320:
        it['excerpt'] = it['excerpt'][:300].rsplit(' ', 1)[0] + '…'
    it['imageAlt'] = it['title'] if it['image'] else ''

items.sort(key=lambda x: x['date'] or '', reverse=True)

newsletters = []
for b in [x for x in re.split(r'<div class="col-lg-3[^"]*">', d['newsletter']['html']) if 'spotContent' in x]:
    t = re.search(r'<h3>([\s\S]*?)</h3>', b)
    dt = re.search(r'class="dateSection">\s*([^<]+)<', b)
    img = re.search(r'<img src="([^"]+)"', b)
    pdf = re.search(r'class="downloadPdf"[^>]*href="([^"]+)"', b)
    rm = re.search(r'<a href="([^"]+)"[^>]*class="readmore"', b)
    newsletters.append({'title': clean_ws(t.group(1)) if t else '', 'date': parse_date(dt.group(1)) if dt else None,
                        'image': img.group(1) if img else None, 'pdf': pdf.group(1) if pdf else None,
                        'url': (BASE + rm.group(1)) if rm and rm.group(1).startswith('/') else (rm.group(1) if rm else None)})

out = {
    '_about': 'Newsroom CMS feed for the ANAND design reference. Migrated from anandgroupindia.com (Latest at ANAND, Media Coverage, ANAND Newsletter) on 26 Sep 2026. On the live site this comes from WordPress (posts + ACF).',
    'fields': {
        'id': 'Old WordPress article id (arid) for migrated articles; slug otherwise',
        'slug': 'URL slug: newsroom-article.html?slug=<slug> (on the live site /newsroom/news/<slug>/)',
        'type': 'article (full page on this site) | coverage (links out to the publisher or a PDF)',
        'title': 'Headline, as published',
        'date': 'Publish date, ISO',
        'categories': 'Achievement | Celebration | Corporate Announcements | Events | Highlights | Press Release | Media Coverage',
        'companies': 'Group companies the item belongs to (old field company_belongs_to)',
        'excerpt': 'Listing summary',
        'image': 'Hero image (old featured image or first inline image)', 'imageAlt': 'Alt text',
        'gallery': 'Other inline images from the article',
        'body': 'Cleaned article HTML (p, strong, em, lists, links, headings, images)',
        'publisher': 'Media coverage: the publication', 'externalUrl': 'Media coverage: link to the original article',
        'pdf': 'Attached PDF (scans of older coverage, releases)',
        'legacyUrl': 'Old URL, for 301 redirects', 'legacyPermalink': 'Old WordPress permalink, for 301 redirects',
    },
    'taxonomy': {
        'categories': ['Achievement', 'Celebration', 'Corporate Announcements', 'Events', 'Highlights', 'Press Release', 'Media Coverage'],
        'companies': sorted(clean_ws(v) for v in companies.values()),
    },
    'mediaContact': {'name': 'ANAND Group Corporate Communications', 'company': 'ANAND Automotive Limited', 'address': '1, Sri Aurobindo Marg, Hauz Khas, New Delhi 110016',
                     'phone': ['+91-11-26564542', '+91-11-26564666'], 'email': 'group.comms@anandgroupindia.com'},
    'mediaKit': [
        {'title': 'Group Presentation', 'note': 'September 2026', 'url': f'{BASE}/wp-content/uploads/2017/11/ANAND-Group-Presentation-September-2026.pdf', 'image': f'{BASE}/wp-content/uploads/2017/11/t-companypresenation.png'},
        {'title': 'Brand Guidelines', 'note': 'Logo and colour guide', 'url': f'{BASE}/wp-content/uploads/2017/11/ANAND_BrandGuideline_Colour-guide.pdf', 'image': f'{BASE}/wp-content/uploads/2017/11/t-brandguidline-1-1.png'},
        {'title': 'Gallery Downloads', 'note': 'Photos of plants, people and events', 'url': f'{BASE}/newsroom-media/media-kit/gallery-downloads/', 'image': f'{BASE}/wp-content/uploads/2018/02/t-gallerydownload-1.jpg'},
    ],
    'newsletters': newsletters,
    'items': items,
}
dest = os.path.join(HERE, 'news.json')
json.dump(out, open(dest, 'w'), ensure_ascii=False, indent=0)
arts = [i for i in items if i['type'] == 'article']
print('items', len(items), 'articles', len(arts), 'with body', sum(1 for i in arts if i['body']), 'with image', sum(1 for i in items if i['image']),
      'coverage', sum(1 for i in items if i['type'] == 'coverage'), 'with company', sum(1 for i in items if i['companies']),
      'legacy permalinks', sum(1 for i in items if i.get('legacyPermalink')), 'newsletters', len(newsletters))
print('size', os.path.getsize(dest))
