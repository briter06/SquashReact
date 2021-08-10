import "reflect-metadata";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Divider } from "react-native-elements/dist/divider/Divider";
import { resolve } from "inversify-react";
import { AuthService } from "../services/Auth/AuthService";
import ProfileComponent from "./profile";
import AboutNavigator from "./about/navigator";
import ProfileNavigator from "./profile/navigator";
import TorneosNavigator from "./torneos/navigator";
import { UsuariosScreen } from "./usuarios";
import * as Notifications from 'expo-notifications';
import { NotificationService } from "../services/Notifications/NotificationService";
import {  Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

const Drawer = createDrawerNavigator();

interface Props {
    navigation: any
}

export class DrawerScreen extends React.Component<Props>{

    @resolve(AuthService)
    private authService!:AuthService;

    @resolve(NotificationService)
    private notificationService!:NotificationService;

    state = {
        isProgress :true,
        user:{nombre:'',tipo:''},
        allowed:false
    }

    constructor(props:any){
        super(props);
    }

    componentDidMount() {
        this.registerForPushNotificationsAsync();
        this.updateUser();
    }

    updateUser = ()=>{
        this.authService.initUser().finally(()=>{
            this.setState({isProgress:false,user:this.authService.getActiveUser(),
                allowed:this.authService.isAuthorized(['Profesor','Admin'])});
        });
    }

    registerForPushNotificationsAsync = async ()=> {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'Squash - El Cubo',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        await this.notificationService.sendPushToken(token);
      }

    render(){
        return (
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

                    <Drawer.Screen name="torneos" component={TorneosNavigator} 
                    options={{
                        title:'Torneos'
                    }}/>

                    <Drawer.Screen name="about" component={AboutNavigator} 
                    options={{
                        title:'Sobre Squash'
                    }}/>

                    {
                        this.state.allowed?
                        <Drawer.Screen name="usuarios" component={UsuariosScreen} 
                        options={{
                            title:'Usuarios'
                        }}/>:null
                    }
                </Drawer.Navigator>
        );
    }
}
