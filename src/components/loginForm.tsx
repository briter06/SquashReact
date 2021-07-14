import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert  } from 'react-native';
import { ServiceContext } from '../../Service';
import { globalStyles } from './styles';
import { Actions } from 'react-native-router-flux'


export class LoginForm extends React.Component{
    static contextType = ServiceContext;
    state = {
        username:'',
        password:''
    }
    constructor(props:any){
        super(props);
    }

    login = ()=>{
        this.context.authService.login(this.state.username,this.state.password)
        .then(async (result:any)=>{
            if(result.data.status==1){
                await this.context.authService.saveAccessToken(result.data.payload.accessToken);
                this.gotToMain();
            }else{
                Alert.alert(
                    "Error",
                    "Usuario o contraseña incorrectos",
                    [
                      {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  );
            }
        });
    }

    gotToMain = ()=>{
        Actions.main();
    }

    render = ()=>{
        return (
            <View>
                <View style={[globalStyles.containerFluid,styles.container]}>
                    
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

                    <TouchableOpacity disabled={this.state.username.trim()=='' || this.state.password.trim()==''}
                    style={styles.button} onPress={this.login}>
                        <Text style={styles.text}>Entrar</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label:{
        fontWeight:'bold',
        fontSize:15
    },
    input: {
        borderWidth: 1,
        width:'80%',
        textAlign:'center'
    },
    container:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop:15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'black',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
  });