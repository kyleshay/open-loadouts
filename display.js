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
      var table = document.createElement('table'),
          el = document.createElement('div');
      el.innerText = 'ID ' + membershipId;
      list.appendChild(el);

      data[membershipId].forEach(function(loadout) {
        el = document.createElement('tr');
        el.title = loadout.name;
        el.innerHTML = '<tr>' +
          '<td class="name">' + loadout.name +
          '</td><td>Equip:' + loadout.equip.length +
          '</td><td>Inv:' + loadout.inventory.length +
          '</td><td>Stack:' + loadout.stackable.length +
          '</td><td>' + getType(loadout.subclass) +
          '</td><td>' + loadout.platform +
          '</td></tr>';
        table.appendChild(el);
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
