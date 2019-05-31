import React from 'react';
import { StyleSheet, Text, View, Button,KeyboardAvoidingView, TextInput, Picker, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from '../config';

config = new Config();
class SignUp extends React.Component {

  static navigationOptions = {
    title: 'SignUp',
  }
    signUp = (text) => {
      console.log("in signup");
      console.log(text);
      if (text.name=="") {
        alert("Enter First Name");
      } 
      else if(text.password == ""){
        alert("Enter Password");   
      }
      else if(text.email == ""){
        alert("Enter email");       
      }
      else {
        console.log('in else');
        var body = {name: text.name,email: text.email,password: text.password}
        axios.post(config.getBaseUrl()+'user/signup',body)
        .then(res=>{          
            this.props.navigation.navigate('LogIn')
          },err=>{
            alert(err);
        }) 
      }      
    }

  state = {
    name:"",
    email: "",   
    password: "",
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
      <Icon name='account-circle' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs  }
      placeholder="Name"
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({name: text})}/>
      </View>
      <View style={styles.inputContainer}>
      <Icon name='email' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs  }
      placeholder="Email"
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({email: text})}/>
      </View>           
      <View style={styles.inputContainer}>
      <Icon name='lock' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs}
      placeholder="Password"
      secureTextEntry={true}
      underlineColorAndroid='transparent'
      onChangeText={(text)=>this.setState({password: text})}/>
      </View>
      </View>
      <View style={styles.btn}>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}  onPress = {()=>{this.signUp(this.state)}}>
      <Text style={styles.loginText}>Register</Text>
      </TouchableHighlight>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress = {()=>this.props.navigation.navigate('LogIn')}>  
      <Text style={styles.loginText}>Cancel</Text>
      </TouchableHighlight>      


      </View> 
      </View>   
      </KeyboardAvoidingView>
        
      );
  }
}



  
export default SignUp

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
    borderRadius: 100
  },
  header:{
    fontSize: 30,
    color: '#00b5ec',
    fontWeight: 'bold'
  },
  dataContainer:{
    marginTop: 10
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

