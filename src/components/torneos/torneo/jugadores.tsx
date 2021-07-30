import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import { TorneoService } from "../../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";
import { Table, Row, Rows } from 'react-native-table-component';

interface Props {
    navigation: any,
    id_torneo:any
}

interface JugadoresState{
    jugadores:Array<{id:number,nombre:string,puntaje:number,posicion:number}>;
    refreshing:boolean,
    processing:boolean,
    flexRows:number[],
    tableHead:any
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
            flexRows:[1,2,1],
            tableHead: ['Ranking', 'Nombre', 'Puntaje']
        }
        
    }

    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initJugadores();
        })
    }

    initJugadores(){
        this.setState({processing:true});
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

                    {
                        this.state.processing ?
                        <ActivityIndicator size="large" color="#000000" />: 
                        // this.state.jugadores.map((j,i)=>
                        //     <View key={i}>
                        //         <Text>{j.nombre}</Text>
                        //     </View>
                        // )
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row flexArr={this.state.flexRows} data={this.state.tableHead} style={styles.table_head} textStyle={styles.table_text}/>
                            {
                                this.state.jugadores.map((t,i)=>
                                    <Row key={i} data={[t.posicion,t.nombre,t.puntaje]} flexArr={this.state.flexRows} textStyle={styles.table_text}/>
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