$(document).ready(function() {
    var items = localStorage.getItem("items");
    var itemsObj = JSON.parse(items);
    console.log(itemsObj);
    
    
    var cartView = new Vue({
        el: '#cartView',
        data: {
            totalPrice:0,
            items:[],
            item:{
                id: 0,
                name: "",
                price:0,
                amount:0
            }
            },
            created:function(){
                this.items = itemsObj;

                for(i = 0;i < itemsObj.length; i++){
                    var price =  (itemsObj[i].price).replace(",",".");
                    var amount = parseFloat(itemsObj[i].amount);
                    var floatPrice = parseFloat(price);
                    this.totalPrice += floatPrice*amount;
                }
            },
            methods:{
               deleteItem(index){
                    this.items.splice(index,1);
                    localStorage.setItem("items",JSON.stringify(this.items))
               }
            }
        
        
    });
    
/*
    $("#navbarDropdownMenuLink").click(function(params) {
        if(itemsObj != null){
            for(i = 0;i < itemsObj.length; i++){
                var name = itemsObj[i].name;
                var price = itemsObj[i].price;
                var amount = itemsObj[i].amount;
                
                tr.appendChild(td);
                td.append(name);
                td.append(price);
                td.append(amount);
                td.append(delButton);
            }
            tbody.appendChild(tr);
        }*/
            /*
        var k = '<tbody>'
          
            for(i = 0;i < itemsObj.length; i++){
                k+= '<tr>';
                k+= '<td>' + itemsObj[i].name + '</td>';
                k+= '<td>' + itemsObj[i].price + " kr"+ '</td>';
                k+= '<td>' + itemsObj[i].amount + '</td>';
                k+= '<td>' + delButton + '</td>';
                k+= '</tr>';
            }
        
            k+='</tbody>';
            document.getElementById('tbody').innerHTML = k;
        }
    });
    
          */
});