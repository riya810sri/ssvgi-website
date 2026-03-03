import React from 'react';

export default function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <a href={link.href} className="flex items-center text-gray-300 hover:text-white transition-colors">
              <svg className="w-3 h-3 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              <span>{link.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
