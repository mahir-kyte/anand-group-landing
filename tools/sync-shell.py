"""Copies the shared page shell (nav, dialog, CTA banner, footer) from index.html into the other pages.

index.html is the source. Each shared block sits between <!-- shell:NAME ... --> and <!-- /shell:NAME -->.
Other pages carry the same markers; this script replaces what's between them.
Run from the project folder:  python3 tools/sync-shell.py
"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'index.html').read_text()
blocks = {m.group(2): m.group(1) for m in re.finditer(r'(<!-- shell:(\w+)[^>]*-->[\s\S]*?<!-- /shell:\2 -->)', src)}
pages = [p for p in root.glob('*.html') if p.name != 'index.html']
for page in pages:
    html = page.read_text()
    n = 0
    for name, block in blocks.items():
        pat = re.compile(r'<!-- shell:%s[^>]*-->[\s\S]*?<!-- /shell:%s -->' % (name, name))
        if pat.search(html):
            html = pat.sub(lambda m: block, html); n += 1
    page.write_text(html)
    print(f'{page.name}: {n} blocks synced')
