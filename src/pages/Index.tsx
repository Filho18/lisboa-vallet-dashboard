import { Button } from '@/components/ui/button'
import { VehicleRegistrationForm } from '@/components/VehicleRegistrationForm'
import { Link } from 'react-router-dom'
import { Settings, Car, Church, ChevronRight } from 'lucide-react'
import heroImage from '@/assets/church-parking-hero.jpg'

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-church-light via-background to-secondary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-blue/20 to-transparent" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <Church className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-primary">MIF Lisboa</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Estacionamento
                  <span className="block text-primary">da Igreja</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-lg">
                  Registre seu veículo de forma simples e segura para utilizar 
                  o estacionamento da Igreja MIF Lisboa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="group flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                    Área dos Obreiros
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Car className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">Rápido</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Registo em poucos minutos
                  </p>
                </div>
                
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Church className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">Seguro</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dados protegidos e seguros
                  </p>
                </div>
                
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Settings className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">Organizado</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gestão eficiente do espaço
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Registration Form */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <VehicleRegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Church className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">MIF Lisboa</span>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Sistema de Gestão de Estacionamento da Igreja
          </p>
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © 2024 MIF Lisboa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
