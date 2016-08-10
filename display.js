// This file has nothing really to do with the OL implementation.
// It's just for updating the display on the demo page.
window.Display = (function () {
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

    var list = document.getElementById('output');
    list.innerHTML = '';
    for(var membershipId in data) {
      var container = document.createElement('div'),
          element = document.createElement('label');
      element.innerText = 'ID ' + membershipId;
      container.appendChild(element);

      data[membershipId].forEach(function(loadout) {
        var element = document.createElement('label');
        element.innerText = loadout.name +
          ' - equip:' + loadout.equip.length +
          ' - inv:' + loadout.inventory.length +
          ' - stack:' + loadout.stackable.length +
          ' - ' + getType(loadout.subclass) +
          ' - ' + loadout.platform;
        container.appendChild(element);
      });

      container.className = 'item-container item-container-content';
      list.appendChild(container);
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
