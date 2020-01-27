@extends('layouts.template')

@section('script')
    <script>
  
        firebase.initializeApp(getFirebaseConfig());
        var db = getFireDB(firebase);
        loadUsers(db);
    </script>    
@endsection

@section('content')
<div class="card">
    <div class="card-header card-header-primary">
      <h4 class="card-title ">Usuários</h4>
      <p class="card-category">Lista de usuarios do Guardian</p>
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
