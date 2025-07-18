import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { VehicleModal } from '@/components/VehicleModal'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter, Eye, LogOut, Car, Users } from 'lucide-react'

interface Vehicle {
  id: string
  nome_completo: string
  telefone: string
  marca_carro: string
  modelo_carro: string
  matricula_carro: string
  created_at: string
}

export default function Obreiros() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  const { user, signOut, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchVehicles()
    }
  }, [user])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchTerm, selectedBrand])

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('fieis_veiculos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setVehicles(data || [])
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os registros de veículos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filterVehicles = () => {
    let filtered = [...vehicles]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(vehicle =>
        vehicle.nome_completo.toLowerCase().includes(term) ||
        vehicle.modelo_carro.toLowerCase().includes(term) ||
        vehicle.matricula_carro.toLowerCase().includes(term)
      )
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(vehicle =>
        vehicle.marca_carro.toLowerCase() === selectedBrand.toLowerCase()
      )
    }

    setFilteredVehicles(filtered)
  }

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Get unique brands for filter dropdown
  const uniqueBrands = [...new Set(vehicles.map(v => v.marca_carro))].sort()

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-church-light via-background to-secondary flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loading size="lg" />
          <span className="text-lg text-muted-foreground">Carregando painel...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-light via-background to-secondary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">MIF Lisboa</h1>
                <p className="text-sm text-muted-foreground">Painel dos Obreiros</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marcas Diferentes</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{uniqueBrands.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fiéis Registrados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-card/80 backdrop-blur-sm border-border mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Registros de Veículos</CardTitle>
            <CardDescription>
              Gerir e visualizar todos os veículos registrados no sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, modelo ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-primary"
                />
              </div>
              
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {uniqueBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredVehicles.length} de {vehicles.length} registros
              </p>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">Telefone</TableHead>
                    <TableHead className="font-semibold">Marca</TableHead>
                    <TableHead className="font-semibold">Modelo</TableHead>
                    <TableHead className="font-semibold">Matrícula</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {vehicles.length === 0 
                          ? "Nenhum veículo registrado ainda."
                          : "Nenhum resultado encontrado para os filtros selecionados."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{vehicle.nome_completo}</TableCell>
                        <TableCell>{vehicle.telefone}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{vehicle.marca_carro}</Badge>
                        </TableCell>
                        <TableCell>{vehicle.modelo_carro}</TableCell>
                        <TableCell className="font-mono font-semibold text-primary">
                          {vehicle.matricula_carro}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() => handleViewDetails(vehicle)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Details Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}