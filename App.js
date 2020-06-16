import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const adventures = [
  { id: "1", uri: require('./assets/1.jpg') },
  { id: "2", uri: require('./assets/2.jpg') },
  { id: "3", uri: require('./assets/3.jpg') },
  { id: "4", uri: require('./assets/4.jpg') },
  { id: "5", uri: require('./assets/5.jpg') },
]

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });
    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });

  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: screenWidth + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        
        if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -screenWidth - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  renderAdventures = () => {
    return adventures.map((aventure, i) => {
      if (i < this.state.currentIndex) {
        return null
      }
         
      if (i === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={aventure.id} style={[this.rotateAndTranslate, { height: screenHeight - 120, width: screenWidth, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 10 }}>
              <Text style={[styles.label, styles.labelGreen]}>JOIN!</Text>
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 10 }}>
              <Text style={[styles.label, styles.labelRed]}>NOPE</Text>
            </Animated.View>
            <Image
              style={styles.image}
              source={aventure.uri} />
          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View
            key={aventure.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: screenHeight - 120, width: screenWidth, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 10 }}>
              <Text style={[styles.label, styles.labelGreen]}>JOIN!</Text>

            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 10 }}>
              <Text style={[styles.label, styles.labelRed]}>NOPE</Text>
            </Animated.View>

            <Image
              style={styles.image}
              source={aventure.uri} />
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderAdventures()}
        </View>
        <View style={{ height: 60 }}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { 
    borderWidth: 1,  
    fontSize: 40, 
    padding: 5,
    fontWeight: 'bold'
  },
  labelGreen: {
    borderColor: 'green',
    color: 'green'
  },
  labelRed: {
    borderColor: 'red',
    color: 'red'
  },
  image: { 
    flex: 1, 
    height: null, 
    width: null,
    resizeMode: 'cover', 
    borderRadius: 20 
  }
});
