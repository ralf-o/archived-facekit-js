'use strict';

const pagerView = (state, props, ctx, send) => {
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
        <div className="fk-pager">
            <ButtonGroup>
                 {showFirstButton &&
                    <Button
                        text={showButtonTexts ? 'First' : ''}
                        icon=" fa-angle-double-left"
                        className="fk-pager-button-first"
                        tooltip={showButtonTexts ? '' : 'First'}
                        disabled={disabled || metrics.isFirstPage}
                    />
                 }

                {showNextButton &&
                    <Button
                         text={showButtonTexts ? 'Previous' : ''}
                         icon=" fa-angle-left"
                         className="fk-pager-button-previous"
                         tooltip={showButtonTexts ? '' : 'Previous'}
                         disabled={disabled || metrics.isFirstPage}
                     />
                 }
            </ButtonGroup>

            {type !== 'randomAccess'
                ? <PaginationInfo pageIndex={metrics.pageIndex} pageSize={metrics.pageSize} totalItemCount={metrics.totalItemCount} />
                : 'xxx'}

            <ButtonGroup>
                {showNextButton &&
                    <Button
                        text={showButtonTexts ? 'Next' : ''}
                        icon=" fa-angle-right"
                        iconInfo="right"
                        className="fk-pager-button-next"
                        tooltip={showButtonTexts ? '' : 'Next'}
                        disabled={disabled || metrics.isLastPage}
                    />
                }

                {showLastButton &&
                    <Button
                        text={showButtonTexts ? 'Last' : ''}
                        icon=" fa-angle-double-right"
                        iconInfo="right"
                        className="fk-pager-button-last"
                        tooltip={showButtonTexts ? '' : 'Last'}
                        disabled={disabled || metrics.isLastPage || metrics.pageCount === -1}
                    />
                }
            </ButtonGroup>
        </div>
    );
};

const pagerDefaultProps = {
    showFirstButton: true,
    showNextButton: true,
    showPreviousButton: true,
    showLastButton: true
}

var Pager = Component.createClass({
        typeName: 'facekit/Pager',
        view: pagerView,
        defaultProps: pagerDefaultProps
    });

Pager = Component.toReact(Pager);