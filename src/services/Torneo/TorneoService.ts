import 'reflect-metadata';
import {environment} from '../../../environment';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux'
import {injectable} from 'inversify';
import { StackActions } from '@react-navigation/native';

@injectable()
export class TorneoService {

    constructor(){
        
    }

    getTorneos(){
        return axios.get(environment.API_URL+'torneos/');
    }

    getJugadores(id:number){
        return axios.get(environment.API_URL+'torneos/'+id+'/jugadores');
    }

}