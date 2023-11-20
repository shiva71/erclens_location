import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
    tableHeader: {
    backgroundColor: '#DCDCDC',
    width:'100%'
  },
    scrollView: {
    marginHorizontal: 20,
  },
  w100:{
  },
   wr100:{
    width:'100%',
    color:'red'
  },
  selectedItem: {
    backgroundColor: 'lightblue', // Change this to the color you want for selected item
  },  
  buttonContainer: {
    position:'relative',
    marginTop:5,
    width:'100%',
    padding:2

  },
  buttonghar:{
    position:'absolute',
    bottom:2,
    display:'flex',
    width:'100%',
    zIndex:999,


  },
  warning:{
   marginTop:10,
   fontSize: 11,
   color:'red',
   fontWeight: '600',
   backgroundColor:'white',
   paddingVertical: 8,
   paddingHorizontal: 7,
   borderRadius: 10



  }

});
export default styles;