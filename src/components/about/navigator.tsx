import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AboutScreen } from './about';
import PDFViewer from '../pdf';

const Stack = createStackNavigator();

export default class AboutNavigator extends React.Component{




    render(){
        return (
            <Stack.Navigator initialRouteName={"about"}>
                <Stack.Screen name="about" component={AboutScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="reglamento"
                children={({navigation})=><PDFViewer
                source={"https://drive.google.com/uc?export=download&id=1VjYAvHhKOn9v73J6_TiCfG0DZLilUBzz"}
                navigation={navigation}></PDFViewer>}
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