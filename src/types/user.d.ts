export interface User {
  avatar: string | null,
  name: string,
  username: string,
  email: string,
  phoneNumber: string,
  birthDate: string | null
}

export interface UserUpdateRequest {
  avatar: string | null,
  name: string,
  username: string,
  email: string,
  phoneNumber: string,
  birthDate: string | null
}