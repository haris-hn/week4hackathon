import { useNavigate } from 'react-router-dom';
import { FiPlay, FiClock } from 'react-icons/fi';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie._id}`)}
      className="relative group cursor-pointer rounded-xl overflow-hidden flex-shrink-0
                 w-full sm:w-[160px] md:w-[200px] lg:w-[220px]"
    >
      {/* Thumbnail */}
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className="w-full h-[200px] sm:h-[220px] md:h-[260px] lg:h-[280px] object-cover transition-transform group-hover:scale-105 duration-300"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
        <div className="w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center shadow-lg shadow-red-900/40">
          <FiPlay fill="white" className="text-white ml-1" size={18} />
        </div>
      </div>

      {/* Bottom Info Gradient */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
        <p className="text-white text-xs font-semibold truncate leading-tight">{movie.title}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <FiClock className="text-[#888] shrink-0" size={11} />
          <span className="text-[#888] text-[11px]">{movie.duration}</span>
          {movie.ratings?.streamvibe > 0 && (
            <span className="text-[#888] text-[11px] ml-auto">
              ⭐ {movie.ratings.streamvibe}
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      {movie.isTrending && (
        <div className="absolute top-2 left-2 bg-[#e50914] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shadow">
          Trending
        </div>
      )}
      {movie.isNewRelease && !movie.isTrending && (
        <div className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shadow">
          New
        </div>
      )}
    </div>
  );
};

export default MovieCard;