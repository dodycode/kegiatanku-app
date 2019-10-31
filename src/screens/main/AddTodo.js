import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	StyleSheet,
	Alert
} from 'react-native';

import {firebase} from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

import Loader from '../../components/Loader';

export default class AddTodo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			date: '',
			time: '',
			loading: false
		};

		this.db = firestore().collection('todos');
		this.user = firebase.auth().currentUser;
	}

	handleChangeInput = field => text => {
		this.setState({[field]: text});
	};

	handleOnSubmit = async () => {
		const {title, date, time} = this.state;
		this.setState({
			loading: true
		});
		if(title != '' && date != '' && time != ''){
			await this.db.add({
				title: title,
				date: date,
				time: time,
				uid: this.user.uid 
			}).then((post) => {
				this.setState({
					loading: false
				});
				this.props.navigation.navigate('Home');
			}).catch(err => {
				this.setState({
					loading: true
				});
				Alert.alert('Error', err);
			});
		}else{
			Alert.alert('Error', 'Seluruh data mohon dilengkapi!');
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading}/>
				<Text style={{marginBottom: 20}}>
					Please fill the following form to create a new todo list!
				</Text>

				<View style={styles.formControl}>
					<TextInput 
					placeholder="Title" 
					style={{width: '100%'}}
					onChangeText={this.handleChangeInput('title')}
					value={this.state.title} />
				</View>

				<View style={styles.formControl}>
					<TextInput 
					placeholder="Date" 
					style={{width: '100%'}}
					onChangeText={this.handleChangeInput('date')}
					value={this.state.date} />
				</View>

				<View style={styles.formControl}>
					<TextInput 
					placeholder="Time" 
					style={{width: '100%'}}
					onChangeText={this.handleChangeInput('time')}
					value={this.state.time} />
				</View>

				<View style={{marginBottom: 20}}>
					<TouchableOpacity 
					onPress={this.handleOnSubmit}
					style={styles.submitBtn}>
						<Text style={{color: '#FFFFFF', alignSelf: 'center'}}>
							Save it!
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	formControl: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#cecece',
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 0.9,
		marginBottom: 20,
	},
	submitBtn: {
		backgroundColor: '#F73668',
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderRadius: 40,
	},
});
