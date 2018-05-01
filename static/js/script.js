'use strict';

// Global Vars
var myLists;
var draggedCardList;

$(document).ready(function(){
    scrollToEnd();
    obtainLists();

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
        sL.cards[index] = $(this).text();
        modifyList(sL);
    });
}
function deleteCard(t, listId){
    let sL = _.findWhere(myLists, {id:parseInt(listId)});
    let index = $(t).parent().index();
    sL.cards.splice(index, 1);
    modifyList(sL);
}
function allowDropCard(e){
    e.preventDefault();
}
function dragCard(e){
    e.dataTransfer.setData("html", e.target.outerHTML);
    setTimeout(function(){
    	e.target.classList.add('hide');
    });
}
function endDragCard(e){
    if(draggedCardList){
        console.log("LATE");
        let listId = $(e.srcElement).attr("listid");
        let sL = _.findWhere(myLists, {id:parseInt(listId)});
        let index = $(e.srcElement).index();
        console.log(index);
        console.log(sL.cards);
        sL.cards.splice(index, 1);
        console.log(sL.cards);

        $(e.srcElement).remove();
        updateLists(sL, draggedCardList);
        draggedCardList = null;
    }
    setTimeout(function(){
    	e.target.classList.remove('hide');
    });
}

function dropCard(e){
    e.preventDefault();
    var data = e.dataTransfer.getData("html");
    let parent = $(e.target).parents("ul")[0];
    if(parent == null){
        if($(e.target).prop("tagName") === "UL"){
            parent = $(e.target);
            parent.prepend($(data));
        }
    }
    else{
        let p = e.target;
        if($(p).prop("tagName") === "LI"){
            $(p).before($(data));
        }
        else{
            p = $(p).parent("li")[0];
            $(p).before($(data));
        }

        let listId = $(p).attr("listid");
        let sL = _.findWhere(myLists, {id:parseInt(listId)});
        let index = $(p).index();

        if(sL){
            if(sL.cards){
                console.log(index-1);
                console.log("EARLY");
                console.log(sL.cards);
                sL.cards.splice(index-1, 0, $(data).children("p").text());
                console.log(sL.cards);
            }
            else{
                sL.cards = [$(data).children("p").text()]
            }
            draggedCardList = sL;
        }
    }
}
function moveListRight(listId){
    let sL = _.findIndex(myLists, {id:parseInt(listId)});
    let nL = sL + 1;

    if(nL < myLists.length){
        let tL = myLists[sL];
        let tP = myLists[nL].pos;
        myLists[nL].pos = myLists[sL].pos;
        myLists[sL].pos = tP;
        myLists.splice(sL, 1);
        myLists.splice(nL, 0, tL);
        console.log(myLists);

        updateLists(myLists[sL], myLists[nL]);
    }
}
function moveListLeft(listId){
    let sL = _.findIndex(myLists, {id:parseInt(listId)});
    let nL = sL - 1;

    if(nL >= 0){
        let tL = myLists[sL];
        let tP = myLists[nL].pos;
        myLists[nL].pos = myLists[sL].pos;
        myLists[sL].pos = tP;
        myLists.splice(sL, 1);
        myLists.splice(nL, 0, tL);
        console.log(myLists);

        updateLists(myLists[sL], myLists[nL]);
    }
}
function deleteList(listId){
    $.ajax('/api/lists/'+listId, {
      type: 'DELETE'
    })
    .then(function(res){
        location.reload();
    });
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

// For Multiple List Updates
function updateLists(oneL, twoL){
    $.ajax('/api/lists/'+oneL.id, {
      type: 'POST',
      data: {
        name: oneL.name,
        pos: oneL.pos,
        cards: oneL.cards
      }
  }).done(function(res){
      modifyList(twoL);
  });
}

function obtainLists(){
    $.ajax('/api/lists', {
      type: 'GET'
    })
    .then(function(res){
        console.log(res);
        myLists = _.sortBy(res.rows, 'pos');
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
        sL.cards.push("new");
    }
    else{
        sL.cards = ["new"]
    }
    if ( sL ){
        modifyList(sL);
    }
}
