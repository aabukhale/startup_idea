# 🌙 fadfdaa

> A private late-night venting app — express how you feel, lock it as a time capsule, and rediscover it later.

---

## 💡 What is fadfdaa?

fadfdaa is a mobile app that gives you a safe, completely private space to express your feelings before bed. You can write, record audio, or record a video — then lock it as a time capsule for a week, a month, 6 months, or a year. You can't open it until the time is up.

It's built for people who think too much at night and have no one to talk to.

---

## ✨ Features

- 🎭 **Mood check-in** — Choose how you're feeling before you vent (Heavy, Confused, Tired, Okay)
- ✍️ **3 ways to vent** — Write, record audio, or record video
- 🔒 **Time capsule** — Lock your entry for 1 week / 1 month / 6 months / 1 year
- 💬 **Message to future you** — Write something to yourself before locking
- 🌿 **You're not alone** — See how many others are venting tonight (anonymously)
- 📦 **My Capsules** — View all your locked and unlocked capsules

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo |
| Audio Recording | expo-av |
| Camera / Video | expo-camera |
| Navigation | React useState (screen-based) |
| Backend (coming soon) | Firebase |

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Expo Go app on your phone (iOS or Android)
- Mac, Windows, or Linux

### Installation

```bash
# 1. Clone the project
git clone https://github.com/your-username/fadfdaa.git
cd fadfdaa

# 2. Install dependencies
npm install

# 3. Install Expo packages
npx expo install expo-av expo-camera react-dom react-native-web

# 4. Start the app
npx expo start
```

### Running on your phone

1. Make sure your phone and computer are on the **same WiFi network**
2. Run `npx expo start --lan`
3. Open **Expo Go** on your phone
4. Scan the QR code

### Running on browser (for UI testing)

```bash
npx expo start --web
```

---

## 📱 Screens

| Screen | Description |
|---|---|
| Home | Mood selection + start venting |
| Vent | Choose write / audio / video, add message to future self, lock duration |
| My Capsules | View locked and unlocked capsules |

---

## 🔮 Coming Soon

- [ ] Firebase integration — save capsules to the cloud
- [ ] Push notification when a capsule unlocks
- [ ] Mood timeline — see how your feelings changed over time
- [ ] Nature sounds — rain, ocean, wind
- [ ] Authentication — sign in with Apple / Google

---

## 👨‍💻 Author

Built by Anwar Aloyoun Abu Khaled.

---