import "reflect-metadata";
import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, ImageBackground,Image, ActivityIndicator  } from 'react-native';
import { globalStyles } from './styles';
import { resolve } from 'inversify-react';
import {AuthService} from '../services/Auth/AuthService';
import { StackActions } from '@react-navigation/native';

interface Props {
    navigation: any
}

export class LoginForm extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;
    private back_img :any = require('../../assets/images/back.png');
    private icon_img :any = require('../../assets/images/ic_launcher_foreground.png');

    constructor(props:any){
        super(props);
    }

    state = {
        username:'',
        password:'',
        processing:false
    }

    login = ()=>{
        this.setState({processing:true});
        this.authService.login(this.state.username,this.state.password)
        .then(async (result:any)=>{
            if(result.data.status==1){
                await this.authService.saveAccessToken(result.data.payload.accessToken);
                this.gotToMain();
            }else{
                Alert.alert(
                    "Error",
                    "Usuario o contraseña incorrectos",
                    [
                      { text: "OK", onPress: () => this.setState({processing:false})}
                    ]
                  );
            }
        });
    }

    gotToMain = ()=>{
        this.props.navigation.dispatch(
            StackActions.replace('drawer_main')
        );
    }

    valid = ()=>{
        return !this.state.processing && this.state.username.trim()!=='' && this.state.password.trim()!=='';
    }

    render = ()=>{
        return (
            <View style={{
                flex:1,
            }}>
                <ImageBackground source={this.back_img} resizeMode="cover" style={styles.imageBackground}>
                    <View style={[globalStyles.containerFluid,styles.container]}>
                        <Image
                            style={styles.tinyLogo}
                            source={this.icon_img}
                        />

                        <View style={styles.loginForm}>
                            
                            <Text style={styles.label}>Usuario</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(newValue)=>{this.setState({username:newValue})}}
                                value={this.state.username}
                                placeholder="Usuario"
                                
                            />
                            <Text style={[styles.label,{marginTop:10}]}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(newValue)=>{this.setState({password:newValue})}}
                                value={this.state.password}
                                placeholder="Contraseña"
                                secureTextEntry={true}
                            />

                            <TouchableOpacity disabled={!this.valid()}
                            style={[this.valid()?globalStyles.button:globalStyles.button_disabled]} onPress={this.login}>
                                {
                                    this.state.processing?
                                    <ActivityIndicator size="large" color="#FFFFFF" />:
                                    <Text style={globalStyles.buttonText}>Entrar</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label:{
        fontWeight:'bold',
        fontSize:15,
        marginBottom:10
    },
    input: {
        borderWidth: 1,
        width:'80%',
        textAlign:'center',
        borderRadius:10
    },
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
    imageBackground: {
        flex: 1,
        justifyContent: "center",
        backgroundColor:'#D8D00B'
      },
    loginForm:{
        alignItems: 'center',
        justifyContent: 'center',
        width:'80%',
        paddingVertical:50,
        borderRadius:25,
        opacity:0.8,
        backgroundColor:'white'
    },
    tinyLogo: {
        width: 250,
        height: 250,
        marginBottom:5
      }
  });