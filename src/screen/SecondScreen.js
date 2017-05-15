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
        this.state = {
            files : ''
        }
        var files = [];
        var self = this;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/../../com.calbum.provider/app_images/Pictures/') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);
                result.forEach((itm) => {
                    files.push(itm.path);
                });
            }).then(() => {
                console.log(files.join('\n'));
                self.setState({files: files.join('\n')});
            }).catch((err) => {
                console.log(err.message, err.code);
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
                    {this.state.files}
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
