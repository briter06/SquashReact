import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PartidosScreen } from './partidos';

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
                    children={({navigation})=>
                        <PartidosScreen title={'Octavos'} navigation={navigation}
                        id_torneo={this.props.id_torneo} seccion={8}/>
                    }
                    options={{
                    tabBarLabel: 'Octavos',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="bowling-ball" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="cuartos"
                    children={({navigation})=>
                        <PartidosScreen title={'Cuartos'} navigation={navigation}
                        id_torneo={this.props.id_torneo} seccion={4}/>
                    }
                    options={{
                    tabBarLabel: 'Cuartos',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="sports-tennis" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="semi"
                    children={({navigation})=>
                        <PartidosScreen title={'Semifinales'} navigation={navigation}
                        id_torneo={this.props.id_torneo} seccion={2}/>
                    }
                    options={{
                    tabBarLabel: 'Semi',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="tournament" size={24} color="black" />
                    ),
                    }}
                />

                <Tab.Screen
                    name="final"
                    children={({navigation})=>
                        <PartidosScreen title={'Final'} navigation={navigation}
                        id_torneo={this.props.id_torneo} seccion={1}/>
                    }
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