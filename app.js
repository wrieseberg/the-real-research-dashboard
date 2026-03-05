// State
let categories = JSON.parse(localStorage.getItem('dashboard_categories')) || [
    { id: '1', name: 'Work', links: [] },
    { id: '2', name: 'Design Ideas', links: [] }
];

// Elements
const container = document.getElementById('categories-container');
const categoryModal = document.getElementById('category-modal');
const linkModal = document.getElementById('link-modal');

// Functions
function save() {
    localStorage.setItem('dashboard_categories', JSON.stringify(categories));
    render();
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function render() {
    container.innerHTML = '';

    categories.forEach(cat => {
        const catEl = document.createElement('div');
        catEl.className = 'category-card';

        let linksHTML = cat.links.map(link => `
            <div class="link-item">
                <a href="${link.url}" target="_blank" class="link-content">${link.title}</a>
                <div class="link-actions">
                    <button class="icon-btn" onclick="editLink('${cat.id}', '${link.id}')">✎</button>
                    <button class="icon-btn danger" onclick="deleteLink('${cat.id}', '${link.id}')">×</button>
                </div>
            </div>
        `).join('');

        catEl.innerHTML = `
            <div class="category-header">
                <div class="category-title">${cat.name}</div>
                <div class="category-actions">
                    <button class="icon-btn" onclick="editCategory('${cat.id}')">✎</button>
                    <button class="icon-btn danger" onclick="deleteCategory('${cat.id}')">×</button>
                </div>
            </div>
            <div class="links-list">
                ${linksHTML}
            </div>
            <button class="add-link-btn" onclick="openLinkModal('${cat.id}')">+ Add Link</button>
        `;

        container.appendChild(catEl);
    });
}

// Category Management
document.getElementById('add-category-btn').addEventListener('click', () => {
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-modal-title').textContent = 'Add Category';
    categoryModal.classList.remove('hidden');
});

document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;

    if (id) {
        const cat = categories.find(c => c.id === id);
        if (cat) cat.name = name;
    } else {
        categories.push({ id: generateId(), name, links: [] });
    }

    categoryModal.classList.add('hidden');
    save();
});

window.editCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-name').value = cat.name;
    document.getElementById('category-modal-title').textContent = 'Edit Category';
    categoryModal.classList.remove('hidden');
};

window.deleteCategory = (id) => {
    if (confirm('Are you sure you want to delete this category and all its links?')) {
        categories = categories.filter(c => c.id !== id);
        save();
    }
};

// Link Management
window.openLinkModal = (categoryId) => {
    document.getElementById('link-form').reset();
    document.getElementById('link-category-id').value = categoryId;
    document.getElementById('link-id').value = '';
    document.getElementById('link-modal-title').textContent = 'Add Link';
    linkModal.classList.remove('hidden');
};

document.getElementById('link-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryId = document.getElementById('link-category-id').value;
    const linkId = document.getElementById('link-id').value;
    const title = document.getElementById('link-title').value;
    let url = document.getElementById('link-url').value;

    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;

    if (linkId) {
        const link = cat.links.find(l => l.id === linkId);
        if (link) {
            link.title = title;
            link.url = url;
        }
    } else {
        cat.links.push({ id: generateId(), title, url });
    }

    linkModal.classList.add('hidden');
    save();
});

window.editLink = (categoryId, linkId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    const link = cat.links.find(l => l.id === linkId);
    if (!link) return;

    document.getElementById('link-category-id').value = categoryId;
    document.getElementById('link-id').value = link.id;
    document.getElementById('link-title').value = link.title;
    document.getElementById('link-url').value = link.url;
    document.getElementById('link-modal-title').textContent = 'Edit Link';
    linkModal.classList.remove('hidden');
};

window.deleteLink = (categoryId, linkId) => {
    if (confirm('Delete this link?')) {
        const cat = categories.find(c => c.id === categoryId);
        if (cat) {
            cat.links = cat.links.filter(l => l.id !== linkId);
            save();
        }
    }
};

// Close Modals
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        categoryModal.classList.add('hidden');
        linkModal.classList.add('hidden');
    });
});

// Initial Render
render();
