import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Home, Heart, ShoppingCart, Menu, Search, User, ChevronRight, Star,
  Truck, Tag, ArrowLeft, Check, Package, Gift, Zap, TrendingUp,
  Crown, Copy, MapPin, CreditCard, QrCode, Store, Plus, Minus, Trash2,
  Instagram, Clock, ShieldCheck, RefreshCw, Wifi, WifiOff,
  Settings, AlertCircle, CheckCircle, MessageCircle, LogOut,
  Lock, Mail, Timer, X, UserPlus, Phone, Eye, EyeOff, Percent,
  Flame, Sparkles, BadgePercent, Radio
} from "lucide-react";

/** * ART MÓVEIS - CONFIGURAÇÕES E CONSTANTES
 */
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80";
const WA_NUMBER = "558599340254";
const BACKEND_URL = "https://artmoveis-bling-1.onrender.com";

const GLOBAL_STYLES = `
  @keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
  @keyframes floatY{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
  @keyframes floatX{0%,100%{transform:translateX(0px) rotate(0deg)}50%{transform:translateX(10px) rotate(8deg)}}
  @keyframes pulse3{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.3;transform:scale(1.08)}}
  * {-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
  ::-webkit-scrollbar{display:none;}
  body { margin: 0; background: #f9fafb; }
`;

const FORMAT_BRL = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const CALC_OFF = (p, o) => Math.round(((o - p) / o) * 100);

/**
 * MOCK DATA
 */
const MOCK_PRODUCTS = [
  {id:1, name:"Sofá Retrátil Comfort Premium", category:"Estofados", price:2199, oldPrice:3499, image:PLACEHOLDER_IMG, sold:142, rating:4.8, desc:"Sofá retrátil suede alta qualidade.", isNew:false},
  {id:2, name:"Cama Box Casal Queen", category:"Box e Colchões", price:1899, oldPrice:2799, image:PLACEHOLDER_IMG, sold:98, rating:4.9, desc:"Molas ensacadas, base reforçada.", isNew:true},
  {id:3, name:"Mesa de Jantar 6 Lugares", category:"Sala de Jantar", price:1649, oldPrice:2299, image:PLACEHOLDER_IMG, sold:76, rating:4.7, desc:"Madeira maciça de alta durabilidade.", isNew:false}
];

const COUPONS = {
  ARTLOVERS: { type: "fixed", value: 50, label: "R$ 50 de desconto" },
  FRETEGRATIS: { type: "shipping", value: 0, label: "Frete grátis" },
  CHEFINHA10: { type: "percent", value: 10, label: "10% de desconto" }
};

/**
 * HOOKS CUSTOMIZADOS
 */
function useBling() {
  const [status, setStatus] = useState("idle");
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${BACKEND_URL}/produtos`);
      const data = await response.json();
      if (data.ok && data.produtos?.length > 0) {
        setProducts(data.produtos.map(p => ({ ...p, isNew: Math.random() > 0.7 })));
        setLastSync(new Date());
        setStatus("ok");
      }
    } catch (e) {
      console.warn("Erro ao sincronizar Bling:", e);
      setStatus("error");
    } finally {
      setSyncing(false);
    }
  }, []);

  const connect = useCallback(async () => {
    setStatus("connecting");
    try {
      const h = await fetch(`${BACKEND_URL}/health`).then(r => r.json());
      if (h.autenticado) {
        await sync();
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("error");
    }
  }, [sync]);

  useEffect(() => { connect(); }, [connect]);

  return { status, products, syncing, lastSync, connect, sync };
}

function useAuth() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const login = (email, pass) => {
    const found = users.find(u => u.email === email && u.pass === pass);
    if (found) {
      setUser({ ...found });
      return true;
    }
    return false;
  };

  const register = (name, email, phone, pass) => {
    if (users.find(u => u.email === email)) return { ok: false, msg: "E-mail já cadastrado" };
    const newUser = { name, email, phone, pass, avatar: name[0].toUpperCase() };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { ok: true };
  };

  return { user, orders, login, register, logout: () => setUser(null), addOrder: (o) => setOrders(p => [o, ...p]) };
}

/**
 * COMPONENTES DE INTERFACE
 */
function Stars({ rating, size = 13 }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke={s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"} />
      ))}
    </div>
  );
}

function PCard({ p, onPress, onCart, favs, onFav }) {
  const discount = CALC_OFF(p.price, p.oldPrice);
  const isFav = favs?.includes(p.id);
  
  return (
    <div onClick={() => onPress(p)} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer flex-shrink-0 transition-transform active:scale-95" style={{ width: 152, animation: "fadeInUp .25s ease" }}>
      <div className="relative">
        <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">{discount}% OFF</span>
        <button onClick={(e) => { e.stopPropagation(); onFav(p.id); }} className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center">
          <Heart size={14} fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "#9ca3af"} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[11px] text-gray-600 line-clamp-2 h-8">{p.name}</p>
        <p className="text-red-600 font-bold text-sm mt-1">{FORMAT_BRL(p.price)}</p>
        <button onClick={(e) => { e.stopPropagation(); onCart(p); }} className="w-full mt-2 bg-red-600 text-white text-[10px] py-2 rounded-xl font-bold">Comprar</button>
      </div>
    </div>
  );
}

/**
 * COMPONENTE PRINCIPAL (APP)
 */
export default function App() {
  const bling = useBling();
  const auth = useAuth();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [favs, setFavs] = useState([]);
  const [cat, setCat] = useState("Todos");

  // Otimização de filtro com useMemo
  const filteredProducts = useMemo(() => {
    if (cat === "Todos") return bling.products;
    if (cat === "Promoções e descontos") return bling.products.filter(p => CALC_OFF(p.price, p.oldPrice) >= 15);
    return bling.products.filter(p => p.category === cat);
  }, [cat, bling.products]);

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <style>{GLOBAL_STYLES}</style>
      
      {/* HEADER SIMPLIFICADO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 p-4 pt-10 flex items-center gap-3">
        <div className="flex-1 bg-white rounded-2xl flex items-center px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input className="flex-1 ml-2 text-sm outline-none" placeholder="Buscar na Art Móveis..." />
        </div>
        <div className="relative" onClick={() => setPage("cart")}>
          <ShoppingCart className="text-white" />
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
        </div>
      </header>

      {/* CONTEÚDO DINÂMICO */}
      <main className="pt-28 px-4">
        {page === "home" && (
          <div className="space-y-6">
            <section>
              <h2 className="font-bold text-gray-800 mb-4">Categorias</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {["Todos", "Estofados", "Quarto", "Sala de Jantar"].map(c => (
                  <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap ${cat === c ? "bg-red-600 text-white" : "bg-white text-gray-500"}`}>{c}</button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              {filteredProducts.map(p => (
                <PCard key={p.id} p={p} onPress={setSelectedProduct} onCart={addToCart} favs={favs} onFav={(id) => setFavs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])} />
              ))}
            </section>
          </div>
        )}
      </main>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50">
        <button onClick={() => setPage("home")}><Home className={page === "home" ? "text-red-600" : "text-gray-400"} /></button>
        <button onClick={() => setPage("favs")}><Heart className={page === "favs" ? "text-red-600" : "text-gray-400"} /></button>
        <button onClick={() => setPage("cart")}><ShoppingCart className={page === "cart" ? "text-red-600" : "text-gray-400"} /></button>
        <button onClick={() => setPage("user")}><User className={page === "user" ? "text-red-600" : "text-gray-400"} /></button>
      </nav>
    </div>
  );
}
