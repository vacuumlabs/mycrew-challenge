import React, {Component} from 'react'
import {StyleSheet, Text} from 'react-native'
import {testRegisterAndLogin, testBcrypt} from '../utils'

console.log(testRegisterAndLogin)

class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    testBcrypt.then(() => console.log('donereg')).catch((e) => console.log(e))
  }

  render = () => <Text>Hello</Text>
}

export default RegisterScreen
