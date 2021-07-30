import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TorneosScreen } from './torneos';
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
                />

                <Stack.Screen name="crearTorneo" 
                component={CreateTorneoScreen}
                options={{ title:'Crear torneo' }}
                />
                
            </Stack.Navigator>
        );
    }
}
