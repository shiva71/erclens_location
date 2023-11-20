import React, { useState,useEffect } from 'react';
import { View, Alert } from 'react-native';
import { TextInput ,Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import adminapi from "../api/adminapi";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';



const HomeScreen = ({ navigation , route,screenProps}) => {
  const {sessionId,setSessionId} = screenProps;
  const [email, setEmail] = useState('');
  const [passwordx, setPasswordx] = useState('');
  const [agentidcheck,SetAgentidcheck] = useState(false);
  const [isLoading,setIsloading] = useState(false);  
  const loginUrl = 'https://erceyecare.onehash.ai/api/method/login';

  const validateEmail = (email) => {
    // Basic email validation regex pattern
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };




const validateuser = async (e, p) => {
  let output = { status: false, message: '' };

  if (!validateEmail(e)) {
    output = { status: false, message: 'Email Id format Invalid' };
    return output;
  }

  const cvb = {
    usr: e,
    pwd: p,
  };

  try {
    const response = await axios.post(loginUrl, cvb, {
      headers: {
            'Accept-Encoding': 'compress',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
      },
    });
  if(response.data){
    let {full_name} = response.data;
     await AsyncStorage.setItem('employeeName', full_name);
    output = { status: true, message: 'Log-in Sucessfully' };
    return output;
  }
  } catch (error) {
    console.error(error);
    output = { status: false, message: 'Invalid Login or Password or Check your Internet!!' };
    return output;
  }


};




useEffect(()=>{
checkAgentId();


},[sessionId]);

const checkLoginx=async()=>{

try{
 const response = await axios.get('https://erceyecare.onehash.ai/api/method/frappe.auth.get_logged_user');

if(response.status === 200){
if(agentidcheck && agentidcheck === true){ 
  navigation.navigate("Home");
 }
 }else{
 Alert.alert('Session Expired','Login Again');
 return;
 } 

}catch(e){
 return;
}
}

 useEffect(()=>{
  checkLoginx();

  },[agentidcheck]);

const checkAgentId = async () => {
    if (!sessionId) {
     SetAgentidcheck(false);
    }else{
      SetAgentidcheck(true);
    }
  };

  const saveEmailToStorage = async () => {
  setIsloading(true);
  let {status,message} = await validateuser(email,passwordx);
    if (status) {
      try {
        await AsyncStorage.setItem('agentid', email);
        navigation.navigate('Home');
        setIsloading(false);
        setSessionId(email);
      } catch (error) {
        Alert.alert('Error', 'Login Error');
        setIsloading(false);
        setSessionId(null);
      }
    } else {
      Alert.alert('Error', message);
      setIsloading(false);
      setSessionId(null);
    }
  };

  return (
    <>
    <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
          />
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <TextInput
  style={{
    height: 25,
    padding: 10,
    width: '95%',
    marginBottom: 20,
  }}
  onChangeText={(text) => setEmail(text)}
  value={email}
  placeholder="Enter Email Id"
  placeholderTextColor="gray"
  autoCapitalize="none"
/>
  <TextInput
  style={{
    height: 25,
    padding: 10,
    width: '95%',
    marginBottom: 20,
  }}
  onChangeText={(text) => setPasswordx(text)}
  value={passwordx}
  secureTextEntry
  placeholder="Enter Password"
  placeholderTextColor="gray"
  autoCapitalize="none"
/>
      <Button style={{width:'95%',padding:15,position: 'absolute',bottom: 10,}} icon="login" mode="contained" onPress={saveEmailToStorage}>Submit</Button>

    </View>
  </>
  );
};

export default HomeScreen;