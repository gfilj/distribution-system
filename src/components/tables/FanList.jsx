/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import {Table, Icon} from 'antd';
import { Row, Col, Card } from 'antd';
import SelectTable from './SelectTable';
import SortTable from './SortTable';
import SearchTable from './SearchTable';
import BreadcrumbCustom from '../BreadcrumbCustom';

const columns = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
}, {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
}, {
    title: 'openid',
    dataIndex: 'openid',
    key: 'openid',
},  {
    title: '性别',
    dataIndex: 'sex_str',
    key: 'sex_str',
},  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
},  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
},  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
}, {
    title: '关注时间',
    dataIndex: 'subscribe_time_str',
    key: 'subscribe_time_str',
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

const tableDate = {
    resultcode: 200,
    msg: "获取用户列表成功！",
    data: [
        {
            subscribe: 0,
            openid: "o2FwHuPY0t0SreBFgoePtK5h3GP0",
            nickname: "陆长青",
            sex: 1,
            language: null,
            city: "海淀",
            province: "北京",
            country: "中国",
            headimgurl: null,
            subscribe_time: 1509116638000,
            remark: null,
            id: 1,
            sex_str: "男",
            subscribe_time_str: "2017-10-27 23:03:58"
        },
        {
            subscribe: 0,
            openid: "o2FwHuPY0t0SreBFgoePtK5h3GPU",
            nickname: "陆长青",
            sex: 1,
            language: null,
            city: "海淀",
            province: "北京",
            country: "中国",
            headimgurl: null,
            subscribe_time: 1508943838000,
            remark: null,
            id: 2,
            sex_str: "男",
            subscribe_time_str: "2017-10-25 23:03:58"
        },
        {
            subscribe: 0,
            openid: "o2FwHuPY0t0SreBFgoePtK5hwG4U",
            nickname: "陆长青",
            sex: 1,
            language: null,
            city: "海淀",
            province: "北京",
            country: "中国",
            headimgurl: null,
            subscribe_time: 1508771038000,
            remark: null,
            id: 3,
            sex_str: "男",
            subscribe_time_str: "2017-10-23 23:03:58"
        },
        {
            subscribe: 0,
            openid: "o2FwHuPY0t0SreBFgoePtK5hwGP3",
            nickname: "陆长青",
            sex: 1,
            language: null,
            city: "海淀",
            province: "北京",
            country: "中国",
            headimgurl: null,
            subscribe_time: 1508684638000,
            remark: null,
            id: 4,
            sex_str: "男",
            subscribe_time_str: "2017-10-22 23:03:58"
        },
        {
            subscribe: 0,
            openid: "o2FwHuPY0t0SreBFgoePtK5hwGPU",
            nickname: "陆长青",
            sex: 1,
            language: null,
            city: "海淀",
            province: "北京",
            country: "中国",
            headimgurl: null,
            subscribe_time: 1508598238000,
            remark: null,
            id: 5,
            sex_str: "男",
            subscribe_time_str: "2017-10-21 23:03:58"
        }
    ]
}

const FanTable = () => (
    <Table columns={columns} dataSource={tableDate.data}/>
);


const FanList = () => (
    <div className="gutter-example">
        <BreadcrumbCustom first="表格" second="粉丝清单" />
        <Row gutter={16}>
            <Col className="gutter-row" md={24}>
                <div className="gutter-box">
                    <Card title="基础表格" bordered={false}>
                        <FanTable />
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

export default FanList;