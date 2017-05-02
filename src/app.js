/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screen'
registerScreens();

Navigation.startSingleScreenApp({
 screen: {
   screen: 'calbum.IntroScreen',
   title: 'Navigation',
   navigatorStyle: {
     navBarBackgroundColor: '#4dbce9',
     navBarTextColor: '#ffff00',
     navBarSubtitleTextColor: '#ff0000',
     navBarButtonColor: '#ffffff',
     statusBarTextColorScheme: 'light'
   }
 }
});
