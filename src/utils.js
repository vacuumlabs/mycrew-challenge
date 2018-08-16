import SecureStorage from 'react-native-secure-storage'
import bcrypt from 'react-native-bcrypt'
import {NavigationActions, StackActions} from 'react-navigation'
import {promisify} from 'es6-promisify'

// TODO config bcrypt with secure random

import {SALT_ROUNDS} from './constants'

export const bcryptHashPromise = promisify(bcrypt.hash)
export const bcryptComparePromise = promisify(bcrypt.compare)

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
  const lowerCaseMail = email.toLowerCase()
  const users = await getUsers()
  const passHash = await bcryptHashPromise(pass, SALT_ROUNDS)
  const user = {pass: passHash, name}
  await SecureStorage.setItem('users', JSON.stringify({...users, [lowerCaseMail]: user}))
  await SecureStorage.setItem('currentUser', JSON.stringify(user))
}

export const loginUser = async (email, pass) => {
  const lowerCaseMail = email.toLowerCase()
  const user = (await getUsers())[lowerCaseMail]
  if (!user || !(await bcryptComparePromise(pass, user.pass))) return false
  await SecureStorage.setItem('currentUser', JSON.stringify(user))
  return true
}

export const logoutUser = async () => await SecureStorage.removeItem('currentUser')

export const resetNavAction = (screen) =>
  StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: screen})],
  })

// validations

// second arg optional, only for register validation
export const getEmailError = (email, users) => {
  if (!email) return 'Please enter an email address'
  const lowerCaseMail = email.toLowerCase()
  // super basic check, as the email address standards are quite lax
  const emailRegex = /^\S+@\S+/
  if (!emailRegex.test(lowerCaseMail)) return 'Please enter a valid email'
  if (users && users[lowerCaseMail]) return 'That email is already taken'
  return false
}

export const getPasswordError = (pass) => {
  if (!pass || pass.length < 6) return 'Please enter password with at least 6 characters'
  const alphanumericRegex = /^[a-zA-Z0-9]*$/
  if (!alphanumericRegex.test(pass)) return 'Password must contain only numbers and letters'
  return false
}

export const getNameError = (name) => {
  if (!name || name.length === 0) return 'Please enter your name'
  const alphaRegex = /^[a-zA-Z]*$/
  if (!alphaRegex.test(name)) return 'Name must contain only letters'
  return false
}

// humble testing

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

export const testSecure = async () => {
  await SecureStorage.setItem('key', JSON.stringify({pass: 'pass'}))
  console.log(JSON.parse(await SecureStorage.getItem('key')))
}

export const testBcrypt = async () => {
  const pass = await bcryptHashPromise('bacon', SALT_ROUNDS)
  console.log(await bcryptComparePromise('b4c0n', pass))
  console.log(await bcryptComparePromise('bacon', pass))
}
