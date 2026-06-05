import { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { user, login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 yahan se pata chalega login ke baad kahan jana hai
  const from = location.state?.from || "/";

  // ✅ Already logged-in user redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true }); // 🔥 FIXED
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const result = await login(email, password);

    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true }); // 🔥 FIXED
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-[#e50914] text-3xl">▶</span>
            <h1 className="text-white text-2xl font-bold mt-2">StreamVibe</h1>
            <p className="text-[#999] text-sm mt-1">Welcome back!</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="text-[#999] text-sm mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[#999] text-sm mb-2 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e50914] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#c40812] transition disabled:opacity-50 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-[#999] text-sm mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#e50914] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;