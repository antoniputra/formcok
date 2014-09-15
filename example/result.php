<?php
echo "<pre>";
	echo "Web Owner : ";
	print_r( json_decode($_POST['web_owner']) );
echo "</pre>";

echo "<pre>";
	echo "Web Contact : ";
	print_r( json_decode($_POST['web_contact']) );
echo "</pre>";