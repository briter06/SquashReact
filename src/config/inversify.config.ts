import 'reflect-metadata';
import { Container } from 'inversify';
import {AuthService} from '../services/Auth/AuthService';
import { TorneoService } from '../services/Torneo/TorneoService';

const container = new Container();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(TorneoService).toSelf().inSingletonScope();

export {container};