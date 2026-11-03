const processorFamilies = {
  intel: [
    { id: 'i3', name: 'Core i3', note: 'Günlük kullanım', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i3-14100', 'i3-14100F', 'i3-13100', 'i3-13100F', 'i3-12100', 'i3-12100F'] },
    { id: 'i5', name: 'Core i5', note: 'Oyun ve çok yönlü kullanım', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i5-14600K', 'i5-14600KF', 'i5-14500', 'i5-14400', 'i5-14400F', 'i5-13600K', 'i5-13600KF', 'i5-13400F', 'i5-12600K', 'i5-12400F'] },
    { id: 'i7', name: 'Core i7', note: 'Yüksek performans', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i7-14700K', 'i7-14700KF', 'i7-14700F', 'i7-13700K', 'i7-13700KF', 'i7-12700K', 'i7-12700F'] },
    { id: 'i9', name: 'Core i9', note: 'Üst seviye performans', generation: '12.–14. nesil · LGA1700', socket: 'LGA1700', models: ['i9-14900K', 'i9-14900KF', 'i9-14900F', 'i9-13900K', 'i9-13900KF', 'i9-12900K', 'i9-12900KF'] },
    { id: 'ultra5', name: 'Core Ultra 5', note: 'Yeni nesil masaüstü', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['250K Plus', '250KF Plus', '245K', '245KF', '225', '225F'] },
    { id: 'ultra7', name: 'Core Ultra 7', note: 'Yeni nesil yüksek performans', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['270K Plus', '265K', '265KF'] },
    { id: 'ultra9', name: 'Core Ultra 9', note: 'Yeni nesil üst seviye', generation: 'Series 2 · LGA1851', socket: 'LGA1851', models: ['285K', '285'] }
  ],
  amd: [
    { id: 'ryzen5', name: 'Ryzen 5', note: 'Oyun ve çok yönlü kullanım', generation: 'Ryzen 9000 / 8000G · AM5', socket: 'AM5', models: ['9600X', '9600', '9500F', '8600G', '8500G'] },
    { id: 'ryzen7', name: 'Ryzen 7', note: 'Yüksek performans', generation: 'Ryzen 9000 / 8000G · AM5', socket: 'AM5', models: ['9850X3D', '9800X3D', '9700X', '9700F', '8700G'] },
    { id: 'ryzen9', name: 'Ryzen 9', note: 'Üst seviye performans', generation: 'Ryzen 9000 · AM5', socket: 'AM5', models: ['9950X3D2 Dual Edition', '9950X3D', '9950X', '9900X3D', '9900X'] },
    { id: 'ryzen5-7000', name: 'Ryzen 5 · 7000 Serisi', note: 'Oyun ve çok yönlü kullanım', generation: 'Ryzen 7000 · AM5', socket: 'AM5', models: ['7600X', '7600'] },
    { id: 'ryzen7-7000', name: 'Ryzen 7 · 7000 Serisi', note: 'Yüksek performans ve oyun', generation: 'Ryzen 7000 · AM5', socket: 'AM5', models: ['7800X3D', '7700X', '7700'] },
    { id: 'ryzen9-7000', name: 'Ryzen 9 · 7000 Serisi', note: 'Üst seviye üretkenlik', generation: 'Ryzen 7000 · AM5', socket: 'AM5', models: ['7950X3D', '7950X', '7900X', '7900'] }
  ]
};

const motherboardsBySocket = {
  LGA1700: [
    { id: 'asus-tuf-b760-plus-wifi', name: 'ASUS TUF GAMING B760-PLUS WIFI', chipset: 'Intel B760', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b760-plus-wifi/techspec/' },
    { id: 'asus-prime-b760m-a-d4', name: 'ASUS PRIME B760M-A D4', chipset: 'Intel B760', memory: 'DDR4', form: 'Micro-ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/prime/prime-b760m-a-d4/techspec/' },
    { id: 'msi-mag-b760-tomahawk-wifi', name: 'MSI MAG B760 TOMAHAWK WIFI', chipset: 'Intel B760', memory: 'DDR5', form: 'ATX', url: 'https://us.msi.com/Motherboard/MAG-B760-TOMAHAWK-WIFI/Specification' },
    { id: 'gigabyte-b760-gaming-x-ax', name: 'GIGABYTE B760 GAMING X AX', chipset: 'Intel B760', memory: 'DDR5', form: 'ATX' },
    { id: 'gigabyte-b760m-ds3h-ddr4', name: 'GIGABYTE B760M DS3H DDR4', chipset: 'Intel B760', memory: 'DDR4', form: 'Micro-ATX' },
    { id: 'msi-pro-b760m-a-wifi-ddr4', name: 'MSI PRO B760M-A WIFI DDR4', chipset: 'Intel B760', memory: 'DDR4', form: 'Micro-ATX' },
    { id: 'asus-prime-z790-p-wifi', name: 'ASUS PRIME Z790-P WIFI', chipset: 'Intel Z790', memory: 'DDR5', form: 'ATX' },
    { id: 'gigabyte-z790-aorus-elite-ax', name: 'GIGABYTE Z790 AORUS ELITE AX', chipset: 'Intel Z790', memory: 'DDR5', form: 'ATX' },
    { id: 'msi-pro-z790-a-max-wifi', name: 'MSI PRO Z790-A MAX WIFI', chipset: 'Intel Z790', memory: 'DDR5', form: 'ATX' }
  ],
  LGA1851: [
    { id: 'asus-tuf-z890-plus-wifi', name: 'ASUS TUF GAMING Z890-PLUS WIFI', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-z890-plus-wifi/techspec/' },
    { id: 'asus-prime-b860m-a-wifi', name: 'ASUS PRIME B860M-A WIFI', chipset: 'Intel B860', memory: 'DDR5', form: 'Micro-ATX', url: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b860m-a-wifi/' },
    { id: 'msi-pro-z890-s-wifi-pz', name: 'MSI PRO Z890-S WIFI PZ', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX', url: 'https://storage-asset.msi.com/datasheet/mb/in/PRO-Z890-S-WIFI-PZ.pdf' },
    { id: 'gigabyte-z890-aorus-elite-wifi7', name: 'GIGABYTE Z890 AORUS ELITE WIFI7', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX' },
    { id: 'msi-mag-z890-tomahawk-wifi', name: 'MSI MAG Z890 TOMAHAWK WIFI', chipset: 'Intel Z890', memory: 'DDR5', form: 'ATX' }
  ],
  AM5: [
    { id: 'asus-tuf-b650-plus-wifi', name: 'ASUS TUF GAMING B650-PLUS WIFI', chipset: 'AMD B650', memory: 'DDR5', form: 'ATX', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/techspec/' },
    { id: 'asus-prime-b650m-a-wifi-ii', name: 'ASUS PRIME B650M-A WIFI II', chipset: 'AMD B650', memory: 'DDR5', form: 'Micro-ATX', url: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b650m-a-wifi-ii/' },
    { id: 'gigabyte-b650-aorus-elite-ax', name: 'GIGABYTE B650 AORUS ELITE AX', chipset: 'AMD B650', memory: 'DDR5', form: 'ATX', url: 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX-rev-12/sp' },
    { id: 'msi-b650-gaming-plus-wifi', name: 'MSI B650 GAMING PLUS WIFI', chipset: 'AMD B650', memory: 'DDR5', form: 'ATX', url: 'https://us.msi.com/Motherboard/B650-GAMING-PLUS-WIFI/Specification' },
    { id: 'msi-mag-x870-tomahawk-wifi', name: 'MSI MAG X870 TOMAHAWK WIFI', chipset: 'AMD X870', memory: 'DDR5', form: 'ATX' },
    { id: 'gigabyte-x870-aorus-elite-wifi7', name: 'GIGABYTE X870 AORUS ELITE WIFI7', chipset: 'AMD X870', memory: 'DDR5', form: 'ATX' },
    { id: 'asus-tuf-b850-plus-wifi', name: 'ASUS TUF GAMING B850-PLUS WIFI', chipset: 'AMD B850', memory: 'DDR5', form: 'ATX' }
  ]
};

const ramKitsByType = {
  DDR4: [
    { id: 'kingston-fury-beast-ddr4-16', name: 'Kingston FURY Beast 16GB (2×8GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 16, code: 'KF432C16BBK2/16', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F16' },
    { id: 'kingston-fury-beast-ddr4-32', name: 'Kingston FURY Beast 32GB (2×16GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 32, code: 'KF432C16BBK2/32', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F32' },
    { id: 'kingston-fury-beast-ddr4-64', name: 'Kingston FURY Beast 64GB (2×32GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 64, code: 'KF432C16BBK2/64', url: 'https://www.kingston.com/en/memory/search?partid=KF432C16BBK2%2F64' },
    { id: 'corsair-vengeance-lpx-ddr4-16', name: 'CORSAIR VENGEANCE LPX 16GB (2×8GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 16, code: 'CMK16GX4M2E3200C16', brand: 'CORSAIR' },
    { id: 'corsair-vengeance-lpx-ddr4-32', name: 'CORSAIR VENGEANCE LPX 32GB (2×16GB)', spec: 'DDR4-3200 · CL16 · Kit of 2', capacity: 32, code: 'CMK32GX4M2E3200C16', brand: 'CORSAIR' }
  ],
  DDR5: [
    { id: 'kingston-fury-beast-ddr5-32', name: 'Kingston FURY Beast 32GB (2×16GB)', spec: 'DDR5-6000 · CL30 · AMD EXPO', capacity: 32, code: 'KF560C30BBEK2-32', url: 'https://www.kingston.com/en/memory/search?partid=KF560C30BBEK2-32' },
    { id: 'corsair-vengeance-ddr5-32', name: 'CORSAIR VENGEANCE 32GB (2×16GB)', spec: 'DDR5-6000 · CL36', capacity: 32, code: 'CMK32GX5M2E6000C36', url: 'https://www.corsair.com/us/en/p/memory/cmk32gx5m2e6000c36/vengeance-32gb-2x16gb-ddr5-dram-6000mt-s-c36-memory-kit-black-cmk32gx5m2e6000c36' },
    { id: 'kingston-fury-beast-ddr5-64', name: 'Kingston FURY Beast 64GB (2×32GB)', spec: 'DDR5-6000 · CL30 · AMD EXPO', capacity: 64, code: 'KF560C30BBEK2-64', url: 'https://www.kingston.com/en/memory/search?partid=KF560C30BBEK2-64' },
    { id: 'kingston-fury-beast-rgb-ddr5-32', name: 'Kingston FURY Beast RGB 32GB (2×16GB)', spec: 'DDR5-6000 · CL30 · AMD EXPO', capacity: 32, code: 'KF560C30BBEAK2-32', brand: 'Kingston' },
    { id: 'corsair-vengeance-ddr5-64', name: 'CORSAIR VENGEANCE 64GB (2×32GB)', spec: 'DDR5-6000 · CL30 · Kit of 2', capacity: 64, code: 'CMK64GX5M2B6000C30', brand: 'CORSAIR' },
    { id: 'samsung-ddr5-5600-16', name: 'Samsung DDR5 16GB (1×16GB) UDIMM', spec: 'DDR5-5600 · CL46 · UDIMM · tek modül', capacity: 16, code: 'M323R2GA3DB0-CWM', brand: 'Samsung', url: 'https://semiconductor.samsung.com/dram/module/udimm/m323r2ga3db0-cwm/' }
  ]
};

const graphicsCards = {
  NVIDIA: [
    { id: 'geforce-rtx-5090', name: 'NVIDIA GeForce RTX 5090', series: 'GeForce RTX 50 · Blackwell', psuMin: 1000 },
    { id: 'geforce-rtx-5080', name: 'NVIDIA GeForce RTX 5080', series: 'GeForce RTX 50 · Blackwell', psuMin: 850 },
    { id: 'geforce-rtx-5070-ti', name: 'NVIDIA GeForce RTX 5070 Ti', series: 'GeForce RTX 50 · Blackwell', psuMin: 750 },
    { id: 'geforce-rtx-5070', name: 'NVIDIA GeForce RTX 5070', series: 'GeForce RTX 50 · Blackwell', psuMin: 650 },
    { id: 'geforce-rtx-5060-ti', name: 'NVIDIA GeForce RTX 5060 Ti', series: 'GeForce RTX 50 · Blackwell', psuMin: 600 },
    { id: 'geforce-rtx-5060', name: 'NVIDIA GeForce RTX 5060', series: 'GeForce RTX 50 · Blackwell', psuMin: 550 },
    { id: 'geforce-rtx-5050', name: 'NVIDIA GeForce RTX 5050', series: 'GeForce RTX 50 · Blackwell', psuMin: 550 },
    { id: 'gigabyte-rtx-5070-gaming-oc', name: 'GIGABYTE GeForce RTX 5070 GAMING OC 12G', series: 'RTX 5070 · GDDR7 · 12 GB', psuMin: 750, brand: 'GIGABYTE' },
    { id: 'asus-tuf-rtx-5070-oc', name: 'ASUS TUF Gaming GeForce RTX 5070 OC 12GB', series: 'RTX 5070 · GDDR7 · 12 GB', psuMin: 750, brand: 'ASUS' },
    { id: 'msi-rtx-5070-ventus-3x-oc', name: 'MSI GeForce RTX 5070 12G VENTUS 3X OC', series: 'RTX 5070 · GDDR7 · 12 GB', psuMin: 650, brand: 'MSI' },
    { id: 'gigabyte-rtx-5070-ti-gaming-oc', name: 'GIGABYTE GeForce RTX 5070 Ti GAMING OC 16G', series: 'RTX 5070 Ti · GDDR7 · 16 GB', psuMin: 750, brand: 'GIGABYTE' },
    { id: 'asus-prime-rtx-5070-ti-oc', name: 'ASUS Prime GeForce RTX 5070 Ti OC 16GB', series: 'RTX 5070 Ti · GDDR7 · 16 GB', psuMin: 750, brand: 'ASUS' },
    { id: 'msi-rtx-5060-ti-ventus-2x-oc', name: 'MSI GeForce RTX 5060 Ti 16G VENTUS 2X OC PLUS', series: 'RTX 5060 Ti · GDDR7 · 16 GB', psuMin: 600, brand: 'MSI' }
  ],
  AMD: [
    { id: 'radeon-rx-9070-xt', name: 'AMD Radeon RX 9070 XT', series: 'Radeon RX 9000 · RDNA 4', psuMin: 750 },
    { id: 'radeon-rx-9070', name: 'AMD Radeon RX 9070', series: 'Radeon RX 9000 · RDNA 4', psuMin: 650 },
    { id: 'radeon-rx-9070-gre', name: 'AMD Radeon RX 9070 GRE', series: 'Radeon RX 9000 · RDNA 4', psuMin: 750 },
    { id: 'radeon-rx-9060-xt', name: 'AMD Radeon RX 9060 XT', series: 'Radeon RX 9000 · RDNA 4', psuMin: 650 },
    { id: 'radeon-rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', series: 'Radeon RX 7000 · RDNA 3', psuMin: 800 },
    { id: 'radeon-rx-7900-xt', name: 'AMD Radeon RX 7900 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 750 },
    { id: 'radeon-rx-7800-xt', name: 'AMD Radeon RX 7800 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 700 },
    { id: 'radeon-rx-7700-xt', name: 'AMD Radeon RX 7700 XT', series: 'Radeon RX 7000 · RDNA 3', psuMin: 700 },
    { id: 'gigabyte-rx-9070-xt-gaming-oc', name: 'GIGABYTE Radeon RX 9070 XT GAMING OC 16G', series: 'RX 9070 XT · GDDR6 · 16 GB', psuMin: 850, brand: 'GIGABYTE' },
    { id: 'asus-tuf-rx-9070-xt-oc', name: 'ASUS TUF Gaming Radeon RX 9070 XT OC 16GB', series: 'RX 9070 XT · GDDR6 · 16 GB', psuMin: 850, brand: 'ASUS' },
    { id: 'asus-prime-rx-9070-xt-oc', name: 'ASUS Prime Radeon RX 9070 XT OC 16GB', series: 'RX 9070 XT · GDDR6 · 16 GB', psuMin: 850, brand: 'ASUS' }
  ]
};

const storageProducts = {
  nvme: [
    { id: 'samsung-990-evo-plus-1tb', name: 'Samsung 990 EVO Plus 1TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4 / 5.0 x2', capacity: '1 TB', code: 'MZ-V9S1T0BW', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/990-evo-plus/' },
    { id: 'samsung-990-evo-plus-2tb', name: 'Samsung 990 EVO Plus 2TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4 / 5.0 x2', capacity: '2 TB', code: 'MZ-V9S2T0BW', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/990-evo-plus/' },
    { id: 'kingston-nv3-1tb', name: 'Kingston NV3 1TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '1 TB', code: 'SNV3S/1000G', url: 'https://www.kingston.com/en/ssd/nv3-nvme-pcie-ssd' },
    { id: 'kingston-nv3-2tb', name: 'Kingston NV3 2TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '2 TB', code: 'SNV3S/2000G', url: 'https://www.kingston.com/en/ssd/nv3-nvme-pcie-ssd' },
    { id: 'crucial-p3-plus-1tb', name: 'Crucial P3 Plus 1TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '1 TB', code: 'CT1000P3PSSD8' },
    { id: 'crucial-p3-plus-2tb', name: 'Crucial P3 Plus 2TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '2 TB', code: 'CT2000P3PSSD8' },
    { id: 'wd-black-sn850x-1tb', name: 'WD_BLACK SN850X 1TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '1 TB', code: 'WDS100T2X0E' },
    { id: 'wd-black-sn850x-2tb', name: 'WD_BLACK SN850X 2TB', spec: 'NVMe M.2 2280 · PCIe 4.0 x4', capacity: '2 TB', code: 'WDS200T2X0E' }
  ],
  sata: [
    { id: 'crucial-mx500-1tb', name: 'Crucial MX500 1TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '1 TB', code: 'CT1000MX500SSD1', url: 'https://www.crucial.com/ssd/mx500/ct1000mx500ssd1' },
    { id: 'samsung-870-evo-1tb', name: 'Samsung 870 EVO 1TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '1 TB', code: 'MZ-77E1T0', url: 'https://semiconductor.samsung.com/consumer-storage/internal-ssd/870-evo/' },
    { id: 'samsung-870-evo-2tb', name: 'Samsung 870 EVO 2TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '2 TB', code: 'MZ-77E2T0' },
    { id: 'crucial-mx500-2tb', name: 'Crucial MX500 2TB', spec: '2.5 inç · SATA 6Gb/s · SSD', capacity: '2 TB', code: 'CT2000MX500SSD1' }
  ],
  hdd: [
    { id: 'wd-blue-1tb', name: 'WD Blue 1TB Desktop HDD', spec: '3.5 inç · SATA · 7200 RPM · 64 MB önbellek', capacity: '1 TB', code: 'WD10EZEX', url: 'https://www.wd.com/content/store/en-in/products/internal-drives/wd-blue-desktop-sata-hdd.html' },
    { id: 'wd-blue-2tb', name: 'WD Blue 2TB Desktop HDD', spec: '3.5 inç · SATA · 7200 RPM · 256 MB önbellek', capacity: '2 TB', code: 'WD20EZBX', url: 'https://www.wd.com/content/store/en-in/products/internal-drives/wd-blue-desktop-sata-hdd.html' },
    { id: 'seagate-barracuda-4tb', name: 'Seagate BarraCuda 4TB', spec: '3.5 inç · SATA 6Gb/s · 5400 RPM · 256 MB önbellek', capacity: '4 TB', code: 'ST4000DM004', url: 'https://www.seagate.com/as/en/support/internal-hard-drives/desktop-hard-drives/barracuda-3-5/' }
  ]
};

const pcCases = [
  { id: 'nzxt-h5-flow', name: 'NZXT H5 Flow', supports: ['ATX', 'Micro-ATX'], gpu: 410, cooler: 170, psu: 200, radiators: [120, 140, 240, 280, 360], note: 'Mid-tower · hava akışlı ön panel', url: 'https://nzxt.com/products/h5-flow' },
  { id: 'corsair-4000d-airflow', name: 'CORSAIR 4000D Airflow', supports: ['ATX', 'Micro-ATX'], gpu: 360, cooler: 170, psu: 220, radiators: [120, 140, 240, 280, 360], note: 'Mid-tower · mesh ön panel', url: 'https://www.corsair.com/us/en/p/pc-cases/cc-9011200-ww/4000d-airflow-tempered-glass-mid-tower-atx-case-black-cc-9011200-ww' },
  { id: 'asus-prime-ap201', name: 'ASUS Prime AP201', supports: ['Micro-ATX'], gpu: 338, cooler: 170, psu: 180, radiators: [120, 140, 240, 280], note: 'Kompakt kasa · Micro-ATX / Mini-ITX', url: 'https://www.asus.com/us/motherboards-components/cases/prime/asus-prime-ap201-microatx-case/techspec/' },
  { id: 'cooler-master-q300l', name: 'Cooler Master MasterBox Q300L', supports: ['Micro-ATX'], gpu: 360, cooler: 159, psu: 160, radiators: [120, 240], note: 'Mini tower · Micro-ATX / Mini-ITX', url: 'https://www.coolermaster.com/en-us/products/masterbox-q300l.html' },
  { id: 'corsair-3000d-airflow', name: 'CORSAIR 3000D AIRFLOW', supports: ['ATX', 'Micro-ATX'], gpu: 360, cooler: 170, psu: 220, radiators: [120, 240, 280, 360], note: 'Mid-tower · hava akışı odaklı ön panel', url: 'https://www.corsair.com/ww/en/p/pc-cases/CC-9011251-WW/3000d-tempered-glass-mid-tower-black-cc-9011251-ww' },
  { id: 'corsair-5000d-airflow', name: 'CORSAIR 5000D AIRFLOW', supports: ['ATX', 'Micro-ATX'], gpu: 400, cooler: 170, psu: 250, radiators: [120, 240, 280, 360], note: 'Mid-tower · geniş iç hacim ve hava akışı', url: 'https://www.corsair.com/us/en/c/pc-cases/mid-tower' },
  { id: 'nzxt-h6-flow', name: 'NZXT H6 Flow', supports: ['ATX', 'Micro-ATX', 'Mini-ITX'], gpu: 365, cooler: 163, psu: 200, radiators: [120, 240, 280, 360], note: 'Çift bölmeli mid-tower · panoramik cam', url: 'https://nzxt.com/products/h6-flow' },
  { id: 'fractal-pop-air', name: 'Fractal Design Pop Air', supports: ['ATX', 'Micro-ATX', 'Mini-ITX'], gpu: 405, cooler: 170, psu: 170, radiators: [120, 240, 280], note: 'Mid-tower · mesh ön panel', url: 'https://www.fractal-design.com/products/cases/pop/pop-air/' },
  { id: 'lian-li-lancool-216', name: 'Lian Li LANCOOL 216', supports: ['ATX', 'Micro-ATX', 'Mini-ITX'], gpu: 392, cooler: 180, psu: 220, radiators: [120, 240, 280, 360], note: 'Mid-tower · yüksek hava akışlı ön panel', url: 'https://lian-li.com/product/lancool-216/' }
];

const cpuCoolers = [
  { id: 'bequiet-pure-rock-3-black', name: 'be quiet! PURE ROCK 3 Black', type: 'Hava soğutma', height: 154, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '154 mm · 190 W TDP · 120 mm fan', url: 'https://www.bequiet.com/en/cpucooler/5591' },
  { id: 'arctic-liquid-freezer-iii-pro-240', name: 'ARCTIC Liquid Freezer III Pro 240', type: 'Sıvı soğutma', radiator: 240, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '240 mm radyatör · 38 mm radyatör kalınlığı', url: 'https://www.arctic.de/en/Liquid-Freezer-III-Pro-240/ACFRE00178A' },
  { id: 'nzxt-kraken-plus-240', name: 'NZXT Kraken Plus 240', type: 'Sıvı soğutma', radiator: 240, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '240 mm radyatör · LCD ekran', url: 'https://nzxt.com/products/kraken-plus-240' },
  { id: 'arctic-liquid-freezer-iii-360', name: 'ARCTIC Liquid Freezer III 360', type: 'Sıvı soğutma', radiator: 360, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '360 mm radyatör · PWM fanlar', url: 'https://www.arctic.de/en/Liquid-Freezer-III-360' },
  { id: 'arctic-freezer-36', name: 'ARCTIC Freezer 36', type: 'Hava soğutma', height: 159, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '159 mm · çift kule fan düzeni', url: 'https://www.arctic.de/en/Freezer-36/ACFRE00121A' },
  { id: 'cooler-master-hyper-212-halo', name: 'Cooler Master Hyper 212 Halo Black', type: 'Hava soğutma', height: 154, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '154 mm · 120 mm Halo fan', url: 'https://www.coolermaster.com/en-global/products/hyper-212-halo-black/' },
  { id: 'deepcool-ak620', name: 'DeepCool AK620', type: 'Hava soğutma', height: 160, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '160 mm · çift kule · çift 120 mm fan', url: 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620High-PerformanceDualTowerCPU-Cooler/2021/13067.shtml' },
  { id: 'nzxt-kraken-plus-360', name: 'NZXT Kraken Plus 360', type: 'Sıvı soğutma', radiator: 360, sockets: ['LGA1700', 'LGA1851', 'AM5'], spec: '360 mm radyatör · LCD ekran', url: 'https://nzxt.com/products/kraken-plus-360' }
];

const powerSupplies = [
  { id: 'corsair-rm650e', name: 'CORSAIR RM650e (2025)', watts: 650, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020302-na/rme-series-rm650e-fully-modular-low-noise-atx-power-supply-cp-9020302-na' },
  { id: 'seasonic-focus-gx-750', name: 'Seasonic FOCUS GX-750', watts: 750, length: 140, spec: '80 PLUS Gold · tam modüler', url: 'https://seasonic.com/focus-gx/' },
  { id: 'corsair-rm750e', name: 'CORSAIR RM750e (2025)', watts: 750, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/explorer/diy-builder/power-supply-units/corsair-rme-series-2025/' },
  { id: 'msi-mag-a850gl', name: 'MSI MAG A850GL PCIE5', watts: 850, length: 140, spec: '80 PLUS Gold · PCIe 5.0 · tam modüler', url: 'https://www.msi.com/Power-Supply/MAG-A850GL-PCIE5/Specification' },
  { id: 'corsair-rm850e', name: 'CORSAIR RM850e (2025)', watts: 850, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020336-na/rm850e-atx-3-1-low-noise-atx-power-supply-with-thermalprotect-12v-2x6-cable-cp-9020336-na' },
  { id: 'corsair-rm1000e', name: 'CORSAIR RM1000e (2025)', watts: 1000, length: 140, spec: '80 PLUS Gold · ATX 3.1 · 12V-2x6', url: 'https://www.corsair.com/us/en/p/psu/cp-9020337-na/rm1000e-atx-3-1-low-noise-atx-power-supply-with-thermalprotect-12v-2x6-cable-cp-9020337-na' },
  { id: 'seasonic-focus-gx-850', name: 'Seasonic FOCUS GX-850', watts: 850, length: 140, spec: '80 PLUS Gold · tam modüler · ATX', url: 'https://seasonic.com/focus-gx-atx-3/' },
  { id: 'seasonic-focus-gx-1000', name: 'Seasonic FOCUS GX-1000', watts: 1000, length: 140, spec: '80 PLUS Gold · tam modüler · ATX', url: 'https://seasonic.com/focus-gx-atx-3/' },
  { id: 'msi-mag-a750gl-pcie5', name: 'MSI MAG A750GL PCIE5', watts: 750, length: 140, spec: '80 PLUS Gold · tam modüler · PCIe 5.0', url: 'https://www.msi.com/Power-Supply/MAG-A750GL-PCIE5' },
  { id: 'corsair-rm750x', name: 'CORSAIR RM750x', watts: 750, length: 160, spec: '80 PLUS Gold · tam modüler · ATX', url: 'https://www.corsair.com/us/en/c/psu' },
  { id: 'bequiet-pure-power-12-m-850w', name: 'be quiet! Pure Power 12 M 850W', watts: 850, length: 160, spec: '80 PLUS Gold · tam modüler · ATX 3.1', url: 'https://www.bequiet.com/en/powersupply/4073' }
];

const storageKey = 'tezcan-system-builder-cpu-v1';
const brandStep = document.getElementById('brandStep');
const familyStep = document.getElementById('familyStep');
const modelStep = document.getElementById('modelStep');
const motherboardStep = document.getElementById('motherboardStep');
const ramStep = document.getElementById('ramStep');
const gpuStep = document.getElementById('gpuStep');
const storageStep = document.getElementById('storageStep');
const caseStep = document.getElementById('caseStep');
const coolerStep = document.getElementById('coolerStep');
const psuStep = document.getElementById('psuStep');
const systemSummaryStep = document.getElementById('systemSummaryStep');
const familyChoices = document.getElementById('familyChoices');
const modelChoices = document.getElementById('modelChoices');
const motherboardChoices = document.getElementById('motherboardChoices');
const ramChoices = document.getElementById('ramChoices');
const gpuChoices = document.getElementById('gpuChoices');
const storageChoices = document.getElementById('storageChoices');
const caseChoices = document.getElementById('caseChoices');
const coolerChoices = document.getElementById('coolerChoices');
const coolerSearch = document.getElementById('coolerSearch');
const psuChoices = document.getElementById('psuChoices');
const modelSearch = document.getElementById('modelSearch');
const motherboardSearch = document.getElementById('motherboardSearch');
const ramSearch = document.getElementById('ramSearch');
const gpuSearch = document.getElementById('gpuSearch');
const storageSearch = document.getElementById('storageSearch');
const caseSearch = document.getElementById('caseSearch');
const psuSearch = document.getElementById('psuSearch');
const message = document.getElementById('builderMessage');
const systemIds = ['system-1', 'system-2', 'system-3'];
const requestedSystemId = `system-${new URLSearchParams(location.search).get('system')}`;
const systemTabs = document.getElementById('systemTabs');
function emptySelection() {
  return { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32, gpuBrand: '', gpu: '', storageType: '', storage: '', pcCase: '', cooler: '', psu: '' };
}
function normalizeSelection(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...emptySelection(), ...value } : emptySelection();
}
let activeSystemId = 'system-1';
let savedSystems = { 'system-1': null, 'system-2': null, 'system-3': null };
let selection = emptySelection();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if ((saved?.version === 2 || saved?.version === 3) && saved.systems && typeof saved.systems === 'object') {
    activeSystemId = systemIds.includes(saved.activeSystemId) ? saved.activeSystemId : 'system-1';
    savedSystems = Object.fromEntries(systemIds.map(id => [id, saved.systems[id] ? normalizeSelection(saved.systems[id]) : null]));
    selection = normalizeSelection(savedSystems[activeSystemId]);
  } else if (saved && typeof saved === 'object' && Object.keys(saved).length) {
    selection = normalizeSelection(saved);
    savedSystems['system-1'] = { ...selection };
  }
} catch { /* Continue with an empty build if local storage is unavailable. */ }

let currentStorageKey = storageKey;
let syncUserId = '';
let syncClient = null;
let syncReady = false;
let syncLoading = false;
let syncTimer = 0;
let slotUpdatedAt = { 'system-1': 0, 'system-2': 0, 'system-3': 0 };
let cloudSyncStatus = document.getElementById('cloudSyncStatus');
function readLocalState(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if ((saved?.version === 2 || saved?.version === 3) && saved.systems && typeof saved.systems === 'object') {
      return { activeSystemId: systemIds.includes(saved.activeSystemId) ? saved.activeSystemId : 'system-1', systems: Object.fromEntries(systemIds.map(id => [id, saved.systems[id] ? normalizeSelection(saved.systems[id]) : null])), timestamps: saved.timestamps || {} };
    }
  } catch { /* Ignore invalid local data. */ }
  return key === storageKey
    ? { activeSystemId, systems: { ...savedSystems }, timestamps: {} }
    : { activeSystemId: 'system-1', systems: { 'system-1': null, 'system-2': null, 'system-3': null }, timestamps: {} };
}
function setCloudStatus(text, kind = '') {
  if (!cloudSyncStatus) return;
  cloudSyncStatus.textContent = text;
  cloudSyncStatus.dataset.kind = kind;
}
function persistLocal() {
  try { localStorage.setItem(currentStorageKey, JSON.stringify({ version: 3, activeSystemId, systems: savedSystems, timestamps: slotUpdatedAt })); } catch { /* Keep current session usable. */ }
}
async function flushCloud() {
  if (!syncReady || !syncClient || !syncUserId) return;
  setCloudStatus('Hesabına otomatik kaydediliyor…');
  try {
    for (const id of systemIds) {
      const slot = Number(id.slice(-1));
      const payload = savedSystems[id];
      if (!payload) {
        const { error } = await syncClient.from('customer_system_builds').delete().eq('slot', slot);
        if (error) throw error;
        continue;
      }
      const { error } = await syncClient.from('customer_system_builds').upsert({ user_id: syncUserId, slot, payload, updated_at: new Date(slotUpdatedAt[id] || Date.now()).toISOString() }, { onConflict: 'user_id,slot' });
      if (error) throw error;
    }
    setCloudStatus('Taslakların hesabına otomatik kaydedildi.', 'success');
  } catch (error) {
    console.warn('Sistem taslakları buluta eşitlenemedi:', error);
    setCloudStatus('Şimdilik bu tarayıcıya kaydediliyor. Bulut eşitlemesi için veritabanı güncellemesi gerekli.', 'error');
  }
}
function queueCloudSave() {
  if (!syncReady) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(flushCloud, 700);
}
async function activateAccountSync(session) {
  const userId = session?.user?.id || '';
  if (!userId) {
    const loginLink = document.getElementById('builderLoginLink'); if (loginLink) loginLink.hidden = false;
    syncReady = false; syncLoading = false; syncUserId = ''; syncClient = null; currentStorageKey = storageKey;
    const guestState = readLocalState(storageKey);
    savedSystems = guestState.systems; slotUpdatedAt = { 'system-1': 0, 'system-2': 0, 'system-3': 0 };
    activeSystemId = systemIds.includes(requestedSystemId) ? requestedSystemId : guestState.activeSystemId; selection = normalizeSelection(savedSystems[activeSystemId]);
    persistLocal(); updateStage(); setCloudStatus('Giriş yaptığında taslakların bu hesaba otomatik kaydedilir.', 'info');
    return;
  }
  const loginLink = document.getElementById('builderLoginLink'); if (loginLink) loginLink.hidden = true;
  if (syncUserId === userId && (syncReady || syncLoading)) return;
  syncReady = false; syncLoading = true; syncUserId = userId; syncClient = window.supabase.createClient((window.SUPABASE_CONFIG || {}).url, (window.SUPABASE_CONFIG || {}).publishableKey);
  currentStorageKey = `${storageKey}-user-${userId}`;
  const userState = readLocalState(currentStorageKey);
  const guestState = readLocalState(storageKey);
  activeSystemId = systemIds.includes(requestedSystemId) ? requestedSystemId : userState.activeSystemId;
  savedSystems = userState.systems;
  slotUpdatedAt = Object.fromEntries(systemIds.map(id => [id, Number(userState.timestamps[id] || 0)]));
  selection = normalizeSelection(savedSystems[activeSystemId]);
  persistLocal();
  setCloudStatus('Hesap taslakları yükleniyor…');
  try {
    const { data, error } = await syncClient.from('customer_system_builds').select('slot,payload,updated_at').order('slot');
    if (error) throw error;
    for (const row of data || []) {
      const id = `system-${row.slot}`;
      if (!systemIds.includes(id)) continue;
      const remoteTime = Date.parse(row.updated_at) || 0;
      const localTime = slotUpdatedAt[id] || 0;
      if (!savedSystems[id] || remoteTime >= localTime) {
        savedSystems[id] = normalizeSelection(row.payload);
        slotUpdatedAt[id] = remoteTime;
      }
    }
    const guestImportOwner = localStorage.getItem('tezcan-system-builder-guest-owner');
    const canImportGuestDrafts = !guestImportOwner || guestImportOwner === userId;
    let importedGuestDraft = false;
    for (const id of systemIds) {
      if (canImportGuestDrafts && !savedSystems[id] && guestState.systems[id]) {
        savedSystems[id] = normalizeSelection(guestState.systems[id]);
        slotUpdatedAt[id] = Date.now();
        importedGuestDraft = true;
      }
    }
    if (importedGuestDraft) localStorage.setItem('tezcan-system-builder-guest-owner', userId);
    if (!savedSystems[activeSystemId]) activeSystemId = systemIds.find(id => savedSystems[id]) || 'system-1';
    selection = normalizeSelection(savedSystems[activeSystemId]);
    syncReady = true; syncLoading = false; persistLocal(); renderSystemTabs(); updateStage();
    queueCloudSave();
  } catch (error) {
    console.warn('Sistem taslakları buluttan alınamadı:', error);
    syncReady = false; syncLoading = false;
    setCloudStatus('Bulut eşitlemesi henüz hazır değil; taslakların bu tarayıcıda korunuyor.', 'error');
  }
}
const accountConfig = window.SUPABASE_CONFIG || {};
if (window.supabase?.createClient && accountConfig.url && accountConfig.publishableKey) {
  syncClient = window.supabase.createClient(accountConfig.url, accountConfig.publishableKey);
  syncClient.auth.getSession().then(({ data }) => activateAccountSync(data?.session)).catch(() => setCloudStatus('Bu tarayıcıya kaydediliyor. Hesap bağlantısı kurulamadı.', 'info'));
  syncClient.auth.onAuthStateChange((_event, session) => { setTimeout(() => activateAccountSync(session), 0); });
} else setCloudStatus('Bu tarayıcıya kaydediliyor.', 'info');

function getFamily() {
  return (processorFamilies[selection.brand] || []).find(family => family.id === selection.family) || null;
}
function getMotherboard() {
  const family = getFamily();
  const boards = family ? motherboardsBySocket[family.socket] || [] : [];
  const board = boards.find(item => item.id === selection.motherboard) || null;
  if (selection.motherboard && !board) selection.motherboard = '';
  return board ? { ...board, socket: family.socket } : null;
}
function getRamKit() {
  const board = getMotherboard();
  const kits = board ? ramKitsByType[board.memory] || [] : [];
  const kit = kits.find(item => item.id === selection.ram) || null;
  if (selection.ram && !kit) selection.ram = '';
  return kit;
}
function getCase() {
  const board = getMotherboard();
  const compatibleCases = board ? pcCases.filter(item => item.supports.includes(board.form)) : [];
  const selectedCase = compatibleCases.find(item => item.id === selection.pcCase) || null;
  if (selection.pcCase && !selectedCase) selection.pcCase = '';
  return selectedCase;
}
function getGraphicsCard() {
  return (graphicsCards[selection.gpuBrand] || []).find(item => item.id === selection.gpu) || null;
}
function getCpuCooler() {
  const family = getFamily();
  const selectedCase = getCase();
  const cooler = cpuCoolers.find(item => item.id === selection.cooler && family && item.sockets.includes(family.socket) && selectedCase && (item.radiator ? selectedCase.radiators.includes(item.radiator) : item.height <= selectedCase.cooler)) || null;
  if (selection.cooler && !cooler) selection.cooler = '';
  return cooler;
}
function getPowerSupply() {
  const selectedCase = getCase();
  const gpu = getGraphicsCard();
  const validChoices = selectedCase && gpu ? powerSupplies.filter(item => item.watts >= gpu.psuMin && item.length <= selectedCase.psu) : [];
  const psu = validChoices.find(item => item.id === selection.psu) || null;
  if (selection.psu && !psu) selection.psu = '';
  return psu;
}
function modelLabel(family, model) {
  return selection.brand === 'intel'
    ? family.id.startsWith('ultra') ? `Intel ${family.name} ${model}` : `Intel Core ${model}`
    : `AMD ${family.name} ${model}`;
}
function saveSelection() {
  const previous = savedSystems[activeSystemId];
  const hasAnyPart = ['brand', 'family', 'model', 'motherboard', 'ram', 'gpuBrand', 'gpu', 'storageType', 'storage', 'pcCase', 'cooler', 'psu'].some(key => Boolean(selection[key]));
  const next = hasAnyPart ? { ...selection } : null;
  const changed = JSON.stringify(previous || null) !== JSON.stringify(next);
  savedSystems[activeSystemId] = next;
  if (changed) slotUpdatedAt[activeSystemId] = Date.now();
  persistLocal();
  renderSystemTabs();
  if (changed) queueCloudSave();
}
function renderSystemTabs() {
  if (!systemTabs) return;
  systemTabs.replaceChildren(...systemIds.map((id, index) => {
    const system = id === activeSystemId ? selection : savedSystems[id];
    const filled = Boolean(system && (system.brand || system.family || system.model || system.motherboard || system.ram || system.gpu || system.storage || system.pcCase || system.cooler || system.psu));
    const complete = Boolean(system?.psu);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'system-tab';
    button.dataset.systemId = id;
    button.setAttribute('aria-pressed', String(id === activeSystemId));
    const number = document.createElement('span'); number.className = 'system-tab-number'; number.textContent = String(index + 1);
    const copy = document.createElement('span'); copy.className = 'system-tab-copy';
    const name = document.createElement('strong'); name.textContent = `${index + 1}. Sistem`;
    const status = document.createElement('small'); status.textContent = complete ? 'Tamamlandı' : filled ? 'Taslak kaydedildi' : 'Boş · yeni taslak';
    copy.append(name, status); button.append(number, copy);
    return button;
  }));
}
function switchSystem(id) {
  if (!systemIds.includes(id) || id === activeSystemId) return;
  saveSelection();
  activeSystemId = id;
  const url = new URL(location.href); url.searchParams.set('system', String(systemIds.indexOf(id) + 1)); history.replaceState(null, '', url);
  selection = normalizeSelection(savedSystems[id]);
  message.textContent = '';
  updateStage();
}
function showStage(stage) {
  document.getElementById('selectionCard').classList.toggle('is-summary', stage === 'summary');
  document.getElementById('buildLayout').classList.toggle('is-summary', stage === 'summary');
  brandStep.hidden = stage !== 'brand';
  familyStep.hidden = stage !== 'family';
  modelStep.hidden = stage !== 'model';
  motherboardStep.hidden = stage !== 'motherboard';
  ramStep.hidden = stage !== 'ram';
  gpuStep.hidden = stage !== 'gpu';
  storageStep.hidden = stage !== 'storage';
  caseStep.hidden = stage !== 'case';
  coolerStep.hidden = stage !== 'cooler';
  psuStep.hidden = stage !== 'psu';
  systemSummaryStep.hidden = stage !== 'summary';
  document.getElementById('selectionTitle').textContent = stage === 'brand' ? 'İşlemci markanı seç' : stage === 'family' ? 'İşlemci ailesini seç' : stage === 'model' ? 'İşlemci modelini seç' : stage === 'motherboard' ? 'Anakartını seç' : stage === 'ram' ? 'Belleğini seç' : stage === 'gpu' ? 'Ekran kartını seç' : stage === 'storage' ? 'Depolama seç' : stage === 'case' ? 'Kasana karar ver' : stage === 'cooler' ? 'İşlemci soğutucunu seç' : stage === 'psu' ? 'Güç kaynağını seç' : 'Sistem özetin';
  document.getElementById('selectionDescription').textContent = stage === 'brand'
    ? 'AMD ve Intel işlemcileri arasından tercih yap.'
    : stage === 'family'
      ? 'Seçtiğin markanın işlemci ailesini belirle.'
      : stage === 'model'
        ? 'Resmi model adını seç; fiyat ve stok bilgisi kataloğa eklendiğinde bağlanacak.'
        : stage === 'motherboard' ? 'Seçtiğin işlemcinin soketine uyan anakart modelleri gösteriliyor.' : stage === 'ram' ? 'Seçtiğin anakartın desteklediği bellek türü ve gerçek kit modelleri listeleniyor.' : stage === 'gpu' ? 'NVIDIA GeForce ve AMD Radeon modelleri arasından seç.' : stage === 'storage' ? 'NVMe SSD, SATA SSD veya HDD türünü ve modelini seç.' : stage === 'case' ? 'Anakart boyutuna uyan kasa seçeneklerini karşılaştır.' : stage === 'cooler' ? 'İşlemci soketin ve kasanın ölçülerine uyan soğutucuları karşılaştır.' : stage === 'psu' ? 'Ekran kartının güç gereksinimini ve kasanın PSU boşluğunu karşılayan ürünleri seç.' : 'Bileşenlerini, ön uyumluluk sonuçlarını ve kontrol edilmesi gereken noktaları incele.';
  document.getElementById('selectionEyebrow').textContent = stage === 'brand' ? 'ADIM 1 · İŞLEMCİ MARKASI' : stage === 'family' ? 'ADIM 1 · İŞLEMCİ AİLESİ' : stage === 'model' ? 'ADIM 1 · İŞLEMCİ MODELİ' : stage === 'motherboard' ? 'ADIM 2 · ANAKART' : stage === 'ram' ? 'ADIM 3 · BELLEK (RAM)' : stage === 'gpu' ? 'ADIM 4 · EKRAN KARTI' : stage === 'storage' ? 'ADIM 5 · DEPOLAMA' : stage === 'case' ? 'ADIM 6 · KASA' : stage === 'cooler' ? 'ADIM 7 · İŞLEMCİ SOĞUTUCU' : stage === 'psu' ? 'ADIM 8 · GÜÇ KAYNAĞI' : 'TAMAMLANDI · SİSTEM ÖZETİ';
  const cpuButton = document.getElementById('cpuStepButton');
  const boardButton = document.getElementById('motherboardStepButton');
  const ramButton = document.getElementById('ramStepButton');
  const gpuButton = document.getElementById('gpuStepButton');
  const storageButton = document.getElementById('storageStepButton');
  const caseButton = document.getElementById('caseStepButton');
  const coolerButton = document.getElementById('coolerStepButton');
  const psuButton = document.getElementById('psuStepButton');
  const cpuCurrent = ['brand', 'family', 'model'].includes(stage);
  const boardCurrent = stage === 'motherboard';
  const ramCurrent = stage === 'ram';
  const gpuCurrent = stage === 'gpu';
  const storageCurrent = stage === 'storage';
  const caseCurrent = stage === 'case';
  const coolerCurrent = stage === 'cooler';
  const psuCurrent = stage === 'psu';
  cpuButton.classList.toggle('is-current', cpuCurrent);
  boardButton.classList.toggle('is-current', boardCurrent);
  ramButton.classList.toggle('is-current', ramCurrent);
  gpuButton.classList.toggle('is-current', gpuCurrent);
  storageButton.classList.toggle('is-current', storageCurrent);
  caseButton.classList.toggle('is-current', caseCurrent);
  coolerButton.classList.toggle('is-current', coolerCurrent);
  psuButton.classList.toggle('is-current', psuCurrent);
  if (cpuCurrent) cpuButton.setAttribute('aria-current', 'step'); else cpuButton.removeAttribute('aria-current');
  if (boardCurrent) boardButton.setAttribute('aria-current', 'step'); else boardButton.removeAttribute('aria-current');
  if (ramCurrent) ramButton.setAttribute('aria-current', 'step'); else ramButton.removeAttribute('aria-current');
  if (gpuCurrent) gpuButton.setAttribute('aria-current', 'step'); else gpuButton.removeAttribute('aria-current');
  if (storageCurrent) storageButton.setAttribute('aria-current', 'step'); else storageButton.removeAttribute('aria-current');
  if (caseCurrent) caseButton.setAttribute('aria-current', 'step'); else caseButton.removeAttribute('aria-current');
  if (coolerCurrent) coolerButton.setAttribute('aria-current', 'step'); else coolerButton.removeAttribute('aria-current');
  if (psuCurrent) psuButton.setAttribute('aria-current', 'step'); else psuButton.removeAttribute('aria-current');
}
function updateSummary() {
  const family = getFamily();
  const hasModel = Boolean(family && family.models.includes(selection.model));
  if (!hasModel) selection.model = '';
  let board = getMotherboard();
  if (board && (!hasModel || board.socket && board.socket !== family.socket)) { selection.motherboard = ''; board = null; }
  const ram = getRamKit();
  const gpu = getGraphicsCard();
  if (selection.gpu && !gpu) selection.gpu = '';
  const storage = (storageProducts[selection.storageType] || []).find(item => item.id === selection.storage) || null;
  if (selection.storage && !storage) selection.storage = '';
  const selectedCase = getCase();
  const psu = getPowerSupply();
  document.getElementById('summaryCpu').textContent = hasModel ? modelLabel(family, selection.model) : 'Henüz seçilmedi';
  document.getElementById('summaryCpuDetail').textContent = hasModel ? family.generation : selection.brand ? `${selection.brand === 'intel' ? 'Intel' : 'AMD'} · model bekleniyor` : 'AMD veya Intel seç';
  document.getElementById('cpuStepStatus').textContent = hasModel ? modelLabel(family, selection.model) : 'Seçim bekliyor';
  document.getElementById('cpuStepCheck').textContent = hasModel ? '✓' : '○';
  document.querySelector('.build-step').classList.toggle('is-complete', hasModel);
  document.getElementById('editCpu').hidden = !hasModel;
  document.getElementById('summaryMotherboard').textContent = board ? board.name : 'Sonraki adım';
  document.getElementById('summaryMotherboardDetail').textContent = board ? `${board.socket} · ${board.memory}` : hasModel ? `${family.socket} · uyumlu modeller` : 'İşlemcini seç';
  document.getElementById('editMotherboard').hidden = !board;
  const cpuStepButton = document.getElementById('cpuStepButton');
  const boardStepButton = document.getElementById('motherboardStepButton');
  cpuStepButton.classList.toggle('is-complete', hasModel);
  boardStepButton.disabled = !hasModel;
  boardStepButton.classList.toggle('is-complete', Boolean(board));
  boardStepButton.classList.toggle('is-next', !hasModel);
  document.getElementById('motherboardStepStatus').textContent = board ? board.name : hasModel ? 'Uyumlu kart seç' : 'İşlemciden sonra';
  document.getElementById('motherboardStepCheck').textContent = board ? '✓' : hasModel ? '○' : '—';
  const ramStepButton = document.getElementById('ramStepButton');
  ramStepButton.disabled = !board;
  ramStepButton.classList.toggle('is-complete', Boolean(ram));
  ramStepButton.classList.toggle('is-next', !board);
  document.getElementById('ramStepStatus').textContent = ram ? `${ram.capacity} GB · ${board.memory}` : board ? `${board.memory} seç` : 'Anakarttan sonra';
  document.getElementById('ramStepCheck').textContent = ram ? '✓' : board ? '○' : '—';
  document.getElementById('summaryRam').textContent = ram ? `${ram.capacity} GB · ${ram.name.split(' ').slice(0, 3).join(' ')}` : 'Sonraki adım';
  document.getElementById('summaryRamDetail').textContent = ram ? `${board.memory} · ${ram.spec}` : board ? `${board.memory} bellek seç` : 'Anakartını seç';
  document.getElementById('editRam').hidden = !ram;
  const gpuStepButton = document.getElementById('gpuStepButton');
  gpuStepButton.disabled = !ram;
  gpuStepButton.classList.toggle('is-complete', Boolean(gpu));
  gpuStepButton.classList.toggle('is-next', !ram);
  document.getElementById('gpuStepStatus').textContent = gpu ? gpu.name.replace(/^NVIDIA GeForce |^AMD Radeon /, '') : ram ? 'Marka ve model seç' : "RAM'den sonra";
  document.getElementById('gpuStepCheck').textContent = gpu ? '✓' : ram ? '○' : '—';
  document.getElementById('summaryGpu').textContent = gpu ? gpu.name : 'Sonraki adım';
  document.getElementById('summaryGpuDetail').textContent = gpu ? gpu.series : 'RAM’ini seç';
  document.getElementById('editGpu').hidden = !gpu;
  const storageStepButton = document.getElementById('storageStepButton');
  storageStepButton.disabled = !gpu;
  storageStepButton.classList.toggle('is-complete', Boolean(storage));
  storageStepButton.classList.toggle('is-next', !gpu);
  document.getElementById('storageStepStatus').textContent = storage ? `${storage.capacity} · ${storage.name.split(' ')[0]}` : gpu ? 'Tür ve model seç' : 'Ekran kartından sonra';
  document.getElementById('storageStepCheck').textContent = storage ? '✓' : gpu ? '○' : '—';
  document.getElementById('summaryStorage').textContent = storage ? storage.name : 'Sonraki adım';
  document.getElementById('summaryStorageDetail').textContent = storage ? `${storage.capacity} · ${storage.spec}` : 'Ekran kartını seç';
  document.getElementById('editStorage').hidden = !storage;
  const caseStepButton = document.getElementById('caseStepButton');
  caseStepButton.disabled = !storage;
  caseStepButton.classList.toggle('is-complete', Boolean(selectedCase));
  caseStepButton.classList.toggle('is-next', !storage);
  document.getElementById('caseStepStatus').textContent = selectedCase ? selectedCase.name : storage && board ? `${board.form} uyumlu kasa seç` : 'Depolamadan sonra';
  document.getElementById('caseStepCheck').textContent = selectedCase ? '✓' : storage && board ? '○' : '—';
  document.getElementById('caseBoardLabel').textContent = board ? `${board.name} · ${board.form}` : 'Anakart seçilmedi';
  document.getElementById('summaryCase').textContent = selectedCase ? selectedCase.name : 'Sonraki adım';
  document.getElementById('summaryCaseDetail').textContent = selectedCase ? `${board.form} · ekran kartı boşluğu ${selectedCase.gpu} mm` : 'Depolamayı seç';
  document.getElementById('editCase').hidden = !selectedCase;
  const cooler = getCpuCooler();
  const coolerStepButton = document.getElementById('coolerStepButton');
  coolerStepButton.disabled = !selectedCase || !hasModel;
  coolerStepButton.classList.toggle('is-complete', Boolean(cooler));
  coolerStepButton.classList.toggle('is-next', !selectedCase);
  document.getElementById('coolerStepStatus').textContent = cooler ? cooler.name : selectedCase && family ? `${family.socket} uyumlu soğutucu seç` : 'Kasadan sonra';
  document.getElementById('coolerStepCheck').textContent = cooler ? '✓' : selectedCase && family ? '○' : '—';
  document.getElementById('coolerCpuLabel').textContent = family && selectedCase ? `${family.socket} · ${selectedCase.name} · ${selectedCase.cooler} mm / ${selectedCase.radiators.join(', ')} mm radyatör` : 'İşlemci ve kasa seçilmedi';
  document.getElementById('coolerCount').textContent = family && selectedCase ? `${family.socket} uyumlu · kasanın ölçülerine göre filtreleniyor` : 'İşlemci ve kasa seçilmelidir';
  document.getElementById('summaryCooler').textContent = cooler ? cooler.name : 'Sonraki adım';
  document.getElementById('summaryCoolerDetail').textContent = cooler ? `${cooler.type} · ${cooler.spec}` : 'Kasayı seç';
  document.getElementById('editCooler').hidden = !cooler;
  const psuStepButton = document.getElementById('psuStepButton');
  psuStepButton.disabled = !selectedCase || !gpu || !cooler;
  psuStepButton.classList.toggle('is-complete', Boolean(psu));
  psuStepButton.classList.toggle('is-next', !selectedCase || !cooler);
  document.getElementById('psuStepStatus').textContent = psu ? `${psu.watts} W · ${psu.name.split(' ')[0]}` : gpu && selectedCase && cooler ? `${gpu.psuMin} W ve üzeri` : 'Soğutucudan sonra';
  document.getElementById('psuStepCheck').textContent = psu ? '✓' : gpu && selectedCase && cooler ? '○' : '—';
  document.getElementById('psuGpuLabel').textContent = gpu ? `${gpu.name} · min. ${gpu.psuMin} W` : 'Ekran kartı seçilmedi';
  document.getElementById('psuCount').textContent = gpu && selectedCase && cooler ? `${gpu.psuMin} W ve üzeri · kasa sınırı ${selectedCase.psu} mm` : 'Ekran kartı ve kasa seçilmelidir';
  document.getElementById('summaryPsu').textContent = psu ? `${psu.name} · ${psu.watts} W` : 'Sonraki adım';
  document.getElementById('summaryPsuDetail').textContent = psu ? `${psu.spec} · ${psu.length} mm` : 'Kasayı seç';
  document.getElementById('editPsu').hidden = !psu;
  const completed = Number(hasModel) + Number(Boolean(board)) + Number(Boolean(ram)) + Number(Boolean(gpu)) + Number(Boolean(storage)) + Number(Boolean(selectedCase)) + Number(Boolean(cooler)) + Number(Boolean(psu));
  document.getElementById('progressCount').innerHTML = `${completed} <small>/ 8</small>`;
  document.getElementById('stepCount').textContent = `${completed} / 8`;
  document.getElementById('summaryProgress').textContent = `${completed} / 8`;
  document.getElementById('progressCaption').textContent = psu ? 'Temel sistem parçaları seçildi · sistemin hazır' : cooler ? 'Soğutucu seçildi · güç kaynağı sırada' : selectedCase ? 'Kasa seçildi · işlemci soğutucu sırada' : storage ? 'Depolama seçildi · anakartına uygun kasa seç' : gpu ? 'Ekran kartı seçildi · depolama sırada' : ram ? 'İşlemci, anakart ve RAM seçildi · ekran kartı sırada' : board ? 'İşlemci ve anakart seçildi · RAM sırada' : hasModel ? 'İşlemcin seçildi · uyumlu anakart seç' : 'İşlemci seçimi bekleniyor';
  document.getElementById('progressBar').style.width = `${completed / 8 * 100}%`;
  saveSelection();
}
function renderSystemSummary() {
  const family = getFamily();
  const board = getMotherboard();
  const ram = getRamKit();
  const gpu = getGraphicsCard();
  const storage = (storageProducts[selection.storageType] || []).find(item => item.id === selection.storage) || null;
  const selectedCase = getCase();
  const cooler = getCpuCooler();
  const psu = getPowerSupply();
  const rows = [
    ['cpu', 'İşlemci', document.getElementById('summaryCpu').textContent, document.getElementById('summaryCpuDetail').textContent],
    ['motherboard', 'Anakart', board?.name || 'Seçim gerekli', board ? `${board.chipset} · ${board.socket} · ${board.memory} · ${board.form}` : ''],
    ['ram', 'Bellek (RAM)', ram?.name || 'Seçim gerekli', ram ? `${ram.capacity} GB · ${ram.spec} · ${ram.code}` : ''],
    ['gpu', 'Ekran kartı', gpu?.name || 'Seçim gerekli', gpu ? `${gpu.series} · sistem güç önerisi ${gpu.psuMin} W` : ''],
    ['storage', 'Depolama', storage?.name || 'Seçim gerekli', storage ? `${storage.capacity} · ${storage.spec} · ${storage.code}` : ''],
    ['case', 'Kasa', selectedCase?.name || 'Seçim gerekli', selectedCase ? `${board.form} · GPU ${selectedCase.gpu} mm · CPU soğutucu ${selectedCase.cooler} mm · PSU ${selectedCase.psu} mm` : ''],
    ['cooler', 'İşlemci soğutucu', cooler?.name || 'Seçim gerekli', cooler ? `${cooler.type} · ${cooler.spec} · ${family.socket}` : ''],
    ['psu', 'Güç kaynağı', psu?.name || 'Seçim gerekli', psu ? `${psu.watts} W · ${psu.spec} · uzunluk ${psu.length} mm` : '']
  ];
  const fullSummary = document.getElementById('fullSystemSummary');
  fullSummary.replaceChildren(...rows.map(([id, label, name, detail]) => {
    const row = document.createElement('article');
    row.className = 'full-summary-row';
    const copy = document.createElement('div'); copy.className = 'full-summary-copy';
    const eyebrow = document.createElement('span'); eyebrow.textContent = label;
    const value = document.createElement('strong'); value.textContent = name;
    const specs = document.createElement('small'); specs.textContent = detail;
    copy.append(eyebrow, value, specs);
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'summary-edit'; edit.dataset.editPart = id; edit.textContent = 'Değiştir';
    row.append(copy, edit);
    return row;
  }));

  const socketOk = Boolean(family && board && family.socket === board.socket);
  const ramOk = Boolean(board && ram && board.memory === (ram.id.includes('ddr4') ? 'DDR4' : 'DDR5'));
  const boardCaseOk = Boolean(board && selectedCase && selectedCase.supports.includes(board.form));
  const coolerSocketOk = Boolean(family && cooler && cooler.sockets.includes(family.socket));
  const coolerCaseOk = Boolean(selectedCase && cooler && (cooler.radiator ? selectedCase.radiators.includes(cooler.radiator) : cooler.height <= selectedCase.cooler));
  const gpuPowerOk = Boolean(gpu && psu && psu.watts >= gpu.psuMin);
  const psuSizeOk = Boolean(selectedCase && psu && psu.length <= selectedCase.psu);
  const checks = [
    [socketOk, 'İşlemci ve anakart soketi', socketOk ? `${family.socket} soketi eşleşiyor.` : 'Soket eşleşmesini kontrol et.'],
    [ramOk, 'Anakart ve bellek türü', ramOk ? `${board.memory} bellek anakartla eşleşiyor.` : 'Anakartın desteklediği DDR türünü doğrula.'],
    [boardCaseOk, 'Anakart ve kasa boyutu', boardCaseOk ? `${board.form} anakart seçilen kasada destekleniyor.` : 'Kasa anakart form faktörünü desteklemiyor.'],
    [coolerSocketOk, 'İşlemci ve soğutucu soketi', coolerSocketOk ? `${family.socket} soketi soğutucuyla eşleşiyor.` : 'İşlemci soketi uyumluluğunu doğrula.'],
    [coolerCaseOk, 'Soğutucu ve kasa boşluğu', coolerCaseOk ? (cooler.radiator ? `${cooler.radiator} mm radyatör kasa listesinde destekleniyor.` : `${cooler.height} mm soğutucu, ${selectedCase.cooler} mm sınırına uyuyor.`) : 'Kasanın radyatör veya soğutucu sınırını kontrol et.'],
    [gpuPowerOk, 'Ekran kartı ve güç kapasitesi', gpuPowerOk ? `${psu.watts} W güç kaynağı, ${gpu.psuMin} W referans önerisini karşılıyor.` : 'Güç kaynağının watt değerini gözden geçir.'],
    [psuSizeOk, 'Güç kaynağı ve kasa boşluğu', psuSizeOk ? `${psu.length} mm PSU, kasanın ${selectedCase.psu} mm sınırına uyuyor.` : 'PSU uzunluğu seçilen kasaya uygun değil.'],
    [null, 'Ekran kartının fiziksel ölçüsü', 'Marka/model kartına göre uzunluk değişebilir; satın alacağın kartı kasa sınırıyla karşılaştır.'],
    [null, 'Depolama yuvası ve bağlantı', 'Seçilen anakartın M.2 yuva sayısını veya SATA bağlantılarını ürün özelliklerinden doğrula.']
  ];
  const compatibilityList = document.getElementById('fullCompatibilityList');
  compatibilityList.replaceChildren(...checks.map(([ok, title, detail]) => {
    const item = document.createElement('article'); item.className = `compatibility-result ${ok ? 'is-ok' : 'is-warning'}`;
    const icon = document.createElement('span'); icon.className = 'compatibility-result-icon'; icon.textContent = ok ? '✓' : '!'; icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div'); const heading = document.createElement('strong'); heading.textContent = title; const note = document.createElement('small'); note.textContent = detail; copy.append(heading, note); item.append(icon, copy); return item;
  }));
}
function showFamilies() {
  const list = processorFamilies[selection.brand] || [];
  document.getElementById('selectedBrandLabel').textContent = selection.brand === 'intel' ? 'Intel' : 'AMD';
  familyChoices.replaceChildren(...list.map(family => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'family-choice';
    button.dataset.family = family.id;
    button.setAttribute('aria-pressed', String(selection.family === family.id));
    const copy = document.createElement('strong'); copy.textContent = family.name;
    const note = document.createElement('span'); note.textContent = family.note;
    button.append(copy, note);
    return button;
  }));
}
function renderModels() {
  const family = getFamily();
  if (!family) return;
  document.getElementById('selectedFamilyLabel').textContent = `${selection.brand === 'intel' ? 'Intel' : 'AMD'} · ${family.name}`;
  document.getElementById('modelCount').textContent = `${family.models.length} model · ${family.generation}`;
  const query = modelSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = family.models.filter(model => modelLabel(family, model).toLocaleLowerCase('tr-TR').includes(query));
  modelChoices.replaceChildren(...matches.map(model => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.model = model;
    button.setAttribute('aria-pressed', String(selection.model === model));
    const name = document.createElement('strong'); name.textContent = modelLabel(family, model);
    const detail = document.createElement('span'); detail.textContent = `${family.generation} · Üretici model adı`;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = selection.brand === 'intel' ? family.id.startsWith('ultra') ? 'Intel Core Ultra' : 'Intel Core' : 'AMD Ryzen';
    button.append(name, detail, chip);
    return button;
  }));
  document.getElementById('noModels').hidden = matches.length > 0;
}
function renderMotherboards() {
  const family = getFamily();
  if (!family || !selection.model) return;
  const allBoards = (motherboardsBySocket[family.socket] || []).map(board => ({ ...board, socket: family.socket }));
  const query = motherboardSearch.value.trim().toLocaleLowerCase('tr-TR');
  const boards = allBoards.filter(board => `${board.name} ${board.chipset} ${board.memory} ${board.form}`.toLocaleLowerCase('tr-TR').includes(query));
  document.getElementById('motherboardSocketLabel').textContent = `${modelLabel(family, selection.model)} · ${family.socket}`;
  document.getElementById('motherboardCount').textContent = `${boards.length} uyumlu örnek model · ${family.socket}`;
  motherboardChoices.replaceChildren(...boards.map(board => {
    const article = document.createElement('article');
    article.className = 'motherboard-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'motherboard-choice';
    button.dataset.motherboard = board.id;
    button.setAttribute('aria-pressed', String(selection.motherboard === board.id));
    const heading = document.createElement('span'); heading.className = 'motherboard-name'; heading.textContent = board.name;
    const badges = document.createElement('span'); badges.className = 'motherboard-badges';
    [board.memory, board.form].forEach(label => { const badge = document.createElement('span'); badge.textContent = label; badges.append(badge); });
    const specs = document.createElement('span'); specs.className = 'motherboard-specs';
    specs.textContent = `${board.chipset} · ${board.socket}`;
    const note = document.createElement('span'); note.className = 'motherboard-note'; note.textContent = board.note || 'Bu anakart soketi seçtiğin işlemci ailesiyle eşleşiyor.';
    button.append(heading, badges, specs, note);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = board.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noMotherboards').hidden = boards.length > 0;
}
function renderRamKits() {
  const board = getMotherboard();
  if (!board) return;
  const allKits = ramKitsByType[board.memory] || [];
  const capacities = [...new Set(allKits.map(kit => kit.capacity))].sort((a, b) => a - b);
  if (!capacities.includes(Number(selection.ramCapacity))) selection.ramCapacity = capacities.includes(32) ? 32 : capacities[0];
  document.getElementById('ramTypeLabel').textContent = `${board.name} · ${board.memory}`;
  document.getElementById('ramCount').textContent = `${allKits.length} örnek kit · anakart bellek türü: ${board.memory}`;
  document.querySelectorAll('[data-ram-capacity]').forEach(button => {
    const capacity = Number(button.dataset.ramCapacity);
    button.hidden = !capacities.includes(capacity);
    button.setAttribute('aria-pressed', String(capacity === Number(selection.ramCapacity)));
  });
  const query = ramSearch.value.trim().toLocaleLowerCase('tr-TR');
  const kits = allKits.filter(kit => kit.capacity === Number(selection.ramCapacity) && `${kit.name} ${kit.spec} ${kit.code}`.toLocaleLowerCase('tr-TR').includes(query));
  ramChoices.replaceChildren(...kits.map(kit => {
    const article = document.createElement('article');
    article.className = 'ram-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ram-choice';
    button.dataset.ram = kit.id;
    button.setAttribute('aria-pressed', String(selection.ram === kit.id));
    const name = document.createElement('strong'); name.textContent = kit.name;
    const spec = document.createElement('span'); spec.className = 'ram-spec'; spec.textContent = kit.spec;
    const code = document.createElement('small'); code.textContent = `Ürün kodu: ${kit.code}`;
    button.append(name, spec, code);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = kit.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici ürün sayfası ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noRam').hidden = kits.length > 0;
}
function renderGraphicsCards() {
  const cards = graphicsCards[selection.gpuBrand] || [];
  document.getElementById('gpuModelArea').hidden = !selection.gpuBrand;
  document.getElementById('gpuBrandLabel').textContent = selection.gpuBrand || 'Marka seçilmedi';
  document.querySelectorAll('[data-gpu-brand]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.gpuBrand === selection.gpuBrand)));
  document.getElementById('gpuCount').textContent = `${cards.length} örnek model · ${selection.gpuBrand === 'NVIDIA' ? 'GeForce RTX' : 'Radeon RX'} ürün ailesi`;
  const query = gpuSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = cards.filter(card => `${card.name} ${card.series}`.toLocaleLowerCase('tr-TR').includes(query));
  gpuChoices.replaceChildren(...matches.map(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.gpu = card.id;
    button.setAttribute('aria-pressed', String(selection.gpu === card.id));
    const name = document.createElement('strong'); name.textContent = card.name;
    const series = document.createElement('span'); series.textContent = `${card.series} · üretici model ailesi`;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = selection.gpuBrand;
    button.append(name, series, chip);
    return button;
  }));
  document.getElementById('noGpu').hidden = matches.length > 0 || !selection.gpuBrand;
}
function renderStorageProducts() {
  const products = storageProducts[selection.storageType] || [];
  document.getElementById('storageModelArea').hidden = !selection.storageType;
  document.querySelectorAll('[data-storage-type]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.storageType === selection.storageType)));
  const typeNames = { nvme: 'NVMe M.2 SSD', sata: 'SATA SSD', hdd: 'HDD' };
  document.getElementById('storageTypeLabel').textContent = typeNames[selection.storageType] || 'Depolama';
  document.getElementById('storageCount').textContent = `${products.length} örnek model · ${typeNames[selection.storageType] || 'Önce depolama türü seç'}`;
  const query = storageSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = products.filter(product => `${product.name} ${product.spec} ${product.code}`.toLocaleLowerCase('tr-TR').includes(query));
  storageChoices.replaceChildren(...matches.map(product => {
    const article = document.createElement('article');
    article.className = 'storage-product-entry';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'model-card';
    button.dataset.storage = product.id;
    button.setAttribute('aria-pressed', String(selection.storage === product.id));
    const name = document.createElement('strong'); name.textContent = product.name;
    const spec = document.createElement('span'); spec.textContent = product.spec;
    const chip = document.createElement('span'); chip.className = 'model-chip'; chip.textContent = `${product.capacity} · ${product.code}`;
    button.append(name, spec, chip);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = product.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici ürün bilgisi ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noStorage').hidden = matches.length > 0 || !selection.storageType;
}
function renderCases() {
  const board = getMotherboard();
  if (!board) return;
  const compatible = pcCases.filter(item => item.supports.includes(board.form));
  document.getElementById('caseBoardLabel').textContent = `${board.name} · ${board.form}`;
  document.getElementById('caseCount').textContent = `${compatible.length} uyumlu örnek kasa · ${board.form} anakart desteği`;
  const query = caseSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = compatible.filter(item => `${item.name} ${item.note} ${item.supports.join(' ')}`.toLocaleLowerCase('tr-TR').includes(query));
  caseChoices.replaceChildren(...matches.map(item => {
    const article = document.createElement('article');
    article.className = 'case-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-choice';
    button.dataset.case = item.id;
    button.setAttribute('aria-pressed', String(selection.pcCase === item.id));
    const name = document.createElement('strong'); name.className = 'case-name'; name.textContent = item.name;
    const note = document.createElement('span'); note.className = 'case-note'; note.textContent = item.note;
    const tags = document.createElement('span'); tags.className = 'motherboard-badges';
    [`GPU ${item.gpu} mm`, `Soğutucu ${item.cooler} mm`, `PSU ${item.psu} mm`].forEach(label => { const tag = document.createElement('span'); tag.textContent = label; tags.append(tag); });
    const support = document.createElement('span'); support.className = 'case-note'; support.textContent = `Anakart desteği: ${item.supports.join(' · ')}`;
    button.append(name, note, tags, support);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noCases').hidden = matches.length > 0;
}
function renderCpuCoolers() {
  const family = getFamily(); const selectedCase = getCase();
  const compatible = family && selectedCase ? cpuCoolers.filter(item => item.sockets.includes(family.socket) && (item.radiator ? selectedCase.radiators.includes(item.radiator) : item.height <= selectedCase.cooler)) : [];
  const query = coolerSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = compatible.filter(item => `${item.name} ${item.type} ${item.spec}`.toLocaleLowerCase('tr-TR').includes(query));
  coolerChoices.replaceChildren(...matches.map(item => {
    const card = document.createElement('article'); card.className = 'cooler-card';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'cooler-choice'; button.dataset.cooler = item.id; button.setAttribute('aria-pressed', String(selection.cooler === item.id));
    const name = document.createElement('strong'); name.textContent = item.name;
    const type = document.createElement('span'); type.className = 'cooler-type'; type.textContent = item.type;
    const spec = document.createElement('small'); spec.textContent = `${item.spec} · ${family.socket}`;
    button.append(name, type, spec);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    card.append(button, source); return card;
  }));
  document.getElementById('noCoolers').hidden = matches.length > 0;
}
function renderPowerSupplies() {
  const gpu = getGraphicsCard();
  const selectedCase = getCase();
  if (!gpu || !selectedCase) return;
  const compatible = powerSupplies.filter(item => item.watts >= gpu.psuMin && item.length <= selectedCase.psu);
  document.getElementById('psuGpuLabel').textContent = `${gpu.name} · üretici önerisi en az ${gpu.psuMin} W`;
  document.getElementById('psuCount').textContent = `${compatible.length} uygun örnek · ${gpu.psuMin} W ve üzeri · kasa PSU sınırı ${selectedCase.psu} mm`;
  const query = psuSearch.value.trim().toLocaleLowerCase('tr-TR');
  const matches = compatible.filter(item => `${item.name} ${item.spec} ${item.watts} W`.toLocaleLowerCase('tr-TR').includes(query));
  psuChoices.replaceChildren(...matches.map(item => {
    const article = document.createElement('article');
    article.className = 'psu-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'psu-choice';
    button.dataset.psu = item.id;
    button.setAttribute('aria-pressed', String(selection.psu === item.id));
    const name = document.createElement('strong'); name.className = 'psu-name'; name.textContent = item.name;
    const watts = document.createElement('span'); watts.className = 'psu-watts'; watts.textContent = `${item.watts} W · ${item.length} mm uzunluk`;
    const spec = document.createElement('span'); spec.className = 'psu-spec'; spec.textContent = item.spec;
    button.append(name, watts, spec);
    const source = document.createElement('a'); source.className = 'board-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Üretici özellikleri ↗';
    article.append(button, source);
    return article;
  }));
  document.getElementById('noPsu').hidden = matches.length > 0;
}
function updateStage() {
  updateSummary();
  if (!selection.brand) { showStage('brand'); return; }
  showFamilies();
  if (!selection.family || !getFamily()) { showStage('family'); return; }
  showStage('model');
  renderModels();
  if (!selection.model) return;
  showStage('motherboard');
  renderMotherboards();
  if (!selection.motherboard) return;
  showStage('ram');
  renderRamKits();
  if (!selection.ram) return;
  showStage('gpu');
  renderGraphicsCards();
  if (!selection.gpu) return;
  showStage('storage');
  renderStorageProducts();
  if (!selection.storage) return;
  showStage('case');
  renderCases();
  if (!selection.pcCase) return;
  showStage('cooler');
  renderCpuCoolers();
  if (!selection.cooler) return;
  showStage('psu');
  renderPowerSupplies();
  if (!selection.psu) return;
  showStage('summary');
  renderSystemSummary();
}

document.querySelectorAll('[data-brand]').forEach(button => button.addEventListener('click', () => {
  selection = { brand: button.dataset.brand, family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  message.textContent = '';
  updateStage();
}));
familyChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-family]');
  if (!button) return;
  const oldSocket = getFamily()?.socket;
  const newSocket = (processorFamilies[selection.brand] || []).find(family => family.id === button.dataset.family)?.socket;
  if (oldSocket && newSocket !== oldSocket) { selection.motherboard = ''; selection.ram = ''; }
  selection.family = button.dataset.family;
  selection.model = '';
  modelSearch.value = '';
  message.textContent = '';
  updateStage();
});
modelChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-model]');
  if (!button) return;
  selection.model = button.dataset.model;
  updateStage();
  message.textContent = 'İşlemcin kaydedildi. Şimdi yalnızca bu soketle uyumlu anakartları seçebilirsin.';
});
modelSearch.addEventListener('input', renderModels);
document.getElementById('backToBrand').addEventListener('click', () => {
  selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  updateStage();
});
document.getElementById('backToFamily').addEventListener('click', () => {
  selection.family = '';
  selection.model = '';
  selection.motherboard = '';
  updateStage();
});
document.getElementById('editCpu').addEventListener('click', () => {
  showStage(selection.family ? 'model' : selection.brand ? 'family' : 'brand');
  if (selection.family) renderModels();
});
document.getElementById('resetBuilder').addEventListener('click', () => {
  selection = { brand: '', family: '', model: '', motherboard: '', ram: '', ramCapacity: 32 };
  modelSearch.value = '';
  message.textContent = '';
  updateStage();
});
document.getElementById('motherboardStepButton').addEventListener('click', () => {
  if (!selection.model) return;
  showStage('motherboard');
  updateSummary();
  renderMotherboards();
});
document.getElementById('ramStepButton').addEventListener('click', () => {
  if (!selection.motherboard) return;
  showStage('ram'); updateSummary(); renderRamKits();
});
document.getElementById('cpuStepButton').addEventListener('click', () => {
  if (!selection.brand) { showStage('brand'); return; }
  if (!selection.family) { showFamilies(); showStage('family'); return; }
  showStage('model'); renderModels();
});
document.getElementById('backToCpuModels').addEventListener('click', () => {
  showStage('model'); renderModels();
});
motherboardSearch.addEventListener('input', renderMotherboards);
motherboardChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-motherboard]');
  if (!button) return;
  const previousBoard = getMotherboard();
  const selectedBoard = (motherboardsBySocket[getFamily()?.socket] || []).find(board => board.id === button.dataset.motherboard);
  if (previousBoard?.memory !== selectedBoard?.memory) selection.ram = '';
  selection.motherboard = button.dataset.motherboard;
  updateStage();
  message.textContent = 'Anakart seçildi. Şimdi uygun bellek türü ve kit kapasitesini seçebilirsin.';
});
document.getElementById('editMotherboard').addEventListener('click', () => {
  showStage('motherboard'); updateSummary(); renderMotherboards();
});
document.getElementById('backToMotherboard').addEventListener('click', () => {
  showStage('motherboard'); renderMotherboards();
});
document.querySelectorAll('[data-ram-capacity]').forEach(button => button.addEventListener('click', () => {
  selection.ramCapacity = Number(button.dataset.ramCapacity);
  message.textContent = '';
  renderRamKits();
}));
ramSearch.addEventListener('input', renderRamKits);
ramChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-ram]');
  if (!button) return;
  selection.ram = button.dataset.ram;
  updateStage();
  message.textContent = 'RAM seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editRam').addEventListener('click', () => {
  showStage('ram'); updateSummary(); renderRamKits();
});
document.getElementById('gpuStepButton').addEventListener('click', () => {
  if (!selection.ram) return;
  showStage('gpu'); renderGraphicsCards();
});
document.getElementById('backToRam').addEventListener('click', () => {
  showStage('ram'); renderRamKits();
});
document.querySelectorAll('[data-gpu-brand]').forEach(button => button.addEventListener('click', () => {
  if (selection.gpuBrand !== button.dataset.gpuBrand) selection.gpu = '';
  selection.gpuBrand = button.dataset.gpuBrand;
  gpuSearch.value = '';
  updateSummary(); renderGraphicsCards();
  message.textContent = '';
}));
gpuSearch.addEventListener('input', renderGraphicsCards);
gpuChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-gpu]');
  if (!button) return;
  selection.gpu = button.dataset.gpu;
  updateStage();
  message.textContent = 'Ekran kartı seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editGpu').addEventListener('click', () => {
  showStage('gpu'); renderGraphicsCards();
});
document.getElementById('storageStepButton').addEventListener('click', () => {
  if (!selection.gpu) return;
  showStage('storage'); renderStorageProducts();
});
document.getElementById('backToGpu').addEventListener('click', () => {
  showStage('gpu'); renderGraphicsCards();
});
document.querySelectorAll('[data-storage-type]').forEach(button => button.addEventListener('click', () => {
  if (selection.storageType !== button.dataset.storageType) selection.storage = '';
  selection.storageType = button.dataset.storageType;
  storageSearch.value = '';
  updateSummary(); renderStorageProducts();
  message.textContent = '';
}));
storageSearch.addEventListener('input', renderStorageProducts);
storageChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-storage]');
  if (!button) return;
  selection.storage = button.dataset.storage;
  updateStage();
  message.textContent = 'Depolama seçimin kaydedildi ve sistem özetine eklendi.';
});
document.getElementById('editStorage').addEventListener('click', () => {
  showStage('storage'); renderStorageProducts();
});
document.getElementById('caseStepButton').addEventListener('click', () => {
  if (!selection.storage) return;
  showStage('case'); renderCases();
});
document.getElementById('backToStorage').addEventListener('click', () => {
  showStage('storage'); renderStorageProducts();
});
caseSearch.addEventListener('input', renderCases);
caseChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-case]');
  if (!button) return;
  selection.pcCase = button.dataset.case;
  updateStage();
  message.textContent = 'Kasan anakart boyutunla uyumlu ve sistem özetine eklendi.';
});
document.getElementById('editCase').addEventListener('click', () => {
  showStage('case'); renderCases();
});
document.getElementById('coolerStepButton').addEventListener('click', () => {
  if (!selection.pcCase || !selection.model) return;
  showStage('cooler'); renderCpuCoolers();
});
document.getElementById('backToCaseFromCooler').addEventListener('click', () => { showStage('case'); renderCases(); });
coolerSearch.addEventListener('input', renderCpuCoolers);
coolerChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-cooler]'); if (!button) return;
  selection.cooler = button.dataset.cooler; updateStage();
  message.textContent = 'Soğutucun işlemci soketi ve kasa ölçülerine göre seçildi.';
});
document.getElementById('editCooler').addEventListener('click', () => { showStage('cooler'); renderCpuCoolers(); });
document.getElementById('psuStepButton').addEventListener('click', () => {
  if (!selection.pcCase || !selection.gpu || !selection.cooler) return;
  showStage('psu'); renderPowerSupplies();
});
document.getElementById('backToCooler').addEventListener('click', () => { showStage('cooler'); renderCpuCoolers(); });
psuSearch.addEventListener('input', renderPowerSupplies);
psuChoices.addEventListener('click', event => {
  const button = event.target.closest('[data-psu]');
  if (!button) return;
  selection.psu = button.dataset.psu;
  updateStage();
  message.textContent = 'Güç kaynağı seçimin ekran kartı gereksinimine ve kasa uzunluk sınırına uyuyor.';
});
document.getElementById('editPsu').addEventListener('click', () => {
  showStage('psu'); renderPowerSupplies();
});
document.getElementById('printSystemSummary').addEventListener('click', () => window.print());
document.getElementById('editBuildFromSummary').addEventListener('click', () => {
  showStage('model'); renderModels();
});
document.getElementById('fullSystemSummary').addEventListener('click', event => {
  const button = event.target.closest('[data-edit-part]');
  if (!button) return;
  const editButtonByPart = {
    cpu: 'editCpu', motherboard: 'editMotherboard', ram: 'editRam', gpu: 'editGpu',
    storage: 'editStorage', case: 'editCase', cooler: 'editCooler', psu: 'editPsu'
  };
  document.getElementById(editButtonByPart[button.dataset.editPart])?.click();
});
systemTabs.addEventListener('click', event => {
  const button = event.target.closest('[data-system-id]');
  if (button) switchSystem(button.dataset.systemId);
});
updateStage();
