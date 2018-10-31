class ColumnNamagerComponent extends HTMLElement{
    constructor(){
        super();
        
        this.trelloService = new TrelloService();
    }
 
    connectedCallback(){
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = currentDocument.querySelector('#column-manager-template');
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance); 

        var addColumnButton = this.shadowRoot.querySelector('.column-manager__newColumn');
        addColumnButton.onclick = e => this.onColumnAdded(e);

        var filterInput = this.shadowRoot.querySelector('.column-manager__filter');
        filterInput.onkeyup = e => this.filter(e);

        shadowRoot.addEventListener('card-column-delete', e => {this.onColumnDelete(e);})
        shadowRoot.addEventListener('card-column-saved', e => {this.onColumnSaved(e);})
        shadowRoot.addEventListener('app-card-saved', e => {this.onCardSaved(e);})
        shadowRoot.addEventListener('app-card-delete', e => {this.onCardDelete(e);})
        shadowRoot.addEventListener('app-card-added', e => {this.onCardAdded(e);})
    }

    onCardAdded(event){
        this.trelloService.createCard(event.detail);
    }

    filter(event){
        var filterTest = event.target.value.toLowerCase();
        var validCardsDict = {};

        Array.from(this.cards).forEach(card => {
            var columnKey = card.columnId.toString();
            var cardElement = this.findCardElement(card.id, card.columnId);
            if(cardElement == undefined){
                return;
            }

            if(cardElement.title.toLowerCase().indexOf(filterTest) == -1
            && cardElement.description.toLowerCase().indexOf(filterTest) == -1){
                cardElement.style.visibility = "hidden";
            } else{
                cardElement.style.visibility = "visible";
                validCardsDict[columnKey] = true;
            }
        })
    }

    findCardElement(cardId, columnId){
        var columnElement = this.shadowRoot.querySelector("#card-manager_column_" + columnId);
        return columnElement.shadowRoot.querySelector("#card" + cardId + "_column" + columnId);
    }


    onColumnAdded(event){
        var colData = {
            "id": this.getNewColumnId(),
            "title": "New"
        };
        this.addColumn(colData, []);
        this.trelloService.createColumn(colData);
    }

    getNewColumnId(){
        return ++maxColumnId;
    }

    onColumnDelete(event){
        var columnId = event.detail.id;
        var colToDelete = this.shadowRoot.querySelector("#card-manager_column_" + columnId);
        this.shadowRoot.querySelector(".column-manager__columns").removeChild(colToDelete);
        this.trelloService.deleteColumn(event.detail);
    }

    onColumnSaved(event){
        var detail = event.detail;
        var shouldCallService = true;
        this.columns.forEach(column => {
            if(column.id != detail.id && column.title == detail.title){
                window.alert("Can't save column, such title already exist!");
                shouldCallService = false;
                return;
            }
        });

        this.trelloService.updateColumn(detail);
    }

    onCardSaved(event){
        var detail = event.detail;
        var shouldCallService = true;
        this.cards.forEach(card => {
            if((card.id != detail.id) 
            && (card.title == detail.title || card.description == detail.description)){
                window.alert("Can't save card, card with such title or description already exist!");
                shouldCallService = false;
                return;
            }
        });

        this.trelloService.updateCard(detail);
    }

    onCardDelete(event){
        this.trelloService.deleteCard(event.detail);
    }

    set columns(columns){
        if(this._columns != columns){
            this._columns = columns;
            this.removeAllColumns(); 

            if(this.cards != undefined){
                this.loadColumns();
            }
        }
    }

    get columns(){
        return this._columns;
    }

    set cards(cards){
        if(this._cards != cards){
            this._cards = cards;
            this.removeAllColumns();

            if(this.columns != undefined){
                this.loadColumns();
            }
        }
    }

    get cards(){
        return this._cards;
    }

    loadColumns(){
        var cardsDict = {};
        Array.from(this.cards).forEach(card => {
            var columnKey = card.columnId.toString();
            if(cardsDict[columnKey] == undefined){
                cardsDict[columnKey] = [];
            }
            cardsDict[columnKey].push(card);
        })

        Array.from(this.columns).forEach(column => {
            var columnKey = column.id.toString();
            if(cardsDict[columnKey] != undefined && cardsDict[columnKey].length > 0){
                this.addColumn(column, cardsDict[columnKey]);
            }
        })
    }

    addColumn(colData, cards){
        var column = document.createElement("card-column");
        this.shadowRoot.querySelector(".column-manager__columns").appendChild(column);

        column.columnId = colData.id;
        column.title = colData.title;
        column.cards = cards;
        column.id = "card-manager_column_" + colData.id;

        maxColumnId = Math.max(maxColumnId, colData.id);
    }

    removeAllColumns(){
        var columnsContainer = this.shadowRoot.querySelector(".column-manager__columns");
        var columns = Array.from(this.shadowRoot.querySelectorAll('card-column'));
        if(columns != undefined && columns.length > 0){
            columns.forEach(column => columnsContainer.removeChild(column));
        }
    }
}

customElements.define('column-manager', ColumnNamagerComponent);
maxColumnId = 0;