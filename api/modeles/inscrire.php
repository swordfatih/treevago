<?php
    function inscrire($data) 
	{
		require('./modeles/connect.php');
		
		try {
			require('./modeles/lire_profil.php');

			if(get_profil_by_email($data['email']) != null)
				return false;

			$stmt = $pdo->prepare('INSERT INTO `utilisateur` (`prenom`, `nom`, `num`, `email`, `role`) VALUES (:prenom, :nom, :num, :email, :role);');
			$stmt->bindParam('prenom', $data['prenom'], PDO::PARAM_STR);
			$stmt->bindParam('nom', $data['nom'], PDO::PARAM_STR);
			$stmt->bindParam('num', $data['num'], PDO::PARAM_STR);
			$stmt->bindParam('email', $data['email'], PDO::PARAM_STR);
			$stmt->bindParam('role', $data['role'], PDO::PARAM_STR);

			$stmt->execute();

			$_SESSION["profil"] = get_profil_by_email($data['email']);

			return true;
		} catch( PDOException $e ) {
			echo "Erreur SQL :", $e->getMessage();
		}

		return false;
	}  
?>