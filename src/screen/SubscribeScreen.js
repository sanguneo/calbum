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
	Picker,
} from 'react-native';

import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import TagInput from '../component/TagInput';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'

const imgOpt = {
	width: 200,
	height: 400,
	cropping: true
};

const inputProps = {
	keyboardType: 'default',
	placeholder: '태그',
	autoFocus: false,
};

const commonStyle = {
	placeholderTextColor: '#bbb'
}
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
		this.props.navigator.setStyle({
			navBarHideOnScroll: true
		})
		this.crypt = this.props.crypt;
		this.db = this.props.dbsvc;
		this.state = {
			success: 'no',
			uriLeft: require('../../img/plusbtn.jpg'),
			uriRight: require('../../img/plusbtn.jpg'),
			merged: {uri: null},
			title: '',
			recipe: '',
			userid: 'test',
			tags: [],
			regdate: new Date().getTime(),
			uniqkey: '',
			album: '',
			comment: '',
			albums: []
		}

		// console.log(this.db.getTransaction());
		this._getAlbums();
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
			let uniqkey = this.crypt.getCryptedCode(regdate + this.crypt.getCharCodeSerial(this.state.userid, 1));
			this.setState({regdate, uniqkey});
			Alert.alert(
				'작성완료', '작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
				[
					{
						text: '확인', onPress: () => {
						//this._mergeImage();
						this._insertDB();
						// this.props.navigator.pop({
						//     animated: true // does the pop have transition animation or does it happen immediately (optional)
						// });
					}
					},
					{text: '취소'},
				],
				{cancelable: true}
			);
		}
	}

	_getAlbums() {
		this.db._getAlbum((ret) => {
			let albums = [];
			ret.forEach((item) => {
				albums.push({label: item.name, value: item.unique_key})
			});
			this.setState({albums});
		});
	}
	onChangeTags = (tags) => {
		this.setState({
			tags,
		});
	};

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
			let uri = arg.replace('_type_', '_original_');
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
			"VALUES ('" + i_uniqkey + "','" + i_regdate + "','" + i_title + "','" + i_recipe + "','" + i_album + "','" + i_comment + "','" + i_user + "');";
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
		let pickerColor = {color: this.state.album === '' ? commonStyle.placeholderTextColor : '#000'};
		return (
			<ScrollView style={styles.container}>
				<TextInput
					style={styles.textbox}
					editable={true}
					autoCorrect={false}
					underlineColorAndroid={'transparent'}
					onChangeText={(title) => this.setState({title})}
					value={this.state.title}
					placeholder={'제목'}
					placeholderTextColor={commonStyle.placeholderTextColor}
				/>
				<View style={styles.imgView}>
					<TouchableOpacity onPress={() => {this._changeImage('left')}}>
						<Image source={this.state.uriLeft} style={styles.img}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this._changeImage('right')}}>
						<Image source={this.state.uriRight} style={styles.img}/>
					</TouchableOpacity>
				</View>
				<Picker style={[styles.album, pickerColor]} selectedValue={this.state.album}
						onValueChange={(itemValue, itemIndex) => {this.setState({album: itemValue});}}>
					<Picker.Item label={'사진첩 선택안함'} value={''}/>
					{this.state.albums.map((obj, i) => <Picker.Item key={i} label={obj.label} value={obj.value}/>)}
				</Picker>
				{/*<AutoGrowingTextInput
					style={styles.textbox}
					multiline={true}
					editable={true}
					autoCorrect={false}
					underlineColorAndroid={'transparent'}
					onChangeText={(tags) => this.setState({tags})}
					value={this.state.tags}
					placeholder={'테그'}
					placeholderTextColor={commonStyle.placeholderTextColor}
				/>*/}
				<TagInput
					style={styles.tagInputComp}
					tagContainerStyle={styles.tagContainer}
					tagTextStyle={styles.tagTextStyle}
					value={this.state.tags}
					onChange={this.onChangeTags}
					tagColor={commonStyle.placeholderTextColor}
					tagTextColor="white"
					inputProps={inputProps}
					parseOnBlur={true}
					numberOfLines={99}
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
					placeholderTextColor={commonStyle.placeholderTextColor}
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
					placeholderTextColor={commonStyle.placeholderTextColor}
				/>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imgView: {
		flex: 1,
		flexDirection: 'row',
		width: Dimensions.get('window').width - 20,
		height: Dimensions.get('window').width -20,
		marginLeft: 10,
		marginRight: 10,
	},
	img: {
		width: Dimensions.get('window').width / 2 - 10,
		height: Dimensions.get('window').width - 20,
	},
	textbox: {
		height: 60,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 17,
		color: '#000',
		borderBottomWidth: 1,
		borderColor: commonStyle.placeholderTextColor,
		marginBottom: 10,
	},
	album: {
		height: 60,
		marginLeft: 5,
		marginRight: 5,
		color: '#000',
		borderBottomWidth: 2,
		borderColor: commonStyle.placeholderTextColor,
	},
	tagInputComp:{
		height: 1000,
	},
	tagContainer: {
		height: 30
	},
	tagTextStyle :{
		fontSize: 17
	}
});
