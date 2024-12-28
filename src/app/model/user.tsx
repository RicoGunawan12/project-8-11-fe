export interface UserRegister{
    fullName : string,
    email : string,
    password : string,
    phoneNumber: string,
    confirmPassword: string
}

export interface UserLogin{
    email : string,
    password : string
}

export interface UserData{
    fullName : string,
    email : string
}