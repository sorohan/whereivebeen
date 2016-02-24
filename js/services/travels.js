
const getAll = function() {
    return window.fetch('/data/travels.csv').then(function(response) {
        return response.text();
    })
    .then(function(csv) {
        // dodgy csv parsing
        var lines = csv.split('\n');
        var lastPoint = null;
        var travels = [];

        lines.forEach(function(line) {
            var point = line.split(',');
            if (!point || !point.length || !point[0]) {
                return;
            }

            if (lastPoint === null) {
                // First iteration.
                lastPoint = point;
                return;
            }

            travels.push({
                from: [parseInt(lastPoint[1], 10), parseInt(lastPoint[0],10)],
                to: [parseInt(point[1], 10),     parseInt(point[0])],
                time: point[2],
                place: point[4]
            });

            lastPoint = point;
        });

        return travels;
    });
}

export {
    getAll
}
