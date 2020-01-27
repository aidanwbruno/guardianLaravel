<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('../css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('../css/dashboard.css') }}" rel="stylesheet">

   
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                            </li>
                            @if (Route::has('register'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                                </li>
                            @endif
                        @else
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>

     <!-- Firebase -->
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-firestore.js"></script>
    <script src="{{asset('js/fire.js')}}"></script>
    
    <!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries -->
        
        <script>
            // Initialize Firebase

            var alertasResolvidos = 0;
            var alertasAbertos = 0;

            firebase.initializeApp(getFirebaseConfig());
            var db = getFireDB(firebase);
           
            loadCollection("USUARIOS", (list) =>{
                var userTable = tag("historico");
                var html = "";
                var id = 0;
                list.forEach((doc) => {
                    id++;
                    html += createUserRow(doc, id);
                    console.log(name);
                });
                setVal("user-count", list.size);
                userTable.innerHTML += html;
            });
            
            loadCollection("ALERTAS", (list) =>{
                alertasAbertos = 0;
                alertasResolvidos = 0;
                list.forEach((doc) => {
                    var alerta = doc.data();
                    if(alerta.open == true){
                        alertasAbertos++;
                    }else{
                        alertasResolvidos++;
                    }
                    console.log(alerta.open);
                });
                setVal("alert-count", list.size);
                console.log("Abertos:"+alertasAbertos+" Resolvidos:"+alertasResolvidos);
            });

            function getFireDB() {
                database = firebase.firestore(); // returt the fireStore Database
                database.enablePersistence()
                    .catch(function (err) {
                        if (err.code == 'failed-precondition') {
                            console.log("Multiple tabs open, persistence can only be enabled");
                        } else if (err.code == 'unimplemented') {
                            console.log("The current browser does not support all of the features required to enable persistence");
                        }
                    });
                return database;
            }

            function loadCollection(name, callback) {
                db.collection(name).onSnapshot(function (querySnapshot) {
                    callback(querySnapshot);
                });    
            }

        </script>

</body>
</html>
