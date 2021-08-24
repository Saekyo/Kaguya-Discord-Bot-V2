module.exports = ( client ) => {

    client.api.applications( client.user.id ).commands.post({ data: {
        name        : "ping",
        description : "Check Bot Latency",
    }});

};