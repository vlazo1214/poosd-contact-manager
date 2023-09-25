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

	document.getElementById("loginResult").innerHTML = "";

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
					document.getElementById("loginResult").innerHTML =
						"User/Password combination incorrect";
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

// function addTd() {
// 	let newTd = document.createElement("tr")
// 	let firstNameTd = document.createElement("td")
// 	let lastNameTd = document.createElement("td")
// 	let emailTd = document.createElement("td")
// 	let phoneNumTd = document.createElement("td")
// 	let groupTd = document.createElement("td")
// 	newTd.appendChild()
// 	let table = document.getElementById("contacts-list")
// 	table.appendChild("td")
// }

// function removeTd() {

// }

function getContacts() {
	let url = urlBase + "/RetrieveContacts." + extension;
	let tableStr = ""
	// fetch(url)
	// 	.then(function (response) {
	// 		console.log("contacts: ", response.json())
	// 		return response.json()
	// 	})

	let userId = logCookie()
	let info = JSON.stringify({ userId: userId, groupId: null });

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				// document.getElementById("colorAddResult").innerHTML =
				// 	"Contact has been added";
				console.log("Contacts retrieved!")
				console.log(JSON.parse(xhr.responseText))
			}
		};
		xhr.send(info);

		//document.getElementById("contactsTable").innerHTML += tableStr
	} catch (err) {
		// document.getElementById("colorAddResult").innerHTML = err.message;
		console.log("ERR:" + err)
	}
}