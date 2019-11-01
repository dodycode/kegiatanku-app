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
	Alert,
	FlatList,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {firebase} from '@react-native-firebase/auth';

import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from 'react-native-popup-menu';

import ImageSrc from '../../assets/images/bg-auth.jpg';
import UserIcon from '../../assets/icon/user.png';
import TodosIcon from '../../assets/icon/todos.jpg';
import AddIcon from '../../assets/icon/add.png';
import MenuIcon from '../../assets/icon/menu.png';
import TodosMenuIcon from '../../assets/icon/more.png';
import Loader from '../../components/Loader';

class Home extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			header: () => null,
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			showModal: 0,
			currentUser: '',
			todos: [],
			loading: false,
		};

		this.childrenIds = [];
	}

	getCurrentUser = () => {
		const user = firebase.auth().currentUser;

		this.setState({
			currentUser: user.displayName,
		});
	};

	getTodos = async () => {
		const user = firebase.auth().currentUser;
		const querySnapshot = await firebase
			.firestore()
			.collection('todos')
			.where('uid', '==', user.uid);

		this.setState({
			loading: true,
		});

		querySnapshot.onSnapshot({
			error: e => console.error(e),
			next: todos => {
				const list = [];

				todos.forEach(todo => {
					const {title, date, time, uid} = todo.data();

					list.push({
						id: todo.id,
						title: title,
						date: date,
						time: time,
						uid: uid,
					});
				});

				this.setState({
					loading: false,
					todos: list,
				});
			},
		});
	};

	deleteTodo = todoId => {
		Alert.alert(
			'Confirmation Message',
			'Yakin ingin menghapus kegiatan ini?',
			[
				{
					text: 'Yakin',
					onPress: async () => {
						this.setState({
							loading: true,
						});

						await firebase
							.firestore()
							.collection('todos')
							.doc(todoId)
							.delete()
							.then(() => {
								Alert.alert('Operation Succeded', 'Todo berhasil dihapus!')
								this.setState({
									loading: false,
								});
							})
							.catch(error => {
								Alert.alert('Error', error);
								this.setState({
									loading: false,
								});
							});
					},
				},
				{
					text: 'Tidak Yakin',
				},
			],
			{cancelable: false},
		);
	};

	componentDidMount() {
		this.getCurrentUser();
		this.getTodos();

		//force to recall the method when stack navigate
		const {navigation} = this.props;
		this.focusListener = navigation.addListener('didFocus', () => {
			this.getCurrentUser();
		});
	}

	componentWillUnmount() {
		this.focusListener.remove();
	}

	render() {
		return (
			<View style={{position: 'relative', flex: 1}}>
				<Loader loading={this.state.loading} />
				<ScrollView contentContainerStyle={{paddingBottom: 40}}>
					<ImageBackground
						source={ImageSrc}
						style={[styles.background, {height: 220}]}>
						<View style={styles.mainContainer}>
							<TouchableOpacity
								style={{position: 'absolute', top: 15, left: 20}}
								onPress={() => {
									this.props.navigation.toggleDrawer();
								}}>
								<Image source={MenuIcon} style={{width: 18, height: 18}} />
							</TouchableOpacity>
							<Image source={UserIcon} style={{width: 80, height: 80}} />
							<Text
								style={{
									fontSize: 20,
									marginTop: 10,
									color: '#fff',
									fontWeight: 'bold',
								}}>
								{this.state.currentUser}
							</Text>
						</View>
					</ImageBackground>

					<View style={styles.contentContainer}>
						<View style={{flexDirection: 'column'}}>
							<Text style={{fontSize: 16, marginBottom: 10}}>Kegiatanku</Text>
							{this.state.todos != '' ? (
								this.state.todos.map((todo, index) => {
									return (
										<TouchableOpacity key={index} style={{marginBottom: 14}}>
											<View style={[styles.todosCard, styles.boxWithShadow]}>
												<Text style={{fontSize: 13, marginBottom: 4}}>
													{todo.title.charAt(0).toUpperCase() +
														todo.title.slice(1).toLowerCase()}
												</Text>
												<Text style={{fontSize: 10, marginBottom: 4}}>
													{todo.date}
												</Text>
												<Text style={{color: '#bebebe', fontSize: 10}}>
													{todo.time}
												</Text>
												<Menu style={styles.todosMenuIcon}>
													<MenuTrigger>
														<Image
															source={TodosMenuIcon}
															style={{width: 14, height: 14}}
														/>
													</MenuTrigger>
													<MenuOptions
														customStyles={{
															optionsContainer: {
																width: 80,
																borderRadius: 4,
															},
														}}>
														<MenuOption
															text="Edit"
															onSelect={() =>
																this.props.navigation.navigate('EditTodo', {
																	todoId: todo.id,
																})
															}
														/>
														<MenuOption
															text="Delete"
															onSelect={() => this.deleteTodo(todo.id)}
														/>
													</MenuOptions>
												</Menu>
											</View>
										</TouchableOpacity>
									);
								})
							) : (
								<View>
									<Text>Tidak ada kegiatan tercatat</Text>
								</View>
							)}
						</View>
					</View>
				</ScrollView>
				<TouchableOpacity
					onPress={() => this.props.navigation.navigate('AddTodo')}
					style={styles.addBtn}>
					<Image source={AddIcon} style={{width: 20, height: 20}} />
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
		backgroundColor: 'rgb(0,0,0)',
	},
	mainContainer: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		paddingTop: 60,
		paddingHorizontal: 30,
		backgroundColor: 'rgba(0,0,0,0.3)',
		alignItems: 'center',
		position: 'relative',
	},
	greetingText: {
		fontSize: 26,
		color: '#FFFFFF',
		marginBottom: 20,
		fontWeight: 'normal',
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
		right: 13,
	},
	todosCard: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		paddingVertical: 14,
		paddingHorizontal: 18,
		borderRadius: 8,
		position: 'relative',
	},
	todosMenuIcon: {
		position: 'absolute',
		top: 12,
		right: 8,
	},
	todosMenu: {
		flexDirection: 'column',
		backgroundColor: '#ffffff',
		paddingHorizontal: 10,
		paddingVertical: 15,
		position: 'absolute',
		top: 12,
		right: 8,
	},
	boxWithShadow: {
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.4,
		shadowRadius: 2,
		elevation: 2,
	},
	boxWithShadowBolder: {
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 8,
	},
});

export default withNavigation(Home);
