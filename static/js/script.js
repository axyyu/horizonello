'use strict';

// Global Vars
var myLists;

$(document).ready(function(){
    scrollToEnd();
    obtainLists();
    console.log(myLists);
});
function scrollToEnd() {
    var scrollWidth = $("#body-container").get(0).scrollWidth;
    var clientWidth = $("#body-container").get(0).clientWidth;
    $("#body-container").animate({ scrollLeft: scrollWidth - clientWidth },
    {
        duration: 100,
        complete: function () {
        }
    });
};

/*
    Multiple Use Endpoints
*/
function modifyList(name, pos, cards, id){
    $.ajax('/api/lists/'+id, {
      type: 'POST',
      data: {
        name: name,
        pos: pos,
        cards: cards
      }
    })
    .then(function(res){
        location.reload();
    });
}

function updateList(){
    // modifyList();
}
function obtainLists(){
    $.ajax('/api/lists', {
      type: 'GET'
    })
    .then(function(res){
        console.log(res);
        myLists = res.rows;
        console.log(myLists);
    });
}

function addNewList(){
    $.ajax('/api/lists', {
      type: 'POST',
      data: {
        name: "New List",
        pos: $("#list-container").children().length,
        cards: []
      }
    })
    .then(function(res){
        location.reload();
    });
}
function addNewCard(listId){
    console.log(listId);
    console.log(myLists);
    let sL = _.findWhere(myLists, {id:parseInt(listId)});

    if(sL.cards){
        sL.cards.push("hello");
    }
    else{
        sL.cards = ["hello"]
    }
    if ( sL ){
        modifyList(sL.name, sL.pos, sL.cards, sL.id);
    }
}
