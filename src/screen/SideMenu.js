import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.navigator);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.profile} elevation={5}>
                    <Image
                        source={require('../../img/2016080300076_0.jpg')}
                        style={styles.stretch}
                    />
                    {/*<Text style={styles.name}>상구너</Text>*/}
                </View>
                <TouchableOpacity>
                    <Image
                        source={require('../../img/navicon_add.png')}
                        style={[styles.leftIcon]}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('../../img/navicon_add.png')}
                        style={[styles.leftIcon]}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
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
