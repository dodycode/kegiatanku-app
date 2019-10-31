import React from 'react';
import {View, Text} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Routes from './src/screens/routes';

class App extends React.Component {
	constructor(props) {
		super(props);

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
