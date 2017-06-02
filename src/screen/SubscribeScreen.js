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
import Hr from '../component/LabeledInput';
import TagInput from '../component/TagInput';
import LabeledInput from '../component/LabeledInput';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'

const imgOpt = {
	width: 200,
	height: 400,
	cropping: true
};

const inputProps = {
	keyboardType: 'default',
	placeholder: '테그',
	autoFocus: false,
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#f0f0f0',
	backgroundColor: '#f0f0f0'
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
			navBarHideOnScroll: true,
			screenBackgroundColor: commonStyle.backgroundColor
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
			}).catch(e => {
				// console.log(e);
			});
		} else {
			ImagePicker.openPicker(imgOpt).then(uriRight => {
				this.setState({uriRight: {uri: uriRight.path}});
			}).catch(e => {
				// console.log(e);
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
				<View style={styles.imgView}>
					<TouchableOpacity onPress={() => {this._changeImage('left')}}>
						<Image source={this.state.uriLeft} style={styles.img}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this._changeImage('right')}}>
						<Image source={this.state.uriRight} style={styles.img}/>
					</TouchableOpacity>
				</View>
				<View style={styles.formWrapper}>
					<LabeledInput label={"제목"}>
						<TextInput
							style={styles.labeledtextbox}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(title) => this.setState({title})}
							value={this.state.title}
							placeholder={'제목'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"사진첩"}>
						<Picker style={[styles.album, pickerColor]} selectedValue={this.state.album} itemStyle={styles.itemStyle}
								onValueChange={(itemValue, itemIndex) => {this.setState({album: itemValue});}}>
							<Picker.Item label={'선택안함'} value={''}/>
							{this.state.albums.map((obj, i) => <Picker.Item key={i} label={obj.label} value={obj.value}/>)}
						</Picker>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"테그"}>
						<TagInput
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
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"레시피"} direction={"vertical"}>
						<AutoGrowingTextInput
							style={[styles.textboxag, {marginLeft: 32,}]}
							multiline={true}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(recipe) => this.setState({recipe})}
							value={this.state.recipe}
							placeholder={'레시피'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
					<Hr lineColor={commonStyle.hrColor}/>
					<LabeledInput label={"추가내용"} direction={"vertical"}>
						<AutoGrowingTextInput
							style={styles.textboxag}
							multiline={true}
							editable={true}
							autoCorrect={false}
							underlineColorAndroid={'transparent'}
							onChangeText={(comment) => this.setState({comment})}
							value={this.state.comment}
							placeholder={'추가내용'}
							placeholderTextColor={commonStyle.placeholderTextColor}
						/>
					</LabeledInput>
				</View>
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
		width: Dimensions.get('window').width ,
		height: Dimensions.get('window').width,
	},
	img: {
		width: Dimensions.get('window').width / 2,
		height: Dimensions.get('window').width,
	},
	formWrapper: {
		flex: 1,
		margin: 10,
		borderRadius:5,
		backgroundColor: 'white'
	},
	labeledtextbox: {
		height: 60,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 16,
		color: '#000',
		textAlign: 'left'
	},
	textbox: {
		height: 60,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 16,
		color: '#000',
		marginBottom: 10,
	},
	textboxag: {
		height: 60,
		marginLeft: 25,
		marginRight: 30,
		fontSize: 16,
		color: '#000',
		marginBottom: 10,
	},
	album: {
		height: 60,
		marginLeft: 5,
		marginRight: 5,
		color: '#000',
		borderColor: commonStyle.placeholderTextColor,
		alignItems: 'center',
	},
	tagContainer: {
		height: 30
	},
	tagTextStyle :{
		fontSize: 16
	},
});
