import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import { TorneoService } from "../../../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";
import { Table, Row, Rows } from 'react-native-table-component';

interface Props {
    navigation: any;
    id_torneo:any;
    seccion:number;
    title:string;
}

interface Partido{
    id:number,
    seccion:number,
    jugador1:number,
    jugador2:number,
    ganador:number,
    createdAt:Date,
    updatedAt:Date,
    TorneoId:number,
    nombre_jugador1:string,
    nombre_jugador2:string
}

interface PartidosState{
    partidos:Array<Partido>;
    refreshing:boolean,
    processing:boolean,
}


export class PartidosScreen extends React.Component<Props,PartidosState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    private _unsubscribe :any;

    private cupImg:any = require('../../../../../assets/images/cup.png');

    constructor(props:any){
        super(props);
        this.state = {
            partidos:[],
            refreshing:false,
            processing:false
        }
        
    }

    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initPartidos();
        })
    }

    initPartidos(){
        this.setState({processing:true});
        return this.torneoService.getPartidos(this.props.id_torneo,this.props.seccion)
        .then(({data})=>{
            this.setState({processing:false});
            this.setState({partidos:data});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRefresh=()=>{
        this.setState({refreshing:true});
        this.initPartidos().finally(()=>this.setState({refreshing:false}));
    }

    esGanador=(partido:Partido,jugador:number)=>{
        if(partido.ganador!=0 && jugador===partido.ganador){
            return {color:'green'};
        }
        return {};
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

                    <Text style={{fontWeight:'bold',fontSize:40}}>{this.props.title}</Text>

                    {
                        this.state.processing ?
                        <ActivityIndicator size="large" color="#000000" />: 
                        // this.state.jugadores.map((j,i)=>
                        //     <View key={i}>
                        //         <Text>{j.nombre}</Text>
                        //     </View>
                        // )
                        <View style={styles.partidos_container}>
                            {
                                this.state.partidos.map((t,i)=>
                                    // <Text key={i}>{t.id}</Text>
                                    <View key={i} style={[styles.button_container,styles.circular_border,t.ganador!=0?{borderColor:'green'}:{}]}>
                                        <TouchableOpacity style={[styles.full_size,styles.circular_border]}
                                        onPress={() => {}}>
                                            <Text style={[styles.text_button, this.esGanador(t,t.jugador1)]}>{t.nombre_jugador1}</Text>
                                            <Text style={[styles.text_button]}>VS</Text>
                                            <Text style={[styles.text_button, this.esGanador(t,t.jugador2)]}>{t.nombre_jugador2}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                            {
                                this.props.seccion==1 && this.state.partidos.length!==0? 
                                    <Image
                                        style={styles.image}
                                        source={this.cupImg}
                                    />
                                : <View/>
                            }
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
    partidos_container:{
        width:'100%',
        alignItems:'center',
        // marginTop:5,
        marginBottom:20
    },
    table_head:{
        height: 40,
        backgroundColor: '#f1f8ff' 
    },
    table_text:{
        margin:6
    },
    image:{
        marginTop:15,
        height:250,
        resizeMode:'center'
    }
  });