$(document).ready(function() {
    let clientToServer = new ClientToServerController();

    var clientView = new Vue({
        el: '#clientView',
        data: {
            products: [],
            product: {
                id: 0,
                name: "",
                amount: 0,
                price: 0
            }
        },
        created: function () {
            clientToServer.getProducts(this);
        },
        methods: {}
    })
});