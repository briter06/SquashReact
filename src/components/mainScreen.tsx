import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    navigation: any
}

export class MainScreen extends React.Component<Props>{

    constructor(props:any){
        super(props);
    }

    render(){
        return (
            <View style={[styles.container]}>
                <Text>Hola</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
  });