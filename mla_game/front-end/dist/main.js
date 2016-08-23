(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

console.log('test');

function reqListener() {
    console.log(this.responseText);
}

var swapClass;

document.getElementById("submit").onclick = nextPhraseButtons;

function swapClassEvent(event) {
    console.log('doing swap class');
    if (event.srcElement.classList.contains('list-group-item-success')) {
        event.srcElement.classList.remove('list-group-item-success');
        event.srcElement.classList.add('list-group-item-danger');
    } else if (event.srcElement.classList.contains('list-group-item-danger')) {
        event.srcElement.classList.remove('list-group-item-danger');
        event.srcElement.classList.add('list-group-item-success');
    }
}

var phraseAnchors = document.getElementsByClassName('list-group-item');

var i;
for (i = 0; i < phraseAnchors.length; i++) {
    phraseAnchors[i].onclick = swapClassEvent;
}

function mediaURL(transcript_id) {
    var mediaRequest = new XMLHttpRequest();
    var mediaData;
    mediaRequest.open('GET', '/api/media/' + transcript_id + '/');
    mediaRequest.send();
    mediaRequest.onreadystatechange = function () {
        var player = document.getElementById('player');
        var playersrc = document.getElementById('mp3src');
        if (mediaRequest.readyState == 4 && mediaRequest.status == 200) {
            mediaData = JSON.parse(mediaRequest.responseText);
            console.log(mediaData.media);
            playersrc.src = mediaData.media;
            player.load();
        }
    };
}

var transcriptRequest = new XMLHttpRequest();
var transcriptData;
transcriptRequest.open('GET', '/api/transcript/random/');
transcriptRequest.send();
transcriptRequest.onreadystatechange = function () {
    if (transcriptRequest.readyState == 4 && transcriptRequest.status == 200) {
        transcriptData = JSON.parse(transcriptRequest.responseText);
        mediaURL(transcriptData.transcript);
        nextPhraseButtons(transcriptData.phrases);
        document.getElementById('title').textContent = 'Title: ' + transcriptData.series;
        document.getElementById('station').textContent = 'Station: ' + transcriptData.station;
    }
};

function nextPhraseButtons(transcriptPhrases) {
    var target;
    for (var x = 0; x < 3; x++) {
        if (x === 0) {
            target = document.getElementById('phrase1');
            console.log(target);
        } else if (x === 1) {
            target = document.getElementById('phrase2');
            console.log(target);
        } else if (x === 2) {
            target = document.getElementById('phrase3');
            console.log(target);
        }
        target.textContent = transcriptData.phrases.shift().text;
        if (target.classList.contains('list-group-item-danger')) {
            target.classList.remove('list-group-item-danger');
            target.classList.add('list-group-item-success');
        }
    }
}

},{}]},{},[1]);
