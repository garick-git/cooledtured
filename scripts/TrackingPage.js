mapboxgl.accessToken = 'pk.eyJ1IjoibXNjeWhldiIsImEiOiJjbGRjZ2NxMWcwNHlqM3Ftdnk5bWxpNTA2In0.eVb9A1KnXMC8RXlJjetGpw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-97.753061, 30.22897], // starting position
    zoom: 12
});
// set the bounds of the map
const bounds = [
    [-123.069003, -90],
    [122.303707, 90]
];
map.setMaxBounds(bounds);

// an arbitrary start will always be the same
// only the end or destination will change
const start = [-97.753061, 30.22897];//saint edwards at start location

// create a function to make a directions request
async function getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }
}

map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    getRoute(start);

    // Add starting point to the map
    map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: start
                        }
                    }
                ]
            }
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
    map.on('click', (event) => {
        // const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
        const end = {
            type: 'FeatureCollecTRhtion',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    }
                }
            ]
        };
        if (map.getLayer('end')) {
            map.getSource('end').setData(end);
        } else {
            map.addLayer({
                id: 'end',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: coords
                                }
                            }
                        ]
                    }
                },
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#f30'
                }
            });
        }
        getRoute(coords);
    });
});