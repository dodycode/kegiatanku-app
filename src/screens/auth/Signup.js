import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	ImageBackground,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	Dimensions,
	Alert,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';

import ImageSrc from '../../assets/images/bg-auth.jpg';
import ClipboardIcon from '../../assets/icon/clipboards.png';
import UserIcon from '../../assets/icon/email.png';
import EmailIcon from '../../assets/icon/email-2.png';
import PasswordIcon from '../../assets/icon/password.png';
import Loader from '../../components/Loader';

const ScreenHeight = Dimensions.get('window').height;

export default class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			displayName: '',
			loading: false,
		};
	}

	handleChangeInput = field => text => {
		this.setState({[field]: text});
	};

	handleOnSubmit = async () => {
		const {email, password, displayName} = this.state;
		if (email != '' && password != '') {
			this.setState({
				loading: true,
			});
			await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then(userCredentials => {
					if (userCredentials.user) {
						userCredentials.user
							.updateProfile({
								displayName: displayName,
							})
							.then(() => {
								this.props.navigation.navigate('Home');
							});
					}
				})
				.catch(error => {
					this.setState({
						loading: false,
					});
					Alert.alert('Error', error.code);
				});
		} else {
			Alert.alert('Error', 'Email dan Password Harus isi');
		}
	};

	render() {
		return (
			<ScrollView style={{flexGrow: 1}}>
				<Loader loading={this.state.loading} />
				<ImageBackground
					source={ImageSrc}
					style={styles.background}
					imageStyle={{opacity: 0.4}}>
					<View style={styles.mainContainer}>
						<Image source={ClipboardIcon} style={styles.authImage} />

						<View style={styles.formControl}>
							<Image source={UserIcon} style={styles.inputFieldImage} />
							<TextInput
								placeholder="Nickname"
								placeholderTextColor="#FFFFFF"
								underlineColorAndroid="transparent"
								style={{color: '#FFFFFF', width: '100%'}}
								onChangeText={this.handleChangeInput('displayName')}
							/>
						</View>

						<View style={styles.formControl}>
							<Image source={EmailIcon} style={styles.inputFieldImage} />
							<TextInput
								placeholder="Email"
								placeholderTextColor="#FFFFFF"
								underlineColorAndroid="transparent"
								style={{color: '#FFFFFF', width: '100%'}}
								onChangeText={this.handleChangeInput('email')}
							/>
						</View>

						<View style={styles.formControl}>
							<Image source={PasswordIcon} style={styles.inputFieldImage} />
							<TextInput
								placeholder="Password"
								placeholderTextColor="#FFFFFF"
								underlineColorAndroid="transparent"
								style={{color: '#FFFFFF', width: '100%'}}
								secureTextEntry={true}
								onChangeText={this.handleChangeInput('password')}
							/>
						</View>

						<View style={{marginBottom: 20, marginTop: 20}}>
							<TouchableOpacity
								style={styles.submitBtn}
								onPress={this.handleOnSubmit}>
								<Text style={{color: '#FFFFFF', alignSelf: 'center'}}>
									Sign Up
								</Text>
							</TouchableOpacity>
						</View>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text style={{color: '#bebebe'}}>Already have account? </Text>
							<TouchableOpacity
								onPress={() => {
									this.props.navigation.navigate('Login');
								}}>
								<Text style={{color: '#FFFFFF'}}>Sign In</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
		alignItems: 'center',
		position: 'relative',
		backgroundColor: 'rgb(162,146,199)',
	},
	mainContainer: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		paddingTop: 60,
		paddingHorizontal: 30,
		paddingBottom: 20,
	},
	authImage: {
		marginBottom: 50,
		alignSelf: 'center',
		width: 100,
		height: 100
	},
	inputFieldImage: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	formControl: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#FFFFFF',
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
	textStyle: {
		color: '#ffffff',
	},
});
