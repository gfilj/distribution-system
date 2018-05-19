import React from 'react';
import {Row, Col, Card} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import FixedPaginationTable from '../../commons/table/FixedPaginationTable';
import ImgForm from "../forms/ImgForm";





class OrderList extends React.Component {
    _url = {
        listUrl: '/distribution/order/list'
    }
    createColumns = (operationFunc) => {
        let columns = [
            {
                title: '订单号',
                dataIndex: 'no',
                key: 'no',
                width: 120,
                editable: true,
            }, {
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
                width: 80,
                editable: true
            }, {
                title: '电话号码',
                dataIndex: 'tel',
                key: 'tel',
                width: 120,
                editable: true
            }, {
                title: '送货地址',
                dataIndex: 'address',
                key: 'address',
                width: 600,
                editable: true
            }, {
                title: '商品名称',
                dataIndex: 'productname',
                key: 'productname',
                width: 500,
                editable: true
            }, {
                title: '商品编号',
                dataIndex: 'productnumber',
                key: 'productnumber',
                width: 150,
                editable: true
            }, {
                title: '京东名称',
                dataIndex: 'jingdname',
                key: 'jingdname',
                width: 200,
                editable: true
            },  {
                title: '下单时间',
                dataIndex: 'submitOrderTime',
                key: 'submitOrderTime',
                width: 180,
            }, {
                title: '付款时间',
                dataIndex: 'paySuccessTime',
                key: 'paySuccessTime',
                width: 180,
            }, {
                title: '用户备注',
                dataIndex: 'mark',
                key: 'mark',
                width: 700,
                editable: true
            },{
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                render: operationFunc,
                fixed: 'right',
            }

// , {
//     title: 'Action',
//     key: 'action',
//     render: (text, record) => (
//         <span>
//           <a>Action 一 {record.name}</a>
//           <span className="ant-divider"/>
//           <a>Delete</a>
//           <span className="ant-divider"/>
//           <a className="ant-dropdown-link">
//             More actions <Icon type="down"/>
//           </a>
//         </span>
//     ),
// }
        ];
        return columns;
    };
    request() {

    }

    componentDidMount() {

    }

    render() {
        const pageSizeOptions = ["5"];
        const pageSize = 5;
        return (

            <div className="gutter-example">
                <BreadcrumbCustom first="清单" second="订单清单"/>
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <ImgForm
                                loginUrl='/distribution/order/qrcode'
                                text="导入京东订单"
                            />
                            <Card title="订单清单" bordered={false}>
                                <FixedPaginationTable
                                    // exportLogUrl={exportUserLog[0]}
                                    // exportWorkLogUrl={exportUserWorkCount[0]}
                                    // getUserLogUrl={getUserLog[0]}
                                    // getUserStaticUrl={getEachUserAuditDetail[0]}
                                    // changeUserStatusUrl={changeUserStatus[0]}
                                    // headerStatusEnum={this.headerStatusEnum}
                                    // errorLevelEnum={errInfoLevelEnum}
                                    // errorTypeEnum={errInfoTypeEnum}
                                    // statusEnum={this.statusEnum}
                                    // titleName={_auth[0].name}
                                    createColumns={this.createColumns}
                                    // isShowChangeModalErrorCustomType={false}
                                    // isShowTimeScopeFt={true}
                                    // isShowCategoryFt={true}
                                    // isShowTitleFt={true}
                                    // type={"article"}
                                    _url={this._url}
                                    pageSize={pageSize}
                                    pageSizeOptions={pageSizeOptions}
                                    sc
                                    // _auth={_auth}
                                    // canRowClickChange={true}
                                />
                            </Card>
                        </div>
                    </Col>

                    {/*<Col className="gutter-row" span={10}>*/}
                    {/*<div className="gutter-box">*/}
                    {/*<Card title="弹层表单" bordered={false}>*/}
                    {/*</Card>*/}
                    {/*</div>*/}
                    {/*</Col>*/}
                </Row>
            </div>
        );
    }
}


export default OrderList;