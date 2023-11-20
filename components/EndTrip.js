import React, { useState , useEffect } from 'react';
import {Button} from 'react-native-paper';
import { View,Alert} from 'react-native';
import styles from "../screens/styles";


const EndTrip=({endTrip})=>{


return (
	<View style={{width:'100%',flex:1,padding:1,position:'absolute',bottom:10}}>
	 <View style={styles.buttonContainer}>
        <Button  style={{position:'relative',zIndex:9999,padding:15,backgroundColor:'#FF5252'}} icon="rocket" mode="contained" onPress={() =>endTrip()}>
         End Trip
        </Button>
      </View>
    </View>
	)

}
export default EndTrip;