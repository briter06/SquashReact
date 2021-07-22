import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PerfilScreen } from './perfil';
import { PasswordScreen } from './password';

const Stack = createStackNavigator();

interface Props {
    navigation: any,
    updateUser:()=>void;
}

export default class ProfileNavigator extends React.Component<Props>{




    render(){
        return (
            <Stack.Navigator initialRouteName={"perfil"}>
                <Stack.Screen name="perfil" 
                children={({navigation})=><PerfilScreen updateUser={this.props.updateUser} navigation={navigation}></PerfilScreen>}
                options={{ headerShown: false }}/>
                <Stack.Screen name="pass" 
                component={PasswordScreen}
                options={{ headerShown: false }}/>
                
            </Stack.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });