'use strict';

import Component from '../base/Component';
import PaginationHelper from '../helpers/PaginationHelper';
import buttonGroup from './buttonGroup';
import button from './button';
import paginationInfo from './paginationInfo';

const pagerView = (html, ctrl) => (props, children, state, ctx) => {
    const
        metrics = PaginationHelper.calcPaginationMetrics(
            props.get('pageIndex'),
            props.get('pageSize'),
            props.get('totalItemCount')
        ),
        type = props.get('type'),
        disabled = !!props.get('disabled'),
        showFirstButton = !!props.get('showFirstButton'),
        showNextButton = !!props.get('showNextButton'),
        showPreviousButton = !!props.get('showPreviousButton'),
        showLastButton =  !!props.get('showLastButton'),
        showButtonTexts = !!props.get('showButtonTexts');

    return (
        html.div(
            {className: 'fk-pager'},
            buttonGroup({},
                showFirstButton && button({
                    text: (showButtonTexts ? 'First' : ''),
                    icon: 'fa-angle-double-left',
                    className: 'fk-pager-button-first',
                    tooltip: (showButtonTexts ? '' : 'First'),
                    disabled: disabled || metrics.isFirstPage
                }),
                showPreviousButton && button({
                    text: (showButtonTexts ? 'Previous' : ''),
                    icon: 'fa-angle-left',
                    className: 'fk-pager-button-previous',
                    tooltip: (showButtonTexts ? '' : 'Previous'),
                    disabled: disabled || metrics.isFirstPage
                })),
             (type !== 'randomAccess'
                            ? paginationInfo(
                                {pageIndex: metrics.pageIndex,
                                 pageSize: metrics.pageSize,
                                 totalItemCount: metrics.totalItemCount})
                            : 'xxx')
                            ,

            buttonGroup({},
                showNextButton && button({
                    text: (showButtonTexts ? 'Next' : ''),
                    icon: 'fa-angle-right',
                    className: 'fk-pager-button-next',
                    tooltip: (showButtonTexts ? '' : 'Next'),
                    disabled: disabled || metrics.isLastPage
                }),
                showLastButton && button({
                    text: (showButtonTexts ? 'Last' : ''),
                    icon: 'fa-angle-double-right',
                    className: 'fk-pager-button-last',
                    tooltip: (showButtonTexts ? '' : 'Last'),
                    disabled: disabled || metrics.isLastPage
                }))
        )
    );
};

const pagerDefaultProps = {
    showFirstButton: true,
    showNextButton: true,
    showPreviousButton: true,
    showLastButton: true
}

export default Component.createFactory({
    typeName: 'facekit/Pager',
    view: pagerView,
    defaultProps: pagerDefaultProps
});
