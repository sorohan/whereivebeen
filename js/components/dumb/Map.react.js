
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import topojson from 'topojson'
import d3 from 'd3'
import _ from 'lodash/fp'

// todo: single config for d3
const MAP_WIDTH = 2500
const MAP_HEIGHT = 750
const MAP_SCALE = 150;
const MAP_PROJECTION = d3.geo.mercator().scale(MAP_SCALE); //.translate([MAP_WIDTH/2, MAP_HEIGHT/2])
const MAP_PATH = d3.geo.path().projection(MAP_PROJECTION)

const renderMap = function(el, map) {
    let g = d3.select(el)
    let collection = _(map).get('objects.collection')
    let path = MAP_PATH

    if (!collection) return

    g.selectAll('path')
        .data(topojson.feature(map, map.objects.collection).features)
        .enter().append('path')
            .attr('d', path)
            .attr('class', 'country')
}

class Map extends Component {
    componentDidMount() {
        if (!this.props.isLoading) {
            renderMap(findDOMNode(this), this.props.features)
        }
    }

    componentDidUpdate() {
        if (!this.props.isLoading) {
            renderMap(findDOMNode(this), this.props.features)
        }
    }

    render() {
        if (this.props.isLoading) {
            // todo: loading
        }
        return <g />
    }
}

Map.propTypes = {
    features: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired
}

export {
    Map as default,
    MAP_WIDTH,
    MAP_HEIGHT,
    MAP_PROJECTION,
    MAP_PATH,
    MAP_SCALE
}
