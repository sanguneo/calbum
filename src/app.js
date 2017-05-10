/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import {Navigation} from 'react-native-navigation';

import {registerScreens} from './screen'
registerScreens();


Navigation.startSingleScreenApp({
    screen: {
        screen: 'calbum.IntroScreen',
        title: 'cAlbum'
    },
    appStyle: {
        screenBackgroundColor: 'white',
        navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
        drawUnderNavBar: false,
        navBarTextColor: 'white',
        navBarButtonColor: 'white',
        statusBarHidden: true,
        statusBarTextColorScheme: 'dark',
        statusBarTextColorSchemeSingleScreen: 'dark',
        statusBarBlur: false,
        navBarBackgroundColor: '#f26968',
        orientation: 'portrait',
        forceTitlesDisplay: true
    },
    drawer: {
        left: {
            screen: 'calbum.SideMenu'
        },
        // left: { // optional, define if you want a drawer from the left
        //     screen: 'example.FirstSideMenu', // unique ID registered with Navigation.registerScreen
        //     passProps: {} // simple serializable object that will pass as props to all top screens (optional)
        // },
        // right: { // optional, define if you want a drawer from the right
        //     screen: 'example.SecondSideMenu', // unique ID registered with Navigation.registerScreen
        //     passProps: {} // simple serializable object that will pass as props to all top screens (optional)
        // },
        disableOpenGesture: false
    },
    passProps: {},
    animationType: 'fade'
});