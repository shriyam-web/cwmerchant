import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  const footerLinks = {
    Products: [
      { name: 'User Site', href: 'https://www.citywitty.com/' },
      { name: 'Merchant Categories', href: '/categories' },

      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Merchant Benefits', href: '/merchant-packages#benefits' },
      { name: 'Merchant Packages', href: 'merchant-packages' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: 'https://www.citywitty.com/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Cookies', href: '/cookies' }
    ]
  };

  const ecosystemLinks = [
    { name: 'CityWitty.com', href: 'https://www.citywitty.com/' },
    { name: 'CW Franchise Portal', href: 'https://franchise.citywitty.com/' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-300">
      <div className="container mx-auto px-6 md:px-12 py-16">
        {/* Top Grid: Logo + Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-15 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/logo2.png" alt="Merchant Hub Logo" className="w-32 h-16 object-contain" />
              </div>

            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              Empowering merchants across India to grow their business with premium customers
              and innovative loyalty solutions.
            </p>
            {/* <p className="text-gray-500 text-sm mb-6">
              Citywitty Merchant Hub is part of the Citywitty (<Link href="https://citywitty.com" className="underline hover:text-gray-800">citywitty.com</Link>) ecosystem.
            </p> */}

            <div className="flex flex-wrap gap-3 mt-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/19b3cPzrDU/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877F2] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/citywitty.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] via-[#8134AF] to-[#515BD4] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/CityWitty_India"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path d="M18.244 2H21l-6.766 7.725L22 22h-7.317l-5.16-6.61L4.6 22H2l7.243-8.268L2 2h7.41l4.713 6.164L18.244 2zM16.9 20h1.9L8.1 4H6.1l10.8 16z" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/citywitty-digital-ventures-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0A66C2] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@citywitty3546?si=IfcAhXmKq9vmIfA8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF0000] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/916389202030" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <FaWhatsapp className="h-5 w-5 text-white" />
                </div>
              </a>

              {/* Google Maps */}
              <a
                href="https://maps.app.goo.gl/3dUsoBqaWssY3Sqb9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#4285F4] hover:scale-110 hover:shadow-lg transition border border-gray-200">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </a>
            </div>



            {/* Go to CityWitty Button */}
            {/* <Link
              href="https://citywitty.com"
              className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-full shadow-md transition-all"
            >
              <img src="/white.png" alt="Citywitty Logo" className="w-5 h-5 object-contain" />
              <span>Go to Citywitty</span>
            </Link> */}
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ecosystem Links Section */}
        <div className="mt-7">
          <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">CityWitty Ecosystem</h3>
          <div className="flex flex-wrap gap-3">
            {ecosystemLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">contact@citywitty.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">+91 6389202030</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">New Delhi, India</span>
            </div>
          </div>

          {/* Bottom Section: Copyright & Disclaimer */}
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              &copy; 2025 <Link href="https://partner.citywitty.com" className="underline hover:text-gray-800 dark:hover:text-gray-300">CityWitty Merchant Hub</Link> — Part of the <Link href="https://citywitty.com" className="underline hover:text-gray-800 dark:hover:text-gray-300">CityWitty</Link> Ecosystem. All rights reserved.
            </p>
            <p className="mt-2">
              Unauthorized use, reproduction, or distribution of this platform or its intellectual property is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
