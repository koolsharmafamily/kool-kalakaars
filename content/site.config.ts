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
     * TODO: replace with the real domain once it is registered.
     * Used for Google search results, sharing previews and the sitemap.
     */
    url: "https://koolkalakaars.com",

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
     * TODO: the Google Form for performer applications.
     * Opens in a new tab. While this is null, the Apply section shows a
     * WhatsApp button instead of a broken link.
     */
    performerForm: null as string | null,

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
    heroVideoDesktop: null as string | null,
    heroVideoMobile: null as string | null,
    heroPoster: null as string | null,

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
          title: "Association with a cultural initiative",
          body: "A civic-minded, city-level music platform hosted at Chitnavis Centre — not a nightclub promotion.",
        },
      ] as Point[],
      /** Shown on the deck button when links.sponsorDeck is null. */
      deckPendingLabel: "Request the sponsor deck",
      deckReadyLabel: "Download sponsor deck",
      contactCta: "Talk to the founder",
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
      /** What the Google Form asks for, so applicants arrive prepared. */
      fieldPreview: [
        { label: "Your name" },
        { label: "Category", hint: "Open mic, band or solo instrumental" },
        { label: "Contact number" },
        { label: "Email address" },
        { label: "An audio or video sample", hint: "A link, or upload a file directly" },
        { label: "Band size", hint: "How many of you are there" },
        { label: "The song you will perform", hint: "And whether it is an original or a cover" },
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
      ctaLabel: "Join on WhatsApp",
    },

    /* ─── FOOTER ───────────────────────────────────────────────────────── */
    footer: {
      /** Shown small, at the very bottom. */
      credit: "Kool Kalakaars is an independent, not-for-profit initiative.",
      /** These pages exist but stay out of the navigation until written. */
      legalLinks: [
        { label: "Rules", href: "/rules" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
      ],
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
