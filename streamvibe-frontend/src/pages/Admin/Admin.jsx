import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminStats,
  getAllUsers,
  toggleBlockUser,
  addMovie,
  deleteMovie,
  toggleVisibility,
  uploadThumbnail,
  uploadVideo,
  uploadCastPhoto,
} from "../../utils/api";

const TABS = ["Dashboard", "Movies", "Add Movie", "Users", "Home"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] border-r border-[#2a2a2a]
        flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#e50914] text-xl">▶</span>
            <span className="text-white font-bold text-lg">StreamVibe</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#999] hover:text-white text-xl"
          >✕</button>
        </div>
        <p className="text-[#999] text-xs px-6 pb-2">Admin Panel</p>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {TABS.map((tab) => (
            <button key={tab}
             onClick={() => {
        if (tab === "Home") {
          navigate("/");
        } else {
          setActiveTab(tab);
          setSidebarOpen(false);
        }
      }}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === tab ? "bg-[#e50914] text-white" : "text-[#999] hover:text-white hover:bg-[#212121]"
              }`}>
              {tab === "Dashboard" && "📊 "}
              {tab === "Movies" && "🎬 "}
              {tab === "Add Movie" && "➕ "}
              {tab === "Users" && "👥 "}
      {tab === "Home" && "🏠 "}

              {tab}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-[#999] text-xs mb-3 truncate">{user?.email}</p>
          <button onClick={handleLogout}
            className="w-full border border-[#2a2a2a] text-[#999] py-2 rounded-lg text-sm hover:border-[#e50914] hover:text-[#e50914] transition">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl"
          >☰</button>
          <div className="flex items-center gap-2">
            <span className="text-[#e50914]">▶</span>
            <span className="text-white font-bold">StreamVibe</span>
          </div>
          <div className="text-[#999] text-xs">{activeTab}</div>
        </div>

        <div className="p-4 md:p-8 flex-1">
          {activeTab === "Dashboard" && <DashboardTab />}
          {activeTab === "Movies" && <MoviesTab />}
          {activeTab === "Add Movie" && <AddMovieTab onSuccess={() => setActiveTab("Movies")} />}
          {activeTab === "Users" && <UsersTab />}
        </div>
      </div>
    </div>
  );
};

// =====================
// DASHBOARD TAB
// =====================
const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { getAdminStats().then((r) => setStats(r.data)).catch(console.log); }, []);
  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👥" },
    { label: "Total Movies", value: stats?.totalMovies || 0, icon: "🎬" },
    { label: "Total Shows", value: stats?.totalShows || 0, icon: "📺" },
    { label: "Active Subs", value: stats?.activeSubscriptions || 0, icon: "💳" },
    { label: "Blocked Users", value: stats?.blockedUsers || 0, icon: "🚫" },
  ];
  return (
    <div>
      <h1 className="text-white text-xl md:text-2xl font-bold mb-6 md:mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl md:text-3xl">{card.icon}</span>
              <span className="text-2xl md:text-3xl font-bold text-white">{card.value}</span>
            </div>
            <p className="text-[#999] text-xs md:text-sm">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================
// MOVIES TAB
// =====================
const MoviesTab = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMovie, setEditMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const { getAllMovies } = await import("../../utils/api");
      const res = await getAllMovies();
      setMovies(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try { await deleteMovie(id); setMovies((prev) => prev.filter((m) => m._id !== id)); }
    catch (err) { console.log(err); }
  };

  const handleToggleVisibility = async (id) => {
    try { await toggleVisibility(id); fetchMovies(); }
    catch (err) { console.log(err); }
  };

  const handleEditClick = async (movie) => {
    try {
      const { getMovieById } = await import("../../utils/api");
      const res = await getMovieById(movie._id);
      setEditMovie(res.data);
    } catch (err) { console.log(err); }
  };

  if (loading) return <div className="text-white text-center py-20">Loading movies...</div>;

  return (
    <div>
      <h1 className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6">Manage Movies & Shows</h1>

      {movies.length === 0 ? (
        <div className="text-[#999] text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          No movies yet. Add some from "Add Movie" tab!
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#999] text-xs px-4 py-3">THUMBNAIL</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">TITLE</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">TYPE</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">GENRE</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">YEAR</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">STATUS</th>
                  <th className="text-left text-[#999] text-xs px-4 py-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id} className="border-b border-[#2a2a2a] hover:bg-[#212121] transition">
                    <td className="px-4 py-3">
                      <img src={movie.thumbnail} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{movie.title}</p>
                      <p className="text-[#999] text-xs">{movie.duration}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        movie.contentType === "movie" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                      }`}>{movie.contentType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {movie.genre?.slice(0, 2).map((g) => (
                          <span key={g} className="text-xs bg-[#2a2a2a] text-[#999] px-2 py-0.5 rounded">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#999] text-sm">{movie.releaseYear}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        movie.isVisible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>{movie.isVisible ? "Visible" : "Hidden"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(movie)}
                          className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-500/30 transition">Edit</button>
                        <button onClick={() => handleToggleVisibility(movie._id)}
                          className="text-xs bg-[#2a2a2a] text-white px-3 py-1.5 rounded hover:bg-[#3a3a3a] transition">
                          {movie.isVisible ? "Hide" : "Show"}
                        </button>
                        <button onClick={() => handleDelete(movie._id)}
                          className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-500/30 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex gap-3 mb-3">
                  <img src={movie.thumbnail} alt={movie.title} className="w-12 h-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
                    <p className="text-[#999] text-xs">{movie.duration}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        movie.contentType === "movie" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                      }`}>{movie.contentType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        movie.isVisible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>{movie.isVisible ? "Visible" : "Hidden"}</span>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {movie.genre?.slice(0, 2).map((g) => (
                        <span key={g} className="text-xs bg-[#2a2a2a] text-[#999] px-2 py-0.5 rounded">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(movie)}
                    className="flex-1 text-xs bg-blue-500/20 text-blue-400 py-2 rounded hover:bg-blue-500/30 transition">Edit</button>
                  <button onClick={() => handleToggleVisibility(movie._id)}
                    className="flex-1 text-xs bg-[#2a2a2a] text-white py-2 rounded hover:bg-[#3a3a3a] transition">
                    {movie.isVisible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => handleDelete(movie._id)}
                    className="flex-1 text-xs bg-red-500/20 text-red-400 py-2 rounded hover:bg-red-500/30 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editMovie && (
        <EditMovieModal movie={editMovie} onClose={() => setEditMovie(null)}
          onSuccess={() => { setEditMovie(null); fetchMovies(); }} />
      )}
    </div>
  );
};

// =====================
// ADD MOVIE TAB
// =====================
const AddMovieTab = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingCast, setUploadingCast] = useState(false);
  const [isThumbUploaded, setIsThumbUploaded] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [castList, setCastList] = useState([]);
  const [castName, setCastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", genre: "", releaseYear: "",
    duration: "", thumbnail: "", videoUrl: "", languages: "",
    directorName: "", directorFrom: "", musicName: "", musicFrom: "",
    imdbRating: "", contentType: "movie",
    isTrending: false, isNewRelease: false, isMustWatch: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingThumb(true); setIsThumbUploaded(false); setError("");
    try {
      const fd = new FormData(); fd.append("thumbnail", file);
      const { data } = await uploadThumbnail(fd);
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      setIsThumbUploaded(true);
    } catch { setError("Thumbnail upload failed!"); }
    finally { setUploadingThumb(false); }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingVideo(true); setIsVideoUploaded(false); setError("");
    try {
      const fd = new FormData(); fd.append("video", file);
      const { data } = await uploadVideo(fd);
      setForm((prev) => ({ ...prev, videoUrl: data.url }));
      setIsVideoUploaded(true);
    } catch { setError("Video upload failed!"); }
    finally { setUploadingVideo(false); }
  };

  const handleCastUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !castName.trim()) { setError("Enter actor name first!"); return; }
    setUploadingCast(true); setError("");
    try {
      const fd = new FormData(); fd.append("photo", file);
      const { data } = await uploadCastPhoto(fd);
      setCastList((prev) => [...prev, { name: castName.trim(), photo: data.url }]);
      setCastName("");
    } catch { setError("Cast photo upload failed!"); }
    finally { setUploadingCast(false); }
  };

  const removeCast = (i) => setCastList((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isThumbUploaded || !isVideoUploaded) { setError("Please upload both thumbnail and video!"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await addMovie({
        title: form.title, description: form.description,
        genre: form.genre.split(",").map((g) => g.trim()),
        releaseYear: Number(form.releaseYear), duration: form.duration,
        thumbnail: form.thumbnail, videoUrl: form.videoUrl,
        languages: form.languages.split(",").map((l) => l.trim()),
        director: { name: form.directorName, from: form.directorFrom },
        music: { name: form.musicName, from: form.musicFrom },
        ratings: { imdb: Number(form.imdbRating), streamvibe: 0 },
        contentType: form.contentType,
        isTrending: form.isTrending, isNewRelease: form.isNewRelease, isMustWatch: form.isMustWatch,
        cast: castList,
      });
      setSuccess("Movie added successfully! 🎬");
      setForm({ title: "", description: "", genre: "", releaseYear: "", duration: "", thumbnail: "",
        videoUrl: "", languages: "", directorName: "", directorFrom: "", musicName: "", musicFrom: "",
        imdbRating: "", contentType: "movie", isTrending: false, isNewRelease: false, isMustWatch: false });
      setCastList([]); setIsThumbUploaded(false); setIsVideoUploaded(false);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) { setError(err.response?.data?.message || "Failed to add movie!"); }
    finally { setLoading(false); }
  };

  const ic = "w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]";
  const lc = "text-[#999] text-xs mb-1.5 block";
  const fc = "w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-lg text-sm cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#e50914] file:text-white file:text-xs";

  return (
    <div>
      <h1 className="text-white text-xl md:text-2xl font-bold mb-6">Add New Movie / Show</h1>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6 mb-4">
          <h3 className="text-white font-semibold mb-4">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className={lc}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Movie title" className={ic} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className={lc}>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Description" className={ic} />
            </div>
            <div>
              <label className={lc}>Content Type *</label>
              <select name="contentType" value={form.contentType} onChange={handleChange} className={ic}>
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>
            <div>
              <label className={lc}>Genre * (comma separated)</label>
              <input name="genre" value={form.genre} onChange={handleChange} required placeholder="Action, Adventure" className={ic} />
            </div>
            <div>
              <label className={lc}>Release Year *</label>
              <input name="releaseYear" value={form.releaseYear} onChange={handleChange} required type="number" placeholder="2023" className={ic} />
            </div>
            <div>
              <label className={lc}>Duration *</label>
              <input name="duration" value={form.duration} onChange={handleChange} required placeholder="2h 30min" className={ic} />
            </div>
            <div>
              <label className={lc}>Languages (comma separated)</label>
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="English, Hindi" className={ic} />
            </div>
            <div>
              <label className={lc}>IMDb Rating</label>
              <input name="imdbRating" value={form.imdbRating} onChange={handleChange} type="number" step="0.1" min="0" max="10" placeholder="8.5" className={ic} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6 mb-4">
          <h3 className="text-white font-semibold mb-4">Media Upload</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lc}>Thumbnail Image *</label>
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className={fc} />
              {uploadingThumb && <div className="flex items-center gap-2 mt-2"><div className="w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" /><p className="text-yellow-400 text-xs">Uploading...</p></div>}
              {form.thumbnail && !uploadingThumb && (
                <div className="flex items-center gap-3 mt-2">
                  <img src={form.thumbnail} alt="preview" className="w-12 h-16 object-cover rounded" />
                  <span className="text-green-400 text-xs">✅ Uploaded!</span>
                </div>
              )}
            </div>
            <div>
              <label className={lc}>Video File *</label>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className={fc} />
              {uploadingVideo && <div className="flex items-center gap-2 mt-2"><div className="w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" /><p className="text-yellow-400 text-xs">Uploading video...</p></div>}
              {form.videoUrl && !uploadingVideo && <span className="text-green-400 text-xs mt-1 block">✅ Video uploaded!</span>}
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6 mb-4">
          <h3 className="text-white font-semibold mb-4">Credits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Director Name</label><input name="directorName" value={form.directorName} onChange={handleChange} placeholder="Director" className={ic} /></div>
            <div><label className={lc}>Director From</label><input name="directorFrom" value={form.directorFrom} onChange={handleChange} placeholder="USA" className={ic} /></div>
            <div><label className={lc}>Music By</label><input name="musicName" value={form.musicName} onChange={handleChange} placeholder="Composer" className={ic} /></div>
            <div><label className={lc}>Music From</label><input name="musicFrom" value={form.musicFrom} onChange={handleChange} placeholder="USA" className={ic} /></div>
          </div>
        </div>

        {/* Cast */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6 mb-4">
          <h3 className="text-white font-semibold mb-4">Cast Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={lc}>Actor Name</label>
              <input value={castName} onChange={(e) => setCastName(e.target.value)} placeholder="e.g. Robert Downey Jr" className={ic} />
            </div>
            <div>
              <label className={lc}>Actor Photo</label>
              <input type="file" accept="image/*" onChange={handleCastUpload} className={fc} key={castList.length} />
              {uploadingCast && <div className="flex items-center gap-2 mt-1"><div className="w-3 h-3 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" /><p className="text-yellow-400 text-xs">Uploading...</p></div>}
            </div>
          </div>
          {castList.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {castList.map((c, i) => (
                <div key={i} className="relative flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2a2a2a]">
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-xs text-center w-14 truncate">{c.name}</p>
                  <button type="button" onClick={() => removeCast(i)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#555] text-xs">No cast added yet. Enter name then select photo.</p>
          )}
        </div>

        {/* Tags */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 md:p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {[{ name: "isTrending", label: "Trending" }, { name: "isNewRelease", label: "New Release" }, { name: "isMustWatch", label: "Must Watch" }].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-[#e50914]" />
                <span className="text-white text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit"
          disabled={loading || uploadingThumb || uploadingVideo || uploadingCast || !isThumbUploaded || !isVideoUploaded}
          className="w-full bg-[#e50914] text-white py-3 rounded-lg font-semibold hover:bg-[#c40812] transition disabled:opacity-50 text-sm md:text-base">
          {loading ? "Adding Movie..." : uploadingThumb ? "Uploading Thumbnail..." : uploadingVideo ? "Uploading Video..." : uploadingCast ? "Uploading Cast..." : "+ Add Movie"}
        </button>
      </form>
    </div>
  );
};

// =====================
// EDIT MOVIE MODAL
// =====================
const EditMovieModal = ({ movie, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingCast, setUploadingCast] = useState(false);
  const [isThumbUploaded, setIsThumbUploaded] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [castList, setCastList] = useState([]);
  const [castName, setCastName] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", genre: "", releaseYear: "",
    duration: "", thumbnail: "", videoUrl: "", languages: "",
    directorName: "", directorFrom: "", musicName: "", musicFrom: "",
    imdbRating: "", contentType: "movie",
    isTrending: false, isNewRelease: false, isMustWatch: false,
  });

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || "", description: movie.description || "",
        genre: movie.genre?.join(", ") || "", releaseYear: movie.releaseYear || "",
        duration: movie.duration || "", thumbnail: movie.thumbnail || "",
        videoUrl: movie.videoUrl || "", languages: movie.languages?.join(", ") || "",
        directorName: movie.director?.name || "", directorFrom: movie.director?.from || "",
        musicName: movie.music?.name || "", musicFrom: movie.music?.from || "",
        imdbRating: movie.ratings?.imdb || "", contentType: movie.contentType || "movie",
        isTrending: movie.isTrending || false, isNewRelease: movie.isNewRelease || false,
        isMustWatch: movie.isMustWatch || false,
      });
      setCastList(movie.cast || []);
      setIsThumbUploaded(!!movie.thumbnail);
      setIsVideoUploaded(!!movie.videoUrl);
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingThumb(true); setIsThumbUploaded(false);
    try {
      const fd = new FormData(); fd.append("thumbnail", file);
      const { data } = await uploadThumbnail(fd);
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      setIsThumbUploaded(true);
    } catch { setError("Thumbnail upload failed!"); }
    finally { setUploadingThumb(false); }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingVideo(true); setIsVideoUploaded(false);
    try {
      const fd = new FormData(); fd.append("video", file);
      const { data } = await uploadVideo(fd);
      setForm((prev) => ({ ...prev, videoUrl: data.url }));
      setIsVideoUploaded(true);
    } catch { setError("Video upload failed!"); }
    finally { setUploadingVideo(false); }
  };

  const handleCastUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !castName.trim()) { setError("Enter actor name first!"); return; }
    setUploadingCast(true); setError("");
    try {
      const fd = new FormData(); fd.append("photo", file);
      const { data } = await uploadCastPhoto(fd);
      setCastList((prev) => [...prev, { name: castName.trim(), photo: data.url }]);
      setCastName("");
    } catch { setError("Cast photo upload failed!"); }
    finally { setUploadingCast(false); }
  };

  const removeCast = (i) => setCastList((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const { updateMovie } = await import("../../utils/api");
      await updateMovie(movie._id, {
        title: form.title, description: form.description,
        genre: form.genre.split(",").map((g) => g.trim()),
        releaseYear: Number(form.releaseYear), duration: form.duration,
        thumbnail: form.thumbnail, videoUrl: form.videoUrl,
        languages: form.languages.split(",").map((l) => l.trim()),
        director: { name: form.directorName, from: form.directorFrom },
        music: { name: form.musicName, from: form.musicFrom },
        ratings: { imdb: Number(form.imdbRating) },
        contentType: form.contentType,
        isTrending: form.isTrending, isNewRelease: form.isNewRelease, isMustWatch: form.isMustWatch,
        cast: castList,
      });
      onSuccess();
    } catch (err) { setError(err.response?.data?.message || "Update failed!"); }
    finally { setLoading(false); }
  };

  const ic = "w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]";
  const lc = "text-[#999] text-xs mb-1.5 block";
  const fc = "w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-lg text-sm cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#e50914] file:text-white file:text-xs";

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl my-2 md:my-0">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a] rounded-t-2xl z-10">
          <h2 className="text-white font-bold text-base md:text-lg">Edit Movie</h2>
          <button onClick={onClose} className="text-[#999] hover:text-white text-xl transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 flex flex-col gap-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2"><label className={lc}>Title *</label><input name="title" value={form.title} onChange={handleChange} required className={ic} /></div>
            <div className="col-span-1 md:col-span-2"><label className={lc}>Description *</label><textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={ic} /></div>
            <div>
              <label className={lc}>Content Type</label>
              <select name="contentType" value={form.contentType} onChange={handleChange} className={ic}>
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>
            <div><label className={lc}>Genre (comma separated)</label><input name="genre" value={form.genre} onChange={handleChange} className={ic} /></div>
            <div><label className={lc}>Release Year</label><input name="releaseYear" value={form.releaseYear} onChange={handleChange} type="number" className={ic} /></div>
            <div><label className={lc}>Duration</label><input name="duration" value={form.duration} onChange={handleChange} className={ic} /></div>

            {/* Thumbnail */}
            <div>
              <label className={lc}>Thumbnail Image</label>
              {form.thumbnail && !uploadingThumb && (
                <div className="flex items-center gap-2 mb-2 bg-[#2a2a2a] px-3 py-2 rounded-lg">
                  <img src={form.thumbnail} alt="current" className="w-8 h-10 object-cover rounded" />
                  <div>
                    <p className="text-green-400 text-xs font-semibold">✅ Current Thumbnail</p>
                    <p className="text-[#999] text-xs">Upload new to replace</p>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className={fc} />
              {uploadingThumb && <p className="text-yellow-400 text-xs mt-1">Uploading...</p>}
            </div>

            {/* Video */}
            <div>
              <label className={lc}>Video File</label>
              {form.videoUrl && !uploadingVideo && (
                <div className="flex items-center gap-2 mb-2 bg-[#2a2a2a] px-3 py-2 rounded-lg">
                  <span className="text-xl">🎬</span>
                  <div>
                    <p className="text-green-400 text-xs font-semibold">✅ Video Uploaded</p>
                    <p className="text-[#999] text-xs">Upload new to replace</p>
                  </div>
                </div>
              )}
              <input type="file" accept="video/*" onChange={handleVideoUpload} className={fc} />
              {uploadingVideo && <p className="text-yellow-400 text-xs mt-1">Uploading video...</p>}
            </div>

            <div><label className={lc}>Languages (comma separated)</label><input name="languages" value={form.languages} onChange={handleChange} className={ic} /></div>
            <div><label className={lc}>IMDb Rating</label><input name="imdbRating" value={form.imdbRating} onChange={handleChange} type="number" step="0.1" min="0" max="10" className={ic} /></div>
            <div><label className={lc}>Director Name</label><input name="directorName" value={form.directorName} onChange={handleChange} className={ic} /></div>
            <div><label className={lc}>Director From</label><input name="directorFrom" value={form.directorFrom} onChange={handleChange} className={ic} /></div>
            <div><label className={lc}>Music By</label><input name="musicName" value={form.musicName} onChange={handleChange} className={ic} /></div>
            <div><label className={lc}>Music From</label><input name="musicFrom" value={form.musicFrom} onChange={handleChange} className={ic} /></div>
          </div>

          {/* Cast */}
          <div className="bg-[#212121] border border-[#2a2a2a] rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Cast Members</h3>

            {/* Existing Cast */}
            {castList.length > 0 && (
              <div className="mb-4">
                <p className="text-[#999] text-xs mb-2">✅ {castList.length} member{castList.length > 1 ? 's' : ''} — ✕ se remove karo</p>
                <div className="flex gap-3 flex-wrap">
                  {castList.map((c, i) => (
                    <div key={i} className="relative flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/50">
                        {c.photo ? (
                          <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center text-white text-sm font-bold">
                            {c.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs text-center w-14 truncate">{c.name}</p>
                      <button type="button" onClick={() => removeCast(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {castList.length > 0 && (
              <div className="border-t border-[#2a2a2a] pt-3 mb-3">
                <p className="text-[#999] text-xs">➕ Naya Cast Member Add Karo:</p>
              </div>
            )}

            {/* Add New */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lc}>Actor Name</label>
                <input value={castName} onChange={(e) => setCastName(e.target.value)} placeholder="e.g. Chris Evans" className={ic} />
              </div>
              <div>
                <label className={lc}>Actor Photo</label>
                <input type="file" accept="image/*" onChange={handleCastUpload} className={fc} key={castList.length} />
                {uploadingCast && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                    <p className="text-yellow-400 text-xs">Uploading...</p>
                  </div>
                )}
                {!uploadingCast && castName.trim() && (
                  <p className="text-[#999] text-xs mt-1">Photo select karo ✓</p>
                )}
              </div>
            </div>

            {castList.length === 0 && (
              <p className="text-[#555] text-xs mt-2">No cast added. Naam likho phir photo select karo.</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
            {[{ name: "isTrending", label: "Trending" }, { name: "isNewRelease", label: "New Release" }, { name: "isMustWatch", label: "Must Watch" }].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-[#e50914]" />
                <span className="text-white text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#2a2a2a] text-[#999] py-2.5 rounded-lg text-sm hover:border-white hover:text-white transition">Cancel</button>
            <button type="submit"
              disabled={loading || uploadingThumb || uploadingVideo || uploadingCast || !isThumbUploaded || !isVideoUploaded}
              className="flex-1 bg-[#e50914] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#c40812] transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================
// USERS TAB
// =====================
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((r) => setUsers(r.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (id) => {
    try { await toggleBlockUser(id); setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u)); }
    catch (err) { console.log(err); }
  };

  if (loading) return <div className="text-white text-center py-20">Loading users...</div>;

  return (
    <div>
      <h1 className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6">Manage Users ({users.length})</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-left text-[#999] text-xs px-4 py-3">NAME</th>
              <th className="text-left text-[#999] text-xs px-4 py-3">EMAIL</th>
              <th className="text-left text-[#999] text-xs px-4 py-3">PLAN</th>
              <th className="text-left text-[#999] text-xs px-4 py-3">STATUS</th>
              <th className="text-left text-[#999] text-xs px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-[#999] py-10">No users found!</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-[#2a2a2a] hover:bg-[#212121] transition">
                  <td className="px-4 py-3"><p className="text-white text-sm font-medium">{user.name}</p></td>
                  <td className="px-4 py-3"><p className="text-[#999] text-sm">{user.email}</p></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${user.subscription?.isActive ? "bg-green-500/20 text-green-400" : "bg-[#2a2a2a] text-[#999]"}`}>
                      {user.subscription?.plan || "none"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${user.isBlocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleBlock(user._id)}
                      className={`text-xs px-3 py-1.5 rounded transition font-medium ${user.isBlocked ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {users.length === 0 ? (
          <div className="text-center text-[#999] py-10">No users found!</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-[#999] text-xs mt-0.5">{user.email}</p>
                </div>
                <button onClick={() => handleToggleBlock(user._id)}
                  className={`text-xs px-3 py-1.5 rounded transition font-medium flex-shrink-0 ${user.isBlocked ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded font-semibold ${user.subscription?.isActive ? "bg-green-500/20 text-green-400" : "bg-[#2a2a2a] text-[#999]"}`}>
                  {user.subscription?.plan || "none"}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${user.isBlocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;