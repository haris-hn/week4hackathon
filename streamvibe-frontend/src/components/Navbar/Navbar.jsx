import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiBell, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
  e.stopPropagation();
  setDropdownOpen(false);
  logout();
  navigate("/");
};

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#2a2a2a] relative"
      style={{ background: "transparent" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "240px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.42) 90%, transparent 100%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="StreamVibe"
            className="w-9 h-9 object-contain"
          />
          <span className="text-white font-bold text-xl">StreamVibe</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-[Black] border border-[#2a2a2a] rounded-lg p-1.5 font-manrope">
          {[
            { path: "/", label: "Home" },
            { path: "/movies", label: "Movies & Shows" },
            { path: "/support", label: "Support" },
            { path: "/subscription", label: "Subscriptions" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-md text-sm transition-all ${
                isActive(path)
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#999] hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center text-white transition">
            <FiSearch size={24} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-white transition">
            <FiBell size={24} />
          </button>

          {isLoggedIn && (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[#e50914] border border-[#e50914] px-3 py-1 rounded text-xs font-bold hover:bg-[#e50914] hover:text-white transition"
                >
                  Admin
                </Link>
              )}

              {/* Name Pill with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-[#e50914] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#c40812] transition"
                >
                  {user?.name?.split(" ")[0]}
                </button>

{dropdownOpen && (
  <>
    <div
      className="fixed inset-0 z-40"
      onClick={(e) => {
        e.stopPropagation();
        setDropdownOpen(false);
      }}
    />
    <div className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden z-50">
      <button
        onMouseDown={(e) => {   
          e.stopPropagation();
          setDropdownOpen(false);
          logout();
          navigate("/");
        }}
        className="w-full text-left px-4 py-2.5 text-sm text-[#999] hover:bg-[#222] hover:text-[#e50914] transition"
      >
        Logout
      </button>
    </div>
  </>
)}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-4 flex flex-col gap-3">
          {[
            { path: "/", label: "Home" },
            { path: "/movies", label: "Movies & Shows" },
            { path: "/subscription", label: "Subscriptions" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="text-white py-2 px-3 rounded-lg hover:bg-[#212121] transition"
            >
              {label}
            </Link>
          ))}

          {isLoggedIn && (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#e50914] py-2 px-3"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left text-[#999] py-2 px-3 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;