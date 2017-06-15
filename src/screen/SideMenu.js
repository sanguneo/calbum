import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

const RNFS = require('react-native-fs');

const imgOpt = {
    width: 200,
    height: 200,
    cropping: true
};

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            profile: require('../../img/profile.png'),
            name: '',
            userid: '',
			email: '',
			uniquekey: ''
        }
        props.global.setVar('side', this);
    }
	_initializeUser() {
		this.props.dbsvc.getUSER((ret) =>{

			if (ret.length > 0) {
				let row = ret[0];
				this.setState({
					profile: {uri: 'file://'+RNFS.DocumentDirectoryPath + '/_profiles_/' + row.unique_key + '.jpg'},
					userid: row.user_id,
					name: row.name,
					email: row.email,
					uniquekey: row.unique_key
				});
			} else {
				this.props.navigator.push({
					screen: "calbum.ProfileScreen",
					title: "프로필 생성하기",
					passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profileCreate: true, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]},
					navigatorStyle: {},
					navigatorButtons: {},
					animated: true,
					animationType: 'fade'
				});
			}
		});
	}
	componentDidMount() {
    	this._initializeUser();
	}
    render() {
		let profile = this.state.profile;
		if (this.state.profile.uri) {
			let key = Math.random() * 100000;
			profile.uri = profile.uri.split('?key=')[0] + '?key=' + key;
		}
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.profile} onPress={() => {this._openModal('profile')}}>
                    <Image
                        source={profile}
                        style={styles.stretch}
                    />
                    <Text style={styles.name}>{this.state.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.sideBtn} onPress={() => {this._openModal('subscribe')}}>
                    <Image
                        source={require('../../img/quill.png')}
                        style={[styles.leftIcon]}
                    />
                    <Text style={styles.sidetext}>작성하기</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.sideBtn} onPress={() => {this._openModal('intro')}}>
                    <Image
                        source={require('../../img/images.png')}
                        style={[styles.leftIcon]}
                    />
                    <Text style={styles.sidetext}>전체보기</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.sideBtn} onPress={() => {this._openModal('view')}}>
                    <Image
                        source={require('../../img/book.png')}
                        style={[styles.leftIcon]}
                    />
                    <Text style={styles.sidetext}>앨범보기</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.sideBtn} onPress={() => {this._openModal('tag')}}>
                    <Image
                        source={require('../../img/price-tags.png')}
                        style={[styles.leftIcon]}
                    />
                    <Text style={styles.sidetext}>태그보기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{position: 'absolute', bottom: 10, left: 0},styles.sideBtn]} onPress={() => {this._toggleDrawer()}}>
                    <Image source={require('../../img/navicon_add.png')} style={[styles.leftIcon, styles.rotate45]} />
                    <Text style={styles.sidetext}>닫기</Text>
                </TouchableOpacity>
            </View>
        );
    }
	onNavigatorEvent(event) {
	}
    _toggleDrawer() {
        this.props.navigator.toggleDrawer({
            to: 'closed',
            side: 'left',
            animated: true
        });

    }
    _openModal(screen) {
    	let userinfo = {
    		name: this.state.name,
			userid: this.state.userid,
			uniquekey: this.state.uniquekey,
		};
		if (screen === 'subscribe') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: "calbum.SubscribeScreen", // unique ID registered with Navigation.registerScreen
				title: "디자인 작성하기", // title of the screen as appears in the nav bar (optional)
				passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]}, // simple serializable object that will pass as props to the modal (optional)
				navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
				navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
				animated: true,
				animationType: 'fade' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			});
		} else if (screen === 'profile') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: "calbum.ProfileScreen",
				title: "프로필",
				passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, profileCreate: false, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]},
				navigatorStyle: {},
				navigatorButtons: {},
				animated: true,
				animationType: 'fade'
			});
		} else if (screen === 'intro') {
			this._toggleDrawer();
			this.props.navigator.resetTo({
				screen: "calbum.IntroScreen",
				title: "인트로",
				passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]},
				navigatorStyle: {},
				navigatorButtons: {leftButtons: [
					{
						id: 'sideMenu' // id is locked up 'sideMenu'
					}
				]},
				animated: false,
				animationType: 'none'
			});
		} else if (screen === 'view') {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: "calbum.ViewScreen", // unique ID registered with Navigation.registerScreen
				title: "디자인 보기", // title of the screen as appears in the nav bar (optional)
				passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, profile: [this.state.uniquekey, this.state.profile, this.state.userid, this.state.name, this.state.email]}, // simple serializable object that will pass as props to the modal (optional)
				navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
				navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
				animated: true,
				animationType: 'fade' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			});
		} else {
			this._toggleDrawer();
			this.props.navigator.push({
				screen: "calbum.ThirdScreen", // unique ID registered with Navigation.registerScreen
				title: "Modal", // title of the screen as appears in the nav bar (optional)
				passProps: {}, // simple serializable object that will pass as props to the modal (optional)
				navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
				navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
				animated: true,
				animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
			});
		}
    }
    _openImagePicker() {
    	console.dbg(this.props.userinfo);
        // ImagePicker.openPicker(imgOpt).then((profile) => {
        //     this.setState({profile: {uri: profile.path}});
        //     RNFS.copyFile(profile.path.replace('file://',''), RNFS.DocumentDirectoryPath + '/_profiles_/'+this.state.uniquekey+'_'+this.state.userid+'.jpg');
        // });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width: 200
    },
    name: {
        textAlign: 'right',
        fontSize: 15,
        marginTop: -30,
        marginLeft: 10,
        marginRight: 10,
        fontWeight: '500',
        height: 30,
        width: 170,
        color: 'white',
        textShadowColor:'black',
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:2,
    },
    title: {
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        fontWeight: '500'
    },
    button: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 10,
        marginTop: 10,
        // marginLeft: 10,
    },
    profile: {
        width: 200,
        height: 200,
        elevation: 1,
        marginBottom: 10,
        borderColor: '#000',
    },
    stretch: {
        width: 200,
        height: 200,
    },
    sideBtn: {
        flexDirection: 'row',
        width: 200,
        height: 50
    },
    leftIcon: {
        width: 50,
        height: 50,
        margin: 8,
        tintColor: '#323339',
        resizeMode: 'contain',
        transform: [{ scale: 0.6}]
    },
    sidetext: {
        width: 95,
        height: 50,
        marginTop: 21,
        textAlign: 'center',
        fontSize: 15
    },
    rotate45: {
        transform: [{ rotate: '45deg'}]
    }
});
