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
    console.log("Data em STR: " + date.toString());
    return date;
}

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en


function createUserHistoryRow(doc) {
    var userData = doc.data();
    return "<div class='flex table-content'>"
        + "<div>" + userData.name + "</div>"
        + "<div>" + milliToDate(userData.createdAt).toLocaleDateString() + "</div>"
        + "<div>" + milliToDate(userData.createdAt).toLocaleTimeString() + "</div>"
        + "<div>" + doc.id + "</div>"
        + "</div>";
}


function createUserHistoryRowTable(doc) {
    var userData = doc.data();
    return " <tr><td>" + userData.name + "</td>"
        + "<td>" + milliToDate(userData.createdAt).toLocaleString() + "</td>"
        + "<td> implementar </td></tr>";
}

function createUserRowTable(doc, id) {
    var userData = doc.data();
    var status = "Ativo";
    return " <tr>"
        + "<td>" + id + "</td>"
        + "<td>" + userData.name + "</td>"
        + "<td>implementar</td>"
        + "<td>" + status + "</td>"
        + "<td>"
        + "  <a href='/editar/user?user_id=" + doc.id + "'>Editar</a> | "
        + "  <a href='/user/" + doc.id + "?id=" + id + "&name=" + userData.name + "&location=localizacao&status=" + status + "&uid=" + doc.id + "'>Ver Usúario</a>"
        + "</td></tr>";
}

// ===================== HISTORICO ===================================

// historico
function loadUsersHistory(db) {
    loadCollection(db, "USUARIOS", (list) => {
        var userTable = tag("tblhistory");
        var html = "";
        var id = 0;
        list.forEach((doc) => {
            id++;
            html += createUserHistoryRowTable(doc);
            console.log(name);
        });
        setVal("user-count", list.size);
        userTable.innerHTML += html;
    });
}


//==========================================================================================

//======================== USERS ===========================================================

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
        }
    });
}

function loadUsers(db) {
    loadCollection(db, "USUARIOS", (list) => {
        var userTable = tag("tblUsers");
        var html = "";
        var id = 0;
        list.forEach((doc) => {
            id++;
            html += createUserRowTable(doc, id);
            console.log(name);
        });
        setVal("user-count", list.size);
        userTable.innerHTML += html;
    });
}

function loadLocationsofUser(db, userId) {
    loadSubCollection(db, "USUARIOS", userId.toString(), "LOCATIONS", (list) => {
        var html = "";
        var table = tag("tblUserLocations");
        list.forEach((doc) => {
            var location = doc.data();
            html += "<tr>"
                + "<td>" + milliToDate(location.createdAt).toLocaleString() + "</td>"
                + "<td>" + location.point + "</td>"
                + "</tr>"
        });
        table.innerHTML = html;
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
                window.location.reload(true);
            }).catch(function (error) {
                console.error("Error adding document: ", error);
            });
        }
    }
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
    var dateTime = milliToDate(alertData.createdAt).toLocaleString();
    if (alertData.open == false) {
        status = "Resolvido";
    }
    return " <tr>"
        + "<td id='" + alertData.usuarioKey + "'>carregando...</td>"
        + "<td>localização</td>"
        + "<td>" + dateTime + "</td>"
        + "<td>" + status + "</td>"
        + "<td>"
        + "  <a href='/alert/" + doc.id + "?uid=" + alertData.usuarioKey + "&dateTime=" + dateTime + "'>Ver Alerta</a>"
        + "</td></tr>";
}


function loadAlerts(db) {
    var alertTable = tag("tblAlertas");
    var html = "";
    var alertasResolvidos = 0;
    var alertasAbertos = 0;
    loadCollectionbyField(db, "ALERTAS", "open", true, (list) => {
        alertasAbertos = 0;
        alertasResolvidos = 0;
        list.forEach((doc) => {
            var alerta = doc.data();
            if (alerta.open == true) {
                alertasAbertos++;
                html += createAlertRowTable(doc);
                loadDocument(db, "USUARIOS", alerta.usuarioKey, (userDoc) => {
                    if (userDoc.exists) {
                        var user = userDoc.data();
                        setValList(alerta.usuarioKey, user.name);
                    }
                });
            } else {
                alertasResolvidos++;
            }
        });
        setVal("alert-count", alertasAbertos);
        setVal("closed-alert-count", alertasResolvidos);
        alertTable.innerHTML += html;
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