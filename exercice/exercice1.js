import React, { useState, useEffect } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    redBlock: {
      flex: 1,
      backgroundColor: 'red',
      width: '100%'
    },
    allText: {
      color: 'white',
      fontSize: 28,
      textAlign: 'center',
      margin: 10
    },
    allBlock: {
      width: '100%',
      height: '50%'
    },
    colorBlue: {
      backgroundColor: 'grey'
    }
  }) 
  
const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0
  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 10000,
      }
    ).start();
  }, [])

  return (
    <Animated.View
      style={{
        ...props.style,
        flex: fadeAnim,         
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FadeInView style={{...styles.allBlock, ...styles.colorBlue}}>
        <Text style={styles.allText}>1</Text>
      </FadeInView>
      <View style={styles.redBlock}>
        <Text style={styles.allText}>2</Text>
      </View>
    </View>
  )
}
