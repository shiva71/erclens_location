import React, { useState , useEffect } from 'react';
import { TextInput ,List ,Button} from 'react-native-paper';
import {View,Alert,Keyboard } from 'react-native';
import styles from "../screens/styles";
import TodaysEntry from "./TodaysEntry";


const InitialPage=({manualsync,newentries,callxc, sessionId,resetEntry,checkLocationStatus,isSaving,SetShowEntry,setIsstarttimeer,setIsLoading,handleStartTrip,tripdatacollection,setTripdatacollection,saveDataToStorage,startTrip,setStartTrip,setEndTrip,campId, setCampId,selectedValue, setSelectedValue})=>{
const [message,setMessage] = useState('');
const [isKeyboardVisible, setKeyboardVisible] = useState(false);


const handleCampIdChange = (text) => {
    setCampId(text);
  };


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    // Clean up the listeners when the component is unmounted
    return () => {
      keyboardDidShowListener.remove();
    };

  }, []);





return (
   <>
   <View style={{width:'100%',flex:1,padding:5}}>
   <List.Section title={message ==="" ? `Select Purpose` : message} style={message ==='' ? styles.w100 : styles.wr100 }>
        <List.Accordion
        title="Select Purpose"
        left={props => <List.Icon {...props} icon="bookmark" />}>
        <List.Item title="Camp" onPress={()=>setSelectedValue('Camp')} style={selectedValue === 'Camp' ? styles.selectedItem : null} />
        <List.Item title="Survey" onPress={()=>setSelectedValue('Survey')} style={selectedValue === 'Survey' ? styles.selectedItem : null} />
      </List.Accordion>
   </List.Section>
    </View>
   <View style={{width:'100%',flex:1,padding:3}}>
	  {selectedValue === 'Camp' ? <TextInput
      label="Camp Id"
      value={campId}
      style={{...styles.w100,zIndex:9999,position:'relative'}}
      onChangeText={handleCampIdChange}
    /> :""}
    <TodaysEntry newentries={newentries}/>
   </View>
    
   <View style={isKeyboardVisible ? {...styles.buttonghar,zIndex:999} : {...styles.buttonghar,zIndex:999}}>
     <View style={styles.buttonContainer}>
        <Button disabled={isSaving} icon="rocket" style={{position:'relative',zIndex:99999,padding:15,backgroundColor:'#009500'}} mode="contained" onPress={() =>startTrip()}>
         Start Trip
        </Button>

      </View>
      
   </View>

 </>
  
	   )

}
export default InitialPage;