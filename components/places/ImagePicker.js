import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { launchCameraAsync, useCameraPermissions, PermissionStatus, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { useState } from 'react';

import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';

const ImagePicker = ({ onTakeImage }) => {
    const [pickedImage, setPickedImage] = useState(null);
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    const verifyPermissions = async () => {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permissions', 'You need to grant camera permissions to use this app.');
            return false;
        }
        return true;
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        setPickedImage(image.uri);
        onTakeImage(image.uri);
    }

    const imageLibraryHandler = async () => {
        try {
            const image = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.5
            });
            setPickedImage(image.uri);
            onTakeImage(image.uri);
        } catch (error) {
            console.log(error)
        }
    }

    let imagePreview = <Text>No image taken yet.</Text>

    if (pickedImage) {
        imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />
    }

    return (
        <View>
            <View style={styles.imagePreview}>{imagePreview}</View>
            <View style={styles.container}>
                <OutlinedButton onPress={takeImageHandler} icon='camera'>Take Image</OutlinedButton>
                <OutlinedButton onPress={imageLibraryHandler} icon='image-outline'>Pick Image</OutlinedButton>
            </View>
        </View>
    );
}

export default ImagePicker

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});