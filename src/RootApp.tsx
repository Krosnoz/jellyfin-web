import loadable from '@loadable/component';
import { History } from '@remix-run/router';
import React from 'react';
import { ShepherdOptionsWithType, ShepherdTour } from 'react-shepherd';

import StableApp from './apps/stable/App';
import { HistoryRouter } from './components/router/HistoryRouter';
import { ApiProvider } from './hooks/useApi';
import { WebConfigProvider } from './hooks/useWebConfig';

const ExperimentalApp = loadable(() => import('./apps/experimental/App'));

const tourOptions = {
    defaultStepOptions: {
        classes: 'shepherd-theme-krostyle',
        cancelIcon: {
            enabled: false
        }
    },
    useModalOverlay: true
};

const allSteps: ShepherdOptionsWithType[] = [
    {
        id: 'welcome',
        title: 'Bienvenue sur KrosMovie !',
        text: [
            `
          <img class="shepherd-intro-img" src="assets/img/dab.jpg" alt="Krosnoz" />
          <p>
          Vous allez découvrir les fonctionnalités de l'application.
          </p>
          `
        ],
        attachTo: { element: '.emby-tabs-slider', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'next',
                classes: 'shepherd-button-next',
                text: 'Suivant'
            }
        ]
    },
    {
        id: 'chromecast',
        text: [
            `
          <p>
          Vous pouvez utiliser KrosMovie sur votre télévision en utilisant le bouton Chromecast.
          </p>
          `
        ],
        attachTo: { element: '.headerCastButton ', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'back',
                classes: 'shepherd-button-next',
                text: 'Retour'
            },
            {
                type: 'next',
                classes: 'shepherd-button-next',
                text: 'Suivant'
            }
        ]
    },
    {
        id: 'search',
        text: [
            `
          <p>
          Vous pouvez rechercher des films, séries, acteurs, etc...
          </p>
          `
        ],
        attachTo: { element: '.headerSearchButton  ', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'back',
                classes: 'shepherd-button-next',
                text: 'Retour'
            },
            {
                type: 'next',
                classes: 'shepherd-button-next',
                text: 'Suivant'
            }
        ]
    },
    {
        id: 'chat',
        text: [
            `
          <p>
          Vous pouvez discuter avec les autres utilisateurs ou me communiquer des problèmes, suggestions, etc...
          </p>
          `
        ],
        attachTo: { element: '.headerWatchPartyButton   ', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'back',
                classes: 'shepherd-button-next',
                text: 'Retour'
            },
            {
                type: 'next',
                classes: 'shepherd-button-next',
                text: 'Suivant'
            }
        ]
    },
    {
        id: 'requests',
        text: [
            `
          <p>
          Et vous pouvez demander des films ou séries à ajouter à la bibliothèque.
          <br></br>
          Si vous utilisez le compte Guest, remplissez juste le nom d'utilisateur avec Guest, pas besoin de mot de passe.
          <br></br>
          Bon visionnage !
          </p>
          `
        ],
        attachTo: { element: '.requests   ', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'back',
                classes: 'shepherd-button-next',
                text: 'Retour'
            },
            {
                type: 'cancel',
                classes: 'shepherd-button-next',
                text: 'Finir'
            }
        ]
    }
];

const RootApp = ({ history }: { history: History }) => {
    const layoutMode = localStorage.getItem('layout');

    return (
        <ShepherdTour steps={allSteps} tourOptions={tourOptions}>
            <ApiProvider>
                <WebConfigProvider>
                    <HistoryRouter history={history}>
                        {layoutMode === 'experimental' ? (
                            <ExperimentalApp />
                        ) : (
                            <StableApp />
                        )}
                    </HistoryRouter>
                </WebConfigProvider>
            </ApiProvider>
        </ShepherdTour>
    );
};

export default RootApp;
