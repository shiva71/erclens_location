import React, { useState , useEffect } from 'react';
import { TextInput ,List ,Button, DataTable} from 'react-native-paper';
import { View , Text , ScrollView } from 'react-native';
import styles from "../screens/styles";
import adminapi from "../api/adminapi";

const TodaysEntry=({newentries})=>{

const today = new Date().toISOString().split('T')[0];


return (
<>
<View style={{ flex: 1, alignItems: 'center', marginTop: 2,marginBottom:10}}>
  <ScrollView style={{ height: 500, width: '100%' }} vertical showsVerticalScrollIndicator={true}>
    <DataTable>
      <DataTable.Header style={{ backgroundColor: '#DCDCDC', overflow: 'hidden' }}>
        <DataTable.Title style={{ paddingHorizontal: 12, textAlign: 'center' }}>ID</DataTable.Title>
        <DataTable.Title style={{ paddingHorizontal: 12, textAlign: 'center' }}>Purpose</DataTable.Title>
        <DataTable.Title style={{ paddingHorizontal: 12, textAlign: 'center' }}>Km</DataTable.Title>
        <DataTable.Title style={{ paddingHorizontal: 12, textAlign: 'center' }}>Date</DataTable.Title>
        <DataTable.Title style={{ paddingHorizontal: 12, textAlign: 'center' }}>EndTrip</DataTable.Title>
  
      </DataTable.Header>
      {newentries && newentries.length > 0 ? newentries.map((entry, key) => {
        return (
          <DataTable.Row style={{width:'100%'}} key={key}>
            <DataTable.Cell style={{textAlign: 'center' }}><Text style={{fontSize: 11}}>{entry.name ? entry.name : ""}</Text></DataTable.Cell>
            <DataTable.Cell style={{textAlign: 'center' }}><Text style={{fontSize: 11}}>{entry.purpose}</Text></DataTable.Cell>
            <DataTable.Cell style={{textAlign: 'center' }}><Text style={{fontSize: 11}}>{entry.total_distance ? entry.total_distance : '0'}</Text></DataTable.Cell>
            <DataTable.Cell style={{textAlign: 'center' }}><Text style={{fontSize: 11}}>{entry.posting_date ? entry.posting_date : ''}</Text></DataTable.Cell>
            <DataTable.Cell style={{textAlign: 'center' }}><Text style={{fontSize: 11}}>{entry.end_coordinates && entry.end_coordinates !=="" ? 'Close' : 'Open'}</Text></DataTable.Cell>
          </DataTable.Row>
        )
      }) : <Text>No Data Found</Text>}
    </DataTable>
  </ScrollView>
</View>
</>

	   )

}
export default TodaysEntry;