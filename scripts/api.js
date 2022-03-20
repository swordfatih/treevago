
function get_parcs() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: "https://opendata.paris.fr/api/records/1.0/search/?exclude.categorie=Square&exclude.categorie=Jardinet&exclude.categorie=Cimetière&exclude.categorie=Decoration&exclude.categorie=Jardin+d'immeubles&exclude.categorie=Jardin+partage&exclude.categorie=Jardiniere&exclude.categorie=Mail&exclude.categorie=Murs+vegetalises&exclude.categorie=Plate-bande&exclude.categorie=Talus&exclude.categorie=Terrain+de+boules&exclude.categorie=Terre-plein",
            dataType: 'jsonp',
            jsonpCallback: 'data',
            data: { dataset: "espaces_verts", rows: 150, start: 200, q: "", facet: "type_ev", facet: "categorie", facet: "adresse_codepostal",facet: "presence_cloture", facet: "ouvert_ferme", json_callback: 'data' },
            error: function(xhr, status, error) {
                reject(error);
            },
            success: function(data) {
                resolve(data);
            }
        });
    });
}

function authentifier(login, mdp) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: "/treevago/api",
            data: { login: login, mdp: mdp },
            error: function(xhr, status, error) {
                reject(error);
            },
            success: function(data) {
                resolve(data);
            }
        });
    });
}




$("#form").submit(function () {
    var data = $(this).serialize();

    $.ajax({
        type: 'POST',
        url: 'google.fr/api/',
        data: $(this).attr('action'),
        success: function(donnees) {
            console.log(donnees);
        }
    })
})
