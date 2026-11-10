# Google Sheet RSVP log — 5-minute setup

1. Create a new Google Sheet (e.g. "Tim & Sandipa RSVPs").
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste in `docs/google-sheet-rsvp.gs`.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Approve the permission prompt.
4. Copy the web-app URL (ends in `/exec`) into `assets/js/config.js` → `rsvp.sheetUrl`.
5. Submit a test RSVP on the site; a row appears within a few seconds.

Each RSVP adds one row: timestamp, name, response, number of attendees, attendee names, note, and the name on the personalised link.

Limits: the row is written when the guest taps "Send RSVP", whether or not they press send in WhatsApp. Anyone who finds the URL could post rows, so treat WhatsApp as the confirmation and the sheet as the tally.
