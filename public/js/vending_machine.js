function loadVendingMachineData(){
    
    var vendingMachineArray = [];

    fetch('/vending_machine', {
        method: 'GET' //use HTTP GET method
    })
    .then(response => {
        return response.json(); //Parse the JSON response into JavaScript object
    })
    .then(data => {
        vendingMachineArray = data
        insertDynamicvendingMachines(vendingMachineArray);
    })
    .catch(error => {
        console.error('Error encountered:', error);
    }); // Handle errors
}

function insertDynamicvendingMachines(arrayOfVendingMachine){

    var dynamicVendingMachineList = document.getElementById("dynamicVendingMachineDataList");

    var newContent = `<div id="machine">`;

    for (var i = 0; i < arrayOfVendingMachine.length; i++){
        console.log(arrayOfVendingMachine[i]);

        newContent +=
            `
                <div class="eachMachine">
                    <div>
                        <h4>${arrayOfVendingMachine[i].vendor_name}</h4>
                        <img src="${arrayOfVendingMachine[i].vending_image}" class="vending_image">
                        <p>Location: ${arrayOfVendingMachine[i].school}, Block ${arrayOfVendingMachine[i].block}, Floor ${arrayOfVendingMachine[i].floor}</p>
                        <p>Status: ${arrayOfVendingMachine[i].status_name}</p>
                        <p>Pay by: ${arrayOfVendingMachine[i].payment_methods}</p>
                        <button type='button' class="buttonToViewItem" onclick='goToVendingItem(this)' restId='${arrayOfVendingMachine[i].vending_machine_id}'>View Items</button>
                    </div> 
                </div>
            `;
        
    }
    newContent +=`</div>`;


    //Update the innerHTML once, after building the complete HTML string 
    dynamicVendingMachineList.innerHTML = newContent;

}

function goToVendingItem (buttonElement){
    var id = buttonElement.getAttribute("restId");
    location.href = "/vending_item.html?id="+id;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Vending_Item
function loadVendingItemData(){
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var api_url="/vending_item/"+id;
    var vendingItemArray=[];

    fetch (api_url,{
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        vendingItemArray = data
        insertDynamicVendingItems(vendingItemArray);
        displayFooter(vendingItemArray);
    })
    .catch(error=>{
        console.error('Error:',error);
    });
}

function insertDynamicVendingItems(arrayOfVendingItem){
    var dynamicVendingItemList = document.getElementById("dynamicVendingItemDataList");
    var newContent=`<div id="item">`;
        for (var i = 0; i < arrayOfVendingItem.length; i++) {
            console.log(arrayOfVendingItem[i]);
            newContent +=
            `<div class="eachItem">
                <div>
                    <img src="${arrayOfVendingItem[i].item_image}" class="item_images">
                    <p><b>Name:</b> ${arrayOfVendingItem[i].item_name}</p>
                    <p><b>Price:</b> ${arrayOfVendingItem[i].item_cost}</p>
                    <p><b>Availaility:</b> ${arrayOfVendingItem[i].availability}</p>
                    <div class ="itemButton">
                        <button type='button' class="buttonToEditItem" onclick='editItemData(this)' restId='${arrayOfVendingItem[i].vending_item_id}'>Edit</button>
                        <button type='button' class="buttonToEditItem" onclick='deleteItemData(this)' restId='${arrayOfVendingItem[i].vending_item_id}'>Delete</button>
                    </div>           
                </div> 
            </div>`;
        }
    //  if ((i + 1) % 6 === 0 && i < arrayOfVendingItem.length - 1) {
    //     newContent +=`</div>`;
    //     }
        newContent +=`</div>`;
     dynamicVendingItemList.innerHTML=newContent;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Add New Item
function goToAddNewItem (buttonElement){
    var id = buttonElement.getAttribute("restId");
    location.href = "/add_item.html?id="+id;
}

//function to display footer
function displayFooter(arrayOfVendingItem){
    var footerDisplay = document.getElementById("footer_button");
    var footer=`<button type='button' onclick="goToAddNewItem(this)" restId='${vending_machine_id}'>Add Item</button>`;
    footerDisplay.innerHTML=footer;
}

function addItemData(){
    var formElement = document.getElementById("insertForm");
    var formData = new FormData(formElement);
    var itemData = Object.fromEntries(formData.entries());
    var jsonString = JSON.stringify(itemData);

    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var api_url="/add_item/"+id;

    fetch (api_url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString,
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Error: The response was not ok, please check logs for error message.');
        }
        return response.json();
        })
        .then(data => {
            location.href = "/vending_item/?id="+id;
            })
        .catch(error => {
            console.error('Error:', error); 
        });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteItem
function deleteItemData(buttonElement){
    var id = buttonElement.getAttribute("restId");
    var api_url = "/vending_item/"+id;

    fetch(api_url, {
        method: 'DELETE'
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Error: please check logs for error message.");
        }
        return response.text();
    })
    .then(data => {
        location.href = "vending_item.html?id=" + id;

    })
    .catch(error => {
        console.error("Error:", error);
    });
}
