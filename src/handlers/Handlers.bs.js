// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Belt_MapString = require("rescript/lib/js/belt_MapString.js");
var Handlers_Invite = require("./Handlers_Invite.bs.js");
var Handlers_BrightId = require("./Handlers_BrightId.bs.js");

var handlers = Belt_MapString.fromArray([
      [
        "!invite",
        Handlers_Invite.invite
      ],
      [
        "!brightid",
        Handlers_BrightId.brightId
      ]
    ]);

exports.handlers = handlers;
/* handlers Not a pure module */
