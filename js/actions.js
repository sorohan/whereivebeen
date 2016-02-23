
import { json as fetchJson } from 'd3'
import * as travelApi from './services/travels'

const REQUEST_TRAVELS = 'REQUEST_TRAVELS'
const RECEIVE_TRAVELS = 'RECEIVE_TRAVELS'
const REQUEST_MAP = 'REQUEST_MAP'
const RECEIVE_MAP = 'RECEIVE_MAP'
// Todo: dispatch Request map/travels

const mapSrc = '/data/world-110-topo.json'

const fetchMap = function() {
    return new Promise((resolve, reject) => {
        fetchJson(mapSrc, (error, map) => (error) ? reject(error) : resolve(map))
    }).then(receiveMap)
}

const receiveMap = function(geojson) {
    return {
        type: RECEIVE_MAP,
        geojson
    }
}

const fetchTravels = function() {
    return travelApi.getAll()
        .then(receiveTravels)
}

const receiveTravels = function(travels) {
    return {
        type: RECEIVE_TRAVELS,
        travels
    };
}

export {
    fetchTravels,
    fetchMap,
    REQUEST_TRAVELS,
    RECEIVE_TRAVELS,
    REQUEST_MAP,
    RECEIVE_MAP
};
