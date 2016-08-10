var app = function() {
  var auth = {
    // replace this with your api key.
    // if you try using this key, your app won't work since it's not coming from the right origin.
    // we need to whitelist your origin, and then we provide you with a key.
      client_id: '530625799361-lvnmsd9p0nrhncs81kuelhrjgak5q6rj.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.appfolder',
      immediate: true
    },
    fileId;

  // create a file in the appDataFolder
  // file is named 'Open.Loadout'
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

  // list all the files in the appDataFolder
  // that match the name 'Open.Loadout' (hopefully just one...)
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

  function getFile() {
    gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }).execute(function(data) {
        Display.button();
        Display.output(data.result);
    });
  }

  // the main flow after authentication
  Display.refresh = function refresh(authResult) {
    if (authResult && !authResult.error) {

      // Access token has been successfully retrieved, requests can be sent to the API.
      Display.button('loading');

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
      Display.button('click to sync', function() {
        gapi.auth.authorize(auth, Display.refresh);
      });
    }
  }

  // kickstart!
  gapi.auth.authorize(auth, Display.refresh);
};
