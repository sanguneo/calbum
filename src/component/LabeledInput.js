/**
 * Created by 나상권 on 2017-05-18.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

export default class LabeledInput extends Component {
    constructor(props) {
        super(props);
		this.stylesByDirection = {container: {}, label: {}, Input: {}}
    }
    render() {
        return (
            <View style={[styles.container, this.stylesByDirection.container, this.props.style]}>
				<Text style={[styles.label, this.stylesByDirection.label, this.props.labelStyle]}>{this.props.label}</Text>
                <View style={[styles.Input, this.stylesByDirection.Input, this.props.InputStyle]}>{this.props.children}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
		justifyContent: 'center',
		margin: 0
    },
    label: {
		flexDirection: 'row',
        flex: 30,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 9,
		justifyContent: 'center',
		alignItems: 'center'
	},
    Input: {
		flex: 70,
		justifyContent: 'center',
	}
});
