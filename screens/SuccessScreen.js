  import React, { useState , useEffect , useRef } from 'react';
  import { View, Text, Button, Alert,Linking  } from 'react-native';
  import { HeaderBackButton } from '@react-navigation/stack';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import adminapi from "../api/adminapi";
  import styles from "./styles";
  import { ActivityIndicator, MD2Colors } from 'react-native-paper';
  import InitialPage from "../components/InitialPage";
  import EndTrip from "../components/EndTrip";
  import TodaysEntry from "../components/TodaysEntry";
  import Spinner from 'react-native-loading-spinner-overlay';
  import axios from 'axios';
  import createId from "create-id";



  const SuccessScreen = ({ navigation,screenProps}) => {

  const {setShowlogout,checkLocationStatus,versionNumber,sessionId,startLocationUpdates,stopLocationUpdates,locationUpdates,setLocationUpdates,getCurrentLocation,callforkm,calculateTotalDistance} = screenProps;
  const [isLoading,setIsLoading] = useState(false);
  const [startTrip,setStartTrip] = useState(false);
  const [tripId,setTripId] = useState(null);
  const [endTrip,setEndTrip] = useState(false);
  const [showEntry,SetShowEntry] = useState(false);
  const [existingVersion,setExistingVersion] = useState('');
  const today = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Kolkata' }).split(',')[0];
  const isConnectedRef = useRef(null);
  const url = 'https://drive.google.com/drive/folders/1m-at1pYY_DqodqgRyy-KgORa5wc0heMJ?usp=drive_linkhttps://drive.google.com/drive/folders/1m-at1pYY_DqodqgRyy-KgORa5wc0heMJ?usp=drive_link'; 
  const [newentries,setNewentries] = useState([]);
  const [warningAlert,setWarningAlert] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [campId, setCampId] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);


const getCurrentTime = () => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      return currentTime;};

useEffect(() => {
    if (isTracking) {
      startLocationUpdates();
    }else{
      stopLocationUpdates();
    }

    return () => {
      stopLocationUpdates();
    };
  },[isTracking]);

useEffect(()=>{
const sasas =async()=>{
  await checkLocationStatus();
}
sasas();
const getcv=async()=>{
  let ac = await AsyncStorage.getItem('locationdata');
  if(ac){
    let bc = JSON.parse(ac);
    if(bc && bc.start_trip){
    setIsTracking(true);
    console.log("locationdata available",ac);
  }
  }

  }
getcv();

},[sessionId]);

useEffect(()=>{
if(sessionId){
getDatabySessionId(sessionId);

}

},[sessionId]);


const getDatabySessionId=async(sessionid)=>{
setIsLoading(true);
try{
  let response = await adminapi.get(`/Trip?fields=["name","purpose","total_distance","camp_number","posting_date","end_coordinates"]&filters=[["email","=","${sessionid}"]]`);
  if(response && response.data && response.data.data){
    setNewentries(response.data.data);
    setIsLoading(false);
    return response.data.data;
   
    
  }else{
    setIsLoading(false);
    return null;
  }
 }catch(e){
  setIsLoading(false);
  console.log(e);
 }}

const startTripx = async () => {
    if(!selectedValue || selectedValue === ""){
      Alert.alert("Please select Purpose");
      return;
    }
    setIsLoading(true);
   let sd = await checkLocationStatus();
   if(sd === true){
      let newtripc = await createNewTrip();
     if(newtripc){
         setIsTracking(true);
         setIsLoading(false);
         console.log("check1");
     }else{
       setIsLoading(false);
       console.log("check2");
     }

     

    }else{
       setIsTracking(false);
       setIsLoading(false);
       console.log("check3");
    }};


const endTripx = async (id) => {

Alert.alert(
      'End Trip',
      'Do you really want to end the trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async() => {
setIsLoading(true);
let getDataoflocation = await AsyncStorage.getItem('locationdata');
if(!getDataoflocation){
 console.log("No Data found");
 setIsLoading(false);
 return;
}

let {tripid,name} = JSON.parse(getDataoflocation);
if(!tripid || !name){
 console.log("No Data found1");
setIsLoading(false);
 return;
}
let cvv  = await getCurrentLocation();
if(!cvv){
 console.log("No Data found2");
 setIsLoading(false);
 return; 
}
try{
let response = await adminapi.get(`/Trip/${name}`);

if(response && response.data){
let dec = response.data.data;
let location_coordinates = dec.location_coordinates;
let start_coordinates = dec.start_coordinates;
if(!start_coordinates){
 setIsLoading(false);
return;
}
if(!location_coordinates){
  location_coordinates = start_coordinates;
}
let location_coordinatescbv = location_coordinates.split("|");

/*let kmkm = await callforkm({start_coordinates:start_coordinates,location_coordinates:location_coordinates,end_coordinates:cvv});
if(!kmkm){
  let kmkm = 0;
}*/
let kmkm = calculateTotalDistance([start_coordinates,...location_coordinatescbv,cvv]);
let datac = { 
              end_coordinates: cvv,
              end_trip_time: getCurrentTime(),
              total_distance: kmkm

             };

let response1 = await adminapi.put(`/Trip/${name}`,JSON.stringify(datac));
  if(response1 && response1.data){
    setIsTracking(false);
    console.log("check4");
    setCampId('');
    setSelectedValue(null);
    setIsLoading(false);
    getDatabySessionId(sessionId);
    AsyncStorage.getItem('locationdata').then(locationdata => {
  if (locationdata !== null) {
    AsyncStorage.removeItem('locationdata')
      .then(() => {
        console.log('locationdata removed');
        
      })
      .catch(error => {
        console.error('Error removing locationdata:', error);
         setIsLoading(false);
      });
  } else {
    console.log('locationdata not found');
     setIsLoading(false);
  }
});
  return true;
  setIsLoading(false);
  }else{
    return false;
   setIsLoading(false);
  }
}
}catch(e){
  console.log("error",e);
   setIsLoading(false);
  return false;
}

          },
        },
      ],
      { cancelable: false }
        );

  };

const createNewTrip= async()=>{
const nows = new Date();
const idsdf = nows.getTime().toString();
const uniquestring = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZAABBFCAA" + idsdf;
const newid = createId("ERC-",null, 10, uniquestring);
const currentLocation = await getCurrentLocation();
  if(currentLocation && currentLocation !==''){
        const toupdate = {
            posting_date:today,
            email:sessionId,
            start_coordinates: currentLocation ? currentLocation : "",
            location_coordinates:"",
            end_coordinates:"",
            start_trip_time:getCurrentTime(),
            end_trip_time: "",
            location_reached_time:"",
            is_sync:'true',
            purpose:selectedValue,
            camp_number:campId,
            tripid:newid ? newid : null,
            total_distance:''
          };
  let res = await insertSingleEnry(toupdate);
if(res){
  AsyncStorage.setItem("locationdata" , JSON.stringify({tripid:newid,name:res,start_coordinates:toupdate.start_coordinates,email:toupdate.email,start_trip:true}));
  return res;
}else{
  return null;
}

    }}

const insertSingleEnry=async(data)=>{
 try{
  let response = await adminapi.post("/Trip",JSON.stringify(data));
  if(response && response.data && response.data.data && response.data.data.name !== ""){

    return response.data.data.name;

  }else{
    return null;
  }
 }catch(e){
  console.log(e);
  return null;
 }
}

  return (
      <>
         <View style={styles.container}>
          <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF' }}
            />
           {warningAlert ? <Text style={styles.warning}>WARNING : Please Sync all Unsync Data before Creating New Entry.</Text> : ''}
           {!isTracking ? <InitialPage startTrip={startTripx} campId = {campId} setCampId={setCampId} selectedValue={selectedValue} setSelectedValue = {setSelectedValue} newentries={newentries}/> : ''}
           {isTracking ?<EndTrip endTrip={endTripx}/>:""}         
          </View> 
         
     </>
         )

  }
  export default SuccessScreen;
