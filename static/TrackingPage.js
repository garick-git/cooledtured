mapboxgl.accessToken = 'pk.eyJ1IjoibXNjeWhldiIsImEiOiJjbGRjZ2NxMWcwNHlqM3Ftdnk5bWxpNTA2In0.eVb9A1KnXMC8RXlJjetGpw';
// Define the route coordinates
var start = [-97.754717, 30.22837];
var end = [-97.939990, 29.882080];

// Define the vehicle icon
var vehicleIcon = document.createElement('div');
vehicleIcon.className = 'marker';
vehicleIcon.style.backgroundImage = '../styles/WeGo.png';

// Define the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: start,
    zoom: 12
});

// Add navigation control to the map
map.addControl(new mapboxgl.NavigationControl());

// Get the route between the two locations using Mapbox Directions API
var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start.join(',') + ';' + end.join(',') + '?geometries=geojson&overview=full&access_token=' + mapboxgl.accessToken;

fetch(url).then(function(response) {
    return response.json();
}).then(function(data) {
    // Define coordinates array
    var coordinatesArray = data.routes[0].geometry.coordinates;
map.on('load', function(){
map.addLayer({
    id: 'route',
    type: 'line',
    source: {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: data.routes[0].geometry
        }
    },
    paint: {
        'line-width': 5,
        'line-color': '#007cbf'
    }
});
});
    // Add the route to the map


    // Fit the map to the route
    var bounds = data.routes[0].geometry.coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(data.routes[0].geometry.coordinates[0], data.routes[0].geometry.coordinates[0]));
    map.fitBounds(bounds, { padding: 50 });

    // Create the car marker and add it to the map
    var carMarker = new mapboxgl.Marker({
        element: vehicleIcon,
        anchor: 'center'
    }).setLngLat(start).addTo(map);

    // Animate the car along the route
    var index = 0;
    function animateCar() {

        if (index >= coordinatesArray.length) {
            index = 0
        }
        carMarker.setLngLat(coordinatesArray[index]);
        index++;
        setTimeout(animateCar, 1);

    }
    animateCar();
});