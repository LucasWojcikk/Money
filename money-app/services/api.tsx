import axios from 'axios'

// Tentar primeiro a porta HTTP, depois HTTPS
const API_URLS = [
  'http://localhost:5196/api',    // HTTP primeiro (mais provável de funcionar)
  'https://localhost:7299/api',   // HTTPS depois
  'http://localhost:5196',        // Sem /api
  'https://localhost:7299'        // HTTPS sem /api
]

// Configurar axios com configurações mais permissivas para desenvolvimento
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // Ignorar problemas de certificado HTTPS em desenvolvimento
  httpsAgent: false,
})

// Função para testar qual URL funciona
const findWorkingApiUrl = async (): Promise<string> => {
  console.log('🔍 Procurando API disponível...')
  
  for (const url of API_URLS) {
    try {
      console.log(`🧪 Testando: ${url}`)
      const testApi = axios.create({
        baseURL: url,
        timeout: 3000,
        httpsAgent: false,
      })
      
      // Tentar acessar um endpoint básico
      await testApi.get('/', { 
        validateStatus: (status) => status < 500 // Aceitar qualquer status < 500
      })
      
      console.log(`✅ API encontrada em: ${url}`)
      return url
    } catch (error) {
      console.log(`❌ Falhou em: ${url}`, error.message)
      continue
    }
  }
  
  console.error('❌ Nenhuma API encontrada!')
  return API_URLS[0] // Retornar HTTP como fallback
}

// Variável para armazenar a URL que funciona
let workingApiUrl: string | null = null

// Interceptor para adicionar token e definir baseURL
api.interceptors.request.use(async (config) => {
  // Encontrar URL que funciona apenas uma vez
  if (!workingApiUrl) {
    workingApiUrl = await findWorkingApiUrl()
  }
  
  config.baseURL = workingApiUrl
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  console.log(`🚀 Requisição: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Sucesso: ${response.status} - ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ Erro: ${error.response?.status || error.code} - ${error.config?.url}`)
    console.error('Detalhes:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

// Tipos
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

// Função para testar conectividade básica
export const testApiConnection = async (): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const url = await findWorkingApiUrl()
    const testApi = axios.create({
      baseURL: url,
      timeout: 5000,
      httpsAgent: false,
    })
    
    await testApi.get('/', { 
      validateStatus: (status) => status < 500 
    })
    
    return { success: true, url }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }
  }
}

// Tentar diferentes endpoints de login
const tryLoginEndpoints = async (data: LoginRequest): Promise<LoginResponse> => {
  const endpoints = [
    '/Auth/login',
    '/api/Auth/login', 
    '/auth/login',
    '/login',
    '/Account/login'
  ]
  
  let lastError: Error | null = null
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔐 Tentando login: ${endpoint}`)
      const response = await api.post(endpoint, data)
      console.log(`✅ Login OK: ${endpoint}`, response.data)
      return response.data
    } catch (error) {
      console.log(`❌ Login falhou: ${endpoint}`)
      lastError = error as Error
      continue
    }
  }
  
  throw lastError || new Error('Nenhum endpoint de login encontrado')
}

// Serviços de autenticação
export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔑 Iniciando login...', { email: data.email })
      return await tryLoginEndpoints(data)
    } catch (error) {
      console.error('🚨 Erro no login:', error)
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          throw new Error('API não está acessível. Verifique se está rodando.')
        }
        if (error.response?.status === 401) {
          throw new Error('Email ou senha incorretos.')
        }
        if (error.response?.status === 400) {
          throw new Error('Dados inválidos.')
        }
        if (error.response?.status === 404) {
          throw new Error('Endpoint de login não encontrado.')
        }
        throw new Error(error.response?.data?.message || `Erro ${error.response?.status}`)
      }
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro inesperado.')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    workingApiUrl = null // Reset para próxima sessão
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}

export default api
