import ServerConnections from '../../components/ServerConnections';

class JellyParty {
    constructor() {
        this.name = 'Jelly Party';
        this.type = 'chatparty';
        this.id = 'jellyparty';
    }

    show() {
        const apiClient = ServerConnections.currentApiClient();
        console.log(apiClient.getUsers());
    }
}

export default JellyParty;
