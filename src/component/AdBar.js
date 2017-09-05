import React, {Component} from 'react';
import {
	AdMobBanner,
} from 'react-native-admob'
import admob_svc from '../service/admob_svc'
import {Text, View, StyleSheet, Dimensions} from 'react-native';


export default class AdBar extends Component{
	render() {
		return (
			<View style={[styles.barBox, this.props.style]}>
				<AdMobBanner
					bannerSize="smartBannerPortrait"
					adUnitID={admob_svc.bottomBanner}
					didFailToReceiveAdWithError={console.log} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	barBox: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: 'gray',
		marginRight: -0.5
	},
	text: {
		width: 95,
		height: 50,
		backgroundColor: 'black'
	}
});
