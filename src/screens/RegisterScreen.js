import React, {Component} from 'react'
import {
  StyleSheet,
  NativeModules,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native'
import {
  getUsers,
  registerAndLoginUser,
  getEmailError,
  getPasswordError,
  getNameError,
} from '../utils'

class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      working: true,
    }
  }

  componentDidMount = () => {
    // since there's no way anyone else can insert users while the component stays mounted
    // (unless an error would occur in registerAndLoginUser but then somethings horribly broken anyway)
    getUsers()
      .then((users) => {
        console.log(users)
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
        <Text style={{color: 'red'}}>{this.state.passTouched && (passError || '')}</Text>
        <TextInput
          style={{height: 40, padding: 5, borderColor: 'gray', borderWidth: 1}}
          placeholder="Name"
          onChangeText={(name) => this.setState({name})}
          onBlur={() => this.setState({nameTouched: true})}
          value={this.state.text}
        />
        <Text style={{color: 'red'}}>{this.state.nameTouched && (nameError || '')}</Text>
        {this.state.working ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button onPress={this.register} disabled={hasErrors} title="Register" />
        )}
        <Button onPress={() => this.props.navigation.push('LoginScreen')} title="Login" />
      </View>
    )
  }
}

export default RegisterScreen
