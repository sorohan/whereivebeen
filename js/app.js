
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MyMapApp from './components/smart/MyMapApp.react'
import configureStore from './stores'
import { Provider } from 'react-redux'

const store = configureStore()

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <MyMapApp />
            </Provider>
        )
    }
}

ReactDOM.render(
    <Root />,
    document.getElementById('mymap')
)
