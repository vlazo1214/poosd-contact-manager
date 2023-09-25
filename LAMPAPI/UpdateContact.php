<?php
	$inData = getRequestInfo();

  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $phone = $inData["phone"];
  $email = $inData["email"];
  $groupId = $inData["groupId"];
  $contactId = $inData["contactId"];
  $userId = $inData["userId"];
  $groupId = (int)$groupId;
  $contactId = (int)$contactId;
  $userId = (int)$userId;
  
  
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    $stmt = "UPDATE Contacts SET FirstName='$firstName', LastName='$lastName', Phone='$phone', Email='$email', GroupID='$groupId' WHERE ID='$contactId';";
    $conn->query($stmt);
     
	$conn->close();
    returnWithInfo($inData,"");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($data, $err )
	{
	  $retValue = '{"id":"' .$data['contactId']. '","firstName":"' .$data['firstName']. '","lastName":"' .$data['lastName']. '","phone":"' .$data['phone']. '","email":"' .$data['email']. '","groupId":' .$data['groupId']. ',"userId":' .$data['userId']. ',"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>