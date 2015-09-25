'use strict';

import Component from '../base/Component';

export class PaginationInfo extends React.Component {
    componentDidMount() {
        jQuery(React.findDOMNode(this)).find('.fk-with-tooltip').tooltip({placement: 'auto', delay: 400});
    }

    componentWillUnmount() {
        jQuery(React.findDOMNode(this)).find(".fk-with-tooltip").tooltip('destroy');
    }

    render() {
        const metrics = PaginationHelper.calcPaginationMetrics(
                this.props.pageIndex,
                this.props.pageSize,
                this.props.totalItemCount);

        return (
            <div className="fk-pagination-info">
                {this.props.type !== 'infoAboutItems'
                       ? this._getPageInfo(metrics)
                       : this._getItemsInfo(metrics)}
            </div>
        );
    }

    _getPageInfo(metrics) {
        return 'Page ' + (metrics.pageIndex + 1) + (metrics.pageCount >= 0 ? ' of ' + metrics.pageCount : '');
    }

    _getItemsInfo(metrics) {
        const firstItemIndex = metrics.pageIndex !== -1 && metrics.pageCount !== -1
                    ? metrics.pageIndex * metrics.pageSize
                    : -1,
              lastItemIndex = firstItemIndex !== -1 && metrics.totalItemCount !== -1
                    ? Math.min(metrics.totalItemCount - 1, firstItemIndex + metrics.pageSize - 1)
                    : -1;

        return (firstItemIndex + 1) + ' - ' + (lastItemIndex + 1) + ' of ' + metrics.totalItemCount;
    }
}

PaginationInfo.defaultProps = {
    type: 'infoAboutPage',
    pageIndex: -1,
    pageSize: -1,
    totalItemCount: -1
};

PaginationInfo.propTypes = {
    type: React.PropTypes.oneOf(['infoAboutPage', 'infoAboutItems']),
    pageIndex: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    totalItemCount: React.PropTypes.number
};
