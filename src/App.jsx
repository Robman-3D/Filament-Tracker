import { useState } from 'react';
import { Heart, LayoutDashboard, Calculator, Users, Menu, Briefcase, Package, LogOut } from 'lucide-react';
import FilamentTracker from './components/FilamentTracker';
import Accounting from './components/Accounting';
import Clients from './components/Clients';
import Projects from './components/Projects';
import ProductSpecs from './components/ProductSpecs';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_token') === 'true';
  });
  const [activeTab, setActiveTab] = useState('filaments');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Common button styles
  const getButtonClass = (tabName) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full
    ${activeTab === tabName
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
      : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
    }
  `;

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', 'true');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-[#000597] text-white flex overflow-hidden font-sans">
      {/* Background Hearts Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none flex flex-wrap justify-center content-start gap-12 p-8 fixed">
        {Array.from({ length: 50 }).map((_, i) => (
          <Heart key={i} size={48} className="text-white/10 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-[#000470]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Robman 3D Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg tracking-tight text-blue-100">ROBMAN 3D</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          <Menu size={24} />
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#000597] border-b border-white/10 shadow-2xl p-4 flex flex-col gap-2 animate-slide-in-top">
            <button onClick={() => { setActiveTab('filaments'); setIsMobileMenuOpen(false) }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'filaments' ? 'bg-blue-600 text-white' : 'text-blue-200'}`}>
              <LayoutDashboard size={20} /> Filamentos
            </button>
            <button onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false) }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-blue-200'}`}>
              <Briefcase size={20} /> Encargos
            </button>
            <button onClick={() => { setActiveTab('accounting'); setIsMobileMenuOpen(false) }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'accounting' ? 'bg-emerald-600 text-white' : 'text-blue-200'}`}>
              <Calculator size={20} /> Contabilidad
            </button>
            <button onClick={() => { setActiveTab('productspecs'); setIsMobileMenuOpen(false) }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'productspecs' ? 'bg-purple-600 text-white' : 'text-blue-200'}`}>
              <Package size={20} /> Proyectos
            </button>
            <button onClick={() => { setActiveTab('clients'); setIsMobileMenuOpen(false) }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'clients' ? 'bg-pink-600 text-white' : 'text-blue-200'}`}>
              <Users size={20} /> Clientes
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-300 hover:bg-red-500/20 mt-2 border-t border-white/10"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 h-screen z-20 bg-white shadow-2xl sticky top-0">
        <div className="p-6 flex flex-col items-center gap-4 mb-2 border-b border-slate-100/50 pb-8 pt-8">
          <img src="/logo.png" alt="Robman 3D Logo" className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition duration-500" />
          <div className="text-center">
            <h1 className="font-extrabold text-2xl tracking-wide text-blue-900">ROBMAN 3D</h1>
            <p className="text-sm text-blue-400 font-medium uppercase tracking-wider">Gestión Integral</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3 pt-4">
          <button onClick={() => setActiveTab('filaments')} className={getButtonClass('filaments')}>
            <LayoutDashboard size={22} className={activeTab === 'filaments' ? 'text-white' : ''} />
            <span className="font-semibold text-lg">Filamentos</span>
          </button>
          <button onClick={() => setActiveTab('projects')} className={getButtonClass('projects')}>
            <Briefcase size={22} className={activeTab === 'projects' ? 'text-white' : ''} />
            <span className="font-semibold text-lg">Encargos</span>
          </button>
          <button onClick={() => setActiveTab('accounting')} className={getButtonClass('accounting')}>
            <Calculator size={22} className={activeTab === 'accounting' ? 'text-white' : ''} />
            <span className="font-semibold text-lg">Contabilidad</span>
          </button>
          <button onClick={() => setActiveTab('productspecs')} className={getButtonClass('productspecs')}>
            <Package size={22} className={activeTab === 'productspecs' ? 'text-white' : ''} />
            <span className="font-semibold text-lg">Proyectos</span>
          </button>
          <button onClick={() => setActiveTab('clients')} className={getButtonClass('clients')}>
            <Users size={22} className={activeTab === 'clients' ? 'text-white' : ''} />
            <span className="font-semibold text-lg">Clientes</span>
          </button>

          <div className="pt-8 mt-4 border-t border-slate-100/50">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('auth_token');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={22} />
              <span className="font-semibold text-lg">Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 text-center">
            <p className="text-xs text-blue-400 font-bold">
              ROBMAN SYSTEM<br />
              <span className="font-normal opacity-70">Versión 1.2 Pro</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 h-screen overflow-y-auto pt-20 md:pt-8 pb-10 px-4 scroll-smooth">
        <div className="mx-auto w-full">
          {activeTab === 'filaments' && <FilamentTracker />}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'accounting' && <Accounting />}
          {activeTab === 'productspecs' && <ProductSpecs />}
          {activeTab === 'clients' && <Clients />}
        </div>
      </main>

    </div>
  );
}

export default App;
