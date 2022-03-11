<?php 
    function inscription() {
        require("./modeles/inscrire.php");

        $profil = récuperer_profil();

        if($profil != null)
            header('Location: ./index.php?controle=utilisateur&action=accueil');

        $keys = array('prenom', 'nom', 'num', 'email', 'role');
        $data = recuperer_données($keys);

        if(count($data) == count($keys))
        {
            if(inscrire($data)) {
                $res = "<style> #res { color: green; }</style>Inscription effectué avec succès.";
                header('Location: ./index.php?controle=utilisateur&action=accueil');
            }

            $res = "<style> #res { color: red; }</style>Erreur lors de l'inscription.<br>Vous avez peut-être déjà un compte avec ce mail.";
        }
        
        require('./vues/layout/layout.tpl');
    }

    function authentification() {
        require('./modeles/authentifier.php');

        $profil = récuperer_profil();

        if($profil != null)
            die('Déjà connecté');
    
        $keys = array('login', 'mdp');
        $data = recuperer_données($keys);

        if(count($data) == count($keys))
        {
            if(authentifier($data))
            {
                die('success');
            }
        }

        die('error');
    }

    function deconnecter() {
        session_destroy(); 
        die('success');
    }

    function récuperer_profil() {
        return isset($_SESSION["profil"]) ? $_SESSION["profil"] : null; 
    }

    function recuperer_données($keys) {
        $data = array();

        foreach($keys as $key) 
            if(isset($_GET[$key])) {
                if($_GET[$key] != '')
                    $data[$key] = $_GET[$key];
            }	

        return $data;
    }

    return array('inscription', 'authentification', 'deconnecter');
?>