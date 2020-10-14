$(document).ready(function() {
    let clientToServer = new ClientToServerController();
    var checkout = new Vue({
        el: '#productsView',
        data: {
            checkedTypes: [],
            showProducts:[],
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
            types: [],
            type:{
                id:0,
                name:"",
            },
        },
        created: function () {
            //clientToServer.getProducts(this);
            clientToServer.getTypes(this);
            this.getCheckedProducts();
           
        },
        methods: {
            async getCheckedProducts(){
                await clientToServer.getProducts(this);
                if(this.checkedTypes.length == 0){
                    this.showProducts = this.products;
                }
                else{
                    this.showProducts=[];
                    for (const i in this.checkedTypes) {
                        for (const j in this.products) {
                            if (this.checkedTypes[i] == this.products[j].typeId) {
                                this.showProducts.push(this.products[j]);     
                            }
                        }
                     }
                }
            },
            
        }
    })
});