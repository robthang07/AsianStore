$(document).ready(function() {
    
    $(".dropdown-menu").click(function(e){
        e.stopPropagation();
    });

    $("#navbarDropdownMenuLink").click(function(){
        //Get the items from local storrage and parse them as objects
        var itemsString = localStorage.getItem("items");
        var items = JSON.parse(itemsString);  
        if( items != null && items.length != 0){
            $("#cartView").show();
            $("#emptyCart").hide();
            var itemsArray = {items};
            w3.displayObject("itemsDisplay",itemsArray);
            document.getElementById("totalPrice").innerHTML = getTotalPrice(items)+"kr";
            $(".deleteButton").click(function(){
                let index = $(this).parents("tr").index();
                items.splice(index,1);
                localStorage.setItem("items",JSON.stringify(items));
                $(this).parents("tr").remove();
            });   
        }
        else{
            $("#emptyCart").show();
            $("#cartView").hide();
        }
    });

    function getTotalPrice(items){
        let totPrice = 0;
        //Iterate through the items array and getting the total price
        for(i = 0;i < items.length; i++){
            var price =  (items[i].price).replace(",",".");
            var amount = parseFloat(items[i].amount);
            var floatPrice = parseFloat(price);
            totPrice+= floatPrice*amount;
        }
        return totPrice.toFixed(2);
    }


});