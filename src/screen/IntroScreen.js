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
    Alert
} from 'react-native';
import dbSvc from '../service/calbumdb_svc';

export default class IntroScreen extends Component {
    static navigatorButtons = {
        leftButtons: [
            {
                id: 'sideMenu' // id is locked up 'sideMenu'
            }
        ],
        rightButtons: [
            /*{
                icon: require('../../img/setting.png'),
                id: 'edit'
            }*/
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        var db = new dbSvc();
        db.initialDB();
    }

    onNavigatorEvent(event) {
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {this.state.rows.map((row) => (row.idx + '\n'))}
                    페이지를 테스트합니다.
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
