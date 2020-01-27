@extends('layouts.template')

@section('script')
    <script>
        firebase.initializeApp(getFirebaseConfig());
        var db = getFireDB(firebase);
        loadAlerts(db);
    </script>    
@endsection

@section('content')
<div class="card">
    <div class="card-header card-header-primary">
      <h4 class="card-title ">Alertas</h4>
      <p class="card-category">Lista de Alertas Recentes</p>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead class=" text-primary">
            <th>Usuário</th>
            <th>Data</th>
            <th>Data/Hora</th>
            <th>Status</th>
            <th>Opções</th>
          </thead>
          <tbody id="tblAlertas">
          </tbody>
        </table>
      </div>
    </div>
  </div>
@endsection