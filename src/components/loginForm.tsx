import "reflect-metadata";
import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, ImageBackground,Image, ActivityIndicator  } from 'react-native';
import { globalStyles } from './styles';
import { resolve } from 'inversify-react';
import {AuthService} from '../services/Auth/AuthService';
import { StackActions } from '@react-navigation/native';
import { ErrorService } from "../services/Error/ErrorService";
import Dialog from "react-native-dialog";

interface Props {
    navigation: any
}

export class LoginForm extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    @resolve(ErrorService)
    private errorService!:ErrorService;

    private back_img :any = require('../../assets/images/back.png');
    private icon_img :any = require('../../assets/images/ic_launcher_foreground.png');

    constructor(props:any){
        super(props);
    }

    state = {
        username:'',
        password:'',
        emailRecover: '',
        processing:false,
        visiblePassRecover: false
    }

    login = ()=>{
        this.setState({processing:true});
        this.authService.login(this.state.username,this.state.password)
        .then(async (result:any)=>{
            if(result.data.data){
                await this.authService.saveAccessToken(result.data.data.accessToken);
                this.gotToMain();
            }else{
                const {title,text} = this.errorService.getErrorInfo(result.data)
                Alert.alert(
                    title,
                    text,
                    [
                        { text: "OK", onPress: () => this.setState({processing:false})}
                    ]
                );
            }
        }).catch(err=>{
            const {title,text} = this.errorService.getErrorInfo(err.response.data)
            Alert.alert(
                title,
                text,
                [
                    { text: "OK", onPress: () => this.setState({processing:false})}
                ]
            );
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

    closeDialog=()=>{
        this.setState({visiblePassRecover:false});
    }

    recuperar = ()=>{
        this.setState({visiblePassRecover:false,processing:true});
        const email = this.state.emailRecover
        this.authService.recuperarContrasenia(email).then(({data})=>{
            if(data.data){
                Alert.alert(
                    'Correo envíado',
                    'Se ha envíado una contraseña temporal a su correo electrónico',
                    [
                        { text: "OK", onPress: () => this.setState({processing:false})}
                    ]
                );
            }else{
                const {title,text} = this.errorService.getErrorInfo(data)
                Alert.alert(
                    title,
                    text,
                    [
                        { text: "OK", onPress: () => this.setState({processing:false})}
                    ]
                );
            }
        }).catch(err=>{
            const {title,text} = this.errorService.getErrorInfo(err.response.data)
            Alert.alert(
                title,
                text,
                [
                    { text: "OK", onPress: () => this.setState({processing:false})}
                ]
            );
        });
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

                            <TouchableOpacity style={[{paddingVertical:5}]} onPress={() => {this.setState({visiblePassRecover:true})}}>
                                <Text style={{color: 'black', textDecorationLine: 'underline', marginTop: 5, textAlign:'center'}}>
                                    Recuperar contraseña
                                </Text>
                            </TouchableOpacity>

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

                <View>
                    <Dialog.Container visible={this.state.visiblePassRecover}>
                    <Dialog.Title>Recuperar contraseña</Dialog.Title>
                    <TextInput
                                style={styles.input_full}
                                onChangeText={(newValue)=>{this.setState({emailRecover:newValue})}}
                                value={this.state.emailRecover}
                                placeholder="Correo electrónico"
                            />
                    <Dialog.Button onPress={this.closeDialog} label="Cancelar" />
                    <Dialog.Button onPress={this.recuperar} label="Recuperar" />
                    </Dialog.Container>
                </View>
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
    input_full: {
        borderWidth: 1,
        width:'100%',
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