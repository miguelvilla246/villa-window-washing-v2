const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('.mobile-menu');
if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'×':'☰';});}
