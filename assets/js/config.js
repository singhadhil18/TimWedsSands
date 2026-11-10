/* =========================================================
   EDIT EVERYTHING HERE — no other file needs changing.
   ========================================================= */
window.WEDDING = {
  partner1: "Tim",
  partner2: "Sandeepa",
  monogram: "T&S",
  hashtag: "#TimWedsSands",

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

  // Music: starts when the seal is opened. musicStart = seconds to skip into the track.
  music: "assets/audio/a-thousand-years.mp3",
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
  ]
};
