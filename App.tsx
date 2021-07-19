import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'inversify-react';
import {container} from './src/config/inversify.config';
import AppMainComponent from './src/components/app';

export default function App() {


  return (
    <Provider container={container} key={container.id}>
      <AppMainComponent></AppMainComponent>
    </Provider>
  );
}