import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TorneosScreen } from './torneos';
import { JugadoresScreen } from './torneo/jugadores';
import TorneoNavigator from './torneo/tabNavigator';
import { CreateTorneoScreen } from './createTorneo';

const Stack = createStackNavigator();

interface Props {
    navigation: any
}

export default class TorneosNavigator extends React.Component<Props>{

    

    render(){
        return (
            <Stack.Navigator initialRouteName={"main"}>
                <Stack.Screen name="main" 
                component={TorneosScreen}
                options={{ headerShown: false }}/>

                <Stack.Screen name="jugadores" 
                component={TorneoNavigator}
                options={{ title:'Fin de ciclo' }}
                />

                <Stack.Screen name="crearTorneo" 
                component={CreateTorneoScreen}
                options={{ title:'Crear torneo' }}
                />
                
            </Stack.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });