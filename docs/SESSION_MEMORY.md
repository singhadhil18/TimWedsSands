# Session memory — Tim & Sandeepa wedding e-invite

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

## Decisions so far
- Design: envelope + wax seal intro, forest green / ivory / champagne gold, Italiana + Cormorant Garamond + Pinyon Script + Jost (self-hosted).
- Music starts on seal tap (browsers block autoplay before a tap), fades in; `musicStart` offsets into the track.
- Map loads on tap (keeps the page fast and avoids Google cookies until asked).
- Personalised links: `?to=Guest%20Name`.

## Action items for next session
1. Real wedding date + time(s) — currently placeholder 12 June 2027.
2. Real venue name + address — placeholder.
3. RSVP WhatsApp number — placeholder 27000000000 (RSVP will not reach anyone until set).
4. Confirm events list (Mehndi / Sangeet / Ceremony / Reception?) and dress codes.
5. Chef name, credentials, menu and bar details.
6. Add the song file to `assets/audio/a-thousand-years.mp3`; then set `musicStart`.
7. Owner to deploy the Apps Script and paste the URL (see `docs/google-sheet-setup.md`).
8. Couple's photos (hero landscape ≥2000px, portraits ≥900px) + their real story text.
9. Confirm domain spelling; create subdomain, upload, enable SSL.
10. Screenshots of the inspiration site or allow myevite.co.za in network settings.
11. RSVP deadline, max guests per invite, kids / plus-one policy, gift wording.
