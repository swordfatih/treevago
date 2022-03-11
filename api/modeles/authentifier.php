<?php
    function authentifier($data) 
	{
		require('./modeles/connect.php');
		
		$stmt = $pdo->prepare('SELECT * FROM `utilisateur` WHERE login=:login AND mdp=:mdp;');
		$stmt->bindParam('login', $data['login'], PDO::PARAM_STR);
		$stmt->bindParam('mdp', $data['mdp'], PDO::PARAM_STR);
		$stmt->execute();
		
		$resultat = $stmt->fetchAll();
		
		if(count($resultat) > 0) 
		{
			require('./modeles/lire_profil.php');
			$_SESSION["profil"] = get_profil_by_login($data['login']);
			
			return true;
		}
		
		return false;
	}
?>