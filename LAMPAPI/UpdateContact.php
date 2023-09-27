<?php
$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$groupId = $inData["groupId"];
$contactId = $inData["contactId"];
$userId = $inData["userId"];


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {

	$stmt = "UPDATE Contacts SET FirstName='$firstName', LastName='$lastName', Phone='$phone', Email='$email', GroupID=NULL WHERE ID='$contactId';";
	echo $stmt;

	if ($conn->query($stmt) === TRUE) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . $conn->error;
	}
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
	$retValue = '{"results":[' . $searchResults . '],"error":""}';
	sendResultInfoAsJson($retValue);
}

?>
