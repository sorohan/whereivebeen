
import { connect } from 'react-redux'
import { World } from '../dumb/World.react'

// Connect World component to Redux State.
function mapStateToProps(state) {
    const { world } = state
    const isLoading = state.isWorldLoading || false
    return {
        world,
        isLoading
    }
}

export default connect(mapStateToProps)(World)

