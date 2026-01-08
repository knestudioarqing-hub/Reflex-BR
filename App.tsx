import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, TrendingUp, User, Calendar, Menu, X, ArrowRight, Puzzle, MessageSquare, Plus, Star } from 'lucide-react';

// --- Types ---
interface WidgetProps {
  type: 'sale' | 'schedule';
  title: string;
  subtitle: string;
  date: string;
  rotation: string;
  position: string;
  delay: string;
  animation: string;
}

// --- Helper Hooks ---

const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (containerRef.current) observer.unobserve(containerRef.current);
      }
    }, options);

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [options]);

  return [containerRef, isVisible] as const;
};

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Show if scrolling up or at the very top, hide if scrolling down
        if (currentScrollY === 0 || currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsVisible(false);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div className="w-full max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-black w-32">
          Reflex
        </div>

        {/* Desktop Menu - Pill Shape */}
        <div className="hidden md:flex items-center bg-[#F0F0F0] rounded-full px-2 py-1.5 shadow-sm">
          <a href="#" className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full shadow-sm transition-all">
            Integrações
          </a>
          <a href="#" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Depoimentos
          </a>
          <a href="#" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Entregáveis
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block w-32 text-right">
          <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">
            Agendar chamada
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 md:hidden border border-gray-100">
          <a href="#" className="font-semibold text-lg text-black">Integrações</a>
          <a href="#" className="font-medium text-lg text-gray-600">Depoimentos</a>
          <a href="#" className="font-medium text-lg text-gray-600">Entregáveis</a>
          <button className="bg-black text-white w-full py-3 rounded-full font-semibold mt-2">
            Agendar chamada
          </button>
        </div>
      )}
    </nav>
  );
};

const SalesWidget = ({ title, subtitle, date, rotation, position, animation }: WidgetProps) => (
  <div 
    className={`absolute hidden lg:flex flex-col bg-white p-4 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 w-64 ${rotation} ${position} ${animation} z-10 transition-transform hover:scale-105 duration-300`}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{date}</span>
    </div>
    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
      <div className="bg-green-100 p-2 rounded-lg text-green-600">
        <TrendingUp size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-sm font-bold text-gray-900">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ScheduleWidget = ({ title, subtitle, date, rotation, position, animation }: WidgetProps) => (
  <div 
    className={`absolute hidden lg:flex flex-col bg-white p-4 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 w-72 ${rotation} ${position} ${animation} z-10 transition-transform hover:scale-105 duration-300`}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{date}</span>
    </div>
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
             <User size={20} className="text-gray-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-3 h-3 rounded-full"></div>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-sm font-bold text-gray-900">{subtitle}</p>
      </div>
    </div>
  </div>
);

const InfiniteLogoCarousel = () => {
  // Using text as logos for a clean, typographic look typical of modern SaaS landing pages
  const logos = [
    "Hotmart", "Kiwify", "Eduzz", "Ticto", "Braip", "ClickBank", "Vimeo", "Stripe", "Monetizze", "PerfectPay"
  ];

  return (
    <div className="relative w-full overflow-hidden py-10 opacity-70">
      {/* Gradient Masks for fading effect */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#F9F9F9] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#F9F9F9] to-transparent z-10"></div>

      <div className="flex w-[200%] animate-scroll">
        {/* First Loop */}
        <div className="flex w-1/2 justify-around items-center">
          {logos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="flex items-center justify-center px-8">
              <span className="text-2xl font-bold text-[#616161] uppercase tracking-widest hover:text-black transition-colors cursor-default whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
        {/* Second Loop (Duplicate for seamless scroll) */}
        <div className="flex w-1/2 justify-around items-center">
          {logos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="flex items-center justify-center px-8">
              <span className="text-2xl font-bold text-[#616161] uppercase tracking-widest hover:text-black transition-colors cursor-default whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IntegrationsSection = () => {
  // Logos list based on the image
  const integrations = [
    { name: "Notion", url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" },
    { name: "PayPal", url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { name: "Zapier", url: "https://cdn.worldvectorlogo.com/logos/zapier-1.svg" }, // Orange asterisk
    { name: "Shopify", url: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
    { name: "Google Ads", url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" },
    { name: "WordPress", url: "https://upload.wikimedia.org/wikipedia/commons/9/98/WordPress_blue_logo.svg" },
    { name: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
    { name: "Mailchimp", url: "https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg" },
    { name: "LinkedIn", url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Meta-Logo.png" },
    { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "Skool", url: "https://pbs.twimg.com/profile_images/1531688649852899329/5sO23oOQ_400x400.jpg" }, // Skool logo approximation
  ];

  return (
    <section className="w-full px-4 pb-24 flex justify-center">
      <div className="max-w-7xl w-full bg-[#1C2E2A] rounded-[48px] p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ 
               backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2E2A] via-transparent to-transparent pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5 mb-8">
            <Puzzle size={14} className="text-gray-300" />
            <span className="text-gray-200 text-xs font-semibold uppercase tracking-wider">Integrações</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
            Landing pronta? Hora de integrar tudo
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 text-lg mb-2 max-w-2xl">
            Entendemos o esforço de substituir ferramentas que você usa há muito tempo no seu processo.
          </p>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl">
            Por isso, <span className="text-white font-medium">integramos as ferramentas</span> que você já utiliza no seu dia a dia.
          </p>

          {/* Link */}
          <a href="#" className="text-gray-300 text-sm font-medium underline underline-offset-4 hover:text-white transition-colors mb-12">
            +300 integrações para o seu negócio
          </a>

          {/* Logos Grid */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 max-w-3xl">
            {integrations.map((logo, index) => (
              <div 
                key={index} 
                className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center p-3 shadow-lg hover:scale-110 transition-transform duration-300 cursor-default"
              >
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="bg-white text-[#1C2E2A] px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
            Quero escalar minhas vendas
          </button>

        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ricardo M.",
      role: "Estrategista Digital",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      text: "A página se pagou na primeira semana. O design profissional passou a autoridade que eu precisava para vender meu high-ticket com mais facilidade."
    },
    {
      name: "Fernanda S.",
      role: "Mentora de Carreira",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      text: "Eu tinha vergonha de mandar tráfego para meu site antigo. Agora sinto orgulho. O visual ficou incrível e super alinhado com a minha marca pessoal."
    },
    {
      name: "Carlos E.",
      role: "Dono de Agência",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      text: "Impressionante a velocidade. Em 3 dias estava tudo no ar e integrado. Minha taxa de conversão subiu de 1% para 4% logo na primeira campanha."
    },
    {
      name: "Juliana P.",
      role: "Infoprodutora",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      text: "Estava travada no tráfego, mas a nova landing page destravou meu escala. O suporte foi excepcional durante todo o processo de implementação."
    }
  ];

  return (
    <section className="w-full py-24 px-4 bg-[#F9F9F9] flex flex-col items-center">
      {/* Badge */}
      <div className="mb-8 text-center">
        <span className="inline-block bg-white border border-gray-200 px-8 py-3 rounded-full text-sm font-medium text-gray-600 shadow-sm">
          Depoimentos
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight text-center max-w-4xl">
        +75 clientes já aumentaram suas vendas graças a uma imagem profissional e única
      </h2>

      {/* Subheading */}
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium text-center mb-16">
        Eles deixaram o template genérico e amador para adotar um design de alta conversão e se posicionar no topo do mercado.
      </p>

      {/* Testimonials Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Text */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium">
              "{item.text}"
            </p>
            
            {/* Name & Role (Optional visual cue) */}
            <div className="mt-auto">
              <h4 className="text-gray-900 font-bold text-lg">{item.name}</h4>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wide">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const NumberCounter = ({ end, duration = 2000, suffix = "", decimals = 0 }: { end: number, duration?: number, suffix?: string, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Ease out quart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(easeProgress * end);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

const InteractiveGridBackground = () => {
  // Generate a grid of "soft" tiles
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-[#F9F9F9]"></div>
      
      {/* Grid container */}
      <div className="w-full h-full flex flex-wrap content-start justify-center opacity-40 md:opacity-50">
         {Array.from({ length: 60 }).map((_, i) => (
           <div 
             key={i}
             className="w-24 h-24 md:w-32 md:h-32 m-2 bg-white rounded-[24px] shadow-[inset_0_0_20px_rgba(0,0,0,0.01)] animate-pulse"
             style={{
               animationDelay: `${Math.random() * 5}s`,
               animationDuration: `${3 + Math.random() * 4}s`
             }}
           ></div>
         ))}
      </div>

      {/* Gradient Masks to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F9] via-transparent to-[#F9F9F9] z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#F9F9F9] via-transparent to-[#F9F9F9] z-10"></div>
      
      {/* Radial fade for center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#F9F9F9_80%)] z-10"></div>
    </div>
  );
};

const AuthoritySection = () => {
  return (
    <section className="relative w-full py-32 overflow-hidden flex flex-col items-center text-center">
      <InteractiveGridBackground />

      <div className="relative z-20 max-w-4xl px-6 flex flex-col items-center">
        
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Sua autoridade é medida pelo que o cliente vê nos primeiros 5 segundos
        </h2>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 font-medium mb-12 max-w-2xl">
          É a porta de entrada para o seu cliente decidir <strong className="text-gray-900">ficar</strong> ou <strong className="text-gray-900">ir embora</strong>
        </p>

        {/* CTA Button */}
        <div className="mb-16">
           <button className="bg-black text-white px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
            Quero escalar minhas vendas
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-3xl border-t border-gray-200/50 pt-12 md:border-none md:pt-0">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2 tracking-tighter">
              <NumberCounter end={10} suffix="+" />
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Paises atendidos</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
             <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2 tracking-tighter">
              <NumberCounter end={75} suffix="+" />
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Landing pages entregues</p>
          </div>

           {/* Stat 3 */}
           <div className="flex flex-col items-center">
             <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2 tracking-tighter">
              <NumberCounter end={4.9} suffix="+" decimals={1} />
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Taxa de avaliação</p>
          </div>

        </div>

      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#F9F9F9] py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm font-medium">
          © 2024 - 2026. Todos direitos reservados a Reflex AC
        </p>
      </div>
    </footer>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden pt-20">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Floating Widgets */}
      <SalesWidget 
        type="sale"
        title="Venda confirmada: João L."
        subtitle="R$ 1.850,00"
        date="WED 21 MAY"
        rotation="-rotate-6"
        position="top-[25%] left-[5%] xl:left-[15%]"
        delay="0s"
        animation="animate-float-slow"
      />

      <ScheduleWidget 
        type="schedule"
        title="Agenda confirmada: Samuel Alba"
        subtitle="10:30 am - 11:00 am / Chamada estratégica"
        date="THU 21 MAY"
        rotation="rotate-3"
        position="top-[35%] right-[5%] xl:right-[15%]"
        delay="1s"
        animation="animate-float-medium"
      />
      
      <SalesWidget 
        type="sale"
        title="Venda confirmada: Matheus P."
        subtitle="R$ 2.400,00"
        date="SAT 21 MAY"
        rotation="rotate-2"
        position="bottom-[10%] left-[8%] xl:left-[18%]"
        delay="2s"
        animation="animate-float-fast"
      />

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto space-y-8 animate-fade-in-up w-full">
        
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-block bg-[#B0B5B9] bg-opacity-60 text-white backdrop-blur-sm px-6 py-2 rounded-full text-sm font-bold shadow-sm tracking-wide">
            Infoprodutores, mentores e Donos de agencias
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
            Sua landing page do zero em 3 dias
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF5500] leading-[1.2] tracking-tight">
            Otimizada para transformar cliques em vendas reais
          </h2>
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg text-gray-600 font-medium leading-relaxed">
          Descubra em uma <span className="text-black font-bold">call gratuita</span> como vamos estruturar sua landing page para parar de <span className="text-black font-bold">queimar dinheiro</span> com anúncios e transformar seu tráfego em vendas recorrentes
        </p>

        {/* CTA Button */}
        <div className="pt-8 pb-4">
          <button className="group relative inline-flex items-center justify-center bg-black text-white px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
            Quero escalar minhas vendas
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Infinite Carousel - Added Below CTA */}
        <div className="pt-8 w-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Empresas que confiam</p>
          <InfiniteLogoCarousel />
        </div>

      </div>
    </section>
  );
};

const DeliverablesSection = () => {
  return (
    <section className="w-full py-24 px-4 bg-[#F9F9F9] flex flex-col items-center">
      {/* Badge */}
      <div className="mb-8 text-center">
        <span className="inline-block bg-white border border-gray-200 px-8 py-3 rounded-full text-sm font-medium text-gray-600 shadow-sm transition-transform hover:scale-105">
          Entregáveis
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight text-center">
        O que vamos te entregar?
      </h2>

      {/* Description */}
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium text-center mb-16">
        Após a entrega, queremos que você tenha <strong className="text-gray-900 font-bold">100% de autonomia</strong> sobre a sua landing page, sem depender de terceiros, para que a sua própria equipe possa gerenciá-la
      </p>

      {/* Cards Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: 72h */}
        <div className="group relative bg-white rounded-[32px] p-8 h-[260px] md:h-[280px] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10 max-w-[60%] flex flex-col justify-start h-full">
            <h3 className="text-2xl md:text-3xl text-gray-800 leading-tight">
              Implementação completa da landing page em <strong className="font-bold">72h</strong>
            </h3>
          </div>
          <div className="absolute bottom-[-20px] right-[-20px] w-[50%] h-[80%] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
             <img 
               src="https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=400" 
               alt="Relógio" 
               className="w-full h-full object-contain object-bottom-right opacity-90 mix-blend-multiply" 
             />
          </div>
        </div>

        {/* Card 2: Controle Total */}
        <div className="group relative bg-white rounded-[32px] p-8 h-[260px] md:h-[280px] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10 max-w-[55%] flex flex-col justify-start h-full">
            <h3 className="text-2xl md:text-3xl text-gray-800 leading-tight">
              <strong className="font-bold">Controle total</strong> da sua landing page
            </h3>
          </div>
          <div className="absolute bottom-[-20px] right-[-20px] w-[55%] h-[80%] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600" 
               alt="Dashboard Control" 
               className="w-full h-full object-contain object-bottom-right rounded-tl-xl shadow-sm" 
             />
          </div>
        </div>

        {/* Card 3: Design Sob Medida */}
        <div className="group relative bg-white rounded-[32px] p-8 h-[260px] md:h-[280px] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10 max-w-[55%] flex flex-col justify-start h-full">
            <h3 className="text-2xl md:text-3xl text-gray-800 leading-tight">
              Design <strong className="font-bold">100% sob medida</strong>
            </h3>
          </div>
          <div className="absolute bottom-[-15px] right-[-15px] w-[55%] h-[85%] transition-transform duration-500 group-hover:scale-105">
             <img 
               src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=500" 
               alt="Design Tools" 
               className="w-full h-full object-contain object-bottom-right opacity-90" 
             />
          </div>
        </div>

        {/* Card 4: Automacoes */}
        <div className="group relative bg-white rounded-[32px] p-8 h-[260px] md:h-[280px] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10 max-w-[60%] flex flex-col justify-start h-full">
            <h3 className="text-2xl md:text-3xl text-gray-800 leading-tight">
              Integração completa de <strong className="font-bold">automações e CRM</strong>
            </h3>
          </div>
          <div className="absolute bottom-[-20px] right-[-20px] w-[55%] h-[80%] transition-transform duration-500 group-hover:scale-105 group-hover:translate-x-1">
             <img 
               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" 
               alt="CRM Dashboard" 
               className="w-full h-full object-contain object-bottom-right rounded-tl-xl shadow-sm" 
             />
          </div>
        </div>

      </div>
    </section>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans selection:bg-[#FF5500] selection:text-white">
      <Navbar />
      <Hero />
      <DeliverablesSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <AuthoritySection />
      <Footer />
    </div>
  );
}

export default App;