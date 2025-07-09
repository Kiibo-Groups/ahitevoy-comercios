
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  phone: string;
}

export interface UpdateUserRequest {
  id: string;
  password: string;
  min_cart_value: string,
  delivery_charges_value: string
}

export interface ForgotRequest {
  email: string
}

export interface VerifyRequest {
  user_id: string,
  otp: string
}

export interface UpdatePasswordRequest {
  user_id: string,
  password: string,
  new_password: string
}

export interface ToastRequest {
  text: string,
  color: string,
  position:any
}