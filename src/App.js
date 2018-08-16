import React from 'react'
import {createStackNavigator} from 'react-navigation'

import {LoginScreen, RegisterScreen, MainScreen} from './screens'

const RootStack = createStackNavigator(
  {
    LoginScreen,
    RegisterScreen,
    MainScreen,
  },
  {initialRouteName: 'RegisterScreen'}
)

export default () => <RootStack />
