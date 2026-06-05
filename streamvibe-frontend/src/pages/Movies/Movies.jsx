// src/pages/Movies/Movies.jsx
import { useState, useEffect, useRef } from 'react';
import { Link} from 'react-router-dom';
import { FiPlay, FiChevronLeft, FiChevronRight, FiPlus, FiThumbsUp } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import MovieRow from '../../components/MovieRow/MovieRow';
import Footer from '../../components/Footer/Footer';
import { getTrending, getNewReleases, getMustWatch, getGenres } from '../../utils/api';

const MY_POSTERS = [
  "/assets/slider1.jpg", "/assets/slider2.jpg", "/assets/slider3.jpg",
  "/assets/slider4.jpg", "/assets/slider1.jpg", "/assets/slider2.jpg",
  "/assets/slider3.jpg", "/assets/slider4.jpg",
];

// ✅ Cloudinary: Hero slider ke liye Full HD (1920px, best quality)
const getHDThumbnail = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/q_auto:best,f_auto,w_1920,c_fill/');
};

const Movies = () => {
  

  const [activeTab, setActiveTab] = useState('movies');
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [mustWatch, setMustWatch] = useState([]);
  
  const [movieGenres, setMovieGenres] = useState([]);
  const [showGenres, setShowGenres] = useState([]);
  const genreScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendRes, newRes, mustRes, genreRes] = await Promise.all([
          getTrending(),
          getNewReleases(),
          getMustWatch(),
           getGenres(), 

        ]);

        setTrending(trendRes.data);
        setNewReleases(newRes.data);
        setMustWatch(mustRes.data);
       setMovieGenres(genreRes.data);
      setShowGenres(genreRes.data);

        if (trendRes.data.length > 0)
           setFeaturedMovies(trendRes.data);

        
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Auto-play hero slider
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % featuredMovies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  const scrollGenres = (direction) => {
    if (genreScrollRef.current) {
      const { scrollLeft, clientWidth } = genreScrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      genreScrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const trendingFiltered = trending.filter(m => activeTab === 'movies' ? m.contentType === 'movie' : m.contentType === 'show');
  const newFiltered = newReleases.filter(m => activeTab === 'movies' ? m.contentType === 'movie' : m.contentType === 'show');
  const mustFiltered = mustWatch.filter(m => activeTab === 'movies' ? m.contentType === 'movie' : m.contentType === 'show');
  const currentGenres = activeTab === 'movies' ? movieGenres : showGenres;
  const featuredMovie = featuredMovies[currentHeroIdx];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      {/* ===== HERO SLIDER ===== */}
      {featuredMovie && (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[#0f0f0f]">

          {/* ✅ FIX 1: <img> hataya, background-image use kiya + Cloudinary HD URL */}
          <div
            key={featuredMovie._id || currentHeroIdx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${getHDThumbnail(featuredMovie.thumbnail)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Dark overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 left-0 right-0 text-center px-4">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {featuredMovie.title}
            </h1>
            <p className="text-[#bfbfbf] text-sm md:text-lg max-w-3xl mx-auto mb-10 line-clamp-2 md:line-clamp-none">
              {featuredMovie.description}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 bg-[#e50914] text-white px-10 py-3.5 rounded-lg font-bold hover:bg-[#c40812] transition-all transform hover:scale-105 shadow-xl shadow-black/40">
                <FiPlay fill="white" size={18} />
                Play Now
              </button>
              <button className="p-3 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] transition">
                <FiPlus size={20} />
              </button>
              <button className="p-3 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] transition">
                <FiThumbsUp size={20} />
              </button>
            </div>
          </div>

          {/* Slider Dots */}
          {featuredMovies.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredMovies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentHeroIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentHeroIdx ? 'w-6 bg-[#e50914]' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Tab Switcher */}
      <div className="px-6 md:px-16 -mt-8 relative z-20">
        <div className="flex gap-1 bg-[#0f0f0f] border border-[#262626] p-1.5 rounded-xl w-fit mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-8 py-3 rounded-lg text-sm font-semibold transition ${
              activeTab === 'movies' ? 'bg-[#1f1f1f] text-white shadow-lg' : 'text-[#999] hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            className={`px-8 py-3 rounded-lg text-sm font-semibold transition ${
              activeTab === 'shows' ? 'bg-[#1f1f1f] text-white shadow-lg' : 'text-[#999] hover:text-white'
            }`}
          >
            Shows
          </button>
        </div>
      </div>

      {/* Our Genres */}
      <section className="px-6 md:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Our Genres</h2>
          <div className="hidden md:flex items-center gap-2 bg-[#0f0f0f] border border-[#262626] p-1.5 rounded-xl">
            <button onClick={() => scrollGenres("left")} className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-[#e50914] transition">
              <FiChevronLeft size={16} />
            </button>
            <div className="flex gap-1 px-1">
              <div className="w-3 h-1 bg-[#e50914] rounded-full" />
              <div className="w-1 h-1 bg-[#333] rounded-full" />
            </div>
            <button onClick={() => scrollGenres("right")} className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-[#e50914] transition">
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={genreScrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentGenres.slice(0, 5).map((genre, i) => {
            const startIdx = (i * 4) % MY_POSTERS.length;
            const cardPosters = [0, 1, 2, 3].map((j) => MY_POSTERS[(startIdx + j) % MY_POSTERS.length]);

            return (
              <Link
                to={`/movies?genre=${genre}`}
                key={i}
                className="min-w-[200px] md:min-w-[240px] bg-[#1a1a1a] border border-[#262626] p-3 rounded-[16px] group hover:border-[#444] transition-all cursor-pointer"
              >
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {cardPosters.map((src, j) => (
                    <div key={j} className="h-[70px] md:h-[85px] rounded-md overflow-hidden bg-[#262626] relative">
                      {/* ✅ FIX 2: <img> hataya, background-image use kiya — choti cards mein sharp */}
                      <div
                        className="absolute inset-0 opacity-70 group-hover:opacity-100 transition duration-500"
                        style={{
                          backgroundImage: `url(${src})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      {j >= 2 && <div className="absolute inset-0 bg-black/40" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-white font-semibold text-sm group-hover:text-[#e50914] transition">{genre}</span>
                  <FiChevronRight className="text-[#999] group-hover:text-white group-hover:translate-x-1 transition" size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Top 10 In Genres */}
      <section className="px-6 md:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Popular Top 10 In Genres</h2>
          <div className="hidden md:flex items-center gap-2 bg-[#0f0f0f] border border-[#262626] p-1.5 rounded-xl">
            <button onClick={() => scrollGenres("left")} className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-[#e50914] transition">
              <FiChevronLeft size={16} />
            </button>
            <div className="flex gap-1 px-1">
              <div className="w-3 h-1 bg-[#e50914] rounded-full" />
              <div className="w-1 h-1 bg-[#333] rounded-full" />
            </div>
            <button onClick={() => scrollGenres("right")} className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-[#e50914] transition">
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentGenres.slice(0, 5).map((genre, i) => {
            const startIdx = (i * 4) % MY_POSTERS.length;
            const cardPosters = [0, 1, 2, 3].map((j) => MY_POSTERS[(startIdx + j) % MY_POSTERS.length]);

            return (
              <div
                key={i}
                className="min-w-[200px] md:min-w-[240px] bg-[#1a1a1a] border border-[#262626] p-3 rounded-[16px] group hover:border-[#444] transition-all cursor-pointer"
              >
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {cardPosters.map((src, j) => (
                    <div key={j} className="h-[70px] md:h-[85px] rounded-md overflow-hidden bg-[#262626] relative">
                      {/* ✅ FIX 3: same fix Top 10 cards mein bhi */}
                      <div
                        className="absolute inset-0 opacity-70 group-hover:opacity-100 transition duration-500"
                        style={{
                          backgroundImage: `url(${src})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-end justify-between px-1">
                  <div className="flex flex-col gap-1">
                    <span className="w-fit bg-[#e50914] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight shadow-md">
                      Top 10 In
                    </span>
                    <h3 className="text-white font-semibold text-sm group-hover:text-[#e50914] transition">{genre}</h3>
                  </div>
                  <FiChevronRight className="text-[#999] group-hover:text-white group-hover:translate-x-1 transition" size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Movie/Show Rows */}
      <div className="space-y-12 pb-16">
        {trendingFiltered.length > 0 && <MovieRow title="Trending Now" movies={trendingFiltered} />}
        {newFiltered.length > 0 && <MovieRow title="New Releases" movies={newFiltered} />}
        {mustFiltered.length > 0 && <MovieRow title="Must Watch" movies={mustFiltered} />}

</div>

      {/* CTA Section */}
      <section className="mx-6 md:mx-16 mb-20 rounded-[32px] overflow-hidden relative h-[350px] md:h-[300px] flex items-center border border-[#262626] shadow-2xl">
        {/* ✅ FIX 4: CTA background bhi background-image se */}
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-10 gap-1 opacity-25">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-full h-full"
              style={{
                backgroundImage: `url(${MY_POSTERS[i % MY_POSTERS.length]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
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

      <Footer />
    </div>
  );
};

export default Movies;