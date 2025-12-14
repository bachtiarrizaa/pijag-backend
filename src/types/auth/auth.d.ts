export interface Register {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface AccessTokenSign {
    id: number;
    username: string;
    email: string;
    role_id: number;
    role_name: string;
}