Trello Challenge exercice

to launch the app, you shall first install json server (npm install -g json-server)
and then go to the folder "Trello/server" and then launch the server (json-server --watch db.json)

click on the index.html, normally it should work

the main component is the column-manager element, which contains a couple of columns,
it will begin by calling the server to retrieve the data to decide how many columns, 
and how each column should be displayed.
each column is a card-column element.

you can click on the buttons below the column titles to delete/modify/save a column, or add new
card to a column. save button is only enabled when the title of column is in edit mode.

you can click on the buttons below the card element to delete/modify/save a card
by default the description for card is hidden, you can click anywhere inside  a card
to show the description. When you click on modify button of a card, both title
and description will be in edit mode.

you can click on the "Add Column" to add a new column, and enter a test in the textbox to filter the cards.
Both the title and the description are checked for the filtering

No thrid party library is used in the components, but Jasmine is used for the testing

Thank you
