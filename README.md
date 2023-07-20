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
 ##video link:https://drive.google.com/file/d/1Jw0_ue9ZacAewRLG1ox2G2_o6OLUkQP8/view?usp=sharing
Then you can try api in postman or any related things like thunder client:
API ENDPOINTS
#StorageSpace
1) Create a new storage space:
 Endpoint: POST /api/createstorage
Description: Create a new storage space with the provided details.
localhost:3000/api/renamestorage/grocerystore
example:localhost:3000/createstorage
{
  "name": "Storage Space Name",
  "maxLimit": 100,
  "refrigerate": 50
}
2)localhost:3000/api/deletestorage/64b97284860c597425938762
4)localhost:3000/api/getallitems/64b969caa0b711872ab04fde

#ItemType
1)localhost:3000/api/createItemType
2)localhost:3000/api/renameItemType/64b972e1860c597425938768
3)localhost:3000/api/deleteItemType/64b972e1860c597425938768

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

4) Get all items (Paginated)
Endpoint: GET /api/getAllItems

Description: Get a paginated list of all items.

Parameters:

page (optional): The page number (default: 1).
pageSize (optional): The number of items per page (default: 4).
Response:

items: An array of item objects.
page: The current page number.
pageSize: The number of items per page.
totalPages: The total number of pages.
Please note that the request and response body structures for each API are mentioned in the Swagger annotations. Make sure to provide the correct data in the request body to interact with the APIs successfully.

 ##video link:https://drive.google.com/file/d/1Jw0_ue9ZacAewRLG1ox2G2_o6OLUkQP8/view?usp=sharing
