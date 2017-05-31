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
    Text,
    View,
    Dimensions
} from 'react-native';

export default class CNavBar extends Component {
    constructor(props) {
        super(props);
        this.styleAttributes = {};
    }
    render() {
        return (
            <View style={[styles.navbarcontainer, this.props.style, this.styleAttributes]}>
                <Text>페이지를 테스트합니다.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navbarcontainer: {
        width: '100%',
        height: 50,
        borderColor: '#000',
        borderBottomWidth: 1,
		justifyContent: 'center',
    }
});
