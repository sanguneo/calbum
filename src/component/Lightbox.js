/**
 * Created by 나상권 on 2017-05-18.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
	TouchableOpacity,
    Image,
    Text,
    Animated,
    Easing,
    Dimensions
} from 'react-native';

export default class Lightbox extends Component {
    // {
    //     fromValue: number,
    //     toValue: number,
    //     duration: number,
    //     key: string,
    // }
    state = {
        height: 0
    }
    componentWillMount() {
        this.animatedValue = new Animated.Value(this.props.fromValue);
    }
	componentDidMount() {
        // this._open();
	}
	_open() {
		setTimeout(() => {
			this.setState({
				height: Dimensions.get('window').height
			});
		}, 50);
		Animated.timing(this.animatedValue, {
			toValue: this.props.toValue,
			duration: this.props.duration,
		}).start();

    }
    _close() {
		Animated.timing(this.animatedValue, {
			toValue: this.props.fromValue,
			duration: this.props.duration,
		}).start();
		setTimeout(() => {
			this.setState({
				height: 0
			});
		},this.props.duration + 50);
    }
    render() {
        const animatedStyle = {};
        animatedStyle[this.props.stylekey] = this.animatedValue;
        return (
            <Animated.View style={[styles.container, animatedStyle, this.state]}>
                <View style={[styles.animatedview]}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => {this._close()}}>
                        <Image source={require('../../img/navicon_add.png')} style={[styles.close]} />
                    </TouchableOpacity>
					{this.props.children}
                </View>
            </Animated.View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left:0,
        width: Dimensions.get('window').width,
		backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
		justifyContent: 'center',
    },
	animatedview :{
        backgroundColor: 'white',
        paddingTop: 50,
        marginBottom: 100
    },
	title: {
        flex: 1,
		position: 'absolute',
        textAlignVertical: 'center',
		top: 0,
		left: 10,
		height: 50,
		zIndex: 5,
        fontSize: 17,
		color: 'black',
	},
    closeBtn: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 10,
    },
    close: {
		width: 50,
		height: 50,
		tintColor: 'black',
		transform: [{ rotate: '45deg'}]
    },
});
