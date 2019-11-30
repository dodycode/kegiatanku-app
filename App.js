import React from 'react';
import {View, Text} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Routes from './src/screens/routes';
import OneSignal from 'react-native-onesignal';

class App extends React.Component {
	constructor(props) {
		super(props);
		OneSignal.init("8de9d54b-3ba6-4ae3-9fc4-d4236c76a13c");
		this.state = {};
	}

	render() {
		return (
			<MenuProvider>
				<Routes />
			</MenuProvider>
		);
	}
}

export default App;
