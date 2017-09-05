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
import Hr from '../component/Hr';
import Button from '../component/Button';
import TagInput from '../component/TagInput';
import LabeledInput from '../component/LabeledInput';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'
const RNFS = require('react-native-fs');

const imgOpt = {
	width: 400,
	height: 800,
	cropping: true
};

const inputProps = {
	keyboardType: 'default',
	placeholder: '테그',
	autoFocus: false,
};

const commonStyle = {
	placeholderTextColor: '#bbb',
	hrColor: '#000',
	backgroundColor: '#f5f5f5'
}
export default class ModifyScreen extends Component {

	static navigatorButtons = {
		rightButtons: [{ icon: require('../../img/checkmark.png'),id: 'save'}]
	};


	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.navigator.setStyle({
			navBarHideOnScroll: true,
		});
		this.crypt = this.props.crypt;
		this.db = this.props.dbsvc;
		this.state = {
			success: 'no',
			userid: props.profile[2],
			userkey: props.profile[0],
			// regdate: new Date().getTime(),
			uriLeft: {uri: this.props.targetProps.merged.uri.replace('.jpghidden', '_cropleft.jpghidden')},
			uriRight: {uri: this.props.targetProps.merged.uri.replace('.jpghidden', '_cropright.jpghidden')},
			srcLeft: '',
			srcRight: '',
			title: this.props.targetProps.title,
			recipe: this.props.targetProps.recipe,
			tags: this.props.targetProps.tags,
			uniqkey: this.props.targetProps.uniqkey,
			album: this.props.targetProps.album,
			comment: this.props.targetProps.comment,
			albums: [],
		}
	}
	onNavigatorEvent(event) {
		if (event.id === 'menu') {
			this.props.navigator.toggleDrawer({side: 'left',animated: true});
		}
		if (event.id === 'save') {
			this._submit();
		}
	}


	_getAlbums() {
		this.db.getAlbumsByUser(this.state.userkey, (ret) => {
			let albums = [];
			ret.forEach((item) => {
				albums.push({label: item.albumname, value: item.albumname})
			});
			this.setState({albums});
		});
	}
	_onChangeTags = (tags) => {
		this.setState({
			tags,
		});
	};
	_changeImage(direct) {
		if (direct === 'left') {
			ImagePicker.openPicker(imgOpt).then(result => {
				this.setState({uriLeft: {uri: result.path}, srcLeft: result.src});
				RNFS.copyFile(
					result.path.replace('file://', ''),
					RNFS.DocumentDirectoryPath + '/_original_/' + this.state.uniqkey+'_' + this.state.userid + '_cropleft.jpghidden'
				).then(() => {}).catch((e) => {console.error('error left', e)});
				RNFS.copyFile(
					result.src.replace('file://', ''),
					RNFS.DocumentDirectoryPath + '/_original_/' + this.state.uniqkey+'_' + this.state.userid + '_left.jpghidden'
				).then(() => {}).catch((e) => {console.error('error left', e)});
			}).catch(e => {
				console.log(e);
			});
		} else {
			ImagePicker.openPicker(imgOpt).then(result => {
				this.setState({uriRight: {uri: result.path }, srcRight: result.src});
				RNFS.copyFile(
					result.path.replace('file://', ''),
					RNFS.DocumentDirectoryPath + '/_original_/' + this.state.uniqkey+'_' + this.state.userid + '_cropright.jpghidden'
				).then(() => {}).catch((e) => {console.error('error left', e)});
				RNFS.copyFile(
					result.src.replace('file://', ''),
					RNFS.DocumentDirectoryPath + '/_original_/' + this.state.uniqkey+'_' + this.state.userid+ '_right.jpghidden'
				).then(() => {}).catch((e) => {console.error('error right', e)});
			}).catch(e => {
				console.log(e);
			});
		}
	}
	_mergeImage() {
		Image2merge.image2merge([this.state.uriLeft.uri, this.state.uriRight.uri], this.state.uniqkey, this.state.userid, () => {});
	}
	_insertDB() {
		this.db.updatePhoto(this.state.uniqkey, this.state.title, this.state.recipe, this.state.album, this.state.comment, this.state.userkey)
	}
	_insertTag() {
		this.db.insertTag(this.state.tags, this.state.uniqkey, this.state.userkey)
	}
	_formCheck() {
		if (this.state.title === '') {
			Alert.alert('확인', '제목을 입력해주세요.');
			this.refs.title.focus();
			return false;
		}
		if (this.state.uriLeft.uri === '') {
			Alert.alert('확인', '선택한 왼쪽 이미지에 오류가 있습니다.\n다시 선택해주세요.');
			return false;
		}
		if (this.state.uriRight.uri === '') {
			Alert.alert('확인', '선택한 오른쪽 이미지에 오류가 있습니다.\n다시 선택해주세요.');
			return false;
		}
		return true;
	}
	_submit() {
		if (!this._formCheck()) return;
		Alert.alert(
			'작성완료', '작성한 내용을 확인하셨나요?\n확인을 누르시면 저장됩니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this._mergeImage();
						this._insertDB();
						this._insertTag();
						this.props.parentUpdate(this.state.title);
						this.props.global.getVar('parent')._getPhoto();
						this.props.navigator.pop();
					}
				},
				{text: '취소'},
			],
			{cancelable: true}
		);
	}

	componentWillMount() {
		this._getAlbums();
	}
	componentDidMount() {
		let int,tf=!1;
		int = setInterval(() =>{
			tf&&this.refs.tag.props.value.length+1<=this.refs.tag.state.lines?clearInterval(int):(this.refs.tag.calculateWidth(),tf=!0)
		},100);
	}
	render() {
		let pickerColor = {color: this.state.album === '' ? commonStyle.placeholderTextColor : '#000'};
		return (
			<ScrollView style={styles.container}>
				<View style={styles.imgView}>
					<TouchableOpacity onPress={() => {this._changeImage('left')}}>
						<Image source={this.state.uriLeft} style={[styles.img, {borderRightWidth: 0}]}/>
						<Text style={[styles.imglabel, styles.lblLeft]}>Before</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this._changeImage('right')}}>
						<Image source={this.state.uriRight} style={[styles.img, {borderLeftWidth: 0}]}/>
						<Text style={[styles.imglabel, styles.lblRight]}>After</Text>
					</TouchableOpacity>
				</View>
				<View style={[styles.bgView,{marginTop: 15}]}>
					<Text style={{fontSize: 17}}>기본정보</Text>
				</View>
				<View style={styles.formWrapper}>
					<LabeledInput label={"제목"}>
						<TextInput
							ref={"title"}
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
					<LabeledInput label={"앨범"}>
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
							onChange={this._onChangeTags}
							tagColor={commonStyle.placeholderTextColor}
							placeholderTextColor={commonStyle.placeholderTextColor}
							tagTextColor="white"
							inputProps={inputProps}
							parseOnBlur={true}
							numberOfLines={99}
							ref={"tag"}
						/>
					</LabeledInput>
				</View>
				<View style={styles.bgView}>
					<Text style={{fontSize: 17}}>레시피</Text>
				</View>
				<View style={styles.formWrapper}>
					<AutoGrowingTextInput
						style={[styles.textboxag]}
						multiline={true}
						editable={true}
						autoCorrect={false}
						underlineColorAndroid={'transparent'}
						onChangeText={(recipe) => this.setState({recipe})}
						value={this.state.recipe}
						placeholder={'레시피'}
						placeholderTextColor={commonStyle.placeholderTextColor}
						blurOnSubmit={false}
					/>
				</View>
				<View style={styles.bgView}>
					<Text style={{fontSize: 17}}>코멘트</Text>
				</View>
				<View style={styles.formWrapper}>
					<AutoGrowingTextInput
						style={styles.textboxag}
						multiline={true}
						editable={true}
						autoCorrect={false}
						underlineColorAndroid={'transparent'}
						onChangeText={(comment) => this.setState({comment})}
						value={this.state.comment}
						placeholder={'코멘트'}
						placeholderTextColor={commonStyle.placeholderTextColor}
						blurOnSubmit={false}
					/>
				</View>
				<View style={[styles.formWrapper, {marginTop: 20,marginBottom: 30}]}>
					<Button imgsource={require('../../img/checkmark.png')}  style={{backgroundColor: '#36384C'}} onPress={()=>{this._submit();}} btnname={'저장'}/>
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
		height: Dimensions.get('window').width + 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'lightgray',
		borderBottomWidth: 1
	},
	img: {
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
		height: Dimensions.get('window').width < 800 ? Dimensions.get('window').width : 800,
	},
	imglabel: {
		width: Dimensions.get('window').width < 800 ? Dimensions.get('window').width / 2 : 400,
		height: 44,
		marginTop: 4,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
	},
	lblLeft: {
		color: 'rgba(227,48,45,0.9)',
	},
	lblRight: {
		color: 'rgba(58,142,207,0.8)',
	},
	formWrapper: {
		flex: 1,
		margin: 10,
		borderRadius:5,
		backgroundColor: commonStyle.backgroundColor
	},
	bgView: {
		backgroundColor: 'white',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 3,
		marginBottom: 2,
	},
	labeledtextbox: {
		height: 42,

		margin: 0,
		marginLeft: 10,
		marginRight: 10,


		fontSize: 15,
		color: '#000',
		textAlign: 'left'
	},
	textbox: {
		height: 58,
		marginLeft: 10,
		marginRight: 10,
		fontSize: 14,
		color: '#000',
		marginBottom: 10,
	},
	textboxag: {
		height: 36,
		marginLeft: 20,
		marginRight: 20,
		fontSize: 15,
		color: '#000',
	},
	album: {
		height: 41,
		marginLeft: 5,
		marginRight: 5,
		color: '#000',
		borderColor: commonStyle.placeholderTextColor,
		alignItems: 'center',
	},
	tagContainer: {
		height: 42
	},
	tagTextStyle :{
		fontSize: 16
	}
});
