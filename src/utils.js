import SecureStorage from 'react-native-secure-storage'
import bcrypt from 'react-native-bcrypt'
import {promisify} from 'es6-promisify'

// TODO config bcrypt with secure random

import {SALT_ROUNDS} from './constants'

export const bcryptHashPromise = promisify(bcrypt.hash)
export const bcryptComparePromise = promisify(bcrypt.compare)

export const testSecure = async () => {
  await SecureStorage.setItem('key', 'some value')
  console.log(await SecureStorage.getItem('key'))
}

export const testBcrypt = async () => {
  const pass = await bcryptHashPromise('bacon', SALT_ROUNDS)
  console.log(await bcryptComparePromise('b4c0n', pass))
  console.log(await bcryptComparePromise('bacon', pass))
}
