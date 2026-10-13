create table dbo.brands
(
    id         bigint identity
        primary key,
    name       nvarchar(100)                 not null
        constraint UQ_brands_name
            unique,
    logo       varchar(500),
    status     varchar(20) default 'ACTIVE'  not null
        constraint CK_brands_status
            check ([status] = 'INACTIVE' OR [status] = 'ACTIVE'),
    created_at datetime2   default getdate() not null
)
go

create table dbo.categories
(
    id           bigint identity
        primary key,
    name         nvarchar(100)                 not null,
    parent_id    bigint
        constraint FK_categories_parent
            references dbo.categories,
    description  nvarchar(500),
    status       varchar(20) default 'ACTIVE'  not null
        constraint CK_categories_status
            check ([status] = 'INACTIVE' OR [status] = 'ACTIVE'),
    created_at   datetime2   default getdate() not null,
    show_on_home bit         default 0         not null,
    show_on_menu bit         default 0         not null,
    constraint UQ_categories_name_parent
        unique (name, parent_id)
)
go

create table dbo.filter_groups
(
    id           bigint identity
        primary key,
    product_type varchar(20)                  not null
        constraint ck_filter_groups_product_type
            check ([product_type] = 'ACCESSORY' OR [product_type] = 'COMPONENT' OR [product_type] = 'PC'),
    product_code varchar(50)                  not null,
    name         varchar(100)                 not null,
    code         varchar(50)                  not null,
    filter_type  varchar(20) default 'OPTION' not null
        constraint ck_filter_groups_filter_type
            check ([filter_type] = 'BOOLEAN' OR [filter_type] = 'RANGE' OR [filter_type] = 'OPTION'),
    sort_order   int         default 0,
    status       tinyint     default 1,
    constraint uk_filter_group
        unique (product_type, product_code, code)
)
go

create table dbo.filter_options
(
    id              bigint identity
        primary key,
    filter_group_id bigint       not null
        constraint fk_filter_options_filter_group
            references dbo.filter_groups
            on delete cascade,
    value           varchar(100) not null,
    label           varchar(100) not null,
    min_value       decimal(15, 2),
    max_value       decimal(15, 2),
    sort_order      int     default 0,
    status          tinyint default 1,
    constraint uk_filter_option
        unique (filter_group_id, value)
)
go

create table dbo.products
(
    id               bigint identity
        primary key,
    name             nvarchar(255)                   not null,
    sku              varchar(100)                    not null
        constraint UQ_products_sku
            unique,
    product_type     varchar(30)                     not null
        constraint CK_products_type
            check ([product_type] = 'ACCESSORY' OR [product_type] = 'COMPONENT' OR [product_type] = 'PC'),
    component_type   varchar(30)
        constraint CK_products_componentType
            check ([component_type] = 'COOLER' OR [component_type] = 'CASE' OR [component_type] = 'PSU' OR
                   [component_type] = 'MAINBOARD' OR [component_type] = 'HDD' OR [component_type] = 'SSD' OR
                   [component_type] = 'GPU' OR [component_type] = 'RAM' OR [component_type] = 'CPU'),
    brand_id         bigint
        constraint FK_products_brand
            references dbo.brands,
    price            decimal(18, 2)                  not null
        constraint CK_products_price
            check ([price] >= 0),
    discount_percent decimal(5, 2) default 0         not null
        constraint CK_products_discount_percent
            check ([discount_percent] >= 0 AND [discount_percent] <= 100),
    sale_price       decimal(18, 2)
        constraint CK_products_sale_price
            check ([sale_price] IS NULL OR [sale_price] >= 0),
    stock            int           default 0         not null
        constraint CK_products_stock
            check ([stock] >= 0),
    description      nvarchar(max),
    status           varchar(20)   default 'ACTIVE'  not null
        constraint CK_products_status
            check ([status] = 'OUT_OF_STOCK' OR [status] = 'INACTIVE' OR [status] = 'ACTIVE'),
    created_at       datetime2     default getdate() not null,
    updated_at       datetime2     default getdate() not null,
    constraint CK_products_component_type
        check ([product_type] = 'COMPONENT' AND [component_type] IS NOT NULL OR
               ([product_type] = 'ACCESSORY' OR [product_type] = 'PC') AND [component_type] IS NULL)
)
go

create table dbo.case_specs
(
    product_id               bigint       not null
        primary key
        constraint FK_case_specs_product
            references dbo.products
            on delete cascade,
    form_factor_support      varchar(255) not null,
    max_gpu_length_mm        int          not null,
    max_cpu_cooler_height_mm int,
    max_radiator_size_mm     int,
    drive_bays               int          not null
)
go

create table dbo.cooler_specs
(
    product_id        bigint       not null
        primary key
        constraint FK_cooler_specs_product
            references dbo.products
            on delete cascade,
    cooler_type       varchar(30)  not null,
    supported_sockets varchar(500) not null,
    radiator_size_mm  int,
    fan_size_mm       int,
    height_mm         int,
    tdp_support       int
)
go

create table dbo.cpu_specs
(
    product_id          bigint        not null
        primary key
        constraint FK_cpu_specs_product
            references dbo.products
            on delete cascade,
    socket              varchar(50)   not null,
    cores               int           not null,
    threads             int           not null,
    base_clock          decimal(6, 2) not null,
    boost_clock         decimal(6, 2) not null,
    cache_mb            decimal(6, 2) not null,
    integrated_graphics varchar(100)
)
go

create table dbo.gpu_specs
(
    product_id           bigint       not null
        primary key
        constraint FK_gpu_specs_product
            references dbo.products
            on delete cascade,
    chipset              varchar(100) not null,
    vram_gb              int          not null,
    memory_type          varchar(20)  not null,
    length_mm            int          not null,
    width_slots          decimal(4, 2),
    recommended_psu_watt int,
    power_connector      varchar(100)
)
go

create table dbo.hdd_specs
(
    product_id  bigint      not null
        primary key
        constraint FK_hdd_product
            references dbo.products,
    capacity_gb int         not null
        constraint CK_hdd_capacity
            check ([capacity_gb] > 0),
    rpm         int         not null
        constraint CK_hdd_rpm
            check ([rpm] IS NULL OR [rpm] > 0),
    cache_mb    int,
    interface   varchar(50) not null
)
go

create table dbo.headset_specs
(
    product_id         bigint       not null
        primary key
        constraint FK_headset_specs_product
            references dbo.products
            on delete cascade,
    headset_type       varchar(50)  not null,
    driver_size_mm     decimal(5, 2)
        constraint CK_headset_driver
            check ([driver_size_mm] IS NULL OR [driver_size_mm] > 0),
    connection         varchar(100) not null,
    impedance_ohm      decimal(6, 2)
        constraint CK_headset_impedance
            check ([impedance_ohm] IS NULL OR [impedance_ohm] > 0),
    frequency_response varchar(50),
    microphone         bit          not null,
    noise_cancellation varchar(50),
    surround_sound     varchar(50),
    battery_mah        int
        constraint CK_headset_battery
            check ([battery_mah] IS NULL OR [battery_mah] > 0)
)
go

create table dbo.keyboard_specs
(
    product_id      bigint       not null
        primary key
        constraint FK_keyboard_specs_product
            references dbo.products
            on delete cascade,
    keyboard_type   varchar(30)  not null,
    switch_type     varchar(50),
    layout          varchar(30)  not null,
    connection      varchar(100) not null,
    keycap_material varchar(50),
    backlight       varchar(50),
    rgb             bit          not null,
    polling_rate_hz int
        constraint CK_keyboard_polling_rate
            check ([polling_rate_hz] IS NULL OR [polling_rate_hz] > 0),
    battery_mah     int
        constraint CK_keyboard_battery
            check ([battery_mah] IS NULL OR [battery_mah] > 0),
    dimensions      varchar(100)
)
go

create table dbo.monitor_specs
(
    product_id       bigint        not null
        primary key
        constraint FK_monitor_specs_product
            references dbo.products
            on delete cascade,
    screen_size_inch decimal(4, 2) not null
        constraint CK_monitor_screen_size
            check ([screen_size_inch] > 0),
    resolution       varchar(50)   not null,
    refresh_rate_hz  int           not null
        constraint CK_monitor_refresh_rate
            check ([refresh_rate_hz] > 0),
    panel_type       varchar(30)   not null,
    response_time_ms decimal(5, 2)
        constraint CK_monitor_response_time
            check ([response_time_ms] IS NULL OR [response_time_ms] > 0),
    brightness_nits  int
        constraint CK_monitor_brightness
            check ([brightness_nits] IS NULL OR [brightness_nits] > 0),
    aspect_ratio     varchar(20)   not null,
    adaptive_sync    varchar(50),
    ports            varchar(255)  not null
)
go

create table dbo.motherboard_specs
(
    product_id  bigint        not null
        primary key
        constraint FK_motherboard_specs_product
            references dbo.products
            on delete cascade,
    socket      varchar(50)   not null,
    chipset     varchar(100)  not null,
    memory_type varchar(20)   not null,
    max_ram_gb  int           not null,
    ram_slots   int           not null,
    form_factor varchar(30)   not null,
    m2_slots    int           not null,
    sata_ports  int           not null,
    wifi        bit default 0 not null,
    bluetooth   bit default 0 not null
)
go

create table dbo.mouse_specs
(
    product_id      bigint       not null
        primary key
        constraint FK_mouse_specs_product
            references dbo.products
            on delete cascade,
    sensor          varchar(100) not null,
    dpi_max         int          not null
        constraint CK_mouse_dpi
            check ([dpi_max] IS NULL OR [dpi_max] > 0),
    polling_rate_hz int
        constraint CK_mouse_polling_rate
            check ([polling_rate_hz] IS NULL OR [polling_rate_hz] > 0),
    buttons         int          not null
        constraint CK_mouse_buttons
            check ([buttons] IS NULL OR [buttons] > 0),
    connection      varchar(100) not null,
    weight_g        decimal(6, 2)
        constraint CK_mouse_weight
            check ([weight_g] IS NULL OR [weight_g] > 0),
    battery_mah     int
        constraint CK_mouse_battery
            check ([battery_mah] IS NULL OR [battery_mah] > 0),
    rgb             bit          not null
)
go

create table dbo.pc_builds
(
    id         bigint identity
        primary key,
    product_id bigint                      not null
        constraint UQ_pc_builds_product
            unique
        constraint FK_pc_builds_product
            references dbo.products
            on delete cascade,
    created_at datetime2 default getdate() not null
)
go

create table dbo.configuration_groups
(
    id             bigint identity
        primary key,
    pc_build_id    bigint        not null
        constraint FK_configuration_groups_build
            references dbo.pc_builds
            on delete cascade,
    name           nvarchar(100) not null,
    component_type varchar(30)   not null
        constraint CK_configuration_groups_type
            check ([component_type] = 'COOLER' OR [component_type] = 'CASE' OR [component_type] = 'PSU' OR
                   [component_type] = 'MAINBOARD' OR [component_type] = 'HDD' OR [component_type] = 'SSD' OR
                   [component_type] = 'GPU' OR [component_type] = 'RAM' OR [component_type] = 'CPU'),
    required       bit default 1 not null,
    sort_order     int default 0 not null
)
go

create table dbo.configuration_options
(
    id                     bigint identity
        primary key,
    configuration_group_id bigint                   not null
        constraint FK_configuration_options_group
            references dbo.configuration_groups
            on delete cascade,
    product_id             bigint                   not null
        constraint FK_configuration_options_product
            references dbo.products,
    additional_price       decimal(18, 2) default 0 not null
        constraint CK_configuration_options_price
            check ([additional_price] >= 0),
    is_default             bit            default 0 not null,
    sort_order             int            default 0 not null
)
go

create table dbo.pc_build_components
(
    id                   bigint identity
        primary key,
    pc_build_id          bigint        not null
        constraint FK_pc_build_components_build
            references dbo.pc_builds
            on delete cascade,
    component_product_id bigint        not null
        constraint FK_pc_build_components_product
            references dbo.products,
    component_type       varchar(30)   not null
        constraint CK_pc_build_components_type
            check ([component_type] = 'COOLER' OR [component_type] = 'CASE' OR [component_type] = 'PSU' OR
                   [component_type] = 'MAINBOARD' OR [component_type] = 'HDD' OR [component_type] = 'SSD' OR
                   [component_type] = 'GPU' OR [component_type] = 'RAM' OR [component_type] = 'CPU'),
    quantity             int default 1 not null
        constraint CK_pc_build_components_quantity
            check ([quantity] > 0)
)
go

create table dbo.product_categories
(
    product_id  bigint not null
        constraint FK_product_categories_product
            references dbo.products
            on delete cascade,
    category_id bigint not null
        constraint FK_product_categories_category
            references dbo.categories
            on delete cascade,
    primary key (product_id, category_id)
)
go

create table dbo.product_images
(
    id           bigint identity
        primary key,
    product_id   bigint        not null
        constraint FK_product_images_product
            references dbo.products
            on delete cascade,
    image_url    varchar(1000) not null,
    is_thumbnail bit default 0 not null,
    sort_order   int default 0 not null
)
go

create table dbo.provinces
(
    id   bigint identity
        primary key,
    code varchar(20)   not null
        unique,
    name nvarchar(150) not null,
    type varchar(30)
)
go

create table dbo.districts
(
    id          bigint identity
        primary key,
    code        varchar(20)   not null
        unique,
    name        nvarchar(150) not null,
    province_id bigint        not null
        constraint FK_district_province
            references dbo.provinces
)
go

create table dbo.psu_specs
(
    product_id        bigint      not null
        primary key
        constraint FK_psu_specs_product
            references dbo.products
            on delete cascade,
    wattage           int         not null,
    efficiency_rating varchar(30) not null,
    modular_type      varchar(30) not null,
    form_factor       varchar(30) not null
)
go

create table dbo.ram_specs
(
    product_id   bigint        not null
        primary key
        constraint FK_ram_specs_product
            references dbo.products
            on delete cascade,
    capacity_gb  int           not null,
    memory_type  varchar(20)   not null,
    speed_mhz    int           not null,
    module_count int default 1 not null,
    voltage      decimal(5, 2)
)
go

create table dbo.roles
(
    id   bigint identity
        primary key,
    name varchar(50) not null
        unique
)
go

create table dbo.speaker_specs
(
    product_id         bigint        not null
        primary key
        constraint FK_speaker_specs_product
            references dbo.products
            on delete cascade,
    speaker_type       varchar(50)   not null,
    channels           varchar(20)   not null,
    power_watt         decimal(6, 2) not null
        constraint CK_speaker_power
            check ([power_watt] IS NULL OR [power_watt] > 0),
    frequency_response varchar(50),
    impedance_ohm      decimal(6, 2)
        constraint CK_speaker_impedance
            check ([impedance_ohm] IS NULL OR [impedance_ohm] > 0),
    connection         varchar(100)  not null,
    bluetooth_version  varchar(20),
    rgb                bit           not null
)
go

create table dbo.ssd_specs
(
    product_id     bigint      not null
        primary key
        constraint FK_ssd_specs_product
            references dbo.products
            on delete cascade,
    capacity_gb    int         not null,
    interface      varchar(50) not null,
    form_factor    varchar(50) not null,
    read_speed_mb  int         not null,
    write_speed_mb int         not null,
    nand_type      varchar(50)
)
go

create table dbo.users
(
    id         bigint identity
        primary key,
    username   varchar(100)                    not null
        unique,
    email      varchar(150)                    not null
        unique,
    password   varchar(255)                    not null,
    full_name  nvarchar(150),
    phone      varchar(20),
    enabled    bit       default 1             not null,
    created_at datetime2 default sysdatetime() not null,
    updated_at datetime2
)
go

create table dbo.carts
(
    id         bigint identity
        primary key,
    user_id    bigint                          not null
        constraint UQ_carts_user
            unique
        constraint FK_carts_user
            references dbo.users
            on delete cascade,
    created_at datetime2 default sysdatetime() not null,
    updated_at datetime2 default sysdatetime() not null
)
go

create table dbo.cart_items
(
    id         bigint identity
        primary key,
    cart_id    bigint                          not null
        constraint FK_cart_items_cart
            references dbo.carts
            on delete cascade,
    product_id bigint                          not null
        constraint FK_cart_items_product
            references dbo.products,
    quantity   int       default 1             not null
        constraint CK_cart_items_quantity
            check ([quantity] > 0),
    created_at datetime2 default sysdatetime() not null,
    constraint UQ_cart_items_product
        unique (cart_id, product_id)
)
go

create table dbo.user_roles
(
    user_id bigint not null
        constraint FK_user_roles_user
            references dbo.users,
    role_id bigint not null
        constraint FK_user_roles_role
            references dbo.roles,
    primary key (user_id, role_id)
)
go

create table dbo.vouchers
(
    id               bigint identity
        primary key,
    code             varchar(50)                          not null
        constraint UQ_vouchers_code
            unique,
    name             nvarchar(150)                        not null,
    discount_amount  decimal(18, 2)                       not null
        constraint CK_vouchers_discount
            check ([discount_amount] > 0),
    min_order_amount decimal(18, 2) default 0             not null
        constraint CK_vouchers_min_order
            check ([min_order_amount] >= 0),
    start_date       datetime2                            not null,
    end_date         datetime2                            not null,
    quantity         int            default 0             not null
        constraint CK_vouchers_quantity
            check ([quantity] >= 0),
    status           bit            default 1             not null,
    created_at       datetime2      default sysdatetime() not null,
    constraint CK_vouchers_date
        check ([end_date] > [start_date])
)
go

create table dbo.orders
(
    id               bigint identity
        primary key,
    order_code       varchar(50)                            not null
        constraint UQ_orders_order_code
            unique,
    user_id          bigint                                 not null
        constraint FK_orders_user
            references dbo.users,
    receiver_name    nvarchar(150)                          not null,
    receiver_phone   varchar(20)                            not null,
    shipping_address nvarchar(500)                          not null,
    subtotal         decimal(18, 2)                         not null
        constraint CK_orders_subtotal
            check ([subtotal] >= 0),
    shipping_fee     decimal(18, 2) default 0               not null
        constraint CK_orders_shipping_fee
            check ([shipping_fee] >= 0),
    total_amount     decimal(18, 2)                         not null
        constraint CK_orders_total_amount
            check ([total_amount] >= 0),
    status           nvarchar(30)   default N'Chờ xác nhận' not null
        constraint CK_orders_status
            check ([status] = N'Đã hủy' OR [status] = N'Đã giao hàng' OR [status] = N'Đang giao hàng' OR
                   [status] = N'Đang chuẩn bị hàng' OR [status] = N'Chờ xác nhận'),
    created_at       datetime2      default sysdatetime()   not null,
    updated_at       datetime2      default sysdatetime()   not null,
    voucher_id       bigint
        constraint FK_orders_voucher
            references dbo.vouchers,
    discount_amount  decimal(18, 2) default 0               not null
        constraint CK_orders_discount_amount
            check ([discount_amount] >= 0)
)
go

create table dbo.order_items
(
    id         bigint identity
        primary key,
    order_id   bigint         not null
        constraint FK_order_items_order
            references dbo.orders
            on delete cascade,
    product_id bigint         not null
        constraint FK_order_items_product
            references dbo.products,
    quantity   int            not null
        constraint CK_order_items_quantity
            check ([quantity] > 0),
    unit_price decimal(18, 2) not null
        constraint CK_order_items_price
            check ([unit_price] >= 0)
)
go

create table dbo.wards
(
    id          bigint identity
        primary key,
    code        varchar(20)   not null
        unique,
    name        nvarchar(150) not null,
    district_id bigint        not null
        constraint FK_ward_district
            references dbo.districts
)
go

create table dbo.user_addresses
(
    id             bigint identity
        primary key,
    user_id        bigint                          not null
        constraint FK_address_user
            references dbo.users,
    receiver_name  nvarchar(150)                   not null,
    receiver_phone varchar(20)                     not null,
    province_id    bigint                          not null
        constraint FK_address_province
            references dbo.provinces,
    district_id    bigint                          not null
        constraint FK_address_district
            references dbo.districts,
    ward_id        bigint                          not null
        constraint FK_address_ward
            references dbo.wards,
    address_detail nvarchar(255)                   not null,
    is_default     bit       default 0             not null,
    created_at     datetime2 default sysdatetime() not null
)
go


