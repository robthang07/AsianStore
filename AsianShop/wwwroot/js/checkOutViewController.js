$(document).ready(function() {
    let clientToServer = new ClientToServerController();
    var items = localStorage.getItem("items");
    var itemsObj = JSON.parse(items);
    
    var checkout = new Vue({
        el: '#checkout',
        data: {
            totalPrice: 0,
            items:[],
            item:{
                id: 0,
                name: "",
                price:0,
                amount:0,
                filePath:""
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
                delivered:false
            },
            orderLines:[],
            orderLine:{
                id:0,
                product:[],
                productId:0,
                amount:0
            }
        },
        created: function () {
            this.getTotalPrice();
            clientToServer.getProducts(this);
            clientToServer.getTypes(this);
            clientToServer.getOrderLine(this);
        },
        mounted(){
            $("#navbarDropdownMenuLink").on('click', function (e) {
               alert("dfasfasdf");
                e.stopPropagation();
              });
        },
        methods: {
            //Open the guest checkout
            openGuestCheckOut:function(){
                $("#checkoutGuestPartial").show();
                $("#checkoutPartial").hide();
            },
             async checkoutGuest(){
               
                let formData = new FormData();
            
                formData.append("firstName",this.customer.firstName);
                formData.append("lastName", this.customer.lastName);
                formData.append("email", this.customer.email);
                formData.append("phoneNumber", this.customer.phoneNumber);
                formData.append("postAddress", this.customer.postAddress);
                formData.append("postPlace", this.customer.postPlace);
                formData.append("postNumber", this.customer.postNumber);
                formData.append("totalPrice", this.totalPrice);
                let orderLines = [];
                for(i = 0;i < this.items.length; i++){
                    item = {
                        productId: this.items[i].id,
                        amount: this.items[i].amount
                    }
                    orderLines.push(item);
                }
                var orderLinesJSON = JSON.stringify(orderLines);
                formData.append("orderLines", orderLinesJSON);

                clientToServer.postOrder(formData,this);
            },
            async createOrderLine(){
                let formData = new FormData();
                
                for(i = 0;i < this.items.length; i++){
                    if(!formData.has("productId")){
                    formData.append("productId", this.items[i].id);
                    formData.append("amount", this.items[i].amount);
                    await clientToServer.postOrderLine(formData,this);
                    }
                    else{
                    //Have to remove all the old values so the formdata wont get same values
                    formData.delete("productId");
                    formData.delete("amount");

                    formData.append("productId", this.items[i].id);
                    formData.append("amount", this.items[i].amount);
                    await clientToServer.postOrderLine(formData,this);
                    }
                }   
         
            },
           
            getTotalPrice: function(){
                let totPrice = 0;
                this.items = itemsObj;
                //Iterate through the items array and getting the total price
                for(i = 0;i < itemsObj.length; i++){
                    var price =  (itemsObj[i].price).replace(",",".");
                    var amount = parseFloat(itemsObj[i].amount);
                    var floatPrice = parseFloat(price);
                     totPrice+= floatPrice*amount;
                }
                this.totalPrice = totPrice.toFixed(2);
            }

        }
    })
});