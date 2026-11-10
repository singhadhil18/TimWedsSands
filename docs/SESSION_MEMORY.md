# Session refresher — Timoan & Sandipa wedding e-invite

_Last updated: 2026-11-10. Read this first in every new session, and keep it current before you push._

---

## 1. What this is

A single-page wedding invitation, sent to guests on **WhatsApp** and opened mostly on **iPhone/Android in WhatsApp's in-app browser**. Mobile is the priority for every decision.

- **Live:** https://timoanwedssandipa.co.za · admin: https://timoanwedssandipa.co.za/admin
- **Repo:** `singhadhil18/TimWedsSands` (private) · deploy branch: **`main`** (every push deploys)
- **Stack:** static HTML/CSS/JS, **no build step**. Supabase (Postgres + RLS) for family invites and RSVPs.
- **Host:** WebHostMost (DirectAdmin "Evolution" panel), `server5.webhostmost.com`, account user `xesuzeeq`, site folder `~/domains/timoanwedssandipa.co.za/public_html`.
- **Couple:** Timoan (groom) & Sandipa (bride). Nicknames Tim & Sands → hashtag `#TimWedsSands`. Hosts: **The Viriah and Sukhnundan families**.
- **Owner:** Adhil Singh. Wants honest, pragmatic feedback; flag oversights and **ask when unclear**.

## 2. File map

| File | What it holds |
|---|---|
| `assets/js/config.js` | **All content**: names, date, venue, events, feast, RSVP settings, gallery, Supabase URL/key, invite-message template. Start here for any text change. |
| `index.html` | Markup **and all CSS (inlined `<style>`)**; there is no separate stylesheet. |
| `assets/js/main.js` | Behaviour: envelope, music, images, countdown, calendar, RSVP (Supabase + WhatsApp), smooth in-page links. |
| `admin.html` | Admin guest list (Supabase): families, seats, replies, history, invite messages, CSV, Copy guest list. |
| `docs/supabase/schema.sql` | Database tables, RLS policies, `get_invite` / `submit_rsvp` / `is_admin` functions. |
| `docs/supabase-setup.md` | How to set up Supabase and add families. |
| `assets/audio/a-thousand-years.m4a` | Background song (see §5). |
| `assets/img/og-cover.jpg` | WhatsApp/social link-preview card (1200×630). |
| `favicon.ico`, `assets/img/apple-touch-icon.png` | Icons. |
| `.htaccess` | HTTPS redirect, caching, MIME types, `/admin` + `/familyname` routing, blocks `/docs`. |
| `.github/workflows/deploy.yml` | Deploys `main` to the host over SSH (see §8). |
| `docs/google-sheet-*` | **Legacy** Google Sheet logger. Not used now that Supabase is connected. |

## 3. Features (current behaviour)

- **Envelope intro:** bold "Tap the seal to open" on the flap; "The Viriah and Sukhnundan families / welcome you" below (config `hosts`). On a family link it also shows the family name.
- **Family invite links:** `timoanwedssandipa.co.za/naidoo` (locally `?i=naidoo`). Shows "Dear {family}, your invitation admits N guests"; the form can't exceed the seats, and the **database enforces the seat limit and deadline** too. Re-submitting updates the reply; history is kept. The plain site without a family link asks guests to use their personal link.
- **Legacy greeting:** `?to=Guest%20Name` still shows a name on the envelope.
- **RSVP:** saved to Supabase via `submit_rsvp`, then opens WhatsApp (+27 60 383 7968) with the reply pre-filled. After sending it shows **Open WhatsApp** (in-app browsers can block the pop-up) and **Edit my reply**.
- **Music:** tries to play after page load; otherwise starts on the first tap/scroll/key (the seal tap always counts). Fades in; mute button bottom-right (above the iPhone home bar). Pauses when the tab is hidden.
- **Save the date:** iPhone → native Add to Calendar sheet; Android → Google Calendar; desktop → `.ics` download.
- **Header:** "Timoan & Sandipa" on phones, "T&S" on desktop; opaque once scrolled. RSVP button smooth-scrolls (JS, re-aims for iOS).
- **Map** loads only on tap (speed + no Google cookies until asked).
- **Admin (`/admin`):** sign in with the **admin code**, which is the password of the Supabase user `admin@timoanwedssandipa.co.za`. The code is never stored in the site; change it in Supabase → Authentication → Users. Stats, filters, add/bulk-add families, invite message (copy / WhatsApp), edit, history, clear reply, delete, Export CSV, **Copy guest list** (everyone coming, grouped by family).

## 4. Performance rules (Lighthouse 100/100/100/100 on mobile and desktop)

Verified 2026-11-10: mobile FCP 1.1 s, LCP 1.7 s, TBT 0, CLS 0, ~210–275 KB before the seal is tapped. **Re-run Lighthouse (mobile preset) after any change to `index.html` or `main.js`.** These are what keep it at 100:

1. **Keep `index.html` under ~14 KB gzipped** (`gzip -9 -c index.html | wc -c`, currently ~13 KB). Above that the first response needs an extra round trip on 4G; crossing it cost a point once. CSS comments were stripped for this reason, so keep new CSS terse.
2. **Nothing new on the envelope** that needs a font file not already preloaded (Italiana, Pinyon Script, Jost). Using italic Cormorant on the envelope cost a point.
3. **The page behind the envelope is `display:none` until the seal is tapped** (`body.is-sealed:not(.is-opening) main`). Don't change that to `visibility` or `content-visibility`: those still pay the layout cost.
4. **Photos use `data-src` / `data-srcset`** and are hydrated ~0.6 s after `load` (or on first tap/scroll). New images in `index.html` must follow the same pattern; `main.js` helpers `img()` / `srcset()` do it for config-driven images.
5. **No animations of `box-shadow`/`filter` on the envelope.** Use opacity/transform only (GPU). The seal pulse is an `::after` opacity animation.
6. **Audio never loads before page `load`**, and only as `preload="metadata"`.
7. Fonts are self-hosted woff2, already Latin-only subsets; don't add Google Fonts links.

## 5. Media notes

- **Song:** Brooklyn Duo, "A Thousand Years (Wedding Version)". The file is **already trimmed to start at 0:20**: AAC 160 kbps, −1.5 dB headroom (peak −1.1 dBFS, no clipping), 2.5 s fade-in built into the file (iOS ignores JS volume). 5.6 MB, streamed. The original 320 kbps MP3 is in git history (commit `b65a84e`) if a different start is wanted. Re-encode with ffmpeg: `-ss <start> -af "volume=-1.5dB,afade=t=in:d=2.5" -c:a aac -b:a 160k -movflags +faststart`.
- **Photos:** currently **Unsplash placeholders**, cropped per slot, AVIF/WebP, q=80, `srcset` sized for 3× retina phones. Hero and quote band use tall 1:2 crops on portrait screens with `sizes="120vw"` (Ken Burns zoom). When the couple's photos arrive, ask for hero/quote-band ≥ 2400 px on the long side and others ≥ 1600 px. Generate resized versions (e.g. 600/900/1200/1500/1800 w) so `srcset` keeps working; local files are otherwise used as-is.
- **WhatsApp preview card** (`og-cover.jpg`) deliberately has **no date**, because WhatsApp caches previews. **Regenerate it once the real date is confirmed.** It was rendered from HTML with headless Chrome (puppeteer-core) using the site fonts.

## 6. Security / data

- **Supabase:** URL `https://ltjtvtibqjxjolalhusv.supabase.co`; the **publishable (anon) key** is in `config.js`, which is fine because it's designed to be public. **Never** put the `service_role`/secret key in the repo.
- RLS is on for all tables. Anonymous users can only call `get_invite(slug)` and `submit_rsvp(...)`. Only signed-in users whose email is in `public.admins` can read or edit data (`admin@timoanwedssandipa.co.za` is in it).
- The admin code is short (owner's choice). Supabase rate-limits sign-in attempts. Suggest a longer code before invites go out.
- Family links are guessable (`/naidoo`). The worst case is someone replying for a family, which admins can see in History and fix with Clear reply.
- `/docs` returns 403 on the live site (`.htaccess`) and isn't deployed anyway.

## 7. Development & local testing

- **Run locally:** `npx serve -l 5050 .` from the repo root. It needs a server that supports **gzip and HTTP Range requests**: Range for audio seeking, gzip for realistic Lighthouse runs. `serve` handles `/admin` → `admin.html` via clean URLs. Python's `http.server` lacks Range support.
- **Phone testing on Wi-Fi:** `http://192.168.0.76:5050` (the PC's LAN IP; may change). Test on a **real iPhone too**: iOS Safari and WhatsApp's browser behave differently from desktop Chrome (autoplay, anchor scrolling, volume, calendar).
- **Family link locally:** `http://localhost:5050/?i=naidoo`.
- **Avoid "unsafe" ports** for local mock servers (e.g. 5060/5061 are blocked by Chrome); 8787 works.
- **Lighthouse:** `npx lighthouse http://localhost:5050/ --quiet --chrome-flags="--headless=new"` (mobile is the default). Add `--preset=desktop` for desktop. Run it twice, since scores wobble ±1.
- **Phone screenshots / sharpness checks:** puppeteer-core with a 390×844 @3× viewport, iPhone user agent and `--autoplay-policy=user-gesture-required`. Measure image sharpness from the `w`/`h` of `currentSrc`, not `naturalWidth`, which is density-corrected for `srcset` images.
- **Testing admin without a live backend:** make a temporary copy of `admin.html` that stubs `window.supabase` with fake data, and **delete it afterwards**. Never commit test pages.
- **Editing `index.html` with scripts:** it's large, so make edits by exact string replacement and verify after. A bad slice once duplicated the whole file. `git diff --stat` before committing.

## 8. Deployment

- **Normal flow:** commit → `git push origin main` → GitHub Actions "Deploy to web host" runs automatically (~15 s) → live.
- **How it deploys:** SSH to `server5.webhostmost.com` **port 2323** as `xesuzeeq` using GitHub secret `SSH_PRIVATE_KEY`, then `tar` the site files (the host has **no rsync**) and unpack into `domains/timoanwedssandipa.co.za/public_html`. Files sent: `index.html favicon.ico .htaccess admin.html assets`. **Add any new top-level file or folder to that tar list** (and to `.cpanel.yml`).
- **Check a deploy:** `gh run list -R singhadhil18/TimWedsSands --limit 3`, then the log should contain "Deployed to domains/…". Then `curl -sI https://timoanwedssandipa.co.za/`.
- **Deploys only add or overwrite; they don't delete.** Files removed from the repo stay on the server until removed by hand (File Manager or Terminal).
- **Fallbacks in the workflow:** FTPS (secrets `FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD`, var `FTP_DIR`) if SSH isn't set. `.cpanel.yml` exists for cPanel-style Git deploys, but this host is DirectAdmin.
- **Things that did NOT work on this host (don't retry blindly):**
  - The panel's web **Terminal** has no `ssh` binary, so `git clone` from GitHub fails there.
  - The panel's **Git tool** needs a *relative* keyfile path (`.ssh/…`) and still returned 409 Conflict for this domain. Ask WebHostMost support if a pull-based deploy is ever needed.
  - An unused read-only GitHub deploy key ("WebHostMost server5 (read-only)") and `~/.ssh/timwedssands_deploy` exist from that attempt. They're harmless; remove them if not needed.
- **Backup** of the pre-launch site folder: `~/backups/public_html-20261110` on the host.
- **WhatsApp link previews cache.** After changing title/description/og-image, test the link in a fresh chat; old previews may persist for a while.

## 9. Best practice for changes (follow this every time)

1. **Pull first** (`git pull origin main`). Several sessions have worked in this same folder, so check `git log` for commits you didn't make before editing.
2. **Content changes go in `config.js` only** where possible. Keep `rsvpBy` in config in sync with `settings.rsvp_deadline` in Supabase.
3. **Change → run locally → check at phone size** (375–390 px wide) **and on a real phone** for anything touching the envelope, music, RSVP, scrolling or the calendar.
4. **Re-run Lighthouse mobile** if `index.html`/`main.js` changed; keep 100s (see §4). Check `gzip -9 -c index.html | wc -c` stays < ~14 KB.
5. **Database changes:** edit `docs/supabase/schema.sql` (keep it idempotent: `create or replace`, `if not exists`), run it in the Supabase SQL Editor, and test both the guest path (family link) and admin.
6. **Never commit secrets:** no service_role key, passwords, FTP or SSH credentials. GitHub secrets hold them.
7. **Commit with a clear message, push to `main`, watch the Action, then check the live URL** (main page, a family link, `/admin`).
8. **Update this file** with anything a future session would need to know.
9. Don't delete or overwrite anything on the host or in Supabase without the owner's OK. Back up first.

## 10. Open items / waiting on the couple

1. **Real wedding date + times** (placeholder: Sat 12 June 2027, 15:00). Then regenerate the WhatsApp preview card with the date.
2. **Venue name + address** (placeholder) and map query.
3. **Events list and dress codes** (placeholders: Mehndi & Haldi, Ceremony, Reception).
4. **Chef** name, credentials, menu, bar details.
5. **Couple's photos** + real story and timeline text (placeholders say "Placeholder").
6. **RSVP deadline** confirmed (default 1 May 2027, enforced in Supabase), kids / plus-one policy, gift wording.
7. Questions asked but not yet answered: spelling "Viriah and Sukhnundan" (and "welcome" vs "welcomes"); keep `?to=` personal links now that family links exist?; desktop header full names?; hero line "together with their families…" now repeats the envelope; name the families instead?
8. Consider a **longer admin code** before invites go out.
9. Add families in `/admin` and send invite messages (template: `config.js` → `inviteMessage`).
