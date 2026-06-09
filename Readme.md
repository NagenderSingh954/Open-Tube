# This app was made in order to learn the Backend from the Chai our Code yt


1st we have to make teh data base connection.there is various way to connectthe db we can write the connection copde in the index as we have tell teh node.js to execute from the index file mean it us the starting file of the program and another is that we can separate the code in different file this organize the code we will see teh both opproach


2 Thing to remember about the database 
   1) whenever we try to talk to alway wrap in the try catch becouse there may be the issue will arise and it is import that if the data not load then give the user response accordingly 
   2) DB is on the another continenet so there is the time require for this always use Async Await 

if you look at the 2nd commit we have establish the connecton with the DB

# thing to remember 
  1) if we use the Asyng fn it always return the promice which will be handle when fn call