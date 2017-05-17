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
    Image,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'

const imgOpt = {
    width: 200,
    height: 400,
    cropping: true
};

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
            success: 'no',
            uriLeft: require('../../img/2016080300076_0.jpg'),
            uriRight: require('../../img/2016080300076_0.jpg'),
            merged: { uri: 'file:///storage/emulated/0/_original_/name.jpg' }
        }
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
    _changeImage(direct) {
        if (direct === 'left') {
            ImagePicker.openPicker(imgOpt).then(uriLeft => {
                this.setState({uriLeft: {uri: uriLeft.path}});
            });
        } else {
            ImagePicker.openPicker(imgOpt).then(uriRight => {
                this.setState({uriRight: {uri: uriRight.path}});
            });
        }
    }
    __mergeImage(arg) {
        let tokenized = arg.split('|');
        this.setState({merged: {uri: tokenized[1]}});
    }
    _mergeImage() {
        var self = this;
        Image2merge.image2merge([this.state.uriLeft.uri, this.state.uriRight.uri], 'name', (arg) => {
            self.setState({merged: {uri: arg.replace('_type_','_original_')}});
            console.log(self.state);
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => {this._changeImage('left')}}>
                        <Image source={this.state.uriLeft} style={styles.img} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this._changeImage('right')}}>
                        <Image source={this.state.uriRight} style={styles.img} />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => {this._mergeImage()}}>
                    <Text>합치기</Text>
                </TouchableOpacity>
                <View style={styles.imgView}>
                    <Image source={this.state.merged} style={styles.merged} />
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
      width: Dimensions.get('window').width / 2,
      height: Dimensions.get('window').width
    },
    merged: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width
    }
});
