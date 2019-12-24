/* Sagar Shrestha
  ICT 4510 - ADVANCED WEBSITE DESIGN & MANAGEMENT
  8/25/2019  
  JavaScript code for the About page which initializes a map, sets its view to certain coordinates and zoom level, adds a tile layer, as well as a marker */

//Initializing the map and setting its view to the given geographical coordinates and a zoom level
var mymap = L.map('mapid').setView([39.678121, -104.961753], 15);

//Adding a tile layer to the map and applying a max zoom of 20
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJkdSIsImEiOiJjanl4aHEyZWYwOHJoM29xbGJpcW93OWY2In0.qKtvgiZ8Ogt8-sivV1jMww', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

//Adding a marker using the provided coordinates
var marker = L.marker([39.678121, -104.961753]).addTo(mymap);