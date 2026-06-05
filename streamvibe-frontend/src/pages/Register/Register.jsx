import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  // Register.jsx ka handleSubmit function update karein
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormError('');

  if (formData.password !== formData.confirmPassword) {
    setFormError('Passwords do not match!');
    return;
  }

  const result = await register(
    formData.name,
    formData.email,
    formData.password
  );

  if (result.success) {
    // Direct home ki bajaye Login page par bhejein
    // Taake user apni details se login kare
    alert("Account created successfully! Please login."); 
navigate('/login', { state: { email: formData.email } });  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      <div className="flex items-center justify-center min-h-[90vh] px-4 py-10">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-[#e50914] text-3xl">▶</span>
            <h1 className="text-white text-2xl font-bold mt-2">StreamVibe</h1>
            <p className="text-[#999] text-sm mt-1">
              Create your account
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">

            {/* Error */}
            {(error || formError) && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                {formError || error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[#999] text-sm mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]"
                  required
                />
              </div>

              <div>
                <label className="text-[#999] text-sm mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]"
                  required
                />
              </div>

              <div>
                <label className="text-[#999] text-sm mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]"
                  required
                />
              </div>

              <div>
                <label className="text-[#999] text-sm mb-2 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e50914] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#c40812] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-[#999] text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#e50914] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
