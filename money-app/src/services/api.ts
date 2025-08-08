// Tipos para as requisições
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user?: {
    id: string
    name: string
    email: string
  }
}

// Função auxiliar para fazer requisições com melhor debug
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Adicionar token se existir
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }

  console.log(`🚀 Fazendo requisição: ${options.method || 'GET'} ${url}`)
  console.log(`📤 Dados enviados:`, options.body)

  const response = await fetch(url, config)
  
  console.log(`📡 Resposta: ${response.status} ${response.statusText}`)

  // Capturar o corpo da resposta para debug
  const responseText = await response.text()
  console.log(`📄 Corpo da resposta:`, responseText)

  if (!response.ok) {
    console.error(`❌ Erro na API: ${response.status} - ${responseText}`)
    
    // Tentar parsear como JSON para ver se há mais detalhes
    try {
      const errorJson = JSON.parse(responseText)
      console.error(`🔍 Detalhes do erro:`, errorJson)
      throw new Error(errorJson.message || errorJson.title || responseText || `Erro ${response.status}`)
    } catch {
      // Se não for JSON, usar o texto direto
      throw new Error(responseText || `Erro ${response.status}`)
    }
  }

  // Retornar uma resposta "fake" com o texto já lido
  return {
    ...response,
    text: async () => responseText,
    json: async () => JSON.parse(responseText)
  }
}

// Serviços de autenticação
export const authService = {
  async login(data: LoginRequest): Promise<string> {
    try {
      console.log('🔑 Tentando login...', { email: data.email })
      console.log('📋 Dados do login:', JSON.stringify(data, null, 2))
      
      const response = await apiRequest('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const token = await response.text()
      console.log('✅ Login bem-sucedido!')
      console.log('🎫 Token recebido:', token.substring(0, 50) + '...')
      
      return token
    } catch (error) {
      console.error('🚨 Erro no login:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Não foi possível conectar com o servidor. Verifique se a API está rodando.')
        }
        if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')) {
          throw new Error('Email ou senha incorretos.')
        }
        if (error.message.includes('400') || error.message.toLowerCase().includes('bad request')) {
          throw new Error('Dados inválidos. Verifique email e senha.')
        }
        if (error.message.includes('500')) {
          throw new Error(`Erro interno do servidor: ${error.message}`)
        }
        throw error
      }
      
      throw new Error('Erro inesperado. Tente novamente.')
    }
  },

  async register(data: RegisterRequest): Promise<string> {
    try {
      console.log('📝 Tentando registro...', { email: data.email, name: data.name })
      
      const response = await apiRequest('/api/Auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return await response.text()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro inesperado. Tente novamente.')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}

// Função para testar a API - agora com endpoints corretos
export const testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  console.log('🧪 Testando conexão com a API...')
  
  // Lista de endpoints para testar (do mais confiável ao menos)
  const testEndpoints = [
    { url: '/swagger/index.html', method: 'GET', name: 'Swagger UI', successCodes: [200] },
    { url: '/api/Auth/login', method: 'POST', name: 'Auth endpoint', body: '{"email":"test","password":"test"}', successCodes: [400, 401] }, // 400/401 = API funcionando
    { url: '/api', method: 'GET', name: 'API base', successCodes: [200, 404] }
  ]
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`🔍 Testando ${endpoint.name}: ${endpoint.method} ${endpoint.url}`)
      
      const config: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      
      if (endpoint.body) {
        config.body = endpoint.body
      }
      
      const response = await fetch(endpoint.url, config)
      
      console.log(`📡 ${endpoint.name}: ${response.status} ${response.statusText}`)
      
      // Verificar se o status é considerado sucesso para este endpoint
      if (endpoint.successCodes.includes(response.status)) {
        return { 
          success: true, 
          message: `✅ API conectada via ${endpoint.name} (${response.status})` 
        }
      }
      
      // Se não é um erro crítico (< 500), continuar testando
      if (response.status < 500) {
        console.log(`⚠️ ${endpoint.name} respondeu ${response.status}, continuando...`)
        continue
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name} falhou:`, error)
      continue
    }
  }
  
  return { 
    success: false, 
    message: '❌ Não foi possível conectar com a API. Verifique se está rodando.' 
  }
}

export default { authService, testApiConnection }
