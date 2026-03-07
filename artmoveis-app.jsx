import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Heart, ShoppingCart, Menu, Search, Bell, User,
  ChevronRight, Star, Truck, Tag, ArrowLeft, Check,
  Package, Gift, Zap, TrendingUp, Radio, Crown, Copy,
  MapPin, CreditCard, QrCode, Store, Plus, Minus, Trash2,
  Instagram, Percent, Clock, ShieldCheck, RefreshCw,
  Wifi, WifiOff, Settings, Key, AlertCircle, CheckCircle
} from "lucide-react";

const MOCK_PRODUCTS = [
  { id:1, name:"Sofá Retrátil Comfort Premium 3 Lugares", category:"Estofados",    price:2199, oldPrice:3499, image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", sold:142, rating:4.8, reviews:38, desc:"Sofá retrátil e reclinável com tecido suede de alta qualidade. Estrutura em madeira maciça, espuma D33." },
  { id:2, name:"Cama Box Casal Queen Molas Ensacadas",     category:"Box e Colchões",price:1899, oldPrice:2799, image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", sold:98,  rating:4.9, reviews:55, desc:"Conjunto box casal queen com colchão de molas ensacadas. Base em madeira compensada naval." },
  { id:3, name:"Mesa de Jantar 6 Lugares Madeira Maciça", category:"Sala de Jantar",price:1649, oldPrice:2299, image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80", sold:76,  rating:4.7, reviews:29, desc:"Mesa de jantar retangular em madeira maciça. Comporta 6 pessoas com conforto." },
  { id:4, name:"Guarda-Roupa Casal 6 Portas Espelhado",   category:"Quarto",        price:2349, oldPrice:3199, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", sold:110, rating:4.6, reviews:41, desc:"Guarda-roupa casal 6 portas com espelho de corpo inteiro. MDF 15mm com puxadores cromados." },
  { id:5, name:"Sofá Chaise Veludo Bege 4 Lugares",       category:"Estofados",    price:3199, oldPrice:4299, image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80", sold:63,  rating:4.9, reviews:22, desc:"Sofá chaise luxuoso em veludo bege. Pés em aço escovado dourado." },
  { id:6, name:"Mesa de Centro Vidro Temperado",           category:"Sala de estar",price:699,  oldPrice:999,  image:"https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&q=80", sold:189, rating:4.5, reviews:67, desc:"Mesa de centro com tampo em vidro temperado 8mm e estrutura em aço preto." },
  { id:7, name:"Rack TV 60' Suspenso com LED",             category:"Sala de estar",price:1299, oldPrice:1799, image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80", sold:134, rating:4.7, reviews:48, desc:"Rack para TV até 60 polegadas com iluminação LED embutida. MDF lacado branco." },
  { id:8, name:"Colchão Casal Mola Bonnell Anti-Stress",   category:"Box e Colchões",price:989,  oldPrice:1399, image:"https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80", sold:221, rating:4.8, reviews:89, desc:"Colchão casal molas Bonnell, revestimento anti-stress. Altura 22cm, bordas reforçadas." },
  { id:9, name:"Conjunto Cozinha Mesa + 4 Cadeiras",       category:"Cozinha",      price:1149, oldPrice:1599, image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", sold:87,  rating:4.6, reviews:33, desc:"Mesa redonda para cozinha com 4 cadeiras estofadas. Estrutura em aço e tampo em MDF." },
  { id:10,name:"Poltrona Decorativa Giratória Linho",      category:"Sala de estar",price:879,  oldPrice:1199, image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", sold:55,  rating:4.7, reviews:19, desc:"Poltrona decorativa giratória com revestimento em linho natural. Pé em madeira maciça." },
];

const COUPONS = {
  ARTLOVERS:  { type:"fixed",   value:50, label:"R$ 50 de desconto" },
  FRETEGRATIS:{ type:"shipping",value:0,  label:"Frete grátis" },
  CHEFINHA10: { type:"percent", value:10, label:"10% de desconto" },
};

const CATEGORIES = ["Todos","Estofados","Box e Colchões","Quarto","Sala de estar","Cozinha","Sala de Jantar","Promoções e descontos"];

const fmt    = (v) => Number(v).toLocaleString("pt-BR",{ style:"currency", currency:"BRL" });
const pctOff = (p,o) => Math.round(((o-p)/o)*100);

function calcShipping(cep, firstPurchase) {
  if (firstPurchase) return 0;
  const c = cep.replace(/\D/g,"");
  return c.startsWith("60")||c.startsWith("61") ? 80 : 120;
}

// ─── BACKEND LOCAL (gerado com suas credenciais Bling) ───────────────────────
const BACKEND = "https://artmoveis-bling-1.onrender.com";

async function backendGet(path) {
  const res = await fetch(BACKEND + path);
  if (!res.ok) throw new Error("Backend " + res.status);
  return res.json();
}

async function backendPost(path, body) {
  const res = await fetch(BACKEND + path, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function useBling() {
  const [status,setStatus]     = useState("idle"); // idle | connecting | ok | error
  const [products,setProducts] = useState(MOCK_PRODUCTS);
  const [syncing,setSyncing]   = useState(false);
  const [lastSync,setLastSync] = useState(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const data = await backendGet("/produtos");
      if (data.ok && data.produtos?.length > 0) {
        setProducts(data.produtos);
        setLastSync(new Date());
        setStatus("ok");
      }
    } catch(e) { console.warn("Sync falhou:", e.message); setStatus("error"); }
    finally { setSyncing(false); }
  }, []);

  const connect = async () => {
    setStatus("connecting");
    try {
      const health = await backendGet("/health");
      if (health.autenticado) { await sync(); return; }
      // Abre login Bling em nova aba
      const win = window.open(BACKEND + "/auth/login", "_blank", "width=600,height=700");
      // Aguarda fechar e tenta sincronizar
      const check = setInterval(async () => {
        if (win?.closed) {
          clearInterval(check);
          await sync();
        }
      }, 1000);
    } catch {
      setStatus("error");
    }
  };

  const clearBling = () => { setStatus("idle"); setProducts(MOCK_PRODUCTS); };

  // Tenta conectar automaticamente ao carregar
  useEffect(() => { connect(); }, []); // eslint-disable-line

  return { status, products, syncing, lastSync, connect, sync, clearBling };
}

function BlingSetupScreen({ bling, onClose }) {
  const info = {
    idle:       { bg:"bg-gray-50",   text:"text-gray-600",   icon:<Key size={16}/>,                                msg:"Backend local não detectado" },
    connecting: { bg:"bg-yellow-50", text:"text-yellow-700", icon:<RefreshCw size={16} className="animate-spin"/>,msg:"Conectando ao Bling..." },
    ok:         { bg:"bg-green-50",  text:"text-green-700",  icon:<CheckCircle size={16}/>,                        msg:"Conectado! Produtos sincronizados ✓" },
    error:      { bg:"bg-red-50",    text:"text-red-700",    icon:<AlertCircle size={16}/>,                        msg:"Erro ao conectar. Backend rodando?" },
  }[bling.status] || { bg:"bg-gray-50", text:"text-gray-600", icon:<Key size={16}/>, msg:"..." };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 space-y-5" style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl text-gray-800">Integração Bling</h2>
            <p className="text-xs text-gray-400 mt-0.5">Produtos, preços e estoque em tempo real</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-bold leading-none">×</button>
        </div>

        <div className={"flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold "+info.bg+" "+info.text}>
          {info.icon} {info.msg}
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-blue-800">🚀 Como ativar (só uma vez):</p>
          <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Coloque o arquivo <strong>server.js</strong> em uma pasta</li>
            <li>Rode no terminal: <code className="bg-blue-100 px-1 rounded">npm install && npm start</code></li>
            <li>Clique em <strong>"Conectar"</strong> abaixo e faça login no Bling</li>
            <li>Pronto — produtos carregados automaticamente! ✅</li>
          </ol>
        </div>

        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
          <p className="text-xs font-bold text-gray-600 mb-1">Backend rodando em:</p>
          <code className="text-xs text-gray-800 font-mono">https://artmoveis-bling-1.onrender.com</code>
        </div>

        <div className="flex gap-2">
          <button onClick={()=>{ bling.connect(); }}
            disabled={bling.status==="connecting"||bling.syncing}
            className="flex-1 bg-red-600 text-white py-3.5 rounded-2xl font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-transform">
            {bling.status==="connecting"
              ? <><RefreshCw size={15} className="animate-spin"/>Conectando...</>
              : <><Wifi size={15}/>Conectar ao Bling</>}
          </button>
          {bling.status==="ok" && (
            <button onClick={()=>bling.sync()}
              className="px-4 py-3.5 bg-gray-100 rounded-2xl text-gray-700 font-bold text-sm flex items-center gap-1">
              <RefreshCw size={14} className={bling.syncing?"animate-spin":""}/>Sync
            </button>
          )}
        </div>

        {bling.status==="ok" && (
          <button onClick={()=>{ bling.clearBling(); onClose(); }}
            className="w-full text-center text-xs text-red-400 font-semibold py-1">
            Desconectar
          </button>
        )}

        {bling.lastSync && (
          <p className="text-center text-xs text-gray-400">
            Última sync: {bling.lastSync.toLocaleTimeString("pt-BR")} · {bling.products.length} produtos
          </p>
        )}
      </div>
    </div>
  );
}

function BlingBadge({ bling, onClick }) {
  if (bling.status==="ok") return (
    <button onClick={onClick} className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <Wifi size={10}/> Bling ✓
    </button>
  );
  if (bling.syncing) return (
    <button onClick={onClick} className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <RefreshCw size={10} className="animate-spin"/> Sincronizando
    </button>
  );
  return (
    <button onClick={onClick} className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
      <WifiOff size={10}/> Conectar Bling
    </button>
  );
}

function Stars({ rating, size=14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={size} fill={s<=Math.round(rating)?"#f59e0b":"none"} stroke={s<=Math.round(rating)?"#f59e0b":"#d1d5db"}/>
      ))}
    </div>
  );
}

function ProductCard({ product, onPress, onAddCart }) {
  const pct = pctOff(product.price, product.oldPrice);
  return (
    <div onClick={()=>onPress(product)} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow min-w-[160px] w-40 flex-shrink-0">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-32 object-cover"
          onError={e=>{ e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"; }}/>
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pct}% OFF</span>
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-600 line-clamp-2 leading-tight mb-1">{product.name}</p>
        <p className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</p>
        <p className="text-base font-extrabold text-red-600">{fmt(product.price)}</p>
        <div className="flex items-center gap-1 mt-1">
          <Truck size={10} className="text-green-600"/>
          <span className="text-[10px] text-green-600 font-semibold">Frete Rápido</span>
        </div>
        <button onClick={e=>{ e.stopPropagation(); onAddCart(product); }}
          className="mt-2 w-full bg-red-600 text-white text-xs py-1.5 rounded-xl font-bold active:scale-95 transition-transform">
          Adicionar
        </button>
      </div>
    </div>
  );
}

function Header({ cartCount, onCartPress, searchQuery, setSearchQuery, showBack, onBack, bling, onBlingPress }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50" style={{background:"linear-gradient(135deg,#b91c1c 0%,#ef4444 100%)"}}>
      <div className="px-3 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-2">
          {showBack
            ? <button onClick={onBack} className="text-white p-1"><ArrowLeft size={22}/></button>
            : <button className="text-white p-1"><User size={22}/></button>}
          <div className="flex-1 bg-white rounded-full flex items-center px-3 py-1.5 gap-2">
            <Search size={15} className="text-gray-400"/>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Buscar móveis..." className="flex-1 text-sm outline-none text-gray-700 bg-transparent"/>
          </div>
          <button onClick={onCartPress} className="text-white p-1 relative">
            <ShoppingCart size={22}/>
            {cartCount>0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button onClick={onBlingPress} className="text-white p-1"><Settings size={20}/></button>
        </div>
        <div className="flex items-center justify-between pb-1">
          <p className="text-white text-[11px] font-medium opacity-90">🚚 Entregamos para todo o Ceará!</p>
          <BlingBadge bling={bling} onClick={onBlingPress}/>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onNav, cartCount }) {
  const items=[{id:"home",icon:Home,label:"Início"},{id:"favorites",icon:Heart,label:"Favoritos"},{id:"cart",icon:ShoppingCart,label:"Carrinho"},{id:"menu",icon:Menu,label:"Menu"}];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50" style={{paddingBottom:"env(safe-area-inset-bottom)"}}>
      {items.map(({id,icon:Icon,label})=>(
        <button key={id} onClick={()=>onNav(id)} className="flex-1 flex flex-col items-center py-2 gap-0.5">
          <div className="relative">
            <Icon size={22} className={active===id?"text-red-600":"text-gray-400"}/>
            {id==="cart"&&cartCount>0&&<span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </div>
          <span className={"text-[10px] font-semibold "+(active===id?"text-red-600":"text-gray-400")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function BannerCarousel() {
  const [idx,setIdx]=useState(0);
  const banners=[
    {text:"Bem-vindo ao nosso App",sub:"A cara da Art Móveis",       icon:<Home size={32} className="text-white"/>,      bg:"from-red-700 to-red-500"},
    {text:"Seja um Art Lover",    sub:"Ganhe cupons exclusivos!",     icon:<Crown size={32} className="text-yellow-300"/>,bg:"from-red-800 to-rose-600"},
    {text:"Entrega Grátis",       sub:"Na sua primeira compra!",      icon:<Truck size={32} className="text-white"/>,     bg:"from-red-600 to-orange-500"},
  ];
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%3),3500); return()=>clearInterval(t); },[]);
  const b=banners[idx];
  return (
    <div className={"mx-4 rounded-2xl bg-gradient-to-r "+b.bg+" p-5 flex items-center justify-between shadow-lg relative overflow-hidden"} style={{minHeight:110}}>
      <div>
        <p className="text-white font-black text-lg leading-tight">{b.text}</p>
        <p className="text-white/80 text-sm mt-1">{b.sub}</p>
        <button className="mt-2 bg-white text-red-700 text-xs font-bold px-3 py-1 rounded-full">Saiba mais</button>
      </div>
      <div className="opacity-90">{b.icon}</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {banners.map((_,i)=><div key={i} className={"h-1.5 rounded-full transition-all "+(i===idx?"bg-white w-3":"bg-white/40 w-1.5")}/>)}
      </div>
    </div>
  );
}

function QuickLinks({ onNav }) {
  const links=[
    {id:"offers",      icon:<Tag size={20} className="text-red-600"/>,       label:"Ofertas"},
    {id:"coupons",     icon:<Gift size={20} className="text-red-600"/>,      label:"Cupons"},
    {id:"new",         icon:<Zap size={20} className="text-red-600"/>,       label:"Lançamentos"},
    {id:"bestsellers", icon:<TrendingUp size={20} className="text-red-600"/>,label:"Mais vendidos"},
    {id:"live",        icon:<Radio size={20} className="text-red-600"/>,     label:"Ofertas da Live"},
    {id:"artlovers",   icon:<Crown size={20} className="text-yellow-500"/>,  label:"Art Lovers"},
  ];
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
      {links.map(l=>(
        <button key={l.id} onClick={()=>onNav(l.id)} className="flex flex-col items-center gap-1 flex-shrink-0 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">{l.icon}</div>
          <span className="text-[10px] text-gray-600 font-semibold w-14 text-center leading-tight">{l.label}</span>
        </button>
      ))}
    </div>
  );
}

function CategoryBar({ active, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-1 scrollbar-hide border-b border-gray-100">
      {CATEGORIES.map(c=>(
        <button key={c} onClick={()=>onSelect(c)}
          className={"flex-shrink-0 pb-2 text-sm font-semibold whitespace-nowrap "+(active===c?"text-red-600 border-b-2 border-red-600":"text-gray-500")}>
          {c}
        </button>
      ))}
    </div>
  );
}

function ProductShelf({ title, items, onPress, onAddCart }) {
  if (!items.length) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="font-black text-gray-800 text-base">{title}</h2>
        <button className="text-red-600 text-xs font-semibold flex items-center gap-0.5">Ver tudo <ChevronRight size={14}/></button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {items.map(p=><ProductCard key={p.id} product={p} onPress={onPress} onAddCart={onAddCart}/>)}
      </div>
    </div>
  );
}

function HomePage({ products, onProductPress, onAddCart, onNav, blingStatus }) {
  const [cat,setCat]=useState("Todos");
  const filtered = cat==="Todos" ? products
    : cat==="Promoções e descontos" ? products.filter(p=>pctOff(p.price,p.oldPrice)>=20)
    : products.filter(p=>p.category===cat);
  return (
    <div className="space-y-4">
      <BannerCarousel/>
      <QuickLinks onNav={onNav}/>
      <CategoryBar active={cat} onSelect={setCat}/>
      {blingStatus==="ok" && (
        <div className="mx-4 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          <CheckCircle size={14} className="text-green-600 shrink-0"/>
          <p className="text-xs text-green-700 font-semibold">Produtos sincronizados direto do Bling ✓</p>
        </div>
      )}
      {cat==="Todos" ? (
        <>
          <ProductShelf title="🔥 Mais Vendidos"     items={[...products].sort((a,b)=>b.sold-a.sold).slice(0,6)}                                              onPress={onProductPress} onAddCart={onAddCart}/>
          <ProductShelf title="💰 Maiores Descontos"  items={[...products].sort((a,b)=>pctOff(b.price,b.oldPrice)-pctOff(a.price,a.oldPrice)).slice(0,6)}     onPress={onProductPress} onAddCart={onAddCart}/>
          <ProductShelf title="🛋 Estofados"          items={products.filter(p=>p.category==="Estofados")}                                                     onPress={onProductPress} onAddCart={onAddCart}/>
          <ProductShelf title="🛏 Quartos"            items={products.filter(p=>["Quarto","Box e Colchões"].includes(p.category))}                             onPress={onProductPress} onAddCart={onAddCart}/>
        </>
      ) : (
        <div className="px-4">
          <p className="text-sm text-gray-500 mb-3">{filtered.length} produto(s)</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p=>(
              <div key={p.id} onClick={()=>onProductPress(p)} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover"/>
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pctOff(p.price,p.oldPrice)}% OFF</span>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 line-clamp-2">{p.name}</p>
                  <p className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</p>
                  <p className="text-sm font-extrabold text-red-600">{fmt(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductPage({ product, onAddCart, firstPurchase }) {
  const [cep,setCep]=useState(""); const [shipping,setShipping]=useState(null);
  const [ur,setUr]=useState(0); const [hov,setHov]=useState(0);
  const [comment,setComment]=useState("");
  const [reviews,setReviews]=useState([{user:"Maria S.",stars:5,text:"Lindo demais! Chegou antes do prazo."},{user:"João P.",stars:4,text:"Ótima qualidade, montagem fácil."}]);

  function checkCep(){ const c=cep.replace(/\D/g,""); if(c.length<8) return alert("CEP inválido"); if(!c.startsWith("6")) return alert("Só CEPs do Ceará"); setShipping(calcShipping(c,firstPurchase)); }
  function submitReview(){ if(!ur) return alert("Selecione nota"); if(!comment.trim()) return alert("Escreva comentário"); setReviews(r=>[...r,{user:"Você",stars:ur,text:comment}]); setUr(0); setComment(""); }

  const pct=pctOff(product.price,product.oldPrice);
  return (
    <div className="pb-28">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" onError={e=>{e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80";}}/>
      <div className="p-4 bg-white shadow-md mx-4 -mt-6 rounded-2xl">
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pct}% OFF</span>
        <h1 className="text-gray-800 font-black text-base mt-2 leading-snug">{product.name}</h1>
        <p className="text-gray-400 line-through text-sm mt-1">{fmt(product.oldPrice)}</p>
        <p className="text-red-600 font-black text-3xl">{fmt(product.price)}</p>
        <div className="flex items-center gap-2 mt-1"><Stars rating={product.rating}/><span className="text-xs text-gray-500">({product.reviews} avaliações)</span></div>
        <div className="flex items-center gap-1 mt-2"><Truck size={14} className="text-green-600"/><span className="text-xs text-green-600 font-semibold">Frete Super Rápido disponível</span></div>
      </div>
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm"><h2 className="font-bold text-gray-800 mb-2">Descrição</h2><p className="text-sm text-gray-600 leading-relaxed">{product.desc}</p></div>
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={16} className="text-red-600"/>Calcular Frete</h2>
        <div className="flex gap-2">
          <input value={cep} onChange={e=>setCep(e.target.value)} maxLength={9} placeholder="CEP (apenas Ceará)" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"/>
          <button onClick={checkCep} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">OK</button>
        </div>
        {shipping!==null && <div className="mt-2 p-2 bg-green-50 rounded-xl flex items-center gap-2"><Truck size={14} className="text-green-600"/><span className="text-sm text-green-700 font-semibold">{shipping===0?"🎉 Frete Grátis (1ª compra)!":"Frete: "+fmt(shipping)}</span></div>}
      </div>
      <div className="mx-4 mt-4"><button onClick={()=>onAddCart(product)} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-transform">🛒 Adicionar ao Carrinho</button></div>
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-3">Avaliações ({reviews.length})</h2>
        {reviews.map((r,i)=>(
          <div key={i} className="border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">{r.user[0]}</div>
              <span className="text-sm font-semibold text-gray-700">{r.user}</span><Stars rating={r.stars} size={12}/>
            </div>
            <p className="text-xs text-gray-600">{r.text}</p>
          </div>
        ))}
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Deixe sua avaliação</h3>
        <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(s=><button key={s} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)} onClick={()=>setUr(s)}><Star size={22} fill={s<=(hov||ur)?"#f59e0b":"none"} stroke={s<=(hov||ur)?"#f59e0b":"#d1d5db"}/></button>)}</div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Conte sua experiência..." className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none h-20"/>
        <button onClick={submitReview} className="mt-2 w-full bg-gray-800 text-white py-2 rounded-xl text-sm font-bold">Enviar</button>
      </div>
    </div>
  );
}

function OffersPage({ products, onProductPress, onAddCart }) {
  const sorted=[...products].sort((a,b)=>pctOff(b.price,b.oldPrice)-pctOff(a.price,a.oldPrice));
  return (
    <div className="px-4 pb-24 space-y-3 mt-2">
      <h2 className="font-black text-gray-800 text-lg">🔥 Melhores Ofertas</h2>
      {sorted.map(p=>(
        <div key={p.id} onClick={()=>onProductPress(p)} className="bg-white rounded-2xl shadow-md flex gap-3 p-3 cursor-pointer">
          <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0"/>
          <div className="flex-1 min-w-0">
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pctOff(p.price,p.oldPrice)}% OFF</span>
            <p className="text-xs text-gray-700 font-semibold mt-1 line-clamp-2">{p.name}</p>
            <p className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</p>
            <p className="text-red-600 font-black text-base">{fmt(p.price)}</p>
            <button onClick={e=>{e.stopPropagation();onAddCart(p);}} className="mt-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">+ Carrinho</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CouponsPage() {
  const [copied,setCopied]=useState("");
  const list=[
    {code:"ARTLOVERS",  icon:<Crown size={24} className="text-yellow-500"/>,title:"Art Lovers",  desc:"R$ 50 de desconto para clientes fiéis",color:"from-yellow-50 to-orange-50",border:"border-yellow-300"},
    {code:"FRETEGRATIS",icon:<Truck size={24} className="text-green-600"/>, title:"Frete Grátis",desc:"Frete gratuito em qualquer pedido",     color:"from-green-50 to-emerald-50",border:"border-green-300"},
    {code:"CHEFINHA10", icon:<Percent size={24} className="text-red-600"/>, title:"Chefinha 10%",desc:"10% de desconto no total dos produtos", color:"from-red-50 to-rose-50",border:"border-red-300"},
  ];
  return (
    <div className="px-4 pb-24 space-y-4 mt-2">
      <h2 className="font-black text-gray-800 text-lg">🎁 Cupons Disponíveis</h2>
      {list.map(c=>(
        <div key={c.code} className={"bg-gradient-to-r "+c.color+" border "+c.border+" rounded-2xl p-4"}>
          <div className="flex items-center gap-3 mb-2">{c.icon}<div><p className="font-black text-gray-800">{c.title}</p><p className="text-xs text-gray-500">{c.desc}</p></div></div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-dashed border-gray-300">
            <span className="flex-1 font-mono font-bold text-gray-800 text-sm tracking-widest">{c.code}</span>
            <button onClick={()=>{navigator.clipboard?.writeText(c.code);setCopied(c.code);setTimeout(()=>setCopied(""),2000);}} className="flex items-center gap-1 text-red-600 text-xs font-bold">
              {copied===c.code?<><Check size={14}/>Copiado!</>:<><Copy size={14}/>Copiar</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BestSellersPage({ products, onProductPress }) {
  const sorted=[...products].sort((a,b)=>b.sold-a.sold);
  return (
    <div className="px-4 pb-24 space-y-3 mt-2">
      <div className="flex items-center gap-2"><TrendingUp size={20} className="text-red-600"/><h2 className="font-black text-gray-800 text-lg">Mais Vendidos</h2></div>
      <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/>Últimos 7 dias</p>
      {sorted.map((p,i)=>(
        <div key={p.id} onClick={()=>onProductPress(p)} className="bg-white rounded-2xl shadow-md flex gap-3 p-3 cursor-pointer">
          <span className={"font-black text-lg w-8 flex items-center justify-center flex-shrink-0 "+(i===0?"text-yellow-500":i===1?"text-gray-400":i===2?"text-amber-700":"text-gray-300")}>#{i+1}</span>
          <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0"/>
          <div className="flex-1 min-w-0"><p className="text-xs text-gray-700 font-semibold line-clamp-2">{p.name}</p><p className="text-red-600 font-black text-base">{fmt(p.price)}</p><p className="text-xs text-gray-400">{p.sold} vendidos</p></div>
        </div>
      ))}
    </div>
  );
}

function ArtLoversPage({ products, onProductPress, onAddCart }) {
  return (
    <div className="px-4 pb-24 mt-2">
      <div className="bg-gradient-to-r from-red-700 to-red-500 rounded-2xl p-4 mb-4 text-white">
        <div className="flex items-center gap-2 mb-1"><Crown size={20} className="text-yellow-300"/><h2 className="font-black text-lg">Art Lovers</h2></div>
        <p className="text-sm opacity-90">Volte a comprar e ganhe descontos exclusivos! ❤️</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map(p=>(
          <div key={p.id} onClick={()=>onProductPress(p)} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer border-2 border-red-100">
            <div className="relative">
              <img src={p.image} alt={p.name} className="w-full h-28 object-cover"/>
              <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-black px-1.5 py-0.5 rounded-full">♛ {pctOff(p.price,p.oldPrice)}% OFF</span>
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 line-clamp-2 font-semibold">{p.name}</p>
              <p className="text-red-600 font-black text-sm">{fmt(p.price)}</p>
              <button onClick={e=>{e.stopPropagation();onAddCart(p);}} className="mt-1.5 w-full bg-red-600 text-white text-xs py-1.5 rounded-xl font-bold">Adicionar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesPage({ products, onProductPress }) {
  return (
    <div className="px-4 pb-24 mt-2">
      <h2 className="font-black text-gray-800 text-lg mb-3">❤️ Favoritos</h2>
      {products.slice(0,4).map(p=>(
        <div key={p.id} onClick={()=>onProductPress(p)} className="bg-white rounded-2xl shadow-md flex gap-3 p-3 mb-3 cursor-pointer">
          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0"/>
          <div className="flex-1"><p className="text-xs font-semibold text-gray-700 line-clamp-2">{p.name}</p><p className="text-red-600 font-black text-base">{fmt(p.price)}</p></div>
          <Heart size={18} className="text-red-500" fill="#ef4444"/>
        </div>
      ))}
    </div>
  );
}

function CartPage({ cart, setCart, firstPurchase, setFirstPurchase }) {
  const [cep,setCep]=useState(""); const [shipping,setShipping]=useState(null);
  const [coupon,setCoupon]=useState(""); const [appliedCoupon,setAppliedCoupon]=useState(null);
  const [couponMsg,setCouponMsg]=useState(""); const [payMethod,setPayMethod]=useState("pix");
  const [done,setDone]=useState(false); const [sending,setSending]=useState(false);

  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipFinal=appliedCoupon?.type==="shipping"?0:(shipping??0);
  let discountVal=0;
  if(appliedCoupon){ if(appliedCoupon.type==="fixed") discountVal=Math.min(appliedCoupon.value,subtotal); if(appliedCoupon.type==="percent") discountVal=subtotal*(appliedCoupon.value/100); if(appliedCoupon.type==="shipping") discountVal=shipping||0; }
  const total=Math.max(0,subtotal+shipFinal-(appliedCoupon?.type!=="shipping"?discountVal:0));

  function checkCep(){ const c=cep.replace(/\D/g,""); if(c.length<8) return alert("CEP inválido"); if(!c.startsWith("6")) return alert("Só CEPs do Ceará"); setShipping(calcShipping(c,firstPurchase)); }
  function applyCoupon(){ const c=COUPONS[coupon.toUpperCase()]; if(!c){setCouponMsg("Cupom inválido ❌");return;} setAppliedCoupon({...c,code:coupon.toUpperCase()}); setCouponMsg("Cupom aplicado: "+c.label+" ✅"); }
  async function finalize(){ if(!cep) return alert("Informe seu CEP"); setSending(true); await new Promise(r=>setTimeout(r,1200)); console.log("📦 Pedido:",{items:cart,total,payment:payMethod,coupon:appliedCoupon?.code,cep}); setCart([]); setFirstPurchase(false); setSending(false); setDone(true); }

  if(done) return <div className="flex flex-col items-center justify-center h-64 px-8 text-center gap-4 mt-16"><div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"><Check size={36} className="text-green-600"/></div><h2 className="font-black text-2xl text-gray-800">Compra Concluída! ❤️</h2><p className="text-gray-500 text-sm">Seu pedido foi recebido. Em breve entraremos em contato!</p></div>;
  if(!cart.length) return <div className="flex flex-col items-center justify-center h-64 px-8 text-center gap-3 mt-12"><ShoppingCart size={48} className="text-gray-300"/><h2 className="font-bold text-gray-600">Carrinho vazio</h2></div>;

  return (
    <div className="px-4 pb-32 mt-2 space-y-4">
      <h2 className="font-black text-gray-800 text-lg">🛒 Carrinho</h2>
      {cart.map(item=>(
        <div key={item.id} className="bg-white rounded-2xl shadow-sm p-3 flex gap-3">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0"/>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 line-clamp-2">{item.name}</p>
            <p className="text-red-600 font-black text-sm">{fmt(item.price)}</p>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"><Minus size={12}/></button>
              <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
              <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i))} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"><Plus size={12}/></button>
              <button onClick={()=>setCart(c=>c.filter(i=>i.id!==item.id))} className="ml-auto"><Trash2 size={14} className="text-red-400"/></button>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2"><MapPin size={14} className="text-red-600"/>Calcular Frete</h3>
        <div className="flex gap-2"><input value={cep} onChange={e=>setCep(e.target.value)} maxLength={9} placeholder="CEP (Ceará)" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"/><button onClick={checkCep} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">OK</button></div>
        {shipping!==null && <p className="text-xs text-green-700 font-semibold mt-2">{shipping===0?"🎉 Frete Grátis (1ª compra)!":"Frete: "+fmt(shipping)}</p>}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2"><Tag size={14} className="text-red-600"/>Cupom</h3>
        <div className="flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="ARTLOVERS" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none font-mono tracking-wider"/><button onClick={applyCoupon} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold">Aplicar</button></div>
        {couponMsg && <p className={"text-xs mt-2 font-semibold "+(couponMsg.includes("✅")?"text-green-600":"text-red-500")}>{couponMsg}</p>}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-700 mb-3">Pagamento</h3>
        {[{id:"pix",icon:<QrCode size={18}/>,label:"Pix",sub:"Aprovação imediata"},{id:"credit",icon:<CreditCard size={18}/>,label:"Cartão de Crédito",sub:"Até 12x sem juros"},{id:"store",icon:<Store size={18}/>,label:"Retire na Loja",sub:"Grátis - retirada em 1 dia"}].map(m=>(
          <button key={m.id} onClick={()=>setPayMethod(m.id)} className={"w-full flex items-center gap-3 p-3 rounded-xl mb-2 border-2 transition-all "+(payMethod===m.id?"border-red-500 bg-red-50":"border-gray-100")}>
            <div className={payMethod===m.id?"text-red-600":"text-gray-400"}>{m.icon}</div>
            <div className="flex-1 text-left"><p className={"text-sm font-semibold "+(payMethod===m.id?"text-red-700":"text-gray-700")}>{m.label}</p><p className="text-xs text-gray-400">{m.sub}</p></div>
            {payMethod===m.id && <Check size={16} className="text-red-600"/>}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-700 mb-3">Resumo</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Frete</span><span>{shipping!==null?fmt(shipFinal):"—"}</span></div>
          {discountVal>0 && <div className="flex justify-between text-green-600 font-semibold"><span>Desconto</span><span>-{fmt(discountVal)}</span></div>}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-800 text-base"><span>Total</span><span className="text-red-600">{fmt(total)}</span></div>
        </div>
      </div>
      <button onClick={finalize} disabled={sending} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
        {sending?<RefreshCw size={20} className="animate-spin"/>:<ShieldCheck size={20}/>}
        {sending?"Finalizando...":"Finalizar Compra"}
      </button>
    </div>
  );
}

function MenuPage({ onNav, bling, onBlingPress }) {
  return (
    <div className="px-4 pb-24 mt-2">
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><User size={24} className="text-red-600"/></div>
        <div><p className="font-black text-gray-800">Olá, visitante!</p><p className="text-xs text-gray-500">Explore nossas ofertas</p></div>
      </div>
      <button onClick={onBlingPress} className={"w-full flex items-center gap-4 rounded-2xl p-4 mb-4 border-2 text-left transition-all "+(bling.status==="ok"?"bg-green-50 border-green-300":"bg-gray-50 border-gray-200")}>
        <div className={"w-12 h-12 rounded-full flex items-center justify-center "+(bling.status==="ok"?"bg-green-100":"bg-gray-200")}>
          {bling.status==="ok"?<Wifi size={22} className="text-green-600"/>:<WifiOff size={22} className="text-gray-500"/>}
        </div>
        <div className="flex-1">
          <p className="font-black text-gray-800">Integração Bling</p>
          <p className="text-xs text-gray-500">{bling.status==="ok"?"✅ Conectado · "+bling.products.length+" produtos":"Toque para conectar sua conta Bling"}</p>
        </div>
        <Settings size={18} className="text-gray-400"/>
      </button>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[{label:"Meus Pedidos",icon:Package},{label:"Favoritos",icon:Heart,action:"favorites"},{label:"Cupons",icon:Gift,action:"coupons"},{label:"Art Lovers",icon:Crown,action:"artlovers"},{label:"Instagram @lojasartmoveis",icon:Instagram,external:"https://www.instagram.com/lojasartmoveis"}].map((it,i)=>(
          <button key={i} onClick={()=>it.external?window.open(it.external,"_blank"):it.action&&onNav(it.action)} className="w-full flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0">
            <it.icon size={18} className="text-red-600"/>
            <span className="text-sm font-semibold text-gray-700 flex-1 text-left">{it.label}</span>
            <ChevronRight size={16} className="text-gray-300"/>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const bling=useBling();
  const [page,setPage]=useState("home"); const [selectedProduct,setSelected]=useState(null);
  const [cart,setCart]=useState([]); const [firstPurchase,setFirstPurchase]=useState(true);
  const [searchQuery,setSearchQuery]=useState(""); const [activeNav,setActiveNav]=useState("home");
  const [showBling,setShowBling]=useState(false); const scrollRef=useRef(null);

  function navigate(id){ setPage(id); if(["home","cart","favorites","menu"].includes(id)) setActiveNav(id); scrollRef.current?.scrollTo(0,0); }
  function goProduct(p){ setSelected(p); setPage("product"); }
  function addCart(p){ setCart(c=>{ const ex=c.find(i=>i.id===p.id); return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]; }); }
  function handleNav(id){ if(id==="live"){ window.open("https://www.instagram.com/lojasartmoveis","_blank"); return; } navigate(id); }

  const showBack=page==="product"||!["home","cart","favorites","menu"].includes(page);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  function renderPage(){
    if(page==="product"&&selectedProduct) return <ProductPage product={selectedProduct} onAddCart={addCart} firstPurchase={firstPurchase}/>;
    if(page==="offers")      return <OffersPage products={bling.products} onProductPress={goProduct} onAddCart={addCart}/>;
    if(page==="coupons")     return <CouponsPage/>;
    if(page==="bestsellers") return <BestSellersPage products={bling.products} onProductPress={goProduct}/>;
    if(page==="artlovers")   return <ArtLoversPage products={bling.products} onProductPress={goProduct} onAddCart={addCart}/>;
    if(page==="cart")        return <CartPage cart={cart} setCart={setCart} firstPurchase={firstPurchase} setFirstPurchase={setFirstPurchase}/>;
    if(page==="favorites")   return <FavoritesPage products={bling.products} onProductPress={goProduct}/>;
    if(page==="menu")        return <MenuPage onNav={navigate} bling={bling} onBlingPress={()=>setShowBling(true)}/>;
    return <HomePage products={bling.products} onProductPress={goProduct} onAddCart={addCart} onNav={handleNav} blingStatus={bling.status}/>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Segoe UI', system-ui, sans-serif"}}>
      <Header cartCount={cartCount} onCartPress={()=>navigate("cart")} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showBack={showBack} onBack={()=>navigate("home")} bling={bling} onBlingPress={()=>setShowBling(true)}/>
      <div ref={scrollRef} className="pt-28 pb-20 overflow-y-auto min-h-screen">{renderPage()}</div>
      <BottomNav active={activeNav} onNav={handleNav} cartCount={cartCount}/>
      {showBling && <BlingSetupScreen bling={bling} onClose={()=>setShowBling(false)}/>}
    </div>
  );
}
