import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div
      className="relative w-full flex flex-col items-center justify-end"
      style={{ height: "calc(100vh - 65px)", overflow: "visible" }}
    >
      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "55%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.9) 50%, transparent 100%)",
        }}
      />

      {/* Center Logo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingBottom: "2%" }}
      >
        <img
          src="/assets/AbstractDesign.png"
          alt="Logo"
          style={{
            width: "clamp(200px, 25vw, 230px)",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Text Content - Neeche overflow hoga */}
      <div
        className="relative z-10 w-full text-center px-6 flex flex-col items-center gap-3 "
        style={{ transform: "translateY(120px)" }}
      >
        <h1
          className="font-bold text-white leading-tight"
          style={{ fontSize: "clamp(1.55rem, 3.8vw, 3.1rem)" }}
        >
          The Best Streaming Experience
        </h1>
        <p
          className="text-[#aaa] max-w-4xl"
          style={{
            fontSize: "clamp(0.78rem, 1.2vw, 0.95rem)",
            lineHeight: 1.7,
          }}
        >
          StreamVibe is the best streaming experience for watching your favorite
          movies and shows on demand, anytime, anywhere. With StreamVibe, you
          can enjoy a wide variety of content, including the latest blockbusters,
          classic movies, popular TV shows, and more. You can also create your
          own watchlists, so you can easily find the content you want to watch.
        </p>
        <button
onClick={() =>
  navigate(isLoggedIn ? "/movies" : "/login", {
    state: { from: "/movies" }
  })
}          className="flex items-center gap-2 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-red-700 active:scale-95"
          style={{
            background: "#e50914",
            padding: "12px 28px",
            fontSize: "clamp(0.85rem, 1.2vw, 0.97rem)",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "0.8em" }}>▶</span>
          Start Watching Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
