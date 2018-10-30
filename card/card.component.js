const currentDocument = document.currentScript.ownerDocument;

class CardComponent extends HTMLElement{
   constructor(){
       super();

       this.addEventListener('click', e => {this.toggleContent();})
   }

   connectedCallback(){
       const shadowRoot = this.attachShadow({mode: 'open'});
       const template = currentDocument.querySelector('#card-component-template');
       const instance = template.content.cloneNode(true);
       shadowRoot.appendChild(instance);
       this.hideContent();

       var deleteButton = this.shadowRoot.querySelector('.app-card__delete');
       deleteButton.onclick = e => this.onDelete(e);
       var modifyButton = this.shadowRoot.querySelector('.app-card__modify');
       modifyButton.onclick = e => this.onModify(e);
       var saveButton = this.shadowRoot.querySelector('.app-card__save');
       saveButton.onclick = e => this.onSave(e);
   }

   set cardId(id){
       this.setAttribute("cardId", id);
   }

   get cardId(){
       return this.getAttribute("cardId");
   }

   set columnId(id){
       this.setAttribute("columnId", id);
   }

   get columnId(){
       return this.getAttribute("columnId");
   }

   set title(newTitle){
       if(this.title != newTitle){
           this.setAttribute("cardTitle", newTitle);
           this.shadowRoot.querySelector('.app-card__title').innerHTML = "<p>" + newTitle + "</p>";
       }
   }  

   get title(){
       return this.getAttribute("cardTitle");
   }

   set description(description){
       if(this.description != description){
           this.setAttribute("description", description);
           this.shadowRoot.querySelector('.app-card__content').innerHTML = "<p>" + description + "</p>";
       }
   }

   get description(){
       return this.getAttribute("description");
   }

   toggleContent(){
       this._open = !this._open;
       var content = this.shadowRoot.querySelector('.app-card__content');
       content.style.visibility = this._open ? "inherit" : "hidden";
   }

   showContent(){
       this._open = false;
       this.toggleContent();
   }

   hideContent(){
       this._open = true;
       this.toggleContent();
   }

   onDelete(event){
       event.stopPropagation();
       this.dispatchEvent(new CustomEvent("app-card-delete", {
           detail: {
               cardId: this.cardId
           },
           bubbles: true,
           composed: true
       }));
   }

   onModify(event){
       if(this._modifying){
           return;
       }

       this._modifying = true;
       this.showContent();
       var titleContainer = this.shadowRoot.querySelector(".app-card__title")
       var contentContainer = this.shadowRoot.querySelector(".app-card__content");

       this.title = titleContainer.firstElementChild.textContent;
       this.description = contentContainer.firstElementChild.textContent;

       removeAllChild(titleContainer);
       removeAllChild(contentContainer);

       var titleInput = createInput(this.title);
       var descriptionInput = createInput(this.description);

       titleContainer.appendChild(titleInput);
       contentContainer.appendChild(descriptionInput);

       event.target.disabled = true;
       this.shadowRoot.querySelector('.app-card__save').disabled = false;
       event.stopPropagation();
   }

   onSave(event){
       if(!this._modifying){
           return;
       }
       this._modifying = false;
       var titleContainer = this.shadowRoot.querySelector(".app-card__title")
       var contentContainer = this.shadowRoot.querySelector(".app-card__content");

       var newTitle = titleContainer.firstChild.value;
       var newDescription = contentContainer.firstChild.value;
       this.title = newTitle;
       this.description = newDescription;

       removeAllChild(titleContainer);
       removeAllChild(contentContainer);

       titleContainer.innerHTML = "<p>" + newTitle + "</p>";
       contentContainer.innerHTML = "<p>" + newDescription + "</p>";

       event.target.disabled = true;
       this.shadowRoot.querySelector('.app-card__modify').disabled = false;
       event.stopPropagation();
       this.dispatchEvent(new CustomEvent('cardSaved', {
           detail: {
               cardId: this.cardId,
               columnId: this.columnId,
               title: this.title,
               description: this.description
           },
           bubbles: true,
           cancelable: false,
           composed: true
       }));
   }
}

customElements.define('app-card', CardComponent);
