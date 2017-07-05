import React, {Component} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Text,
	Dimensions
} from 'react-native';

import Hr from './Hr';

export default class Titler extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<TouchableOpacity style={styles.container} onPress={()=>{this.props.onPress();}}>
				<Hr lineColor={'#000'} lineWidth={2} text={this.props.children} textStyle={{fontSize: 17}} containerHeight={23}/>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		marginVertical: 10
	},
});
