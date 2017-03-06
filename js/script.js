// EtsyModel.fetch({
//      dataType: 'jsonp',
//      data: {WHATEVER PARAMS YOU MAY HAVE}
// })
//ETSY INFO:_______________
//App Name: EtsyCloneProject
//api-key: ds4wn63vlswhs4g9k4nercba
//shared secret: r9695qvwg7

// console.log($)
// console.log(Backbone)
// console.log(_)

//-----------------------------MODEL SECTION-------------------

var DataCollection = Backbone.Collection.extend({

	url: "https://openapi.etsy.com/v2/listings/active.js",
	parse: function(apiResponse){
			return apiResponse.results
	},


})

// console.log(this)//<--window
// console.log(DataCollection)//<-- function (){ return parent.apply(this, arguments); } Backbone code

var ItemModel = Backbone.Model.extend({
	//this function send a request for and recieves a single model
	url: "https://openapi.etsy.com/v2/listings/active.js",
	parse: function(apiResponse) {
		return apiResponse.results
	}
})

//var model = new ItemModel()

//console.log(ItemModel)//<-- function (){ return parent.apply(this, arguments); }

//-----------------------------VIEW SECTION----------------------

var HomeView = Backbone.View.extend({
	initialize: function(){
		// this.render()
		this.listenTo(this.collection, 'sync', this.render)
	},

	render: function() {
		var containerNode = document.querySelector('.container')
		var modelHTML = ''
		this.collection.forEach(function(inputModel){
			modelHTML += '<a href="#details/' + inputModel.get('listing_id')
			modelHTML += '"><img class="gridImage" src="' + inputModel.get('MainImage').url_75x75 + '"></a>'
			console.log(inputModel)
		})
		containerNode.innerHTML = modelHTML

		 
	}
})

var DetailView = Backbone.View.extend({
	initialize: function(){
		
		this.listenTo(this.model, 'sync', this.render)

	},

	render: function() {
		var containerNode = document.querySelector('.container')
		var detailHTML = ''
		console.log(this.model)
		detailHTML += '<h3 class="detailTitle">Product Details: ' + this.model.attributes[0].title + '</h3>'
		detailHTML += '<img class="detailImage" src="' + this.model.attributes[0].MainImage.url_fullxfull + '"/>'
		detailHTML += '<p class="detailPrice">Price: ' + this.model.attributes[0].price + '</p>'
		detailHTML += '<p class="quantity">Remaining: ' + this.model.attributes[0].quantity + '</p>'
		containerNode.innerHTML = detailHTML
	}

})

//---------------------------CONTROLLER SECTION---------------

var EtsyRouter = Backbone.Router.extend({
	routes: {
		"" : "showHomePage",
		"home" : "showHomePage",
		// "search/:query" : "showSearchPage",
		"details/:listing_id" : "showDetailPage"
	},

	showHomePage: function() {
		console.log('you made it to the showHomePage function (CONTROLLER)')
		// var containerNode = document.querySelector('.container')
		// var homeHTML = ''
		// homeHTML += '<h1 class="welcome">Welcome to the Etsy Clone site!</h1>'
		// containerNode.innerHTML = homeHTML
		var collectionInstance = new DataCollection()
		//console.log(collectionInstance)
		collectionInstance.fetch({
			dataType: 'jsonp', 
			data: {
				includes: "Images,MainImage",
				'api_key': 'ds4wn63vlswhs4g9k4nercba'
			},
	
		})
		
		new HomeView({
			collection: collectionInstance
		})
	},

	showDetailPage: function(listing_id) {
		console.log('you made it to showDetailsPage function (CONTROLLER)')
        var modelInstance = new ItemModel() //new instance of model
        modelInstance.fetch({
            url: 'https://openapi.etsy.com/v2/listings/' + listing_id + '.js',
            dataType: 'jsonp',
            data: {
                includes: 'Images,MainImage',
                'api_key': 'ayhxghvva4um3zjemhg60emb'
            }
        })
        new DetailView({
            model: modelInstance
        })
    }
	})


var router = new EtsyRouter()
Backbone.history.start()