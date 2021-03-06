import React, {Component} from 'react'
import {Text, View, TextInput, Button, ActivityIndicator} from 'react-native'
import {
  getUsers,
  registerAndLoginUser,
  getEmailError,
  getPasswordError,
  getNameError,
  logoutUser,
} from '../utils'
import styles from '../styles'

class RegisterScreen extends Component {
  static navigationOptions = {
    title: 'Register',
  }

  constructor(props) {
    super(props)
    this.state = {
      working: true,
    }
  }

  componentDidMount = () => {
    // as register should be the first screen we see and there was no requirement to persist login
    // we get rid of login from previous run (but it could be used to login automatically)
    logoutUser().catch((e) => {
      // TODO notify user ?
      console.log(e)
    })
    // since there's no way anyone else can insert users while the component stays mounted
    // (unless an error would occur in registerAndLoginUser but then somethings horribly broken anyway)
    getUsers()
      .then((users) => {
        this.setState({users, working: false})
      })
      .catch((e) => {
        // TODO notify user ?
        console.log(e)
        this.setState({working: false})
      })
  }

  register = async () => {
    this.setState({working: true})
    await registerAndLoginUser(this.state.email, this.state.name, this.state.pass)
    this.props.navigation.replace('MainScreen')
  }

  render = () => {
    const emailError = getEmailError(this.state.email, this.state.users)
    const passError = getPasswordError(this.state.pass)
    const nameError = getNameError(this.state.name)
    const hasErrors = !!(emailError || passError || nameError)
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
        <Text style={styles.errorText}>{this.state.passTouched && (passError || '')}</Text>
        <TextInput
          style={styles.textField}
          placeholder="Name"
          onChangeText={(name) => this.setState({name})}
          onBlur={() => this.setState({nameTouched: true})}
          value={this.state.text}
        />
        <Text style={styles.errorText}>{this.state.nameTouched && (nameError || '')}</Text>
        {this.state.working ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button
            style={styles.button}
            onPress={this.register}
            disabled={hasErrors}
            title="Register"
          />
        )}
        <Button
          style={styles.button}
          onPress={() => this.props.navigation.push('LoginScreen')}
          title="Login"
        />
      </View>
    )
  }
}

export default RegisterScreen
