/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Image, Text,ImageBackground,AsyncStorage,ScrollView, View} from 'react-native';
import Container from './screens/stackNavigator'
import Contacts from './screens/myContacts'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isSignedIn: '',
      user_logged_in: false,
      auth: false,
      value: ''
    }    
  }

  componentDidMount(){
  
    this._setupGoogleSignin();
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices(
        {showPlayServicesUpdateDialog: true});
      await GoogleSignin.configure({
        scopes: [
        "https://www.google.com/m8/feeds/",
        "https://www.googleapis.com/auth/contacts.readonly",
        "https://www.googleapis.com/auth/drive"],                        
        webClientId: '316640383619-1p67h8083m39tfs07hgej96pmv2k2tev.apps.googleusercontent.com',
        offlineAccess: false,
        forceConsentPrompt: true
      });
    this.isSignedIn();
    }
    catch(err) {
      console.log("Error", err);
    }
  }

  isSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn();
  this.setState({ isSignedIn });
  this.isLoggedIn()
};

  isLoggedIn(){
      AsyncStorage.getItem('login')
    .then((auth)=>{  
      console.log(auth);
      this.setState({value: auth})
  }).then(()=>{
      this.setState({auth: true});
      if(this.state.value != null){      
        this.setState({user_logged_in: true})
      }
  });
  }

  render(){
    if(this.state.isSignedIn || this.state.user_logged_in){
      console.disableYellowBox = true;
      return(
       <Contacts />
      )
    }else{
      console.disableYellowBox = true;
    return (
    
          <Container/>
      
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
