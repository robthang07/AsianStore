$(document).ready(function() {
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
        },
        methods: {
            addOrderLine: function(){
                var productId = document.getElementById("addCart").value;
                this.orderLine.productId = productId;
                let formData = new FormData();
                formData.append('productId', this.orderLine.productId);
                formData.append('amount', this.orderLine.amount);
                clientToServer.postOrderLine(formData, this);
            }
        },
        checkProductAmount:function () {
            //TODO add so people can when there are less than a certain amount of the product
        }
    });
});