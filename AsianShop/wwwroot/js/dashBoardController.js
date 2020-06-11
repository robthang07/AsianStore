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
                typeId:0
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
                $("#customers").show();
                $("#dashboard").hide();
            },
            openProductViewPartial:function () {
                $("#products").show();
                $("#dashboard").hide();
            },
            openOrderViewPartial:function () {
                $("#orders").show();
                $("#dashboard").hide();
            },
            openTypeViewPartial() {
                $("#types").show();
                $("#dashboard").hide();
            },

            openFrontImageViewPartial(){
                $("#frontImages").show();
                $("#dashboard").hide();
            },
            
            openAddModal(){
                if($('#products').is(':visible')){
                    $('#addProductModal').modal('show');
                }      
                else if($('#types').is(':visible')){
                    $('#addTypeModal').modal('show');
                }
                else if($('#frontImages').is(':visible')){
                    $('#addImageModal').modal('show');
                }
            },
            
            addProduct:function(){
                this.product.typeId = this.product.type.id;
                let formData = new FormData();
                formData.append('file', this.product.file);
                formData.append('filePath', this.product.filePath);
                formData.append('name',this.product.name);
                formData.append('amount', this.product.amount);
                formData.append('type', this.product.type);
                formData.append('typeId',this.product.typeId);
                formData.append('price', this.product.price);
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
                let formData = new FormData();
                formData.append('name',this.type.name);
                formData.append('file',this.frontImage.file);
                formData.append('filePath', this.frontImage.filePath);
                clientToServer.postFrontImage(formData,this);
            },

            /*********************** File *************************/

            //Checks if it's add or edit then sets the file into the structure object
            uploadProductFile:function(){
                if($('#addProductModal').is(':visible')){
                    this.product.file = this.$refs.productFile.files[0];
                }
                else{
                    this.product.file = this.$refs.structureEditFile.files[0];
                }
            },
            uploadImage:function(){
                this.frontImage.file = this.$refs.file.files[0];
            },
        }
    })
});