<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/home', function () {
    return view('home');
});

Route::get('/usuarios', function () {
    return view('usuarios');
});

Route::get('/editar/user', function () {
    return view('editar-usuario');
});

Route::get('/user/{user_id}', function () {
    return view('ver-usuario');
});


Route::get('/alertas', function () {
    return view('alertas');
});

Route::get('/alert/{alert}', function () {
    return view('ver-alerta');
});


Auth::routes();

//Route::get('/home', 'HomeController@index')->name('home');
