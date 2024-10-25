function submitData() {
    let rollno = document.getElementById("number").value;
    let name = document.getElementById("name").value.trim();
    let subject = document.getElementById("subject").value.trim();
    let storage = document.getElementById("storage").value;

    if (rollno === "" || name === "" || subject === "" || storage === "") {
        alert("Please fill the form properly!");
        return;
    }

    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    subject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();

    let existingData = [];

    if (storage === "localStorage") {
        existingData = JSON.parse(localStorage.getItem("students")) || [];
    }
    else if (storage === "SessionStorage") {
        existingData = JSON.parse(sessionStorage.getItem("students")) || [];
    }
    else if (storage === "cookies") {
        existingData = JSON.parse(getCookie("students") || "[]");
    }

    let existingStudentIndex = existingData.findIndex(student => student.rollno === rollno);
    if (existingStudentIndex !== -1) {
        alert("Roll No is already exist!")
    }
    else {
        existingData.push({
            rollno: rollno,
            name: name,
            subject: subject,
            storage: storage
        });
    }
    if (storage === "localStorage") {
        localStorage.setItem("students", JSON.stringify(existingData));
    } else if (storage === "SessionStorage") {
        sessionStorage.setItem("students", JSON.stringify(existingData));
    } else if (storage === "cookies") {
        setCookie("students", JSON.stringify(existingData), 1);
    }

    clearOutput();
    displayStoredData();
    clearInputFields();
}


function addDataToOutput(student) {
    let dataContainer = document.createElement("div");
    dataContainer.classList.add("data-item");

    dataContainer.innerHTML = `
        <p>Roll-No: ${student.rollno}</p>
        <p>Name: ${student.name}</p>
        <p>Subject: ${student.subject}</p>
        <p>Storage: ${student.storage}</p>
        <button onclick="editData(this)">Edit</button>
        <button onclick="deleteData(this)">Delete</button>
    `;
    document.getElementById("output-box").appendChild(dataContainer);
}


function displayStoredData() {
    let localData = JSON.parse(localStorage.getItem("students")) || [];
    localData.forEach(student => addDataToOutput(student));

    let sessionData = JSON.parse(sessionStorage.getItem("students")) || [];
    sessionData.forEach(student => addDataToOutput(student));

    let cookieData = JSON.parse(getCookie("students") || "[]");
    cookieData.forEach(student => addDataToOutput(student));
}

function addDataToOutput(student) {
    let dataContainer = document.createElement("div");
    dataContainer.classList.add("data-item");

    dataContainer.innerHTML = `
        <p>Roll-No: ${student.rollno}</p>
        <p>Name: ${student.name}</p>
        <p>Subject: ${student.subject}</p>
        <p>Storage: ${student.storage}</p>
        <button onclick="editData(this)">Edit</button>
        <button onclick="deleteData(this)">Delete</button>
    `;
    document.getElementById("output-box").appendChild(dataContainer);
}

function clearInputFields() {
    document.getElementById("number").value = "";
    document.getElementById("name").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("storage").value = "localStorage";
}

function clearOutput() {
    document.getElementById("output-box").innerHTML = ""; 
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function editData(button) {
    let dataItem = button.parentElement;

    let rollno = dataItem.querySelector("p:nth-child(1)").textContent.replace("Roll-No: ", "");
    let name = dataItem.querySelector("p:nth-child(2)").textContent.replace("Name: ", "");
    let subject = dataItem.querySelector("p:nth-child(3)").textContent.replace("Subject: ", "");
    let storage = dataItem.querySelector("p:nth-child(4)").textContent.replace("Storage: ", "");

    document.getElementById("number").value = rollno;
    document.getElementById("name").value = name;
    document.getElementById("subject").value = subject;
    document.getElementById("storage").value = storage;

    deleteData(dataItem.querySelector("button:nth-child(2)"));
}

function deleteData(button) {
    let dataItem = button.parentElement;
    let rollno = dataItem.querySelector("p:nth-child(1)").textContent.replace("Roll-No: ", "");

    dataItem.remove();
    updateStorageAfterDeletion(rollno);
}

function updateStorageAfterDeletion(rollno) {
    let storageTypes = ["localStorage", "SessionStorage", "cookies"];

    storageTypes.forEach(storage => {
        let existingData;
        if (storage === "localStorage") {
            existingData = JSON.parse(localStorage.getItem("students")) || [];
        } else if (storage === "SessionStorage") {
            existingData = JSON.parse(sessionStorage.getItem("students")) || [];
        } else if (storage === "cookies") {
            existingData = JSON.parse(getCookie("students") || "[]");
        }

        existingData = existingData.filter(student => student.rollno !== rollno);

        if (storage === "localStorage") {
            localStorage.setItem("students", JSON.stringify(existingData));
        } else if (storage === "SessionStorage") {
            sessionStorage.setItem("students", JSON.stringify(existingData));
        } else if (storage === "cookies") {
            setCookie("students", JSON.stringify(existingData), 1); 
        }
    });
}

window.onload = displayStoredData;



