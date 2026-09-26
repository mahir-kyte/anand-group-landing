// Newsroom: renders newsroom.html and newsroom-article.html from data/newsroom.json (the CMS feed).
// On the live site the same fields come from WordPress (posts + ACF); see HANDOFF.md §9.
(() => {
  const page = document.body.dataset.page;
  if (page !== 'newsroom' && page !== 'article') return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'}) : '';
  const shortDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).toUpperCase() : '';
  const isExt = it => it.type === 'coverage';
  const href = it => isExt(it) ? (it.externalUrl || it.pdf) : `newsroom-article.html?slug=${encodeURIComponent(it.slug)}`;
  const extAttrs = it => isExt(it) ? ' target="_blank" rel="noopener"' : '';
  const label = it => isExt(it) ? 'Media Coverage' : (it.categories.find(c => c !== 'Highlights') || it.categories[0] || 'News');
  const icons = () => window.lucide && lucide.createIcons();
  const mark = '<svg class="nw-feat-mark" viewBox="0 0 120 60" aria-hidden="true"><path fill="#fff" d="M0 0h26l30 30-30 30H0l30-30z"/><path fill="#fff" d="M40 0h26l30 30-30 30H40l30-30z"/></svg>';

  // one news row: date | category + title (+ companies) | picture (or the publication on a soft tile)
  const row = it => `
    <a class="nw-row rv" href="${esc(href(it))}"${extAttrs(it)}>
      <time class="acc acc--date" datetime="${esc(it.date)}">${esc(fmtDate(it.date))}</time>
      <div class="nw-row-main">
        <div class="acc acc--cat">${esc(label(it))}</div>
        <h3>${esc(it.title)}${isExt(it) ? '<i data-lucide="arrow-up-right" class="ic"></i>' : ''}</h3>
        <p class="nw-row-co">${esc(isExt(it) && it.publisher ? it.publisher + ' · ' + it.companies.join(', ') : it.companies.join(', '))}</p>
      </div>
      <div class="nw-fig">${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy">` : `<span class="nw-pub">${esc(it.publisher || 'ANAND Group')}</span>`}</div>
    </a>`;

  // hide a photo that fails to load so the placeholder mark shows through
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.closest('#nwMain')) e.target.classList.add('is-broken'); }, true);

  const reveal = root => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .1});
    root.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
  };

  fetch('data/newsroom.json').then(r => r.json()).then(data => {
    const items = data.items;
    if (page === 'newsroom') renderIndex(data, items); else renderArticle(data, items);
    icons();
  }).catch(() => {
    const m = document.getElementById('nwMain');
    if (m) m.innerHTML = '<div class="wrap na-missing"><h1>The newsroom could not load</h1><p>Open this page through the local server (http://localhost:5178), not as a file.</p></div>';
  });

  function renderIndex(data, items) {
    // featured carousel (Stripe's NewsroomIndexCarousel): up to 4 items marked featured
    const feat = items.filter(i => i.featured && i.image).slice(0, 4);
    const car = document.getElementById('nwCar');
    car.innerHTML = `<div class="nw-track">${feat.map((it, i) => `
      <article class="nw-slide" aria-roledescription="slide" aria-label="${i + 1} of ${feat.length}"${i ? ' aria-hidden="true"' : ''}>
        <div class="nw-slide-copy">
          <div class="acc acc--cat">${esc(label(it))}</div>
          <h2><a href="${esc(href(it))}">${esc(it.title)}</a></h2>
          <a class="link" href="${esc(href(it))}">Read More <i data-lucide="chevron-right" class="ic"></i></a>
        </div>
        <a class="nw-card" href="${esc(href(it))}" tabindex="-1" aria-hidden="true"><img src="${esc(it.image)}" alt=""></a>
      </article>`).join('')}</div>`;
    const nav = document.getElementById('nwCnav');
    nav.style.setProperty('--n', feat.length);
    nav.innerHTML = feat.map((it, i) => `<button type="button" aria-label="Show story ${i + 1}: ${esc(it.title)}"></button>`).join('') + '<span class="nw-cline"></span>';
    const track = car.querySelector('.nw-track'), line = nav.querySelector('.nw-cline'), slides = [...car.querySelectorAll('.nw-slide')];
    let cur = 0, timer = 0;
    const go = i => {
      cur = (i + feat.length) % feat.length;
      track.style.transform = `translateX(${-cur * 100}%)`;
      line.style.transform = `translateX(${cur * 100}%)`;
      slides.forEach((s, j) => { s.setAttribute('aria-hidden', j !== cur); s.querySelectorAll('a').forEach(a => a.tabIndex = j === cur && !a.classList.contains('nw-card') ? 0 : -1); });
    };
    const play = () => { clearInterval(timer); if (!reduce && feat.length > 1) timer = setInterval(() => go(cur + 1), 7000); };
    nav.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => { go(i); play(); }));
    const hero = document.querySelector('.nw-hero');
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', () => clearInterval(timer));
    go(0); play();

    // media contact card
    const mc = data.mediaContact;
    document.getElementById('nwContact').innerHTML = `
      <div><h4>Press and media enquiries:</h4><a href="mailto:${esc(mc.email)}">${esc(mc.email)}</a></div>
      <div><h4>Corporate communications:</h4><p>${mc.phone.map(esc).join('<br>')}</p></div>
      <div><h4>${esc(mc.company)}</h4><p>${esc(mc.address)}</p></div>`;

    // news list: every item, filterable by category, company and year (the old site's three filters)
    const cats = ['All', ...data.taxonomy.categories.filter(c => c !== 'Media Coverage' && items.some(i => i.categories.includes(c))), 'Media Coverage'];
    const cos = [...new Set(items.flatMap(i => i.companies))].sort((a, b) => a.localeCompare(b));
    const years = [...new Set(items.map(i => (i.date || '').slice(0, 4)).filter(Boolean))].sort().reverse();
    const f = document.getElementById('nwFilters');
    f.innerHTML = cats.map(c => `<button type="button" class="nw-chip" data-cat="${esc(c)}" aria-pressed="${c === 'All'}">${esc(c)}</button>`).join('') +
      '<span class="sp"></span>' +
      `<label class="sr-only" for="nwCo">Company</label><select class="nw-sel" id="nwCo"><option value="">All companies</option>${cos.map(c => `<option>${esc(c)}</option>`).join('')}</select>` +
      `<label class="sr-only" for="nwYr">Year</label><select class="nw-sel" id="nwYr"><option value="">All years</option>${years.map(y => `<option>${y}</option>`).join('')}</select>`;
    const state = {cat: 'All', co: '', yr: '', shown: 8};
    const rows = document.getElementById('nwRows'), count = document.getElementById('nwCount'), more = document.getElementById('nwMore');
    const draw = () => {
      const list = items.filter(i => (state.cat === 'All' || (state.cat === 'Media Coverage' ? isExt(i) : i.categories.includes(state.cat))) &&
        (!state.co || i.companies.includes(state.co)) && (!state.yr || (i.date || '').startsWith(state.yr)));
      rows.innerHTML = list.slice(0, state.shown).map(row).join('') || '<p class="nw-empty">No stories match these filters.</p>';
      count.textContent = list.length ? `Showing ${Math.min(state.shown, list.length)} of ${list.length}` : '';
      more.hidden = list.length <= state.shown;
      icons(); reveal(rows);
    };
    f.addEventListener('click', e => {
      const b = e.target.closest('.nw-chip'); if (!b) return;
      state.cat = b.dataset.cat; state.shown = 8;
      f.querySelectorAll('.nw-chip').forEach(x => x.setAttribute('aria-pressed', x === b));
      draw();
    });
    f.addEventListener('change', e => { state[e.target.id === 'nwCo' ? 'co' : 'yr'] = e.target.value; state.shown = 8; draw(); });
    more.addEventListener('click', () => { state.shown += 8; draw(); });
    document.querySelectorAll('[data-filter]').forEach(a => a.addEventListener('click', () => f.querySelector(`.nw-chip[data-cat="${a.dataset.filter}"]`)?.click()));
    draw();

    // media coverage: the newest story as a large navy card, then the next six as cards
    const cov = items.filter(isExt);
    const [top, ...rest] = cov;
    if (top) document.getElementById('nwFeat').outerHTML = `
      <a class="nw-feat rv" href="${esc(href(top))}" target="_blank" rel="noopener">${mark}
        <span class="nw-feat-pub">${esc(top.publisher || '')}</span>
        <p class="nr-meta">${esc(shortDate(top.date))}</p>
        <h3>${esc(top.title)}</h3>
        <p>${esc(top.excerpt)}</p>
        <span class="nr-read">Read on ${esc(top.publisher || 'the publisher')} <i data-lucide="arrow-up-right" class="ic"></i></span>
      </a>`;
    document.getElementById('nwCovGrid').innerHTML = rest.slice(0, 6).map(it => `
      <a class="nw-cov-card rv" href="${esc(href(it))}" target="_blank" rel="noopener">
        <span class="nw-k">${esc(it.publisher || '')} · ${esc(shortDate(it.date))}</span>
        <h4>${esc(it.title)}</h4>
        <span class="link">Read Article <i data-lucide="arrow-up-right" class="ic"></i></span>
      </a>`).join('');

    // newsletter issues
    document.getElementById('nwIssues').innerHTML = data.newsletters.map(n => `
      <div class="nw-issue rv">
        <a class="im" href="${esc(n.pdf || n.url)}" target="_blank" rel="noopener"><img src="${esc(n.image)}" alt="${esc(n.title)} cover" loading="lazy"></a>
        <h4>${esc(n.title.replace(/^VOL\s+/i, 'Vol. ').replace(/\b([A-Z])([A-Z]{2,})\b(?=\s+\d{4})/, (m, f, r) => f + r.toLowerCase()))}</h4>
        <time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time>
        <div class="links">${n.pdf ? `<a class="link" href="${esc(n.pdf)}" target="_blank" rel="noopener">Download PDF <i data-lucide="download" class="ic"></i></a>` : ''}</div>
      </div>`).join('');

    // media kit
    document.getElementById('nwKit').innerHTML = data.mediaKit.map(k => `
      <a href="${esc(k.url)}" target="_blank" rel="noopener" class="rv">
        <span class="im"><img src="${esc(k.image)}" alt="" loading="lazy"></span>
        <span><h4>${esc(k.title)}</h4><p>${esc(k.note)}</p><span class="link">${/\.pdf$/i.test(k.url) ? 'Download PDF <i data-lucide="download" class="ic"></i>' : 'Open Gallery <i data-lucide="arrow-up-right" class="ic"></i>'}</span></span>
      </a>`).join('');
    reveal(document);
  }

  function renderArticle(data, items) {
    const slug = new URLSearchParams(location.search).get('slug');
    const it = items.find(i => i.slug === slug && !isExt(i)) || (!slug ? items.find(i => !isExt(i)) : null);
    const main = document.getElementById('nwMain');
    if (!it) {
      main.innerHTML = `<div class="wrap na-missing"><div class="acc acc--cat">Newsroom</div><h1>We couldn't find that story</h1><p>It may have moved. The latest news is on the newsroom page.</p><a class="btn btn-primary" href="newsroom.html">Go to the Newsroom <i data-lucide="chevron-right" class="ic"></i></a></div>`;
      return;
    }
    document.title = `${it.title} | ANAND Group Newsroom`;
    const md = document.querySelector('meta[name=description]');
    if (md) md.setAttribute('content', it.excerpt || it.title);

    // old bullet paragraphs ("• a<br>• b") become real lists
    // old line breaks: mid-sentence ones become spaces, ones before a new sentence become paragraphs
    const tidy = h => h.replace(/<br>\s*(?=[a-z(])/g, ' ').replace(/<br>\s*(?=[A-Z“"‘'0-9])(?![^<]*•)/g, '</p><p>');
    const body = tidy(it.body || `<p>${esc(it.excerpt)}</p>`).replace(/<p>((?:\s*•[\s\S]*?(?:<br>|(?=<\/p>)))+)\s*<\/p>/g, (m, inner) =>
      '<ul>' + inner.split(/<br>/).map(s => s.replace(/^\s*•\s*/, '').trim()).filter(Boolean).map(s => `<li>${s}</li>`).join('') + '</ul>');
    const gallery = (it.gallery || []).filter(g => !(it.body || '').includes(g));
    const url = location.href;
    const share = [
      ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 'share-2'],
      ['X', `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(it.title)}`, 'share-2'],
      ['Email', `mailto:?subject=${encodeURIComponent(it.title)}&body=${encodeURIComponent(url)}`, 'mail'],
    ];
    main.innerHTML = `
      <article class="na">
        <div class="wrap nw-grid">
          <header class="na-head">
            <div class="acc acc--cat">${esc(label(it))}</div>
            <h1>${esc(it.title)}</h1>
          </header>
          <aside class="na-side">
            <time class="acc acc--date" datetime="${esc(it.date)}">${esc(fmtDate(it.date))}</time>
            <dl class="na-meta">
              <dt>Categories</dt><dd>${it.categories.map(esc).join(', ')}</dd>
              <dt>Companies</dt><dd>${it.companies.map(esc).join('<br>')}</dd>
              ${it.pdf ? `<dt>Attachment</dt><dd><a href="${esc(it.pdf)}" target="_blank" rel="noopener">Download PDF</a></dd>` : ''}
            </dl>
            <div class="na-share">
              ${share.map(([n, u, ic]) => `<a href="${esc(u)}" target="_blank" rel="noopener"><i data-lucide="${ic}" class="ic"></i>${n}</a>`).join('')}
              <button type="button" id="naCopy"><i data-lucide="link" class="ic"></i>Copy Link</button>
            </div>
          </aside>
          <div class="na-main">
            ${it.image ? `<figure class="na-fig"><img src="${esc(it.image)}" alt="${esc(it.imageAlt)}"></figure>` : ''}
            <div class="na-body">
              ${body}
              ${gallery.length ? `<div class="na-gallery">${gallery.map(g => `<img src="${esc(g)}" alt="" loading="lazy">`).join('')}</div>` : ''}
              <div class="na-boiler">
                <h4>About ANAND Group</h4>
                <p>Founded in 1961, ANAND is a global mobility solutions group of 17 automotive companies and 22,000+ people across 87 locations, with group revenue of US$2.2B+. Through joint ventures and technical collaborations with world leaders, it serves automotive manufacturers in India and around the world.</p>
                <h4>Media contact</h4>
                <p>${esc(data.mediaContact.name)} · <a href="mailto:${esc(data.mediaContact.email)}">${esc(data.mediaContact.email)}</a></p>
              </div>
            </div>
          </div>
        </div>
      </article>
      <section class="na-related nw-soft">
        <div class="wrap">
          <div class="na-related-head"><div><div class="eyebrow">Newsroom</div><h2>More From ANAND</h2></div><a class="btn btn-outline2" href="newsroom.html#news">All News <i data-lucide="arrow-right" class="ic"></i></a></div>
          <div class="nw-rows">${related(it, items).map(row).join('')}</div>
        </div>
      </section>`;
    const copy = document.getElementById('naCopy');
    copy.addEventListener('click', () => {
      navigator.clipboard?.writeText(url).then(() => { copy.lastChild.textContent = 'Link Copied'; setTimeout(() => { copy.lastChild.textContent = 'Copy Link'; }, 2000); });
    });
    reveal(main);
  }

  // related: same companies first, then same category, then newest
  function related(it, items) {
    const score = x => x.companies.filter(c => it.companies.includes(c)).length * 2 + (x.categories.some(c => it.categories.includes(c)) ? 1 : 0);
    return items.filter(x => x.slug !== it.slug).map(x => [score(x), x]).sort((a, b) => b[0] - a[0] || (b[1].date || '').localeCompare(a[1].date || '')).slice(0, 3).map(x => x[1]);
  }
})();
