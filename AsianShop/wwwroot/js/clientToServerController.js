class ClientToServerController{
     Url = "https://localhost:5001/api/server/orderLines";

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
        });
    }
    getTypes(self){
        axios.get('api/server/types').then(function(response){
            self.types = response.data;
        });
    }
    getOrderLine(self){
        axios.get(this.Url).then(function(response){
            self.orderLines = response.data;
        });
    }
    getCheckOutOrderLine(self){
        axios.get('api/server/orderLines').then(function(response){
            self.orderLines = response.data;
        });
    }

    getFrontImages(self){
        axios.get('api/server/frontImages').then(function(response){
            self.frontImages = response.data;
        });
    }
    
/*****************************Post***************************************/

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
    
    postOrderLine(formdata,self){
        axios.post(this.Url,formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            console.log("Order line successfully added");
            self.orderLines.push(response.data);
        });
    }
    
    postOrder(formData,self){
        axios.post('api/server/orders',formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            console.log("Order successfully added");
            self.orders.push(response.data);
        });
    }

    postCustomer(formData,self){
        axios.post('api/server/customers',formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            console.log("Order successfully added");
            self.customers.push(response.data);
        });
    }

    postFrontImage(formdata,self){
        axios.post('api/server/frontImages',formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response){
            self.frontImages.push(response.data);
            $('#addImageModal').modal('hide');
        })
    }
    /*****************************Delete***************************************/
    deleteFrontImage(self,id,index){
        axios.delete('api/server/frontImages/'+id).then(function(){
            self.frontImages.splice(index,1);
        });
    }
    deleteCustomer(self,id,index){
        axios.delete('api/server/customers/'+id).then(function(){
            self.customers.splice(index,1);
        });
    }
    deleteProduct(self,id,index){
        axios.delete('api/server/products/'+id).then(function(){
            self.products.splice(index,1);
        });
    }
    deleteOrder(self,id,index){
        axios.delete('api/server/orders/'+id).then(function(){
            self.orders.splice(index,1);
        });
    }
}