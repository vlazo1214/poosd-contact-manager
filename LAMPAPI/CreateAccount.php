<?php
	$inData = getRequestInfo();
	
	$password = $inData["password"];
	$login = $inData["login"];
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];

  //echo ("Before Connection");
  //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  //echo ("After Report");
	//$conn = new mysqli("localhost", "root", "*42Miles", "COP4331");
//  $conn = mysqli_connect("127.0.0.1", "root", "", "COP4331")
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
  //echo ("Connection RA");
	if ($conn->connect_error) 
	{
    echo ("Connection Error");
		returnWithError( $conn->connect_error );
	} 
	else
	{
    echo ("not Connection Error");
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
   // $stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);
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