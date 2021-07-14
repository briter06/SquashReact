import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { globalStyles } from './src/components/styles';
import { AuthService } from './src/services/auth-service';
import { ServiceContext } from './Service';
import { LoginForm } from './src/components/loginForm';
import { Router, Scene, Stack } from 'react-native-router-flux';
import { MainScreen } from './src/components/mainScreen';


export default function App() {

  return (
    <View style={[styles.container,globalStyles.fullScreen]}>
      <ServiceContext.Provider value={{authService:new AuthService()}}>
        <Router>
          <Stack key="root">
            <Scene
            key="login" component={LoginForm} title="Iniciar Sesión" initial={true}
            tabBarPosition='top' tabs={true}/>
            <Scene key="main" component={MainScreen} title="Bienvenido" 
            tabBarPosition='top' tabs={true}/>
          </Stack>
        </Router>
      </ServiceContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
