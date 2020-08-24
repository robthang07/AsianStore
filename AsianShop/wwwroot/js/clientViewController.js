$(document).ready(function() {
    let itemList =[];
    let clientToServer = new ClientToServerController();
    var clientView = new Vue({
        el: '#clientView',
        data: {
            orderLines:[],
            orderLine:{
                id:0,
                product:[],
                productId:0,
                amount:0
            },
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
        },
        methods: {
            addOrderLine: function(){
                if(typeof(Storage) !== "undefined"){
                    var item = {
                        id : document.getElementById("addCart").value,
                        name : document.getElementById("name").value,
                        price : document.getElementById("price").value,
                        amount : this.orderLine.amount
                    }

                    var oldItems = JSON.parse(localStorage.getItem("items"));
                    if(oldItems == null){
                        itemList.push(item);
                    }
                    else{
                        for (const obj in oldItems) {
                            //console.log(oldItems[obj]);
                            itemList.push(oldItems[obj]);
                        }

                        //itemList.push(oldItems);
                        itemList.push(item);
                    }
                    localStorage.setItem("items", JSON.stringify(itemList));
                }
                
                function flatten(arr) {
                    const result = []
                  
                    arr.forEach((i) => {
                      if (Array.isArray(i)) {
                        result.push(...flatten(i))
                      } else {
                        result.push(i)
                      }
                    })
                    
                    return result
                  }
                /*
                var productId = document.getElementById("addCart").value;
                this.orderLine.productId = productId;
                let formData = new FormData();
                formData.append('productId', this.orderLine.productId);
                formData.append('amount', this.orderLine.amount);
                clientToServer.postOrderLine(formData, this);*/
            }
        },
        checkProductAmount:function () {
            //TODO add so people can when there are less than a certain amount of the product
        }
    });
});