<?php
$host = 'localhost';
$user = 'kwang';
$pw = '1234';
$dbName = 'test';
$mysqli = new mysqli($host, $user, $pw, $dbName);

// Get the values from the POST request
$id = $_POST['id'];
$id = $mysqli->real_escape_string($id);
$password = $_POST['password'];
$password = $mysqli->real_escape_string($password);

// Construct the SQL query
$sql = "SELECT * FROM adminlogin WHERE id = '$id' AND password = '$password'";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
  // Login successful
  echo "adminLogin successful!";
} else {
  // Login failed
  echo "Login failed!";
}

mysqli_close($mysqli);
?>
