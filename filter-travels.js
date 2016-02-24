
// Download location history:
//     https://takeout.google.com/settings/takeout?pli=1
//     - Select None
//     - Select Location History
//     - Next

// Download and extract into process-data/
// mkdir process-data

// Extract to csv
// jq -r '.locations[] | [.latitudeE7, .longitudeE7, .timestampMs, .accuracy]
//     | map(tostring) | join(",")' process-data/Takeout/Location\ History/LocationHistory.json
//     > process-data/locations.csv

// Sort:
// awk -F\, '{print $3 "\t" $1 "\t" $2 "\t" $4}' process-data/locations.csv
//     | sort -fn
//     > process-data/locations-sorted.tsv

// Filter big travels
// node filter-travels.js > data/travels.csv

var geolib = require('geolib');
var readline = require('linebyline');
var geocoder = require('geocoder');
var rl = readline('process-data/locations-sorted.tsv');
var _ = require('lodash/fp');

var minDistance = 300; // km
var minAccuracy = 10;

var lastLocation = null;
var filteredTravels = [];

var count = 0;
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
            count ++;

            // Lookup location then add to travels (throttle geocoding).
            var timeout = (count - (filteredTravels.length+1)) * 250;
            setTimeout(function() {
                geocoder.reverseGeocode(location.latitude, location.longitude, function(err, data) {
                    location.place = extractPlace(data.results);
                    filteredTravels.push(location);
                });
            }, timeout);

            lastLocation = location;
        }
    }
});

var finish = function() {
    filteredTravels.sort(function(a, b) {
        var key = 'time';
        if (a.time < b.time) {
            return -1;
        }
        else if (a.time > b.time) {
            return 1;
        }
        return 0;
    });

    _(filteredTravels).forEach(function(location) {
        console.log([
            location.latitude,
            location.longitude,
            location.time,
            location.accuracy,
            location.place
        ].join(','));
    });
};

rl.on('end', function() {
    var tryFinish = function() {
        if (filteredTravels.length === count) {
            finish();
        }
        else {
            setTimeout(tryFinish, 1000);
        }
    };

    tryFinish();
})

function extractPlace(geocoded) {
    // Pull out all the address components from all the results.
    var components = geocoded.reduce(function(results, addr) {
        return _.union(results, addr.address_components);
    }, []);

    // order by: colloquial_area, locality
    components.sort(function(a, b) {
        var aIsColloquial = a.types.indexOf('colloquial_area') > -1;
        var aIsLocality = a.types.indexOf('locality') > -1;
        var bIsColloquial = b.types.indexOf('colloquial_area') > -1;
        var bIsLocality = b.types.indexOf('locality') > -1;

        if (aIsColloquial == bIsColloquial && aIsLocality == bIsLocality) {
            return 0;
        }

        if (bIsColloquial && !aIsColloquial) {
            return 1;
        }

        if (aIsColloquial && !bIsColloquial) {
            return -1;
        }

        if (bIsLocality && !aIsLocality) {
            return 1;
        }

        if (aIsLocality && !bIsLocality) {
            return -1;
        }

        return 0;
    });

    return (components.length) ? components[0].long_name : null;
}
