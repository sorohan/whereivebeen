
import React, { Component, PropTypes } from 'react'
import { fetchTravels, fetchMap } from '../../actions'
import { connect } from 'react-redux'
import Map from '../dumb/Map.react.js'
import Travels from '../dumb/Travels.react.js'

class MyMapApp extends Component {
    render() {
        const { map, isMapLoading, travels, isTravelsLoading } = this.props

        return (
            <div className="MyMap">
                {isMapLoading &&
                    <div>Loading Map...</div>
                }
                <svg width="100%" height="750">
                    <g>
                        <Map features={map} isLoading={isMapLoading} />
                    </g>
                    {!isMapLoading &&
                        <Travels travels={travels} isLoading={isTravelsLoading} />
                    }
                </svg>
            </div>
        );
    }
    /*
    */

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchMap())
        dispatch(fetchTravels())
    }

    componentWillReceiveProps(nextProps) {
        /*
        const { dispatch } = this.props;
        if (!this.isWorldLoading) {
            dispatch(fetchTravels);
        }
        */
    }

    /*,

    componentDidMount: function() {
        addBehaviours(findDOMNode(this))
    },*/
}

MyMapApp.propTypes = {
    map: PropTypes.object.isRequired,
    travels: PropTypes.array.isRequired,
    isMapLoading: PropTypes.bool.isRequired,
    isTravelsLoading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

// Connect to redux.
function mapStateToProps(state) {
    let stateWrapped = _(state)
    return {
        map: stateWrapped.get('map.geojson', {}),
        travels: stateWrapped.get('travels.travels', []),
        isMapLoading: stateWrapped.get('map.isLoading', true),
        isTravelsLoading: stateWrapped.get('travels.isLoading', true)
    }
}

export default connect(mapStateToProps)(MyMapApp)

