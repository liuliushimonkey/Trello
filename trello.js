baseUrl = "http://localhost:3000";

class TrelloService{
    getColumns(){
        return this.fetchJson(baseUrl + "/columns");
    }

    getCards(){
        return this.fetchJson(baseUrl + "/cards");
    }

    fetchJson(url){
        return fetch(url).then(response => response.json())
        .catch(error => console.error(error));
    }
}

trelloService = new TrelloService();

document.addEventListener('DOMContentLoaded', function(event) {
    createManager();
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
 

 
 