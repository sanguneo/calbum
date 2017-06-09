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

import LabeledInput from '../component/LabeledInput';
import Hr from '../component/Hr';
import Button from '../component/Button';

import ImagePicker from 'react-native-image-crop-picker';
const RNFS = require('react-native-fs');
import md5 from '../service/md5';

const imgOpt = {
    width: 400,
    height: 400,
    cropping: true
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#000',
	backgroundColor: '#f5f5f5'
}

export default class ProfileScreen extends Component {
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
			email: this.props.profile[4],
			pass: '',
			passchk: '',
			uniqkey: ''
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
    _changeImage() {
        ImagePicker.openPicker(imgOpt).then(profile => {
			this.setState({profile: {uri: profile.path}});
        });
    }
    _saveProfileImage() {
		let pPath = RNFS.DocumentDirectoryPath + '/_profiles_/' + this.state.uniqkey + '.jpg';
		RNFS.moveFile(this.state.profile.uri, pPath);
		this.props.global.getVar('side').setState({profile: {uri: 'file://'+pPath}});
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
    _setUnique() {
		let regdate = new Date().getTime();
		let uniqkey = this.crypt.getCryptedCode(this.crypt.getCharCodeSerial(this.state.userid, 1));
		this.setState({regdate, uniqkey})
	}
    _submit() {
    	this._setUnique();
		if(this.props.profileCreate) {
			this.props.dbsvc.editUSER(this.state.uniqkey,this.state.regdate, this.state.userid, this.state.name, md5(this.state.pass),(ret) => {
				console.log(ret);
				this._saveProfileImage();
			});
		}else {
			this.props.dbsvc.regUSER(this.state.uniqkey,this.state.regdate, this.state.userid, this.state.name, md5(this.state.pass),(ret) => {
				console.log(ret);
				this._saveProfileImage();
			});
		}
	}
	componentWillMount() {
		this.props.dbsvc.getUSER((ret) => {
			let row = ret[0]
			this.setState({
				profile: {uri: RNFS.DocumentDirectoryPath + '/_profiles_/' + row.unique_key + '.jpg'},
				userid: row.user_id,
				name: row.name,
				email: row.email,
				uniqkey: row.unique_key
			});
		});
	}
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => {this._changeImage('left')}}>
                        <Image source={this.state.profile} style={styles.img} />
                    </TouchableOpacity>
                </View>
                <View style={styles.formWrapper}>
                    <LabeledInput label={"아이디"}>
                        <TextInput
                            style={styles.labeledtextbox}
                            editable={true}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(userid) => this.setState({userid})}
                            value={this.state.userid}
                            placeholder={'아이디를 입력해주세요'}
                            placeholderTextColor={commonStyle.placeholderTextColor}
                        />
                    </LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"이메일"}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(email) => this.setState({email})}
							value={this.state.email}
							placeholder={'이메일을 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
                    <Hr lineColor={commonStyle.hrColor}/>
                    <LabeledInput label={"닉네임"}>
                        <TextInput
                            style={styles.labeledtextbox}
                            editable={true}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            placeholder={'닉네임을 입력해주세요'}
                            placeholderTextColor={commonStyle.placeholderTextColor}
                        />
                    </LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"비밀번호"}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(pass) => this.setState({pass})}
							value={this.state.pass}
							placeholder={'비밀번호를 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"확인"}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(passchk) => this.setState({passchk})}
							value={this.state.passchk}
							placeholder={'비밀번호를 다시 입력해주세요'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
                </View>
                <View style={[styles.formWrapper]}>
                    <Button imgsource={require('../../img/checkmark.png')}/>
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
        flexDirection: 'row',
        height: 250
    },
    img :{
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: '#bbb',
        marginHorizontal: (Dimensions.get('window').width - 200) / 2,
		marginVertical: 20,
    },
	formWrapper: {
		flex: 1,
		margin: 10,
        marginLeft:45,
        marginRight: 45,
		borderRadius:5,
		backgroundColor: '#f5f5f5',
		marginBottom: 30,
	},
	labeledtextbox: {
		height: 42,

		margin: 0,
		marginLeft: 10,
		marginRight: 10,


		fontSize: 16,
		color: '#000',
		textAlign: 'left'
	},
	textbox: {
		height: 58,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 16,
		color: '#000',
		marginBottom: 10,
	},
});
