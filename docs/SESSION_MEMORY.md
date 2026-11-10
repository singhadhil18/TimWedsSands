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
- Bride’s name confirmed: **Sandipa** (2026-11-10). Groom: "Tim" vs "Timoan" still to confirm.
- Design brief: pastel, romantic and warm. Added warm rose/peach palette, falling petals, warmer wording.

## Decisions so far
- Design: envelope + wax seal intro, forest green / ivory / champagne gold, Italiana + Cormorant Garamond + Pinyon Script + Jost (self-hosted).
- Music starts on seal tap (browsers block autoplay before a tap), fades in; `musicStart` offsets into the track.
- Map loads on tap (keeps the page fast and avoids Google cookies until asked).
- Personalised links: `?to=Guest%20Name`.

## Action items for next session
1. Real wedding date + time(s) — currently placeholder 12 June 2027.
2. Real venue name + address — placeholder.
3. ~~RSVP WhatsApp number~~ done.
4. Confirm events list (Mehndi / Sangeet / Ceremony / Reception?) and dress codes.
5. Chef name, credentials, menu and bar details.
6. Add the song file to `assets/audio/a-thousand-years.mp3`; then set `musicStart`.
7. Owner to deploy the Apps Script and paste the URL (see `docs/google-sheet-setup.md`).
8. Couple's photos (hero landscape ≥2000px, portraits ≥900px) + their real story text.
9. Confirm domain spelling; create subdomain, upload, enable SSL.
10. Screenshots of the inspiration site or allow myevite.co.za in network settings.
11. RSVP deadline, max guests per invite, kids / plus-one policy, gift wording.
