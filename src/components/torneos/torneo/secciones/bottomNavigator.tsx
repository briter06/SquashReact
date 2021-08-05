import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PartidosScreen } from './partidos';
import { resolve } from 'inversify-react';
import { TorneoService } from '../../../../services/Torneo/TorneoService';

const Tab = createMaterialBottomTabNavigator();

interface Props {
    navigation: any,
    id_torneo:any
}

interface TorneoState{
    max_round:number
    tabList:Array<number>
}

type tabOptions = {
    [key: number]: {title:string,icon:any}
}

const tabs:tabOptions = {
    16:{
        title:'Dieciseis',
        icon: <MaterialIcons name="sports-cricket" size={24} color="black" />
    },
    8:{
        title:'Octavos',
        icon: <FontAwesome5 name="bowling-ball" size={24} color="black" />
    },
    4:{
        title:'Cuartos',
        icon: <MaterialIcons name="sports-tennis" size={24} color="black" />
    },
    2:{
        title:'Semis',
        icon: <MaterialCommunityIcons name="tournament" size={24} color="black" />
    },
    1:{
        title:'Final',
        icon: <MaterialCommunityIcons name="medal" size={24} color="black" />
    }
}

export default class TorneoSeccionesNavigator extends React.Component<Props,TorneoState>{

    @resolve(TorneoService)
    private torneoService!:TorneoService;

    constructor(props:any){
        super(props);
        this.state = {
            max_round:16,
            tabList:[16,8,4,2,1]
        }
    }

    componentDidMount = () => {
        this.torneoService.getMaxSeccion(this.props.id_torneo).then(({data})=>{
            if(data.status===1){
                this.populateTabList(data.data.rondas);
            }
        });
    }

    populateTabList(num:number){
        let res:Array<number> = [];
        let sqrt = Math.log(num)/Math.log(2);
        for(let z = sqrt;z>=0;z--){
            res.push(Math.pow(2,z));
        }
        this.setState({max_round:num,tabList:res});
    }

    render(){
        return (
            <Tab.Navigator initialRouteName={''+this.state.max_round}>

                {
                    this.state.tabList.map(t=>{
                        return <Tab.Screen key={t}
                            name={''+t}
                            children={({navigation})=>
                                <PartidosScreen title={tabs[t].title} navigation={navigation}
                                id_torneo={this.props.id_torneo} seccion={t}/>
                            }
                            options={{
                            tabBarLabel: tabs[t].title,
                            tabBarIcon: ({ color }) => tabs[t].icon,
                            }}
                        />
                    })
                }
                
                
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });