# SSVGI Website - Modular React Application

A modern, responsive website for Shri Siddhi Vinayak Group of Institutions built with React and Tailwind CSS.

## Project Structure

```
ssvgi-website/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ChecklistItem.jsx
│   │   ├── DiscoverSection.jsx
│   │   ├── AwardImage.jsx
│   │   ├── AwardsSection.jsx
│   │   ├── InputField.jsx
│   │   ├── ContactSection.jsx
│   │   ├── FooterLinkColumn.jsx
│   │   └── MegaFooter.jsx
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Tailwind CSS and its dependencies:
```bash
npm install -D tailwindcss postcss autoprefixer
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Components

- **Header**: Navigation bar with responsive mobile menu
- **Hero**: Main banner section with call-to-action buttons
- **DiscoverSection**: About section with vision and mission
- **AwardsSection**: Showcase of awards and faculty achievements
- **ContactSection**: Contact form and details
- **MegaFooter**: Comprehensive footer with links and contact info

## Features

- ✅ Fully modular component architecture
- ✅ Responsive design (mobile-first)
- ✅ Tailwind CSS for styling
- ✅ Clean and maintainable code structure
- ✅ Reusable components
- ✅ Easy to extend and customize

## Customization

Replace placeholder images in components with actual images by updating the `src` attributes.
Update links in navigation and footer by modifying the `href` values.
Customize colors and styles in `tailwind.config.js`.
