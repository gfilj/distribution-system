/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import Pagination from "../pagination/Pagination";
import {Table, Input, InputNumber, Popconfirm, Form} from "antd";
import ajaxHoc from "../../axios/ajaxHoc.jsx";
import {isNullObject} from "../../axios/utils.js"
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

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableRow extends React.Component {
    static propTypes = {
        form: PropTypes.object,
        index: PropTypes.number
    }

    render() {
        const {
            form,
        } = this.props;
        return (
            <EditableContext.Provider value={form}>
                <tr {...this.props} />
            </EditableContext.Provider>
        );

    }
}


const EditableFormRow = Form.create()(EditableRow);




class EditableCell extends React.Component {
    //参数校验
    static propTypes = {
        inputType: PropTypes.string,
        editing: PropTypes.bool,
        dataIndex: PropTypes.string,
        title: PropTypes.string,
        restProps: PropTypes.array,
        record: PropTypes.object,
    }
    getInput = (inputType) => {
        if (inputType === 'number') {
            return <InputNumber size="small"/>;
        }
        return <Input size="small"/>;
    };
    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            // index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {
                        // getFieldsValue,
                        getFieldDecorator} = form;
                    //console.log("获取输入值" + JSON.stringify(getFieldsValue()));
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [
                                            {
                                                required: true,
                                                message: `Please Input ${title}!`,
                                            },
                                        ],
                                        initialValue: record[dataIndex],
                                    })(this.getInput(inputType))}
                                </FormItem>
                            ) : (
                                restProps.children
                            )}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class FixedPaginationTable extends React.PureComponent {
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
        pageSizeOptions: PropTypes.array,
        pageSize: PropTypes.number
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
        pageSizeOptions: ["10", "20", "30", "40"],
        pageSize: 20
    }

    //构造函数
    constructor(props) {
        super(props);
        // 生成表格列配置
        this.columns = this.initColumns();
        this.state = this.initState();
        this.log = false;
        this.detail_status = true,
        this.editingRow={}
    }

    // 生成列配置
    initColumns = () => {
        const {
            createColumns,
        } = this.props;
        return createColumns(this.renderOperation);
    }
    initState = () => {
        const {
            pageSize
        } = this.props;
        return {

            editingKey: '',
            // 日志列表
            list: [],
            // 是否正在执行搜索日志
            isSearching: false,
            // 每页多少条
            pageSize: pageSize,
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
    handleSubmitSearch = () => {
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
    requestLog = (currentPage, pageSize) => {
        const that = this;
        console.log("执行查询 requestLog:" + currentPage + ",pageSize:" + pageSize);
        console.log(`render ${STR}`, this);
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
    createRequestArgs = () => {
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
    componentDidCatch = (err, info) => {
        console.log(err);
        console.log(info);
    }


    //点击标题
    handleClickTitle = (row) => {
        console.log(row)
        // this.requestDetail(row.docid)
    }

    renderOperation = (text, record) => {
        const that = this;
        const editable = this.isEditing(record);
        return (
            <div>
                {editable ? (
                    <span>
                  <EditableContext.Consumer>
                      {(form) => {
                          const {
                          getFieldsValue} = form;
                          const data = getFieldsValue();
                          if(!isNullObject(data)){
                              console.log("获取输入值:" + JSON.stringify(data));
                              that.editrow=data
                          }

                          return (
                              <a
                                  href="javascript:;"
                                  onClick={() => this.save(form, record.key,)}
                              >
                                  保存
                              </a>
                          );

                      }}

                  </EditableContext.Consumer>
                  <Popconfirm
                      title="确定取消么？"
                      onConfirm={() => this.cancel(record.key)}
                      cancelText="取消"
                      okText="确认"
                  >&nbsp;<a>取消</a>
                  </Popconfirm>
                    </span>
                ) : (
                    <a onClick={() => this.edit(record.key)}>编辑</a>
                )}
            </div>
        );
    }
    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        console.log("要编辑的key:"+ key);
        this.setState({editingKey: key});
    }

    save(form, key) {
        const that = this;
        form.validateFields((error) => {
            if (error) {
                return;
            }
            console.log("save row:" + JSON.stringify(that.editrow));
            const newData = [...this.state.list];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...that.editrow,
                });
                this.setState({list: newData, editingKey: ''});
            } else {
                // newData.push(data);
                // this.setState({ list: newData, editingKey: '' });
            }
        });
    }

    cancel = () => {
        this.setState({editingKey: ''});
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const {
            list,
            isSearching,
            totalNum,
            pageSize,
            currentPage
        } = this.state;

        const {
            pageSizeOptions
        } = this.props;

        return (
            <div>
                <Table
                    components={components}
                    loading={isSearching}
                    columns={columns}
                    dataSource={list}
                    pagination={false}
                    rowKey="key"
                    scroll={{x: 3000}}
                />
                <Pagination
                    totalNum={totalNum}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    requestFn={this.requestLog}
                    pageSizeOptions={pageSizeOptions}
                />
            </div>
        );
    }
}

export default FixedPaginationTable;

