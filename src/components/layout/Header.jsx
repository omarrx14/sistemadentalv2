import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar pacientes, citas, tratamientos..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Dra. Carmen López</p>
            <p className="text-xs text-slate-500">Odontología General</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary font-bold overflow-hidden border border-slate-200">
            CL
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
