# Family RSVPs with Supabase — setup

Each family gets their own link (e.g. `timoanwedssandipa.co.za/naidoo`) with a fixed number of seats.
Replies are saved in Supabase; admins see the guest list at `timoanwedssandipa.co.za/admin`.

## 1. Create the database (once)
1. Supabase → **SQL Editor** → **New query**.
2. Paste all of `docs/supabase/schema.sql` → **Run**.
3. Still in the SQL editor, add your admins (use the emails they will sign in with):
   ```sql
   insert into public.admins (email) values ('first.admin@example.com'), ('second.admin@example.com')
   on conflict do nothing;
   ```
4. RSVP deadline (default 1 May 2027, then replies lock). To change it:
   ```sql
   update public.settings set rsvp_deadline = '2027-05-01 23:59:59+02';
   ```
   Keep `rsvpBy` in `assets/js/config.js` showing the same date.

## 2. Admin sign-in
1. **Authentication → Users → Add user → Send invitation** for each admin email
   (the admin page only signs in existing users — nobody can sign themselves up).
2. **Authentication → URL Configuration**
   - Site URL: `https://timoanwedssandipa.co.za`
   - Redirect URLs: add `https://timoanwedssandipa.co.za/admin`
     (and `http://localhost:5050/admin` if you want to test locally).
3. Admins open `/admin`, enter their email, and click the link they receive.

## 3. Connect the website
In `assets/js/config.js`:
```js
supabase: { url: "https://YOURPROJECT.supabase.co", anonKey: "YOUR-ANON-OR-PUBLISHABLE-KEY" },
```
From **Project Settings → API**. The anon / publishable key is designed to be public.
**Never** paste the `service_role` / secret key anywhere in the site.

Once this is filled in:
- The plain site (no family link) shows the invitation, but the RSVP form asks guests to use their personal link.
- A family link shows "Dear The Naidoo Family" on the envelope and "your invitation admits 4 guests"; the form can't go over 4 — and the database refuses it even if someone tampers with the page.
- Re-submitting updates the family's reply (history is kept).

## 4. Add families and send invites
On `/admin` → **+ Add families** (one at a time, or paste `Family name, seats` lines).
The link is made from the family name (`The Naidoo Family` → `naidoo`); change it if two families share a surname (`naidoo-ravi`).
Don't change a link after you've sent it.

**Invite message** on each row shows the WhatsApp message (template in `config.js` → `inviteMessage`) with **Copy** and **Send on WhatsApp**.

## How it's secured
- Row Level Security is on for every table; the public key can't read or change any table.
- Guests can only call two functions: `get_invite(slug)` (family name, seats, whether they've replied) and `submit_rsvp(...)`, which checks the link, seat limit and deadline on the server.
- Only signed-in users whose email is in `public.admins` can see or edit the guest list.
- Plain links (`/naidoo`) can be guessed; worst case someone replies for a family — admins see every change under **History** and can **Clear reply**.
