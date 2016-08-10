var app = function() {
  var auth = {
    // replace this with your api key.
    // if you try using this key, your app won't work since it's not coming from the right origin.
    // we need to whitelist your origin, and then we provide you with a key.
      client_id: '530625799361-lvnmsd9p0nrhncs81kuelhrjgak5q6rj.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.appfolder',
      immediate: true
    },
    driveData,
    fileId;

  // list all the files in the appDataFolder
  function getFileId(callback) {
    gapi.client.drive.files.list({
      q: 'name="Open.Loadout"',
      spaces: 'appDataFolder',
      fields: 'files(id)'
    }).execute(function(resp) {
      // if there isn't one, make one.
      if (!resp || !resp.files.length) {
        createFile(callback);
        return;
      }

      fileId = resp.files[0].id;
      callback(fileId);
    });
  }

  // create a file in the appDataFolder
  // file is named "OL" + membershipId
  function createFile(callback) {
    gapi.client.drive.files.create({
      fields: 'id',
      resource: {
        name: 'Open.Loadout',
        parents: ['appDataFolder']
      }
    }).execute(function(resp) {
      if(resp && resp.id) {
        fileId = resp.id;
        callack(resp.id);
      }
    });
  }

  function getFile() {
    console.log('loading', fileId)
    gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }).execute(function(data) {
        driveData = data.result;
        updateButton();
    });
  }

  // the main flow after authentication
  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {

      // Access token has been successfully retrieved, requests can be sent to the API.
      updateButton('loading');

      // load google
      gapi.client.load('drive', 'v3', function() {

        // do we have something cached?
        if(fileId) {
          getFile();
          return;
        }

        // no... ok, list files in directory
        getFileId(function(fileId) {
          // we found the file, lets load it!
            getFile();
        });
      });
    } else {
      // No access token could be retrieved, show the button to start the authorization flow.
      auth.immediate = false;
      updateButton('click to sync', function() {
        gapi.auth.authorize(auth, handleAuthResult);
      });
    }
  }

  // kickstart!
  gapi.auth.authorize(auth, handleAuthResult);

  // ignore this stuff down here (just display for app related)
  function updateButton(content, click) {
    if(!content) {
      updateOutput();
    }

    var sync = document.getElementById('sync-button');
    sync.innerText = content || 'reload';
    sync.onclick = click || function() {
      handleAuthResult(true);
    };
  }
  function updateOutput() {
    if (!driveData) {
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

    var output = document.getElementById('output');
    output.innerHTML = '';
    for(var membershipId in driveData) {
      var container = document.createElement('div'),
          element = document.createElement('label');

      element.className = 'item';
      element.innerText = 'ID ' + membershipId;
      container.appendChild(element);

      driveData[membershipId].forEach(function(loadout) {
        var element = document.createElement('label');
        element.className = 'item';
        element.innerText = loadout.name +  ' - equip:' + loadout.equip.length +' - inv:' + loadout.inventory.length +' - stack:' + loadout.stackable.length + ' - ' + getType(loadout.subclass) +  ' - ' + loadout.platform;
//        element.innerText = JSON.stringify(loadout, null, 2)
        container.appendChild(element);
      });

      container.className = 'item-container item-container-content';
      output.appendChild(container);
    }
  }
};
