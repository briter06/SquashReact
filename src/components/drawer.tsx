import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { MainScreen } from "./mainScreen";
import { Divider } from "react-native-elements/dist/divider/Divider";
import { resolve } from "inversify-react";
import { AuthService } from "../services/Auth/AuthService";
import ProfileComponent from "./profile";

const Drawer = createDrawerNavigator();

interface Props {
    navigation: any
}

export class DrawerScreen extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    state = {
        isProgress :true,
        user:{nombre:''}
    }

    constructor(props:any){
        super(props);
    }

    componentDidMount() {
        this.authService.initUser().finally(()=>{
            this.setState({isProgress:false,user:this.authService.getActiveUser()});
        });
    }

    render(){
        return (
            // <NavigationContainer>
                <Drawer.Navigator initialRouteName="main"
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
                    <Drawer.Screen name="main" component={MainScreen} 
                    options={{
                        title:'Inicio'
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