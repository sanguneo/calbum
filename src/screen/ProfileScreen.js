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
    TextInput,
    Button
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
            profile: this.props.profile[1],
			userid: this.props.profile[2],
            name: this.props.profile[3],
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
                <View style={styles.textView}>
                    <Text style={styles.text}>아이디: </Text>
                    <TextInput
                        style={styles.textbox}
                        editable = {false}
                        autoCorrect={false}
                        underlineColorAndroid={'#aaa'}
                        onChangeText={(userid) => this.setState({userid})}
                        value={this.state.userid}
                        placeholder={'아이디'}
                    />
                </View>
                <View style={styles.textView}>
                    <Text style={styles.text}>이&nbsp;&nbsp;&nbsp;&nbsp;름: </Text>
                    <TextInput
                        style={styles.textbox}
                        editable = {true}
                        autoCorrect={false}
                        underlineColorAndroid={'#aaa'}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        placeholder={'이름'}
                    />
                </View>
                <TouchableOpacity style={styles.button}>
                    <Image source={require('../../img/checkmark.png')} style={styles.btnimg} /><Text style={styles.btntext} >저장</Text>
                </TouchableOpacity>
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
        flexDirection: 'row',
        height: 300
    },
    img :{
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: '#bbb',
        marginHorizontal: (Dimensions.get('window').width - 200) / 2,
		marginVertical: 50,
    },
    textView: {
        flex: 1,
        flexDirection: 'row',
		flexWrap:'wrap',
		justifyContent: 'flex-start',
    },
    text: {
        width: (Dimensions.get('window').width - 200) / 2 - 20,
		height: 60,
        marginRight: 20,
		fontSize: 17,
		color: '#777',
		textAlign: 'right',
		alignSelf: 'flex-start',
        textAlignVertical: 'center'
	},
    textbox: {
        width: 200,
        height: 60,
        fontSize: 17,
        color: '#000',
        textAlign: 'center',
    },
    button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	    width: 200,
        height: 50,
		marginHorizontal: (Dimensions.get('window').width - 200) / 2,
        marginTop: Dimensions.get('window').height - 600,
        backgroundColor: '#6cbf84',
        paddingTop: 11,
		paddingBottom: 19,
        borderColor: '#dfe2d2',
        borderWidth:1
    },
    btnimg: {
		width: 30,
		height: 30,
		tintColor: '#fff',
    },
	btntext: {
        marginLeft: 20,
		height: 30,
		fontSize: 17,
		textAlignVertical: 'center',
        color: '#fff'
	}
});
