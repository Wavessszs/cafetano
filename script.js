

let cart = {};
let all_products = [];
let saved_products = [];


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

