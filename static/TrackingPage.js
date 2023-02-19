mapboxgl.accessToken = 'pk.eyJ1IjoibXNjeWhldiIsImEiOiJjbGRjZ2NxMWcwNHlqM3Ftdnk5bWxpNTA2In0.eVb9A1KnXMC8RXlJjetGpw';
var map
var carExists = false

async function getCoords() {
    event.preventDefault()
    let street = document.getElementById("street").value
    let city = document.getElementById("city").value
    let stateSelect = document.getElementById("state")
    let state = stateSelect.options[stateSelect.selectedIndex].text
    // Concat into an address
    let address = street + ', ' + city + ', ' + state
    let coords = null

    var url_call =  'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address +'.json?access_token=' + mapboxgl.accessToken

    return fetch(url_call)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.features[0].geometry.coordinates;
        });
}




function createMap() {
    // Define the route coordinates
    var start = [-97.754717, 30.22837];//st eds coordinates
    // Define the map
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: start,
        zoom: 12
    });
}

function startRoute(currMap, destination) {

    // define start and end
    const start = [-97.754717, 30.22837]
    let end = destination

    currMap = map
    console.log(currMap, destination)

    // // Define the vehicle icon
    var vehicleIcon = document.createElement('div');
    vehicleIcon.className = 'marker';
    vehicleIcon.style.backgroundImage = '../styles/WeGo.png';


    // Get the route between the two locations using Mapbox Directions API
    let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start.join(',') + ';' + end.join(',') + '?geometries=geojson&overview=full&access_token=' + mapboxgl.accessToken;

    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        // Define coordinates array
        var coordinatesArray = data.routes[0].geometry.coordinates;
        console.log("I an here")
        currMap.addLayer({
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
        // Check if car exists
        if (carExists) {
            console.log("Car already en route")
            return
        }

        // Fit the map to the route
        var bounds = data.routes[0].geometry.coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(data.routes[0].geometry.coordinates[0], data.routes[0].geometry.coordinates[0]));
        currMap.fitBounds(bounds, {padding: 50});

        // Create the car marker and add it to the map
        var carMarker = new mapboxgl.Marker({
            element: vehicleIcon,
            anchor: 'center'
        }).setLngLat(start).addTo(currMap);

        carExists = true;
        // Animate the car along the route
        var index = 0;

        function animateCar() {

            if (index >= coordinatesArray.length) {
                index = coordinatesArray[coordinatesArray.length-1]
            }
            carMarker.setLngLat(coordinatesArray[index]);
            index++;
            setTimeout(animateCar, 2500);

        }    //
        animateCar();
    });

}
