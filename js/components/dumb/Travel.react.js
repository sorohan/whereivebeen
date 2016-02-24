
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import d3 from 'd3'
import { MAP_PATH as d, MAP_PROJECTION } from './Map.react'

var lineTween = _.curry(function lineTween(line, _datum, _index, _attr) {
    // Save start and end point.
    var a = line[0]
    var b = line[1]

    // Create interpolator between start & end of line.
    var i = d3.geo.interpolate(line[0], line[1])
    var i2 = d3.geo.interpolate(line[1], line[0])

    // Save the initial datum.
    var datum = _datum

    // Return new interpolator.
    return function(t) {
        datum.coordinates[1] = i(t) // set new *to* point, part-way to the end.
        return d(datum)
        /* does a tween which draws the line, then removes it
        if (t <= 0.5) {
            // First half, double the tween.
            datum.coordinates[1] = i(t*2)
        }
        else {
            // Second half, reverse the journey to bring the line to nothing.
            datum.coordinates[0] = i2((1-t)*2)
        }

        // Return new partial path.
        return d(datum)
        */
    }
})

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1)  // deg2rad below
    var dLon = deg2rad(lon2-lon1)
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c // Distance in km
    return d
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

class Travel extends Component {
    render() {
        let transform = 'translate(' + MAP_PROJECTION(this.props.to) + ')'
        let d = new Date(parseInt(this.props.time, 10))
        let label = this.props.place + ' ' + (d.getMonth() + 1) + '/' + (d.getFullYear())// todo: use moment?
        return (
            <g>
                <path className="arc"/>
                <text className="travel-label"
                    x="5"
                    transform={transform}
                    dy=".35em">{label}</text>
            </g>
        )
    }

    componentDidMount() {
        let { from, to } = this.props

        let distance = getDistanceFromLatLonInKm(from[0], from[1], to[0], to[1])

        let speed = 0.3 // 0.5 sec per 1000 k
        let animationTime = Math.round(distance * speed)

        if (animationTime > 500) {
            animationTime = 500
        }

        var startPoint = [ from, from ]
        var line = [ from, to ]

        var path = d3.select(findDOMNode(this)).select('path')
        path.datum({type: 'LineString', coordinates: startPoint})
            .attr('d', d)
        .transition()
            .duration(animationTime)
            .ease('linear')
            .attrTween('d', lineTween(line))
            .each('end', function(){
                d3.select(this).attr('class', 'arc done')
            })
    }
}

export default Travel
