/**
 * Suvvai — verified facts and launch placeholders.
 *
 * Fill only the values you have actually confirmed.
 * Leave a string empty ("") when it is still unknown.
 * Do not invent a phone number, WhatsApp number, hours, or ordering link.
 */

export const site = {
  name: "Suvvai",
  descriptor: "South Indian Kitchen",
  cityLine: "Medical Chowk, Nagpur",
  address: "Medical Chowk, Nagpur, Maharashtra, India",
  /**
   * Short link supplied for directions. It resolves to the Google Maps
   * place “Suvvai Restaurant” (place id g/11zz4jbk36).
   */
  mapsUrl: "https://maps.app.goo.gl/6miBBnEkce16vrT88",
  /** Coordinates taken from that same Maps place, not guessed. */
  latitude: 21.1293944,
  longitude: 79.0948418,
} as const;

export const contact = {
  /**
   * Verified phone, digits only, with country code. No plus, spaces, or dashes.
   * Example: "919812345678". Leave "" until the restaurant confirms it.
   */
  phone: "",
  /**
   * Verified WhatsApp number, same format as phone.
   * Leave "" to fall back to `phone` when that is set, or "" if neither is known.
   */
  whatsapp: "",
  /**
   * Full https URL of a real ordering page (Swiggy, Zomato, or the restaurant’s own).
   * Leave "" if online ordering is not published.
   */
  orderUrl: "",
  /**
   * Published opening hours as one readable line, e.g. "Mon–Sun · 8:00–22:30".
   * Leave "" until the restaurant confirms them.
   */
  hours: "",
} as const;

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function phoneNumber() {
  return digits(contact.phone);
}

export function whatsappNumber() {
  return digits(contact.whatsapp) || phoneNumber();
}

export function telHref() {
  const phone = phoneNumber();
  return phone ? `tel:+${phone}` : null;
}

export function whatsappHref(text?: string) {
  const phone = whatsappNumber();
  if (!phone) return null;
  const base = `https://wa.me/${phone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const gallery = [
  {
    src: "/images/interior/dining-room.jpg",
    width: 528,
    height: 529,
    alt: "Suvvai dining room at Medical Chowk: the illuminated Suvvai sign on a white wall above a green dado, with a wooden table and dark chairs",
  },
  {
    src: "/images/interior/sign.jpg",
    width: 443,
    height: 285,
    alt: "Close view of the illuminated Suvvai sign on the white dining-room wall",
  },
  {
    src: "/images/interior/table.jpg",
    width: 385,
    height: 276,
    alt: "Wooden table and dark chairs against the green wall in the Suvvai dining room",
  },
  {
    src: "/images/interior/seating.jpg",
    width: 291,
    height: 344,
    alt: "Chairs and a leafy plant beside the green wall in the Suvvai dining room",
  },
] as const;
