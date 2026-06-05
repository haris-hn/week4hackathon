import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="px-6 md:px-16 py-8">
      {/* ── Header exactly like Top 10 ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        
        {/* Navigation Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-[#0f0f0f] border border-[#262626] p-1.5 rounded-xl">
          <button 
            onClick={() => scroll("left")} 
            className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#999] hover:text-[#e50914] transition"
          >
            <FiChevronLeft size={16} />
          </button>
          
          {/* Pagination Dots */}
          <div className="flex gap-1 px-1">
            <div className="w-3 h-1 bg-[#e50914] rounded-full" />
            <div className="w-1 h-1 bg-[#333] rounded-full" />
            <div className="w-1 h-1 bg-[#333] rounded-full" />
          </div>

          <button 
            onClick={() => scroll("right")} 
            className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#999] hover:text-[#e50914] transition"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Row Content with Responsive Cards ── */}
      <div 
        ref={rowRef}
        className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div 
            key={movie._id} 
            className="flex-shrink-0 
              w-[180px]           /* Mobile size */
              md:w-[220px]        /* Tablet size */
              lg:w-[calc(20%-16px)] /* Exact 5 cards per row on desktop */
            "
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieRow;