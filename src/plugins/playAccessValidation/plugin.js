import globalize from '../../scripts/globalize';
import ServerConnections from '../../components/ServerConnections';
import alert from '../../components/alert';
import { PluginType } from '../../types/plugin.ts';

function showErrorMessage() {
    let msg = globalize.translate('MessagePlayAccessRestricted');
    msg += '<br/><br/>';
    msg += '<img style="width: 100%;" src="https://i.imgur.com/4ndpDEP.png">';

    return alert(msg, 'Streaming désactivé');
}

function showErrorH265Message() {
    let msg = 'Ce film est dans un format non pris en charge par le streaming. Vous pouvez toujours télécharger le contenu en cliquant sur les trois points alignés puis téléchargement.';
    msg += '<br/><br/>';
    msg += '<img style="width: 100%;" src="https://i.imgur.com/4ndpDEP.png">';

    return alert(msg, 'Non disponible en streaming');
}

class PlayAccessValidation {
    constructor() {
        this.name = 'Playback validation';
        this.type = PluginType.PreplayIntercept;
        this.id = 'playaccessvalidation';
        this.order = -2;
    }

    intercept(options) {
        const item = options.item;
        if (!item) {
            return Promise.resolve();
        }
        const serverId = item.ServerId;
        if (!serverId) {
            return Promise.resolve();
        }

        // try {
        //     const apiClient = ServerConnections.getApiClient(serverId);
        //     return apiClient.getItem(apiClient.getCurrentUserId(), item.Id).then(itemData => {
        //         itemData.MediaSources.forEach(source => {
        //             if (source.Container === 'mp4' || source.Profile.includes('10')) return;
        //         });
        //         itemData.MediaStreams.forEach(stream => {
        //             if ((stream.Codec == 'hevc' || stream.Codec == 'h265') && !stream.ColorSpace) {
        //                 showErrorH265Message().finally(Promise.reject);
        //             }
        //         });
        //     });
        // } catch (error) {
        //     console.log(error);
        // }

        return ServerConnections.getApiClient(serverId).getCurrentUser().then(function (user) {
            if (user.Policy.EnableMediaPlayback) {
                return Promise.resolve();
            }

            // reject but don't show an error message
            if (!options.fullscreen) {
                return Promise.reject();
            }

            return showErrorMessage().finally(Promise.reject);
        });
    }
}

export default PlayAccessValidation;
