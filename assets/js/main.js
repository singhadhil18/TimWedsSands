(() => {
  const W = window.WEDDING, $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const d = new Date(W.date);
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---- bind text ----
  const fmt = o => d.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", ...o });
  const binds = {
    ...W, names: `${W.partner1} & ${W.partner2}`,
    dayName: fmt({ weekday: "long" }),
    dateShort: `${pad(fmt({ day: "numeric" }))} · ${fmt({ month: "2-digit" })} · ${fmt({ year: "2-digit" })}`,
    dateLong: fmt({ day: "numeric", month: "long", year: "numeric" })
  };
  $$("[data-bind]").forEach(el => { const v = binds[el.dataset.bind]; if (typeof v === "string") el.textContent = v; });
  document.title = `${binds.names} · Wedding Invitation`;

  // ---- personalised greeting: ?to=The%20Naidoo%20Family ----
  const to = new URLSearchParams(location.search).get("to");
  if (to) { const g = $("#guestGreeting"); g.textContent = to; g.hidden = false; }

  // ---- image fallback (elegant gradient if a photo fails) ----
  const ph = img => { img.addEventListener("error", () => img.classList.add("ph-failed"), { once: true }); if (img.complete && !img.naturalWidth && img.src) img.classList.add("ph-failed"); };

  // ---- music: tries to play on page load, then on the first scroll / swipe / tap / key.
  //      Browsers only allow sound after the guest interacts, so we keep retrying until one works.
  const audio = $("#bgm"), mBtn = $("#musicBtn"), vol = W.musicVolume ?? .6;
  let fadeTimer;
  const fadeTo = (v, ms = 2500) => {
    clearInterval(fadeTimer); const from = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); audio.volume = from + (v - from) * k; if (k === 1) { clearInterval(fadeTimer); if (!v) audio.pause(); } }, 40);
  };
  const setBtn = on => { mBtn.hidden = false; mBtn.classList.toggle("on", on); mBtn.setAttribute("aria-pressed", String(on)); };
  const wakeEvents = ["pointerdown", "touchstart", "touchend", "keydown", "click", "wheel", "touchmove", "scroll"];
  let playing = false, lastTry = 0;
  const unbind = () => wakeEvents.forEach(ev => removeEventListener(ev, startMusic, true));
  function startMusic(e) {
    if (!W.music || playing) return;
    // scroll/wheel/touchmove fire constantly — only retry those a few times a second
    const now = performance.now(); if (e && /wheel|move|scroll/.test(e.type) && now - lastTry < 250) return; lastTry = now;
    if (!audio.src) {
      audio.src = W.music; audio.volume = 0;
      audio.addEventListener("loadedmetadata", () => { if (W.musicStart && audio.currentTime < W.musicStart) audio.currentTime = W.musicStart; }, { once: true });
      audio.addEventListener("error", () => { playing = true; unbind(); mBtn.hidden = true; }, { once: true });
    }
    audio.play().then(() => { if (playing) return; playing = true; unbind(); setBtn(true); fadeTo(vol); }).catch(() => {});
  }
  if (W.music) { audio.preload = "auto"; wakeEvents.forEach(ev => addEventListener(ev, startMusic, { capture: true, passive: true })); startMusic(); }
  mBtn.addEventListener("click", () => {
    const on = audio.paused || mBtn.getAttribute("aria-pressed") !== "true"; setBtn(on);
    if (on) { audio.play().catch(() => {}); fadeTo(vol, 800); } else fadeTo(0, 600);
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && !audio.paused) audio.pause(); else if (!document.hidden && mBtn.classList.contains("on")) audio.play().catch(() => {}); });

  // ---- envelope ----
  const main = $("#main"), navEl = $("#nav");
  main.inert = navEl.inert = true;
  $("#openSeal").addEventListener("click", () => {
    document.body.classList.add("is-opening"); startMusic();
    setTimeout(() => { document.body.classList.remove("is-sealed", "is-opening"); document.body.classList.add("is-open"); main.inert = navEl.inert = false; $("#envelope").remove(); }, 2300);
  }, { once: true });

  // ---- countdown ----
  const tick = () => {
    let t = Math.max(0, d - Date.now()) / 1000;
    $("#cdD").textContent = pad(Math.floor(t / 86400), 3); t %= 86400;
    $("#cdH").textContent = pad(Math.floor(t / 3600)); t %= 3600;
    $("#cdM").textContent = pad(Math.floor(t / 60));
    $("#cdS").textContent = pad(Math.floor(t % 60));
  };
  tick(); setInterval(tick, 1000);

  // ---- calendar (.ics) ----
  $("#addCal").addEventListener("click", e => {
    e.preventDefault();
    const z = x => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(d.getTime() + 8 * 3600e3);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding//EN", "BEGIN:VEVENT", `UID:${z(d)}@wedding`, `DTSTAMP:${z(new Date())}`,
      `DTSTART:${z(d)}`, `DTEND:${z(end)}`, `SUMMARY:${binds.names} — Wedding`, `LOCATION:${W.venueName}, ${W.venueAddress}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "wedding.ics"; a.click();
  });

  // ---- events ----
  $("#eventList").innerHTML = W.events.map((ev, i) => `
    <article class="event reveal ${i % 2 ? "flip" : ""}">
      <figure><img src="${esc(ev.img)}" alt="" data-ph loading="lazy"></figure>
      <div class="event-body">
        <span class="event-no">${pad(i + 1)}</span>
        <h3>${esc(ev.name)}</h3>
        <dl><dt>Date</dt><dd>${esc(ev.date)}</dd><dt>Time</dt><dd>${esc(ev.time)}</dd><dt>Where</dt><dd>${esc(ev.place)}</dd><dt>Attire</dt><dd>${esc(ev.dress)}</dd></dl>
      </div>
    </article>`).join("");

  // ---- venue ----
  const q = encodeURIComponent(W.mapsQuery || W.venueAddress);
  $("#mapsBtn").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("#wazeBtn").href = `https://waze.com/ul?q=${q}&navigate=yes`;
  $("#mapLoad").addEventListener("click", () => { $("#mapBox").innerHTML = `<iframe title="Venue map" loading="lazy" src="https://maps.google.com/maps?q=${q}&z=14&output=embed"></iframe>`; });
  $("#feastList").innerHTML = (W.feast || []).map(x => `<li>${esc(x)}</li>`).join("");

  // ---- gallery & swatches ----
  $("#galleryTrack").innerHTML = W.gallery.map((src, i) => `<figure class="g g${i % 6}"><img src="${esc(src)}" alt="" data-ph loading="lazy"></figure>`).join("");
  $("#swatches").innerHTML = W.palette.map(c => `<i style="background:${esc(c)}"></i>`).join("");
  $$("img[data-ph]").forEach(ph);

  // ---- reveal on scroll ----
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  // ---- nav + parallax ----
  const nav = $("#nav"), par = $(".parallax"), band = $(".quote-band");
  let ticking = false;
  const paint = () => {
    ticking = false;
    nav.classList.toggle("solid", scrollY > innerHeight * .6);
    if (par) { const r = band.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) par.style.transform = `translate3d(0,${(r.top - innerHeight / 2) * -0.12}px,0) scale(1.2)`; }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---- RSVP: attendee count + names -> Google Sheet + WhatsApp ----
  const form = $("#rsvpForm"), msg = $("#formMsg"), out = $("#cntOut"), names = $("#guestNames"), party = $("#partyBlock");
  const max = W.rsvp.maxGuests || 6; let count = 1;
  const renderNames = () => {
    out.textContent = count;
    const old = [...names.querySelectorAll("input")].map(i => i.value);
    names.innerHTML = Array.from({ length: count - 1 }, (_, i) => `<label class="field"><span>Guest ${i + 2} — full name</span><input name="guest${i + 2}" value="${esc(old[i] || "")}" required autocomplete="off"></label>`).join("");
    $("#cntMinus").disabled = count <= 1; $("#cntPlus").disabled = count >= max;
  };
  $("#cntMinus").addEventListener("click", () => { count = Math.max(1, count - 1); renderNames(); });
  $("#cntPlus").addEventListener("click", () => { count = Math.min(max, count + 1); renderNames(); });
  form.addEventListener("change", e => { if (e.target.name === "attending") party.hidden = e.target.value.startsWith("Regret"); });
  renderNames();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (f._gotcha) return;
    const coming = (f.attending || "").startsWith("Joy");
    const guests = coming ? [f.name, ...[...names.querySelectorAll("input")].map(i => i.value.trim())] : [];
    if (!f.name.trim() || !f.attending) { msg.textContent = "Please add your name and let us know if you can attend."; return; }
    if (guests.some(g => !g)) { msg.textContent = "Please add a name for each attendee."; return; }
    const n = coming ? guests.length : 0;
    const text = `RSVP — ${binds.names}\nFrom: ${f.name.trim()}\nResponse: ${f.attending}` +
      (coming ? `\nAttendees: ${n}\n${guests.map((g, i) => `${i + 1}. ${g}`).join("\n")}` : "") + (f.message ? `\nNote: ${f.message}` : "");
    // 1) open WhatsApp first (must happen inside the tap, or browsers block it)
    window.open(`https://wa.me/${W.rsvp.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    // 2) log to the Google Sheet in the background
    if (W.rsvp.sheetUrl) fetch(W.rsvp.sheetUrl, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: f.name.trim(), attending: f.attending, count: n, guests: guests.join(", "), message: f.message || "", invitedAs: to || "", page: location.href }) }).catch(() => {});
    form.classList.add("sent");
    msg.textContent = coming ? "Thank you! Please press send in WhatsApp to confirm — we can’t wait to celebrate with you." : "Thank you for letting us know — please press send in WhatsApp. You’ll be missed.";
  });
})();
