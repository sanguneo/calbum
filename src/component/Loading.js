/**
 * Created by 나상권 on 2017-05-18.
 */

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Animated,
	Easing,
    Dimensions
} from 'react-native';
const { width } = Dimensions.get('window');

export default class Loading extends Component {
	static propTypes = {
		bgColor: PropTypes.string,
		show: PropTypes.bool
	};
	state = {
		spinValue:  new Animated.Value(0),
	};
	_circleAnimation() {
		Animated.loop(
			Animated.timing(this.state.spinValue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear
			})
		).start();
	}

	componentWillMount() {
		this._circleAnimation();
	}
    render() {
		let spin = this.state.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});
		const bgColor = this.props.bgColor? this.props.bgColor : 'rgba(255,255,255,0.95)';
        return (
        	this.props.show ?
				(<Animated.View style={[styles.container, {backgroundColor:bgColor}, this.props.style]}>
					<Animated.Image source={require('../../img/eclipse.png')} style={[styles.loading, {transform: [{rotate: spin}]}]} />
            	</Animated.View>) : null
        );
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
		width: width,
		top: 0,
		bottom: 80,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
    },
	loading: {
		position: 'relative',
    	width: 200,
		height: 200,
		marginBottom: 40,
	}
});
