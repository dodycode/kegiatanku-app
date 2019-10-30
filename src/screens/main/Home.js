import React, {Component} from 'react';
import {
	View, 
	Text, 
	Image,
	Modal, 
	ImageBackground, 
	TouchableOpacity,
	TouchableWithoutFeedback, 
	StyleSheet, 
	ScrollView,
	Alert
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { firebase } from '@react-native-firebase/auth';

import ImageSrc from '../../assets/images/bg-auth.jpg';
import UserIcon from '../../assets/icon/user.png';
import TodosIcon from '../../assets/icon/todos.jpg';
import AddIcon from '../../assets/icon/add.png';
import MenuIcon from '../../assets/icon/menu.png';
import TodosMenuIcon from '../../assets/icon/more.png';

class Home extends Component{
 static navigationOptions = ({ navigation }) => {
    return {
       header: () => null
    } 
 }

 constructor(props) {
   super(props);
 
   this.state = {
   	menu: false,
   	currentUser: ''
   };
   this.childrenIds = [];
 }

 toggleMenu = () => {
 	this.setState({
 		menu: !this.state.menu
 	})
 }

 getCurrentUser = () => {
 	const user = firebase.auth().currentUser;

 	this.setState({
 		currentUser: user.displayName
 	})
 }

 componentDidMount() {
 	this.getCurrentUser();

 	//force to recall the method when stack navigate
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
     	this.getCurrentUser();
    });
 }

 componentWillUnmount() {
    this.focusListener.remove();
 }

 render(){
  return(
  	<View>
	   <ScrollView contentContainerStyle={{paddingBottom: 40}}>
	    <ImageBackground
	    source={ImageSrc}
	    style={[styles.background, {height: 250}]}>
	    	<View style={styles.mainContainer}>
	    		<TouchableOpacity 
	    		style={{position: 'absolute', top: 15, left: 20}}
	    		onPress={() => {
	    			this.props.navigation.toggleDrawer()
	    		}}>
	    			<Image 
	    				source={MenuIcon}
	    				style={{width: 18, height: 18}}/>
	    		</TouchableOpacity>
	    		<Text style={styles.greetingText}>{this.state.currentUser}'s Todos</Text>
	    		<Image 
	    			source={UserIcon}
	    			style={{width: 80, height: 80}}
	    		/>
	    	</View>
	    </ImageBackground>

	    <View style={styles.contentContainer}>
			<View style={{flexDirection: 'column'}}>
				<View style={{marginBottom: 14}}>
					<View style={[styles.todosCard, styles.boxWithShadow]}>
	    				<Text style={{fontSize: 15, marginBottom: 4}}>Adding new subpage for Janet</Text>
	    				<Text style={{fontSize: 11, marginBottom: 4}}>28 Aug 2019</Text>
	    				<Text style={{color: '#bebebe', fontSize: 10}}>8 - 10 am</Text>
	    				<TouchableOpacity 
	    					style={styles.todosMenuIcon}
	    					onPress={this.toggleMenu}>
	    					<Image source={TodosMenuIcon} style={{width: 14, height: 14}}/>
	    				</TouchableOpacity>
	    				{ this.state.menu ? <View
	    				onStartShouldSetResponder={evt => {
						    evt.persist();
						    if (this.childrenIds && this.childrenIds.length) {
						      if (this.childrenIds.includes(evt.target)) {
						        this.toggleMenu();
						      }
						    }
					  	}} 
	    				style={[
	  						styles.todosMenu,
							styles.boxWithShadowBolder
						]}>
							<View ref={component => {
								if (component && component.length) {
									this.childrenIds = component._children[0]._children.map(el => el._nativeTag)
								} 
							}}>
								<Text onPress={this.toggleMenu}>Edit</Text>
								<Text onPress={this.toggleMenu}>Delete</Text>
							</View>
						</View> : <Text style={{position: 'absolute'}}></Text> }
	    			</View>
				</View>

				<View style={{marginBottom: 14}}>
					<View style={[styles.todosCard, styles.boxWithShadow]}>
	    				<Text style={{fontSize: 15, marginBottom: 4}}>Catch up with Tom</Text>
	    				<Text style={{fontSize: 11, marginBottom: 4}}>28 Aug 2019</Text>
	    				<Text style={{color: '#bebebe', fontSize: 10}}>8 - 10 am</Text>
	    				<View style={styles.todosMenuIcon}>
	    					<Image source={TodosMenuIcon} style={{width: 14, height: 14}}/>
	    				</View>
	    			</View>
				</View>

				<View style={{marginBottom: 14}}>
					<View style={[styles.todosCard, styles.boxWithShadow]}>
	    				<Text style={{fontSize: 15, marginBottom: 4}}>Lunch with Diane</Text>
	    				<Text style={{fontSize: 11, marginBottom: 4}}>28 Aug 2019</Text>
	    				<Text style={{color: '#bebebe', fontSize: 10}}>8 - 10 am</Text>
	    				<View style={styles.todosMenuIcon}>
	    					<Image source={TodosMenuIcon} style={{width: 14, height: 14}}/>
	    				</View>
	    			</View>
				</View>
			</View>
		</View>
	   </ScrollView>
	   <TouchableOpacity 
	   onPress={() => this.props.navigation.navigate('AddTodo')}
	   style={styles.addBtn}>
			<Image 
			source={AddIcon}
			style={{width: 20, height: 20}}/>
		</TouchableOpacity>
	</View>
  );
 }
}

const styles = StyleSheet.create({
	background: {
	    resizeMode: 'cover',
	    alignItems: 'center',
	    position: 'relative',
	    backgroundColor: 'rgb(0,0,0)'
	},
	mainContainer: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		paddingTop: 60,
		paddingHorizontal: 30,
		backgroundColor:'rgba(0,0,0,0.3)',
		alignItems: 'center',
		position: 'relative'
	},
	greetingText: {
		fontSize: 26,
		color: '#FFFFFF',
		marginBottom: 20
	},
	contentContainer: {
		flexDirection: 'column',
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	addBtn: {
		backgroundColor: '#F73668',
		borderRadius: 50,
		paddingHorizontal: 17,
		paddingVertical: 17,
		position: 'absolute',
		bottom: 10,
		right: 13
	},
	todosCard: {
		flexDirection: 'column', 
		backgroundColor: '#FFFFFF',
		paddingVertical: 14,
		paddingHorizontal: 18,
		borderRadius: 8,
		position: 'relative'
	},
	todosMenuIcon: {
		position: 'absolute', 
		top: 12, 
		right: 8
	},
	todosMenu: {
		flexDirection: 'column', 
		backgroundColor: '#ffffff',
		paddingHorizontal: 10,
		paddingVertical: 15,
		position: 'absolute',
		top: 12, 
		right: 8
	},
	boxWithShadow: {
	    shadowColor: '#000',
	    shadowOffset: { width: 0, height: 1 },
	    shadowOpacity: 0.4,
	    shadowRadius: 2,  
	    elevation: 2
	},
	boxWithShadowBolder: {
	    shadowColor: '#000',
	    shadowOffset: { width: 0, height: 1 },
	    shadowOpacity: 0.8,
	    shadowRadius: 2,  
	    elevation: 8
	}
});

export default withNavigation(Home);