# Open Loadouts
Share loadout data between 3rd party Destiny applications. Read through [`app.js`](https://github.com/kyleshay/open-loadouts/blob/gh-pages/app.js) for one example implementation.

### Scope
The only permission required from the Google API is:
`https://www.googleapis.com/auth/drive.appfolder`

### Shared file location
All data is stored in a file named `Open.Loadout` in the `appDataFolder` space in google drive.

### Schema
```javascript
data:<MembershipId:string, Loadouts:array<Loadout>>

class Item() {
  hash:number // required for all items.
  id:string // required for non-stackable items. stackable items do not have an id.
  amount:number // required for stackable items. all other items are optional or should be 1
}

class Loadout() {
  guid:number;
  name:string;
  platform:string;
  subclass:number;
  equip:array<Item>;
  inventory:array<Item>;
  stackable:array<Item>;
}
```
