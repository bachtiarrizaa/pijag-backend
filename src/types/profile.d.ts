export interface ProfileUpdateRequest { 
    avatar?: string | null,
    name: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    birthDate?: string | null
}