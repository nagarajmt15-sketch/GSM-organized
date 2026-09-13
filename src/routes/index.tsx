import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Wind,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImage from "@/assets/gsm-hero.jpg";
import loseWeightImage from "@/assets/gsm-lose-weight.jpg";
import gainWeightImage from "@/assets/gsm-gain-weight.jpg";
import stayWellImage from "@/assets/gsm-stay-well.jpg";
import nutritionImage from "@/assets/gsm-nutrition.jpg";
import journeyImage from "@/assets/gsm-journey.jpg";
import guidanceImage from "@/assets/gsm-guidance.jpg";
import wellnessImage from "@/assets/gsm-wellness.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSM Nutrition Centre | Wellness in Sangagiri" },
      { name: "description", content: "Personalized nutrition guidance and wellness support for healthier everyday habits in Sangagiri, Tamil Nadu." },
      { property: "og:title", content: "GSM Nutrition Centre | Wellness in Sangagiri" },
      { property: "og:description", content: "Nutrition guidance and personal wellness support for healthier everyday habits." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

const navItems = [
  ["Home", "home"], ["Goals", "goals"], ["Nutrition", "nutrition"],
  ["Products", "products"], ["Guidance", "guidance"], ["Reviews", "reviews"], ["Contact", "contact"],
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ButtonLink({ children, target, secondary = false }: { children: ReactNode; target: string; secondary?: boolean }) {
  return (
    <button className={secondary ? "button-secondary group" : "button-primary group"} onClick={() => scrollTo(target)}>
      <span>{children}</span><ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

function EditorialImage({ src, alt, className = "", eager = false, reveal = false, delay = 0 }: { src: string; alt: string; className?: string; eager?: boolean; reveal?: boolean; delay?: number }) {
  // Note: many editorial images already carry their own decorative `transform: rotate(...)`.
  // The reveal animation here only fades opacity (never touches `transform`), so it can't
  // clobber that permanent tilt once the element becomes visible.
  const revealRef = useReveal<HTMLDivElement>();
  return (
    <div
      ref={reveal ? revealRef : undefined}
      className={`editorial-image ${className} ${reveal ? "reveal-fade" : ""}`}
      style={reveal && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <img src={src} alt={alt} width={1200} height={1400} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} />
    </div>
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) node.classList.add("is-visible");
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let done = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || done) return;
      done = true;
      const duration = 1200;
      const start = performance.now();
      const isFloat = !Number.isInteger(value);
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = value * eased;
        setDisplay(isFloat ? current.toFixed(1) : Math.round(current).toString());
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`section-label ${light ? "section-label-light" : ""}`}><span />{children}</p>;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler(); window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className={`navbar ${scrolled || open ? "navbar-solid" : ""}`}>
      <button className="brand" onClick={() => scrollTo("home")} aria-label="Go to home">
        <span className="brand-mark"><Leaf size={19} /></span>
        <span>GSM <b>Nutrition Centre</b></span>
      </button>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
      </nav>
      <div className="nav-cta"><ButtonLink target="contact">Start Your Journey</ButtonLink></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(([label, id], index) => <button key={id} onClick={() => { scrollTo(id); setOpen(false); }}><span>0{index + 1}</span>{label}<ArrowRight size={18} /></button>)}
        <ButtonLink target="contact">Start Your Journey</ButtonLink>
      </nav>}
    </header>
  );
}

function Hero() {
  return <section id="home" className="hero">
    <div className="hero-collage" aria-hidden="true"><EditorialImage src={heroImage} alt="" className="hero-image" eager /><EditorialImage src={nutritionImage} alt="" className="hero-inset" /><span className="botanical botanical-one" /><span className="botanical botanical-two" /></div>
    <div className="hero-content">
      <p className="hero-eyebrow"><span />GSM NUTRITION CENTRE · SANGAGIRI</p>
      <h1>Your Health.<br />Your <em>Transformation.</em></h1>
      <div className="hero-bottom">
        <p>Personalized nutrition guidance and wellness support to help you build healthier habits and move toward your goals.</p>
        <div className="hero-actions"><ButtonLink target="contact">Start Your Journey</ButtonLink><ButtonLink target="goals" secondary>Explore Your Goals</ButtonLink></div>
      </div>
    </div>
    <p className="scribble hero-note">nourish your everyday <span>↝</span></p>
    <button className="scroll-cue" onClick={() => scrollTo("goals")}><span>Scroll to explore</span><ArrowDown size={17} /></button>
  </section>;
}

const goals = [
  { n: "01", title: "LOSE WEIGHT", text: "Work toward healthy weight management with better nutrition and consistent habits.", image: loseWeightImage },
  { n: "02", title: "GAIN WEIGHT", text: "Build healthier routines that support your goal of gaining weight with proper nutrition.", image: gainWeightImage },
  { n: "03", title: "STAY WELL", text: "Create sustainable everyday habits that support a healthier lifestyle.", image: stayWellImage },
];

function GoalPanel({ goal, index }: { goal: (typeof goals)[number]; index: number }) {
  // goal-panel-2/3 already carry their own `transform: rotate(...) translateY(...)` for the
  // asymmetric layout, so this uses the opacity-only reveal-fade instead of the translateY
  // reveal, keeping that tilt intact once the card becomes visible.
  const ref = useReveal<HTMLElement>();
  return (
    <article ref={ref} className={`goal-panel goal-panel-${index + 1} reveal-fade`} style={{ transitionDelay: `${index * 130}ms` }}>
      <EditorialImage src={goal.image} alt={`${goal.title.toLowerCase()} wellness direction`} />
      <div className="goal-overlay" />
      <span className="goal-number">{goal.n}</span>
      <div className="goal-copy"><h3>{goal.title}</h3><p>{goal.text}</p></div>
      <span className="goal-arrow"><ArrowRight /></span>
    </article>
  );
}

function GoalsSection() {
  return <section id="goals" className="goals-section">
    <Reveal className="journey-statement"><p>Every journey starts</p><p>with a <em>goal.</em></p></Reveal>
    <Reveal className="section-heading">
      <div><SectionLabel>YOUR DIRECTION</SectionLabel><h2>What are you<br />working toward?</h2></div>
      <p>Different goals need different approaches. Find the direction that feels right for you.</p>
    </Reveal>
    <div className="goals-composition">
      {goals.map((goal, index) => <GoalPanel goal={goal} index={index} key={goal.n} />)}
    </div>
  </section>;
}

function NutritionCopy() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="nutrition-copy reveal" style={{ transitionDelay: "200ms" }}>
      <p>It&apos;s about understanding your goals, building better habits and finding a routine you can actually stay consistent with.</p>
      <ButtonLink target="guidance">Discover the approach</ButtonLink>
    </div>
  );
}

function NutritionSection() {
  return <section id="nutrition" className="nutrition-section">
    <div className="nutrition-swell" />
    <Reveal className="nutrition-title"><SectionLabel>THE BIGGER PICTURE</SectionLabel><h2>Nutrition is more<br />than a <em>meal.</em></h2></Reveal>
    <div className="nutrition-composition">
       <EditorialImage src={nutritionImage} alt="Fresh balanced ingredients and a green smoothie" className="nutrition-image" reveal delay={80} />
      <NutritionCopy />
      <div className="word-orbit"><span>UNDERSTAND</span><span>GUIDE</span><span>BUILD</span><span>GROW</span></div>
       <span className="ingredient ingredient-one" /><span className="ingredient ingredient-two" /><p className="scribble nutrition-note">small choices,<br />beautiful rhythm ↗</p>
    </div>
  </section>;
}

const products = [
  { name: "GSM Whey Protein", text: "Muscle recovery and everyday protein top-up.", price: "1,899", icon: Dumbbell },
  { name: "Herbal Detox Tea", text: "A gentle daily blend to ease digestion.", price: "449", icon: Leaf },
  { name: "Daily Multivitamin", text: "Everyday essentials for consistent energy.", price: "699", icon: Sun },
  { name: "Omega-3 Fish Oil", text: "Heart and joint support, in soft capsules.", price: "899", icon: Heart },
  { name: "Meal Replacement Shake", text: "A balanced shake for busy, on-the-go days.", price: "1,299", icon: Flame },
  { name: "Digestive Enzyme Blend", text: "Supports gut comfort after every meal.", price: "599", icon: Wind },
  { name: "Weight Gainer Mix", text: "Calorie-dense nutrition for healthy gain.", price: "1,999", icon: Sprout },
  { name: "Green Superfood Blend", text: "Greens, in one simple daily scoop.", price: "1,149", icon: Sparkles },
  { name: "Daily Fibre Booster", text: "Everyday fibre for a happier gut.", price: "499", icon: ShieldCheck },
  { name: "Immunity Gummies", text: "A tastier way to stay on track daily.", price: "749", icon: Leaf },
] as const;

function ProductCard({ product, index }: { product: (typeof products)[number]; index: number }) {
  const ref = useReveal<HTMLElement>();
  const Icon = product.icon;
  return (
    <article ref={ref} className="product-card reveal-fade" style={{ transitionDelay: `${(index % 5) * 90}ms` }}>
      <div className={`product-visual product-tone-${index % 4}`}>
        <span className="product-blob" aria-hidden="true" />
        <Icon className="product-icon" strokeWidth={1.4} />
        <span className="product-price">₹{product.price}</span>
      </div>
      <div className="product-copy">
        <span className="product-index">0{index + 1}</span>
        <h3>{product.name}</h3>
        <p>{product.text}</p>
      </div>
    </article>
  );
}

function ProductsSection() {
  return <section id="products" className="products-section">
    <Reveal className="products-heading">
      <SectionLabel>OUR OWN RANGE</SectionLabel>
      <h2>Products, made<br />the <em>GSM</em> way.</h2>
      <p>Formulated in-house and recommended as part of your plan. Visit the centre to see the full range and current stock.</p>
    </Reveal>
    <div className="product-shelf">
      {products.map((product, index) => <ProductCard product={product} index={index} key={product.name} />)}
    </div>
    <p className="scribble products-note">fresh batches, always ↝</p>
  </section>;
}

const steps = [
  ["01", "UNDERSTAND", "Start by understanding your goals and current routine."],
  ["02", "PLAN", "Build a practical nutrition approach around your needs."],
  ["03", "GUIDE", "Get ongoing guidance and support as you build consistency."],
  ["04", "GROW", "Develop healthier habits that can become part of everyday life."],
];

function JourneyTimeline() {
  const [active, setActive] = useState(0);
  return <section className="timeline-section">
    <div className="timeline-heading">
      <Reveal><SectionLabel light>YOUR JOURNEY</SectionLabel><h2>Your journey,<br />one step at a time.</h2><p>Thoughtful guidance, paced around you.</p></Reveal>
      <EditorialImage src={journeyImage} alt="Planning a thoughtful everyday wellness routine" className="journey-visual" reveal />
    </div>
    <div className="timeline-stage">
      <div className="timeline-connector" aria-hidden="true" />
      {steps.map(([n, title, text], index) => <button key={n} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} className={`timeline-step ${active === index ? "active" : ""}`}>
        <span className="step-dot">{n}</span><span className="step-copy"><b>{title}</b><small>{text}</small></span>
      </button>)}
    </div>
  </section>;
}

function GuidancePoint({ n, t, d, index }: { n: string; t: string; d: string; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${index * 130}ms` }}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>;
}

function GuidanceSection() {
  return <section id="guidance" className="guidance-section">
    <div className="guidance-image-wrap"><EditorialImage src={guidanceImage} alt="A warm personal nutrition guidance conversation" className="guidance-image" reveal /><span className="guidance-note"><Leaf /> Human support.<br />Healthier direction.</span><p className="scribble guidance-scribble">you are not doing<br />this alone</p></div>
    <Reveal className="guidance-copy"><SectionLabel>PERSONAL SUPPORT</SectionLabel><h2>Guidance that goes<br /><em>beyond the plate.</em></h2><h3>Because knowing what to do is only part of the journey.</h3><p>With the right guidance, better nutrition can become a more consistent part of your everyday routine.</p></Reveal>
    <div className="guidance-points">
      {[["01", "PERSONAL GUIDANCE", "Support built around individual goals."], ["02", "CONSISTENCY", "Small habits that are easier to maintain."], ["03", "WELLNESS", "A broader approach to feeling healthier every day."]].map(([n,t,d], index) => <GuidancePoint key={n} n={n} t={t} d={d} index={index} />)}
    </div>
  </section>;
}

function SolutionItem({ title, text, tone, index }: { title: string; text: string; tone: string; index: number }) {
  const ref = useReveal<HTMLElement>();
  return (
    <article ref={ref} className="solution-item reveal" style={{ transitionDelay: `${index * 110}ms` }}>
       <span className="solution-index">0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div><EditorialImage src={tone} alt={`${title} wellness support`} /><ArrowRight className="solution-arrow" />
    </article>
  );
}

function SolutionsSection() {
  const solutions = [["Nutrition", "Everyday nutrition support designed around your goals.", nutritionImage], ["Weight Management", "Guidance focused on healthier habits and sustainable routines.", loseWeightImage], ["Wellness", "Simple approaches to building a healthier lifestyle.", stayWellImage]] as const;
  return <section className="solutions-section">
    <Reveal className="solutions-heading"><SectionLabel>EXPLORE YOUR FIT</SectionLabel><h2>Find what fits<br />your journey.</h2><p>No two routines look the same. Explore a direction shaped around your everyday life.</p></Reveal>
    <div className="solution-list">{solutions.map(([title,text,tone], i) => <SolutionItem key={title} title={title} text={text} tone={tone} index={i} />)}</div>
  </section>;
}

const GOOGLE_PLACE_URL = "https://www.google.com/maps/search/?api=1&query=GSM+Nutrition+Centre+Sangagiri+Tamil+Nadu";

// Genuine placeholders only: we never invent quotes and attribute them to real customers.
// Instead these cards point people to the real, verifiable Google listing.
const reviewCards = [
  { kind: "rating" as const, title: "4.8 out of 5", text: "Our current average rating on Google, based on 20+ verified reviews from real visitors." },
  { kind: "link" as const, title: "Read the reviews", text: "See what people are saying on our official Google Business listing, unedited.", href: GOOGLE_PLACE_URL, cta: "View on Google" },
  { kind: "link" as const, title: "Been to GSM?", text: "Share your own experience — it helps other people in Sangagiri find us.", href: GOOGLE_PLACE_URL, cta: "Write a review" },
];

function ReviewsSection() {
  const [slide, setSlide] = useState(0);
  return <section id="reviews" className="reviews-section">
    <Reveal className="reviews-intro"><SectionLabel light>GOOGLE REVIEWS</SectionLabel><h2>Words from the<br />community.</h2><div className="rating"><strong><CountUp value={4.8} /></strong><span>★★★★★<small>Google Rating</small></span><strong><CountUp value={20} suffix="+" /></strong><span><small>Reviews</small></span></div></Reveal>
    <div className="review-window"><div className="review-track" style={{ transform: `translateX(-${slide * 34}%)` }}>
      {reviewCards.map((card, i) => <article className="review-card" key={card.title}>
        <Quote />
        <p>{card.text}</p>
        <div><span className="review-avatar">G</span><span><b>{card.title}</b>{card.kind === "link" ? <a className="review-link" href={card.href} target="_blank" rel="noreferrer">{card.cta} <ArrowRight size={13} /></a> : <small>Google Business Profile</small>}</span></div>
        <em>0{i+1}</em>
      </article>)}
    </div></div>
    <div className="review-controls"><button aria-label="Previous review" onClick={() => setSlide(Math.max(0, slide-1))}><ChevronLeft /></button><span>{slide+1} / 3</span><button aria-label="Next review" onClick={() => setSlide(Math.min(2, slide+1))}><ChevronRight /></button></div>
  </section>;
}

function LiveMap() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="map-placeholder reveal-fade">
      <iframe
        className="map-embed"
        title="GSM Nutrition Centre location map"
        src="https://www.google.com/maps?q=HDFC+Bank+KKC+Complex+Near+Sankagiri+Tiruchengode+Road+Sangagiri+Tamil+Nadu+637301&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a className="map-badge" href={GOOGLE_PLACE_URL} target="_blank" rel="noreferrer"><MapPin size={15} /><span>GSM Nutrition Centre</span></a>
    </div>
  );
}

function ContactAndFooter() {
  return <>
    <section className="final-cta">
       <EditorialImage src={wellnessImage} alt="A joyful everyday approach to fresh nutrition" className="cta-image" reveal />
      <div className="cta-overlay" /><Reveal className="cta-content"><SectionLabel light>A HEALTHIER DIRECTION</SectionLabel><h2>Ready to start<br />your <em>journey?</em></h2><p>Take the first step toward better nutrition and healthier everyday habits.</p><div><ButtonLink target="contact">Start Your Journey</ButtonLink><ButtonLink target="contact" secondary>Get Directions</ButtonLink></div></Reveal>
    </section>
    <section id="contact" className="contact-section">
      <Reveal className="contact-brand"><span className="brand-mark"><Leaf /></span><h2>GSM Nutrition Centre</h2><p>Nutrition · Wellness · Better Habits</p></Reveal>
      <Reveal className="contact-details" delay={100}><SectionLabel light>VISIT US</SectionLabel><address>HDFC Bank, KKC Complex,<br />Near Sankagiri - Tiruchengode Road,<br />Sangagiri, Tamil Nadu 637301</address><a href="tel:+917339685550"><Phone size={17} />073396 85550</a><div><a className="contact-action" href="tel:+917339685550">Call Now <ArrowRight size={17} /></a><a className="contact-action" href={GOOGLE_PLACE_URL} target="_blank" rel="noreferrer">Get Directions <MapPin size={17} /></a></div></Reveal>
      <LiveMap />
    </section>
    <footer><button className="footer-logo" onClick={() => scrollTo("home")}>GSM <span>Nutrition Centre</span></button><nav>{navItems.map(([label,id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav><p>073396 85550 · Sangagiri, Tamil Nadu</p><small>© 2026 GSM Nutrition Centre</small></footer>
  </>;
}

function HomePage() {
  return <div className="site-shell"><Navbar /><main><Hero /><GoalsSection /><NutritionSection /><ProductsSection /><JourneyTimeline /><GuidanceSection /><SolutionsSection /><ReviewsSection /><ContactAndFooter /></main></div>;
}