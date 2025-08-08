import { Button } from "@/components/ui/button"
import { authService } from "@/services/api"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">MONEY</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel financeiro</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Receitas</h3>
            <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Despesas</h3>
            <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Saldo</h3>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
        </div>
        
        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
          <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        </div>
      </div>
    </div>
  )
}
