const urlBase = "LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function createAccount() {
	let firstNameElement = document.getElementById("first-name").value;
	let lastNameElement = document.getElementById("last-name").value;
	let loginElement = document.getElementById("user-name").value;
	let passwordElement = document.getElementById("password").value;

	let newUserData = {
		firstName: firstNameElement,
		lastName: lastNameElement,
		login: loginElement,
		password: passwordElement
	};

	let url = urlBase + "/CreateAccount." + extension;

	let newUser = new XMLHttpRequest();
	newUser.open("POST", url);
	newUser.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		console.log("lol");
		newUser.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				let userObj = JSON.parse(newUser.responseText);
				console.log("HEYYYY:" + userObj);
			}
		};
		newUserJSON = JSON.stringify(newUserData);
		console.log(newUserJSON);
		newUser.send(newUserJSON);
	} catch (err) {
		console.log("err:" + err);
	}
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	let tmp = { login: login, password: password };

	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload)

	let url = urlBase + "/Login." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		console.log("yo")
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				console.log("yo2")
				if (userId < 1) {
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "color.html";
			}
		};
		console.log("yo3")
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + minutes * 60 * 1000);
	document.cookie =
		"firstName=" +
		firstName +
		",lastName=" +
		lastName +
		",userId=" +
		userId +
		";expires=" +
		date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	} else {
		document.getElementById("userName").innerHTML =
			"Welcome " + firstName + " " + lastName + " to Spider Society!";
	}
}

function logCookie() {
	let uId = document.cookie.split("=")
	return uId[3]
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {
	let fName = document.getElementById("fName").value;
	let lName = document.getElementById("lName").value;
	let phoneNum = document.getElementById("phoneNumber").value;
	let email = document.getElementById("email").value;
	let str = ""

	userId = logCookie()

	let tmp = { firstName: fName, lastName: lName, phoneNumber: phoneNum, email: email, groupId: null, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/AddContact." + extension;

	let xhr = new XMLHttpRequest();
	// xhr.oncomplete = function () {
	// 	str = reloadTableStr()
	// 	document.getElementById("contactsTable").innerHTML = str
	// }
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("contact has been added!")
				getContacts();
				clearValues();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log("ERR: " + err)
	}


}

function editContact() {
	let url = urlBase + "/UpdateContact." + extension

	let contactId = document.getElementById("cId").value
	console.log("CONTACT ID: " + contactId)
	let firstName = document.getElementById("contactFName").value
	let lastName = document.getElementById("contactLName").value
	let email = document.getElementById("contactEmail").value
	let phone = document.getElementById("contactPhoneNum").value

	let payload = { contactId: contactId, firstName: firstName, lastName: lastName, email: email, phone: phone, groupId: null }
	let jsonPayload = JSON.stringify(payload)

	let xhr = new XMLHttpRequest()
	xhr.open("POST", url, true)
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contact Edited!")
				getContacts();
			}
		}
		xhr.send(jsonPayload)
	} catch (err) {
		console.log(err)
	}
}

function deleteContact(contact) {
	let url = urlBase + "/DeleteContact." + extension
	let payload = { ID: contact }
	let jsonPayload = JSON.stringify(payload)

	let xhr = new XMLHttpRequest()
	xhr.open("POST", url, true)
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contact deleted")
				getContacts()
			}
		}

		xhr.send(jsonPayload)
	} catch (err) {
		console.log(err)
	}
}

function clearValues() {
	document.getElementById("fName").value = ""
	document.getElementById("lName").value = ""
	document.getElementById("email").value = ""
	document.getElementById("phoneNumber").value = ""
}

function prefillValues(contactID, contactF, contactL, contactE, contactP) {
	document.getElementById("cId").value = contactID
	document.getElementById("contactFName").value = contactF
	document.getElementById("contactLName").value = contactL
	document.getElementById("contactEmail").value = contactE
	document.getElementById("contactPhoneNum").value = contactP
}

function reloadTableStr() {
	let url = urlBase + "/RetrieveContacts." + extension;
	let tableStr = "";

	let userId = logCookie();
	let groupId = 0;
	let tmp = { userId: parseInt(userId), groupId: parseInt(groupId) };
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contacts retrieved!")
				console.log(JSON.parse(xhr.responseText))

				let resLen = JSON.parse(xhr.responseText).list.length
				let res = JSON.parse(xhr.responseText).list

				for (let i = 0; i < resLen; i++) {
					tableStr += '<tr id="' + res[i].ContactID + '" value="' + res[i].ContactID + '">'
					tableStr += "<td>" + (res[i].FirstName) + "</td>"
					tableStr += "<td>" + (res[i].LastName) + "</td>"
					tableStr += "<td>" + (res[i].Email) + "</td>"
					tableStr += "<td>" + (res[i].Phone) + "</td>"
					tableStr += '<td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" id="editButton' + i + '" onclick="prefillValues(\'' + res[i].ContactID + '\', \'' + res[i].FirstName + '\', \'' + res[i].LastName + '\', \'' + res[i].Email + '\', \'' + res[i].Phone + '\');">Edit</button><button id="deleteButton' + i + '" onclick="deleteContact(' + res[i].ContactID + ');getContacts();">Delete</button></td>'
					tableStr += "</tr>"
				}

				// console.log(tableStr)
			}
		};
		xhr.send(jsonPayload);
		return tableStr;
	} catch (err) {
		console.log("ERR:" + err);
	}
}

function getContacts() {
	let url = urlBase + "/RetrieveContacts." + extension;
	let tableStr = "";

	let userId = logCookie();
	let groupId = 0;
	let tmp = { userId: parseInt(userId), groupId: parseInt(groupId) };
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contacts retrieved!")
				console.log(JSON.parse(xhr.responseText))

				let obj = JSON.parse(xhr.responseText)

				// if (obj.error)
				// 	return;

				let res = JSON.parse(xhr.responseText).list
				let resLen = res.length

				for (let i = 0; i < resLen; i++) {
					tableStr += '<tr id="' + res[i].ContactID + '" value="' + res[i].ContactID + '">'
					tableStr += "<td>" + (res[i].FirstName) + "</td>"
					tableStr += "<td>" + (res[i].LastName) + "</td>"
					tableStr += "<td>" + (res[i].Email) + "</td>"
					tableStr += "<td>" + (res[i].Phone) + "</td>"
					tableStr += '<td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editModal" id="editButton' + i + '" onclick="prefillValues(\'' + res[i].ContactID + '\', \'' + res[i].FirstName + '\', \'' + res[i].LastName + '\', \'' + res[i].Email + '\', \'' + res[i].Phone + '\');">Edit</button><button type="button" class="btn btn-outline-danger" id="deleteButton' + i + '" onclick="deleteContact(' + res[i].ContactID + ');getContacts();">Delete</button></td>'
					tableStr += "</tr>"
				}

				console.log(tableStr)
				document.getElementById("contactsTable").innerHTML = tableStr
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log("ERR:" + err);
	}
}

// const toastTrigger = document.getElementById("realLoginBtn")
// const toastLiveExample = document.getElementById('liveToast')

// if (toastTrigger) {
// 	const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
// 	toastTrigger.addEventListener('click', () => {
// 		toastBootstrap.show()
// 	})
// }
