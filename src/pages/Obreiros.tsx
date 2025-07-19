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
import { Search, Filter, Eye, LogOut, Car, Users, Trash2 } from 'lucide-react'

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

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!confirm(`Tem certeza que deseja apagar o veículo ${vehicle.matricula_carro} de ${vehicle.nome_completo}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('fieis_veiculos')
        .delete()
        .eq('id', vehicle.id)

      if (error) throw error

      toast({
        title: "Veículo apagado com sucesso",
        description: `O veículo ${vehicle.matricula_carro} foi removido do sistema.`,
      })

      // Refresh the vehicles list
      fetchVehicles()
    } catch (error) {
      toast({
        title: "Erro ao apagar veículo",
        description: "Não foi possível apagar o veículo. Tente novamente.",
        variant: "destructive"
      })
    }
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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Car className="h-6 md:h-8 w-6 md:w-8 text-primary" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary">MIF Lisboa</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Painel dos Obreiros</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
            >
              <LogOut className="h-3 md:h-4 w-3 md:w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Total de Veículos</CardTitle>
              <Car className="h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Marcas Diferentes</CardTitle>
              <Filter className="h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-primary">{uniqueBrands.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Fiéis Registrados</CardTitle>
              <Users className="h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-card/80 backdrop-blur-sm border-border mb-6">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl text-primary">Registros de Veículos</CardTitle>
            <CardDescription className="text-sm">
              Gerir e visualizar todos os veículos registrados no sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, modelo ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 md:h-11 focus:ring-primary text-sm md:text-base"
                />
              </div>
              
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full h-10 md:h-11 text-sm md:text-base">
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
              <p className="text-xs md:text-sm text-muted-foreground">
                Mostrando {filteredVehicles.length} de {vehicles.length} registros
              </p>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {vehicles.length === 0 
                    ? "Nenhum veículo registrado ainda."
                    : "Nenhum resultado encontrado para os filtros selecionados."
                  }
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="bg-card/60 border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{vehicle.nome_completo}</h3>
                          <p className="text-xs text-muted-foreground">{vehicle.telefone}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{vehicle.marca_carro}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-foreground">{vehicle.modelo_carro}</p>
                          <p className="font-mono font-semibold text-primary text-xs">{vehicle.matricula_carro}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewDetails(vehicle)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-xs"
                          >
                            <Eye className="h-3 w-3" />
                            Detalhes
                          </Button>
                          <Button
                            onClick={() => handleDeleteVehicle(vehicle)}
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1 text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                            Apagar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-sm">Nome</TableHead>
                    <TableHead className="font-semibold text-sm">Telefone</TableHead>
                    <TableHead className="font-semibold text-sm">Marca</TableHead>
                    <TableHead className="font-semibold text-sm">Modelo</TableHead>
                    <TableHead className="font-semibold text-sm">Matrícula</TableHead>
                    <TableHead className="font-semibold text-center text-sm">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                        {vehicles.length === 0 
                          ? "Nenhum veículo registrado ainda."
                          : "Nenhum resultado encontrado para os filtros selecionados."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-sm">{vehicle.nome_completo}</TableCell>
                        <TableCell className="text-sm">{vehicle.telefone}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{vehicle.marca_carro}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{vehicle.modelo_carro}</TableCell>
                        <TableCell className="font-mono font-semibold text-primary text-sm">
                          {vehicle.matricula_carro}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleViewDetails(vehicle)}
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 text-xs"
                            >
                              <Eye className="h-3 w-3" />
                              Ver Detalhes
                            </Button>
                            <Button
                              onClick={() => handleDeleteVehicle(vehicle)}
                              size="sm"
                              variant="destructive"
                              className="flex items-center gap-1 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                              Apagar
                            </Button>
                          </div>
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