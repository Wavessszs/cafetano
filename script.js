

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

    const tax_value = document.getElementById("tax");
    tax_total = (subtotal * .12);
    tax_value.innerText = `₱ ${tax_total.toFixed(2)}`;

    const total_value = document.getElementById("total");
    total_total = subtotal + tax_total;
    total_value.innerText = `₱ ${total_total.toFixed(2)}`;


}

if (proceed_payment) {
    proceed_payment.addEventListener("click", function () {

        const saved_orders =
            JSON.parse(localStorage.getItem("orders")) || [];

        saved_orders.push(cart);

        localStorage.setItem(
            "orders",
            JSON.stringify(saved_orders)
        );

        console.log("Order saved:", cart);
        alert("order saved!");

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
                let total = 0;

                Object.keys(order).forEach(product_id => {

                    const product = products.find(
                        product => product.id == product_id
                    );

                    const quantity = order[product_id];

                    item_count += quantity;
                    total += product.price * quantity;

                });

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>#${order_index + 1}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>Takeout</td>
                    <td>${item_count}</td>
                    <td>₱${total.toFixed(2)}</td>
                    <td>Completed</td>
                    <td>
                        <button>View</button>
                    </td>
                `;

                orders_table.appendChild(row);
            });

        });
}