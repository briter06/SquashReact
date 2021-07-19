import 'react-native-gesture-handler';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from './styles';
import { LoginForm } from './loginForm';
import { AuthService } from '../services/Auth/AuthService';
import { resolve } from 'inversify-react';
import { DrawerScreen } from './drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements'

const Stack = createStackNavigator();

export default class AppMainComponent extends React.Component{

    @resolve(AuthService)
    private authService!:AuthService;

    state={
        isReady:false,
        isLoggedIn:false
    }

    componentDidMount() {
        this.authService.isLoggedIn().then((result)=>{
            this.setState({isReady:true,isLoggedIn:result});
        });
    }

    screen = ()=>{
        if(this.state.isReady){
            return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={this.state.isLoggedIn?"drawer_main":"login"}>
                        <Stack.Screen name="login" component={LoginForm} options={{ headerShown: false }}/>
                        <Stack.Screen name="drawer_main" component={DrawerScreen}
                        options={({ navigation }) => ({
                            title:'El Cubo - Squash',
                            headerStyle:{
                                backgroundColor:'#D8D00B'
                            },
                            headerLeft: () => (
                                <Icon name="menu" size={30}
                                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} ></Icon>
                            ),
                            headerLeftContainerStyle:{
                                left:8
                            }
                          })}/>
                    </Stack.Navigator>
                </NavigationContainer>
            );
        }
    }

    render(){
        return (
            <View style={[styles.container,globalStyles.fullScreen]}>
                {this.screen()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });