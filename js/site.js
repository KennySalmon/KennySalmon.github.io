(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = motion.matches;
  d.documentElement.classList.add('js');

  // Keep the first screen renderable while the complete stylesheet loads.
  const lateStyle = $('link[data-late-style]');
  if (lateStyle) {
    const apply = () => { lateStyle.media = 'all'; lateStyle.removeAttribute('data-late-style'); };
    if (lateStyle.sheet) apply(); else lateStyle.addEventListener('load', apply, { once: true });
  }
  const analyticsToken = $('meta[name="cf-web-analytics-token"]')?.content.trim();
  if (analyticsToken && analyticsToken !== 'CLOUDFLARE_WEB_ANALYTICS_TOKEN_PLACEHOLDER') {
    const beacon = d.createElement('script');
    beacon.type = 'module'; beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.dataset.cfBeacon = JSON.stringify({ token: analyticsToken }); d.head.append(beacon);
  }

  const reveals = $$('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => el.getBoundingClientRect().top < innerHeight ? el.classList.add('in') : io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  // Final numbers live in the HTML. Only animate on the first visible entry.
  const counters = $$('[data-counter]');
  if (!reduce && 'IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const item = entry.target, output = $('.stat-value', item), final = output.textContent;
      const target = Number(item.dataset.target), decimals = Number(item.dataset.decimals || 0), suffix = item.dataset.suffix || '';
      const start = performance.now(); item.classList.add('is-visible');
      const tick = now => {
        const progress = Math.min(1, (now - start) / 1500);
        if (progress === 1 || motion.matches) { output.textContent = final; return; }
        const value = target * (1 - (1 - progress) ** 3);
        output.textContent = value.toFixed(decimals).replace(/\.0$/, '') + suffix;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: .35 });
    counters.forEach(item => io.observe(item));
  } else counters.forEach(item => item.classList.add('is-visible'));

  // Crossfade snapshots over the next photograph; pause on hover or keyboard focus.
  const rotation = $('[data-work-rotation]');
  if (rotation && !reduce) {
    const cards = $$('[data-work-card]', rotation);
    let images = cards.map(card => ({
      image: card.dataset.image, alt: card.dataset.alt, category: card.dataset.category, title: card.dataset.title,
      avif: $('source[type="image/avif"]', card)?.srcset, jpg: $('img', card).srcset
    }));
    let timer = 0, visible = false, busy = false;
    const paused = () => motion.matches || d.hidden || rotation.matches(':hover') || rotation.contains(d.activeElement);
    const stop = () => { clearInterval(timer); timer = 0; };
    const update = async () => {
      if (paused() || busy) return;
      busy = true;
      const next = [images[images.length - 1], ...images.slice(0, -1)];
      const snapshots = cards.map(card => {
        const layer = d.createElement('div'); layer.className = 'rotation-outgoing'; layer.setAttribute('aria-hidden', 'true'); layer.inert = true;
        layer.append($('picture', card).cloneNode(true), $('.work-caption', card).cloneNode(true)); card.append(layer); return layer;
      });
      const ready = cards.map((card, i) => {
        const item = next[i], picture = $('picture', card), img = $('img', picture);
        const source = $('source[type="image/avif"]', picture); if (source) source.srcset = item.avif;
        img.srcset = item.jpg; img.src = item.image; img.alt = item.alt;
        $('small', card).textContent = item.category; $('b', card).textContent = item.title;
        return img.decode().catch(() => {});
      });
      await Promise.all(ready);
      // A hover, focus or motion change while decoding keeps the current pictures still.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (paused()) {
        await Promise.all(cards.map((card, i) => {
          const picture = $('picture', card), img = $('img', picture), item = images[i];
          const source = $('source[type="image/avif"]', picture); if (source) source.srcset = item.avif;
          img.srcset = item.jpg; img.src = item.image; img.alt = item.alt;
          $('small', card).textContent = item.category; $('b', card).textContent = item.title;
          return img.decode().catch(() => {});
        }));
        snapshots.forEach(layer => layer.remove()); busy = false; return;
      }
      images = next;
      snapshots.forEach(layer => layer.classList.add('is-fading'));
      setTimeout(() => { snapshots.forEach(layer => layer.remove()); busy = false; }, 650);
    };
    const start = () => { if (visible && !paused() && !timer) timer = setInterval(update, 5000); };
    rotation.addEventListener('pointerenter', stop); rotation.addEventListener('pointerleave', start);
    rotation.addEventListener('focusin', stop); rotation.addEventListener('focusout', () => setTimeout(start));
    d.addEventListener('visibilitychange', () => d.hidden ? stop() : start());
    motion.addEventListener('change', () => motion.matches ? stop() : start());
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; visible ? start() : stop(); }); io.observe(rotation);
    } else { visible = true; start(); }
  }

  const nav = $('.nav'), toggle = $('.nav-toggle');
  if (nav && toggle) {
    const menu = $('#menu');
    const setMenu = (open, focus = true) => {
      nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (focus) (open ? $('a', menu) : toggle).focus();
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    d.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false, false); });
  }

  // The first still renders without JavaScript; later stills load after the first paint.
  const reel = $$('.reel img');
  if (reel.length && !reduce) {
    reel[0].classList.add('on');
    const loadPicture = picture => {
      $$('[data-srcset]', picture).forEach(el => { el.srcset = el.dataset.srcset; delete el.dataset.srcset; });
      const img = $('img', picture); if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
      return img.decode().catch(() => {});
    };
    const start = () => {
      let k = 0;
      const idle = window.requestIdleCallback || (fn => setTimeout(fn, 50));
      setTimeout(() => idle(() => {
        Promise.all(reel.slice(1).map(img => loadPicture(img.closest('picture')))).then(() => {
          const carousel = setInterval(() => {
            if (motion.matches) { clearInterval(carousel); return; }
            if (d.hidden) return;
            reel[0].closest('.reel').classList.add('is-rotating');
            reel[k].classList.remove('on'); k = (k + 1) % reel.length; reel[k].classList.add('on');
          }, 5500);
        });
      }), 3000);
    };
    if (d.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
  }

  // Decorative photo fades only attach to unloaded images below the initial viewport.
  if (!reduce) $$('.masonry img').forEach(img => {
    if (img.complete || img.getBoundingClientRect().top < innerHeight) return;
    img.addEventListener('load', () => {
      if (!motion.matches) { img.classList.add('photo-loaded'); img.addEventListener('animationend', () => img.classList.remove('photo-loaded'), { once: true }); }
    }, { once: true });
  });

  // Dialog controls are set up on the first tap, with a single delegated launcher.
  let videoPlayer, photoViewer;
  const initVideo = () => {
    const vm = $('.vmodal'); if (!vm?.showModal) return null;
    const frame = $('.vm-frame', vm), title = $('#vm-title', vm); let opener;
    $('.vm-close', vm).addEventListener('click', () => vm.close());
    vm.addEventListener('click', event => { if (event.target === vm) vm.close(); });
    vm.addEventListener('close', () => { frame.replaceChildren(); opener?.focus(); });
    return button => {
      opener = button; title.textContent = button.dataset.title || 'Video';
      const iframe = d.createElement('iframe'), yt = button.dataset.youtube;
      iframe.src = yt ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?autoplay=1&rel=0&cc_load_policy=1` : `https://player.vimeo.com/video/${encodeURIComponent(button.dataset.vimeo)}?autoplay=1&dnt=1`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; iframe.allowFullscreen = true; iframe.title = title.textContent;
      frame.replaceChildren(iframe); vm.showModal(); $('.vm-close', vm).focus();
    };
  };
  const initPhotos = () => {
    const lb = $('.lightbox'); if (!lb?.showModal) return null;
    const img = $('img', lb), caption = $('figcaption', lb); let list = [], index = 0, opener;
    const show = n => {
      index = (n + list.length) % list.length;
      const link = list[index]; img.src = link.href; img.alt = $('img', link).alt;
      caption.textContent = `${img.alt} · ${link.dataset.cap} (${index + 1}/${list.length})`;
    };
    const close = () => {
      if (lb.classList.contains('is-closing')) return;
      if (motion.matches) { lb.close(); return; }
      lb.classList.add('is-closing'); setTimeout(() => lb.close(), 180);
    };
    $('.lb-prev', lb).addEventListener('click', () => show(index - 1));
    $('.lb-next', lb).addEventListener('click', () => show(index + 1));
    $('.lb-close', lb).addEventListener('click', close);
    lb.addEventListener('cancel', event => { event.preventDefault(); close(); });
    lb.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(index + (event.key === 'ArrowLeft' ? -1 : 1)); }
    });
    lb.addEventListener('click', event => { if (event.target === lb) close(); });
    lb.addEventListener('close', () => {
      lb.classList.remove('is-closing'); img.removeAttribute('src');
      if (opener && !opener.closest('[hidden]')) opener.focus();
    });
    return link => {
      list = $$('.masonry figure:not([hidden]) a.lb'); opener = link; show(list.indexOf(link));
      lb.showModal(); $('.lb-next', lb).focus();
    };
  };
  d.addEventListener('click', event => {
    const button = event.target.closest('[data-youtube],[data-vimeo]');
    if (button) { videoPlayer ||= initVideo(); videoPlayer?.(button); return; }
    const photo = event.target.closest('a.lb');
    if (photo && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      photoViewer ||= initPhotos(); if (photoViewer) { event.preventDefault(); photoViewer(photo); } return;
    }
    const launch = event.target.closest('.embed-launch');
    if (launch) {
      const frame = $('.embed-frame iframe'); frame.src = frame.dataset.src; frame.hidden = false; launch.remove(); frame.focus();
    }
  });

  // Delegated gallery filters preserve the visible photo sequence for the lightbox.
  $$('.filters').forEach(group => group.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || !group.contains(button)) return;
    const target = $(group.dataset.target); if (!target) return;
    $$('button', group).forEach(item => { item.classList.toggle('on', item === button); item.setAttribute('aria-pressed', item === button); });
    let count = 0;
    $$('[data-c]', target).forEach(item => { item.hidden = button.dataset.f !== 'all' && item.dataset.c !== button.dataset.f; if (!item.hidden) { count++; item.classList.add('in'); } });
    const status = group.nextElementSibling;
    if (status?.classList.contains('filter-status')) status.textContent = `Showing ${count} item${count === 1 ? '' : 's'}: ${button.firstChild.textContent.trim()}`;
  }));

  const showStatus = (element, text) => {
    element.classList.remove('is-updated'); element.textContent = text;
    requestAnimationFrame(() => element.classList.add('is-updated'));
  };
  const form = $('form[data-ajax]');
  if (form) {
    const service = new URLSearchParams(location.search).get('service'), select = $('select[name=service]', form);
    if (service && select) [...select.options].forEach(option => { if (option.text === service) select.value = option.value; });
    const status = $('.form-status', form);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if ($('input[name="_gotcha"]', form)?.value.trim()) { showStatus(status, 'Unable to send this message. Please email carlossalmon77@gmail.com.'); return; }
      if (form.hasAttribute('data-endpoint-placeholder') || form.action.includes('PLACEHOLDER')) { showStatus(status, 'Form delivery is not connected yet. Please email carlossalmon77@gmail.com.'); return; }
      const button = $('button[type=submit]', form); button.disabled = true; showStatus(status, 'Sending…');
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Delivery failed');
        form.reset(); showStatus(status, "Thanks, your message is on its way. I'll get back to you by email.");
      } catch { showStatus(status, 'Something went wrong sending the form. Please email me directly instead.'); }
      finally { button.disabled = false; }
    });
    // The mailto link remains the fallback when the clipboard is unavailable.
    const email = $('.contact-meta a[href^="mailto:"]');
    if (email && navigator.clipboard?.writeText) {
      const note = d.createElement('span'); note.className = 'copy-status'; note.setAttribute('role', 'status'); note.setAttribute('aria-live', 'polite'); email.after(note);
      email.addEventListener('click', async event => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        try { await navigator.clipboard.writeText(email.href.slice(7)); note.textContent = 'Copied'; setTimeout(() => { note.textContent = ''; }, 2500); }
        catch { location.href = email.href; }
      });
    }
  }
})();
