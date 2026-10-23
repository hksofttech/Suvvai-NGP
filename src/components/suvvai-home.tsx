import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowUp,
  Bike,
  CalendarDays,
  Clock,
  Home,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Utensils,
  X,
} from "lucide-react";
import { formatInr, menuNote, signatureDishes } from "@/data/menu";
import {
  gallery,
  site,
  telHref,
  whatsappHref,
  contact,
  phoneNumber,
  whatsappNumber,
} from "@/data/site";

const NAV = [
  { href: "#top", id: "top", label: "Home" },
  { href: "#menu", id: "menu", label: "Menu" },
  { href: "#about", id: "about", label: "About" },
  { href: "#gallery", id: "gallery", label: "Gallery" },
  { href: "#visit", id: "visit", label: "Visit Us" },
  { href: "#contact", id: "contact", label: "Contact" },
] as const;

type NoticeKind = "call" | "whatsapp" | "order";

const NOTICES: Record<NoticeKind, { title: string; body: string }> = {
  call: {
    title: "Phone number not published",
    body: "Suvvai has not added a phone number to this website yet. You can still visit the dining room at Medical Chowk, Nagpur.",
  },
  whatsapp: {
    title: "WhatsApp not published",
    body: "A WhatsApp number has not been added yet. Use directions to reach Medical Chowk, or copy a table enquiry and share it when you visit.",
  },
  order: {
    title: "Online ordering isn’t linked",
    body: "Suvvai has not published an ordering link. This does not place an order. Visit the restaurant at Medical Chowk, or open directions.",
  },
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.4L1 23l5.7-1.1A11 11 0 0 0 12 22a11 11 0 0 0 8.5-18.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.5.5.5-2.4-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.2 3.6c.5.2 1 .4 1.4.5a3.4 3.4 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.1-.4-.2z" />
    </svg>
  );
}

function buildEnquiry(name: string, party: string, day: string, note: string) {
  return [
    "Table enquiry for Suvvai, Medical Chowk, Nagpur",
    `Name: ${name}`,
    `Party size: ${party}`,
    day ? `Preferred day: ${day}` : null,
    note ? `Note: ${note}` : null,
    "This is an enquiry, not a confirmed booking.",
  ]
    .filter(Boolean)
    .join("\n");
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Suvvai",
  servesCuisine: "South Indian",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Medical Chowk",
    addressLocality: "Nagpur",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  hasMap: site.mapsUrl,
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.latitude,
    longitude: site.longitude,
  },
};

export function SuvvaiHome() {
  const year = new Date().getFullYear();
  const [stuck, setStuck] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<NoticeKind | null>(null);
  const [lightIndex, setLightIndex] = useState(0);
  const [formError, setFormError] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [draft, setDraft] = useState("");
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const reserveRef = useRef<HTMLDialogElement>(null);
  const noticeRef = useRef<HTMLDialogElement>(null);
  const lightRef = useRef<HTMLDialogElement>(null);
  const formId = useId();
  const phone = phoneNumber();
  const whatsapp = whatsappNumber();
  const callHref = telHref();
  const chatHref = whatsappHref();

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 8);
      setShowTop(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const dialog = lightRef.current;
    if (!dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (!dialog.open) return;
      if (event.key === "ArrowRight") {
        setLightIndex((index) => (index + 1) % gallery.length);
      }
      if (event.key === "ArrowLeft") {
        setLightIndex((index) => (index - 1 + gallery.length) % gallery.length);
      }
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    menuBtnRef.current?.focus();
  }

  function openReserve() {
    setMenuOpen(false);
    const dialog = reserveRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function openNotice(kind: NoticeKind) {
    setNotice(kind);
    setMenuOpen(false);
    noticeRef.current?.showModal();
  }

  function openLightbox(index: number) {
    setLightIndex(index);
    lightRef.current?.showModal();
  }

  function onOrder() {
    if (contact.orderUrl) {
      window.open(contact.orderUrl, "_blank", "noopener,noreferrer");
      return;
    }
    openNotice("order");
  }

  function onCall() {
    if (!callHref) openNotice("call");
  }

  function onWhatsApp() {
    if (!chatHref) openNotice("whatsapp");
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setFormStatus("Message copied. It has not been sent to the restaurant.");
    } catch {
      setFormStatus("Couldn’t copy automatically. Select the message below and copy it.");
    }
  }

  function onEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const party = String(data.get("party") || "").trim();
    const day = String(data.get("day") || "").trim();
    const note = String(data.get("note") || "").trim();
    if (!name || !party) {
      setFormError("Please add your name and party size.");
      setFormStatus("");
      return;
    }
    const message = buildEnquiry(name, party, day, note);
    try {
      localStorage.setItem("suvvai-enquiry-draft", message);
    } catch {
      /* private mode */
    }
    setDraft(message);
    setFormError("");
    const link = whatsappHref(message);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
      setFormStatus(
        "WhatsApp should open with your message. Nothing is booked until the restaurant confirms.",
      );
      return;
    }
    setFormStatus(
      "Saved on this device only. It was not sent — no phone or WhatsApp number is published yet. Copy the message and share it when you visit.",
    );
  }

  const shot = gallery[lightIndex] ?? gallery[0];

  return (
    <div className="sv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="sv-skip" href="#content">
        Skip to content
      </a>
      <header className={stuck ? "sv-header is-stuck" : "sv-header"}>
        <div className="sv-header-bar">
          <a className="sv-brand" href="#top">
            <span className="sv-brand-name">Suvvai</span>
            <span className="sv-brand-sub">South Indian Kitchen</span>
          </a>
          <nav className="sv-nav" aria-label="Primary">
            <ul>
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className={active === item.id ? "is-active" : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header-cta">
            <button className="sv-btn sv-btn-primary" type="button" onClick={openReserve}>
              <CalendarDays aria-hidden="true" />
              Reserve a Table
            </button>
            <button
              ref={menuBtnRef}
              className="sv-burger"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-drawer"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
              <span className="sv-sr">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="sv-drawer" onMouseDown={(event) => event.target === event.currentTarget && closeMenu()}>
          <div
            className="sv-drawer-panel"
            id="site-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="sv-drawer-top">
              <span className="sv-brand-name">Suvvai</span>
              <button className="sv-close" type="button" onClick={closeMenu}>
                <X aria-hidden="true" />
                <span className="sv-sr">Close menu</span>
              </button>
            </div>
            <nav aria-label="Mobile">
              {NAV.map((item, index) => (
                <a
                  key={item.id}
                  href={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <button className="sv-btn sv-btn-primary" type="button" onClick={openReserve}>
              <CalendarDays aria-hidden="true" />
              Reserve a Table
            </button>
          </div>
        </div>
      ) : null}

      <main id="content">
        <section className="sv-hero" id="top" aria-label="Introduction">
          <img
            className="sv-hero-bg"
            src="/images/dishes/masala-dosa.jpg"
            width={1792}
            height={1008}
            alt="Illustrative photograph of a golden dosa with sambar and chutneys"
            fetchPriority="high"
          />
          <div className="sv-hero-scrim" />
          <div className="sv-hero-copy">
            <p className="sv-kicker">Traditional taste, modern experience</p>
            <h1>
              Authentic South Indian Flavours <em>in Nagpur</em>
            </h1>
            <p className="sv-lede">
              Discover comforting South Indian flavours in a welcoming setting at Suvvai, Medical Chowk,
              Nagpur.
            </p>
            <div className="sv-hero-actions">
              <a className="sv-btn sv-btn-primary" href="#menu">
                <Utensils aria-hidden="true" />
                View Menu
              </a>
              <a className="sv-btn sv-btn-light" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" />
                Get Directions
              </a>
            </div>
          </div>
          <p className="sv-script">
            Good Food
            <br />
            Good Mood
          </p>
        </section>

        <div className="sv-wrap sv-actions-wrap">
          <ul className="sv-actions">
            <li>
              <a href="#menu">
                <span className="sv-action-icon">
                  <Utensils aria-hidden="true" />
                </span>
                <span>
                  <span className="sv-action-label">Full Menu</span>
                  <span className="sv-action-hint">Sample dishes</span>
                </span>
              </a>
            </li>
            <li>
              <button type="button" onClick={onOrder}>
                <span className="sv-action-icon">
                  <Bike aria-hidden="true" />
                </span>
                <span>
                  <span className="sv-action-label">Order Online</span>
                  <span className="sv-action-hint">
                    {contact.orderUrl ? "Open ordering" : "Not linked yet"}
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" onClick={openReserve}>
                <span className="sv-action-icon">
                  <CalendarDays aria-hidden="true" />
                </span>
                <span>
                  <span className="sv-action-label">Reserve a Table</span>
                  <span className="sv-action-hint">Write an enquiry</span>
                </span>
              </button>
            </li>
            <li>
              {callHref ? (
                <a href={callHref}>
                  <span className="sv-action-icon">
                    <Phone aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sv-action-label">Call Us</span>
                    <span className="sv-action-hint">Direct call</span>
                  </span>
                </a>
              ) : (
                <button type="button" onClick={onCall}>
                  <span className="sv-action-icon">
                    <Phone aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sv-action-label">Call Us</span>
                    <span className="sv-action-hint">Number not published</span>
                  </span>
                </button>
              )}
            </li>
            <li>
              {chatHref ? (
                <a href={chatHref} target="_blank" rel="noopener noreferrer">
                  <span className="sv-action-icon">
                    <WhatsAppIcon />
                  </span>
                  <span>
                    <span className="sv-action-label">WhatsApp</span>
                    <span className="sv-action-hint">Chat with us</span>
                  </span>
                </a>
              ) : (
                <button type="button" onClick={onWhatsApp}>
                  <span className="sv-action-icon">
                    <WhatsAppIcon />
                  </span>
                  <span>
                    <span className="sv-action-label">WhatsApp</span>
                    <span className="sv-action-hint">Number not published</span>
                  </span>
                </button>
              )}
            </li>
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className="sv-action-icon">
                  <MapPin aria-hidden="true" />
                </span>
                <span>
                  <span className="sv-action-label">Get Directions</span>
                  <span className="sv-action-hint">Medical Chowk, Nagpur</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <section className="sv-section" id="menu" aria-labelledby="menu-title">
          <div className="sv-wrap">
            <div className="sv-section-head">
              <Leaf className="sv-leaf" aria-hidden="true" />
              <h2 id="menu-title">Our Signature Dishes</h2>
              <p className="sv-sub">A preview of the South Indian table, laid out for this page.</p>
              <p className="sv-note">{menuNote}</p>
            </div>
            <div className="sv-dishes">
              {signatureDishes.map((dish) => (
                <article className="sv-dish" key={dish.id}>
                  <div className="sv-dish-media">
                    <img
                      src={dish.image}
                      width={dish.width}
                      height={dish.height}
                      alt={`Illustrative photo of ${dish.name}`}
                      loading="lazy"
                    />
                  </div>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <p className="sv-price">
                    {dish.sample ? <span className="sv-sample">Sample</span> : null}
                    {formatInr(dish.price)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sv-about" id="about" aria-labelledby="about-title">
          <div className="sv-about-photo">
            <img
              src="/images/interior/dining-room.jpg"
              width={528}
              height={529}
              alt="Suvvai dining room at Medical Chowk, with the illuminated sign, green wall, and tables"
              loading="lazy"
            />
          </div>
          <div className="sv-about-panel">
            <p className="sv-eyebrow">About Suvvai</p>
            <h2 id="about-title">
              More Than Just a Meal, <em>It’s an Experience</em>
            </h2>
            <p>
              Suvvai is a South Indian kitchen in a bright dining room at Medical Chowk, Nagpur. The sign
              on the white wall, the green dado, and the row of tables are the room itself — a
              straightforward place to sit down and eat.
            </p>
            <ul className="sv-points">
              <li>
                <Utensils aria-hidden="true" />
                <span>
                  <strong>Sit-down dining</strong>
                  <span>Tables in the room you see here</span>
                </span>
              </li>
              <li>
                <MapPin aria-hidden="true" />
                <span>
                  <strong>Medical Chowk</strong>
                  <span>Nagpur, Maharashtra</span>
                </span>
              </li>
              <li>
                <Leaf aria-hidden="true" />
                <span>
                  <strong>South Indian kitchen</strong>
                  <span>The name on the dining-room wall</span>
                </span>
              </li>
              <li>
                <Home aria-hidden="true" />
                <span>
                  <strong>A green room</strong>
                  <span>White wall, deep green dado</span>
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="sv-section" id="gallery" aria-labelledby="gallery-title">
          <div className="sv-wrap">
            <div className="sv-gallery-head">
              <div>
                <p className="sv-eyebrow">
                  <Leaf className="sv-leaf" aria-hidden="true" /> Our Ambience
                </p>
                <h2 className="sv-block-title" id="gallery-title">
                  A comfortable room for the table
                </h2>
                <p>Photographs of the Suvvai dining room at Medical Chowk.</p>
              </div>
              <button className="sv-btn sv-btn-primary" type="button" onClick={() => openLightbox(0)}>
                View photos
              </button>
            </div>
            <div className="sv-shots">
              {gallery.map((photo, index) => (
                <button
                  key={photo.src}
                  className="sv-shot"
                  type="button"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={photo.alt}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            <p className="sv-photo-note">These frames are from the restaurant’s own photograph of the dining room.</p>
          </div>
        </section>

        <section className="sv-section sv-visit" id="visit" aria-labelledby="visit-title">
          <div className="sv-wrap sv-visit-grid">
            <article className="sv-promo">
              <img
                className="sv-promo-bg"
                src="/images/decor/banana-leaves.jpg"
                width={1400}
                height={933}
                alt=""
                loading="lazy"
              />
              <div className="sv-promo-scrim" />
              <div className="sv-promo-copy">
                <p className="sv-kicker">Visit us today</p>
                <h2 id="visit-title">Experience South Indian food in Nagpur</h2>
                <p>A table at Medical Chowk, in a bright and simple dining room.</p>
              </div>
              <div className="sv-promo-actions">
                <button className="sv-btn sv-btn-primary" type="button" onClick={openReserve}>
                  <CalendarDays aria-hidden="true" />
                  Reserve a Table
                </button>
                <button className="sv-btn sv-btn-ghost" type="button" onClick={onOrder}>
                  <Bike aria-hidden="true" />
                  Order Online
                </button>
              </div>
            </article>

            <article className="sv-card" aria-labelledby="location-title">
              <p className="sv-eyebrow">
                <Leaf className="sv-leaf" aria-hidden="true" /> Our Location
              </p>
              <h2 id="location-title">{site.cityLine}</h2>
              <p className="sv-address">{site.address}</p>
              <div className="sv-map">
                <a
                  className="sv-map-placeholder"
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin aria-hidden="true" />
                  <strong>Suvvai Restaurant</strong>
                  <span>Medical Chowk, Nagpur</span>
                  <span className="sv-map-open">Open in Google Maps</span>
                </a>
              </div>
            </article>

            <article className="sv-card" id="contact" aria-labelledby="contact-title">
              <p className="sv-eyebrow">Get in Touch</p>
              <h2 id="contact-title">Contact</h2>
              <ul className="sv-contact-list">
                <li>
                  {callHref ? (
                    <a className="sv-contact-row" href={callHref}>
                      <span className="sv-contact-icon">
                        <Phone aria-hidden="true" />
                      </span>
                      <span>
                        <strong>Call us</strong>
                        <span>Tap to call</span>
                      </span>
                    </a>
                  ) : (
                    <button className="sv-contact-row" type="button" onClick={onCall}>
                      <span className="sv-contact-icon">
                        <Phone aria-hidden="true" />
                      </span>
                      <span>
                        <strong>Call us</strong>
                        <span>Number not published yet</span>
                      </span>
                    </button>
                  )}
                </li>
                <li>
                  {chatHref ? (
                    <a className="sv-contact-row" href={chatHref} target="_blank" rel="noopener noreferrer">
                      <span className="sv-contact-icon">
                        <WhatsAppIcon />
                      </span>
                      <span>
                        <strong>WhatsApp</strong>
                        <span>Chat with us</span>
                      </span>
                    </a>
                  ) : (
                    <button className="sv-contact-row" type="button" onClick={onWhatsApp}>
                      <span className="sv-contact-icon">
                        <WhatsAppIcon />
                      </span>
                      <span>
                        <strong>WhatsApp</strong>
                        <span>Number not published yet</span>
                      </span>
                    </button>
                  )}
                </li>
                <li>
                  <a className="sv-contact-row" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <span className="sv-contact-icon">
                      <MapPin aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Address</strong>
                      <span>{site.cityLine}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <div className="sv-contact-row">
                    <span className="sv-contact-icon">
                      <Clock aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Timings</strong>
                      <span>{contact.hours || "Not published yet"}</span>
                    </span>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <footer className="sv-footer">
        <div className="sv-wrap">
          <div className="sv-footer-row">
            <a className="sv-brand" href="#top">
              <span className="sv-brand-name">Suvvai</span>
              <span className="sv-brand-sub">South Indian Kitchen</span>
            </a>
            <nav aria-label="Footer">
              <ul>
                {NAV.map((item) => (
                  <li key={item.id}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="sv-legal">© {year} Suvvai · Medical Chowk, Nagpur</p>
        </div>
      </footer>

      <button
        className="sv-top"
        type="button"
        hidden={!showTop}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp aria-hidden="true" />
      </button>

      <nav className="sv-dock" aria-label="Quick mobile actions">
        <a href="#menu">
          <Utensils aria-hidden="true" />
          Menu
        </a>
        <button type="button" onClick={openReserve}>
          <CalendarDays aria-hidden="true" />
          Enquire
        </button>
        <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin aria-hidden="true" />
          Directions
        </a>
        <a href="#contact">
          <Phone aria-hidden="true" />
          Contact
        </a>
      </nav>

      <dialog className="sv-dialog" ref={reserveRef} aria-labelledby={`${formId}-title`}>
        <button className="sv-close" type="button" onClick={() => reserveRef.current?.close()}>
          <X aria-hidden="true" />
          <span className="sv-sr">Close</span>
        </button>
        <h2 id={`${formId}-title`}>Table enquiry</h2>
        <p>
          Tell us when you’d like to come. This stays on your device
          {whatsapp ? " until you send it on WhatsApp" : ""}. It is not a confirmed booking
          {phone || whatsapp ? "" : ", and it is not sent anywhere, because no number is published yet"}.
        </p>
        <form className="sv-form" onSubmit={onEnquiry}>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Party size
            <select name="party" defaultValue="2" required>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preferred day
            <input name="day" type="date" />
          </label>
          <label>
            Note
            <textarea name="note" placeholder="Time of day, or anything the restaurant should know" />
          </label>
          {formError ? (
            <p className="sv-form-error" role="alert">
              {formError}
            </p>
          ) : null}
          {formStatus ? <p className="sv-form-status">{formStatus}</p> : null}
          {draft ? <pre className="sv-draft">{draft}</pre> : null}
          <div className="sv-form-actions">
            <button className="sv-btn sv-btn-primary" type="submit">
              {whatsapp ? "Send on WhatsApp" : "Save enquiry"}
            </button>
            {draft ? (
              <button className="sv-btn sv-btn-light" type="button" onClick={copyDraft}>
                Copy message
              </button>
            ) : null}
          </div>
        </form>
      </dialog>

      <dialog className="sv-dialog" ref={noticeRef} aria-labelledby={`${formId}-notice`}>
        <button className="sv-close" type="button" onClick={() => noticeRef.current?.close()}>
          <X aria-hidden="true" />
          <span className="sv-sr">Close</span>
        </button>
        <h2 id={`${formId}-notice`}>{notice ? NOTICES[notice].title : "Not available yet"}</h2>
        <p>{notice ? NOTICES[notice].body : ""}</p>
        <div className="sv-dialog-actions">
          <a className="sv-btn sv-btn-primary" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
            Get Directions
          </a>
          <button
            className="sv-btn sv-btn-light"
            type="button"
            onClick={() => {
              noticeRef.current?.close();
              queueMicrotask(() => {
                const dialog = reserveRef.current;
                if (dialog && !dialog.open) dialog.showModal();
              });
            }}
          >
            Write an enquiry
          </button>
        </div>
      </dialog>

      <dialog
        className="sv-lightbox"
        ref={lightRef}
        aria-label="Dining room photograph"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <figure className="sv-lightbox-figure">
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
          <figcaption>{shot.alt}</figcaption>
        </figure>
        <div className="sv-lightbox-bar">
          <button
            type="button"
            onClick={() => setLightIndex((index) => (index - 1 + gallery.length) % gallery.length)}
          >
            Previous
          </button>
          <span>
            {lightIndex + 1} / {gallery.length}
          </span>
          <button type="button" onClick={() => setLightIndex((index) => (index + 1) % gallery.length)}>
            Next
          </button>
          <button type="button" onClick={() => lightRef.current?.close()}>
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
