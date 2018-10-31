class CardColumnComponent extends HTMLElement{
    constructor(){
        super();
    }
 
    connectedCallback(){
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = currentDocument.querySelector('#card-column-template');
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance);
 
        var deleteButton = this.shadowRoot.querySelector('.card-column__delete');
        deleteButton.onclick = e => this.Delete(e);
        var modifyButton = this.shadowRoot.querySelector('.card-column__modify');
        modifyButton.onclick = e => this.Modify(e);
        var saveButton = this.shadowRoot.querySelector('.card-column__save');
        saveButton.onclick = e => this.Save(e);
 
        var newCardButton = this.shadowRoot.querySelector('.card-column__newCard');
        newCardButton.onclick = e => this.addNewCard();
 
        shadowRoot.addEventListener('app-card-delete', e => {this.onCardDelete(e);})
    }
 
    set title(newTitle){
        if(this.title != newTitle){
            this.setAttribute("columnTitle", newTitle);
            this.shadowRoot.querySelector('.card-column__title').innerHTML = newTitle;
        }
    }  
 
    get title(){
        return this.getAttribute("columnTitle");
    }
 
    set columnId(id){
        this._columnId = id;
    }
 
    get columnId(){
        return this._columnId;
    }
 
    set cards(cards){
        if(this._cards != cards){
            this._cards = cards;
            this.removeAllCards();
            Array.from(cards).forEach(data => {
                this.addCard(data.id, data.columnId, data.title, data.description);
            })
        }
    }
 
    get cards(){
        return this._cards;
    }
 
    removeAllCards(){
        var cardsContainer = this.shadowRoot.querySelector(".card-column__container");
        var cards = Array.from(this.shadowRoot.querySelectorAll('app-card'));
        if(cards != undefined && cards.length > 0){
            cards.forEach(card => cardsContainer.removeChild(card));
        }
    }
 
    set width(newWidth){
        if(this.width != newWidth){
            this.setAttribute("columnWidth", newWidth);
            var widthValue = isNaN(newWidth) ? newWidth : newWidth + "px";
            this.shadowRoot.querySelector('.card-column__container').style.maxWidth = widthValue;
        }
    }  
 
    get width(){
        return this.getAttribute("columnWidth");
    }
 
    Delete(event){
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent("card-column-delete", {
            detail: {
                id: this.columnId
            },
            bubbles: true,
            composed: true
        }));
    }
 
    Modify(event){
        if(this._modifying){
            return;
        }
 
        this._modifying = true;
        var titleContainer = this.shadowRoot.querySelector(".card-column__title")
        this.title = titleContainer.textContent;
 
        removeAllChild(titleContainer);
 
        var titleInput = createInput(this.title);
        titleContainer.appendChild(titleInput);
 
        event.target.disabled = true;
        this.shadowRoot.querySelector('.card-column__save').disabled = false;
        event.stopPropagation();
    }
   
    Save(event){
        if(!this._modifying){
            return;
        }
        this._modifying = false;
        var titleContainer = this.shadowRoot.querySelector(".card-column__title")
 
        var newTitle = titleContainer.firstChild.value;
        this.title = newTitle;
 
        removeAllChild(titleContainer);
 
        titleContainer.innerHTML = newTitle;
        event.target.disabled = true;
        this.shadowRoot.querySelector('.card-column__modify').disabled = false;
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('card-column-saved', {
            detail: {
                id: this.columnId,
                title: this.title
            },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
    }
 
    onCardDelete(event){
        var cardId = event.detail.id;
        var elementId = "card" + cardId + "_column" + this.columnId;
        var cardElement = this.shadowRoot.querySelector("#" + elementId);
        if(cardElement != undefined){
            this.shadowRoot.querySelector(".card-column__container").removeChild(cardElement);
        }
    }
 
    addNewCard(){
        var newId = this.getNewCardId();
        this.addCard(newId, this.columnId, "New", "New");
        this.dispatchEvent(new CustomEvent('app-card-added', {
            detail: {
                id: newId,
                title: "New",
                description: "New",
                columnId: this.columnId,
            },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
    }
 
    addCard(cardId, columnId, title, description){
       var card = document.createElement("app-card");
        this.shadowRoot.querySelector(".card-column__container").appendChild(card);
        card.cardId = cardId;
        card.columnId = columnId;
        card.id = "card" + cardId + "_column" + columnId;
 
        if(title != undefined){
            card.title = title;
        }
 
        if(description != undefined){
            card.description = description;
        }
 
        maxCardId = Math.max(maxCardId, cardId);
    }
 
    getNewCardId(){
        return ++maxCardId;
    }
}
 
customElements.define('card-column', CardColumnComponent);
maxCardId = 0;