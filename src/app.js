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


Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'One',
            screen: 'calbum.IntroScreen',
            icon: require('../img/one.png'),
            selectedIcon: require('../img/one_selected.png'),
            title: 'Screen One'
        },
        {
            label: 'Two',
            screen: 'calbum.SecondScreen',
            icon: require('../img/two.png'),
            selectedIcon: require('../img/two_selected.png'),
            title: 'Screen Two'
        }
    ],
    appStyle: {
        screenBackgroundColor: 'white',
        drawUnderTabBar: true,
        navBarTextColor: '#EBECED',
        navBarButtonColor: '#EBECED',
        statusBarBlur: false,
        statusBarColor:'#A2AAB0',
        navBarBackgroundColor: '#A2AAB0',
        orientation: 'portrait',
        tabBarBackgroundColor: '#3e3e3b',
        tabBarButtonColor: '#ebeced',
        tabBarSelectedButtonColor: '#cbc5c1',
        tabFontFamily: 'BioRhyme-Bold',
        tabBarTranslucent: false,
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
    animationType: 'none'
});