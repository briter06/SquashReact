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

export class PerfilScreen extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    private _unsubscribe :any;

    state = {
        user:{nombre:'',username:'',correo:''},
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
        return this.state.user.username.trim()!=='' && this.state.user.nombre.trim()!==''
        && this.state.user.correo?.trim()!==''
    }

    updateUser = () => {
        this.setState({processing:true});
        this.authService.updateUser(this.state.user).then(({data})=>{
            this.setState({processing:false});
            if(data.status==0){
                if(data.errors[0] === 'username_exists'){
                    Alert.alert(
                        "Error",
                        "Nombre de usuario ya existe",
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
                this.props.updateUser();
                Alert.alert(
                    "Exito!",
                    "Datos actualizados correctamente",
                    [
                      { text: "OK", onPress: () => this.setState({proccessing:false})}
                    ]
                  );
            }
        }).catch(err=>{
            Alert.alert(
                "Error",
                "Error interno. Contactar a administrador.",
                [
                  { text: "OK", onPress: () => this.setState({proccessing:false})}
                ]
              );
        });
    }

    render(){
        return (
            <View style={[styles.container]}>
                <Text style={{fontWeight:'bold',fontSize:30,textAlign:'center'}}>Tu perfil</Text>
                <View style={{padding:20}}> 
                    <TextInput
                        label="Usuario"
                        style={styles.text}
                        value={this.state.user.username}
                        onChangeText={text => {
                            var user = {...this.state.user}
                            user.username = text;
                            this.setState({user})
                        }}
                    />
                    <TextInput
                        label="Nombre"
                        style={styles.text}
                        value={this.state.user.nombre}
                        onChangeText={text => {
                            var user = {...this.state.user}
                            user.nombre = text;
                            this.setState({user})
                        }}
                    />
                    <TextInput
                        label="Correo electrónico"
                        style={styles.text}
                        value={this.state.user.correo}
                        onChangeText={text => {
                            var user = {...this.state.user}
                            user.correo = text;
                            this.setState({user})
                        }}
                    />
                    <TouchableOpacity disabled={!this.valid()}
                    style={[this.valid()?globalStyles.button:globalStyles.button_disabled]} onPress={this.updateUser}>
                        {
                            this.state.processing?
                            <ActivityIndicator size="large" color="#FFFFFF" />:
                            <Text style={globalStyles.buttonText}>Guardar</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={[globalStyles.button]} onPress={()=>this.props.navigation.navigate('pass')}>
                        {
                            this.state.processing?
                            <ActivityIndicator size="large" color="#FFFFFF" />:
                            <Text style={globalStyles.buttonText}>Cambiar contraseña</Text>
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