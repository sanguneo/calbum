// @flow

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import _ from 'lodash';

const { width } = Dimensions.get('window');

type Props = {
	/**
	 * A handler to be called when array of tags change
	 */
		onChange: (items: Array<any> ) => void,
	/**
	 * An array of tags
	 */
		value: Array<any>,
	/**
	 * A RegExp to test tags after enter, space, or a comma is pressed
	 */
		regex?: Object,
	/**
	 * Background color of tags
	 */
		tagColor?: string,
	/**
	 * Text color of tags
	 */
		tagTextColor?: string,
	/**
	 * Color of text input
	 */
		inputColor?: string,
	/**
	 * TextInput props Text.propTypes
	 */
		inputProps?: Object,
	/**
	 * path of the label in tags objects
	 */
		labelKey?: string,
	/**
	 *  maximum number of lines of this component
	 */
		numberOfLines: number,
};

type State = {
	text: string,
	inputWidth: ?number,
	lines: number,
};

type NativeEvent = {
	target: number,
	key: string,
	eventCount: number,
	text: string,
};

type Event = {
	nativeEvent: NativeEvent,
};

const DEFAULT_SEPARATORS = [',', ' ', ';', '\n'];
const DEFAULT_TAG_REGEX = /(.+)/gi;

class TagInput extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		value: PropTypes.array.isRequired,
		regex: PropTypes.object,
		tagColor: PropTypes.string,
		tagTextColor: PropTypes.string,
		inputColor: PropTypes.string,
		inputProps: PropTypes.object,
		labelKey: PropTypes.string,
		numberOfLines: PropTypes.number,
	};

	props: Props;
	state: State = {
		text: '',
		inputWidth: null,
		lines: 1,
	};

	wrapperWidth = width;

	// scroll to bottom
	contentHeight: 0;
	scrollViewHeight: 0;

	static defaultProps = {
		tagColor: '#dddddd',
		tagTextColor: '#aeaeae',
		inputColor: '#aeaeae',
		numberOfLines: 2,
	};

	measureWrapper = () => {
		if (!this.refs.wrapper)
			return;

		this.refs.wrapper.measure((ox, oy, w, /*h, px, py*/) => {
			this.wrapperWidth = w;
			this.setState({ inputWidth: this.wrapperWidth });
		});
	};

	calculateWidth = () => {
		if (!this.refs['tag' + (this.props.value.length - 1)])
			return;

		this.refs['tag' + (this.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
			const endPosOfTag = w + ox;
			const margin = 3;
			const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;

			const inputWidth = (spaceLeft < 100) ? this.wrapperWidth : spaceLeft - 10;

			if (spaceLeft < 100) {
				if (this.state.lines < this.props.numberOfLines) {
					var lines = this.state.lines + 1;
					this.setState({ inputWidth, lines });
				} else {
					this.setState({ inputWidth }, () => this.scrollToBottom());
				}
			} else {
				this.setState({ inputWidth });
			}
		});
	};

	componentDidMount() {
		setTimeout(() => {
			this.calculateWidth();
		}, 10);
	}

	componentDidUpdate(prevProps: Props, /*prevState*/) {
		if (prevProps.value.length != this.props.value.length || !prevProps.value) {
			this.calculateWidth();
		}
	}

	onChange = (event: Event) => {
		if (!event || !event.nativeEvent)
			return;

		const text = event.nativeEvent.text;
		this.setState({ text: text });
		const lastTyped = text.charAt(text.length - 1);

		const parseWhen = this.props.separators || DEFAULT_SEPARATORS;

		if (parseWhen.indexOf(lastTyped) > -1)
			this.parseTags();
	};

	onBlur = (event: Event) => {
		if (!event || !event.nativeEvent || !this.props.parseOnBlur)
			return;

		const text = event.nativeEvent.text;
		this.setState({ text: text });
		this.parseTags();
	};

	parseTags = () => {
		const { text } = this.state;
		const { value } = this.props;

		const regex = this.props.regex || DEFAULT_TAG_REGEX;
		const results = text.match(regex);

		if (results && results.length > 0) {
			this.setState({ text: '' });
			this.props.onChange([...new Set([...value, ...results])]);
		}
	};

	onKeyPress = (event: Event) => {
		if (this.state.text === '' && event.nativeEvent && event.nativeEvent.key == 'Backspace') {
			this.pop();
		}
	};

	focus = () => {
		if (this.refs.tagInput)
			this.refs.tagInput.focus();
	};

	pop = () => {
		const tags = _.clone(this.props.value);
		tags.pop();
		this.props.onChange(tags);
		this.focus();
	};

	removeIndex = (index: number) => {
		const tags = _.clone(this.props.value);
		tags.splice(index, 1);
		this.props.onChange(tags);
		this.focus();
	};

	_getLabelValue = (tag) => {
		const { labelKey } = this.props;

		if (labelKey) {
			if (labelKey in tag) {
				return tag[labelKey];
			}
		}

		return tag;
	};

	_renderTag = (tag, index) => {
		const { tagColor, tagTextColor } = this.props;
		return (
			<TouchableOpacity
				key={index}
				ref={'tag' + index}
				style={[styles.tag, { backgroundColor: tagColor }, this.props.tagContainerStyle]}
				onPress={() => this.removeIndex(index)}>
				<Text style={[styles.tagText, { color: tagTextColor }, this.props.tagTextStyle]}>
					{'#'+this._getLabelValue(tag)}&nbsp;&times;
				</Text>
			</TouchableOpacity>
		);
	};



	scrollToBottom = (animated: boolean = true) => {
		if (this.contentHeight > this.scrollViewHeight) {
			this.refs.scrollView.scrollTo({
				y: this.contentHeight - this.scrollViewHeight,
				animated,
			});
		}
	};

	render() {
		var { text, inputWidth, lines } = this.state;
		const { value, inputColor } = this.props;

		const defaultInputProps = {
			autoCapitalize: 'none',
			autoCorrect: false,
			placeholder: 'Start typing',
			placeholderTextColor: '#bbb',
			returnKeyType: 'done',
			keyboardType: 'default',
			underlineColorAndroid: 'rgba(0,0,0,0)',
		};

		const inputProps = { ...defaultInputProps, ...this.props.inputProps };

		// const wrapperHeight = (lines - 1) * 50 + 36;

		const width = inputWidth ? inputWidth : 400;

		return (
			<TouchableWithoutFeedback
				onPress={() => this.refs.tagInput.focus()}
				onLayout={this.measureWrapper}
				style={[styles.container]}>
				<View
					style={[styles.wrapper]}
					ref="wrapper"
					onLayout={this.measureWrapper}>
					<View
						ref='scrollView'
						style={styles.tagInputContainerScroll}
						onContentSizeChange={(w, h) => {this.contentHeight = h;}}
					>
						<View style={[styles.tagInputContainer, {width: inputWidth}, this.props.tagInputContainerStyle]}>
							{value.map((tag, index) => this._renderTag(tag, index))}
							<View style={[styles.textInputContainer, { width: width }]}>
								<TextInput
									ref="tagInput"
									blurOnSubmit={false}
									onKeyPress={this.onKeyPress}
									value={text}
									style={[styles.textInput, {color: inputColor,}]}
									onBlur={this.onBlur}
									onChange={this.onChange}
									onSubmitEditing={this.parseTags}
									{...inputProps}
								/>
							</View>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	wrapper: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 2,
		marginBottom: 4,
		marginLeft: 14,
		marginRight: 14,
		alignItems: 'flex-start',
	},
	tagInputContainerScroll: {
		flex: 1,
	},
	textInput: {
		height: 36,
		fontSize: 16,
		padding: 0,

	},
	tag: {
		minWidth: 20,
		justifyContent: 'center',
		marginTop: 2,
		marginRight: 3,
		padding: 8,
		height: 28,
		borderRadius: 2,
	},
	tagText: {
		padding: 0,
		margin: 0,
	},
});

export default TagInput;

export { DEFAULT_SEPARATORS, DEFAULT_TAG_REGEX }
