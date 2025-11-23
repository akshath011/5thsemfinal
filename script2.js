// Menu data (12 items)
const menuData = [
  {id:1,name:'Margherita Pizza',desc:'Classic cheese & basil',price:299,tag:'pizza',img:'http://127.0.0.1:5501/magpizza.jpeg'},
  {id:2,name:'Pepperoni Pizza',desc:'Pepperoni & mozzarella',price:399,tag:'pizza',img:'https://th.bing.com/th/id/OSK.1e5a9f78f2c2df2dcfc45b81a3b077fd?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:3,name:'Veg Burger',desc:'Patty, lettuce, tomato',price:199,tag:'burgers',img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=60'},
  {id:4,name:'Chicken Burger',desc:'Crispy chicken & sauce',price:249,tag:'burgers',img:'https://th.bing.com/th/id/OSK.581d09f1d1d576171a3a1099b007151c?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:5,name:'Penne Arrabiata',desc:'Tomato-chili penne',price:279,tag:'pasta',img:'https://th.bing.com/th/id/OSK.00e55236f68107e6af3ddece6ff5d77c?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:6,name:'Chicken Alfredo',desc:'Creamy fettuccine',price:359,tag:'pasta',img:'https://th.bing.com/th/id/OSK.e702c6b88e75052276210d5c99f9a571?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:7,name:'Chicken Roll',desc:'Spiced chicken wrap',price:159,tag:'rolls',img:'https://tse1.mm.bing.net/th/id/OIP.XY_SCHHM_hMEjw0es2DxgwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3'},
  {id:8,name:'Veg Roll',desc:'Mixed veg roll',price:129,tag:'rolls',img:'https://th.bing.com/th/id/OSK.b5d2294d4a7c6499dfc907f843191fb1?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:9,name:'French Fries',desc:'Crispy golden fries',price:99,tag:'fries',img:'https://th.bing.com/th/id/OSK.afff199b2aac532bc335a3d3e41c1e09?w=200&h=126&c=7&rs=1&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1'},
  {id:10,name:'Cheese Fries',desc:'Loaded with cheese',price:149,tag:'fries',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=60'},
  {id:11,name:'Chicken Pasta Salad',desc:'Light & tangy',price:199,tag:'pasta',img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=60'},
  {id:12,name:'Club Sandwich',desc:'Triple layered classic',price:219,tag:'burgers',img:'https://www.bing.com/th/id/OSK.016d644cd34b8a3d9983bf447ce51067?w=244&h=172&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=16.1&rm=2'}
];

// cart saved in localStorage
let cart = JSON.parse(localStorage.getItem('demo_cart')||'{}');
let activeOrder = JSON.parse(localStorage.getItem('demo_active_order')||'null');

// DOM refs
const menuGrid = document.getElementById('menuGrid');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderStatusMini = document.getElementById('orderStatusMini');
const statusTiny = document.getElementById('statusTiny');

// Render menu
function renderMenu(items){
  menuGrid.innerHTML='';
  items.forEach(p=>{
    const card = document.createElement('div'); 
    card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="info">
        <h4 class="title">${p.name}</h4>
        <div class="desc">${p.desc}</div>
        <div class="price">₹${p.price}</div>
      </div>
      <div class="actions">
        <div class="qty" data-id="${p.id}">
          <button class="dec">−</button>
          <span class="num">${cart[p.id]||0}</span>
          <button class="inc">+</button>
        </div>
        <button class="add">Add</button>
      </div>
    `;
    menuGrid.appendChild(card);

    const inc = card.querySelector('.inc');
    const dec = card.querySelector('.dec');
    const num = card.querySelector('.num');
    const addBtn = card.querySelector('.add');

    inc.addEventListener('click',()=>{ num.textContent=updateQty(p.id,(cart[p.id]||0)+1); });
    dec.addEventListener('click',()=>{ num.textContent=updateQty(p.id,Math.max(0,(cart[p.id]||0)-1)); });
    addBtn.addEventListener('click',()=>{ updateQty(p.id,(cart[p.id]||0)+1); toast(`${p.name} added`); });
  });
}

// update quantity
function updateQty(id,qty){
  id = String(id);
  if(qty<=0){ delete cart[id]; }
  else cart[id]=qty;

  localStorage.setItem('demo_cart',JSON.stringify(cart));
  renderCart();

  // Update menu counters
  document.querySelectorAll('.qty').forEach(el=>{
    if(el.dataset.id===id) el.querySelector('.num').textContent = cart[id] || 0;
  });

  return cart[id] || 0;
}

// render cart
function renderCart(){
  const keys = Object.keys(cart);
  if(keys.length===0){
    cartList.innerHTML='<div class="empty">Cart is empty. Add items to get started.</div>';
    checkoutBtn.disabled=true;
    cartBadge.style.display='none';
    cartBadge.textContent='+0';
    cartTotal.textContent='₹0';
    return;
  }

  cartList.innerHTML=''; 
  let total=0;

  keys.forEach(k=>{
    const p = menuData.find(x=>x.id==k);
    const row = document.createElement('div'); 
    row.className='cart-row';
    row.innerHTML = `
      <img class="mini" src="${p.img}" alt="${p.name}">
      <div style="flex:1">
        <div style="font-weight:700">${p.name}</div>
        <div style="font-size:13px;color:#666">₹${p.price} x ${cart[k]}</div>
      </div>
      <div class="qty" style="border:0">
        <button class="dec">−</button>
        <span class="num">${cart[k]}</span>
        <button class="inc">+</button>
      </div>
      <div style="width:56px;text-align:right;font-weight:700">₹${p.price*cart[k]}</div>
    `;
    cartList.appendChild(row);
    total += p.price * cart[k];

    row.querySelector('.inc').addEventListener('click',()=>{ updateQty(k,cart[k]+1); });
    row.querySelector('.dec').addEventListener('click',()=>{ updateQty(k,Math.max(0,cart[k]-1)); });
  });

  cartTotal.textContent = '₹'+total;
  checkoutBtn.disabled=false;

  // badge
  const count = keys.reduce((s,k)=>s+cart[k],0);
  cartBadge.style.display='block'; 
  cartBadge.textContent='+'+count;
}

// category filter
function filter(tag){
  if(tag==='all') renderMenu(menuData);
  else renderMenu(menuData.filter(m=>m.tag===tag));
}

// toast notification
function toast(msg){
  const t = document.createElement('div'); 
  t.textContent=msg;
  t.style.position='fixed';
  t.style.right='18px';
  t.style.bottom='18px';
  t.style.background='#111';
  t.style.color='#fff';
  t.style.padding='8px 12px';
  t.style.borderRadius='8px';
  t.style.zIndex=9999;
  t.style.opacity=0;
  t.style.transition='opacity .18s';
  document.body.appendChild(t);

  requestAnimationFrame(()=>t.style.opacity=1);
  setTimeout(()=>{
    t.style.opacity=0; 
    setTimeout(()=>t.remove(),250);
  },1200);
}

// checkout → start order simulation
function checkout(){
  const orderItems = Object.keys(cart).map(k=>({id:k,qty:cart[k]}));
  if(orderItems.length===0) return;

  const order = { 
    id:'ORD'+Date.now(), 
    items:orderItems, 
    total:cartTotal.textContent, 
    stage:0, 
    created: new Date().toISOString() 
  };

  localStorage.setItem('demo_active_order', JSON.stringify(order));
  activeOrder = order;

  cart = {}; 
  localStorage.setItem('demo_cart',JSON.stringify(cart));
  renderCart();
  renderMenu(menuData);

  startOrderSimulation();
  toast('Order placed — ' + order.id);
}

let orderTimer = null;
function startOrderSimulation(){
  if(!activeOrder) return;

  updateOrderUI();

  let tick = 0;

  if(orderTimer) clearInterval(orderTimer);
  orderTimer = setInterval(()=>{
    tick++;
    activeOrder.stage = Math.min(3,tick);
    localStorage.setItem('demo_active_order', JSON.stringify(activeOrder));
    updateOrderUI();

    if(activeOrder.stage>=3){
      clearInterval(orderTimer);
      orderTimer=null;
    }
  },4000);
}

function updateOrderUI(){
  if(!activeOrder){
    ['s1','s2','s3','s4'].forEach(id=>{
      document.getElementById(id).classList.remove('active');
    });
    statusTiny.textContent='No active order';
    orderStatusMini.textContent='No active order';
    document.getElementById('orderIdText').textContent='—';
    return;
  }

  document.getElementById('s1').classList.toggle('active', activeOrder.stage>=0);
  document.getElementById('s2').classList.toggle('active', activeOrder.stage>=1);
  document.getElementById('s3').classList.toggle('active', activeOrder.stage>=2);
  document.getElementById('s4').classList.toggle('active', activeOrder.stage>=3);

  const labels = ['Received','Preparing','Out for delivery','Delivered'];
  
  statusTiny.textContent = labels[activeOrder.stage];
  orderStatusMini.textContent = `Order ${activeOrder.id.slice(-5)} · ${labels[activeOrder.stage]}`;

  document.getElementById('orderIdText').textContent = 
    `Order: ${activeOrder.id} • Placed: ${new Date(activeOrder.created).toLocaleString()}`;

  if(activeOrder.stage>=3){
    orderStatusMini.textContent += ' ✅';
    statusTiny.textContent += ' ✅';
    localStorage.removeItem('demo_active_order');
    activeOrder=null;
  }
}

// init
renderMenu(menuData);
renderCart();

// restore active order
activeOrder = JSON.parse(localStorage.getItem('demo_active_order')||'null');
if(activeOrder){ startOrderSimulation(); }

// scroll to cart
document.getElementById('cartBtn').addEventListener('click',()=>{
  document.getElementById('cartPanel').scrollIntoView({behavior:'smooth',block:'center'});
});

// search
document.getElementById('searchInput').addEventListener('input',(e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) return renderMenu(menuData);

  renderMenu(menuData.filter(m=> 
    m.name.toLowerCase().includes(q) ||
    m.desc.toLowerCase().includes(q) ||
    m.tag.toLowerCase().includes(q)
  ));
});
