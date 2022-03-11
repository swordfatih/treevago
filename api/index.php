<?php 
    session_start();

    // hypothèse 2 paramètres d'entrée, controle et action, avec l'url de index.php
    // exemple : index.php?controle=c1&action=a12
    if (isset($_GET['controle']) && isset($_GET['action'])) {
 	    $controle = $_GET['controle'];
	    $action = $_GET['action'];
	}
    else { //absence de paramètres : prévoir des valeurs par défaut
	    $controle = "utilisateur";
	    $action= "authentification";
	}
	
    //inclure le fichier php de contrôle 
    //et lancer la fonction-action issue de ce fichier.	

	$path = './controles/' . $controle . '.php';

	if (file_exists($path)) {
		$actions = require($path); 
		
		if(in_array($action, $actions))
			$action(); 
		else
			die("Service n'existe pas");	
	}
	else 
		die("Controle n'existe pas");
?>