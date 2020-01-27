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
        <h4 class="card-title ">Usuário</h4>
        <p class="card-category">Miguel Vieira</p>
        </div>
        <div class="card-body">
        <div class="table-responsive">
            <table class="table">
            <thead class=" text-primary">
                <th>ID</th>
                <th>Nome</th>
                <th>Última Localização </th>
                <th>Status</th>
                <th>Opções</th>
            </thead>
            <tbody>
                <tr>
                    <td>{{request()->id}}</td>
                    <td>{{request()->name}}</td>
                    <td>{{request()->location}}</td>
                    <td>{{request()->status}}</td>
                    <td>
                        <a href="/editar/user/{{request()->uid}}">Editar</a>
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
    <p class="card-category">últimas localizações do usuário</p>
    </div>
    <div class="card-body">
    <div class="table-responsive">
        <table class="table">
        <thead class=" text-primary">
            <th>ID</th>
            <th>Nome</th>
            <th>Última Localização </th>
            <th>Status</th>
            <th>Opções</th>
        </thead>
        <tbody id="tblUsers">
        </tbody>
        </table>
    </div>
    </div>
</div>
@endsection
