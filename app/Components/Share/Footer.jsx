

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className=" py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+880XXXXXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📩</span>
                <span>XXXX@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏢</span>
                <span>XXX, XXXX, Tangail</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-300 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-blue-300 transition-colors">
                  Return, Refund & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Facebook
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Instagram
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex gap-2">
              {/* Add payment method icons here */}
              <div className="bg-white text-black px-3 py-1 rounded text-sm">Visa</div>
              <div className="bg-white text-black px-3 py-1 rounded text-sm">MC</div>
              <div className="bg-white text-black px-3 py-1 rounded text-sm">PayPal</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© 2024 XXXXX. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}