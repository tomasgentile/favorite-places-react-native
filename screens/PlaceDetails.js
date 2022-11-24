import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { deletePlace, fetchPlaceDetails } from '../util/database';
import IconButton from '../components/UI/IconButton';

const PlaceDetails = ({ route, navigation }) => {
  const [fetchedPlace, setFetchedPlace] = useState({});
  const selectedPlaceId = route.params.placeId;

  const showOnMapHandler = () => {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng
    });
  }

  const handleDeletePlace = async () => {
    await deletePlace(route.params.placeId);
    navigation.navigate('Allplaces');
  }

  useEffect(() => {
    const loadPlaceData = async () => {
      const place = await fetchPlaceDetails(selectedPlaceId)
      setFetchedPlace(place);

      navigation.setOptions({
        title: place.title,
        headerRight: ({ tintColor }) =>
          <IconButton
            icon='trash-outline'
            color={tintColor}
            size={24}
            onPress={() => handleDeletePlace()}
          />
      })
    };
    loadPlaceData();
  }, [selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading Place Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon='map' onPress={showOnMapHandler}>View on Map</OutlinedButton>
      </View>
    </ScrollView>
  )
}

export default PlaceDetails

const styles = StyleSheet.create({
  fallback: {
    felx: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%'
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressContainer: {
    padding: 20
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  }
});