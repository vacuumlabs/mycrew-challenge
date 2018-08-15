import React, {Component} from 'react'
import {StyleSheet, Text} from 'react-native'
import {registerAndLoginUser} from '../utils'

class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    registerAndLoginUser('hu@ha.sk', 'Hu Ha', 'bac0n')
      .then(() => {
        this.props.navigation.replace('MainScreen')
      })
      .catch((e) => {
        console.log(e)
        // TODO notify user
      })
  }

  render = () => <Text>Hello</Text>
}

export default RegisterScreen
