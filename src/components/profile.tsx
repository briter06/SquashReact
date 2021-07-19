import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props{
    user:{nombre:string,tipo:string}
}

export default class ProfileComponent extends React.Component<Props>{

    render(){
        return (
            <View style={[styles.card]}>
                <Text style={{fontWeight:'bold',fontSize:20}}>{this.props.user.nombre}</Text>
                <Text style={{fontSize:15}}>{this.props.user.tipo}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card:{
        marginBottom:15,
        marginHorizontal:15,
        height:80,
        padding:8,
        borderRadius:15
    }
  });