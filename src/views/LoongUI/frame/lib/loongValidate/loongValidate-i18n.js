export var loongValidate_i18n = {
    "zh":{
        required:"{0}不能为空！",
        email:"邮箱格式不正确！",
        ipv4:"IP地址格式不正确！",
        ipv4Oremail:"邮件服务器地址不正确！",
        equalTo:"{0}的值必须与{1}相同！",
        unequalTo:"{0}的值不能与{1}相同！",
        unequalToString:"{0}的值不能与{1}相同！",
        lengthRange:"长度必须在{0}到{1}之间！",
        maxRange:"大小必须在{0}到{1}之间！",
        lastNameLength:"目标文件夹或者文件长度不能超过{0}！",
        positive:"请输入正整数！",
        nonnegative:"请输入非负整数！",
        username:"{0}必须以字母开头，且只能包含字母和数字！",
        password:"密码必须包含数字和字母，且长度在6到16位之间！",
        name:"{0}只能包含中文、字母、数字、下划线和点号且必须包含中文或字母！",
        fileSysName:"{0}不能包含下列任何字符：\\ /:*'?"+'"'+"<>| 且不能为.和..",
        // fileSysPathPoint:"{0}不能为 .. 且{0}不能包含 ../ 或者 /..",
        fileSysPathPoint:"路径名不能为 . 或 .. 或连续的 / ",
        detail:"{0}长度在0到160之间！",
        overSold:"{0}超卖比在1~1.29之间！",
        overCpu:"{0}超卖比在1~10之间！",
        port:"请输入正确的端口号(1~65535之间)！",
        mask:"子网掩码不合法！",
        sysPathRelative:"路径名不能为 . 或 .. 或连续的 / 且不能包含 \\ : * ' ? "+'"'+" < > |",
        path:"路径必须以/或者盘符开头,特殊字符仅支持 -_\\:并且不支持中文和空格！",
        sysPath:"路径名不能为.或..或连续的/且不能包含字符\\:*'?"+'"'+"<>|并且必须以/开头！",
        ipList:"ip格式不正确",
        disk_dept_user_name:"只能由中文、字母、数字、下划线、点号和空格组成，不能用空格开头，不能用空格和点号结尾",
        ipmapping:"多个映射IP之间用英文逗号隔开，最多三个映射IP",
        vlanIds:"有效VLANID为介于1-4094以非0开头的正整数，且一次最多填写10个不重复VLANID，多个VLANID使用英文逗号隔开！",
        nics:'IP必须为有效格式，且多个不同IP之间用英文逗号隔开！',
        mac:"mac地址不合法！",
        ipListRepeat:"存在重复数据！",
        arrayRepeat:"存在重复数据!",
        ipArray:"ip格式错误！",
        idArray:"id格式错误！",
        idArrayRepeat:"存在重复数据!",
        ldap:'LDAP连接格式错误，格式如："ldap://192.168.1.99:389"',
        idLength: "数量太大！",
        disk_dept_name:"只能由中文、字母、数字、下划线组成",
        unequalToPort:'该端口已被占用',
        disk_version_name:"只能由字母、数字、'-'、下划线和点组成",
        url:'该输入项必须是URL地址，格式如："http://www.example.com"',
        domainName:"域名格式不正确",
        formalName:"只能由字母、数字、下划线组成",
        commonUser:"只能由字母、数字、下划线和空格组成，首尾不能有空格且空格不能连续"
    },
    "en": {
        required:"{0} should not be empty!",
        email:"Please enter a valid email address!",
        ipv4:"IP is not in the proper format!",
        ipv4Oremail:"Mail server is not in the proper format!",
        equalTo:"{0} should be equal to {1}!",
        unequalTo: "{0} is not equal to {1}",
        unequalToString:"{0} should not be equal to {1}!",
        lengthRange:"The length should be between {0} and {1} characters!",
        maxRange:"The range should be between {0} and {1}!",
        lastNameLength:"The length of target file or directory must be less than {0}！",
        positive:"Please enter the positive integer!",
        nonnegative:"Please enter the non-negative integer!",
        username:"{0} contains only letters and numbers, begin with letters!",
        password:"Password contains only numbers and letters, and maxRange (6,16)!",
        name:"{0} can only contain Chinese, letters, numbers, underscores and dots and must contain Chinese or letters!",
        fileSysName:"{0} can not contain character followed：\\ /:*'?"+'"'+"<>| and can not be . or ..",
        // fileSysPathPoint:"{0} can not be .. and {0} can not tontain ../ or /..",
        fileSysPathPoint:"Path can not be . or .. or repeated / and can not contain ../ or /..",
        sysPathRelative:"Directory name can not be . or .. or repeated / and can not contain //  \\ : * ' ? "+'"'+" < > |",
        detail:"{0} should be between 0 and 160 characters in length!",
        overSold:"The oversold ratio of {0} should be between 1~1.29!",
        overCpu:"The oversold ratio of {0} should be between 1~10!",
        port:"The port should be between 1~65535!",
        mask:"Invalid subnet mask!",
        path:"Error path！",
        ipList:"IP is not in the proper format!",
        disk_dept_user_name:"Chinese, letters, numbers, underscores, dots, and spaces only please,cannot begin with a space, and cannot end with spaces and periods",
        ipmapping:"IPs separated by commas, up to three",
        vlanIds:"Valid VLANID should be between 1 and 4094 and not begin with 0, the length of different VLANIDs should less than 10, multiple VLANIDs are separated by English comma!",
        nics:'IP should in the proper format, and multiple different ips are separated by English comma!',
        mac:"Invalid mac address!",
        arrayRepeat:"Duplicate data!",
        ipArray:"IP is not in the proper format！",
        idArray:"ID is not in the proper format！",
        idArrayRepeat:"Duplicate data!",
        ldap:'LDAP connection format error，format such as："ldap://192.168.1.99:389"',
        idLength: "Too big number！",
        disk_dept_name:"Chinese, letters, numbers, and underscores only please!",
        unequalToPort:'The port has been occupied',
        disk_version_name:"Letters, numbers, '-', underscores, and dots only please!",
        url:'The input must be an URL address, in the form of:"http://www.example.com"',
        domainName:"Please enter the correct domain name!",
        formalName:"Letters, numbers, and underscores only please!",
        commonUser:"Letters, numbers, underscores or space only please",
        sysPath: "Directory name can not be . or .. or repeated / and can not contain \\:*'?"+'"'+"<>|and must start of / !",
        ipListRepeat:"Duplicate data!"

    }
};

// var validateI18n = function(code) {
//     var lang = window.sessionStorage.language;
//     if(lang){
//         return loongValidate_i18n[lang][code];
//     }
// };
