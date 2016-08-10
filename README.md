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
  id:string
}

class StackableItem() {
  hash:number
  amount:number
}

class Loadout() {
  guid:number;
  name:string;
  platform:string;
  subclass:number;
  equip:array<Item>;
  inventory:array<Item>;
  stackable:array<StackableItem>;
}
```
