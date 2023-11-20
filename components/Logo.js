import React, { useState , useEffect} from 'react';
import { View, Text, Button, Alert,Linking,StyleSheet , Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function updateClock() {
const currentTimeUTC = new Date();
const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const formattedTime = formatter.format(currentTimeUTC);
  return formattedTime;
}
const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width:'100%',
    paddingHorizontal:20
  },
  logoImage: {
    width: 80,
    height: 40,
    marginRight: 8,
  },
});


const Logo = (props) => {

const {agentIdxc,updateClock,versionNumber,showlogout,afd,today,route,setAgentId,navigation} = props;

const logout = async () => {

  try {
    const itemsToClear = [
      'agentid',
      'employeeName'
    ];

 const response = await axios.get('https://erceyecare.onehash.ai/api/method/logout');
  if(response.status === 200){
 let sdc = false;
    // Clear each item from localStorage
    for (const item of itemsToClear) {
      let sddd = await AsyncStorage.getItem(item);
      if(sddd){
       await AsyncStorage.removeItem(item);
       setAgentId('');
       sdc = true; 
      }
      
    }
  console.log("Login status",!sdc);
  if(sdc){
      navigation.navigate('Login');
  }


  }
} catch (error) {
    console.error('Error during logout:', error);
  }
}

return(
        <View style={styles.logoContainer}>
          <Image source={require('../assets/erc.png')} style={styles.logoImage} />
          <View>     
           <Text style={{fontSize:10,color:'#2490ef'}}>Hi , {agentIdxc} </Text>
           <Text style={{fontSize:7}}>Date: {today}</Text>
           <Text style={{fontSize:7}}>Time: {afd}</Text>
           <Text style={{fontSize:7,color:'red'}}>Version: {versionNumber}</Text>
          </View>
            {route && route.name !== 'Login' && !showlogout ? <Text style={{padding:5,color:'#2490ef', fontWeight:'800',fontSize: 16 }} onPress={()=>logout()}>Logout</Text> : ''}
        </View>
	  )
}



export default Logo;