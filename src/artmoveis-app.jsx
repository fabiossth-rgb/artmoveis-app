import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Home, Heart, ShoppingCart, Menu, Search, User, ChevronRight, Star,
  Truck, Tag, ArrowLeft, Check, Package, Gift, Zap, TrendingUp,
  Crown, Copy, MapPin, CreditCard, QrCode, Store, Plus, Minus, Trash2,
  Instagram, Clock, ShieldCheck, RefreshCw, Wifi, WifiOff,
  Settings, AlertCircle, CheckCircle, MessageCircle, LogOut,
  Lock, Mail, Timer, X, UserPlus, Phone, Eye, EyeOff, Percent,
  Flame, Sparkles, BadgePercent, Radio
} from "lucide-react";

const GLOBAL_CSS = `
  @keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
  ::-webkit-scrollbar{display:none;}
  *{scrollbar-width:none;-ms-overflow-style:none;}
`;

const POLITICAS=[
  {title:"Segurança",body:"Seus dados pessoais de endereçamento, pagamento e conteúdo do pedido não serão utilizados para outros fins além do processamento dos pedidos. Toda transação de pagamento é encriptada com tecnologia SSL."},
  {title:"Envio",body:"Todos os produtos são enviados em até 2 dias úteis após a confirmação do pagamento. O prazo de entrega varia conforme a forma de envio. Você será notificado com o código de rastreamento assim que o produto for postado."},
  {title:"Pagamento",body:"Trabalhamos com diversas formas de pagamento. A empresa se compromete a exibir de forma transparente quando houver juros em compras parceladas. Descontos acima de 10% só são garantidos em compras à vista, salvo promoções em banners."},
  {title:"Tempo de Garantia",body:"Todas as garantias são dadas pelos fabricantes e variam de produto para produto. Segundo o Código de Defesa do Consumidor, a garantia básica é de 90 dias pelo fabricante."},
  {title:"Trocas e Devoluções",body:"Toda solicitação deve ser comunicada à Central de Atendimento em até 7 dias após o recebimento. A mercadoria deverá retornar com lacres intactos, na embalagem original. O produto NÃO PODE TER SIDO USADO."},
  {title:"Devolução — Cartão",body:"Após aprovação, enviaremos a solicitação de estorno à administradora do cartão, que tem seu próprio prazo para processar. O valor pode ser devolvido em faturas futuras conforme política da administradora."},
  {title:"Devolução — Boleto, Pix ou Transferência",body:"A restituição será realizada via reembolso em conta corrente ou poupança em até 30 dias úteis, após aprovação. Os dados bancários devem ser informados no momento da solicitação."},
];

const MOCK_PRODUCTS=[
  {id:1, name:"Sofá Retrátil Comfort Premium 3 Lugares",category:"Estofados",   price:2199,oldPrice:3499,image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",sold:142,rating:4.8,desc:"Sofá retrátil e reclinável com tecido suede de alta qualidade. Estrutura em madeira maciça, espuma D33.",isNew:false},
  {id:2, name:"Cama Box Casal Queen Molas Ensacadas",   category:"Box e Colchões",price:1899,oldPrice:2799,image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",sold:98, rating:4.9,desc:"Conjunto box casal queen com colchão de molas ensacadas. Base em madeira compensada naval.",isNew:true},
  {id:3, name:"Mesa de Jantar 6 Lugares Madeira Maciça",category:"Sala de Jantar",price:1649,oldPrice:2299,image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",sold:76, rating:4.7,desc:"Mesa de jantar retangular em madeira maciça. Comporta 6 pessoas com conforto.",isNew:false},
  {id:4, name:"Guarda-Roupa Casal 6 Portas Espelhado",  category:"Quarto",       price:2349,oldPrice:3199,image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",sold:110,rating:4.6,desc:"Guarda-roupa casal 6 portas com espelho de corpo inteiro. MDF 15mm com puxadores cromados.",isNew:true},
  {id:5, name:"Sofá Chaise Veludo Bege 4 Lugares",      category:"Estofados",   price:3199,oldPrice:4299,image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",sold:63, rating:4.9,desc:"Sofá chaise luxuoso em veludo bege. Pés em aço escovado dourado.",isNew:false},
  {id:6, name:"Mesa de Centro Vidro Temperado",          category:"Sala de estar",price:699, oldPrice:999, image:"https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&q=80",sold:189,rating:4.5,desc:"Mesa de centro com tampo em vidro temperado 8mm e estrutura em aço preto.",isNew:false},
  {id:7, name:"Rack TV 60' Suspenso com LED",            category:"Sala de estar",price:1299,oldPrice:1799,image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",sold:134,rating:4.7,desc:"Rack para TV até 60 polegadas com iluminação LED embutida. MDF lacado branco.",isNew:true},
  {id:8, name:"Colchão Casal Mola Bonnell Anti-Stress",  category:"Box e Colchões",price:989,oldPrice:1399,image:"https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80",sold:221,rating:4.8,desc:"Colchão casal molas Bonnell, revestimento anti-stress. Altura 22cm, bordas reforçadas.",isNew:false},
  {id:9, name:"Conjunto Cozinha Mesa + 4 Cadeiras",      category:"Cozinha",     price:1149,oldPrice:1599,image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",sold:87, rating:4.6,desc:"Mesa redonda para cozinha com 4 cadeiras estofadas. Estrutura em aço e tampo em MDF.",isNew:false},
  {id:10,name:"Poltrona Decorativa Giratória Linho",     category:"Sala de estar",price:879, oldPrice:1199,image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",sold:55, rating:4.7,desc:"Poltrona decorativa giratória com revestimento em linho natural. Pé em madeira maciça.",isNew:true},
  {id:11,name:"Sofá 2 Lugares Veludo Rose",              category:"Estofados",   price:1599,oldPrice:2199,image:"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80",sold:43, rating:4.6,desc:"Sofá 2 lugares em veludo rose com pés dourados.",isNew:true},
  {id:12,name:"Cômoda 6 Gavetas Carvalho",               category:"Quarto",      price:1199,oldPrice:1699,image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",sold:67, rating:4.5,desc:"Cômoda 6 gavetas em MDF carvalho com puxadores cromados.",isNew:false},
];

const COUPONS={ARTLOVERS:{type:"fixed",value:50,label:"R$ 50 de desconto"},FRETEGRATIS:{type:"shipping",value:0,label:"Frete grátis"},CHEFINHA10:{type:"percent",value:10,label:"10% de desconto"}};
const CATS=["Todos","Estofados","Box e Colchões","Quarto","Sala de estar","Cozinha","Sala de Jantar","Promoções e descontos"];
const WA="558599340254";
const fmt=v=>Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const off=(p,o)=>Math.round(((o-p)/o)*100);
const shipCalc=(cep,first)=>{if(first)return 0;const c=cep.replace(/\D/g,"");return c.startsWith("60")||c.startsWith("61")?80:120;};
const BACKEND="https://artmoveis-bling-1.onrender.com";
const bGet=async p=>{const r=await fetch(BACKEND+p);if(!r.ok)throw new Error(r.status);return r.json();};

function useBling(){
  const[status,setStatus]=useState("idle");
  const[products,setProducts]=useState(MOCK_PRODUCTS);
  const[syncing,setSyncing]=useState(false);
  const[lastSync,setLastSync]=useState(null);
  const sync=useCallback(async()=>{setSyncing(true);try{const d=await bGet("/produtos");if(d.ok&&d.produtos?.length>0){setProducts(d.produtos.map(p=>({...p,isNew:Math.random()>0.7})));setLastSync(new Date());setStatus("ok");}}catch(e){console.warn(e);setStatus("error");}finally{setSyncing(false);};},[]);
  const connect=async()=>{setStatus("connecting");try{const h=await bGet("/health");if(h.autenticado){await sync();return;}const w=window.open(BACKEND+"/auth/login","_blank","width=600,height=700");const t=setInterval(async()=>{if(w?.closed){clearInterval(t);await sync();}},1000);}catch{setStatus("error");}};
  useEffect(()=>{connect();},[]);
  return{status,products,syncing,lastSync,connect,sync};
}

function useAuth(){
  const[users,setUsers]=useState([]);
  const[user,setUser]=useState(null);
  const[orders,setOrders]=useState([]);
  const register=(name,email,phone,pass)=>{
    if(users.find(u=>u.email===email))return{ok:false,msg:"Email já cadastrado"};
    const u={name,email,phone,avatar:name[0].toUpperCase()};
    setUsers(p=>[...p,{...u,pass}]);setUser(u);return{ok:true};
  };
  const login=(email,pass)=>{const f=users.find(u=>u.email===email&&u.pass===pass);if(f){setUser({name:f.name,email:f.email,phone:f.phone,avatar:f.avatar});return true;}return false;};
  const logout=()=>setUser(null);
  const addOrder=o=>setOrders(p=>[{id:`ART-${Date.now()}`,date:new Date().toLocaleDateString("pt-BR"),...o},...p]);
  return{user,users,orders,register,login,logout,addOrder};
}

function useCountdown(){
  const[t,setT]=useState({h:0,m:0,s:0});
  useEffect(()=>{const tick=()=>{const now=new Date(),end=new Date();end.setHours(23,59,59,999);const d=end-now;setT({h:Math.floor(d/3600000),m:Math.floor((d%3600000)/60000),s:Math.floor((d%60000)/1000)});};tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[]);
  return t;
}

function useCols(){const[c,setC]=useState(2);useEffect(()=>{const u=()=>setC(window.innerWidth>=1024?4:window.innerWidth>=768?3:2);u();window.addEventListener("resize",u);return()=>window.removeEventListener("resize",u);},[]);return c;}

function Stars({rating,size=13}){return<span className="flex gap-px">{[1,2,3,4,5].map(s=><Star key={s}size={size}fill={s<=Math.round(rating)?"#f59e0b":"none"}stroke={s<=Math.round(rating)?"#f59e0b":"#e5e7eb"}/>)}</span>;}

function PCard({p,onPress,onCart,favs,onFav}){
  const o=off(p.price,p.oldPrice),fav=favs?.includes(p.id);
  return(
    <div onClick={()=>onPress(p)} style={{animation:"fadeInUp .25s ease",minWidth:152,width:152}} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer flex-shrink-0 hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={p.image} alt={p.name} className="w-full h-28 object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{o}%</span>
        {p.isNew&&<span className="absolute top-1.5 right-7 bg-emerald-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">NOVO</span>}
        <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><Heart size={11}fill={fav?"#ef4444":"none"}stroke={fav?"#ef4444":"#9ca3af"}/></button>
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug mb-1">{p.name}</p>
        <p className="text-[10px] text-gray-400 line-through">{fmt(p.oldPrice)}</p>
        <p className="text-sm font-black text-red-600 leading-tight">{fmt(p.price)}</p>
        <button onClick={e=>{e.stopPropagation();onCart(p);}} className="mt-1.5 w-full text-white text-[11px] py-1.5 rounded-xl font-bold active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Comprar agora</button>
      </div>
    </div>
  );
}

function GCard({p,onPress,onCart,favs,onFav,imgH=120}){
  const o=off(p.price,p.oldPrice),fav=favs?.includes(p.id);
  return(
    <div onClick={()=>onPress(p)} style={{animation:"fadeInUp .25s ease"}} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-all">
      <div className="relative">
        <img src={p.image} alt={p.name} className="w-full object-cover" style={{height:imgH}} onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{o}%</span>
        {p.isNew&&<span className="absolute top-2 right-7 bg-emerald-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">NOVO</span>}
        <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><Heart size={11}fill={fav?"#ef4444":"none"}stroke={fav?"#ef4444":"#9ca3af"}/></button>
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-600 line-clamp-2 font-medium leading-snug">{p.name}</p>
        <p className="text-[10px] text-gray-400 line-through">{fmt(p.oldPrice)}</p>
        <p className="text-sm font-black text-red-600">{fmt(p.price)}</p>
        <button onClick={e=>{e.stopPropagation();onCart(p);}} className="mt-1.5 w-full text-white text-[11px] py-1.5 rounded-xl font-bold active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Comprar agora</button>
      </div>
    </div>
  );
}

function Header({cartCount,onCart,q,setQ,onSearch,showBack,onBack,bling,onBling,onUser,user}){
  return(
    <div className="fixed top-0 left-0 right-0 z-50" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
      <style>{GLOBAL_CSS}</style>
      <div className="px-3 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-2">
          {showBack?<button onClick={onBack} className="text-white p-1 active:scale-90 transition-transform"><ArrowLeft size={22}/></button>
          :<button onClick={onUser} className="text-white p-1 active:scale-90 transition-transform">{user?<div className="w-7 h-7 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-xs font-black text-white">{user.avatar}</div>:<User size={22}/>}</button>}
          <div className="flex-1 bg-white rounded-2xl flex items-center px-3 py-1.5 gap-2 shadow-sm">
            <Search size={14} className="text-gray-400 flex-shrink-0"/>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch()} placeholder="Buscar móveis..." className="flex-1 text-sm outline-none text-gray-700 bg-transparent"/>
            {q&&<button onClick={()=>setQ("")}><X size={13} className="text-gray-400"/></button>}
          </div>
          <button onClick={onCart} className="text-white p-1 relative active:scale-90 transition-transform">
            <ShoppingCart size={22}/>
            {cartCount>0&&<span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center" style={{animation:"pulse2 1.2s ease infinite"}}>{cartCount}</span>}
          </button>
          <button onClick={onBling} className="text-white p-1 active:scale-90 transition-transform"><Settings size={20}/></button>
        </div>
        <div className="flex items-center justify-between pb-1">
          <span className="text-white/90 text-[11px] font-medium flex items-center gap-1"><Truck size={11}/>Entregamos para todo o Ceará!</span>
          {bling.status==="ok"?<span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"><Wifi size={9}/> Bling ✓</span>:<button onClick={onBling} className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30"><WifiOff size={9}/> Conectar</button>}
        </div>
      </div>
    </div>
  );
}

function BottomNav({active,onNav,cartCount}){
  const items=[{id:"home",Icon:Home,label:"Início"},{id:"favorites",Icon:Heart,label:"Favoritos"},{id:"cart",Icon:ShoppingCart,label:"Carrinho"},{id:"whatsapp",Icon:MessageCircle,label:"Compre no Whats",special:true},{id:"menu",Icon:Menu,label:"Menu"}];
  return(
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50 shadow-lg" style={{paddingBottom:"env(safe-area-inset-bottom)"}}>
      {items.map(({id,Icon,label,special})=>(
        <button key={id} onClick={()=>{if(id==="whatsapp"){window.open(`https://wa.me/${WA}`,"_blank");return;}onNav(id);}} className="flex-1 flex flex-col items-center py-2 gap-0.5 active:scale-90 transition-transform">
          <div className="relative">
            {special?<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"linear-gradient(135deg,#25d366,#128c7e)"}}><Icon size={17} className="text-white"/></div>:<Icon size={21} className={active===id?"text-red-600":"text-gray-400"}/>}
            {id==="cart"&&cartCount>0&&<span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </div>
          <span className={"text-[9px] font-semibold "+(active===id?"text-red-600":special?"text-green-600":"text-gray-400")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function BannerCarousel(){
  const[i,setI]=useState(0);
  const bs=[{title:"Bem-vindo à Art Móveis",sub:"Os melhores móveis do Ceará!",Icon:Store,grad:"from-red-700 to-red-500"},{title:"Seja um Art Lover",sub:"Ganhe cupons exclusivos!",Icon:Crown,grad:"from-red-800 to-rose-600"},{title:"Frete Grátis",sub:"Na sua primeira compra!",Icon:Truck,grad:"from-red-600 to-orange-500"}];
  useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%3),3500);return()=>clearInterval(t);},[]);
  const b=bs[i];
  return(
    <div className={"mx-4 rounded-2xl bg-gradient-to-r "+b.grad+" p-5 flex items-center justify-between shadow-md relative overflow-hidden"} style={{minHeight:108,transition:"all .4s ease"}}>
      <div>
        <p className="text-white font-black text-lg leading-tight">{b.title}</p>
        <p className="text-white/80 text-sm mt-0.5">{b.sub}</p>
        <button className="mt-2 bg-white text-red-700 text-xs font-bold px-3 py-1 rounded-full active:scale-95 transition-transform">Saiba mais</button>
      </div>
      <b.Icon size={52} className="text-white/20 absolute right-4 top-1/2 -translate-y-1/2"/>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">{bs.map((_,x)=><div key={x} className={"h-1.5 rounded-full transition-all duration-300 "+(x===i?"bg-white w-4":"bg-white/40 w-1.5")}/>)}</div>
    </div>
  );
}

function QuickLinks({onNav}){
  const links=[{id:"offers",Icon:Flame,label:"Ofertas"},{id:"coupons",Icon:Gift,label:"Cupons"},{id:"new",Icon:Sparkles,label:"Lançamentos"},{id:"bestsellers",Icon:TrendingUp,label:"Mais vendidos"},{id:"live",Icon:Radio,label:"Live"},{id:"artlovers",Icon:Crown,label:"Art Lovers"}];
  return(
    <div className="flex gap-3 overflow-x-auto px-4 pb-1">
      {links.map(({id,Icon,label})=>(
        <button key={id} onClick={()=>onNav(id)} className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-90 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors"><Icon size={20} className="text-red-500"/></div>
          <span className="text-[10px] text-gray-500 font-semibold w-14 text-center leading-tight">{label}</span>
        </button>
      ))}
    </div>
  );
}

function CategoryBar({active,onSelect}){
  return(
    <div className="flex overflow-x-auto px-4 border-b border-gray-100">
      {CATS.map(c=>(
        <button key={c} onClick={()=>onSelect(c)} className={"flex-shrink-0 pb-2 px-1 mr-4 text-sm font-semibold whitespace-nowrap transition-colors "+(active===c?"text-red-600 border-b-2 border-red-600":"text-gray-400")}>{c}</button>
      ))}
    </div>
  );
}

function Countdown(){
  const{h,m,s}=useCountdown();const pad=n=>String(n).padStart(2,"0");
  return<div className="flex items-center gap-1 bg-red-600 rounded-lg px-2 py-0.5"><Timer size={10} className="text-white"/><span className="text-white text-[10px] font-black tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span></div>;
}

function Shelf({title,TitleExtra,items,onPress,onCart,favs,onFav}){
  const list=items.slice(0,32);if(!list.length)return null;
  return(
    <div className="mb-2">
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2"><h2 className="font-black text-gray-800 text-[15px]">{title}</h2>{TitleExtra&&<TitleExtra/>}</div>
        <button className="text-red-500 text-xs font-semibold flex items-center gap-0.5">Ver tudo<ChevronRight size={13}/></button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2">{list.map(p=><PCard key={p.id} p={p} onPress={onPress} onCart={onCart} favs={favs} onFav={onFav}/>)}</div>
    </div>
  );
}

function InstaBanner(){
  return(
    <button onClick={()=>window.open("https://www.instagram.com/lojasartmoveis","_blank")} className="mx-4 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform" style={{background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"}}>
      <div className="flex items-center gap-4 p-4">
        <Instagram size={34} className="text-white flex-shrink-0"/>
        <div className="flex-1"><p className="text-white font-black text-sm leading-tight">A Art Móveis está bombando no Instagram!</p><p className="text-white/80 text-xs mt-0.5">Siga @lojasartmoveis</p></div>
        <ChevronRight size={18} className="text-white/50 flex-shrink-0"/>
      </div>
    </button>
  );
}

function GreenBanner(){
  return(
    <div className="mx-4 rounded-2xl overflow-hidden shadow-md" style={{background:"linear-gradient(135deg,#16a34a,#4ade80,#15803d)"}}>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0"><ShieldCheck size={26} className="text-white"/></div>
        <div><p className="text-white font-black text-base leading-tight">Compra 100% Segura</p><p className="text-white/80 text-xs mt-0.5">Certificado SSL · Pagamento protegido · Garantia de entrega</p></div>
      </div>
    </div>
  );
}

function HomePage({products,onProduct,onCart,onNav,blingOk,favs,onFav}){
  const[cat,setCat]=useState("Todos");
  const shuffled=useMemo(()=>[...products].sort(()=>Math.random()-.5),[products]);
  const filtered=cat==="Todos"?products:cat==="Promoções e descontos"?products.filter(p=>off(p.price,p.oldPrice)>=20):products.filter(p=>p.category===cat);
  const cp={onPress:onProduct,onCart,favs,onFav};
  return(
    <div className="space-y-4 pb-4">
      <BannerCarousel/>
      <QuickLinks onNav={onNav}/>
      <CategoryBar active={cat} onSelect={setCat}/>
      {blingOk&&<div className="mx-4 flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-3 py-2"><CheckCircle size={13} className="text-green-600 shrink-0"/><p className="text-xs text-green-700 font-semibold">Produtos sincronizados do Bling</p></div>}
      {cat==="Todos"?(
        <>
          <Shelf title="Mais Vendidos" items={[...products].sort((a,b)=>b.sold-a.sold)} {...cp}/>
          <Shelf title="Maiores Descontos" items={[...products].sort((a,b)=>off(b.price,b.oldPrice)-off(a.price,a.oldPrice))} {...cp}/>
          <Shelf title="Promoção Limitada, Corra!" TitleExtra={Countdown} items={shuffled} {...cp}/>
          <InstaBanner/>
          <Shelf title="Estofados" items={products.filter(p=>p.category==="Estofados")} {...cp}/>
          <Shelf title="Quartos & Colchões" items={products.filter(p=>["Quarto","Box e Colchões"].includes(p.category))} {...cp}/>
          <GreenBanner/>
        </>
      ):<CategoryPage category={cat} products={filtered} {...cp}/>}
    </div>
  );
}

function CategoryPage({category,products,onPress,onCart,favs,onFav}){
  const cols=useCols();const[pg,setPg]=useState(1);const shown=products.slice(0,pg*16);
  return(
    <div className="pb-4">
      <div className="mx-4 rounded-2xl overflow-hidden mb-4 shadow-sm" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <div className="p-5"><p className="text-white/70 text-xs font-semibold mb-1">Só os melhores produtos pra você!</p><h1 className="text-white font-black text-2xl">{category}</h1></div>
      </div>
      <div className="px-4">
        <p className="text-xs text-gray-400 mb-3">{products.length} produto(s)</p>
        <div className="grid gap-3" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>{shown.map(p=><GCard key={p.id} p={p} onPress={onPress} onCart={onCart} favs={favs} onFav={onFav} imgH={cols>=3?150:110}/>)}</div>
        {shown.length<products.length&&<button onClick={()=>setPg(x=>x+1)} className="mt-4 w-full py-3 border-2 border-red-200 text-red-600 font-bold rounded-2xl text-sm active:scale-95 transition-transform">Ver mais {Math.min(16,products.length-shown.length)} produtos</button>}
      </div>
    </div>
  );
}

function SearchPage({query,products,onProduct,onCart,favs,onFav}){
  const cols=useCols();
  const res=products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())||p.category.toLowerCase().includes(query.toLowerCase()));
  return(
    <div className="px-4 pb-24 mt-2">
      <p className="font-black text-gray-800 text-base mb-1">Resultados para "{query}"</p>
      <p className="text-xs text-gray-400 mb-3">{res.length} produto(s)</p>
      {!res.length?<div className="text-center py-16 text-gray-300"><Search size={44} className="mx-auto mb-3"/><p className="font-semibold text-gray-400">Nenhum produto encontrado</p></div>
      :<div className="grid gap-3" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>{res.map(p=><GCard key={p.id} p={p} onPress={onProduct} onCart={onCart} favs={favs} onFav={onFav}/>)}</div>}
    </div>
  );
}

function ProductPage({product,allProducts,onCart,firstPurchase,favs,onFav}){
  const[cep,setCep]=useState("");const[ship,setShip]=useState(null);
  const[ur,setUr]=useState(0);const[hov,setHov]=useState(0);const[comment,setCmt]=useState("");
  const[reviews,setRevs]=useState([{user:"Maria S.",stars:5,text:"Lindo demais! Chegou antes do prazo."},{user:"João P.",stars:4,text:"Ótima qualidade, montagem fácil."}]);
  const o=off(product.price,product.oldPrice);const isFav=favs?.includes(product.id);
  const related=useMemo(()=>[...allProducts].filter(p=>p.id!==product.id).sort(()=>Math.random()-.5).slice(0,10),[product.id,allProducts]);
  const chkCep=()=>{const c=cep.replace(/\D/g,"");if(c.length<8)return alert("CEP inválido");if(!c.startsWith("6"))return alert("Só CEPs do Ceará!");setShip(shipCalc(c,firstPurchase));};
  const submitRev=()=>{if(!ur)return alert("Selecione uma nota");if(!comment.trim())return alert("Escreva seu comentário");setRevs(r=>[...r,{user:"Você",stars:ur,text:comment,date:new Date().toLocaleDateString("pt-BR")}]);setUr(0);setCmt("");};
  return(
    <div className="pb-28" style={{animation:"fadeInUp .3s ease"}}>
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
        <button onClick={()=>onFav(product.id)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center active:scale-90 transition-transform"><Heart size={20}fill={isFav?"#ef4444":"none"}stroke={isFav?"#ef4444":"#9ca3af"}/></button>
        {product.isNew&&<span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">Novidade</span>}
      </div>
      <div className="mx-4 -mt-6 bg-white rounded-2xl shadow-md p-4">
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{o}% OFF</span>
        <h1 className="text-gray-800 font-black text-base mt-2 leading-snug">{product.name}</h1>
        <p className="text-gray-400 line-through text-sm mt-1">{fmt(product.oldPrice)}</p>
        <p className="text-red-600 font-black text-3xl leading-tight">{fmt(product.price)}</p>
        <div className="flex items-center gap-2 mt-1"><Stars rating={product.rating}/><span className="text-xs text-gray-400">({reviews.length} avaliações)</span></div>
        <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1"><Truck size={12}/>Frete disponível para o Ceará</p>
      </div>
      <div className="mx-4 mt-3 flex gap-2">
        <button onClick={()=>onCart(product)} className="flex-1 text-white py-4 rounded-2xl font-black text-sm shadow flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}><ShoppingCart size={18}/>Comprar agora</button>
        <button onClick={()=>window.open(`https://wa.me/${WA}?text=Olá! Interesse no: ${product.name}`,"_blank")} className="px-4 py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#25d366,#128c7e)"}}><MessageCircle size={20}/></button>
      </div>
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm"><p className="font-bold text-gray-800 text-sm mb-2">Descrição</p><p className="text-xs text-gray-500 leading-relaxed">{product.desc}</p></div>
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5"><MapPin size={14} className="text-red-500"/>Calcular Frete</p>
        <div className="flex gap-2"><input value={cep} onChange={e=>setCep(e.target.value)} maxLength={9} placeholder="Digite seu CEP" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors"/><button onClick={chkCep} className="text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>OK</button></div>
        {ship!==null&&<p className="text-xs text-green-700 font-semibold mt-2 flex items-center gap-1"><Truck size={12}/>{ship===0?"Frete Grátis na 1ª compra!":"Frete: "+fmt(ship)}</p>}
      </div>
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-bold text-gray-800 text-sm mb-3">Avaliações ({reviews.length})</p>
        {reviews.map((r,idx)=>(
          <div key={idx} className="pb-3 mb-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-black text-red-500">{r.user[0]}</div>
              <span className="text-sm font-semibold text-gray-700">{r.user}</span><Stars rating={r.stars} size={11}/>
              {r.date&&<span className="text-[10px] text-gray-400 ml-auto">{r.date}</span>}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed ml-9">{r.text}</p>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="font-semibold text-sm text-gray-700 mb-2">Deixe sua avaliação</p>
          <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(s=><button key={s} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)} onClick={()=>setUr(s)} className="active:scale-90 transition-transform"><Star size={26}fill={s<=(hov||ur)?"#f59e0b":"none"}stroke={s<=(hov||ur)?"#f59e0b":"#e5e7eb"}/></button>)}</div>
          <textarea value={comment} onChange={e=>setCmt(e.target.value)} placeholder="Conte sua experiência..." className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none h-20 focus:border-red-400 transition-colors"/>
          <button onClick={submitRev} className="mt-2 w-full text-white py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Enviar avaliação</button>
        </div>
      </div>
      {related.length>0&&(
        <div className="mt-4">
          <p className="font-black text-gray-800 text-[15px] px-4 mb-3">Quem viu esse produto também comprou</p>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {related.map(p=>(
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer flex-shrink-0 active:scale-[0.97] transition-transform" style={{width:140,animation:"fadeInUp .25s ease"}}>
                <img src={p.image} alt={p.name} className="w-full h-24 object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
                <div className="p-2"><p className="text-[11px] text-gray-600 line-clamp-2 leading-snug">{p.name}</p><p className="text-sm font-black text-red-600 mt-0.5">{fmt(p.price)}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NewPage({products,onProduct,onCart,favs,onFav}){
  const cols=useCols();const list=products.filter(p=>p.isNew).slice(0,24);
  return(
    <div className="pb-24">
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden shadow-sm mb-4" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <div className="p-5 flex items-center gap-3"><Sparkles size={32} className="text-white/80"/><div><p className="text-white/70 text-xs">Acabaram de chegar!</p><h1 className="text-white font-black text-xl">Lançamentos</h1></div></div>
      </div>
      <div className="px-4 grid gap-3" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
        {list.map(p=><GCard key={p.id} p={p} onPress={onProduct} onCart={onCart} favs={favs} onFav={onFav}/>)}
        {!list.length&&<div className="col-span-full text-center py-16 text-gray-300"><Sparkles size={44} className="mx-auto mb-3"/><p className="font-semibold text-gray-400">Novidades em breve</p></div>}
      </div>
    </div>
  );
}

function OffersPage({products,onProduct,onCart}){
  return(
    <div className="px-4 pb-24 space-y-3 mt-2">
      <p className="font-black text-gray-800 text-base">Melhores Ofertas</p>
      {[...products].sort((a,b)=>off(b.price,b.oldPrice)-off(a.price,a.oldPrice)).map(p=>(
        <div key={p.id} onClick={()=>onProduct(p)} className="bg-white rounded-2xl shadow-sm flex gap-3 p-3 cursor-pointer active:scale-[0.98] transition-all" style={{animation:"fadeInUp .25s ease"}}>
          <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
          <div className="flex-1 min-w-0">
            <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{off(p.price,p.oldPrice)}% OFF</span>
            <p className="text-xs text-gray-700 font-semibold mt-1 line-clamp-2">{p.name}</p>
            <p className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</p>
            <p className="text-red-600 font-black text-sm">{fmt(p.price)}</p>
            <button onClick={e=>{e.stopPropagation();onCart(p);}} className="mt-1 text-white text-xs px-3 py-1 rounded-xl font-bold" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>+ Carrinho</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CouponsPage(){
  const[copied,setCopied]=useState("");
  const list=[{code:"ARTLOVERS",Icon:Crown,title:"Art Lovers",desc:"R$ 50 de desconto",bg:"from-yellow-50 to-orange-50",border:"border-yellow-200"},{code:"FRETEGRATIS",Icon:Truck,title:"Frete Grátis",desc:"Frete gratuito",bg:"from-green-50 to-emerald-50",border:"border-green-200"},{code:"CHEFINHA10",Icon:Percent,title:"10% Desconto",desc:"10% no total",bg:"from-red-50 to-rose-50",border:"border-red-200"}];
  return(
    <div className="px-4 pb-24 space-y-4 mt-2">
      <p className="font-black text-gray-800 text-base">Cupons Disponíveis</p>
      {list.map(({code,Icon,title,desc,bg,border})=>(
        <div key={code} className={`bg-gradient-to-r ${bg} border ${border} rounded-2xl p-4`} style={{animation:"fadeInUp .25s ease"}}>
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center"><Icon size={20} className="text-gray-700"/></div><div><p className="font-black text-gray-800">{title}</p><p className="text-xs text-gray-500">{desc}</p></div></div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-dashed border-gray-300">
            <span className="flex-1 font-mono font-bold text-gray-800 text-sm tracking-widest">{code}</span>
            <button onClick={()=>{navigator.clipboard?.writeText(code);setCopied(code);setTimeout(()=>setCopied(""),2000);}} className="flex items-center gap-1 text-red-600 text-xs font-bold active:scale-90 transition-transform">{copied===code?<><Check size={13}/>Copiado!</>:<><Copy size={13}/>Copiar</>}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BestSellersPage({products,onProduct}){
  return(
    <div className="px-4 pb-24 space-y-3 mt-2">
      <div className="flex items-center gap-2 mb-1"><TrendingUp size={18} className="text-red-600"/><p className="font-black text-gray-800 text-base">Mais Vendidos</p></div>
      <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11}/>Últimos 7 dias</p>
      {[...products].sort((a,b)=>b.sold-a.sold).map((p,i)=>(
        <div key={p.id} onClick={()=>onProduct(p)} className="bg-white rounded-2xl shadow-sm flex gap-3 p-3 cursor-pointer active:scale-[0.98] transition-all" style={{animation:"fadeInUp .25s ease"}}>
          <span className={"font-black text-lg w-7 flex items-center justify-center flex-shrink-0 "+(i===0?"text-yellow-400":i===1?"text-gray-400":i===2?"text-amber-600":"text-gray-200")}>#{i+1}</span>
          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
          <div className="flex-1 min-w-0"><p className="text-xs text-gray-700 font-semibold line-clamp-2">{p.name}</p><p className="text-red-600 font-black text-sm">{fmt(p.price)}</p><p className="text-[10px] text-gray-400">{p.sold} vendidos</p></div>
        </div>
      ))}
    </div>
  );
}

function ArtLoversPage({products,onProduct,onCart}){
  const cols=useCols();
  return(
    <div className="pb-24">
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden shadow-sm mb-4" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <div className="p-5 flex items-center gap-3"><Crown size={32} className="text-white/80"/><div><h2 className="text-white font-black text-xl">Art Lovers</h2><p className="text-white/70 text-xs mt-0.5">Descontos exclusivos para clientes fiéis</p></div></div>
      </div>
      <div className="px-4 grid gap-3" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
        {products.map(p=>(
          <div key={p.id} onClick={()=>onProduct(p)} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-all border-2 border-red-50">
            <div className="relative"><img src={p.image} alt={p.name} className="w-full h-28 object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/><span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">{off(p.price,p.oldPrice)}% OFF</span></div>
            <div className="p-2"><p className="text-xs text-gray-600 line-clamp-2 font-semibold">{p.name}</p><p className="text-red-600 font-black text-sm">{fmt(p.price)}</p><button onClick={e=>{e.stopPropagation();onCart(p);}} className="mt-1.5 w-full text-white text-[11px] py-1.5 rounded-xl font-bold" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Adicionar</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesPage({products,favs,onProduct,onFav}){
  const list=products.filter(p=>favs.includes(p.id));
  return(
    <div className="px-4 pb-24 mt-2">
      <p className="font-black text-gray-800 text-base mb-3">Favoritos ({list.length})</p>
      {!list.length?<div className="text-center py-16 text-gray-300"><Heart size={44} className="mx-auto mb-3"/><p className="font-semibold text-gray-400">Nenhum favorito ainda</p><p className="text-xs text-gray-400 mt-1">Toque no coração nos produtos</p></div>
      :list.map(p=>(
        <div key={p.id} onClick={()=>onProduct(p)} className="bg-white rounded-2xl shadow-sm flex gap-3 p-3 mb-3 cursor-pointer active:scale-[0.98] transition-all" style={{animation:"fadeInUp .25s ease"}}>
          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
          <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-gray-700 line-clamp-2">{p.name}</p><p className="text-red-600 font-black text-sm">{fmt(p.price)}</p></div>
          <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="p-2 self-center"><Heart size={18} fill="#ef4444" className="text-red-500"/></button>
        </div>
      ))}
    </div>
  );
}

function CartPage({cart,setCart,firstPurchase,setFirstPurchase,onOrderComplete}){
  const[cep,setCep]=useState("");const[ship,setShip]=useState(null);
  const[coupon,setCoupon]=useState("");const[applied,setApplied]=useState(null);const[cpnMsg,setCpnMsg]=useState("");
  const[pay,setPay]=useState("pix");const[done,setDone]=useState(false);const[sending,setSending]=useState(false);
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipFinal=applied?.type==="shipping"?0:(ship??0);
  let disc=0;if(applied){if(applied.type==="fixed")disc=Math.min(applied.value,sub);if(applied.type==="percent")disc=sub*(applied.value/100);if(applied.type==="shipping")disc=ship||0;}
  const total=Math.max(0,sub+shipFinal-(applied?.type!=="shipping"?disc:0));
  const chkCep=()=>{const c=cep.replace(/\D/g,"");if(c.length<8)return alert("CEP inválido");if(!c.startsWith("6"))return alert("Só CEPs do Ceará!");setShip(shipCalc(c,firstPurchase));};
  const applyC=()=>{const c=COUPONS[coupon.toUpperCase()];if(!c){setCpnMsg("Cupom inválido");return;}setApplied({...c,code:coupon.toUpperCase()});setCpnMsg("Cupom aplicado: "+c.label);};
  const chgQ=(id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.min(5,Math.max(1,i.qty+d))}:i));
  const finalize=async()=>{if(!cep)return alert("Informe seu CEP");setSending(true);await new Promise(r=>setTimeout(r,1200));onOrderComplete({items:cart,total,payment:pay});setCart([]);setFirstPurchase(false);setSending(false);setDone(true);};
  if(done)return(<div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center gap-4 mt-8" style={{animation:"fadeInUp .4s ease"}}><div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"><Check size={36} className="text-green-600"/></div><h2 className="font-black text-2xl text-gray-800">Compra Concluída!</h2><p className="text-gray-400 text-sm">Seu pedido foi recebido. Em breve entraremos em contato!</p><button onClick={()=>window.open(`https://wa.me/${WA}`,"_blank")} className="flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-bold" style={{background:"linear-gradient(135deg,#25d366,#128c7e)"}}><MessageCircle size={18}/>Acompanhar no WhatsApp</button></div>);
  if(!cart.length)return<div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3"><ShoppingCart size={44} className="text-gray-200"/><p className="font-semibold text-gray-400">Carrinho vazio</p></div>;
  return(
    <div className="px-4 pb-32 mt-2 space-y-4">
      <p className="font-black text-gray-800 text-base">Carrinho ({cart.length})</p>
      {cart.map(item=>(
        <div key={item.id} className="bg-white rounded-2xl shadow-sm p-3 flex gap-3">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 line-clamp-2">{item.name}</p>
            <p className="text-red-600 font-black text-sm">{fmt(item.price)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button onClick={()=>chgQ(item.id,-1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"><Minus size={12}/></button>
              <span className="text-sm font-bold w-4 text-center tabular-nums">{item.qty}</span>
              <button onClick={()=>chgQ(item.id,1)} disabled={item.qty>=5} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"><Plus size={12}/></button>
              <span className="text-[10px] text-gray-400 ml-1">máx.5</span>
              <button onClick={()=>setCart(c=>c.filter(i=>i.id!==item.id))} className="ml-auto p-1"><Trash2 size={14} className="text-red-400"/></button>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-2xl p-4 shadow-sm"><p className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-1.5"><MapPin size={13} className="text-red-500"/>Frete</p><div className="flex gap-2"><input value={cep} onChange={e=>setCep(e.target.value)} maxLength={9} placeholder="CEP (Ceará)" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors"/><button onClick={chkCep} className="text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>OK</button></div>{ship!==null&&<p className="text-xs text-green-700 font-semibold mt-2">{ship===0?"Frete Grátis (1ª compra)!":"Frete: "+fmt(ship)}</p>}</div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><p className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-1.5"><Tag size={13} className="text-red-500"/>Cupom</p><div className="flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="ARTLOVERS" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none font-mono tracking-widest focus:border-red-400 transition-colors"/><button onClick={applyC} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95">Aplicar</button></div>{cpnMsg&&<p className={"text-xs mt-2 font-semibold "+(applied?"text-green-600":"text-red-500")}>{cpnMsg}</p>}</div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><p className="font-bold text-sm text-gray-700 mb-3">Forma de Pagamento</p>{[{id:"pix",Icon:QrCode,label:"Pix",sub:"Aprovação imediata"},{id:"credit",Icon:CreditCard,label:"Cartão",sub:"Até 12x sem juros"},{id:"store",Icon:Store,label:"Retirada",sub:"Grátis · 1 dia"}].map(({id,Icon,label,sub})=>(<button key={id} onClick={()=>setPay(id)} className={"w-full flex items-center gap-3 p-3 rounded-xl mb-2 border-2 transition-all active:scale-[0.98] "+(pay===id?"border-red-500 bg-red-50":"border-gray-100")}><Icon size={17} className={pay===id?"text-red-600":"text-gray-400"}/><div className="flex-1 text-left"><p className={"text-sm font-semibold "+(pay===id?"text-red-700":"text-gray-700")}>{label}</p><p className="text-xs text-gray-400">{sub}</p></div>{pay===id&&<Check size={15} className="text-red-600"/>}</button>))}</div>
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1 text-sm"><div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{fmt(sub)}</span></div><div className="flex justify-between text-gray-500"><span>Frete</span><span>{ship!==null?fmt(shipFinal):"—"}</span></div>{disc>0&&<div className="flex justify-between text-green-600 font-semibold"><span>Desconto</span><span>-{fmt(disc)}</span></div>}<div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-800 text-base"><span>Total</span><span className="text-red-600">{fmt(total)}</span></div></div>
      <button onClick={finalize} disabled={sending} className="w-full text-white py-4 rounded-2xl font-black text-base shadow flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>{sending?<RefreshCw size={20} className="animate-spin"/>:<ShieldCheck size={20}/>}{sending?"Finalizando...":"Finalizar Compra"}</button>
    </div>
  );
}

function AuthModal({auth,onClose}){
  const[mode,setMode]=useState("login");
  const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");
  const[pass,setPass]=useState("");const[pass2,setPass2]=useState("");const[showP,setShowP]=useState(false);const[err,setErr]=useState("");
  const submit=()=>{
    setErr("");
    if(mode==="login"){if(!auth.login(email,pass)){setErr("Email ou senha incorretos");return;}onClose();}
    else{
      if(!name.trim())return setErr("Informe seu nome");
      if(!email.includes("@"))return setErr("Email inválido");
      if(pass.length<4)return setErr("Senha deve ter ao menos 4 caracteres");
      if(pass!==pass2)return setErr("Senhas não conferem");
      const r=auth.register(name.trim(),email,phone,pass);if(!r.ok)return setErr(r.msg);onClose();
    }
  };
  return(
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-end" style={{animation:"fadeIn .2s ease"}}>
      <div className="bg-white w-full rounded-t-3xl p-6 space-y-4" style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s ease"}}>
        <div className="flex items-center justify-between"><h2 className="font-black text-xl text-gray-800">{mode==="login"?"Entrar":"Criar conta"}</h2><button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} className="text-gray-500"/></button></div>
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button onClick={()=>{setMode("login");setErr("");}} className={"flex-1 py-2 rounded-xl text-sm font-bold transition-all "+(mode==="login"?"bg-white text-gray-800 shadow-sm":"text-gray-400")}>Entrar</button>
          <button onClick={()=>{setMode("register");setErr("");}} className={"flex-1 py-2 rounded-xl text-sm font-bold transition-all "+(mode==="register"?"bg-white text-gray-800 shadow-sm":"text-gray-400")}>Cadastrar</button>
        </div>
        {mode==="register"&&<>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">Nome completo</label><div className="flex items-center border border-gray-200 rounded-2xl px-3 py-3 gap-2 focus-within:border-red-400 transition-colors"><User size={15} className="text-gray-300"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" className="flex-1 text-sm outline-none"/></div></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">Telefone</label><div className="flex items-center border border-gray-200 rounded-2xl px-3 py-3 gap-2 focus-within:border-red-400 transition-colors"><Phone size={15} className="text-gray-300"/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(85) 99999-9999" type="tel" className="flex-1 text-sm outline-none"/></div></div>
        </>}
        <div><label className="text-xs font-bold text-gray-500 mb-1 block">E-mail</label><div className="flex items-center border border-gray-200 rounded-2xl px-3 py-3 gap-2 focus-within:border-red-400 transition-colors"><Mail size={15} className="text-gray-300"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" className="flex-1 text-sm outline-none"/></div></div>
        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Senha</label><div className="flex items-center border border-gray-200 rounded-2xl px-3 py-3 gap-2 focus-within:border-red-400 transition-colors"><Lock size={15} className="text-gray-300"/><input type={showP?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" className="flex-1 text-sm outline-none"/><button onClick={()=>setShowP(x=>!x)}>{showP?<EyeOff size={15} className="text-gray-300"/>:<Eye size={15} className="text-gray-300"/>}</button></div></div>
        {mode==="register"&&<div><label className="text-xs font-bold text-gray-500 mb-1 block">Confirmar senha</label><div className="flex items-center border border-gray-200 rounded-2xl px-3 py-3 gap-2 focus-within:border-red-400 transition-colors"><Lock size={15} className="text-gray-300"/><input type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="••••••••" className="flex-1 text-sm outline-none"/></div></div>}
        {err&&<div className="bg-red-50 border border-red-100 rounded-2xl px-3 py-2 flex items-center gap-2"><AlertCircle size={14} className="text-red-500 shrink-0"/><p className="text-red-600 text-xs font-semibold">{err}</p></div>}
        <button onClick={submit} className="w-full text-white py-3.5 rounded-2xl font-black text-sm active:scale-95 transition-transform flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>{mode==="login"?<><User size={16}/>Entrar</>:<><UserPlus size={16}/>Criar conta</>}</button>
      </div>
    </div>
  );
}

function UserPage({auth,onNav}){
  if(!auth.user)return(<div className="px-4 pb-24 mt-12 flex flex-col items-center gap-4"><div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center"><User size={36} className="text-red-300"/></div><p className="font-black text-gray-800 text-xl">Minha Conta</p><p className="text-gray-400 text-sm text-center">Faça login para acessar seus pedidos, cupons e mais</p><button onClick={()=>onNav("login")} className="w-full text-white py-3.5 rounded-2xl font-black" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Entrar / Criar conta</button></div>);
  return(
    <div className="pb-24">
      <div className="p-5" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black text-white">{auth.user.avatar}</div>
          <div><p className="text-white font-black text-lg">{auth.user.name}</p><p className="text-white/70 text-xs">{auth.user.email}</p>{auth.user.phone&&<p className="text-white/60 text-xs">{auth.user.phone}</p>}</div>
        </div>
      </div>
      <div className="px-4 pt-4 space-y-3">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[{label:"Meus Pedidos",Icon:Package,action:"orders"},{label:"Meus Cupons",Icon:Tag,action:"coupons"},{label:"Favoritos",Icon:Heart,action:"favorites"},{label:"Meu Endereço",Icon:MapPin,action:null}].map(({label,Icon,action},i)=>(
            <button key={i} onClick={()=>action&&onNav(action)} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"><Icon size={17} className="text-gray-400"/><span className="text-sm font-semibold text-gray-700 flex-1 text-left">{label}</span><ChevronRight size={15} className="text-gray-200"/></button>
          ))}
        </div>
        <button onClick={auth.logout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 rounded-2xl text-gray-500 font-bold text-sm active:scale-95 transition-transform"><LogOut size={15}/>Sair da conta</button>
      </div>
    </div>
  );
}

function OrdersPage({orders}){
  return(
    <div className="px-4 pb-24 mt-2">
      <p className="font-black text-gray-800 text-base mb-3">Meus Pedidos</p>
      {!orders.length?<div className="text-center py-16 text-gray-300"><Package size={44} className="mx-auto mb-3"/><p className="font-semibold text-gray-400">Nenhum pedido ainda</p></div>
      :orders.map(o=>(
        <div key={o.id} className="bg-white rounded-2xl shadow-sm p-4 mb-3" style={{animation:"fadeInUp .25s ease"}}>
          <div className="flex items-center justify-between mb-2"><span className="font-black text-gray-800 text-sm">{o.id}</span><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10}/>Confirmado</span></div>
          <p className="text-xs text-gray-400 mb-2">{o.date}</p>
          {o.items?.map((it,i)=><p key={i} className="text-xs text-gray-500 line-clamp-1">· {it.name} ×{it.qty}</p>)}
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between"><span className="text-xs text-gray-400">Total</span><span className="font-black text-red-600 text-sm">{fmt(o.total)}</span></div>
        </div>
      ))}
    </div>
  );
}

function PoliciesPage(){
  return(
    <div className="pb-24">
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden shadow-sm mb-4" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <div className="p-5 flex items-center gap-3"><ShieldCheck size={32} className="text-white/80"/><div><p className="text-white/70 text-xs">Art Móveis</p><h1 className="text-white font-black text-xl">Nossas Políticas</h1><p className="text-white/60 text-xs mt-0.5">Políticas de compra e entrega da loja</p></div></div>
      </div>
      <div className="px-4 space-y-3">{POLITICAS.map((s,i)=><div key={i} className="bg-white rounded-2xl p-4 shadow-sm" style={{animation:"fadeInUp .25s ease"}}><p className="font-black text-gray-800 text-sm mb-2">{s.title}</p><p className="text-xs text-gray-500 leading-relaxed">{s.body}</p></div>)}</div>
    </div>
  );
}

function MenuPage({onNav,bling,onBling,auth}){
  return(
    <div className="px-4 pb-24 mt-2 space-y-3">
      {auth.user
        ?<button onClick={()=>onNav("user")} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm active:bg-gray-50 transition-colors"><div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>{auth.user.avatar}</div><div className="flex-1 text-left"><p className="font-black text-gray-800">{auth.user.name}</p><p className="text-xs text-gray-400">{auth.user.email}</p></div><ChevronRight size={15} className="text-gray-200"/></button>
        :<button onClick={()=>onNav("login")} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm active:bg-gray-50 transition-colors"><div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center"><User size={22} className="text-red-300"/></div><div className="flex-1 text-left"><p className="font-black text-gray-800">Entrar / Criar conta</p><p className="text-xs text-gray-400">Acesse pedidos e cupons</p></div><ChevronRight size={15} className="text-gray-200"/></button>
      }
      <button onClick={onBling} className={"w-full flex items-center gap-3 rounded-2xl p-4 border-2 text-left transition-all "+(bling.status==="ok"?"bg-green-50 border-green-200":"bg-white border-gray-100")}>
        <div className={"w-11 h-11 rounded-2xl flex items-center justify-center "+(bling.status==="ok"?"bg-green-100":"bg-gray-100")}>{bling.status==="ok"?<Wifi size={20} className="text-green-600"/>:<WifiOff size={20} className="text-gray-400"/>}</div>
        <div className="flex-1"><p className="font-black text-gray-800 text-sm">Integração Bling</p><p className="text-xs text-gray-400">{bling.status==="ok"?`Conectado · ${bling.products.length} produtos`:"Toque para conectar"}</p></div>
        <Settings size={16} className="text-gray-300"/>
      </button>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[{label:"Meus Pedidos",Icon:Package,action:"orders"},{label:"Favoritos",Icon:Heart,action:"favorites"},{label:"Cupons",Icon:Tag,action:"coupons"},{label:"Art Lovers",Icon:Crown,action:"artlovers"},{label:"Lançamentos",Icon:Sparkles,action:"new"},{label:"Políticas da Loja",Icon:ShieldCheck,action:"policies"}].map(({label,Icon,action},i)=>(
          <button key={i} onClick={()=>onNav(action)} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"><Icon size={17} className="text-gray-400"/><span className="text-sm font-semibold text-gray-700 flex-1 text-left">{label}</span><ChevronRight size={15} className="text-gray-200"/></button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[{label:"Atendimento e Pós-venda",Icon:MessageCircle,action:()=>window.open(`https://wa.me/${WA}`,"_blank")},{label:"Instagram @lojasartmoveis",Icon:Instagram,action:()=>window.open("https://www.instagram.com/lojasartmoveis","_blank")}].map(({label,Icon,action},i)=>(
          <button key={i} onClick={action} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"><Icon size={17} className="text-gray-400"/><span className="text-sm font-semibold text-gray-700 flex-1 text-left">{label}</span><ChevronRight size={15} className="text-gray-200"/></button>
        ))}
      </div>
    </div>
  );
}

function BlingSetup({bling,onClose}){
  const info={idle:{bg:"bg-gray-50",tx:"text-gray-600",Icon:Settings,msg:"Backend não detectado"},connecting:{bg:"bg-yellow-50",tx:"text-yellow-700",Icon:RefreshCw,msg:"Conectando ao Bling...",spin:true},ok:{bg:"bg-green-50",tx:"text-green-700",Icon:CheckCircle,msg:`Conectado · ${bling.products.length} produtos`},error:{bg:"bg-red-50",tx:"text-red-700",Icon:AlertCircle,msg:"Erro. Verifique o backend."}}[bling.status]||{bg:"bg-gray-50",tx:"text-gray-600",Icon:Settings,msg:"..."};
  return(
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end" style={{animation:"fadeIn .2s ease"}}>
      <div className="bg-white w-full rounded-t-3xl p-6 space-y-4" style={{maxHeight:"80vh",overflowY:"auto",animation:"slideUp .3s ease"}}>
        <div className="flex items-center justify-between"><div><p className="font-black text-xl text-gray-800">Integração Bling</p><p className="text-xs text-gray-400 mt-0.5">Produtos, preços e estoque em tempo real</p></div><button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} className="text-gray-500"/></button></div>
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${info.bg} ${info.tx}`}><info.Icon size={15} className={info.spin?"animate-spin":""}/>{info.msg}</div>
        <div className="flex gap-2">
          <button onClick={bling.connect} disabled={bling.status==="connecting"||bling.syncing} className="flex-1 text-white py-3.5 rounded-2xl font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>{bling.status==="connecting"?<><RefreshCw size={14} className="animate-spin"/>Conectando...</>:<><Wifi size={14}/>Conectar ao Bling</>}</button>
          {bling.status==="ok"&&<button onClick={bling.sync} className="px-4 py-3.5 bg-gray-100 rounded-2xl text-gray-600 font-bold text-sm flex items-center gap-1 active:scale-95"><RefreshCw size={13} className={bling.syncing?"animate-spin":""}/>Sync</button>}
        </div>
        {bling.lastSync&&<p className="text-center text-xs text-gray-400">Última sync: {bling.lastSync.toLocaleTimeString("pt-BR")}</p>}
      </div>
    </div>
  );
}

export default function App(){
  const bling=useBling();const auth=useAuth();
  const[page,setPage]=useState("home");const[sel,setSel]=useState(null);
  const[cart,setCart]=useState([]);const[firstBuy,setFirstBuy]=useState(true);
  const[q,setQ]=useState("");const[activeQ,setActiveQ]=useState("");
  const[nav,setNav]=useState("home");const[showBling,setShowBling]=useState(false);
  const[showAuth,setShowAuth]=useState(false);const[favs,setFavs]=useState([]);
  const scrollRef=useRef(null);

  const go=id=>{if(id==="login"){setShowAuth(true);return;}setPage(id);if(["home","cart","favorites","menu"].includes(id))setNav(id);scrollRef.current?.scrollTo(0,0);setActiveQ("");};
  const goProduct=p=>{setSel(p);setPage("product");scrollRef.current?.scrollTo(0,0);};
  const addCart=p=>setCart(c=>{const ex=c.find(i=>i.id===p.id);return ex?c.map(i=>i.id===p.id&&i.qty<5?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}];});
  const toggleFav=id=>setFavs(f=>f.includes(id)?f.filter(i=>i!==id):[...f,id]);
  const handleNav=id=>{if(id==="live"){window.open("https://www.instagram.com/lojasartmoveis","_blank");return;}go(id);};
  const doSearch=()=>{if(q.trim()){setActiveQ(q.trim());setPage("search");}};
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const showBack=page==="product"||!["home","cart","favorites","menu"].includes(page);
  const cp={favs,onFav:toggleFav};

  const renderPage=()=>{
    if(activeQ&&page==="search")return<SearchPage query={activeQ}products={bling.products}onProduct={goProduct}onCart={addCart}{...cp}/>;
    if(page==="product"&&sel)return<ProductPage product={sel}allProducts={bling.products}onCart={addCart}firstPurchase={firstBuy}{...cp}/>;
    if(page==="offers")return<OffersPage products={bling.products}onProduct={goProduct}onCart={addCart}/>;
    if(page==="coupons")return<CouponsPage/>;
    if(page==="bestsellers")return<BestSellersPage products={bling.products}onProduct={goProduct}/>;
    if(page==="artlovers")return<ArtLoversPage products={bling.products}onProduct={goProduct}onCart={addCart}/>;
    if(page==="new")return<NewPage products={bling.products}onProduct={goProduct}onCart={addCart}{...cp}/>;
    if(page==="cart")return<CartPage cart={cart}setCart={setCart}firstPurchase={firstBuy}setFirstPurchase={setFirstBuy}onOrderComplete={o=>{auth.addOrder(o);setFirstBuy(false);}}/>;
    if(page==="favorites")return<FavoritesPage products={bling.products}favs={favs}onProduct={goProduct}onFav={toggleFav}/>;
    if(page==="orders")return<OrdersPage orders={auth.orders}/>;
    if(page==="user")return<UserPage auth={auth}onNav={go}/>;
    if(page==="policies")return<PoliciesPage/>;
    if(page==="menu")return<MenuPage onNav={go}bling={bling}onBling={()=>setShowBling(true)}auth={auth}/>;
    return<HomePage products={bling.products}onProduct={goProduct}onCart={addCart}onNav={handleNav}blingOk={bling.status==="ok"}{...cp}/>;
  };

  return(
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Header cartCount={cartCount}onCart={()=>go("cart")}q={q}setQ={setQ}onSearch={doSearch}showBack={showBack}onBack={()=>{setPage("home");setNav("home");setActiveQ("");}}bling={bling}onBling={()=>setShowBling(true)}onUser={()=>go(auth.user?"user":"login")}user={auth.user}/>
      <div ref={scrollRef} className="pt-28 pb-20 overflow-y-auto min-h-screen">{renderPage()}</div>
      <BottomNav active={nav}onNav={handleNav}cartCount={cartCount}/>
      {showBling&&<BlingSetup bling={bling}onClose={()=>setShowBling(false)}/>}
      {showAuth&&<AuthModal auth={auth}onClose={()=>setShowAuth(false)}/>}
    </div>
  );
}
