<?php
	$inData = getRequestInfo();

  $userId = $inData["userId"];
	$groupId = $inData["groupId"];
  $searchResults = '{"list" : [';
  $searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
   //echo ("Here1");
   if($groupId == 0){

    $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email from Contacts where UserID=? and GroupID is NULL;");
    $stmt->bind_param("i", $userId);
    } else {
       $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email from Contacts where UserID=? and GroupID=?;");
        $stmt->bind_param("ii", $userId, $groupId);
   }
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName" : "' . $row["FirstName"] . '",' . '"LastName" : "' . $row["LastName"] . '",' . '"Phone" : "' . $row["Phone"] . '", "Email" : ' . '"' . $row["Email"] . '"}';
      }

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found UserId:" . $userId . " GroupId: " . $groupId );
		}
		else
		{
      $searchResults .= ']}';
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
