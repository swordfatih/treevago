/////////////////////////////////////////////////
// Globals
/////////////////////////////////////////////////
const opacite_par_defaut = 0.2;
let selection = null;

/////////////////////////////////////////////////
function creer_carte() {
    let map = L.map('carte').setView([48.856614, 2.3522219], 12);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'PING'}).addTo(map);
    return map;
}

/////////////////////////////////////////////////
function reinitialiser_selection(carte, selection) {
    if(selection != null) {
        carte.removeLayer(selection.marqueur);
        selection.marqueur = L.marker(selection.position, { opacity: opacite_par_defaut }).addTo(carte).bindPopup(selection.nom).openPopup();    
    }
}

/////////////////////////////////////////////////
function charger_parcs(carte) {
    return new Promise(function(resolve, reject) {
        get_parcs().then((data) => {
            let parcs = {};

            $.each(data['records'], function() {
                const parc = this['fields'];
                const nom = parc.nom_ev;

                let coordinates = parc.geom.coordinates[0][0];
                if(coordinates.length > 2) coordinates = coordinates[0];
                
                parcs[nom] = {};
                parcs[nom].nom = nom;
                parcs[nom].position = coordinates.reverse();
                parcs[nom].marqueur = L.marker(coordinates, { opacity: opacite_par_defaut }).addTo(carte).bindPopup(nom).openPopup();
            });

            resolve(parcs);
        }).catch((erreur) => {
            reject(erreur);
        });
    });
}

/////////////////////////////////////////////////
function parc_plus_proche(carte, utilisateur, parcs) {
    if(utilisateur.position == null || parcs == null) {
        alert(parcs == null ? "Veuillez attendre le chargement des parcs" : "Veuillez activer votre localisation ou attendre qu'elle soit déterminée");
        return;
    }

    let parc_min = null;
    for(let nom in parcs) {
        let x_parc = parcs[nom].position[0];
        let y_parc = parcs[nom].position[1];
        
        let x_user = utilisateur.position.latitude;
        let y_user = utilisateur.position.longitude;
        
        parcs[nom].distance = Math.sqrt(Math.pow(x_parc - x_user, 2) + Math.pow(y_parc - y_user, 2));

        if(!parc_min || parcs[nom].distance < parc_min.distance)
            parc_min = parcs[nom];
    }

    carte.removeLayer(parcs[parc_min.nom].marqueur);
    parcs[parc_min.nom].marqueur = L.marker(parc_min.position, { opacity: 1 }).addTo(carte).bindPopup(parc_min.nom).openPopup(); 
}

/////////////////////////////////////////////////
function marquer_parc(carte, parcs, ui) {
    if(parcs == null) {
        alert("Veuillez attendre le chargement des parcs");
        return;
    }

    reinitialiser_selection(carte, selection);

    let nom = document.getElementById(ui.draggable.attr('id')).getElementsByTagName('p')[0].innerHTML;
    carte.removeLayer(parcs[nom].marqueur);
    parcs[nom].marqueur = L.marker(parcs[nom].position, { opacity: 1 }).addTo(carte).bindPopup(parcs[nom].nom).openPopup();

    selection = parcs[nom];
}

/*
//Sur le click de la map, ajout d'un marqueur sur la carte avec le nom du pays
map.on('click', onClick);

function onClick(e) {
    //recherche le pays sur lequel on a click�
    //Requete AJAX pour r�cup�rer les infos du pays sur le point o� on a cliqu� (lati, longi) 
    $.ajax({
        type: 'GET',
        url: "http://nominatim.openstreetmap.org/reverse",
        dataType: 'jsonp',
        jsonpCallback: 'data',
        data: { format: "json", limit: 1,lat: e.latlng.lat,lon: e.latlng.lng,json_callback: 'data' },
        error: function(xhr, status, error) {
        alert("ERROR "+error);
        },
        success: function(data){
        //r�cup�rer les coordonn�es (lati, longi) du pays dans les donn�es json provenant du serveur
        var paysVisite="";
        $.each(data, function() {
            paysVisite = this['country'] ;
        });
        
        //affichage des infos
        L.marker(e.latlng).addTo(map).bindPopup("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng+" Pays : "+paysVisite).openPopup();
        L.circle(e.latlng, 1).addTo(map);			
        }
    });
}
*/