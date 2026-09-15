import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import siteConfig from "@/content/site.config";
import StickyNav from "@/components/layout/StickyNav";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/ui/WhatsAppFab";
import "./globals.css";

/**
 * Full metadata — Open Graph, Twitter cards, canonical URL and structured
 * data — lands in build step 7. This is the shell it will hang from.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: siteConfig.site.metaTitle,
  description: siteConfig.site.metaDescription,
};

export const viewport: Viewport = {
  themeColor: "#392989",
  // Never block pinch-zoom. Capping user-scalable is an accessibility failure.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/* Scroll reveals start hidden and are un-hidden by JavaScript. If
            JavaScript never runs, this makes every one of them visible, so the
            page can never render as a column of invisible text. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-surface text-ink font-body antialiased">
        {/* Keyboard users get past the nav in one keystroke. */}
        <a
          href="#main"
          className="bg-cta text-cta-ink sr-only rounded-full px-5 py-3 font-bold focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to content
        </a>

        <StickyNav
          items={siteConfig.nav.items}
          primary={siteConfig.nav.primary}
          siteName={siteConfig.site.name}
          logo={siteConfig.media.logo}
          logoWidth={siteConfig.media.logoWidth}
          logoHeight={siteConfig.media.logoHeight}
          phoneDisplay={siteConfig.contact.phoneDisplay}
          phoneE164={siteConfig.contact.phoneE164}
          email={siteConfig.contact.email}
        />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab
          href={siteConfig.links.whatsappChat}
          label={`Message ${siteConfig.site.name} on WhatsApp`}
        />

        {/* ── RELEASE THE LAYOUT SKIP ─────────────────────────────────────
            See "SKIP LAYOUT FOR SECTIONS THAT ARE NOT ON SCREEN YET" in
            globals.css. content-visibility is a first-load optimisation
            only; this turns it off once it has done its job, and forces it
            off before any in-page jump so the jump lands in the right place. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
var root=document.documentElement,done=false;
function release(){if(done)return;done=true;root.classList.add("kk-cv-done");}
document.addEventListener("click",function(e){
  var a=e.target&&e.target.closest&&e.target.closest('a[href^="#"]');
  if(a&&!done){release();void document.body.offsetHeight;}
},true);
var played=false,loaded=false;
function maybe(){if(played&&loaded){(window.requestIdleCallback||function(f){setTimeout(f,200)})(release,{timeout:2000});}}
document.addEventListener("playing",function(e){if(e.target&&e.target.id==="kk-hero-video"){played=true;maybe();}},true);
setTimeout(function(){played=true;maybe();},4000);
if(!document.getElementById("kk-hero-video"))played=true;
if(document.readyState==="complete"){loaded=true;maybe();}else window.addEventListener("load",function(){loaded=true;maybe();});
if(location.hash)release();
})();`,
          }}
        />
      </body>
    </html>
  );
}
