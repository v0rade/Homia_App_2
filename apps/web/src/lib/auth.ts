import { jwtDecode } from "jwt-decode"

export interface TokenPayload {
  userId: string
  role: "MANAGER" | "TENANT"
  exp: number
}

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

export const decodeAuthToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token)
  } catch {
    return null
  }
}
