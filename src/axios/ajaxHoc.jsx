import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Spin } from "antd";

import { 
    deepCopy, 
    isArray, 
    isEmpty, 
    isObject, 
    getUrlArgs,
    isError,
    getUrlWithOutArgs,
} from "./utils.js";

const
    defaultApiPrefix = "",
    failCb = (error) => {
        alert(error.message);
    },
    defaultConfig = {
        timeout: 10000,
        noRepeat: 0,
    },
    requestStaus = {

    },
    cacheModal = (() => {
        const
            maxNum = 50,
            suggestNum = 40,
            cacheMap = {};
        let id = 1;
        const
            setCache = (url, data) => {
                if (Object.keys(cacheMap).length >= maxNum) {
                    for (let i in cacheMap) {
                        let d = cacheMap[i];
                        if (id - d.id >= suggestNum) {
                            delete cacheMap[i];
                        }
                    }
                }
                cacheMap[url] = {
                    data: data,
                    id: id++
                }
            },
            getCache = (url) => {
                let cache = cacheMap[url];
                if (cache && cache.data) {
                    return cache.data;
                } else {
                    return null;
                }
            };
        return {
            setCache: setCache,
            getCache: getCache
        }
    })(),
    modifyConfig = (ajaxConfig) => {
        ajaxConfig = deepCopy(Object.assign(Object.assign({}, defaultConfig), ajaxConfig));
        if (ajaxConfig.data) {
            for (let i in ajaxConfig.data) {
                if (ajaxConfig.data[i] == undefined || /^\s*$/.test(ajaxConfig.data[i])) {
                    delete ajaxConfig.data[i];
                }
            }
        }
        if (ajaxConfig.data && (!ajaxConfig.method || ajaxConfig.method.toLowerCase() === "get")) {
            let result = [];
            for (var pro in ajaxConfig.data) {
                result.push(`${pro}=${ajaxConfig.data[pro]}`);
            }
            ajaxConfig.url += (ajaxConfig.url.indexOf("?") > -1 ? "&" : "?") + result.join("&");
            delete ajaxConfig["data"];
        }
        let apiPrefix = defaultApiPrefix;
        if (ajaxConfig.apiPrefix != undefined) {
            apiPrefix = ajaxConfig.apiPrefix;
        }
        if (apiPrefix && ajaxConfig.url) {
            const url = ajaxConfig.url;
            if (!url.startsWith("/" + apiPrefix)) {
                let afterUrl = "/" + apiPrefix;
                if (url.startsWith("/")) {
                    afterUrl += url;
                } else {
                    afterUrl += "/" + url;
                }
                ajaxConfig.url = afterUrl;
            }
        }
        return ajaxConfig;
    },
    createRequestPromise = (config) => {
        if (config.cache && cacheModal.getCache(config.url)) {
            return Promise.resolve({
                cached: true,
                data: cacheModal.getCache(config.url),
                config: config
            })
        } else if (config.mockData) {
            let url = config.url;
            let rawUrl = getUrlWithOutArgs(url);
            console.group("请求Url: " + rawUrl);
            const urlObj = getUrlArgs(url);
            if (!isEmpty(urlObj)) {
                console.group("url参数:");
                console.log(urlObj)
                console.groupEnd();
            }
            if (config.data) {
                console.group("post参数:");
                if (config.data.entries) {
                    for (let pair of config.data.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }
                } else {
                    console.log(config.data);
                }
                console.groupEnd();
            }
            console.log("模拟数据对应key " + config.mockData);
            console.groupEnd();
            config.url = '/__mocks__?id=' + config.mockData;
            return axios(config);
        } else {
            return axios(config);
        }
    },
    createRequest = (ajaxConfig) => {
        const url = ajaxConfig.url;
        let
            request;
        if (isArray(ajaxConfig)) {
            let req = [];
            ajaxConfig.forEach(e => {
                req.push(createRequestPromise(modifyConfig(e)));
            });
            request = axios.all(req);
        } else {
            const config = modifyConfig(ajaxConfig);
            if (config.noRepeat !== 0) {
                if (requestStaus[url]) {
                    return ""
                } else {
                    requestStaus[url] = true;
                    setTimeout(() => {
                        delete requestStaus[url];
                    }, config.noRepeat);
                }
            }
            request = createRequestPromise(config);
        }
        return request;
    },
    initResponseData = (axiosWrapedData, ajaxConfig, resCb, failCb) => {
        let
            checkResult = true,
            data;
        if (isArray(ajaxConfig)) {
            data = [];
            for (let i = 0, len = ajaxConfig.length; i < len; i++) {
                let e = axiosWrapedData[i];
                checkResult = checkAndResponseData(e, failCb);
                if (checkResult !== false) {
                    data.push(checkResult);
                } else {
                    data = null;
                    break;
                }
            }
        } else {
            checkResult = checkAndResponseData(axiosWrapedData, failCb);
            if (checkResult !== false) {
                data = checkResult;
            }
        }
        if (checkResult === false) {
            return false;
        } else {
            let originData;
            if (resCb) {
                originData = resCb(data);
            } else {
                originData = {
                    ajaxData: data
                }
            }
            return originData;
        }
    },
    checkAndResponseData = (axiosWrapedData, failCb) => {
        if (axiosWrapedData.cached) {
            return axiosWrapedData.data;
        }
        const
            res = axiosWrapedData.data;
        // 判断原始返回值是否为空
        if (!res || res === "null" || res === "undefined" || /^\s+$/.test(res)) {
            let err = new Error("返回为空");
            // console.error(err);
            failCb(err);
            return false;
        }
        // 判断是否要登录重定向
        if (res.loginUrl) {
            window.location = res.loginUrl;
            return false;
        }
        // 判断后端返回值status是否可用
        if (res.resultcode !== undefined) {
            let customStatus = +res.resultcode;
            if (!customStatus || customStatus < 200 || customStatus > 300) {
                let err = new Error(res.msg || `ajax返回数据错误，错误代码：${customStatus}`);
                // console.error(err);
                failCb(err, customStatus, axiosWrapedData.config);
                return false;
            }
        }
        // 如果后端返回值有data字段，那么这个才是真正的数据
        let originData;
        if (res.data !== undefined) {
            if (isEmpty(res.data)) {
                if (isArray(res.data)) {
                    return [];
                }
                if (isObject(res.data)) {
                    return {};
                }
                return null;
            } else {
                originData = res.data;
            }
        } else {
            originData = res;
        }
        if (axiosWrapedData.config.cache && !isEmpty(originData)) {
            cacheModal.setCache(axiosWrapedData.config.url, originData);
        }
        return originData;
    },
    // 输入：
    // 1.ajaxConfig：对象数组或者对象
    // 1.1 cache：true
    // 表示请求的时候尝试找url（包含参数）对应的缓存，命中的话，返回或者调用resCb。
    // 如果没命中缓存，在获取数据之后会把url对应的数据缓存起来
    // 1.2 noRepeat:默认为0-关闭,设置数字 表示不允许重复提交，重复提交的会抛弃请求
    // 2.reLoad：是否强制刷新（默认ajaxConfig没变化不刷新）
    // 3.resCb：返回ajax数据的处理函数
    // 3.failCb:失败的回调函数
    // 4.injectProps:注入到子组件的属性
    // 6.ajaxData:如果有，那么不发送ajax请求，直接把数据传送到子组件
    // 7.mockData: 测试时候使用，字符串，用于在mockData.js文件中找对应的key，根据这个key获取数据
    // 8.apiPrefix: 接口要加的前缀，覆盖全局默认配置
    ajaxHoc = (Component, wrapStyle) => {
        return class extends React.PureComponent {
            static displayName = "ajaxHoc_" + (Component.name || Component.displayName || ".jsx");
            static propTypes = {
                ajaxData: PropTypes.oneOfType([
                    PropTypes.object,
                    PropTypes.array,
                ]),
                ajaxConfig: PropTypes.oneOfType([
                    PropTypes.object,
                    PropTypes.array,
                ]),
                reLoad: PropTypes.bool,
                resCb: PropTypes.func,
                failCb: PropTypes.func,
                injectProps: PropTypes.object,
                mockData: PropTypes.oneOfType([
                    PropTypes.object,
                    PropTypes.array,
                ])
            };
            static defaultProps = {
                reLoad: false,
                injectProps: {},
                failCb: failCb
            }
            constructor(props) {
                super(props);
                this.state = {
                    data: null,
                    errorInfo: null,
                    //loading failed finish三选一状态
                    status: "begin" //begin loading finish failed
                }
            }
            sendRequest = (nextProps) => {
                let props = nextProps == undefined ? this.props : nextProps;
                if (props.ajaxConfig) {
                    if (this.state.status === "loading") {
                        return "";
                    }
                    let request = createRequest(props.ajaxConfig);
                    if (request) {
                        this.setState({
                            status: "loading"
                        })
                        request.then((data) => {
                            let result = initResponseData(data, props.ajaxConfig, this.props.resCb, this.props.failCb);
                            if (result === false) {
                                this.setState({
                                    status: "failed",
                                    errorInfo: ""
                                })
                            } else {
                                this.setState({
                                    status: "finish",
                                    data: result
                                })
                            }
                        }).catch((e) => {
                            if (isError(e) && e.message && e.message.indexOf("timeout") > -1) {
                                let timeout = props.ajaxConfig.timeout || defaultConfig.timeout;
                                alert("接口：" + props.ajaxConfig.url + " 超时" + timeout + "毫秒");
                            }
                            console.error(e);
                            this.setState({
                                status: "failed",
                                errorInfo: e.stack
                            })

                        })
                    }
                }
            }
            componentDidMount() {
                if (this.props.ajaxData) {
                    return this.setState({
                        data: this.props.ajaxData,
                        status: "finish"
                    })
                }
                this.sendRequest();
            }
            componentWillReceiveProps(nextProps) {
                if (nextProps.ajaxData) {
                    return this.setState({
                        data: nextProps.ajaxData,
                        status: "finish"
                    })
                }
                if (nextProps.ajaxConfig !== this.props.ajaxConfig || nextProps.reLoad === true) {
                    this.sendRequest(nextProps);
                }
            }
            render() {  
                const {
                    status,
                    data,
                    // errorInfo,
                } = this.state;
                const {
                    injectProps
                } = this.props;

                return (
                    <div style={wrapStyle ? wrapStyle : null} className="ajaxHoc__wrap">
                        {
                            (status === "loading" || status === "begin") &&
                            <div className="ajaxHoc__loading">
                                <Spin size="large" />
                                {/* <Loading/> */}
                            </div>
                        }
                        {
                            data &&
                            <Component
                                {...data}
                                {...injectProps}
                            />
                        }
                        {
                            (status === "failed") &&
                            <div className="ajaxHoc__error">
                                获取文章出错，请刷新页面
                            </div>
                        }
                    </div>
                )
            }
        }
    };

ajaxHoc.ajaxRequest = (ajaxConfig, resCb, myFailCb) => {
    let request = createRequest(ajaxConfig);
    if (request) {
        request.then((data) => {
            initResponseData(data, ajaxConfig, resCb, myFailCb || failCb);
        }).catch((e) => {
            if (isError(e) && e.message && e.message.indexOf("timeout") > -1) {
                let timeout = ajaxConfig.timeout || defaultConfig.timeout;
                alert("接口：" + (ajaxConfig ? ajaxConfig.url : "") + " 超时" + timeout + "毫秒");
            }
            myFailCb ? myFailCb(e) : alert(e.message);
        })
    }
}


export default ajaxHoc;