function getFirebaseConfig() {
    var firebaseConfig = {
        apiKey: "AIzaSyD0Q3cAPcI_ZWAwYK8yTQIgMEkwKNHW5YY",
        authDomain: "guardians-b9dc4.firebaseapp.com",
        databaseURL: "https://guardians-b9dc4.firebaseio.com",
        projectId: "guardians-b9dc4",
        storageBucket: "guardians-b9dc4.appspot.com",
        messagingSenderId: "447611631293",
        appId: "1:447611631293:web:d42dfdbae1777af74a29d4",
        measurementId: "G-61397JGRLG"
    };
    // Initialize Firebase
    return firebaseConfig;
}


function getFireDB(firebase) {
    database = firebase.firestore(); // returt the fireStore Database
    database.enablePersistence()
        .catch(function (err) {
            if (err.code == 'failed-precondition') {
                console.log("Multiple tabs open, persistence can only be enabled");
            } else if (err.code == 'unimplemented') {
                console.log("The current browser does not support all of the features required to enable persistence");
            }
        });
    return database;
}


function loadCollection(db, name, live, callback) {
    if (live) {
        db.collection(name).onSnapshot(function (querySnapshot) {
            callback(querySnapshot);
        });
    } else {
        db.collection(name).get().then(function (querySnapshot) {
            callback(querySnapshot);
        });
    }
}

function loadCollectionbyField(db, callection, field, value, callback) {
    db.collection(callection).where(field, "==", value).get().then(function (querySnapshot) {
        callback(querySnapshot);
    });
}



function loadSubCollection(db, name, docId, subCollection, callback) {
    db.collection(name).doc(docId).collection(subCollection).get().then(function (querySnapshot) {
        callback(querySnapshot);
    });
}


function loadDocument(db, collection, docId, callback) {
    db.collection(collection).doc(docId).get().then(function (doc) {
        callback(doc);
    });
}


function tag(id) {
    return document.getElementById(id);
}

function setVal(id, value) {
    var comp = tag(id);
    if (comp != undefined && comp != null) {
        comp.innerHTML = value;
    }
}

function setValList(id, value) {
    document.querySelectorAll('[id=' + id + ']').forEach(element => {
        element.innerHTML = value;
    });
}


function addCellValue(rowId, value) {
    if (value == undefined || value == null) {
        value = "sem valor";
    }
    rowId.innerHTML = value;
}


function milliToDate(mille) {
    //https://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-javascript

    var date = new Date(mille);
    //console.log("Data em STR: " + date.toString());

    var day = date.getDay();
    var month = date.getMonth() + 1;

    if (day < 10) {
        day = "0" + date.getDay()
    }


    if (month < 10) {
        month = "0" + month;
    }

    var pt = day + "-" + month + "-" + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    return pt;
}


function createUserHistoryRow(doc) {
    var userData = doc.data();
    return "<div class='flex table-content'>"
        + "<div>" + userData.name + "</div>"
        + "<div>" + milliToDate(userData.createdAt) + "</div>"
        + "<div>" + milliToDate(userData.createdAt) + "</div>"
        + "<div>" + doc.id + "</div>"
        + "</div>";
}


function createUserHistoryRowTable(doc) {
    var userData = doc.data();
    return " <tr><td>" + userData.name + "</td>"
        + "<td>" + milliToDate(userData.createdAt) + "</td>"
        + "<td id='loc_h_" + hashId(doc.id) + "'>" + userData.ultimaLocalizacao + "</td></tr>";
}

function hashId(s) {
    return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
}

function createUserRowTable(doc, id) {
    var userData = doc.data();
    var status = "Ativo";
    var loc = toJson(userData.ultimaLocalizacao);//.latitude;
    var lat = "";
    var log = "";

    var uui = hashId(doc.id);

    var enable = userData.ativo;

    var ativoText = "Ativar";
    if (enable) {
        ativoText = "Desativar";
    }

    if (loc != null && loc != undefined) {
        if (lat != null && log != null) {
            lat = loc.latitude;
            log = loc.longitude;
        }
    }

    return " <tr>"
        + "<td>" + userData.name + "</td>"
        + "<td id='loc_u_" + uui + "'>" + userData.ultimaLocalizacao + "</td>"
        + "<td id='st_u_" + uui + "'>" + userData.ativo + "</td>"
        + "<td>"
        + "  <a href='/editar/user?user_id=" + doc.id + "'>Editar</a> | "
        + "  <a href='/user/" + uui + "?id=" + doc.id + "&name=" + userData.name + "&lat=" + lat + "&log=" + log + "&status=" + status + "&uid=" + doc.id + "'>Ver Usúario</a> | "
        + "  <a class='link' onClick=\"closeUser(" + enable + ",\'" + doc.id + "\');\">" + ativoText + "</a>"
        + "</td></tr>";
}



function createCarRowTable(car) {
    var placa = "" + car.placa + "";
    return "<tr>"
        + "<td>" + car.marca + "</td>"
        + "<td>" + car.modelo + "</td>"
        + "<td>" + car.cor + "</td>"
        + "<td>" + car.placa + "</td>"
        + "<td>"
        + "  <a class='link' onClick=\"showCarfield(\'" + placa + "\');\">Editar</a> | "
        + "  <a class='link' onClick=\"deleteCarItem(\'" + placa + "\');\">Excluir</a>"
        + "</td></tr>";
}


function toJson(string) {
    if (string == null || string == undefined || string == '') {
        return null;
    }
    return JSON.parse(string);
}

// ===================== HISTORICO ===================================

// historico
function loadUsersHistory(db) {
    loadCollection(db, "USUARIOS", true, (list) => {
        var userTable = tag("tblhistory");
        var html = "";
        var id = 0;
        userTable.innerHTML = "";
        list.forEach((doc) => {
            id++;
            html += createUserHistoryRowTable(doc);
            var data = doc.data();
            var lat = toJson(data.ultimaLocalizacao);
            var log = toJson(data.ultimaLocalizacao);
            if (lat != null && log != null) {
                getAdress(lat.latitude, log.longitude, (json) => {
                    setValList("loc_h_" + hashId(doc.id), json['results'][1]['formatted_address'] + " ");
                    // setValList("loc_h_" + doc.id, json.locality + ", " + json.principalSubdivision);
                });
            }
        });
        setVal("user-count", list.size);
        userTable.innerHTML += html;

        //refresh();
    });
}


//==========================================================================================

//======================== USERS ===========================================================
var carros = null;
var carroAtual = null;

function loadUserById(db, userId) {
    loadDocument(db, "USUARIOS", userId, (userDoc) => {
        if (userDoc.exists) {
            var user = userDoc.data();
            var form = document.forms[0];
            form.user_nome.value = user.name;
            form.user_nascimento.value = user.nascimento;
            form.user_bairro.value = user.bairro;
            form.user_cep.value = user.cep;
            form.user_cidade.value = user.cidade;
            form.user_cpf.value = user.cpf;
            form.user_numero.value = user.numero;
            form.user_email.value = user.email;
            form.user_estado.value = user.estado;
            // motorista: form.user_motorista.value, // true or false
            form.user_rua.value = user.rua;
            showUserCars(user.carros);

        }
    });
}


function showUserCars(list) {
    var carTable = tag("tblUserCars");
    var html = "";
    carTable.innerHTML = html;
    carros = Object.values(list);
    carros.forEach((car) => {
        console.log("Carros: " + car.marca);
        html += createCarRowTable(car);
    });
    carTable.innerHTML = html;
}

function loadUsers(db) {
    loadCollection(db, "USUARIOS", true, (list) => {
        var userTable = tag("tblUsers");
        userTable.innerHTML = "";
        var html = "";
        var id = 0;

        list.forEach((doc) => {
            id++;
            var data = doc.data();
            html += createUserRowTable(doc, id);

            var lat = toJson(data.ultimaLocalizacao);
            var log = toJson(data.ultimaLocalizacao);
            if (lat != null && log != null) {
                getAdress(lat.latitude, log.longitude, (json) => {
                    setValList("loc_u_" + hashId(doc.id), json['results'][1]['formatted_address'] + " ");
                    //setValList("loc_u_" + doc.id, json.locality + ", " + json.principalSubdivision);
                });
            }

        });
        setVal("user-count", list.size);
        userTable.innerHTML += html;
    });
}

function loadLocationsofUser(db, userId) {
    loadSubCollection(db, "USUARIOS", userId.toString(), "LOCATIONS", (list) => {
        var html = "";
        var table = tag("tblUserLocations");
        table.innerHTML = "";
        list.forEach((doc) => {
            var location = doc.data();
            var lat = toJson(location.point).latitude;
            var log = toJson(location.point).longitude;
            var dat = toJson(location.point).createdAt;
            var id = "al_" + hashId(doc.id);
            html += "<tr>"
                + "<td>" + milliToDate(dat) + "</td>"
                + "<td id='" + id + "'> carregando..</td>"
                + "</tr>"

            if (lat != null && log != null) {
                getAdress(lat, log, (json) => {
                    setValList(id, json['results'][1]['formatted_address'] + " ");
                    //setValList(id, json.locality + ", " + json.principalSubdivision);
                });
            }

        });
        table.innerHTML = html;
    });
}

function showCarfield(car) {
    var carro = null;
    carros.forEach((item) => {
        if (item.placa == car) {
            carro = item;
            return;
        }
    });
    if (carro != null) {
        var form = document.forms[0];
        form.user_marca.value = carro.marca;
        form.user_modelo.value = carro.modelo;
        form.user_cor.value = carro.cor;
        form.user_placa.value = carro.placa;
        carroAtual = carro;
    }
    tag("car_fields").style.display = "block";
    tag("edit_title").style.display = "block";
}

function updateCar() {
    var form = document.forms[0];
    if (form.user_marca.value === undefined || form.user_marca.value === null || form.user_nome.value == '') {
        alert("A marca do carro é obrigatória");
        return false;
    }
    if (form.user_modelo.value === undefined || form.user_modelo.value === null || form.user_modelo.value == '') {
        alert("O Modelo do carro é obrigatório");
        return false;
    }
    if (form.user_cor.value === undefined || form.user_cor.value === null || form.user_cor.value == '') {
        alert("A Cor do carro é obrigatório");
        return false;
    }
    if (form.user_placa.value === undefined || form.user_placa.value === null || form.user_placa.value == '') {
        alert("A Placa do carro é obrigatório");
        return false;
    }


    carroAtual.marca = form.user_marca.value;
    carroAtual.modelo = form.user_modelo.value;
    carroAtual.cor = form.user_cor.value;
    carroAtual.placa = form.user_placa.value;

    carros.forEach((item, i) => {
        if (item.placa == carroAtual.placa) {
            carros[i] = carroAtual;
            showUserCars(carros);
            form.user_marca.value = "";
            form.user_modelo.value = "";
            form.user_cor.value = "";
            form.user_placa.value = "";
            tag("car_fields").style.display = "none";
            tag("edit_title").style.display = "none";
            alert("Carro atualizado com sucesso!!");
            return;
        }
    });

}

/*

// Wait 5 seconds and then update the `abc-variable` field
setTimeout(function() {
  var name = "favorites";
  var update = {};
  update[name+".food"] = "candy";
  ref.update(update);
}, 5000);
*/

function updateUser(userId) {

    var form = document.forms[0];

    if (validateForm(form)) {
        var user = {
            // name: form.user_nome.value,
            nascimento: form.user_nascimento.value,
            bairro: form.user_bairro.value,
            cep: form.user_cep.value,
            cidade: form.user_cidade.value,
            cpf: form.user_cpf.value,
            numero: form.user_numero.value,
            email: form.user_email.value,
            estado: form.user_estado.value,
            carros: carros,
            // motorista: form.user_motorista.value, // true or false
            rua: form.user_rua.value
        };

        //showLoading(true);

        if (userId != null || userId != undefined || userId != "") {
            // firebase.initializeApp(getFirebaseConfig());
            // var db = getFireDB(firebase);
            db.collection("USUARIOS").doc(userId.toString()).update(user).then(function (docRef) {
                //console.log("Document written with ID: ", docRef.data);
                //addDocToTable(docRef)
                alert("Documento Salvo");
                refresh();
            }).catch(function (error) {
                console.error("Error adding document: ", error);
            });
        }
    }
}



function startEditCar(car) { }

function deleteCarItem(car) {
    alert(carros.lenght);
    carros.forEach((item) => {
        if (item.placa == '' + car + '') {
            carros.splice(carros.indexOf(item), 1);
        }
    });
    showUserCars(carros);
}


function refresh() {
    window.location.reload(true);
}


function validateForm(form) {

    if (form == undefined || form == null) {
        return false;
    }

    if (form.user_nome.value === undefined || form.user_nome.value === null || form.user_nome.value == '') {
        // alert("O Nome é obrigatório");
        //return false;
    }

    if (form.user_cpf.value === undefined || form.user_cpf.value === null || form.user_cpf.value == '' || form.user_cpf.value == 0) {
        alert("o cpf é obrigatório");
        return false;
    }

    if (form.user_email.value === undefined || form.user_email.value === null || form.user_email.value == '') {
        alert("O email é obrigatório");
        return false;
    }

    if (form.user_nascimento.value === undefined || form.user_nascimento.value === null || form.user_nascimento.value == '') {
        alert("O nascimento é obrigatório");
        return false;
    }

    if (form.user_rua.value === undefined || form.user_rua.value === null || form.user_rua.value == '') {
        alert("A rua é obrigatório");
        return false;
    }

    if (form.user_numero.value === undefined || form.user_numero.value === null || form.user_numero.value == '') {
        alert("o numero é obrigatório");
        return false;
    }

    if (form.user_cidade.value === undefined || form.user_cidade.value === null || form.user_cidade.value == '') {
        alert("A cidade é obrigatório");
        return false;
    }

    if (form.user_bairro.value === undefined || form.user_bairro.value === null || form.user_bairro.value == '') {
        alert("O bairro é obrigatório");
        return false;
    }

    if (form.user_estado.value === undefined || form.user_estado.value === null || form.user_estado.value == '') {
        alert("O Estado é obrigatório");
        return false;
    }

    if (form.user_cep.value === undefined || form.user_cep.value === null || form.user_cep.value == '' || form.user_cep.value == 0) {
        alert("o cep é obrigatório");
        return false;
    }

    return true;
}



//==========================================================================================

//======================== ALERTS ===========================================================


function resolveAlert(docId, alert, callback) {
    alert.open = false;
    db.collection("ALERTAS").doc(docId).update(alert).then(function (docRef) {
        //console.log("Document written with ID: ", docRef.data);
        //addDocToTable(docRef)
        //alert("Alerta Resolvido");
        callback(true);
    }).catch(function (error) {
        callback(false);
        console.error("Error adding document: ", error);
    });
}

function createAlertRowTable(doc) {
    var alertData = doc.data();
    var status = "Ativo";
    var dateTime = milliToDate(alertData.createdAt);
    var loc = toJson(alertData.ultimaLocalizacao);
    var lat = "";
    var log = "";

    if (loc != null && loc != undefined) {
        if (loc.latitude != null) {
            lat = loc.latitude;
        }
        if (loc.longitude != null) {
            log = loc.longitude;
        }
    }

    var audio = "#";
    if (alertData.audio != null && alertData.audio != undefined && alertData.audio != '') {
        audio = alertData.audio;
    }

    var resolv = "";

    if (alertData.open == false) {
        status = "Resolvido";
    } else {
        resolv = "| <a href='#' onClick=\"closeAlert(\'" + doc.id.toString() + "\')\">Resolver</a>";
    }


    return " <tr>"
        + "<td id='a_u" + hashId(alertData.usuarioKey) + "'>carregando...</td>"
        + "<td id='loc_a_" + doc.id + "'>" + alertData.ultimaLocalizacao + "</td>"
        + "<td>" + dateTime + "</td>"
        + "<td id='st_a_" + doc.id + "'>" + status + "</td>"
        + "<td>" + alertData.obs + "</td>"
        + "<td>"
        + "  <a href='/alert/" + doc.id + "?aid=" + doc.id + "&uid=" + alertData.usuarioKey + "&dateTime=" + dateTime + "&log=" + log + "&lat=" + lat + "&audio=" + audio + "&open=" + alertData.open + "&obs=" + alertData.obs + "'>Ver Alerta</a>"
        + resolv
        + "</td></tr>";
}


function loadAlerts(db) {
    var alertTable = tag("tblAlertas");
    var html = "";

    var alertasResolvidos = 0;
    var alertasAbertos = 0;
    loadCollection(db, "ALERTAS", false, (list) => {
        alertasAbertos = 0;
        alertasResolvidos = 0;
        alertTable.innerHTML = "";
        list.forEach((doc) => {
            var alerta = doc.data();
            if (alerta.open == true) {
                alertasAbertos++;
            } else {
                alertasResolvidos++;
            }

            // coloque detro de true caso queira somente os ativos
            html += createAlertRowTable(doc);
            loadDocument(db, "USUARIOS", alerta.usuarioKey, (userDoc) => {
                if (userDoc.exists) {
                    var user = userDoc.data();
                    setValList("a_u" + hashId(alerta.usuarioKey), user.name);
                }
            });

            var data = doc.data();
            var loc = toJson(data.ultimaLocalizacao);
            var lat = null
            var log = null;

            if (loc != null && loc != undefined) {
                if (loc.latitude != null) {
                    lat = loc.latitude;
                }
                if (loc.longitude != null) {
                    log = loc.longitude;
                }
                if (lat != null && log != null) {
                    getAdress(lat, log, (json) => {
                        if (json != null) {
                            setValList("loc_a_" + doc.id, json['results'][1]['formatted_address'] + " ");
                            //setValList("loc_a_" + doc.id, json.locality + ", " + json.principalSubdivision);
                        }
                    });
                }
            }
        });
        setVal("alert-count", alertasAbertos);
        setVal("closed-alert-count", alertasResolvidos);
        alertTable.innerHTML = html;
    });
}

var count = 0;

function loadCountAlerts(db) {
    var alertasResolvidos = 0;
    var alertasAbertos = 0;
    loadCollection(db, "ALERTAS", true, (list) => {
        alertasAbertos = 0;
        alertasResolvidos = 0;
        var tempCont = 0
        list.forEach((doc) => {
            var alerta = doc.data();
            //console.log("doc" + alerta.createdAt);
            if (alerta.open == true) {
                alertasAbertos++;
            } else {
                alertasResolvidos++;
            }
            tempCont++;
        });

        if (tempCont > count && count > 0) {
            swal("Novo Alerta!", {
                icon: "success",
            });
        }
        count = tempCont;
        setVal("alert-count", alertasAbertos);
        setVal("closed-alert-count", alertasResolvidos);

        if (alertasAbertos != undefined && alertasAbertos > 0) {
            swal("Você tem " + alertasAbertos + " alerta(s) aberto(s)!", {
                icon: "success",
            });
        }
    });
}


/*
request.json().then(function(json) {
  console.log(json.foo);
  console.log(json.bar);
});
*/

function getAdress(lat, log, callback) {
    if (lat == null || log == null || lat == undefined || log == undefined || lat == "" || log == "") {
        //callback(null);
        return;
    }
    // var request = new Request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + log + "&key=AIzaSyDzhOcTXKLgf5UrnmORdJWBtVZ8DiukMdU");
    var request = new Request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + log + "&key=AIzaSyCX9KQTKMsnd7OPLGcjOAfVPdTA2DzYMo0");
    //https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCX9KQTKMsnd7OPLGcjOAfVPdTA2DzYMo0
    //var request = new Request("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + log + "&localityLanguage=pt");
    fetch(request).then(function (response) {
        return response.json();
    }).then(function (text) {
        //console.log(text);
        callback(text);
    });
}



function sortTable(n, tableName) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableName);
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}





/*
 
Para enviar uma notificação basta fazer um requisição POST para a url: https://fcm.googleapis.com/fcm/send passando um json no seguinte formato:
 
{
    "to": "TOKEN_DE_ACESSO",
    "data": {
      "notification": {
       "title": "Oi!",
       "body": "Eu sou uma notificação!",
       "click_action": "http://127.0.0.1:8887",
       "icon": "http://127.0.0.1:8887/icon.png"
     }
    }
  }
  */

function showMenu() {
    tag('menu').style.display = "block!important";
}


// ['results'][1]['formatted_address]

/*
var jso = "{
"plus_code": {
    "compound_code": "P27Q+MC New York, NY, USA",
        "global_code": "87G8P27Q+MC"
},
"results": [
    {
        "address_components": [
            {
                "long_name": "279",
                "short_name": "279",
                "types": ["street_number"]
            },
            {
                "long_name": "Bedford Avenue",
                "short_name": "Bedford Ave",
                "types": ["route"]
            },
            {
                "long_name": "Williamsburg",
                "short_name": "Williamsburg",
                "types": ["neighborhood", "political"]
            },
            {
                "long_name": "Brooklyn",
                "short_name": "Brooklyn",
                "types": ["political", "sublocality", "sublocality_level_1"]
            },
            {
                "long_name": "Kings County",
                "short_name": "Kings County",
                "types": ["administrative_area_level_2", "political"]
            },
            {
                "long_name": "New York",
                "short_name": "NY",
                "types": ["administrative_area_level_1", "political"]
            },
            {
                "long_name": "United States",
                "short_name": "US",
                "types": ["country", "political"]
            },
            {
                "long_name": "11211",
                "short_name": "11211",
                "types": ["postal_code"]
            }
        ],
        "formatted_address": "279 Bedford Ave, Brooklyn, NY 11211, USA",
        "geometry": {
            "location": {
                "lat": 40.7142484,
                "lng": -73.9614103
            },
            "location_type": "ROOFTOP",
            "viewport": {
                "northeast": {
                    "lat": 40.71559738029149,
                    "lng": -73.9600613197085
                },
                "southwest": {
                    "lat": 40.71289941970849,
                    "lng": -73.96275928029151
                }
            }
        },
        "place_id": "ChIJT2x8Q2BZwokRpBu2jUzX3dE",
        "plus_code": {
            "compound_code": "P27Q+MC Brooklyn, New York, United States",
            "global_code": "87G8P27Q+MC"
        },
        "types": [
            "bakery",
            "cafe",
            "establishment",
            "food",
            "point_of_interest",
            "store"
        ]
    },

],
    "status": "OK"
}";

*/