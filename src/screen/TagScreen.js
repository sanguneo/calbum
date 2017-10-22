import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

export default class TagScreen extends Component {

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {
			tagname: '',
			rows: [],
		};
		
	}
	onNavigatorEvent(event) {
	}


	_goTag(tagname) {
		let aobj = {
			screen: "calbum.InTagScreen",
			title: '#' + tagname,
			passProps: {dbsvc:this.props.dbsvc, crypt:this.props.crypt, global: this.props.global, user: this.props.user},
			navigatorStyle: {},
			navigatorButtons: {},
			animated: false,
			animationType: 'none'
		};
		if (tagname === '선택안함') {
			aobj.title = '태그 선택안됨';
		}else {
			aobj.passProps.tagname = tagname;
		}

		this.props.navigator.push(aobj);
	}
	_getTags() {
		this.props.dbsvc.getTagGroups(this.props.user.signhash, (ret) => {
			this.setState({rows: ret.map((item)=>{return item.name})});
		});
	}
	
	componentWillMount() {
		if (this.props.user) {
			this._getTags();
		}
	}


	render() {
		let taglist = this.state.rows.map((item, idx) => {
			return (
				<View  style={styles.row} key={idx}>
					<TouchableOpacity key={idx} onPress={()=>{this._goTag(item);}} >
						<Text style={styles.rowContent}>{'#' + item}</Text>
					</TouchableOpacity>
				</View>
			);
		});
		return (
			<ScrollView>
				<View style={styles.container}>
					{taglist}
				</View>
			</ScrollView>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 10,
	},
	row: {
		flexDirection: 'row',
		height: 30,
		paddingHorizontal: 5,
		marginHorizontal: 2,
		marginVertical: 2,

		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,

		backgroundColor: '#aeaeae'
	},
	rowContent: {
		height: 30,
		paddingHorizontal: 0,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#fff',
	},
});
