import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Hash, Phone, User, Calendar, Send } from 'lucide-react'

interface Vehicle {
  id: string
  nome_completo: string
  telefone: string
  marca_carro: string
  modelo_carro: string
  matricula_carro: string
  created_at: string
}

interface VehicleModalProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleModal({ vehicle, open, onOpenChange }: VehicleModalProps) {
  if (!vehicle) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSendInfo = () => {
    // Placeholder for future functionality
    console.log('Enviar informações para:', vehicle.nome_completo)
    // Could implement WhatsApp integration, SMS, email, etc.
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 md:p-6">
          <DialogTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-2">
            <Car className="h-4 md:h-5 w-4 md:w-5" />
            Detalhes do Veículo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Informações completas do registo selecionado
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1 text-sm md:text-base">
              Dados Pessoais
            </h3>
            
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium text-foreground text-sm md:text-base break-words">{vehicle.nome_completo}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium text-foreground text-sm md:text-base">{vehicle.telefone}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1 text-sm md:text-base">
              Dados do Veículo
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Marca</p>
                <Badge variant="secondary" className="text-xs">
                  {vehicle.marca_carro}
                </Badge>
              </div>
              
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Modelo</p>
                <Badge variant="secondary" className="text-xs">
                  {vehicle.modelo_carro}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Matrícula</p>
                <p className="font-mono font-bold text-primary text-base md:text-lg">
                  {vehicle.matricula_carro}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground border-b border-border pb-1 text-sm md:text-base">
              Informações de Registo
            </h3>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Data de Registo</p>
                <p className="font-medium text-foreground text-sm md:text-base">{formatDate(vehicle.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-border">
            <Button 
              onClick={handleSendInfo}
              className="w-full h-10 md:h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-medium flex items-center gap-2 text-sm md:text-base"
            >
              <Send className="h-4 w-4" />
              Enviar Informações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}