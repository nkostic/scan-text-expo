# Text Scanner App - OCR POC

A simple React Native Expo app that scans text from photos using OCR (Optical Character Recognition).

## Features

- Take a photo using your device camera
- Automatically extract text from the photo using OCR.space API
- Display extracted text on screen
- Copy extracted text to clipboard
- Automatically delete photos after processing

## Tech Stack

- **React Native** with **Expo**
- **expo-camera** - Camera functionality
- **expo-image-picker** - Image capture
- **expo-clipboard** - Copy to clipboard
- **expo-file-system** - File management
- **OCR.space API** - Free OCR service (25,000 requests/month)

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

3. Run on your device:
   - Scan the QR code with **Expo Go** app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Usage

1. Tap the "Scan Text" button
2. Allow camera permissions when prompted
3. Take a photo of text you want to extract
4. Wait for OCR processing (usually 2-5 seconds)
5. View the extracted text on screen
6. Tap "Copy to Clipboard" to copy the text
7. Paste the text anywhere on your phone

## Important Notes

- **Camera Permission**: The app will request camera access on first use
- **Internet Required**: OCR processing requires an internet connection
- **Photo Privacy**: Photos are automatically deleted after text extraction
- **API Limits**: Free tier allows 25,000 requests/month via OCR.space

## API Key

The app uses a free OCR.space API key included in the code. For production use, you should:
1. Register at https://ocr.space/ocrapi
2. Get your own API key
3. Replace the key in `app/index.tsx`

## File Structure

```
app/
├── index.tsx       # Main scanner screen
└── _layout.tsx     # App layout configuration
```

## Future Enhancements

- Support for multiple languages
- Batch processing of multiple photos
- History of scanned texts
- Export to different formats (PDF, TXT)
- Offline OCR using on-device processing
