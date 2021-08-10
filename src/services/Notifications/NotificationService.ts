import 'reflect-metadata';
import {environment} from '../../../environment';
import axios from 'axios';
import {injectable} from 'inversify';


@injectable()
export class NotificationService {


    constructor(){
        
    }

    async sendPushToken(token:any){
        await axios.post(environment.API_URL+'auth/pushToken',{token});
    }

    
}