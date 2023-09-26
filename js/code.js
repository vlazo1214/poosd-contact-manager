const urlBase = "LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function createAccount() {
	let firstNameElement = document.getElementById("first-name").value;
	let lastNameElement = document.getElementById("last-name").value;
	let loginElement = document.getElementById("username").value;
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
		alert(newUserJSON);
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
	//	var hash = md5( password );

	// document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
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
					// document.getElementById("loginResult").innerHTML =
					// 	"User/Password combination incorrect";
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
			"Logged in as " + firstName + " " + lastName;
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

	userId = logCookie()

	//document.getElementById("colorAddResult").innerHTML = "";

	let tmp = { firstName: fName, lastName: lName, phoneNumber: phoneNum, email: email, groupId: null, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/AddContact." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("contact has been added!")
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log("ERR: " + err)
	}
}

function editContact() {
	let url = urlBase + "/UpdateContact." + extension

	let tr = document.querySelector("tr")
	let contactId = tr.closest('tr').value
	let firstName = document.getElementById("contactFName").value
	let lastName = document.getElementById("contactLName").value
	let email = document.getElementById("contactEmail").value
	let phone = document.getElementById("contactPhoneNum").value
	let groupId = 0

	let payload = { contactId: contactId, firstName: firstName, lastName: lastName, email: email, phone: phone, groupId: groupId }
	let jsonPayload = JSON.stringify(payload)

	let xhr = new XMLHttpRequest()
	xhr.open("POST", url, true)
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contact Edited!")
			}
		}
		xhr.send(jsonPayload)
	} catch (err) {
		console.log(err)
	}
}

function deleteContact(contact) {
	// make delete contact API request (POST)
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
			}
		}

		xhr.send(jsonPayload)
	} catch (err) {
		console.log(err)
	}
}

function prefillValues(contactF, contactL, contactE, contactP) {
	console.log("Hello")
	console.log(contactF)
	console.log(contactL)
	document.getElementById("contactFName").value = contactF
	document.getElementById("contactLName").value = contactL
	document.getElementById("contactEmail").value = contactE
	document.getElementById("contactPhoneNum").value = contactP
}

function searchColor() {
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchColors." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("colorSearchResult").innerHTML =
					"Color(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					colorList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("colorSearchResult").innerHTML = err.message;
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
				// document.getElementById("colorAddResult").innerHTML =
				// 	"Contact has been added";
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
					tableStr += '<td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" id="editButton' + i + '" onclick="prefillValues(\'' + res[i].FirstName + '\', \'' + res[i].LastName + '\', \'' + res[i].Email + '\', \'' + res[i].Phone + '\');">Edit</button><button id="deleteButton' + i + '" onclick="deleteContact(' + res[i].ContactID + ');getContacts();">Delete</button></td>'
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
