const
    toString = {}.toString,
    isError = (target) => {
        return toString.call(target) === "[object Error]";
    },
    isArray = (target) => {
        return toString.call(target) === "[object Array]";
    },
    isNumber = (target) => {
        return toString.call(target) === "[object Number]";
    },
    isObject = (target) => {
        return toString.call(target) === "[object Object]";
    },
    isString = (target) => {
        return toString.call(target) === "[object String]";
    },
    isBoolean = (target) => {
        return toString.call(target) === "[object Boolean]";
    },
    isFunction = (target) => {
        return toString.call(target) === "[object Function]";
    },

    isNullObject = (target) => {
        if (JSON.stringify(target) === '{}') {
            return true // 如果为空,返回false
        }
        return false
    },
    isEmpty = (target) => {
        if (target === undefined
            || target === null
            || (target !== target)
            || /^\s*$/.test(target)
            || target === "undefined"
            || target === "null"
            || (isArray(target) && target.length === 0)
            || (isObject(target) && Object.keys(target).length === 0)
        ) {
            return true;
        } else {
            return false;
        }
    },
    deepCopy = (target) => {
        let result;
        if (isArray(target)) {
            result = [];
            target.forEach((e, i) => {
                result[i] = deepCopy(e);
            })
        } else if (isObject(target)) {
            result = {};
            let pros = Object.keys(target);
            pros.forEach(e => {
                result[e] = deepCopy(target[e]);
            })
        } else {
            result = target;
        }
        return result;
    },
    traveseLinks = (links, handle, deep) => {
        deep = deep || 0;
        links.forEach(e => {
            if (e.child !== undefined) {
                handle(e, deep, true);
                traveseLinks(e.child, handle, deep + 1);
            } else {
                handle(e, deep);
            }
        })
    },
    errorLog = (msg) => {
        console.error(msg);
    },
    initDateObj = (d) => {
        let
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return `${year}-${month}-${day}`;
    },
    getTimeFromDateObj = (d) => {
        let
            hours = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return `${hours}:${minute}:${second}`;
    },
    getTimeStringFromTimeNumber = (str) => {
        if (isEmpty(str)) {
            return "";
        } else if (isEmpty(+str)) {
            return str;
        }
        let d = new Date(+str);
        return initDateObj(d) + " " + getTimeFromDateObj(d);
    },

    getTimeStringFromMoment = (obj) => {
        if (isEmpty(obj)) {
            return "";
        } else if (isString(obj)) {
            return obj;
        } else {
            let d = obj.toDate();
            return initDateObj(d) + " " + getTimeFromDateObj(d);
        }
    },
    ajaxDateScopeArgs = (start, end) => {
        return {
            lmodifyGE: initDateObj(start) + " 00:00:00",
            lmodifyLE: initDateObj(end === undefined ? start : end) + " 23:59:59"
        }
    },
    uniqKey = (() => {
        let id = 1;
        return () => {
            return "key" + (id++);
        }
    })(),
    debounce = (func, wait, immediate, changeArgs) => {
        let timeout, args, context, timestamp, result;

        let later = function () {
            let last = new Date() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };
        return function () {
            context = this;
            args = changeArgs ? changeArgs(arguments) : arguments;
            timestamp = new Date();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    },
    timeCalculate = (msg) => {
        let
            before,
            now;
        if (before) {
            now = new Date();
            console.info(`${before.msg} - ${msg}: ${now - before.time}`);
        }
        before = {
            msg: msg,
            time: now
        }
    },
    regEscape = function (s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    },
    toFormData = (data) => {
        var _formData = new FormData();
        for (var i in data) {
            _formData.append(i, data[i]);
        }
        return _formData;
    },
    createPostData = (data) => {
        const params = new URLSearchParams();
        Object.keys(data).forEach(e => {
            let d = data[e];
            if (isArray(d)) {
                d = JSON.stringify(d);
            }
            params.append(e, d);
        });
        return params;
    },
    removeEmptyProps = (obj) => {
        if (isObject(obj)) {
            let newObj = {};
            Object.keys(obj).forEach(pro => {
                const value = obj[pro];
                if (!isEmpty(value)) {
                    newObj[pro] = value;
                }
            })
            return newObj;
        }
        return obj;
    },
    createOmckPostData = (data) => {
        const params = new URLSearchParams();
        Object.keys(data).forEach(e=> {
            let d = data[e];
            if (!isEmpty(d)) {
                if (isArray(d)) {
                    d = JSON.stringify(d);
                }
                params.append(e, d);
            }
        });
        return params;
    },
    escapeRegExp = (str) => {
        return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
    },
    getYesterdayScope = () => {
        let 
            now = new Date(),
            yesterday = new Date(now - 24 * 60 * 60 * 1000);
        return {
            lmodifyGE: initDateObj(yesterday) + " 11:59:59" ,
            lmodifyLE: `${initDateObj(now)} 00:00:00`,
        }
    },
    getTodayScope = () => {
        let now = new Date();
        let date = initDateObj(now);
        return {
            lmodifyGE: `${date} 00:00:00`,
            lmodifyLE: date + " " + getTimeFromDateObj(now)
        }
    },
    getSeveralDaysBeforeScope = (days) => {
        if (!isNumber(days)) {
            throw new Error("getSeveralDaysBeforeScope需传入数字");
        } 
        let
            now = new Date(),
            start = new Date();
        for (let i = 0, len = days; i < len; i++) {
            start -= 24 * 60 * 60 * 1000;
        }
        return {
            lmodifyGE: `${initDateObj(new Date(start))} 00:00:00`,
            lmodifyLE: initDateObj(now) + " " + getTimeFromDateObj(now)
        }
    },
    getWeekScope = () => {
        let 
            now = new Date(),
            start = new Date(),
            week = start.getDay();
        for (let i = 0, len = (week === 0) ? 6 : (week - 1); i < len;  i++) {
            start -= 24 * 60 * 60 * 1000;
        }
        return {
            lmodifyGE: `${initDateObj(new Date(start))} 00:00:00`,
            lmodifyLE: initDateObj(now) + " " + getTimeFromDateObj(now)
        }
    },
    getMonthScope = () => {
        let 
            now = new Date(),
            start = new Date();
        start.setDate(1);
        return {
            lmodifyGE: `${initDateObj(start)} 00:00:00`,
            lmodifyLE: initDateObj(now) + " " + getTimeFromDateObj(now)
        }
    },
    getUrlArgs = (str) => {
        const reg = /(\?+|&+)([^=]+)=([^&]+)/g;
        let t = reg.exec(str);
        let result = {};
        while (t) {
            let key = t[2];
            let value = t[3];
            if (isEmpty(result[key])) {
                result[key] = value;
            } else {
                let has = result[key];
                if (isArray(has)) {
                    has.push(value);
                } else {
                    result[key] = [has, value];
                }
            }
            t = reg.exec(str);
        }
        return result;
    },
    formatNumber = (num) => {
        if (isEmpty(num) || isEmpty(+num)) {
            return "--";
        } else {
            num = num + "";
            let len = num.length;
            if (len <= 3) {
                return num;
            } else {
                let 
                    j = len - 1,
                    ar = [];
                for (let i = 0; i < len; i++) {
                    if (i && (i % 3 === 0)) {
                        ar.unshift(",");
                    }
                    let e = num.charAt(j);
                    ar.unshift(e);
                    j--;
                }
                return ar.join("");
            }
        }
    },
    addArgs2Url = (url, obj) => {
        if (isString(url) && isObject(obj)) {
            const cleanedObj = removeEmptyProps(obj);
            let args = [];
            for (let pro in cleanedObj) {
                let value = cleanedObj[pro];
                args.push(`${pro}=${value}`);
            }
            if (url.indexOf("?") > -1) {
                url += "&";
            } else {
                url += "?";
            }
            url += args.join("&");
            return url;
        }
        return url;
    },
    getUrlWithOutArgs = (url) => {
        if (isEmpty(url)) {
            return "";
        }
        const
            question = url.indexOf("?");
        if (question > -1) {
            return url.slice(0, question);
        } else {
            return url.slice(0);
        }
    },
    myInterval = (func, time) => {
        let flag = true;
        let rafHandle = null;
        let loop = () => {
            if (flag) {
                // 减少不必要的请求
                if(rafHandle !== null){
                    cancelAnimationFrame(rafHandle)
                }
                rafHandle = requestAnimationFrame(func);
                setTimeout(loop, time);
            }
        }
        loop.end = () => {
            flag = false;
        }
        loop.start = () => {
            flag = true;
        }
        return loop;
    },
    getPercentage = (son, mother) => {
        if (isEmpty(+son) || isEmpty(+mother) || +mother === 0) {
            return "0.00%";
        } else {
            return ((+son / +mother) * 100).toFixed(2) + "%";
        }
    },
    uniq = (ar) => {
        const 
            prims = {
                "number": {},
                "string": {},
                "boolean": {},
            },
            objs = [];
        ar.filter(e => {
            const type = typeof e;
            if (type in prims) {
                const map = prims[type];
                return map.hasOwnProperty(e) ? false : (map[e] = true)
            } else {
                return objs.indexOf(e) > -1 ? false : objs.push(e);
            }
        })
    },
    createWrap = (src) => {
        let wrap = document.createElement("div");
        let opacityWrap = document.body.querySelector(".workspace__bodyImgOpacityWrap");
        if (!opacityWrap) {
            opacityWrap = document.createElement("div");
            opacityWrap.className = "workspace__bodyImgOpacityWrap";
            document.body.appendChild(opacityWrap);
        } 
        wrap.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() !== "img") {
                document.body.removeChild(wrap);
                opacityWrap.style.display = "none";
            }
        }, true);
        wrap.className = "workspace__bodyImgWrap";
        const img = new Image();
        img.src = src;
        img.className = "workspace__bodyImgInWrap";
        wrap.appendChild(img);
        document.body.appendChild(wrap);
        opacityWrap.style.display = "block";
        return wrap;
    },
    getCidName = (cid, list) => {
        for (let i = 0, len = list.length; i < len; i++) {
            let e = list[i];
            if (e.cid === cid) {
                return e.cname;
            }
            if (e.child) {
                let result = getCidName(cid, e.child);
                if (result) {
                    return result;
                }
            }
        }
        return "";
    },
    add_rowNum2List = (list, offset) => {
        if (!isEmpty(list) && isArray(list)) {
            let start = +offset;
            if (isEmpty(start) || !isNumber(start)) {
                start = 0;
            }
            list.forEach(e => {
                e._rowNum = ++start;
            })
            return list;
        } else {
            return list;
        }
    };
export {
    isArray,
    isObject,
    isString,
    isBoolean,
    isFunction,
    isNullObject,
    deepCopy,
    traveseLinks,
    errorLog,
    ajaxDateScopeArgs,
    initDateObj,
    uniqKey,
    isEmpty,
    debounce,
    timeCalculate,
    regEscape,
    dataURLtoBlob,
    toFormData,
    createPostData,
    createOmckPostData,
    removeEmptyProps,
    getTimeStringFromTimeNumber,
    escapeRegExp,
    getTimeStringFromMoment,
    myInterval,
    isNumber,
    getTimeFromDateObj,
    getTodayScope,
    getSeveralDaysBeforeScope,
    getYesterdayScope,
    getWeekScope,
    getMonthScope,
    formatNumber,
    getUrlArgs,
    addArgs2Url,
    add_rowNum2List,
    getPercentage,
    uniq,
    createWrap,
    getCidName,
    isError,
    getUrlWithOutArgs,
}; 
