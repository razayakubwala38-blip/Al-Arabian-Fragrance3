
const products = window.PRODUCTS;
const grid = document.getElementById('productGrid');
let cart = JSON.parse(localStorage.getItem('alArabianCart') || '[]');

function money(n){return '₹'+n.toLocaleString('en-IN')}
function render(filter='All'){
  const list = filter==='All' ? products : products.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p=>`
    <article class="product tilt" data-name="${p.name}" data-tilt>
      <div class="product-img"><img src="assets/${p.img}" alt="${p.name}"><span class="tag">${p.tag}</span><button class="quick" onclick="addToCartByName('${p.name.replaceAll("'","\\'")}')">+</button></div>
      <div class="product-info"><small>${p.cat.toUpperCase()} · ${p.size}</small><h3>${p.name}</h3>
      <div class="price"><strong>${money(p.price)}</strong><s>${money(p.mrp)}</s><span>${Math.round((1-p.price/p.mrp)*100)}% OFF</span></div>
      <button class="add" onclick="addToCartByName('${p.name.replaceAll("'","\\'")}')">ADD TO BAG</button></div>
    </article>`).join('');
  bindTilt();
}
function addToCartByName(name){
  const p=products.find(x=>x.name===name); if(!p)return;
  const found=cart.find(x=>x.name===name); if(found) found.qty++; else cart.push({...p,qty:1});
  saveCart(); openCart();
}
function removeItem(name){cart=cart.filter(x=>x.name!==name);saveCart();}
function saveCart(){localStorage.setItem('alArabianCart',JSON.stringify(cart));renderCart();}
function renderCart(){
  document.getElementById('cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById('cartItems');
  if(!cart.length){box.innerHTML='<p style="color:#756962;font-size:13px;padding:25px 0">Your bag is empty. Add a fragrance to begin.</p>';document.getElementById('cartTotal').textContent='₹0';return;}
  box.innerHTML=cart.map(x=>`<div class="cart-item"><img src="assets/${x.img}" alt="${x.name}"><div><h4>${x.name}</h4><small>${x.qty} × ${money(x.price)}</small></div><button onclick="removeItem('${x.name.replaceAll("'","\\'")}')">Remove</button></div>`).join('');
  document.getElementById('cartTotal').textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('show');renderCart();}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('overlay').classList.remove('show');}
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('overlay').onclick=closeCart;
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
document.getElementById('checkoutBtn').onclick=()=>{
  if(!cart.length)return;
  const lines=cart.map(x=>`${x.name} x${x.qty} — ${money(x.price*x.qty)}`).join('%0A');
  const total=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  window.open(`https://wa.me/917041497806?text=Hello%20Al%20Arabian%20Fragrance,%20I%20want%20to%20order:%0A${lines}%0A%0ATotal:%20${total}`,'_blank');
};
document.getElementById('menuBtn').onclick=()=>{const n=document.querySelector('.nav nav');n.style.display=n.style.display==='flex'?'none':'flex';n.style.position='absolute';n.style.top='66px';n.style.left='0';n.style.right='0';n.style.background='#f7f3ec';n.style.padding='20px';n.style.flexDirection='column';n.style.borderBottom='1px solid #ded3c4';};
function bindTilt(){
 document.querySelectorAll('[data-tilt]').forEach(el=>{
   if(el.dataset.tiltBound)return;el.dataset.tiltBound='1';
   el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-2px)`});
   el.addEventListener('pointerleave',()=>el.style.transform='');
 });
}
render();renderCart();
