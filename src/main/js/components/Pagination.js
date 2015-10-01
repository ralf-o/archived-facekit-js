'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';
import PaginationHelper from '../helpers/PaginationHelper';
import {button} from '../components/Button';

const {Objects, Strings, Arrays, Seq, Reader} = mojo;

const paginationView = {
    initView: domElem => {
    },
    renderView: html => props => {
        const
            pageIndex = props.get('pageIndex'),
            metrics = PaginationHelper.calcPaginationMetrics(
                        props.get('pageIndex'),
                        props.get('pageSize'),
                        props.get('totalItemCount')
                    ),
            paginationInfo = PaginationHelper.determineVisiblePaginationButtons(
                    props.get('pageIndex'),
                    metrics.pageCount,
                    6),
            classNameOuter = ComponentHelper.buildCssClass('fk-pagination', props.get('className')),
            classNameInner = 'pagination';




        const buttons = Seq.range(paginationInfo.firstButtonIndex , paginationInfo.lastButtonIndex + 1)
                .map(index =>buildAnchorListItem(html, index + 1, index === pageIndex, props));

        return (
            html.div(
                {className: classNameOuter},
                html.ul(
                    {className: classNameInner},
                    (metrics.pageCount > 0 ? buildAnchorListItem(html, 1, pageIndex === 0, props) : null),
                    (paginationInfo.firstButtonIndex > 1 ? buildAnchorListItem(html, '...', false, props) : null),
                    buttons,
                    (paginationInfo.lastButtonIndex < metrics.pageCount - 2 ? buildAnchorListItem(html, '...', false, props) : null),
                    (metrics.pageCount > 0 ? buildAnchorListItem(html, metrics.pageCount, pageIndex === metrics.pageCount - 1, props) : null)
                )
            )
        );
    }
};

function buildAnchorListItem(html, text, isActive, props) {
    return html.li(
        {className: isActive ? 'active' : ''},
        html.a({}, text)
    );
}


export const Pagination = Component.createClass({
    typeName: 'facekit/Pagination',
    view: paginationView,
    defaultProps: {
       showFirstButton: true,
       showNextButton: true,
       showPreviousButton: true,
       showLastButton: true,
       onChange: evt => {}
    }
});

export default Pagination;
export const pagination = Pagination.createElement;


