import 'reflect-metadata';
import {environment} from '../../../environment';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux'
import {injectable} from 'inversify';
import { StackActions } from '@react-navigation/native';
import {Subject} from 'rxjs';


@injectable()
export class AuthService {

    private activeUser:any;
    private access_token:string;
    private user$:Subject<boolean>;

    constructor(){
        this.user$ = new Subject<boolean>();
        this.activeUser = {nombre:'',tipo:''}
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

    logout(navigator:any){
        AsyncStorage.removeItem("token").then(()=>{
            // Actions.login();
            // navigator.navigate('login');
            navigator.dispatch(
                StackActions.replace('login')
            );
        });
    }

    async saveAccessToken(accessToken:string){
        await AsyncStorage.setItem("token", accessToken);
    }

    async isLoggedIn(){
        return (await AsyncStorage.getItem("token"))!=null;
    }

    async initUser(){
        const token = await AsyncStorage.getItem("token")||'';
        this.access_token = token;
        return axios.get(environment.API_URL+'auth/me').then((result:any)=>{
            this.activeUser = result.data;
            this.user$.next(true);
        });
    }

    getUser$(){
        return this.user$.asObservable();
    }

    updateUser(userInfo:any){
        return axios.put(environment.API_URL+'auth/me',{
            username: userInfo.username,
            nombre: userInfo.nombre,
            correo:userInfo.correo?userInfo.correo:''
        });
    }

    updatePassword(password:string,currPassword:string){
        return axios.put(environment.API_URL+'auth/me/password',{password,currPassword});
    }

    getActiveUser(){
        return this.activeUser;
    }

    isAuthorized(types:Array<string>){
        if(this.activeUser){
            return types.includes(this.activeUser.tipo);
        }
        return false;
    }

    getUsers(){
        return axios.get(environment.API_URL+'auth/users');
    }

    agregarUsuario(newUser:any){
        return axios.post(environment.API_URL+'auth/signup',newUser);
    }

    editarUsuario(newUser:any,id:number){
        return axios.put(environment.API_URL+`auth/users/${id}`,newUser);
    }

    eliminarUsuario(id:number){
        return axios.delete(environment.API_URL+'auth/users',{
            data:{
                id:id
            }
        });
    }
}