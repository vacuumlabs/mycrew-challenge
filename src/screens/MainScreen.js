import React, {Component} from 'react'
import {StyleSheet, Text, Button, View, Platform, ActivityIndicator} from 'react-native'
import Sound from 'react-native-sound'

import {getCurrentUser} from '../utils'

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
      playbackInitDone: false,
      isPlaying: false,
      startedPlaying: false,
    }
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
      'https://ucd352221a91bc4764efcda555ab.previews.dropboxusercontent.com/p/orig/AALtU30Tni2t4FGO2tX6xv8oTlC1OOphZOmM5XOQGLhP-2iz5_gelJ0Cx_8qVbch5Ief-AQ8_SrsdMyNw8HhEcszyMBvrDe6IKUIZd2f_yMB_U7Jq8tIsuNQB_jzYI0XlyOClqokbZIQrHXcvqzT6fYJ/p.mp3',
      null,
      (error) => {
        if (error) {
          console.log('failed to load the sound', error)
          return
        }
        this.setState({playbackInitDone: true})
        if (this.state.isPlaying) {
          this.startPlayback()
        }
      }
    )
  }

  startPlayback = () => {
    this.unicornTrack.play((success) => {
      if (success) {
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
  }

  pausePlayback = () => {
    this.unicornTrack.pause()
    this.setState({isPlaying: false})
  }

  stopPlayback = () => {
    this.unicornTrack.stop()
    this.setState({isPlaying: false, startedPlaying: false})
  }

  playButtonPress = () => {
    if (this.state.isPlaying) {
      this.pausePlayback()
    } else {
      this.startPlayback()
    }
  }

  // text'll be empty on first render, which shouldn't be something too noticeable
  render = () => (
    <View>
      <Text>{this.state.name ? `Welcome ${this.state.name} to 🦄 paradise!` : ''}</Text>
      <View>
        {this.state.startedPlaying && !this.state.playbackInitDone ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button onPress={this.playButtonPress} title={this.state.isPlaying ? '▊▊' : '▶'} />
        )}
        <Button onPress={this.stopPlayback} title="▇" disabled={!this.state.startedPlaying} />
      </View>
    </View>
  )
}

export default MainScreen
