import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { MainScreen } from "./mainScreen";
import { Divider } from "react-native-elements/dist/divider/Divider";
import { resolve } from "inversify-react";
import { AuthService } from "../services/Auth/AuthService";
import ProfileComponent from "./profile";
import AboutNavigator from "./about/navigator";
import ProfileNavigator from "./profile/navigator";
import TorneosNavigator from "./torneos/navigator";

const Drawer = createDrawerNavigator();

interface Props {
    navigation: any
}

export class DrawerScreen extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    state = {
        isProgress :true,
        user:{nombre:'',tipo:''}
    }

    constructor(props:any){
        super(props);
    }

    componentDidMount() {
        this.updateUser();
    }

    updateUser = ()=>{
        this.authService.initUser().finally(()=>{
            this.setState({isProgress:false,user:this.authService.getActiveUser()});
        });
    }

    render(){
        return (
            // <NavigationContainer>
                <Drawer.Navigator initialRouteName="torneos"
                drawerContent={props => {
                    return (
                      <DrawerContentScrollView {...props} contentContainerStyle={{justifyContent: 'space-between',flex:1}}>
                        <View>
                            <View>
                                <ProfileComponent user={this.state.user}></ProfileComponent>
                                
                            </View>
                            <Divider/>
                            <DrawerItemList {...props} />
                        </View>
                        <View>
                            <Divider/>
                            <DrawerItem label="Cerrar sesión" onPress={() => this.authService.logout(this.props.navigation)} />
                        </View>
                      </DrawerContentScrollView>
                    )
                  }}
                >
                    <Drawer.Screen name="perfil"
                    children={({navigation})=><ProfileNavigator updateUser={this.updateUser} navigation={navigation}></ProfileNavigator>} 
                    options={{
                        title:'Perfil'
                    }}/>

                    {/* <Drawer.Screen name="main" component={MainScreen} 
                    options={{
                        title:'Inicio'
                    }}/> */}

                    <Drawer.Screen name="torneos" component={TorneosNavigator} 
                    options={{
                        title:'Torneos'
                    }}/>

                    <Drawer.Screen name="about" component={AboutNavigator} 
                    options={{
                        title:'Sobre Squash'
                    }}/>
                </Drawer.Navigator>
            // </NavigationContainer>
        );
    }
}


const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
  });