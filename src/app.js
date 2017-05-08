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
            label: 'One', // tab label as appears under the icon in iOS (optional)
            screen: 'calbum.IntroScreen', // unique ID registered with Navigation.registerScreen
            icon: require('../img/one.png'), // local image asset for the tab icon unselected state (optional on iOS)
            selectedIcon: require('../img/one_selected.png'), // local image asset for the tab icon selected state (optional, iOS only. On Android, Use `tabBarSelectedButtonColor` instead)
            iconInsets: { // add this to change icon position (optional, iOS only).
                top: 6, // optional, default is 0.
                left: 0, // optional, default is 0.
                bottom: -6, // optional, default is 0.
                right: 0 // optional, default is 0.
            },
            title: 'Screen One', // title of the screen as appears in the nav bar (optional)
            navigatorStyle: {
                statusBarColor: '#ff00ff'
            }, // override the navigator style for the tab screen, see "Styling the navigator" below (optional),
            navigatorButtons: {} // override the nav buttons for the tab screen, see "Adding buttons to the navigator" below (optional)
        },
        {
            label: 'Two',
            screen: 'calbum.SecondScreen',
            icon: require('../img/two.png'),
            selectedIcon: require('../img/two_selected.png'),
            title: 'Screen Two'
        }
    ],
    tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
        tabBarButtonColor: '#ffff00', // optional, change the color of the tab icons and text (also unselected)
        tabBarSelectedButtonColor: '#ff9900', // optional, change the color of the selected tab icon and text (only selected)
        tabBarBackgroundColor: '#551A8B' // optional, change the background color of the tab bar
    },
    appStyle: {
        orientation: 'portrait' // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
    },
    drawer: { // optional, add this if you want a side menu drawer in your app
        // left: { // optional, define if you want a drawer from the left
        //     screen: 'example.FirstSideMenu', // unique ID registered with Navigation.registerScreen
        //     passProps: {} // simple serializable object that will pass as props to all top screens (optional)
        // },
        // right: { // optional, define if you want a drawer from the right
        //     screen: 'example.SecondSideMenu', // unique ID registered with Navigation.registerScreen
        //     passProps: {} // simple serializable object that will pass as props to all top screens (optional)
        // },
        disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
    },
    passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
    animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
});