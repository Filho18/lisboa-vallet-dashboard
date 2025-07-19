import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Car, Phone, User, Hash } from 'lucide-react'

interface FormData {
  nome_completo: string
  telefone: string
  marca_carro: string
  modelo_carro: string
  matricula_carro: string
}

export function VehicleRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    nome_completo: '',
    telefone: '',
    marca_carro: '',
    modelo_carro: '',
    matricula_carro: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    // Basic phone formatting
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4')
  }

  const validateForm = () => {
    const required = ['nome_completo', 'telefone', 'marca_carro', 'modelo_carro', 'matricula_carro']
    for (const field of required) {
      if (!formData[field as keyof FormData].trim()) {
        toast({
          title: "Campo obrigatório",
          description: `Por favor, preencha o campo ${field.replace('_', ' ')}`,
          variant: "destructive"
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('fieis_veiculos')
        .insert([{
          nome_completo: formData.nome_completo.trim(),
          telefone: formData.telefone.trim(),
          marca_carro: formData.marca_carro.trim(),
          modelo_carro: formData.modelo_carro.trim(),
          matricula_carro: formData.matricula_carro.trim().toUpperCase()
        }])

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Matrícula já registrada",
            description: "Este veículo já está registrado no sistema.",
            variant: "destructive"
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Registro realizado com sucesso!",
          description: "Seu veículo foi registrado no sistema de estacionamento.",
        })
        
        // Reset form
        setFormData({
          nome_completo: '',
          telefone: '',
          marca_carro: '',
          modelo_carro: '',
          matricula_carro: ''
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao registrar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mx-auto bg-[rgba(26,26,29,0.85)] backdrop-blur-lg border-2 border-[color:#8a2be2] shadow-2xl shadow-[color:#007bff33] rounded-2xl transition-all duration-300 hover:shadow-[0_0_32px_4px_#8a2be299]">
      <CardHeader className="text-center space-y-2 p-4 md:p-6">
        <CardTitle className="text-2xl md:text-3xl font-extrabold font-title text-white drop-shadow-glow-primary">
          Registro de Veículo
        </CardTitle>
        <CardDescription className="text-gray-300 font-body text-sm md:text-base">
          Registre seu veículo para usar o estacionamento da igreja
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome_completo" className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-100 font-body">
              <User className="h-4 md:h-5 w-4 md:w-5 text-[color:#007bff]" strokeWidth={2} />
              Nome Completo*
            </Label>
            <Input
              id="nome_completo"
              type="text"
              value={formData.nome_completo}
              onChange={(e) => handleInputChange('nome_completo', e.target.value)}
              placeholder="Digite seu nome completo"
              required
              className="h-10 md:h-11 focus:ring-2 focus:ring-[color:#007bff] focus:border-[color:#007bff] bg-[rgba(20,22,30,0.7)] border border-[color:#222] text-white placeholder-gray-400 font-body transition-all text-sm md:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-100 font-body">
              <Phone className="h-4 md:h-5 w-4 md:w-5 text-[color:#8a2be2]" strokeWidth={2} />
              Número de Telefone*
            </Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', formatPhone(e.target.value))}
              placeholder="123 456 789"
              required
              className="h-10 md:h-11 focus:ring-2 focus:ring-[color:#8a2be2] focus:border-[color:#8a2be2] bg-[rgba(20,22,30,0.7)] border border-[color:#222] text-white placeholder-gray-400 font-body transition-all text-sm md:text-base"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca_carro" className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-100 font-body">
                <Car className="h-4 md:h-5 w-4 md:w-5 text-[color:#e6b800]" strokeWidth={2} />
                Marca*
              </Label>
              <Input
                id="marca_carro"
                type="text"
                value={formData.marca_carro}
                onChange={(e) => handleInputChange('marca_carro', e.target.value)}
                placeholder="Ex: Toyota"
                required
                className="h-10 md:h-11 focus:ring-2 focus:ring-[color:#e6b800] focus:border-[color:#e6b800] bg-[rgba(20,22,30,0.7)] border border-[color:#222] text-white placeholder-gray-400 font-body transition-all text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo_carro" className="text-sm md:text-base font-semibold text-gray-100 font-body">
                Modelo*
              </Label>
              <Input
                id="modelo_carro"
                type="text"
                value={formData.modelo_carro}
                onChange={(e) => handleInputChange('modelo_carro', e.target.value)}
                placeholder="Ex: Corolla"
                required
                className="h-10 md:h-11 focus:ring-2 focus:ring-[color:#007bff] focus:border-[color:#007bff] bg-[rgba(20,22,30,0.7)] border border-[color:#222] text-white placeholder-gray-400 font-body transition-all text-sm md:text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula_carro" className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-100 font-body">
              <Hash className="h-4 md:h-5 w-4 md:w-5 text-[color:#8a2be2]" strokeWidth={2} />
              Matrícula do Carro*
            </Label>
            <Input
              id="matricula_carro"
              type="text"
              value={formData.matricula_carro}
              onChange={(e) => handleInputChange('matricula_carro', e.target.value.toUpperCase())}
              placeholder="Ex: 12-AB-34"
              required
              className="h-10 md:h-11 focus:ring-2 focus:ring-[color:#8a2be2] focus:border-[color:#8a2be2] bg-[rgba(20,22,30,0.7)] border border-[color:#222] text-white placeholder-gray-400 font-mono font-body transition-all text-sm md:text-base"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 md:h-12 bg-[color:#007bff] hover:bg-[color:#8a2be2] text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 focus:ring-2 focus:ring-[color:#e6b800] focus:ring-offset-2 active:scale-95 animate-pulse-on-hover text-base md:text-lg tracking-wide"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loading size="sm" />
                Registrando...
              </div>
            ) : (
              'Registrar Veículo'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}