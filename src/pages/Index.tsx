import { Button } from '@/components/ui/button'
import { VehicleRegistrationForm } from '@/components/VehicleRegistrationForm'
import { Link } from 'react-router-dom'
import { Settings, Car, Church, ChevronRight } from 'lucide-react'
import heroImage from '@/assets/church-parking-hero.jpg'

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      {/* Fundo dinâmico e marca d'água */}
      <div className="fixed inset-0 z-0 animate-gradient-move bg-gradient-to-br from-[#0F1C2D] via-[#1A1A1D] to-[#16213E]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none select-none opacity-10 mix-blend-luminosity"
          style={{ backgroundImage: `url(${heroImage})`, filter: 'blur(2px) grayscale(0.7)' }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 md:mb-6">
              <Church className="h-8 md:h-9 w-8 md:w-9 text-[color:#e6b800] drop-shadow-glow-gold" strokeWidth={2.2} />
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[color:#e6b800] font-title drop-shadow-glow-gold">MIF Lisboa</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-title text-white drop-shadow-glow-primary leading-tight">
              Estacionamento
              <span className="block text-[color:#8a2be2] drop-shadow-glow-primary">da Igreja</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg mx-auto lg:mx-0 font-body px-4 lg:px-0">
              Registre seu veículo de forma simples e segura para utilizar o estacionamento da Igreja MIF Lisboa.
            </p>
          </div>
          {/* Right Content - Registration Form */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg px-4 lg:px-0">
            <VehicleRegistrationForm />
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative z-10 bg-transparent mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Church className="h-7 w-7 text-[color:#e6b800] drop-shadow-glow-gold" strokeWidth={2.2} />
            <span className="text-xl font-bold text-[color:#e6b800] font-title drop-shadow-glow-gold">MIF Lisboa</span>
          </div>
          <p className="text-gray-400 text-sm font-body">
            Sistema de Gestão de Estacionamento da Igreja
          </p>
          <div className="mt-6 pt-4 border-t border-[color:#222]">
            <p className="text-xs text-gray-500">
              © 2024 MIF Lisboa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
