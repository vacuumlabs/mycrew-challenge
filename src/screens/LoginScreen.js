import React, {Component} from 'react'
import {StyleSheet, Text, View, TextInput, Button, ActivityIndicator} from 'react-native'
import {loginUser, getEmailError, getPasswordError, getCurrentUser} from '../utils'

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      working: true,
    }
  }

  // didn't know if we want to persis users between sessions, so I did so just in case
  componentDidMount = () => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          this.props.navigation.replace('MainScreen')
        } else {
          this.setState({working: false})
        }
      })
      .catch((e) => {
        // TODO notify user ?
        console.log(e)
        this.setState({working: false})
      })
  }

  login = async () => {
    this.setState({working: true, passValidationError: undefined})
    if (await loginUser(this.state.email, this.state.pass)) {
      this.props.navigation.replace('MainScreen')
    } else {
      this.setState({working: false, passValidationError: 'Invalid password'})
    }
  }

  render = () => {
    const emailError = getEmailError(this.state.email)
    const passError = getPasswordError(this.state.pass)
    const hasErrors = !!(emailError || passError)
    return (
      <View style={{padding: 20}}>
        <TextInput
          style={{height: 40, padding: 5, borderColor: 'gray', borderWidth: 1}}
          placeholder="Email"
          onChangeText={(email) => this.setState({email})}
          onBlur={() => this.setState({emailTouched: true})}
          value={this.state.text}
        />
        <Text style={{color: 'red'}}>{this.state.emailTouched && (emailError || '')}</Text>
        <TextInput
          style={{height: 40, padding: 5, borderColor: 'gray', borderWidth: 1}}
          placeholder="Password"
          secureTextEntry
          onChangeText={(pass) => this.setState({pass})}
          onBlur={() => this.setState({passTouched: true})}
          value={this.state.text}
        />
        <Text style={{color: 'red'}}>
          {this.state.passTouched && (passError || this.state.passValidationError || '')}
        </Text>
        {this.state.working ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button onPress={this.login} disabled={hasErrors} title="Login" />
        )}
      </View>
    )
  }
}

export default LoginScreen
