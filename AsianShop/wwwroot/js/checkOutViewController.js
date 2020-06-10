$(document).ready(function() {
    let clientToServer = new ClientToServerController();

    var checkout = new Vue({

        el: '#checkout',
        data: {
            totalPrice: 0,
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
            clientToServer.getProducts(this);
            clientToServer.getTypes(this);
            clientToServer.getCheckOutOrderLine(this);
        },
        methods: {
            openGuestCheckOut:function(){
                $("#checkoutGuestPartial").show();
                $("#checkoutPartial").hide();
            },
            checkoutGuest:function(){
                let formData = new FormData();
                /*
                this.order.customer.firstName = this.customer.firstName;
                this.order.customer.lastName = this.customer.lastName;
                this.order.customer.email = this.customer.email;
                this.order.customer.postAddress = this.customer.postAddress;
                this.order.customer.phoneNumber = this.customer.phoneNumber;
                this.order.customer.postPlace = this.customer.postPlace;
                this.order.customer.postNumber = this.customer.postNumber;*/
                formData.append("firstName",this.customer.firstName);
                formData.append("lastName", this.customer.lastName);
                formData.append("email", this.customer.email);
                formData.append("phoneNumber", this.customer.phoneNumber);
                formData.append("postAddress", this.customer.postAddress);
                formData.append("postPlace", this.customer.postPlace);
                formData.append("postNumber", this.customer.postNumber);
                let orderLineIds = "";
                this.orderLines.forEach(x => orderLineIds += x.id + ",");
                orderLineIds = orderLineIds.substring(0, orderLineIds.length - 1);
                formData.append("orderLinesIds", orderLineIds);

                clientToServer.postOrder(formData,this);
            }
        }
    })
});