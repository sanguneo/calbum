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
    Text,
    Dimensions
} from 'react-native';

export default class LabeledInput extends Component {
    constructor(props) {
        super(props);
		this.stylesByDirection = {container: {}, label: {}, Input: {}}
        if(this.props.direction === "vertical") {
			this.stylesByDirection.container.flexDirection= 'column';
			this.stylesByDirection.label.paddingBottom = 3;
			this.stylesByDirection.Input.flex = 1;
        }
    }
    render() {
        return (
            <View style={[styles.container, this.stylesByDirection.container, this.props.style]}>
                {(this.props.direction !== "vertical") ?
                    <Text style={[styles.label, this.stylesByDirection.label, this.props.labelStyle]}>{this.props.label}</Text> :
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.label, this.stylesByDirection.label, this.props.labelStyle]}>{this.props.label}</Text>
                        <Text style={styles.Input}></Text>
                    </View>
                }
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
    },
    label: {
		flexDirection: 'row',
        flex: 30,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 18,
    },
    Input: {
		flex: 70,
    }
});
