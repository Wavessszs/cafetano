# Cafetano — Coffee Shop POS Prototype

A browser-based coffee shop point-of-sale prototype built with vanilla JavaScript, HTML, and CSS. It provides a POS screen for selecting menu items, a cart and checkout summary, and separate pages for products, orders, and reports.

## Features

- **POS:** Load menu items from `products.json`, add items to an in-memory cart, and calculate order totals.
- **Discounts:** Apply the configured PWD, senior citizen, or student discount rates.
- **Tax calculation:** Calculate 12% tax after the selected discount.
- **Checkout:** Save an order record, including its items, order type, discount, totals, timestamp, and status, to browser `localStorage`.
- **Products:** Display predefined products and add new product records to `localStorage`.
- **Orders:** Read saved orders from `localStorage` and display transaction summaries.
- **Reports:** Aggregate locally saved orders by selected time period and calculate sales, order count, average order value, products sold, and product/category summaries.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- JSON
- Browser `localStorage`

No backend or database is included. Product additions and orders are stored in the current browser, so they are not shared between devices or users.

## Run locally

Because the application loads `products.json` with `fetch()`, run it through a local web server rather than opening the HTML files directly with a `file://` URL.

### Option 1: Python

From the project directory, run:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

### Option 2: VS Code

Open the folder in VS Code and use the Live Server extension to serve `index.html`.

## Project pages

- `index.html` — Point-of-sale screen.
- `products.html` — Product listing and add-product interface.
- `orders.html` — Saved order listing.
- `reports.html` — Sales and product summaries.
- `products.json` — Initial product catalog.
- `script.js` — Cart, checkout, product, order, and reporting logic.
- `style.css` — Application styling.

## Project status and limitations

This is a front-end learning project and prototype, not a production POS system. It does not provide server-side persistence, user authentication, inventory synchronization, or secure transaction processing. Data can be cleared when browser storage is cleared, and the reporting page depends on orders created in that same browser.

