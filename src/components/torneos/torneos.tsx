import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import { TorneoService } from "../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";

interface Props {
    navigation: any
}

interface TorneosState{
    torneos:Array<{id:number,fecha:Date,estado:string,ganador:string,nivel:string}>;
    refreshing:boolean,
    processing:boolean
}

const wait = (timeout:number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const cancha = require("../../../assets/images/cancha.jpg");

export class TorneosScreen extends React.Component<Props,TorneosState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    private _unsubscribe :any;

    constructor(props:any){
        super(props);
        this.state = {
            torneos:[],
            refreshing:false,
            processing:false
        }
    }

    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initTorneos();
        })
    }

    initTorneos(){
        this.setState({processing:true});
        return this.torneoService.getTorneos().then(({data})=>{
            this.setState({processing:false});
            this.setState({torneos:data});
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRefresh=()=>{
        this.setState({refreshing:true});
        this.initTorneos().finally(()=>this.setState({refreshing:false}));
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

                    <Text style={{fontWeight:'bold',fontSize:40}}>Torneos</Text>

                    {
                        this.state.processing ?
                        <ActivityIndicator size="large" color="#000000" />: 
                        this.state.torneos.map((t,i)=>
                            <View key={i} style={[styles.button_container,styles.circular_border,
                                t.estado!=='Finalizado'?{borderColor:'green'}:{}]}>
                                <TouchableOpacity style={[styles.full_size,styles.circular_border]}
                                onPress={() => this.props.navigation.navigate('jugadores',{id:t.id})}>
                                    <Text style={[styles.text_button]}>{t.fecha}</Text>
                                    <Text style={[styles.text_button]}>{t.nivel}</Text>
                                    <Divider/>
                                    {
                                        t.estado==='Finalizado'?
                                        <Text style={[styles.text_button]}>Ganador: {t.ganador}</Text>:
                                        <Text style={[styles.text_button]}>En curso...</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )
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
    }
  });