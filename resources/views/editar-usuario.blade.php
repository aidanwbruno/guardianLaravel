@extends('layouts.template')

@section('script')
    <script>
       // firebase.initializeApp(getFirebaseConfig());
       // var db = getFireDB(firebase);
        //loadUsers(db);
        //loadLocationsofUser(db, '{{request()->uid}}');
    </script>    
@endsection

@section('content')
@section('content')
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
                    <input type="text" class="form-control" disabled>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">CPF</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Email</label>
                    <input type="email" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Data de Nascimento</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div>
              <div class="row">
                
                
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="bmd-label-floating">Endereço</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Cidade</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">Estado</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">CEP</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-6">
                  <div class="form-group">
                    <label class="bmd-label-floating">Possui Veículo?</label>
                    <input type="email" class="form-control">
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
              <button type="submit" class="btn btn-primary pull-right">Atualizar Usuário</button>
              <div class="clearfix"></div>
            </form>
          </div>
        </div>
      </div>
 
    </div>
  </div>
@endsection
