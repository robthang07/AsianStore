$(document).ready(function() {
    let clientToServer = new ClientToServerController();
    let word = localStorage.getItem("searchedWord");
    var checkout = new Vue({
        el: '#productsView',
        data: {
            checkedTypes: [],
            filteredProducts:[],
            min:"",
            max:"",
            searchedWord:"",
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
        async created () {
            await clientToServer.getProducts(this);
            clientToServer.getTypes(this);
            this.searchedWord = word;
            this.getCheckedProducts();
           
        },
        methods: {
            async getCheckedProducts(){
                
                if(this.checkedTypes.length == 0 && (this.min&this.max)==""){
                    this.filteredProducts = this.products;
                }
                else{
                    this.filteredProducts=[];
                    for (const i in this.checkedTypes) {
                        for (const j in this.products) {
                            if (this.checkedTypes[i] == this.products[j].typeId) {
                                this.filteredProducts.push(this.products[j]);     
                            }
                        }
                     }
                }
            },
        },
        watch:{
            searchedWord:function(){
                localStorage.setItem("searchedWord", this.searchedWord);
                return this.filteredProducts = this.products.filter(s => {
                    return s.name.toLowerCase().includes(this.searchedWord.toLowerCase());
                });
            }
        }
    })
});