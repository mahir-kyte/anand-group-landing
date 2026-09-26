// ANAND design reference: shared behaviour for every page (nav, mobile menu, dialog + Partner form, reveals, carousels).
// Each block checks for its own elements, so pages without them skip it.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // newsroom carousel, rendered from the CMS feed
  (() => {
    const root = document.getElementById('news');
    if (!root || !document.getElementById('cms-news')) return;
    const stage = document.getElementById('nrStage');
    const thumbs = document.getElementById('nrThumbs');
    let items = [];
    try { items = JSON.parse(document.getElementById('cms-news').textContent); } catch (e) {}
    if (!items.length) { root.hidden = true; return; }

    const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}).toUpperCase();
    const pad = n => String(n).padStart(2, '0');

    stage.innerHTML = items.map((n, i) => `
      <article class="nr-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
        <div class="nr-media"><img src="${esc(n.image)}" alt="${esc(n.imageAlt || '')}" ${i ? 'loading="lazy"' : ''}></div>
        <div class="nr-body">
          <span class="nr-tag">${esc(n.category)}</span>
          <div class="nr-meta"><time datetime="${esc(n.date)}">${fmtDate(n.date)}</time> · <span>${esc(n.source)}</span></div>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.excerpt)}</p>
          <a class="nr-read" href="${esc(n.url)}" target="_blank" rel="noopener">Read on ${esc(n.source)} <i data-lucide="arrow-up-right" class="ic"></i></a>
        </div>
      </article>`).join('');

    thumbs.innerHTML = items.map((n, i) => `
      <button class="nr-th" role="tab" aria-selected="false" aria-label="${esc(n.title)}">
        <span class="bar"><i></i></span>
        <span class="im"><img src="${esc(n.image)}" alt="" loading="lazy"></span>
        <span><time datetime="${esc(n.date)}">${fmtDate(n.date)}</time><h4>${esc(n.title)}</h4></span>
      </button>`).join('');

    const slides = [...stage.querySelectorAll('.nr-slide')];
    const tabs = [...thumbs.children];
    const bars = tabs.map(t => t.querySelector('.bar i'));
    const DURATION = 7000;
    let cur = 0, elapsed = 0, last = 0, paused = false, inView = false;

    const go = i => {
      cur = (i + items.length) % items.length;
      slides.forEach((s, j) => s.classList.toggle('on', j === cur));
      tabs.forEach((t, j) => { t.classList.toggle('on', j === cur); t.setAttribute('aria-selected', j === cur); });
      const t = tabs[cur];
      thumbs.scrollTo({left: t.offsetLeft - thumbs.offsetLeft, behavior: reduce ? 'auto' : 'smooth'});
      elapsed = 0; bars.forEach(b => b.style.width = '0');
      if (reduce) bars[cur].style.width = '100%';
    };
    go(0);

    tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });

    // swipe on touch devices
    let x0 = null;
    stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
    stage.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });

    // autoplay with progress bar; pauses on hover/focus, off-screen, or reduced motion
    root.addEventListener('mouseenter', () => paused = true);
    root.addEventListener('mouseleave', () => paused = false);
    root.addEventListener('focusin', () => paused = true);
    root.addEventListener('focusout', () => paused = false);
    new IntersectionObserver(([e]) => inView = e.isIntersecting).observe(stage);
    if (reduce) return;
    const tick = t => {
      const dt = last ? t - last : 0; last = t;
      if (!paused && inView && !document.hidden) {
        elapsed += dt;
        bars[cur].style.width = Math.min(elapsed / DURATION, 1) * 100 + '%';
        if (elapsed >= DURATION) go(cur + 1);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

  // bento cards + modal (behaviour mirrors Stripe's modular-solutions bento)
  (() => {
    const cards = [...document.querySelectorAll('.bento-card')];
    if (!document.getElementById('bdOverlay')) return;   // the dialog (bento details + Partner form) exists on every page; cards only on the home page
    let data = {};
    try { data = JSON.parse(document.getElementById('cms-bento').textContent); } catch (e) {}

    // each card rests a few px inset and grows to full size on hover; x is scaled so the card keeps its shape
    const sizeCards = () => cards.forEach(c => {
      const gy = +(c.dataset.grow || 6), r = c.getBoundingClientRect();
      const gx = r.height ? gy * r.width / r.height : gy;
      c.style.setProperty('--grow-y', gy + 'px'); c.style.setProperty('--grow-x', gx + 'px');
      c.style.setProperty('--shift-y', -gy + 'px'); c.style.setProperty('--shift-x', -gx + 'px');
    });
    sizeCards(); addEventListener('resize', sizeCards);

    // gradient border follows the pointer
    cards.forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mouse-x', (e.clientX - r.left - r.width / 2) + 'px');
      c.style.setProperty('--mouse-y', (e.clientY - r.top - r.height / 2) + 'px');
    }));

    // ---- modal ----
    const overlay = document.getElementById('bdOverlay');
    const dialog = document.getElementById('bdDialog');
    const body = document.getElementById('bdBody');
    const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const btns = arr => (arr || []).map(b => `<a class="btn ${b.primary ? 'btn-primary' : 'btn-outline2'}" href="${esc(b.href)}"${/^http/.test(b.href) ? ' target="_blank" rel="noopener"' : ''}>${esc(b.label)}${b.primary ? ' <i data-lucide="arrow-right" class="ic"></i>' : ''}</a>`).join('');
    const partnerRevenue = [['Forvia',29.5],['Valeo',23.8],['Henkel',23.3],['MAHLE',13.9],['Dana',10.3],['HL Mando',6.4],['Joyson',5],['SK Enmove',3.5],['HL Klemove',1.3],['Jinhap',0.408]];
    const logoFiles = ['Gabriel','DANA','Forvia','mahle','Henkel','valeo','Joyson','HL_mando','HL-Klemove','SK_enmove','Jinhap','APAG','CY_Myutec','ANEVOLVE','iPower'];
    const values = ['Be the first choice of the customers','Build and sustain strategic partnership','Strengthen corporate governance and citizenship','Develop, empower and grow people','Aspire and dare to be innovative','Attain leadership in technology','Create inspired leadership and promote entrepreneurial spirit','Achieve superior business performance and growth'];

    const graphic = (g, cls, delay) => {
      const cap = g.caption ? `<span class="cap">${esc(g.caption)}</span>` : '';
      let inner = '';
      if (g.type === 'chart') inner = `<div class="bd-g-dom"><div class="bd-chart">${partnerRevenue.map(([n, v]) => `<div class="g-bar" style="--w:${(v / 29.5 * 100).toFixed(1)}%"><span>${n}</span><u><i></i></u><em>${v < 1 ? (v * 1000).toFixed(0) + ' Mn' : v}</em></div>`).join('')}</div></div>`;
      else if (g.type === 'logos') inner = `<div class="bd-g-dom"><div class="bd-logos">${logoFiles.map(f => `<span><img src="assets/${f}.png" alt=""></span>`).join('')}</div></div>`;
      else if (g.type === 'map') inner = `<div class="pmap" data-pmap><canvas></canvas></div><div class="pm-legend"><div><span><i></i>Joint venture partners</span><span><i class="t"></i>Technical collaborations</span></div><small>Partner revenue and employees for CY 2024. Map not to scale.</small></div>`;
      else if (g.type === 'values') inner = `<div class="bd-g-dom"><div class="bd-values">${values.map(v => `<span>${esc(v)}</span>`).join('')}</div></div>`;
      else inner = `<img src="${esc(g.src)}" alt="" class="${g.contain ? 'contain' : ''}">`;
      return `<div class="bd-g ${cls}${g.type === 'map' ? ' map' : ''} bd-reveal" style="--rd:${delay}ms">${inner}${cap}</div>`;
    };

    const extra = x => {
      if (!x) return '';
      const head = `<div class="bd-sub">${esc(x.title)}</div>`;
      if (x.type === 'cards') return `<div class="bd-reveal" style="--rd:150ms">${head}<div class="bd-cards">${x.items.map(i => `<div class="bd-card"><div class="gfx"><img src="${esc(i.img)}" alt="" class="${i.cover ? 'cover' : ''}"></div><p>${esc(i.text)}</p><a class="link" href="${esc(i.href)}"${/^http/.test(i.href) ? ' target="_blank" rel="noopener"' : ''}>${esc(i.link)}<i data-lucide="chevron-right" class="ic"></i></a></div>`).join('')}</div></div>`;
      if (x.type === 'directory') return `<div class="bd-reveal" style="--rd:150ms">${head}<div class="bd-dir">${x.items.map(c => `<a class="bd-co" href="${esc(c.url)}" target="_blank" rel="noopener"><span class="lg">${c.logo ? `<img src="${esc(c.logo)}" alt="">` : ''}</span><span class="tx"><b>${esc(c.name)}</b><span>${esc(c.products)}</span></span><i data-lucide="arrow-up-right" class="ic"></i></a>`).join('')}</div></div>`;
      if (x.type === 'leaders') return `<div class="bd-reveal" style="--rd:150ms">${head}<div class="bd-leaders">${x.items.map(l => `<div>${l.photo ? `<img class="g-av" src="${esc(l.photo)}" alt="${esc(l.name)}">` : `<i class="g-av ${l.tone}">${esc(l.initials)}</i>`}<b>${esc(l.name)}</b><small>${esc(l.role)}</small><p>${esc(l.text)}</p></div>`).join('')}</div></div>`;
      if (x.type === 'details') return `<div class="bd-reveal" style="--rd:150ms">${head}<div class="bd-details">${x.items.map(d => `<div><i><i data-lucide="${esc(d.icon)}" class="ic"></i></i><b>${esc(d.title)}</b><p>${esc(d.text)}</p></div>`).join('')}</div></div>`;
      return '';
    };

    const render = d => {
      const right = d.graphics.right || [];
      body.innerHTML = `
        <div class="bd-header">
          <div class="bd-intro bd-reveal">
            <div><h2 id="bdTitle">${esc(d.title)}</h2><p>${esc(d.body)}</p></div>
            <div class="bd-btns">${btns(d.ctas)}</div>
          </div>
          <ul class="bd-list bd-reveal" style="--rd:100ms">${d.list.map(t => `<li><i><i data-lucide="check" class="ic"></i></i>${esc(t)}</li>`).join('')}</ul>
        </div>
        <div class="bd-graphics ${right.length ? '' : 'one'}">
          ${graphic(d.graphics.left, 'left', 0)}
          ${right.length ? `<div class="rcol">${right.map((g, i) => graphic(g, 'right', 100 + i * 100)).join('')}</div>` : ''}
        </div>
        ${extra(d.extra)}
        ${d.quote ? `<hr class="bd-divider"><div class="bd-quote"><img class="logo" src="${esc(d.quote.logo || 'assets/logo.png')}" alt=""><q>${esc(d.quote.text)}</q><div class="by"><b>${esc(d.quote.name)}</b>${d.quote.role ? ', ' + esc(d.quote.role) : ''}</div></div>` : ''}
        <hr class="bd-divider">
        <div class="bd-footer"><h3>${esc(d.footer.title)}</h3><div class="bd-btns">${btns(d.footer.ctas)}</div></div>`;
      if (window.lucide) lucide.createIcons();
      body.querySelectorAll('[data-pmap]').forEach(el => initMap(el, d.map));
    };


    // ---- partner map: dots from dotted-map (height 100, diagonal grid), encoded as per-row runs ----
    const DOTS = '13+2,53+1,61+7,85+2,95+10,137+18,227+1,231+1,263+2,277+51,383+1|10+5,66+6,86+2,94+12,134+17,226+5,278+3,286+51|7+10,29+1,45+2,61+9,85+3,99+3,107+6,135+19,223+6,279+3,287+50|6+14,40+6,54+2,62+8,82+2,88+2,98+2,108+6,134+18,220+9,270+2,278+3,286+51,390+2|5+16,39+11,65+3,75+2,85+5,99+2,109+5,139+15,219+12,271+3,279+3,287+55|2+31,72+2,88+4,98+2,112+4,138+14,218+13,250+1,260+1,266+6,280+58|5+29,71+4,83+1,87+4,97+3,109+1,113+5,137+12,217+15,251+1,257+14,287+55|6+49,108+1,114+5,136+12,216+16,250+1,256+14,286+55|7+47,113+7,137+11,215+16,251+1,255+14,287+55|4+1,8+45,112+3,120+3,136+10,172+1,178+2,214+13,242+2,248+74|1+49,111+4,121+2,137+8,171+6,213+6,229+6,247+75|2+47,98+1,106+7,138+7,172+5,212+6,228+6,242+1,246+75|9+43,97+3,107+1,111+6,137+7,173+4,211+7,227+7,243+77|10+41,96+2,102+1,114+4,138+6,174+2,210+6,226+85|5+44,115+2,121+1,139+5,207+7,225+86|4+43,100+1,104+1,108+1,118+1,140+4,206+7,224+86|3+43,107+4,141+4,205+7,225+80,387+2,393+2|4+8,22+33,108+4,142+3,206+7,224+79,392+2|1+1,5+7,21+2,29+29,107+5,145+1,205+8,225+2,233+74,389+4|8+5,20+1,34+27,108+5,122+1,206+7,228+1,232+72,378+2,388+2|11+4,35+27,107+6,121+2,205+2,213+3,227+70,387+2|14+1,42+24,108+9,192+1,212+3,228+68,386+2|13+1,17+1,41+26,109+9,191+3,213+3,225+69,383+4|10+1,44+26,108+9,192+2,208+2,214+2,224+69,382+5|7+1,43+28,107+11,193+2,209+2,223+68,383+3|46+28,106+13,190+1,194+2,222+68,382+4|41+1,47+27,105+13,187+2,195+2,209+78,383+2|42+1,46+28,106+14,188+2,194+3,204+82,382+2|49+27,107+13,187+2,193+4,203+82,383+1|48+41,132+1,194+3,202+81,366+1|47+37,125+2,131+1,201+82,367+1|50+1,54+33,124+1,130+3,196+84,366+2|55+31,119+2,129+4,193+85|52+35,196+83,366+1|53+36,197+19,237+2,243+7,261+50,367+1|52+38,198+8,216+9,238+8,260+50|53+33,121+1,197+8,217+8,245+5,259+50,365+2|52+32,188+8,212+2,220+6,246+5,260+47,356+1,364+3|53+31,189+7,209+1,213+2,221+5,249+3,261+46,363+1|52+31,188+6,216+2,222+5,234+12,264+44,364+1|53+29,189+5,209+1,217+1,223+1,231+13,261+39,343+3,363+2|54+27,188+6,224+1,230+13,262+38,346+2,364+1|55+27,189+4,213+2,225+1,231+13,263+38,341+1,347+2,363+1|56+27,192+1,200+6,236+2,242+50,348+2,360+2|57+26,191+2,197+7,227+1,237+1,241+49,349+1,355+5|60+24,190+11,240+50,356+2|61+22,189+13,223+1,241+50,351+2|62+21,188+15,222+4,234+1,240+51,352+1|65+14,97+3,187+78|64+11,102+1,186+35,258+42|63+2,69+8,101+2,183+28,241+8,261+40|66+1,70+7,102+1,182+29,242+8,266+37|67+1,71+7,181+30,243+8,263+1,277+31,341+1|68+1,74+5,180+30,244+12,280+29,340+1|75+4,99+1,103+2,179+32,245+12,281+12,307+13|74+5,92+2,106+2,180+31,246+11,282+10,308+9,328+1|15+1,75+5,93+1,113+2,179+32,247+10,285+7,309+7,327+1|78+9,106+2,114+1,120+1,180+32,248+9,286+6,310+7,342+1|81+7,179+33,249+7,285+5,311+7,341+1|90+5,180+33,250+5,286+4,314+7,340+1|93+4,179+38,287+3,315+6,341+2|96+2,180+35,288+3,320+4|97+2,111+4,181+35,255+2,289+2,315+1,321+3,345+1|100+1,110+2,116+6,182+38,290+1,322+1,346+1|103+1,107+11,183+38,293+1,315+1,343+3|108+11,186+36,294+1,316+1,336+1|107+15,187+3,195+1,205+26,311+2,317+2,335+2|108+15,210+22,312+2,318+1,332+3|107+16,211+21,315+1,319+1,331+4|104+18,210+20,316+2,328+5,340+3|105+18,209+20,317+2,327+5,339+1,343+1,349+1,353+2|104+21,210+19,318+2,328+4,340+1,356+1,360+2|103+25,211+17,319+2,339+2,355+7|104+27,214+15,322+1,362+4,376+1|105+26,213+16,323+2,329+1,363+5|106+26,214+16,330+2,364+2,372+1,386+1|107+25,215+15,339+1,345+1,373+1,387+1|108+24,216+15,366+1|109+23,215+16,353+4|110+22,214+16,256+1,348+1,352+4,366+1|111+21,213+17,255+2,345+7,365+3,395+1|114+19,212+17,252+3,344+9,366+2|115+19,213+15,251+3,343+14|116+18,214+13,252+2,342+16|117+17,215+13,251+3,335+20,393+1|116+17,216+12,250+3,334+21|117+14,215+13,251+2,333+22|116+13,216+11,252+1,334+22|115+13,217+10,333+23|116+13,218+10,334+23|115+13,219+9,335+22|114+13,220+8,334+23|115+12,221+6,335+22|114+12,220+6,336+5,358+10|115+10,221+2,335+3,361+8|114+9,362+7|113+10,363+6|112+10,364+6|113+8|112+7|111+7,369+2|112+5,370+2|111+6,371+1|112+5|111+5,395+1|110+5|111+5|110+5|109+5,279+2|110+4|111+3,129+1|110+4,128+1|113+1,117+1|112+1,116+2|115+4';
    const initMap = (el, m) => {
      if (!m) return;
      const cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
      const rows = DOTS.split('|').map(r => r ? r.split(',').map(x => x.split('+').map(Number)) : []);
      const drawDots = () => {
        if (!el.isConnected) { ro.disconnect(); return; }
        const dpr = Math.min(devicePixelRatio || 1, 2), w = el.clientWidth, h = el.clientHeight, k = w / 198 * dpr;
        cv.width = w * dpr; cv.height = h * dpr;
        ctx.fillStyle = 'rgba(11,78,162,.4)';
        const r = Math.max(0.22 * k, 0.8 * dpr);
        rows.forEach((runs, ri) => { const y = ri * 0.8660254 * k; for (const [st, n] of runs) for (let j = 0; j < n; j++) { ctx.beginPath(); ctx.arc((st / 2 + j) * k, y, r, 0, 6.2832); ctx.fill(); } });
      };
      const ro = new ResizeObserver(drawDots); ro.observe(el);

      // arcs from HQ, drawn in a staggered loop (timings from the WorldMap component)
      const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 198 100');
      const curve = (a, b) => `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 14} ${b.x} ${b.y}`;
      const stagger = 0.3, dur = 2, total = m.countries.length * stagger + dur, cycle = total + 2;
      let html = '<defs><linearGradient id="pmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="5%" stop-color="#00AEEF"/><stop offset="95%" stop-color="#00AEEF"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
      m.countries.forEach((c, i) => {
        const d = curve(m.hq, c), t1 = (i * stagger / cycle).toFixed(4), t2 = ((i * stagger + dur) / cycle).toFixed(4), t3 = (total / cycle).toFixed(4);
        const kt = `0;${t1};${t2};${t3};1`;
        html += reduce ? `<path class="pm-arc" pathLength="1" d="${d}"/>`
          : `<path class="pm-arc" pathLength="1" d="${d}"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1" keyTimes="${kt}" dur="${cycle}s" repeatCount="indefinite"/></path>
             <circle r=".9" fill="#00AEEF" opacity="0"><animateMotion path="${d}" keyPoints="0;0;1;1;1" keyTimes="${kt}" calcMode="linear" dur="${cycle}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="${kt}" dur="${cycle}s" repeatCount="indefinite"/></circle>`;
      });
      const pulse = (x, y, begin) => reduce ? '' : `<circle cx="${x}" cy="${y}" r=".75" fill="#00AEEF" opacity=".5"><animate attributeName="r" from=".75" to="3" dur="2s" begin="${begin}" repeatCount="indefinite"/><animate attributeName="opacity" from=".6" to="0" dur="2s" begin="${begin}" repeatCount="indefinite"/></circle>`;
      html += pulse(m.hq.x, m.hq.y, '0s') + `<circle cx="${m.hq.x}" cy="${m.hq.y}" r="1.1" fill="#00AEEF"/>`;
      m.countries.forEach((c, i) => {
        const names = c.partners.map(p => p[0]).join(', ');
        html += pulse(c.x, c.y, (0.5 + i * 0.15).toFixed(2) + 's') +
          `<g class="pm-mk ${c.type}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(c.name)}: ${esc(names)}"><circle class="hit" cx="${c.x}" cy="${c.y}" r="2.2"/><circle class="core" cx="${c.x}" cy="${c.y}" r=".75"/></g>`;
      });
      svg.innerHTML = html;
      el.appendChild(svg);

      const hq = document.createElement('span');
      hq.className = 'pm-hq'; hq.textContent = m.hq.label;
      hq.style.left = m.hq.x / 1.98 + '%'; hq.style.top = m.hq.y + '%';
      el.appendChild(hq);

      // hover / focus / tap card, like the partner map on anandgroupindia.com
      const tip = document.createElement('div');
      tip.className = 'pm-tip'; tip.setAttribute('role', 'status');
      // phones: dock the card to the bottom of the screen (attached to the overlay so the dialog's animation doesn't box it in)
      const docked = matchMedia('(max-width:639px)').matches;
      (docked ? overlay : el).appendChild(tip);
      let active = null;
      const show = g => {
        const c = m.countries[+g.dataset.i];
        if (active) active.classList.remove('on');
        active = g; g.classList.add('on');
        tip.innerHTML = `<div class="hd"><b>${esc(c.name)}</b><span>${c.type === 'jv' ? 'Joint venture' : 'Tech collaboration'}</span></div>` +
          c.partners.map(p => `<div class="pr"><img src="assets/${esc(p[1])}" alt=""><div><b>${esc(p[0])}</b>${p[2] ? `Revenue ${esc(p[2])} · Employees ${esc(p[3])}` : 'Technical collaboration'}</div></div>`).join('');
        if (docked) { tip.classList.add('show'); return; }
        const W = el.clientWidth, H = el.clientHeight, px = c.x / 198 * W, py = c.y / 100 * H;
        const tw = tip.offsetWidth, th = tip.offsetHeight;
        const left = Math.min(Math.max(px - tw / 2, 0), W - tw);
        const above = py - th - 16 >= -40; // prefer above the marker, flip below when there's no room
        tip.style.left = left + 'px';
        tip.style.top = (above ? py - th - 16 : py + 16) + 'px';
        tip.classList.add('show');
      };
      const hide = () => { tip.classList.remove('show'); if (active) active.classList.remove('on'); active = null; };
      svg.querySelectorAll('.pm-mk').forEach(g => {
        g.addEventListener('mouseenter', () => show(g));
        g.addEventListener('mouseleave', hide);
        g.addEventListener('focus', () => show(g));
        g.addEventListener('blur', hide);
        g.addEventListener('click', e => { e.stopPropagation(); active === g ? hide() : show(g); });
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); active === g ? hide() : show(g); } });
      });
      el.addEventListener('click', e => { if (!e.target.closest('.pm-mk')) hide(); });
    };
    let opener = null, closing = 0;
    const openShell = (el, paint) => {
      clearTimeout(closing);
      opener = el; el.setAttribute('aria-expanded', 'true');
      dialog.classList.remove('is-form'); overlay.classList.remove('is-form');
      paint();
      document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px');
      document.documentElement.classList.add('bd-lock');
      overlay.hidden = false; overlay.scrollTop = 0;
      overlay.dataset.status = dialog.dataset.status = 'initial';
      requestAnimationFrame(() => requestAnimationFrame(() => { overlay.dataset.status = dialog.dataset.status = 'open'; }));
      dialog.focus({preventScroll: true});
    };
    const open = card => { const d = data[card.dataset.bento]; if (d) openShell(card, () => render(d)); };
    const close = () => {
      if (overlay.hidden || overlay.dataset.status === 'close') return;
      overlay.dataset.status = dialog.dataset.status = 'close';
      closing = setTimeout(() => {
        overlay.hidden = true; body.innerHTML = ''; dialog.classList.remove('is-form'); overlay.classList.remove('is-form');
        overlay.querySelectorAll('.pm-tip').forEach(t => t.remove());
        document.documentElement.classList.remove('bd-lock');
        if (opener) { opener.setAttribute('aria-expanded', 'false'); opener.focus({preventScroll: true}); }
      }, reduce ? 0 : 300);
    };

    // ---- Partner with Us form (any "Partner with Us" button opens it) ----
    const opt = (list, ph) => (ph ? `<option value="" disabled selected>${ph}</option>` : '') + list.map(o => Array.isArray(o) ? `<option value="${esc(o[0])}"${o[2] ? ' selected' : ''}>${esc(o[1])}</option>` : `<option>${esc(o)}</option>`).join('');
    const COUNTRIES = ['India', 'France', 'Germany', 'Japan', 'Netherlands', 'South Korea', 'Spain', 'Switzerland', 'United Arab Emirates', 'United Kingdom', 'United States', 'Other'];
    const CODES = [['+91', 'IN +91', 1], ['+33', 'FR +33'], ['+49', 'DE +49'], ['+81', 'JP +81'], ['+31', 'NL +31'], ['+82', 'KR +82'], ['+34', 'ES +34'], ['+41', 'CH +41'], ['+971', 'AE +971'], ['+44', 'UK +44'], ['+1', 'US +1']];
    const PRODUCTS = ['Chassis, body & safety', 'Powertrain & drivetrain', 'Thermal, emissions & fluids', 'Electronics & e-mobility', 'Aftermarket', 'Other'];
    const row = (id, label, field, span) => `<div class="pf-f" style="--span:${span}"><label for="${id}">${label} <em aria-hidden="true">*</em></label>${field}<p class="pf-err" id="${id}-err"></p></div>`;
    const inp = (id, type, ph, extra = '') => `<input class="pf-in" id="${id}" name="${id}" type="${type}" placeholder="${ph}" required aria-describedby="${id}-err"${extra}>`;
    const sel = (id, list, ph) => `<select class="pf-in" id="${id}" name="${id}" required aria-describedby="${id}-err">${opt(list, ph)}</select>`;
    const renderForm = () => {
      dialog.classList.add('is-form'); overlay.classList.add('is-form');
      body.innerHTML = `
        <form class="pf" novalidate>
          <div class="pf-head bd-reveal"><h2 id="bdTitle">Let's Build What's Next, Together</h2><p>Tell us a little about you, and the right ANAND team will get in touch.</p></div>
          <div class="pf-page bd-reveal" style="--rd:80ms">
            ${row('pf-name', 'Name', inp('pf-name', 'text', 'Priya Sharma', ' autocomplete="name"'), 6)}
            ${row('pf-email', 'Email', inp('pf-email', 'email', 'priya@company.com', ' autocomplete="email"'), 6)}
            ${row('pf-mobile', 'Mobile number', `<div class="pf-pair">${sel('pf-code', CODES)}${inp('pf-mobile', 'tel', '98765 43210', ' autocomplete="tel-national" pattern="[0-9 ]{6,15}"')}</div>`, 6)}
            ${row('pf-country', 'Country', sel('pf-country', COUNTRIES.map(c => [c, c, c === 'India'])), 6)}
            ${row('pf-company', 'Company', inp('pf-company', 'text', 'Company name', ' autocomplete="organization"'), 6)}
            ${row('pf-products', 'Products interested', sel('pf-products', PRODUCTS, 'Select a product area'), 6)}
            ${row('pf-desc', 'Description', `<textarea class="pf-in" id="pf-desc" name="pf-desc" placeholder="How can we work together?" required aria-describedby="pf-desc-err"></textarea>`, 12)}
          </div>
          <div class="pf-foot bd-reveal" style="--rd:160ms">
            <p class="pf-note">All fields are mandatory.</p>
            <button type="submit" class="btn btn-primary pf-next">Submit <i data-lucide="chevron-right" class="ic"></i></button>
          </div>
        </form>`;
      if (window.lucide) lucide.createIcons();
      const form = body.querySelector('.pf');
      const msg = f => f.validity.valueMissing ? 'This field is required.' : f.type === 'email' ? 'Enter a valid email address.' : f.type === 'tel' ? 'Enter a valid mobile number.' : 'Check this field.';
      const check = f => { const ok = f.checkValidity(); f.classList.toggle('bad', !ok); f.setAttribute('aria-invalid', !ok); const e = document.getElementById(f.id + '-err'); if (e) e.textContent = ok ? '' : msg(f); return ok; };
      form.addEventListener('input', e => { if (e.target.classList.contains('bad')) check(e.target); });
      form.addEventListener('change', e => { if (e.target.classList.contains('bad')) check(e.target); });
      form.addEventListener('submit', e => {
        e.preventDefault();
        const bad = [...form.querySelectorAll('.pf-in')].filter(f => !check(f));
        if (bad.length) { bad[0].focus(); return; }
        // Design reference only: nothing is sent. The WordPress build wires this to ANAND's enquiry inbox.
        const name = form.querySelector('#pf-name').value.trim().split(/\s+/)[0];
        form.querySelector('.pf-page').remove(); form.querySelector('.pf-foot').remove();
        form.querySelector('.pf-head').innerHTML = `<h2 id="bdTitle">Thank You, ${esc(name)}</h2><p>We've received your enquiry. The right ANAND team will be in touch shortly.</p>`;
        form.insertAdjacentHTML('beforeend', `<div class="pf-done bd-reveal"><button type="button" class="btn btn-primary pf-close">Close</button></div>`);
        form.querySelector('.pf-close').addEventListener('click', close);
      });
    };
    const isPartner = el => el && (el.hasAttribute('data-partner') || /^partner with us/i.test(el.textContent.trim()));
    document.addEventListener('click', e => {
      const t = e.target.closest('a,button');
      if (!isPartner(t)) return;
      e.preventDefault();
      if (!overlay.hidden && overlay.dataset.status !== 'close') { renderForm(); overlay.scrollTop = 0; dialog.focus({preventScroll: true}); return; }
      openShell(t, renderForm);
    });
    cards.forEach(c => c.addEventListener('click', () => open(c)));
    document.getElementById('bdClose').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (!dialog.contains(e.target)) close(); });
    document.addEventListener('keydown', e => {
      if (overlay.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = [...dialog.querySelectorAll('a[href],button,input,select,textarea')].filter(x => x.offsetParent);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

  })();



  // guide-card art: one large filled ANAND double chevron (the logo mark), cropped by the card edge; slides in on scroll
  (() => {
    const W = 254, H = 356;
    const P = pts => pts.map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ');
    const chev = (x, y, h, t) => P([[x, y], [x + t, y], [x + t + h / 2, y + h / 2], [x + t, y + h], [x, y + h], [x + h / 2, y + h / 2]]);
    const h = 200, t = h * .42, gap = t + h * .12, total = gap + t + h / 2;
    const bx = W - total + 34, by = H - h + 36; // crop a little off the right and bottom
    const mark = `<g class="gc-mark"><polygon points="${chev(bx, by, h, t)}"/><polygon points="${chev(bx + gap, by, h, t)}"/></g>`;
    document.querySelectorAll('.gc-art').forEach(svg => { svg.innerHTML = mark; });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } }), {threshold: .2});
    document.querySelectorAll('.gc-art').forEach(el => io.observe(el));
  })();


  // hero reel: plays only while on screen; with reduced motion it stays on the poster frame
  (() => {
    const box = document.getElementById('heroReel'); if (!box) return;
    const v = box.querySelector('video');
    if (reduce) { v.removeAttribute('src'); v.load(); return; }
    new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(box);
  })();
  lucide.createIcons();

  // nav state
  const nav = document.getElementById('nav');
  const heroEl = document.querySelector('.hero');
  const onScroll = () => {
    const past = !heroEl || scrollY > heroEl.querySelector('.hero-grid').offsetTop - 72 - 24; // fill before the bar reaches the hero text; pages without the film hero always use the filled bar
    nav.classList.toggle('on-hero', !past);
    nav.classList.toggle('scrolled', past);
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // duplicate marquee for seamless loop
  const track = document.getElementById('track');
  if (track) track.innerHTML += track.innerHTML;

  // reveal + counters
  const fmt = n => n.toLocaleString('en-IN');
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', plain = 'plain' in el.dataset;
    if (reduce) return;
    const start = plain ? end - 60 : 0, t0 = performance.now(), d = 1400;
    const step = t => {
      const p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (end - start) * e);
      el.textContent = (plain ? v : fmt(v)) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(count);
    io.unobserve(e.target);
  }), {threshold:.15});
  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 60 + 'ms';
    io.observe(el);
  });

  // mega menu (behaviour mirrors stripe.com): hover to open, panel slides by direction, height animates, page blurs
  (() => {
    const shell = document.getElementById('navShell'), pop = document.getElementById('navPop'), overlay = document.getElementById('navOverlay');
    if (!shell || !pop) return;
    const triggers = [...shell.querySelectorAll('.nav-trigger')];
    const order = triggers.map(t => t.dataset.panel);
    let cur = null, openT = 0, closeT = 0;
    const panelOf = k => pop.querySelector(`.np[data-panel="${k}"]`);
    const fit = p => { const room = innerHeight - pop.getBoundingClientRect().top - 12; pop.style.height = Math.min(p.offsetHeight, room) + 'px'; pop.style.overflowY = p.offsetHeight > room ? 'auto' : 'hidden'; }; // short screens: cap the panel to the viewport and let it scroll
    const show = key => {
      clearTimeout(closeT);
      if (key === cur) return;
      const next = panelOf(key), prev = cur && panelOf(cur);
      const dir = cur ? Math.sign(order.indexOf(key) - order.indexOf(cur)) : 0;
      triggers.forEach(t => t.setAttribute('aria-expanded', t.dataset.panel === key));
      if (prev) { prev.classList.remove('on'); prev.style.transform = reduce ? '' : `translateX(${-dir * 20}%)`; }
      next.style.transition = 'none';
      next.style.transform = dir && !reduce ? `translateX(${dir * 20}%)` : 'none';
      next.offsetWidth; // commit the start position
      next.style.transition = '';
      next.classList.add('on'); next.style.transform = 'none';
      fit(next);
      shell.classList.add('open'); overlay.classList.add('show');
      cur = key;
    };
    const hide = () => {
      clearTimeout(openT);
      if (!cur) return;
      triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      panelOf(cur).classList.remove('on');
      shell.classList.remove('open'); overlay.classList.remove('show');
      pop.style.height = '0px';
      cur = null;
    };
    const later = fn => { clearTimeout(closeT); closeT = setTimeout(fn, 180); };
    triggers.forEach(t => {
      t.addEventListener('mouseenter', () => { clearTimeout(openT); openT = setTimeout(() => show(t.dataset.panel), cur ? 0 : 80); });
      t.addEventListener('mouseleave', () => clearTimeout(openT));
      t.addEventListener('click', () => (cur === t.dataset.panel ? hide() : show(t.dataset.panel)));
      t.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); show(t.dataset.panel); panelOf(t.dataset.panel).querySelector('a')?.focus(); } });
    });
    shell.querySelectorAll('.nav-link, .nav-logo, .nav-cta a').forEach(a => a.addEventListener('mouseenter', () => later(hide)));
    shell.addEventListener('mouseleave', () => later(hide));
    shell.addEventListener('mouseenter', () => clearTimeout(closeT));
    overlay.addEventListener('mouseenter', () => later(hide));
    overlay.addEventListener('click', hide);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && cur) { const t = triggers.find(x => x.dataset.panel === cur); hide(); t && t.focus(); }
    });
    shell.addEventListener('focusout', e => { if (!shell.contains(e.relatedTarget)) hide(); });
    addEventListener('resize', () => { if (cur) fit(panelOf(cur)); });
    addEventListener('scroll', () => { if (cur) hide(); }, {passive: true});   // the page scrolling closes the menu (scrolling inside a tall panel doesn't)
  })();

  // phone/tablet menu: an accordion built from the desktop mega menu, opened by the menu button
  (() => {
    const nav = document.getElementById('nav'), btn = nav.querySelector('.menu-btn'), menu = document.getElementById('mMenu');
    if (!btn || !menu) return;
    const list = menu.querySelector('.m-in');
    const group = (title, ul) => { const g = document.createElement('div'); g.className = 'm-group'; g.innerHTML = `<h4>${title}</h4>`; g.appendChild(ul.cloneNode(true)); return g; };
    nav.querySelectorAll('.nav-links > li > *').forEach(el => {
      if (el.matches('a')) { const a = el.cloneNode(true); a.className = 'm-link'; const w = document.createElement('div'); w.className = 'm-item'; w.appendChild(a); list.appendChild(w); return; }
      const panel = document.getElementById(el.getAttribute('aria-controls')), id = 'm-' + el.dataset.panel;
      const item = document.createElement('div'); item.className = 'm-item';
      item.innerHTML = `<button class="m-head" type="button" aria-expanded="false" aria-controls="${id}">${el.firstChild.textContent}</button><div class="m-body" id="${id}"></div>`;
      item.querySelector('.m-head').appendChild(el.querySelector('svg, i').cloneNode(true));
      const body = item.querySelector('.m-body');
      panel.querySelectorAll('.np-col').forEach(c => body.appendChild(group(c.querySelector('h4').textContent, c.querySelector('.np-list'))));
      panel.querySelectorAll('.np-aside h4').forEach(h => { const ul = h.nextElementSibling; if (ul && ul.matches('.np-list')) body.appendChild(group(h.textContent, ul)); });
      const foot = panel.querySelector('.np-foot a'); if (foot) body.appendChild(foot.cloneNode(true));
      list.appendChild(item);
    });
    const cta = document.createElement('div'); cta.className = 'm-cta';
    nav.querySelectorAll('.nav-cta a').forEach(a => { const c = a.cloneNode(true); c.classList.remove('nav-sec'); cta.appendChild(c); });
    list.appendChild(cta);
    list.addEventListener('click', e => {
      const h = e.target.closest('.m-head');
      if (h) { const open = h.getAttribute('aria-expanded') === 'true'; list.querySelectorAll('.m-head').forEach(x => x.setAttribute('aria-expanded', 'false')); h.setAttribute('aria-expanded', String(!open)); return; }
      if (e.target.closest('a')) set(false);
    });
    const set = on => {
      nav.classList.toggle('m-open', on); document.body.classList.toggle('m-lock', on);
      btn.setAttribute('aria-expanded', String(on)); btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', String(!on));
    };
    btn.addEventListener('click', () => set(!nav.classList.contains('m-open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('m-open')) { set(false); btn.focus(); } });
    matchMedia('(min-width:1200px)').addEventListener('change', e => { if (e.matches) set(false); });
  })();

  // stories carousel: arrows scroll one card at a time and disable at the ends
  (() => {
    const sc = document.getElementById('stScroller');
    if (!sc) return;
    const prev = document.getElementById('stPrev'), next = document.getElementById('stNext');
    const step = () => { const it = sc.querySelector('.st-item'); return it ? it.getBoundingClientRect().width + 16 : 300; };
    const update = () => {
      prev.disabled = sc.scrollLeft <= 2;
      next.disabled = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2;
    };
    // move exactly one card per click: go to the next/previous card's snap position, not a relative distance
    let target = null;
    const go = dir => {
      const st = step(), max = sc.scrollWidth - sc.clientWidth;
      const from = target ?? sc.scrollLeft;
      const x = from / st, i = dir > 0 ? Math.floor(x + .01) + 1 : Math.ceil(x - .01) - 1;   // from a part-way position (the end), step to the nearest card in that direction
      target = Math.max(0, Math.min(i * st, max));
      sc.scrollTo({left: target, behavior: reduce ? 'auto' : 'smooth'});
    };
    prev.onclick = () => go(-1);
    next.onclick = () => go(1);
    sc.addEventListener('scrollend', () => { target = null; });
    sc.addEventListener('scroll', update, {passive: true});
    addEventListener('resize', update);
    update();
  })();

})();
