
import React, { Component, PropTypes } from 'react'
import Travel from '../dumb/Travel.react'
import _ from 'lodash/fp'

class Travels extends Component {
    render() {
        let travels = _(this.state).get('visibleTravels', [])
        let isLoading = this.props.isLoading

        return (
            <g className="travels">
                {travels.map((travel, i) => <Travel key={travel.time} from={travel.from}
                        place={travel.place} to={travel.to} time={travel.time} />)}

                {isLoading &&
                    <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
                }
            </g>
        )
    }

    componentWillMount() {
        this.resetState()
    }

    resetState() {
        this.setState({
            visibleTravels: [],
            nextTravelIndex: 0
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.travels && nextProps.travels !== this.props.travels) {
            this.resetState()
            this.setTimer()
        }
    }

    componentDidMount() {
        this.setTimer()
    }

    setTimer() {
        this.clearTimer()
        // todo: listen to callback on sub-component
        this.timer = setInterval(this.nextVisibleTravel, 1000)
    }

    nextVisibleTravel = () => {
        let nextTravel = this.props.travels[this.state.nextTravelIndex]
        if (nextTravel) {
            let visibleTravels = _.clone(this.state.visibleTravels)
            visibleTravels.push(nextTravel)
            this.setState({
                visibleTravels: visibleTravels,
                nextTravelIndex: this.state.nextTravelIndex + 1
            })
        }
        else {
            this.clearTimer()
        }
    }

    clearTimer() {
        this.timer && clearInterval(this.timer)
    }
}

export default Travels
