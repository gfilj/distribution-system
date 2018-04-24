// const
//     /**
//      * 所有请求的配置中心
//      * @type {{}}
//      */
//     requestCenter = {
//         getFanlist:{
//             desc:'粉丝清单',
//             method:'GET',
//             args:{
//                 category: "文章分类",
//                 lmodifyGE: "",
//                 lmodifyLE: "",
//                 offset: "",
//                 size: "",
//                 userid: "",
//             },
//             url:{
//                 reg: (d) => {
//                     return `/newoperationlogs/search?type=${d.type}`;
//                 },
//                 "888": "/video/newoperationlogs/search?type=888",
//                 "999": "/video/newoperationlogs/search?type=999",
//             }
//
//         },
//     };