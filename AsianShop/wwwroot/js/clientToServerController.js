class ClientToServerController{
    constructor(){}
    
    getCustomers(self){
        axios.get('api/server/customers').then(function(response){
            self.customers = response.data;
        })
    }
    getProducts(self){
        axios.get('api/server/products').then(function(response){
            self.products = response.data;
        });
    }
    getOrders(self){
        axios.get('api/server/orders').then(function(response){
            self.orders = response.data;
        })
    }
}