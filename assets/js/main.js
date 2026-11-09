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
  if (to) { const g = $("#guestGreeting"); g.textContent = `Dear ${to}`; g.hidden = false; $("#rsvpForm [name=name]").value = to; }

  // ---- image fallback (elegant gradient if a photo fails) ----
  const ph = img => { img.addEventListener("error", () => img.classList.add("ph-failed"), { once: true }); if (img.complete && !img.naturalWidth && img.src) img.classList.add("ph-failed"); };

  // ---- envelope ----
  const openInvite = () => {
    document.body.classList.add("is-opening");
    setTimeout(() => { document.body.classList.remove("is-sealed", "is-opening"); document.body.classList.add("is-open"); $("#envelope").remove(); }, 2300);
    if (W.music) { const a = $("#bgm"); a.src = W.music; a.play().then(() => $("#musicBtn").classList.add("on")).catch(() => {}); }
  };
  $("#openSeal").addEventListener("click", openInvite, { once: true });
  if (W.music) { const b = $("#musicBtn"); b.hidden = false; b.onclick = () => { const a = $("#bgm"); if (a.paused) { a.play(); b.classList.add("on"); } else { a.pause(); b.classList.remove("on"); } }; }

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
  $("#mapFrame").src = `https://maps.google.com/maps?q=${q}&z=14&output=embed`;

  // ---- gallery & swatches ----
  $("#galleryTrack").innerHTML = W.gallery.map((src, i) => `<figure class="g g${i % 6}"><img src="${esc(src)}" alt="" data-ph loading="lazy"></figure>`).join("");
  $("#swatches").innerHTML = W.palette.map(c => `<i style="background:${esc(c)}"></i>`).join("");
  $$("img[data-ph]").forEach(ph);

  // ---- reveal on scroll ----
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  // ---- nav + parallax ----
  const nav = $("#nav"), par = $(".parallax"), band = $(".quote-band");
  const onScroll = () => {
    nav.classList.toggle("solid", scrollY > innerHeight * .6);
    if (par) { const r = band.getBoundingClientRect(); par.style.transform = `translate3d(0,${(r.top - innerHeight / 2) * -0.12}px,0) scale(1.2)`; }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---- meals ----
  if (W.meals && W.meals.length) $("#mealSelect").innerHTML = W.meals.map(m => `<option>${esc(m)}</option>`).join("");
  else $("#mealField").remove();

  // ---- RSVP ----
  const form = $("#rsvpForm"), msg = $("#formMsg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (f._gotcha) return;
    if (!f.name || !f.attending) { msg.textContent = "Please add your name and let us know if you can attend."; return; }
    const text = `RSVP — ${binds.names}\nName: ${f.name}\nResponse: ${f.attending}\nGuests: ${f.guests}\nPhone: ${f.phone || "-"}\nMeal: ${f.meal || "-"}\nDietary: ${f.dietary || "-"}\nNote: ${f.message || "-"}`;
    const r = W.rsvp;
    try {
      if (r.mode === "formspree" && r.formspree) {
        const res = await fetch(r.formspree, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw 0;
      } else if (r.mode === "email") {
        location.href = `mailto:${r.email}?subject=${encodeURIComponent("RSVP — " + f.name)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${r.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
      }
      form.classList.add("sent");
      msg.textContent = f.attending.startsWith("Joy") ? "Thank you! We can’t wait to celebrate with you." : "Thank you for letting us know — you’ll be missed.";
    } catch { msg.textContent = "Something went wrong — please try again."; }
  });
})();
