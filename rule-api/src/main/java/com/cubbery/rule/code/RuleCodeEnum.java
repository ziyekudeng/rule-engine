/**
 * Copyright (c) 2015, www.cubbery.com. All rights reserved.
 */
package com.cubbery.rule.code;

/**
 * <b>项目名</b>： rule-parent <br>
 * <b>包名称</b>： com.cubbery.rule.code <br>
 * <b>类名称</b>： RuleCodeEnum <br>
 * <b>类描述</b>： <br>
 * <b>创建人</b>： <a href="mailto:cubber@cubbery.com">cubber[百墨]</a> <br>
 * <b>修改人</b>： <br>
 * <b>创建时间</b>： 2015/12/3 <br>
 * <b>修改时间</b>： <br>
 * <b>修改备注</b>： <br>
 *
 * @version 1.0.0 <br>
 */
public enum RuleCodeEnum implements IEnum {
    SUCCESS("000",""),
    CALL_SERVICE_FAIL("001",""),
    INVALID_PARAM("002","");

    private String code;
    private String desc;

    RuleCodeEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    
    public String getCode() {
        return code;
    }

    
    public String getDesc() {
        return desc;
    }
}
