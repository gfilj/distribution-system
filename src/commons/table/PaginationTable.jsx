import React from "react";
import PropTypes from "prop-types";
import Pagination from "../pagination/Pagination"
import {
    Table,
    // Input,
    // Button,
    // Modal,
    // Radio,
    // Spin
} from "antd";
import ajaxHoc from "../../axios/ajaxHoc.jsx";
import {
    // selectDateScope,
    Global
    // createWorkSpaceCutomConifg,
    // createVideoCkWorkSpaceConifg,
    // createVideoWorkSpaceConifg,
    // createLogContentAuditArticleConfig,
    // reasonSplit,
    // auditStatusOmck,
} from "../../components/auth/AuthCenter.jsx";
const STR = '被调用，this指向：';
class PaginationTable extends React.PureComponent {
    //参数校验
    static propTypes = {
        // 导出日志url
        exportLogUrl: PropTypes.string,
        // 导出工作日志url
        exportWorkLogUrl: PropTypes.string,
        // 查询日志url
        requestDetailUrl: PropTypes.string,
        // 获取审核人信息url，是否显示审核人过滤器的判断条件
        getUserStaticUrl: PropTypes.string,
        // 提交更改状态url
        changeUserStatusUrl: PropTypes.string,
        // 图文上半部配置enum，包含文本和ajax对应字段
        headerStatusEnum: PropTypes.arrayOf(PropTypes.shape({
            urlKey: PropTypes.string,
            text: PropTypes.string,
        })),
        // 错误等级配置,是否显示更改状态组件中的错误等级的判断条件
        errorLevelEnum: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            text: PropTypes.string,
        })),
        // 错误类型
        errorTypeEnum: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            text: PropTypes.string,
        })),
        // 文章状态
        statusEnum: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            text: PropTypes.string,
        })).isRequired,
        // 抽检文章状态
        auditStatusEnum: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            text: PropTypes.string,
        })),
        // 视频关键词切换组件配置列表，是否为空决定是否显示组件
        videoKeyWordsFtEnum: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOf(["keywords", "id"]),
            text: PropTypes.oneOf(["关键字", "id"]),
        })),
        // 大标题
        titleName: PropTypes.string,
        // 是否显示时间范围控件（今天，一周，一月）
        isShowTimeScopeFt: PropTypes.bool,
        // 是否显示图文分类控件（今天，一周，一月）
        isShowCategoryFt: PropTypes.bool,
        // 是否显示图文关键字控件
        isShowTitleFt: PropTypes.bool,
        // 表格中改变状态组件是否显示错误自定义选项
        isShowChangeModalErrorCustomType: PropTypes.bool,
        // 表格中改变状态组件是否显示改变状态分组
        isShowChangeModalStatusGroup: PropTypes.bool,
        // 创建列表函数
        createColumns: PropTypes.func,
        // 审核人过滤器的label信息
        statusFtLabel: PropTypes.string,
        // 时间控件校验范围
        dateRangeScope: PropTypes.number,

        // 标记是视频还是文章，不是好的写法，业务逻辑应该都放在父类，
        // 本组件初始设计只负责渲染，算了
        type: PropTypes.oneOf(["video", "article"]),
        _auth: PropTypes.array,
        _url: PropTypes.object,
        // 是否抽检
        isCheck: PropTypes.bool,
        // 是否有抽检不能更改限制
        canRowClickChange: PropTypes.bool,
    }
    //参数默认值
    static defaultProps = {
        exportWorkLogUrl: "",
        getUserStaticUrl: "",
        headerStatusEnum: [],
        errorLevelEnum: [],
        errorTypeEnum: [],
        statusEnum: [],
        auditStatusEnum: [],
        videoKeyWordsFtEnum: [],
        titleName: "",
        isShowTimeScopeFt: false,
        isShowCategoryFt: false,
        isShowTitleFt: false,
        isShowChangeModalErrorCustomType: false,
        isShowChangeModalStatusGroup: true,
        statusFtLabel: "审核状态：",
        dateRangeScope: 7 * 24 * 60 * 60 * 1000,
        getDetailUrl: "",
        isCheck: false,
        canRowClickChange: false,
    }

    //构造函数
    constructor(props) {
        super(props);
        // 生成表格列配置
        this.columns = this.initColumns();
        this.state = this.initState();
        this.log = false;
        this.detail_status = true
    }
    // 生成列配置
    initColumns = () => {
        const {
            createColumns,
        } = this.props;
        return createColumns();
    }
    initState = () => {
        return {
            // 日志列表
            list: [],
            // 是否正在执行搜索日志
            isSearching: false,
            // 每页多少条
            pageSize: 20,
            // 当前页数
            currentPage: 1,
            // 总共请求数量
            totalNum: 0,
            // 是否在加载文章
            isLoadingArticle: false,
            // 当前docid
            currentDocId: "",
            // 是否显示详细页
            isShowDetail: false,
            article: {},
        }
    }

    //组建加载完毕后立即执行
    componentDidMount = () => {
        // if (location.hash) {
        //     const id = location.hash.slice(1).replace("&", "/");
        //     // this.requestDetail(id)
        //     console.log(id);
        //     this.log = true;
        // }
        // else {
        this.handleSubmitSearch();
        // }
    }
    // 执行查询
    handleSubmitSearch = () =>{
        const {
            pageSize,
            currentPage
        } = this.state;
        console.log("执行查询 handleSubmitSearch");
        this.requestLog(currentPage, pageSize);
    }

    //按照docid请求默认值
    requestDetail = (docid) => {
        // const {
        //     type
        // } = this.props;
        // if (!isEmpty(docid) && type === "article") {
        //     const getDetailUrl = this.props._url.getWorkSpaceDetail[0];
        const getDetailUrl = this.props._url.listUrl;

        this.setState({
            isShowDetail: true,
            isLoadingArticle: true,
        })
        ajaxHoc.ajaxRequest({
            url: getDetailUrl,
            data: {
                docid: docid
            },
        }, (ajaxData) => {
            this.setState({
                article: ajaxData,
                isLoadingArticle: false,
                currentDocId: docid,
            })
        }, () => {
            this.detail_status = false;
            this.setState({
                isLoadingArticle: false
            })
        })
        // if (!isEmpty(docid) && type === "video") {
        this.setState({
            isShowDetail: true,
            currentDocId: docid,
        })
        // }
    }
    //查询日志
    requestLog =(currentPage, pageSize) => {
        const that = this;
        console.log("执行查询 requestLog:" + currentPage + ",pageSize:" + pageSize);
        console.log(`render ${STR}`,this);
        this.setState({
            isSearching: true
        }, () => {
            const data = {
                size: pageSize,
                offset: (currentPage - 1) * pageSize,
            };
            // const target = this.createRequestArgs();
            const {listUrl} = this.props._url;
            ajaxHoc.ajaxRequest({
                url: listUrl,
                data: data,
            }, (dataReceive) => {
                that.setState({
                    isSearching: false,
                    pageSize,
                    currentPage,
                    list: dataReceive.list,
                    totalNum: dataReceive.total
                })
            }, (e) => {
                that.setState({
                    isSearching: false
                })
                console.error(e);
            })
        })
    }

    //生成请求参数
    createRequestArgs = () =>{
        // const {
        //     lmodifyGE,
        //     lmodifyLE,
        //     userid,
        //     status,
        //     title,
        //     category,
        //     keyWords,
        //     keyWordsType,
        // } = this.args;
        const {
            getUserStaticUrl,
            type,
        } = this.props;
        let target = {
            // lmodifyLE,
            // lmodifyGE,
            status,
        };
        console.log(Global);
        console.log(getUserStaticUrl);
        // let uid = !getUserStaticUrl ? Global.userInfo.userId : userid;
        if (type === "article") {
            target.category = "";
            target.title = "";
        } else {
            // if ("" === "keywords") {
            target.keywords = "";
            // } else {
            target.docid = "";
            // }
        }
        // target.userid = uid;
        return target;
    }

    //错误捕捉
    componentDidCatch=(err, info) =>{
        console.log(err);
        console.log(info);
    }


    //点击标题
    handleClickTitle = (row) => {
        console.log(row)
        // this.requestDetail(row.docid)
    }
    render() {

        const {
            list,
            isSearching,
            totalNum,
            pageSize,
            currentPage,
        } = this.state;

        return (
            <div>
                <Table
                    loading={isSearching}
                    columns={this.columns}
                    dataSource={list}
                    pagination={false}
                    rowKey="id"
                />
                <Pagination
                    totalNum={totalNum}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    requestFn={this.requestLog}
                />
            </div>
        );
    }
}

export default PaginationTable;

