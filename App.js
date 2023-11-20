import React, { useEffect, useState,useRef } from 'react';
import { View, Text, Alert, StyleSheet, Image , BackHandler} from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SuccessScreen from './screens/SuccessScreen';
import Logo from './components/Logo';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';
import adminapi from "./api/adminapi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';


const LOCATION_TRACKING = 'location-tracking';
const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const BACKGROUND_FETCH_TASK1 = 'background-fetch-task1';
const Stack = createNativeStackNavigator();
const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2490ef',
      secondary: '#2490ef',
    },};

TaskManager.defineTask(LOCATION_TRACKING,async({data , error})=>{
if(error){
  console.log('Tracking error' , error);
  return;
}else{
  if(data){
        const {locations} = data;
        const latitude = locations[0].coords.latitude;
        const longitude = locations[0].coords.longitude;
        const currentLocation = `${latitude},${longitude}`;
        backgroundJob(currentLocation);
            }
          }});
TaskManager.defineTask(BACKGROUND_FETCH_TASK1,async({data ,error})=>{
      if(error){
          console.log(error);
        }else{
        if(data){
        backgroundJob();
        console.log("background job is running");
        return BackgroundFetch.BackgroundFetchResult.NewData;
          }

        }});
const callforkm=async(edc)=>{

 let origin = edc.start_coordinates ? edc.start_coordinates : null;
 let destination = edc.end_coordinates ? edc.end_coordinates : null;
 let waypointsString = edc.location_coordinates ? edc.location_coordinates : null;

  if(origin && destination && waypointsString){
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypointsString}&&key=AIzaSyCycTw643FcTT_fC70A0AHv8GpHD_bP64s`;
  console.log(url);
  try{
  let response = await axios.get(url);

  if(response){
    console.log("call km")
     const routes = response.data.routes;
       if (routes.length > 0) {
      const legs = routes[0].legs;
      let totalDistance = 0;
      legs.forEach(leg => {
        totalDistance += leg.distance.value;
        console.log(leg.distance.value);
      });
      let cvvv =  +totalDistance / 1000 || 0; 
      return cvvv;
  }
 }
}
catch(e){
  console.log(e);
  return null;
}

}}
const stopLocationUpdates = async () => {
  try {
    const tracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    if (tracking) {
      locationdataall = [];
      await deactivateKeepAwake();
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK1);
    }

  } catch (error) {
    console.error('Error while stopping location updates:', error);
    locationdataall = [];
  }}
const backgroundJob = async (loc) => {
 console.log('Checking and Running Background Job');
  try {
    let getDataoflocation = await AsyncStorage.getItem('locationdata');
          if(!getDataoflocation){
           console.log("No Data found from location update");
           return;
      }   
    let asacv = JSON.parse(getDataoflocation);
     if(!asacv.name || !asacv.tripid){
      console.log("No Data found from location update");
      stopLocationUpdates();
       return;
     }
     let locv = asacv.location_coordinates ? asacv.location_coordinates : [];
     let newlocv = [...locv,loc];
     asacv['location_coordinates'] = newlocv;
     if(locv.length > 1){
      let totalkm = calculateTotalDistance(newlocv);
       console.log("data to calculate",totalkm);
           if(totalkm && totalkm > 0){
      asacv['total_distance'] = totalkm;
            }
     }

     let isapicall = processArray(newlocv);
     console.log("isapi call", isapicall);
     if(isapicall){
        let sddsd = callapitd(asacv,newlocv);
     }

    console.log(newlocv);
    if(loc){
             await AsyncStorage.setItem('locationdata', JSON.stringify(asacv));
           }
  }catch (error) {
    console.error('Background job error:', error);
  }};
const processArray=(dataArray)=>{
  const chunkSize = 6;
  if(dataArray || dataArray.length === 0){
   return false;
  }
  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize);
    if (chunk.length === chunkSize) {
        return true;
    }else{
        return false;
    }
  }}
const callapitd = async(asacv,locationdataall)=>{
  try{
      let totalkms = asacv.total_distance ? asacv.total_distance : null;
      let response = await adminapi.put(`/Trip/${asacv.name}`,JSON.stringify({location_coordinates:locationdataall.join("|"),name:asacv.name,total_distance:totalkms}));
      if(response.data){
        return true;
      }else{
        return false;
      }
     }catch(e){
                console.log("error",e);
                return false;
             }}
function calculateTotalDistance(coordinatesArray) {
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;}
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);}
  let totalDistance = 0;
  for (let i = 1; i < coordinatesArray.length; i++) {
    const [lat1, lon1] = coordinatesArray[i - 1].split(',').map(parseFloat);
    const [lat2, lon2] = coordinatesArray[i].split(',').map(parseFloat);
    totalDistance += haversine(lat1, lon1, lat2, lon2);
  }
   totalDistance.toFixed(2);
  return totalDistance;}

const App=()=>{
const [showlogout,setShowlogout] = useState(false);
const [versionNumber,SetVersionNumber] = useState(null);
const [sessionId,setSessionId] = useState(null);
const [locationUpdates, setLocationUpdates] = useState([]);
const [isTrackinglocation, setIsTrackinglocation] = useState(false);
const [agentId,setAgentId] = useState('');
const [agentIdxc,setAgentIdxc] = useState('');
const [afd,setAfd] = useState(updateClock());
const today = new Date().toISOString().split('T')[0];

async function checkSessionId() {
      let sdv = await AsyncStorage.getItem('agentid');
      if(sdv){
        setSessionId(sdv);
      }else{
        setSessionId(null);
      }}
const startLocationUpdates = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING,{
        accuracy: Location.Accuracy.High,
        timeInterval: 3 * 60 * 1000,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
                notificationTitle: 'Using your location',
                notificationBody: 'To turn off, go back to the app and switch something off.',
            },
      });
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK1, {
     minimumInterval: 1 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
   });
   
     const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
      if (hasStarted) {
      setIsTrackinglocation(hasStarted);
      await activateKeepAwakeAsync();
      }


    } catch (error) {
      console.error('Error starting location updates:', error);
    }}
const checkLocationStatus = async () => {
    const status  = await Location.hasServicesEnabledAsync();
    console.log(status,"check location-status");
    if (status === false) {
      Alert.alert(
        'Enable Location Services',
        'Please enable location services to use this app.',
        [
          {
            text: 'Open Settings',
            onPress: () => Location.enableNetworkProviderAsync(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Location services are not enabled'),
            style: 'cancel',
          },
        ]
      );

    }
    return status;};
const getAgentId = async () => {
    const agentIdx = await AsyncStorage.getItem('employeeName');
    if(agentIdx){
        setAgentId(agentIdx);
    }};
const checkLocationPermissionbackground = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Enable GPS',
        'Please enable GPS to use this app.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              Location.requestBackgroundPermissionsAsync();
             
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
            
            },
            style: 'cancel',
          },
        ]
      );
    }};
const checkLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Enable GPS',
        'Please enable GPS to use this app.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              Location.requestForegroundPermissionsAsync();
             
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
            
            },
            style: 'cancel',
          },
        ]
      );
    }};
function updateClock() {

  const currentTimeUTC = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedTime = formatter.format(currentTimeUTC);
  return formattedTime;}
const getRegiisteredTask=async()=>{
const registeredTasks = await TaskManager.getRegisteredTasksAsync();}
const getCurrentLocation = async () => {
    const maxRetryAttempts = 3;
    const retryDelay = 3000;
    
    for (let attempt = 1; attempt <= maxRetryAttempts; attempt++) {
        try {
          
            const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, maximumAge: 10000 });
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, retryDelay));
            
            const location = await Promise.race([locationPromise, timeoutPromise]);
      
             if (location) {
                const latitude = location.coords.latitude;
                const longitude = location.coords.longitude;
                const currentLocation = `${latitude},${longitude}`;
                return currentLocation;
            }
        } catch (error) {
            console.error('Error getting current location:', error);
        }

        if (attempt < maxRetryAttempts) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }

    return null;};

useEffect(()=>{
  getAgentId();
  setInterval(()=>{
  let cvv = updateClock();
  setAfd(cvv);
  },1000);
getRegiisteredTask();},[]);

useEffect(() => {
   const appVersion = Constants.expoConfig.version;
   if(appVersion){
    SetVersionNumber(appVersion);
   }
    checkLocationPermission();
    checkLocationPermissionbackground();
    checkSessionId();

    const disableBackButton = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', disableBackButton);
    return () => {
    BackHandler.removeEventListener('hardwareBackPress', disableBackButton);
    }; }, []);

useEffect(()=>{
setAgentIdxc(agentId);},[agentId]);


return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen 
                    name="Login"
                    options={({route,navigation})=>({
                      headerTitle:(props) => <Logo {...props} agentIdxc={agentIdxc} updateClock={updateClock} versionNumber={versionNumber} showlogout={showlogout} afd={afd} today={today} route={route} navigation={navigation} setAgentId={setAgentId}/>,
                      headerBackVisible:false
                    })}
                   >
                    {(props) => <HomeScreen {...props} screenProps={{sessionId,setSessionId,versionNumber,checkLocationStatus,showlogout,setShowlogout,startLocationUpdates,stopLocationUpdates,locationUpdates,setLocationUpdates,callforkm}}/>}
                  </Stack.Screen>
                  <Stack.Screen 
                    name="Home"
                     options={({route,navigation})=>({
                      headerTitle:(props) => <Logo {...props} agentIdxc={agentIdxc} updateClock={updateClock} versionNumber={versionNumber} showlogout={showlogout} afd={afd} today={today} route={route} navigation={navigation} setAgentId={setAgentId}/>,
                      headerBackVisible:false
                    })}
                   >
                    {(props) => <SuccessScreen {...props} screenProps={{sessionId,setSessionId,versionNumber,checkLocationStatus,showlogout,setShowlogout,startLocationUpdates,stopLocationUpdates,locationUpdates,setLocationUpdates,callforkm,getCurrentLocation,calculateTotalDistance}}/>}
                  </Stack.Screen>
                </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
       )
}
export default App