'use strict';

// Global Vars
var myLists;

$(document).ready(function(){
    scrollToEnd();
    obtainLists();
    console.log(myLists);

    setupEditable();
});
function scrollToEnd() {
    var scrollWidth = $("#body-container").get(0).scrollWidth;
    var clientWidth = $("#body-container").get(0).clientWidth;
    $("#body-container").animate({ scrollLeft: scrollWidth - clientWidth },
    {
        duration: 0,
        complete: function () {
        }
    });
};
function setupEditable(){
    $('.list-name').on('keyup paste input', function(e) {
        if(e.which == 13) {
            $('.list-name').blur();
        }
        return e.which != 13;
    }).on('blur', function(){
        let sL = _.findWhere(myLists, {id:parseInt($(this).attr("listid"))});
        sL.name = $(this).text();
        modifyList(sL);
    });
    $('.card p').on('blur', function(){
        let sL = _.findWhere(myLists, {id:parseInt($(this).attr("listid"))});
        let index = $(this).parent().index();
        console.log(index);
        sL.cards[index] = $(this).text();
        modifyList(sL);
    });
}
function deleteCard(t, listId){
    let sL = _.findWhere(myLists, {id:parseInt(listId)});
    let index = $(t).parent().index();
    console.log(index);
    sL.cards.splice(index, 1);
    modifyList(sL);
}

/*
    Multiple Use Endpoints
*/
function modifyList(sL){
    $.ajax('/api/lists/'+sL.id, {
      type: 'POST',
      data: {
        name: sL.name,
        pos: sL.pos,
        cards: sL.cards
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
        modifyList(sL);
    }
}
