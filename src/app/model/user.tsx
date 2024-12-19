export interface UserRegister{
    username : string,
    email : string,
    password : string,
    phoneNumber: string
}

export interface UserLogin{
    email : string,
    password : string
}

export interface UserData{
    username : string,
    email : string
}