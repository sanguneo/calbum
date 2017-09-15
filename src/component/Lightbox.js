/**
 * Created by 나상권 on 2017-05-18.
 */

import React, {Component, PropTypes} from 'react';
import {Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class Lightbox extends Component {
	static propTypes = {
		fromValue: PropTypes.number.isRequired,
		toValue: PropTypes.number.isRequired,
		duration: PropTypes.number.isRequired,
		stylekey: PropTypes.string.isRequired,
		style: PropTypes.object,
		title: PropTypes.string,
		color: PropTypes.string,
		bgColor: PropTypes.string.isRequired,
		close: PropTypes.func,
		collapsed: PropTypes.bool,
		hideTop: PropTypes.bool,
		children: PropTypes.element.isRequired,
	};

	state = {height: 0};
	collapsedStyle = {};

	_propclose() {
		if (this.props.close) {
			this.props.close();
		}
	}
	_open() {
		setTimeout(() => {
			this.setState({ height});
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
			this.setState({height: 0});
		},this.props.duration + 50);
    }


	componentWillMount() {
		if (this.props.collapsed) {
			this.collapsedStyle = {paddingTop: 0, marginBottom: 0};
		}
		this.animatedValue = new Animated.Value(this.props.fromValue);
	}
	componentDidMount() {
		// this._open();
	}
    render() {
        const animatedStyle = {};
        animatedStyle[this.props.stylekey] = this.animatedValue;
        const top = !this.props.hideTop ? [<Text key={'title'} style={[styles.title, {color: this.props.color}]}>{this.props.title}</Text>,
			<TouchableOpacity key={'icon'} style={[styles.closeBtn]} onPress={() => {this._close();this._propclose();}}>
				<Image source={require('../../img/add.png')} style={[styles.close,{tintColor: this.props.color}]} />
			</TouchableOpacity>] : null;
		const collapsedStyle = {};
		if (this.props.hideTop) {
			collapsedStyle.paddingTop = 0;
		}
        return (
            <Animated.View style={[styles.container, animatedStyle, this.props.style, this.state]}>
                <View style={[styles.animatedview, {backgroundColor: this.props.bgColor}, collapsedStyle]}>
					{top}
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
        width: width,
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
