;(function($) {

    $.Sprint = function(element, options) {

        var defaults = {
            hello: 'world',

			storage: localStorage, 			// use localStorage or sessionStorage for the Shopping Cart
			cartPrefix: "sprintShop-", 		// Prefix string to be prepended to the cart's name in the session storage
			cartName: "sprintShop-cart",	// Cart name in the session storage

            onEvent: function() {}
//			click: testClick() {
//				console.log("=> testClick() ...");
//			}
        }

        var plugin = this;
		plugin.$element = $( element );
        plugin.settings = {};
		plugin.allPhones = [];
		plugin.filterPhones = [];
		plugin.$populatePhones = plugin.$element.find("#populatePhones");
		plugin.$numPhonesDisplayed = plugin.$element.find("#results");
		plugin.$cartList = plugin.$element.find("#cartList");
		plugin.$cartCount = plugin.$element.find("#cart-count");
		plugin.$cartClear = plugin.$element.find("#cartClear");

        var init = function() {
			console.log("=> init() ...");
            plugin.settings = $.extend({}, defaults, options);
            plugin.element = element;

			_handleClearCart();		// setup handler to call clearCart when clicked
			//_getPhoneData();		// pull all phone data from server					** This or the next line has to be commented out **
			_getPhoneDataLocal();	// pull all phone data from local file for testing	** This or the prev line has to be commented out **
			_displayPhoneData();	// update phones page with all phone data
			_updateShoppingCart();	// pull cart data from storage and initialize the shopping cart icon
			console.log("=> initialize finished, waiting on actions");
        }

		//
		// 	=========  P U B L I C    M E T H O D S  =========
		//
		plugin.sayHello = function() {
			console.log("hello " + plugin.settings.hello);
		}

		plugin.test = function() {
			console.log("=> test() ...");
			console.log("  -> test hello " + plugin.settings.hello);
			console.log("  -> Num of allPhones = " + plugin.allPhones.length);
			console.log("  -> Num of filterPhones = " + plugin.filterPhones.length);
			console.log("  -> form.add-to-cart = " + plugin.$formAddToCart.legnth );
			console.log("  -> populatePhones = " + plugin.$populatePhones.length );
		}

		//
		// 	=========  P R I V A T E    M E T H O D S  =========
		//

		var _handleClearCart = function() {
			console.log("=> _handleClearCart() ...");
			plugin.$cartClear.on("click", function() {
				_clearCart();
			});
		}

		var _getPhoneData = function() {
			console.log("=> _getPhoneData ... ");

			var getPhonesURL = "http://144.229.209.141/primary-rest/shop_get_phones";
			$.ajax({
				type: 'POST',
				url: getPhonesURL,
				headers: { 'name': 'sprint' },
				dataType: 'json',
				contentType: 'application/json',
				success: function(responseData) {
						console.log("SUCCESS:" + JSON.stringify(responseData));
					},
					error: function (responseData) {
						console.log("POST Failed.");
				}
			})
			.done( function ( data ) {
				console.log("  -> .done");
				phonesObj = JSON.parse(JSON.stringify( data ));
				plugin.allPhones = phonesObj.responses.response[0].getListPhonesResponse.phones;
				plugin.filterPhones = plugin.allPhones;
				console.log("AJAX DONE: " + phonesObj.responses.response[0].getListPhonesResponse.phones.length);
			});
		}

		var _getPhoneDataLocal = function() {
			console.log("=> _getPhoneDataLocal() ...");
			phonesObj = JSON.parse(shop_get_phones);
			plugin.allPhones = phonesObj.responses.response[0].getListPhonesResponse.phones;
			plugin.filterPhones = plugin.allPhones;
			console.log("  -> Number of phones retrieved = " + plugin.allPhones.length);
		}

		var _displayPhoneData = function() {
			console.log("=> _displayPhoneData() ...");
			console.log("  -> Number of phones displayed = " + plugin.filterPhones.length);

			var newhtml = new String;
			var numPhones = plugin.filterPhones.length;
			var numPhonesTotal = plugin.allPhones.length;

			//this.$populatePhones.empty(); // i don't think i need this

			for (var i=0; i<numPhones; i++) {
				newhtml = '' +
							'<div class="col-md-6 phone onSale" id="' + plugin.filterPhones[i].assetId.$ + '">' +
							'	<h3 id="title-02">' + plugin.filterPhones[i].manufacturerName.$ + ' '  + plugin.filterPhones[i].phoneName.$ + '</h3>' +
							'	<div class="left">' +
							'		<a href="phone-00.html"><img src="img/phone3-1.png" id="image-02"></img></a>' +
							'		<div class="colorOptions">' +
							'			<input type="radio" name="color" value="blue"  id="color1" checked><label for="color1">Blue</label></input>' +
							'			<input type="radio" name="color" value="black" id="color2"><label for="color2">Black</label></input>' +
							'			<input type="radio" name="color" value="green" id="color3"><label for="color3">Green</label></input>' +
							'		</div>' +
							'		<a class="compare" href="">Compare this device</a>' +
							'		<ul id="specs-02">' +
							'			<li id="apple" data-toggle="tooltip" data-placement="top" title="Apple iOS"></li>' +
							'			<li id="display" data-toggle="tooltip" data-placement="top" title="5 inch Display"></li>' +
							'			<li id="battery" data-toggle="tooltip" data-placement="top" title="15h battery"></li>' +
							'		</ul>' +
							'		<ul class="rating half" id="rating-02">' +
							'			<li></li><li></li><li></li><li></li><li></li><span id="ratings">984</span>' +
							'		</ul>' +
							'	</div>' +
							'	<div class="right">';
				newhtml = newhtml + 
							'		<p class="shortDescription">'+ plugin.filterPhones[i].shortDescription.$ + '</p>' +
							'		<a class="offer-1">Save up to $25/mo on your plan</a>' +
							'		<a class="offer-2">Limited time offer</a>' +
							'		<a class="offer-3">Web exclusive-New line only</a>' +
							'<h2 class="serviceagreement" id="serviceagreement-02">' + plugin.filterPhones[i].phoneVariantsDefault.price.$ + '</h2>' +

							'		<p class="serviceagreement" id="serviceagreementtext-02">2-yr service agreement</p>' +
							'		<form class="actions ' + plugin.filterPhones[i].assetId.$ + '">' +
							'		</form>' +
							'	</div>' +
							'</div>';
				plugin.$populatePhones.append(newhtml);
				plugin.$populatePhones.find("form."+plugin.filterPhones[i].assetId.$)
					.append('<a class="btn btn-default" href="phone.html?phone=' + plugin.filterPhones[i].assetId.$ + '">Device Details</a>');
//					.append('<a class="btn btn-default" >Device Details</a>');

				plugin.$populatePhones.find("form."+plugin.filterPhones[i].assetId.$)
					.append('<a class="btn btn-primary" type="submit" id="' + plugin.filterPhones[i].assetId.$ + '">Add to Cart</a>')
					.attr("id", plugin.filterPhones[i].assetId.$)
					.on("click",'.btn-primary', function() {
						_addPhoneToCart(this.id);
					});

			}
			plugin.$numPhonesDisplayed.html('<span>' + numPhones + '</span> of <span>' + numPhonesTotal + '</span> available phones match your search');
		}

		var _clearCart = function () {
			console.log("=> _clearCart() ... " );
			var cart = {};
			cart.items = [];
			plugin.settings.storage[plugin.settings.cartName] = JSON.stringify(cart);
			_updateShoppingCart();
		}

		var _addPhoneToCart = function(assetId) {
			console.log("=> _addPhoneToCart() ... " + assetId);

			var item = {};
			if( plugin.settings.storage.length ) {
				var cart = JSON.parse(plugin.settings.storage.getItem( plugin.settings.cartName ));
			} else {
				var cart = {};
				cart.items = [];
			}

			var numPhonesTotal = plugin.allPhones.length;
			for (var i=0; i<numPhonesTotal; i++) {
				if( assetId == plugin.allPhones[i].assetId.$ ) {
					var item = {"assetId":assetId , 
								"manufacturerName":plugin.allPhones[i].manufacturerName.$ ,
								"phoneName":plugin.allPhones[i].phoneName.$ , 
								"price":plugin.allPhones[i].phoneVariantsDefault.price.$,
								"quantity":"1"};
					cart.items.push(item);
					plugin.settings.storage[plugin.settings.cartName] = JSON.stringify(cart);
					break;
				}
			}
			_updateShoppingCart();
		}

		var _updateShoppingCart = function () {
			console.log("=> _updateShoppingCart() ...");
			var cart = JSON.parse(plugin.settings.storage.getItem( plugin.settings.cartName ));

			var newhtml = "";
			if( cart ) {
//			if( plugin.settings.storage.length ) {  // not sure i need this ...  more investigation
				if (plugin.settings.storage.getItem(plugin.settings.cartName).length) {
					var obj = JSON.parse(plugin.settings.storage.getItem(plugin.settings.cartName));
					for( var i=0; i<obj.items.length; i++ ) {
						newhtml = newhtml + '<li>' + obj.items[i].manufacturerName + " " + obj.items[i].phoneName + '<span>' + obj.items[i].price + '</span></li>';
					}
					plugin.$cartList.html( newhtml );
					plugin.$cartCount.html( obj.items.length );
				}
			}
			else {
				cart = {};
				cart.items = [];
				plugin.settings.storage.setItem( plugin.settings.cartName, JSON.stringify( cart ) );
				plugin.$cartList.html( "" );
				plugin.$cartCount.html( "0" );
				console.log("shoppingCart empty");
			}
		}

		// THIS NEEDS TO BE REDONE - just copied over from the old stuff
		var _populateAccessories = function()  {
			consoel.log("=> _populateAccessories() ...");
/*
			//var phoneAccessoriesURL = "http://144.229.209.141/primary-rest/shop_get_phones_accessories";
			var thehtml = new String;
			var i;
			for (i=0; i<accessories.length; i++) {
				thehtml = thehtml + 
					'<div class="col-md-3 acc" id="' + accessories[i].value + '">' +
					'<h4>' + accessories[i].name + '</h4>' +
					'<img src="' + accessories[i].img + '"></img>' + 
					'<p>' + accessories[i].description + '</p>' +
					'<span>' + accessories[i].price + '</span>' + 
					'<a href="purchase-01.html" class="btn btn-sm btn-primary">Add to Cart</a>' +
					'</div>';
			}
			thehtml = thehtml + 
				'<h3 class="notyourphone">Accessories for Samsung Galaxy S5</h3>' + 
				'<p class="notyourphone bottom">Not your phone? <a class="btn btn-default btn-sm" href="accessories.html"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> Switch here</a></p>';
			document.getElementById('populateAccessories').innerHTML = thehtml;
*/
		}
        
        init();

    }
})(jQuery);

$(document).ready(function() {

    // create a new instance of the plugin
    setTimeout("var sprintPlugin = new $.Sprint($('#SprintShop'));",100)

    // call public method
	//sprintPlugin.sayHello();

    // access public property
	//console.log("Say hello again? " + sprintPlugin.settings.hello);

});
