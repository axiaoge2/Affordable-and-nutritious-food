# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"吃好" (Chihao) is a student-focused food recommendation web app that uses a blind-box mechanic to suggest high-value meals. Built with React 19, TypeScript, Tailwind CSS, and Framer Motion, featuring an Apple-inspired UI design.

**Key Feature**: Smart recommendation algorithm that learns from user interactions. After 5+ interactions, recommendations shift from random to preference-based matching.

## Project Structure

```
chihao-app/
├── src/
│   ├── components/          # React components
│   │   ├── BlindBox.tsx           # Core blind box draw UI (3-state cycle)
│   │   ├── FeedbackPanel.tsx      # Like/dislike + emotion feedback
│   │   ├── FoodDetailModal.tsx    # Full-screen food details modal
│   │   ├── Toast.tsx              # Notification system
│   │   ├── FloatingActionButton.tsx
│   │   └── ParticleBackground.tsx
│   ├── data/                # Data layer
│   │   └── mockFoods.ts           # 15 mock food entries
│   ├── types/               # TypeScript definitions
│   │   └── food.ts                # Food, UserPreference, EmotionTag types
│   ├── utils/               # Business logic
│   │   ├── recommendation.ts      # Core matching algorithm
│   │   ├── confetti.ts            # Celebration effects
│   │   ├── history.ts             # Draw tracking & statistics
│   │   └── scrollReveal.ts        # Scroll animations
│   ├── App.tsx              # Main app (state coordinator)
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles + Tailwind
├── public/                  # Static assets
├── dist/                    # Build output (generated)
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Custom Apple theme
├── tsconfig.json            # TypeScript config
├── eslint.config.js         # ESLint flat config
└── README.md                # User-facing docs (Chinese + English)
```

## Essential Commands

```bash
# Development
cd chihao-app
npm install                # First-time setup (3-5 minutes)
npm run dev                # Start dev server at http://localhost:5173
npm run build              # TypeScript compilation + production build
npm run preview            # Preview production build
npm run lint               # ESLint code check

# Debugging
npx tsc --noEmit          # Check TypeScript errors without building

# Troubleshooting
npm cache clean --force   # Clear npm cache if install fails
rm -rf node_modules package-lock.json && npm install  # Clean reinstall
```

## Architecture & Core Systems

### 1. Recommendation Algorithm (src/utils/recommendation.ts)

The heart of the app. Calculates food match scores using weighted criteria:

- **Category preference** (30%): Tracks which food categories users like
- **Emotion tag matching** (30%): Matches emotional preferences (开心, 治愈, etc.)
- **Price range matching** (20%): Adapts to preferred price points
- **Value score** (20%): Base pricePerformanceScore from food data

**Critical thresholds**:
- < 5 interactions: Pure random selection
- ≥ 5 interactions: Weighted recommendation (top 30% by score, weighted random selection)

**User preference storage**: LocalStorage key `chihao_user_preference` contains:
- Category weights (incremented by 0.2 on like)
- Emotion weights (incremented by 0.3 per tag, +0.5 bonus for explicit feedback)
- Price range (adjusts ±2 based on liked items)
- Last 100 interactions

### 2. Component Architecture

**BlindBox.tsx**: Manages the 3-state animation cycle:
1. Initial state (pulsing ? icon with halo effect)
2. Drawing state (2s spinning gift animation with 8 rotating particles)
3. Result state (12 firework particles + 3D card flip + 0.5s delay)

Animation enhancements (2025-10-14):
- Pulsing halo on blind box button
- Multi-layer light effects
- Gradient background (blue-purple-pink)
- "Draw Again" button with breathing glow

**FeedbackPanel.tsx**: Dual-mode feedback with advanced animations:
- Simple: Like/Dislike buttons (hover rotation ±5°, ripple effects)
- Enhanced: 6 emotion tags (开心, 治愈, 元气, 放松, 怀旧, 刺激)
  - Rotate-in animation with stagger delay
  - Hover: float 5px + scale 1.15x
  - Sweep shine effect (2s loop)
  - Emoji wobble on hover

**App.tsx**: Central state management:
- Coordinates BlindBox → FeedbackPanel flow
- Manages stats panel visibility
- Handles all interaction recording
- Integrates Toast, Confetti, and History systems

**Toast.tsx**: Notification system (NEW):
- 4 types: success, error, warning, info
- Auto-dismiss (default 3s)
- Progress bar indicator
- Stackable notifications

**FoodDetailModal.tsx**: Full-screen modal (NEW):
- Gradient header decoration
- 5-star rating with animation
- Price comparison cards
- Click outside to close

### 3. Utility Systems

**confetti.ts** (NEW): Celebration effects
- Physics simulation (gravity, velocity decay)
- Random colors and sizes
- Dual explosion effect
- Auto DOM cleanup

**history.ts** (NEW): Tracking system
- Records every draw with timestamp
- Stores like/dislike status
- Tracks emotion feedback
- Max 50 records (FIFO)
- Statistics: total draws, like ratio, 7-day trend, favorite category/emotion

**scrollReveal.ts**: Scroll-triggered animations (if exists)

### 4. Type System (src/types/food.ts)

**Food interface** includes:
- `pricePerformanceScore`: 1-10 rating (critical for recommendations)
- `emotionTags`: Array of EmotionTag enum values
- `originalPrice`: Optional, for displaying savings

**UserPreference interface**:
- Stores category/emotion weights as Records (not arrays)
- Maintains price range as tuple [min, max]

### 5. Data Layer (src/data/mockFoods.ts)

15 mock foods with complete metadata. When adding foods:
- Ensure unique string IDs
- Include at least 1-2 emotionTags for algorithm effectiveness
- Set realistic pricePerformanceScore (affects recommendations)
- Use FoodCategory and EmotionTag enums (not plain strings)

### 6. Styling System

**Tailwind config** (tailwind.config.js):
- Custom `apple-*` color palette (gray scale + blue/green/orange/red)
- Custom utilities: `card-apple`, `btn-apple`, `shadow-apple`
- Apple system font stack

**CSS conventions**:
- Gradient buttons: `from-apple-blue to-purple-500`
- Cards: `card-apple` class (18px radius, subtle shadow)
- Backdrop blur on header: `backdrop-blur-md`

## Key Behaviors to Preserve

1. **Hot Module Replacement**: Vite auto-reloads on save, never restart dev server manually. If HMR fails, use `touch <file>` to trigger reload.
2. **Type imports**: Use `import type { Food }` for types, regular `import { FoodCategory }` for enums
3. **Animation timing**: BlindBox 2s draw + 0.5s reveal is tuned for perceived randomness
4. **LocalStorage persistence**: Never clear user data without explicit user action
5. **Interaction recording**: Only increment weights on `liked: true`, never on dislikes
6. **Motion components**: Always use `<motion.div>` with matching `</motion.div>` closing tags (not `</div>`)
7. **Confetti triggers**: Only on like/emotion actions, not on dislikes
8. **Toast notifications**: Show for all user actions (draw success, like/dislike, emotion marking)
9. **History tracking**: Record every draw automatically via `addToHistory()` in App.tsx

## Common Development Tasks

### Adjusting Recommendation Weights
Edit `calculateMatchScore()` in src/utils/recommendation.ts:
```typescript
// Example: Increase emotion importance
score += emotionScore * 0.4;  // Changed from 0.3
score += categoryScore * 0.2;  // Reduced from 0.3
```

### Adding New Foods
Add to `mockFoods` array in src/data/mockFoods.ts:
- Always use enum values: `FoodCategory.LUNCH`, `EmotionTag.HAPPY`
- Include both `price` and `originalPrice` for discount display
- Set `pricePerformanceScore` 7-10 for student-friendly items

### Modifying UI Colors
Edit `colors.apple` in tailwind.config.js, or use Tailwind classes directly:
- Primary actions: `bg-apple-blue`
- Success states: `bg-apple-green`
- Neutral UI: `bg-apple-gray-100/200`

### Testing Recommendation Algorithm
Browser console commands:
```javascript
// View current preferences
localStorage.getItem('chihao_user_preference')

// Reset for testing
localStorage.removeItem('chihao_user_preference')

// Check stats (must import in code)
getUserStats()

// View history
localStorage.getItem('chihao_food_history')

// Clear history
localStorage.removeItem('chihao_food_history')
```

### Triggering Confetti Effect
```typescript
import { celebrateSuccess } from './utils/confetti';

// Trigger dual explosion
celebrateSuccess();
```

### Using Toast Notifications
```typescript
// In App.tsx, Toast is already integrated
showToast('操作成功！', 'success');
showToast('发生错误', 'error');
showToast('警告信息', 'warning');
showToast('提示信息', 'info');
```

### Adding to History
```typescript
import { addToHistory } from './utils/history';

// Record a draw
addToHistory(food, true, ['开心', '治愈']);

// Get statistics
const stats = getHistoryStats();
// Returns: { totalDraws, likedCount, likeRatio, last7Days, favoriteCategory, favoriteEmotion }
```

## Important Technical Details

- **React 19**: Uses new React features, ensure compatibility when adding libraries
- **Framer Motion**: All animations use `motion.*` components, avoid plain HTML elements for animated content
  - Common bug: Mixing `<motion.div>` with `</div>` closing tag causes JSX errors - always match motion tags
  - Animation props: `initial`, `animate`, `exit`, `whileHover`, `whileTap`, `transition`
- **TypeScript strict mode**: `tsc -b` runs before `vite build`, fix type errors before build completes
- **No backend**: Fully client-side, uses LocalStorage for persistence
  - Keys: `chihao_user_preference` (user prefs), `chihao_food_history` (draw history)
- **No routing**: Single-page app, no React Router needed
- **ESLint config**: Flat config format (eslint.config.js), using recommended presets from @eslint/js, typescript-eslint, react-hooks, react-refresh

## File Import Conventions

```typescript
// Types (no runtime code)
import type { Food, UserPreference } from './types/food';

// Enums and values (runtime code)
import { FoodCategory, EmotionTag } from './types/food';

// Components
import BlindBox from './components/BlindBox';

// Utilities
import { recommendFood, recordInteraction } from './utils/recommendation';
```

## Deployment Notes

Build output goes to `dist/`:
- `index.html`: Entry point
- `assets/*.js`: Bundled JavaScript (code-split by Vite)
- `assets/*.css`: Bundled styles

SPA configuration required: All routes must serve `index.html` (though app has no routing currently).

Recommended platforms: Vercel, Netlify (zero-config deployment).

Build troubleshooting:
- If build fails, check `npx tsc --noEmit` for type errors first
- Large bundle? Check if Framer Motion tree-shaking is working
- HMR cache issues? Delete `node_modules/.vite` directory

## Animation Performance Best Practices

Based on optimization work (2025-10-14):

1. **GPU-accelerated properties**: Use `transform` (scale, rotate, translate) and `opacity` only
2. **Avoid layout shifts**: Never animate `width`, `height`, `margin`, `padding` - use `transform: scale()` instead
3. **Particle limits**: Keep particle counts 8-12 for smooth 60fps on mobile
4. **will-change**: Add to elements with complex animations, remove after animation completes
5. **Stagger delays**: Use 50-100ms between elements in staggered animations
6. **Auto-cleanup**: Always remove DOM elements and event listeners when animations complete (see confetti.ts)

## Common Bugs and Solutions

### JSX Tag Mismatch (BlindBox.tsx line 385, fixed 2025-10-14)
**Problem**: `<motion.div>` closed with `</div>` instead of `</motion.div>`
**Solution**: Always match Framer Motion component tags exactly
**Prevention**: Use editor bracket matching; search for `<motion\.` and verify closing tags

### Type Import Errors
**Problem**: Importing types with regular import causes build errors
**Solution**:
```typescript
// ✓ Correct
import type { Food, UserPreference } from './types/food';
import { FoodCategory, EmotionTag } from './types/food';

// ✗ Wrong
import { Food, UserPreference, FoodCategory } from './types/food';
```

### Framer Motion v11+ Variants Import Error (Fixed 2025-10-16)
**Problem**: `Uncaught SyntaxError: does not provide an export named 'Variants'`
**Cause**: Framer Motion v11 removed `Variants` as a named export
**Solution**: Use `Variant` (singular) with type import and define `Variants` manually
```typescript
// ✗ Wrong (causes runtime error)
import { Variants } from 'framer-motion';

// ✓ Correct
import type { Variant } from 'framer-motion';
type Variants = { [key: string]: Variant };
```
**Location**: src/utils/scrollReveal.ts line 2

### LocalStorage Quota Exceeded
**Problem**: Storing too many interactions (>100) or history (>50)
**Solution**: Both systems auto-trim (recommendation.ts line 102, history.ts max 50)
**Check**: Monitor storage size with `JSON.stringify(localStorage).length`

### Animation Jank
**Problem**: Stuttering animations on lower-end devices
**Solution**:
- Reduce particle count in confetti.ts (line ~20)
- Increase animation durations (200ms → 300ms)
- Disable complex animations on mobile (use media queries)
