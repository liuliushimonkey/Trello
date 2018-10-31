baseUrl = "http://localhost:3000";

class TrelloService{
    getColumns(){
        return this.fetchJson(baseUrl + "/columns");
    }

    getCards(){
        return this.fetchJson(baseUrl + "/cards");
    }

    updateColumn(column){
        return this.updateByJson(baseUrl + "/columns/" + column.id, column, 'PUT');
    }

    updateCard(card){
        return this.updateByJson(baseUrl + "/cards/" + card.id, card, 'PUT');
    }

    createColumn(column){
        return this.updateByJson(baseUrl + "/columns", column, 'POST');
    }

    createCard(card){
        return this.updateByJson(baseUrl + "/cards", card, 'POST');
    }

    deleteColumn(column){
        return this.delete(baseUrl + "/columns/" + column.id);
    }

    deleteCard(card){
        return this.delete(baseUrl + "/cards/" + card.id);
    }

    delete(url){
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return fetch(url, options).then(response => response.json())
        .catch(error => console.error(error));
    }

    updateByJson(url, data, method){
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        return fetch(url, options).then(response => response.json())
        .catch(error => console.error(error));
    }

    fetchJson(url){
        return fetch(url).then(response => response.json())
        .catch(error => console.error(error));
    }
}

trelloService = new TrelloService();

document.addEventListener('DOMContentLoaded', function(event) {
    createManager();
    // trelloService.updateCard({
    //     "id": 2,
    //     "title": "new title fufufufuf",
    //     "description": "from service",
    //     "columnId": 2
    // });

    // trelloService.updateColumn({
    //     "id": 1,
    //     "title": "fucking updated column title"
    // });

    // trelloService.deleteCard({
    //     "id": 6
    // });
});

async function createManager(){
    let columns = await trelloService.getColumns();
    let cards = await trelloService.getCards();
    var colManager = document.createElement("column-manager");
    document.body.appendChild(colManager);

    colManager.columns = columns;
    colManager.cards = cards;
}
 
function removeAllChild(target){
    while(target.firstChild){
        target.removeChild(target.firstChild);
    }
}
 
function createInput(value){
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = value;
    input.addEventListener('click', e => {e.stopPropagation();});
 
    return input;
}
 

 
 