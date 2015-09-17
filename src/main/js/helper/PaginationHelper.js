'use strict';

class PaginationHelper {
    static calcPaginationMetrics(pageIndex, pageSize, totalItemCount) {
        const ret = {};

        ret.pageIndex = isNaN(pageIndex) ? -1 : Math.max(-1, parseInt(pageIndex, 10));

        ret.pageSize = isNaN(pageSize)
                ? (pageSize === null || pageSize === Infinity ? Infinity : -1)
                : Math.floor(pageSize);

        if (ret.pageSize <= 0) {
            ret.pageSize = -1;
        }

        ret.totalItemCount = isNaN(totalItemCount) ? -1 : Math.max(-1, parseInt(totalItemCount, 10));

        ret.pageCount = (ret.totalItemCount == -1 || ret.pageSize == -1)
                ? -1
                : Math.ceil(ret.totalItemCount / ret.pageSize);

        ret.isFirstPage = ret.pageIndex === 0;

        ret.isLastPage = ret.pageCount > 0 && ret.pageCount === ret.pageIndex + 1;

        return ret;
    }
}