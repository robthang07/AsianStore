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
            minMaxFiltered:[],
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
            getCheckedProducts:function(){    
                if(this.checkedTypes.length == 0 && this.minMaxFiltered.length==0){
                    this.filteredProducts = this.products;
                }
                else if(this.minMaxFiltered.length>0){
                    this.filteredProducts=[];
                    if(this.checkedTypes.length == 0){
                        this.filteredProducts = this.minMaxFiltered;
                    }
                    else{
                        for (const i in this.checkedTypes) {
                            for (const j in this.minMaxFiltered) {
                                if (this.checkedTypes[i] == this.minMaxFiltered[j].typeId) {
                                    this.filteredProducts.push(this.minMaxFiltered[j]);     
                                }
                            }
                         }
                    }
                    
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
                if(this.filteredProducts.length == 0){
                    return $("#emptySearch").css("display","block");
                }
                $("#emptySearch").css("display","none");
                return this.filteredProducts;
            },

            setNewPriceRange:function(){
                if((this.min && this.max)==""){
                    //Do nothing
                }
                else if(this.checkedTypes.length == 0){
                    this.minMaxFiltered = this.products.filter(p => p.price >= this.min && p.price <= this.max);
                    this.filteredProducts = this.minMaxFiltered;
                }
                else{
                    this.minMaxFiltered = [];
                    let checkProducts = this.getCheckedProducts();
                    this.minMaxFiltered = checkProducts.filter(p => p.price >= this.min && p.price <= this.max);
                    this.filteredProducts = this.minMaxFiltered;
                }
                if(this.filteredProducts.length == 0){
                    return $("#emptySearch").css("display","block");
                }
                $("#emptySearch").css("display","none");
                return this.filteredProducts;
            },
        },
        watch:{
            searchedWord:function(){    
                localStorage.setItem("searchedWord", this.searchedWord);
                this.filteredProducts = this.products.filter(s => {
                    return s.name.toLowerCase().includes(this.searchedWord.toLowerCase());
                });
                if(this.filteredProducts.length == 0){
                    return $("#emptySearch").css("display","block");
                }
                $("#emptySearch").css("display","none");
            }
        }
    })
});