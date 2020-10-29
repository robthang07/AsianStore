$(document).ready(function() {
    let clientToServer = new ClientToServerController();

    var database = new Vue({
        
        el: '#database',
        data: {
            products: [],
            product: {
                id: 0,
                name: "",
                price: 0,
                file:"",
                filePath: "",
                amount:0,
                from:"",
                about:"",
                unit:"",
                type: "",
                typeId:0,
                addedDateString:""
            },
            customers:[],
            customer:{
                id:0,
                email:'',
                firstName:'',
                lastName:'',
                phoneNumber:'',
                postAddress:'',
                postNumber:'',
                postPlace:''
            },
            types: [],
            type:{
                id:0,
                name:"",  
            },
            orders:[],
            order:{
                id:0,
                customer:"",
                customerId:0,
                discount:"",
                totalPrice:0,
                orderDate:"",
                orderLines:[],
                orderLinesIds:"",
                lastPickUpDate:"",
                delivered:false
            },
            frontImages:[],
            frontImage:{
                id:0,
                name:"",
                filePath:"",
                file:""
            }
        },
        created: function () {
            clientToServer.getCustomers(this);
            clientToServer.getProducts(this);
            clientToServer.getOrders(this);
            clientToServer.getTypes(this);
            clientToServer.getFrontImages(this);
        },
        methods: {
            openCustomerViewPartial:function () {
                $("#resetButton").show();
                $("#customers").show();
                $("#dashboard").hide();
            },
            openProductViewPartial:function () {
                $("#products").show();
                $("#dashboard").hide();
                $("#resetButton").show();
            },
            openOrderViewPartial:function () {
                $("#orders").show();
                $("#dashboard").hide();
                $("#resetButton").show();
            },
            openTypeViewPartial() {
                $("#types").show();
                $("#dashboard").hide();
                $("#resetButton").show();
            },

            openFrontImageViewPartial(){
                $("#frontImages").show();
                $("#dashboard").hide();
                $("#resetButton").show();
            },
            
            openAddModal(){
                if($('#products').is(':visible')){
                    this.clearProductInfo();
                    $('#addProductModal').modal('show');
                }      
                else if($('#types').is(':visible')){
                    this.clearTypeInfo();
                    $('#addTypeModal').modal('show');
                }
                else if($('#frontImages').is(':visible')){
                    this.clearImageInfo();
                    $('#addImageModal').modal('show');
                }
            },
            openEditModal:function(x){
                if($('#types').is(':visible')){
                    this.type.id = x.id;
                    this.type.name = x.name;
                    $('#editTypeModal').modal('show');
                }
                if($('#products').is(':visible')){
                    this.product.id = x.id;
                    this.product.name = x.name;
                    this.product.price = x.price;
                    this.product.type = x.type;
                    this.product.unit = x.unit;
                    this.product.from = x.from;
                    this.product.about = x.about;
                    this.product.amount = x.amount;
                    this.product.filePath = x.filePath;
                    $(".elementFile").val("");
                    $('#editProductModal').modal('show');
                }
            },
            openImage:function(image){
                this.frontImage.filePath = image.filePath;
                this.frontImage.name = image.name;
                this.frontImage.id = image.id;
                $("#imageDisplayer").modal('show');
            },
            openOrderLines(index){
                this.order = this.orders[index];
                $('#orderLinesModal').modal('show');
            },
            /*****************************Add************************/
            addProduct:function(){

                this.product.typeId = this.product.type.id;
                let formData = new FormData();
                formData.append('file', this.product.file);
                formData.append('filePath', this.product.filePath);
                formData.append('name',this.product.name);
                formData.append('amount', this.product.amount);
                formData.append('type', this.product.type);
                formData.append('typeId',this.product.typeId);
                formData.append('newPrice', this.product.price);
                formData.append('about', this.product.about);
                formData.append('unit', this.product.unit);
                formData.append('from', this.product.from);
                clientToServer.postProduct(formData, this);            
            },
            
            addType:function(){
                let formData = new FormData();
                formData.append('name',this.type.name);
                clientToServer.postType(formData,this);
            },
            
            addImage:function(){
                this.clearTypeInfo();
                let formData = new FormData();
                formData.append('name',this.frontImage.name);
                formData.append('file',this.frontImage.file);
                formData.append('filePath', this.frontImage.filePath);
                clientToServer.postFrontImage(formData,this);
            },
            
            /*****************************Delete************************/
            
            deleteFrontImage:function(id){
                clientToServer.deleteFrontImage(this,id);
            },
            deleteCustomer:function(id,index){
              clientToServer.deleteCustomer(this,id,index);  
            },
            deleteProduct:function(id,index){
                clientToServer.deleteProduct(this,id,index);
            },
            deleteOrder:function(id,index){
                clientToServer.deleteOrder(this,id,index);
            },

            /*********************** Edit *************************/
            editType:function(){
                let id =  $('#typeId').html();
                this.type.name = $('#typeName').html();
                clientToServer.editType(this,id);
            },

            editProduct:function(){
                this.product.typeId = this.product.type.id;
                var price = this.product.price;      
                let formData = new FormData();
                let id = parseInt($('#productId').html());
                formData.append('id',id);
                formData.append('file', this.product.file);
                formData.append('filePath', this.product.filePath);
                formData.append('name', this.product.name);
                formData.append('amount', this.product.amount);
                formData.append('type', this.product.type);
                formData.append('typeId',this.product.typeId);
                formData.append('newPrice', price);
                formData.append('about', this.product.about);
                formData.append('unit', this.product.unit);
                formData.append('from', this.product.from);
                         
                $(".files").val("");
                clientToServer.putProduct(formData, this, id);
            },

            /*********************** File *************************/

            //Checks if it's add or edit then sets the file into the structure object
            uploadProductFile:function(){
                if($('#addProductModal').is(':visible')){
                    this.product.file = this.$refs.productFile.files[0];
                }
                else{
                    this.product.file = this.$refs.editProductFile.files[0];
                }
            },
            uploadImage:function(){
                this.frontImage.file = this.$refs.file.files[0];
            },

            backToDashboard:function () {
                $("#dashboard").show();
                $("#customers").hide();
                $("#products").hide();
                $("#orders").hide();
                $("#types").hide();
                $("#frontImages").hide();
                $("#resetButton").hide();
            },

            clearProductInfo:function(){
                this.product.id = 0;
                this.product.name = "";
                this.product.price = 0;
                this.product.type = [];
                this.product.unit = "";
                this.product.from = "";
                this.product.about = "";
                this.product.amount = 0;
                $(".files").val("");
            },

            clearTypeInfo:function(){
                this.type.id = 0;
                this.type.name = "";
            },
            clearImageInfo:function(){
                this.frontImage.id = 0;
                this.frontImage.name = "";
                $(".files").val("");
            }
        
        }
    })
});