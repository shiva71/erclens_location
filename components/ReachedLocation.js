import React, { useState , useEffect } from 'react';
import {Button} from 'react-native-paper';
import { View,Alert} from 'react-native';
import styles from "../screens/styles";



const ReachedLocation=({checkLocationStatus,isSaving,saveDataToStorage ,endTrip,setReachedLocations,reachedLocations,startTrip,setStartTrip,setIsLoading})=>{




const startTripagain=async()=>{
let pp = await checkLocationStatus();
if(pp){
if(startTrip){
setIsLoading(true);
try{
let vvffv = await saveDataToStorage('reached_locations_update');
if(vvffv){
  setIsLoading(false)

}else{
  setIsLoading(false);
}
}catch(e){
  console.log(e);
  setIsLoading(false);
}

}
}else{
  Alert.alert('Location not Activated','Location must be on to operate');
}
}


const reachLocationsd=async()=>{
let pp = await checkLocationStatus();
if(pp){
if(startTrip){
setIsLoading(true);
let xc = await saveDataToStorage('reached_locations');

if(xc){
setIsLoading(false);
}else{
 setIsLoading(false); 
}


}
}else{
  Alert.alert('Location not Activated','Location must be on to operate');
}


}



return (
	<View style={{width:'100%',flex:1,padding:1}}>
	 <View style={styles.buttonContainer}>
        {!reachedLocations && startTrip  ? <Button disabled={isSaving} style={{position:'relative',zIndex:9999,padding:15,marginTop:250}} icon="rocket" mode="contained" onPress={() => reachLocationsd()}>
         Reached Location
        </Button> : ""}
   
      </View>
      	 <View style={styles.buttonContainer}>
        {reachedLocations && startTrip ? <Button disabled={isSaving} style={{position:'relative',zIndex:9999,padding:15}} icon="rocket" mode="contained" onPress={() => startTripagain()}>
         Start Trip Again
        </Button>:""}
      </View>

    </View>
	)

}
export default ReachedLocation;