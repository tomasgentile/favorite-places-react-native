import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

const database = SQLite.openDatabase('places.db');

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL, 
                imageUri TEXT NOT NULL, 
                address TEXT NOT NULL, 
                lat REAL NOT NULL, 
                lng REAL NOT NULL
            )`,
                [],
                (_, result) => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
}

export const insertPlace = (place) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
                [place.title, place.imageUri, place.address, place.location.lat, place.location.lng],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                },
            );
        });
    });
    return promise;
}

export const fetchPlaces = () => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM places',
                [],
                (_, result) => {
                    const places = [];
                    result.rows._array.forEach(place => {
                        places.push(
                            new Place(
                                place.title,
                                place.imageUri,
                                place.address,
                                { lat: place.lat, lng: place.lng },
                                place.id
                            ));
                    });
                    resolve(places);
                },
                (_, error) => {
                    reject(error);
                }
            );
        })
    });
    return promise;
}

export const fetchPlaceDetails = async (id) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    const dbPlace = result.rows._array[0];
                    const place = new Place(
                        dbPlace.title,
                        dbPlace.imageUri,
                        dbPlace.address,
                        { lat: dbPlace.lat, lng: dbPlace.lng },
                        dbPlace.id
                    )
                    resolve(place);
                },
                (_, error) => {
                    reject(error);
                }
            );
        })
    });
    return promise;
}

export const deletePlace = async (id) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('DELETE FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        })
    });
    return promise;
}