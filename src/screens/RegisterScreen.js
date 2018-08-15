import React from 'react'
import {StyleSheet, Text} from 'react-native'
import {testSecure, testBcrypt} from '../utils'

testSecure()
  .then(() => console.log('donesec'))
  .catch((e) => console.log(e))

testBcrypt()
  .then(() => console.log('donecrypt'))
  .catch((e) => console.log(e))

export default () => <Text>Hello</Text>
