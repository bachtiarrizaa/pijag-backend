export interface RegisterRequest {
    name: string,
    username: string,
    email: string,
    password: string,
    roleId: number,
}

export interface LoginRequest {
    email: string,
    password: string,
}

export interface AccessTokenSign {
    id: number,
    username: string,
    email: string,
    roleId: number | null,
    roleName: string,
}