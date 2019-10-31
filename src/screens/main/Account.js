import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';

import MenuIcon from '../../assets/icon/menu-black.png';
import Loader from '../../components/Loader';

export default class AddTodo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			displayName: '',
			loading: false,
		};

		this.user = firebase.auth().currentUser;
	}

	handleChangeInput = field => text => {
		this.setState({[field]: text});
	};

	submitProfile = () => {
		if (this.state.displayName != '' && this.state.email != '') {
			this.setState({
				loading: true,
			});
			this.user
				.updateProfile({
					displayName: this.state.displayName,
					email: this.state.email,
				})
				.then(() => {
					if (this.state.password != '') {
						this.user
							.updatePassword(this.state.password)
							.then(() => {
								this.setState({
									loading: false,
								});
								this.props.navigation.navigate('Home');
							})
							.catch(error => {
								this.setState({
									loading: false,
								});
								Alert.alert('Error', error.code);
							});
					} else {
						this.setState({
							loading: false,
						});
						this.props.navigation.navigate('Home');
					}
				})
				.catch(error => {
					this.setState({
						loading: false,
					});
					Alert.alert('Error', error.code);
				});
		} else {
			Alert.alert('Error', 'Email dan Nickname tidak boleh kosong!');
		}
	};

	getCurrentUser = () => {
		this.setState({
			email: this.user.email,
			displayName: this.user.displayName,
		});
	};

	componentDidMount() {
		this.getCurrentUser();
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />
				<TouchableOpacity
					style={{position: 'absolute', top: 15, left: 20}}
					onPress={() => {
						this.props.navigation.toggleDrawer();
					}}>
					<Image source={MenuIcon} style={{width: 18, height: 18}} />
				</TouchableOpacity>

				<Text style={{marginBottom: 20}}>Account Settings</Text>

				<View style={styles.formControl}>
					<TextInput
						placeholder="Nickname"
						style={{width: '100%'}}
						defaultValue={this.user.displayName}
						onChangeText={this.handleChangeInput('displayName')}
					/>
				</View>

				<View style={styles.formControl}>
					<TextInput
						placeholder="Email"
						style={{width: '100%'}}
						defaultValue={this.user.email}
						onChangeText={this.handleChangeInput('email')}
					/>
				</View>

				<View style={styles.formControl}>
					<TextInput
						placeholder="New Password"
						style={{width: '100%'}}
						secureTextEntry={true}
						onChangeText={this.handleChangeInput('password')}
					/>
				</View>

				<View style={{marginBottom: 20}}>
					<TouchableOpacity
						onPress={this.submitProfile}
						style={styles.submitBtn}>
						<Text style={{color: '#FFFFFF', alignSelf: 'center'}}>
							Update Profile
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
		paddingTop: 60,
		paddingHorizontal: 20,
		position: 'relative',
		backgroundColor: '#ffffff',
		flex: 1,
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
