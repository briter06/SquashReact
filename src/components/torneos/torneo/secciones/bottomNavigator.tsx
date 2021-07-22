import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createMaterialBottomTabNavigator();

interface Props {
    navigation: any,
    id_torneo:any
}

export default class TorneoSeccionesNavigator extends React.Component<Props>{




    render(){
        return (
            <Tab.Navigator initialRouteName={"octavos"}>

                <Tab.Screen
                    name="octavos"
                    children={()=><Text>Octavos</Text>}
                    options={{
                    tabBarLabel: 'Octavos',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="bowling-ball" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="cuartos"
                    children={()=><Text>Cuartos</Text>}
                    options={{
                    tabBarLabel: 'Cuartos',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="sports-tennis" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="semi"
                    children={()=><Text>Semi</Text>}
                    options={{
                    tabBarLabel: 'Semi',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="tournament" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="final"
                    children={()=><Text>Final</Text>}
                    options={{
                    tabBarLabel: 'Final',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="medal" size={24} color="black" />
                    ),
                    }}
                />

                
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });