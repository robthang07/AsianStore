$(document).ready(function() {
    let clientToServer = new ClientToServerController();
    var cartView = new Vue({
        el: '#cartView',
        data: {
            totalPrice:0,
            orderLines:[],
            orderLine:{
                id:0,
                product:[],
                productId:0,
                amount:0
            },
        },
        created: function () {
            clientToServer.getOrderLine(this);
        },
        mounted(){

        $("#cartButton").click(function(){
            clientToServer.getOrderLine(this);
            let name = "cartView";
            var x = document.getElementById(name);
            if (x.style.display === "none") {
                x.style.display = "block";
            }
            //If setting is visible
            else {
                x.style.display = "none";
            }
        });
        }
    });
    
});