import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { resolve } from "inversify-react";
import { Row } from 'react-native-table-component';
import { TorneoService } from "../../services/Torneo/TorneoService";
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import { globalStyles, pickerStyles } from "../styles";
import { environment } from "../../../environment";
import { StatusCodes } from "../../enums/statusCodes.enum";
import DraggableFlatList, {
    RenderItemParams,
  } from "react-native-draggable-flatlist";
import { AutocompleteInput } from "react-native-autocomplete-input";
import { PredictiveInput } from "../common/predictiveInput";

interface Props {
    navigation: any
}

interface Jugador{
    id:string,
    nombre:string,
    puntaje:number
}

interface TorneoState{
    jugadores:Jugador[];
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
    nombres: string[];
}


export class CreateTorneoScreen extends React.Component<Props,TorneoState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    private _unsubscribe :any;

    constructor(props:any){
        super(props);
        this.state = {
            jugadores:[],
            flexRows:[0.5,0.5,3,1,0.5],
            tableHead: ['','#','Nombre', 'Puntaje',''],
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
            creando:false,
            nombres:[]
        }
        
    }


    componentDidMount = () => {
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {

        })
        this.initNombres()
    }


    componentWillUnmount() {
        this._unsubscribe();
    }

    initNombres(){
        this.torneoService.getNombres().then(({data})=>{
            this.setState({nombres:data})
        })
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

    resetJugadoresId(jugadores:Jugador[]){
        return jugadores.map((v,i)=>({id:(i+1).toString(),nombre:v.nombre,puntaje:v.puntaje}))
    }

    agregarJugador=()=>{
        try{
            let newJ = [...this.state.jugadores,{id:'',nombre:this.state.nombreAdd.trim(),puntaje:parseInt(this.state.puntajeAdd.trim())}];
            newJ = newJ.sort((a,b)=>{
                if(a.puntaje<b.puntaje){
                    return 1
                }else if(a.puntaje>b.puntaje){
                    return -1
                }
                return 0
            })
            newJ = this.resetJugadoresId(newJ)
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

    quitarJugador=(id:string)=>{
        try{
            const newJ = this.state.jugadores.filter(j=>j.id!==id);
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
            this.torneoService.crearTorneo(this.state.jugadores.map(j=>({nombre:j.nombre,puntaje:j.puntaje})),this.state.nivel,parseInt(this.state.rondas.trim()))
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

    renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
        return (
          <Row key={item.key} data={[
            <TouchableOpacity disabled={isActive} onPressIn={drag}>
                <MaterialIcons name="drag-handle" size={24} color="black" />
            </TouchableOpacity>,
            item.id,
            item.nombre,
            item.puntaje,
            <TouchableOpacity onPress={()=>this.quitarJugador(item.id)} style={{width:'100%',alignItems:'center'}}>
            <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
        ]} flexArr={this.state.flexRows} style={{elevation: isActive?1:0}} textStyle={styles.table_text}/>
        );
      };
    
    filterData = ()=>{
        return this.state.nombres.filter(n=>n.toLowerCase().includes(this.state.nombreAdd.toLocaleLowerCase())).slice(0,3).map(n=>({value:n,display:n}))
    }

    render(){
        return (
            <View style={{flex:1}}>
                <ScrollView style={{width:'100%'}} contentContainerStyle={[styles.container]} keyboardShouldPersistTaps='always'>

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

                            <View style={styles.autocompleteContainer}>
                                <PredictiveInput
                                    placeHolder="Nombre"
                                    data={this.filterData()}
                                    value={this.state.nombreAdd}
                                    onChange={(text:string) => this.setState({ nombreAdd: text })}
                                    onPress={(text:string)=>{
                                        this.setState({ nombreAdd: text.toString() })
                                    }}
                                ></PredictiveInput>
                            </View>

                            <TextInput value={this.state.puntajeAdd}
                            onChangeText={(p)=>{this.setState({puntajeAdd:p.split('.')[0]});}}
                            keyboardType={'number-pad'}
                            placeholder="Puntaje" style={[globalStyles.textInput]}></TextInput>
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
                            <Row flexArr={this.state.flexRows} data={this.state.tableHead} style={styles.table_head} textStyle={styles.table_text}/>
                            <DraggableFlatList
                                data={this.state.jugadores}
                                onDragEnd={({ data }) => this.setState({jugadores:this.resetJugadoresId(data)})}
                                keyExtractor={(item) => item.id}
                                renderItem={this.renderItem}
                                />
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
    },

      itemText: {
        fontSize: 15,
        margin: 2,
      },
      descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 8,
      },
      infoText: {
        textAlign: 'center',
      },
      autocompleteContainer: {
          height:80,
          zIndex:50
      },
  });

