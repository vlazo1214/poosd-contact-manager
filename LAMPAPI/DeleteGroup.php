<?php
	$inData = getRequestInfo();
	
  $groupId = $inData["groupId"];
  
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
   // echo ("Connection Error");
		returnWithError( $conn->connect_error );
	} 
	else
	{
   // echo ("not Connection Error");
    
	 $stmt = $conn->prepare("DELETE FROM UserGroups WHERE GroupID=?");
	 $stmt->bind_param("i", $groupId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
	
?> 