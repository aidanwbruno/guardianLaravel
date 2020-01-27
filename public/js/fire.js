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
        + "  <a href='/editar/user/user_id=" + doc.id + "'>Editar</a> | "
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
                    if (doc.exists) {
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