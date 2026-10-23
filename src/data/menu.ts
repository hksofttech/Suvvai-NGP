/**
 * SAMPLE MENU
 * ------------
 * These dishes and prices are layout placeholders taken from the approved
 * design. They are NOT Suvvai’s published menu.
 *
 * To publish the real menu, replace this array. Each item needs:
 *   id, name, description, price (number, INR), image (path under /images)
 * Keep `sample: true` until the restaurant confirms the item and the price.
 * Remove `sample` (or set it false) only for confirmed items.
 */

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  width: number;
  height: number;
  sample: boolean;
};

export const menuNote =
  "Illustrative plates for this page. Names and prices are samples until Suvvai publishes its menu.";

export const signatureDishes: MenuItem[] = [
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    description: "Crispy dosa with a spiced potato filling, with chutney and sambar.",
    price: 120,
    image: "/images/dishes/masala-dosa.jpg",
    width: 1792,
    height: 1008,
    sample: true,
  },
  {
    id: "idli-sambar",
    name: "Idli Sambar",
    description: "Steamed rice cakes with sambar.",
    price: 80,
    image: "/images/dishes/idli-sambar.jpg",
    width: 1200,
    height: 900,
    sample: true,
  },
  {
    id: "medu-vada",
    name: "Medu Vada",
    description: "Crisp lentil vadas with sambar and coconut chutney.",
    price: 90,
    image: "/images/dishes/medu-vada.jpg",
    width: 1200,
    height: 900,
    sample: true,
  },
  {
    id: "pongal",
    name: "Pongal",
    description: "Soft rice-and-lentil pongal finished with ghee.",
    price: 100,
    image: "/images/dishes/pongal.jpg",
    width: 1200,
    height: 900,
    sample: true,
  },
  {
    id: "rava-dosa",
    name: "Rava Dosa",
    description: "Thin, lacy rava dosa with chutney and sambar.",
    price: 130,
    image: "/images/dishes/rava-dosa.jpg",
    width: 1200,
    height: 900,
    sample: true,
  },
];

export function formatInr(amount: number) {
  return `₹${amount}`;
}
