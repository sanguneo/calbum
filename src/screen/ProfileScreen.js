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
        this.crypt = this.props.crypt;
        this.state = {
            success: 'no',
            profile: { uri: null },
            name: 'test',
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
        ImagePicker.openPicker(imgOpt).then(profile => {
            this.setState({profile: {uri: profile.path}});
			this.props.global.getVar('side').setState({profile: {uri: profile.path}});
        });
    }
    _formCheck(inputid) {
        switch (inputid) {
            case 'title':
                Alert.alert('확인', '제목을 입력해주세요.');
                break;
            case 'comment':
                Alert.alert('확인', '코멘트를 입력해주세요.');
                break;
        }
    }

	componentDidMount() {
	}

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => {this._changeImage('left')}}>
                        <Image source={this.state.profile} style={styles.img} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.textbox}
                    editable = {true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(title) => this.setState({name})}
                    value={this.state.title}
                    placeholder={'이름'}
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
		margin: (Dimensions.get('window').width - 200) / 2,
        width: 200,
        height: 200,
    },
    textbox: {
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 17,
        color: '#000'
    }
});
