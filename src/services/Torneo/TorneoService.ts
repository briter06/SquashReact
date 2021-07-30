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

    getPartidos(id:number,seccion:number){
        return axios.get(environment.API_URL+'torneos/'+id+'/partidos/seccion/'+seccion);
    }

    crearTorneo(jugadores:any,nivel:string,rondas:number){
        return axios.post(environment.API_URL+'torneos/',{
            nivel:nivel,
            rondas:rondas,
            jugadores:jugadores
        });
    }

    updateGanador(p:any,ganador:number){
        return axios.put(environment.API_URL+'torneos/ganador',{
            partido:p,
            ganador:ganador
        });
    }

    eliminarTorneo(id:number){
        return axios.delete(environment.API_URL+'torneos/',{
            data:{
                id:id
            }
        });
    }

}