/**
 * BUILD PC PAGE - TTGSHOP
 * Xây dựng cấu hình PC với tính năng:
 * - Chọn linh kiện dùng chung 1 modal picker
 * - Tự động hiển thị linh kiện đã chọn & ẩn nút chọn
 * - Tăng giảm số lượng linh kiện (+ / -) & tính lại thành tiền
 * - Sửa linh kiện (✎) mở lại picker để đổi sản phẩm
 * - Xoá linh kiện (🗑) và Làm mới toàn bộ cấu hình (↻)
 * - Tính tổng chi phí dự tính thời gian thực
 * - Kiểm tra cấu hình (gọi API check tương thích với backend / database)
 * - Tách biệt tầng Service API để kết nối cơ sở dữ liệu cực kỳ dễ dàng
 */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     1. MOCK DATABASE (Dữ liệu mẫu linh kiện PC thực tế)
     Sau này khi kết nối Database, API sẽ trả về dữ liệu tương tự
  ========================================================= */

  const CATEGORY_NAMES = {
    cpu: "CPU - Bộ Vi Xử Lý",
    mainboard: "Mainboard - Bo Mạch Chủ",
    ram: "RAM - Bộ Nhớ Trong",
    gpu: "Card Màn Hình - VGA",
    storage: "Ổ Cứng SSD / HDD",
    psu: "Nguồn Máy Tính (PSU)",
    cooling: "Tản Nhiệt CPU",
    case: "Vỏ Case Máy Tính",
    monitor: "Màn Hình Máy Tính",
  };

  const MOCK_COMPONENTS = {
    cpu: [
      {
        id: "cpu-13400f",
        category: "cpu",
        name: "CPU Intel Core i5 13400F (Up to 4.6GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)",
        price: 4890000,
        oldPrice: 5390000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Intel",
        specs: { socket: "LGA1700", ramSupport: ["DDR4", "DDR5"], tdp: 65 },
      },
      {
        id: "cpu-14700k",
        category: "cpu",
        name: "CPU Intel Core i7 14700K (Up to 5.6GHz, 20 Nhân 28 Luồng, 33MB Cache, LGA 1700)",
        price: 10490000,
        oldPrice: 11200000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Intel",
        specs: { socket: "LGA1700", ramSupport: ["DDR4", "DDR5"], tdp: 125 },
      },
      {
        id: "cpu-7600x",
        category: "cpu",
        name: "CPU AMD Ryzen 5 7600X (Up to 5.3GHz, 6 Nhân 12 Luồng, 38MB Cache, AM5)",
        price: 5690000,
        oldPrice: 6290000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "AMD",
        specs: { socket: "AM5", ramSupport: ["DDR5"], tdp: 105 },
      },
      {
        id: "cpu-12100f",
        category: "cpu",
        name: "CPU Intel Core i3 12100F (Up to 4.3GHz, 4 Nhân 8 Luồng, 12MB Cache, LGA 1700)",
        price: 2190000,
        oldPrice: 2590000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Intel",
        specs: { socket: "LGA1700", ramSupport: ["DDR4", "DDR5"], tdp: 58 },
      },
      {
        id: "cpu-7800x3d",
        category: "cpu",
        name: "CPU AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8 Nhân 16 Luồng, 96MB 3D V-Cache, AM5)",
        price: 10990000,
        oldPrice: 11990000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "AMD",
        specs: { socket: "AM5", ramSupport: ["DDR5"], tdp: 120 },
      },
    ],
    mainboard: [
      {
        id: "mb-b760m-tuf",
        category: "mainboard",
        name: "Mainboard ASUS TUF GAMING B760M-PLUS WIFI DDR5 (Socket LGA 1700)",
        price: 3990000,
        oldPrice: 4390000,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASUS",
        specs: { socket: "LGA1700", ramType: "DDR5" },
      },
      {
        id: "mb-b650-tomahawk",
        category: "mainboard",
        name: "Mainboard MSI MAG B650 TOMAHAWK WIFI (Socket AM5, DDR5)",
        price: 5390000,
        oldPrice: 5890000,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "MSI",
        specs: { socket: "AM5", ramType: "DDR5" },
      },
      {
        id: "mb-b760m-giga-d4",
        category: "mainboard",
        name: "Mainboard GIGABYTE B760M GAMING PLUS D4 (Socket LGA 1700, DDR4)",
        price: 2790000,
        oldPrice: 3190000,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "GIGABYTE",
        specs: { socket: "LGA1700", ramType: "DDR4" },
      },
      {
        id: "mb-z790-strix",
        category: "mainboard",
        name: "Mainboard ASUS ROG STRIX Z790-A GAMING WIFI II DDR5",
        price: 9490000,
        oldPrice: 10500000,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASUS",
        specs: { socket: "LGA1700", ramType: "DDR5" },
      },
      {
        id: "mb-b650m-asrock",
        category: "mainboard",
        name: "Mainboard ASRock B650M-HDV/M.2 (Socket AM5, 2 Khe DDR5)",
        price: 3190000,
        oldPrice: 3590000,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASRock",
        specs: { socket: "AM5", ramType: "DDR5" },
      },
    ],
    ram: [
      {
        id: "ram-corsair-16g-d5",
        category: "ram",
        name: "RAM Corsair Vengeance 16GB (1x16GB) DDR5 5200MHz Black",
        price: 1490000,
        oldPrice: 1790000,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Corsair",
        specs: { ramType: "DDR5", capacity: 16 },
      },
      {
        id: "ram-kingston-32g-d5",
        category: "ram",
        name: "RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 6000MHz",
        price: 3290000,
        oldPrice: 3690000,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Kingston",
        specs: { ramType: "DDR5", capacity: 32 },
      },
      {
        id: "ram-kingston-16g-d4",
        category: "ram",
        name: "RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz Black",
        price: 990000,
        oldPrice: 1190000,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Kingston",
        specs: { ramType: "DDR4", capacity: 16 },
      },
      {
        id: "ram-gskill-32g-d5",
        category: "ram",
        name: "RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz Silver",
        price: 3890000,
        oldPrice: 4290000,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "G.Skill",
        specs: { ramType: "DDR5", capacity: 32 },
      },
      {
        id: "ram-corsair-16g-d4",
        category: "ram",
        name: "RAM Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3200MHz",
        price: 1290000,
        oldPrice: 1490000,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Corsair",
        specs: { ramType: "DDR4", capacity: 16 },
      },
    ],
    gpu: [
      {
        id: "gpu-rtx4060-asus",
        category: "gpu",
        name: "Card màn hình ASUS Dual GeForce RTX 4060 EVO OC 8GB GDDR6",
        price: 8690000,
        oldPrice: 9490000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASUS",
        specs: { minPsu: 550, tdp: 115 },
      },
      {
        id: "gpu-rtx4070s-zotac",
        category: "gpu",
        name: "Card màn hình ZOTAC GAMING GeForce RTX 4070 SUPER Trinity 12GB GDDR6X",
        price: 17990000,
        oldPrice: 19490000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ZOTAC",
        specs: { minPsu: 650, tdp: 220 },
      },
      {
        id: "gpu-rtx3050-msi",
        category: "gpu",
        name: "Card màn hình MSI GeForce RTX 3050 Ventus 2X 6G OC",
        price: 4890000,
        oldPrice: 5390000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "MSI",
        specs: { minPsu: 450, tdp: 70 },
      },
      {
        id: "gpu-rx7600-sapphire",
        category: "gpu",
        name: "Card màn hình Sapphire PULSE AMD Radeon RX 7600 8GB GDDR6",
        price: 6990000,
        oldPrice: 7590000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Sapphire",
        specs: { minPsu: 550, tdp: 165 },
      },
      {
        id: "gpu-rtx4080s-strix",
        category: "gpu",
        name: "Card màn hình ASUS ROG Strix GeForce RTX 4080 SUPER 16GB GDDR6X",
        price: 32990000,
        oldPrice: 35500000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASUS",
        specs: { minPsu: 750, tdp: 320 },
      },
    ],
    storage: [
      {
        id: "ssd-nv2-1tb",
        category: "storage",
        name: "Ổ cứng SSD Kingston NV2 1TB PCIe Gen4x4 NVMe M.2 2280",
        price: 1690000,
        oldPrice: 1950000,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Kingston",
      },
      {
        id: "ssd-980pro-1tb",
        category: "storage",
        name: "Ổ cứng SSD Samsung 980 PRO 1TB PCIe 4.0 NVMe M.2 2280",
        price: 2690000,
        oldPrice: 2990000,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
        warranty: "60 Tháng",
        stock: "Còn hàng",
        brand: "Samsung",
      },
      {
        id: "ssd-nv2-500g",
        category: "storage",
        name: "Ổ cứng SSD Kingston NV2 500GB PCIe Gen4x4 NVMe M.2 2280",
        price: 1090000,
        oldPrice: 1250000,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Kingston",
      },
      {
        id: "ssd-sn580-1tb",
        category: "storage",
        name: "Ổ cứng SSD WD Blue SN580 1TB M.2 2280 PCIe Gen4 NVMe",
        price: 1750000,
        oldPrice: 1990000,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Western Digital",
      },
      {
        id: "ssd-p3plus-2tb",
        category: "storage",
        name: "Ổ cứng SSD Crucial P3 Plus 2TB PCIe Gen4 3D NAND NVMe M.2",
        price: 3390000,
        oldPrice: 3890000,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Crucial",
      },
    ],
    psu: [
      {
        id: "psu-rm750e",
        category: "psu",
        name: "Nguồn máy tính Corsair RM750e 750W 80 Plus Gold Full Modular",
        price: 2790000,
        oldPrice: 3090000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Corsair",
        specs: { wattage: 750 },
      },
      {
        id: "psu-mwe-650",
        category: "psu",
        name: "Nguồn máy tính Cooler Master MWE 650 Bronze V2 650W",
        price: 1490000,
        oldPrice: 1690000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Cooler Master",
        specs: { wattage: 650 },
      },
      {
        id: "psu-msi-850",
        category: "psu",
        name: "Nguồn máy tính MSI MAG A850GL PCIE5 850W 80 Plus Gold",
        price: 3190000,
        oldPrice: 3490000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "60 Tháng",
        stock: "Còn hàng",
        brand: "MSI",
        specs: { wattage: 850 },
      },
      {
        id: "psu-deepcool-550",
        category: "psu",
        name: "Nguồn máy tính DeepCool PK550D 550W 80 Plus Bronze",
        price: 1090000,
        oldPrice: 1250000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "DeepCool",
        specs: { wattage: 550 },
      },
      {
        id: "psu-rm850x",
        category: "psu",
        name: "Nguồn máy tính Corsair RM850x 850W 80 Plus Gold Modular",
        price: 3590000,
        oldPrice: 3990000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "60 Tháng",
        stock: "Còn hàng",
        brand: "Corsair",
        specs: { wattage: 850 },
      },
    ],
    cooling: [
      {
        id: "cool-thermalright-pa120",
        category: "cooling",
        name: "Tản nhiệt khí Thermalright Peerless Assassin 120 SE ARGB Black",
        price: 850000,
        oldPrice: 990000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "Thermalright",
      },
      {
        id: "cool-deepcool-lt720",
        category: "cooling",
        name: "Tản nhiệt nước AIO DeepCool LT720 360mm ARGB Black",
        price: 3190000,
        oldPrice: 3590000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "DeepCool",
      },
      {
        id: "cool-cr1000-evo",
        category: "cooling",
        name: "Tản nhiệt khí JONSBO CR-1000 EVO Black RGB",
        price: 350000,
        oldPrice: 420000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "12 Tháng",
        stock: "Còn hàng",
        brand: "Jonsbo",
      },
      {
        id: "cool-aqua-240",
        category: "cooling",
        name: "Tản nhiệt nước AIO Thermalright Aqua Elite 240 V3 ARGB",
        price: 1390000,
        oldPrice: 1590000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "Thermalright",
      },
      {
        id: "cool-nzxt-kraken360",
        category: "cooling",
        name: "Tản nhiệt nước AIO NZXT Kraken 360 RGB Black",
        price: 4890000,
        oldPrice: 5490000,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "NZXT",
      },
    ],
    case: [
      {
        id: "case-nzxt-h5",
        category: "case",
        name: "Vỏ Case NZXT H5 Flow Black (Mid Tower, Kèm 2 Fan 120mm)",
        price: 2190000,
        oldPrice: 2490000,
        image: "/assets/images/pc1.jpg",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "NZXT",
      },
      {
        id: "case-corsair-4000d",
        category: "case",
        name: "Vỏ Case Corsair 4000D Airflow Black (Mid Tower, Mặt lưới thoáng)",
        price: 1990000,
        oldPrice: 2290000,
        image: "/assets/images/pc1.jpg",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "Corsair",
      },
      {
        id: "case-xigmatek-aqua",
        category: "case",
        name: "Vỏ Case XIGMATEK AQUA M Black (Bể cá, Kèm 3 Fan ARGB)",
        price: 950000,
        oldPrice: 1150000,
        image: "/assets/images/pc1.jpg",
        warranty: "12 Tháng",
        stock: "Còn hàng",
        brand: "Xigmatek",
      },
      {
        id: "case-montech-sky2",
        category: "case",
        name: "Vỏ Case Montech Sky Two Black (Kèm 4 Fan ARGB PWM)",
        price: 1890000,
        oldPrice: 2150000,
        image: "/assets/images/pc1.jpg",
        warranty: "12 Tháng",
        stock: "Còn hàng",
        brand: "Montech",
      },
      {
        id: "case-lianli-o11",
        category: "case",
        name: "Vỏ Case Lian Li O11 Dynamic EVO Black (Kính cường lực kép)",
        price: 3990000,
        oldPrice: 4450000,
        image: "/assets/images/pc1.jpg",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "Lian Li",
      },
    ],
    monitor: [
      {
        id: "mon-asus-vg249q3a",
        category: "monitor",
        name: "Màn hình ASUS TUF Gaming VG249Q3A 24 inch FHD Fast IPS 180Hz 1ms",
        price: 3290000,
        oldPrice: 3790000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ASUS",
      },
      {
        id: "mon-lg-27gr75q",
        category: "monitor",
        name: "Màn hình LG UltraGear 27GR75Q-B 27 inch 2K QHD IPS 165Hz 1ms",
        price: 6290000,
        oldPrice: 6990000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "LG",
      },
      {
        id: "mon-samsung-g5",
        category: "monitor",
        name: "Màn hình Samsung Odyssey G5 G50D 27 inch QHD IPS 180Hz",
        price: 6490000,
        oldPrice: 7200000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        warranty: "24 Tháng",
        stock: "Còn hàng",
        brand: "Samsung",
      },
      {
        id: "mon-viewsonic-vx2479",
        category: "monitor",
        name: "Màn hình ViewSonic OMNI VX2479-HD-PRO 24 inch FHD IPS 165Hz",
        price: 2590000,
        oldPrice: 2990000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "ViewSonic",
      },
      {
        id: "mon-dell-u2424e",
        category: "monitor",
        name: "Màn hình Dell UltraSharp U2424E 24 inch FHD IPS 120Hz Type-C RJ45",
        price: 6790000,
        oldPrice: 7390000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
        warranty: "36 Tháng",
        stock: "Còn hàng",
        brand: "Dell",
      },
    ],
  };

  /* =========================================================
     2. SERVICE LAYER (Tách biệt API - Dễ dàng kết nối Database)
  ========================================================= */

  const BuildPcAPI = {
    /**
     * Lấy danh sách sản phẩm theo loại linh kiện
     * @param {string} category (cpu, mainboard, ram, ...)
     * @returns {Promise<Array>}
     */
    async getProductsByCategory(category) {
      // --- KHI KẾT NỐI VỚI SERVER / DATABASE:
      // try {
      //   const res = await fetch(`/api/components?category=${category}`);
      //   const data = await res.json();
      //   return data.products || data;
      // } catch (err) {
      //   console.error("Lỗi khi tải dữ liệu từ database:", err);
      // }

      // --- HIỆN TẠI: Trả về danh sách linh kiện từ Mock Data
      return MOCK_COMPONENTS[category] || [];
    },

    /**
     * Gửi yêu cầu kiểm tra tính tương thích cấu hình
     * @param {Object} selectedComponents
     * @returns {Promise<Object>}
     */
    async checkCompatibility(selectedComponents) {
      // --- KHI KẾT NỐI VỚI SERVER / DATABASE:
      // try {
      //   const res = await fetch('/api/build-pc/check-compatibility', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(selectedComponents)
      //   });
      //   return await res.json();
      // } catch (err) {
      //   console.error("Lỗi khi gọi API kiểm tra:", err);
      // }

      // --- HIỆN TẠI: Giả lập kiểm tra logic kỹ thuật
      return simulateCompatibilityCheck(selectedComponents);
    },
  };

  /* =========================================================
     3. LOGIC KIỂM TRA TƯƠNG THÍCH CẤU HÌNH (COMPATIBILITY LOGIC)
  ========================================================= */

  function simulateCompatibilityCheck(selected) {
    const items = [];
    const keys = Object.keys(selected);

    // 1. Kiểm tra số lượng linh kiện
    if (keys.length === 0) {
      return {
        status: "warning",
        title: "Cấu hình đang trống!",
        items: [
          {
            type: "warning",
            title: "Chưa chọn linh kiện",
            desc: "Vui lòng chọn các linh kiện thiết yếu (CPU, Mainboard, RAM, Ổ cứng, Nguồn) để tiến hành kiểm tra tính tương thích.",
          },
        ],
      };
    }

    // 2. Kiểm tra các linh kiện bắt buộc
    const required = [
      { key: "cpu", label: "CPU (Bộ vi xử lý)" },
      { key: "mainboard", label: "Mainboard (Bo mạch chủ)" },
      { key: "ram", label: "RAM (Bộ nhớ trong)" },
      { key: "storage", label: "Ổ cứng lưu trữ (SSD/HDD)" },
      { key: "psu", label: "Nguồn máy tính (PSU)" },
    ];

    const missing = required.filter((req) => !selected[req.key]);
    if (missing.length > 0) {
      items.push({
        type: "warning",
        title: `Còn thiếu ${missing.length} linh kiện quan trọng`,
        desc: `Để PC có thể khởi động và hoạt động, bạn cần bổ sung: ${missing.map((m) => m.label).join(", ")}.`,
      });
    }

    const cpu = selected.cpu;
    const mb = selected.mainboard;
    const ram = selected.ram;
    const gpu = selected.gpu;
    const psu = selected.psu;

    let hasError = false;

    // 3. Kiểm tra Socket CPU và Mainboard
    if (cpu && mb) {
      const cpuSocket = cpu.specs?.socket;
      const mbSocket = mb.specs?.socket;
      if (cpuSocket && mbSocket) {
        if (cpuSocket === mbSocket) {
          items.push({
            type: "success",
            title: "Socket CPU & Mainboard tương thích",
            desc: `Cả CPU (${cpu.name.slice(0, 30)}...) và Bo mạch chủ đều hỗ trợ chuẩn Socket ${cpuSocket}.`,
          });
        } else {
          hasError = true;
          items.push({
            type: "error",
            title: "Không tương thích Socket CPU và Mainboard!",
            desc: `CPU sử dụng Socket [${cpuSocket}] nhưng Mainboard bạn chọn lại sử dụng Socket [${mbSocket}]. Hai linh kiện này không thể lắp đặt cùng nhau.`,
          });
        }
      }
    }

    // 4. Kiểm tra chuẩn RAM và Mainboard
    if (ram && mb) {
      const ramType = ram.specs?.ramType;
      const mbRamType = mb.specs?.ramType;
      if (ramType && mbRamType) {
        if (ramType === mbRamType) {
          items.push({
            type: "success",
            title: "Chuẩn RAM & Mainboard tương thích",
            desc: `Mainboard hỗ trợ khe cắm ${mbRamType} hoàn toàn tương thích với thanh RAM ${ramType} đã chọn.`,
          });
        } else {
          hasError = true;
          items.push({
            type: "error",
            title: "Không tương thích chuẩn RAM!",
            desc: `Mainboard yêu cầu chuẩn bộ nhớ [${mbRamType}], nhưng RAM đang chọn lại là chuẩn [${ramType}]. Khe cắm không khớp.`,
          });
        }
      }
    }

    // 5. Kiểm tra công suất Nguồn (PSU)
    if (psu) {
      const psuWattage = psu.specs?.wattage || 500;
      let minRequiredWattage = 450;
      if (gpu && gpu.specs?.minPsu) {
        minRequiredWattage = Math.max(minRequiredWattage, gpu.specs.minPsu);
      } else if (cpu && cpu.specs?.tdp > 100) {
        minRequiredWattage = 550;
      }

      if (psuWattage >= minRequiredWattage) {
        items.push({
          type: "success",
          title: "Công suất nguồn (PSU) đáp ứng tốt",
          desc: `Bộ nguồn ${psuWattage}W đủ cung cấp công suất ổn định cho cấu hình (Khuyến nghị tối thiểu: ≥ ${minRequiredWattage}W).`,
        });
      } else {
        items.push({
          type: "warning",
          title: "Công suất nguồn có thể bị thiếu hụt",
          desc: `Card đồ họa hoặc CPU yêu cầu công suất nguồn tối thiểu ${minRequiredWattage}W. Nguồn bạn chọn hiện tại (${psuWattage}W) có thể gây sập nguồn khi tải nặng.`,
        });
      }
    }

    // 6. Kiểm tra các linh kiện bổ trợ
    if (selected.cooling) {
      items.push({
        type: "success",
        title: "Tản nhiệt tương thích",
        desc: `Tản nhiệt (${selected.cooling.name.slice(0, 35)}...) đảm bảo hiệu năng làm mát tối ưu cho CPU.`,
      });
    }

    if (selected.case) {
      items.push({
        type: "success",
        title: "Kích thước Vỏ Case phù hợp",
        desc: "Vỏ Case hỗ trợ đầy đủ các chuẩn Mainboard ATX/M-ATX và độ dài card màn hình tiêu chuẩn.",
      });
    }

    // 7. Tổng kết trạng thái
    let overallStatus = "success";
    let title = "Cấu hình tương thích tốt!";

    if (hasError) {
      overallStatus = "error";
      title = "Phát hiện xung đột phần cứng!";
    } else if (missing.length > 0) {
      overallStatus = "warning";
      title = "Cấu hình hợp lệ nhưng còn thiếu linh kiện!";
    }

    return {
      status: overallStatus,
      title: title,
      items: items,
    };
  }

  /* =========================================================
     4. TRẠNG THÁI ỨNG DỤNG (STATE)
  ========================================================= */

  const state = {
    selected: {}, // Lưu các linh kiện đã chọn: { [category]: { ...product, quantity: 1 } }
    activeCategory: null, // Danh mục đang mở trong picker
    searchQuery: "", // Từ khóa tìm kiếm trong modal
    priceFilter: "all", // Bộ lọc giá
    currentSort: "newest", // Kiểu sắp xếp
    currentList: [], // Danh sách sản phẩm của category đang mở
  };

  /* =========================================================
     5. CÁC HÀM TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ (UTILS)
  ========================================================= */

  function formatVND(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  }

  function formatVNDFull(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  }

  /* =========================================================
     6. CẬP NHẬT TỔNG CHI PHÍ DỰ TÍNH (UPDATE TOTAL PRICE)
  ========================================================= */

  function updateTotalPrice() {
    let total = 0;
    Object.values(state.selected).forEach((item) => {
      total += (item.price || 0) * (item.quantity || 1);
    });

    const formatted = formatVND(total);
    const topTotalEl = document.getElementById("totalPrice");
    const bottomTotalEl = document.getElementById("bottomTotalPrice");

    if (topTotalEl) topTotalEl.textContent = formatted;
    if (bottomTotalEl) bottomTotalEl.textContent = formatted;
  }

  /* =========================================================
     7. CẬP NHẬT GIAO DIỆN HÀNG LINH KIỆN (RENDER ROW)
  ========================================================= */

  function renderComponentRow(category) {
    const rowEl = document.querySelector(`.component-row[data-component="${category}"]`);
    if (!rowEl) return;

    const chooseBtn = rowEl.querySelector(".choose-button");
    const selectedBox = rowEl.querySelector(".selected-component");
    const item = state.selected[category];

    if (item) {
      // Ẩn nút chọn, hiện card linh kiện đã chọn
      if (chooseBtn) chooseBtn.hidden = true;
      if (selectedBox) {
        selectedBox.hidden = false;

        const imgEl = selectedBox.querySelector(".selected-product-image img");
        if (imgEl) {
          imgEl.src = item.image;
          imgEl.alt = item.name;
        }

        const titleEl = selectedBox.querySelector(".selected-product-info h3");
        if (titleEl) {
          titleEl.textContent = item.name;
          titleEl.title = item.name;
        }

        const priceEl = selectedBox.querySelector(".selected-price");
        if (priceEl) {
          priceEl.textContent = formatVNDFull(item.price);
        }

        const qtyEl = selectedBox.querySelector(".quantity-value");
        if (qtyEl) {
          qtyEl.textContent = item.quantity;
        }

        const totalEl = selectedBox.querySelector(".selected-total");
        if (totalEl) {
          totalEl.textContent = formatVNDFull(item.price * item.quantity);
        }
      }
    } else {
      // Hiện nút chọn, ẩn card linh kiện
      if (chooseBtn) chooseBtn.hidden = false;
      if (selectedBox) selectedBox.hidden = true;
    }
  }

  /* =========================================================
     8. MODAL PICKER LINH KIỆN (MODAL PICKER HANDLERS)
  ========================================================= */

  const pickerModal = document.getElementById("componentPickerModal");
  const pickerTitle = document.getElementById("pickerModalTitle");
  const closePickerBtn = document.getElementById("closePickerButton");
  const productSearchInput = document.getElementById("productSearch");
  const modalProductsContainer = document.getElementById("modalProducts");
  const sortOptions = document.querySelectorAll(".sort-option");
  const filterButtons = document.querySelectorAll("#filterRow .filter-btn");

  /**
   * Mở Modal chọn linh kiện cho một danh mục
   */
  async function openPickerModal(category) {
    if (!pickerModal) return;

    state.activeCategory = category;
    state.searchQuery = "";
    state.priceFilter = "all";
    state.currentSort = "newest";

    if (productSearchInput) productSearchInput.value = "";

    // Reset sort UI
    sortOptions.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sort === "newest");
    });

    // Reset filter UI
    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === "all");
    });

    // Cập nhật tiêu đề modal
    if (pickerTitle) {
      pickerTitle.textContent = CATEGORY_NAMES[category]
        ? `Chọn ${CATEGORY_NAMES[category]}`
        : "Chọn Linh Kiện";
    }

    // Hiển thị trạng thái đang tải (Loading)
    if (modalProductsContainer) {
      modalProductsContainer.innerHTML = `
        <div class="modal-products-empty">
          <span>⏳</span>
          Đang tải danh sách linh kiện...
        </div>
      `;
    }

    // Mở popup modal
    pickerModal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Tải dữ liệu từ Service API
    const products = await BuildPcAPI.getProductsByCategory(category);
    state.currentList = products;

    // Render danh sách sản phẩm
    renderModalProducts();
  }

  /**
   * Đóng Modal chọn linh kiện
   */
  function closePickerModal() {
    if (!pickerModal) return;
    pickerModal.classList.remove("show");
    document.body.style.overflow = "";
    state.activeCategory = null;
  }

  /**
   * Render danh sách sản phẩm bên trong modal picker
   */
  function renderModalProducts() {
    if (!modalProductsContainer) return;

    let list = [...state.currentList];

    // 1. Tìm kiếm theo tên
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 2. Lọc theo khoảng giá
    if (state.priceFilter === "under-3m") {
      list = list.filter((p) => p.price < 3000000);
    } else if (state.priceFilter === "3m-7m") {
      list = list.filter((p) => p.price >= 3000000 && p.price <= 7000000);
    } else if (state.priceFilter === "over-7m") {
      list = list.filter((p) => p.price > 7000000);
    } else if (state.priceFilter === "in-stock") {
      list = list.filter((p) => p.stock === "Còn hàng");
    }

    // 3. Sắp xếp giá
    if (state.currentSort === "asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (state.currentSort === "desc") {
      list.sort((a, b) => b.price - a.price);
    }

    // Kiểm tra danh sách rỗng
    if (list.length === 0) {
      modalProductsContainer.innerHTML = `
        <div class="modal-products-empty">
          <span>🔍</span>
          Không tìm thấy linh kiện nào phù hợp với bộ lọc hiện tại.
        </div>
      `;
      return;
    }

    // Render từng card sản phẩm
    modalProductsContainer.innerHTML = list
      .map((item) => {
        const discountAmount = item.oldPrice > item.price ? item.oldPrice - item.price : 0;
        return `
        <article class="modal-product-card" data-product-id="${item.id}">
          <div class="modal-product-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>

          <h3 class="modal-product-name" title="${item.name}">
            ${item.name}
          </h3>

          <div class="modal-old-price">${formatVNDFull(item.oldPrice)}</div>
          <div class="modal-current-price">${formatVNDFull(item.price)}</div>

          <div class="discount">${discountAmount > 0 ? `Giảm ${formatVNDFull(discountAmount)}` : `Bảo hành: ${item.warranty}`}</div>

          <div class="modal-buttons">
            <button type="button" class="modal-detail-btn" onclick="window.open('/product-detail?id=' + (item.id || 1), '_blank')">
              CHI TIẾT
            </button>
            <button type="button" class="modal-select-btn" data-product-id="${item.id}">
              CHỌN
            </button>
          </div>
        </article>
      `;
      })
      .join("");

    // Gắn sự kiện nút "CHỌN" cho các card vừa tạo
    modalProductsContainer.querySelectorAll(".modal-select-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        selectProductForActiveCategory(pId);
      });
    });
  }

  /**
   * Chọn sản phẩm gán vào danh mục đang hoạt động
   */
  function selectProductForActiveCategory(productId) {
    if (!state.activeCategory) return;

    const product = state.currentList.find((p) => p.id === productId);
    if (!product) return;

    // Giữ nguyên số lượng hiện tại nếu là hành động "Sửa", hoặc mặc định 1
    const currentQty = state.selected[state.activeCategory]?.quantity || 1;

    state.selected[state.activeCategory] = {
      ...product,
      quantity: currentQty,
    };

    // Cập nhật DOM của hàng đó
    renderComponentRow(state.activeCategory);

    // Tính lại tổng tiền
    updateTotalPrice();

    // Đóng modal picker
    closePickerModal();
  }

  /* =========================================================
     9. GẮN SỰ KIỆN TRÊN BẢNG LINH KIỆN (TABLE EVENT DELEGATION)
  ========================================================= */

  const componentTable = document.querySelector(".component-table");

  if (componentTable) {
    componentTable.addEventListener("click", (e) => {
      // 1. Nút "+ Chọn Linh Kiện"
      const chooseBtn = e.target.closest(".choose-button");
      if (chooseBtn) {
        const category = chooseBtn.dataset.openPicker;
        if (category) openPickerModal(category);
        return;
      }

      // 2. Nút "✎" Sửa linh kiện
      const changeBtn = e.target.closest(".change-button");
      if (changeBtn) {
        const category = changeBtn.dataset.changeComponent;
        if (category) openPickerModal(category);
        return;
      }

      // 3. Nút "🗑" Xoá linh kiện
      const deleteBtn = e.target.closest(".delete-button");
      if (deleteBtn) {
        const category = deleteBtn.dataset.deleteComponent;
        if (category && state.selected[category]) {
          delete state.selected[category];
          renderComponentRow(category);
          updateTotalPrice();
        }
        return;
      }

      // 4. Nút "+" Tăng số lượng
      const plusBtn = e.target.closest(".quantity-plus");
      if (plusBtn) {
        const row = plusBtn.closest(".component-row");
        const category = row?.dataset.component;
        if (category && state.selected[category]) {
          state.selected[category].quantity += 1;
          renderComponentRow(category);
          updateTotalPrice();
        }
        return;
      }

      // 5. Nút "−" Giảm số lượng
      const minusBtn = e.target.closest(".quantity-minus");
      if (minusBtn) {
        const row = minusBtn.closest(".component-row");
        const category = row?.dataset.component;
        if (category && state.selected[category]) {
          if (state.selected[category].quantity > 1) {
            state.selected[category].quantity -= 1;
            renderComponentRow(category);
            updateTotalPrice();
          }
        }
        return;
      }
    });
  }

  /* =========================================================
     10. TÌM KIẾM, LỌC & SẮP XẾP TRONG MODAL
  ========================================================= */

  // Tìm kiếm theo tên thời gian thực
  if (productSearchInput) {
    productSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderModalProducts();
    });
  }

  // Bộ lọc giá
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.priceFilter = btn.dataset.filter || "all";
      renderModalProducts();
    });
  });

  // Sắp xếp giá
  sortOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortOptions.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentSort = btn.dataset.sort || "newest";
      renderModalProducts();
    });
  });

  // Đóng modal picker
  if (closePickerBtn) {
    closePickerBtn.addEventListener("click", closePickerModal);
  }

  if (pickerModal) {
    pickerModal.addEventListener("click", (e) => {
      if (e.target === pickerModal) closePickerModal();
    });
  }

  /* =========================================================
     11. MODAL LÀM MỚI TOÀN BỘ CẤU HÌNH (RESET CONFIGURATION)
  ========================================================= */

  const deleteConfigModal = document.getElementById("deleteConfigModal");
  const deleteConfigButton = document.getElementById("deleteConfigButton");
  const cancelDeleteConfig = document.getElementById("cancelDeleteConfig");
  const confirmDeleteConfig = document.getElementById("confirmDeleteConfig");
  const closeDeleteConfigModal = document.getElementById("closeDeleteConfigModal");

  function openResetModal() {
    if (!deleteConfigModal) return;
    deleteConfigModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeResetModal() {
    if (!deleteConfigModal) return;
    deleteConfigModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  if (deleteConfigButton) deleteConfigButton.addEventListener("click", openResetModal);
  if (cancelDeleteConfig) cancelDeleteConfig.addEventListener("click", closeResetModal);
  if (closeDeleteConfigModal) closeDeleteConfigModal.addEventListener("click", closeResetModal);

  if (deleteConfigModal) {
    deleteConfigModal.addEventListener("click", (e) => {
      if (e.target === deleteConfigModal) closeResetModal();
    });
  }

  // Xác nhận làm mới cấu hình
  if (confirmDeleteConfig) {
    confirmDeleteConfig.addEventListener("click", () => {
      // Xoá tất cả linh kiện trong state
      state.selected = {};

      // Cập nhật lại tất cả hàng về trạng thái rỗng
      document.querySelectorAll(".component-row").forEach((row) => {
        const cat = row.dataset.component;
        if (cat) renderComponentRow(cat);
      });

      // Cập nhật tổng tiền về 0
      updateTotalPrice();

      // Đóng modal
      closeResetModal();
    });
  }

  /* =========================================================
     12. MODAL KIỂM TRA CẤU HÌNH (CHECK COMPATIBILITY API)
  ========================================================= */

  const checkConfigButton = document.getElementById("checkConfigButton");
  const checkConfigModal = document.getElementById("checkConfigModal");
  const closeCheckConfigModal = document.getElementById("closeCheckConfigModal");
  const okCheckConfig = document.getElementById("okCheckConfig");
  const checkConfigIcon = document.getElementById("checkConfigIcon");
  const checkConfigTitle = document.getElementById("checkConfigTitle");
  const checkConfigBody = document.getElementById("checkConfigBody");

  function closeCheckModal() {
    if (!checkConfigModal) return;
    checkConfigModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  if (closeCheckConfigModal) closeCheckConfigModal.addEventListener("click", closeCheckModal);
  if (okCheckConfig) okCheckConfig.addEventListener("click", closeCheckModal);

  if (checkConfigModal) {
    checkConfigModal.addEventListener("click", (e) => {
      if (e.target === checkConfigModal) closeCheckModal();
    });
  }

  // Bấm nút "Kiểm tra cấu hình"
  if (checkConfigButton) {
    checkConfigButton.addEventListener("click", async () => {
      // 1. Gọi Service API kiểm tra cấu hình
      const report = await BuildPcAPI.checkCompatibility(state.selected);

      // 2. Render Icon & Title
      if (checkConfigIcon) {
        checkConfigIcon.className = `confirm-icon check-icon ${report.status}`;
        if (report.status === "success") {
          checkConfigIcon.textContent = "✔";
        } else if (report.status === "warning") {
          checkConfigIcon.textContent = "⚠";
        } else {
          checkConfigIcon.textContent = "✖";
        }
      }

      if (checkConfigTitle) {
        checkConfigTitle.textContent = report.title;
      }

      // 3. Render danh sách kết quả chi tiết
      if (checkConfigBody) {
        checkConfigBody.innerHTML = report.items
          .map((item) => {
            const iconChar =
              item.type === "success" ? "✔" : item.type === "warning" ? "⚠" : "✖";
            return `
            <div class="check-item ${item.type}">
              <div class="check-item-icon">${iconChar}</div>
              <div class="check-item-content">
                <div class="check-item-title">${item.title}</div>
                <div class="check-item-desc">${item.desc}</div>
              </div>
            </div>
          `;
          })
          .join("");
      }

      // 4. Mở popup modal
      if (checkConfigModal) {
        checkConfigModal.classList.add("show");
        document.body.style.overflow = "hidden";
      }
    });
  }

  /* =========================================================
     13. THÊM VÀO GIỎ HÀNG (ADD CONFIG TO CART)
  ========================================================= */

  const addToCartButton = document.getElementById("addToCartButton");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const selectedItems = Object.values(state.selected);
      if (selectedItems.length === 0) {
        alert("Vui lòng chọn ít nhất 1 linh kiện vào cấu hình trước khi thêm vào giỏ hàng!");
        return;
      }

      const count = selectedItems.reduce((acc, cur) => acc + cur.quantity, 0);
      let total = 0;
      selectedItems.forEach((item) => {
        total += item.price * item.quantity;
      });

      alert(
        `Đã thêm cấu hình PC (${count} linh kiện, tổng ${formatVND(total)}) vào giỏ hàng thành công!`
      );
    });
  }

  /* =========================================================
     14. KHỞI TẠO BAN ĐẦU (INITIALIZE)
  ========================================================= */

  // Khởi tạo các hàng về trạng thái rỗng
  document.querySelectorAll(".component-row").forEach((row) => {
    const cat = row.dataset.component;
    if (cat) renderComponentRow(cat);
  });

  // Khởi tạo tổng chi phí 0 đ
  updateTotalPrice();
});
