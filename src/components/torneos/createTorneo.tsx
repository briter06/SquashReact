import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { resolve } from "inversify-react";
import { Table, Row, Rows } from 'react-native-table-component';
import { TorneoService } from "../../services/Torneo/TorneoService";
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import { globalStyles, pickerStyles } from "../styles";
import { environment } from "../../../environment";
import { StatusCodes } from "../../enums/statusCodes.enum";

interface Props {
    navigation: any
}

interface TorneoState{
    jugadores:Array<{nombre:string,puntaje:number}>;
    flexRows:Array<number>;
    tableHead:Array<string>;
    niveles:Array<any>;
    nivel:string;
    rondas:string;
    rondasList:Array<any>;
    visibleAdd:boolean;
    nombreAdd:string;
    puntajeAdd:string;
    creando:boolean;
}


export class CreateTorneoScreen extends React.Component<Props,TorneoState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    private _unsubscribe :any;

    constructor(props:any){
        super(props);
        this.state = {
            jugadores:[],
            flexRows:[3,1,1],
            tableHead: ['Nombre', 'Puntaje','Borrar'],
            niveles : [
                {label:'Avanzados',value:'Avanzados'},
                {label:'Intermedios',value:'Intermedios'},
                {label:'Básicos',value:'Básicos'}
            ],
            nivel:'Avanzados',
            rondas:'1',
            rondasList:[
                {label:'1',value:'1'}
            ],
            visibleAdd:false,
            nombreAdd:'',
            puntajeAdd:'',
            creando:false
        }
        
    }


    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {

        })
    }


    componentWillUnmount() {
        this._unsubscribe();
    }

    openDialog=()=>{
        this.setState({visibleAdd:true});
    }

    closeDialog=()=>{
        this.setState({visibleAdd:false,nombreAdd:'',puntajeAdd:''});
    }

    updateRondas(jugadores:Array<any>){
        const maxRondas = Math.min(Math.ceil(Math.log(jugadores.length)/Math.log(2)),environment.MAX_ROUNDS);
        let rondas:any = [
            {label:'1',value:'1'}
        ];
        for(let z = 2;z<=maxRondas;z++){
            rondas.push({label:''+z,value:''+z});
        }
        return {rondas,maxRondas}
    }

    agregarJugador=()=>{
        try{
            const newJ = [...this.state.jugadores,{nombre:this.state.nombreAdd.trim(),puntaje:parseInt(this.state.puntajeAdd.trim())}];
            const {rondas,maxRondas} = this.updateRondas(newJ);
            this.setState({
                jugadores:newJ,
                visibleAdd:false,
                nombreAdd:'',
                puntajeAdd:'',
                rondasList:rondas,
                rondas:''+maxRondas
            });
        }catch(err){
            Alert.alert(
                "Error",
                "Error agregando jugador",
                [
                  { text: "OK", onPress: () => {}}
                ]
              );
        }
    }

    quitarJugador=(index:number)=>{
        try{
            const newJ = this.state.jugadores;
            newJ.splice(index,1);
            const {rondas,maxRondas} = this.updateRondas(newJ);
            this.setState({
                jugadores:newJ,
                visibleAdd:false,
                nombreAdd:'',
                puntajeAdd:'',
                rondasList:rondas,
                rondas:''+maxRondas
            });
        }catch(err){
            Alert.alert(
                "Error",
                "Error quitando jugador",
                [
                  { text: "OK", onPress: () => {}}
                ]
              );
        }
    }

    isAddValid = ()=>{
        return this.state.nombreAdd.trim()!=='' && this.state.puntajeAdd.trim()!==''
    }

    valid = ()=>{
        return this.state.jugadores.length>=2;
    }

    errorCreando=()=>{
        this.setState({creando:false});
        Alert.alert(
            "Error",
            "Error creando torneo",
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }
    
    crearTorneo = ()=>{
        try{
            this.setState({creando:true});
            this.torneoService.crearTorneo(this.state.jugadores,this.state.nivel,parseInt(this.state.rondas.trim()))
            .then(({data}:{data:{data?:{status:number}}})=>{
                if(data.data?.status===StatusCodes.SUCCESS){
                    this.setState({creando:false});
                    this.props.navigation.pop();
                }else{
                    this.errorCreando();
                }
            }).catch((err)=>this.errorCreando());
        }catch(err){
            this.errorCreando();
        }
    }

    render(){
        return (
            <View style={{flex:1}}>
                <ScrollView style={{width:'100%'}} contentContainerStyle={[styles.container]}>

                    <Text style={{fontWeight:'bold',fontSize:25}}>Nivel</Text>

                    <View style={globalStyles.select}>
                    <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyles}
                        value={this.state.nivel}
                        placeholder={{  }}
                        onValueChange={(value) => this.setState({nivel:value})}
                        items={this.state.niveles}
                    />
                    </View>

                    <Text style={{fontWeight:'bold',fontSize:25}}>Rondas</Text>

                    <View style={globalStyles.select}>
                    <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyles}
                        value={this.state.rondas}
                        placeholder={{  }}
                        onValueChange={(value) => this.setState({rondas:value})}
                        items={this.state.rondasList}
                    />
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.creando}>
                        <Dialog.Title>Creando torneo</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.visibleAdd}>
                        <Dialog.Title>Agregar jugador</Dialog.Title>
                        <Dialog.Input value={this.state.nombreAdd}
                        onChangeText={(p)=>{this.setState({nombreAdd:p});}}
                        placeholder={'Nombre del jugador'}></Dialog.Input>
                        <Dialog.Input value={this.state.puntajeAdd}
                        onChangeText={(p)=>{this.setState({puntajeAdd:p.split('.')[0]});}}
                        placeholder={'Puntaje'} keyboardType={'number-pad'}></Dialog.Input>
                        <Dialog.Button onPress={this.closeDialog} label="Cancelar" />
                        <Dialog.Button style={!this.isAddValid()?{color:'black'}:{}}
                        disabled={!this.isAddValid()} onPress={this.agregarJugador} label="Agregar" />
                        </Dialog.Container>
                    </View>

                    <Text style={{fontWeight:'bold',fontSize:30}}>Jugadores ({this.state.jugadores.length})</Text>
                    <TouchableOpacity onPress={this.openDialog}>
                        <AntDesign name="pluscircle" size={28} color="black" />
                    </TouchableOpacity>
                    
                    {
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row flexArr={this.state.flexRows} data={this.state.tableHead} style={styles.table_head} textStyle={styles.table_text}/>
                            {
                                this.state.jugadores.map((t,i)=>
                                    <Row key={i} data={[
                                        t.nombre,
                                        t.puntaje,
                                        <TouchableOpacity onPress={()=>this.quitarJugador(i)} style={{width:'100%',alignItems:'center'}}>
                                            <MaterialIcons name="delete" size={24} color="black" />
                                        </TouchableOpacity>
                                    ]} flexArr={this.state.flexRows} textStyle={styles.table_text}/>
                                )
                            }
                            </Table>
                        </View>
                    }
                    <TouchableOpacity disabled={!this.valid()}
                    style={[this.valid()?globalStyles.button:globalStyles.button_disabled]} onPress={this.crearTorneo}>
                        <Text style={globalStyles.buttonText}>Crear torneo</Text>
                    </TouchableOpacity>
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

