import "reflect-metadata";
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resolve } from "inversify-react";
import { AuthService } from "../../services/Auth/AuthService";
import { TextInput } from 'react-native-paper';
import { globalStyles } from "../styles";

interface Props {
    navigation: any,
    updateUser:()=>void;
}

export class PasswordScreen extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    private _unsubscribe :any;

    state = {
        currPassword:'',
        password:'',
        password2:'',
        processing:false
    }

    constructor(props:any){
        super(props);
    }

    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => this.setState({user:this.authService.getActiveUser()}))
        
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    valid = ()=>{
        return this.state.currPassword.trim()!=='' &&
        !this.notSamePass()
    }

    notSamePass = ()=>{
        return this.state.password.trim()!=='' &&
        this.state.password2.trim()!=='' &&
        this.state.password.trim()!==this.state.password2.trim()
    }

    updatePassword = () => {
        this.setState({processing:true});
        this.authService.updatePassword(this.state.password.trim(),this.state.currPassword.trim()).then(({data})=>{
            this.setState({processing:false});
            if(data.status==0){
                if(data.errors[0] === 'incorrect_password'){
                    Alert.alert(
                        "Error",
                        "Contraseña actual incorrecta",
                        [
                          { text: "OK", onPress: () => this.setState({proccessing:false})}
                        ]
                      );
                }else if(data.errors[0] === 'internal_server_error'){
                    Alert.alert(
                        "Error",
                        "Error interno. Contactar a administrador.",
                        [
                          { text: "OK", onPress: () => this.setState({proccessing:false})}
                        ]
                      );
                }
            }else{
                this.authService.logout(this.props.navigation)
                Alert.alert(
                    "Exito!",
                    "Contraseña actualizada correctamente",
                    [
                      { text: "OK", onPress: () => {}}
                    ]
                  );
            }
        });
    }

    render(){
        return (
            <View style={[styles.container]}>
                <Text style={{fontWeight:'bold',fontSize:30,textAlign:'center'}}>Cambiar contraseña</Text>
                <View style={{padding:20}}> 
                    <TextInput secureTextEntry={true}
                        label="Contraseña actual"
                        style={styles.text}
                        value={this.state.currPassword}
                        onChangeText={text => this.setState({currPassword:text})}
                    />
                    <TextInput secureTextEntry={true}
                        label="Nueva contraseña"
                        style={styles.text}
                        value={this.state.password}
                        onChangeText={text => this.setState({password:text})}
                    />
                    <TextInput secureTextEntry={true}
                        label="Confirmar nueva contraseña"
                        style={styles.text}
                        value={this.state.password2}
                        onChangeText={text => this.setState({password2:text})}
                    />
                    <Text style={{color:'red'}}>{this.notSamePass() ? 'Las contraseñas no son iguales' : ''}</Text>
                    <TouchableOpacity disabled={!this.valid()}
                    style={[this.valid()?globalStyles.button:globalStyles.button_disabled]} onPress={this.updatePassword}>
                        {
                            this.state.processing?
                            <ActivityIndicator size="large" color="#FFFFFF" />:
                            <Text style={globalStyles.buttonText}>Cambiar</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container:{
        // alignItems: 'center',
        // justifyContent: 'center',
        flex:1,
        paddingTop:20
    },
    text:{
        marginBottom:15
    }
  });