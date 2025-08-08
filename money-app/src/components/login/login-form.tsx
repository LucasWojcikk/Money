import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Eye, EyeOff, Loader2, AlertCircle, Wifi, WifiOff, CheckCircle } from 'lucide-react'
import { authService, LoginRequest, testApiConnection } from "@/services/api"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [error, setError] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<{
    status: 'unknown' | 'connected' | 'disconnected'
    message?: string
  }>({ status: 'unknown' })
  const navigate = useNavigate()

  const testConnection = async () => {
    setIsTestingConnection(true)
    setError("")
    
    try {
      const result = await testApiConnection()
      
      setConnectionStatus({
        status: result.success ? 'connected' : 'disconnected',
        message: result.message
      })
    } catch {
      setConnectionStatus({
        status: 'disconnected',
        message: 'Erro ao testar conexão'
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const loginData: LoginRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    try {
      const token = await authService.login(loginData)
      
      // Salvar token
      localStorage.setItem('token', token)
      
      // Redirecionar para homepage
      navigate('/home')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Erro inesperado.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-primary">MONEY</h1>
          <p className="text-sm text-muted-foreground">Sistema de Controle Financeiro</p>
        </div>
        
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Faça login na sua conta</h2>
          <p className="text-muted-foreground text-sm text-balance">
            Digite seu e-mail e senha para acessar sua conta
          </p>
        </div>

        {/* Status da conexão */}
        <div className={cn(
          "flex items-center justify-between p-3 rounded-md border",
          connectionStatus.status === 'connected' && "bg-green-50 border-green-200",
          connectionStatus.status === 'disconnected' && "bg-red-50 border-red-200",
          connectionStatus.status === 'unknown' && "bg-muted"
        )}>
          <div className="flex items-center gap-2">
            {connectionStatus.status === 'connected' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {connectionStatus.status === 'disconnected' && <WifiOff className="h-4 w-4 text-red-600" />}
            {connectionStatus.status === 'unknown' && <Wifi className="h-4 w-4 text-gray-400" />}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {connectionStatus.status === 'connected' && 'API Conectada'}
                {connectionStatus.status === 'disconnected' && 'API Desconectada'}
                {connectionStatus.status === 'unknown' && 'Status da API'}
              </span>
              {connectionStatus.message && (
                <span className="text-xs text-muted-foreground">
                  {connectionStatus.message}
                </span>
              )}
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={testConnection}
            disabled={isTestingConnection}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar API'
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="teste@email.com" 
              required 
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button variant="link" className="px-0 text-sm h-auto">
                Esqueceu a senha?
              </Button>
            </div>
            <div className="relative">
              <Input 
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="123456"
                required 
                className="pr-10"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </div>
        
        <div className="text-center text-sm">
          Não possui uma conta?{" "}
          <Button variant="link" className="px-0 text-sm h-auto font-medium">
            Cadastre-se
          </Button>
        </div>
      </form>
    </div>
  )
}
