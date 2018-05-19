import React from "react";
import {Button, Modal, Form,notification,Icon} from 'antd';
import PropTypes from "prop-types";
import ajaxHoc from "../../axios/ajaxHoc.jsx";
import {myInterval}from "../../axios/utils";

const ImgForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, imgUrl} = props;

        return (
            <Modal
                visible={visible}
                title="京东二维码截图"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
                width="1080"
            >
                <img src={imgUrl}/>

            </Modal>
        );
    }
);

class UserForm extends React.PureComponent {
    static propTypes = {
        loginUrl: PropTypes.string,
        text: PropTypes.string
    }
    static defaultProps = {
        // loginUrl:"",
        // text: "导入京东订单"
    }

    constructor(props) {
        super(props);
        this.state = this.initState();

    }

    initState = () => {
        return {
            // 是否在加载文章
            isLoading: false,
            visible: false,
            imgUrl: ""
        }
    }

    showModal = () => {
        const that = this;
        that.handleSubmitSearch();
        const x = myInterval(() => {
            ajaxHoc.ajaxRequest({
                url: "/distribution/order/result",
            }, (data) => {
                console.log("查询结果" + data);
                if(data){
                    that.handleCancel();
                    x.end();
                    that.messageAlert("导入京东订单成功！");
                    ajaxHoc.ajaxRequest({
                        url: "/distribution/order/read",
                    }, () => {
                    });
                }
            });

        }, 2*1000);
        x();
    };
    handleCancel = () => {
        this.setState({
            isLoading: false,
            visible: false});
    };
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({visible: false});
        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    // 执行查询
    handleSubmitSearch = () => {
        const that = this;
        that.setState({
            isLoading: true
        }, () => {
            const {loginUrl} = this.props;
            console.log("登录loginUrl:" + loginUrl);
            ajaxHoc.ajaxRequest({
                url: loginUrl
            }, (dataReceive) => {
                if(!dataReceive.result){
                    console.log(dataReceive);
                    var timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    that.setState({
                        isLoading: false,
                        imgUrl: dataReceive.qrCodeUrl + "?time=" + timestamp,
                        visible: true

                    })
                }
            }, (e) => {
                that.setState({
                    isLoading: false
                })
                console.error(e);
            })
        })
    }

    messageAlert = (txt) => {
        const openNotification = () => {
            notification.open({
                description: (
                    <div>
                        <p>
                            {txt}
                        </p>
                    </div>
                ),
                icon: <Icon type="smile-circle" style={{color: 'red'}}/>,
                duration: 5,
            });
        };
        openNotification();
    }
    render() {
        const {text} = this.props;
        return (
            <div>
                <Button type="primary" loading={this.state.isLoading} onClick={this.showModal}>{text}</Button>
                <ImgForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    imgUrl={this.state.imgUrl}
                />
            </div>
        );
    }
}

export default UserForm;