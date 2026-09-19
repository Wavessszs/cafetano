

let cart = {};
let all_products = [];
let saved_products = [];
let price_list = [];


let flag = true;
function add_product() {
    const modal = document.getElementById("add-product-modal");

    flag = !flag;

    if (!flag) {

        modal.style.display = "flex";
    }
    else {
        modal.style.display = "none";
    }
}

const product_grid = document.getElementById("product-grid");
const add_product_form = document.getElementById("add-product-form");
const cart_grid = document.getElementById("order-items");
const proceed_payment = document.getElementById("payment-button");



function renderProducts() {
    if (!product_grid) {
        return;
    }

    fetch("products.json")
        .then(response => response.json())
        .then(predefined_products => {

            saved_products =
                JSON.parse(localStorage.getItem("products")) || [];

            all_products = [
                ...predefined_products,
                ...saved_products
            ];

            product_grid.innerHTML = "";

            let actions = "";

            if (add_product_form) {
                actions = `
                    <div class="product-actions">
                        <button class="icon-button">✎</button>
                        <button class="icon-button">×</button>
                    </div>
                    `;
            }

            const product_cards = all_products.map(product => {

                const product_div = document.createElement("div");

                product_div.classList.add("product-admin-card");
                product_div.id = product.id;
                product_div.innerHTML = `
                    <div class="product-image-placeholder"></div>

                    <h1 style="display:none">${product.id}</h1> 

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    <p>${product.description}</p>

                    <div class="product-admin-footer">
                    <span class="product-price">₱${product.price}</span>

                    
                    ${actions}

                    </div>
                `;
                product_div.addEventListener("click", function () {
                    if (add_product_form) {
                        alert("olol");
                    }
                    else {
                        let product_id = this.id;

                        if (cart[product_id]) {
                            cart[product_id]++;
                        }
                        else {
                            cart[product_id] = 1;
                        }
                        console.log(cart);
                        renderCart();
                        computeSubtotal();

                    }
                });


                return product_div;
            });

            product_cards.forEach(card => {
                product_grid.appendChild(card);
            });
        });

}
function renderCart() {
    if (!cart_grid) {
        return;
    }

    const cart_card = Object.keys(cart).map(product_id => {
        cart_grid.innerHTML = "";

        const product = all_products.find(
            product => product.id == product_id
        );

        const quantity = cart[product_id];

        const cart_div = document.createElement("div");

        cart_div.innerHTML = `
                <h3>${product.name}</h3>
                <p>${quantity} × ₱${product.price}</p>
                <p>₱${product.price * quantity}</p>
            `;


        return cart_div;
    });
    cart_card.forEach(card => {
        cart_grid.appendChild(card);
    });

}

function computeSubtotal() {

    const discounttype = document.getElementById("discount-type").value;
    let discountamount = 0;

    switch (discounttype) {
        case "pwd":
            discountamount = 0.20;
            break;

        case "senior":
            discountamount = 0.20;
            break;

        case "student":
            discountamount = 0.10;
            break;

        case "none":
            discountamount = 0;
            break;
    }

    const product_price = Object.keys(cart).map(product_id => {
        const products_id = all_products.find(
            product => product.id == product_id
        );

        const quantity = cart[product_id];//quantty

        return products_id.price * quantity;//this is id of the price
    });
    //got the price already now the quanitty

    console.log(product_price);
    const subtotal = product_price.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
    console.log(subtotal);

    const subtotal_value = document.getElementById("subtotal");
    subtotal_value.innerText = `₱ ${subtotal.toFixed(2)}`;

    const discount_value = document.getElementById("discount");
    discount_subtotal = subtotal * discountamount;
    discount_value.innerText = `₱ ${discount_subtotal.toFixed(2)}`;

    beforetax = subtotal - discount_subtotal;

    const tax_value = document.getElementById("tax");
    tax_total = (beforetax * .12);
    tax_value.innerText = `₱ ${tax_total.toFixed(2)}`;

    const total_value = document.getElementById("total");
    total_total = (subtotal + tax_total) - discount_subtotal;
    total_value.innerText = `₱ ${total_total.toFixed(2)}`;
    return {
        subtotal: subtotal,
        discount: discount_subtotal,
        tax: tax_total,
        total: total_total
    };

}
if (proceed_payment) {
    proceed_payment.addEventListener("click", function () {

        const orderType =
            document.getElementById("order-type").value;

        const discountType =
            document.getElementById("discount-type").value;

        const totals = computeSubtotal();

        const order = {
            items: cart,
            date: new Date().toISOString(),
            type: orderType,
            discountType: discountType,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            status: "processing"
        };

        const savedOrders =
            JSON.parse(localStorage.getItem("orders")) || [];

        savedOrders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(savedOrders)
        );

        console.log("Order saved:", order);

        alert("Order saved!");
    });
}
if (add_product_form) {
    add_product_form.addEventListener("submit", function (event) {

        event.preventDefault();

        const product_name =
            document.getElementById("product-name").value;

        const category =
            document.getElementById("product-category").value;

        const price =
            document.getElementById("product-price").value;

        const description =
            document.getElementById("product-description").value;


        const new_product = {
            name: product_name,
            category: category,
            price: price,
            description: description
        };


        const saved_products =
            JSON.parse(localStorage.getItem("products")) || [];

        saved_products.push(new_product);

        localStorage.setItem(
            "products",
            JSON.stringify(saved_products)
        );


        renderProducts();

        add_product_form.reset();
    });
}

renderProducts();
const orders_table = document.getElementById("orders-table-body");

if (orders_table) {

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    fetch("products.json")
        .then(response => response.json())
        .then(products => {

            orders.forEach((order, order_index) => {

                let item_count = 0;

                Object.keys(order.items).forEach(product_id => {

                    const quantity = order.items[product_id];

                    item_count += quantity;

                });

                const row = document.createElement("tr");

                const order_date =
                    new Date(order.date).toLocaleDateString();

                row.innerHTML = `
                    <td>#${order_index + 1}</td>
                    <td>${order_date}</td>
                    <td>${order.type}</td>
                    <td>${item_count}</td>
                    <td>₱${order.total.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>${order.discountType}</td>
                `;

                orders_table.appendChild(row);

            });

        });

}
// =========================================
// REPORTS
// =========================================

const reportPeriod = document.getElementById("report-period");

const totalSalesValue = document.getElementById("total-sales");
const totalOrdersValue = document.getElementById("total-orders");
const averageOrderValue = document.getElementById("average-order");
const productsSoldValue = document.getElementById("products-sold");

const topProductsContainer =
    document.getElementById("top-products");

const categoryReportBody =
    document.getElementById("category-report-body");


function getReportOrders() {

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const period = reportPeriod.value;

    const now = new Date();

    return orders.filter(order => {

        const orderDate = new Date(order.date);

        // Ignore invalid dates
        if (isNaN(orderDate.getTime())) {
            return false;
        }

        if (period === "today") {

            return (
                orderDate.getFullYear() === now.getFullYear() &&
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getDate() === now.getDate()
            );

        }

        if (period === "week") {

            const startOfWeek = new Date(now);

            const day = startOfWeek.getDay();

            startOfWeek.setDate(
                startOfWeek.getDate() - day
            );

            startOfWeek.setHours(0, 0, 0, 0);

            return orderDate >= startOfWeek;

        }

        if (period === "month") {

            return (
                orderDate.getFullYear() === now.getFullYear() &&
                orderDate.getMonth() === now.getMonth()
            );

        }

        if (period === "year") {

            return (
                orderDate.getFullYear() === now.getFullYear()
            );

        }

        return true;
    });
}


function calculateReports() {

    if (!reportPeriod) {
        return;
    }

    const orders = getReportOrders();

    let totalSales = 0;
    let totalOrders = orders.length;
    let productsSold = 0;

    orders.forEach(order => {

        totalSales += Number(order.total) || 0;

        if (order.items) {

            Object.keys(order.items).forEach(product_id => {

                const quantity =
                    Number(order.items[product_id]) || 0;

                productsSold += quantity;
            });
        }
    });


    let averageOrder = 0;

    if (totalOrders > 0) {
        averageOrder = totalSales / totalOrders;
    }


    // =========================================
    // UPDATE STATISTICS
    // =========================================

    totalSalesValue.innerText =
        `₱${totalSales.toFixed(2)}`;

    totalOrdersValue.innerText =
        totalOrders;

    averageOrderValue.innerText =
        `₱${averageOrder.toFixed(2)}`;

    productsSoldValue.innerText =
        productsSold;


    // =========================================
    // TOP PRODUCTS
    // =========================================

    calculateTopProducts(orders);


    // =========================================
    // CATEGORY REPORT
    // =========================================

    calculateCategoryReport(orders);
}


function calculateTopProducts(orders) {

    topProductsContainer.innerHTML = "";

    const productSales = {};


    orders.forEach(order => {

        if (!order.items) {
            return;
        }

        Object.keys(order.items).forEach(product_id => {

            const quantity =
                Number(order.items[product_id]) || 0;

            if (!productSales[product_id]) {
                productSales[product_id] = 0;
            }

            productSales[product_id] += quantity;
        });
    });


    const productArray =
        Object.keys(productSales).map(product_id => {

            const product =
                all_products.find(
                    product => product.id == product_id
                );

            return {
                id: product_id,
                name: product
                    ? product.name
                    : `Product #${product_id}`,
                quantity: productSales[product_id]
            };
        });


    productArray.sort((a, b) => {
        return b.quantity - a.quantity;
    });


    const topProducts =
        productArray.slice(0, 5);


    if (topProducts.length === 0) {

        topProductsContainer.innerHTML = `
            <p>No sales data available.</p>
        `;

        return;
    }


    topProducts.forEach(product => {

        const productDiv =
            document.createElement("div");

        productDiv.classList.add("top-product");

        productDiv.innerHTML = `
            <div>
                <strong>${product.name}</strong>
            </div>

            <div>
                ${product.quantity} sold
            </div>
        `;

        topProductsContainer.appendChild(productDiv);
    });
}


function calculateCategoryReport(orders) {

    categoryReportBody.innerHTML = "";

    const categoryData = {};


    orders.forEach(order => {

        if (!order.items) {
            return;
        }


        Object.keys(order.items).forEach(product_id => {

            const quantity =
                Number(order.items[product_id]) || 0;


            const product =
                all_products.find(
                    product => product.id == product_id
                );


            if (!product) {
                return;
            }


            const category =
                product.category;


            if (!categoryData[category]) {

                categoryData[category] = {
                    orders: 0,
                    items: 0,
                    sales: 0
                };
            }


            categoryData[category].items += quantity;

            categoryData[category].sales +=
                Number(product.price) * quantity;
        });


        // Count this order once for every category it contains
        const categoriesInOrder = new Set();


        Object.keys(order.items).forEach(product_id => {

            const product =
                all_products.find(
                    product => product.id == product_id
                );

            if (product) {
                categoriesInOrder.add(product.category);
            }
        });


        categoriesInOrder.forEach(category => {

            if (categoryData[category]) {
                categoryData[category].orders++;
            }
        });
    });


    Object.keys(categoryData).forEach(category => {

        const data =
            categoryData[category];


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${category}</td>
            <td>${data.orders}</td>
            <td>${data.items}</td>
            <td>₱${data.sales.toFixed(2)}</td>
        `;


        categoryReportBody.appendChild(row);
    });


    if (Object.keys(categoryData).length === 0) {

        categoryReportBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No sales data available.
                </td>
            </tr>
        `;
    }
}


// =========================================
// REPORT PERIOD CHANGE
// =========================================

if (reportPeriod) {

    reportPeriod.addEventListener(
        "change",
        calculateReports
    );

    // Wait until products have loaded
    setTimeout(() => {
        calculateReports();
    }, 100);
}
const orderPanel = document.querySelector(".order-panel");

if (orderPanel) {

    orderPanel.addEventListener("click", function (event) {
        event.stopPropagation();
        orderPanel.classList.add("expanded");
    });

    document.addEventListener("click", function () {
        orderPanel.classList.remove("expanded");
    });

}