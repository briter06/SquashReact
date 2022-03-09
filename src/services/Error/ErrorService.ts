import 'reflect-metadata';
import {injectable} from 'inversify';
import { SquashErrorMessages, SquashErrors } from '../../enums/errors.enum';


@injectable()
export class ErrorService {


    constructor(){
        
    }

    getErrorInfo(data?: {errors:string[]}){
        if(data?.errors){
            const error = data.errors[0] as SquashErrors
            if(error && Object.values(SquashErrors).includes(error)){
                return {
                    title: SquashErrorMessages[SquashErrors[error]].title,
                    text: SquashErrorMessages[SquashErrors[error]].text
                }
            }
        }

        return {
            title: SquashErrorMessages[SquashErrors.INTERNAL_SERVER_ERROR].title,
            text: SquashErrorMessages[SquashErrors.INTERNAL_SERVER_ERROR].text
        }
    }

    
}