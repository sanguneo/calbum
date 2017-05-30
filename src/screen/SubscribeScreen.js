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
            uriLeft: require('../../img/plusbtn.jpg'),
            uriRight: require('../../img/plusbtn.jpg'),
            merged: { uri: null },
            title: '',
            recipe: '',
            userid: 'test',
            tags: '',
            regdate: new Date().getTime(),
            uniqkey:'',
            album: '',
			comment: ''
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
            let regdate = new Date().getTime();
			let uniqkey = this.crypt.getCryptedCode(regdate+this.crypt.getCharCodeSerial(this.state.userid,1));
			this.setState({regdate, uniqkey});
            Alert.alert(
                '작성완료', '작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
                [
                    {text: '확인', onPress: () => {
                        //this._mergeImage();
                        this._insertDB();
                        // this.props.navigator.pop({
                        //     animated: true // does the pop have transition animation or does it happen immediately (optional)
                        // });
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
    _mergeImage() {
        var self = this;
        Image2merge.image2merge([this.state.uriLeft.uri, this.state.uriRight.uri], uniqkey, this.state.userid, (arg) => {
            let uri = arg.replace('_type_','_original_');
            self.setState({merged: {uri: uri}});
        });
    }
    _insertDB() {
        let i_uniqkey = this.state.uniqkey;
		let i_regdate = this.state.regdate;
		let i_title = this.state.title;
		let i_recipe = this.state.recipe;
		let i_album = this.state.album;
		let i_comment = this.state.comment;
		let i_user = this.state.userid;
		let query = "INSERT INTO `ca_photo`(`unique_key`,`reg_date`,`title`,`recipe`,`album_key`,`comment`,`user_key`) " +
            "VALUES ('"+i_uniqkey+"','"+i_regdate+"','"+i_title+"','"+i_recipe+"','"+i_album+"','"+i_comment+"','"+i_user+"');";
		let i_tags = this.state.tags.split(',').map(string => string.trim());
		console.log(query);
		console.log(i_tags);
    }
    _formCheck(inputid) {
        switch (inputid) {
            case 'title':
                Alert.alert('확인', '제목을 입력해주세요.');
                break;
            case 'limg':
                Alert.alert('확인', '왼쪽 이미지를 선택해주세요.');
                break;
            case 'rimg':
                Alert.alert('확인', '오른쪽 이미지를 선택해주세요.');
                break;
            case 'recipe':
                Alert.alert('확인', '레시피를 입력해주세요.');
                break;
            case 'tag':
                Alert.alert('확인', '테그를 입력해주세요.');
                break;
            case 'album':
                Alert.alert('확인', '사진첩을 입력해주세요.');
                break;
            case 'comment':
                Alert.alert('확인', '코멘트를 입력해주세요.');
                break;
        }
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
                <AutoGrowingTextInput
                    style={styles.textbox}
                    multiline={true}
                    editable={true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(tags) => this.setState({tags})}
                    value={this.state.tags}
                    placeholder={'테그'}
                />
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
