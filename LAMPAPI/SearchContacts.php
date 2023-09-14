<?php

	$inData = getRequestInfo();

	$searchResults = "{";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{

		$firstName = "%" . $inData["searchFirstName"] . "%";
		$lastName = "%" . $inData["searchLastName"] . "%";
		if ($firstName == null) {
			$stmt = $conn->prepare("SELECT Name from Contacts where LastName like ? and UserID=?");
			$stmt->bind_param("ssi", $lastName, $inData["userId"]);
		}elseif ($lastName == null) {
			$stmt = $conn->prepare("SELECT Name from Contacts where FirstName like ? and UserID=?");
			$stmt->bind_param("si", $firstName, $inData["userId"]);
		}
		else{
			$stmt = $conn->prepare("SELECT Name from Contacts where FirstName like ? and LastName like ? and UserID=?");
			$stmt->bind_param("ssi", $firstName, $lastName, $inData["userId"]);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
