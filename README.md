# GroceryStore
Back-end application that serves an API to manage and categorize stock for a small-scale grocery store.
## Installation
clone the repositroy: git clone https://github.com/pramaths/GroceryStore.git
cd GroceryStore
##Install dependencies
npm install

Add .env file where MONGO_URI=mongodb+srv://pramaths848:MdNy3gukvjpzydQe@twitter.t29mhxx.mongodb.net/Assignment?retryWrites=true&w=majority //My Db
## How to run:
docker-compose build 
docker-compose up

Upon running go to localhost:3000 to check success status.
## video link:https://drive.google.com/file/d/1Jw0_ue9ZacAewRLG1ox2G2_o6OLUkQP8/view?usp=sharing
Then you can try api in postman or any related things like thunder client:
API ENDPOINTS
#StorageSpace
1)## Create a new storage space:
## Endpoint: POST /api/createstorage
##Description: Create a new storage space with the provided details.
{
  "name": "Storage Space Name",
  "maxLimit": 100,
  "refrigerate": 50
}
Response:

NewStorageSpace: The created storage space object.
2)Rename a storage space
Endpoint: PUT /api/renamestorage/:oldname

Description: Rename an existing storage space.
{
  "name": "Storage Space Name",
  "maxLimit": 100,
  "refrigerate": 50
}
Response:

NewStorageSpace: The created storage space object.

Parameters:

oldname: The current name of the storage space to be renamed.
Request Body:{
  "newname": "New Storage Space Name"
}
Response:

existingType: The updated storage space object.

3)Delete a storage space
Endpoint: DELETE /api/deletestorage/:id

Description: Delete an existing storage space by its ID.

Parameters:

id: The ID of the storage space to be deleted.
Response:

success: A success message indicating that the storage space was deleted.
storagespace: The deleted storage space object.
4)Get all items in a storage space
Endpoint: GET /api/getallitems/:id

Description: Get a list of all items in a storage space by its ID.

Parameters:

id: The ID of the storage space to get items from.
Response:

success: A boolean indicating the success status.
items: An array of item objects.

#ItemType
1)Create a new item type
Endpoint: POST /api/createItemType

Description: Create a new item type with the provided details.

Request Body:{
  "name": "Item Type Name",
  "isRefrigeration": true
}
Response:

NewItemType: The created item type object.
2)Rename an item type
Endpoint: PUT /api/renameItemType/:id

Description: Rename an existing item type.

Parameters:

id: The ID of the item type to be renamed.
Request Body:{
  "name": "New Item Type Name"
}
Response:

existingType: The updated item type object.
3)Delete an item type
Endpoint: DELETE /api/deleteItemType/:id

Description: Delete an existing item type by its ID.

Parameters:

id: The ID of the item type to be deleted.
Response:

message: A success message indicating that the item type was deleted.
existingType: The deleted item type object.

#Item
1)Relocate an item to a new storage space
Endpoint: POST /api/relocateItem

Description: Relocate an existing item to a new storage space.

Request Body:{
  "itemId": "Item ID",
  "destinationstorageSpaceId": "Destination Storage Space ID"
}
Response:
success: A success message indicating that the item was relocated.
item: The updated item object after relocation.
destinationStorageName: The name of the destination storage space.

2)Delete an item
Endpoint: DELETE /api/deleteItem/:id

Description: Delete an existing item by its ID.

Parameters:

id: The ID of the item to be deleted.
Response:

success: A boolean indicating the success status.
item: The deleted item object.
3) Change an item
Endpoint: PUT /api/changeItem/:id

Description: Change an existing item by its ID.

Parameters:

id: The ID of the item to be changed.
Request Body:

{
  "itemTypeId": "New Item Type ID",
  "expirationDate": "YYYY-MM-DD"
}
Response:
success: A success message indicating that the item was changed.

4)## Get all items (Paginated)
#Endpoint: GET /api/getAllItems

##Description: Get a paginated list of all items.

##Parameters:

page (optional): The page number (default: 1).
pageSize (optional): The number of items per page (default: 4).
#Response:

items: An array of item objects.
page: The current page number.
pageSize: The number of items per page.
totalPages: The total number of pages.
Please note that the request and response body structures for each API are mentioned in the Swagger annotations. Make sure to provide the correct data in the request body to interact with the APIs successfully.

## video link:https://drive.google.com/file/d/1Jw0_ue9ZacAewRLG1ox2G2_o6OLUkQP8/view?usp=sharing
