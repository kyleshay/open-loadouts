# Open Loadouts

Share loadout data between Destiny applications.

### Scope
The only permission required is:
`https://www.googleapis.com/auth/drive.appfolder`

### Shared file location
All data is stored in a file named `Open.Loadout` in the `appDataFolder` space in google drive.

### Schema
```javascript
data:<MembershipId:string, Loadouts:array<Loadout>>

class StackableItem() {
  hash:number
  amount:number
}

class Loadout() {
  guid:number;
  name:string;
  platform:string;
  subclass:number;
  equip:array<string>;
  inventory:array<string>;
  stackable:array<StackableItem>;
}
```
