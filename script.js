const initialContacts = [
    // 5 طلاب المشروع (المفضلة)
    { id: '231255', name: 'فارس محمد عبدالسميع', phone: '01011122233', email: 'fares.m@std.edu', job: 'طالب (231255)', isFavorite: true }, 
    { id: '231543', name: 'محمود اسامه سعد محمد', phone: '01122233344', email: 'mahmoud.o@std.edu', job: 'طالب (231543)', isFavorite: true }, 
    { id: '222287', name: 'حسن اشرف احمد علي', phone: '01233344455', email: 'hassan.a@std.edu', job: 'طالب (222287)', isFavorite: true }, 
    { id: '231446', name: 'محمد كرم حمدي عبد المعبود', phone: '01544455566', email: 'mohamed.k@std.edu', job: 'طالب (231446)', isFavorite: true }, 
    { id: '230573', name: 'احمد محمد فؤاد محمود', phone: '01055566677', email: 'ahmed.m@std.edu', job: 'طالب (230573)', isFavorite: true }, 
    // 7 جهات اتصال أخرى (ليست مفضلة)
    { id: '001', name: 'الدكتورة مروة عناني', phone: '01001234567', email: 'marwa.e@univ.edu', job: 'مشرف أكاديمي', isFavorite: false }, 
    { id: '002', name: 'المهندس علي محمد', phone: '01119876543', email: 'ali.m@univ.edu', job: 'مهندس', isFavorite: false }, 
    { id: '003', name: 'خالد مصطفى السيد', phone: '01227654321', email: 'khaled.m@company.com', job: 'مهندس برمجيات', isFavorite: false }, 
    { id: '004', name: 'ليلى أحمد حسان', phone: '01556789012', email: 'layla.a@corp.net', job: 'مديرة تسويق', isFavorite: false }, 
    { id: '005', name: 'يوسف طارق فوزي', phone: '01098765432', email: 'youssef.t@home.com', job: 'مدرس', isFavorite: false }, 
    { id: '006', name: 'سارة إبراهيم علي', phone: '01155544433', email: 'sara.i@mail.net', job: '', isFavorite: false }, 
    { id: '007', name: 'عمر جلال محمود', phone: '01288877766', email: 'omar.g@data.org', job: 'محلل بيانات', isFavorite: false },
];

// ------------------------------------------------
// تعريف العناصر (بأبسط شكل)
// ------------------------------------------------
const $ = id => document.getElementById(id); // دالة مساعدة لتقليل كتابة document.getElementById
const form = $('contact-form');
const editForm = $('edit-form');
const searchInput = $('search-input');
const navLinks = document.querySelectorAll('nav a');
const views = {
    home: $('home-view'), favorites: $('favorites-view'), about: $('about-view'), 
    help: $('help-view'), 'edit-view': $('edit-view')
};
const listHome = $('contact-list-home');
const listFav = $('contact-list-favorites');

let contacts = []; 
let currentView = 'home'; 

// ------------------------------------------------
// وظائف تخزين وبيانات مبسطة
// ------------------------------------------------
function getContacts() {
    const stored = localStorage.getItem('phonebookContacts');
    return stored ? JSON.parse(stored) : initialContacts;
}

function saveContacts() {
    localStorage.setItem('phonebookContacts', JSON.stringify(contacts));
    $('total-count').textContent = contacts.length;
    $('favorite-count').textContent = contacts.filter(c => c.isFavorite).length;
}

function showView(viewName) {
    currentView = viewName;
    
    Object.keys(views).forEach(key => views[key].classList.add('hidden'));
    navLinks.forEach(link => link.classList.remove('active'));

    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
        document.querySelector(`nav a[data-view="${viewName}"]`).classList.add('active');
    }

    if (viewName === 'home' || viewName === 'favorites') {
        renderContacts(viewName === 'home' ? searchInput.value : '');
    }
}

// ------------------------------------------------
// دالة عرض جهات الاتصال (مبسطة)
// ------------------------------------------------
function renderContacts(searchTerm = '') {
    const isFavoritesView = currentView === 'favorites';
    const targetList = isFavoritesView ? listFav : listHome;
    let displayContacts = isFavoritesView ? contacts.filter(c => c.isFavorite) : contacts;

    if (searchTerm && currentView === 'home') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        displayContacts = displayContacts.filter(contact => 
            Object.values(contact).some(val => 
                (typeof val === 'string' && val.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (typeof val === 'boolean' && val.toString().includes(lowerCaseSearchTerm))
            )
        );
    }
    
    const sortedContacts = [...displayContacts].sort((a, b) => b.isFavorite - a.isFavorite);
    targetList.innerHTML = ''; 

    if (sortedContacts.length === 0) {
         targetList.innerHTML = `<li style="justify-content: center; background: #fff; color: #6c757d;">
             ${(currentView === 'home' && searchTerm) ? 'لا توجد نتائج مطابقة للبحث.' : (isFavoritesView ? 'لا توجد جهات اتصال مفضلة حالياً.' : 'لا توجد جهات اتصال حالياً.')}
         </li>`;
         return;
    }

    sortedContacts.forEach(contact => {
        const li = document.createElement('li');
        li.dataset.id = contact.id;
        if (contact.isFavorite) li.classList.add('favorite');

        const jobDisplay = contact.job ? `<span style="color: #6c757d; font-size: 0.9em;">(${contact.job})</span>` : '';
        const emailDisplay = contact.email ? `<span style="color: #007bff; font-size: 0.9em; direction: ltr; margin-left: 15px;">📧 ${contact.email}</span>` : '';
        const editBtnHtml = isFavoritesView ? '' : `<button class="edit-btn" data-action="edit">تعديل</button>`;

        li.innerHTML = `
            <div class="contact-info">
                <strong>${contact.name} ${jobDisplay}</strong> 
                <div style="display: flex; align-items: center; gap: 5px; font-size: 0.95em;">
                    📞 ${contact.phone} ${emailDisplay}
                </div>
            </div>
            <div class="contact-actions">
                <button class="favorite-btn ${contact.isFavorite ? 'is-favorite' : ''}" data-action="toggle-favorite">
                    ${contact.isFavorite ? '⭐️' : 'إضافة مفضلة'}
                </button>
                ${editBtnHtml}
                <button class="delete-btn" data-action="delete" data-view-type="${currentView}">حذف</button>
            </div>
        `;
        targetList.appendChild(li);
    });
}

// ------------------------------------------------
// معالجة النماذج والأحداث (مبسطة)
// ------------------------------------------------
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    const { name, phone, email, job } = form.elements;

    if (!name.value || !phone.value) return alert("يرجى إدخال الاسم ورقم الهاتف.");

    contacts.push({
        id: Date.now().toString(), 
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(), 
        job: job.value.trim(), 
        isFavorite: false
    }); 
    alert('✅ تم إضافة جهة الاتصال بنجاح!'); 
    saveContacts(); 
    renderContacts(); 
    form.reset(); 
});

editForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    const { 'edit-name': name, 'edit-phone': phone, 'edit-email': email, 'edit-job': job, 'edit-contact-id': id } = editForm.elements;

    if (!name.value || !phone.value || !id.value) return alert("خطأ: يرجى التأكد من اختيار جهة اتصال.");

    const contactIndex = contacts.findIndex(c => c.id.toString() === id.value);
    if (contactIndex > -1) {
        contacts[contactIndex].name = name.value.trim();
        contacts[contactIndex].phone = phone.value.trim();
        contacts[contactIndex].email = email.value.trim(); 
        contacts[contactIndex].job = job.value.trim(); 
    }
    
    saveContacts(); 
    alert('✅ تم حفظ التعديلات بنجاح!'); 
    editForm.reset();
    showView('home');
});

// --- معالجة الضغط على الأزرار (حذف، تعديل، مفضلة) ---
document.addEventListener('click', function(e) {
    const { action, viewType } = e.target.dataset;
    const listItem = e.target.closest('.contact-list li'); 
    
    if (!action || !listItem) return;

    const contactId = listItem.dataset.id; 
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1 && action !== 'edit') return; // لضمان وجود الجهة عند الحذف/المفضلة

    if (action === 'delete') {
        if (viewType === 'favorites') {
            if (!confirm('هل أنت متأكد من إزالة هذه الجهة من المفضلة؟')) return;
            contacts[contactIndex].isFavorite = false;
            alert('✅ تم إزالة الجهة من المفضلة بنجاح.');
        } else {
            if (!confirm('هل أنت متأكد من حذف هذه الجهة نهائياً؟')) return;
            contacts = contacts.filter(contact => contact.id !== contactId); 
            alert('✅ تم حذف الجهة نهائياً بنجاح.');
        }
    } else if (action === 'edit') {
        if (currentView !== 'home') return;
        const contactToEdit = contacts[contactIndex];
        
        editForm.elements['edit-name'].value = contactToEdit.name;
        editForm.elements['edit-phone'].value = contactToEdit.phone;
        editForm.elements['edit-email'].value = contactToEdit.email || ''; 
        editForm.elements['edit-job'].value = contactToEdit.job || '';
        editForm.elements['edit-contact-id'].value = contactToEdit.id;
        
        showView('edit-view');
        return; 
    } else if (action === 'toggle-favorite') {
        contacts[contactIndex].isFavorite = !contacts[contactIndex].isFavorite;
    }
    
    saveContacts();
    renderContacts();
});

// --- التنقل والبحث ---
navLinks.forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    if(searchInput) searchInput.value = '';
    showView(e.target.dataset.view);
}));

if (searchInput) {
    searchInput.addEventListener('input', () => renderContacts(searchInput.value));
}

// --- التهيئة ---
function init() {
    contacts = getContacts(); 
    saveContacts(); // تحديث العدادات عند التحميل
    showView('home'); 
}

init();