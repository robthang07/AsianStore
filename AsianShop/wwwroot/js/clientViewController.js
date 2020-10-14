$(document).ready(function() {
    window.onload = checkProductAmount(), setProductAmount();
    let itemList =[];

    function checkProductAmount () {
        let productAmount = document.getElementById("productAmount").value;
        if(productAmount <= 5){
            $("#amountMessage").show();
            document.getElementById("amountMessage").innerHTML = "There is only "+productAmount+" left";
            if(productAmount == 0){
                document.getElementById("amountMessage").innerHTML = "Currently sold out";
            }
        }
    }
    function setProductAmount (){
        let productAmount = document.getElementById("productAmount").value;
        if(productAmount >= 10){
            for (i = 1; i <= 10; i++) {
                $("#selectQuantity").append(new Option(i,i));
            }
        }
        else if(productAmount < 10 && productAmount > 0){
            for (i = 1; i <= productAmount; i++) {
                $("#selectQuantity").append(new Option(i,i));
            }
        }
        else{
            $("#unit").hide();
            $("#selectQuantity").hide();
            $("#addCart").hide();
        }
    }
    $(".dropdown-menu").click(function(e){
        e.stopPropagation();
    });

    $("#addCart").click(function(){
        if(typeof(Storage) !== "undefined"){
            var item = {
                id : document.getElementById("addCart").value,
                name : document.getElementById("name").value,
                price : document.getElementById("price").value,
                filePath: document.getElementById("filePath").value,
                amount : $('#selectQuantity').val()
            }

            var oldItems = JSON.parse(localStorage.getItem("items"));
            if(oldItems == null || oldItems.length == 0){
                itemList.push(item);
            }
            else{
               for (const obj in oldItems) {
                    if(oldItems[obj].id == document.getElementById("addCart").value){
                        $("#amountMessage").show();
                        return document.getElementById("amountMessage").innerHTML = "This product is already in your cart";
                    }
                }
                itemList = oldItems;
                itemList.push(item);
            }
            localStorage.setItem("items", JSON.stringify(itemList));
            $("#infoBoard").css("visibility","visible").text( document.getElementById("name").value +" is added to cart");
        }
    });
});