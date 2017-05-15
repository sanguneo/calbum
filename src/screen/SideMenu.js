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

var options = {
    title: '이미지 선택',
    cancelButtonTitle: '취소',
    takePhotoButtonTitle: '촬영',
    chooseFromLibraryButtonTitle: '불러오기',
    storageOptions: {
        skipBackup: true
    }
};

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: require('../../img/2016080300076_0.jpg')
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.profile} elevation={5}>
                    <Image
                        source={this.state.avatar}
                        style={styles.stretch}
                    />
                    {/*<Text style={styles.name}>상구너</Text>*/}
                </View>
                <TouchableOpacity  onPress={() => {this._openModal('second')}}>
                    <Image
                        source={require('../../img/navicon_add.png')}
                        style={[styles.leftIcon]}
                    />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {this._openModal('third')}}>
                    <Image
                        source={require('../../img/navicon_add.png')}
                        style={[styles.leftIcon]}
                    />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {this._openImagePicker()}}>
                    <Image
                        source={require('../../img/setting.png')}
                        style={[styles.leftIcon,{transform: [{ scale: 0.6}]}]}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={[{position: 'absolute', bottom: 0, left: 0}]} onPress={() => {this._toggleDrawer()}}>
                    <Image source={require('../../img/navicon_add.png')} style={[styles.leftIcon, styles.rotate45]} />
                </TouchableOpacity>

            </View>
        );
    }

    _toggleDrawer() {
        this.props.navigator.toggleDrawer({
            to: 'closed',
            side: 'left',
            animated: true
        });
    }
    _openModal(screen) {
        if (screen === 'second') {
            this.props.navigator.showModal({
                screen: "calbum.SecondScreen", // unique ID registered with Navigation.registerScreen
                title: "Modal", // title of the screen as appears in the nav bar (optional)
                passProps: {}, // simple serializable object that will pass as props to the modal (optional)
                navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            });
        }else {
            this.props.navigator.showModal({
                screen: "calbum.ThirdScreen", // unique ID registered with Navigation.registerScreen
                title: "Modal", // title of the screen as appears in the nav bar (optional)
                passProps: {}, // simple serializable object that will pass as props to the modal (optional)
                navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            });
        }
    }
    _openImagePicker() {
        // console.log(ImagePicker.showImagePicker);
        /*ImagePicker.showImagePicker(options, (response) => {
            if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                Alert.alert('aa', response.uri)
                this.setState({
                    avatar: source
                });
            }
        });*/
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width: 82
    },
    name: {
        textAlign: 'left',
        fontSize: 15,
        marginTop: -30,
        marginLeft: 10,
        marginRight: 10,
        fontWeight: '500',
        height: 30,
        width: 44,
        color: 'white',
        textShadowColor:'black',
        textShadowOffset:{width: 0.5, height: 0.5},
        textShadowRadius:7,
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
        width: 82,
        height: 82,
        marginBottom: 10
    },
    stretch: {
        width: 78,
        height: 78,
        borderRadius: 40,
        margin: 2
    },
    leftIcon: {
        width: 64,
        height: 64,
        margin: 8,
        tintColor: '#323339',
    },
    rotate45: {
        transform: [{ rotate: '45deg'}]
    }
});
