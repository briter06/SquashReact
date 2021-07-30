import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { JugadoresScreen } from './jugadores';
import TorneoSeccionesNavigator from './secciones/bottomNavigator';
import { StackActions } from '@react-navigation/native';
import { TorneoService } from '../../../services/Torneo/TorneoService';
import { AuthService } from '../../../services/Auth/AuthService';
import { resolve } from 'inversify-react';
import { FontAwesome5 } from '@expo/vector-icons';
import Menu, { MenuItem } from 'react-native-material-menu';
import Dialog from "react-native-dialog";

const Tab = createMaterialTopTabNavigator();

interface Props {
    navigation: any;
    route:any;
}

export default class TorneoNavigator extends React.Component<Props>{


    @resolve(TorneoService)
    private torneoService!:TorneoService;

    @resolve(AuthService)
    private authService!:AuthService;
    
    private _unsubscribe :any;
    private _unsubscribeRemove :any;

    private _menu:any = null;


    setMenuRef = (ref:any) => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    eliminarTorneoDialog = ()=>{
        this.hideMenu();
        Alert.alert(
            "Eliminar Torneo",
            "¿Desea Eliminar este torneo?",
            [
              { text: "No", onPress: () => {}},
              { text: "Si", onPress: () => this.eliminarTorneo()}
            ]
          );
    }

    eliminarTorneo = ()=>{
        this.setState({eliminando:true});
        this.torneoService.eliminarTorneo(this.props.route.params.id).then(()=>{
            this.setState({eliminando:false});
            this.props.navigation.pop();
        });
    }

    state = {
        allowed:false,
        eliminando:false
    }

    constructor(props:any){
        super(props);
        
    }

    updateNav=()=>{
        this.props.navigation.setOptions({ title:'Fin de ciclo',
        headerRight: () => (
            <View>
            {this.state.allowed?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Menu
                    ref={this.setMenuRef}
                    button={<FontAwesome5 onPress={this.showMenu} name="ellipsis-v" size={26} color="black" />}
                    >
                    <MenuItem onPress={this.eliminarTorneoDialog}>Eliminar Torneo</MenuItem>
                    </Menu>
                </View>:<View></View>
            }
            </View>
        ),
        headerRightContainerStyle:{
            right:30
        } });
    }

    componentDidMount = () => {
        this.setState({allowed:this.authService.isAuthorized(['Profesor','Admin'])});
        this.updateNav();
        this._unsubscribeRemove  = this.props.navigation.addListener('beforeRemove',
        (event:any) => {
            this._unsubscribe();
        })
        this._unsubscribe  = this.props.navigation.addListener('blur',
        (event:any) => {
            this.props.navigation.popToTop();
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
        this._unsubscribeRemove();
    }

    render(){
        return (
            <Tab.Navigator initialRouteName={"jugadores"}>


                <Tab.Screen name="jugadores" 
                children={({navigation})=>
                !this.state.eliminando?
                    <JugadoresScreen id_torneo={this.props.route.params.id} navigation={navigation}/>
                    :
                    <View>
                        <Dialog.Container visible={this.state.eliminando}>
                        <Dialog.Title>Eliminando torneo</Dialog.Title>
                        <ActivityIndicator size="large" color="#000000" />
                        </Dialog.Container>
                    </View>
                }
                options={{ title: 'Jugadores' }}/>

                <Tab.Screen name="torneo" 
                children={({navigation})=>
                <TorneoSeccionesNavigator id_torneo={this.props.route.params.id} navigation={navigation}/>
                }
                options={{ title: 'Torneo' }}/>
                
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });