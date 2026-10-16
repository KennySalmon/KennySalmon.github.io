(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.add('js');

  // Reveal on scroll: fail-safe: anything still hidden after 2.5s is shown
  const els = $$('[data-reveal]');
  const showAll = () => els.forEach(e => e.classList.add('in'));
  if (reduce || !('IntersectionObserver' in window)) showAll();
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -5% 0px' });
    els.forEach(e => (e.getBoundingClientRect().top < innerHeight ? e.classList.add('in') : io.observe(e)));
    setTimeout(showAll, 2500);
  }

  // Stats count up on entry and fade back to zero on exit.
  const counters = $$('[data-counter]');
  if (counters.length) {
    const setValue = (item, value) => {
      const output = $('.stat-value', item);
      const decimals = Number(item.dataset.decimals || 0);
      const suffix = item.dataset.suffix || '';
      const rounded = Number(value.toFixed(decimals));
      const number = decimals ? rounded.toFixed(decimals).replace(/\.0$/, '') : String(Math.round(rounded));
      output.textContent = `${rounded === 0 ? '0' : number}${rounded === 0 ? '' : suffix}`;
    };
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(item => item.classList.add('is-visible'));
    } else {
      const states = new WeakMap();
      counters.forEach(item => {
        states.set(item, { value: 0, run: 0 });
        setValue(item, 0);
      });
      const countIo = new IntersectionObserver(entries => entries.forEach(entry => {
        const item = entry.target;
        const state = states.get(item);
        const target = entry.isIntersecting ? Number(item.dataset.target) : 0;
        const from = state.value;
        const run = ++state.run;
        const duration = entry.isIntersecting ? 1500 : 420;
        item.classList.toggle('is-visible', entry.isIntersecting);
        const start = performance.now();
        const tick = now => {
          if (state.run !== run) return;
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          state.value = from + (target - from) * eased;
          setValue(item, state.value);
          if (progress < 1) requestAnimationFrame(tick);
          else state.value = target;
        };
        requestAnimationFrame(tick);
      }), { threshold: 0.35 });
      counters.forEach(item => countIo.observe(item));
    }
  }

  // Rotate the featured photographs between the fixed gallery positions.
  const workRotation = $('[data-work-rotation]');
  if (workRotation && !reduce) {
    const cards = $$('[data-work-card]', workRotation);
    let images = cards.map(card => ({
      image: card.dataset.image,
      alt: card.dataset.alt,
      category: card.dataset.category,
      title: card.dataset.title
    }));
    images.forEach(item => { const preload = new Image(); preload.src = item.image; });
    const update = () => {
      if (d.hidden || workRotation.matches(':hover') || workRotation.contains(d.activeElement)) return;
      cards.forEach(card => card.classList.add('is-fading'));
      setTimeout(() => {
        if (workRotation.matches(':hover') || workRotation.contains(d.activeElement)) {
          cards.forEach(card => card.classList.remove('is-fading'));
          return;
        }
        images = [images[images.length - 1], ...images.slice(0, -1)];
        cards.forEach((card, i) => {
          const item = images[i];
          const img = $('img', card);
          img.src = item.image;
          img.alt = item.alt;
          $('small', card).textContent = item.category;
          $('b', card).textContent = item.title;
        });
        requestAnimationFrame(() => cards.forEach(card => card.classList.remove('is-fading')));
      }, 420);
    };
    setInterval(update, 5000);
  }

  // Keep the privacy embed quiet until the visitor chooses to play it.
  const embedLaunch = $('.embed-launch');
  const showreelFrame = $('.embed-frame iframe');
  if (embedLaunch && showreelFrame) {
    embedLaunch.addEventListener('click', () => {
      showreelFrame.src = showreelFrame.dataset.src;
      showreelFrame.hidden = false;
      embedLaunch.remove();
      showreelFrame.focus();
    }, { once: true });
  }

  // Nav
  const nav = $('.nav'), tog = $('.nav-toggle');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  if (nav && tog) {
    const menu = $('#menu');
    const setMenu = (o, focus = true) => {
      nav.classList.toggle('open', o); tog.setAttribute('aria-expanded', o); tog.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      if (o && focus) $('a', menu).focus(); if (!o && focus) tog.focus();
    };
    tog.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false, false)));
  }

  // Hero crossfade (stills until a real reel exists)
  const reel = $$('.reel img');
  if (reel.length) {
    reel[0].classList.add('on');
    if (!reduce && reel.length > 1) addEventListener('load', () => {
      reel.forEach(i => { if (i.dataset.src) i.src = i.dataset.src; });
      let k = 0; setInterval(() => { if (d.hidden) return; reel[k].classList.remove('on'); k = (k + 1) % reel.length; reel[k].classList.add('on'); }, 5500);
    });
  }
  const hv = $('.reel-video'); if (hv && reduce) hv.pause();

  // Video modal player (YouTube / Vimeo), Esc + backdrop close, focus returns to opener
  const vm = $('.vmodal');
  if (vm && vm.showModal) {
    const frame = $('.vm-frame', vm), title = $('#vm-title', vm); let opener = null;
    const open = b => {
      const yt = b.dataset.youtube, vi = b.dataset.vimeo; if (!yt && !vi) return;
      opener = b; title.textContent = b.dataset.title || 'Video';
      const f = d.createElement('iframe');
      f.src = yt ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?autoplay=1&rel=0&cc_load_policy=1` : `https://player.vimeo.com/video/${encodeURIComponent(vi)}?autoplay=1&dnt=1`;
      f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; f.allowFullscreen = true; f.title = b.dataset.title || 'Video player';
      frame.replaceChildren(f); vm.showModal(); $('.vm-close', vm).focus();
    };
    $$('[data-youtube],[data-vimeo]').forEach(b => b.addEventListener('click', () => open(b)));
    $('.vm-close', vm).addEventListener('click', () => vm.close());
    vm.addEventListener('click', e => { if (e.target === vm) vm.close(); });
    vm.addEventListener('close', () => { frame.replaceChildren(); opener && opener.focus(); });
  }

  // Filters (videos + photos) with counts and a live status message
  $$('.filters').forEach(g => {
    const target = $(g.dataset.target); if (!target) return;
    const btns = $$('button', g), items = $$('[data-c]', target), status = g.nextElementSibling;
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      let n = 0; items.forEach(f => { const show = b.dataset.f === 'all' || f.dataset.c === b.dataset.f; f.hidden = !show; if (show) { n++; $$('[data-reveal]', f).concat(f.matches('[data-reveal]') ? [f] : []).forEach(x => x.classList.add('in')); } });
      if (status && status.classList.contains('filter-status')) status.textContent = `Showing ${n} item${n === 1 ? '' : 's'}: ${b.firstChild.textContent.trim()}`;
    }));
  });

  // Photo lightbox with keyboard nav
  const lb = $('.lightbox');
  if (lb && lb.showModal) {
    const img = $('img', lb), cap = $('figcaption', lb); let list = [], i = 0, opener = null;
    const show = n => { i = (n + list.length) % list.length; const a = list[i], t = $('img', a); img.src = a.href; img.alt = t.alt; cap.textContent = `${t.alt} · ${a.dataset.cap} (${i + 1}/${list.length})`; };
    $$('a.lb').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); list = $$('.masonry figure:not([hidden]) a.lb'); opener = a; show(list.indexOf(a)); lb.showModal(); $('.lb-next', lb).focus();
    }));
    $('.lb-prev', lb).onclick = () => show(i - 1); $('.lb-next', lb).onclick = () => show(i + 1); $('.lb-close', lb).onclick = () => lb.close();
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => { img.removeAttribute('src'); if (opener && !opener.closest('[hidden]')) opener.focus(); });
  }

  // Contact form: keep delivery paused until the placeholder endpoint is replaced.
  const form = $('form[data-ajax]');
  if (form) {
    const sv = new URLSearchParams(location.search).get('service'), sel = $('select[name=service]', form);
    if (sv && sel) [...sel.options].forEach(o => { if (o.text === sv) sel.value = o.value; });
    const st = $('.form-status', form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.hasAttribute('data-endpoint-placeholder') || form.action.includes('PLACEHOLDER')) {
        st.textContent = 'Form delivery is not connected yet. Please email carlossalmon77@gmail.com.';
        return;
      }
      const btn = $('button[type=submit]', form); btn.disabled = true; st.textContent = 'Sending…';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw 0; form.reset(); st.textContent = "Thanks, your message is on its way. I'll get back to you by email.";
      } catch { st.textContent = 'Something went wrong sending the form. Please email me directly instead.'; }
      btn.disabled = false;
    });
  }

  // Page transitions: fade out on plain left-clicks to other internal pages only
  if (!reduce) $$('a[href$=".html"], a[href*=".html?"]').forEach(a => a.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
    if (a.origin !== location.origin || a.pathname === location.pathname) return;
    e.preventDefault(); d.body.classList.add('leaving'); setTimeout(() => { location.href = a.href; }, 160);
  }));
  addEventListener('pageshow', () => d.body.classList.remove('leaving'));
})();
