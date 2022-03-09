import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import { TorneoService } from "../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";
import moment from 'moment';
import 'moment/locale/es'
import { FloatingAction } from "react-native-floating-action";
import { AuthService } from "../../services/Auth/AuthService";
import { Subscription } from "rxjs";

const actions = [
    {
      text: "Torneo",
      icon: require("../../../assets/images/cup_icon.png"),
      name: "bt_create_torneo",
      position: 2
    }
]

interface Props {
    navigation: any
}

interface TorneosState{
    torneos:Array<{id:number,fecha:Date,estado:string,ganador:number,nombre:string,nivel:string}>;
    refreshing:boolean,
    processing:boolean,
    allowed:boolean;
}

export class TorneosScreen extends React.Component<Props,TorneosState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    @resolve(AuthService)
    private authService!:AuthService;

    private _unsubscribe :any;
    private initUserSubscription : Subscription;

    constructor(props:any){
        super(props);
        this.state = {
            torneos:[],
            refreshing:false,
            processing:false,
            allowed:false
        }
        this.initUserSubscription = new Subscription();
    }

    componentDidMount = () => {
        this.setState({allowed:this.authService.isAuthorized(['Profesor','Admin'])});
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initTorneos();
        })
        this.initUserSubscription = this.authService.getUser$().subscribe(()=>{
            const allowed = this.authService.isAuthorized(['Profesor','Admin'])
            this.setState({allowed:allowed});
        });
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
        this.initUserSubscription.unsubscribe();
    }

    onRefresh=()=>{
        this.setState({refreshing:true});
        this.initTorneos().finally(()=>this.setState({refreshing:false}));
    }

    getNiceDate(date:Date){
        var localLocale = moment(date);
        moment.locale('es');
        return localLocale.format('LL'); 
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
                            <View key={i} style={[styles.button_container,styles.circular_border,styles.bowWithShadow,
                                t.estado!=='Finalizado'?{borderColor:'green'}:{}]}>
                                <TouchableOpacity style={[styles.full_size,styles.circular_border]}
                                onPress={() => this.props.navigation.navigate('jugadores',{id:t.id})}>
                                    <Text style={[styles.text_button]}>{this.getNiceDate(t.fecha)}</Text>
                                    <Text></Text>
                                    <Text style={[styles.text_button]}>{t.nivel}</Text>
                                    <Text></Text>
                                    <Divider/>
                                    {
                                        t.estado==='Finalizado'?
                                        (
                                            <View style={[styles.ganadorContainer]}>
                                                <Text style={[styles.text_button]}>Ganador:</Text>
                                                <Text style={[styles.text_button]}>{t.nombre}</Text>
                                            </View>
                                        ):
                                        <Text style={[styles.text_button]}>En curso...</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    {
                        this.state.allowed?
                        <FloatingAction
                            actions={actions}
                            onPressItem={name => {
                                if(name==='bt_create_torneo'){
                                    this.props.navigation.navigate('crearTorneo');
                                }
                            }}
                        />:<View></View>
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
    floating_button:{
        position:'absolute',
        bottom:20,
        right:20,
        zIndex:1000,
    },
    button_container:{
        width:'90%',
        padding: 10,
        minHeight:120,
        marginTop:30,
        justifyContent:'center',
        backgroundColor: 'white',
    },
    bowWithShadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    circular_border:{
        borderRadius:30,
    },
    ganadorContainer: {
        backgroundColor: 'rgba(0,230,0,0.3)',
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25,
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