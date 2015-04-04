appController.controller('phoneDetailController', ['$http', function($http){
  this.data=null;
  this.curImage="left";
  var app=this;
  var id=location.search.split("=")[1];
  $http.get("data/"+id+".json").success(function(data){
    app.data=data.responses.response[0].getPhoneResponse.phone;
  }); 
  this.addToCart=function(){
    var item = {};
    if( localStorage.length ) {
      var cart = JSON.parse(localStorage.getItem( "sprintShop-cart" ));
    } else {
      var cart = {};
      cart.items = [];
    }

    var item = {"assetId":this.data.assetId.$ , 
          "manufacturerName":this.data.manufacturerName.$ ,
          "phoneName":this.data.phoneName.$ , 
          "price":this.data.phoneVariantsDefault.price.$,
          "quantity":"1"};
    cart.items.push(item);
    localStorage.setItem( "sprintShop-cart" , JSON.stringify(cart));
    this.updateShoppingCart();
  };
  this.updateShoppingCart=function () {
    var cart = JSON.parse(localStorage.getItem( "sprintShop-cart" ));

    if( !cart ) {
      cart = {};
      cart.items = [];
    }
    var newhtml="";
    for( var i=0; i<cart.items.length; i++ ) {
      newhtml = newhtml + '<li>' + cart.items[i].manufacturerName + " " + cart.items[i].phoneName + '<span>' + cart.items[i].price + '</span></li>';
    }
    $("#cartList").html( newhtml );
    $("#cart-count").html( cart.items.length );
  }
}]);
