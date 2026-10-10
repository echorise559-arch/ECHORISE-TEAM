# Echorise Media — React Website

A full-featured music promotion website built with **React + Vite + Tailwind CSS**, ready to deploy on **Netlify**.

## Tech Stack
- React 18 + React Router v6
- Tailwind CSS v3 with custom design tokens
- Vite build system
- Netlify Functions + Netlify Blobs (form emails, artist spotlight storage)
- Brevo (transactional email)
- Secure payment gateway integration (placeholder, ready to activate)

## Project Structure
```
src/
  components/
    Navbar.jsx            # Fixed navbar with mobile menu + Order Now modal
    Footer.jsx            # Site footer
    OrderModal.jsx        # Full order form modal (emailed to the team)
    PaymentModal.jsx      # Secure payment step + invoice flow
    SpotifyCustomModal.jsx # Custom campaign request + invoice request (emailed to the team)
    ArtistSpotlight.jsx   # Artist of the Week / Month / Year section (hidden until an artist is added)
    PricingCard.jsx       # Reusable pricing card
    ReviewCard.jsx        # Review card with image, flag, stars, reply
    TeamSection.jsx       # Team ledger by department (filterable; optional photo per member)
    TrustSection.jsx      # "What you can count on" commitments + what happens after you order
    StatsBar.jsx          # Animated counter stats bar
    FAQSection.jsx        # Accordion FAQ
    PartnerLogos.jsx      # Platform partner logos
    PageHero.jsx          # Reusable inner page hero
  pages/
    Home.jsx              # Full homepage
    SpotifyPage.jsx       # Spotify promotion page
    SoundCloudPage.jsx    # SoundCloud promotion page
    DancePage.jsx         # Dance video promotion page
    ContactPage.jsx       # Contact form page (emailed to the team)
    AdminArtistsPage.jsx  # Hidden dashboard at /admin/artists
    OrderPage.jsx         # Standalone order page with 3-step flow
    SuccessPage.jsx       # Post-payment success + invoice download
    NotFound.jsx          # 404 page
  data/
    index.js              # All site data (reviews, packages, team, FAQ, countries)
```

## Environment variables (Netlify)

Set these in **Netlify > Site configuration > Environment variables**, then redeploy.

### Required for email and the admin pages

| Variable | Example | What it controls |
|---|---|---|
| `ADMIN_PASSWORD` | a new strong password, 8+ characters | Password for `/admin/artists` and `/admin/invoice`. Checked on the server only |
| `BREVO_API_KEY` | your Brevo API key | Sends form notifications, the test email and invoices |
| `NOTIFY_EMAILS` | `support@echorisemedia.com,hello@echorisemedia.com` | Inboxes that receive every form submission. Defaults to those two addresses when not set |

`VITE_INVOICE_PASSWORD` is no longer used. Delete it from Netlify.

### Optional (a button or icon stays hidden until its value is set)

| Variable | Example | What it controls |
|---|---|---|
| `WHATSAPP_NUMBER` | `2348012345678` | WhatsApp buttons (digits only, with country code) |
| `TELEGRAM_LINK` | `https://t.me/echorisemedia` | Telegram buttons (footer, contact page, team section) |
| `TELEGRAM_USERNAME` | `echorisemedia` | Older alternative to `TELEGRAM_LINK`; only used if `TELEGRAM_LINK` is not set |
| `TIKTOK_URL` | `https://tiktok.com/@echorisemedia` | TikTok icon in the footer |
| `INSTAGRAM_URL` | `https://instagram.com/echorisemedia` | Instagram icon in the footer |

## Setup

```bash
npm install
npm run dev       # development server
npm run build     # production build → ./dist
npm run preview   # preview production build
```

## Deploy to Netlify

The site now uses Netlify Functions (form emails, admin pages, artist storage), so it must be deployed
through **Git** or the **Netlify CLI**. Dragging only the `dist/` folder into Netlify Drop publishes the
pages but does not run any functions.

### Option 1: Git + Netlify CI (recommended)
1. Push this repo to GitHub/GitLab
2. Connect to Netlify > New site from Git
3. Build command: `npm run build`, publish directory: `dist` (already set in `netlify.toml`)
4. Add the environment variables above, then deploy

### Option 2: Netlify CLI
```bash
npm install
npx netlify deploy --build --prod
```

`netlify.toml` handles SPA routing and the functions folder automatically.

## Forms and email

No outside form service is used. Every form posts to `netlify/functions/submit.js`, which emails the
details through Brevo to `NOTIFY_EMAILS`. The visitor only sees a success message after Brevo accepts the
email, and sees an error message if it does not. Forms covered:
- **Contact** page
- **Custom promotion request** (Spotify, YouTube, Apple Music)
- **Press Features request** on `/press` (sent as a custom request with the package and outlets in the notes)
- **Invoice request** inside the custom request popup
- **Order** popup and the **Order** page (sent before the visitor is taken to the payment page)

Brevo checklist:
1. `support@echorisemedia.com` must be a verified sender in Brevo
2. The `echorisemedia.com` domain must be authenticated in Brevo (DKIM and SPF). If SPF already exists for
   another sender, add Brevo's include to that same record instead of creating a second one
3. Create `hello@echorisemedia.com` in Cloudflare Email Routing and forward it to your inbox

After deploying, open `/admin/artists` and press **Send test email** to confirm delivery.

## Artist of the Week, Month and Year

Managed at `/admin/artists` (not linked anywhere on the site). Sign in with `ADMIN_PASSWORD`, then for each
slot you can set the artist name, period label, genre or location line, description, image, up to 8
streaming links and up to 6 social links. Clearing a slot removes its text, image and links. The home page
section stays hidden while all three slots are empty. Artist of the Year appears as a full-width card below the Week and Month cards. Data and images are stored in Netlify Blobs.

`/admin/invoice` uses the same password. The invoice email function (`send-email`) only accepts requests
from a signed-in admin.

## Activating Payments
Contact the Echorise Media dev team to configure the payment gateway integration in `src/components/PaymentModal.jsx`.

## Customisation
- **Colors**: Edit `tailwind.config.js` → `theme.extend.colors`
- **Content**: Edit `src/data/index.js` (packages, reviews, team, FAQ)
- **Pricing**: Update package prices in `src/data/index.js`
- **Contact email**: Update in `src/components/Footer.jsx` and `src/pages/ContactPage.jsx`
