import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { JugadoresScreen } from './jugadores';
import TorneoSeccionesNavigator from './secciones/bottomNavigator';
import { StackActions } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

interface Props {
    navigation: any;
    route:any;
}

export default class TorneoNavigator extends React.Component<Props>{

    
    private _unsubscribe :any;
    private _unsubscribeRemove :any;

    componentDidMount = () => {
        this._unsubscribeRemove  = this.props.navigation.addListener('beforeRemove',
        (event:any) => {
            this._unsubscribe();
        })
        this._unsubscribe  = this.props.navigation.addListener('blur',
        (event:any) => {
            // this.props.navigation.dispatch(
            //     StackActions.replace('main')
            // );
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
                <JugadoresScreen id_torneo={this.props.route.params.id} navigation={navigation}/>
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