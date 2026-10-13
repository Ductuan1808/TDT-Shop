/* =========================================================
   MAIN IMAGE SLIDER
========================================================= */

const mainImageTrack = document.getElementById("mainImageTrack");

const mainSlides = document.querySelectorAll(".main-image-slide");

const thumbnails = document.querySelectorAll(".thumbnail");

let currentImageIndex = 0;

/* =========================================================
   SET MAIN IMAGE
========================================================= */

function setMainImage(index) {
  const totalImages = mainSlides.length;

  /*
        Nếu bấm lùi ở ảnh đầu
        → chuyển về ảnh cuối
    */

  if (index < 0) {
    index = totalImages - 1;
  }

  /*
        Nếu bấm tiến ở ảnh cuối
        → quay lại ảnh đầu
    */

  if (index >= totalImages) {
    index = 0;
  }

  currentImageIndex = index;

  /*
        Trượt ảnh lớn
    */

  mainImageTrack.style.transform = `translateX(-${index * 100}%)`;

  /*
        Active thumbnail
    */

  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    thumbnail.classList.toggle("active", thumbnailIndex === index);
  });

  /*
        Tự động đưa thumbnail đang active
        vào vùng nhìn thấy
    */

  scrollThumbnailToActive(index);
}

/* =========================================================
   NEXT IMAGE
========================================================= */

document.getElementById("mainNext").addEventListener("click", function () {
  setMainImage(currentImageIndex + 1);
});

/* =========================================================
   PREVIOUS IMAGE
========================================================= */

document.getElementById("mainPrev").addEventListener("click", function () {
  setMainImage(currentImageIndex - 1);
});

/* =========================================================
   CLICK THUMBNAIL
========================================================= */

thumbnails.forEach(function (thumbnail) {
  thumbnail.addEventListener("click", function () {
    const index = Number(thumbnail.dataset.thumbnailIndex);

    setMainImage(index);
  });
});

/* =========================================================
   THUMBNAIL SLIDER
========================================================= */

const thumbnailTrack = document.getElementById("thumbnailTrack");

const thumbnailViewport = document.querySelector(".thumbnail-viewport");

const thumbnailWidth = 108 + 12;

let thumbnailOffset = 0;

/* =========================================================
   SCROLL THUMBNAIL
========================================================= */

function scrollThumbnailToActive(index) {
  const viewportWidth = thumbnailViewport.clientWidth;

  const visibleCount = Math.floor(viewportWidth / thumbnailWidth);

  /*
        Nếu ảnh active nằm bên trái
    */

  if (index < thumbnailOffset) {
    thumbnailOffset = index;
  }

  /*
        Nếu ảnh active nằm bên phải
    */

  if (index >= thumbnailOffset + visibleCount) {
    thumbnailOffset = index - visibleCount + 1;
  }

  updateThumbnailPosition();
}

/* =========================================================
   UPDATE THUMBNAIL POSITION
========================================================= */

function updateThumbnailPosition() {
  const total = thumbnails.length;

  const viewportWidth = thumbnailViewport.clientWidth;

  const visibleCount = Math.floor(viewportWidth / thumbnailWidth);

  const maxOffset = Math.max(0, total - visibleCount);

  thumbnailOffset = Math.max(0, Math.min(thumbnailOffset, maxOffset));

  thumbnailTrack.style.transform = `translateX(-${
    thumbnailOffset * thumbnailWidth
  }px)`;
}

/* =========================================================
   THUMBNAIL PREVIOUS
========================================================= */

document.getElementById("thumbnailPrev").addEventListener("click", function () {
  thumbnailOffset--;

  updateThumbnailPosition();
});

/* =========================================================
   THUMBNAIL NEXT
========================================================= */

document.getElementById("thumbnailNext").addEventListener("click", function () {
  thumbnailOffset++;

  updateThumbnailPosition();
});

/* =========================================================
   RELATED PRODUCT SLIDER
========================================================= */

const relatedTrack = document.getElementById("relatedTrack");

const relatedCards = document.querySelectorAll(".related-card");

let relatedIndex = 0;

/*
    Desktop đang hiển thị 3 card
*/

const RELATED_VISIBLE = 3;

/* =========================================================
   UPDATE RELATED SLIDER
========================================================= */

function updateRelatedSlider() {
  const firstCard = relatedCards[0];

  if (!firstCard) {
    return;
  }

  const cardWidth = firstCard.offsetWidth;

  const gap = 14;

  relatedTrack.style.transform = `translateX(-${
    relatedIndex * (cardWidth + gap)
  }px)`;
}

/* =========================================================
   RELATED NEXT
========================================================= */

document.getElementById("relatedNext").addEventListener("click", function () {
  const maxIndex = Math.max(0, relatedCards.length - RELATED_VISIBLE);

  relatedIndex = Math.min(relatedIndex + 1, maxIndex);

  updateRelatedSlider();
});

/* =========================================================
   RELATED PREVIOUS
========================================================= */

document.getElementById("relatedPrev").addEventListener("click", function () {
  relatedIndex = Math.max(0, relatedIndex - 1);

  updateRelatedSlider();
});

/* =========================================================
   SẢN PHẨM MUA KÈM (ADD-ON PRODUCTS) - MOCK DATA & SERVICE
========================================================= */

const BASE_PC_PRICE = 48980000;
const BASE_PC_OLD_PRICE = 49990000;

const MAIN_PRODUCT = {
  id: "main-pc-ttg-ultra-14400f",
  name: "PC TTG ULTRA GAMING i5 14400F - RTX 5070 Ti 16GB OC (Cấu hình gốc)",
  price: 48980000,
  oldPrice: 49990000,
  image: "/assets/images/pc1.jpg",
  warranty: "36 Tháng",
};

const UPGRADE_DATA = {
  ram: {
    "16gb": {
      name: "RAM 16GB DDR5",
      specListText: "RAM APACER NOX 16GB BUSS 5200MHZ DDR5 BLACK",
      specTableText: "RAM APACER NOX 16GB BUSS 5200MHZ DDR5 BLACK",
      priceDiff: 0,
    },
    "32gb": {
      name: "RAM 32GB DDR5",
      specListText: "RAM APACER NOX 32GB BUSS 5200MHZ DDR5 BLACK (2x16GB)",
      specTableText: "RAM APACER NOX 32GB BUSS 5200MHZ DDR5 BLACK (2x16GB)",
      priceDiff: 1200000,
    },
  },
  ssd: {
    "500gb": {
      name: "SSD 500GB",
      specListText: "Ổ cứng SSD HIKSEMI WAVE P512 500GB M.2 2280 PCIe 3.0x4",
      specTableText: "Ổ cứng SSD HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4",
      priceDiff: 0,
    },
    "1tb": {
      name: "SSD 1TB",
      specListText: "Ổ cứng SSD Kingston NV2 1TB M.2 2280 PCIe 4.0x4 NVMe",
      specTableText: "Ổ cứng SSD Kingston NV2 1TB M.2 2280 PCIe 4.0x4 NVMe",
      priceDiff: 950000,
    },
  },
  cooler: {
    air: {
      name: "Tản nhiệt khí",
      specListText: "Tản nhiệt khí JONSBO CR1000 EVO BLACK",
      specTableText: "Tản nhiệt khí JONSBO CR1000 EVO BLACK",
      priceDiff: 0,
    },
    aio240: {
      name: "Tản nhiệt nước AIO 240",
      specListText: "Tản nhiệt nước Thermalright Frozen Warframe 240 Black ARGB",
      specTableText: "Tản nhiệt nước Thermalright Frozen Warframe 240 Black ARGB",
      priceDiff: 1150000,
    },
  },
};

const currentConfig = {
  ram: "16gb",
  ssd: "500gb",
  cooler: "air",
};

let currentQuantity = 1;

const CATEGORY_LABELS = {
  monitor: "Màn hình máy tính",
  keyboard: "Bàn phím",
  mouse: "Chuột máy tính",
  headset: "Tai nghe gaming",
  webcam: "Webcam",
  speaker: "Loa máy tính",
};

const ADDON_PRODUCTS = {
  monitor: [
    {
      id: "addon-mon-1",
      category: "monitor",
      name: "Màn hình ASUS TUF Gaming VG249Q3A 24 inch FHD IPS 180Hz 1ms",
      price: 3290000,
      oldPrice: 3790000,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
      brand: "ASUS",
      color: "Đen",
      connection: "DisplayPort, HDMI",
      warranty: "36 Tháng",
    },
    {
      id: "addon-mon-2",
      category: "monitor",
      name: "Màn hình LG UltraGear 27GR75Q-B 27 inch 2K QHD IPS 165Hz 1ms",
      price: 6290000,
      oldPrice: 6990000,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
      brand: "LG",
      color: "Đen",
      connection: "DisplayPort, HDMI",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mon-3",
      category: "monitor",
      name: "Màn hình Samsung Odyssey G5 G50D 27 inch QHD IPS 180Hz",
      price: 6490000,
      oldPrice: 7200000,
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
      brand: "Samsung",
      color: "Đen",
      connection: "DisplayPort, HDMI",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mon-4",
      category: "monitor",
      name: "Màn hình ViewSonic OMNI VX2479-HD-PRO 24 inch FHD IPS 165Hz",
      price: 2590000,
      oldPrice: 2990000,
      image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=500",
      brand: "ViewSonic",
      color: "Đen",
      connection: "HDMI",
      warranty: "36 Tháng",
    },
    {
      id: "addon-mon-5",
      category: "monitor",
      name: "Màn hình Dell UltraSharp U2424E 24 inch FHD IPS 120Hz Type-C",
      price: 6790000,
      oldPrice: 7390000,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
      brand: "Dell",
      color: "Bạc",
      connection: "Type-C, DisplayPort, HDMI",
      warranty: "36 Tháng",
    },
    {
      id: "addon-mon-6",
      category: "monitor",
      name: "Màn hình Acer Nitro VG270 M3 27 inch FHD IPS 180Hz 0.5ms",
      price: 3590000,
      oldPrice: 3990000,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
      brand: "Acer",
      color: "Đen",
      connection: "DisplayPort, HDMI",
      warranty: "36 Tháng",
    },
  ],
  keyboard: [
    {
      id: "addon-kb-1",
      category: "keyboard",
      name: "Bàn phím cơ NIMBUS 65 DARK - TONE SWITCH",
      price: 1540000,
      oldPrice: 1890000,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      brand: "Nimbus",
      color: "Đen",
      connection: "Type-C, Wireless, Bluetooth",
      warranty: "12 Tháng",
    },
    {
      id: "addon-kb-2",
      category: "keyboard",
      name: "Bàn phím cơ TUNE 65 PINK BLACK - TONE SWITCH",
      price: 1380000,
      oldPrice: 1790000,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
      brand: "Tune",
      color: "Hồng",
      connection: "Type-C, Wireless",
      warranty: "12 Tháng",
    },
    {
      id: "addon-kb-3",
      category: "keyboard",
      name: "Bàn phím cơ Akko 3087 v2 Steam Engine Cherry Switch",
      price: 1290000,
      oldPrice: 1490000,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
      brand: "Akko",
      color: "Xám",
      connection: "Có dây USB",
      warranty: "12 Tháng",
    },
    {
      id: "addon-kb-4",
      category: "keyboard",
      name: "Bàn phím cơ Logitech G512 RGB Mechanical GX Brown",
      price: 1890000,
      oldPrice: 2290000,
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
      brand: "Logitech",
      color: "Đen",
      connection: "Có dây USB",
      warranty: "24 Tháng",
    },
    {
      id: "addon-kb-5",
      category: "keyboard",
      name: "Bàn phím cơ Corsair K70 RGB PRO Cherry MX Red",
      price: 3490000,
      oldPrice: 3890000,
      image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=500",
      brand: "Corsair",
      color: "Đen",
      connection: "Có dây USB Type-C",
      warranty: "24 Tháng",
    },
    {
      id: "addon-kb-6",
      category: "keyboard",
      name: "Bàn phím cơ Razer BlackWidow V4 X Mechanical Green Switch",
      price: 2990000,
      oldPrice: 3390000,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      brand: "Razer",
      color: "Đen",
      connection: "Có dây USB",
      warranty: "24 Tháng",
    },
  ],
  mouse: [
    {
      id: "addon-mouse-1",
      category: "mouse",
      name: "Chuột Gaming Logitech G102 Gen 2 Lightsync RGB Black",
      price: 399000,
      oldPrice: 499000,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      brand: "Logitech",
      color: "Đen",
      connection: "Có dây USB",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mouse-2",
      category: "mouse",
      name: "Chuột Gaming Logitech G502 HERO High Performance 25K DPI",
      price: 990000,
      oldPrice: 1290000,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
      brand: "Logitech",
      color: "Đen",
      connection: "Có dây USB",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mouse-3",
      category: "mouse",
      name: "Chuột không dây Razer DeathAdder V2 X HyperSpeed",
      price: 1190000,
      oldPrice: 1490000,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500",
      brand: "Razer",
      color: "Đen",
      connection: "Wireless 2.4GHz, Bluetooth",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mouse-4",
      category: "mouse",
      name: "Chuột không dây Corsair Harpoon RGB Wireless",
      price: 950000,
      oldPrice: 1150000,
      image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=500",
      brand: "Corsair",
      color: "Đen",
      connection: "Wireless 2.4GHz, Bluetooth",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mouse-5",
      category: "mouse",
      name: "Chuột Gaming ASUS TUF Gaming M3 Gen II 8000 DPI",
      price: 420000,
      oldPrice: 520000,
      image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500",
      brand: "ASUS",
      color: "Đen",
      connection: "Có dây USB",
      warranty: "24 Tháng",
    },
    {
      id: "addon-mouse-6",
      category: "mouse",
      name: "Chuột Gaming không dây Logitech G Pro X Superlight White",
      price: 2890000,
      oldPrice: 3390000,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      brand: "Logitech",
      color: "Trắng",
      connection: "Wireless Lightspeed",
      warranty: "24 Tháng",
    },
  ],
  headset: [
    {
      id: "addon-hs-1",
      category: "headset",
      name: "Tai nghe Gaming Logitech G335 Lightweight Wired White",
      price: 1190000,
      oldPrice: 1490000,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
      brand: "Logitech",
      color: "Trắng",
      connection: "Jack 3.5mm",
      warranty: "24 Tháng",
    },
    {
      id: "addon-hs-2",
      category: "headset",
      name: "Tai nghe Gaming Razer BlackShark V2 X 7.1 Surround",
      price: 1090000,
      oldPrice: 1390000,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      brand: "Razer",
      color: "Đen",
      connection: "Jack 3.5mm",
      warranty: "24 Tháng",
    },
    {
      id: "addon-hs-3",
      category: "headset",
      name: "Tai nghe Gaming Corsair HS55 SURROUND 7.1 White",
      price: 1250000,
      oldPrice: 1550000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      brand: "Corsair",
      color: "Trắng",
      connection: "Jack 3.5mm, USB Adapter",
      warranty: "24 Tháng",
    },
    {
      id: "addon-hs-4",
      category: "headset",
      name: "Tai nghe Gaming Kingston HyperX Cloud II Red",
      price: 1790000,
      oldPrice: 2090000,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      brand: "Kingston",
      color: "Đỏ",
      connection: "Jack 3.5mm, USB Soundcard",
      warranty: "24 Tháng",
    },
    {
      id: "addon-hs-5",
      category: "headset",
      name: "Tai nghe Gaming ASUS TUF Gaming H3 Gun Metal",
      price: 790000,
      oldPrice: 990000,
      image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500",
      brand: "ASUS",
      color: "Xám",
      connection: "Jack 3.5mm",
      warranty: "24 Tháng",
    },
    {
      id: "addon-hs-6",
      category: "headset",
      name: "Tai nghe không dây Sony INZONE H5 Wireless White",
      price: 3190000,
      oldPrice: 3590000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      brand: "Sony",
      color: "Trắng",
      connection: "Wireless 2.4GHz, Jack 3.5mm",
      warranty: "12 Tháng",
    },
  ],
  webcam: [
    {
      id: "addon-cam-1",
      category: "webcam",
      name: "Webcam Logitech C922 Pro Stream Full HD 1080p 60fps",
      price: 1890000,
      oldPrice: 2290000,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      brand: "Logitech",
      color: "Đen",
      connection: "USB 2.0",
      warranty: "12 Tháng",
    },
    {
      id: "addon-cam-2",
      category: "webcam",
      name: "Webcam Logitech C270 HD 720p có micro khử ồn",
      price: 450000,
      oldPrice: 590000,
      image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500",
      brand: "Logitech",
      color: "Đen",
      connection: "USB 2.0",
      warranty: "24 Tháng",
    },
    {
      id: "addon-cam-3",
      category: "webcam",
      name: "Webcam Razer Kiyo Pro Full HD 1080p 60FPS HDR",
      price: 2490000,
      oldPrice: 2990000,
      image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=500",
      brand: "Razer",
      color: "Đen",
      connection: "USB 3.0",
      warranty: "12 Tháng",
    },
    {
      id: "addon-cam-4",
      category: "webcam",
      name: "Webcam ASUS Webcam C3 Full HD 1080p 30fps Mic kép",
      price: 790000,
      oldPrice: 990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      brand: "ASUS",
      color: "Đen",
      connection: "USB 2.0",
      warranty: "12 Tháng",
    },
    {
      id: "addon-cam-5",
      category: "webcam",
      name: "Webcam Rapoo C260 FHD 1080P kèm Micro khử nhiễu",
      price: 380000,
      oldPrice: 490000,
      image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500",
      brand: "Rapoo",
      color: "Đen",
      connection: "USB 2.0",
      warranty: "12 Tháng",
    },
  ],
  speaker: [
    {
      id: "addon-spk-1",
      category: "speaker",
      name: "Loa máy tính Logitech Z120 2.0 Stereo White",
      price: 260000,
      oldPrice: 320000,
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
      brand: "Logitech",
      color: "Trắng",
      connection: "Jack 3.5mm, Nguồn USB",
      warranty: "24 Tháng",
    },
    {
      id: "addon-spk-2",
      category: "speaker",
      name: "Loa vi tính Edifier R1280DB Bluetooth Studio Monitor",
      price: 2390000,
      oldPrice: 2790000,
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500",
      brand: "Edifier",
      color: "Nâu Gỗ",
      connection: "Bluetooth, Optical, RCA",
      warranty: "12 Tháng",
    },
    {
      id: "addon-spk-3",
      category: "speaker",
      name: "Loa máy tính Microlab M-108BT 2.1 Bluetooth Subwoofer",
      price: 590000,
      oldPrice: 720000,
      image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500",
      brand: "Microlab",
      color: "Đen",
      connection: "Bluetooth, Jack 3.5mm",
      warranty: "12 Tháng",
    },
    {
      id: "addon-spk-4",
      category: "speaker",
      name: "Loa vi tính SoundMax A-980 2.1 Bluetooth Đèn LED",
      price: 890000,
      oldPrice: 1090000,
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500",
      brand: "SoundMax",
      color: "Đen",
      connection: "Bluetooth, USB, SD Card",
      warranty: "12 Tháng",
    },
    {
      id: "addon-spk-5",
      category: "speaker",
      name: "Loa Gaming Razer Nommo Chroma 2.0 Full Range Audio",
      price: 3690000,
      oldPrice: 4190000,
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
      brand: "Razer",
      color: "Đen",
      connection: "USB, Jack 3.5mm",
      warranty: "24 Tháng",
    },
  ],
};

/* =========================================================
   SERVICE LAYER (API / DATABASE READY)
========================================================= */

const AddonService = {
  /**
   * Lấy danh sách sản phẩm mua kèm theo danh mục
   * @param {string} category
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(category) {
    // KHI KẾT NỐI DATABASE / API SERVER:
    // try {
    //   const res = await fetch(`/api/addons?category=${category}`);
    //   const data = await res.json();
    //   return data.products || data;
    // } catch (err) {
    //   console.error("Lỗi khi kết nối API:", err);
    // }
    return ADDON_PRODUCTS[category] || [];
  },
};

/* =========================================================
   STATE MANAGEMENT
========================================================= */

const addonState = {
  selectedAddons: {}, // { [slotType]: productObj }
  activeCategory: null,
  currentList: [],
  searchQuery: "",
  currentSort: "newest", // newest | asc | desc
  selectedFilters: {
    price: [],
    brand: [],
    color: [],
    connection: [],
  },
  currentFilterKey: null,
};

function formatMoney(number) {
  if (typeof number !== "number" || isNaN(number)) return "0 ₫";
  return number.toLocaleString("vi-VN") + " ₫";
}

/* =========================================================
   CẬP NHẬT GIAO DIỆN CÁC Ô MUA KÈM (SLOTS)
========================================================= */

function renderRelatedSlots() {
  const cards = document.querySelectorAll(".related-card");
  cards.forEach((card) => {
    const slotType = card.dataset.slotType;
    const selectedItem = addonState.selectedAddons[slotType];

    const imgEl = card.querySelector(".related-image img");
    const nameEl = card.querySelector(".related-name");
    const priceEl = card.querySelector(".related-price");
    const chooseBtn = card.querySelector(".choose-product");
    const actionGroup = card.querySelector(".addon-action-group");

    if (selectedItem) {
      card.classList.add("has-product");
      if (imgEl) imgEl.src = selectedItem.image;
      if (nameEl) {
        nameEl.textContent = selectedItem.name;
        nameEl.title = selectedItem.name;
      }
      if (priceEl) {
        priceEl.textContent = formatMoney(selectedItem.price);
        priceEl.style.display = "block";
      }
      if (chooseBtn) chooseBtn.style.display = "none";
      if (actionGroup) actionGroup.style.display = "flex";
    } else {
      card.classList.remove("has-product");
      if (imgEl && imgEl.dataset.defaultSrc) {
        imgEl.src = imgEl.dataset.defaultSrc;
      }
      if (nameEl && nameEl.dataset.defaultName) {
        nameEl.textContent = nameEl.dataset.defaultName;
        nameEl.title = nameEl.dataset.defaultName;
      }
      if (priceEl) priceEl.style.display = "none";
      if (chooseBtn) chooseBtn.style.display = "block";
      if (actionGroup) actionGroup.style.display = "none";
    }
  });
}

/* =========================================================
   CẬP NHẬT GIÁ TẠM TÍNH COMBO & NÚT MUA COMBO
========================================================= */

function updateComboSummary() {
  let totalAddonPrice = 0;
  let totalAddonOldPrice = 0;
  const selectedKeys = Object.keys(addonState.selectedAddons);
  const count = selectedKeys.length;

  selectedKeys.forEach((key) => {
    const item = addonState.selectedAddons[key];
    if (item) {
      totalAddonPrice += item.price;
      totalAddonOldPrice += item.oldPrice || item.price;
    }
  });

  const finalPrice = MAIN_PRODUCT.price + totalAddonPrice;
  const finalOldPrice = MAIN_PRODUCT.oldPrice + totalAddonOldPrice;

  const comboTotalEl = document.getElementById("comboTotalPrice");
  const comboOriginalEl = document.getElementById("comboOriginalPrice");
  const comboCountEl = document.getElementById("comboAddonCountText");

  if (comboTotalEl) comboTotalEl.textContent = formatMoney(finalPrice);
  if (comboOriginalEl) comboOriginalEl.textContent = formatMoney(finalOldPrice);
  if (comboCountEl) {
    comboCountEl.textContent = `${count} sản phẩm mua kèm`;
    comboCountEl.style.color = count > 0 ? "#16a34a" : "#64748b";
    comboCountEl.style.fontWeight = count > 0 ? "700" : "normal";
  }
}

/* =========================================================
   POPUP CHỌN SẢN PHẨM MUA KÈM (PRODUCT PICKER MODAL)
========================================================= */

const productModal = document.getElementById("productModal");
const pickerModalTitle = document.getElementById("pickerModalTitle");
const closeModalButton = document.getElementById("closeModal");
const productSearchInput = document.getElementById("productSearch");
const modalProductsContainer = document.getElementById("modalProducts");
const sortButtons = document.querySelectorAll(".sort-option");
const filterButtons = document.querySelectorAll(".filter-btn");

/**
 * Mở modal chọn sản phẩm mua kèm cho một slot
 */
async function openAddonPicker(category) {
  if (!productModal) return;

  addonState.activeCategory = category;
  addonState.searchQuery = "";
  addonState.currentSort = "newest";
  addonState.selectedFilters = {
    price: [],
    brand: [],
    color: [],
    connection: [],
  };

  if (productSearchInput) productSearchInput.value = "";

  // Reset sort active UI
  sortButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sort === "newest");
  });

  // Reset filter count badges
  updateAllFilterBadges();

  // Đổi tiêu đề modal
  if (pickerModalTitle) {
    pickerModalTitle.textContent = CATEGORY_LABELS[category]
      ? `Chọn ${CATEGORY_LABELS[category]} mua kèm`
      : "Sản phẩm mua kèm được đề xuất";
  }

  // Hiển thị trạng thái đang tải
  if (modalProductsContainer) {
    modalProductsContainer.innerHTML = `
      <div class="modal-products-empty">
        <span>⏳</span>
        Đang tải danh sách linh kiện...
      </div>
    `;
  }

  // Mở modal
  productModal.classList.add("show");
  productModal.hidden = false;
  document.body.style.overflow = "hidden";

  // Lấy dữ liệu sản phẩm
  const products = await AddonService.getProductsByCategory(category);
  addonState.currentList = products;

  // Render danh sách sản phẩm
  renderModalProducts();
}

/**
 * Đóng modal chọn sản phẩm mua kèm
 */
function closeAddonPicker() {
  if (!productModal) return;
  productModal.classList.remove("show");
  productModal.hidden = true;
  document.body.style.overflow = "";
  addonState.activeCategory = null;
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeAddonPicker);
}

if (productModal) {
  productModal.addEventListener("click", function (event) {
    if (event.target === productModal) {
      closeAddonPicker();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && productModal && productModal.classList.contains("show")) {
    closeAddonPicker();
  }
});

/* =========================================================
   RENDER SẢN PHẨM TRONG MODAL
========================================================= */

function renderModalProducts() {
  if (!modalProductsContainer) return;

  let list = [...addonState.currentList];

  // 1. Tìm kiếm theo từ khóa
  if (addonState.searchQuery.trim() !== "") {
    const q = addonState.searchQuery.toLowerCase().trim();
    list = list.filter((item) => item.name.toLowerCase().includes(q));
  }

  // 2. Lọc theo Mức giá
  if (addonState.selectedFilters.price.length > 0) {
    list = list.filter((item) => {
      return addonState.selectedFilters.price.some((range) => {
        if (range === "Dưới 1.000.000đ") return item.price < 1000000;
        if (range === "1.000.000đ - 3.000.000đ") return item.price >= 1000000 && item.price <= 3000000;
        if (range === "3.000.000đ - 7.000.000đ") return item.price >= 3000000 && item.price <= 7000000;
        if (range === "Trên 7.000.000đ") return item.price > 7000000;
        return true;
      });
    });
  }

  // 3. Lọc theo Thương hiệu
  if (addonState.selectedFilters.brand.length > 0) {
    list = list.filter((item) => addonState.selectedFilters.brand.includes(item.brand));
  }

  // 4. Lọc theo Màu sắc
  if (addonState.selectedFilters.color.length > 0) {
    list = list.filter((item) => addonState.selectedFilters.color.includes(item.color));
  }

  // 5. Lọc theo Chuẩn kết nối
  if (addonState.selectedFilters.connection.length > 0) {
    list = list.filter((item) => {
      return addonState.selectedFilters.connection.some(
        (c) => item.connection && item.connection.includes(c)
      );
    });
  }

  // 6. Sắp xếp giá
  if (addonState.currentSort === "asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (addonState.currentSort === "desc") {
    list.sort((a, b) => b.price - a.price);
  }

  // Kiểm tra rỗng
  if (list.length === 0) {
    modalProductsContainer.innerHTML = `
      <div class="modal-products-empty">
        <span>🔍</span>
        <div>Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</div>
        <button type="button" class="combo-toast-btn primary" onclick="resetAllModalFilters()" style="margin-top: 10px;">
          Xóa tất cả bộ lọc
        </button>
      </div>
    `;
    return;
  }

  // Render danh sách thẻ sản phẩm
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

          <div class="modal-old-price">${formatMoney(item.oldPrice)}</div>
          <div class="modal-current-price">${formatMoney(item.price)}</div>

          <div class="discount">${
            discountAmount > 0
              ? `Tiết kiệm: ${formatMoney(discountAmount)}`
              : `Bảo hành: ${item.warranty || "24 Tháng"}`
          }</div>

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

  // Gắn sự kiện cho nút "CHỌN"
  modalProductsContainer.querySelectorAll(".modal-select-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const pId = this.dataset.productId;
      selectAddonProduct(pId);
    });
  });
}

function selectAddonProduct(productId) {
  const product = addonState.currentList.find((p) => p.id === productId);
  if (!product || !addonState.activeCategory) return;

  addonState.selectedAddons[addonState.activeCategory] = product;
  closeAddonPicker();
  renderRelatedSlots();
  updateComboSummary();

  showToast(
    "Đã chọn sản phẩm mua kèm",
    `Đã thêm "${product.name}" vào danh sách combo mua kèm thành công!`
  );
}

window.resetAllModalFilters = function () {
  addonState.selectedFilters = { price: [], brand: [], color: [], connection: [] };
  addonState.searchQuery = "";
  if (productSearchInput) productSearchInput.value = "";
  updateAllFilterBadges();
  renderModalProducts();
};

/* =========================================================
   SEARCH & SORT TRONG MODAL
========================================================= */

if (productSearchInput) {
  productSearchInput.addEventListener("input", function () {
    addonState.searchQuery = this.value;
    renderModalProducts();
  });
}

sortButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    sortButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    addonState.currentSort = this.dataset.sort;
    renderModalProducts();
  });
});

/* =========================================================
   SUB-MODAL BỘ LỌC CHI TIẾT (FILTER OVERLAY)
========================================================= */

const filterOverlay = document.getElementById("filterOverlay");
const filterClose = document.getElementById("filterClose");
const filterPopupTitle = document.getElementById("filterPopupTitle");
const filterOptionsContainer = document.getElementById("filterOptions");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearFilterBtn = document.getElementById("clearFilter");
const applyFilterBtn = document.getElementById("applyFilter");

const FILTER_CONFIG = {
  price: {
    title: "Mức giá",
    getOptions: () => [
      "Dưới 1.000.000đ",
      "1.000.000đ - 3.000.000đ",
      "3.000.000đ - 7.000.000đ",
      "Trên 7.000.000đ",
    ],
  },
  brand: {
    title: "Thương hiệu",
    getOptions: (list) => {
      const brands = [...new Set(list.map((p) => p.brand).filter(Boolean))];
      return brands.sort();
    },
  },
  color: {
    title: "Màu sắc",
    getOptions: (list) => {
      const colors = [...new Set(list.map((p) => p.color).filter(Boolean))];
      return colors.sort();
    },
  },
  connection: {
    title: "Chuẩn kết nối",
    getOptions: (list) => {
      const set = new Set();
      list.forEach((p) => {
        if (p.connection) {
          p.connection.split(",").forEach((c) => set.add(c.trim()));
        }
      });
      return [...set].sort();
    },
  },
};

// Gắn click cho các nút filter trên thanh modal
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filterKey = this.dataset.filter;
    if (filterKey === "all") {
      resetAllModalFilters();
      return;
    }
    openFilterPopup(filterKey);
  });
});

function openFilterPopup(filterKey) {
  const conf = FILTER_CONFIG[filterKey];
  if (!conf || !filterOverlay) return;

  addonState.currentFilterKey = filterKey;

  if (filterPopupTitle) {
    filterPopupTitle.textContent = `Lọc theo: ${conf.title}`;
  }

  // Tạo danh sách checkbox options
  if (filterOptionsContainer) {
    filterOptionsContainer.innerHTML = "";
    const options = conf.getOptions(addonState.currentList);

    if (options.length === 0) {
      filterOptionsContainer.innerHTML = `<div style="padding: 15px; color: #888;">Không có tiêu chí lọc phù hợp cho danh mục này.</div>`;
    } else {
      const currentSelected = addonState.selectedFilters[filterKey] || [];
      options.forEach((opt, idx) => {
        const row = document.createElement("div");
        row.className = "filter-option";

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.id = `chk_${filterKey}_${idx}`;
        chk.value = opt;
        chk.checked = currentSelected.includes(opt);

        const lbl = document.createElement("label");
        lbl.htmlFor = chk.id;
        lbl.textContent = opt;

        row.appendChild(chk);
        row.appendChild(lbl);
        filterOptionsContainer.appendChild(row);
      });
    }
  }

  filterOverlay.classList.add("show");
  filterOverlay.hidden = false;
}

function closeFilterPopup() {
  if (!filterOverlay) return;
  filterOverlay.classList.remove("show");
  filterOverlay.hidden = true;
  addonState.currentFilterKey = null;
}

if (filterClose) {
  filterClose.addEventListener("click", closeFilterPopup);
}

if (filterOverlay) {
  filterOverlay.addEventListener("click", function (e) {
    if (e.target === filterOverlay) closeFilterPopup();
  });
}

// Nút "Chọn tất cả"
if (selectAllBtn) {
  selectAllBtn.addEventListener("click", function () {
    if (!filterOptionsContainer) return;
    const checkboxes = filterOptionsContainer.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every((c) => c.checked);
    checkboxes.forEach((c) => (c.checked = !allChecked));
  });
}

// Nút "Xóa bộ lọc"
if (clearFilterBtn) {
  clearFilterBtn.addEventListener("click", function () {
    const key = addonState.currentFilterKey;
    if (key) {
      addonState.selectedFilters[key] = [];
      updateFilterButtonBadge(key);
      renderModalProducts();
    }
    closeFilterPopup();
  });
}

// Nút "Áp dụng"
if (applyFilterBtn) {
  applyFilterBtn.addEventListener("click", function () {
    const key = addonState.currentFilterKey;
    if (key && filterOptionsContainer) {
      const checkedBoxes = filterOptionsContainer.querySelectorAll("input[type='checkbox']:checked");
      const values = Array.from(checkedBoxes).map((c) => c.value);
      addonState.selectedFilters[key] = values;
      updateFilterButtonBadge(key);
      renderModalProducts();
    }
    closeFilterPopup();
  });
}

function updateFilterButtonBadge(filterKey) {
  const btn = document.querySelector(`.filter-btn[data-filter="${filterKey}"]`);
  if (!btn) return;
  const countEl = btn.querySelector(".filter-count");
  if (!countEl) return;
  const count = (addonState.selectedFilters[filterKey] || []).length;
  if (count > 0) {
    countEl.textContent = count;
    countEl.classList.add("show");
    btn.classList.add("active");
  } else {
    countEl.textContent = "";
    countEl.classList.remove("show");
    btn.classList.remove("active");
  }
}

function updateAllFilterBadges() {
  Object.keys(FILTER_CONFIG).forEach((key) => {
    updateFilterButtonBadge(key);
  });
}

/* =========================================================
   GẮN SỰ KIỆN CHO CÁC NÚT TRÊN CÁC CARD MUA KÈM
========================================================= */

document.addEventListener("click", function (e) {
  // 1. Nhấn nút "Chọn sản phẩm"
  const chooseBtn = e.target.closest(".choose-product");
  if (chooseBtn) {
    e.preventDefault();
    const productType = chooseBtn.dataset.productType;
    openAddonPicker(productType);
    return;
  }

  // 2. Nhấn nút "Đổi sản phẩm"
  const changeBtn = e.target.closest(".addon-btn-change");
  if (changeBtn) {
    e.preventDefault();
    const productType = changeBtn.dataset.productType;
    openAddonPicker(productType);
    return;
  }

  // 3. Nhấn nút "Xoá sản phẩm mua kèm"
  const removeBtn = e.target.closest(".addon-btn-remove");
  if (removeBtn) {
    e.preventDefault();
    const productType = removeBtn.dataset.productType;
    const removedItem = addonState.selectedAddons[productType];
    delete addonState.selectedAddons[productType];
    renderRelatedSlots();
    updateComboSummary();

    showToast(
      "Đã xoá sản phẩm mua kèm",
      `Đã bỏ chọn ${removedItem ? removedItem.name : "linh kiện mua kèm"}.`
    );
    return;
  }
});

/* =========================================================
   CẬP NHẬT CẤU HÌNH NÂNG CẤP (RAM, SSD, TẢN NHIỆT) & GIÁ
========================================================= */

function updatePCConfiguration() {
  const ramInfo = UPGRADE_DATA.ram[currentConfig.ram];
  const ssdInfo = UPGRADE_DATA.ssd[currentConfig.ssd];
  const coolerInfo = UPGRADE_DATA.cooler[currentConfig.cooler];

  const totalUpgradeDiff =
    (ramInfo ? ramInfo.priceDiff : 0) +
    (ssdInfo ? ssdInfo.priceDiff : 0) +
    (coolerInfo ? coolerInfo.priceDiff : 0);

  const updatedPrice = BASE_PC_PRICE + totalUpgradeDiff;
  const updatedOldPrice = BASE_PC_OLD_PRICE + totalUpgradeDiff;
  const savingAmount = updatedOldPrice - updatedPrice;

  // Cập nhật đối tượng MAIN_PRODUCT để combo và giỏ hàng dùng chung
  MAIN_PRODUCT.price = updatedPrice;
  MAIN_PRODUCT.oldPrice = updatedOldPrice;

  const upgrades = [];
  if (currentConfig.ram === "32gb") upgrades.push("RAM 32GB");
  if (currentConfig.ssd === "1tb") upgrades.push("SSD 1TB");
  if (currentConfig.cooler === "aio240") upgrades.push("Tản AIO 240");

  MAIN_PRODUCT.name =
    upgrades.length > 0
      ? `PC TTG ULTRA GAMING i5 14400F - RTX 5070 Ti 16GB OC (${upgrades.join(" + ")})`
      : `PC TTG ULTRA GAMING i5 14400F - RTX 5070 Ti 16GB OC (Cấu hình gốc)`;

  // Cập nhật giá hiển thị trên giao diện
  const currentPriceEl = document.querySelector(".current-price");
  const oldPriceEl = document.querySelector(".old-price");
  const savingEl = document.querySelector(".saving");

  if (currentPriceEl) currentPriceEl.textContent = formatMoney(updatedPrice);
  if (oldPriceEl) oldPriceEl.textContent = formatMoney(updatedOldPrice);
  if (savingEl) savingEl.textContent = `Tiết kiệm: ${formatMoney(savingAmount)}`;

  // Cập nhật mô tả cấu hình sản phẩm
  const specListRam = document.getElementById("specListRam");
  const specListSsd = document.getElementById("specListSsd");
  const specListCooler = document.getElementById("specListCooler");

  if (specListRam && ramInfo) specListRam.textContent = ramInfo.specListText;
  if (specListSsd && ssdInfo) specListSsd.textContent = ssdInfo.specListText;
  if (specListCooler && coolerInfo) specListCooler.textContent = coolerInfo.specListText;

  // Cập nhật bảng thông số kỹ thuật chi tiết
  const specTableRam = document.getElementById("specTableRam");
  const specTableSsd = document.getElementById("specTableSsd");
  const specTableCooler = document.getElementById("specTableCooler");

  if (specTableRam && ramInfo) specTableRam.textContent = ramInfo.specTableText;
  if (specTableSsd && ssdInfo) specTableSsd.textContent = ssdInfo.specTableText;
  if (specTableCooler && coolerInfo) specTableCooler.textContent = coolerInfo.specTableText;

  // Tự động tính lại tổng tiền combo mua kèm
  if (typeof updateComboSummary === "function") {
    updateComboSummary();
  }
}

/* =========================================================
   SỰ KIỆN CLICK CHỌN CẤU HÌNH RAM, SSD, TẢN NHIỆT (TÍCH CHỌN)
========================================================= */

function initUpgradeOptionEvents() {
  const optionButtons = document.querySelectorAll(".option-box .option");

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const group = this.dataset.optionGroup;
      const value = this.dataset.optionValue;

      if (!group || !value) return;

      // Xóa class selected khỏi các nút cùng nhóm
      const siblings = document.querySelectorAll(
        `.option-box .option[data-option-group="${group}"]`
      );
      siblings.forEach((s) => s.classList.remove("selected"));

      // Tích chọn nút được bấm
      this.classList.add("selected");

      // Cập nhật trạng thái cấu hình
      currentConfig[group] = value;

      // Đồng bộ giá và thông số
      updatePCConfiguration();
    });
  });
}

/* =========================================================
   SỰ KIỆN NÚT SỐ LƯỢNG (+ / -)
========================================================= */

function initQuantityEvents() {
  const qtyMinusBtn = document.getElementById("quantityMinus");
  const qtyPlusBtn = document.getElementById("quantityPlus");
  const qtyValueEl = document.getElementById("quantityValue");

  if (qtyMinusBtn && qtyPlusBtn && qtyValueEl) {
    qtyMinusBtn.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyValueEl.textContent = currentQuantity;
      }
    });

    qtyPlusBtn.addEventListener("click", () => {
      currentQuantity++;
      qtyValueEl.textContent = currentQuantity;
    });
  }
}

/* =========================================================
   THÊM PC CHÍNH VÀO GIỎ HÀNG (ĐẶT HÀNG & THÊM VÀO GIỎ)
========================================================= */

function addMainProductToCart(redirectToCart = false) {
  try {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");

    const itemId = `${MAIN_PRODUCT.id}-${currentConfig.ram}-${currentConfig.ssd}-${currentConfig.cooler}`;
    const itemName = MAIN_PRODUCT.name;

    const existing = currentCart.find((it) => it.id === itemId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + currentQuantity;
    } else {
      currentCart.push({
        id: itemId,
        name: itemName,
        price: MAIN_PRODUCT.price,
        image: MAIN_PRODUCT.image,
        quantity: currentQuantity,
        warranty: MAIN_PRODUCT.warranty,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));

    if (redirectToCart) {
      window.location.href = "/cart";
    } else {
      showToast(
        "Thêm vào giỏ hàng thành công!",
        `Đã thêm ${currentQuantity}x ${itemName} vào giỏ hàng.`,
        "/cart",
        "Xem giỏ hàng ngay"
      );
    }
  } catch (err) {
    console.warn("Lỗi khi thêm vào giỏ hàng:", err);
  }
}

function initOrderAndCartEvents() {
  const orderBtn = document.querySelector(".order-btn");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => addMainProductToCart(true));
  }

  const actionBtn = document.querySelector(".action-btn");
  if (actionBtn) {
    actionBtn.addEventListener("click", () => addMainProductToCart(false));
  }
}

/* =========================================================
   NÚT MUA COMBO (THÊM CẢ PC CHÍNH VÀ CÁC SẢN PHẨM MUA KÈM VÀO GIỎ)
========================================================= */

const buyComboBtn = document.getElementById("buyComboBtn");
if (buyComboBtn) {
  buyComboBtn.addEventListener("click", function () {
    const selectedKeys = Object.keys(addonState.selectedAddons);
    const addonList = selectedKeys.map((k) => addonState.selectedAddons[k]);

    const pcItemId = `${MAIN_PRODUCT.id}-${currentConfig.ram}-${currentConfig.ssd}-${currentConfig.cooler}`;

    // Đóng gói danh sách combo items
    const comboCartItems = [
      {
        id: pcItemId,
        name: MAIN_PRODUCT.name,
        price: MAIN_PRODUCT.price,
        image: MAIN_PRODUCT.image,
        quantity: currentQuantity || 1,
        isMain: true,
      },
      ...addonList.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        category: item.category,
        isAddon: true,
      })),
    ];

    // Lưu vào localStorage
    try {
      let currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      comboCartItems.forEach((newItem) => {
        const existing = currentCart.find((ci) => ci.id === newItem.id);
        if (existing) {
          existing.quantity = (existing.quantity || 1) + (newItem.quantity || 1);
        } else {
          currentCart.push(newItem);
        }
      });
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
    } catch (err) {
      console.warn("Không thể lưu giỏ hàng vào localStorage:", err);
    }

    const totalCount = comboCartItems.length;
    const addonCount = addonList.length;

    showToast(
      "Thêm Combo vào giỏ hàng thành công!",
      `Đã thêm ${currentQuantity || 1}x Máy tính TTG Gaming ${addonCount > 0 ? `và ${addonCount} sản phẩm mua kèm` : ""} vào giỏ hàng.`,
      "/cart",
      "Xem giỏ hàng ngay"
    );
  });
}

/* =========================================================
   TOAST NOTIFICATION HELPER
========================================================= */

function showToast(title, message, actionUrl, actionText) {
  let container = document.querySelector(".combo-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "combo-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "combo-toast";
  toast.innerHTML = `
    <div class="combo-toast-icon"><i class="fa-solid fa-circle-check"></i></div>
    <div class="combo-toast-content">
      <div class="combo-toast-title">${title}</div>
      <div class="combo-toast-desc">${message}</div>
      ${
        actionUrl && actionText
          ? `<div class="combo-toast-actions">
              <button class="combo-toast-btn primary" onclick="window.location.href='${actionUrl}'">${actionText}</button>
              <button class="combo-toast-btn secondary" onclick="this.closest('.combo-toast').remove()">Ở lại xem tiếp</button>
            </div>`
          : ""
      }
    </div>
    <button class="combo-toast-close" onclick="this.closest('.combo-toast').remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 250);
    }
  }, 4500);
}

// Khởi chạy đồng bộ trạng thái ban đầu
initUpgradeOptionEvents();
initQuantityEvents();
initOrderAndCartEvents();
updatePCConfiguration();
renderRelatedSlots();
updateComboSummary();


setMainImage(0);

updateThumbnailPosition();

updateRelatedSlider();

/* =========================================================
   XEM THÊM THÔNG SỐ KỸ THUẬT
========================================================= */
const showMoreSpecBtn = document.getElementById("showMoreSpec");
if (showMoreSpecBtn) {
  showMoreSpecBtn.addEventListener("click", function () {
    const hiddenRows = document.querySelectorAll(".hidden-spec-row");
    const isShowing = this.classList.toggle("active");
    hiddenRows.forEach((row) => {
      row.style.display = isShowing ? "table-row" : "none";
    });
    const textSpan = this.querySelector("span:first-child");
    if (textSpan) {
      textSpan.textContent = isShowing ? "Thu gọn" : "Xem thêm";
    }
  });
}

/* =========================================================
   CATEGORY SLIDER BUTTONS
========================================================= */
const catPrevBtn = document.querySelector(".category-prev");
const catNextBtn = document.querySelector(".category-next");
const catProductsList = document.querySelector(".category-products");
if (catPrevBtn && catNextBtn && catProductsList) {
  catPrevBtn.addEventListener("click", () => {
    catProductsList.scrollBy({ left: -catProductsList.clientWidth * 0.75, behavior: "smooth" });
  });
  catNextBtn.addEventListener("click", () => {
    catProductsList.scrollBy({ left: catProductsList.clientWidth * 0.75, behavior: "smooth" });
  });
}

/* =========================================================
   KHỞI TẠO DỮ LIỆU SẢN PHẨM & KIỂM TRA ID TRÊN URL
========================================================= */
async function loadProductDetailFromAPI() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // Nghiệp vụ: Màn chi tiết sản phẩm bắt buộc phải có ID sản phẩm
  if (!productId) {
    console.warn("Không tìm thấy ID sản phẩm trên URL!");
    alert("Vui lòng chọn một sản phẩm để xem chi tiết!");
    window.location.href = "/products";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products/detail/${productId}`);
    if (!res.ok) {
      throw new Error("Không thể tải thông tin sản phẩm từ máy chủ");
    }
    const apiData = await res.json();
    if (!apiData.success || !apiData.data) {
      alert(apiData.message || "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh!");
      window.location.href = "/products";
      return;
    }

    const p = apiData.data;
    MAIN_PRODUCT.id = p.id;
    MAIN_PRODUCT.name = p.name;
    MAIN_PRODUCT.price = Number(p.salePrice) || Number(p.price) || MAIN_PRODUCT.price;
    MAIN_PRODUCT.oldPrice = Number(p.price) || MAIN_PRODUCT.oldPrice;

    // Cập nhật thông tin trên DOM
    const titleEl = document.querySelector(".product-title");
    if (titleEl) titleEl.textContent = p.name;

    const currentPriceEl = document.querySelector(".current-price");
    if (currentPriceEl) currentPriceEl.textContent = formatMoney(MAIN_PRODUCT.price);

    const oldPriceEl = document.querySelector(".old-price");
    if (oldPriceEl) oldPriceEl.textContent = formatMoney(MAIN_PRODUCT.oldPrice);

    const savingEl = document.querySelector(".saving");
    if (savingEl) {
      const saving = MAIN_PRODUCT.oldPrice - MAIN_PRODUCT.price;
      savingEl.textContent = saving > 0 ? `Tiết kiệm: ${formatMoney(saving)}` : "";
    }
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
  }
}

loadProductDetailFromAPI();

