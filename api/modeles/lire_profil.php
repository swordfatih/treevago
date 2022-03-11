<?php
    function get_profil_by_login($login) 
    {
        require('./modeles/connect.php');
		
		try {
			$stmt = $pdo->prepare('SELECT `id`, `login` FROM `utilisateur` WHERE login=:login;');
            $stmt->bindParam('login', $login, PDO::PARAM_STR);
            $stmt->execute();
            
            $resultat = $stmt->fetchAll();
            
            if(count($resultat) > 0) 
                return result_to_array($resultat);
		} catch( PDOException $e ) {
			echo "Erreur SQL :", $e->getMessage();
		}

		return null;
    }

    function get_profil_by_id($id) 
    {
        require('./modeles/connect.php');
		
		try {
			$stmt = $pdo->prepare('SELECT `id`, `login` FROM `utilisateur` WHERE login=:login;');
            $stmt->bindParam('id', $id, PDO::PARAM_STR);
            $stmt->execute();
            
            $resultat = $stmt->fetchAll();
            
            if(count($resultat) > 0) 
                return result_to_array($resultat);
		} catch( PDOException $e ) {
			echo "Erreur SQL :", $e->getMessage();
		}

		return null;
    }

    function result_to_array($resultat) 
    {
        $profil = array();
                
        $profil["id"] = $resultat[0]['id'];
        $profil["login"] = $resultat[0]['login'];
        
        return $profil;
    }
?>