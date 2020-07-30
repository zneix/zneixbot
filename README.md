# Introduction

zneixbot is a variety Discord bot with slight moderation / utility features and some fun commands
###### made by IT nerd with ❤️

---

## Breakthrough of most useful features

* utility / make-your-life-easier:
  * fast emote adding / showcasing (even with IDs)
  * many converters: colors, dns records, discord snowflakes, temperatures, money (25+ currencies), etc...
  * basic inforamtion-fetching for Discord objects \(such as users, servers, avatars, icons, etc...\)
  * math calculations
* moderation:
  * basic kick / ban commands with optional reason \(supports IDs\)
  * temporary bans
  * ban check / unbanning certain IDs
  * message cleanup
  * quick region change \(useful during discord outages\)
  * logging of important events, such as joining/leaving server, deleting/editing messages
* server utilities
  * changeable bot prefix!
  * throwing giveaways with multiple winners!
  * self-assignable roles with one command!
  * highly customizable leveling system with role rewards for free!
    * leaderboard
    * rank-check
    * ignoring certain channels and/or users
    * customizable ways of announcing level ups
* fun/misc:
  * quite few rng-based commands \(8ball, plain rng, %-chance, coinflip\)
  * rock-paper-scissors
  * rubik's cube scrambles
  * image squish \(just like emote modification of Twitch\)
  * wednesday check, my dude
  * yearprogress
  * \( ͡° ͜ʖ ͡°\)
  * random gachimuchi track lookup

### Note: **There are some aliases for several commands, use help command for more information.**

## FAQ

#### What changed recently? Are you working on the bot?
Yes, I do. All changes are being posted on [support server](https://discordapp.com/invite/cF555AV), this repository and `changelog` command. Check it sometimes to stay updated!

#### How do I add bot to my server?
Just click on [this link](https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=1409674343&scope=bot) and make sure you have required permissions to add the bot (Managing Server)

#### Bot didn't respond it's very slow, why?
That happens, sometimes due to API issues and Discord outages, but it's also an issue with my server being small, so be patient please. Bot also goes down for short periods of time due to maintenace - join [support server](https://discordapp.com/invite/cF555AV) to stay updated or use `changelog` command

#### Can I host bot on my own?
Unfortunately that's not possible at the moment, due to no installation docs and difficult database setup. Please use official hosted version

#### I'm lost, can I get help or contact you somehow?
Sure, you can DM me on Discord `zneix#4433` or join [support server](https://discordapp.com/invite/cF555AV)


## Planned to do in near future:

* Music Module
* Random Image lookup command
* auto-role thing for moderation, **partly done!**
* Steam API communication
* warning, feedback, support system via commands

## Used libraries:

* [canvas](https://github.com/Automattic/node-canvas)
* [child_process]()
* [discord.js](https://github.com/discordjs/discord.js)
* [enmap](https://enmap.evie.codes/)
* [fs](https://github.com/npm/security-holder)
* [long-timeout]()
* [mongodb](https://github.com/mongodb/node-mongodb-native)
* [node-fetch](https://www.npmjs.com/package/node-fetch)
