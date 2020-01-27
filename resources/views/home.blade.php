@extends('layouts.template')


@section('script')
    <script>
        firebase.initializeApp(getFirebaseConfig());
        var db = getFireDB(firebase);
        loadCountAlerts(db);
        loadUsersHistory(db);
    </script>    
@endsection

@section('content')
<div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-warning card-header-icon">
            <div class="card-icon">
              <i class="material-icons">people</i>
            </div>
            <p class="card-category">Usuários</p>
            <h3 id="user-count" class="card-title">XX</h3>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-success card-header-icon">
            <div class="card-icon">
              <i class="material-icons">person_pin</i>
            </div>
            <p class="card-category">Usuários Ativos</p>
            <h3 id="active-user-count" class="card-title">XX</h3>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-danger card-header-icon">
            <div class="card-icon">
              <i class="material-icons">notification_important</i>
            </div>
            <p class="card-category">Alertas Ativos</p>
            <h3 id="alert-count" class="card-title">XX</h3>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-info card-header-icon">
            <div class="card-icon">
               <i class="material-icons">error</i>
            </div>
            <p class="card-category">Alertas Resolvidos</p>
            <h3 id="closed-alert-count" class="card-title">XX</h3>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
    </div>
   
    <div class="row">         
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-warning">
            <h4 class="card-title">Histórico</h4>
            <p class="card-category">Histórico de Ativação do Aplicativo</p>
          </div>
          <div class="card-body table-responsive">
            <table class="table table-hover">
              <thead class="text-warning">
                <th>Usuário</th>
                <th>Data / Hora</th>
                <th>Última Localização</th>
              </thead>
              <tbody id="tblhistory">                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
@endsection

<!--
  Falta organizar o Histórico de ativações, pois estas informações não se encontram no App android.
  Falta COnverter Lat Lng em Endereço real ou usar um mapa. 
  Falta a Paginação
  Falta Organizar layout ex: menu
-->
