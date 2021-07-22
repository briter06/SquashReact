import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView } from 'react-native';
import { Divider } from "react-native-elements";
import { white } from "react-native-paper/lib/typescript/styles/colors";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
    navigation: any
}

const cancha = require("../../../assets/images/cancha.jpg");

export class AboutScreen extends React.Component<Props>{

    constructor(props:any){
        super(props);
    }

    render(){
        return (
            <View>
                <ScrollView style={{width:'100%'}} contentContainerStyle={[styles.container]}>
                    <Text style={{fontWeight:'bold',fontSize:40}}>Squash</Text>
                    <View style={[styles.button_container,styles.circular_border]}>
                        <TouchableOpacity style={[styles.full_size,styles.circular_border]}
                        onPress={() => this.props.navigation.navigate('reglamento')}>
                            <ImageBackground source={cancha}
                            style={[styles.full_size,styles.circular_border]}
                            imageStyle={[styles.full_size,styles.circular_border]}>
                            <Text style={[styles.text_button]}>Reglamento Básico</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                   

                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container:{
        alignItems: 'center'
    },
    button_container:{
        width:'90%',
        height:180,
        marginTop:30,
        borderWidth: 3,
    },
    circular_border:{
        borderRadius:25,
    },
    full_size:{
        width:'100%',
        height:'100%'
    },
    text_button:{
        position:'absolute',
        bottom:0,
        width:'100%',
        textAlign:'center',
        textAlignVertical:'bottom',
        backgroundColor:'white',
        opacity:0.8,
        fontWeight:'bold',
        fontSize:15,
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25,
    }
  });