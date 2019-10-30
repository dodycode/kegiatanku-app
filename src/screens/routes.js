import React from 'react';
import { SafeAreaView, View, Button, TouchableOpacity, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { firebase } from '@react-native-firebase/auth';

import Signup from './auth/Signup';
import Login from './auth/Login';
import Home from './main/Home';
import AddTodo from './main/AddTodo';
import Account from './main/Account';

const AuthStack = createStackNavigator(
{
	Login: { screen: Login },
	Signup: { screen: Signup }
},
{
	headerMode: 'none'
}
);

async function logout(props) {
	await firebase.auth().signOut();
	props.navigation.navigate('Login');
}

const HomeStack = createStackNavigator({
    Home: { screen: Home },
    AddTodo: { 
        screen: AddTodo,
        navigationOptions: {
          title: 'Add New Todo'
        } 
    }
},
{
    headerMode: 'screen'
});

const DrawerNav = createDrawerNavigator({
	Home: { screen: HomeStack },
    "Account Settings": { screen: Account }
},
{
    contentComponent:(props) => (
        <View style={{flex:1}}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerNavigatorItems {...props} />
                <TouchableOpacity 
                onPress={() => {logout(props)}}
                style={{paddingLeft: 16, marginTop: 10}}>
                	<Text>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    ),
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
});

const Navigators = createSwitchNavigator({
	Auth: { screen: AuthStack },
	App: { screen: DrawerNav }
});

export default createAppContainer(Navigators);