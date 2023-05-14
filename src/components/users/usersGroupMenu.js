import loading from '../loading/loading';

function emptyCallback() {
    // avoid console logs about uncaught promises
}

export function show(button, sessions) {
    loading.show();

    if (sessions) {
        const menuItems = sessions.map(function (t) {
            return {
                name: t.UserName,
                id: t.UserId
            };
        });

        import('../actionSheet/actionSheet').then((actionsheet) => {
            loading.hide();

            const menuOptions = {
                title: 'Utilisateurs actifs',
                items: menuItems,
                positionTo: button,

                resolveOnClick: true,
                border: true
            };

            if (sessions.length <= 0) {
                menuOptions.text = '0 utilisateurs connecté.';
            }

            actionsheet.show(menuOptions).then(function (i) {
                console.log(i);
            }, emptyCallback);
        });
    }
}
export default {
    show: show
};
