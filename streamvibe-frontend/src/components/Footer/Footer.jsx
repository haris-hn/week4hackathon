import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] border-t border-[#2a2a2a] px-6 md:px-16 py-12">
      
      {/* Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
        
        <div>
          <h4 className="text-white font-semibold mb-4">Home</h4>
          <ul className="flex flex-col gap-2">
            {['Categories', 'Devices', 'Pricing', 'FAQ'].map(item => (
              <li key={item}>
                <Link to="/" className="text-[#999] text-sm hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Movies</h4>
          <ul className="flex flex-col gap-2">
            {['Genres', 'Trending', 'New Release', 'Popular'].map(item => (
              <li key={item}>
                <Link to="/" className="text-[#999] text-sm hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Shows</h4>
          <ul className="flex flex-col gap-2">
            {['Genres', 'Trending', 'New Release', 'Popular'].map(item => (
              <li key={item}>
                <Link to="/" className="text-[#999] text-sm hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/" className="text-[#999] text-sm hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Subscription</h4>
          <ul className="flex flex-col gap-2">
            {['Plans', 'Features'].map(item => (
              <li key={item}>
                <Link to="/" className="text-[#999] text-sm hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
          <div className="flex gap-3">
            {['f', 't', 'in'].map(icon => (
              <a
                key={icon}
                href="#"
                className="w-9 h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-white text-xs hover:border-[#e50914] transition"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#999] text-xs">
          ©2023 streamvibe. All Rights Reserved
        </p>

        <div className="flex gap-6">
          {['Terms of Use', 'Privacy Policy', 'Cookie Policy'].map(item => (
            <a key={item} href="#" className="text-[#999] text-xs hover:text-white transition">
              {item}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footer;