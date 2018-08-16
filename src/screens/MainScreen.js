import React, {Component} from 'react'
import {
  Text,
  Button,
  View,
  Platform,
  ActivityIndicator,
  NativeModules,
  Animated,
  Dimensions,
} from 'react-native'
import Sound from 'react-native-sound'

import {getCurrentUser, logoutUser, resetNavAction} from '../utils'
import styles from '../styles'
import {ANIMATION_DURATION} from '../constants'

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Welcome!',
  }

  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
      playbackInitDone: false,
      isPlaying: false,
      startedPlaying: false,
      animation: new Animated.Value(Dimensions.get('screen').width),
    }
    this.animation = Animated.loop(
      Animated.timing(this.state.animation, {
        toValue: -Dimensions.get('screen').width,
        duration: ANIMATION_DURATION, // uniform duration - slower anim. on large screens (hopefully noone cares)
        // android emulator animation stuttered horribly without this - on ios it can cause weird jumps in interaction with audio playback .. ¯\_(ツ)_/¯
        useNativeDriver: Platform.select({android: true, default: false}),
      })
    )
  }

  componentDidMount = () => {
    getCurrentUser()
      .then((user) => {
        if (!user) {
          // TODO navigate to login
        } else {
          this.setState({name: user.name})
        }
      })
      .catch((e) => {
        console.log(e)
        // TODO notify and logout user
      })

    Sound.setCategory('Playback')
    this.unicornTrack = new Sound(
      'https://www.dropbox.com/s/zrl1jsdk29qdv5r/Pink%20Fluffy%20Unicorns%20Dancing%20on%20Rainbows%20-%20Fluffle%20Puff%20.mp3?raw=1',
      null,
      (error) => {
        if (error) {
          console.log('failed to load the sound', error)
          this.setState({networkError: true})
          return
        }
        this.setState({playbackInitDone: true})
        if (this.state.isPlaying) {
          this.startPlayback()
        }
      }
    )
  }

  componentWillUnmount = () => {
    this.unicornTrack.stop()
    this.unicornTrack.release()
  }

  startPlayback = () => {
    this.unicornTrack.play((success) => {
      if (success) {
        // callback called when playback finishes - loop on ios
        if (Platform.OS === 'ios') {
          this.startPlayback()
        } else {
          this.setState({isPlaying: false, startedPlaying: false})
        }
      } else {
        console.log('playback MAY HAVE failed due to audio decoding errors')
        console.log('(also happens if we stop during init so probably no big deal)')
        // reset the player to its uninitialized state (android only)
        // this is the only option to recover after an error occured and use the player again
        this.unicornTrack.reset()
      }
    })
    this.setState({isPlaying: true, startedPlaying: true})
    // unicorns will scroll even when the song is still loading - this is the same
    // behaviour as in many audio players (with song names), so hopefully that's according
    // to specs
    this.animation.start()
  }

  pausePlayback = () => {
    this.unicornTrack.pause()
    this.setState({isPlaying: false})
    this.animation.stop()
  }

  stopPlayback = () => {
    this.unicornTrack.stop()
    this.setState({isPlaying: false, startedPlaying: false})
    this.animation.stop()
  }

  playButtonPress = () => {
    if (this.state.isPlaying) {
      this.pausePlayback()
    } else {
      this.startPlayback()
    }
  }

  logout = async () => {
    await logoutUser()
    this.props.navigation.dispatch(resetNavAction('RegisterScreen'))
    NativeModules.RNTAlert.showAlert()
  }

  // text'll be empty on first render, which shouldn't be something too noticeable
  render = () => (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        {this.state.name ? `Welcome ${this.state.name} to 🦄 paradise!` : ''}
      </Text>
      {this.state.networkError ? (
        <Text style={styles.otherText}>😭 Failed to load the 🦄 song (Network Problems?) 😭</Text>
      ) : (
        <View style={{flexDirection: 'row'}}>
          {this.state.startedPlaying && !this.state.playbackInitDone ? (
            <ActivityIndicator size="small" />
          ) : (
            // pause sign looks poorly on iOs, but this was a cheap way to do it quickly with proper disabled states
            <Button
              style={styles.button}
              onPress={this.playButtonPress}
              title={this.state.isPlaying ? '▊▊' : '▶'}
            />
          )}
          <Button
            style={styles.button}
            onPress={this.stopPlayback}
            title="▇"
            disabled={!this.state.startedPlaying}
          />
        </View>
      )}
      <Animated.Text
        style={{
          textAlign: 'center',
          transform: [{translateX: this.state.isPlaying ? this.state.animation : 0}],
        }}
      >
        🦄🦄🦄
      </Animated.Text>
      <Button style={styles.button} onPress={this.logout} title="Logout" />
    </View>
  )
}

export default MainScreen
