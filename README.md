# Recur - Recurring Expense Tracker

A premium, privacy-focused recurring expense tracker built with Vue 3 and Tailwind CSS. **Recur** helps you visualize your subscription habits through a beautiful heatmap dashboard and provides tools to manage and share your spending profile.

## Features

- **🚀 Heatmap Dashboard**: A dynamic grid layout where cards resize based on their yearly cost, creating a visual "heatmap" of your expenses.
- **🌍 Multi-language Support**: Localized in 4 languages: English, Thai (ภาษาไทย), German (Deutsch), and Chinese (简体中文).
- **📝 Expense Management**: Easily add, edit, and delete recurring expenses with custom frequencies (Daily, Monthly, Yearly, One-time).
- **🔍 Browse Subscriptions**: A curated list of popular subscription services (Netflix, Spotify, etc.) that you can add with a single click.
- **🔒 Privacy First**: All data is stored locally in your browser's LocalStorage. No accounts, no servers, and no data tracking.
- **📸 Social Export**: Export your spending grid as a high-quality image to share on social media.
- **🎨 Modern Design**: Sleek, responsive UI inspired by premium aesthetics, with full dark mode support and vibrant category themes.

## Tech Stack

- **Core**: [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [PrimeVue v4](https://primevue.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Internationalization**: [Vue I18n](https://vue-i18n.intlify.dev/)
- **Image Generation**: [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)

## How to Use

### 1. Installation
Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Development
Start the development server:

```bash
npm run dev
```

### 3. Adding Expenses
- Click **"Browse Subscriptions"** to pick from a list of popular services.
- Go to the **"Expenses"** tab to manually add your own recurring costs.

### 4. Customization
- Go to **"Settings"** to change your preferred currency symbol and display language.
- Toggle between Light and Dark mode based on your system preferences.

### 5. Exporting
Open the **Dashboard** and click the **"Export as Image"** button to download a beautiful PNG of your spending profile.

## Development Sharing & Insights

This project was built focusing on the synergy between **Tailwind CSS v4** and **PrimeVue**. The "Heatmap" dashboard logic uses a relative weighting system:
- **Large (2x2 grid)**: Expenses representing ≥60% of your highest bill.
- **Medium (2x1 grid)**: Expenses representing ≥30% of your highest bill.
- **Standard (1x1 grid)**: Lower-cost recurring items.

The export functionality leverages `dom-to-image-more` to capture complex modern CSS (like `oklch` color functions and CSS Grid) which traditional libraries like `html2canvas` often struggle with.
