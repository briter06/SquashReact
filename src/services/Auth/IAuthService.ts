export interface IAuthService{
    login : (username:string,password:String)=>any;
    saveAccessToken:(accessToken:string)=>void;
    isLoggedIn:()=>any;
    initUser:()=>any;
    getActiveUser:()=>any;
}