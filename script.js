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
    localStorage.getItem("retoteLoggedIn");


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