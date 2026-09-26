import json, re
n = json.load(open('news.json'))
IDS = [44562, 22141, 21468, 20567, 20557, 14996, 20310, 20308, 20039, 13862,
       20442, 20574, 20350, 20318, 20320, 20330, 20332, 20549, 20312, 20447]
by = {i['id']: i for i in n['items']}
arts = [by[i] for i in IDS if i in by]
cov = [i for i in n['items'] if i['type'] == 'coverage' and i['externalUrl'] and i['publisher'] not in ('Youtube',)][:12]
# company tags: derived from company names in the title/excerpt/body (the old company_belongs_to field wasn't migrated)
ALIASES = {
    'Gabriel India': ['gabriel'], 'Dana Anand India': ['dana anand', 'dana '], 'HL Mando Anand India': ['mando'],
    'Joyson ANAND Abhishek Safety Systems': ['joyson', 'takata'], 'Henkel ANAND India': ['henkel'], 'Inalfa Roof Systems': ['inalfa'],
    'Haldex ANAND India': ['haldex'], 'ANAND CY Myutec Automotive': ['anand cy myutec', 'acym'], 'CY Myutec ANAND': ['cy myutec anand'],
    'ANAND I-Power': ['i-power', 'ipower'], 'Valeo Friction Materials India': ['valeo'], 'Jinhap Gabriel Auto India': ['jinhap'],
    'MAHLE ANAND Thermal Systems': ['mahle anand thermal', 'mats'], 'MAHLE ANAND Filter Systems': ['mahle anand filter', 'mafs'],
    'Faurecia Clean Mobility': ['faurecia'], 'Anchemco ANAND': ['anchemco'], 'Ansysco ANAND': ['ansysco'],
    'HL Klemove': ['hl klemove', 'klemove'], 'ANEVOLVE': ['anevolve'], 'SNS Foundation': ['sns foundation', 'snsf'], 'SUJÁN': ['sujan', 'suján'],
}
def tag(it):
    txt = ' ' + re.sub(r'<[^>]+>', ' ', ' '.join([it['title'], it.get('excerpt') or '', it.get('body') or ''])).lower() + ' '
    tags = [name for name, keys in ALIASES.items() if any(re.search(r'(?<![a-z])' + re.escape(k.strip()) + r'(?![a-z])', txt) for k in keys)]
    return tags or ['ANAND Group']
items = []
for it in arts + cov:
    it = dict(it)
    it['companies'] = tag(it)
    it.pop('legacyPermalink', None) if not it.get('legacyPermalink') else None
    items.append(it)
items.sort(key=lambda x: x['date'] or '', reverse=True)
# featured: the four newest articles with images
feat = [i['slug'] for i in items if i['type'] == 'article'][:4]
for i in items: i['featured'] = i['slug'] in feat
out = {k: n[k] for k in ('_about', 'fields', 'taxonomy', 'mediaContact', 'mediaKit')}
out['_about'] = ('Newsroom CMS feed for the ANAND design reference: a representative sample migrated from anandgroupindia.com on 26 Sep 2026 '
                 '(20 full articles from Latest at ANAND across every category, the 12 newest media-coverage links, the 8 newest newsletters). '
                 'On the live site this comes from WordPress (posts + ACF). Images and PDFs are still hosted on anandgroupindia.com.')
out['fields']['companies'] = 'Group companies the item is about. In this sample they are derived from company names in the text (the old company_belongs_to field was not migrated); confirm during the real migration'
out['fields']['featured'] = 'Shown in the newsroom hero carousel (max 4)'
out['newsletters'] = n['newsletters'][:8]
out['items'] = items
dest = '/Users/mahirmalde/Documents/Documents/Work/Kyte/Anand Group/Anand & Gabriel/Anand Moodboard/anand-landing/data/newsroom.json'
json.dump(out, open(dest, 'w'), ensure_ascii=False, indent=1)
import os
print(len(arts), 'articles', len(cov), 'coverage', os.path.getsize(dest), 'bytes')
for i in items: print(i['date'], i['type'][:3], ','.join(i['categories']), '|', ','.join(i['companies']), '|', i['title'][:55])
