
var geolib = require('geolib');
var readline = require('linebyline');
var rl = readline('data/locations-sorted.tsv');

var minDistance = 300; // km
var minAccuracy = 50;

var lastLocation = null;

rl.on('line', function (line, linecount) {
    var lineSplit = line.split('\t');
    var location = {
        time: lineSplit[0],
        latitude: lineSplit[1] / 1E7,
        longitude: lineSplit[2] / 1E7,
        accuracy: lineSplit[3]
    };

    if (!lastLocation) {
        lastLocation = location;
        return;
    }

    if (location.accuracy < minAccuracy) {
        var distance = geolib.getDistance(
                Object.assign({},lastLocation),
                Object.assign({},location)
        );

        if (distance/1000 > minDistance) {
            console.log(
                [
                    location.latitude,
                    location.longitude,
                    location.time,
                    location.accuracy
                ].join(',')
            );
            lastLocation = location;
        }
    }
});
