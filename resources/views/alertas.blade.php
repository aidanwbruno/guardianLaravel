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
            <th>Última Localização</th>
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