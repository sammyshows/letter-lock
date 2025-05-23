# LetterLock Puzzle

Welcome to **LetterLock Puzzle** – a word game with a twist! This is a cross-platform puzzle app built with [Nuxt 3](https://nuxt.com/), [Capacitor](https://capacitorjs.com/), and a dash of mobile magic. Whether you’re a developer, a puzzle enthusiast, or just curious, this README will walk you through what makes LetterLock tick, from gameplay to the tech stack powering it.

---

## 🧩 What is LetterLock Puzzle?

LetterLock is a grid-based word puzzle game. Players are presented with a grid of letter tiles, some blank, some filled, and must rearrange them to form valid words. Each level has a unique solution (or several!), and the challenge ramps up as you progress.

- **Grid-based gameplay:** Drag and drop tiles to form words.
- **Levels:** 50+ handcrafted puzzles, each with its own grid, par, and valid word list.
- **Lives & Moves:** Limited lives and moves per level, with ways to regain them.
- **Leaderboard:** Compete with others and see how you stack up.
- **Offline support:** Play anywhere, anytime.

---

## 🕹️ Gameplay Flow

1. **Start a Level:** The app loads a grid of tiles (`Tile[]`), some with letters, some empty.
2. **Make Moves:** Drag tiles to rearrange them. Each move counts!
3. **Form Words:** The app checks for valid words in rows and columns after each move.
4. **Beat the Level:** Complete the level within the allowed moves to win and progress.
5. **Track Progress:** Your stats, streaks, and best scores are saved locally and synced to the leaderboard.

---

## 🏗️ Technical Overview

### Core Technologies

- **Nuxt 3:** The app’s frontend is built with Nuxt 3, using Vue 3 and the Composition API for a modern, reactive UI.
- **Capacitor:** Bridges the web app to native iOS and Android features (like device info, preferences, and ads).
- **Pinia:** State management for game data, user settings, and more.
- **Tailwind CSS:** For fast, responsive, and beautiful UI styling.
- **Firebase Analytics:** Custom plugin integration for event tracking and analytics.
- **AdMob & Facebook SDK:** Monetization and attribution.

### Key Features & Architecture

- **State Management:** All game state (levels, lives, settings, stats) is managed in Pinia stores and persisted with Capacitor Preferences.
- **Level Data:** Levels are defined in a giant object, each with its own grid, par, and valid words.
- **Leaderboard:** Stats are synced to a remote server and leaderboard via Axios.
- **Custom Plugins:** Native plugins for Firebase Analytics and ad attribution are included for both Android and iOS.
- **Offline-First:** The app works offline, syncing stats and progress when a connection is available.
- **Cross-Platform:** Runs as a PWA, Android, and iOS app with a single codebase.

### Notable Files & Structure

- `app.vue` – The root app shell, handles global state loading and event listeners.
- `stores/game.ts` – The heart of the game logic and state.
- `helpers/levels.ts` – All the level definitions live here.
- `helpers/index.ts` – Utility functions, like random username generation.
- `capacitor.config.json` – Capacitor project config for native builds.
- `android/` and `ios/` – Native project folders for Android and iOS, including custom plugins and config.

---

## 🧑‍💻 Developer Notes

- **Extensible:** Add new levels by editing `helpers/levels.ts`.
- **Custom Analytics:** Native plugins for Firebase Analytics are implemented for both platforms.
- **Ad Integration:** AdMob and Facebook SDKs are set up for monetization and attribution.
- **Usernames:** Fun, random usernames are generated for every player (see `helpers/index.ts`).

---

## 🎉 Fun Facts

- The app generates usernames like “Jolly Penguin” or “Witty Fox” for every player.
- All game logic is written in TypeScript, making it easy to extend and maintain.
- The leaderboard is global, but your progress is always saved locally, so you never lose your streak.

---

## 🤝 Contributing

Want to add a new feature, fix a bug, or create more levels? PRs are welcome! Just make sure to keep the code fun, clean, and well-documented.

---

## 📣 Final Words

LetterLock Puzzle is more than just a word game – it’s a showcase of modern web and mobile development, blending the best of Nuxt, Capacitor, and native integrations. Dive into the code, play a few levels, and maybe even add your own twist!

Happy puzzling! 🧩✨