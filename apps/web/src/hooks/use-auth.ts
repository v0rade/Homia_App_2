import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { setAuthToken, removeAuthToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const login = useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await api.post("/auth/login", credentials)
      return data
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      queryClient.setQueryData(["user"], data.user)
      router.push(data.user.role === "MANAGER" ? "/dashboard" : "/tenant/dashboard")
    },
  })

  const logout = () => {
    removeAuthToken()
    queryClient.clear()
    router.push("/login")
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me")
      return data
    },
    retry: false,
  })

  return {
    user,
    isLoading,
    login,
    logout,
  }
}
