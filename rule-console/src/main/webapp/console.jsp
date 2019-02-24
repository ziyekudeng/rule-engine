<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>规则配置引擎</title>
    <link rel="stylesheet" type="text/css" href="media/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="media/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="media/rule.css">

    <script type="text/javascript" src="media/jquery.min.js"></script>
    <script type="text/javascript" src="media/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="media/easyui-tabs.js"></script>
    <script type="text/javascript" src="media/rule.js"></script>

</head>
<body class="easyui-layout" >

<!--上边栏-->
<div region="north" title="" split="true" style="height:36px;padding:0px;background:#99BBE8;">
    <div style="width:100%;" id="toolbar">
        <TABLE width="100%" align="center" style="word-break: break-all;" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:80%;" class="toolbar_left">
                    <a href="#" onClick="javascript:toSave()" id="savebutton" class="easyui-linkbutton" plain="true" iconCls="icon-SaveItem">首页</a>
                </td>
                <td style="width:20%;" class="toolbar_right">
                    规则包
                </td>
            </tr>
        </table>
    </div>
</div>

<%--<!--下边栏-->--%>
<%--<div data-options="region:'south',split:true" style="height:50px;">--%>
    <%--<div class="copy"></div>--%>
<%--</div>--%>

<!--左边栏-->
<div data-options="region:'west',split:true" title="规则场景" style="width:180px;padding1:1px;">
    <ul id="tree_menu"></ul>
</div>

<!--中间栏-->
<div data-options="region:'center',title:'操作窗口',iconCls:'icon-ok'">
    <div id="main-tabs" class="easyui-tabs" data-options="fit:true,border:false" style="width:20px;padding1:1px;">

    </div>
</div>
</body>
<script type="text/javascript">

    $('#tree_menu').tree({
        url:'scene.htm',
        onClick: function(node){

        }
    });
</script>
</html>

