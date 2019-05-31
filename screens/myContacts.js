import React from 'react';
import { StyleSheet, Text, View,ActivityIndicator,FlatList,Dimensions,TouchableWithoutFeedback,Image, TouchableOpacity,Button, ScrollView,AsyncStorage, Picker } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import Popover from 'react-native-popover-view'
import { Icon } from 'react-native-elements'
import axios from 'axios';
import Contacts from 'react-native-contacts';
import async from 'async';
import * as _ from 'lodash';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import RNFetchBlob from 'react-native-fetch-blob';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import FileSystem from 'react-native-filesystem';
import RNFS from 'react-native-fs';

import { List, ListItem } from "react-native-elements";

// var RNFS = require('react-native-fs');
var {height, width} = Dimensions.get('window');
  
let contacts = []
let counter = 0;
var defaultheader = function () {
  return {
    method: null,
    body: null,
    crossDomain: true,
    cache: false,
    async: false,
    timeout: 3000,
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Access-Control-Allow-Headers":"*",
      "Access-Control-Allow-Headers":"*",
      "X-Requested-With":"XMLHttpRequest",
      "GData-Version": "3.0",
      // 'scopes': 'https://www.googleapis.com/auth/contacts.readonly',
    },
  };
};
function transformRequest(obj){
 
  var str = [];
  for (var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

export default class Contact extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      myContacts: [{
        name: '',
        number: '',
      }],
      selected_type: '',
      selected_type_state: '',
      picker: false,
      googleOrFilePicker: false,
      fetching: false,
      token: '',
      isVisible: false,
      isVisibleBig: false,
      popoverAnchor: { x: 250, y: 0, width: 80, height: 60 }
    }
  }

  componentDidMount = async () => {
    this.setState({fetching: true});
    try {
    const userInfo = await GoogleSignin.signInSilently();
    this.setState({token: userInfo.accessToken})
  } catch (error) {
    console.log(error);
  }
  this.getPermission();
}

  getPermission = async() =>{

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.'
      }
      );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getContacts();
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }

  }

  getContacts = async() =>{
    this.setState({fetching: true})
    Contacts.getAll((err, contact) => {
          if (err === 'denied'){
            console.log("ERROR=======================", err);
          } else {
            contacts = contact;            
            this.setState({fetching: true})
            for(let i = 0 ; i < contacts.length ; i++){    
                if(contacts[i].phoneNumbers && contacts[i].phoneNumbers.length>0){
                  if(contact[i].familyName == null)
                  {
                this.setState(prevState => ({
                  myContacts: [...prevState.myContacts,{name: contact[i].givenName  ,number: contact[i].phoneNumbers[0].number }]  
                }))                
                  }else{
                this.setState(prevState => ({
                  myContacts: [...prevState.myContacts,{name: contact[i].givenName+' '+contact[i].familyName,number: contact[i].phoneNumbers[0].number }]  
                }))                

                  }
              }else{
              }      
            };
            this.state.myContacts.splice(0,1)
            this.setState({fetching: false})
          }
        })
  }

wait = () => {
  if(this.state.fetching == true){
    return(
      <ActivityIndicator
               animating = {true}
               color = '#bc2b78'
               size = "large"
               style = {styles.activityIndicator}/>
      )
  }
}

removeDuplicates = (arr) => {  
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}

sort = (arr) => {
  arr.sort(function(a, b){
    var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
    if (nameA < nameB) 
      return -1;
    if (nameA > nameB)
      return 1;
    return 0; 
  });
}


showContact = () => {
  if(this.state.fetching == false){
    if(this.state.myContacts == null){
    }
    this.state.myContacts = this.removeDuplicates(this.state.myContacts);
    this.state.myContacts.sort(function(a, b){
      if(a.firstname < b.firstname) { return -1; }
      if(a.firstname > b.firstname) { return 1; }
      return 0;
    })
    this.sort(this.state.myContacts)    
      return(  
      
          <FlatList
            data={this.state.myContacts}
            renderItem={({ item }) => (
              <View style={{padding: 7}}>
              <View style={{ flexDirection: 'row'}}>
                <View>
                  <Image style={styles.imageLogo} source={require('../assets/download.png')}/>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 8}}>
                <View style={{ flexDirection: 'column'  }}>
                  <Text style={{fontSize: 18,fontWeight: 'bold'}}>{item.name}</Text>
                  <Text style={{fontSize: 13}}>{item.number}</Text>
                </View>
                </View>               
              </View>             
              <View style={{height: 1, width: 300, backgroundColor: '#CDCDCD', marginLeft: 50, marginTop: 2}}></View>
              </View>
            )}
          />
          
        )      
  }
}


getContactsFromGoole =  (token) => {
  this.setState({fetching: true})
  console.log('-----------------------------------in contacts---------------------------------------');
  const header = defaultheader();
  let params={
    "alt":"json",
    "max-results":1000,
    "access_token":token        
  };
  header.method='GET';
  header.headers["Authorization"]= 'Bearer '+token;
  // console.log("header", header);
  let url="https://www.google.com/m8/feeds/contacts/default/full?";
  var suburl=transformRequest(params);
  url=url+suburl;
  // console.log('url',url  );
  fetch(url)
  .then((response) => {    
    return response.json()
  })
  .then((responseJson) => {
    var contact = responseJson;
    _.forEach(contact.feed.entry, con=>{
      if(con.gd$phoneNumber === undefined){
      }else{
      this.setState(prevState => ({
        myContacts: [...prevState.myContacts,{name: con.title.$t, number: con.gd$phoneNumber[0].$t}]  
      }))        
      }
    })
    this.setState({fetching: false})
    this.state.myContacts = this.removeDuplicates(this.state.myContacts);
    this.showContact();
  })
  .catch((error) => {
    console.log("An error occurred.Please try again",error);
  });      
}

export = async () => {
  
  let login = await AsyncStorage.getItem('login');
  console.log('type================================',login);
  if(login == 'google'){
    this.finalExport();
  }else{
      GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      console.log("User"+user.accessToken);
      this.setState({token: user.accessToken})
      AsyncStorage.setItem('login', 'google')
    })
    .catch((error)=>{
      console.log("Error", error);
      alert("Error"+error);
    });
    this.finalExport();
  }
}

finalExport(){  
  let body = this.state.myContacts;
  axios.post(config.getBaseUrl()+'user/createFile',body)
  .then(res=>{
    if(res.status == 200){
      let token = 'Bearer '+this.state.token;
      console.log(token);
      axios.post(config.getBaseUrl()+'user/upload-to-drive',{token: token})
      .then(res=>{
        if(res.status == 200){          
      PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Storage',
        'message': 'This app would like to store some files on your phone'
      }
      ).then(() => {
        let dirs = RNFetchBlob.fs.dirs.DownloadDir;
        RNFetchBlob
        .config({
          // response data will be saved to this path if it has access right.
          fileCache : true,
          addAndroidDownloads : {
            title : "sync.vcf",
            path:dirs+"/sync.vcf",
            ext:"vcf",
            useDownloadManager : true,
            description : "fileName",
            notification : true,
          }
        })
        .fetch('GET', config.getBaseMediaUrl()+'all.vcf', {
        })
        .then((res) => {          
          console.log('The file saved to ', res)
        })
      })
        }
      },err=>{
        alert(err) 
      })
    }
  },err=>{
    console.log(err);
  })
}


selectFromWhereToImport = () => {
  if(this.state.googleOrFilePicker == true){    
    if(this.state.selected_type_state == 'google')
    {
      this.getCurrentUserInfo();
      this.setState({googleOrFilePicker: false})
    }else if(this.state.selected_type_state == 'external'){
      console.log('==============',this.state.selected_type_state);
      this.filePicker();
      this.setState({googleOrFilePicker: false})
    }
  }
}

getCurrentUserInfo = async () => {
  try {
    let login = await AsyncStorage.getItem('login');
    console.log("Async value==================",login);
    if(login == 'google'){
      const userInfo = await GoogleSignin.signInSilently();
      this.getContactsFromGoole(userInfo.accessToken);
      this.setState({token: userInfo.accessToken})
      console.log(userInfo);
    }else{      
      GoogleSignin.signIn()
      .then((user) => {
        console.log("User"+user.accessToken);
        AsyncStorage.setItem('login','google')
        this.getContactsFromGoole(user.accessToken);
      })
      .catch((error)=>{
        console.log("Error", error);
        alert("Error"+error);
      });
    }
  } catch (error) {
    console.log(error);
  }
} 

logout = async () => {
  try {
    let login = await AsyncStorage.getItem('login')
    console.log('======================',login);
    if(login == 'google'){
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      AsyncStorage.setItem('login', '')
      this.props.navigation.navigate('LogIn')      
    }else{
      AsyncStorage.setItem('login', '')
      this.props.navigation.navigate('LogIn')
    }
  } catch (error) {
    AsyncStorage.setItem('login', '')
    this.props.navigation.navigate('LogIn')
    alert(error);
  }
};

filePicker =  () => { 
  DocumentPicker.show({ filetype: [DocumentPickerUtil.allFiles()] }, (error,result) => {
    let uri = `file://${result.uri}`;
    console.log("uri===============",result);
    if(result.type == 'text/vcard'){
      this.readContactsFromVCF(result.uri,result.fileName);          
    }else{
      alert('Select VCF files only')
    }
  })
}
  

   requestExternalStoreageRead = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'Storage',
          'message': 'App needs access to external storage'
        }
        );
      return granted == PermissionsAndroid.RESULTS.GRANTED
    } 
    catch (err) {
      return false;
    }
  }

  readContactsFromVCF = async(uri,name) => {
     if (await this.requestExternalStoreageRead()){
       console.log('======== granted');
     }else{
       console.log('=========== not granted');
     }  
     this.readFile(uri,name);
   }

   readFile = async (uri,name) => {     
     this.setState({fetching: true});
     const fileContent = await RNFS.readFile(RNFetchBlob.fs.dirs.DownloadDir+'/'+name);
     axios.post(config.getBaseUrl()+'user/readVCF',{content: fileContent})
     .then((res)=>{       
       if(res.status == 200){         
          this.setContactsFromExternalStorage(res);         
       }
     },err=>{
       console.log(err);
     })   
   }

   setContactsFromExternalStorage = (res) => {
     console.log('================================================================');
       for(let i = 0 ; i < res.data.n.length ; i++ ){
         this.setState(prevState => ({
           myContacts: [...prevState.myContacts,{name: res.data.n[i].first, number: res.data.tel[i].value}]  
         }))           
       }
       this.setState({fetching: false})
       console.log('fetching============',this.state.fetching);
       this.state.myContacts = this.removeDuplicates(this.state.myContacts);
       this.showContact();     
   }
    
openDialogue = () => {
  if(this.state.picker == true){
  return(
    <Popover
      isVisible={this.state.isVisibleBig}      
      popoverStyle={{height: 70, width: 270}}
      // arrowStyle={styles.arrowStyle}
      // fromRect={this.state.popoverAnchor}      
      >
      <View style={styles.importRow}>
        <TouchableOpacity onPress={()=>{this.setState({selected_type: 'google',selected_type_state: 'google',googleOrFilePicker: true,isVisible:false,isVisibleBig: false})}}>
        <View>
          <Text style={{fontSize: 20, color: 'black'}} >Import from google</Text>
        </View>
        </TouchableOpacity>
        <View style={{height: 1,width: 270, backgroundColor: 'black', marginTop: 5 }}></View>
        <TouchableOpacity onPress={()=>{this.setState({selected_type: 'external',isVisibleBig: false,selected_type_state: 'external',googleOrFilePicker: true,isVisible:false}),this.selectFromWhereToImport()}}>
        <View style={{marginTop: 5}}>
          <Text style={{fontSize: 20, color: 'black'}} >Import from External Storage</Text>
        </View>
        </TouchableOpacity>        
      </View>     
        
      </Popover>    
    )    
  }
}

  render = () => {
    const navigation = this.props.navigation;
    return (
      <>
      <View style={{backgroundColor: 'blue'}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Contacts</Text>
      <TouchableOpacity onPress={()=>this.setState({isVisible: true})}>
        <Icon
          name='more-vert'          
          color='white'
        />

      </TouchableOpacity>
      </View>
      <Popover
      isVisible={this.state.isVisible}      
      popoverStyle={{height: 100, width: 80}}
      arrowStyle={styles.arrowStyle}
      placement='bottom'
      fromRect={this.state.popoverAnchor}      
      >
      <View>
        <TouchableOpacity onPress={()=>{this.setState({picker: true,isVisible:false,isVisibleBig: true})}}>
        <View style={styles.buttons}>
          <Text style={styles.buttonText}>Import</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.setState({isVisible:false}),this.export(this.state.token)}}>
        <View style={styles.buttons}>
          <Text style={styles.buttonText}>Export</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.setState({isVisible:false}),this.logout()}}>
        <View style={styles.buttons}>
          <Text style={styles.buttonText}>LogOut</Text>
        </View>
        </TouchableOpacity>  
        
      </View>      
    </Popover>
      </View>  
      <View>
       
      <ScrollView>          
        {this.openDialogue()}
        {this.wait()}
        {this.showContact()}
        {this.selectFromWhereToImport()}
      </ScrollView>
        
      </View>    
        </>
     );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
    padding: 5,
    margin: 5
  },
  activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   },
   header:{
     height: 45,
     justifyContent: 'space-around',
     alignItems: 'center',
     flexDirection: 'row',
     padding: 5
   },
   headerText:{
     fontSize: 25,
     color: 'white'
   },
   importRow:{
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center'
   },
   buttons: {
     backgroundColor: 'white',
     height: 30,
     width: 80, 
     alignItems: 'center',
     justifyContent: 'center',
     borderRadius: 5,
     borderBottomWidth: 1,
     borderBottomColor: 'black'
   },
   buttonText:{
     fontSize: 20, 
     color: 'black'
   },
   arrowStyle:{
     // position: 'top'
   },
   imageLogo:{
    height: 50,
    width: 50,
    borderRadius: 100,
    // borderWidth: 2,
    // borderColor: 'black',
  }

});


         
// fbSecret : 59c2e1a869577aa23569e284d64a4611

