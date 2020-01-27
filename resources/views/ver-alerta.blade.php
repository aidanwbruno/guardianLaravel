@extends('layouts.template')

@section('script')
    <script>
        firebase.initializeApp(getFirebaseConfig());
        var db = getFireDB(firebase);
        //loadUsers(db);
        loadLocationsofUser(db, '{{request()->uid}}');
    </script>    
@endsection

@section('content')

{{request()->mg}}
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
                    <th>Localização Inicial</th>
                    <th>Data e Hora</th>
                    <th>Opções</th>
                </thead>
                <tbody>
                    <tr>
                        <td id="userAlertCPF">{{request()->id}}</td>
                        <td id="userAlertName">{{request()->name}}</td>
                        <td>{{request()->location}}</td>
                        <td>{{request()->dateTime}}</td>
                        <td>
                            <a href="/editar/user/{{request()->uid}}">ATUALIZAR LOCALIZAÇÃO</a>
                        </td>
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