import React, { Component, Fragment } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    PermissionsAndroid
} from 'react-native';

import { firebase } from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

import DateTimePicker from '@react-native-community/datetimepicker';

import ImagePicker from 'react-native-image-picker';

import Loader from '../../components/Loader';

export default class AddTodo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            date: '',
            time: '',
            image: '',
            mode: '',
            loading: false,
            showTimePicker: false,
            permission: false
        };

        this.db = firestore().collection('todos');
        this.user = firebase.auth().currentUser;
    }

    handleChangeInput = field => text => {
        this.setState({
            [field]: text
        });
    };

    handleOnSubmit = async () => {
        const { title, date, time, image } = this.state;
        this.setState({
            loading: true,
        });
        if (title != '' && date != '' && time != '' && image != '') {
            await this.db
                .add({
                    title: title,
                    date: date,
                    time: time,
                    image: image,
                    uid: this.user.uid,
                })
                .then(post => {
                    this.setState({
                        loading: false,
                    });
                    this.props.navigation.navigate('Home');
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    Alert.alert('Error', err);
                });
        } else {
            Alert.alert('Error', 'Seluruh data mohon dilengkapi!');
        }
    };

    formatAMPM = date => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };

    formattingDate = date => {
        let day = date.getDay() + 1;
        let monthName = date.toLocaleString('default', { month: 'long' });
        let years = date.getFullYear();
        let strDate = day + ' ' + monthName + ' ' + years;
        return strDate;
    };

    setDate = (event, date) => {
        if (date != null) {
            let convertedDate =
                this.state.mode === 'time' ?
                this.formatAMPM(date) :
                date.toDateString();

            this.state.mode === 'time' ?
                this.setState({
                    showTimePicker: Platform.OS === 'ios' ? true : false,
                    time: convertedDate,
                }) :
                this.setState({
                    showTimePicker: Platform.OS === 'ios' ? true : false,
                    date: convertedDate,
                });
        }
    };

    showPicker = mode => {
        this.setState({
            showTimePicker: true,
            mode,
        });
    };

    showTimePicker = () => {
        this.showPicker('time');
    };

    showDatePicker = () => {
        this.showPicker('date');
    };

    handleSelectImage = () => {
        const options = {
            quality: 0.5,
            maxHeight: 200,
            maxWidth: 200,
            storageOptions: {
                skipBackup: true
            }
        };

        try {
            ImagePicker.showImagePicker(options, response => {
                if (response.data) {
                    this.setState({
                        image: 'data:image/jpeg;base64,' + response.data
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <View style={styles.container}>
				{this.state.showTimePicker && (
					<DateTimePicker
						value={new Date()}
						mode={this.state.mode}
						is24Hour={true}
						display="default"
						onChange={this.setDate}
					/>
				)}
				<Loader loading={this.state.loading} />
				<Text style={{marginBottom: 20}}>
					Please fill the following form to create a new todo list!
				</Text>

				<View>
					<Text style={{marginBottom: 10}}>Todo Image</Text>
					{this.state.image === '' ? <TouchableOpacity
						style={styles.imageBtn}
						onPress={() => this.handleSelectImage()}>
						<Text style={{color: 'white'}}>Select an image</Text>
					</TouchableOpacity> : <Image source={{uri: this.state.image}} style={styles.imgInput}/>}
				</View>

				<View style={styles.formControl}>
					<TextInput
						placeholder="Title"
						style={{width: '100%'}}
						onChangeText={this.handleChangeInput('title')}
						value={this.state.title}
					/>
				</View>

				<View style={styles.formControl}>
					<TouchableOpacity
						style={{width: '100%'}}
						onPress={() => this.showDatePicker()}>
						<TextInput
							editable={false}
							onTouchStart={() => this.showDatePicker()}
							placeholder="Date"
							style={{width: '100%', color: '#000'}}
							onChangeText={this.handleChangeInput('date')}
							value={this.state.date}
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.formControl}>
					<TouchableOpacity
						style={{width: '100%'}}
						onPress={() => this.showTimePicker()}>
						<TextInput
							editable={false}
							onTouchStart={() => this.showTimePicker()}
							placeholder="Time"
							style={{width: '100%', color: '#000'}}
							onChangeText={this.handleChangeInput('time')}
							value={this.state.time}
						/>
					</TouchableOpacity>
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
    imageBtn: {
        backgroundColor: '#38b2ac',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 10,
        width: 140
    },
    imgInput: {
    	width: 50,
    	height: 50,
    	borderRadius: 500
    }
});