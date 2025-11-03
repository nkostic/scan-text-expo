# 📸 Scan Text App

<div align="center">

A powerful, open-source React Native mobile app for scanning and extracting text from images using OCR (Optical Character Recognition).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.20-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## ✨ Features

- 📷 **Camera with Guide Overlay** - Align text perfectly with visual guides
- 🔍 **High-Accuracy OCR** - Extract text from images with detailed debugging
- 📋 **Copy to Clipboard** - One-tap copy for easy sharing
- 🔒 **Privacy-First** - Photos automatically deleted after processing
- ⚡ **Real-time Processing** - Fast OCR with progress indicators
- 🐛 **Debug Mode** - Detailed network logs and API response analysis
- 🎨 **Clean UI** - Modern, intuitive interface
- 🌐 **Cross-Platform** - Works on iOS, Android, and Web

## 🎬 Demo

**Scan with Guide:**

- Professional camera interface with alignment guides
- Green corner markers for precise framing
- Darkened overlay for clear guidance

**Quick Scan:**

- Instant photo capture with built-in cropping
- Fast processing for simple documents

## 🚀 Installation

### Prerequisites

- Node.js 18+ and pnpm
- Expo Go app (for testing on physical device)
- iOS Simulator or Android Emulator (optional)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/scan-text-app.git
   cd scan-text-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your OCR.space API key (optional)
   # If you skip this step, the app will use a demo API key with rate limits
   ```

   Get your free API key at [OCR.space](https://ocr.space/ocrapi) (25,000 requests/month free tier)

4. **Start the development server**

   ```bash
   pnpm start
   ```

5. **Run on your device**
   - **Mobile**: Scan QR code with Expo Go app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Web Browser**: Press `w` in terminal

## 📱 Usage

### Basic Workflow

1. **Scan with Guide** (Recommended)

   - Tap "📷 Scan with Guide" button
   - Camera opens with alignment overlay
   - Position text within the square guide
   - Tap capture button
   - Text appears automatically

2. **Quick Scan** (Alternative)

   - Tap "Quick Scan (No Guide)"
   - Take photo and crop as needed
   - Text is extracted and displayed

3. **Copy & Share**
   - Review extracted text
   - Tap "📋 Copy to Clipboard"
   - Paste anywhere on your device

### Debug Mode

Check the browser console or debug panel for:

- OCR API response times
- Image quality scores
- Confidence levels
- Error details

## 🔧 Configuration

### Environment Variables

The app uses environment variables for configuration. Edit your `.env` file:

```bash
# Required: Your OCR.space API key
# Get one free at https://ocr.space/ocrapi (25,000 requests/month)
OCR_API_KEY=your_api_key_here

# Optional: Enable debug logging
DEBUG=false

# Optional: OCR Engine (1=faster, 2=more accurate)
OCR_ENGINE=2

# Optional: OCR Language (eng, spa, fra, deu, etc.)
OCR_LANGUAGE=eng
```

**Note:** If you don't set `OCR_API_KEY`, the app will use a demo key with rate limits.

### Customization

**Camera Guide Dimensions** (`app/camera.tsx`):

```typescript
const GUIDE_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen
const GUIDE_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% of screen
```

**OCR Settings** (`app/index.tsx`):

```typescript
formData.append("language", "eng"); // Language: eng, spa, fra, etc.
formData.append("OCREngine", "2"); // Engine: 1 or 2
formData.append("scale", "true"); // Image scaling
formData.append("detectOrientation", "true"); // Auto-rotate
```

## 🏗️ Tech Stack

| Category            | Technology          |
| ------------------- | ------------------- |
| **Framework**       | React Native 0.81.5 |
| **Platform**        | Expo ~54.0.20       |
| **Routing**         | Expo Router ~6.0.14 |
| **Language**        | TypeScript 5.9.2    |
| **Camera**          | expo-camera 17.0.8  |
| **OCR**             | OCR.space API       |
| **HTTP Client**     | axios 1.13.1        |
| **Package Manager** | pnpm                |

## 📂 Project Structure

```
scan-text-app/
├── app/
│   ├── index.tsx          # Main scanner screen
│   ├── camera.tsx         # Camera with guide overlay
│   └── _layout.tsx        # App navigation layout
├── assets/                # Images, fonts, icons
├── components/            # Reusable UI components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
│   └── env.d.ts          # Environment variable types
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── LICENSE               # MIT License
├── README.md             # This file
├── CONTRIBUTING.md       # Contribution guidelines
└── CODE_OF_CONDUCT.md    # Community guidelines
```

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

**Quick Start for Contributors:**

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🐛 Known Issues

- **Web platform**: Camera guide overlay not available (uses standard image picker)
- **OCR.space free tier**: Limited to 25,000 requests/month
- **Image quality**: Poor lighting or blurry images may reduce accuracy

## 🗺️ Roadmap

- [x] Environment variable support for API keys ✅
- [ ] Multiple OCR provider support (AWS Textract, Google Vision)
- [ ] Offline OCR with Tesseract.js
- [ ] Multi-language support UI
- [ ] Batch processing
- [ ] Text editing before copy
- [ ] History/favorites
- [ ] Dark mode
- [ ] Export to PDF/TXT

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Amazing React Native framework
- [OCR.space](https://ocr.space/) - Free OCR API
- [React Native Community](https://reactnative.dev/) - Excellent documentation

## 📧 Contact

**Project Maintainer**: Nenad Kostic

- GitHub: [@nkostic](https://github.com/nkostic)

**Project Link**: [https://github.com/nkostic/scan-text-expo](https://github.com/nkostic/scan-text-expo)

---

<div align="center">

**Built with ❤️ using React Native & Expo**

If you found this helpful, please ⭐ star the repo!

</div>
