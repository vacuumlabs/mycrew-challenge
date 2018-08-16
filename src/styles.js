import {StyleSheet} from 'react-native'

// TODO move styles here

export default StyleSheet.create({
  container: {
    padding: 20,
  },
  mainContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  otherText: {
    textAlign: 'center',
  },
  button: {
    margin: 5,
  },
  textField: {height: 40, padding: 5, borderColor: 'gray', borderWidth: 1},
  errorText: {
    margin: 5,
    marginLeft: 0,
    color: 'red',
  },
})
