const authScreen = document.getElementById("authScreen");
const mainWebsite = document.getElementById("mainWebsite");

const authForm = document.getElementById("authForm");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");

const nameGroup = document.getElementById("nameGroup");
const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const logoutButton = document.getElementById("logoutButton");


/* =========================================================
   AUTHENTICATION MODE
   ========================================================= */

let currentMode = "login";


/* =========================================================
   SHOW MAIN WEBSITE
   ========================================================= */

function showWebsite() {

    authScreen.style.display = "none";

    mainWebsite.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


/* =========================================================
   SHOW LOGIN SCREEN
   ========================================================= */

function showLoginScreen() {

    authScreen.style.display = "grid";

    mainWebsite.style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


/* =========================================================
   LOGIN / SIGN UP TAB
   ========================================================= */

loginTab.addEventListener("click", function () {

    currentMode = "login";

    loginTab.classList.add("active");

    signupTab.classList.remove("active");

    authTitle.textContent = "Welcome back";

    authButton.textContent = "Log in";

    nameGroup.style.display = "none";

    nameInput.required = false;

});


signupTab.addEventListener("click", function () {

    currentMode = "signup";

    signupTab.classList.add("active");

    loginTab.classList.remove("active");

    authTitle.textContent = "Create your account";

    authButton.textContent = "Create account";

    nameGroup.style.display = "block";

    nameInput.required = true;

});



/* =========================================================
   FORM SUBMISSION
   ========================================================= */

authForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    const name = nameInput.value.trim();


    /* Basic validation */

    if (email === "") {

        alert("Please enter your email.");

        return;

    }


    if (password === "") {

        alert("Please enter your password.");

        return;

    }


    if (currentMode === "signup" && name === "") {

        alert("Please enter your name.");

        return;

    }


    /*
       This is a front-end demo.

       It does NOT send your password anywhere.
       The login state is simply remembered
       in this browser.
    */

    localStorage.setItem(
        "toteshirtLoggedIn",
        "true"
    );


    localStorage.setItem(
        "toteshirtEmail",
        email
    );


    if (name !== "") {

        localStorage.setItem(
            "toteshirtName",
            name
        );

    }


    /* Open the actual website */

    showWebsite();

});



/* =========================================================
   LOG OUT
   ========================================================= */

logoutButton.addEventListener("click", function () {

    localStorage.removeItem(
        "toteshirtLoggedIn"
    );

    localStorage.removeItem(
        "toteshirtEmail"
    );

    localStorage.removeItem(
        "toteshirtName"
    );


    /* Reset form */

    authForm.reset();


    /* Return to login */

    showLoginScreen();


    /* Return to login mode */

    currentMode = "login";

    loginTab.classList.add("active");

    signupTab.classList.remove("active");

    authTitle.textContent = "Welcome back";

    authButton.textContent = "Log in";

    nameGroup.style.display = "none";

    nameInput.required = false;

});



/* =========================================================
   CHECK LOGIN WHEN WEBSITE OPENS
   ========================================================= */

const alreadyLoggedIn =
    localStorage.getItem("toteshirtLoggedIn");


if (alreadyLoggedIn === "true") {

    showWebsite();

} else {

    showLoginScreen();

}



/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);


            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

// =========================================================
// SHOP, CUSTOM ORDER REQUESTS, AND LOCAL REQUEST HISTORY
// =========================================================
const orderForm = document.getElementById("orderForm");
const orderType = document.getElementById("orderType");
const orderFeedback = document.getElementById("orderFeedback");
const orderHistory = document.getElementById("orderHistory");
const clearOrderHistory = document.getElementById("clearOrderHistory");

function readOrderHistory() {
    try { return JSON.parse(localStorage.getItem("toteshirtOrderRequests") || "[]"); }
    catch (error) { return []; }
}

function renderOrderHistory() {
    if (!orderHistory) return;
    const items = readOrderHistory();
    if (!items.length) {
        orderHistory.innerHTML = '<p class="empty-orders">No order requests prepared on this device yet.</p>';
        return;
    }
    orderHistory.innerHTML = items.map(item => (
        '<article class="order-history-card"><div><strong>' +
        escapeOrderText(item.product) + '</strong><p>' +
        escapeOrderText(item.date) + ' · Quantity: ' + Number(item.quantity) +
        '</p></div><span class="request-status">Email draft prepared</span></article>'
    )).join("");
}

function escapeOrderText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
}

document.querySelectorAll("[data-order-product]").forEach(button => {
    button.addEventListener("click", () => {
        if (orderType) orderType.selectedIndex = 0;
        const section = document.getElementById("custom");
        if (section) section.scrollIntoView({behavior: "smooth"});
        const nameField = document.getElementById("customerName");
        if (nameField) nameField.focus({preventScroll: true});
    });
});

if (orderForm) {
    orderForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(orderForm);
        const details = {
            name: String(formData.get("customerName") || "").trim(),
            email: String(formData.get("customerEmail") || "").trim(),
            product: String(formData.get("orderType") || ""),
            quantity: Math.max(1, Math.min(20, Number(formData.get("quantity")) || 1)),
            notes: String(formData.get("designNotes") || "").trim(),
            date: new Date().toLocaleDateString()
        };
        const requests = readOrderHistory();
        requests.unshift({product: details.product, quantity: details.quantity, date: details.date});
        try { localStorage.setItem("toteshirtOrderRequests", JSON.stringify(requests.slice(0, 20))); } catch (error) {}
        renderOrderHistory();

        const subject = "Tote Shirt order request — " + details.product;
        const body = [
            "Hello Tote Shirt,",
            "",
            "I'd like to request an order.",
            "Name: " + details.name,
            "Email: " + details.email,
            "Product: " + details.product,
            "Quantity: " + details.quantity,
            "Design notes: " + (details.notes || "None provided"),
            "",
            "Please confirm the details and final price before starting."
        ].join("\n");
        if (orderFeedback) orderFeedback.textContent = "Your email draft is being opened. Please review it and press Send to submit your request.";
        window.location.href = "mailto:toteshirtindia@gmail.com?subject=" +
            encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
}

if (clearOrderHistory) {
    clearOrderHistory.addEventListener("click", () => {
        localStorage.removeItem("toteshirtOrderRequests");
        renderOrderHistory();
    });
}
renderOrderHistory();
