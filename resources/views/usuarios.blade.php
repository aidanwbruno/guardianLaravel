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
        loadUsers(db);
        setTimeout(function()
{
 sortTable(0,'tblUsers');
}, 2000);



function closeUser(enable, id) {

  var title = "Ativar";

  if(enable){
    title = "Desativar"
  }

    loadDocument(db, "USUARIOS", id, (userDoc) => {
        if (userDoc.exists) {
            var doc = userDoc.data();
            swal({
                title: title+" Usuário",
                text: "Deseja "+title+" esse usuário?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if(enable == true || enable == 'true'){
                  doc.ativo = false;
                }else{
                  doc.ativo = true;
                }
        
                db.collection("USUARIOS").doc(id).update(doc).then(function (docRef) {
                    if (willDelete) {
                        swal("Usuário "+title+" com Sucesso!", {
                            icon: "success",
                        });
                        setVal("st_u_" + id + "", ""+doc.ativo+"");
                        setTimeout(function()
{
 // refresh();
 sortTable(0,'tblUsers');
}, 2000);
                    } else {
                        //swal("Erro ao "+title+" o Usuário!");
                    }
                }).catch(function (error) {
                    callback(false);
                    console.error("Error adding document: ", error);
                });
            });
        }
    });
}

    </script>    
@endsection

@section('content')
<div class="card">
    <div class="card-header card-header-primary">
      <h4 class="card-title ">Usuários</h4>
      <p class="card-category">Lista de Usuários do Guardian</p>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead class=" text-primary">
            <th onclick="sortTable(1, 'tblUsers')">Nome</th>
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
