# Session memory — Tim & Sandipa wedding e-invite

_Last updated: 2026-11-09. Keep this file current each session._

## Project
- Static site (HTML/CSS/JS, no build). All content lives in `assets/js/config.js`.
- Repo: singhadhil18/TimWedsSands, branch `claude/sweet-cerf-8qohwu`.
- Target domain: timonweds.sandeepa.co.za (spelling unconfirmed) on the owner's web host control panel. Not deployed yet.
- Inspiration: https://myevite.co.za/AshAndDemi/ — NOT yet seen (host blocked by session network policy).

## Owner preferences
- Tone: beautiful, warm, love-celebrating; trending, sleek, elegant, professional.
- No login / guest codes.
- RSVP = number of attendees + each attendee's name. Sent via WhatsApp. Also logged to a Google Sheet.
- No meal choices. Instead showcase the highly rated chef and fine Indian wedding cuisine / food & drink (chef + menu TBD).
- Song: "A Thousand Years (Violin & Piano)" — latest upload in owner's Google Drive (file id 1Y_JMkBs8VMmzFreOMvbPKyKRimzJnxne).
- Target Lighthouse ~100 in every category.
- Wants pragmatic, honest feedback: flag oversights, shortcomings, improvements; ask when unclear.
- Photos of the couple coming later; Unsplash placeholders until then.

## Update 2026-11-10
- Theme changed to soft pastels (blush, sage, lilac, peach, rose accent) with light Eastern accents (mandala line art, Mughal-arch photo frames); clean, modern.
- RSVP WhatsApp number set: +27 60 383 7968.
- Deployment: GitHub Actions FTP workflow added (`.github/workflows/deploy.yml`); needs repo secrets FTP_SERVER, FTP_USERNAME, FTP_PASSWORD (+ optional variable FTP_DIR). Not yet live.
- Preview copies uploaded to Google Drive: AceSite / Tim & Sandipa Wedding Invite.

## Update 2026-11-10 (later)
- Host: WebHostMost. Owner wants deploys pulled from GitHub; `main` branch created as the deploy branch.
- Domain found via registry email: **timoanwedssandipa.co.za** (registered 2026-11-09) — a full domain, not a subdomain. Suggests the couple may be "Timoan & Sandipa"; names on site still "Tim & Sandipa" pending confirmation.
- Bride’s name confirmed: **Sandipa** (2026-11-10). Groom: **Timoan** (full name). Nicknames Tim & Sands — kept in hashtag #TimWedsSands.
- Design brief: pastel, romantic and warm. Added warm rose/peach palette, falling petals, warmer wording.

## Decisions so far
- Design: envelope + wax seal intro, forest green / ivory / champagne gold, Italiana + Cormorant Garamond + Pinyon Script + Jost (self-hosted).
- Music tries to autoplay on load, else starts on first scroll/swipe/tap/key (incl. seal tap), fades in; `musicStart` offsets into the track.
- Map loads on tap (keeps the page fast and avoids Google cookies until asked).
- Personalised links: `?to=Guest%20Name`.

## Action items for next session
1. Real wedding date + time(s) — currently placeholder 12 June 2027.
2. Real venue name + address — placeholder.
3. ~~RSVP WhatsApp number~~ done.
4. Confirm events list (Mehndi / Sangeet / Ceremony / Reception?) and dress codes.
5. Chef name, credentials, menu and bar details.
6. ~~Song file~~ done 2026-11-10: Brooklyn Duo "A Thousand Years (Wedding Version)", starts at 20s, autoplays on load or first scroll/tap. 12 MB @320kbps — consider re-encoding to ~128kbps (~5 MB).
7. Owner to deploy the Apps Script and paste the URL (see `docs/google-sheet-setup.md`).
8. Couple's photos (hero landscape ≥2000px, portraits ≥900px) + their real story text.
9. Confirm domain spelling; create subdomain, upload, enable SSL.
10. Screenshots of the inspiration site or allow myevite.co.za in network settings.
11. RSVP deadline, max guests per invite, kids / plus-one policy, gift wording.

## Update 2026-11-10 — mobile optimisation (Lighthouse mobile 100/100/100/100, desktop 100s)
- Guests open the invite from WhatsApp on phones, so mobile is the priority.
- **CSS now lives inline in `index.html`** (`<style>` in the head); `assets/css/style.css` was removed. Edit styles there.
- Page behind the envelope is `display:none` until the seal is tapped (big first-paint win on phones).
- Photos are fetched ~0.6s after page load (or on first tap/scroll) via `data-src`/`data-srcset`, so the envelope paints first.
- Unsplash placeholders: cropped per slot, AVIF/WebP, q=80, `srcset` sized for 3x retina phones (hero/quote band use tall 1:2 crops on portrait screens). When the couple's photos arrive, export hero/quote band ≥2400px and others ≥1600px; consider generating resized versions for srcset.
- Song: `assets/audio/a-thousand-years.m4a` — trimmed to start at 0:20 of the original, AAC 160 kbps, −1.5 dB headroom (peak −1.1 dBFS, no clipping), 2.5s fade-in baked in (iOS ignores JS volume). Original 320 kbps MP3 is in git history (commit b65a84e) if a different start is wanted.
- WhatsApp preview: `assets/img/og-cover.jpg` (1200×630 branded card, no date — WhatsApp caches previews; regenerate once the real date is set). Absolute og: URLs use https://timoanwedssandipa.co.za/.
- Icons: `favicon.ico`, `assets/img/apple-touch-icon.png`. `.cpanel.yml` copies `favicon.ico` too; `.htaccess` serves `.m4a` as audio/mp4.

## Update 2026-11-10 — phone review fixes
- Envelope: bold "Tap the seal to open" on the flap; below it "The Viriah and Sukhnundan families / welcome you" (config `hosts`). `?to=` guest name still shows under it when present.
- Header shows "Timoan & Sandipa" on phones (T&S on desktop); header is fully opaque once scrolled.
- Story timeline on phones: short connectors between milestones (line no longer crosses text).
- In-page links (header RSVP etc.) scroll via JS with re-aim — iOS Safari stopped short on plain #anchor jumps.
- Save-the-date: iPhone → native calendar sheet (data: .ics), Android → Google Calendar, desktop → .ics download. ICS text now escaped.
- RSVP: after sending, shows "Open WhatsApp" link (in-app browsers may block the pop-up) and "Edit my reply".
- Keep the inlined HTML under ~14 KB gzipped (one TCP round trip) and avoid new fonts/styles on the envelope — e.g. italic Cormorant there cost a Lighthouse point.
