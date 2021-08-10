import 'reflect-metadata';
import { Container } from 'inversify';
import {AuthService} from '../services/Auth/AuthService';
import { TorneoService } from '../services/Torneo/TorneoService';
import { NotificationService } from '../services/Notifications/NotificationService';

const container = new Container();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(TorneoService).toSelf().inSingletonScope();
container.bind(NotificationService).toSelf().inSingletonScope();

export {container};