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

export default class CLoading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.floatView}>
                <View style={styles.floatInside}>
                    <Text>
                        페이지를 테스트합니다.
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    floatView: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
    },
    floatInside: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
