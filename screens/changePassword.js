import React from 'react';
import { StyleSheet, Text, View,Image, TouchableHighlight, TextInput, Icon, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import Config from '../config';


config = new Config();

export default class ChangePassword extends React.Component {

   constructor(props){
    super(props);
    this.state = {
      password: '',
      cnfpassword: ''
    } 
  }

  changePassword(data){
    console.log("in change");
    email = this.props.navigation.state.params.email
    console.log('email',email);
    body = {email:   email, password: data.password}  
    if(data.password == data.cnfpassword){
      axios.post(config.getBaseUrl()+'user/changePassword',body)
      .then(res=>{
        alert('password changed successfully');
        this.props.navigation.navigate('LogIn');
      },err=>{
        alert(err);
      })
    }
  }
  
  render() {
    return (      
     <KeyboardAvoidingView style={styles.container}
      behavior={null}>
      <View>
      <View style={styles.con}>
        <Image source={require('../assets/login.png')} style={styles.imageLogo}/>
        <Text style={{fontSize: 20, color: 'black'}}>Sync App</Text>
      </View>
      <View style={{marginTop: 10}}>
      <View style={styles.inputContainer}>
      <TextInput style={styles.inputs}
      placeholder="Enter New Password"
      secureTextEntry={true}
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({password: text})}/>
      </View>          
      <View style={styles.inputContainer}>
      
      <TextInput style={styles.inputs}
      placeholder="Confirm Password"
      secureTextEntry={true}
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({cnfpassword: text})}/>
      </View>
      </View>
      <View style={styles.btn}>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}  onPress = {()=>{this.changePassword(this.state)}}>
      <Text style={styles.loginText}>Change Password</Text>
      </TouchableHighlight> 
      </View> 
      </View>   
      </KeyboardAvoidingView>   
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },

  con:{
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    color: '#ffffff', 
    marginTop: 10   
  },

  textMain: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10
  },  
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  textInput: {
    color:'#fff',
    height: 30,
    width: 200, 
    borderColor: '#ffffff',
    borderWidth: 1 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    width:250,
    height:45,
    marginBottom:10,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
    height:45,
    marginLeft:12,
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width:250,
    elevation: 2
    // borderRadius:30,

  },
  loginButton: {
    marginTop: 5,
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  image:{
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  header:{
    fontSize: 30,
    color: '#00b5ec',
    fontWeight: 'bold'
  },
  dataContainer:{
    marginTop: 10
  },
  googleLogIn:{
    height: 50 ,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  fbLogIn:{
    backgroundColor: 'blue',
    height: 45 ,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  imageLogo:{
    height: 120,
    width: 120,
    borderRadius: 100,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  backgroundImage:{
    flex: 1,
    resizeMode: 'cover'
  }
});
  
