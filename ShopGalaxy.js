// --- ShopGalaxy.js (Đã tổ chức lại và thêm logic Carousel) ---

// --- 1. KHỞI TẠO DỮ LIỆU VÀ BIẾN TRẠNG THÁI ---
const products = [
    {
        id: 1,
        name: "Áo Sao Băng (Stellar T-shirt)",
        price: 4990000,
        description: "Áo sao băng sáng nhất bầu trời đêm, thiết kế bùng cháy và sáng lói",
        images: [
            "áo sao băng1.png",
            "áo sao băng2.png",
        ]
    },
    {
        id: 2,
        name: "Giày Cao Cổ Vệ Tinh (Orbital Boots)",
        price: 8200000,
        description: "Giày da tổng hợp chịu lực, có đệm khí áp suất thấp. Lý tưởng cho mọi địa hình hành tinh.",
        images: [
            "người đi giày.png", // Đã sửa tên file để khớp với HTML
            "góc chính diện của giày.png",
            "giày góc 3.png"
        ]
    },
    {
        id: 3,
        name: "Ly Trường Thiên Thạch",
        price: 250000,
        description: "Món quà tặng người thân đầy ý nghĩa và cảm xúc, thể hiện nhiệt huyết tuổi trẻ",
        images: [
            "ly đựng nước.png", // Đã sửa tên file để khớp với HTML
            "góc phía sau ly.png", // Đã sửa tên file để khớp với HTML
            "góc 3 ly.png"
        ]
    },
];

// Biến trạng thái toàn cục
let currentUser = JSON.parse(localStorage.getItem('galaxy_user')) || null;
let activeProduct = products[0];
let currentQuantity = 1;
let isLoginMode = true;
let currentImageIndex = 0; // BIẾN MỚI: Theo dõi chỉ mục ảnh đang hiển thị

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// --- 2. HÀM CẬP NHẬT UI KHI ĐĂNG NHẬP/XUẤT ---
function updateAuthUI() {
    if (currentUser) {
        // Đã đăng nhập
        const userName = currentUser.email.split('@')[0];
        document.getElementById('user-display').textContent = userName;
        document.getElementById('login-button').innerHTML = `<i data-lucide="log-out" class="w-5 h-5 text-red-400"></i><span class="text-xs font-semibold text-red-400">Đăng Xuất</span>`;
        document.getElementById('place-order-button').disabled = false;
        document.getElementById('order-message').classList.add('hidden');
        document.getElementById('order-history-section').classList.remove('hidden');
        document.getElementById('current-user-id').textContent = 'USER-MOCK-001';
        document.getElementById('login-modal').classList.add('hidden');
        renderOrderHistory(); // Hiển thị lịch sử giả
    } else {
        // Chưa đăng nhập
        document.getElementById('user-display').textContent = 'Đăng nhập';
        document.getElementById('login-button').innerHTML = `<i data-lucide="user" class="w-5 h-5 text-white"></i><span class="text-xs font-semibold">Đăng nhập</span>`;
        document.getElementById('place-order-button').disabled = true;
        document.getElementById('order-message').classList.remove('hidden');
        document.getElementById('order-history-section').classList.add('hidden');
        document.getElementById('current-user-id').textContent = '...';
    }
    // Gọi lại hàm tạo icons sau khi thay đổi innerHTML
    if (window.lucide) lucide.createIcons();
}

// --- 3. LOGIC GIẢ LẬP AUTH ---
window.handleHeaderLoginClick = () => {
    if (currentUser) {
        // Xử lý Đăng xuất
        if(confirm("Bạn muốn rời khỏi tần số liên lạc này?")) {
            currentUser = null;
            localStorage.removeItem('galaxy_user');
            updateAuthUI();
            // Đảm bảo nút đăng nhập/đăng xuất cập nhật icon
            if (window.lucide) lucide.createIcons();
            alert("Đã ngắt kết nối thành công.");
        }
    } else {
        // Mở modal đăng nhập
        document.getElementById('login-modal').classList.remove('hidden');
        resetAuthForm();
    }
};

window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const btnText = document.getElementById('auth-submit-btn');
    const toggleText = document.getElementById('auth-toggle-link');
    
    if (isLoginMode) {
        title.textContent = "ĐĂNG NHẬP VỆ TINH";
        btnText.textContent = "KẾT NỐI NGAY";
        toggleText.innerHTML = "Chưa có hộ chiếu không gian? <span class='text-yellow-400 font-bold cursor-pointer hover:underline'>Đăng ký ngay</span>";
    } else {
        title.textContent = "ĐĂNG KÝ HỒ SƠ MỚI";
        btnText.textContent = "CẤP QUYỀN TRUY CẬP";
        toggleText.innerHTML = "Đã có tài khoản? <span class='text-yellow-400 font-bold cursor-pointer hover:underline'>Đăng nhập lại</span>";
    }
};

window.handleAuthSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    // GIẢ LẬP: Luôn đăng nhập thành công
    currentUser = { email: email, uid: 'mock-user-id-123' };
    localStorage.setItem('galaxy_user', JSON.stringify(currentUser));
    
    alert(`Chào mừng phi hành gia ${email} gia nhập trạm không gian! (Chế độ giả lập)`);
    updateAuthUI();
};

function resetAuthForm() {
    document.getElementById('auth-form').reset();
    document.getElementById('auth-message').classList.add('hidden');
    if(!isLoginMode) toggleAuthMode();
}

// --- 4. LOGIC SHOP & ORDER (Giả lập) VÀ CAROUSEL ---

// HÀM MỚI: Cập nhật ảnh chính và tạo danh sách ảnh nhỏ (Tương ứng với updateProductImages cũ)
const updateProductImageDisplay = (product) => {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('product-thumbnails');

    if (!mainImage || !thumbnailsContainer) return;
    
    // 1. Cập nhật ảnh chính dựa trên index hiện tại
    mainImage.src = product.images[currentImageIndex]; 

    // 2. Cập nhật ảnh nhỏ (Thumbnails)
    thumbnailsContainer.innerHTML = product.images.map((imgUrl, index) => {
        const isActive = index === currentImageIndex;
        // Đảm bảo border màu vàng chỉ hiển thị trên thumbnail đang active
        const isActiveClass = isActive ? 'border-yellow-500' : 'border-gray-700';

        return `
            <img 
                class="thumbnail border-2 ${isActiveClass} cursor-pointer w-20 h-20 object-cover rounded-lg transition duration-150"
                src="${imgUrl}" 
                data-image-url="${imgUrl}" 
                data-image-index="${index}" 
                alt="Ảnh sản phẩm"
            >
        `;
    }).join('');
};

/** LOGIC CAROUSEL: Điều hướng tiến/lùi ảnh */
const navigateCarousel = (direction) => {
    let newIndex = currentImageIndex + direction;
    const totalImages = activeProduct.images.length;

    // Logic lặp (loop)
    if (newIndex >= totalImages) {
        newIndex = 0; 
    } else if (newIndex < 0) {
        newIndex = totalImages - 1; 
    }

    currentImageIndex = newIndex;
    updateProductImageDisplay(activeProduct); // Cập nhật giao diện
};


const selectProduct = (product) => {
    activeProduct = product;
    currentQuantity = 1;
    currentImageIndex = 0; // Reset index khi chọn sản phẩm mới

    // Đảm bảo phần tử tồn tại trước khi cập nhật
    const productNameEl = document.getElementById('active-product-name');
    const productPriceEl = document.getElementById('active-product-price');
    const quantityEl = document.getElementById('quantity');
    
    if (productNameEl) productNameEl.textContent = product.name;
    if (productPriceEl) productPriceEl.textContent = formatCurrency(product.price);
    if (quantityEl) quantityEl.value = 1;
    
    // Gọi hàm cập nhật ảnh chính và ảnh nhỏ
    updateProductImageDisplay(product); 
};

const renderShop = () => {
    const shopSection = document.getElementById('shop');
    let grid = shopSection.querySelector('.grid-container');
    
    // Tạo lưới sản phẩm nếu chưa có
    if (!grid) {
    grid = document.createElement('div');
    // THÊM: max-w-6xl (Giới hạn chiều rộng tối đa) và mx-auto (Căn giữa)
    grid.className = 'grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto'; 
    const details = document.getElementById('active-product-details');
    // ...
        // Thêm lưới vào trước phần chi tiết sản phẩm
        if (details) {
            shopSection.insertBefore(grid, details);
        } else {
            shopSection.appendChild(grid); // Fallback nếu không tìm thấy details
        }
    }
    grid.innerHTML = ''; 

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-gray-900 rounded-xl p-4 cursor-pointer hover:scale-[1.03] transition duration-300 border border-gray-800 shadow-lg group";
        card.innerHTML = `
            <div class="h-48 overflow-hidden rounded-lg mb-4">
                <img src="${p.images[0]}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            </div>
            <h3 class="text-white font-bold text-lg mb-1 truncate">${p.name}</h3>
            <p class="text-gray-400 text-sm mb-2 line-clamp-2">${p.description}</p>
            <p class="text-yellow-500 font-bold text-xl">${formatCurrency(p.price)}</p>
            <button class="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm font-semibold transition">Chọn Mua</button>
        `;
        card.addEventListener('click', () => {
            selectProduct(p);
            // Cuộn đến phần chi tiết sản phẩm
            document.getElementById('active-product-details').scrollIntoView({ behavior: 'smooth' });
        });
        grid.appendChild(card);
    });
    // Chọn sản phẩm đầu tiên khi tải trang
    selectProduct(products[0]);
};

// Giả lập đặt hàng
function placeOrderMock() {
    if (!currentUser) return;
    const total = activeProduct.price * currentQuantity;
    
    // Lưu đơn hàng vào LocalStorage thay vì Firebase
    const order = {
        productName: activeProduct.name,
        quantity: currentQuantity,
        total: total,
        date: new Date().toLocaleString('vi-VN')
    };
    
    let history = JSON.parse(localStorage.getItem('galaxy_orders')) || [];
    history.unshift(order); // Thêm vào đầu danh sách
    localStorage.setItem('galaxy_orders', JSON.stringify(history));

    alert(`Đã gửi tín hiệu đặt hàng thành công!\nSản phẩm: ${activeProduct.name}\nTổng: ${formatCurrency(total)}`);
    renderOrderHistory();
}

function renderOrderHistory() {
    const list = document.getElementById('order-list');
    const history = JSON.parse(localStorage.getItem('galaxy_orders')) || [];
    
    if (!list) return;

    if (history.length === 0) {
        list.innerHTML = '<p class="text-gray-500 italic">Chưa có dữ liệu chuyến hàng nào.</p>';
        return;
    }

    list.innerHTML = history.map(order => `
        <div class="border-b border-gray-800 pb-2 mb-2 last:border-0">
            <p class="text-yellow-500 font-bold">${order.productName}</p>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>SL: ${order.quantity}</span>
                <span>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</span>
            </div>
            <p class="text-[10px] text-gray-600 mt-1">${order.date}</p>
        </div>
    `).join('');
}

// --- 5. KHỞI CHẠY (ONLOAD) VÀ GÁN SỰ KIỆN ---
window.onload = () => {
    // Tải Lucide Icons
    if (window.lucide) lucide.createIcons();
    else {
        // Fallback nếu mạng chậm chưa load kịp script icon
        setTimeout(() => window.lucide && lucide.createIcons(), 1000);
    }
    
    renderShop();
    updateAuthUI(); // Kiểm tra trạng thái đăng nhập

    // Gán sự kiện AUTH & ORDER
    document.getElementById('login-button').addEventListener('click', handleHeaderLoginClick);
    document.getElementById('close-modal-btn')?.addEventListener('click', () => document.getElementById('login-modal').classList.add('hidden'));
    document.getElementById('auth-toggle-link')?.addEventListener('click', toggleAuthMode);
    document.getElementById('auth-form')?.addEventListener('submit', handleAuthSubmit);
    document.getElementById('place-order-button')?.addEventListener('click', placeOrderMock);
    
    // Gán sự kiện cho CAROUSEL NAVIGATION
    const carouselPrevBtn = document.getElementById('carousel-prev');
    const carouselNextBtn = document.getElementById('carousel-next');

    // Chú ý: Dùng `?.` hoặc kiểm tra `if` để tránh lỗi nếu không tìm thấy phần tử
    if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateCarousel(-1);
    });
    if (carouselNextBtn) carouselNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateCarousel(1);
    });

    // Gán sự kiện cho THUMBNAILS (Sử dụng Event Delegation)
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    if (thumbnailsContainer) {
        // Đặt sự kiện click lên container cha
        thumbnailsContainer.addEventListener('click', (event) => {
            const clickedThumbnail = event.target.closest('img.thumbnail');
            if (clickedThumbnail) {
                // Lấy index ảnh từ data attribute
                const index = parseInt(clickedThumbnail.getAttribute('data-image-index'));
                if (!isNaN(index)) {
                    currentImageIndex = index;
                    updateProductImageDisplay(activeProduct);
                }
            }
        });
    }

    // Mobile menu
    document.getElementById('mobile-menu-button')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('hidden'));
    document.getElementById('close-menu-button')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.add('hidden'));

    // Tăng giảm số lượng
    document.getElementById('qty-plus')?.addEventListener('click', () => {
        currentQuantity++;
        document.getElementById('quantity').value = currentQuantity;
    });
    document.getElementById('qty-minus')?.addEventListener('click', () => {
        const qtyEl = document.getElementById('quantity');
        if (currentQuantity > 1 && qtyEl) {
            currentQuantity--;
            qtyEl.value = currentQuantity;
        }
    });
};
