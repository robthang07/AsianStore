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
    getTypes(self){
        axios.get('api/server/types').then(function(response){
            self.types = response.data;
        })
    }

    postProduct(formdata,self){
        axios.post('api/server/products',formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            console.log("Product successfully added");
            self.products.push(response.data);
            $('#addProductModal').modal('hide');
        })
    }

    postType(formdata,self){
        axios.post('api/server/types',formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            console.log("Product successfully added");
            self.types.push(response.data);
            $('#addTypeModal').modal('hide');
        })
    }
    
}