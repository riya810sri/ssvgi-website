import React from 'react';
import FooterLinkColumn from './FooterLinkColumn';

export default function MegaFooter() {
  const footerLinks = {
    'About SSVGI': [
      { name: 'About Us', href: '#' },
      { name: 'Our Vision', href: '#' },
      { name: 'Our Mission', href: '#' },
      { name: 'Rules & Regulations', href: '#' },
      { name: 'Advisory Board', href: '#' },
      { name: 'Approvals', href: '#' },
    ],
    'Admission': [
      { name: 'Admission Process', href: '#' },
      { name: 'Form Download', href: '#' },
      { name: 'Eligibility', href: '#' },
      { name: 'Apply Online', href: '#' },
      { name: 'Career@SSVGI', href: '#' },
    ],
    'Message': [
      { name: "Chairman's Message", href: '#' },
      { name: "VC's Message", href: '#' },
      { name: "MD's Message", href: '#' },
    ],
    'Faculty': [
      { name: 'Faculty Of Management', href: '#' },
      { name: 'Faculty Of AppSc', href: '#' },
      { name: 'Faculty Of CS/IT', href: '#' },
      { name: 'Faculty Of EC & EE', href: '#' },
      { name: 'Faculty Of ME & Civil', href: '#' },
      { name: 'Faculty Of Polytechnic', href: '#' },
    ],
    'Students Club': [
      { name: 'Gladiators : The Sports Club', href: '#' },
      { name: 'Oasis : The Cultural Club', href: '#' },
      { name: 'Kalanjali: The Literary and Fine Arts Club', href: '#' },
      { name: 'Rotract: The Social Club', href: '#' },
      { name: 'Gizmofreaks : The Technical and Management Club', href: '#' },
    ],
  };

  return (
    <footer className="bg-purple-900 text-gray-300 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <FooterLinkColumn title="About SSVGI" links={footerLinks['About SSVGI']} />
          <FooterLinkColumn title="Admission" links={footerLinks['Admission']} />
          <FooterLinkColumn title="Message" links={footerLinks['Message']} />
        </div>

        <div className="border-t border-purple-700 my-10"></div>

        {/* Faculty and Students Club Section with Increased Width */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FooterLinkColumn title="Faculty" links={footerLinks['Faculty']} />
            <FooterLinkColumn title="Students Club" links={footerLinks['Students Club']} />
          </div>
        </div>

        <div className="border-t border-purple-700 my-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  10th Km. Bareilly - Nainital Road, Near - Dohna Railway Station, Bareilly, Uttar Pradesh
                </span>
              </div>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 mr-3 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91-7599-471-144</span>
              </div>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 mr-3 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@ssvgi.org</span>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Shri Siddhi Vinayak Group of Institutions. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
