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
    tabsStyle: {
        tabBarButtonColor: '#ffff00',
        tabBarSelectedButtonColor: '#ff9900',
        tabBarBackgroundColor: '#551A8B'
    },
    appStyle: {
        orientation: 'portrait'
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