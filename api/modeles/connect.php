<?php
	$pdo = null;
	$hostname = "localhost";
	$bdd = "treevago";
	$username = "root";
	$password = "";

	try
	{
		$pdo = new PDO("mysql:host=$hostname;dbname=$bdd", $username, $password);   
		$pdo->query("SET NAMES 'utf8';");
	} catch( PDOException $e ) {
		echo "Erreur SQL :", $e->getMessage();
	}
?>