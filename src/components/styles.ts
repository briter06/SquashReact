import { StyleSheet  } from 'react-native';


export const globalStyles = StyleSheet.create({
    containerFluid: {
        width:'100%',
    //   height:'100%'
    },
    fullScreen:{
        width:'100%',
        height:'100%'
    },
    button: {
        marginTop:15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'black',
      },
    button_disabled: {
        marginTop:15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'black',
        opacity:0.8
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textAlign:'center'
      },
      select : {
          marginTop:15,
          marginBottom:15,
          width:'80%',
          backgroundColor:'white',
          borderWidth:2,
          borderRadius:25
      }
  });

  export const pickerStyles = StyleSheet.create({
    inputIOS:{
        fontSize:20,
        textAlign:'center',
        color:'black',
        paddingVertical:5,
        paddingHorizontal:10
    },
    inputAndroid:{
        fontSize:20,
        textAlign:'center',
        color:'black',
        paddingVertical:5,
        paddingHorizontal:10
    }
  });