# Lcargo Diversified Logistics Inc. — Website

A fast, responsive website for **Lcargo Diversified Logistics Inc.**, a total logistics service
provider based in Mandaue City, Cebu, Philippines. Recreated from the company's previous
WordPress site (`lcargologistics.com`) as pure static **HTML / CSS / JS** — no build step,
hosts anywhere.

> **"We just don't serve, we satisfy."**

## Company facts used (from the old site export)
- **Incorporated:** September 22, 2016 (started with 1 van)
- **Address:** Zone 5J Bridges Town Square, Plaridel St., Alang-alang, Mandaue City, Cebu, Philippines
- **Phone:** +63 32 236 9992 · +63 32 234 4869 · +63 32 328 4597
- **Email:** info@lcargologistics.com
- **Fleet:** 4 prime movers, 3 wing vans, 2 closed vans, 1 L300, 1 multicab · 22 employees · 25+ clients
- **Services:** Freight Forwarding (int'l & domestic), Trucking, Warehousing, Special Cargo Handling, Customs Brokerage, Sea & Air Cargo

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — tagline hero, company snapshot, services, coverage, process, testimonials |
| `services.html` | Detailed breakdown of all six services |
| `about.html` | Our Story — company history, mission, fleet, values |
| `clients.html` | Our Clients — growth, client-logo grid, testimonials |
| `contact.html` | Quote request form + real address, phones, email, map |

## Files
- `style.css` — full design system (tokens, components, responsive) in the real **red/black brand**
- `main.js` — mobile nav, scroll reveals, stat counters, quote-form demo
- `assets/` — **real assets recovered from the old site** via the Wayback Machine:
  - `logo.jpeg` — the actual LCARGO logo (red/black "L" over a globe)
  - `service-*.jpg` — the six real service photos (incl. a shot of the company's own wing van)
  - `clients.jpg` — the real client-logo montage
  - `logo.svg` — a fallback vector mark (no longer referenced)

## Run locally
Open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python -m http.server 8000
```

## Recovered from the old site
The original `lcargologistics.com` is now a parked domain, so the real images were pulled from the
**Internet Archive (Wayback Machine)**: the logo, all six service photos, and the client montage.
Brand colors (red/black) were matched to the recovered logo. Real client names (Lear, KWE, Funai,
DSV, DB Schenker, Agility, Evergreen, Scan Global, Austal, etc.) come from the client montage.

## Still to personalize
- **Higher-res logo:** `assets/logo.jpeg` is the archived copy (~650px). Swap in a crisp original if you have one
- **Testimonials:** the three quotes are sample placeholders — replace with real client quotes
- **Map pin:** the OpenStreetMap embed in `contact.html` is approximate — set the exact marker coordinates
- **Social links:** footer social icons point to `#` — add the real Facebook / page URLs

## Contact form
The form on `contact.html` uses the original fields (**Name · Email · Subject · Message**) and
**works with no backend out of the box**: submitting opens the visitor's email app with a
pre-filled message to `info@lcargologistics.com`.

### Receive submissions straight to your inbox (recommended)
The form is already wired for [**Web3Forms**](https://web3forms.com) — free, no account, no server.
Just add your key:

1. Go to **web3forms.com**, enter **info@lcargologistics.com**, and copy the **Access Key** they email you.
2. In `contact.html`, find this line and paste your key in place of `YOUR_WEB3FORMS_ACCESS_KEY`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```

That's it. With a real key, messages send **in the background** (no email-app popup) and show an
inline "Thank you" — `main.js` detects the key automatically. A hidden honeypot field is already
included for spam protection. Until a key is added, the mailto fallback keeps the form working.

## Deploy
Drag the folder into **Netlify**, push to **GitHub Pages**, or upload to any web host.

---
Design: industrial-precision aesthetic — ink navy + hi-vis amber, with monospace technical accents.
