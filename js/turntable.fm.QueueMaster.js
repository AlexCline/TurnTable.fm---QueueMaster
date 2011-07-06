TTQM = {};

TTQM.prefs = {
  "power": true,
  "chatty": false,
  "limit": 10
};

TTQM.queue = [];

TTQM.menu = function() {
  return [
    "div.qm-menu",
    ["div.qm-menu-content",
      ["ul",
        ["li",
          ["span.qm-menu-label","Power: "],
          ["span#qm-power.qm-menu-value","..."]
        ],
        ["li",
          ["span.qm-menu-label", "Chatty: "],
          ["span#qm-chatty.qm-menu-value", "..."]
        ],
        ["li",
          ["span.qm-menu-label", "Total: "],
          ["span#qm-limit.qm-menu-value", "..."]
        ],
        ["li",
          ["span#qm-pqueue.qm-menu-value", "Print Queue"]
        ],
        ["li",
          ["span#qm-phelp.qm-menu-value", "Print Help"]
        ]
      ]
    ],
    ["div.qm-menu-button", "QueueMaster",
      ["img", {src: "http://upload.wikimedia.org/wikipedia/commons/a/a6/Silk_bullet_arrow_down.png"}]
    ]
  ]
}

TTQM.help = "Join The Queue: Q+  View Current Queue: Q?";

TTQM.$body = $("#outer");

$(document).ready(function() {

  TTQM.$body.append(util.buildTree(TTQM.menu()));


  TTQMEventListener = function(m) {
    if(TTQM.prefs.power && typeof(m.command) !== "undefined") {
      switch (m.command) {
        case "speak":
          switch (m.text) {
            case "Q?":
            case "q?":
              printQueue();
            break;
            case "Q+":
            case "q+":
              addDJ(m.name);
            break;
            case "Q-":
            case "q-":
              removeDJ(m.name);
            case "Q":
            case "q":
              printChat(TTQM.help);
            break;
            break;
          }
        break;
        case "deregistered":
          removeDJ(m.user[0].name);
        break;
      }
    }
  }

  addDJ = function(dj) {
    if(TTQM.queue.length == TTQM.prefs.limit) {
      printChat("Sorry, already at the queue limit. (" + TTQM.prefs.limit + ")");
      return
    }
    if(TTQM.queue.indexOf(dj) == -1){
      TTQM.queue.push(dj);
      if(TTQM.prefs.chatty)
        printChat("Added \"" + dj + "\" to the queue.");
      printQueue();
    }
  }

  removeDJ = function(dj) {
    var index = TTQM.queue.indexOf(dj);
    if(index != -1) {
      TTQM.queue.splice(index, 1);
      if(TTQM.prefs.chatty)
        printChat("Removed \"" + dj + "\" from the queue.");
      printQueue();
    }
  }

  setPower = function(state) {
    if(state){
      $("#qm-power").html("ON");
      TTQM.prefs.power = true;
    } else {
      $("#qm-power").html("OFF");
      TTQM.prefs.power = false;
    }
  }

  setChatty = function(state) {
    if(state){
      $("#qm-chatty").html("ON");
      TTQM.prefs.chatty = true;
      printChat("QM is chatty!");
    } else {
      $("#qm-chatty").html("OFF");
      TTQM.prefs.chatty = false;
    }
  }

  printChat = function(msg) {
    $(".chat-container form.input-box input").val(msg);
    $(".chat-container form.input-box").submit();
  }

  printQueue = function() {
    var str = "Current Queue: " + TTQM.queue.join(", ");
    printChat(str);
  }

  $(".qm-menu-button").click( function() {
    if($(".qm-menu-content").is(":hidden")) {
      $(".qm-menu-content").slideDown("fast");
      $(".qm-menu-button img").attr("src", "http://upload.wikimedia.org/wikipedia/commons/1/1a/Silk_bullet_arrow_up.png");
    } else {
      $(".qm-menu-content").slideUp("fast");
      $(".qm-menu-button img").attr("src", "http://upload.wikimedia.org/wikipedia/commons/a/a6/Silk_bullet_arrow_down.png");
    }
  });

  $("#qm-power").click(function(){ setPower(!TTQM.prefs.power) });
  $("#qm-chatty").click(function(){ setChatty(!TTQM.prefs.chatty) });

  $("#qm-phelp").click(function(){ printChat(TTQM.help) });
  $("#qm-pqueue").click(function(){ printQueue() });

  $("#qm-limit").html(TTQM.prefs.limit);

  //$("div.messages").contentChange(function() { alert("woo") });
 
  window.turntable.addEventListener("message", TTQMEventListener);

  setPower(TTQM.prefs.power);
  setChatty(TTQM.prefs.chatty);
});



