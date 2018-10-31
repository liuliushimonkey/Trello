describe("CardComponent", function(){
    var cardComponent;

    beforeEach(function(){
        cardComponent = new CardComponent();
    });

    it("accepts columnId attribute", function(){
        cardComponent.columnId = 66;
        expect(cardComponent.columnId).toEqual(66);
    });

    it("accepts cardId attribute", function(){
        cardComponent.cardId = 55;
        expect(cardComponent.cardId).toEqual(55);
    });


})
