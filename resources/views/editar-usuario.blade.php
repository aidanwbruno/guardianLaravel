@extends('layouts.template')

@section('menu')
<li class="nav-item">
  <a class="nav-link" href="{{url('/home')}}">
    <i class="material-icons">dashboard</i>
    <p>Home</p>
  </a>
</li>
<li class="nav-item active ">
  <a class="nav-link" href="{{url('/usuarios')}}">
    <i class="material-icons">people</i>
    <p>Usuários</p>
  </a>
</li>
<li class="nav-item ">
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
       loadUserById(db, '{{request()->user_id}}');
    </script>    
@endsection

@section('content')
@section('content')
<form>
<div class="container-fluid">
    <div class="row">
      <div >
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title">Editar Perfil Usuário</h4>
            <p class="card-category">Complete as informações</p>
          </div>
          <div class="card-body">
            <form>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Nome</label>
                    <input type="text" id="user_nome"  class="form-control" disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">CPF</label>
                    <input type="number" id="user_cpf" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Email</label>
                    <input type="email" id="user_email" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Data de Nascimento</label>
                    <input type="date" id="user_nascimento" class="form-control">
                  </div>
                </div>
              </div>

              <div class="row">
              </div>

              <div class="row">
                <div class="col-md-10">
                  <div class="form-group">
                    <label class="bmd-label-floating">Endereço</label>
                    <input type="text" id="user_rua" class="form-control">
                  </div>
                </div>

                <div class="col-md-2">
                  <div class="form-group">
                    <label class="bmd-label-floating">Número</label>
                    <input type="number" id="user_numero" class="form-control">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Cidade</label>
                    <input type="text" id="user_cidade" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Bairro</label>
                    <input type="text" id="user_bairro" class="form-control">
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-group">
                    <label class="bmd-label-floating">Estado</label>
                    <input type="text" id="user_estado" class="form-control">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label class="bmd-label-floating">CEP</label>
                    <input type="number" id="user_cep" class="form-control">
                  </div>
                </div>
              </div>

              <hr/>

              <div style="display: none" class="row">
                  <div class="">
                  <div class="form-group">
                    <label class="bmd-label-floating">Possui Veículo?</label>
                    <input type="checkbox" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Placa</label>
                    <input type="text" class="form-control">
                  </div>
                </div>


                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Marca</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Modelo</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Cor</label>
                    <input type="text" class="form-control">
                  </div>
                </div>

              </div>
              <button onclick="updateUser('{{request()->user_id}}')" type="button" class="btn btn-primary pull-right">Atualizar Usuário</button>
              <div class="clearfix"></div>
            </form>
          </div>
        </div>
      </div>
 
    </div>
  </div>
</form>
@endsection
<!-- 
https://firebase.google.com/docs/firestore/query-data/get-data
-->