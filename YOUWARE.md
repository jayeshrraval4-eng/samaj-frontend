# YOUWARE.md - યોગી સમાજ સંબંધ Mobile Web App

## Project Overview

**યોગી સમાજ સંબંધ (Yogi Samaj Sambandh)** is a premium Gujarati matrimony and community mobile web application built for the Raval Yogi Samaj community. This is a **UI/UX-only implementation** with no backend functionality—all data is mocked and navigation is purely presentational.

**Project Type**: Mobile-first React Web Application (simulating native mobile experience)  
**Technology Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion  
**Language**: Gujarati (primary) + English (secondary)  
**Design System**: Premium UI with mint (#9FD7C1), deep blue (#0B4F6C), royal gold (#D4AF37)

## Project Status

✅ **Complete UI Implementation** - All 13 screens implemented  
✅ **Production Build Successful** - No build errors  
✅ **Navigation Wired** - React Router with bottom tabs and stack navigation  
✅ **Mock Data** - Static JSON data for demonstration purposes  
✅ **Responsive Design** - Mobile-first with touch-optimized interactions

## Architecture

### Screen Structure (13 Screens Total)

**Authentication Flow:**
1. **Splash Screen** (`/`) - Animated cinematic intro with gold handshake icon
2. **Login/Register Screen** (`/login`) - Tabbed interface with biometric options

**Main App (Bottom Tab Navigation):**
3. **Home Dashboard** (`/home`) - Feature cards grid with stats ribbon
4. **Matrimony Hub** (`/matrimony`) - 3-tab interface (Profile List, Detail, My Profile)
5. **Yogigram Feed** (`/yogigram`) - Social feed with posts and videos
6. **Messages Center** (`/messages`) - Chat rooms and private messages
7. **Profile Screen** (`/profile`) - User profile and account overview

**Stack Screens (Accessible from Dashboard):**
8. **Community Trust** (`/trust`) - Events, services, youth opinions
9. **Subscription Center** (`/subscription`) - Premium plans and benefits
10. **AI Assistant** (`/ai-assistant`) - Chat-based help interface
11. **Settings** (`/settings`) - Account preferences and configuration
12. **Notifications** (`/notifications`) - Activity and alerts center
13. **About/Help** (`/about`) - App info, contact, FAQ

### Directory Structure

```
src/
├── pages/              # All 13 screen components
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── MatrimonyScreen.tsx
│   ├── YogigramScreen.tsx
│   ├── MessagesScreen.tsx
│   ├── TrustScreen.tsx
│   ├── SubscriptionScreen.tsx
│   ├── AIAssistantScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── NotificationsScreen.tsx
│   └── AboutScreen.tsx
├── components/         # Reusable UI components
│   └── BottomNav.tsx   # Bottom tab navigation
├── theme/             # Design system
│   ├── colors.ts       # Brand color palette
│   ├── typography.ts   # Font system (Noto Sans Gujarati)
│   ├── spacing.ts      # 8-point spacing system
│   └── index.ts        # Theme exports
├── data/              # Mock data
│   └── mockData.ts     # Static JSON for profiles, posts, events
├── assets/            # Static resources
│   ├── icons/
│   └── images/
├── App.tsx            # Route configuration
└── index.css          # Global styles and Tailwind
```

## Design System

### Brand Colors
- **Mint**: `#9FD7C1` - Primary accent, CTAs, success states
- **Deep Blue**: `#0B4F6C` - Primary text, buttons, headers
- **Royal Gold**: `#D4AF37` - Premium features, trust balance, highlights
- **White**: `#FFFFFF` - Card backgrounds, clean surfaces

### Typography
- **Gujarati**: `Noto Sans Gujarati` (300-700 weights)
- **English**: `Inter` system font
- Semantic scale: display, heading, subtitle, body, label

### Component Patterns
- **Premium Cards**: White rounded-3xl with mint shadow
- **Gradient Icons**: 135deg gradient backgrounds for feature icons
- **Touch Targets**: Minimum 44px for all interactive elements
- **Animations**: Framer Motion for all transitions and micro-interactions

## Key Features

### Matrimony System
- **Profile List**: Searchable cards with filters and sorting
- **Profile Detail**: Comprehensive user information sections
- **My Profile**: Full profile creation form with photo upload UI
- **Kundali Indicator**: Green pill showing horoscope availability

### Social Features (Yogigram)
- **Feed**: Instagram-style posts with likes, comments, shares
- **Videos**: Vertical reels with overlay controls
- **Create Post**: Modal with media upload and toggle for regular/reel

### Messaging
- **Society General Chat**: Preview of community chat room
- **Private Chats**: Recent conversations with unread badges
- **Yogigram Interactions**: Likes, comments, follows activity
- **Chat Preview**: Inline conversation bubbles (mint/white/gold)

### Community Trust
- **Trust Balance**: Gold gradient card showing fund amount
- **Events**: Upcoming community gatherings with registration
- **Youth Opinion**: Feedback submission form

### Premium Features
- **Subscription Plans**: Monthly/Yearly with benefits list
- **AI Assistant**: Chat-based help with typing indicators
- **Notifications**: Activity center with icon categories

## Development Commands

```bash
# Install dependencies
npm install

# Development server (not used - platform builds directly)
npm run dev

# Production build (MANDATORY after changes)
npm run build
```

## Important Notes

### Platform Constraints
- This is a **mobile web application**, NOT native Expo/React Native
- Designed for Youware's web-first development platform
- All interactions are touch-optimized for mobile browsers
- Uses Vite + React, not React Native components

### Build Requirements
- **ALWAYS** run `npm run build` after code changes
- Build must succeed before task completion
- Asset paths use `/assets/` (production paths), not `src/assets/`

### Data Architecture
- All data is **mock/static** in `src/data/mockData.ts`
- No backend integration, API calls, or authentication logic
- Profile images from Unsplash for visual demonstration
- Ready for future backend without refactoring component structure

### Gujarati Content
- Primary language for all UI labels and content
- Font loaded via Google Fonts CDN
- `.gujarati` CSS class for proper rendering
- All form placeholders and buttons in Gujarati

## Future Backend Integration

When backend is needed, the following can be added without UI changes:
- User authentication (Firebase, Auth0, custom)
- Profile database (store matrimony profiles)
- Real-time messaging (Socket.io, WebSockets)
- Image uploads (Cloudinary, AWS S3)
- Payment integration (Razorpay, Stripe)
- Push notifications (FCB, OneSignal)

## Browser Support

Optimized for modern mobile browsers:
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## Special Considerations

### Mobile-First Approach
- All touch interactions tested on mobile viewports
- iOS safe area insets applied (safe-area-top/bottom)
- 16px inputs to prevent iOS zoom
- Scrollbar hidden for cleaner mobile UI

### Performance
- Lazy loading for images (native `loading="lazy"`)
- Framer Motion animations optimized for 60fps
- Production build includes code splitting
- Total bundle size: ~421KB JS + ~33KB CSS (gzipped: 114KB + 6KB)

### Accessibility
- Touch targets minimum 44x44px
- Color contrast meets WCAG AA standards
- Semantic HTML structure
- Screen reader friendly labels

---

**Version**: 1.0.0  
**Build Status**: ✅ Production Ready  
**Last Updated**: Generated from YOUWARE AI Platform
