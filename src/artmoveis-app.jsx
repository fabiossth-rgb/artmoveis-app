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
  @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
  @keyframes floatY{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
  @keyframes floatX{0%,100%{transform:translateX(0px) rotate(0deg)}50%{transform:translateX(10px) rotate(8deg)}}
  @keyframes pulse3{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.3;transform:scale(1.08)}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
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

const LS={
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

function useAuth(){
  const[users,setUsers]=useState(()=>LS.get("art_users",[]));
  const[user,setUser]=useState(()=>LS.get("art_session",null));
  const[orders,setOrders]=useState(()=>LS.get("art_orders",[]));
  const register=(name,email,phone,pass,address="")=>{
    const cur=LS.get("art_users",[]);
    if(cur.find(u=>u.email===email))return{ok:false,msg:"Email já cadastrado"};
    const u={name,email,phone,avatar:name[0].toUpperCase(),address};
    const next=[...cur,{...u,pass}];
    setUsers(next);LS.set("art_users",next);
    const sess={name:u.name,email:u.email,phone:u.phone,avatar:u.avatar,address:u.address};
    setUser(sess);LS.set("art_session",sess);
    return{ok:true};
  };
  const login=(email,pass)=>{
    const cur=LS.get("art_users",[]);
    const f=cur.find(u=>u.email===email&&u.pass===pass);
    if(f){const sess={name:f.name,email:f.email,phone:f.phone,avatar:f.avatar,address:f.address||""};setUser(sess);LS.set("art_session",sess);return true;}
    return false;
  };
  const logout=()=>{setUser(null);LS.set("art_session",null);};
  const addOrder=o=>{
    const novo={id:`ART-${Date.now()}`,date:new Date().toLocaleDateString("pt-BR"),...o};
    const next=[novo,...LS.get("art_orders",[])];
    setOrders(next);LS.set("art_orders",next);
  };
  const updateAddress=(address)=>{
    if(!user)return;
    const sess={...user,address};setUser(sess);LS.set("art_session",sess);
    const cur=LS.get("art_users",[]);
    LS.set("art_users",cur.map(u=>u.email===user.email?{...u,address}:u));
  };
  return{user,users,orders,register,login,logout,addOrder,updateAddress};
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
        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{o}% OFF</span>
        {p.isNew&&<span className="absolute top-1.5 right-7 bg-emerald-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">NOVO</span>}
        <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><Heart size={11}fill={fav?"#ef4444":"none"}stroke={fav?"#ef4444":"#9ca3af"}/></button>
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug mb-1">{p.name}</p>
        <p className="text-[10px] text-gray-400 line-through">{fmt(p.oldPrice)}</p>
        <p className="text-sm font-black text-red-600 leading-tight">{fmt(p.price)}</p>
        <button onClick={e=>{e.stopPropagation();onCart(p,true);}} className="mt-1.5 w-full text-white text-[11px] py-1.5 rounded-xl font-bold active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Comprar agora</button>
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
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{o}% OFF</span>
        {p.isNew&&<span className="absolute top-2 right-7 bg-emerald-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">NOVO</span>}
        <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><Heart size={11}fill={fav?"#ef4444":"none"}stroke={fav?"#ef4444":"#9ca3af"}/></button>
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-600 line-clamp-2 font-medium leading-snug">{p.name}</p>
        <p className="text-[10px] text-gray-400 line-through">{fmt(p.oldPrice)}</p>
        <p className="text-sm font-black text-red-600">{fmt(p.price)}</p>
        <button onClick={e=>{e.stopPropagation();onCart(p,true);}} className="mt-1.5 w-full text-white text-[11px] py-1.5 rounded-xl font-bold active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>Comprar agora</button>
      </div>
    </div>
  );
}

function Header({cartCount,onCart,q,setQ,onSearch,showBack,onBack,onUser,user,onHome}){
  return(
    <div className="fixed top-0 left-0 right-0 z-50" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
      <style>{GLOBAL_CSS}</style>
      <div className="px-4 pt-10 pb-2">
        <div className="flex items-center gap-3 mb-2">
          {showBack
            ?<button onClick={onBack} className="text-white p-1 active:scale-90 transition-transform"><ArrowLeft size={22}/></button>
            :<button onClick={onHome} className="active:scale-90 transition-transform"><img src="data:image/png;base64,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" alt="Art Móveis" className="h-10 object-contain"/></button>
          }
          <div className="flex-1 bg-white rounded-2xl flex items-center px-3 py-2 gap-2 shadow-sm">
            <Search size={14} className="text-gray-400 flex-shrink-0"/>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch()} placeholder="Buscar móveis..." className="flex-1 text-sm outline-none text-gray-700 bg-transparent"/>
            {q&&<button onClick={()=>setQ("")}><X size={13} className="text-gray-400"/></button>}
          </div>
          <button onClick={onCart} className="text-white p-1.5 relative active:scale-90 transition-transform">
            <ShoppingCart size={22}/>
            {cartCount>0&&<span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center" style={{animation:"pulse2 1.2s ease infinite"}}>{cartCount}</span>}
          </button>
          <button onClick={onUser} className="text-white p-1.5 active:scale-90 transition-transform">
            {user?<div className="w-7 h-7 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-xs font-black text-white">{user.avatar}</div>:<User size={22}/>}
          </button>
        </div>
        <div className="flex items-center pb-1">
          <span className="text-white/90 text-[11px] font-medium flex items-center gap-1"><Truck size={11}/>Entregamos em todo o Ceará ou retire em uma loja!</span>
        </div>
      </div>
    </div>
  );
}

function BottomNav({active,onNav,cartCount}){
  const items=[{id:"home",Icon:Home,label:"Início"},{id:"favorites",Icon:Heart,label:"Favoritos"},{id:"cart",Icon:ShoppingCart,label:"Carrinho"},{id:"whatsapp",Icon:MessageCircle,label:"WhatsApp"},{id:"menu",Icon:Menu,label:"Menu"}];
  return(
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50 shadow-lg" style={{paddingBottom:"env(safe-area-inset-bottom)"}}>
      {items.map(({id,Icon,label})=>(
        <button key={id} onClick={()=>{if(id==="whatsapp"){window.open(`https://wa.me/${WA}`,"_blank");return;}onNav(id);}} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 active:scale-90 transition-transform">
          <div className="relative">
            <Icon size={21} className={active===id?"text-red-600":"text-gray-400"}/>
            {id==="cart"&&cartCount>0&&<span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </div>
          <span className={"text-[9px] font-semibold "+(active===id?"text-red-600":"text-gray-400")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function BannerCarousel(){
  const[i,setI]=useState(0);
  const bs=[
    {title:"Bem-vindo à Art Móveis",sub:"Os melhores móveis do Ceará!",Icon:Store,grad:"linear-gradient(135deg,#b91c1c,#7f1d1d)",accent:"#ff6b6b"},
    {title:"Seja um Art Lover",sub:"Ganhe cupons exclusivos!",Icon:Crown,grad:"linear-gradient(135deg,#9b2335,#c0392b)",accent:"#ffd700"},
    {title:"Frete Grátis",sub:"Na sua primeira compra!",Icon:Truck,grad:"linear-gradient(135deg,#c0392b,#e74c3c)",accent:"#90ee90"},
  ];
  useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%3),3800);return()=>clearInterval(t);},[]);
  const b=bs[i];
  return(
    <div className="mx-4 rounded-3xl shadow-lg relative overflow-hidden" style={{minHeight:120,background:b.grad,transition:"background .6s ease"}}>
      {/* Shimmer animado */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div style={{position:"absolute",top:0,left:0,width:"40%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",animation:"shimmer 2.5s ease infinite"}}/>
      </div>
      {/* Círculos decorativos animados */}
      <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.07)",animation:"pulse3 3s ease infinite"}}/>
      <div style={{position:"absolute",right:30,bottom:-30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)",animation:"pulse3 3s ease infinite 1s"}}/>
      {/* Ícone flutuante */}
      <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",animation:"floatY 3s ease infinite",opacity:0.25}}>
        <b.Icon size={64} color="white"/>
      </div>
      <div className="relative p-5">
        <p className="text-white font-black text-lg leading-tight drop-shadow-sm">{b.title}</p>
        <p className="text-white/85 text-sm mt-0.5">{b.sub}</p>
        <button className="mt-3 bg-white text-red-700 text-xs font-black px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">Ver agora</button>
      </div>
      <div className="absolute bottom-2.5 right-4 flex gap-1.5">{bs.map((_,x)=><div key={x} style={{transition:"all .3s ease",width:x===i?16:6,height:6,borderRadius:3,background:x===i?"white":"rgba(255,255,255,0.4)"}}/>)}</div>
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

function CategoryBar({active,onSelect,cats}){
  return(
    <div className="flex overflow-x-auto px-4 border-b border-gray-100">
      {cats.map(c=>(
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
        <div className="flex items-center gap-2"><h2 className="font-black text-gray-800 text-base">{title}</h2>{TitleExtra&&<TitleExtra/>}</div>
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

function StoreBanner(){
  return(
    <button onClick={()=>window.open("https://maps.app.goo.gl/rLC7QmFXMW7JVjms8","_blank")} className="mx-4 rounded-3xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform" style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",minHeight:120}}>
      <div className="relative overflow-hidden h-full">
        <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:"40%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)",animation:"shimmer 3s ease infinite"}}/>
        </div>
        <div style={{position:"absolute",right:-15,top:"50%",transform:"translateY(-50%)",opacity:0.15,animation:"floatX 4s ease infinite"}}>
          <MapPin size={90} color="white"/>
        </div>
        <div style={{position:"absolute",right:40,bottom:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)",animation:"pulse3 3s ease infinite"}}/>
        <div className="relative p-5">
          <p className="text-white font-black text-lg leading-tight drop-shadow-sm">Encontre aqui uma loja!</p>
          <p className="text-white/80 text-sm mt-0.5">Visite uma de nossas lojas físicas</p>
          <button className="mt-3 bg-white text-blue-700 text-xs font-black px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">Ver no mapa</button>
        </div>
        <div className="absolute bottom-2.5 right-4 flex gap-1.5"><div style={{width:16,height:6,borderRadius:3,background:"white"}}/><div style={{width:6,height:6,borderRadius:3,background:"rgba(255,255,255,0.4)"}}/><div style={{width:6,height:6,borderRadius:3,background:"rgba(255,255,255,0.4)"}}/></div>
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

function CategoryMinibanners({onNav}){
  return(
    <div className="flex gap-3 px-4">
      <button onClick={()=>onNav&&onNav("cat_box")} className="flex-1 rounded-2xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform relative" style={{background:"linear-gradient(135deg,#e91e7a,#f06292)",minHeight:80}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",animation:"shimmer 3.5s ease infinite"}}/>
        </div>
        <div style={{position:"absolute",right:-8,bottom:-8,opacity:0.15,animation:"floatY 3s ease infinite"}}>
          <Package size={56} color="white"/>
        </div>
        <div className="relative p-3.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center mb-2"><Package size={16} className="text-white"/></div>
          <p className="text-white font-black text-sm leading-tight">Camas no precinho</p>
          <p className="text-white/60 text-[10px] mt-0.5">Box & Colchões</p>
        </div>
      </button>
      <button onClick={()=>onNav&&onNav("cat_coz")} className="flex-1 rounded-2xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform relative" style={{background:"linear-gradient(135deg,#4a1942,#c0392b)",minHeight:80}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",animation:"shimmer 4s ease infinite 0.5s"}}/>
        </div>
        <div style={{position:"absolute",right:-8,bottom:-8,opacity:0.15,animation:"floatY 3.5s ease infinite 0.5s"}}>
          <Crown size={56} color="white"/>
        </div>
        <div className="relative p-3.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center mb-2"><Crown size={16} className="text-white"/></div>
          <p className="text-white font-black text-sm leading-tight">Cozinhas escolhidas</p>
          <p className="text-white/60 text-[10px] mt-0.5">pela chefinha 👩‍🍳</p>
        </div>
      </button>
    </div>
  );
}

function HomePage({products,onProduct,onCart,onNav,onNav2,favs,onFav,initCat="Todos",onCatUsed}){
  const[cat,setCat]=useState(initCat);
  useEffect(()=>{if(initCat&&initCat!=="Todos"){setCat(initCat);onCatUsed&&onCatUsed();}},[initCat]);
  const[randSeed]=useState(()=>Math.random());
  const shuffled=useMemo(()=>[...products].sort(()=>randSeed-Math.random()),[products,randSeed]);
  const dynCats=useMemo(()=>["Todos",...Array.from(new Set(products.map(p=>p.category).filter(Boolean))).sort(),"Promoções e descontos"],[products]);
  const filtered=cat==="Todos"?products:cat==="Promoções e descontos"?products.filter(p=>off(p.price,p.oldPrice)>=20):products.filter(p=>p.category===cat);
  const cp={onPress:onProduct,onCart,favs,onFav};
  return(
    <div className="space-y-4 pb-4">
      <BannerCarousel/>
      <QuickLinks onNav={onNav}/>
      <CategoryBar active={cat} onSelect={setCat} cats={dynCats}/>
      
      {cat==="Todos"?(
        <>
          <Shelf title="Mais Vendidos" items={[...products].sort((a,b)=>b.sold-a.sold)} {...cp}/>
          <CategoryMinibanners onNav={onNav2||onNav}/>
          <Shelf title="Maiores Descontos" items={[...products].sort((a,b)=>off(b.price,b.oldPrice)-off(a.price,a.oldPrice))} {...cp}/>
          <Shelf title="Oferta do Dia" TitleExtra={Countdown} items={shuffled} {...cp}/>
          <InstaBanner/>
          <Shelf title="Estofados" items={products.filter(p=>p.category==="Estofados")} {...cp}/>
          <Shelf title="Quartos & Colchões" items={products.filter(p=>["Quarto","Box e Colchões"].includes(p.category))} {...cp}/>
          <GreenBanner/>
          <StoreBanner/>
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

function TrayCheckout({url, onClose}){
  return(
    <div className="fixed inset-0 z-[400] flex flex-col" style={{background:"#fff",animation:"fadeIn .2s ease"}}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>
        <button onClick={onClose} className="text-white active:scale-90 transition-transform p-1"><ArrowLeft size={22}/></button>
        <div className="flex-1">
          <p className="text-white font-black text-sm leading-tight">Finalizar Compra</p>
          <p className="text-white/70 text-[10px]">lojasartmoveis.com.br</p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
          <ShieldCheck size={10} className="text-white"/>
          <span className="text-white text-[10px] font-bold">Seguro</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={url}
          className="w-full h-full border-none"
          style={{minHeight:"calc(100vh - 60px)"}}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          title="Finalizar compra"
        />
      </div>
    </div>
  );
}

function SellerCode(){
  const[code,setCode]=useState("");const[ok,setOk]=useState(false);
  const apply=()=>{if(code.trim().length>=3){setOk(true);}};
  return ok
    ?<div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2"><CheckCircle size={13} className="text-green-600"/><span className="text-xs text-green-700 font-semibold">Código <b>{code.toUpperCase()}</b> registrado!</span></div>
    :<div className="flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Ex: VEND001" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors font-mono"/><button onClick={apply} className="text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>OK</button></div>;
}

function ProductPage({product,allProducts,onCart,onProduct,firstPurchase,favs,onFav}){
  const[cep,setCep]=useState("");const[ship,setShip]=useState(null);
  const[ur,setUr]=useState(0);const[hov,setHov]=useState(0);const[comment,setCmt]=useState("");
  const POOL_REVIEWS=[
    {user:"Maria S.",stars:5,text:"Lindo demais! Chegou antes do prazo previsto."},
    {user:"João P.",stars:4,text:"Ótima qualidade, montagem fácil e rápida."},
    {user:"Ana C.",stars:5,text:"Superou minhas expectativas! Muito bem acabado."},
    {user:"Carlos M.",stars:5,text:"Produto igual ao da foto, entrega rápida."},
    {user:"Fernanda R.",stars:4,text:"Lindo! Combinou perfeitamente com minha sala."},
    {user:"Lucas A.",stars:5,text:"Chegou embalado com muito cuidado. Amei!"},
    {user:"Patrícia L.",stars:3,text:"Produto bom, mas a montagem é um pouco trabalhosa."},
    {user:"Ricardo N.",stars:5,text:"Melhor compra que fiz esse ano, vale cada centavo."},
    {user:"Juliana F.",stars:4,text:"Qualidade excelente, recomendo muito."},
    {user:"Marcos V.",stars:5,text:"Entrega antes do prazo e produto impecável!"},
    {user:"Beatriz O.",stars:5,text:"Moderno e robusto, exatamente o que eu queria."},
    {user:"Thiago B.",stars:4,text:"Muito bonito, combinei com o restante da decoração."},
    {user:"Camila T.",stars:5,text:"Material de primeira, parece muito mais caro."},
    {user:"Diego S.",stars:4,text:"Boa compra, chegou no prazo e bem embalado."},
    {user:"Larissa M.",stars:5,text:"Produto de qualidade, estou muito satisfeita!"},
    {user:"Felipe C.",stars:5,text:"Comprei pra presente e a pessoa adorou!"},
    {user:"Aline R.",stars:4,text:"Bonito e funcional, recomendo a loja."},
    {user:"Bruno K.",stars:5,text:"Chegou rapidíssimo e está perfeito!"},
    {user:"Sabrina P.",stars:3,text:"Esperava um pouco mais pelo preço, mas no geral ok."},
    {user:"Renato G.",stars:5,text:"Melhor custo-benefício que encontrei. Voltarei a comprar!"},
  ];
  const prodReviews=useMemo(()=>{const seed=parseInt(String(product.id).replace(/\D/g,"").slice(-3)||"1");const sorted=[...POOL_REVIEWS].sort((_,__)=>Math.sin(seed*__.stars)-Math.cos(seed*_.stars));return sorted.slice(0,6+((seed)%5));},[product.id]);
  const[reviews,setRevs]=useState(prodReviews);
  const initImgs=product.images&&Array.isArray(product.images)&&product.images.length>1?product.images:[product.image];
  const[images,setImages]=useState(initImgs);
  const[activeImg,setActiveImg]=useState(0);
  const[showCheckout,setShowCheckout]=useState(false);
  const trayUrl=product.link||`https://www.lojasartmoveis.com.br/busca?q=${encodeURIComponent(product.name)}`;
  const o=off(product.price,product.oldPrice);const isFav=favs?.includes(product.id);
  const related=useMemo(()=>{const seed=typeof product.id==='number'?product.id:parseInt(String(product.id).replace(/\D/g,'')||'1');const seededSort=(a,b)=>{const ha=(a.id*2654435761)>>>0;const hb=(b.id*2654435761)>>>0;return((ha^seed)>>>0)-((hb^seed)>>>0);};return[...allProducts].filter(p=>p.id!==product.id).sort(seededSort).slice(0,10);},[product.id,allProducts]);
  const chkCep=()=>{const c=cep.replace(/\D/g,"");if(c.length<8)return alert("CEP inválido");if(!c.startsWith("6"))return alert("Só CEPs do Ceará!");setShip(shipCalc(c,firstPurchase));};
  const submitRev=()=>{if(!ur)return alert("Selecione uma nota");if(!comment.trim())return alert("Escreva seu comentário");setRevs(r=>[...r,{user:"Você",stars:ur,text:comment,date:new Date().toLocaleDateString("pt-BR")}]);setUr(0);setCmt("");};
  useEffect(()=>{
    const base=product.images&&Array.isArray(product.images)&&product.images.length>1?product.images:[product.image];
    setImages(base);
    setActiveImg(0);
    bGet(`/produtos/${product.id}`).then(d=>{
      if(d.ok&&d.images&&Array.isArray(d.images)&&d.images.length>0){
        const merged=[...new Set([...d.images,...base].filter(Boolean))];
        if(merged.length>1) setImages(merged);
      }
    }).catch(()=>{});
  },[product.id]);
  const[lightbox,setLightbox]=useState(false);
  return(<>
  {showCheckout&&<TrayCheckout url={trayUrl} onClose={()=>setShowCheckout(false)}/>}
  {lightbox&&(
    <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center" style={{animation:"fadeIn .2s ease"}} onClick={()=>setLightbox(false)}>
      <img src={images[activeImg]||product.image} alt={product.name} className="max-w-full max-h-full object-contain" style={{maxHeight:"90vh"}}/>
      <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><X size={22} className="text-white"/></button>
      {images.length>1&&(
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_,idx)=><button key={idx} onClick={e=>{e.stopPropagation();setActiveImg(idx);}} className="w-2.5 h-2.5 rounded-full transition-all" style={{background:activeImg===idx?"white":"rgba(255,255,255,0.4)"}}/>)}
        </div>
      )}
    </div>
  )}
    <div className="pb-28" style={{animation:"fadeInUp .3s ease"}}>
      <div className="relative">
        <img src={images[activeImg]||product.image} alt={product.name} className="w-full h-72 object-cover transition-all duration-300 cursor-zoom-in" onClick={()=>setLightbox(true)} onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
        <button onClick={()=>onFav(product.id)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center active:scale-90 transition-transform"><Heart size={20}fill={isFav?"#ef4444":"none"}stroke={isFav?"#ef4444":"#9ca3af"}/></button>
        {product.isNew&&<span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">Novidade</span>}
      </div>
      {images.length>1&&(
        <div className="flex gap-2 px-4 mt-3 overflow-x-auto pb-1">
          {images.map((img,idx)=>(
            <button key={idx} onClick={()=>setActiveImg(idx)} className="flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-200" style={{width:72,height:72,border:activeImg===idx?"2.5px solid #ef4444":"2.5px solid transparent",boxShadow:activeImg===idx?"0 0 0 1px #ef444440":"none"}}>
              <img src={img} alt="" className="w-full h-full object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
            </button>
          ))}
        </div>
      )}
      <div className="mx-4 -mt-6 bg-white rounded-2xl shadow-md p-4">
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{o}% OFF</span>
        <h1 className="text-gray-800 font-black text-base mt-2 leading-snug">{product.name}</h1>
        <p className="text-gray-400 line-through text-sm mt-1">{fmt(product.oldPrice)}</p>
        <p className="text-red-600 font-black text-3xl leading-tight">{fmt(product.price)}</p>
        <div className="flex items-center gap-2 mt-1"><Stars rating={product.rating}/><span className="text-xs text-gray-400">({reviews.length} avaliações)</span></div>
        <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1"><Truck size={12}/>Frete disponível para o Ceará</p>
      </div>
      <div className="mx-4 mt-3 flex gap-2">
        <button onClick={()=>setShowCheckout(true)} className="flex-1 text-white py-4 rounded-2xl font-black text-sm shadow flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}><ShoppingCart size={18}/>Comprar agora</button>
        <button onClick={()=>window.open(`https://wa.me/${WA}?text=Olá! Tenho interesse no produto: ${product.name} - ${trayUrl}`,"_blank")} className="px-4 py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform" style={{background:"linear-gradient(135deg,#25d366,#128c7e)"}}><MessageCircle size={20}/></button>
      </div>
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm"><p className="font-bold text-gray-800 text-sm mb-2">Descrição</p><p className="text-xs text-gray-500 leading-relaxed">{product.desc}</p></div>
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5"><MapPin size={14} className="text-red-500"/>Calcular Frete</p>
        <div className="flex gap-2"><input value={cep} onChange={e=>setCep(e.target.value)} maxLength={9} placeholder="Digite seu CEP" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors"/><button onClick={chkCep} className="text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95" style={{background:"linear-gradient(135deg,#b91c1c,#ef4444)"}}>OK</button></div>
        {ship!==null&&<p className="text-xs text-green-700 font-semibold flex items-center gap-1"><Truck size={12}/>{ship===0?"Frete Grátis na 1ª compra!":"Frete: "+fmt(ship)}</p>}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 font-semibold mb-1.5 flex items-center gap-1"><Tag size={11} className="text-gray-400"/>É vendedor? Coloque seu código:</p>
          <SellerCode/>
        </div>
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
              <div key={p.id} onClick={()=>onProduct(p)} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer flex-shrink-0 active:scale-[0.97] transition-transform" style={{width:140,animation:"fadeInUp .25s ease"}}>
                <img src={p.image} alt={p.name} className="w-full h-24 object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}/>
                <div className="p-2"><p className="text-[11px] text-gray-600 line-clamp-2 leading-snug">{p.name}</p><p className="text-sm font-black text-red-600 mt-0.5">{fmt(p.price)}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>);
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

function MenuPage({onNav,auth,bling,onBling}){
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
  const[cart,setCart]=useState(()=>LS.get("art_cart",[]));
  const[firstBuy,setFirstBuy]=useState(()=>LS.get("art_firstbuy",true));
  const[q,setQ]=useState("");const[activeQ,setActiveQ]=useState("");
  const[nav,setNav]=useState("home");const[showBling,setShowBling]=useState(false);
  const[catFilter,setCatFilter]=useState("Todos");
  const[showAuth,setShowAuth]=useState(false);
  const[favs,setFavs]=useState(()=>LS.get("art_favs",[]));
  const scrollRef=useRef(null);

  const go=id=>{if(id==="login"){setShowAuth(true);return;}setPage(id);if(["home","cart","favorites","menu"].includes(id))setNav(id);scrollRef.current?.scrollTo(0,0);setActiveQ("");};
  const goProduct=p=>{setSel(p);setPage("product");scrollRef.current?.scrollTo(0,0);};
  const addCart=(p,goToCheckout)=>{setCart(c=>{const ex=c.find(i=>i.id===p.id);const next=ex?c.map(i=>i.id===p.id&&i.qty<5?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}];LS.set("art_cart",next);return next;});if(goToCheckout){setPage("cart");setNav("cart");scrollRef.current?.scrollTo(0,0);}};
  const toggleFav=id=>{setFavs(f=>{const next=f.includes(id)?f.filter(i=>i!==id):[...f,id];LS.set("art_favs",next);return next;});};
  const handleNav=id=>{
    if(id==="live"){window.open("https://www.instagram.com/lojasartmoveis","_blank");return;}
    if(id==="cat_box"){setCatFilter("Box e Colchões");go("home");return;}
    if(id==="cat_coz"){setCatFilter("Cozinha");go("home");return;}
    go(id);
  };
  const doSearch=()=>{if(q.trim()){setActiveQ(q.trim());setPage("search");}};
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const showBack=page==="product"||!["home","cart","favorites","menu"].includes(page);
  const cp={favs,onFav:toggleFav};

  const renderPage=()=>{
    if(activeQ&&page==="search")return<SearchPage query={activeQ}products={bling.products}onProduct={goProduct}onCart={addCart}{...cp}/>;
    if(page==="product"&&sel)return<ProductPage product={sel}allProducts={bling.products}onCart={addCart}onProduct={goProduct}firstPurchase={firstBuy}{...cp}/>;
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
    if(page==="menu")return<MenuPage onNav={go}auth={auth}bling={bling}onBling={()=>setShowBling(true)}/>;
    return<HomePage products={bling.products}onProduct={goProduct}onCart={addCart}onNav={handleNav}onNav2={go}initCat={catFilter}onCatUsed={()=>setCatFilter("Todos")}{...cp}/>;
  };

  return(
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Header cartCount={cartCount}onCart={()=>go("cart")}q={q}setQ={setQ}onSearch={doSearch}showBack={showBack}onBack={()=>{setPage("home");setNav("home");setActiveQ("");}}onUser={()=>go(auth.user?"user":"login")}user={auth.user}onHome={()=>{setPage("home");setNav("home");setActiveQ("");}}/>
      <div ref={scrollRef} className="pt-32 pb-20 overflow-y-auto min-h-screen">{renderPage()}</div>
      <BottomNav active={nav}onNav={handleNav}cartCount={cartCount}/>
      {showBling&&<BlingSetup bling={bling}onClose={()=>setShowBling(false)}/>}
      {showAuth&&<AuthModal auth={auth}onClose={()=>setShowAuth(false)}/>}
    </div>
  );
}
