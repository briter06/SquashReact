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
      }
  });