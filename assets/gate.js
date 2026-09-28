/* Password screen for the private preview (added 28 Sep 2026 while the client meeting is on hold).
   A soft lock: the check runs in the browser, so it keeps casual visitors out but is not real security.
   Remove it by deleting this file's <script> tag and the inline "is-locked" snippet from each page's <head>.
   Once unlocked, the browser remembers it (localStorage), so the password is asked for once per browser. */
(() => {
  const KEY = 'anand-preview-unlocked';
  const PASSWORD = 'Kyte2026';
  const root = document.documentElement;

  const unlocked = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  if (unlocked()) { root.classList.remove('is-locked'); return; }
  root.classList.add('is-locked');

  const build = () => {
    const gate = document.createElement('div');
    gate.className = 'pw';
    gate.innerHTML = `
      <form class="pw-card" novalidate>
        <img class="pw-logo" src="assets/logo.png" alt="ANAND">
        <div class="eyebrow">Private preview</div>
        <h1 class="pw-title">Enter the Password</h1>
        <p class="pw-text">This design preview is shared privately with the ANAND Group. Enter the password from Kyte to continue.</p>
        <label class="pw-label" for="pwInput">Password</label>
        <input class="pw-in" id="pwInput" type="password" autocomplete="current-password" required>
        <p class="pw-err" id="pwErr" role="alert" hidden>That password isn't right. Check it and try again.</p>
        <button class="btn btn-primary pw-btn" type="submit">Continue <i data-lucide="chevron-right" class="ic"></i></button>
      </form>
      <div class="pw-stripes" aria-hidden="true"><span></span><span></span></div>`;
    document.body.appendChild(gate);
    if (window.lucide) lucide.createIcons();

    const form = gate.querySelector('form'), input = gate.querySelector('#pwInput'), err = gate.querySelector('#pwErr');
    input.focus();
    input.addEventListener('input', () => { err.hidden = true; input.classList.remove('bad'); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value.trim() === PASSWORD) {
        try { localStorage.setItem(KEY, '1'); } catch (x) {}
        gate.classList.add('pw-out');
        root.classList.remove('is-locked');
        setTimeout(() => gate.remove(), 400);
      } else {
        err.hidden = false;
        input.classList.add('bad');
        input.select();
      }
    });
  };

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
