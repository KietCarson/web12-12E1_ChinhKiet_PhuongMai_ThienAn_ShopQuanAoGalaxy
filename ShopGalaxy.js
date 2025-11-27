
        // --- 1. KHỞI TẠO DỮ LIỆU GIẢ ---
        const products = [
            {
                id: 1,
                name: "La Bàn Sao Băng (Stellar Compass)",
                price: 4990000,
                description: "Công cụ định vị không gian chính xác, sử dụng công nghệ từ trường thiên hà. Thiết kế vỏ hợp kim Titan siêu nhẹ.",
                images: ["https://placehold.co/800x600/1e40af/ffffff?text=La+Ban+Sao+Bang+(Main)"]
            },
            {
                id: 2,
                name: "Chăn Mền Tinh Vân (Nebula Quilt)",
                price: 1550000,
                description: "Chăn mền siêu ấm, vật liệu cách nhiệt Nano-Fiber. Thiết kế mô phỏng các dải tinh vân rực rỡ.",
                images: ["https://placehold.co/800x600/ef4444/ffffff?text=Chan+Men+Tinh+Van+(Main)"]
            },
            {
                id: 3,
                name: "Giày Cao Cổ Vệ Tinh (Orbital Boots)",
                price: 8200000,
                description: "Giày da tổng hợp chịu lực, có đệm khí áp suất thấp. Lý tưởng cho mọi địa hình hành tinh.",
                images: ["https://placehold.co/800x600/10b981/ffffff?text=Giay+Ve+Tinh+(Main)"]
            },
            {
                id: 4,
                name: "Bản Đồ Trường Thiên Thạch",
                price: 250000,
                description: "Bản đồ tương tác 3D, hiển thị các trường thiên thạch lớn. Có thể chiếu lên kính chắn gió tàu vũ trụ.",
                images: ["https://placehold.co/800x600/f59e0b/ffffff?text=Ban+Do+Thien+Thach+(Main)"]
            },
        ];

        // Biến trạng thái
        let currentUser = JSON.parse(localStorage.getItem('galaxy_user')) || null; // Lưu trạng thái đăng nhập vào LocalStorage
        let activeProduct = products[0];
        let currentQuantity = 1;
        let isLoginMode = true;

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

        // --- 4. LOGIC SHOP & ORDER (Giả lập) ---
        const selectProduct = (product) => {
            activeProduct = product;
            currentQuantity = 1;
            document.getElementById('active-product-name').textContent = product.name;
            document.getElementById('active-product-price').textContent = formatCurrency(product.price);
            document.getElementById('quantity').value = 1;
        };

        const renderShop = () => {
            const shopSection = document.getElementById('shop');
            let grid = shopSection.querySelector('.grid-container');
            if (!grid) {
                grid = document.createElement('div');
                grid.className = 'grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10';
                const details = document.getElementById('active-product-details');
                shopSection.insertBefore(grid, details);
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
                    document.getElementById('active-product-details').scrollIntoView({ behavior: 'smooth' });
                });
                grid.appendChild(card);
            });
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

        // --- 5. KHỞI CHẠY (ONLOAD) ---
        window.onload = () => {
            // Tải Lucide Icons
            if (window.lucide) lucide.createIcons();
            else {
                // Fallback nếu mạng chậm chưa load kịp script icon
                setTimeout(() => window.lucide && lucide.createIcons(), 1000);
            }
            
            renderShop();
            updateAuthUI(); // Kiểm tra trạng thái đăng nhập

            // Gán sự kiện
            document.getElementById('login-button').addEventListener('click', handleHeaderLoginClick);
            document.getElementById('close-modal-btn').addEventListener('click', () => document.getElementById('login-modal').classList.add('hidden'));
            document.getElementById('auth-toggle-link').addEventListener('click', toggleAuthMode);
            document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
            document.getElementById('place-order-button').addEventListener('click', placeOrderMock);
            
            // Mobile menu
            document.getElementById('mobile-menu-button').addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('hidden'));
            document.getElementById('close-menu-button').addEventListener('click', () => document.getElementById('mobile-menu').classList.add('hidden'));

            // Tăng giảm số lượng
            document.getElementById('qty-plus').addEventListener('click', () => {
                currentQuantity++;
                document.getElementById('quantity').value = currentQuantity;
            });
            document.getElementById('qty-minus').addEventListener('click', () => {
                if(currentQuantity > 1) {
                    currentQuantity--;
                    document.getElementById('quantity').value = currentQuantity;
                }
            });
        };