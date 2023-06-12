<?php
// Database connection details
$host = 'localhost';
$user = 'kwang';
$pw = '1234';
$dbName = 'test';

// Create a new mysqli instance
$mysqli = new mysqli($host, $user, $pw, $dbName);

// Check for connection errors
if ($mysqli->connect_errno) {
    die("Failed to connect to MySQL: " . $mysqli->connect_error);
}

// Retrieve the POST data
$id = $_POST['id'];
$password = $_POST['password'];
$email = $_POST['email'];

// Prepare the SQL statement
$stmt = $mysqli->prepare("INSERT INTO login (id, password, email) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $id, $password, $email);

// Execute the statement
if ($stmt->execute()) {
    echo "Registration successful";
} else {
    echo "Registration failed";
}

// Close the statement and database connection
$stmt->close();
$mysqli->close();
?>
