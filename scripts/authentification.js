function authentification() {
    $(function() {
        $("#authentification").dialog({
            autoOpen: false,
            position: {
                my: "center",
                at: "center",
                of: window
            }
         });

        $("#btn_auth").click(function() {
            $("#authentification").dialog("open");
        });

        $(document).on("submit", "#form_auth", function(event) {
            event.preventDefault();

            const inputs = event.target.getElementsByTagName('input');
            authentifier(inputs[0].value, inputs[1].value).then(data => {
                console.log(data);
                if(data == "success") {
                    $("#authentification").dialog("close");
                    $("#bienvenue").text("Bienvenue, " + inputs[0].value);
                    $("#btn_auth").dialog().remove();
                }  
                else {
                    alert("Authentification échoué! Veuillez réessayer.");
                }
            });
    
            return false;
        });
    });

    // document.getElementById("form_auth").onsubmit = function(event) {
    //     event.preventDefault();

    //     const inputs = event.target.getElementsByTagName('input');
    //     authentifier(inputs[0].value, inputs[1].value).then(data => {
            
    //     });
    // }
}