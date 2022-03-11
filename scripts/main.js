/////////////////////////////////////////////////
/// Globals
/////////////////////////////////////////////////
const utilisateur = {};

/////////////////////////////////////////////////
function get_location(carte) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(resolve, reject) : reject("Geolocation non supportée par ce navigateur.");
    });
}

/////////////////////////////////////////////////
function get_position_utilisateur(carte) {
    utilisateur.position = null;

    get_location().then(position => {
        utilisateur.position = {};
        utilisateur.position = position.coords;
        utilisateur.marqueur = L.marker([position.coords.latitude, position.coords.longitude]).addTo(carte).bindPopup("Votre localisation").openPopup();
    }).catch(erreur => console.log(erreur));
}

/////////////////////////////////////////////////
window.onload = function() {
    let carte = creer_carte();

    let parcs = null;
    charger_parcs(carte).then(data => { parcs = data }).catch(erreur => console.log(erreur));

    get_position_utilisateur(carte);

    $("#proche").button();
    $("#proche").click(function(event) {
        event.preventDefault();
        parc_plus_proche(carte, utilisateur, parcs);
    });

    $(".bloc").draggable({ revert: "valid" });
    $("#carte").droppable({ drop: function(event, ui) { marquer_parc(carte, parcs, ui); }});
}