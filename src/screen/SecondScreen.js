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

export default class SecondScreen extends Component {
    static navigatorButtons = {
        rightButtons: [{
            title: 'Edit',
            id: 'edit'
        }
        ],
        leftButtons: [{
            title: 'Menu',
            id: 'menu'
        }],
    };
    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    onNavigatorEvent(event) {
        if (event.id === 'menu') {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true
            });
        }
        if (event.id === 'edit') {
            Alert.alert('NavBar', 'Edit button pressed');
            this.props.navigator.resetTo({
                screen: 'calbum.SecondScreen', // unique ID registered with Navigation.registerScreen
                title: undefined, // navigation bar title of the pushed screen (optional)
                passProps: {}, // simple serializable object that will pass as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    asdfsfsfsf
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
