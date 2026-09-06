# Handover

## The one file you edit

Everything on the website — every word, date, link, phone number and image —
comes from `content/site.config.ts`. That file is commented line by line for a
non-developer. You do not need to open any other file.

Anything marked **TODO** in it is waiting on you.

### Currently waiting on you

| What | Where in the config | What happens until then |
|---|---|---|
| Event date | `event.startsAt` | Site shows "Dates announcing soon" |
| Real domain | `site.url` | Placeholder `koolkalakaars.com` used for sharing previews |
| Logo | `media.logo` | Hero shows a marked placeholder slot at the correct size |
| Hero video + poster | `media.heroVideo*`, `media.heroPoster` | Hero shows an animated pop-art gradient |
| Google Form URL | `links.performerForm` | Apply section shows a WhatsApp button instead |
| WhatsApp community link | `links.whatsappCommunity` | Community section is hidden entirely |
| Sponsor deck PDF | `links.sponsorDeck` | Deck button becomes "Request the sponsor deck" by email |
| Instagram etc. | `socials` | No social icons appear anywhere |
| Ticket form endpoint | `.env.local` | See `docs/APPS_SCRIPT.md` |

Nothing in that list breaks the site while it is missing. Every one of them has
a designed fallback.

---

## Hindi and Hinglish used on the site

The site is in English. Devanagari appears only as flavour above headings and
on the occasional button — never on a navigation label, form label, error
message, price or date. A visitor who reads no Hindi loses nothing functional.

**Please have a native speaker check this list.** If any of it reads oddly,
change it in `content/site.config.ts` — every one of these is a plain string in
that file.

| Devanagari | Roman | Intended sense | Where it appears |
|---|---|---|---|
| सुनो | suno | "listen" | Eyebrow above "The idea" |
| क्यों | kyon | "why" | Eyebrow above "Why Nagpur" |
| तीन रास्ते | teen raaste | "three roads / three ways" | Eyebrow above the categories |
| रात कैसे चलती है | raat kaise chalti hai | "how the night runs" | Eyebrow above the format section |
| जगह | jagah | "the place" | Eyebrow above the venue |
| साथ चलो | saath chalo | "come along with us" | Eyebrow above the sponsor section |
| आ जाओ | aa jao | "come on over" | Eyebrow above the ticket form |
| चलो, दिखाओ | chalo, dikhao | "come on, show us" | Eyebrow above the apply section |
| जुड़ जाओ | jud jao | "join in" | Eyebrow above the community section |
| चलो | chalo | "let's go" | One item in the scrolling marquee |

Roman-script Hinglish also appears on one button: **"Chalo, register karo"**.
Its spoken label for screen readers is the plain English **"Register"**, so
assistive technology announces the function, not the flavour.

---

## Typefaces

| Role | Face | Notes |
|---|---|---|
| Headlines | Anton | One weight, always uppercase |
| Body | Manrope | Variable weight |
| Hindi glyphs | Noto Sans Devanagari | Loads only where Devanagari is used |

All three are downloaded when the site is built and served from our own server.
There is no request to Google when a visitor loads the page.

The Latin and Devanagari faces are combined into a **single font stack**, so a
sentence mixing both scripts does not visibly change typeface mid-sentence. You
do not need to mark up Hindi words in any special way — just type them.

---

## Development

```bash
npm run dev        # local site at http://localhost:3000
npm run build      # production build
npm run typecheck  # type errors only
```

`http://localhost:3000/styleguide` shows every colour, type size and button
state in one place. It exists only in development — it returns a 404 on the
live site and is excluded from the sitemap and the navigation.
