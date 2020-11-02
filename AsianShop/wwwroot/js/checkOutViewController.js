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
            this.items = itemsObj;
            this.isCartEmpty();
            this.getTotalPrice();
            clientToServer.getProducts(this);
            clientToServer.getTypes(this);
            clientToServer.getOrderLine(this);
        },
        methods: {
            //Open the guest checkout
            openGuestCheckOut:function(){
                $("#checkoutGuestPartial").show();
                $("#checkoutPartial").hide();
            },
            loggedInCustomer:function(){
                this.customer.firstName = document.getElementById("firstName").value;
                this.customer.lastName = document.getElementById("lastName").value;
                this.customer.email = document.getElementById("email").value;
                this.customer.postAddress = document.getElementById("postAddress").value;
                this.customer.postNumber = document.getElementById("zip").value;
                this.customer.postPlace = document.getElementById("city").value;
                this.customer.phoneNumber = document.getElementById("phoneNr").value;
                $('#overview').modal('show');
            },
            checkoutGuest:function(){
                if(this.isFilled()==true){
                    $('#overview').modal('show');
                }
                else{
                    return $("#invalid").css("visibility","visible").text("Please fill in the required inputs");
                }
            },
           
            getTotalPrice: function(items){
                let totPrice = 0;
                //Iterate through the items array and getting the total price
                for(i = 0;i < itemsObj.length; i++){
                    var price =  (itemsObj[i].price).replace(",",".");
                    var amount = parseFloat(itemsObj[i].amount);
                    var floatPrice = parseFloat(price);
                     totPrice+= floatPrice*amount;
                }
                this.totalPrice = totPrice.toFixed(2);
            },

            isFilled: function(){
                var form = document.getElementById("checkoutForm").elements;
                var invalidFeedBacks = $(".invalid-feedback");
                let email = $("#validationCustomEmail").val();
                let length = form.length-2;
                for (i=0; i < length; i++) {
                    let value = form[i].value;
                    if(value == ""){
                        invalidFeedBacks.eq(i).css( "display", "block" );
                        return false;
                    }
                    if(!(form[i].value=="")){
                        invalidFeedBacks.eq(i).css( "display", "none" );
                    }
                }
                if((!this.validEmail(email))){
                    return false;
                }
                if(!($("#checkbox").is(":checked"))){
                    $("#invalidCheckbox").css("display","block");
                    return false;
                }
                else{
                    $("#invalidCheckbox").css("display","none");
                }
                return true;
            },

            validEmail:function(email){
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(email)){
                    $("#invalidEmail").css("display","block");
                }
                return re.test(email);
            },
            async purchase(){
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
                    await clientToServer.postOrder(formData,this);
                    window.location.replace("/checkout/receipt");
                    localStorage.clear();
            },
            isCartEmpty:function(){
                if(itemsObj == null || itemsObj == ""){    
                    window.location.replace("/products");
                }
            },
            removeItem(index){
                this.items.splice(index,1);
                localStorage.setItem("items",JSON.stringify(this.items));
                this.getTotalPrice()
            }
        }
    })
});