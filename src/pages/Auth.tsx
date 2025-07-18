import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Lock, Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/obreiros')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos." 
            : "Verifique suas credenciais e tente novamente.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel..."
        })
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-light via-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">MIF Lisboa</h1>
          <p className="text-muted-foreground">Área dos Obreiros</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Faça login para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  className="focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="focus:ring-primary"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-variant text-primary-foreground font-medium py-2.5 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loading size="sm" />
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}