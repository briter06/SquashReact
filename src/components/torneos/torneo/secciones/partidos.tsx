import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image, ImageBackground, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { TorneoService } from "../../../../services/Torneo/TorneoService";
import { resolve } from "inversify-react";
import { AuthService } from "../../../../services/Auth/AuthService";
import Dialog from "react-native-dialog";
import { globalStyles, pickerStyles } from "../../../styles";
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons'; 
import ImgViewer from "../../../imgViewer";

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
    TorneoId:number,
    nombre_jugador1:string,
    nombre_jugador2:string,
    partido1:number,
    partido2:number,
}

interface PartidosState{
    partidos:Array<Partido>;
    refreshing:boolean,
    processing:boolean,
    allowed:boolean,
    visibleEdit:boolean,
    currentPartido:Partido,
    currentSelection?:number,
    guardando:boolean,
    subiendo: boolean,
    image?:string,
    imgRequest:boolean,
    imgViewerVisible:boolean
}


export class PartidosScreen extends React.Component<Props,PartidosState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    @resolve(AuthService)
    private authService!:AuthService;

    private _unsubscribe :any;

    private cupImg:any = require('../../../../../assets/images/cup.png');

    constructor(props:any){
        super(props);
        this.state = {
            partidos:[],
            refreshing:false,
            processing:false,
            allowed:false,
            visibleEdit:false,
            currentPartido:this.getBasicPartido(),
            guardando:false,
            subiendo:false,
            imgRequest:false,
            imgViewerVisible:false
        }
        
    }

    getBasicPartido(){
        return {id:0,seccion:0,jugador1:0,jugador2:0,ganador:0,TorneoId:0,nombre_jugador1:'',nombre_jugador2:'',partido1:0,partido2:0}
    }

    componentDidMount = () => {
        this.setState({allowed:this.authService.isAuthorized(['Profesor','Admin'])});
        this._unsubscribe  = this.props.navigation.addListener('focus',
        () => {
            this.initPartidos();
        })
        this.initImage();
    }

    initImage = ()=>{
        this.torneoService.getImage(this.props.id_torneo)
        .then(({data})=>{
            this.setState({image:data,imgRequest:true});
        });
    }

    initPartidos(){
        this.setState({processing:true});
        return this.torneoService.getPartidos(this.props.id_torneo,this.props.seccion)
        .then(({data})=>{
            this.setState({processing:false});
            this.setState({partidos:data});
        });
    }

    editPartido=()=>{
        if(this.state.currentSelection){
            this.setState({guardando:true});
            this.closeDialog();
            this.torneoService.updateGanador({
                id:this.state.currentPartido.id,
                seccion:this.state.currentPartido.seccion,
                TorneoId:this.state.currentPartido.TorneoId,
                ganador:this.state.currentPartido.ganador,
            },this.state.currentSelection)
            .then(({data}:{data:{status:number}})=>{
                this.initPartidos().finally(()=>{
                    this.setState({guardando:false});
                });
            }).catch(err=>{
                this.setState({guardando:false});
                Alert.alert(
                    "Error",
                    "Error guardando el ganador",
                    [
                      { text: "OK", onPress: () => {}}
                    ]
                  );
            });
        }
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRefresh=()=>{
        this.setState({refreshing:true});
        this.initPartidos().finally(()=>this.setState({refreshing:false}));
        this.initImage();
    }

    openDialog=(p:Partido)=>{
        if(p.jugador1!=0 && p.jugador2!=0 && p.jugador1!=-1 && p.jugador2!=-1){
            if(p.ganador!=0 && p.ganador!=-1){
                this.setState({currentPartido:p, visibleEdit:true,currentSelection:p.ganador});
            }else{
                this.setState({currentPartido:p, visibleEdit:true,currentSelection:p.jugador1});
            }
        }
    }

    closeDialog=()=>{
        this.setState({currentPartido:this.getBasicPartido(),visibleEdit:false,currentSelection:undefined});
    }

    esGanador=(partido:Partido,jugador:number)=>{
        if(partido.ganador!=0 && jugador===partido.ganador){
            return {color:'green'};
        }
        return {color:'black'};
    }

    getJugadoresSelect(){
        const p = this.state.currentPartido;
        const options = [];
        if(p.jugador1!=-1)options.push({label:p.nombre_jugador1,value:''+p.jugador1});
        if(p.jugador2!=-1)options.push({label:p.nombre_jugador2,value:''+p.jugador2});
        return options;
    }

    takePicture = async ()=>{
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            //   aspect: [4, 3],
        });
        this.processResultImage(result);
    }

    selectPicture = async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            //   aspect: [4, 3],
        });
        this.processResultImage(result);
    }


    processResultImage = (result:any) => {
        if (result.cancelled) {
          return;
        }
        
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename||'');
        let type = match ? `image/${match[1]}` : `image`;
      
        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type } as any);
        this.setState({subiendo:true});
        this.torneoService.uploadImage(formData,this.props.id_torneo)
        .then(({data})=>{
            this.setState({subiendo:false});
            if(data.status===1){
                Alert.alert(
                    "Correcto!",
                    "Imagen subida correctamente",
                    [
                      { text: "OK", onPress: () => {}}
                    ]
                  );
            }else{
                Alert.alert(
                    "Error!",
                    "Ha ocurrido un error. Vuelva a intentar!",
                    [
                      { text: "OK", onPress: () => {}}
                    ]
                  );
            }
        }).catch((err)=>{
            this.setState({subiendo:false});
            Alert.alert(
                "Error!",
                "Ha ocurrido un error. Vuelva a intentar!",
                [
                  { text: "OK", onPress: () => {}}
                ]
              );
        });
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
                    <View>
                        <Dialog.Container visible={this.state.guardando}>
                        <Dialog.Title>Actualizando ganador</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>
                    <View>
                        <Dialog.Container visible={this.state.subiendo}>
                        <Dialog.Title>Subiendo imagen</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>
                    <View>
                        <Dialog.Container visible={this.state.visibleEdit}>
                        <Dialog.Title>Elegir ganador</Dialog.Title>
                        <View style={[globalStyles.select,{width:'100%'}]}>
                            <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                style={pickerStyles}
                                value={this.state.currentSelection}
                                placeholder={{  }}
                                onValueChange={(value) => this.setState({currentSelection:value})}
                                items={this.getJugadoresSelect()}
                            />
                        </View>
                        <Dialog.Button onPress={this.closeDialog} label="Cancelar" />
                        <Dialog.Button onPress={this.editPartido} label="Guardar" />
                        </Dialog.Container>
                    </View>

                    {
                        this.state.processing ?
                        <ActivityIndicator size="large" color="#000000" />: 
                        <View style={styles.partidos_container}>
                            {
                                this.state.partidos.map((t,i)=>
                                    <View key={i} style={[styles.button_container,styles.circular_border,t.ganador!=0?{borderColor:'green'}:{}]}>
                                        <TouchableOpacity style={[styles.full_size,styles.circular_border]}
                                        onPress={() => this.state.allowed?this.openDialog(t):{}}>
                                            <Text style={[styles.text_button, this.esGanador(t,t.jugador1)]}>{t.nombre_jugador1}</Text>
                                            <Text style={[styles.text_button]}>VS</Text>
                                            <Text style={[styles.text_button, this.esGanador(t,t.jugador2)]}>{t.nombre_jugador2}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                            {
                                this.props.seccion==1 && this.state.partidos.length!==0? 
                                    
                                    <View style={{width:'100%',marginVertical:20}}>
                                    
                                    {
                                        this.state.allowed ? 
                                        <View style={{flexDirection:'row'}}>
                                            <TouchableOpacity style={styles.imageIcon}
                                            onPress={this.takePicture}>
                                                <FontAwesome name="camera" size={30} color="black" />
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.imageIcon}
                                            onPress={this.selectPicture}>
                                                <Foundation name="photo" size={30} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                        :<Text></Text>
                                    }

                                    {
                                        this.state.image?
                                        <View>
                                            <TouchableOpacity
                                            onPress={()=>this.setState({imgViewerVisible:true})}>
                                                <Image
                                                style={styles.image}
                                                source={{uri:this.state.image}}
                                                />
                                            </TouchableOpacity>
                                            <ImgViewer
                                            image={this.state.image}
                                            visible={this.state.imgViewerVisible}
                                            close={()=>this.setState({imgViewerVisible:false})} />
                                        </View>
                                        : 
                                        !this.state.imgRequest ? 
                                        <ActivityIndicator size="large" color="#000000" />
                                        :<Text></Text>
                                    }
                                    
                                    </View>
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
        marginTop:10,
        height:300,
        resizeMode: 'contain'
    },
    imageIcon:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
  });