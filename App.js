import React from "react";
import {Text, View, StyleSheet, Button } from "react-native"
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from 'react-navigation-stack';
import List from './component/ListComponent';
import  Map from './component/MapComponent';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
  }
});

export const ListScreen = ({ navigation }) => (
  <View style={styles.container}>
      <List/> 
  </View>
);

export const MapScreen = () => (
  <View style={styles.container}>
    <Map/> 
  </View>
);

export const MapTitle = () => (
  <View style={styles.title}>
    <Text>Map</Text>
  </View>
);

export const ListTitle = () => (
  <View style={styles.title}>
    <Text>Liste Station Velib</Text>
  </View>
);

const ListStack = createStackNavigator({
  List : {
    screen: ListScreen,
    navigationOptions: {
      headerTitle: ListTitle,
    },
  },
});

const MapStack = createStackNavigator({
  Map : {
    screen: MapScreen,
    navigationOptions: {
      headerTitle: MapTitle,
    },
  },
});

const Navigator = createBottomTabNavigator(
  {
    List: ListStack,
    Map: MapStack,
  },
  {
    initialRouteName: "List",
  }
);

export default createAppContainer(Navigator);