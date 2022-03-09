export enum SquashErrors{
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',
    NOT_FOUND = 'NOT_FOUND',
    INCORRECT_LOGIN = 'INCORRECT_LOGIN',
    USER_NO_EXIST = 'USER_NO_EXIST',
    USER_EXIST = 'USER_EXIST',
    BAD_REQUEST = 'BAD_REQUEST',
    FORBIDDEN = 'FORBIDDEN',
    INACTIVE_BILLING_ACCOUNT = 'INACTIVE_BILLING_ACCOUNT',
    NO_VALID_OPTION = 'NO_VALID_OPTION',
    INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
    IMAGE_SIZE_EXCEEDED = 'IMAGE_SIZE_EXCEEDED'
}

export const SquashErrorMessages = {
    [SquashErrors.INTERNAL_SERVER_ERROR] : {
        title: 'Error',
        text:'Ha ocurrido un error! Vuelva a intentar'
    },
    [SquashErrors.UNAUTHORIZED] : {
        title: 'Error',
        text:'Usted no tiene acceso a esta funcionalidad'
    },
    [SquashErrors.NOT_FOUND] : {
        title: 'Error',
        text:'No se ha encontrado el recurso solicitado'
    },
    [SquashErrors.INCORRECT_LOGIN] : {
        title: 'Autenticación incorrecta',
        text:'Usuario o contraseña incorrecta'
    },
    [SquashErrors.USER_NO_EXIST] : {
        title: 'No existe',
        text:'El usuario no existe'
    },
    [SquashErrors.USER_EXIST] : {
        title: 'Ya existe',
        text:'El usuario ya existe'
    },
    [SquashErrors.BAD_REQUEST] : {
        title: 'Error',
        text:'Ha ocurrido un error!'
    },
    [SquashErrors.FORBIDDEN] : {
        title: 'Error',
        text:'Usted no tiene acceso a esta funcionalidad'
    },
    [SquashErrors.INACTIVE_BILLING_ACCOUNT] : {
        title: 'Error',
        text:'Se ha deshabilitado su cuenta debido a que su pago no está activo'
    },
    [SquashErrors.NO_VALID_OPTION] : {
        title: 'Error',
        text:'La opción seleccionada no es válida'
    },
    [SquashErrors.INCORRECT_PASSWORD] : {
        title: 'Error',
        text:'La contraseña actual no es correcta'
    },
    [SquashErrors.IMAGE_SIZE_EXCEEDED] : {
        title: 'Error',
        text:'La imagen es demasiado pesada'
    }
}