import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import { TorneoService } from "../../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";
import { Table, Row, Rows } from 'react-native-table-component';
import Dialog from "react-native-dialog";
import { StatusCodes } from "../../../enums/statusCodes.enum";
import { PredictiveInput } from "../../common/predictiveInput";

interface Props {
    navigation: any,
    id_torneo:any,
}

interface Jugador{
    id:number,
    nombre:string,
    puntaje:number,
    posicion:number
}

interface JugadoresState{
    jugadores:Jugador[];
    refreshing:boolean,
    processing:boolean,
    flexRows:number[],
    tableHead:any,
    editando: boolean,
    visibleAdd: boolean,
    nombreEdit: string,
    jugadorEdit?:Jugador,
    nombres: string[]
}


export class JugadoresScreen extends React.Component<Props,JugadoresState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    private _unsubscribe :any;

    constructor(props:any){
        super(props);
        this.state = {
            jugadores:[],
            refreshing:false,
            processing:false,
            flexRows:[1,2,1,0.5],
            tableHead: ['Ranking', 'Nombre', 'Puntaje',''],
            visibleAdd: false,
            nombreEdit:'',
            editando:false,
            nombres: []
        }
        
    }

    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initJugadores();
        })
        this.initNombres()
    }

    initJugadores(){
        this.setState({processing:true});
        this.setState({jugadores:[]});
        return this.torneoService.getJugadores(this.props.id_torneo)
        .then(({data})=>{
            this.setState({processing:false});
            this.setState({jugadores:data});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRefresh=()=>{
        this.setState({refreshing:true});
        this.initJugadores().finally(()=>this.setState({refreshing:false}));
    }

    openDialog=(jugador:Jugador)=>{
        this.setState({visibleAdd:true,jugadorEdit:jugador,nombreEdit:jugador.nombre});
    }

    closeDialog=()=>{
        this.setState({visibleAdd:false,nombreEdit:'',jugadorEdit:undefined});
    }

    isAddValid = ()=>{
        return this.state.nombreEdit.trim()!==''
    }

    errorEditando=()=>{
        this.setState({editando:false});
        Alert.alert(
            "Error",
            "Error editando jugador",
            [
              { text: "OK", onPress: () => {}}
            ]
          );
    }

    editarJugador=()=>{
        try{
            if(this.state.jugadorEdit){
                this.setState({editando:true});
                this.torneoService.editarJugador(this.props.id_torneo,this.state.jugadorEdit.id,this.state.nombreEdit)
                .then(({data}:{data:{data?:{status:number}}})=>{
                    if(data.data?.status===StatusCodes.SUCCESS){
                        this.setState({editando:false, visibleAdd:false});
                        this.initJugadores()
                    }else{
                        this.errorEditando();
                    }
                }).catch((err)=>this.errorEditando());
            }
        }catch(err){
            console.log(err)
            Alert.alert(
                "Error",
                "Error agregando jugador",
                [
                  { text: "OK", onPress: () => {}}
                ]
              );
        }
    }

    initNombres(){
        this.torneoService.getNombres().then(({data})=>{
            this.setState({nombres:data})
        })
    }

    filterData = ()=>{
        return this.state.nombres.filter(n=>n.toLowerCase().includes(this.state.nombreEdit.toLocaleLowerCase())).slice(0,3).map(n=>({value:n,display:n}))
    }


    render(){
        return (
            <View style={{flex:1}}>
                <ScrollView style={{width:'100%'}} contentContainerStyle={[styles.container]}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }>

                    <Text style={{fontWeight:'bold',fontSize:40}}>Jugadores</Text>


                    <View>
                        <Dialog.Container visible={this.state.editando}>
                        <Dialog.Title>Editando jugador</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.visibleAdd}>
                        <Dialog.Title>Editar jugador</Dialog.Title>

                        <View style={styles.autocompleteContainer}>
                            <PredictiveInput
                                placeHolder="Nombre"
                                data={this.filterData()}
                                value={this.state.nombreEdit}
                                onChange={(text:string) => this.setState({ nombreEdit: text })}
                                onPress={(text:string)=>{
                                    this.setState({ nombreEdit: text.toString() })
                                }}
                                startValue= {true}
                            ></PredictiveInput>
                        </View>

                        <Dialog.Button onPress={this.closeDialog} label="Cancelar" />
                        <Dialog.Button style={!this.isAddValid()?{color:'black'}:{}}
                        disabled={!this.isAddValid()} onPress={this.editarJugador} label="Editar" />
                        </Dialog.Container>
                    </View>

                    {
                        this.state.processing ?
                        <ActivityIndicator size="large" color="#000000" />:
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row flexArr={this.state.flexRows} data={this.state.tableHead} style={styles.table_head} textStyle={styles.table_text}/>
                            {
                                this.state.jugadores.map((t,i)=>
                                    <Row key={i} data={[t.posicion,t.nombre,t.puntaje,<Feather onPress={()=>this.openDialog(t)} name="edit" size={24} color="black" />]} flexArr={this.state.flexRows} textStyle={styles.table_text}/>
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
    },
    autocompleteContainer: {
        height:80,
        zIndex:50
    },
  });