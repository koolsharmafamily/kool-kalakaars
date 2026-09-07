/* ═══════════════════════════════════════════════════════════════════════════
 *
 *   K O O L   K A L A K A A R S  —  S I T E   C O N F I G
 *
 *   THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *
 *   Every word, date, link, phone number and photograph on the website comes
 *   from this file. You do not need to know how to code to change any of it.
 *
 *   ── HOW TO EDIT ─────────────────────────────────────────────────────────
 *
 *   1. Text lives between quote marks:      "like this"
 *      Change what is inside the quotes. Keep the quotes.
 *
 *   2. Lists live between square brackets:  [ "one", "two" ]
 *      Keep the commas between items.
 *
 *   3. true / false switches have no quotes: showGallery: false
 *      Change false to true (lower case, no quotes) to turn something on.
 *
 *   4. null means "we do not have this yet".
 *      The website handles null gracefully — it shows a sensible message
 *      instead of a broken link or an empty box. When you have the real
 *      thing, replace null with "your value in quotes".
 *
 *   5. Save the file. That is it.
 *
 *   ── ANYTHING MARKED "TODO" IS WAITING ON YOU ────────────────────────────
 *
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────────
 * TYPES
 * These describe the shape of the settings below. You can ignore this whole
 * block — it exists so that the editor warns you if a setting is mistyped.
 * It is also the seam where a headless CMS would plug in later: swap the
 * exported object for a fetch, keep these types, and no component changes.
 * ─────────────────────────────────────────────────────────────────────────── */

export type Social = {
  /** Shown to screen readers and as the link title, e.g. "Instagram". */
  label: string;
  /** Full URL including https://. */
  href: string;
  /** Icon key. Currently supported: "instagram" | "youtube" | "facebook". */
  icon: "instagram" | "youtube" | "facebook";
};

export type Category = {
  /** Short name, e.g. "Open Mic". */
  name: string;
  /** Bracketed qualifier shown under the name, e.g. "Vocals". */
  qualifier: string;
  /** One line. Keep it under about 15 words. */
  blurb: string;
  /** Path to the image, relative to /public. null shows a pattern instead. */
  image: string | null;
  /** Describes the image for blind visitors. Required whenever image is set. */
  imageAlt: string;
};

export type Step = {
  /** e.g. "Entries open". */
  title: string;
  /** One or two lines explaining the step. */
  body: string;
};

export type Point = {
  /** Short heading. */
  title: string;
  /** Two or three lines. Observational — never invent a statistic. */
  body: string;
};

export type FormFieldPreview = {
  /** What the Google Form will ask for. */
  label: string;
  /** Optional clarifying note shown underneath. */
  hint?: string;
  /** True when the form does not require an answer. */
  optional?: boolean;
};

export type LegalPage = {
  /** Page heading, also used as the browser tab title. */
  title: string;
  /**
   * The content, one string per paragraph.
   *
   * While this array is EMPTY the page is treated as unpublished: it is
   * hidden from the footer, left out of the sitemap, marked noindex, and
   * shows a short "being written" message instead. Add paragraphs and it
   * publishes itself — no other file needs changing.
   */
  body: string[];
};

export type HeroImageSet = {
  mobileAvif: string;
  mobileWebp: string;
  desktopAvif: string;
  desktopWebp: string;
  /** Describes the picture for anyone who cannot see it. */
  alt: string;
};

export type Sponsor = {
  /** The organisation name, exactly as they write it. */
  name: string;
  /** Path to the logo, relative to /public. Prefer SVG, or PNG with alpha. */
  logo: string;
  /** Optional link to their site. Opens in a new tab. */
  url?: string;
};

/* ═══════════════════════════════════════════════════════════════════════════
 * THE CONFIG
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * The WhatsApp number in the format links need: country code, digits only.
 * Declared up here because both the contact block and the WhatsApp link use
 * it, and a phone number should never be typed twice.
 */
const PHONE_E164 = "918888821351";

export const siteConfig = {
  /* ═════════════════════════════════════════════════════════════════════════
   * 1. FEATURE SWITCHES
   *
   * All of these are OFF until after the first event. Turning one on makes
   * that section appear on the website. Do not turn one on until you have
   * the real content for it — an empty section looks worse than no section.
   * ═════════════════════════════════════════════════════════════════════════ */
  flags: {
    /** Photo gallery from past events. Turn on after event one. */
    showGallery: false,
    /** Past winners. Turn on after event one. */
    showWinners: false,
    /** Social media icons in the header and footer. Turn on once accounts exist. */
    showSocials: false,
    /** Sponsor logo wall. Turn on only when you have signed sponsors. */
    showSponsorLogos: false,
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 2. THE BASICS
   * ═════════════════════════════════════════════════════════════════════════ */
  site: {
    /** The event name, exactly as it should appear everywhere. */
    name: "Kool Kalakaars",

    /**
     * The website address, with no slash at the end.
     * The live domain.
     * Used for Google search results, sharing previews and the sitemap.
     */
    url: "https://koolkalakaars.in",

    /** One line, shown under the name in the hero. */
    tagline: "The stage Nagpur musicians have been waiting for.",

    /**
     * Browser tab title and Google search headline.
     * Aim for under 60 characters so Google does not cut it off.
     */
    metaTitle: "Kool Kalakaars — Live music competition and open mic in Nagpur",

    /**
     * The description under the blue link in Google, and the text shown when
     * the site is shared on WhatsApp. Aim for 150 to 160 characters.
     */
    metaDescription:
      "A recurring live music competition and open mic in Nagpur. Open mic vocals, band showcase and solo instrumental. Free to attend at Chitnavis Centre.",

    /** Language of the site. Leave as is. */
    locale: "en_IN",
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 3. THE EVENT DATE
   *
   * ── THE THREE STATES ────────────────────────────────────────────────────
   *   startsAt: null            -> the site shows "Dates announcing soon"
   *   startsAt: a future date   -> the site shows a live countdown
   *   startsAt: a past date     -> the site switches to a post-event message
   *
   * The website never shows a broken timer, whichever of these applies.
   *
   * ── HOW TO WRITE THE DATE ───────────────────────────────────────────────
   * Use this exact format, in India Standard Time:
   *
   *     "2026-12-19T18:30:00+05:30"
   *      YYYY-MM-DD T HH:MM:SS +05:30
   *
   * That example is 19 December 2026 at 6:30 in the evening.
   * Keep the +05:30 on the end — that is what makes it Indian time.
   * ═════════════════════════════════════════════════════════════════════════ */
  event: {
    /**
     * TODO: set the pilot event date.
     *
     * Left as null deliberately. The brief named December 2025 / January 2026
     * as the target window, but both are now in the past, so hard-coding
     * either would make the site announce an event that had already happened.
     * null is the honest state until the real date is fixed.
     */
    startsAt: null as string | null,

    /** Roughly how long the evening runs. Used in the structured data. */
    durationHours: 3,

    /** Shown when startsAt is null. */
    dateTbcLabel: "Dates announcing soon",

    /** Shown once the date has passed. */
    postEventMessage: "That night is done. The next one is being planned.",

    /** How the event repeats. Kept vague on purpose — no cadence is promised. */
    recurrence: "A recurring night, not a one-off.",
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 4. THE VENUE
   * ═════════════════════════════════════════════════════════════════════════ */
  venue: {
    name: "Chitnavis Centre",
    /** Street address, shown on the site and given to Google. */
    street: "Temple Road, Dobhi Nagar, Civil Lines",
    city: "Nagpur",
    region: "Maharashtra",
    country: "IN",
    postalCode: "440001",

    /** One line on why the partnership matters. Keep it modest and factual. */
    note: "A civic cultural space in the middle of Civil Lines, with the acoustics and the seating a live evening actually needs.",

    /**
     * The map embed. This is a Google Maps search embed, loaded lazily so it
     * never slows the page down. You should not need to change it.
     */
    mapEmbedUrl:
      "https://www.google.com/maps?q=Chitnavis+Centre,+Temple+Road,+Civil+Lines,+Nagpur,+Maharashtra&output=embed",

    /** Where the "Open in Google Maps" button goes. */
    mapLinkUrl:
      "https://www.google.com/maps/search/?api=1&query=Chitnavis+Centre+Temple+Road+Civil+Lines+Nagpur",
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 5. CONTACT
   * These are published on the site. Change them here and they change
   * everywhere — header, footer, WhatsApp button and error messages.
   * ═════════════════════════════════════════════════════════════════════════ */
  contact: {
    /** Displayed to visitors, spaced for readability. */
    phoneDisplay: "+91 88888 21351",
    /** Used in links. Digits only, with country code, no spaces or plus sign. */
    phoneE164: PHONE_E164,
    email: "koolkalakaars@gmail.com",
    /** Who press should ask for. */
    pressContactName: "Kulvir Sharma",
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 6. LINKS
   *
   * Anything that is null shows a graceful fallback instead of a dead link.
   * ═════════════════════════════════════════════════════════════════════════ */
  links: {
    /**
     * The Google Form for performer applications. Opens in a new tab.
     *
     * It is deliberately NOT embedded in the page. The form accepts a file
     * upload, which needs a Google sign-in on Google's own domain, and an
     * embedded upload widget behaves badly on mobile. So the site previews
     * what the form asks and then hands people over to Google.
     *
     * If this is ever set back to null, the Apply section falls back to a
     * WhatsApp button rather than showing a broken link.
     */
    performerForm:
      "https://docs.google.com/forms/d/e/1FAIpQLScjy7JuspEBy-CBfKeg78gzSkNj4K0xI3Kn42Ns2c8FEOy1cg/viewform" as
        | string
        | null,

    /**
     * Where free-ticket requests are sent.
     *
     * ⚠️  THIS LIVES IN AN ENVIRONMENT VARIABLE, NOT HERE.
     *
     * The repository is public, and this is a write endpoint that anyone who
     * finds it can post to. Keeping it out of the source means bots cannot
     * scrape it from GitHub and hammer the spreadsheet directly, bypassing
     * the rate limiting in /api/ticket.
     *
     * Set TICKET_ENDPOINT_URL in Vercel under Settings > Environment
     * Variables, for Production and Preview. See docs/APPS_SCRIPT.md.
     *
     * Leaving this null is correct — the route handler reads the env var.
     */
    ticketEndpoint: null as string | null,

    /**
     * TODO: the WhatsApp community invite link (looks like
     * https://chat.whatsapp.com/XXXXXXXX).
     * While this is null, the whole Community section is hidden.
     */
    whatsappCommunity: null as string | null,

    /**
     * TODO: the sponsor deck PDF.
     * Put the file in the /public folder and write "/sponsor-deck.pdf" here.
     * While this is null, the button becomes a "request the deck" email link.
     */
    sponsorDeck: null as string | null,

    /** Direct WhatsApp chat for questions. Built from the phone number above. */
    whatsappChat: `https://wa.me/${PHONE_E164}`,
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 7. IMAGES AND VIDEO
   *
   * All paths are relative to the /public folder, so "/video/hero.mp4" means
   * the file public/video/hero.mp4.
   * ═════════════════════════════════════════════════════════════════════════ */
  media: {
    /**
     * TODO: the logo, once it is ready. A horizontal lockup works best.
     * While this is null the hero shows a clearly marked placeholder slot at
     * the correct size, so the layout does not move when the logo arrives.
     */
    logo: null as string | null,
    logoWidth: 320,
    logoHeight: 80,

    /**
     * TODO: the hero video from Runway.
     *
     * Three files are needed:
     *   desktop  ~1080p, H.264 .mp4
     *   mobile   ~720p, compressed hard, UNDER 2.5 MB
     *   poster   a single still frame from the video, compressed hard
     *
     * The poster is the important one — it is what visitors see first, and
     * the site must look finished before any video has loaded.
     *
     * While all three are null the hero shows an animated pop-art gradient
     * built in code. The site is complete and reviewable without the video.
     */
    /**
     * The hero video. Two encodes, served by viewport.
     *
     * Both are muted, looping decoration with the audio track stripped. Set
     * either to null to fall back to the still artwork below.
     *
     * Re-generate after replacing the master: npm run prepare:video
     */
    heroVideoDesktop: "/video/hero-desktop.mp4" as string | null,
    heroVideoMobile: "/video/hero-mobile.mp4" as string | null,

    /**
     * Poster for the video — a frame taken from the video itself, so there is
     * no visible jump when playback starts. Used whenever a video is set;
     * heroImage below is used when there is no video.
     */
    heroVideoPoster: {
      mobileAvif: "/video/hero-video-poster-mobile.avif",
      mobileWebp: "/video/hero-video-poster-mobile.webp",
      desktopAvif: "/video/hero-video-poster-desktop.avif",
      desktopWebp: "/video/hero-video-poster-desktop.webp",
      alt: "Illustrated Kool Kalakaars poster: singers, a tabla player, a dancer and a guitarist in bright halftone colour",
    } as HeroImageSet | null,

    /**
     * THE HERO ARTWORK.
     *
     * Two encodes, served by viewport. The mobile file is the portrait
     * original; the desktop file is a landscape crop taken from the upper part
     * of the artwork, where the face and the microphone are.
     *
     * AVIF is what almost every phone will actually download; the WebP is
     * there for anything that cannot take AVIF. Both are listed because a
     * <picture> falls through them in order.
     *
     * This same image is ALSO the poster frame for the hero video when one
     * exists — one asset, both jobs.
     *
     * Re-generate after replacing the source: node scripts/prepare-hero.mjs
     */
    heroImage: {
      mobileAvif: "/hero/hero-mobile.avif",
      mobileWebp: "/hero/hero-mobile.webp",
      desktopAvif: "/hero/hero-desktop.avif",
      desktopWebp: "/hero/hero-desktop.webp",
      /** Describes the artwork for anyone who cannot see it. */
      alt: "Illustration of a singer at a vintage microphone, in halftone and screen-print colour, with block-printed textile patterns behind her",
    } as HeroImageSet | null,

    /** The picture shown when the site is shared. 1200x630 pixels. */
    ogImage: "/og.png",
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 8. SOCIAL ACCOUNTS
   *
   * Leave this as an empty list [] until the accounts exist. While it is
   * empty, no social icons appear anywhere — no dead links, no placeholders.
   *
   * TODO: when Instagram is live, uncomment the example below and set
   * flags.showSocials to true.
   * ═════════════════════════════════════════════════════════════════════════ */
  socials: [
    // { label: "Instagram", href: "https://instagram.com/koolkalakaars", icon: "instagram" },
  ] as Social[],

  /* ═════════════════════════════════════════════════════════════════════════
   * 8b. SPONSORS
   *
   * Leave this EMPTY until sponsors have actually signed and have agreed to
   * their logo being shown. While it is empty the logo strip does not render
   * at all — there is no placeholder row, no greyed-out boxes and no invented
   * names. A wall of fake logos is the fastest way to lose a real sponsor.
   *
   * When you have your first signed sponsor:
   *   1. Put their logo in public/sponsors/
   *   2. Add an entry below
   *   3. Set flags.showSponsorLogos to true
   *
   * Both the entry and the flag are required, so logos can be staged and
   * checked before they go live.
   * ═════════════════════════════════════════════════════════════════════════ */
  sponsors: [
    // { name: "Their Company", logo: "/sponsors/their-company.svg", url: "https://example.com" },
  ] as Sponsor[],

  /* ═════════════════════════════════════════════════════════════════════════
   * 8c. THE LEGAL PAGES
   *
   * Three pages that exist but are NOT published yet.
   *
   * While a page's `body` list is empty:
   *   · it does not appear in the footer
   *   · it is left out of sitemap.xml
   *   · it is marked "do not index" for Google
   *   · visiting it directly shows a short "being written" note, not a 404
   *
   * To publish one, add paragraphs to its `body`. That is the only step —
   * the footer link, the sitemap entry and the search-engine permission all
   * switch on by themselves.
   *
   *   body: [
   *     "First paragraph.",
   *     "Second paragraph.",
   *   ],
   *
   * ⚠️  The privacy page matters more than the other two. The free-ticket form
   * collects names, phone numbers and email addresses. Collecting personal
   * details with no privacy statement anywhere looks careless to exactly the
   * sponsors and institutions you are trying to impress.
   * ═════════════════════════════════════════════════════════════════════════ */
  legal: {
    rules: {
      title: "Rules",
      body: [] as string[],
    },
    terms: {
      title: "Terms",
      body: [] as string[],
    },
    privacy: {
      title: "Privacy",
      body: [] as string[],
    },
  } satisfies Record<string, LegalPage>,

  /* ═════════════════════════════════════════════════════════════════════════
   * 9. NAVIGATION
   *
   * The sticky bar that appears once you scroll past the hero.
   * The Sponsor link is deliberately separate and always visible as a filled
   * button, on phones as well as desktop — it is never hidden inside a menu.
   * ═════════════════════════════════════════════════════════════════════════ */
  nav: {
    /**
     * Deliberately short. A nav with four things in it gets used; a nav with
     * nine gets ignored. Everything else on the page is reachable by scrolling.
     */
    items: [
      { label: "The Format", href: "#format" },
      { label: "Venue", href: "#venue" },
      { label: "Free Ticket", href: "#tickets" },
    ],
    /**
     * The single highest-priority action on the whole site.
     * Rendered as a filled button, separate from the list above, and visible
     * on phones as well as desktop — it is NEVER folded into the menu.
     */
    primary: { label: "Become a Sponsor", href: "#sponsor" },
  },

  /* ═════════════════════════════════════════════════════════════════════════
   * 10. THE WORDS
   *
   *  ⚠️  ALL COPY BELOW IS PLACEHOLDER. WRITTEN TO BE REPLACED.
   *
   *  It is here so the layout can be judged at the right length and in
   *  roughly the right voice. None of it is final, none of it was approved
   *  by anyone, and every line is yours to rewrite.
   *
   *  Each block is tagged with the length it was written to. If you keep
   *  roughly to that, the design will hold together. If you go much longer
   *  or much shorter, tell whoever is building the site so the spacing can
   *  be adjusted.
   *
   *  Fields marked  [PLACEHOLDER]  are invented prose.
   *  Fields marked  [FACTUAL]      are real details — the venue address, the
   *                                three categories, how the night runs.
   *                                Correct them if they are wrong, but they
   *                                are not made up.
   *
   * A note on Hindi: the site is in English. Devanagari and Hinglish appear
   * only as flavour above headings and on one or two buttons, never for
   * anything a visitor needs to understand. Every Hindi word used on the
   * site is listed in docs/HANDOVER.md for review.
   * ═════════════════════════════════════════════════════════════════════════ */
  copy: {
    /* ─── HERO ─────────────────────────────────────────────────────────── */
    hero: {
      /** Small line above the name. */
      eyebrow: "Nagpur · Live music competition and open mic",
      /** The two buttons. */
      primaryCta: { label: "Get free ticket", href: "#tickets" },
      secondaryCta: { label: "Apply to perform", href: "#perform" },
      /** Reassurance under the buttons. */
      footnote: "Free to attend. Free to apply.",
    },

    /* ─── THE IDEA ─────────────────────────────────────────────────────────
     * [PLACEHOLDER] — but the closest thing here to a finished sentence.
     *
     * This is the paragraph a journalist copies and pastes, so it has to be
     * plain, factual and free of adjectives. UNDER 40 WORDS. Currently 32.
     *
     * If you change nothing else in this file, get this paragraph right.
     * ─────────────────────────────────────────────────────────────────── */
    idea: {
      eyebrow: "सुनो",
      heading: "The idea",
      body: "Kool Kalakaars is a recurring live music competition and open mic in Nagpur. Three categories — open mic vocals, band showcase, solo instrumental. Free to attend, open to apply, hosted at Chitnavis Centre.",
    },

    /* ─── SPONSORS AND PRESS BAND ──────────────────────────────────────────
     * [PLACEHOLDER] — heading 3-5 words, body one line under 20 words. */
    pressBand: {
      heading: "For sponsors and press",
      body: "Brand partnerships, press enquiries and interview requests go straight to the founder.",
      cta: { label: "See sponsorship", href: "#sponsor" },
    },

    /* ─── WHY NAGPUR ───────────────────────────────────────────────────────
     * [PLACEHOLDER] — three points, title 3-5 words, body 15-25 words.
     *
     * OBSERVATIONAL ONLY. There is not a single number in here and there
     * must not be one. "Nagpur has 400 working musicians" would be invented,
     * and a sponsor who checks it and finds nothing behind it stops trusting
     * everything else on the page. Say what anyone in the city can see for
     * themselves. If you later have a real, sourced figure, add it with the
     * source next to it.
     * ─────────────────────────────────────────────────────────────────── */
    whyNagpur: {
      eyebrow: "क्यों",
      heading: "Why Nagpur",
      points: [
        {
          title: "Everyone practises alone",
          body: "Bedrooms, garages, the back rooms of music shops. The playing is happening. The hearing is not.",
        },
        {
          title: "Nothing comes back around",
          body: "A one-off show is a one-off. Without a night that returns, nobody can build towards anything.",
        },
        {
          title: "Nowhere to go and find out",
          body: "If you wanted to hear what this city sounds like on a Saturday, you would not know where to start.",
        },
      ] as Point[],
    },

    /* ─── THE THREE CATEGORIES ─────────────────────────────────────────────
     * Category names and qualifiers: [FACTUAL]
     * Blurbs: [PLACEHOLDER] — one line each, aim for 8-14 words.
     *
     * The images are licensed stock, deliberately tight detail crops with no
     * faces in them, processed to greyscale and coloured by PopImage so none
     * of it reads as raw stock. Sources and credits: docs/IMAGE_CREDITS.md
     *
     * To swap in real photos after the first event: drop the files into
     * public/images and change the paths here. Nothing else needs touching.
     * ─────────────────────────────────────────────────────────────────── */
    categories: {
      eyebrow: "तीन रास्ते",
      heading: "Three ways up",
      items: [
        {
          name: "Open Mic",
          qualifier: "Vocals",
          blurb: "One voice, one song, one shot. Backing track or live accompaniment.",
          image: "/images/open-mic.webp",
          imageAlt:
            "A stage microphone in close-up, stage lights thrown out of focus behind it",
        },
        {
          name: "Band Showcase",
          qualifier: "Full lineup",
          blurb: "Bring the whole group. Originals and covers both welcome.",
          image: "/images/band.webp",
          imageAlt: "Macro detail of the strings and pickups of an electric guitar",
        },
        {
          name: "Solo Instrumental",
          qualifier: "Any instrument",
          blurb: "Tabla to telecaster, sitar to synth. Play the thing you actually play.",
          image: "/images/solo-instrumental.webp",
          imageAlt: "A hand mid-strike on the skin of a tabla",
        },
      ] as Category[],
    },

    /* ─── HOW A NIGHT RUNS ─────────────────────────────────────────────────
     * Step titles: [FACTUAL] — this is genuinely the plan.
     * Step bodies: [PLACEHOLDER] — 15-25 words each.
     *
     * Do not promise anything here you are not certain you can deliver on the
     * night. Sponsors and performers will both read this as a commitment. */
    format: {
      eyebrow: "रात कैसे चलती है",
      heading: "How a night runs",
      steps: [
        {
          title: "Entries open",
          body: "Applications come in through a form with an audio or video sample attached. Applying costs nothing.",
        },
        {
          title: "Curation",
          body: "Every entry gets listened to. A shortlist is built for the evening across all three categories.",
        },
        {
          title: "The live evening",
          body: "Selected acts perform to a live room at Chitnavis Centre. Entry is free for everyone who comes to watch.",
        },
        {
          title: "Judging and prizes",
          body: "An independent panel scores the performances on the night. Winners are announced before the room empties.",
        },
        {
          title: "Content and reach",
          body: "The evening is filmed and photographed. Performers get footage they can actually use afterwards.",
        },
      ] as Step[],
    },

    /* ─── VENUE ────────────────────────────────────────────────────────────
     * Heading and eyebrow: [PLACEHOLDER]. The address itself is [FACTUAL]
     * and lives further up this file under . */
    venue: {
      eyebrow: "जगह",
      heading: "The venue",
    },

    /* ─── SPONSOR ──────────────────────────────────────────────────────────
     * [PLACEHOLDER] — lead under 30 words, three benefits at 15-25 words.
     *
     * The most important section on the site for the primary audience. Worth
     * more of your attention than anything except the idea paragraph.
     * ─────────────────────────────────────────────────────────────────── */
    sponsor: {
      eyebrow: "साथ चलो",
      heading: "Become a sponsor",
      lead: "Kool Kalakaars is not-for-profit in this phase. Sponsorship is what puts the lights on and keeps entry free for the room.",
      benefits: [
        {
          title: "A young audience, again and again",
          body: "This is built as a recurring night, so a partnership compounds instead of evaporating after one evening.",
        },
        {
          title: "Co-branding on every poster and on stage",
          body: "Your mark travels with the campaign, sits on the stage backdrop and appears in the footage afterwards.",
        },
        {
          /**
           * ⚠️  VERIFY THIS WORDING WITH CHITNAVIS CENTRE BEFORE LAUNCH.
           *
           * This says the Centre is ORIGINATING the initiative, which is a
           * stronger claim than "hosted at" or "in partnership with" — it
           * makes a named institution the originator rather than the venue.
           *
           * If that is exactly the relationship, it is a real credibility
           * asset and worth stating. If the Centre is the venue and partner
           * rather than the originator, soften it — an institution seeing
           * itself described as originating something it merely hosts is the
           * kind of thing that damages the partnership.
           *
           * Safer alternative if in doubt:
           *   "A civic cultural programme, in partnership with Chitnavis
           *    Centre — not a nightclub promotion."
           */
          title: "Association with a cultural initiative",
          body: "A cultural initiative Chitnavis Centre is originating in Nagpur — a civic programme at a civic venue, not a nightclub promotion.",
        },
      ] as Point[],

      /** Shown on the deck button once links.sponsorDeck has a path. */
      deckReadyLabel: "Download sponsor deck",
      /** Shown on the deck button while links.sponsorDeck is null. */
      deckPendingLabel: "Ask for the sponsor deck",
      /** The reassuring line under the button while the deck does not exist. */
      deckPendingNote:
        "The deck is being finalised. Email us and it comes to you the moment it is ready.",

      contactCta: "Talk to the founder",
      /** Prefilled subject line on the sponsor email link. */
      emailSubject: "Sponsorship — Kool Kalakaars",
    },

    /* ─── FREE TICKET FORM ─────────────────────────────────────────────── */
    tickets: {
      eyebrow: "आ जाओ",
      heading: "Get your free ticket",
      lead: "Entry is free. This is only so we know how many chairs to put out.",
      /** Most seats one person can request in a single go. */
      maxSeats: 4,
      submitLabel: "Get free ticket",
      submittingLabel: "Sending…",
      successHeading: "You are on the list",
      successBody: "We will message you on WhatsApp with the details once the date is confirmed.",
      /** Shown if the form cannot reach the server. */
      errorHeading: "That did not go through",
      errorBody: "Message us on WhatsApp instead and we will add you by hand.",
      /** Consent line shown above the button. Required — this collects PII. */
      consent: "We use your details only to confirm your seat. We do not share them with anyone.",
    },

    /* ─── APPLY TO PERFORM ─────────────────────────────────────────────── */
    perform: {
      eyebrow: "चलो, दिखाओ",
      heading: "Apply to perform",
      lead: "Applying is free. If you are selected, there is a small nominal fee to confirm your slot — nothing before that.",
      /**
       * [FACTUAL] — this list mirrors the live Google Form question for
       * question, checked against it directly. The whole point is that
       * somebody reads this, gathers what they need, and then fills the form
       * in one sitting instead of abandoning it halfway.
       *
       * ⚠️  If you edit the Google Form, edit this list to match. A preview
       * that lies is worse than no preview.
       */
      fieldPreview: [
        {
          label: "Name",
          hint: "Yours, or your band or group's.",
        },
        {
          label: "Category",
          hint: "Vocalist · Instrumentalist · Band · Singer-songwriter · Rapper or spoken word · DJ or producer · Other",
        },
        {
          label: "Contact number",
          hint: "10-digit mobile. WhatsApp preferred.",
        },
        { label: "Email" },
        {
          label: "Audio or video link",
          hint: "YouTube, Instagram, Google Drive, SoundCloud — anything we can open.",
          optional: true,
        },
        {
          label: "Band size",
          hint: "Solo · Duo · Trio · 4-5 · 6 or more",
        },
        {
          label: "Song you plan to perform",
          hint: "Title, and the artist if it is a cover.",
        },
        { label: "Original or cover" },
      ] as FormFieldPreview[],
      note: "The application form opens on Google and needs a Google sign-in, because it accepts a direct file upload.",
      ctaLabel: "Open the application form",
      /** Used when links.performerForm is still null. */
      ctaPendingLabel: "Applications open soon — message us",
    },

    /* ─── COMMUNITY ────────────────────────────────────────────────────── */
    community: {
      eyebrow: "जुड़ जाओ",
      heading: "Join the community",
      body: "Announcements, dates and calls for entries land here first.",
      /** Used once links.whatsappCommunity has a real invite link. */
      ctaLabel: "Join the WhatsApp group",
      /**
       * Used while that link is still null — which it is today. Rather than
       * hiding the section, it points at the ordinary WhatsApp number and asks
       * to be added by hand. A section that still converts beats a hidden one.
       */
      ctaPendingLabel: "Message us to get added",
      pendingNote:
        "The group is being set up. Message us and you go on the list for the invite.",
    },

    /* ─── FOOTER ───────────────────────────────────────────────────────── */
    footer: {
      /** Shown small, at the very bottom. */
      credit: "Kool Kalakaars is an independent, not-for-profit initiative.",
    },

    /* ─── MARQUEE ──────────────────────────────────────────────────────────
     * The scrolling text band. Keep each item short.
     * ─────────────────────────────────────────────────────────────────── */
    marquee: [
      "Open mic",
      "Band showcase",
      "Solo instrumental",
      "Free entry",
      "Nagpur",
      "चलो",
    ],
  },
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
