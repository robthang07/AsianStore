$(document).ready(function() {
    //Get the items from local storrage and parse them as objects
    var items = localStorage.getItem("items");
    var itemsObj = JSON.parse(items);    
    
    $(".dropdown-menu").click(function(e){
        e.stopPropagation();
    });

    var cartView = new Vue({
        el: '#cartView',
        data: {
            totalPrice:0,
            items:[],
            item:{
                id: 0,
                name: "",
                price:0,
                amount:0,
                filePath:""
            }
            },
            created:function(){
                this.items = itemsObj;
                this.getTotalPrice();
            },
            methods:{
               deleteItem(index){
                   //Splice with the given index and set them back into local storrage
                    this.items.splice(index,1);
                    localStorage.setItem("items",JSON.stringify(this.items))
               },
               getTotalPrice(){
                   var totPrice = 0;
                   //Iterate through the items array and getting the total price
                for(i = 0;i < itemsObj.length; i++){
                    var price =  (itemsObj[i].price).replace(",",".");
                    var amount = parseFloat(itemsObj[i].amount);
                    var floatPrice = parseFloat(price);
                    totPrice += floatPrice*amount.toFixed(0);
                }
                this.totalPrice = totPrice.toFixed(2);
               }
            }
    });
});