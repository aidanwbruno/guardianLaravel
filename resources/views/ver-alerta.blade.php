@extends('layouts.template')

@section('menu')
<li class="nav-item">
  <a class="nav-link" href="{{url('/home')}}">
    <i class="material-icons">dashboard</i>
    <p>Home</p>
  </a>
</li>
<li class="nav-item ">
  <a class="nav-link" href="{{url('/usuarios')}}">
    <i class="material-icons">people</i>
    <p>Usuários</p>
  </a>
</li>
<li class="nav-item active">
  <a class="nav-link" href="{{url('/alertas')}}">
    <i class="material-icons">notification_important</i>
    <p>Alertas</p>
  </a>
</li>    
@endsection

@section('script')
    <script>
        firebase.initializeApp(getFirebaseConfig());
        var db = getFireDB(firebase);
        //loadUsers(db);
        loadLocationsofUser(db, '{{request()->uid}}');
        var lat = '{{request()->lat}}';
        var log = '{{request()->log}}';
    
        getAdress(lat, log, (json) => {
               // setVal("alertLocation", json.locality + ", " + json.principalSubdivision);
                setValList("alertLocation", json['results'][1]['formatted_address'] + " ");
        });

        loadDocument(db, "USUARIOS", '{{request()->uid}}', (userDoc) => {
            if (userDoc.exists) {
                var doc = userDoc.data();
              setVal("userAlertCPF", doc.cpf); 
              setVal("userAlertName", doc.name);  
            }
        });

       
      
       /* var storage = firebase.storage();
        storage.ref().child('{{request()->audio}}').getDownloadURL().then(function(url) {
          console.log(url);
        });*/

        var audio = '{{request()->audio}}';

        function openAudio(){
          window.open('https://firebasestorage.googleapis.com/v0/b/guardians-b9dc4.appspot.com/o/'+audio,'_blank');
        }

        function updateAlert(){
          var open = '{{request()->open}}';
          if(open == true || open == 'true'){
            tag("loadingLoc").style.display = "block";
            loadLocationsofUser(db, '{{request()->uid}}');
            setInterval(function(){
              tag("loadingLoc").style.display = "none";
            }, 3000);
          }else{
            swal({
                title: " Alerta não está mais ativo",
                icon: "warning"
            });
          }
        }

    </script>    
@endsection

@section('content')

<div style="display: none" id="loadingLoc" class="card">
  <div class="card-body">
    Atualizando Localização...
  </div>
</div>

    <div class="card">
        <div class="card-header card-header-primary">
        <h4 class="card-title ">Alerta</h4>
        <p class="card-category">{{request()->name}}</p>
        </div>
        <div class="card-body">
        <div class="table-responsive">
            <table class="table">
                <thead class=" text-primary">
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Última Localização</th>
                    <th>Data e Hora</th>
                    <th>Audio</th>
                    <th>Observação</th>
                    <th>Opções</th>
                </thead>
                <tbody>
                    <tr>
                        <td id="userAlertCPF">{{request()->id}}</td>
                        <td id="userAlertName">{{request()->name}}</td>
                        <td id="alertLocation">{{request()->location}}</td>
                        <td>{{request()->dateTime}}</td>
                        <td><a href="#" onclick="openAudio()">audio</a></td>
                        <td id="alertObs">{{request()->obs}}</a></td>
                        <td><a onclick="updateAlert()" href="#">ATUALIZAR LOCALIZAÇÃO</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
  </div>

<br/>

  <div class="card">
    <div class="card-header card-header-warning">
    <h4 class="card-title ">Histórico de Localização</h4>
    <p class="card-category">Últimas localizações do Usuário</p>
    </div>
    <div class="card-body">
    <div class="table-responsive">
        <table class="table">
        <thead class=" text-primary">
            <th>Data e Hora</th>
            <th>Última Localização</th>
        </thead>
        <tbody id="tblUserLocations">
        </tbody>
        </table>
    </div>
    </div>
</div>
@endsection

<!--
    Falta Colocar CreatedAt na coleção Locations
    Falta converter a localização 
    Falta Corrigir Layout
-->