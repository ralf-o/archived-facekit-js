'use strict';

const
    $uiSwitchers = $('#main-navigation').find('li'),
    contentContainer = $('#content').get(0),
    Component = facekit.base.Component,
    d = facekit.base.DOMBuilder.DEKU,
    dek = facekit.deku,
    react = facekit.react,
    dekuDemo = getDekuDemo();

Component.mount(dekuDemo, contentContainer);
facekit.base.Component.registerWebComponent(dekuDemo, 'fk-demo');

$uiSwitchers.each((idx, elem) => {
        const
            $elem = $(elem),
            name = $elem.find('a').attr('name');

        $elem.on('click', function (evt) {
            $uiSwitchers.removeClass('active');
            $(this).addClass('active');
            Component.unmount(contentContainer);

            switch (name) {
                case 'deku':
                    Component.mount(getDekuDemo(), contentContainer);
                    break;

                case 'react':
                    Component.mount(getReactDemo(), contentContainer);
                    break;

                 case 'web-components':
                    $(contentContainer)
                        .empty()
                        .append('<fk-demo/>');
                    break;

                case 'angular':
                    break;
            }

            evt.preventDefault();
        });
    });

function getDekuDemo() {
    return (
        dek.tabs(
            {activeTab: 0},
            dek.tab(
                {caption: 'Buttons'},
                demo.deku.demoOfButtons()
            ),
            dek.tab(
                {caption: 'Button Groups'},
                demo.deku.demoOfButtonGroups()
            ),
            dek.tab(
                {caption: 'Pagination'},
                demo.deku.demoOfPagination()
            ),
            dek.tab(
                {caption: 'Tabs'},
                demo.deku.demoOfTabs()
            ),
            dek.tab(
                {caption: 'Counter'},
                demo.deku.demoOfCounter()
            )
        )
    );
}

function getReactDemo() {
    return (
        <react.Tabs>
            <react.Tab caption="Buttons">
                <demo.react.DemoOfButtons/>
            </react.Tab>
            <react.Tab caption="Button Groups">
                <demo.react.DemoOfButtonGroups/>
            </react.Tab>
            <react.Tab caption="Pagination">
                <demo.react.DemoOfPagination/>
            </react.Tab>
            <react.Tab caption="Tabs">
               <demo.react.DemoOfTabs/>
            </react.Tab>
            <react.Tab caption="Counter">
               <demo.react.DemoOfCounter/>
            </react.Tab>
        </react.Tabs>
     );
}