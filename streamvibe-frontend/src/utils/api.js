import axios from 'axios';

const API = axios.create({
  baseURL: 'https://stream-vibe-sigma-seven.vercel.app/api'
});

// Automatically token attach karo
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('streamvibe_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});


// ================= AUTH =================
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const adminLogin = (data) => API.post('/auth/admin-login', data);


// ================= MOVIES =================
export const getAllMovies = (params) => API.get('/movies', { params });
export const getTrending = () => API.get('/movies/filter/trending');
export const getNewReleases = () => API.get('/movies/filter/new-releases');
export const getMustWatch = () => API.get('/movies/filter/must-watch');
export const getGenres = () => API.get('/movies/filter/genres');
export const getMovieById = (id) => API.get(`/movies/${id}`); // ✅ FIXED
export const addReview = (id, data) => API.post(`/movies/${id}/review`, data);


// ================= USER =================
export const getProfile = () => API.get('/user/profile');
export const activateFreeTrial = () => API.post('/user/free-trial');
export const subscribePlan = (data) => API.post('/user/subscribe', data);


// ================= ADMIN =================
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const toggleBlockUser = (id) => API.put(`/admin/users/${id}/block`);
export const addMovie = (data) => API.post('/admin/movies', data);
export const updateMovie = (id, data) => API.put(`/admin/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/admin/movies/${id}`);
export const toggleVisibility = (id) => API.put(`/admin/movies/${id}/visibility`);


// ================= UPLOAD =================
export const uploadThumbnail = (formData) =>
  API.post('/upload/thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const uploadVideo = (formData) =>
  API.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const uploadCastPhoto = (formData) =>
  API.post('/upload/cast-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });


export default API;