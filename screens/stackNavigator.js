import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import SignUp from './signup';
import LogIn from './logIn';
import Contacts from './myContacts'
import ChangePassword from './changePassword'

const MainNavigator = createStackNavigator({
	contacts: {screen: Contacts},  
	LogIn: {screen: LogIn},
	SignUp: {screen: SignUp},
	ChangePassword: {screen: ChangePassword},
},
{
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	}
}
);

const Container = createAppContainer(MainNavigator);

export default Container;


  // client id : 316640383619-i93qoa1te6q220cm07i4e8h4eo8t2ac1.apps.googleusercontent.com