function $id(id){return document.getElementById(id)}

var grid;
var points = 0;
var arr = [[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1]];
var fieldSize = 4;
var cellSize = 64;
var gameOver = false;

//2 random blocks on load

var Direction = { Left:0, Up:1, Right:2, Down:3 }

function GridRemove(index){
	points += parseInt(grid.childNodes[index].innerHTML) * 2;
	grid.removeChild(grid.childNodes[index]);
	for (var i = 0; i < arr.length; i++){
		if (arr[i][1] > index){
			arr[i][1] = arr[i][1] - 1;
		}
	}
}

function Move(direction){
	var rand = false;
	if (direction == Direction.Right || direction == Direction.Down) {
		var offset;
		var v;
		var w;

		if (direction == Direction.Right || direction == Direction.Left) {
			offset = 4;
			v = 4;
			w = 1;
		}
		else {
			offset = 1;
			v = 1;
			w = 4;
		}

		for (var y = 0; y < 4; y++){
			for (var x = 2; x >= 0; x--){
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w + offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
					arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					if (x < 2) x += 2;
					rand = true;
				}
			}
			for (var x = 2; x >= 0; x--){
				// 2 2 => 4 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w][0] == arr[x * v + y * w + offset][0]) {
					arr[x * v + y * w + offset][0] = arr[x * v + y * w + offset][0] * 2;
					var obj = grid.childNodes[arr[x * v + y * w + offset][1]];
					obj.innerHTML = arr[x * v + y * w + offset][0];
					obj.className = "blk b" + arr[x * v + y * w + offset][0];

					GridRemove(arr[x * v + y * w][1]);
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					x--;
					rand = true;
				}
			}
			for (var x = 2; x >= 0; x--){
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w + offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Right || direction == Direction.Left) {
						arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					else {
						arr[x * v + y * w + offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w + offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					arr[x * v + y * w][1] = -1;
					if (x < 2) x += 2;
					rand = true;
				}
			}
		}
	}
	else {
		var offset;
		var v;
		var w;

		if (direction == Direction.Right || direction == Direction.Left) {
			offset = 4;
			v = 4;
			w = 1;
		}
		else {
			offset = 1;
			v = 1;
			w = 4;
		}

		for (var y = 0; y < 4; y++){
			for (var x = 1; x < 4; x++){
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w - offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
					arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					if (x > 1) x -= 2;
					rand = true;
				}
			}
			for (var x = 1; x < 4; x++){
				// 2 2 => 4 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w][0] == arr[x * v + y * w - offset][0]) {
					arr[x * v + y * w - offset][0] = arr[x * v + y * w - offset][0] * 2;
					var obj = grid.childNodes[arr[x * v + y * w - offset][1]];
					obj.innerHTML = arr[x * v + y * w - offset][0];
					obj.className = "blk b" + arr[x * v + y * w - offset][0];

					GridRemove(arr[x * v + y * w][1]);
					arr[x * v + y * w][0] = 0;
					arr[x * v + y * w][1] = -1;
					x--;
					rand = true;
				}
			}
			for (var x = 1; x < 4; x++){
				// 0 2 => 2 0
				if (arr[x * v + y * w][0] != 0 && arr[x * v + y * w - offset][0] == 0) {
					var obj = grid.childNodes[arr[x * v + y * w][1]];
					if (direction == Direction.Right || direction == Direction.Left) {
						arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					else {
						arr[x * v + y * w - offset][0] = arr[x * v + y * w][0];
						arr[x * v + y * w - offset][1] = arr[x * v + y * w][1];
						arr[x * v + y * w][0] = 0;
					}
					arr[x * v + y * w][1] = -1;
					if (x > 1) x -= 2;
					rand = true;
				}
			}
		}
	}
	if (rand) randomBlk();
	if (!canMove()) {
		gameOver = true;
        //displaying game over info to those, who are never fucking lucky forsenSWA
	}
}

function canMove(){
	for (var i = 0; i < fieldSize; ++i){
		for	(var j = 0; j < fieldSize; ++j){
			if (arr[i + j*4][0] == 0) return true;
		}
	}
	
	for (var i = 0; i < fieldSize; ++i){
		for	(var j = 0; j < fieldSize - 1; ++j){
			if (arr[i + j*4][0] == arr[i + j*4 + 4][0]) return true;
		}
	}
	
	for (var i = 0; i < fieldSize - 1; ++i){
		for	(var j = 0; j < fieldSize; ++j){
			if (arr[i + j*4][0] == arr[i + 1 + j*4][0]) return true;
		}
	}
	return false;
}

function canMoveH(){
	for (var i = 0; i < fieldSize; ++i){
		for	(var j = 0; j < fieldSize; ++j){
			if (arr[i + j*4][0] == 0) return true;
		}
	}
	for (var i = 0; i < fieldSize; ++i){
		for	(var j = 0; j < fieldSize - 1; ++j){
			if (arr[i + j*4][0] == arr[i + j*4 + 4][0]) return true;
		}
	}
}

function canMoveV(){
	for (var i = 0; i < fieldSize; ++i){
		for	(var j = 0; j < fieldSize; ++j){
			if (arr[i + j*4][0] == 0) return true;
		}
	}
	for (var i = 0; i < fieldSize - 1; ++i){
		for	(var j = 0; j < fieldSize; ++j){
			if (arr[i + j*4][0] == arr[i + 1 + j*4][0]) return true;
		}
	}
}

function randomBlk(){
	if (grid.childNodes.length < 16){
		//count available
		var n = 0;
		for (var i=0; i<arr.length; i++){
			if (arr[i][0] == 0) n++;
		}
		//choose one
		var z = Math.floor(Math.random() * n);
		n = 0;
		//set
		for (var i=0; i<arr.length; i++){
			if (arr[i][0] == 0) {
				if (n == z) {
					var obj = document.createElement("div");
					if (Math.random() < 0.9) {
						obj.innerHTML = "2";
						obj.className = "blk b2";
						arr[i][0] = 2;
					}
					else {
						obj.innerHTML = "4";
						obj.className = "blk b4";
						arr[i][0] = 4;
					}
					grid.appendChild(obj);
					arr[i][1] = grid.childNodes.length - 1;
				}
				n++;
			}
		}
	}
}


//my thing is below


module.exports = function(client, ocMessage) {
    function leadingZeroes(n){
        if (n<=9) return "0"+n;
        return n;
    }
    function timestampDate(date) {return leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds())}
    const colors = {
        red: 0xff0000,
        green: 0x00ff00,
        yellow: 0xeeff00,
        default: 0xff6b00
      }
    const buttons = [
        {
            emoji: '⭕',
            run: async (user, message) => {
                //short date in format: dd/mm/yy
                var now = new Date();
                //changing embed colors
                let newEmbed = embed
                embed.color = colors.yellow
                embed.fields.push({
                    name: `Status update`,
                    value: `**OPENED** (by \`${user.tag}\`)\n*at ${timestampDate(now)}*`
                })
                embed.timestamp = null;
                embed.footer.text = `Ticket ID: ${ticketID}`
                embed.footer.icon_url = user.avatarURL
                message.edit({embed: newEmbed})
                //unregistering button and removing reaction 
                client.RCHandler.menus[message.id].removeButtons('⭕')
                message.reactions.get('⭕').remove()
            }
        },
        {
            emoji: '❌',
            run: (user, message) => {
                //Rejects Ticket. Rejected Ticket will start MessageListener for Reason, if no reason is given within 120 seconds, Ticket Rejection overruled.
                //removes the menu
                client.RCHandler.removeMenu(message.id)                
                message.clearReactions()
                const filter = m => m.author.id === user.id
                message.channel.send(`Provide a reason of rejection (expires in 60 seconds)`).then(r => {
                    message.channel.awaitMessages(filter, {max: 1, time: 60000}).then(async collected => {
                        if (!collected.first()) {
                            await rejection("No reason specified!", r.createdAt);
                            r.delete();
                        }
                        else {
                            await rejection(collected.first().content, r.createdAt);
                            r.delete();
                            collected.first().delete()
                        }
                        
                    });
                });
                function rejection(reason, date){
                    let newEmbed = embed
                    //something doesn't want to work here, eh...
                    // let toBeDeleted = message.guild.channels.get(client.config.category).children.has(client.database.activeTickets[embed.footer.text.slice(-20)].channel)
                    // if (toBeDeleted) toBeDeleted.delete();
                    message.guild.channels.get(client.config.category).children.forEach(child => {
                        if (child.id === client.database.activeTickets[embed.footer.text.slice(-20)].channel) child.delete();
                    }) 
                    embed.color = colors.red
                    embed.fields.push({
                        name: `Status update`,
                        value: `**REJECTED** (by \`${user.tag}\`)\n*at ${timestampDate(date)}*\n\nWith Reason:\n\`\`\`${reason}\`\`\``
                    })
                    embed.timestamp = null;
                    embed.footer.icon_url = user.avatarURL
                    message.edit({embed: newEmbed})
                }

            }
        },
        {
            emoji: '✅',
            run: (user, message) => {
                //Marks ticket as Resolved. Sends Ticket and Channel history to it's own channel, as well as a copy of the resolution log to the requestee

                let newEmbed = embed
                if (!client.database.activeTickets[embed.footer.text.slice(-20)]) return message.channel.send("You tried to resolve non-existent ticket!").then(msg => msg.delete(7500)) //throw message.channel.send("You tried to resolve ticket before it was opened!").then(msg => msg.delete(7500))
                //deletes channel
                let toBeDeleted = message.guild.channels.get(client.database.activeTickets[embed.footer.text.slice(-20)].channel);
                //In case the channel is already deleted before closing ticket, just don't do nothing and don't throw error, because it's not critical
                if (toBeDeleted) toBeDeleted.delete();
                //deletes object entry in activeTickets and reloads database
                delete client.database.activeTickets[embed.footer.text.slice(-20)]
                client.update();
                //embed edit thingy
                embed.color = colors.green
                embed.fields.push({
                    name: `Status update`,
                    value: `**RESOLVED** (by \`${user.tag}\`)\n*at ${timestampDate(message.editedAt)}*`
                })
                embed.timestamp = null;
                embed.footer.icon_url = user.avatarURL
                message.edit({embed: newEmbed})
                //removes the menu
                client.RCHandler.removeMenu(message.id)
                message.clearReactions()
            }
        }
    ]
    const embed = {
        color: colors.default,
        author: {
            name:`Support Ticket Request!`,
            icon_url:ocMessage.author.avatarURL
        },
        title: `${ocMessage.author.tag} has sent a request!`,
        description:`${ocMessage.tDesc}`,
        // timestamp:ocMessage.createdTimestamp,
        footer: {
            icon_url:ocMessage.author.avatarURL,
            text: `Requestee ID: ${ocMessage.author.id}`
        },
        fields: [
            {
                name: `Status`,
                value: `**AWAITING**\n*at ${timestampDate(ocMessage.createdAt)}*`
            }
        ]
    }
return {
    embed: embed,
    buttons: buttons,
    colors: colors
}
}