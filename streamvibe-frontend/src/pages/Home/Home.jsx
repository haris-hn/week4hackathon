import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import {
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiSearch,
  FiBell,
} from "react-icons/fi";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import MovieRow from "../../components/MovieRow/MovieRow";
import Footer from "../../components/Footer/Footer";
import {
  getAllMovies,
  getTrending,
  getNewReleases,
  getMustWatch,
} from "../../utils/api";
import smartphoneImg from "../../assets/Icon Container.png";
import tabletImg from "../../assets/Icon Container (1).png";
import smartTvImg from "../../assets/Icon Container (2).png";
import laptopImg from "../../assets/Icon Container (3).png";
import consoleImg from "../../assets/Icon Container (4).png";
import vrImg from "../../assets/Icon Container (5).png";

// ─────────────────────────────────────────
//  POSTER IMAGES
// ─────────────────────────────────────────
const MY_POSTERS = [
  "../../assets/attackontitan.jpg",
  "../../assets/avatar.jpg",
  "../../assets/attackontitan.jpg",
  "../../assets/breaking.jpg",
  "../../assets/CROWN.jpg",
  "../../assets/dangal.jpg",
  "../../assets/dark.jpg",
  "../../assets/john.jpg",
  "../../assets/kingdom.jpg",
  "../../assets/matrix.jpg",
  "../../assets/narcos.jpg",
  "../../assets/oldboy.jpg",
  "../../assets/parasite.jpg",
  "../../assets/spider.jpg",
  "../../assets/spirited.jpg",
  "../../assets/squid.jpg",
  "../../assets/traintobusan.jpg",
  "../../assets/vikingsss.jpg",
  "../../assets/wednesday.jpg",
  "../../assets/witcher.jpg",
  "../../assets/attackontitan.jpg",
  "../../assets/avatar.jpg",
  "../../assets/attackontitan.jpg",
  "../../assets/breaking.jpg",
  "../../assets/CROWN.jpg",
  "../../assets/dangal.jpg",
  "../../assets/dark.jpg",
  "../../assets/john.jpg",
  "../../assets/kingdom.jpg",
  "../../assets/matrix.jpg",
  "../../assets/narcos.jpg",
  "../../assets/oldboy.jpg",
  "../../assets/parasite.jpg",
  "../../assets/spider.jpg",
  "../../assets/spirited.jpg",
  "../../assets/squid.jpg",
];

// FAQ Data
const faqs = [
  { q: "What is StreamVibe?", a: "StreamVibe is a streaming service that allows you to watch movies and shows on demand." },
  { q: "How much does StreamVibe cost?", a: "StreamVibe offers three plans: Basic ($9.99), Standard ($12.99), and Premium ($14.99) per month." },
  { q: "What content is available on StreamVibe?", a: "StreamVibe offers a wide variety of movies, TV shows, documentaries, and more." },
  { q: "How can I watch StreamVibe?", a: "You can watch StreamVibe on smartphones, tablets, smart TVs, laptops, and gaming consoles." },
  { q: "How do I sign up for StreamVibe?", a: "Click the Start Free Trial button and follow the simple registration process." },
  { q: "What is the StreamVibe free trial?", a: "New users get a 7-day free trial with full access to all content." },
  { q: "How do I contact StreamVibe customer support?", a: "You can reach our support team via the Contact Us page or by emailing support@streamvibe.com." },
  { q: "What are the StreamVibe payment methods?", a: "We accept all major credit cards, PayPal, and various regional payment methods." },
];


const devices = [
  { name: "Smartphones", img: smartphoneImg, desc: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store." },
  { name: "Tablet", img: tabletImg, desc: "StreamVibe is optimized for both Android and iOS tablets. Download our app from the Google Play Store or the Apple App Store." },
  { name: "Smart TV", img: smartTvImg, desc: "StreamVibe is optimized for all major Smart TV platforms. Download our app from the Google Play Store or the Apple App Store." },
  { name: "Laptops", img: laptopImg, desc: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store." },
  { name: "Gaming Consoles", img: consoleImg, desc: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store." },
  { name: "VR Headsets", img: vrImg, desc: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store." },
];

// ─────────────────────────────────────────
//  NAV BUTTON — matches design exactly
// ─────────────────────────────────────────
const NavBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: "8px",
      color: "#fff",
      cursor: "pointer",
      transition: "border-color 0.2s",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
  >
    {children}
  </button>
);

// Dot separator between nav buttons (matches design)
const NavDots = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "4px", margin: "0 2px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: i === 1 ? "#e50914" : "#3a3a3a",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────
//  POSTER GRID
// ─────────────────────────────────────────
const PosterGrid = () => {
  const [cols, setCols] = useState(9);
  const ROWS = 4;

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 3 : 9);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalCells = cols * ROWS;
  const grid = [];
  while (grid.length < totalCells) grid.push(...MY_POSTERS);
  const cells = grid.slice(0, totalCells);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: "6px",
        padding: "6px",
        width: "100%",
        height: "100%",
      }}
    >
      {cells.map((src, i) => (
        <div key={i} style={{ overflow: "hidden", borderRadius: "8px", width: "100%", height: "100%" }}>
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading={i < cols ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────
//  HOME
// ─────────────────────────────────────────
const Home = () => {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [mustWatch, setMustWatch] = useState([]);
  const [genres, setGenres] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [planType, setPlanType] = useState("monthly");
  const genreScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendRes, newRes, mustRes, allRes] = await Promise.all([
          getTrending(),
          getNewReleases(),
          getMustWatch(),
          getAllMovies(),
        ]);
        setTrending(trendRes.data);
        setNewReleases(newRes.data);
        setMustWatch(mustRes.data);
        const allGenres = allRes.data.flatMap((m) => m.genre);
        setGenres([...new Set(allGenres)]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const scrollGenres = (dir) => {
    if (genreScrollRef.current) {
      genreScrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  const plans = [
    {
      name: "Basic Plan",
      desc: "Enjoy extensive library of movies and shows, featuring a range of content, including recently released titles.",
      monthly: "$9.99",
      yearly: "$99.99",
    },
    {
      name: "Standard Plan",
      desc: "Access to a wider selection of movies and shows, including most new releases and exclusive content.",
      monthly: "$12.99",
      yearly: "$129.99",
    },
    {
      name: "Premium Plan",
      desc: "Access to a widest selection of movies and shows, including all new releases and Offline Viewing.",
      monthly: "$14.99",
      yearly: "$149.99",
    },
  ];

  // Split FAQs into two columns for desktop
  const faqLeft = faqs.slice(0, 4);
  const faqRight = faqs.slice(4, 8);

  return (
    <div style={{ minHeight: "100vh", background: "#070707", fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════
          HERO — full viewport height
      ══════════════════════════════════════ */}
      <div style={{ position: "relative", width: "100%", height: "100vh", background: "#000" }}>

        {/* Poster Grid */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <PosterGrid />
        </div>

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(0,0,0,0.40)", pointerEvents: "none" }} />

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none",
            height: "42%",
            background: "linear-gradient(to top, #141414 0%, rgba(20,20,20,0.92) 40%, transparent 100%)",
          }}
        />

        {/* Navbar */}
        <div style={{ position: "relative", zIndex: 20 }}>
          <Navbar />
        </div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 20 }}>
          <HeroSection />
        </div>
      </div>

      {/* ══════════════════════════════════════
          CATEGORIES SECTION
      ══════════════════════════════════════ */}
        <section style={{ padding: "48px 64px", marginTop:"150px",  boxSizing: "border-box" }} className="section-pad">
        <style>{`
          @media (max-width: 768px) {
            .section-pad { padding: 32px 16px !important; }
            .section-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
            .devices-grid { grid-template-columns: 1fr !important; }
            .faq-grid { grid-template-columns: 1fr !important; }
            .plans-grid { grid-template-columns: 1fr !important; }
            .plans-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
            .cta-section { margin: 24px 16px !important; padding: 40px 24px !important; }
            .cta-section h2 { font-size: 24px !important; }
            .plan-card-price { font-size: 28px !important; }
            .plan-card-btns { flex-direction: column !important; }
            .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .footer-bottom { flex-direction: column !important; text-align: center !important; }
            .faq-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
            .section-title { font-size: 20px !important; }
            .hero-title { font-size: 22px !important; }
            .hero-sub { font-size: 12px !important; }
            .devices-header { flex-direction: column !important; }
          }
          @media (max-width: 640px) {
            .section-pad { padding: 24px 16px !important; }
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header row */}
        <div
          className="section-header"
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "12px" }}
        >
          <div>
            <h2 className="section-title" style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
              Explore our wide variety of categories
            </h2>
            <p style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
              Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new.
            </p>
          </div>
          {/* Nav arrows with dot separator — desktop style */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <NavBtn onClick={() => scrollGenres("left")}><FiChevronLeft size={14} /></NavBtn>
            <NavDots />
            <NavBtn onClick={() => scrollGenres("right")}><FiChevronRight size={14} /></NavBtn>
          </div>
        </div>

        {/* Genre cards — horizontal scroll, 2x2 poster grid inside each card */}
        <div
          ref={genreScrollRef}
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {(genres.length > 0 ? genres : ["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi"]).slice(0, 6).map((genre, i) => {
            // Pick 4 posters cycling through MY_POSTERS for each genre card
            const startIdx = (i * 4) % MY_POSTERS.length;
            const cardPosters = [0, 1, 2, 3].map((j) => MY_POSTERS[(startIdx + j) % MY_POSTERS.length]);

            return (
              <Link
                to={`/movies?genre=${genre}`}
                key={i}
                style={{
                  position: "relative",
                  background: "#1c1c1c",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  overflow: "hidden",
                  flexShrink: 0,
                  width: "220px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#555";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* 2x2 poster grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "3px", height: "180px" }}>
                  {cardPosters.map((src, j) => (
                    <div key={j} style={{ overflow: "hidden", position: "relative" }}>
                      <img
                        src={src}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      {/* Bottom row dimmed overlay */}
                      {j >= 2 && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom bar: genre name + arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "#1c1c1c",
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{genre}</span>
                  <span style={{
                    color: "#fff",
                    width: "28px", height: "28px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FiChevronRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          DEVICES SECTION
      ══════════════════════════════════════ */}
      <section style={{ padding: "48px 64px", borderTop: "1px solid #2a2a2a", boxSizing: "border-box" }} className="section-pad">
        <div className="devices-header" style={{ marginBottom: "32px" }}>
          <h2 className="section-title" style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
            We Provide you streaming experience across various devices.
          </h2>
          <p style={{ color: "#666", fontSize: "13px", marginTop: "8px", maxWidth: "860px" }}>
            With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.
          </p>
        </div>
        <div
          className="devices-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}
        >
          {devices.map((device, i) => (
            <div
              key={i}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e50914")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "40px", height: "40px",
                    background: "rgba(229,9,20,0.12)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "6px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={device.img}
                    alt={device.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "15px", margin: 0 }}>{device.name}</h3>
              </div>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{device.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════ */}
      <section style={{ padding: "48px 64px",  boxSizing: "border-box" }} className="section-pad">
        <div
          className="faq-header"
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", gap: "16px" }}
        >
          <div>
            <h2 className="section-title" style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
              Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.
            </p>
          </div>
          <button
            style={{
              background: "#e50914",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c40812")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e50914")}
          >
            Ask a Question
          </button>
        </div>

        {/* FAQ Two-column layout */}
        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqLeft.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            ))}
          </div>
          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqRight.map((faq, i) => (
              <FaqItem key={i + 4} faq={faq} index={i + 4} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUBSCRIPTION PLANS
      ══════════════════════════════════════ */}
      <section style={{ padding: "48px 64px", borderTop: "1px solid #2a2a2a", boxSizing: "border-box" }} className="section-pad">
        <div
          className="plans-header"
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", gap: "16px" }}
        >
          <div>
            <h2 className="section-title" style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
              Choose the plan that's right for you
            </h2>
            <p style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
              Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!
            </p>
          </div>
          {/* Monthly/Yearly toggle */}
          <div
            style={{
              display: "flex",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setPlanType(type)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                  background: planType === type ? "#535252" : "transparent",
                  color: planType === type ? "#fff" : "#888",
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "16px",
                padding: "24px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e50914")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "17px", margin: "0 0 8px 0" }}>{plan.name}</h3>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px" }}>{plan.desc}</p>
              <div style={{ marginBottom: "20px" }}>
                <span className="plan-card-price" style={{ color: "#fff", fontSize: "32px", fontWeight: 800 }}>
                  {planType === "monthly" ? plan.monthly : plan.yearly}
                </span>
                <span style={{ color: "#666", fontSize: "13px" }}>
                  /{planType === "monthly" ? "month" : "year"}
                </span>
              </div>
              <div className="plan-card-btns" style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
                >
                  Start Free Trial
                </button>
                <Link
                  to="/subscription"
                  style={{
                    flex: 1,
                    background: "#e50914",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textAlign: "center",
                    textDecoration: "none",
                    display: "block",
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c40812")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#e50914")}
                >
                  Choose Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


  
        {/* CTA SECTION */}
        <section className="mx-6 md:mx-16 mb-20 rounded-[32px] overflow-hidden relative h-[350px] md:h-[300px] flex items-center border border-[#262626] shadow-2xl">
          <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-10 gap-1 opacity-20">
             {[...Array(20)].map((_, i) => (
               <img key={i} src={MY_POSTERS[i % MY_POSTERS.length]} className="w-full h-full object-cover" alt="" />
             ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-[#e50914]/20" />
          <div className="relative z-10 w-full px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-4">Start your free trial today!</h2>
              <p className="text-[#999] text-sm md:text-base">
                Sign up for a free trial of StreamVibe and explore a world of entertainment.
              </p>
            </div>
            <Link to="/register" className="bg-[#e50914] hover:bg-[#ff1e2b] px-10 py-4 rounded-xl font-bold transition-all shadow-xl whitespace-nowrap">
              Start a Free Trial
            </Link>
          </div>
        </section>


      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background: "#0f0f0f", borderTop: "1px solid #2a2a2a", padding: "48px 64px 24px", boxSizing: "border-box" }} className="section-pad">
        <div
          className="footer-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "24px", marginBottom: "40px" }}
        >
          {[
            { title: "Home", links: ["Categories", "Devices", "Trending", "FAQ"] },
            { title: "Movies", links: ["Genres", "Trending", "New Release", "Popular"] },
            { title: "Shows", links: ["Genres", "Trending", "New Release", "Popular"] },
            { title: "Support", links: ["Contact Us"] },
            { title: "Subscription", links: ["Plans", "Features"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ color: "#fff", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>{col.title}</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{ color: "#777", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>Connect With Us</h4>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: <FaFacebookF size={14} />, name: "Facebook" },
                { icon: <FaTwitter size={14} />, name: "Twitter" },
                { icon: <FaLinkedinIn size={14} />, name: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  style={{
                    width: "36px", height: "36px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff",
                    textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e50914")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid #2a2a2a",
            paddingTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>©2023 streamvibe, All Rights Reserved</p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Terms of Use", "Privacy Policy", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: "#555", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────
//  FAQ ITEM COMPONENT
// ─────────────────────────────────────────
const FaqItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;
  return (
    <div className="relative py-4">

      {/* Question Row */}
      <button
        onClick={() => setOpenFaq(isOpen ? -1 : index)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left gap-4"
      >
        {/* Left side - Number + Question */}
        <div className="flex items-center gap-3">
          <span className="bg-[#1f1f1f] text-[#aaa] px-3 py-2 rounded-lg text-xs min-w-[42px] text-center font-medium flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-white text-sm font-medium">
            {faq.q}
          </span>
        </div>

        {/* Plus / Minus Icon */}
        <span className="text-white flex-shrink-0">
          {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
        </span>
      </button>

      {/* Answer */}
      {isOpen && (
        <div className="mt-3 pl-14">
          <p className="text-[#777] text-sm leading-relaxed">
            {faq.a}
          </p>
        </div>
      )}
<div
  className="absolute bottom-0 left-0 right-0 h-px"
  style={{
    background: "linear-gradient(to right, #0f0f0f 0%, #0f0f0f 5%, #e50914 45%, #e50914 55%, #0f0f0f 75%, #0f0f0f 100%)"
  }}
/>

    </div>
  );
};
export default Home;


















