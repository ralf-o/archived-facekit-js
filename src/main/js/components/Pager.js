'use strict';

import Component from '../base/Component';
import PaginationHelper from '../helpers/PaginationHelper';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import PaginationInfo from './PaginationInfo';

const pagerView = (html, state, ctx) => (props, children) => {
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
            ButtonGroup({},
                showFirstButton && Button({
                    text: (showButtonTexts ? 'First' : ''),
                    icon: 'fa-angle-double-left',
                    className: 'fk-pager-button-first',
                    tooltip: (showButtonTexts ? '' : 'First'),
                    disabled: disabled || metrics.isFirstPage
                }),
                showPreviousButton && Button({
                    text: (showButtonTexts ? 'Previous' : ''),
                    icon: 'fa-angle-left',
                    className: 'fk-pager-button-previous',
                    tooltip: (showButtonTexts ? '' : 'Previous'),
                    disabled: disabled || metrics.isFirstPage
                })),
             (type !== 'randomAccess'
                            ? PaginationInfo(
                                {pageIndex: metrics.pageIndex,
                                 pageSize: metrics.pageSize,
                                 totalItemCount: metrics.totalItemCount})
                            : 'xxx')
                            ,

            ButtonGroup({},
                showNextButton && Button({
                    text: (showButtonTexts ? 'Next' : ''),
                    icon: 'fa-angle-right',
                    className: 'fk-pager-button-next',
                    tooltip: (showButtonTexts ? '' : 'Next'),
                    disabled: disabled || metrics.isLastPage
                }),
                showLastButton && Button({
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

export default Component.createClass({
    typeName: 'facekit/Pager',
    view: pagerView,
    defaultProps: pagerDefaultProps
});

/**
 *
 *
 */
// This is just a fake class definition for ESDoc.
class Pager  {
}
