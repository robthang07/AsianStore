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
                filePath: ""
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
            orders:[],
            order:{
                id:0,
                customer:"",
                customerId:0,
                discount:"",
                totalPrice:0,
                orderDate:"",
                orderLines:[],
                delivered:false
            }
        },
        created: function () {
            clientToServer.getCustomers(this);
            //clientToServer.getProducts(this);
            clientToServer.getOrders(this);
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
            }
        }
    })
});