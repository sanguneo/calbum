import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>메뉴</Text>
                <TouchableOpacity>
                    <Text style={styles.button}>아이템</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.button}>아이템</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.button}>아이템</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.button}>아이템</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _toggleDrawer() {
        this.props.navigator.toggleDrawer({
            to: 'closed',
            side: 'left',
            animated: true
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        width: 250
    },
    title: {
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        fontWeight: '500'
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        color: 'blue'
    }
});
