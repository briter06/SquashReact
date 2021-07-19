import 'reflect-metadata';
import { Container } from 'inversify';
import {AuthService} from '../services/Auth/AuthService';

const container = new Container();
container.bind(AuthService).toSelf().inSingletonScope();

export {container};