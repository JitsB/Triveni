// Product Class: Represents a Product
class Product{
    constructor(name, description, quantity){
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        // this.imagesrc = imagesrc;
    }
}
// UI Class: Handle UI Tasks
class UI{
    static displayProducts(){
        const getData = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/product/")
                const data = await response.json()
                data.forEach((product) => UI.addProductToList(product));
                console.log(data)
            } catch (err) {
               console.log(err)
            }  
        }
        getData();
    }

    static addProductToList(product){
        const list = document.querySelector('#prod-list');

        console.log("Adding product: ")
        console.log(product)

        const row = document.createElement('tr');
        // 
        row.innerHTML = `
            <td>${product._id}</td>    
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td><img src=${product.url} width=150" height="70"></td>
            <td><a href="#" class="btn btn-primary btn-sm update">X</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        list.appendChild(row);
    }

    static deleteProduct(el){
            el.parentElement.parentElement.remove();
    }


    // Alert example
    // <div class = "alert alert-danger">Whatever the message</div>
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`; //$className is to refer the value of the var className

        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#prod-form');
        container.insertBefore(div, form);

        //Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);

    }

    static clearFields(){
        document.querySelector('#prod-name').value = '';
        document.querySelector('#prod-desc').value = '';
        document.querySelector('#prod-quant').value = '';
        document.querySelector('#prod-image').value = '';
    }
}

// Event: Display Products
document.addEventListener('DOMContentLoaded', UI.displayProducts);

var loadFile = function(event) {
    var image = document.getElementById('prod-image');
    image.src = URL.createObjectURL(event.target.files[0]);
    console.log("Image source is: ",image.src)
};

// Event: Add a Product
document.querySelector('#prod-form').addEventListener('submit', (e) => {
    // Prevent actual Submit
    e.preventDefault();

    const prod_name = document.querySelector('#prod-name').value;
    const prod_desc = document.querySelector('#prod-desc').value;
    const prod_quant = document.querySelector('#prod-quant').value;

    if (prod_name == '' || prod_desc == '' || prod_quant == ''){
        UI.showAlert("Please fill in all fields",'danger');
    }else{
        // Instatiate Product
        const product = new Product(prod_name, prod_desc, prod_quant);
        
        //ID not displayed initially
        const addProduct = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("name", prod_name);
            urlencoded.append("description", prod_desc);
            urlencoded.append("quantity", prod_quant);
            urlencoded.append("url", "abcdefg");

            var requestOptions = {
                method: 'POST',
                redirect: 'follow',
                headers: myHeaders,
                body: urlencoded
            };
            try {
                const response = await fetch("http://localhost:4000/api/product/", requestOptions)
                console.log(response)
                console.log(product)
                UI.addProductToList(product)
                UI.showAlert('Product Created',"success");
                UI.clearFields();
            } catch (err) {
                console.log(err)
                UI.showAlert("Product creation not successful, please check","danger")
            }  
        }
        addProduct();
    }

});

// Event: Remove a Product, this is being done using event propagation, like we are passing in the exact target i.e. exact row/entry to be deleted. Else it would have simply deleted the first row no matter whichever entry of the table has been clicked
document.querySelector('#prod-list').addEventListener('click', (e) =>{
    if (e.target.classList.contains('delete')){
        
        var idToBeDeleted = e.target.parentNode.parentNode.
        firstElementChild.textContent

        // Check success based on 202 status and not only on try-catch
        const deleteProduct = async () => {
            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };
            try {
                const response = await fetch("http://localhost:4000/api/product/"+idToBeDeleted, requestOptions)
                console.log(response)
                UI.deleteProduct(e.target)
                UI.showAlert('Product Removed',"success");
            } catch (err) {
                console.log(err)
                UI.showAlert("Product not found, please check","danger")
            }  
        }
        deleteProduct();
    }
    else if(e.target.classList.contains('update')){

        var idToBeUpdated = e.target.parentNode.parentNode.
        firstElementChild.textContent

        console.log("Inside update")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("name","Parachute Oil");
        urlencoded.append("description","Fresh Coconut parachute oil");
        urlencoded.append("quantity",10);
        urlencoded.append("url", "abcdefg");

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
        };

        fetch("http://localhost:4000/api/product/"+idToBeUpdated, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    
});