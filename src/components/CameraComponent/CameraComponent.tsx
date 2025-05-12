import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImageManipulator from 'expo-image-manipulator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPost'>;

const CameraComponent: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();  
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  if (!cameraPermission) return <View />;
  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to take photos.
        </Text>
        <Button mode="contained" onPress={requestCameraPermission}>
          Grant Access
        </Button>
      </View>
    );
  }

  const toggleCameraType = () => {
    setCameraType((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleTakePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: false });

        if (photo && photo.uri && photo.width && photo.height) {
          const size = Math.min(photo.width, photo.height);
          const cropped = await ImageManipulator.manipulateAsync(
            photo.uri,
            [
              {
                crop: {
                  originX: 0,
                  originY: 0,
                  width: size,
                  height: size,
                }
              }
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
          );
          setCapturedPhotoUri(cropped.uri);
        } else {
          console.warn("Missing photo data (width, height, uri)");
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("An error occurred while taking the photo.");
    }
  };

  const handlePickImage = async () => {
    try {
      if (!mediaPermission?.granted) {
        const permissionResponse = await requestMediaPermission();
        if (!permissionResponse.granted) {
          alert("Media library access is required.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCapturedPhotoUri(selectedImage.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Could not pick image from gallery.");
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhotoUri) {
      navigation.navigate('AddPost', { photoUri: capturedPhotoUri });
    }
  };

  const handleCancelPhoto = () => {
    setCapturedPhotoUri(null);
  };

  return (
    <View style={styles.container}>
      {capturedPhotoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhotoUri }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <Button mode="outlined" onPress={handleCancelPhoto} style={styles.previewButton}>
              ❌ Cancel
            </Button>
            <Button mode="contained" onPress={handleConfirmPhoto} style={styles.previewButton}>
              ✅ Use Photo
            </Button>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={cameraType}
        >
          <View style={styles.controls}>
            <Button mode="outlined" onPress={handlePickImage} style={styles.controlButton}>
              🖼️ Gallery
            </Button>
            <Button mode="outlined" onPress={toggleCameraType} style={styles.controlButton}>
              🔄 Flip
            </Button>
            <Button mode="contained" onPress={handleTakePhoto} style={styles.controlButton}>
              📸 Snap
            </Button>
          </View>
        </CameraView>
      )}
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00000088',
  },
  controlButton: {
    marginHorizontal: 4,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  previewButton: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
