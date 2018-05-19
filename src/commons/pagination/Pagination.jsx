import React from "react";
import PropTypes from "prop-types";
import { Pagination as Page } from "antd";

import "./Pagination.less";

class Pagination extends React.PureComponent {
    static propTypes = {
        totalNum: PropTypes.number,
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        pageSizeOptions: PropTypes.array,
        handleChangePageSize: PropTypes.func,
        handleChangePage: PropTypes.func,
        requestFn: PropTypes.func,
    }
    static defaultProps = {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"]
    }

    render() {
        const {
            totalNum,
            currentPage,
            pageSize,
            pageSizeOptions,
            handleChangePageSize,
            handleChangePage,
            requestFn
        } = this.props;
        return (
            <div className="pagination__wrap">
                <Page
                    current={currentPage}
                    total={totalNum}
                    pageSize={pageSize}
                    pageSizeOptions={pageSizeOptions}
                    showSizeChanger
                    showQuickJumper
                    onChange={handleChangePage || requestFn}
                    onShowSizeChange={handleChangePageSize || requestFn}
                />
            </div>
        );
    }
}
export default Pagination;
