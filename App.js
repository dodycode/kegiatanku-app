import React, {Fragment} from 'react';
import {View, Text} from 'react-native';

import Routes from './src/screens/routes';

class App extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return(
			<Fragment>
		      <Routes />
		    </Fragment>
		);
	}
}

export default App;