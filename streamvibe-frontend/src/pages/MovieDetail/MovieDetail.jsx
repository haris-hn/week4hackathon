// src/pages/MovieDetail/MovieDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FiPlay, FiPlus, FiThumbsUp,
  FiChevronLeft, FiChevronRight, FiX
} from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getMovieById, addReview } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MY_POSTERS = [
  "/assets/avatar.jpg", "/assets/breaking.jpg", "/assets/CROWN.jpg",
  "/assets/dangal.jpg", "/assets/dark.jpg", "/assets/john.jpg",
  "/assets/narcos.jpg", "/assets/squid.jpg",
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-sm ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-[#444]'}`}>★</span>
    ))}
  </div>
);

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use AuthContext for everything — no Zustand needed for subscription check
  const { isLoggedIn, user, isSubscribed } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', userLocation: 'Pakistan' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [castPage, setCastPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);

  // Auto-play after returning from subscription
  useEffect(() => {
    if (location.state?.autoPlay && location.state?.movieId === id) {
      setShowPlayer(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, id]);

  const fetchMovie = useCallback(async () => {
    try {
      const { data } = await getMovieById(id);
      setMovie(data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
    window.scrollTo(0, 0);
  }, [fetchMovie]);

  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';
  const canPlay = isAdminUser || isSubscribed;

  const handlePlayNow = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/movies/${id}` } });
      return;
    }
    if (canPlay) {
      setShowPlayer(true);
    } else {
      navigate('/subscription', { state: { movieId: id } });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login'); return; }
    setReviewLoading(true);
    setReviewMsg({ type: '', text: '' });
    try {
      await addReview(id, { ...reviewForm, userName: user?.name || 'Anonymous' });
      setReviewMsg({ type: 'success', text: 'Review added successfully! ✅' });
      setReviewForm({ rating: 5, comment: '', userLocation: 'Pakistan' });
      setShowReviewForm(false);
      fetchMovie();
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add review!' });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
      Movie not found!
    </div>
  );

  const castPerPage = 4;
  const castPages = Math.ceil((movie.cast?.length || 0) / castPerPage);
  const visibleCast = movie.cast?.slice(castPage * castPerPage, (castPage + 1) * castPerPage);

  const reviewsPerPage = 2;
  const reviewPages = Math.ceil((movie.reviews?.length || 0) / reviewsPerPage);
  const visibleReviews = movie.reviews?.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-transparent" />

        <div className="absolute bottom-12 left-0 right-0 text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{movie.title}</h1>
          <p className="text-[#bfbfbf] text-sm md:text-lg max-w-3xl mx-auto mb-10 line-clamp-2 md:line-clamp-none">
            {movie.description}
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlayNow}
              className={`flex items-center gap-2 px-10 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl ${
                canPlay
                  ? 'bg-[#e50914] hover:bg-[#c40812] text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {canPlay ? <FiPlay fill="white" size={18} /> : <span>🔒</span>}
              {!isLoggedIn
                ? 'Play Now'
                : canPlay
                ? 'Play Now'
                : 'Subscribe to Watch'}
            </button>

            <button className="p-3 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] transition">
              <FiPlus size={20} />
            </button>
            <button className="p-3 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] transition">
              <FiThumbsUp size={20} />
            </button>
          </div>

          {/* Subscription nudge */}
          {isLoggedIn && !canPlay && (
            <p className="text-[#999] text-sm mt-4">
              Subscribe to unlock this and all other content.{' '}
              <button
                onClick={() => navigate('/subscription', { state: { movieId: id } })}
                className="text-[#e50914] underline hover:no-underline"
              >
                View Plans →
              </button>
            </p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Description */}
          <section className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <h3 className="text-[#999] text-sm font-medium mb-4">Description</h3>
            <p className="text-white leading-relaxed text-base opacity-90">{movie.description}</p>
          </section>

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <section className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">Cast</h3>
                <div className="flex gap-2">
                  <button onClick={() => setCastPage(p => Math.max(0, p - 1))} disabled={castPage === 0}
                    className="p-2 bg-[#1a1a1a] border border-[#262626] rounded-full text-white disabled:opacity-20 hover:border-white transition">
                    <FiChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCastPage(p => Math.min(castPages - 1, p + 1))} disabled={castPage >= castPages - 1}
                    className="p-2 bg-[#1a1a1a] border border-[#262626] rounded-full text-white disabled:opacity-20 hover:border-white transition">
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {visibleCast.map((actor, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#2a2a2a] group-hover:border-[#e50914] transition-all mb-3">
                      <img src={actor.photo || '/assets/default-user.png'} alt={actor.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white text-sm font-medium text-center">{actor.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white text-xl font-bold">
                Reviews
                {movie.reviews?.length > 0 && (
                  <span className="text-[#999] text-sm font-normal ml-2">({movie.reviews.length})</span>
                )}
              </h3>
              <button onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-[#1a1a1a] border border-[#262626] text-white px-4 py-2 rounded-lg text-sm hover:bg-white hover:text-black transition-all">
                + Add Your Review
              </button>
            </div>

            {/* Review success/error message */}
            {reviewMsg.text && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                reviewMsg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {reviewMsg.text}
              </div>
            )}

            {showReviewForm && (
              <div className="mb-8 bg-[#1a1a1a] p-6 rounded-xl border border-[#262626]">
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#999]">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                          className={`text-2xl transition ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <textarea required placeholder="Share your thoughts..."
                    className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-4 text-white outline-none focus:border-[#e50914] transition"
                    rows={3} value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2 text-[#999] hover:text-white transition">Cancel</button>
                    <button type="submit" disabled={reviewLoading}
                      className="bg-[#e50914] text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 hover:bg-[#c40812] transition">
                      {reviewLoading ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {visibleReviews?.length > 0 ? visibleReviews.map((rev, i) => (
                <div key={i} className="bg-[#0f0f0f] border border-[#262626] p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-white font-semibold">{rev.userName}</h4>
                      <p className="text-[#666] text-xs">{rev.userLocation}</p>
                    </div>
                    <StarRating rating={rev.rating} />
                  </div>
                  <p className="text-[#999] text-sm italic leading-relaxed">"{rev.comment}"</p>
                </div>
              )) : (
                <p className="text-[#666] text-center italic py-8">No reviews yet. Be the first to review!</p>
              )}

              {/* Review Pagination */}
              {reviewPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  <button onClick={() => setReviewPage(p => Math.max(0, p - 1))} disabled={reviewPage === 0}
                    className="px-4 py-2 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white text-sm disabled:opacity-30 hover:border-white transition">
                    ← Prev
                  </button>
                  <span className="px-4 py-2 text-[#999] text-sm">
                    {reviewPage + 1} / {reviewPages}
                  </span>
                  <button onClick={() => setReviewPage(p => Math.min(reviewPages - 1, p + 1))} disabled={reviewPage >= reviewPages - 1}
                    className="px-4 py-2 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white text-sm disabled:opacity-30 hover:border-white transition">
                    Next →
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:w-[350px] space-y-6">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 divide-y divide-[#262626]">
            <div className="pb-4">
              <span className="text-[#666] text-sm block mb-1">Release Year</span>
              <span className="text-white font-bold text-xl">{movie.releaseYear}</span>
            </div>
            <div className="py-4">
              <span className="text-[#666] text-sm block mb-2">Available Languages</span>
              <div className="flex flex-wrap gap-2">
                {movie.languages?.map((l, i) => (
                  <span key={i} className="bg-[#1a1a1a] border border-[#262626] text-white text-xs px-3 py-1.5 rounded-md">{l}</span>
                ))}
              </div>
            </div>
            <div className="py-4">
              <span className="text-[#666] text-sm block mb-3">Ratings</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] border border-[#262626] p-3 rounded-xl">
                  <p className="text-xs text-[#999] mb-1">IMDb</p>
                  <p className="text-white font-bold">⭐ {movie.ratings?.imdb}</p>
                </div>
                <div className="bg-[#1a1a1a] border border-[#262626] p-3 rounded-xl">
                  <p className="text-xs text-[#999] mb-1">StreamVibe</p>
                  <p className="text-white font-bold">★ {movie.ratings?.streamvibe || '4.8'}</p>
                </div>
              </div>
            </div>
            <div className="py-4">
              <span className="text-[#666] text-sm block mb-2">Genres</span>
              <div className="flex flex-wrap gap-2">
                {movie.genre?.map((g, i) => (
                  <span key={i} className="bg-[#1a1a1a] border border-[#262626] text-white text-xs px-3 py-1.5 rounded-md">{g}</span>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <span className="text-[#666] text-sm block mb-1">Duration</span>
              <span className="text-white font-medium">{movie.duration}</span>
            </div>
          </div>

          {/* Subscribe CTA in sidebar for non-subscribers */}
          {isLoggedIn && !canPlay && (
            <div className="bg-[#e50914]/10 border border-[#e50914]/30 rounded-2xl p-6 text-center">
              <p className="text-white font-bold mb-2">🔒 Unlock Full Access</p>
              <p className="text-[#999] text-sm mb-4">Subscribe to watch this and 1000+ titles.</p>
              <button
                onClick={() => navigate('/subscription', { state: { movieId: id } })}
                className="w-full bg-[#e50914] text-white py-3 rounded-xl font-bold hover:bg-[#c40812] transition"
              >
                View Plans
              </button>
            </div>
          )}
        </aside>
      </div>

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
            <p className="text-[#999] text-sm md:text-base">Sign up for a free trial and explore a world of entertainment.</p>
          </div>
          <Link to="/register" className="bg-[#e50914] hover:bg-[#ff1e2b] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl whitespace-nowrap">
            Start a Free Trial
          </Link>
        </div>
      </section>

      <Footer />

      {/* PLAYER MODAL */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl relative">
            <button onClick={() => setShowPlayer(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#e50914] transition flex items-center gap-2 font-medium">
              <FiX size={24} /> Close
            </button>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#262626]">
              <video src={movie.videoUrl} controls autoPlay className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;