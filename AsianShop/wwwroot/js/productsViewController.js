$(document).ready(function() {
    let clientToServer = new ClientToServerController();
    let word = localStorage.getItem("searchedWord");
    let sort = localStorage.getItem("sort");
    var checkout = new Vue({
        el: '#productsView',
        data: {
            selected:sort,
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
            this.sort();          
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
                this.sort();
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
                this.sort();
                return this.filteredProducts;
            },
            sort:function(){
                switch(this.selected) {
                    case "priceDesc":
                        localStorage.setItem("sort", "priceDesc");
                        this.filteredProducts.sort(this.priceDesc);
                        break;
                    case "priceAsc":
                        localStorage.setItem("sort", "priceAsc");
                        this.filteredProducts.sort(this.priceAsc);
                        break;
                    case "nameAsc":
                        localStorage.setItem("sort", "nameAsc");
                        this.filteredProducts.sort(this.nameAsc);
                        break;
                    case "nameDesc":
                        localStorage.setItem("sort", "nameDesc");
                        this.filteredProducts.sort(this.nameDesc);
                        break;
                  }
            },
            priceDesc:function(a,b){
                const priceA = a.price;
                const priceB = b.price;
                let comparison = 0;
                if (priceA < priceB) {
                    comparison = 1;
                } else if (priceA > priceB) {
                    comparison = -1;
                }
                return comparison;
            },
            priceAsc:function(a,b){
                const priceA = a.price;
                const priceB = b.price;
                let comparison = 0;
                if (priceA > priceB) {
                    comparison = 1;
                } else if (priceA < priceB) {
                    comparison = -1;
                }
                return comparison;
            },
            nameDesc:function(a,b){
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                let comparison = 0;
                if (nameA < nameB) {
                    comparison = 1;
                } else if (nameA > nameB) {
                    comparison = -1;
                }
                return comparison;
            },
            nameAsc:function(a,b){
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                let comparison = 0;
                if (nameA > nameB) {
                    comparison = 1;
                } else if (nameA < nameB) {
                    comparison = -1;
                }
                return comparison;
            },
        },
        watch:{
            searchedWord:function(){    
                this.selected ="";
                localStorage.setItem("searchedWord", this.searchedWord);
                this.filteredProducts = this.products.filter(s => {
                    return s.name.toLowerCase().includes(this.searchedWord.toLowerCase()) || s.id.toString().toLowerCase().includes(this.searchedWord.toLowerCase());
                });
                if(this.filteredProducts.length == 0){
                    return $("#emptySearch").css("display","block");
                }
                $("#emptySearch").css("display","none");
            },
    
        }
    })
});