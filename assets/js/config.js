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

  // RSVP delivery. mode: "formspree" | "whatsapp" | "email"
  //  formspree: create a free form at formspree.io and paste its endpoint URL
  //  whatsapp:  number in international format, no + (e.g. 27821234567)
  rsvp: { mode: "whatsapp", formspree: "", whatsapp: "27000000000", email: "rsvp@example.com" },

  music: "", // e.g. "assets/audio/song.mp3" — leave blank to hide the music button

  events: [
    { name: "Mehndi & Haldi", date: "Thu, 10 June 2027", time: "16:00", place: "Family home", dress: "Shades of yellow & green",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80" },
    { name: "Ceremony", date: "Sat, 12 June 2027", time: "15:00", place: "Venue Name", dress: "Formal / traditional",
      img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80" },
    { name: "Reception", date: "Sat, 12 June 2027", time: "18:30", place: "Venue Name", dress: "Black tie optional",
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" }
  ],

  palette: ["#1f2a24", "#b8975a", "#e9dfcc", "#8a9a86", "#f7f2e9"],

  gallery: [
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=80"
  ]
};
