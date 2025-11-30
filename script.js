const initialContacts=[
  {id:'231255',name:'فارس محمد عبدالسميع',phone:'01099212254',email:'contact@mrfa0gh.run.place',job:'طالب',isFavorite:true},
  {id:'231543',name:'محمود اسامه سعد محمد',phone:'01122233344',email:'mahmoud.o@std.edu',job:'طالب',isFavorite:true},
  {id:'222287',name:'حسن اشرف احمد علي',phone:'01233344455',email:'hassan.a@std.edu',job:'طالب',isFavorite:true},
  {id:'231446',name:'محمد كرم حمدي عبد المعبود',phone:'01544455566',email:'mohamed.k@std.edu',job:'طالب',isFavorite:true},
  {id:'230573',name:'احمد محمد فؤاد محمود',phone:'01055566677',email:'ahmed.m@std.edu',job:'طالب',isFavorite:true},
  {id:'001',name:'الدكتورة مروة عناني',phone:'01001234567',email:'marwa.e@univ.edu',job:'مشرف',isFavorite:false},
  {id:'002',name:'المعيد  علي محمد',phone:'01119876543',email:'ali.m@univ.edu',job:'مشرف',isFavorite:false}
];

const $=id=>document.getElementById(id);
const form=$('contact-form'), editForm=$('edit-form'), search=$('search-input');
const navLinks=document.querySelectorAll('nav a');
const views={home:$('home-view'),favorites:$('favorites-view'),edit:$('edit-view'),about:$('about-view'),help:$('help-view')};
const listHome=$('contact-list-home'), listFav=$('contact-list-favorites');

let contacts=[], currentView='home';

function getContacts(){return JSON.parse(localStorage.getItem('phonebookContacts')||JSON.stringify(initialContacts))}
function saveContacts(){
  localStorage.setItem('phonebookContacts',JSON.stringify(contacts));
  $('total-count').textContent=contacts.length;
  $('favorite-count').textContent=contacts.filter(c=>c.isFavorite).length;
}

function showView(v){
  currentView=v;
  Object.values(views).forEach(el=>el.classList.add('hidden'));
  navLinks.forEach(l=>l.classList.remove('active'));
  views[v].classList.remove('hidden');
  document.querySelector(`nav a[data-view="${v}"]`).classList.add('active');
  renderContacts(currentView==='home'?search.value:'');
}

function renderContacts(term=''){
  const isFav=currentView==='favorites', target=isFav?listFav:listHome;
  let arr=isFav?contacts.filter(c=>c.isFavorite):contacts;
  if(term) arr=arr.filter(c=>Object.values(c).some(v=>v.toString().toLowerCase().includes(term.toLowerCase())));
  target.innerHTML=arr.length?arr.map(c=>`<li data-id="${c.id}" class="${c.isFavorite?'favorite':''}">
    <div><strong>${c.name}</strong> ${c.job?`(${c.job})`:''} 📞 ${c.phone} ${c.email?`📧 ${c.email}`:''}</div>
    <div>
      <button class="favorite-btn" data-action="toggle-favorite">${c.isFavorite?'⭐️':'إضافة مفضلة'}</button>
      ${!isFav?'<button class="edit-btn" data-action="edit">تعديل</button>':''}
      <button class="delete-btn" data-action="delete" data-view-type="${currentView}">حذف</button>
    </div>
  </li>`).join(''):`<li style="text-align:center;color:#666">${isFav?'لا توجد مفضلة':'لا توجد جهات'}</li>`;
}

// إضافة جهة
form.addEventListener('submit',e=>{
  e.preventDefault();
  const {name,phone,email,job}=form.elements;
  if(!name.value||!phone.value)return alert('ادخل الاسم والهاتف');
  contacts.push({id:Date.now().toString(),name:name.value.trim(),phone:phone.value.trim(),email:email.value.trim(),job:job.value.trim(),isFavorite:false});
  saveContacts(); renderContacts(); form.reset();
});

// تعديل جهة
editForm.addEventListener('submit',e=>{
  e.preventDefault();
  const { 'edit-contact-id':id, 'edit-name':name, 'edit-phone':phone, 'edit-email':email, 'edit-job':job }=editForm.elements;
  const c=contacts.find(c=>c.id===id.value);
  if(c) c.name=name.value.trim(), c.phone=phone.value.trim(), c.email=email.value.trim(), c.job=job.value.trim();
  saveContacts(); editForm.reset(); showView('home');
});

// أزرار تعديل، حذف، مفضلة
document.addEventListener('click',e=>{
  const action=e.target.dataset.action, li=e.target.closest('li'); if(!action||!li)return;
  const id=li.dataset.id, idx=contacts.findIndex(c=>c.id===id);
  if(action==='delete') currentView==='favorites'?contacts[idx].isFavorite=false:contacts.splice(idx,1);
  else if(action==='edit'){const c=contacts[idx]; editForm.elements['edit-name'].value=c.name; editForm.elements['edit-phone'].value=c.phone; editForm.elements['edit-email'].value=c.email||''; editForm.elements['edit-job'].value=c.job||''; editForm.elements['edit-contact-id'].value=c.id; showView('edit');}
  else if(action==='toggle-favorite') contacts[idx].isFavorite=!contacts[idx].isFavorite;
  saveContacts(); renderContacts();
});

// التنقل والبحث
navLinks.forEach(l=>l.addEventListener('click',e=>{e.preventDefault(); search.value=''; showView(e.target.dataset.view)}));
search.addEventListener('input',()=>renderContacts(search.value));

// تهيئة
function init(){contacts=getContacts();saveContacts();showView('home');}
init();