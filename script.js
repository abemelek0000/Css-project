
const books = [
    {
        title: "Atmosphere",
        author: "Taylor Jenkins Reid",
        price: 900,
        description: "A captivating novel about fame, fortune, and the price of success.",
        category: "romance",
        image: "image/Atmosphere.jpg"
    },
    {
        title: "Poems & Prayers",
        author: "Matthew McConaughey",
        price: 1000,
        description: "A collection of inspirational poems and prayers.",
        category: "biography",
        image: "image/poems&prayers.jpg"
    },
    {
        title: "The Intruder",
        author: "Freida Mcfadden",
        price: 600,
        description: "A thrilling mystery novel full of suspense.",
        category: "science-fiction",
        image: "image/The Intruder.jpg"
    },
    {
        title: "The Bewitching",
        author: "Silvia Moreno-Garcia",
        price: 700,
        description: "A magical tale of love and witchcraft.",
        category: "romance",
        image: "image/The Bewitching.jpg"
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        price: 800,
        description: "An easy & proven way to build good habits & break bad ones.",
        category: "self-help",
        image: "image/Atomic-Habits-An.jpg"
    },
    {
        title: "12 Rules for Life",
        author: "Jordan Peterson",
        price: 850,
        description: "An antidote to chaos in life.",
        category: "self-help",
        image: "image/12 rules for life.jpg"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const orderNowBtn = document.getElementById('orderNowBtn');
const getBookButtons = document.querySelectorAll('.get-book');
const categoryButtons = document.querySelectorAll('.category-title');
const bookModal = document.getElementById('bookModal');
const modalBookImage = document.getElementById('modalBookImage');
const modalBookTitle = document.getElementById('modalBookTitle');
const modalBookAuthor = document.getElementById('modalBookAuthor');
const modalBookPrice = document.getElementById('modalBookPrice');
const modalBookDescription = document.getElementById('modalBookDescription');
const closeModalBtn = document.querySelector('.close-modal');
const addToCartBtn = document.getElementById('addToCartBtn');
const buyNowBtn = document.getElementById('buyNowBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const arrivedBooks = document.querySelectorAll('.arrived-book');

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    setupEventListeners();
});

function setupEventListeners() {
    orderNowBtn.addEventListener('click', () => {
        alert('Thank you for your interest! You will be redirected to our order page.');
        scrollToNewArrival();
    });

    arrivedBooks.forEach(book => {
        book.addEventListener('click', (e) => {
            if (!e.target.classList.contains('get-book')) {
                const bookData = JSON.parse(book.dataset.book);
                bookData.image = book.querySelector('img').src;
                openBookModal(bookData);
            }
        });
    });

    getBookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookElement = e.target.closest('.arrived-book');
            const bookData = JSON.parse(bookElement.dataset.book);
            bookData.image = bookElement.querySelector('img').src;
            openBookModal(bookData);
        });
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterBooksByCategory(category);
        });
    });

    closeModalBtn.addEventListener('click', closeBookModal);

    window.addEventListener('click', (e) => {
        if (e.target === bookModal) {
            closeBookModal();
        }
        if (e.target === cartSidebar) {
            closeCartSidebar();
        }
    });

    addToCartBtn.addEventListener('click', addCurrentBookToCart);

    buyNowBtn.addEventListener('click', () => {
        addCurrentBookToCart();
        closeBookModal();
        openCartSidebar();
    });

    closeCartBtn.addEventListener('click', closeCartSidebar);
 
    addCartIcon();

    checkoutBtn.addEventListener('click', checkout);
}
function openBookModal(bookData) {
    modalBookImage.src = bookData.image;
    modalBookImage.alt = bookData.title;
    modalBookTitle.textContent = bookData.title;
    modalBookAuthor.textContent = `Author: ${bookData.author}`;
    modalBookPrice.textContent = `Price: ${bookData.price} Birr`;
    modalBookDescription.textContent = bookData.description;
 
    bookModal.dataset.currentBook = JSON.stringify(bookData);
    
    bookModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBookModal() {
    bookModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addCurrentBookToCart() {
    const bookData = JSON.parse(bookModal.dataset.currentBook);
    addToCart(bookData);
    closeBookModal();
}

function addToCart(book) {
    const existingItem = cart.find(item => item.title === book.title);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification(`${book.title} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>${item.author}</p>
                <p>${item.price} Birr × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
   
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        });
    });
    
    cartTotalElement.textContent = total;
}

function addCartIcon() {
    const header = document.querySelector('header');
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = `
        <span>🛒</span>
        <span id="cartCount" class="cart-count">${cart.reduce((total, item) => total + item.quantity, 0)}</span>
    `;
    cartIcon.addEventListener('click', openCartSidebar);
    header.appendChild(cartIcon);
}

function openCartSidebar() {
    cartSidebar.style.right = '0';
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.style.right = '-350px';
    document.body.style.overflow = 'auto';
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => 
        `${item.title} (${item.quantity} × ${item.price} Birr)`
    ).join('\n');
    
    alert(`Order Summary:\n\n${orderSummary}\n\nTotal: ${total} Birr\n\nThank you for your order!`);
    
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    closeCartSidebar();
}

function filterBooksByCategory(category) {
    
    const filteredBooks = books.filter(book => book.category === category);
    
    if (filteredBooks.length > 0) {
        alert(`Showing ${filteredBooks.length} book(s) in ${category} category`);
       
    } else {
        alert(`No books found in ${category} category`);
    }
}

function scrollToNewArrival() {
    document.getElementById('NewArrival').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gray-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: fadeInOut 3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    
    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 20px;
        border-radius: 10px;
        width: 80%;
        max-width: 600px;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 28px;
        cursor: pointer;
    }
    
    .modal-body {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }
    
    .modal-body img {
        width: 200px;
        height: 300px;
        object-fit: cover;
    }
    
    .modal-book-info {
        flex: 1;
    }
    
    .cart-sidebar {
        position: fixed;
        top: 0;
        right: -350px;
        width: 300px;
        height: 100%;
        background: white;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        transition: right 0.3s ease;
        z-index: 1001;
        padding: 20px;
    }
    
    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid var(--bg-color);
        padding-bottom: 10px;
    }
    
    .close-cart {
        font-size: 28px;
        cursor: pointer;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    
    .empty-cart {
        text-align: center;
        color: #666;
        padding: 20px;
    }
    
    .cart-total {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        border-top: 2px solid var(--bg-color);
        padding-top: 20px;
    }
    
    .cart-icon {
        position: relative;
        cursor: pointer;
        font-size: 24px;
    }
    
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: red;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);