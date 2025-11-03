import React, { useState } from 'react';
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
import axios from 'axios';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoUri, setPhotoUri] = useState('');

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
        allowsEditing: false,
        quality: 1,
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

    try {
      let base64Data = '';

      // Read the image file as base64
      if (Platform.OS === 'web') {
        // For web, fetch the blob and convert to base64
        const response = await fetch(uri);
        const blob = await response.blob();
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // For native platforms, use FileSystem
        base64Data = await readAsStringAsync(uri, {
          encoding: 'base64',
        });
      }

      // Call OCR.space API
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64Data}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        {
          headers: {
            'apikey': 'K87899142388957', // Free API key (limited usage)
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        const text = response.data.ParsedResults[0].ParsedText;
        setExtractedText(text || 'No text found in image.');
      } else {
        setExtractedText('No text found in image.');
      }

      // Delete the photo after processing
      await deletePhoto(uri);
    } catch (error) {
      console.error('OCR error:', error);
      Alert.alert('Error', 'Failed to extract text from image.');
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
        onPress={handleScanText}
        disabled={isProcessing}
      >
        <Text style={styles.scanButtonText}>
          {isProcessing ? 'Processing...' : '📷 Scan Text'}
        </Text>
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
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
