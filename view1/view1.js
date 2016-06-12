'use strict';

var myApp =angular.module('myApp.view1', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view1/view1.html',
    controller: 'bookCtrl'
  });
}]);

myApp.controller('bookCtrl',function($scope, $http){
    //Локальное простанство имен контроллера
    $scope.bookCtrlNs={};

    $scope.bookCtrlNs.customers=[];

        //Загрузка файла конфигурации и получение настроек
    $scope.bookCtrlNs.configDb ={};
    $scope.bookCtrlNs.configDbUrl = 'localhost:2403/customers';
    $http.get('config.json')
        .success(function(data) {
            $scope.bookCtrlNs.configDb = data;
            $scope.bookCtrlNs.configDbUrl = 'http://'+ $scope.bookCtrlNs.configDb.dbHost + ':' + $scope.bookCtrlNs.configDb.dbPort + '/' + $scope.bookCtrlNs.configDb.collectionName;
        }).error(function(err) {
            console.log(err);
        });

    //Идентификатор текущего абонента
  $scope.bookCtrlNs.idf = '';

    //Результат операции обращения к БД
  $scope.bookCtrlNs.messageResponse = 'Ошибка соединения с удаленной базой данных!';

    //Идентификатор количества записей
  $scope.bookCtrlNs.records = 10;

    //Идентификатор типа сортировки
  $scope.bookCtrlNs.sortBy = '';

    //Тип работы с данными: 0-добавление 1-редактирование
  $scope.bookCtrlNs.typeOperation = 0;

    //Шаблон информации о пользователе
  $scope.bookCtrlNs.templateUser ={"Name":"",
          "Email":"",
          "Telephone":"",
          "Street":"",
          "Address":"",
          "City":"",
          "State":"",
          "Zip":"",
          "id":""};

   //Сброс текущего обонента
  $scope.bookCtrlNs.cleanId = function(flag){
       if(flag)
            $scope.bookCtrlNs.idf = '';
       $scope.bookCtrlNs.templateUser ={"Name":"",
           "Email":"",
           "Telephone":"",
           "Street":"",
           "Address":"",
           "City":"",
           "State":"",
           "Zip":"",
           "id":""};
    };

    //Загрузка базы данных абонентов в автономном режиме
  $scope.bookCtrlNs.loadLocalDb = function(){
      $scope.bookCtrlNs.customers = customersModel;
  };

    //Выбор абонента для редактирования
  $scope.bookCtrlNs.changeUser = function(changeIdf){
      $scope.bookCtrlNs.idf = changeIdf;
  };

    //Создание нового абонента
  $scope.bookCtrlNs.createUser = function(){
      $scope.bookCtrlNs.cleanId(true);
      $scope.bookCtrlNs.typeOperation=0;
      $('#editForm').toggle();
      $('#editBg').toggle();
  };

    //Добавление нового пользователя
  $scope.bookCtrlNs.addUsers = function(type){
      if(type == 0){
        $scope.bookCtrlNs.templateUser.id = Math.random()*Math.pow(10,17);
        $scope.bookCtrlNs.customers.push($scope.bookCtrlNs.templateUser);
      }else if(type == 1){
            for(var items in $scope.bookCtrlNs.customers){
                if($scope.bookCtrlNs.customers[items].id == $scope.bookCtrlNs.idf){
                    $scope.bookCtrlNs.customers[items] = $scope.bookCtrlNs.templateUser;
                    $scope.bookCtrlNs.templateUser ={"Name":"",
                      "Email":"",
                      "Telephone":"",
                      "Street":"",
                      "Address":"",
                      "City":"",
                      "State":"",
                      "Zip":"",
                      "id":""};
        }
      }
    }
    $('#editForm').toggle();
    $('#editBg').toggle();
    $('.formData input').removeClass('ng-dirty').addClass('ng-pristine');
  };

    //Редактирование абонента
  $scope.bookCtrlNs.updateUsers = function(){
      if($scope.bookCtrlNs.idf != ''){
        for(var items in $scope.bookCtrlNs.customers){
            if($scope.bookCtrlNs.customers[items].id == $scope.bookCtrlNs.idf){
                $scope.bookCtrlNs.templateUser = $scope.bookCtrlNs.customers[items];
                $scope.bookCtrlNs.typeOperation=1;
            }
        }
      $('#editForm').toggle();
      $('#editBg').toggle();
      }
  };


    //Удаление абонента
  $scope.bookCtrlNs.deleteUsers = function(){
      if($scope.bookCtrlNs.idf != ''){
          for(var items in $scope.bookCtrlNs.customers){
              if($scope.bookCtrlNs.customers[items].id == $scope.bookCtrlNs.idf){
                  $scope.bookCtrlNs.customers.splice(items,1);
              }
          }
      }
  };

    //Импорт списка абонентов из БД
  $scope.bookCtrlNs.getCustomers = function(){
      $http.get($scope.bookCtrlNs.configDbUrl)
          .success(function(customers) {
              $scope.bookCtrlNs.customers = customers;
              $scope.bookCtrlNs.showMessage(true,'Данные пользователей успешно загружены!');
          }).error(function(err) {
              $scope.bookCtrlNs.showMessage(false,'Ошибка соединения с удаленной базой данных!');
          });
  };

    //Добавить абонента в список БД
  $scope.bookCtrlNs.setCustomers = function(){
      if($scope.bookCtrlNs.idf != ''){
          for(var items in $scope.bookCtrlNs.customers){
              if($scope.bookCtrlNs.customers[items].id == $scope.bookCtrlNs.idf){
                  $scope.bookCtrlNs.templateUser = $scope.bookCtrlNs.customers[items];
              }
          }
          var req = {
           method: 'POST',
           url: $scope.bookCtrlNs.configDbUrl,
           headers: {
             'Content-Type': 'application/json'
           },
           data: { "Name":$scope.bookCtrlNs.templateUser.Name,
                    "Email":$scope.bookCtrlNs.templateUser.Email,
                    "Telephone":$scope.bookCtrlNs.templateUser.Telephone,
                    "Street":$scope.bookCtrlNs.templateUser.Street,
                    "Address":$scope.bookCtrlNs.templateUser.Address,
                    "City":$scope.bookCtrlNs.templateUser.City,
                    "State":$scope.bookCtrlNs.templateUser.State,
                    "Zip":$scope.bookCtrlNs.templateUser.Zip
           }
          }
          $http(req)
              .success(function(customers) {
                  $scope.bookCtrlNs.showMessage(true,'Запись пользователя успешно создана!!');
              }).error(function(err) {
                  $scope.bookCtrlNs.showMessage(false,'Ошибка соединения с удаленной базой данных!');
              });
      }
  };

    //Удалить абонента из списка БД
  $scope.bookCtrlNs.deleteCustomers = function(){
      if($scope.bookCtrlNs.idf != ''){
          var req = {
           method: 'DELETE',
           url: $scope.bookCtrlNs.configDbUrl + '/' + $scope.bookCtrlNs.idf
          }
          $http(req)
              .success(function(customers) {
                  $scope.bookCtrlNs.showMessage(true,'Запись пользователя успешно удалена!');
              }).error(function(err) {
                  $scope.bookCtrlNs.showMessage(false,'Ошибка соединения с удаленной базой данных!');
              });
          $scope.bookCtrlNs.deleteUsers();
      }
  };

   //Редактировать абонента в списке БД
  $scope.bookCtrlNs.updateCustomers = function(){
      if($scope.bookCtrlNs.idf != ''){
          for(var items in $scope.bookCtrlNs.customers){
              if($scope.bookCtrlNs.customers[items].id == $scope.bookCtrlNs.idf){
                  $scope.bookCtrlNs.templateUser = $scope.bookCtrlNs.customers[items];
              }
          }
          var req = {
            method: 'POST',
            url: $scope.bookCtrlNs.configDbUrl + '/' + $scope.bookCtrlNs.idf,
            headers: {
            'Content-Type': 'application/json'
           },
           data: { "Name":$scope.bookCtrlNs.templateUser.Name,
                       "Email":$scope.bookCtrlNs.templateUser.Email,
                       "Telephone":$scope.bookCtrlNs.templateUser.Telephone,
                       "Street":$scope.bookCtrlNs.templateUser.Street,
                       "Address":$scope.bookCtrlNs.templateUser.Address,
                       "City":$scope.bookCtrlNs.templateUser.City,
                       "State":$scope.bookCtrlNs.templateUser.State,
                       "Zip":$scope.bookCtrlNs.templateUser.Zip
           }
          }
          $http(req)
              .success(function(customers) {
                  $scope.bookCtrlNs.showMessage(true,'Запись пользователя успешно обновлена!');
              }).error(function(err) {
                  $scope.bookCtrlNs.showMessage(false,'Ошибка соединения с удаленной базой данных!');
              });
      }
  };

    //Спрятать форму
  $scope.bookCtrlNs.closeForm = function(){
      $('#editForm').toggle();
      $('#editBg').toggle();
      $scope.bookCtrlNs.cleanId(true);
      $scope.bookCtrlNs.cleanFormValid();
  };

    //Сбросить форму
  $scope.bookCtrlNs.resetForm = function(){
      $scope.bookCtrlNs.cleanId(true);
      $scope.bookCtrlNs.cleanFormValid();
  };

    //Очистка валидатора формы
  $scope.bookCtrlNs.cleanFormValid = function(){
      $('.formData input').removeClass('ng-dirty').addClass('ng-pristine');
      $scope.bookCtrlNs.createForms.userName.$dirty = false;
      $scope.bookCtrlNs.createForms.userName.$pristine = true;
      $scope.bookCtrlNs.createForms.emailUser.$dirty = false;
      $scope.bookCtrlNs.createForms.emailUser.$pristine = true;
      $scope.bookCtrlNs.createForms.telephoneUser.$dirty = false;
      $scope.bookCtrlNs.createForms.telephoneUser.$pristine = true;
      $scope.bookCtrlNs.createForms.streetUser.$dirty = false;
      $scope.bookCtrlNs.createForms.streetUser.$pristine = true;
      $scope.bookCtrlNs.createForms.addressUser.$dirty = false;
      $scope.bookCtrlNs.createForms.addressUser.$pristine = true;
      $scope.bookCtrlNs.createForms.stateUser.$dirty = false;
      $scope.bookCtrlNs.createForms.stateUser.$pristine = true;
      $scope.bookCtrlNs.createForms.zipUser.$dirty = false;
      $scope.bookCtrlNs.createForms.zipUser.$pristine = true;
      $scope.bookCtrlNs.createForms.cityUser.$dirty = false;
      $scope.bookCtrlNs.createForms.cityUser.$pristine = true;
      $scope.bookCtrlNs.createForms.cityUser.$dirty = false;
      $scope.bookCtrlNs.createForms.cityUser.$pristine = true;
  };

  //Обаботка полей формы
  $scope.bookCtrlNs.processingForm = function(){
      $scope.bookCtrlNs.addUsers($scope.bookCtrlNs.typeOperation);
  };

  //Отображение результата обращения к серверу БД
  $scope.bookCtrlNs.showMessage = function(status, info){
      if(status){
          $('#messageResponse').addClass('statusResponseSuccess').removeClass('statusResponseError');
      }else{
          $('#messageResponse').addClass('statusResponseError').removeClass('statusResponseSuccess');
      }
      $scope.bookCtrlNs.messageResponse = info;
      $('#messageResponse').toggle()
          .animate({'opacity':'+=1'},100,'swing')
          .delay(3000)
          .animate({'opacity':'-=1'},1000,'swing', function(){
            $('#messageResponse').toggle();
      });
  };
});
