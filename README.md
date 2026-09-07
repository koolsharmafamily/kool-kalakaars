# Kool Kalakaars — how to change things on the website

You do **not** need to know how to code to use this guide.

Almost everything on the website is controlled by **one file**:

```
content/site.config.ts
```

Open it in any text editor. It is long, but it is written in plain English
with a comment above every setting explaining what it does.

---

## The five rules for editing that file

1. **Text lives between quote marks.** Change what is inside the quotes, keep
   the quotes.
   `name: "Kool Kalakaars"` → `name: "Kool Kalakaars Nagpur"`

2. **Keep the commas.** Every line ends with a comma. Leave it there.

3. **`true` and `false` have no quotes.** These are the on/off switches.
   `showGallery: false` → `showGallery: true`

4. **`null` means "we do not have this yet."** The website handles this
   gracefully — it shows a sensible message instead of a broken link. When you
   have the real thing, replace `null` with `"your value in quotes"`.

5. **Save the file.** If the site is connected to GitHub, saving and pushing
   publishes the change automatically in about a minute.

> **If something breaks**, undo your change and save again. Nothing you can
> type in this file can damage anything permanently.

---

## 1. Changing the event date

Find the section marked **3. THE EVENT DATE**. Change this line:

```js
startsAt: null,
```

Write the date like this, exactly:

```js
startsAt: "2026-12-19T18:30:00+05:30",
```

Reading it left to right: **year - month - day**, then a `T`, then
**hour : minute : second** on a 24-hour clock, then `+05:30`.

That example is **19 December 2026 at 6:30 in the evening**.

- Always keep the `+05:30` on the end. That is what makes it Indian time.
- 6:30pm is `18:30`. 9pm is `21:00`.

### What the website does with it

| What you put | What visitors see |
| --- | --- |
| `null` | "Dates announcing soon" |
| A date in the future | A live countdown, ticking every second |
| A date that has passed | "That night is done. The next one is being planned." |
| A typo | "Dates announcing soon" — it never shows a broken timer |

You do not have to do anything when the date passes. The site switches over
by itself.

---

## 2. Adding photos after the first event

### The quick version

1. Put your photos in the `public/images` folder.
2. Point the website at them in `site.config.ts`.
3. Turn the gallery on.

### Step by step

**Photos of the three categories** (the cards partway down the page) are set
in the section marked **THE THREE CATEGORIES**. Each one looks like this:

```js
{
  name: "Open Mic",
  qualifier: "Vocals",
  blurb: "One voice, one song, one shot...",
  image: "/images/open-mic.webp",
  imageAlt: "A stage microphone in close-up",
},
```

To use your own photo instead:

1. Copy your photo into the `public/images` folder.
2. Change `image:` to `"/images/your-file-name.jpg"` — note the `/images/` at
   the front, and that it must match your file name exactly.
3. Change `imageAlt:` to a short description of what is in the photo. This is
   read aloud to blind visitors, so describe the picture, not the event.

**You do not need to edit the photos first.** The website automatically
converts every photo to the site's purple-and-pink poster style, adds the dot
texture and the cut-paper edge. A normal photo straight off a phone will come
out looking like the rest of the site.

### Which photos work best

- **Close-ups beat wide shots.** Hands on a tabla, a face at a microphone, a
  guitar neck. Wide shots of a whole room lose their impact once the colour
  treatment is applied.
- **Avoid photos where one person is clearly the subject** unless you have
  their permission to use it.
- Landscape or portrait both work.

### Making the photos load faster (optional)

If your photos are straight from a camera they may be several megabytes each,
which makes the site slow on a phone. Someone technical can run this once to
shrink them:

```bash
npm run prepare:images
```

---

## 3. Turning features on and off

At the very top of `site.config.ts` you will find:

```js
flags: {
  showGallery: false,
  showWinners: false,
  showSocials: false,
  showSponsorLogos: false,
},
```

Change `false` to `true` to switch something on. They are all off because none
of them have real content yet.

| Switch | What it does | Turn it on when |
| --- | --- | --- |
| `showGallery` | Shows a photo gallery from past events | You have photos from a real event |
| `showWinners` | Shows past winners | You have run a night and have winners |
| `showSocials` | Shows social media icons in the footer | Your accounts exist — **and** you have added them to the `socials` list (see section 5) |
| `showSponsorLogos` | Shows a row of sponsor logos | You have **signed** sponsors who have agreed to appear |

### Important

**Two of these need content as well as the switch.** Turning on
`showSocials` or `showSponsorLogos` with nothing in the list does nothing at
all — deliberately, so you can add things and check them before they go live.

**Do not switch anything on before you have the real thing.** An empty section
looks worse than no section, and a wall of placeholder sponsor logos is
obvious to exactly the people you are trying to impress.

---

## 4. Adding the sponsor deck

Find the section marked **6. LINKS**:

```js
sponsorDeck: null,
```

1. Put your PDF in the `public` folder. Name it simply, with no spaces —
   `kool-kalakaars-sponsor-deck.pdf` is ideal.
2. Change the line to:

```js
sponsorDeck: "/kool-kalakaars-sponsor-deck.pdf",
```

The `/` at the front matters. The rest must match your file name exactly,
including `.pdf`.

### What changes on the site

| | Button says | What happens when clicked |
| --- | --- | --- |
| **Now** (`null`) | "Ask for the sponsor deck" | Opens an email to you, subject line already filled in |
| **After** | "Download sponsor deck" | Downloads the PDF in a new tab |

The line underneath — *"The deck is being finalised…"* — disappears on its
own once you add the file. You do not need to remove it.

---

## 5. Adding social links

Find the section marked **8. SOCIAL ACCOUNTS**. It currently looks like this,
with the example commented out:

```js
socials: [
  // { label: "Instagram", href: "https://instagram.com/koolkalakaars", icon: "instagram" },
],
```

To add Instagram, delete the `//` at the start and put in your real address:

```js
socials: [
  { label: "Instagram", href: "https://instagram.com/koolkalakaars", icon: "instagram" },
],
```

Then go to the top of the file and set `showSocials: true`.

**Both steps are needed.** Adding the link without the switch shows nothing;
the switch without a link also shows nothing.

### Adding more than one

Each goes on its own line, with a comma after each:

```js
socials: [
  { label: "Instagram", href: "https://instagram.com/koolkalakaars", icon: "instagram" },
  { label: "YouTube",   href: "https://youtube.com/@koolkalakaars",  icon: "youtube" },
],
```

`icon` can only be **`instagram`**, **`youtube`** or **`facebook`**. Anything
else will not work. `label` is what blind visitors hear.

---

## Other things you might want to change

| What | Where in `site.config.ts` |
| --- | --- |
| Phone number and email | Section **5. CONTACT** |
| The venue address | Section **4. THE VENUE** |
| The Google Form for performers | Section **6. LINKS** → `performerForm` |
| The WhatsApp group invite | Section **6. LINKS** → `whatsappCommunity` |
| Any wording on the page | Section **10. THE WORDS** |
| Rules / Terms / Privacy pages | Section **8c. THE LEGAL PAGES** |

### About the wording

Everything in section 10 is marked either **`[PLACEHOLDER]`** or
**`[FACTUAL]`**.

- **`[PLACEHOLDER]`** — I wrote it to fill the space. Rewrite it freely.
- **`[FACTUAL]`** — real details like the address and the three categories.
  Correct them if they are wrong, but they are not invented.

Each block also says roughly how long the text should be. Keep near that and
the layout stays right.

### The legal pages

`/rules`, `/terms` and `/privacy` exist but are **not published**. While each
one is empty it stays out of the footer, out of Google, and shows a short
"being written" note instead.

To publish one, add paragraphs to its `body`:

```js
privacy: {
  title: "Privacy",
  body: [
    "First paragraph.",
    "Second paragraph.",
  ],
},
```

The footer link and the Google listing switch on by themselves.

> **The privacy page matters most.** The free-ticket form collects names,
> phone numbers and email addresses. Collecting personal details with no
> privacy statement looks careless to exactly the sponsors and institutions
> you are trying to impress.

---

## Things that are NOT in the config file

A few things need someone technical:

| What | Where |
| --- | --- |
| Making the ticket form actually save | `docs/APPS_SCRIPT.md` — **not working yet** |
| Hindi wording check | `docs/HANDOVER.md` — every Hindi word is listed |
| Photo credits | `docs/IMAGE_CREDITS.md` |
| The hero video | Held off on purpose — see the note in the config |

---

## Still to be done

- [ ] **The ticket form does not save anything yet.** Follow
      `docs/APPS_SCRIPT.md`. Until then visitors get a WhatsApp fallback.
- [ ] **Set the event date** once it is fixed.
- [ ] **Check the Hindi** with a native speaker (`docs/HANDOVER.md`).
- [ ] **Confirm the Chitnavis Centre wording** — the sponsor section says the
      Centre is *originating* the initiative, which is a strong claim about a
      named institution. There is a softer alternative in the config.
- [ ] **Add the logo** when it is ready (`media.logo`).
- [ ] **Register koolkalakaars.in** — it is not registered yet.
