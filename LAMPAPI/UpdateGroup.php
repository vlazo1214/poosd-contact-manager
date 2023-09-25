<?php
	$inData = getRequestInfo();

  $groupName = $inData["groupName"];
  $groupColor = $inData["groupColor"];
  $groupId = $inData["groupId"];
  $groupColor = (int)$groupColor;
  $groupId = (int)$groupId;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    $stmt = "UPDATE UserGroups SET GroupName='$groupName', GroupColor='$groupColor' WHERE GroupID='$groupId';";
		$conn->query($stmt);
		$conn->close();
    returnWithInfo($inData, "");
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

	function returnWithInfo($data, $err )
	{
	  $retValue = '{"id":"' .$data['groupId']. '","groupName":"' .$data['groupName']. '","groupColor":"' .$data['groupColor']. '","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>