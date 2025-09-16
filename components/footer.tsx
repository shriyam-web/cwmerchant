import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#' },
      { name: 'Integrations', href: '#' },
      { name: 'Explore our Merchant Premium Packages', href: '#' }
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Merchant Agreement', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-50 text-gray-800">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-15 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" />
              </div>
              <img
                src="/logo2.png"
                alt="Citywitty Logo"
                className="w-32 h-16 object-contain"
              />
            </Link>
            <p className="text-gray-600 mb-2 leading-relaxed">
              Empowering merchants across India to grow their business with premium customers
              and innovative loyalty solutions.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Citywitty Merchant Hub is a part of the Citywitty (<Link href="https://citywitty.com" className="underline hover:text-gray-800">citywitty.com</Link>) ecosystem.
            </p>
            <div className="flex space-x-4 mb-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon className="h-5 w-5 text-gray-700 hover:text-white" />
                </a>
              ))}
            </div>

            <Link
              href="https://citywitty.com"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-md transition-all"
            >
              <img src="/white.png" alt="Citywitty Logo" className="w-5 h-5 object-contain" />
              <span>Go to Citywitty</span>
            </Link>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4 text-gray-800">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">contact@citywitty.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">+91 6389202030</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">New Delhi, India</span>
            </div>
          </div>
          <div className="text-center text-gray-500">
            <p>&copy; 2025 <a href="https://partner.citywitty.com">CityWitty Merchant Hub </a> — Part of the <a href="https://citywitty.com"> CityWitty </a> Ecosystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
