// /api/records/1.0/search/?dataset=espaces_verts&q=&rows=10&facet=type_ev&facet=categorie&facet=adresse_codepostal&facet=presence_cloture&facet=ouvert_ferme&

function getLocation(map) {
    return new Promise(function(resolve, reject) {
        if(navigator.geolocation) 
            navigator.geolocation.getCurrentPosition(resolve, reject);
        else 
            reject("Geolocation non supportée par ce navigateur.");
    });
}

function charger_parcs(map) {
    return new Promise(function(resolve, reject) {
        let parcs = {};

        get_parcs().then((data) => {
            console.log(data['nhits']);

            $.each(data['records'], function() {
                const fields = this['fields'];
                const nom = fields.nom_ev;

                let coordinates = fields.geom.coordinates[0][0];
                
                if(coordinates.length > 2)
                    coordinates = coordinates[0];

                parcs[nom] = {};
                parcs[nom]['nom'] = nom;
                parcs[nom]['position'] = coordinates.reverse();
                parcs[nom]['marker'] = L.marker(coordinates, { opacity: 0.3 }).addTo(map).bindPopup(nom).openPopup();
            });

            resolve(parcs);
        }).catch((erreur) => {
            reject(erreur);
        });
    });
}

window.onload = function() {
    // Chargement initial de la MAP
	let map = L.map('map').setView([48.856614, 2.3522219], 12);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'PING'}).addTo(map);

    let localisation_user = null;
    getLocation().then(position => {
        localisation_user = {};
        localisation_user['position'] = position.coords;
        localisation_user['marker'] = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map).bindPopup("Votre localisation").openPopup();
    }).catch(erreur => console.log(erreur));

    let parcs = null;
    charger_parcs(map).then(data => {
        parcs = data;
    }).catch(erreur => console.log(erreur));
    
    // Chargement des parcs
    $(function() {
        $("#proche").button();

        $("#proche").click(function(event) {
            event.preventDefault();
        
            if(localisation_user == null) {
                alert("active ta localisation gros fdp on est pas le kgb");
                return;
            }

            if(parcs == null) {
                alert("attends fdp");
                return;
            }

            let plus_proche = null;
            for(let i in parcs) {
                let x_parc = parcs[i].position[1];
                let y_parc = parcs[i].position[0];

                let x_user = localisation_user.position.longitude;
                let y_user = localisation_user.position.latitude;

                let distance = Math.sqrt(Math.pow(x_parc - x_user, 2) + Math.pow(y_parc - y_user, 2));
                parcs[i]['distance'] = distance;

                if(plus_proche == null || distance < plus_proche.distance)
                    plus_proche = parcs[i];
            }

            map.removeLayer(parcs[plus_proche.nom].marker);
            parcs[plus_proche.nom].marker = L.marker(plus_proche.position, { opacity: 1 }).addTo(map).bindPopup(plus_proche.nom).openPopup();
        });
    });


    $(".bloc").draggable({ revert: "valid" });

    $("#map").droppable({
        drop: function(event, ui) {
            let nom_parc = document.getElementById(ui.draggable.attr('id')).getElementsByTagName('p')[0].innerHTML;

            map.removeLayer(parcs[nom_parc].marker);
            parcs[nom_parc].marker = L.marker(parcs[nom_parc].position, { opacity: 1 }).addTo(map).bindPopup(parcs[nom_parc].nom).openPopup();
            
            // var chaine="";
            // chaine+="Parc : "+IdParc+"</br>";
        }
    });
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