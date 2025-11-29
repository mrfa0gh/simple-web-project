const initialContacts = [
    { id: '231255', name: 'فارس محمد عبدالسميع', phone: '01011122233', email: 'fares.m@std.edu', job: 'طالب (231255)', isFavorite: true },
    { id: '231543', name: 'محمود اسامه سعد محمد', phone: '01122233344', email: 'mahmoud.o@std.edu', job: 'طالب (231543)', isFavorite: false },
    { id: '222287', name: 'حسن اشرف احمد علي', phone: '01233344455', email: 'hassan.a@std.edu', job: 'طالب (222287)', isFavorite: true },
    { id: '231446', name: 'محمد كرم حمدي عبد المعبود', phone: '01544455566', email: 'mohamed.k@std.edu', job: 'طالب (231446)', isFavorite: false },
    { id: '230573', name: 'احمد محمد فؤاد محمود', phone: '01055566677', email: 'ahmed.m@std.edu', job: 'طالب (230573)', isFavorite: false },
    { id: '001', name: 'الدكتورة مروة عناني', phone: '01001234567', email: 'marwa.e@univ.edu', job: 'مشرف أكاديمي', isFavorite: true },
    { id: '002', name: 'المهندس علي محمد', phone: '01119876543', email: 'ali.m@univ.edu', job: 'مهندس', isFavorite: false },
    { id: '003', name: 'خالد مصطفى السيد', phone: '01227654321', email: 'khaled.m@company.com', job: 'مهندس برمجيات', isFavorite: true },
    { id: '004', name: 'ليلى أحمد حسان', phone: '01556789012', email: 'layla.a@corp.net', job: 'مديرة تسويق', isFavorite: true },
    { id: '005', name: 'يوسف طارق فوزي', phone: '01098765432', email: 'youssef.t@home.com', job: 'مدرس', isFavorite: false },
    { id: '006', name: 'سارة إبراهيم علي', phone: '01155544433', email: 'sara.i@mail.net', job: '', isFavorite: false },
    { id: '007', name: 'عمر جلال محمود', phone: '01288877766', email: 'omar.g@data.org', job: 'محلل بيانات', isFavorite: false },
];


const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email'); 
const jobInput = document.getElementById('job');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('nav a');
const totalCountElement = document.getElementById('total-count');
const favoriteCountElement = document.getElementById('favorite-count');

// عناصر نموذج التعديل المنفصلة
const editForm = document.getElementById('edit-form');
const editNameInput = document.getElementById('edit-name');
const editPhoneInput = document.getElementById('edit-phone');
const editEmailInput = document.getElementById('edit-email'); 
const editJobInput = document.getElementById('edit-job');
const editContactIdInput = document.getElementById('edit-contact-id');


const views = {
    home: document.getElementById('home-view'),
    favorites: document.getElementById('favorites-view'),
    about: document.getElementById('about-view'),
    help: document.getElementById('help-view'), // صفحة جديدة
    'edit-view': document.getElementById('edit-view') // صفحة جديدة
};
const contactListHome = document.getElementById('contact-list-home');
const contactListFavorites = document.getElementById('contact-list-favorites');

let contacts = []; 
let currentView = 'home'; 

function getContacts() {
    const storedContacts = localStorage.getItem('phonebookContacts');
    return storedContacts ? JSON.parse(storedContacts) : initialContacts;
}

function saveContacts() {
    localStorage.setItem('phonebookContacts', JSON.stringify(contacts));
    updateCounters(); 
}

function updateCounters() {
    const total = contacts.length;
    const favorites = contacts.filter(c => c.isFavorite).length;
    
    totalCountElement.textContent = total;
    favoriteCountElement.textContent = favorites;
}

function showView(viewName) {
    currentView = viewName;
    
    Object.keys(views).forEach(key => {
        views[key].classList.add('hidden');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
        document.querySelector(`nav a[data-view="${viewName}"]`).classList.add('active');
    }

    if (viewName === 'home' || viewName === 'favorites') {
        const searchTerm = (viewName === 'home' && searchInput) ? searchInput.value : '';
        renderContacts(searchTerm);
    }
}

function renderContacts(searchTerm = '') {
    const isFavoritesView = currentView === 'favorites';
    
    let displayContacts = isFavoritesView ? contacts.filter(c => c.isFavorite) : contacts;

    if (searchTerm && currentView === 'home') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        displayContacts = displayContacts.filter(contact => 
            contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            contact.phone.includes(lowerCaseSearchTerm) ||
            (contact.job && contact.job.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (contact.email && contact.email.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }
    
    const sortedContacts = [...displayContacts].sort((a, b) => b.isFavorite - a.isFavorite);

    contactListHome.innerHTML = ''; 
    contactListFavorites.innerHTML = '';
    const targetList = isFavoritesView ? contactListFavorites : contactListHome;
    
    if (sortedContacts.length === 0) {
         targetList.innerHTML = `<li style="justify-content: center; background: #fff; color: #6c757d;">
             ${(currentView === 'home' && searchTerm) ? 'لا توجد نتائج مطابقة للبحث.' : (isFavoritesView ? 'لا توجد جهات اتصال مفضلة حالياً.' : 'لا توجد جهات اتصال حالياً.')}
         </li>`;
         return;
    }

    sortedContacts.forEach(contact => {
        const listItem = document.createElement('li');
        listItem.dataset.id = contact.id;
        
        if (contact.isFavorite) {
            listItem.classList.add('favorite');
        }

        const editButton = (isFavoritesView) ? '' : `<button class="edit-btn" data-action="edit">تعديل</button>`;

        const jobDisplay = contact.job ? `<span style="color: #6c757d; font-size: 0.9em;">(${contact.job})</span>` : '';
        const emailDisplay = contact.email ? `<span style="color: #007bff; font-size: 0.9em; direction: ltr; margin-left: 15px;">📧 ${contact.email}</span>` : '';

        listItem.innerHTML = `
            <div class="contact-info">
                <strong>${contact.name} ${jobDisplay}</strong> 
                <div style="display: flex; align-items: center; gap: 5px; font-size: 0.95em;">
                    📞 ${contact.phone}
                    ${emailDisplay}
                </div>
            </div>
            <div class="contact-actions">
                <button class="favorite-btn ${contact.isFavorite ? 'is-favorite' : ''}" 
                        data-action="toggle-favorite">
                    ${contact.isFavorite ? '⭐️' : 'إضافة مفضلة'}
                </button>
                ${editButton}
                <button class="delete-btn" data-action="delete" data-view-type="${currentView}">حذف</button>
            </div>
        `;
        
        targetList.appendChild(listItem.cloneNode(true));
    });
}

// ---------------------------------------------
// 1. الإضافة (نموذج صفحة Home)
// ---------------------------------------------
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim(); 
    const job = jobInput.value.trim(); 
    
    if (!name || !phone) {
        alert("يرجى إدخال الاسم ورقم الهاتف.");
        return;
    }

    const newContact = {
        id: Date.now().toString(), 
        name: name,
        phone: phone,
        email: email, 
        job: job, 
        isFavorite: false
    };
    contacts.push(newContact); 
    alert('✅ تم إضافة جهة الاتصال بنجاح!'); 

    saveContacts(); 
    renderContacts(); 
    form.reset(); 
});


// ---------------------------------------------
// 2. التعديل (نموذج صفحة Edit المنفصلة)
// ---------------------------------------------
editForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const name = editNameInput.value.trim();
    const phone = editPhoneInput.value.trim();
    const email = editEmailInput.value.trim(); 
    const job = editJobInput.value.trim(); 
    const id = editContactIdInput.value;

    if (!name || !phone || !id) {
        alert("خطأ: يرجى التأكد من ملء جميع الحقول واختيار جهة اتصال.");
        return;
    }

    const contactIndex = contacts.findIndex(c => c.id.toString() === id);
    if (contactIndex > -1) {
        contacts[contactIndex].name = name;
        contacts[contactIndex].phone = phone;
        contacts[contactIndex].email = email; 
        contacts[contactIndex].job = job; 
    }
    
    saveContacts(); 
    alert('✅ تم حفظ التعديلات بنجاح!'); 
    editForm.reset();
    showView('home'); // العودة للقائمة الرئيسية بعد الحفظ
});


// ---------------------------------------------
// 3. الحذف والمفضلة والتعديل (Delegation)
// ---------------------------------------------
document.addEventListener('click', function(e) {
    const action = e.target.dataset.action;
    const listItem = e.target.closest('.contact-list li'); 
    
    if (!action || !listItem) return;

    const contactId = listItem.dataset.id; 

    if (action === 'delete') {
        const viewType = e.target.dataset.viewType;

        if (viewType === 'favorites') {
            if (!confirm('هل أنت متأكد من إزالة هذه الجهة من المفضلة؟ (سوف تبقى في القائمة الرئيسية)')) return;
            const contactIndex = contacts.findIndex(c => c.id === contactId);
            if (contactIndex > -1) {
                contacts[contactIndex].isFavorite = false;
                alert('✅ تم إزالة الجهة من المفضلة بنجاح.');
            }
        } else {
            if (!confirm('هل أنت متأكد من حذف هذه الجهة نهائياً؟')) return;
            contacts = contacts.filter(contact => contact.id !== contactId); 
            alert('✅ تم حذف الجهة نهائياً بنجاح.');
        }

        saveContacts();
        renderContacts();
    } 
    
    else if (action === 'edit') {
        if (currentView !== 'home') return;
        
        const contactToEdit = contacts.find(contact => contact.id === contactId);
        if (contactToEdit) {
            // نقل البيانات إلى نموذج التعديل المنفصل
            editNameInput.value = contactToEdit.name;
            editPhoneInput.value = contactToEdit.phone;
            editEmailInput.value = contactToEdit.email || ''; 
            editJobInput.value = contactToEdit.job || '';
            editContactIdInput.value = contactToEdit.id;
            
            showView('edit-view'); // الانتقال إلى صفحة التعديل
        }
    } 
    
    else if (action === 'toggle-favorite') {
        const contactIndex = contacts.findIndex(contact => contact.id === contactId);
        if (contactIndex > -1) {
            contacts[contactIndex].isFavorite = !contacts[contactIndex].isFavorite;
            saveContacts();
            renderContacts(); 
        }
    }
});

// --- التنقل بين الصفحات ---
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const viewName = this.dataset.view;
        if(searchInput) searchInput.value = '';
        showView(viewName);
    });
});

// --- وظيفة البحث ---
if (searchInput) {
    searchInput.addEventListener('input', function() {
        renderContacts(this.value);
    });
}

// --- تهيئة التطبيق ---
function init() {
    contacts = getContacts(); 
    updateCounters(); 
    showView('home'); 
}

init();