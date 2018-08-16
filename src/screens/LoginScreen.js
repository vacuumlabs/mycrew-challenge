import React, {Component} from 'react'
import {Text, View, TextInput, Button, ActivityIndicator} from 'react-native'
import {loginUser, getEmailError, getPasswordError, resetNavAction} from '../utils'
import styles from '../styles'

class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
  }

  constructor(props) {
    super(props)
    this.state = {
      working: false,
    }
  }

  login = async () => {
    this.setState({working: true, passValidationError: undefined})
    if (await loginUser(this.state.email, this.state.pass)) {
      this.props.navigation.dispatch(resetNavAction('MainScreen'))
    } else {
      this.setState({working: false, passValidationError: 'Invalid password'})
    }
  }

  render = () => {
    const emailError = getEmailError(this.state.email)
    const passError = getPasswordError(this.state.pass)
    const hasErrors = !!(emailError || passError)
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textField}
          placeholder="Email"
          onChangeText={(email) => this.setState({email})}
          onBlur={() => this.setState({emailTouched: true})}
          value={this.state.text}
        />
        <Text style={styles.errorText}>{this.state.emailTouched && (emailError || '')}</Text>
        <TextInput
          style={styles.textField}
          placeholder="Password"
          secureTextEntry
          onChangeText={(pass) => this.setState({pass})}
          onBlur={() => this.setState({passTouched: true})}
          value={this.state.text}
        />
        <Text style={styles.errorText}>
          {(this.state.passTouched && passError) || this.state.passValidationError || ''}
        </Text>
        {this.state.working ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button style={styles.button} onPress={this.login} disabled={hasErrors} title="Login" />
        )}
      </View>
    )
  }
}

export default LoginScreen
