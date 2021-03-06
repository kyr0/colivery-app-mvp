import { injectable, inject } from "springtype/core/di";
import { Shop } from "../datamodel/shop";
import Geohash from 'latlon-geohash';
import { REVERSE_GEOCODE_API_ENDPOINT, ESRI_API_TOKEN, GEOCODE_API_ENDPOINT, GOOGLE_MAPS_GEOCODE_API_ENDPOINT, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_STATIC_API_ENDPOINT } from "../config/endpoints";
import { UserService } from "./user";
import { GPSLocation } from "../datamodel/gps-location";

@injectable
export class GeoService {

    // cache
    currentLocation: Coordinates;

    static readonly EARTH_RADIUS_KM: number = 6372.8;

    @inject(UserService)
    userService: UserService;

    // https://docs.mapbox.com/api/search/#forward-geocoding
    async forwardGeoCode(searchText: string) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search/${searchText}?format=jsonv2`);
        return await response.json();
    }

    /*

    async geoCode(address: string) {

        // https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm
        const response = await fetch(`${GEOCODE_API_ENDPOINT}?addresses=${encodeURIComponent(JSON.stringify({
            "records": [
                {
                    "attributes": {
                        "OBJECTID": 1,
                        "SingleLine": address
                    }
                }
            ]
        }))}&token=${ESRI_API_TOKEN}&f=json`, {
            method: 'GET',
            mode: 'no-cors'
        });
        return await response.json();
    }
    */

    async geoCode(address: string) {
        const response = await fetch(`${GOOGLE_MAPS_GEOCODE_API_ENDPOINT}?address=${address}&key=${GOOGLE_MAPS_API_KEY}`);
        return await response.json();
    }

    getStaticMapImageSrc(address: string, markerPosition: { lat: number, lng: number, lable: string, color: string }, width: number = 300, height: number = 200, zoomLevel: number = 13, mapType: 'roadmap' = 'roadmap') {
        // https://developers.google.com/maps/documentation/maps-static/intro
        return `${GOOGLE_MAPS_STATIC_API_ENDPOINT}?center=${address}&markers=color:${markerPosition.color.replace('#', '0x')}%7Clabel:${markerPosition.lable}%7C${markerPosition.lat},${markerPosition.lng}&size=${width.toFixed()}x${height.toFixed()}&zoom=${zoomLevel}&maptype=${mapType}&key=${GOOGLE_MAPS_API_KEY}`;
    }

    async reverseGeoCode(lat: number, lon: number) {
        // https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm
        const response = await fetch(`${REVERSE_GEOCODE_API_ENDPOINT}?location=${lon},${lat}&token=${ESRI_API_TOKEN}&f=json`);
        return await response.json();
    }

    async forwardLocalPlacesSearch(searchText: string, distanceInMeters: number = 20000): Promise<Array<Shop>> {

        const currentPosition = await this.getCurrentLocation();
        const bbox = this.getBBoxWithDistance(currentPosition.latitude, currentPosition.longitude, distanceInMeters);
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cshop%3Dbicycle%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%28%0A%20%20relation%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22cafe%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22pharmacy%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22supermarket%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22butcher%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22beverages%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22bakery%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`);
        const responseJSON = await response.json();

        const nodes: { [id: string]: { lat: number; lon: number } } = {};
        const ways: Array<Shop> = [];

        for (const el of responseJSON.elements) {
            if (el.type === 'node') {
                nodes[el.id] = { lat: el.lat, lon: el.lon };
            }
        }

        for (const el of responseJSON.elements) {
            if (el.type === 'way'
                && el.tags && el.tags['addr:street'] && el.tags['addr:housenumber'] && el.tags['addr:postcode']
                && el.tags.shop
                && el.tags.name && el.tags.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                && ((!!el.nodes && Array.isArray(el.nodes)) || (el.lat && el.lon))
            ) {
                let locationNode;
                if (!!el.nodes && Array.isArray(el.nodes) && el.nodes.length > 0 && !!nodes[el.nodes[0]]) {
                    locationNode = nodes[el.nodes[0]];
                } else {
                    locationNode = { lat: el.lat, lon: el.lon };
                }

                ways.push({
                    ...locationNode,
                    id: el.id,
                    city: el.tags['addr:city'] || '',
                    houseNumber: el.tags['addr:housenumber'],
                    postcode: el.tags['addr:postcode'],
                    name: el.tags.name,
                    shop: el.tags.shop,
                    street: el.tags['addr:street']
                })
            }
        }
        return ways;
    }

    async getCurrentLocation(): Promise<GPSLocation> {

        if (this.currentLocation) {
            return this.currentLocation;
        }

        try {
            this.currentLocation = await new Promise((resolve: Function, reject: Function) => {
                navigator.geolocation.getCurrentPosition((pos) => {
                    resolve(pos.coords);
                }, (err) => {
                    reject(err);
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            }); 
            return this.currentLocation;
        } catch (e) {
            const ownUserProfile = await this.userService.getUserProfile();
            return ownUserProfile.geo_location;
        }
    }

    toRad(n: number): number {
        return n * Math.PI / 180;
    }

    getGeoHash(lat: number, lon: number, precision: number) {
        return Geohash.encode(lat, lon, precision);
    }

    roundTo1Decimal(x: number): number {
        return Math.round(x * 10) / 10;
    }

    haversine(position: GPSLocation, position2: GPSLocation): number {
        let dLat = this.toRad(position2.latitude - position.latitude);
        let dLon = this.toRad(position2.longitude - position.longitude);
        let originLat = this.toRad(position.latitude);
        let destinationLat = this.toRad(position2.latitude);

        let a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(originLat) * Math.cos(destinationLat);
        let c = 2 * Math.asin(Math.sqrt(a));
        return GeoService.EARTH_RADIUS_KM * c;
    }

    getBBoxWithDistance(lat: number, lon: number, distanceMeters: number) {

        const latRadian = this.toRad(lat);

        const degLatKm = 110.574235;
        const degLongKm = 110.572833 * Math.cos(latRadian);
        const deltaLat = distanceMeters / 1000.0 / degLatKm;
        const deltaLong = distanceMeters / 1000.0 / degLongKm;

        const topLat = lat + deltaLat;
        const bottomLat = lat - deltaLat;
        const leftLng = lon - deltaLong;
        const rightLng = lon + deltaLong;

        // const northWestCoords = topLat + ',' + leftLng;
        // const northEastCoords = topLat + ',' + rightLng;
        // const southWestCoords = bottomLat + ',' + leftLng;
        // const southEastCoords = bottomLat + ',' + rightLng;
        // const boundingBox = [northWestCoords, northEastCoords, southWestCoords, southEastCoords];
        return {
            latMin: bottomLat,
            longMin: leftLng,
            latMax: topLat,
            longMax: rightLng
        };
    }
}