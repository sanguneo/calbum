/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
const imgOpt = {
    width: 200,
    height: 400,
    cropping: true
};

const RNFS = require('react-native-fs');

export default class SubscribeScreen extends Component {
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
            <ScrollView style={styles.container}>
                <View style={styles.imgView}>
                    <Image source={require('../../img/2016080300076_0.jpg')} style={styles.img} />
                    <Image source={require('../../img/2016080300076_0.jpg')} style={styles.img} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgView : {
        flex: 1,
        flexDirection: 'row'
    },
    img :{
      width: window.width / 2,
      height: window.width
    }
});
