<?php
include 'db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

$sql = "SELECT id, title, description, date FROM events ORDER BY date ASC";
$result = $conn->query($sql);

$events = [];

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    array_push($events, $row);
  }
  echo json_encode($events);
} else {
  echo json_encode(['message' => 'No events found']);
}

$conn->close();
?>
