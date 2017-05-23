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
    Alert,
    TextInput
} from 'react-native';

import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'

const imgOpt = {
    width: 200,
    height: 400,
    cropping: true
};
const regdate = new Date().getTime();

export default class SubscribeScreen extends Component {
    static navigatorButtons = {
        leftButtons: [],
        rightButtons: [
            {
                icon: require('../../img/checkmark.png'),
                id: 'save'
            }
        ]
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            success: 'no',
            uriLeft: require('../../img/2016080300076_0.jpg'),
            uriRight: require('../../img/2016080300076_0.jpg'),
            merged: { uri: null },
            title: '',
            recipe: ''
        }
    }

    onNavigatorEvent(event) {
        if (event.id === 'menu') {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true
            });
        }
        if (event.id === 'save') {
            Alert.alert(
                '작성완료', '작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
                [
                    {text: '확인', onPress: () => {
                        this._mergeImage('uniqueKey',regdate);
                        this.props.navigator.pop({
                            animated: true // does the pop have transition animation or does it happen immediately (optional)
                        });
                    }},
                    {text: '취소'},
                ],
                { cancelable: true }
            );
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
    _mergeImage(uniqkey, regdate, name='example', id='test') {
        var self = this;
        Image2merge.image2merge([this.state.uriLeft.uri, this.state.uriRight.uri], uniqkey+name, id, (arg) => {
            var uri = arg.replace('_type_','_original_');
            self.setState({merged: {uri: uri}});
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.textbox}
                    editable = {true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(title) => this.setState({title})}
                    value={this.state.title}
                    placeholder={'제목'}
                />
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => {this._changeImage('left')}}>
                        <Image source={this.state.uriLeft} style={styles.img} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this._changeImage('right')}}>
                        <Image source={this.state.uriRight} style={styles.img} />
                    </TouchableOpacity>
                </View>
                <Image source={this.state.merged} style={styles.merged} />
                <AutoGrowingTextInput
                    style={styles.textbox}
                    multiline={true}
                    editable={true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(recipe) => this.setState({recipe})}
                    value={this.state.recipe}
                    placeholder={'레시피'}
                />
                <AutoGrowingTextInput
                    style={styles.textbox}
                    multiline={true}
                    editable={true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(comment) => this.setState({comment})}
                    value={this.state.comment}
                    placeholder={'추가내용'}
                />
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
    },
    textbox: {
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 17,
        color: '#000'
    }
});
