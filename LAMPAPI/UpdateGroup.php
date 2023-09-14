<?php
	$inData = getRequestInfo();

  $groupName = $inData["groupName"];
  $groupColor = $inData["groupColor"];
  $groupId = $inData["groupId"];
  $userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    $stmt = $conn->prepare("UPDATE Contacts SET GroupName=?, GroupColor=? where GroupID=? and UserID=?");
    $stmt->bind_param("ssssii", $groupName, $groupColor, $groupId, $userId);
		$stmt->execute();
    
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
