export interface User {
  avatar: string | null,
  name: string,
  username: string,
  email: string,
  phoneNumber: string | null,
  birthDate: Date | null
}

export interface UserCreateRequest {
  avatar?: string | null,
  name: string,
  username: string,
  email: string,
  password: string,
  roleId: number,
  phoneNumber?: string | null,
  birthDate?: string | null
}

export interface UserUpdateRequest {
  avatar?: string | null,
  name: string,
  username: string,
  email: string,
  password: string,
  roleId?: number | null,
  phoneNumber?: string | null,
  birthDate?: string | null
}

// export interface UserUpdateRequest {
//   avatar: string | null,
//   name: string,
//   username: string,
//   email: string,
//   phoneNumber: string,
//   birthDate: string | null
// }