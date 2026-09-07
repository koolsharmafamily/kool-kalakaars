# Free ticket form → Google Sheet

**Status: the endpoint is deployed but does not work yet.**

The web app is deployed and publicly reachable, which is the hard part and it
is already done. But the script behind it has no `doPost`
function, so it cannot receive anything. Posting to it right now returns:

```
Error
Script function not found: doPost
```

Follow the steps below once and the form starts working. Nothing in the
website needs to change.

---

## Why this matters more than it looks

Google Apps Script answers with **HTTP 200 — a success code — even when it
fails like this.** The error above arrives as an ordinary "everything is fine"
response with an HTML error page inside it.

That means a form that only checks whether the request succeeded would show
every visitor *"You are on the list"* while saving nothing, forever, silently.

The site does not do that. `app/api/ticket/route.ts` reads the actual reply and
only reports success if the script sends back real JSON saying so. Until you
complete the steps below, the form shows its error state and offers WhatsApp
instead — which is correct, and is what you want it doing.

---

## Setup, once

### 1. Open the script

Go to your Apps Script project. Its web-app URL is the value of the
TICKET_ENDPOINT_URL environment variable in Vercel — it is deliberately not
written down in this repository, which is public:

```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 2. Paste this in

Replace whatever is in `Code.gs` with the following. Change `SHEET_NAME` if
your tab is called something other than `Tickets`.

```javascript
/**
 * Kool Kalakaars — free ticket requests.
 * Receives a POST from the website and appends one row per request.
 */

var SHEET_NAME = 'Tickets';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    // Create the tab and its header row the first time this ever runs.
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow(['Received', 'Name', 'Phone', 'Email', 'Seats']);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      "'" + (data.phone || ''),   // leading quote keeps the leading digit
      data.email || '',
      data.seats || ''
    ]);

    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  // Handy for checking the deployment is alive in a browser.
  return json({ ok: true, message: 'Kool Kalakaars ticket endpoint is running.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Two details that matter:

- **`ContentService` returning JSON** is what the website checks for. If the
  script returns HTML, or nothing, the site treats it as a failure — which is
  exactly the protection described above.
- **The `"'" +` in front of the phone number** stops Google Sheets from
  treating it as a number and eating a leading zero.

### 3. Attach it to your spreadsheet

The script must belong to the Sheet you want rows in. If you created it from
**Extensions → Apps Script** inside the Sheet, it already does. If you created
it standalone, `getActiveSpreadsheet()` returns nothing — in that case replace
that line with:

```javascript
SpreadsheetApp.openById('YOUR_SHEET_ID')
```

The sheet ID is the long string in the Sheet's own URL, between `/d/` and
`/edit`.

### 4. Redeploy — the step people miss

Saving is not deploying. Editing the code changes nothing on the live URL
until you deploy again.

**Deploy → Manage deployments → the pencil icon → Version: New version → Deploy**

Use **Manage deployments**, not "New deployment". A new deployment gives you a
different URL, and the site would still be pointing at this one.

Settings must be:

| Setting | Value |
| --- | --- |
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" — not "Anyone with a Google account". The website posts to this
without any sign-in, so anything narrower rejects it.

### 5. Check it

Open the `/exec` URL in a browser. You should now see:

```json
{"ok":true,"message":"Kool Kalakaars ticket endpoint is running."}
```

If you still see an error page, the redeploy in step 4 did not take.

Then submit the real form on the site. A row should appear in the Sheet, and
the page should show the confirmation rather than the WhatsApp fallback.

---

## Moving off Apps Script later

The website talks to `/api/ticket` on its own domain, never to Google
directly. To switch to Formspree, Resend, Airtable or a database, change the
`forwardToSheet` function in `app/api/ticket/route.ts`. Nothing else — no
component, no form, no styling — needs touching.

---

## Where the endpoint URL lives

In an environment variable, not in the code:



Set it in Vercel under **Settings → Environment Variables**, for both
Production and Preview.

It is kept out of the repository because this repository is public and this is
a write endpoint — anyone who finds the URL can post to it directly, skipping
the protections in . Those protections are a hidden honeypot
field, a minimum fill time, and per-IP rate limiting.

To change the endpoint later, edit the environment variable and redeploy. No
code change is needed.
