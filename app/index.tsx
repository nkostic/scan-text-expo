import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { readAsStringAsync, getInfoAsync, deleteAsync } from 'expo-file-system/legacy';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { OCR_API_KEY as ENV_OCR_API_KEY } from '@env';

/**
 * OCR Configuration
 *
 * The API key is loaded from environment variables (.env file).
 * If no .env file exists, it falls back to a demo key with rate limits.
 *
 * To use your own API key:
 * 1. Copy .env.example to .env
 * 2. Sign up for a free API key at https://ocr.space/ocrapi
 * 3. Add your key to .env: OCR_API_KEY=your_key_here
 * 4. Restart the development server
 */
const OCR_API_KEY = ENV_OCR_API_KEY || 'K87899142388957'; // Fallback to demo key

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoUri, setPhotoUri] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const params = useLocalSearchParams<{ photoUri?: string }>();

  // Handle photo URI from camera screen
  useEffect(() => {
    if (params.photoUri && params.photoUri !== photoUri) {
      console.log('Received photo URI from camera:', params.photoUri);
      setPhotoUri(params.photoUri);
      processImage(params.photoUri);
    }
  }, [params.photoUri]);

  const handleScanWithGuide = async () => {
    // Navigate to custom camera screen with guide
    router.push('/camera');
  };

  const handleScanText = async () => {
    // Request camera permissions
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to scan text.');
        return;
      }
    }

    // Launch camera
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true, // Allow cropping for better framing
        aspect: [4, 3],
        quality: 1, // Maximum quality
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        await processImage(uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    setExtractedText('');
    setDebugInfo('');

    try {
      console.log('📸 Processing image:', uri);
      let base64Data = '';

      // Read the image file as base64
      if (Platform.OS === 'web') {
        console.log('🌐 Web platform detected, using fetch + FileReader');
        // For web, fetch the blob and convert to base64
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log('📦 Blob size:', blob.size, 'bytes, type:', blob.type);

        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix
            const base64 = result.split(',')[1];
            console.log('✅ Base64 conversion complete, length:', base64.length);
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        console.log('📱 Native platform detected, using FileSystem');
        // For native platforms, use FileSystem
        base64Data = await readAsStringAsync(uri, {
          encoding: 'base64',
        });
        console.log('✅ Base64 read complete, length:', base64Data.length);
      }

      // Call OCR.space API with optimized settings
      console.log('🚀 Sending request to OCR.space API...');
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64Data}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2'); // Engine 2 is more accurate
      formData.append('isTable', 'false');

      const startTime = Date.now();
      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        {
          headers: {
            'apikey': OCR_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      const duration = Date.now() - startTime;

      console.log('⏱️  OCR API response time:', duration, 'ms');
      console.log('📊 Full API Response:', JSON.stringify(response.data, null, 2));

      // Build debug info
      let debugText = `🔍 DEBUG INFO\n`;
      debugText += `Response Time: ${duration}ms\n`;
      debugText += `OCR Exit Code: ${response.data.OCRExitCode}\n`;
      debugText += `Is Error: ${response.data.IsErroredOnProcessing}\n`;
      debugText += `Processing Time: ${response.data.ProcessingTimeInMilliseconds}ms\n`;

      if (response.data.ErrorMessage && response.data.ErrorMessage.length > 0) {
        debugText += `❌ Errors: ${JSON.stringify(response.data.ErrorMessage)}\n`;
      }

      if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        const result = response.data.ParsedResults[0];
        debugText += `File Parse Exit Code: ${result.FileParseExitCode}\n`;
        debugText += `Text Orientation: ${result.TextOrientation}°\n`;

        if (result.ErrorMessage) {
          debugText += `Parse Error: ${result.ErrorMessage}\n`;
        }

        const text = result.ParsedText;
        debugText += `Text Length: ${text?.length || 0} characters\n`;

        setDebugInfo(debugText);

        if (text && text.trim().length > 0) {
          console.log('✅ Text extracted successfully:', text);
          setExtractedText(text);
        } else {
          console.warn('⚠️  No text found in image');
          setExtractedText('No text found in image.\n\nTips:\n• Ensure good lighting\n• Hold camera steady\n• Text should be clear and in focus\n• Avoid shadows and glare');
        }
      } else {
        console.error('❌ No ParsedResults in response');
        setDebugInfo(debugText + '\n❌ No ParsedResults in API response');
        setExtractedText('OCR processing failed. Check debug info.');
      }

      // Delete the photo after processing
      await deletePhoto(uri);
    } catch (error) {
      console.error('❌ OCR error:', error);

      let errorMsg = 'Failed to extract text from image.';
      if (axios.isAxiosError(error)) {
        errorMsg += `\n\nNetwork Error: ${error.message}`;
        if (error.response) {
          errorMsg += `\nStatus: ${error.response.status}`;
          errorMsg += `\nResponse: ${JSON.stringify(error.response.data)}`;
        }
      }

      setDebugInfo(`❌ ERROR:\n${errorMsg}`);
      Alert.alert('Error', errorMsg);
      // Still try to delete the photo even if OCR failed
      await deletePhoto(uri);
    } finally {
      setIsProcessing(false);
    }
  };

  const deletePhoto = async (uri: string) => {
    try {
      // On web, we don't need to delete the blob URL
      if (Platform.OS === 'web') {
        setPhotoUri('');
        return;
      }

      // On native platforms, delete the file
      const fileInfo = await getInfoAsync(uri);
      if (fileInfo.exists) {
        await deleteAsync(uri);
        setPhotoUri('');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Still clear the URI even if deletion failed
      setPhotoUri('');
    }
  };

  const handleCopyText = async () => {
    if (extractedText) {
      await Clipboard.setStringAsync(extractedText);
      Alert.alert('Success', 'Text copied to clipboard!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Text Scanner</Text>
        <Text style={styles.subtitle}>Scan text from photos using OCR</Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanWithGuide}
        disabled={isProcessing}
      >
        <Text style={styles.scanButtonText}>
          {isProcessing ? 'Processing...' : '📷 Scan with Guide'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickScanButton}
        onPress={handleScanText}
        disabled={isProcessing}
      >
        <Text style={styles.quickScanButtonText}>Quick Scan (No Guide)</Text>
      </TouchableOpacity>

      {isProcessing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Extracting text...</Text>
        </View>
      )}

      {extractedText !== '' && !isProcessing && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Extracted Text:</Text>
          <ScrollView style={styles.textScrollView}>
            <Text style={styles.extractedText}>{extractedText}</Text>
          </ScrollView>

          {debugInfo !== '' && (
            <ScrollView style={styles.debugScrollView}>
              <Text style={styles.debugText}>{debugInfo}</Text>
            </ScrollView>
          )}

          <TouchableOpacity style={styles.copyButton} onPress={handleCopyText}>
            <Text style={styles.copyButtonText}>📋 Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isProcessing && extractedText === '' && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Tap the button above to take a photo and extract text from it.
          </Text>
          <Text style={styles.instructionsSubtext}>
            The photo will be automatically deleted after processing.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  quickScanButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  quickScanButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    marginTop: 30,
    flex: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  extractedText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  debugScrollView: {
    maxHeight: 150,
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  copyButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  instructionsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
