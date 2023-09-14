<?php
	$inData = getRequestInfo();

  $userId = $inData["userId"];
  $searchResults = "{";
  $searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    $stmt = $conn->prepare("SELECT GroupName, GroupColor from Contacts where UserID=? and GroupID is NULL");
    $stmt->bind_param("i", $userId);
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"GroupName" : "' . $row["groupName"] . '",' . '"GroupColor" : "' . $row["groupColor"] . '"}';
      }

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
     $searchResults.="}";
			sendResultInfoAsJson( $searchResults );
		}

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
