import React, {Component} from 'react'
import {StyleSheet, Text} from 'react-native'
import {getCurrentUser} from '../utils'

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
    }
  }

  componentDidMount = () => {
    getCurrentUser()
      .then((user) => {
        if (!user) {
          // TODO navigate to login
        } else {
          this.setState({name: user.name})
        }
      })
      .catch((e) => {
        console.log(e)
        // TODO notify and logout user
      })
  }

  // text'll be empty on first render, which shouldn't be something too noticeable
  render = () => <Text>{this.state.name ? `Welcome ${this.state.name} to 🦄 paradise!` : ''}</Text>
}

export default MainScreen
