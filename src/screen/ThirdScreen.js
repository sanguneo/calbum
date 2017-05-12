/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';

var RNFS = require('react-native-fs');

export default class ThirdScreen extends Component {
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
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            success: 'no'
        }
        var path = RNFS.DocumentDirectoryPath + '/test.txt';

// write the file
        RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
                this.setState({success: 'FILE WRITTEN!'});
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    onNavigatorEvent(event) {
        if (event.id === 'menu') {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true
            });
        }
        if (event.id === 'edit') {
            Alert.alert('알림!!!', '두번째 EDIT');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {this.state.success}
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