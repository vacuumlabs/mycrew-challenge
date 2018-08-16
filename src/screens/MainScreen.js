import React, {Component} from 'react'
import {
  StyleSheet,
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

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Welcome',
  }

  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
      playbackInitDone: false,
      isPlaying: false,
      startedPlaying: false,
      animation: new Animated.Value(-Dimensions.get('screen').width),
    }
    this.containerRef = React.createRef()
    this.animation = Animated.loop(
      Animated.timing(this.state.animation, {
        toValue: Dimensions.get('screen').width,
        duration: 5000, // uniform duration - slower anim. on large screens (hopefully noone cares)
        useNativeDriver: true, // android emulator animation stuttered horribly without this
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

  dimensionChangeHandler = (dimensions) => {
    // reset the animation with correct dimensions i.e. when we rotate the device
    // duration kept the same so the animation is slower on horizontal direction ¯\_(ツ)_/¯
    this.animation.stop()
    this.setState({animation: new Animated.Value(-dimensions.width)})
    this.animation = Animated.loop(
      Animated.timing(this.state.animation, {
        toValue: Dimensions.get('screen').width,
        duration: 5000,
      })
    )
    if (this.state.isPlaying) this.animation.start()
  }

  componentWillUnmount = () => {
    Dimensions.removeEventListener('change')
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
    <View ref={this.containerRef} style={{alignItems: 'center'}}>
      <Text style={{textAlign: 'center'}}>
        {this.state.name ? `Welcome ${this.state.name} to 🦄 paradise!` : ''}
      </Text>
      {this.state.networkError ? (
        <Text style={{textAlign: 'center'}}>
          😭 Failed to load the 🦄 song (Network Problems?) 😭{' '}
        </Text>
      ) : (
        <View style={{flexDirection: 'row'}}>
          {this.state.startedPlaying && !this.state.playbackInitDone ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button onPress={this.playButtonPress} title={this.state.isPlaying ? '▊▊' : '▶'} />
          )}
          <Button onPress={this.stopPlayback} title="▇" disabled={!this.state.startedPlaying} />
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
      <Button onPress={this.logout} title="Logout" />
    </View>
  )
}

export default MainScreen
