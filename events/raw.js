module.exports = async event => {
    let handledEvents = {
        MESSAGE_UPDATE: 'messageUpdate',
        // MESSAGE_DELETE: 'messageDelete'
    }
    if (!handledEvents.hasOwnProperty(event.t)) return;
    const {d: data} = event;
    if (event.t == 'MESSAGE_UPDATE'){
        let channel = client.channels.cache.get(data.channel_id); //as long as DMs are ignored in main message event handler those are going to be unhandled here as well
        if (channel.type == 'dm' || channel.messages.cache.has(data.id)) return; //ignore DM channels and don't re-emit when message is already cached

        let newMessage = await channel.messages.fetch(data.id);
        client.emit(handledEvents[event.t], data, newMessage);
    }
    // if (event.t === 'MESSAGE_DELETE'){
    //     let channel = client.channels.get(data.channel_id);
    //     if (!channel) return; //getting rid of DMs(?)
    //     if (channel.messages.has(data.id)) return; //don't re-emit when message was already cached

    //     data.channel = channel;
    //     client.emit(handledEvents[event.t], data);
    // }
}