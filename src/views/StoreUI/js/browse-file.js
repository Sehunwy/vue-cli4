var tableDom,pathCurrent = "",tableData = [];
import { formaterTitle } from '@/views/LoongUI/frame/js/common.js'
// var util = $.getUtil('/StoreUI/js/util.js'),interface1 = $.getUtil('/StoreUI/js/interface1.js');
import {util} from '@/views/StoreUI/js/util.js'
import {interface1} from '@/views/StoreUI/js/interface.js'
function broFile($input){
	this.$input = $input;
	this.browseFile();
}
broFile.prototype = {
	browseFile: function(){
		var self = this;
        browseFileDialog = $.loongDialog({
            "title": doI18n("store_file_browse_select_path"),
            "content": $(".dialog-content[name='browse-file-con']").html(),
            "isModal": true,
            "modalType": "max",
            "isClosed": true,
            "buttons": [{
                "txt": doI18n("btn_ok"),
                "callback": function(){
                    var ret = $.loongValidate($browseFileForm);
                    if(ret.hasError){
                        var input = ret.element;
                        showValid($browseFileForm, input, ret);
                    }else{
                        var indexArr = tableDom.getCheckedIndex();
                        if(indexArr.length != 0){
                            var data = tableDom.getRowData(indexArr[0])
                            pathCurrent = data.path;
                        }
                        if(pathCurrent == ""){
                            $.loongDialog({
                                "content": doI18n("store_file_browse_no_select_path"),
                                "isModal": false,
                                "msgType": 'warning',
                            });
                            return;
                        }
                        browseFileDialog.hideDialog();
                        self.$input.trigger("input");
                        self.$input.val(pathCurrent);   
                   }
                   self.$input.focus()
                    
                }
            }]
        });
        var $browseFileForm = $(".dialog-wrap").find(".browse-file-form");
        $browseFileForm.find(".file-path").attr("placeholder",doI18n("store_file_browse_placeholder_path"));
        $browseFileForm.find(".file-search").loongQuery({
            isInput: true,
            inputWidth: "290px",
            placeholderTxt: doI18n("store_file_browse_search_folder"),
            doquery: function(val,name) {
                var curPageSize=$.isEmptyObject(tableDom)?20:parseInt(tableDom.pageSize);
                tableDom = null;
                self.initFileTable(pathCurrent,curPageSize,name);
            }
        });
        pathCurrent = "";
        tableDom = null;
        self.initFileTable(pathCurrent);
        self.initPageEvent();
        $.formValid($browseFileForm);
    },
    initFileTable: function(path,curPageSize,keyword){
    	var self = this;
        var $browseFileForm = $(".dialog-wrap").find(".browse-file-form");
        if(path != ""){
            $browseFileForm.find(".file-path").val(path);
            $browseFileForm.find("div[name=back-last]").removeClass("dn");
        }else{
            $browseFileForm.find(".file-path").val("");
            $browseFileForm.find("div[name=back-last]").addClass("dn");
        }
        if (tableDom) {
            $.extend(tableDom.config.params, {
                path: path,
                keyword: keyword
            });
            tableDom.refresh();
        }else {
            tableDom = $browseFileForm.find("div[name=file-table]").loongTable({
                height: "383",
                hasCheckbox: false,
                hasRadio: true,
                ajaxData: true,
                hasLoading: true,
                url: "/api/store/fs/file/fileList",
                fields: [{
                    "name" : "name",
                    "title": doI18n("store_file_browse_file"), 
                    "width" : "460px",
                    "overflowEllipsis" : true
                },{
                    "name" : "size",
                    "title": doI18n("store_file_browse_size"),
                    "width" : "120px",
                    "formater": function(v, all){
                        if (all.folder) {
                            return $('<div class="line"></div>');;
                        } else {
                            var result = util.byteWithUnitFloat(v);
                            var span = newDom("span", {className: "over-span"});
                            span.textContent = span.title = result.quota + result.unit;
                            return span;
                        }
                    }
                },{
                    "name" : "creatTime",
                    "title": doI18n("store_file_browse_create_time"),
                    "formater": function(v, all){
                        if (v === 0) {
                            return "";
                        } else {
                            var result = $.dateFormat(v, "yyyy-MM-dd HH:mm:ss");
                            var span = newDom("span", {className: "over-span"});
                            span.textContent = span.title = result;
                            return span;
                        }
                    }
                }],
                pageSize: 10,
                limits: [10, 20, 30, 40, 50],
                method: "post",
                overflowEllipsis: true,
                pagination: true,
                pageSize: curPageSize,
                params: {
                    keyword: keyword,
                    path: path,
                    onlyDir: true
                },
                callBack: function() {
                    tableData = tableDom.getRowData();
                    self.initTableEvent(tableData);
                }
            })
        }
    },
    initTableEvent: function(data){
    	var self = this;
        var $browseFileForm = $(".dialog-wrap").find(".browse-file-form");
        var table = $browseFileForm.find("div[name=file-table] .table-content-wrap table");
        var trs = table.find("tr");
        var timeoutClick;
        for (var i = 0; i < data.length; i++) {
            var img = newDom("img", {className: "file-type-img"});
            if (data[i].folder) {
                if (data[i].isWorm) {
                    $(img).attr("src", "/StoreUI/image/director-worm@2x.png");
                } else {
                    $(img).attr("src", "/StoreUI/image/director@2x.png");
                }
            } else {
                $(img).attr("src", "/StoreUI/image/file@2x.png");
            }
            var tdFileName = $($(trs[i]).find("td")[1]);
            tdFileName.attr("title", data[i].name.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{50}\x01?/g,"$&\n").replace(/\x01/g,""));
            var span = newDom("span", {className: "fileNameSpan"});
            tdFileName.contents().wrap(span);
            tdFileName.prepend(img);
            tdFileName.find("span").on("click", function(){
                var that = this;
                clearTimeout(timeoutClick);
                timeoutClick = setTimeout(function () {
                    if (tableData[$(that).closest("tr").data("index")].folder) {
                        pathCurrent = tableData[$(that).closest("tr").data("index")].path;
                        var curPageSize=$.isEmptyObject(tableDom)?20:parseInt(tableDom.pageSize);
                        tableDom = null;
                        self.initFileTable(pathCurrent,curPageSize);
                        var search = $(".file-search .loong-search-input");
                        search.val("");
                    }
                }, 250);
            });
            tdFileName.find("span").on("mouseover",function(e){
                $(this).css("color","#1188DD");
            }).on("mouseout",function(e){
                $(this).css("color","rgb(51,51,51)");
            });
        }
        trs.on("dblclick", function(e){
            clearTimeout(timeoutClick);
            if (tableData[$(this).data("index")].folder) {
                pathCurrent = tableData[$(this).data("index")].path;
                var curPageSize=$.isEmptyObject(tableDom)?20:parseInt(tableDom.pageSize);
                tableDom = null;
                self.initFileTable(pathCurrent,curPageSize);
                var search = $(".file-search .loong-search-input");
                search.val("");
            }
        });
    },
    initPageEvent: function(){
    	var self = this;
        var $browseFileForm = $(".dialog-wrap").find(".browse-file-form");
        $browseFileForm.find("div[name=create-folder]").on("click", function(){
            var createFolderDialog = $.loongDialog({
                "title": doI18n("store_file_browse_create_folder"),
                "content": $(".dialog-content[name='create-folder-con']").html(),
                "isModal": true,
                "modalType": 'min',
                "isClosed": true,
                "buttons": [{
                    "txt": doI18n("btn_ok"),
                    "callback": function () {
                        util.validateForm($createFolderForm, function(){
                            var url = "/api/store/fs/file/mkdir";
                            var path = pathCurrent.slice(-1)==="/" ? pathCurrent:pathCurrent+"/";
                            var inputName = $createFolderForm.find("input[name=folder-name]").val().trim();
                            $.loading();
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: {
                                    path: path + inputName
                                }
                            }).done(function(data){
                                util.dealAjaxError(data, null, function(){
                                    $.loongDialog({
                                        "content": doI18n("store_file_browse_operation_success"),
                                        "isModal": false,
                                        "msgType": "success"
                                    });
                                    self.initFileTable(pathCurrent);
                                    createFolderDialog.hideDialog();
                                });
                            }).always(function(){
                                $.clearLoading();
                            });
                        })
                    }
                }]
            });
            var $createFolderForm = $(".dialog-wrap form.create-folder-form");
            if(pathCurrent != ""){
                $createFolderForm.find(".create-folder-title").removeClass("dn");
                $createFolderForm.find(".create-folder-name").html(pathCurrent);
                $createFolderForm.find(".create-folder-name").attr("title",formaterTitle(pathCurrent));
            }
            $.formValid($createFolderForm);
        });

        $browseFileForm.find("div[name='back-last']").on("click", function(){
            var path = "";
            var search = $browseFileForm.find(".file-search").find(".loong-search-input");
            // if (search.val() !== "") {
            //     path = pathCurrent;
            // } else {
                if (pathCurrent === "" || pathCurrent === "/") {
                    path = pathCurrent;
                } else {
                    var charArray = pathCurrent.split("/");
                    if (charArray[charArray.length - 1] === "") {
                        var newArray = charArray.slice(0, charArray.length - 2);
                        path = newArray.join("/");
                    } else {
                        var newArray = charArray.slice(0, charArray.length - 1);
                        path = newArray.join("/");
                    }
                }
            // }
            pathCurrent = path;
            var curPageSize=$.isEmptyObject(tableDom)?20:parseInt(tableDom.pageSize);
            tableDom = null;
            self.initFileTable(pathCurrent,curPageSize);
            search.val("");
        });

        $browseFileForm.find(".file-path").on("keydown", function(e){
            if (e.keyCode === 13) {
                var ret = $.loongValidate($browseFileForm);
                if (ret.hasError) {
                    var input = ret.element;
                    showValid($browseFileForm, input, ret);
                } else {
                    var pathInput = $(this).val().trim();
                    interface1.queryPathExist({
                        data: {
                            path: pathInput
                        }
                    }).done(function(data){
                        util.dealAjaxError(data, null, function(){
                            if (data.data.data) {
                                pathCurrent = pathInput;
                                var curPageSize=$.isEmptyObject(tableDom)?20:parseInt(tableDom.pageSize);
                                tableDom = null;
                                self.initFileTable(pathCurrent,curPageSize);
                                var search = $browseFileForm.find(".file-search .loong-search-input");
                                search.val("");
                            } else {
                                $.loongDialog({
                                    "content": doI18n("store_file_browse_path_not_exists"),
                                    "isModal": false,
                                    "msgType": "error"
                                });
                            }
                        })
                    })
                }
            }
        });
        $.formValid($browseFileForm);
    }
}
var isBroseFile = {
	init: function($input){
		return new broFile($input);
	}
}