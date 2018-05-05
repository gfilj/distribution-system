import React from "react";
import { Button, Modal, Form, Input, Radio } from 'antd';
import PropTypes from "prop-types";


const FormItem = Form.Item;

const CollectionUserForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form, row} = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 },
        };
        return (
            <Modal
                visible={visible}
                title="个人详情页"
                okText="保存"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="openID">
                        <span className="ant-form-text">{row.openid}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="昵称">
                        <span className="ant-form-text">{row.nickname}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别">
                        <span className="ant-form-text">{row.sex_str}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="城市">
                        <span className="ant-form-text">{row.city}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="省份">
                        <span className="ant-form-text">{row.province}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="国家">
                        <span className="ant-form-text">{row.country}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="个人二维码">
                        <img src={row.qrCode}/>
                    </FormItem>
                    <FormItem label="标题">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入收藏的标题!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="描述">
                        {getFieldDecorator('description')(<Input type="textarea" />)}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item" style={{marginBottom: 0}}>
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <Radio.Group>
                                <Radio value="public">公开</Radio>
                                <Radio value="private">私有</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

class UserForm extends React.PureComponent {
    static propTypes={
        row:PropTypes.object,
        url:PropTypes.string
    }
    static defaultProps = {
        row:{},
    }
    constructor(props){
        super(props);
        this.state = this.initState();
    }

    initState = () => {
        return {
            visible: false,
        }
    }

    showModal = () => {
        this.setState({ visible: true });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    render() {

        const {
            row
        } = this.props;
        return (
            <div>
                <Button type="dashed" onClick={this.showModal}>{row.nickname}</Button>
                <CollectionUserForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    row={row}
                />
            </div>
        );
    }
}

export default UserForm;