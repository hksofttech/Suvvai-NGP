# Suvvai

Premium website for Suvvai, a South Indian kitchen at Medical Chowk, Nagpur.

The live page is the site. Menu items, prices, phone, WhatsApp, hours, and ordering links are edited in two files — nothing is invented where the restaurant has not confirmed it.

## Run

The preview starts on its own. To run the project locally after a checkout:

```bash
npm install
npm run dev
```

## Where to edit

| What | File |
| --- | --- |
| Phone, WhatsApp, hours, ordering link, maps URL | `src/data/site.ts` |
| Dishes, descriptions, prices, photos | `src/data/menu.ts` |
| Dining-room photographs | `src/data/site.ts` (`gallery`) and `public/images/interior/` |
| Food photographs | `public/images/dishes/` |
| Visual design | `src/styles.css` |

### Phone and WhatsApp

In `src/data/site.ts`, set digits only, with country code, no spaces:

```ts
phone: "9198XXXXXXXX",
whatsapp: "9198XXXXXXXX",
```

Leave either string empty (`""`) until the number is verified. Empty values do not create `tel:` or `wa.me` links. Call and WhatsApp buttons explain that the number is not published yet.

When a WhatsApp number is set, **Reserve a Table** opens WhatsApp with the enquiry text. Until then, the enquiry is saved only on the visitor’s device and can be copied. It is never described as a confirmed booking.

### Ordering

Set `orderUrl` to a real `https://` link (the restaurant’s page, Swiggy, Zomato, or similar). Leave it empty and the Order button explains that ordering is not linked. It does not pretend an order was placed.

### Hours

Set `hours` to a line the restaurant has confirmed, for example `"Mon–Sun · 8:00–22:30"`. Until then the site says timings are not published.

### Menu

Replace the array in `src/data/menu.ts`. Keep `sample: true` on anything that is still a placeholder. Set `sample: false` only after the dish and price are confirmed. Prices are rupees, as whole numbers.

Point `image` at a file in `public/images/dishes/`.

### Photographs

- The dining-room pictures are crops of the restaurant’s own photo. Do not swap in generated interiors and present them as Suvvai.
- Food pictures are illustrative. Alt text says so. Replace them with photographs of plates from the restaurant when you have them.
- Add a gallery item in `gallery` in `src/data/site.ts` with `src`, `width`, `height`, and a real `alt`.

### Directions

`mapsUrl` is `https://maps.app.goo.gl/6miBBnEkce16vrT88`. That short link resolves to the Google place **Suvvai Restaurant**. The map embed uses the coordinates from that place. Do not point it at a different pin.

## Before a public launch

Confirm, then fill in:

- Phone number
- WhatsApp number
- Opening hours
- The real menu and prices (remove sample labels)
- An ordering link, if one exists
- A reservation channel, if one exists
- Any social profiles — none are linked, because none were verified

Do not add ratings, awards, a founding year, or “fresh ingredients” claims unless they are true and you are willing to stand behind them.

## Deploy

The app is a static-feeling site on TanStack Start.

- **Vercel:** connect the repo and use the existing `vercel.json`. It installs the locked production dependencies with `npm ci` and builds with `npm run build`.
- **Netlify:** build command `npm run build`, publish the framework’s output (Nitro/Vercel preset is already wired; use Vercel if you want the path this project is set up for).
- **GitHub Pages:** this stack expects a server build, so Vercel is the straightforward host. A plain HTML export is not produced.

### Production checklist

- Use Node.js 22 and install from the lockfile with `npm ci`.
- Before deployment, run `npm run typecheck`, `npm test`, and `npm run build`.
- No app-specific secrets or database are required. For a custom domain, set `VITE_PUBLIC_HOSTNAME` in the deployment provider to the hostname only (for example, `suvvai.example.com`). The optional setting is documented in `.env.example`; do not commit real `.env` files.
- Complete the [public-launch checks](#before-a-public-launch) before promoting the site to production.

## Structure

```text
src/routes/index.tsx          the page
src/components/suvvai-home.tsx
src/styles.css                design tokens and layout
src/data/site.ts              address, maps, contact placeholders
src/data/menu.ts              sample dishes
public/images/                photographs
public/favicon.svg            monogram
public/og.jpg                 share card
```
