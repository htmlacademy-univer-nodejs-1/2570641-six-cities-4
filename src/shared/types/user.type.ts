import { UserType } from './user-type.enum.type.js';


export type User = {
    name: string;
    email: string;
    avatarUrl: string;
    password: string;
    userType: UserType;
}
