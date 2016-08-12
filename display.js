// This file has nothing really to do with the OL implementation.
// It's just for updating the display on the demo page.
window.Display = (function () {
  function getRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = 'json';

    xhr.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200) {
        callback(this.response);
      }
    }
    xhr.send();
  }

  function output(data) {
    if (!data) {
      return;
    }

    function getType(classType) {
      switch(classType) {
        case -2: return 'Any';
        case -1: return 'Vault';
        case  0: return 'Warlock';
        case  1: return 'Titan';
        case  2: return 'Hunter';
      }
      return '?';
    }

    function getBadge(loadout, item) {
      var equip = loadout.equip.filter(function(stack) {
        return stack.hash === item.itemHash;
      });
      var inventory = loadout.inventory.filter(function(stack) {
        return stack.hash === item.itemHash;
      });
      var stackable = loadout.stackable.filter(function(stack) {
        return stack.hash === item.itemHash;
      });
      if(equip.length) {
        return 'eq';
      }
      if(inventory.length) {
        return 'inv';
      }
      if(stackable.length) {
        return stackable[0].amount;
      }
    }

    function makeBadge(text, container) {
    }

    var list = document.getElementById('output');
    list.innerHTML = '';
    for(var membershipId in data) {
      var table = document.createElement('table'),
          el = document.createElement('div'),
          user = document.createElement('div');

      user.innerText = 'Loading... ' + membershipId;
      list.appendChild(user);

      getRequest("https://ol-proxy.herokuapp.com/Platform/User/GetBungieAccount/" + membershipId + "/" + 1, function(data) {
        user.innerText = data.bungieNetUser.displayName;
      });

      data[membershipId].forEach(function(loadout) {

        getRequest("https://ol-proxy.herokuapp.com/hash/" + loadout.equip.concat(loadout.inventory).concat(loadout.stackable).map(function(items) {
          return items.hash;
        }).join(','), function(items) {
          var title = document.createElement('h3');
          title.innerText = loadout.name + ' - ' + getType(loadout.subclass) + ' - ' + loadout.platform;
          list.appendChild(title);

          var div = document.createElement('div');
          items.forEach(function(item) {
            var container = document.createElement('span');
            container.className = 'icon';
            el = document.createElement('img');
            el.src = 'https://www.bungie.net' + item.icon;

            var span = document.createElement('span');
            span.innerText = getBadge(loadout, item);
            container.appendChild(span);

            container.appendChild(el);
            div.appendChild(container);
          });
          list.appendChild(div);
        });
      });

      list.appendChild(table);
    }
  }


  function button(content, click) {
    if(!content) {
      output();
    }

    var sync = document.getElementById('sync-button');
    sync.innerText = content || 'reload';
    sync.onclick = click || function() {
      Display.refresh(true);
    };
  }

  return {
    button: button,
    output: output
  };
}());
