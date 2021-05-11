var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

// var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "satellite-streets-v11",
//     accessToken: API_KEY
// });



var myMap = L.map("map-id", {
    center: [40.73, -104.0059],
    zoom:3
});

lightmap.addTo(myMap);
// satellite.addTo(myMap);


function colormydot (depth) {
    if (depth <= 15) {
        return ("green");    
    } else if (depth <= 30) {
        return ("yellow");
    } else if (depth <= 100) {
        return ("orange");
    } else {
        return ("red");
    }

}


var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Store the API endpoint inside queryURL

d3.json(queryURL).then(function(data) {

    var quakes = data.features;
    console.log(quakes.length);

// Create each marker coordinate and push to empty array

    quakes.forEach(element => {
        lat = element['geometry']['coordinates'][1];
        lng = element['geometry']['coordinates'][0];
        mag = element['properties']['mag'];
        depth = element['geometry']['coordinates'][2];
    
        L.circleMarker([lat, lng], {
            radius: mag * 2,
            fillOpacity: 0.8,
            stroke: true,
            weight: 1,
            color: colormydot(depth),
            fillColor: colormydot(depth)
        }).bindPopup("Depth: " + element['geometry']['coordinates'][2] + " meters" + 
        "<br> Magnitude: " + element['properties']['mag'] + " ML")
        .addTo(myMap);

    });
    
});

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var legendInfo = 
        "<span style='color:green'>&#9673</span> 0 - 15 m depth <br> <span style='color:yellow'>&#9673</span> 15.1 - 30 m depth <br> <span style='color:orange'>&#9673</span> 30.1 - 100 m depth <br> <span style='color:red'>&#9673</span> Greater than 100 m depth";

    div.innerHTML = legendInfo;

    return div;
};
legend.addTo(myMap);