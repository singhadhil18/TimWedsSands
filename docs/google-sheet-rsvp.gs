/**
 * RSVP logger — paste into Extensions > Apps Script of the RSVP Google Sheet.
 * Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
 * Copy the web-app URL into assets/js/config.js -> rsvp.sheetUrl
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sh.getLastRow() === 0) sh.appendRow(["Timestamp", "Name", "Response", "Attendees", "Attendee names", "Note", "Invited as"]);
    var safe = function (v) { v = String(v == null ? "" : v).slice(0, 500); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    sh.appendRow([new Date(), safe(d.name), safe(d.attending), Number(d.count) || 0, safe(d.guests), safe(d.message), safe(d.invitedAs)]);
    return ContentService.createTextOutput("ok");
  } finally { lock.releaseLock(); }
}
