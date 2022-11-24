import { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Image, Text } from 'react-native';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';

import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import { getMapPreview } from '../../util/location';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

const LocationPicker = ({ onPickLocation }) => {
    const [pickedLocation, setPickedLocation] = useState();
    const isFocused = useIsFocused(); // False when we enter the map, true when we came back
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = { lat: route.params.pickedLat, lng: route.params.pickedLng };

            setPickedLocation(mapPickedLocation);
        }
    }, [route, isFocused]);

    useEffect(() => {
        onPickLocation(pickedLocation);
    }, [pickedLocation, onPickLocation]); // to avoid innecesary rerenders onPickedLocation uses useCallback in PlaceForm.js

    const verifyPermissions = async () => {
        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permissions', 'You need to grant location permissions to use this app.');
            return false;
        }
        return true;
    }

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();

        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        });
    }

    const pickOnMapHandler = () => {
        navigation.navigate('Map');
    }

    return (
        <View>
            <View style={styles.mapPreview}>
                {pickedLocation ?
                    <Image
                        source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
                        style={styles.mapPreviewImage}
                    />
                    :
                    <Text>No location picked yet.</Text>
                }
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon='location' onPress={getLocationHandler}>Locate User</OutlinedButton>
                <OutlinedButton icon='map' onPress={pickOnMapHandler}>Pirck on Map</OutlinedButton>
            </View>
        </View>
    )
}

export default LocationPicker

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    mapPreviewImage: {
        width: '100%',
        height: '100%'
    }
});