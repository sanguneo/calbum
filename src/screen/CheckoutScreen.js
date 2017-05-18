/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';

import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

import ImagePicker from 'react-native-image-crop-picker';
import Image2merge from '../../native_modules/image2merge'

export default class CheckoutScreen extends Component {
    static navigatorButtons = {
        leftButtons: [],
        rightButtons: [
            {
                icon: require('../../img/checkmark.png'),
                id: 'save'
            }
        ]
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            success: 'no',
            merged: { uri: null },
            title: '',
            recipe: ''
        }
    }

    onNavigatorEvent(event) {
        if (event.id === 'save') {

        }
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.textbox}
                    editable = {true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(title) => this.setState({title})}
                    value={this.state.title}
                    placeholder={'제목'}
                />
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => {this._changeImage('left')}}>
                        <Image source={this.state.uriRight} style={styles.img} />
                    </TouchableOpacity>
                </View>
                <AutoGrowingTextInput
                    style={styles.textbox}
                    multiline={true}
                    editable={true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(recipe) => this.setState({recipe})}
                    value={this.state.recipe}
                    placeholder={'레시피'}
                />
                <AutoGrowingTextInput
                    style={styles.textbox}
                    multiline={true}
                    editable={true}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(comment) => this.setState({comment})}
                    value={this.state.comment}
                    placeholder={'추가내용'}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgView : {
        flex: 1,
        flexDirection: 'row'
    },
    img :{
      width: Dimensions.get('window').width / 2,
      height: Dimensions.get('window').width
    },
    merged: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width
    },
    textbox: {
        height: 60,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 17,
        color: '#000'
    }
});
