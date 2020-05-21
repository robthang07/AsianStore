$(document).ready(function() {
    let clientToServer = new ClientToServerController();

    var clientView = new Vue({
        el: '#clientView',
        data: {
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
            orderlines:[],
            orderline:{
                id:0,
                product:[],
                productId:0,
                amount:0
            }
        },
        created: function () {
            clientToServer.getProducts(this);
        },
        methods: {}
    })
});