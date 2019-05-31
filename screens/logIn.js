import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,Dimensions, Image,ScrollView, TouchableHighlight,TouchableOpacity,KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Communications from 'react-native-communications';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from '../config';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

import DialogInput from 'react-native-dialog-input';

config = new Config();

var {height, width} = Dimensions.get('window');




class LogIn extends React.Component {

  static navigationOptions = {
    header: null,
    // title: 'My Contacts',
  };

  constructor(props){
    super(props);
    this.state = {
      user: "",
      pwd: "",
      email: '',
      forgot: false,
      otp: false,
      recoveryEmail: '',
      name: '',
      userInfo:'',
      myEmail: ''
    } 
  }


  logIn = (text) => {
    console.log(text);
    console.log("in login");
    if(text.email == ""){
      alert("Enter user name");       
    }
    else if(text.pwd == ""){
      alert("Enter Password");       
    }      
    else {
      var body = {email: text.email,password: text.pwd}
      console.log("body",body);
      axios.post(config.getBaseUrl()+'user/login',body)
      .then(res=>{ 
        console.log(res); 
        if(res.status == 200){
        AsyncStorage.setItem('login', 'simple')                      
        this.props.navigation.navigate('contacts');
        }
      },err=>{         
        alert('wrong email or password');         
      })         
    }      
  }

  handleEmail = (body) => {
    axios.post(config.getBaseUrl()+'user/sendEmail',body)
    .then(res=>{
      console.log(res);
    },err=>{
      console.log(err);
    })
  }

  checkOTPmethod(otp){
    axios.post(config.getBaseUrl()+'user/checkOTP',otp)
    .then(res=>{
      if(res.status == 200){
        this.props.navigation.navigate('ChangePassword',{email: this.state.recoveryEmail})
      }else{
        alert('wrong OTP')
      }
    },err=>{
      alert('wrong OTP')
    })
  }

  forgotPassword(){
    if(this.state.forgot == true){             
      return(
        <View style={styles.container}>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
        title={"Enter Registered Email"}
        hintInput ={"Email"}
        submitInput={ (inputText) => {this.handleEmail({email: inputText}),this.setState({forgot: false,recoveryEmail: inputText}),this.setState({otp: true})}}
        closeDialog={ () => {this.setState({forgot: false})}}>
        </DialogInput>
        </View>
        )      
    }
  }  

  checkOTP(changeEmail){
    if(this.state.otp == true){
      return(
        <View style={styles.container}>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
        title={"OTP sent to your registered email Id"}
        message={"Enter OTP"}
        hintInput ={"OTP"}
        submitInput={ (inputText) => {this.checkOTPmethod({changeEmail: changeEmail,otp: inputText}),this.setState({otp: false})}}
        closeDialog={ () => {this.setState({otp: false})}}>
        </DialogInput>
        </View>
        )
    }
  }  

  signInWithGoogle = async () => {
    GoogleSignin.signIn()
    .then((user) => {
      console.log("User"+user.accessToken);
      AsyncStorage.setItem('login', 'google')
      this.props.navigation.navigate('contacts',{token: user.accessToken});
    })
    .catch((error)=>{
      console.log("Error", error);
      alert("Error"+error);
    });
  }

  signInWithFB = async () => {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('2819729094919286', {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email,name`)
      // alert('Logged in!', `Hi ${(await response.json()).name}!`);
      const res = await response.json();
      console.log("res",res);
      // console.log("------------",res._bodyInit);
      this.setState({email: res.email,name: res.name});
      this.setState({pwd: res.id})

      var body = {name: this.state.name,email: this.state.email,password: this.state.pwd}
      axios.post(config.getBaseUrl()+'user/signup',body)
      .then(res=>{                        
        this.props.navigation.navigate('contacts');                   
      },err=>{         
        alert(err);         
      })         
    } else {
      alert(type);
    }
    try {
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render(){
    return(
      <>
      {this.forgotPassword()}
      {this.checkOTP(this.state.myEmail)}

      <KeyboardAvoidingView style={styles.container}
      behavior={null}>
      <View>
      <View style={styles.con}>
        <Image source={require('../assets/login.png')} style={styles.imageLogo}/>
        <Text style={{fontSize: 20, color: 'black'}}>Sync App</Text>
      </View>
      <View style={{marginTop: 10}}>
      <View style={styles.inputContainer}>
      <Icon name='email' size={25} color='grey' style={{marginLeft: 10}}/>
      <TextInput style={styles.inputs}
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
      onChangeText={(text)=>this.setState({pwd: text})}/>
      </View>
      </View>
      <View style={styles.btn}>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}  onPress = {()=>{this.logIn(this.state)}}>
      <Text style={styles.loginText}>Login</Text>
      </TouchableHighlight> 


      <GoogleSigninButton
      style={styles.googleLogIn}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={this.signInWithGoogle}
      disabled={this.state.isSigninInProgress}
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.setState({forgot: true, myEmail: this.state.email})}}>
      <Text style={{fontSize: 15, color: 'blue'}}>Forgot Password ?</Text>
      </TouchableOpacity>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress = {()=>this.props.navigation.navigate('SignUp')}>  
      <Text style={styles.loginText}>Register here</Text>
      </TouchableHighlight>      
      </View> 
      </View>   
      </KeyboardAvoidingView>
        </>
      );
  }
}

export default LogIn

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

