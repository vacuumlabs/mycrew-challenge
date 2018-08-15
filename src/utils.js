import SecureStorage from 'react-native-secure-storage'
import bcrypt from 'react-native-bcrypt'
import {promisify} from 'es6-promisify'

// TODO config bcrypt with secure random

import {SALT_ROUNDS} from './constants'

export const bcryptHashPromise = promisify(bcrypt.hash)
export const bcryptComparePromise = promisify(bcrypt.compare)

export const testSecure = async () => {
  await SecureStorage.setItem('key', JSON.stringify({pass: 'pass'}))
  console.log(JSON.parse(await SecureStorage.getItem('key')))
}

export const testBcrypt = async () => {
  const pass = await bcryptHashPromise('bacon', SALT_ROUNDS)
  console.log(await bcryptComparePromise('b4c0n', pass))
  console.log(await bcryptComparePromise('bacon', pass))
}

// didn't know the requirements for security (even though we're storing everyting on device)
// so assumed something reasonable is required
// - SecureStorage since standard AsyncStorage does not guarantee other apps won't have access to data in it
// - storing passwords in plaintext tends to be a bad idea

export const getUsers = async () => {
  const storageUsers = await SecureStorage.getItem('users')
  return storageUsers ? JSON.parse(storageUsers) : {}
}

export const getCurrentUser = async () => {
  const storageUser = await SecureStorage.getItem('currentUser')
  return storageUser && JSON.parse(storageUser)
}

// assumes we already verified email & password
export const registerAndLoginUser = async (email, name, pass) => {
  const users = await getUsers()
  const passHash = await bcryptHashPromise(pass, SALT_ROUNDS)
  const user = {pass: passHash, name}
  await SecureStorage.setItem('users', JSON.stringify({...users, [email]: user}))
  await SecureStorage.setItem('currentUser', JSON.stringify(user))
}

export const loginUser = async (email, pass) => {
  const user = (await getUsers())[email]
  if (!user || !(await bcryptComparePromise(pass, user.pass))) return false
  await SecureStorage.setItem('currentUser', JSON.stringify(user))
}

export const logoutUser = async () => await SecureStorage.removeItem('currentUser')

export const testRegisterAndLogin = async () => {
  await registerAndLoginUser('hu@ha.sk', 'Hu Ha', 'bac0n')
  console.log(await getUsers())
  console.log(await getCurrentUser())
  await logoutUser()
  console.log(await getCurrentUser())
  console.log(await loginUser('hu@ha.sk', 'bacon'))
  console.log(await getCurrentUser())
  console.log(await loginUser('hu@ha.sk', 'bac0n'))
  console.log(await getCurrentUser())
}
