import {environment} from '../../environment'
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export class AuthService {

    private activeUser?:any;
    private access_token:string;

    constructor(){
        console.log("Se crea");
        this.access_token = '';
        axios.interceptors.request.use((config) => {
            if(this.isLoggedIn()){
                config.headers.Authorization = "Bearer "+this.access_token;
            }
            return config;
          }, (error) => {
            return Promise.reject(error);
          });
    }

    login(username:string,password:String){
        return axios.post(environment.API_URL+'auth/login', { username,password });
    }

    async saveAccessToken(accessToken:string){
        await AsyncStorage.setItem("token", accessToken);
    }

    async isLoggedIn(){
        return await AsyncStorage.getItem("token")!=null;
    }

    async initUser(){
        const token = await AsyncStorage.getItem("token")||'';
        this.access_token = token;
        return axios.get(environment.API_URL+'auth/me').then((result:any)=>{
            this.activeUser = result.data;
        });
    }

    getActiveUser(){
        return this.activeUser;
    }

}