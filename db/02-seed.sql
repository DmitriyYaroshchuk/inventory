SET NAMES utf8mb4;

INSERT INTO orders (id, title, description, date) VALUES
  (1, 'Приход 1: офисные мониторы и периферия', 'Закупка для офиса, партия №1', '2017-06-29 12:09:33'),
  (2, 'Приход 2: ноутбуки', 'Ноутбуки для отдела разработки', '2017-09-06 10:15:00'),
  (3, 'Приход 3: смартфоны и аксессуары', 'Тестовые устройства для QA', '2017-04-06 16:40:12');

INSERT INTO products (id, order_id, serial_number, is_new, photo, title, type, specification, guarantee_start, guarantee_end, date, price) VALUES
  (1, 1, 1234, 1, 'monitor.png', 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Monitors', 'Specification 1', '2017-06-29 12:09:33', '2019-06-29 12:09:33', '2017-06-29 12:09:33', '[{"value": 100, "symbol": "USD", "isDefault": 0},{"value": 2600, "symbol": "UAH", "isDefault": 1}]'),
  (2, 1, 1235, 1, 'monitor.png', 'Dell UltraSharp U2720Q 27"', 'Monitors', '4K IPS, USB-C', '2017-06-29 12:09:33', '2020-06-29 12:09:33', '2017-06-29 12:09:33', '[{"value": 450, "symbol": "USD", "isDefault": 0},{"value": 11700, "symbol": "UAH", "isDefault": 1}]'),
  (3, 1, 1236, 0, 'monitor.png', 'LG 24MK430H 24"', 'Monitors', 'Full HD IPS', '2017-06-29 12:09:33', '2018-06-29 12:09:33', '2017-06-29 12:09:33', '[{"value": 120, "symbol": "USD", "isDefault": 0},{"value": 3120, "symbol": "UAH", "isDefault": 1}]'),
  (4, 1, 2001, 1, 'monitor.png', 'Logitech MX Keys', 'Keyboards', 'Беспроводная, подсветка', '2017-06-29 12:09:33', '2019-06-29 12:09:33', '2017-06-29 12:09:33', '[{"value": 110, "symbol": "USD", "isDefault": 0},{"value": 2860, "symbol": "UAH", "isDefault": 1}]'),
  (5, 1, 2002, 1, 'monitor.png', 'Logitech MX Master 3', 'Mice', 'Беспроводная мышь', '2017-06-29 12:09:33', '2019-06-29 12:09:33', '2017-06-29 12:09:33', '[{"value": 95, "symbol": "USD", "isDefault": 0},{"value": 2470, "symbol": "UAH", "isDefault": 1}]'),
  (6, 2, 3001, 1, 'monitor.png', 'Lenovo ThinkPad T14', 'Laptops', 'Ryzen 7, 16 GB, 512 GB SSD', '2017-09-06 10:15:00', '2020-09-06 10:15:00', '2017-09-06 10:15:00', '[{"value": 1200, "symbol": "USD", "isDefault": 0},{"value": 31200, "symbol": "UAH", "isDefault": 1}]'),
  (7, 2, 3002, 1, 'monitor.png', 'Apple MacBook Pro 14"', 'Laptops', 'M3 Pro, 18 GB, 512 GB SSD', '2017-09-06 10:15:00', '2019-09-06 10:15:00', '2017-09-06 10:15:00', '[{"value": 2400, "symbol": "USD", "isDefault": 0},{"value": 62400, "symbol": "UAH", "isDefault": 1}]'),
  (8, 2, 3003, 0, 'monitor.png', 'ASUS ZenBook 14', 'Laptops', 'Core i5, 8 GB, 256 GB SSD', '2017-09-06 10:15:00', '2018-09-06 10:15:00', '2017-09-06 10:15:00', '[{"value": 650, "symbol": "USD", "isDefault": 0},{"value": 16900, "symbol": "UAH", "isDefault": 1}]'),
  (9, 2, 1237, 1, 'monitor.png', 'Samsung Odyssey G5 27"', 'Monitors', 'QHD, 144 Hz', '2017-09-06 10:15:00', '2020-09-06 10:15:00', '2017-09-06 10:15:00', '[{"value": 320, "symbol": "USD", "isDefault": 0},{"value": 8320, "symbol": "UAH", "isDefault": 1}]'),
  (10, 3, 4001, 1, 'monitor.png', 'iPhone 15', 'Phones', '128 GB', '2017-04-06 16:40:12', '2019-04-06 16:40:12', '2017-04-06 16:40:12', '[{"value": 800, "symbol": "USD", "isDefault": 0},{"value": 20800, "symbol": "UAH", "isDefault": 1}]'),
  (11, 3, 4002, 1, 'monitor.png', 'Samsung Galaxy S24', 'Phones', '256 GB', '2017-04-06 16:40:12', '2019-04-06 16:40:12', '2017-04-06 16:40:12', '[{"value": 750, "symbol": "USD", "isDefault": 0},{"value": 19500, "symbol": "UAH", "isDefault": 1}]'),
  (12, 3, 2003, 1, 'monitor.png', 'Keychron K2', 'Keyboards', 'Механическая, 75%', '2017-04-06 16:40:12', '2019-04-06 16:40:12', '2017-04-06 16:40:12', '[{"value": 90, "symbol": "USD", "isDefault": 0},{"value": 2340, "symbol": "UAH", "isDefault": 1}]');
