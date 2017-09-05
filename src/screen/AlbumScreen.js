import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Alert,
	Image,
	TextInput,
	TouchableOpacity,
	Dimensions
} from 'react-native';

const commonStyle = {
	placeholderTextColor: '#bbb'
}

export default class AlbumScreen extends Component {

	static navigatorButtons = {
		leftButtons: [{ id: 'sideMenu'}]
	};


	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.props.global.setVar('parent', this);
		this.state = {
			albumname: '',
			rows: [],
		}
		if (this.props.profile) {
			this._getAlbums();
		}
	}
	onNavigatorEvent(event) {
	}


	_getAlbums() {
		this.props.dbsvc.getAlbumsByUser(this.props.profile[0], (ret) => {
			this.setState({rows: ret.map((item)=>{return item.albumname})});
		});
	}
	_insertAlbum() {
		Alert.alert(
			'작성완료', this.state.albumname + '앨범을 등록할까요?\n확인을 누르시면 등록됩니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this.setState({rows : this.state.rows.concat([this.state.albumname])});
						this.props.dbsvc.insertAlbum(this.state.albumname, this.props.profile[0]);
					}
				},
				{text: '취소'},
			],
			{cancelable: true}
		);
	}
	_removeAlbum(albumname) {
		Alert.alert(
			'작성완료', albumname + '앨범을 삭제할까요?\n확인을 누르시면 삭제됩니다.',
			[
				{
					text: '확인',
					onPress: () => {
						this.setState({
							rows: this.state.rows.filter(function(_albumname) {
								return _albumname != albumname;
							})
						});
						this.props.dbsvc.removeAlbum(albumname, this.props.profile[0]);
					}
				},
				{text: '취소'},
			],
			{cancelable: true}
		);
	}
	_goAlbum(albumname) {
		let aobj = {
			screen: "calbum.InAlbumScreen",
			title: '"' + albumname + '" 앨범',
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profile: this.props.profile},
			navigatorStyle: {},
			navigatorButtons: navigatorButtons,
			animated: false,
			animationType: 'none'
		}
		if (albumname === '선택안함') aobj.title = '앨범 선택안됨';
		else aobj.passProps.albumname = albumname;
		this.props.navigator.push(aobj);
	}


	render() {
		let albumlist = this.state.rows.map((item, idx) => {
			return (
				<View  style={styles.row} key={idx}>
					<TouchableOpacity style={{height: 60,justifyContent: 'center'}} onPress={()=>{this._goAlbum(item+'')}}>
						<Text style={styles.rowContent}>{item}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>{this._removeAlbum(item+'')}}>
						<Image source={require('../../img/minus.png')} style={styles.rowButtonRemove}/>
					</TouchableOpacity>
				</View>
			);
		});
		return (
			<ScrollView style={styles.container}>
				<View  style={styles.row}>
					<TextInput
						ref={"albumname"}
						style={styles.rowContent}
						underlineColorAndroid={'transparent'}
						onChangeText={(albumname) => this.setState({albumname})}
						value={this.state.albumname}
						placeholder={'앨범 이름을 입력하세요.'}
						placeholderTextColor={commonStyle.placeholderTextColor}
					/>
					<TouchableOpacity onPress={()=> {this._insertAlbum()}}>
						<Image source={require('../../img/plus.png')} style={styles.rowButton}/>
					</TouchableOpacity>
				</View>
				{albumlist}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		width: Dimensions.get('window').width,
		height: 60,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	rowContent: {
		width: Dimensions.get('window').width - 60,
		paddingHorizontal: 0,
		textAlignVertical: 'center',
		fontSize: 18,
		color: '#000',
	},
	rowButton: {
		width: 30,
		height: 30,
		marginVertical: 15,
		marginLeft: 5,
		marginRight: 10,
		tintColor: '#11bb44',
	},
	rowButtonRemove: {
		width: 30,
		height: 30,
		marginVertical: 15,
		marginLeft: 5,
		marginRight: 10,
		tintColor: '#cc5533',
	}
});
