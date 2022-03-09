import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { resolve } from "inversify-react";
import { Table, Row, Rows } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import { globalStyles, pickerStyles } from "./styles";
import { AuthService } from "../services/Auth/AuthService";
import { ErrorService } from "../services/Error/ErrorService";

interface Props {
    navigation: any
}

interface UsuariosState{
    usuarios:Array<{id:number,nombre:string,username:string}>;
    flexRows:Array<number>;
    tableHead:Array<string>;
    visibleAdd:boolean;
    visibleEdit:boolean;
    nombreAdd:string;
    usernameAdd:string;
    idEdit:number;
    creando:boolean;
    editando:boolean;
    refreshing:boolean;
    consultando:boolean;
}


export class UsuariosScreen extends React.Component<Props,UsuariosState>{

    @resolve(AuthService)
    private authService!:AuthService;

    @resolve(ErrorService)
    private errorService!:ErrorService;

    private _unsubscribe :any;

    constructor(props:any){
        super(props);
        this.state = {
            usuarios:[],
            flexRows:[3,2,1],
            tableHead: ['Nombre', 'Usuario','Editar'],
            visibleAdd:false,
            visibleEdit:false,
            nombreAdd:'',
            usernameAdd:'',
            idEdit:-1,
            creando:false,
            editando:false,
            refreshing:false,
            consultando:false
        }
        
    }


    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {

        })
        this.initUsuarios();
    }

    initUsuarios = ()=>{
        this.setState({consultando:true});
        return this.authService.getUsers()
        .then(({data})=>{
            this.setState({consultando:false});
            if(data.data){
                this.setState({usuarios:data.data.usuarios});
            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    openDialog=()=>{
        this.setState({visibleAdd:true});
    }

    closeDialog=()=>{
        this.setState({visibleAdd:false,nombreAdd:'',usernameAdd:''});
    }

    closeDialogEdit=()=>{
        this.setState({visibleEdit:false,nombreAdd:'',usernameAdd:''});
    }

    agregarUsuario=()=>{
        try{
            const newU = {
                nombre:this.state.nombreAdd.trim(),
                username:this.state.usernameAdd.trim(),
                password:this.state.usernameAdd.trim()
            }
            this.setState({
                creando:true
            });
            this.authService.agregarUsuario(newU)
            .then(({data})=>{
                this.setState({
                    creando:false
                });
                if(data.data){
                    this.initUsuarios().finally(()=>{
                        this.usuarioAgregado();
                        this.closeDialog();
                    });
                }else{
                    this.showErrorModal(data);
                }
            }).catch(err=>{
                this.setState({
                    creando:false
                });
                this.showErrorModal(err.response.data);
            });
        }catch(err){
            this.setState({
                creando:false
            });
            this.showErrorModal();
        }
    }

    eliminarUsuario = ()=>{
        try{
            this.setState({
                editando:true
            });
            this.authService.eliminarUsuario(this.state.idEdit)
            .then(({data})=>{
                this.setState({
                    editando:false
                });
                if(data.data){
                    this.initUsuarios().finally(()=>{
                        this.usuarioEliminado();
                        this.closeDialogEdit();
                    });
                }else{
                    this.showErrorModal(data);
                }
            }).catch(err=>{
                this.setState({
                    editando:false
                });
                this.showErrorModal(err.response.data);
            });
        }catch(err){
            this.setState({
                editando:false
            });
            this.showErrorModal();
        }
    }

    editarUsuarioPost = ()=>{
        try{
            const newU = {
                nombre:this.state.nombreAdd.trim(),
                username:this.state.usernameAdd.trim()
            }
            this.setState({
                editando:true
            });
            this.authService.editarUsuario(newU,this.state.idEdit)
            .then(({data})=>{
                this.setState({
                    editando:false
                });
                if(data.data){
                    this.initUsuarios().finally(()=>{
                        this.usuarioEditado();
                        this.closeDialogEdit();
                    });
                }else{
                    this.showErrorModal(data);
                }
            }).catch(err=>{
                this.setState({
                    editando:false
                });
                this.showErrorModal(err.response.data);
            });
        }catch(err){
            this.setState({
                editando:false
            });
            this.showErrorModal();
        }
    }

    editarUsuario=(user:any)=>{
        this.setState({
            nombreAdd:user.nombre,
            usernameAdd:user.username,
            idEdit:user.id,
            visibleEdit:true
        });
    }

    isAddValid = ()=>{
        return this.state.nombreAdd.trim()!=='' && this.state.usernameAdd.trim()!==''
    }

    showErrorModal=(data?: {errors:string[]})=>{
        const {title,text} = this.errorService.getErrorInfo(data)
        Alert.alert(
            title,
            text,
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }

    usuarioAgregado=()=>{
        this.setState({creando:false});
        Alert.alert(
            "Correcto!",
            "Usuario agregado correctamente",
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }
    
    usuarioEditado=()=>{
        this.setState({creando:false});
        Alert.alert(
            "Correcto!",
            "Usuario modificado correctamente",
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }

    usuarioEliminado=()=>{
        this.setState({creando:false});
        Alert.alert(
            "Correcto!",
            "Usuario eliminado correctamente",
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }

    onRefresh=()=>{
        this.setState({refreshing:true, usuarios:[]});
        this.initUsuarios().finally(()=>this.setState({refreshing:false}));
    }

    render(){
        return (
            <View style={{flex:1}}>
                <ScrollView style={{width:'100%'}} contentContainerStyle={[styles.container]}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                >

                    <View>
                        <Dialog.Container visible={this.state.creando}>
                        <Dialog.Title>Creando usuario</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.visibleAdd}>
                        <Dialog.Title>Agregar usuario</Dialog.Title>
                        <Dialog.Input value={this.state.nombreAdd}
                        onChangeText={(p)=>{this.setState({nombreAdd:p});}}
                        placeholder={'Nombre'}></Dialog.Input>
                        <Dialog.Input value={this.state.usernameAdd}
                        onChangeText={(p)=>{this.setState({usernameAdd:p});}}
                        placeholder={'Usuario'}></Dialog.Input>
                        <Dialog.Button onPress={this.closeDialog} label="Cancelar" />
                        <Dialog.Button style={!this.isAddValid()?{color:'black'}:{}}
                        disabled={!this.isAddValid()} onPress={this.agregarUsuario} label="Agregar" />
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.editando}>
                        <Dialog.Title>Modificando usuario</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.visibleEdit}>
                        <Dialog.Title>Modificar usuario</Dialog.Title>
                        <Dialog.Input value={this.state.nombreAdd}
                        onChangeText={(p)=>{this.setState({nombreAdd:p});}}
                        placeholder={'Nombre'}></Dialog.Input>
                        <Dialog.Input value={this.state.usernameAdd}
                        onChangeText={(p)=>{this.setState({usernameAdd:p});}}
                        placeholder={'Usuario'}></Dialog.Input>
                        <Dialog.Button onPress={this.closeDialogEdit} label="Cancelar" />
                        <Dialog.Button onPress={this.eliminarUsuario} label="Eliminar" />
                        <Dialog.Button style={!this.isAddValid()?{color:'black'}:{}}
                        disabled={!this.isAddValid()} onPress={this.editarUsuarioPost} label="Modificar" />
                        </Dialog.Container>
                    </View>

                    <Text style={{fontWeight:'bold',fontSize:30}}>Usuarios ({this.state.usuarios.length})</Text>
                    {
                        this.state.consultando?
                        <ActivityIndicator size="large" color="#000000" />
                        :<TouchableOpacity onPress={this.openDialog}>
                            <AntDesign name="pluscircle" size={28} color="black" />
                        </TouchableOpacity>
                    }
                    
                    
                    {
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row flexArr={this.state.flexRows} data={this.state.tableHead} style={styles.table_head} textStyle={styles.table_text}/>
                            {
                                this.state.usuarios.map((t,i)=>
                                    <Row key={i} data={[
                                        t.nombre,
                                        t.username,
                                        <TouchableOpacity onPress={()=>this.editarUsuario(t)} style={{width:'100%',alignItems:'center'}}>
                                            <FontAwesome5 name="edit" size={24} color="black" />
                                        </TouchableOpacity>
                                    ]} flexArr={this.state.flexRows} textStyle={styles.table_text}/>
                                )
                            }
                            </Table>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        minHeight:'100%'
    },
    button_container:{
        width:'90%',
        minHeight:120,
        marginTop:30,
        borderWidth: 3,
        justifyContent:'center'
    },
    circular_border:{
        borderRadius:25,
    },
    full_size:{
        width:'100%',
        justifyContent:'center'
    },
    text_button:{
        width:'100%',
        textAlign:'center',
        textAlignVertical:'bottom',
        fontWeight:'bold',
        fontSize:20,
    },
    table:{
        width:'90%',
        marginTop:25,
        marginBottom:20
    },
    table_head:{
        height: 40,
        backgroundColor: '#f1f8ff' 
    },
    table_text:{
        margin:6
    }
  });

