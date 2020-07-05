/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar, SafeAreaView} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Language'})],
        }),
      );
    }, 3000);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
        <Image
          source={require('../img/splash.png')}
          style={[styles.image]}
        />
      </SafeAreaView>
    );
  }
}
export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  image: {
    width: '70%',
    height: '70%',
    alignItems:'center',

  },
});
