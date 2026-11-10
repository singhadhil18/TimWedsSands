/* =========================================================
   EDIT EVERYTHING HERE — no other file needs changing.
   ========================================================= */
window.WEDDING = {
  partner1: "Timoan",
  partner2: "Sandipa",
  monogram: "T&S",
  hashtag: "#TimWedsSands",

  // Shown on the envelope under the seal, followed by "welcome you"
  hosts: "The Viriah and Sukhnundan families",

  // Main ceremony date/time (local SAST, +02:00) — PLACEHOLDER
  date: "2027-06-12T15:00:00+02:00",
  city: "Durban",

  venueName: "Venue Name",
  venueAddress: "Street address, Umhlanga, KwaZulu-Natal",
  mapsQuery: "Umhlanga Rocks, KwaZulu-Natal",

  rsvpBy: "1 May 2027",

  // RSVP: opens WhatsApp with the reply pre-filled AND logs a row to a Google Sheet.
  //  whatsapp: number in international format, no + (e.g. 27821234567)  — TBD
  //  sheetUrl: the Google Apps Script web-app URL (see docs/google-sheet-setup.md) — blank = WhatsApp only
  rsvp: { whatsapp: "27603837968", sheetUrl: "", maxGuests: 6 },

  // The feast
  chefName: "To be announced",
  chefNote: "Menu and bar details to follow",
  feast: ["Canapés & chaat on arrival", "A grand Indian wedding banquet", "Traditional sweets & dessert table", "Signature cocktails & mocktails"],

  // Music: tries to start on page load, otherwise on the first scroll / swipe / tap.
  // The file is already trimmed to begin at 0:20 of the original track (AAC 160 kbps, ~5.6 MB).
  // musicStart = seconds to skip into the track.
  music: "assets/audio/a-thousand-years.m4a",
  musicStart: 0,
  musicVolume: 0.6,

  events: [
    { name: "Mehndi & Haldi", date: "Thu, 10 June 2027", time: "16:00", place: "Family home", dress: "Shades of yellow & green",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80" },
    { name: "Ceremony", date: "Sat, 12 June 2027", time: "15:00", place: "Venue Name", dress: "Formal / traditional",
      img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80" },
    { name: "Reception", date: "Sat, 12 June 2027", time: "18:30", place: "Venue Name", dress: "Black tie optional",
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" }
  ],

  palette: ["#f9e1dc", "#fde9d6", "#e9eee0", "#f3e6ec", "#a85a66"],

  gallery: [
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=80"
  ],

  // ---- Family invites (Supabase) ----
  // Paste from Supabase → Project Settings → API. The anon/publishable key is safe to publish;
  // NEVER put the service_role/secret key here. Leave blank to use the WhatsApp-only RSVP.
  supabase: { url: "", anonKey: "" },
  siteUrl: "https://timoanwedssandipa.co.za",

  // The message admins copy / send on WhatsApp for each family (admin page).
  // {family} {seats} {guests} ("1 guest" / "4 guests") {deadline} {link}
  inviteMessage:
`Dear {family}

It brings us immense joy to share our wedding invitation with you. We would be truly honoured if you could join us in celebrating this cherished occasion.

Your invitation admits {guests}. Kindly RSVP by {deadline} so we may prepare for this special day together.

We look forward with great excitement to creating beautiful memories in your company.

With all our love,
Timoan & Sandipa

{link}`
};
