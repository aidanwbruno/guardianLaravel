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


function loadCollection(db, name, callback) {
    db.collection(name).onSnapshot(function (querySnapshot) {
        callback(querySnapshot);
    });
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
        + "<td id='loc_h_" + doc.id + "'>" + userData.ultimaLocalizacao + "</td></tr>";
}

function createUserRowTable(doc, id) {
    var userData = doc.data();
    var status = "Ativo";
    var lat = toJson(userData.ultimaLocalizacao).latitude;
    var log = toJson(userData.ultimaLocalizacao).longitude;
    return " <tr>"
        + "<td>" + id + "</td>"
        + "<td>" + userData.name + "</td>"
        + "<td id='loc_u_" + id + "'>" + userData.ultimaLocalizacao + "</td>"
        + "<td>" + status + "</td>"
        + "<td>"
        + "  <a href='/editar/user?user_id=" + doc.id + "'>Editar</a> | "
        + "  <a href='/user/" + doc.id + "?id=" + id + "&name=" + userData.name + "&lat=" + lat + "&log=" + log + "&status=" + status + "&uid=" + doc.id + "'>Ver Usúario</a>"
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
    return JSON.parse(string);
}

// ===================== HISTORICO ===================================

// historico
function loadUsersHistory(db) {
    loadCollection(db, "USUARIOS", (list) => {
        var userTable = tag("tblhistory");
        var html = "";
        var id = 0;
        userTable.innerHTML = "";
        list.forEach((doc) => {
            id++;
            html += createUserHistoryRowTable(doc);
            var data = doc.data();
            var lat = toJson(data.ultimaLocalizacao).latitude;
            var log = toJson(data.ultimaLocalizacao).longitude;
            getAdress(lat, log, (json) => {
                setValList("loc_h_" + doc.id, json.locality + ", " + json.principalSubdivision);
            });
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
    loadCollection(db, "USUARIOS", (list) => {
        var userTable = tag("tblUsers");
        userTable.innerHTML = "";
        var html = "";
        var id = 0;

        list.forEach((doc) => {
            id++;
            var data = doc.data();
            html += createUserRowTable(doc, id);
            var lat = toJson(data.ultimaLocalizacao).latitude;
            var log = toJson(data.ultimaLocalizacao).longitude;
            getAdress(lat, log, (json) => {
                setValList("loc_u_" + id, json.locality + ", " + json.principalSubdivision);
            });
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
            var id = "al_" + doc.id;
            html += "<tr>"
                + "<td>" + milliToDate(dat) + "</td>"
                + "<td id='" + id + "'> carregando..</td>"
                + "</tr>"

            getAdress(lat, log, (json) => {
                setValList(id, json.locality + ", " + json.principalSubdivision);
            });
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
            form.user_marca.value = ""; alert("Carro atualizado com sucesso!!");
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


function createAlertRowTable(doc) {
    var alertData = doc.data();
    var status = "Ativo";
    var dateTime = milliToDate(alertData.createdAt);
    var loc = toJson(alertData.ultimaLocalizacao);
    var audio = "#";
    if (alertData.audio != null && alertData.audio != undefined && alertData.audio != '') {
        audio = alertData.audio;
    }
    if (alertData.open == false) {
        status = "Resolvido";
    }
    return " <tr>"
        + "<td id='a_u" + alertData.usuarioKey + "'>carregando...</td>"
        + "<td id='loc_a_" + doc.id + "'>" + alertData.ultimaLocalizacao + "</td>"
        + "<td>" + dateTime + "</td>"
        + "<td>" + status + "</td>"
        + "<td>"
        + "  <a href='/alert/" + doc.id + "?uid=" + alertData.usuarioKey + "&dateTime=" + dateTime + "&log=" + loc.longitude + "&lat=" + loc.latitude + "&audio=" + audio + "'>Ver Alerta</a>"
        + "</td></tr>";
}


function loadAlerts(db) {
    var alertTable = tag("tblAlertas");
    var html = "";

    var alertasResolvidos = 0;
    var alertasAbertos = 0;
    loadCollection(db, "ALERTAS", (list) => {
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
                    setValList("a_u" + alerta.usuarioKey, user.name);
                }
            });

            var data = doc.data();
            var lat = toJson(alerta.ultimaLocalizacao).latitude;
            var log = toJson(alerta.ultimaLocalizacao).longitude;
            getAdress(lat, log, (json) => {
                setValList("loc_a_" + doc.id, json.locality + ", " + json.principalSubdivision);
            });
        });
        setVal("alert-count", alertasAbertos);
        setVal("closed-alert-count", alertasResolvidos);
        alertTable.innerHTML = html;
    });
}


function loadCountAlerts(db) {
    var alertasResolvidos = 0;
    var alertasAbertos = 0;
    loadCollection(db, "ALERTAS", (list) => {
        alertasAbertos = 0;
        alertasResolvidos = 0;
        list.forEach((doc) => {
            var alerta = doc.data();
            if (alerta.open == true) {
                alertasAbertos++;
            } else {
                alertasResolvidos++;
            }
        });
        setVal("alert-count", alertasAbertos);
        setVal("closed-alert-count", alertasResolvidos);
    });
}


/*


request.json().then(function(json) {
  console.log(json.foo);
  console.log(json.bar);
});
*/

function getAdress(lat, log, callback) {
    var request = new Request("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + log + "&localityLanguage=pt");
    fetch(request).then(function (response) {
        return response.json();
    }).then(function (text) {
        //console.log(text);
        callback(text);
    });
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