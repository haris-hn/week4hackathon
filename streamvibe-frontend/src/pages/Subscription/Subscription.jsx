// src/pages/Subscription/SubscriptionPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';
import { subscribePlan } from '../../utils/api';

const PLANS = {
  basic:    { name: 'Basic Plan',    price: '$9.99',  label: 'basic' },
  standard: { name: 'Standard Plan', price: '$12.99', label: 'standard' },
  premium:  { name: 'Premium Plan',  price: '$14.99', label: 'premium' },
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId  = location.state?.movieId;

  // Let user pick a plan if coming from home; default to premium
  const defaultPlan = location.state?.plan || 'premium';
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);

  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const [form, setForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call real backend endpoint
      await subscribePlan({
        plan: selectedPlan,
        cardNumber: form.cardNumber,
        cardHolder: form.cardHolder,
        expiryDate: form.expiry,
      });

      // Persist updated subscription in AuthContext + localStorage
      if (user) {
        const updatedUser = {
          ...user,
          isSubscribed: true,
          subscription: {
            ...(user.subscription || {}),
            isActive: true,
            plan: selectedPlan,
          },
        };
        setUser(updatedUser);
      }

      alert(`✅ Subscribed to ${PLANS[selectedPlan].name} (${PLANS[selectedPlan].price}/month)!`);

      // Navigate back to movie (autoPlay) or to movies list
      if (movieId) {
        navigate(`/movies/${movieId}`, { state: { autoPlay: true, movieId } });
      } else {
        navigate('/movies');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ic =
    'w-full bg-[#262626] border border-[#333] text-white p-3 rounded-lg text-sm outline-none focus:border-[#e50914] transition placeholder:text-[#555]';

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Complete Your Subscription</h1>
          <p className="text-[#999]">
            Enter your details to get unlimited access to movies &amp; shows.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          {Object.entries(PLANS).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`px-6 py-3 rounded-xl border text-sm font-semibold transition ${
                selectedPlan === key
                  ? 'bg-[#e50914] border-[#e50914] text-white shadow-lg scale-105'
                  : 'bg-[#1a1a1a] border-[#333] text-[#999] hover:border-[#e50914] hover:text-white'
              }`}
            >
              {plan.name}
              <span className="block text-xs font-normal mt-0.5 opacity-80">{plan.price}/mo</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
          {/* Left: Plan Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Plan Summary</h3>
            <div className="bg-[#262626] p-4 rounded-xl mb-4 border border-[#333]">
              <div className="flex justify-between mb-2">
                <span className="text-[#999]">Selected Plan</span>
                <span className="text-white font-medium">{PLANS[selectedPlan].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">Price</span>
                <span className="text-white font-medium">{PLANS[selectedPlan].price}/month</span>
              </div>
            </div>
            <ul className="text-sm text-[#999] space-y-2 mt-4">
              <li>✓ Ad-free experience</li>
              <li>✓ HD / 4K Ultra HD Quality</li>
              <li>✓ Watch on multiple devices</li>
              <li>✓ Download for offline viewing (Premium)</li>
              <li>✓ Cancel anytime</li>
            </ul>

            {/* Free trial note */}
            <div className="mt-6 bg-[#e50914]/10 border border-[#e50914]/30 rounded-xl p-4">
              <p className="text-[#e50914] text-sm font-semibold mb-1">🎁 7-Day Free Trial</p>
              <p className="text-[#999] text-xs">
                New users get full access free for 7 days. You won't be charged until the trial ends.
              </p>
            </div>
          </div>

          {/* Right: Payment Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">Payment Details</h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2 text-[#999]">Cardholder Name</label>
              <input
                name="cardHolder"
                required
                type="text"
                placeholder="John Doe"
                value={form.cardHolder}
                onChange={handleChange}
                className={ic}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#999]">Card Number</label>
              <input
                name="cardNumber"
                required
                type="text"
                placeholder="**** **** **** 4444"
                maxLength={19}
                value={form.cardNumber}
                onChange={(e) => {
                  // Auto-format with spaces
                  const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                  const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                  setForm((prev) => ({ ...prev, cardNumber: formatted }));
                }}
                className={ic}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-[#999]">Expiry Date</label>
                <input
                  name="expiry"
                  required
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                    setForm((prev) => ({ ...prev, expiry: val }));
                  }}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#999]">CVV</label>
                <input
                  name="cvv"
                  required
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={form.cvv}
                  onChange={handleChange}
                  className={ic}
                />
              </div>
            </div>

            <p className="text-[#555] text-xs">
              🔒 Your card details are encrypted and securely stored. Only the last 4 digits are saved.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e50914] py-4 rounded-lg font-bold mt-2 hover:bg-[#c40812] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm & Pay ${PLANS[selectedPlan].price}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;