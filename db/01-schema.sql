-- Inventory: схема БД (MySQL 8)
-- Выполняется автоматически при первом старте контейнера mysql
-- (файлы из /docker-entrypoint-initdb.d запускаются по алфавиту).

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  description TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id        INT UNSIGNED NOT NULL,
  serial_number   INT UNSIGNED NOT NULL,
  is_new          TINYINT(1) NOT NULL DEFAULT 1,
  photo           VARCHAR(255) NULL,
  title           VARCHAR(255) NOT NULL,
  type            VARCHAR(100) NOT NULL,
  specification   TEXT NULL,
  guarantee_start DATETIME NOT NULL,
  guarantee_end   DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_type (type),
  KEY idx_products_order (order_id),
  CONSTRAINT fk_products_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Цены вынесены в отдельную таблицу: у продукта несколько валют (USD, UAH),
-- одна из них помечена как основная (is_default), как в app.js.
CREATE TABLE IF NOT EXISTS product_prices (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  value      DECIMAL(12,2) NOT NULL,
  symbol     CHAR(3) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_price_product_symbol (product_id, symbol),
  CONSTRAINT fk_prices_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
