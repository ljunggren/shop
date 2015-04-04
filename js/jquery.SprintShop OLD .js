(function( $ ) {
	
	$.Sprint = function( element ) {
		this.$element = $( element );

		this.hello = 'world';

		this.init();
	};
	
	$.Sprint.prototype = {

		init: function() {
			console.log("=> init() ...");
			console.log("  -> init hello " + this.hello);
		    // Properties

			this.allPhones = [];
			this.filterPhones = [];
			this.shoppingCart = [];

			this.cartPrefix = "sprintShop-"; // Prefix string to be prepended to the cart's name in the session storage
			this.cartName = this.cartPrefix + "cart"; // Cart name in the session storage
			this.shippingRates = this.cartPrefix + "shipping-rates"; // Shipping rates key in the session storage
			this.total = this.cartPrefix + "total"; // Total key in the session storage
			this.storage = sessionStorage; // shortcut to the sessionStorage object

			this.$formAddToCart = this.$element.find( "form.add-to-cart" ); // Forms for adding items to the cart
			this.$populatePhones = this.$element.find( "#populatePhones" );
			this.$numPhonesDisplayed = this.$element.find( "#numPhonesDisplayed" ); 
			this.$cartList = this.$element.find( "#cartList" );
			this.$cartCount = this.$element.find( "#cart-count" );

			this.loadCart();
			//this.loadPhoneData();		// use this when pulling json data from server
			this.loadPhoneDataLocal();	// use this when testing json data locally
			this.displayPhones();

			this.test();
		},

		test: function() {
			console.log("=> test() ...");
			console.log("  -> test hello " + this.hello);
			console.log("  -> Num of allPhones = " + this.allPhones.length);
			console.log("  -> Num of filterPhones = " + this.filterPhones.length);
			console.log("  -> form.add-to-cart = " + this.$formAddToCart.legnth );
			console.log("  -> populatePhones = " + this.$populatePhones.length );
		},

		loadCart: function() {
			console.log("=> loadCart() ...");
			console.log("  -> loadCart hello " + this.hello);
			var cart = this.storage.getItem( this.cartName );
			if( cart ) {
				//console.log("  -> found cart: " + this._toJSONString( cart ));
				var cartObject = this._toJSONObject( cart );
			} else {
				console.log("  -> empty cart");
				cart = {};
				cart.items = [];
				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
			}
			//console.log("JSON: " + this._toJSONString( cart ) );
		},

		loadPhoneDataLocal: function() {
			console.log("=> loadPhoneDataLocal() ...");
			//this._getPhoneJSON(); // Use this for pulling remove/server side data
			this._getPhoneJSONLocal();  // Use this for reading from local file 
			//this._displayPhones();
			this._updateCart();
		},

		loadPhoneData: function() {
			// this needs to be updated with latest version 
			console.log("=> loadPhoneData() ...");
			this._getPhoneJSON();
			//this._displayPhones();
			this._updateCart();
		},

		displayPhones: function() {
			console.log("=> _displayPhones() ...");
			console.log("  -> _displayPhones hello " + this.hello);
			var newhtml = new String;
			var numPhones = this.filterPhones.length;
			var numPhonesTotal = this.allPhones.length;
			//this.$populatePhones.empty(); // i don't think i need this
			for (var i=0; i<numPhones; i++) {
				console.log("  -> display " + this.filterPhones[i].assetId.$);
				newhtml = '' +
							'<div class="col-md-6 phone onSale" id="' + this.filterPhones[i].assetId.$ + '">' +
							'	<h3 id="title-02">' + this.filterPhones[i].manufacturerName.$ + ' '  + this.filterPhones[i].phoneName.$ + '</h3>' +
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
							'		<p class="shortDescription">'+ this.filterPhones[i].shortDescription.$ + '</p>' +
							'		<a class="offer-1">Save up to $25/mo on your plan</a>' +
							'		<a class="offer-2">Limited time offer</a>' +
							'		<a class="offer-3">Web exclusive-New line only</a>' +
							'<h2 class="serviceagreement" id="serviceagreement-02">' + this.filterPhones[i].phoneVariantsDefault.price.$ + '</h2>' +

							'		<p class="serviceagreement" id="serviceagreementtext-02">2-yr service agreement</p>' +
							'		<form class="actions ' + this.filterPhones[i].assetId.$ + '">' +
							'		</form>' +
							'	</div>' +
							'</div>';
				this.$populatePhones.append(newhtml);
				this.$populatePhones.find("form."+this.filterPhones[i].assetId.$)
//					.append('<a class="btn btn-default" href="phone.html?phone=' + this.filterPhones[i].assetId.$ + '">Device Details</a>');
					.append('<a class="btn btn-default" >Device Details</a>');

				this.$populatePhones.find("form."+this.filterPhones[i].assetId.$)
					.append('<a class="btn btn-primary" type="submit" id="' + this.filterPhones[i].assetId.$ + '">Add to Cart</a>')
					.attr("id", this.filterPhones[i].assetId.$)
					.on("click",'.btn-primary',{cartName:this.cartName},this._addToCart );
				console.log("  -> cartName == " + this.cartName);
			}
			this.$numPhonesDisplayed.html('<span>' + numPhones + '</span> of <span>' + numPhonesTotal + '</span> available phones match your search');
			//showCart();
		},

		_addToCart: function(e) {
			console.log("=> addToCart() ... " + this.id);
			console.log("  -> cartName=" + e.data.cartName);

			var cart = sessionStorage.getItem(e.data.cartName);
			var cartObj = JSON.parse(cart);
			console.log("JSON: " + JSON.stringify(cartObj));
			

		},

		_updateCart: function() {
			console.log("=> _updateCart() ...");
			var newhtml = "";
			var cart = this.storage.getItem( this.cartName );
			var cartObj = this._toJSONObject( cart );

			if( this.storage.length && cartObj.items.length) {
				console.log("  -> JSON: " + this._toJSONString( cart ));
				for( var i=0; i<cartObj.items.length; i++ ) {
					newhtml = newhtml + '<li>' + cartObj.items[i].manufacturerName + " " + cartObj.items[i].phoneName + '<span>' + cartObj.items[i].price + '</span></li>';
				}
				this.$cartList.html( newhtml );
				this.$cartCount.html( cartObj.items.length );
			}
			else {
				this.$cartList.html( "" );
				this.$cartCount.html( "0" );
				console.log("  -> shoppingCart empty");
			}
		},

		_toJSONObject: function( str ) {
			var obj = JSON.parse( str );
			return obj;
		},
		
		_toJSONString: function( obj ) {
			var str = JSON.stringify( obj );
			return str;
		},
		
		_getPhoneJSON: function() {
			console.log("=> _getPhoneJSON() ...");
		},

		_getPhoneJSONLocal: function() {
			console.log("=> _getPhoneJSONLocal() ...");
			var phonesObj = this._toJSONObject(shop_get_phones);
			this.allPhones = phonesObj.responses.response[0].getListPhonesResponse.phones;
			this.filterPhones = this.allPhones;
		}
	};
	
	$(function() {
		var shop = new $.Sprint( "#SprintShop" );
		console.log(" I AM HERE " );
	});

})( jQuery );

function addASDF() {
	console.log("ASDFASDFASDFASDFASDFASDF");
}