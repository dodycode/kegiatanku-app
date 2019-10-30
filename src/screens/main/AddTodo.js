import React, {Component, Fragment} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet} from 'react-native';

import firestore from '@react-native-firebase/firestore';

export default class AddTodo extends Component{
 constructor(props) {
   super(props);
 
   this.state = {
   	title: '',
   	date: '',
   	time: ''
   };
 }


 render(){
  return(
   <View style={styles.container}>
   	<Text style={{marginBottom: 20}}>Please fill the following form to create a new todo list!</Text>

   	<View style={styles.formControl}>
   		<TextInput 
			placeholder="Title"
			style={{width: '100%'}}
		/>
   	</View>

   	<View style={styles.formControl}>
   		<TextInput 
			placeholder="Date"
			style={{width: '100%'}}
		/>
   	</View>

   	<View style={styles.formControl}>
   		<TextInput 
			placeholder="Time"
			style={{width: '100%'}}
		/>
   	</View>

   	<View style={{marginBottom: 20}}>
		<TouchableOpacity
		style={styles.submitBtn}>
			<Text style={{color: '#FFFFFF', alignSelf: 'center'}}>Save it!</Text>
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
		marginBottom: 20
	},
	submitBtn: {
		backgroundColor: '#F73668',
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderRadius: 40
	}
});