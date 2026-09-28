let items = JSON.parse(localStorage.getItem("items")) || [];

// LOGIN
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("loginMessage");

    if (username === "admin" && password === "1234") {
        document.getElementById("loginPage").classList.add("d-none");
        document.getElementById("appPage").classList.remove("d-none");

        message.innerText = "";

        displayItems();
        updateDashboard();
    } else {
        message.innerText = "Invalid username or password";
    }
}

// LOGOUT
function logout() {
    document.getElementById("appPage").classList.add("d-none");
    document.getElementById("loginPage").classList.remove("d-none");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

// SAVE DATA
function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
}

// REPORT LOST ITEM
function reportLost() {
    const name = document.getElementById("lostName").value.trim();
    const category = document.getElementById("lostCategory").value;
    const location = document.getElementById("lostLocation").value.trim();
    const date = document.getElementById("lostDate").value;
    const description = document.getElementById("lostDescription").value.trim();
    const contact = document.getElementById("lostContact").value.trim();

    if (name === "" || category === "" || location === "" || date === "") {
        alert("Please fill all required fields.");
        return;
    }

    const item = {
        id: Date.now(),
        type: "Lost",
        name: name,
        category: category,
        location: location,
        date: date,
        description: description,
        contact: contact,
        status: "Lost"
    };

    items.push(item);
    saveItems();

    alert("Lost item reported successfully!");

    clearLostForm();
    displayItems();
    updateDashboard();
}

// REPORT FOUND ITEM
function reportFound() {
    const name = document.getElementById("foundName").value.trim();
    const category = document.getElementById("foundCategory").value;
    const location = document.getElementById("foundLocation").value.trim();
    const date = document.getElementById("foundDate").value;
    const description = document.getElementById("foundDescription").value.trim();
    const contact = document.getElementById("foundContact").value.trim();

    if (name === "" || category === "" || location === "" || date === "") {
        alert("Please fill all required fields.");
        return;
    }

    const item = {
        id: Date.now(),
        type: "Found",
        name: name,
        category: category,
        location: location,
        date: date,
        description: description,
        contact: contact,
        status: "Found"
    };

    items.push(item);
    saveItems();

    alert("Found item reported successfully!");

    clearFoundForm();
    displayItems();
    updateDashboard();
}

// DISPLAY ITEMS
function displayItems(list = items) {
    const container = document.getElementById("itemsList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML =
            '<p class="text-muted">No items found.</p>';
        return;
    }

    list.forEach(function(item) {
        const badge = item.type === "Lost" ? "danger" : "success";

        let claimButton = "";

        if (item.type === "Found" && item.status === "Found") {
            claimButton =
                '<button class="btn btn-warning btn-sm" onclick="claimItem(' +
                item.id +
                ')">Claim Item</button>';
        }

        container.innerHTML +=
            '<div class="card mb-3 shadow-sm">' +
                '<div class="card-body">' +

                    '<div class="d-flex justify-content-between align-items-center">' +
                        '<h5 class="mb-2">' + escapeHTML(item.name) + '</h5>' +
                        '<span class="badge bg-' + badge + '">' +
                            escapeHTML(item.type) +
                        '</span>' +
                    '</div>' +

                    '<p class="mb-1"><strong>Category:</strong> ' +
                        escapeHTML(item.category) +
                    '</p>' +

                    '<p class="mb-1"><strong>Location:</strong> ' +
                        escapeHTML(item.location) +
                    '</p>' +

                    '<p class="mb-1"><strong>Date:</strong> ' +
                        escapeHTML(item.date) +
                    '</p>' +

                    '<p class="mb-1"><strong>Description:</strong> ' +
                        escapeHTML(item.description) +
                    '</p>' +

                    '<p class="mb-2"><strong>Status:</strong> ' +
                        escapeHTML(item.status) +
                    '</p>' +

                    claimButton +

                '</div>' +
            '</div>';
    });
}

// SEARCH ITEMS
function searchItems() {
    const input = document.getElementById("searchInput");

    if (!input) {
        return;
    }

    const searchText = input.value.toLowerCase().trim();

    const filteredItems = items.filter(function(item) {
        return (
            item.name.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText)
        );
    });

    displayItems(filteredItems);
}

// CLAIM ITEM
function claimItem(id) {
    const item = items.find(function(item) {
        return item.id === id;
    });

    if (!item) {
        alert("Item not found.");
        return;
    }

    if (item.status !== "Found") {
        alert("This item cannot be claimed.");
        return;
    }

    item.status = "Returned";

    saveItems();

    alert("Item claimed successfully!");

    displayItems();
    updateDashboard();
}

// UPDATE DASHBOARD
function updateDashboard() {
    const lostCount = items.filter(function(item) {
        return item.type === "Lost";
    }).length;

    const foundCount = items.filter(function(item) {
        return item.type === "Found";
    }).length;

    const returnedCount = items.filter(function(item) {
        return item.status === "Returned";
    }).length;

    const lostElement = document.getElementById("lostCount");
    const foundElement = document.getElementById("foundCount");
    const returnedElement = document.getElementById("returnedCount");

    if (lostElement) {
        lostElement.innerText = lostCount;
    }

    if (foundElement) {
        foundElement.innerText = foundCount;
    }

    if (returnedElement) {
        returnedElement.innerText = returnedCount;
    }
}

// CLEAR LOST FORM
function clearLostForm() {
    document.getElementById("lostName").value = "";
    document.getElementById("lostCategory").value = "";
    document.getElementById("lostLocation").value = "";
    document.getElementById("lostDate").value = "";
    document.getElementById("lostDescription").value = "";
    document.getElementById("lostContact").value = "";
}

// CLEAR FOUND FORM
function clearFoundForm() {
    document.getElementById("foundName").value = "";
    document.getElementById("foundCategory").value = "";
    document.getElementById("foundLocation").value = "";
    document.getElementById("foundDate").value = "";
    document.getElementById("foundDescription").value = "";
    document.getElementById("foundContact").value = "";
}

// SECURITY HELPER
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", function() {
    updateDashboard();
});