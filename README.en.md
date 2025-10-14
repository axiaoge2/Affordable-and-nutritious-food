# ChiHao - Value-for-Money Food Recommendation Platform

English | [简体中文](./README.md)

A web application designed for students that recommends high value-for-money food through an exciting blind box experience.

## Features

- **🎲 Blind Box Experience** - Each draw is a surprise, solving decision fatigue
- **💰 Great Value** - Curated high value-for-money food specifically for students
- **🎯 Smart Recommendations** - Intelligent algorithm based on user preferences
- **😊 Emotional Value** - Focus on the emotional experience food brings
- **🍎 Apple-Style UI** - Clean and elegant design aesthetic

## Tech Stack

- **React 19** + **TypeScript** - Type-safe frontend framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Powerful animation library

## Quick Start

### 1. Install Dependencies

```bash
cd chihao-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to view the app

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # React components
│   ├── BlindBox.tsx       # Blind box draw component
│   └── FeedbackPanel.tsx  # Feedback panel component
├── data/            # Data files
│   └── mockFoods.ts       # Mock food data
├── types/           # TypeScript type definitions
│   └── food.ts            # Food-related types
├── utils/           # Utility functions
│   └── recommendation.ts  # Recommendation algorithm
├── App.tsx          # Main app component
├── main.tsx         # App entry point
└── index.css        # Global styles
```

## Core Features

### 1. Blind Box Draw
- Cool drawing animations
- Fully random (initial) or preference-based (after 5 interactions)
- Unlimited draws per day

### 2. Smart Recommendation Algorithm
- Category preference weight (30%)
- Emotion tag matching (30%)
- Price range matching (20%)
- Value-for-money score (20%)

### 3. User Preference Tracking
- Local storage of user interaction history
- Real-time preference weight updates
- Keeps last 100 interaction records

### 4. Emotional Value Experience
- 6 emotion tags: Happy, Comfort, Energetic, Relaxing, Nostalgic, Exciting
- Users can tag emotions for food they like
- Optimize recommendations based on emotional feedback

## Data Extension

Currently uses mock data (15 food items), can be connected to real APIs in the future.

## Screenshots

<div align="center">
  <img src="./docs/screenshots/home.png" alt="Home Page" width="600"/>
  <p><em>Blind Box Draw Main Interface</em></p>
</div>

## Documentation

- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Git Guide](./GIT_GUIDE.md)

## Contributing

Issues and Pull Requests are welcome!

## License

MIT © 2025
