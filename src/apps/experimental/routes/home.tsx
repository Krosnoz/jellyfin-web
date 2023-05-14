import React, { FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import globalize from '../../../scripts/globalize';
import LibraryMenu from '../../../scripts/libraryMenu';
import { clearBackdrop } from '../../../components/backdrop/backdrop';
import layoutManager from '../../../components/layoutManager';
import * as mainTabsManager from '../../../components/maintabsmanager';
import '../../../elements/emby-tabs/emby-tabs';
import '../../../elements/emby-button/emby-button';
import '../../../elements/emby-scroller/emby-scroller';
import Page from '../../../components/Page';
import { ShepherdTourContext } from 'react-shepherd';

type OnResumeOptions = {
    autoFocus?: boolean;
    refresh?: boolean
};

type ControllerProps = {
    onResume: (
        options: OnResumeOptions
    ) => void;
    refreshed: boolean;
    onPause: () => void;
    destroy: () => void;
};

const Home: FunctionComponent = () => {
    const [ searchParams ] = useSearchParams();
    const initialTabIndex = parseInt(searchParams.get('tab') || '0', 10);
    const tour = useContext(ShepherdTourContext);

    const tabController = useRef<ControllerProps | null>();
    const tabControllers = useMemo<ControllerProps[]>(() => [], []);
    const element = useRef<HTMLDivElement>(null);

    const setTitle = () => {
        LibraryMenu.setTitle(null);
    };

    const getTabs = () => {
        return [{
            name: globalize.translate('Home')
        }, {
            name: globalize.translate('Favorites')
        }, {
            name: globalize.translate('Requests')
        }];
    };

    const getTabContainers = () => {
        return element.current?.querySelectorAll('.tabContent');
    };

    const getTabController = useCallback((index: number) => {
        if (index == null) {
            throw new Error('index cannot be null');
        }

        let depends = '';

        switch (index) {
            case 0:
                depends = 'hometab';
                break;

            case 1:
                depends = 'favorites';
                break;

            case 2:
                depends = 'requests';
                break;
        }

        return import(/* webpackChunkName: "[request]" */ `../../../controllers/${depends}`).then(({ default: controllerFactory }) => {
            let controller = tabControllers[index];

            if (!controller) {
                const tabContent = element.current?.querySelector(".tabContent[data-index='" + index + "']");
                controller = new controllerFactory(tabContent, null);
                tabControllers[index] = controller;
            }

            return controller;
        });
    }, [ tabControllers ]);

    const onViewDestroy = useCallback(() => {
        if (tabControllers) {
            tabControllers.forEach(function (t) {
                if (t.destroy) {
                    t.destroy();
                }
            });
        }

        tabController.current = null;
    }, [ tabControllers ]);

    const loadTab = useCallback((index: number, previousIndex: number | null) => {
        if (index === 2) return;
        getTabController(index).then((controller) => {
            const refresh = !controller.refreshed;

            controller.onResume({
                autoFocus: previousIndex == null && layoutManager.tv,
                refresh: refresh
            });

            controller.refreshed = true;
            tabController.current = controller;
        }).catch(err => {
            console.error('[Home] failed to get tab controller', err);
        });
    }, [ getTabController ]);

    const onTabChange = useCallback((e: { detail: { selectedTabIndex: string; previousIndex: number | null }; }) => {
        const newIndex = parseInt(e.detail.selectedTabIndex, 10);
        const previousIndex = e.detail.previousIndex;

        const previousTabController = previousIndex == null ? null : tabControllers[previousIndex];
        if (previousTabController?.onPause) {
            previousTabController.onPause();
        }

        loadTab(newIndex, previousIndex);
    }, [ loadTab, tabControllers ]);

    const onResume = useCallback(() => {
        setTitle();
        clearBackdrop();

        const currentTabController = tabController.current;

        if (!currentTabController) {
            mainTabsManager.selectedTabIndex(initialTabIndex);
        } else if (currentTabController?.onResume) {
            currentTabController.onResume({});
        }
        (document.querySelector('.skinHeader') as HTMLDivElement).classList.add('noHomeButtonHeader');
    }, [ initialTabIndex ]);

    const onPause = useCallback(() => {
        const currentTabController = tabController.current;
        if (currentTabController?.onPause) {
            currentTabController.onPause();
        }
        (document.querySelector('.skinHeader') as HTMLDivElement).classList.remove('noHomeButtonHeader');
    }, []);

    useEffect(() => {
        const isTourStarted = localStorage.getItem('tour');
        if (tour && !isTourStarted) {
            tour.start();
            localStorage.setItem('tour', 'true');
        }
    }, [tour]);

    useEffect(() => {
        mainTabsManager.setTabs(element.current, initialTabIndex, getTabs, getTabContainers, null, onTabChange, false);

        onResume();
        return () => {
            onPause();
        };
    }, [ initialTabIndex, onPause, onResume, onTabChange, onViewDestroy ]);

    return (
        <div ref={element}>
            <Page
                id='indexPage'
                className='mainAnimatedPage homePage libraryPage allLibraryPage backdropPage pageWithAbsoluteTabs withTabs'
                isBackButtonEnabled={false}
                backDropType='movie,series,book'
            >
                <div className='tabContent pageTabContent' id='homeTab' data-index='0'>
                    <div className='sections'></div>
                </div>
                <div className='tabContent pageTabContent' id='favoritesTab' data-index='1'>
                    <div className='sections'></div>
                </div>
                <div
                    className='tabContent pageTabContent'
                    id='requestsTab'
                    data-index='2'
                />
            </Page>
        </div>
    );
};

export default Home;
