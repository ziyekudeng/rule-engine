/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	var datagridIndex = 0;
	/**
	 * 从数组arr中获取与o相同元素的下标，如无则返回-1
	 * @param {} arr 数组
	 * @param {} o 对象
	 */
	function getEqIndex(arr, o) {
		for (var i = 0,len=arr.length; i < len; i++) {
			if (arr[i] == o) {
				return i;
			}
		}
		return -1;
	};
	/**
	 * 从数组中删除指定的元素
	 */
	function delByE(arr, o, id) {
		if (typeof o == "string") {//如果数组元素对象的属性o==id，则删除该元素
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i][o] == id) {
					arr.splice(i, 1);
					return;
				}
			}
		} else {//如果o存在与arr中，则删除o
			var i = getEqIndex(arr, o);
			if (i != -1) {
				arr.splice(i, 1);
			}
		}
	};
	/**
	 * 判断数组arr中元素的属性o是否与r中的属性相等，如不等，则把r加入数组
	 */
	function addUniqueAttrrE(arr, attrName, obj) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i][attrName] == obj[attrName]) {
				return;
			}
		}
		arr.push(obj);
	};
	/**
	 * 设定datagrid的panel的宽和高
	 * @param {} elem dom的节点
 	 * @param {} _b
	 */
	function setSize(elem, param) {
		var options = $.data(elem, "datagrid").options;
		var panel = $.data(elem, "datagrid").panel;
		if (param) {
			if (param.width) {
				options.width = param.width;
			}
			if (param.height) {
				options.height = param.height;
			}
		}
		if (options.fit == true) {
			var p = panel.panel("panel").parent();
			options.width = p.width();
			options.height = p.height();
		}
		panel.panel("resize", {
					width : options.width,
					height : options.height
				});
	};
	function fixDataGridHeight(elem) {
		var options = $.data(elem, "datagrid").options;
		var dc = $.data(elem, "datagrid").dc;//datagrid的文档对象，所有datagrid页面显示都由dc定义
		var panel = $.data(elem, "datagrid").panel;
		var width = panel.width();
		var height = panel.height();
		var view = dc.view;
		var view1 = dc.view1;
		var view2 = dc.view2;
		var v1_header = view1.children("div.datagrid-header");
		var v2_header = view2.children("div.datagrid-header");
		var v1_header_table = v1_header.find("table");
		var v2_header_table = v2_header.find("table");
		view.width(width);
		var v1_header_inner = v1_header.children("div.datagrid-header-inner").show();
		view1.width(v1_header_inner.find("table").width());
		if (!options.showHeader) {
			v1_header_inner.hide();
		}
		view2.width(width - view1._outerWidth());
		view1.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer")
			 .width(view1.width());
		view2
				.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer")
				.width(view2.width());
		var hh;
		v1_header.css("height", "");
		v2_header.css("height", "");
		v1_header_table.css("height", "");
		v2_header_table.css("height", "");
		hh = Math.max(v1_header_table.height(), v2_header_table.height());
		v1_header_table.height(hh);
		v2_header_table.height(hh);
		v1_header.add(v2_header)._outerHeight(hh);
		if (options.height != "auto") {
			var height1 = height - view2.children("div.datagrid-header")._outerHeight()
					- view2.children("div.datagrid-footer")._outerHeight()
					- panel.children("div.datagrid-toolbar")._outerHeight();
			panel.children("div.datagrid-pager").each(function() {
						height1 -= $(this)._outerHeight();
					});
			dc.body1.add(dc.body2).children("table.datagrid-btable-frozen")
					.css({
								position : "absolute",
								top : dc.header2._outerHeight()
							});
			var height2 = dc.body2.children("table.datagrid-btable-frozen")
					._outerHeight();
			view1.add(view2).children("div.datagrid-body").css({
						marginTop : height2,
						height : (height1 - height2)
					});
		}
		view.height(view2.height());
	};
	function fixRowHeight(elem, index, _21) {
		//var _22 = $.data(elem, "datagrid").data.rows;
		var opts = $.data(elem, "datagrid").options;
		var dc = $.data(elem, "datagrid").dc;
		if (!dc.body1.is(":empty") && (!opts.nowrap || opts.autoRowHeight || _21)) {
			if (index != undefined) {
				var tr1 = opts.finder.getTr(elem, index, "body", 1);
				var tr2 = opts.finder.getTr(elem, index, "body", 2);
				fixSingleRowHeight(tr1, tr2);
			} else {
				var tr1 = opts.finder.getTr(elem, 0, "allbody", 1);
				var tr2 = opts.finder.getTr(elem, 0, "allbody", 2);
				fixSingleRowHeight(tr1, tr2);
				if (opts.showFooter) {
					var tr1 = opts.finder.getTr(elem, 0, "allfooter", 1);
					var tr2 = opts.finder.getTr(elem, 0, "allfooter", 2);
					fixSingleRowHeight(tr1, tr2);
				}
			}
		}
		fixDataGridHeight(elem);
		if (opts.height == "auto") {
			var view1_body = dc.body1.parent();
			var view2_body = dc.body2;
			var height1 = 0;
			var height2 = 0;
			view2_body.children().each(function() {
						var c = $(this);
						if (c.is(":visible")) {
							height1 += c._outerHeight();
							if (height2 < c._outerWidth()) {
								height2 = c._outerWidth();
							}
						}
					});
			if (height2 > view2_body.width()) {
				height1 += 18;
			}
			view1_body.height(height1);
			view2_body.height(height1);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler("scroll");
		function fixSingleRowHeight(tr1, tr2) {
			for (var i = 0; i < tr2.length; i++) {
				var tr1 = $(tr1[i]);
				var tr2 = $(tr2[i]);
				tr1.css("height", "");
				tr2.css("height", "");
				var heigth = Math.max(tr1.height(), tr2.height());
				tr1.css("height", heigth);
				tr2.css("height", heigth);
			}
		};
	};
	function freezeRow(elem, index) {
		var datagridData = $.data(elem, "datagrid");
		var opts = datagridData.options;
		var dc = datagridData.dc;
		if (!dc.body2.children("table.datagrid-btable-frozen").length) {
			dc.body1
					.add(dc.body2)
					.prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
		}
		_31(true);
		_31(false);
		fixDataGridHeight(elem);
		function _31(_32) {
			var dataIndex = _32 ? 1 : 2;
			var tr = opts.finder.getTr(elem, index, "body", dataIndex);
			(_32 ? dc.body1 : dc.body2)
					.children("table.datagrid-btable-frozen").append(tr);
		};
	};
	/**
	 * 从页面中根据"easyui-datagrid"获取datagrid的配置对象
	 * 包括生成datagrid相关的页面元素
	 */
	function wrapGrid(elem, rownumbers) {
		function getOptions() {
			var _38 = [];
			var _39 = [];
			$(elem).children("thead").each(function() {
				var opt = $.parser.parseOptions(this, [{
									frozen : "boolean"
								}]);
				$(this).find("tr").each(function() {
					var _3a = [];
					$(this).find("th").each(function() {
						var th = $(this);
						var fieldOpts = $.extend({}, $.parser.parseOptions(this, [
												"field", "align", "halign",
												"order", {
													sortable : "boolean",
													checkbox : "boolean",
													resizable : "boolean"
												}, {
													rowspan : "number",
													colspan : "number",
													width : "number"
												}]), {
									title : (th.html() || undefined),
									hidden : (th.attr("hidden")
											? true
											: undefined),
									formatter : (th.attr("formatter") ? eval(th
											.attr("formatter")) : undefined),
									styler : (th.attr("styler") ? eval(th
											.attr("styler")) : undefined),
									sorter : (th.attr("sorter") ? eval(th
											.attr("sorter")) : undefined)
								});
						if (th.attr("editor")) {
							var s = $.trim(th.attr("editor"));
							if (s.substr(0, 1) == "{") {
								fieldOpts.editor = eval("(" + s + ")");
							} else {
								fieldOpts.editor = s;
							}
						}
						_3a.push(fieldOpts);
					});
					opt.frozen ? _38.push(_3a) : _39.push(_3a);
				});
			});
			return [_38, _39];
		};
		var wrapObj = $("<div class=\"datagrid-wrap\">"
				+ "<div class=\"datagrid-view\">"
				+ "<div class=\"datagrid-view1\">"
				+ "<div class=\"datagrid-header\">"
				+ "<div class=\"datagrid-header-inner\"></div>" + "</div>"
				+ "<div class=\"datagrid-body\">"
				+ "<div class=\"datagrid-body-inner\"></div>" + "</div>"
				+ "<div class=\"datagrid-footer\">"
				+ "<div class=\"datagrid-footer-inner\"></div>" + "</div>"
				+ "</div>" + "<div class=\"datagrid-view2\">"
				+ "<div class=\"datagrid-header\">"
				+ "<div class=\"datagrid-header-inner\"></div>" + "</div>"
				+ "<div class=\"datagrid-body\"></div>"
				+ "<div class=\"datagrid-footer\">"
				+ "<div class=\"datagrid-footer-inner\"></div>" + "</div>"
				+ "</div>" + "</div>" + "</div>").insertAfter(elem);
		wrapObj.panel({
					doSize : false
				});
		wrapObj.panel("panel").addClass("datagrid").bind("_resize",
				function(e, _3c) {
					var opts = $.data(elem, "datagrid").options;
					if (opts.fit == true || _3c) {
						setSize(elem);
						setTimeout(function() {
									if ($.data(elem, "datagrid")) {
										fixColumnSize(elem);
									}
								}, 0);
					}
					return false;
				});
		$(elem).hide().appendTo(wrapObj.children("div.datagrid-view"));
		var cc = getOptions();
		var view = wrapObj.children("div.datagrid-view");
		var view1 = view.children("div.datagrid-view1");
		var view2 = view.children("div.datagrid-view2");
		return {
			panel : wrapObj,
			frozenColumns : cc[0],
			columns : cc[1],
			dc : {
				view : view,
				view1 : view1,
				view2 : view2,
				header1 : view1.children("div.datagrid-header")
						.children("div.datagrid-header-inner"),
				header2 : view2.children("div.datagrid-header")
						.children("div.datagrid-header-inner"),
				body1 : view1.children("div.datagrid-body")
						.children("div.datagrid-body-inner"),
				body2 : view2.children("div.datagrid-body"),
				footer1 : view1.children("div.datagrid-footer")
						.children("div.datagrid-footer-inner"),
				footer2 : view2.children("div.datagrid-footer")
						.children("div.datagrid-footer-inner")
			}
		};
	};
	/**
	 * 获取页面td里的数据
	 */
	function getData(elem) {
		var data = {
			total : 0,
			rows : []
		};
		var fields = getColumnFields(elem, true).concat(getColumnFields(elem, false));
		$(elem).find("tbody tr").each(function() {
					data.total++;
					var fieldOpts = {};
					for (var i = 0; i < fields.length; i++) {
						fieldOpts[fields[i]] = $("td:eq(" + i + ")", this).html();
					}
					data.rows.push(fieldOpts);
				});
		return data;
	};
	/**
	 * 初始化datagrid
	 */
	function initDatagrid(elem) {
		var datagridData = $.data(elem, "datagrid");
		var opts = datagridData.options;
		var dc = datagridData.dc;
		var panel = datagridData.panel;
		panel.panel($.extend({}, opts, {
					id : null,
					doSize : false,
					onResize : function(width, height) {
						setTimeout(function() {
									if ($.data(elem, "datagrid")) {
										fixDataGridHeight(elem);
										fitColumn(elem);
										opts.onResize.call(panel, width, height);
									}
								}, 0);
					},
					onExpand : function() {
						fixRowHeight(elem);
						opts.onExpand.call(panel);
					}
				}));
		datagridData.rowIdPrefix = "datagrid-row-r" + (++datagridIndex);
		appendColumns(dc.header1, opts.frozenColumns, true);
		appendColumns(dc.header2, opts.columns, false);
		fixColumnDivCss();
		dc.header1.add(dc.header2).css("display",
				opts.showHeader ? "block" : "none");
		dc.footer1.add(dc.footer2).css("display",
				opts.showFooter ? "block" : "none");
		if (opts.toolbar) {
			if (typeof opts.toolbar == "string") {
				$(opts.toolbar).addClass("datagrid-toolbar").prependTo(panel);
				$(opts.toolbar).show();
			} else {
				$("div.datagrid-toolbar", panel).remove();
				var tb = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>")
						.prependTo(panel);
				var tr = tb.find("tr");
				for (var i = 0; i < opts.toolbar.length; i++) {
					var btn = opts.toolbar[i];
					if (btn == "-") {
						$("<td><div class=\"datagrid-btn-separator\"></div></td>")
								.appendTo(tr);
					} else {
						var td = $("<td></td>").appendTo(tr);
						var _50 = $("<a href=\"javascript:void(0)\"></a>")
								.appendTo(td);
						_50[0].onclick = eval(btn.handler || function() {
						});
						_50.linkbutton($.extend({}, btn, {
									plain : true
								}));
					}
				}
			}
		} else {
			$("div.datagrid-toolbar", panel).remove();
		}
		$("div.datagrid-pager", panel).remove();
		if (opts.pagination) {
			var _51 = $("<div class=\"datagrid-pager\"></div>");
			if (opts.pagePosition == "bottom") {
				_51.appendTo(panel);
			} else {
				if (opts.pagePosition == "top") {
					_51.addClass("datagrid-pager-top").prependTo(panel);
				} else {
					var _52 = $("<div class=\"datagrid-pager datagrid-pager-top\"></div>")
							.prependTo(panel);
					_51.appendTo(panel);
					_51 = _51.add(_52);
				}
			}
			_51.pagination({
						total : 0,
						pageNumber : opts.pageNumber,
						pageSize : opts.pageSize,
						pageList : opts.pageList,
						onSelectPage : function(_53, _54) {
							opts.pageNumber = _53;
							opts.pageSize = _54;
							_51.pagination("refresh", {
										pageNumber : _53,
										pageSize : _54
									});
							request(elem);
						}
					});
			opts.pageSize = _51.pagination("options").pageSize;
		}
		function appendColumns(container, columns, frozen) {
			if (!columns) {
				return;
			}
			$(container).show();
			$(container).empty();
			var t = $("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>")
					.appendTo(container);
			for (var i = 0; i < columns.length; i++) {
				var tr = $("<tr class=\"datagrid-header-row\"></tr>")
						.appendTo($("tbody", t));
				var _58 = columns[i];
				for (var j = 0; j < _58.length; j++) {
					var fieldOpts = _58[j];
					var _59 = "";
					if (fieldOpts.rowspan) {
						_59 += "rowspan=\"" + fieldOpts.rowspan + "\" ";
					}
					if (fieldOpts.colspan) {
						_59 += "colspan=\"" + fieldOpts.colspan + "\" ";
					}
					var td = $("<td " + _59 + "></td>").appendTo(tr);
					if (fieldOpts.checkbox) {
						td.attr("field", fieldOpts.field);
						$("<div class=\"datagrid-header-check\"></div>")
								.html("<input type=\"checkbox\"/>")
								.appendTo(td);
					} else {
						if (fieldOpts.field) {
							td.attr("field", fieldOpts.field);
							td
									.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
							$("span", td).html(fieldOpts.title);
							$("span.datagrid-sort-icon", td).html("&nbsp;");
							var _5a = td.find("div.datagrid-cell");
							if (fieldOpts.resizable == false) {
								_5a.attr("resizable", "false");
							}
							if (fieldOpts.width) {
								_5a._outerWidth(fieldOpts.width);
								fieldOpts.boxWidth = parseInt(_5a[0].style.width);
							} else {
								fieldOpts.auto = true;
							}
							_5a.css("text-align",
									(fieldOpts.halign || fieldOpts.align || ""));
							fieldOpts.cellClass = "datagrid-cell-c" + datagridIndex + "-"
									+ fieldOpts.field.replace(/\./g, "-");
							fieldOpts.cellSelector = "div." + fieldOpts.cellClass;
						} else {
							$("<div class=\"datagrid-cell-group\"></div>")
									.html(fieldOpts.title).appendTo(td);
						}
					}
					if (fieldOpts.hidden) {
						td.hide();
					}
				}
			}
			if (frozen && opts.rownumbers) {
				var td = $("<td rowspan=\""
						+ opts.frozenColumns.length
						+ "\"><div class=\"datagrid-header-rownumber\"></div></td>");
				if ($("tr", t).length == 0) {
					td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent()
							.appendTo($("tbody", t));
				} else {
					td.prependTo($("tr:first", t));
				}
			}
		};
		function fixColumnDivCss() {
			var ss = ["<style type=\"text/css\">"];
			var fields = getColumnFields(elem, true).concat(getColumnFields(elem));
			for (var i = 0; i < fields.length; i++) {
				var fieldOpts = getColumnOption(elem, fields[i]);
				if (fieldOpts && !fieldOpts.checkbox) {
					ss.push(fieldOpts.cellSelector + " {width:" + fieldOpts.boxWidth
							+ "px;}");
				}
			}
			ss.push("</style>");
			$(ss.join("\n")).prependTo(dc.view);
		};
	};
	function bindCellsEvents(elem) {
		var datagridData = $.data(elem, "datagrid");
		var panel = datagridData.panel;
		var opts = datagridData.options;
		var dc = datagridData.dc;
		var _62 = dc.header1.add(dc.header2);
		_62.find("input[type=checkbox]").unbind(".datagrid").bind(
				"click.datagrid", function(e) {
					if (opts.singleSelect && opts.selectOnCheck) {
						return false;
					}
					if ($(this).is(":checked")) {
						checkAll(elem);
					} else {
						clearChecked(elem);
					}
					e.stopPropagation();
				});
		var _63 = _62.find("div.datagrid-cell");
		_63.closest("td").unbind(".datagrid").bind("mouseenter.datagrid",
				function() {
					if (datagridData.resizing) {
						return;
					}
					$(this).addClass("datagrid-header-over");
				}).bind("mouseleave.datagrid", function() {
					$(this).removeClass("datagrid-header-over");
				}).bind("contextmenu.datagrid", function(e) {
					var _64 = $(this).attr("field");
					opts.onHeaderContextMenu.call(elem, e, _64);
				});
		_63.unbind(".datagrid").bind("click.datagrid", function(e) {
					var p1 = $(this).offset().left + 5;
					var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
					if (e.pageX < p2 && e.pageX > p1) {
						var _65 = $(this).parent().attr("field");
						var fieldOpts = getColumnOption(elem, _65);
						if (!fieldOpts.sortable || datagridData.resizing) {
							return;
						}
						opts.sortName = _65;
						opts.sortOrder = fieldOpts.order || "asc";
						var cls = "datagrid-sort-" + opts.sortOrder;
						if ($(this).hasClass("datagrid-sort-asc")) {
							cls = "datagrid-sort-desc";
							opts.sortOrder = "desc";
						} else {
							if ($(this).hasClass("datagrid-sort-desc")) {
								cls = "datagrid-sort-asc";
								opts.sortOrder = "asc";
							}
						}
						_63.removeClass("datagrid-sort-asc datagrid-sort-desc");
						$(this).addClass(cls);
						if (opts.remoteSort) {
							request(elem);
						} else {
							var _66 = $.data(elem, "datagrid").data;
							loadData(elem, _66);
						}
						opts.onSortColumn.call(elem, opts.sortName, opts.sortOrder);
					}
				}).bind("dblclick.datagrid", function(e) {
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			var _67 = opts.resizeHandle == "right"
					? (e.pageX > p2)
					: (opts.resizeHandle == "left"
							? (e.pageX < p1)
							: (e.pageX < p1 || e.pageX > p2));
			if (_67) {
				var _68 = $(this).parent().attr("field");
				var fieldOpts = getColumnOption(elem, _68);
				if (fieldOpts.resizable == false) {
					return;
				}
				$(elem).datagrid("autoSizeColumn", _68);
				fieldOpts.auto = false;
			}
		});
		var _69 = opts.resizeHandle == "right"
				? "e"
				: (opts.resizeHandle == "left" ? "w" : "e,w");
		_63.each(function() {
			$(this).resizable({
				handles : _69,
				disabled : ($(this).attr("resizable") ? $(this)
						.attr("resizable") == "false" : false),
				minWidth : 25,
				onStartResize : function(e) {
					datagridData.resizing = true;
					_62.css("cursor", $("body").css("cursor"));
					if (!datagridData.proxy) {
						datagridData.proxy = $("<div class=\"datagrid-resize-proxy\"></div>")
								.appendTo(dc.view);
					}
					datagridData.proxy.css({
								left : e.pageX - $(panel).offset().left - 1,
								display : "none"
							});
					setTimeout(function() {
								if (datagridData.proxy) {
									datagridData.proxy.show();
								}
							}, 500);
				},
				onResize : function(e) {
					datagridData.proxy.css({
								left : e.pageX - $(panel).offset().left - 1,
								display : "block"
							});
					return false;
				},
				onStopResize : function(e) {
					_62.css("cursor", "");
					var _6a = $(this).parent().attr("field");
					var fieldOpts = getColumnOption(elem, _6a);
					fieldOpts.width = $(this)._outerWidth();
					fieldOpts.boxWidth = parseInt(this.style.width);
					fieldOpts.auto = undefined;
					fixColumnSize(elem, _6a);
					datagridData.proxy.remove();
					datagridData.proxy = null;
					if ($(this).parents("div:first.datagrid-header").parent()
							.hasClass("datagrid-view1")) {
						fixDataGridHeight(elem);
					}
					fitColumn(elem);
					opts.onResizeColumn.call(elem, _6a, fieldOpts.width);
					setTimeout(function() {
								datagridData.resizing = false;
							}, 0);
				}
			});
		});
		dc.body1.add(dc.body2).unbind().bind("mouseover", function(e) {
					if (datagridData.resizing) {
						return;
					}
					var tr = $(e.target).closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					var index = getIndexByTr(tr);
					opts.finder.getTr(elem, index).addClass("datagrid-row-over");
					e.stopPropagation();
				}).bind("mouseout", function(e) {
					var tr = $(e.target).closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					var index = getIndexByTr(tr);
					opts.finder.getTr(elem, index).removeClass("datagrid-row-over");
					e.stopPropagation();
				}).bind("click", function(e) {
					var tt = $(e.target);
					var tr = tt.closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					var _6e = getIndexByTr(tr);
					if (tt.parent().hasClass("datagrid-cell-check")) {
						if (opts.singleSelect && opts.selectOnCheck) {
							if (!opts.checkOnSelect) {
								clearChecked(elem, true);
							}
							checkRow(elem, _6e);
						} else {
							if (tt.is(":checked")) {
								checkRow(elem, _6e);
							} else {
								uncheckRow(elem, _6e);
							}
						}
					} else {
						var row = opts.finder.getRow(elem, _6e);
						var td = tt.closest("td[field]", tr);
						if (td.length) {
							var _6f = td.attr("field");
							opts.onClickCell.call(elem, _6e, _6f, row[_6f]);
						}
						if (opts.singleSelect == true) {
							selectRow(elem, _6e);
						} else {
							if (tr.hasClass("datagrid-row-selected")) {
								unselectRow(elem, _6e);
							} else {
								selectRow(elem, _6e);
							}
						}
						opts.onClickRow.call(elem, _6e, row);
					}
					e.stopPropagation();
				}).bind("dblclick", function(e) {
					var tt = $(e.target);
					var tr = tt.closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					var _70 = getIndexByTr(tr);
					var row = opts.finder.getRow(elem, _70);
					var td = tt.closest("td[field]", tr);
					if (td.length) {
						var _71 = td.attr("field");
						opts.onDblClickCell.call(elem, _70, _71, row[_71]);
					}
					opts.onDblClickRow.call(elem, _70, row);
					e.stopPropagation();
				}).bind("contextmenu", function(e) {
					var tr = $(e.target).closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					var _72 = getIndexByTr(tr);
					var row = opts.finder.getRow(elem, _72);
					opts.onRowContextMenu.call(elem, e, _72, row);
					e.stopPropagation();
				});
		dc.body2.bind("scroll", function() {
					dc.view1.children("div.datagrid-body").scrollTop($(this)
							.scrollTop());
					dc.view2
							.children("div.datagrid-header,div.datagrid-footer")
							._scrollLeft($(this)._scrollLeft());
					dc.body2.children("table.datagrid-btable-frozen").css(
							"left", -$(this)._scrollLeft());
				});
		function getIndexByTr(tr) {
			if (tr.attr("datagrid-row-index")) {
				return parseInt(tr.attr("datagrid-row-index"));
			} else {
				return tr.attr("node-id");
			}
		};
	};
	function fitColumn(elem) {
		var _75 = $.data(elem, "datagrid").options;
		var dc = $.data(elem, "datagrid").dc;
		if (!_75.fitColumns) {
			return;
		}
		var _76 = dc.view2.children("div.datagrid-header");
		var _77 = 0;
		var _78;
		var _79 = getColumnFields(elem, false);
		for (var i = 0; i < _79.length; i++) {
			var fieldOpts = getColumnOption(elem, _79[i]);
			if (_7a(fieldOpts)) {
				_77 += fieldOpts.width;
				_78 = fieldOpts;
			}
		}
		var _7b = _76.children("div.datagrid-header-inner").show();
		var _7c = _76.width() - _76.find("table").width() - _75.scrollbarSize;
		var _7d = _7c / _77;
		if (!_75.showHeader) {
			_7b.hide();
		}
		for (var i = 0; i < _79.length; i++) {
			var fieldOpts = getColumnOption(elem, _79[i]);
			if (_7a(fieldOpts)) {
				var _7e = Math.floor(fieldOpts.width * _7d);
				_7f(fieldOpts, _7e);
				_7c -= _7e;
			}
		}
		if (_7c && _78) {
			_7f(_78, _7c);
		}
		fixColumnSize(elem);
		function _7f(fieldOpts, _80) {
			fieldOpts.width += _80;
			fieldOpts.boxWidth += _80;
			_76.find("td[field=\"" + fieldOpts.field + "\"] div.datagrid-cell")
					.width(fieldOpts.boxWidth);
		};
		function _7a(fieldOpts) {
			if (!fieldOpts.hidden && !fieldOpts.checkbox && !fieldOpts.auto) {
				return true;
			}
		};
	};
	function autoSizeColumn(_82, _83) {
		var _84 = $.data(_82, "datagrid").options;
		var dc = $.data(_82, "datagrid").dc;
		if (_83) {
			setSize(_83);
			if (_84.fitColumns) {
				fixDataGridHeight(_82);
				fitColumn(_82);
			}
		} else {
			var _85 = false;
			var _86 = getColumnFields(_82, true).concat(getColumnFields(_82, false));
			for (var i = 0; i < _86.length; i++) {
				var _83 = _86[i];
				var fieldOpts = getColumnOption(_82, _83);
				if (fieldOpts.auto) {
					setSize(_83);
					_85 = true;
				}
			}
			if (_85 && _84.fitColumns) {
				fixDataGridHeight(_82);
				fitColumn(_82);
			}
		}
		function setSize(_87) {
			var _88 = dc.view.find("div.datagrid-header td[field=\"" + _87
					+ "\"] div.datagrid-cell");
			_88.css("width", "");
			var fieldOpts = $(_82).datagrid("getColumnOption", _87);
			fieldOpts.width = undefined;
			fieldOpts.boxWidth = undefined;
			fieldOpts.auto = true;
			$(_82).datagrid("fixColumnSize", _87);
			var _89 = Math.max(_88._outerWidth(), _8a("allbody"),
					_8a("allfooter"));
			_88._outerWidth(_89);
			fieldOpts.width = _89;
			fieldOpts.boxWidth = parseInt(_88[0].style.width);
			$(_82).datagrid("fixColumnSize", _87);
			_84.onResizeColumn.call(_82, _87, fieldOpts.width);
			function _8a(_8b) {
				var _8c = 0;
				_84.finder.getTr(_82, 0, _8b).find("td[field=\"" + _87
						+ "\"] div.datagrid-cell").each(function() {
							var w = $(this)._outerWidth();
							if (_8c < w) {
								_8c = w;
							}
						});
				return _8c;
			};
		};
	};
	function fixColumnSize(elem, _8e) {
		var _8f = $.data(elem, "datagrid").options;
		var dc = $.data(elem, "datagrid").dc;
		var _90 = dc.view.find("table.datagrid-btable,table.datagrid-ftable");
		_90.css("table-layout", "fixed");
		if (_8e) {
			fix(_8e);
		} else {
			var ff = getColumnFields(elem, true).concat(getColumnFields(elem, false));
			for (var i = 0; i < ff.length; i++) {
				fix(ff[i]);
			}
		}
		_90.css("table-layout", "auto");
		fixCellWidth(elem);
		setTimeout(function() {
					fixRowHeight(elem);
					_9a(elem);
				}, 0);
		function fix(_92) {
			var fieldOpts = getColumnOption(elem, _92);
			if (fieldOpts.checkbox) {
				return;
			}
			var _93 = dc.view.children("style")[0];
			var _94 = _93.styleSheet
					? _93.styleSheet
					: (_93.sheet || document.styleSheets[document.styleSheets.length
							- 1]);
			var _95 = _94.cssRules || _94.rules;
			for (var i = 0, len = _95.length; i < len; i++) {
				var _96 = _95[i];
				if (_96.selectorText.toLowerCase() == fieldOpts.cellSelector
						.toLowerCase()) {
					_96.style["width"] = fieldOpts.boxWidth
							? fieldOpts.boxWidth + "px"
							: "auto";
					break;
				}
			}
		};
	};
	function fixCellWidth(elem) {
		var dc = $.data(elem, "datagrid").dc;
		dc.body1.add(dc.body2).find("td.datagrid-td-merged").each(function() {
					var td = $(this);
					var _98 = td.attr("colspan") || 1;
					var _99 = getColumnOption(elem, td.attr("field")).width;
					for (var i = 1; i < _98; i++) {
						td = td.next();
						_99 += getColumnOption(elem, td.attr("field")).width + 1;
					}
					$(this).children("div.datagrid-cell")._outerWidth(_99);
				});
	};
	function _9a(elem) {
		var dc = $.data(elem, "datagrid").dc;
		dc.view.find("div.datagrid-editable").each(function() {
					var _9c = $(this);
					var _9d = _9c.parent().attr("field");
					var fieldOpts = $(elem).datagrid("getColumnOption", _9d);
					_9c._outerWidth(fieldOpts.width);
					var ed = $.data(this, "datagrid.editor");
					if (ed.actions.resize) {
						ed.actions.resize(ed.target, _9c.width());
					}
				});
	};
	function getColumnOption(elem, field) {
		function _a0(_a1) {
			if (_a1) {
				for (var i = 0; i < _a1.length; i++) {
					var cc = _a1[i];
					for (var j = 0; j < cc.length; j++) {
						var c = cc[j];
						if (c.field == field) {
							return c;
						}
					}
				}
			}
			return null;
		};
		var _a2 = $.data(elem, "datagrid").options;
		var fieldOpts = _a0(_a2.columns);
		if (!fieldOpts) {
			fieldOpts = _a0(_a2.frozenColumns);
		}
		return fieldOpts;
	};
	function getColumnFields(elem, _a4) {
		var _a5 = $.data(elem, "datagrid").options;
		var _a6 = (_a4 == true) ? (_a5.frozenColumns || [[]]) : _a5.columns;
		if (_a6.length == 0) {
			return [];
		}
		var _a7 = [];
		function _a8(_a9) {
			var c = 0;
			var i = 0;
			while (true) {
				if (_a7[i] == undefined) {
					if (c == _a9) {
						return i;
					}
					c++;
				}
				i++;
			}
		};
		function _aa(r) {
			var ff = [];
			var c = 0;
			for (var i = 0; i < _a6[r].length; i++) {
				var fieldOpts = _a6[r][i];
				if (fieldOpts.field) {
					ff.push([c, fieldOpts.field]);
				}
				c += parseInt(fieldOpts.colspan || "1");
			}
			for (var i = 0; i < ff.length; i++) {
				ff[i][0] = _a8(ff[i][0]);
			}
			for (var i = 0; i < ff.length; i++) {
				var f = ff[i];
				_a7[f[0]] = f[1];
			}
		};
		for (var i = 0; i < _a6.length; i++) {
			_aa(i);
		}
		return _a7;
	};
	function loadData(elem, _ad) {
		var _ae = $.data(elem, "datagrid");
		var _af = _ae.options;
		var dc = _ae.dc;
		_ad = _af.loadFilter.call(elem, _ad);
		_ad.total = parseInt(_ad.total);
		_ae.data = _ad;
		if (_ad.footer) {
			_ae.footer = _ad.footer;
		}
		if (!_af.remoteSort) {
			var opt = getColumnOption(elem, _af.sortName);
			if (opt) {
				var _b0 = opt.sorter || function(a, b) {
					return (a > b ? 1 : -1);
				};
				_ad.rows.sort(function(r1, r2) {
							return _b0(r1[_af.sortName], r2[_af.sortName])
									* (_af.sortOrder == "asc" ? 1 : -1);
						});
			}
		}
		if (_af.view.onBeforeRender) {
			_af.view.onBeforeRender.call(_af.view, elem, _ad.rows);
		}
		_af.view.render.call(_af.view, elem, dc.body2, false);
		_af.view.render.call(_af.view, elem, dc.body1, true);
		if (_af.showFooter) {
			_af.view.renderFooter.call(_af.view, elem, dc.footer2, false);
			_af.view.renderFooter.call(_af.view, elem, dc.footer1, true);
		}
		if (_af.view.onAfterRender) {
			_af.view.onAfterRender.call(_af.view, elem);
		}
		dc.view.children("style:gt(0)").remove();
		_af.onLoadSuccess.call(elem, _ad);
		var _b1 = $(elem).datagrid("getPager");
		if (_b1.length) {
			if (_b1.pagination("options").total != _ad.total) {
				_b1.pagination("refresh", {
							total : _ad.total
						});
			}
		}
		fixRowHeight(elem);
		dc.body2.triggerHandler("scroll");
		_b2();
		$(elem).datagrid("autoSizeColumn");
		function _b2() {
			if (_af.idField) {
				for (var i = 0; i < _ad.rows.length; i++) {
					var row = _ad.rows[i];
					if (_b3(_ae.selectedRows, row)) {
						selectRow(elem, i, true);
					}
					if (_b3(_ae.checkedRows, row)) {
						checkRow(elem, i, true);
					}
				}
			}
			function _b3(a, r) {
				for (var i = 0; i < a.length; i++) {
					if (a[i][_af.idField] == r[_af.idField]) {
						a[i] = r;
						return true;
					}
				}
				return false;
			};
		};
	};
	function getRowIndex(elem, row) {
		var _b6 = $.data(elem, "datagrid").options;
		var _b7 = $.data(elem, "datagrid").data.rows;
		if (typeof row == "object") {
			return getEqIndex(_b7, row);
		} else {
			for (var i = 0; i < _b7.length; i++) {
				if (_b7[i][_b6.idField] == row) {
					return i;
				}
			}
			return -1;
		}
	};
	function getSelections(elem) {
		var datagridData = $.data(elem, "datagrid");
		var opts = datagridData.options;
		var _bc = datagridData.data;
		if (opts.idField) {
			return datagridData.selectedRows;
		} else {
			var _bd = [];
			opts.finder.getTr(elem, "", "selected", 2).each(function() {
						var _be = parseInt($(this).attr("datagrid-row-index"));
						_bd.push(_bc.rows[_be]);
					});
			return _bd;
		}
	};
	function getChecked(elem) {
		var _c1 = $.data(elem, "datagrid");
		var _c2 = _c1.options;
		if (_c2.idField) {
			return _c1.checkedRows;
		} else {
			var _c3 = [];
			_c1.dc.view.find("div.datagrid-cell-check input:checked").each(
					function() {
						var _c4 = $(this).closest("tr.datagrid-row")
								.attr("datagrid-row-index");
						_c3.push(_c2.finder.getRow(elem, _c4));
					});
			return _c3;
		}
	};
	function selectRecord(elem, _c7) {
		var _c8 = $.data(elem, "datagrid").options;
		if (_c8.idField) {
			var _c9 = getRowIndex(elem, _c7);
			if (_c9 >= 0) {
				selectRow(elem, _c9);
			}
		}
	};
	function selectRow(elem, _cc, _cd) {
		var _ce = $.data(elem, "datagrid");
		var dc = _ce.dc;
		var _cf = _ce.options;
		var _d0 = _ce.selectedRows;
		if (_cf.singleSelect) {
			clearSelections(elem);
			_d0.splice(0, _d0.length);
		}
		if (!_cd && _cf.checkOnSelect) {
			checkRow(elem, _cc, true);
		}
		var row = _cf.finder.getRow(elem, _cc);
		if (_cf.idField) {
			addUniqueAttrrE(_d0, _cf.idField, row);
		}
		_cf.onSelect.call(elem, _cc, row);
		var tr = _cf.finder.getTr(elem, _cc).addClass("datagrid-row-selected");
		if (tr.length) {
			if (tr.closest("table").hasClass("datagrid-btable-frozen")) {
				return;
			}
			var _d3 = dc.view2.children("div.datagrid-header")._outerHeight();
			var _d4 = dc.body2;
			var _d5 = _d4.outerHeight(true) - _d4.outerHeight();
			var top = tr.position().top - _d3 - _d5;
			if (top < 0) {
				_d4.scrollTop(_d4.scrollTop() + top);
			} else {
				if (top + tr._outerHeight() > _d4.height() - 18) {
					_d4.scrollTop(_d4.scrollTop() + top + tr._outerHeight()
							- _d4.height() + 18);
				}
			}
		}
	};
	function unselectRow(elem, _d8, _d9) {
		var _da = $.data(elem, "datagrid");
		var dc = _da.dc;
		var _db = _da.options;
		var _dc = $.data(elem, "datagrid").selectedRows;
		if (!_d9 && _db.checkOnSelect) {
			uncheckRow(elem, _d8, true);
		}
		_db.finder.getTr(elem, _d8).removeClass("datagrid-row-selected");
		var row = _db.finder.getRow(elem, _d8);
		if (_db.idField) {
			delByE(_dc, _db.idField, row[_db.idField]);
		}
		_db.onUnselect.call(elem, _d8, row);
	};
	function selectAll(elem, _e0) {
		var _e1 = $.data(elem, "datagrid");
		var opts = _e1.options;
		var _e3 = _e1.data.rows;
		var _e4 = $.data(elem, "datagrid").selectedRows;
		if (!_e0 && opts.checkOnSelect) {
			checkAll(elem, true);
		}
		opts.finder.getTr(elem, "", "allbody").addClass("datagrid-row-selected");
		if (opts.idField) {
			for (var _e6 = 0; _e6 < _e3.length; _e6++) {
				addUniqueAttrrE(_e4, opts.idField, _e3[_e6]);
			}
		}
		opts.onSelectAll.call(elem, _e3);
	};
	function clearSelections(elem, _e8) {
		var _e9 = $.data(elem, "datagrid");
		var _ea = _e9.options;
		var _eb = _e9.data.rows;
		var _ec = $.data(elem, "datagrid").selectedRows;
		if (!_e8 && _ea.checkOnSelect) {
			clearChecked(elem, true);
		}
		_ea.finder.getTr(elem, "", "selected")
				.removeClass("datagrid-row-selected");
		if (_ea.idField) {
			for (var _ee = 0; _ee < _eb.length; _ee++) {
				delByE(_ec, _ea.idField, _eb[_ee][_ea.idField]);
			}
		}
		_ea.onUnselectAll.call(elem, _eb);
	};
	function checkRow(elem, _f0, _f1) {
		var _f2 = $.data(elem, "datagrid");
		var opts = _f2.options;
		if (!_f1 && opts.selectOnCheck) {
			selectRow(elem, _f0, true);
		}
		var ck = opts.finder.getTr(elem, _f0)
				.find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", true);
		ck = opts.finder
				.getTr(elem, "", "allbody")
				.find("div.datagrid-cell-check input[type=checkbox]:not(:checked)");
		if (!ck.length) {
			var dc = _f2.dc;
			var _f4 = dc.header1.add(dc.header2);
			_f4.find("input[type=checkbox]")._propAttr("checked", true);
		}
		var row = opts.finder.getRow(elem, _f0);
		if (opts.idField) {
			addUniqueAttrrE(_f2.checkedRows, opts.idField, row);
		}
		opts.onCheck.call(elem, _f0, row);
	};
	function uncheckRow(elem, _f6, _f7) {
		var _f8 = $.data(elem, "datagrid");
		var _f9 = _f8.options;
		if (!_f7 && _f9.selectOnCheck) {
			unselectRow(elem, _f6, true);
		}
		var ck = _f9.finder.getTr(elem, _f6)
				.find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", false);
		var dc = _f8.dc;
		var _fa = dc.header1.add(dc.header2);
		_fa.find("input[type=checkbox]")._propAttr("checked", false);
		var row = _f9.finder.getRow(elem, _f6);
		if (_f9.idField) {
			delByE(_f8.checkedRows, _f9.idField, row[_f9.idField]);
		}
		_f9.onUncheck.call(elem, _f6, row);
	};
	function checkAll(elem, _fc) {
		var _fd = $.data(elem, "datagrid");
		var _fe = _fd.options;
		var _ff = _fd.data.rows;
		if (!_fc && _fe.selectOnCheck) {
			selectAll(elem, true);
		}
		var dc = _fd.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = _fe.finder.getTr(elem, "", "allbody")
				.find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", true);
		if (_fe.idField) {
			for (var i = 0; i < _ff.length; i++) {
				addUniqueAttrrE(_fd.checkedRows, _fe.idField, _ff[i]);
			}
		}
		_fe.onCheckAll.call(elem, _ff);
	};
	function clearChecked(elem, _101) {
		var _102 = $.data(elem, "datagrid");
		var opts = _102.options;
		var rows = _102.data.rows;
		if (!_101 && opts.selectOnCheck) {
			clearSelections(elem, true);
		}
		var dc = _102.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = opts.finder.getTr(elem, "", "allbody")
				.find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", false);
		if (opts.idField) {
			for (var i = 0; i < rows.length; i++) {
				delByE(_102.checkedRows, opts.idField, rows[i][opts.idField]);
			}
		}
		opts.onUncheckAll.call(elem, rows);
	};
	function beginEdit(elem, index) {
		var opts = $.data(elem, "datagrid").options;
		var tr = opts.finder.getTr(elem, index);
		var row = opts.finder.getRow(elem, index);
		if (tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (opts.onBeforeEdit.call(elem, index, row) == false) {
			return;
		}
		tr.addClass("datagrid-row-editing");
		_106(elem, index);
		_9a(elem);
		tr.find("div.datagrid-editable").each(function() {
					var _107 = $(this).parent().attr("field");
					var ed = $.data(this, "datagrid.editor");
					ed.actions.setValue(ed.target, row[_107]);
				});
		validateRow(elem, index);
	};
	function endEdit(elem, _10b, _10c) {
		var opts = $.data(elem, "datagrid").options;
		var _10d = $.data(elem, "datagrid").updatedRows;
		var _10e = $.data(elem, "datagrid").insertedRows;
		var tr = opts.finder.getTr(elem, _10b);
		var row = opts.finder.getRow(elem, _10b);
		if (!tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (!_10c) {
			if (!validateRow(elem, _10b)) {
				return;
			}
			var _10f = false;
			var _110 = {};
			tr.find("div.datagrid-editable").each(function() {
						var _111 = $(this).parent().attr("field");
						var ed = $.data(this, "datagrid.editor");
						var _112 = ed.actions.getValue(ed.target);
						if (row[_111] != _112) {
							row[_111] = _112;
							_10f = true;
							_110[_111] = _112;
						}
					});
			if (_10f) {
				if (getEqIndex(_10e, row) == -1) {
					if (getEqIndex(_10d, row) == -1) {
						_10d.push(row);
					}
				}
			}
		}
		tr.removeClass("datagrid-row-editing");
		_113(elem, _10b);
		$(elem).datagrid("refreshRow", _10b);
		if (!_10c) {
			opts.onAfterEdit.call(elem, _10b, row, _110);
		} else {
			opts.onCancelEdit.call(elem, _10b, row);
		}
	};
	function getEditors(elem, index) {
		var opts = $.data(elem, "datagrid").options;
		var tr = opts.finder.getTr(elem, index);
		var editors = [];
		tr.children("td").each(function() {
					var cell = $(this).find("div.datagrid-editable");
					if (cell.length) {
						var ed = $.data(cell[0], "datagrid.editor");
						editors.push(ed);
					}
				});
		return editors;
	};
	/**
	 * 获取列的编辑器
	 * @param elem 与datagrid数据相关联的dom节点
	 * @param options 对象包括 index：
	 */
	function getEditor(elem, options) {
		var editors = getEditors(elem, options.index);
		for (var i = 0; i < editors.length; i++) {
			if (editors[i].field == options.field) {
				return editors[i];
			}
		}
		return null;
	};
	function _106(elem, _11d) {
		var opts = $.data(elem, "datagrid").options;
		var tr = opts.finder.getTr(elem, _11d);
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-cell");
			var _11e = $(this).attr("field");
			var fieldOpts = getColumnOption(elem, _11e);
			if (fieldOpts && fieldOpts.editor) {
				var _11f, _120;
				if (typeof fieldOpts.editor == "string") {
					_11f = fieldOpts.editor;
				} else {
					_11f = fieldOpts.editor.type;
					_120 = fieldOpts.editor.options;
				}
				var _121 = opts.editors[_11f];
				if (_121) {
					var _122 = cell.html();
					var _123 = cell._outerWidth();
					cell.addClass("datagrid-editable");
					cell._outerWidth(_123);
					cell
							.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
					cell.children("table").bind("click dblclick contextmenu",
							function(e) {
								e.stopPropagation();
							});
					$.data(cell[0], "datagrid.editor", {
								actions : _121,
								target : _121.init(cell.find("td"), _120),
								field : _11e,
								type : _11f,
								oldHtml : _122
							});
				}
			}
		});
		fixRowHeight(elem, _11d, true);
	};
	function _113(elem, index) {
		var opts = $.data(elem, "datagrid").options;
		var tr = opts.finder.getTr(elem, index);
		tr.children("td").each(function() {
					var cell = $(this).find("div.datagrid-editable");
					if (cell.length) {
						var ed = $.data(cell[0], "datagrid.editor");
						if (ed.actions.destroy) {
							ed.actions.destroy(ed.target);
						}
						cell.html(ed.oldHtml);
						$.removeData(cell[0], "datagrid.editor");
						cell.removeClass("datagrid-editable");
						cell.css("width", "");
					}
				});
	};
	function validateRow(elem, index) {
		var tr = $.data(elem, "datagrid").options.finder.getTr(elem, index);
		if (!tr.hasClass("datagrid-row-editing")) {
			return true;
		}
		var vbox = tr.find(".validatebox-text");
		vbox.validatebox("validate");
		vbox.trigger("mouseleave");
		var invalid = tr.find(".validatebox-invalid");
		return invalid.length == 0;
	};
	/**
	 * 获取最后一次提交以来更改的行，type 参数表示更改的行的类型，可能的值是：inserted、deleted、updated，等等。
	 * 当 type 参数没有分配时，返回所有改变的行。
	 */
	function getChanges(elem, type) {
		var insertedRows = $.data(elem, "datagrid").insertedRows;
		var deletedRows = $.data(elem, "datagrid").deletedRows;
		var updatedRows = $.data(elem, "datagrid").updatedRows;
		if (!type) {
			var rows = [];
			rows = rows.concat(insertedRows);
			rows = rows.concat(deletedRows);
			rows = rows.concat(updatedRows);
			return rows;
		} else {
			if (type == "inserted") {
				return insertedRows;
			} else {
				if (type == "deleted") {
					return deletedRows;
				} else {
					if (type == "updated") {
						return updatedRows;
					}
				}
			}
		}
		return [];
	};
	/**
	 * 根据索引删除一行
	 */
	function deleteRow(elem, index) {
		var datagridData = $.data(elem, "datagrid");
		var opts = datagridData.options;
		var data = datagridData.data;
		var inserted = datagridData.insertedRows;
		var deleted = datagridData.deletedRows;
		$(elem).datagrid("cancelEdit", index);
		var row = data.rows[index];
		if (getEqIndex(inserted, row) >= 0) {
			delByE(inserted, row);
		} else {
			deleted.push(row);
		}
		delByE(datagridData.selectedRows, opts.idField, data.rows[index][opts.idField]);
		delByE(datagridData.checkedRows, opts.idField, data.rows[index][opts.idField]);
		opts.view.deleteRow.call(opts.view, elem, index);
		if (opts.height == "auto") {
			fixRowHeight(elem);
		}
		$(elem).datagrid("getPager").pagination("refresh", {
					total : data.total
				});
	};
	/**
	 * 插入一行
	 * param包含index及row
	 */
	function insertRow(elem, param) {
		var data = $.data(elem, "datagrid").data;
		var view = $.data(elem, "datagrid").options.view;
		var rows = $.data(elem, "datagrid").insertedRows;
		view.insertRow.call(view, elem, param.index, param.row);
		rows.push(param.row);
		$(elem).datagrid("getPager").pagination("refresh", {
					total : data.total
				});
	};
	/**
	 * 在末尾增加一行
	 */
	function appendRow(elem, row) {
		var data = $.data(elem, "datagrid").data;
		var view = $.data(elem, "datagrid").options.view;
		var rows = $.data(elem, "datagrid").insertedRows;
		view.insertRow.call(view, elem, null, row);
		rows.push(row);
		$(elem).datagrid("getPager").pagination("refresh", {
					total : data.total
				});
	};
	/**
	 * 缓存数据，记录原始的data数据
	 */
	function cacheRows(elem) {
		var datagridData = $.data(elem, "datagrid");
		var data = datagridData.data;
		var rows = data.rows;
		var arr = [];
		for (var i = 0; i < rows.length; i++) {
			arr.push($.extend({}, rows[i]));//copy一份新数据保存
		}
		datagridData.originalRows = arr;
		datagridData.updatedRows = [];
		datagridData.insertedRows = [];
		datagridData.deletedRows = [];
	};
	/**
	 * 更新缓存数据，更新原始数据
	 */
	function acceptChanges(elem) {
		var data = $.data(elem, "datagrid").data;
		var ok = true;
		for (var i = 0, len = data.rows.length; i < len; i++) {
			if (validateRow(elem, i)) {
				endEdit(elem, i, false);
			} else {
				ok = false;
			}
		}
		if (ok) {
			cacheRows(elem);
		}
	};
	/**
	 * 回滚自从创建以来或最后一次调用acceptChanges以来所有更改的数据。
	 */
	function rejectChanges(elem) {
		var datagridData = $.data(elem, "datagrid");
		var opts = datagridData.options;
		var originalRows = datagridData.originalRows;
		var insertedRows = datagridData.insertedRows;
		var deletedRows = datagridData.deletedRows;
		var selectedRows = datagridData.selectedRows;
		var checkedRows = datagridData.checkedRows;
		var data = datagridData.data;
		function _14a(a) {
			var ids = [];
			for (var i = 0; i < a.length; i++) {
				ids.push(a[i][opts.idField]);
			}
			return ids;
		};
		function _14b(ids, _14c) {
			for (var i = 0; i < ids.length; i++) {
				var _14d = getRowIndex(elem, ids[i]);
				(_14c == "s" ? selectRow : checkRow)(elem, _14d, true);
			}
		};
		for (var i = 0; i < data.rows.length; i++) {
			endEdit(elem, i, true);
		}
		var _14e = _14a(selectedRows);
		var _14f = _14a(checkedRows);
		selectedRows.splice(0, selectedRows.length);
		checkedRows.splice(0, checkedRows.length);
		data.total += deletedRows.length - insertedRows.length;
		data.rows = originalRows;
		loadData(elem, data);
		_14b(_14e, "s");
		_14b(_14f, "c");
		cacheRows(elem);
	};
	/**
	 * 异步请求数据并载入数据
	 */
	function request(elem, queryParam) {
		var opts = $.data(elem, "datagrid").options;
		if (queryParam) {
			opts.queryParams = queryParam;
		}
		var c_queryParams = $.extend({}, opts.queryParams);
		if (opts.pagination) {
			$.extend(c_queryParams, {
						page : opts.pageNumber,
						rows : opts.pageSize
					});
		}
		if (opts.sortName) {
			$.extend(c_queryParams, {
						sort : opts.sortName,
						order : opts.sortOrder
					});
		}
		//请求数据前的事件函数
		if (opts.onBeforeLoad.call(elem, c_queryParams) == false) {
			return;
		}
		$(elem).datagrid("loading");
		setTimeout(function() {
					ajaxRequest();
				}, 0);
		function ajaxRequest() {
			var flag = opts.loader.call(elem, c_queryParams, function(data) {
						setTimeout(function() {$(elem).datagrid("loaded");}, 0);
						loadData(elem, data);
						setTimeout(function() {cacheRows(elem);}, 0);
					}, function() {
						setTimeout(function() {
									$(elem).datagrid("loaded");
								}, 0);
						opts.onLoadError.apply(elem, arguments);
					});
			if (flag == false) {//这种情况是url没设定
				$(elem).datagrid("loaded");
			}
		};
	};
	/**
	 * 把一些单元格合并为一个单元格，options 参数包括下列特性：
	 * index：列的索引。
	 *field：字段名。
	 *rowspan：合并跨越的行数。
	 *colspan：合并跨越的列数。
	 */
	function mergeCells(elem, options) {
		var opts = $.data(elem, "datagrid").options;
		options.rowspan = options.rowspan || 1;
		options.colspan = options.colspan || 1;
		if (options.rowspan == 1 && options.colspan == 1) {
			return;
		}
		var tr = opts.finder.getTr(elem, (options.index != undefined
						? options.index
						: options.id));
		if (!tr.length) {
			return;
		}
		var row = opts.finder.getRow(elem, tr);
		var fieldValue = row[options.field];
		var td = tr.find("td[field=\"" + options.field + "\"]");
		td.attr("rowspan", options.rowspan).attr("colspan", options.colspan);
		td.addClass("datagrid-td-merged");
		for (var i = 1; i < options.colspan; i++) {
			td = td.next();
			td.hide();
			row[td.attr("field")] = fieldValue;
		}
		for (var i = 1; i < options.rowspan; i++) {
			tr = tr.next();
			if (!tr.length) {
				break;
			}
			var row = opts.finder.getRow(elem, tr);
			var td = tr.find("td[field=\"" + options.field + "\"]").hide();
			row[td.attr("field")] = fieldValue;
			for (var j = 1; j < options.colspan; j++) {
				td = td.next();
				td.hide();
				row[td.attr("field")] = fieldValue;
			}
		}
		fixCellWidth(elem);
	};
	/**
	 * datagrid入口方法
	 */
	$.fn.datagrid = function(options, param) {
		if (typeof options == "string") {//如果options是string类型，则是方法调用
			return $.fn.datagrid.methods[options](this, param);
		}
		/**
		 * 如果options不是string类型，则初始化、构造datagrid
		 */
		options = options || {};
		return this.each(function() {
					var datagridData = $.data(this, "datagrid");
					var opts;
					if (datagridData) {//如果datagridData存在，则说明与该节点的datagrid（对象）已构造存在
						opts = $.extend(datagridData.options, options);
						datagridData.options = opts;//给datagrid以给定options属性覆盖原有的options属性
					} else {//构造datagrid
						opts = $.extend({}, //datagrid 的配置属性由多个因素决定默认是defaults，然后由页面的配置决定，最后有传入的对象属性覆盖
										$.extend({},$.fn.datagrid.defaults, {queryParams : {}}), $.fn.datagrid.parseOptions(this),
										options
								);
						$(this).css("width", "").css("height", "");//隐藏原始的table
						var wrapResult = wrapGrid(this, opts.rownumbers);//获取datagrid的框架
						if (!opts.columns) {
							opts.columns = wrapResult.columns;
						}
						if (!opts.frozenColumns) {
							opts.frozenColumns = wrapResult.frozenColumns;
						}
						opts.columns = $.extend(true, [], opts.columns);
						opts.frozenColumns = $.extend(true, [],
								opts.frozenColumns);
						opts.view = $.extend({}, opts.view);
						//绑定datagrid数据到dom节点上去
						$.data(this, "datagrid", {
									options : opts,
									panel : wrapResult.panel,
									dc : wrapResult.dc,
									selectedRows : [],
									checkedRows : [],
									data : {
										total : 0,
										rows : []
									},
									originalRows : [],
									updatedRows : [],
									insertedRows : [],
									deletedRows : []
								});
					}
					initDatagrid(this);
					if (opts.data) {//如opts中的data是有值的，则载入该值
						loadData(this, opts.data);
						cacheRows(this);
					} else {//否则，则从页面获取的数据载入
						var data = getData(this);
						if (data.total > 0) {
							loadData(this, data);
							cacheRows(this);
						}
					}
					setSize(this);
					request(this);
					bindCellsEvents(this);
				});
	};
	var editorsObj = {
		text : {
			init : function(container, options) {
				var gridInput = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
				return gridInput;
			},
			getValue : function(target) {
				return $(target).val();
			},
			setValue : function(target, value) {
				$(target).val(value);
			},
			resize : function(target, width) {
				$(target)._outerWidth(width);
			}
		},
		textarea : {
			init : function(container, options) {
				var gridTextAreaObj = $("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(container);
				return gridTextAreaObj;
			},
			getValue : function(target) {
				return $(target).val();
			},
			setValue : function(target, value) {
				$(target).val(value);
			},
			resize : function(target, width) {
				$(target)._outerWidth(width);
			}
		},
		checkbox : {
			init : function(container, options) {
				var gridCheckBoxObj = $("<input type=\"checkbox\">").appendTo(container);
				gridCheckBoxObj.val(options.on);
				gridCheckBoxObj.attr("offval", options.off);
				return gridCheckBoxObj;
			},
			getValue : function(target) {
				if ($(target).is(":checked")) {
					return $(target).val();
				} else {
					return $(target).attr("offval");
				}
			},
			setValue : function(target, value) {
				var checked = false;
				if ($(target).val() == value) {
					checked = true;
				}
				$(target)._propAttr("checked", checked);
			}
		},
		numberbox : {
			init : function(container, options) {
				var gridNumBoxObj = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
				gridNumBoxObj.numberbox(options);
				return gridNumBoxObj;
			},
			destroy : function(target) {
				$(target).numberbox("destroy");
			},
			getValue : function(target) {
				$(target).blur();
				return $(target).numberbox("getValue");
			},
			setValue : function(target, value) {
				$(target).numberbox("setValue", value);
			},
			resize : function(target, width) {
				$(target)._outerWidth(width);
			}
		},
		validatebox : {
			init : function(container, options) {
				var gridvalidateBoxObj = $("<input type=\"text\" class=\"datagrid-editable-input\">")
						.appendTo(container);
				gridvalidateBoxObj.validatebox(options);
				return gridvalidateBoxObj;
			},
			destroy : function(target) {
				$(target).validatebox("destroy");
			},
			getValue : function(target) {
				return $(target).val();
			},
			setValue : function(target, value) {
				$(target).val(value);
			},
			resize : function(target, width) {
				$(target)._outerWidth(width);
			}
		},
		datebox : {
			init : function(container, options) {
				var gridDateBoxObj = $("<input type=\"text\">").appendTo(container);
				gridDateBoxObj.datebox(options);
				return gridDateBoxObj;
			},
			destroy : function(container) {
				$(container).datebox("destroy");
			},
			getValue : function(container) {
				return $(container).datebox("getValue");
			},
			setValue : function(container, value) {
				$(container).datebox("setValue", value);
			},
			resize : function(container, width) {
				$(container).datebox("resize", width);
			}
		},
		combobox : {
			init : function(container, options) {
				var gridcomboxObj = $("<input type=\"text\">").appendTo(container);
				gridcomboxObj.combobox(options || {});
				return gridcomboxObj;
			},
			destroy : function(container) {
				$(container).combobox("destroy");
			},
			getValue : function(container) {
				return $(container).combobox("getValue");
			},
			setValue : function(container, value) {
				$(container).combobox("setValue", value);
			},
			resize : function(container, width) {
				$(container).combobox("resize", width);
			}
		},
		combotree : {
			init : function(container, options) {
				var gridcombotreeObj = $("<input type=\"text\">").appendTo(container);
				gridcombotreeObj.combotree(options);
				return gridcombotreeObj;
			},
			destroy : function(container) {
				$(container).combotree("destroy");
			},
			getValue : function(container) {
				return $(container).combotree("getValue");
			},
			setValue : function(container, value) {
				$(container).combotree("setValue", value);
			},
			resize : function(container, width) {
				$(container).combotree("resize", width);
			}
		}
	};
	$.fn.datagrid.methods = {
		options : function(jq) {
			var options = $.data(jq[0], "datagrid").options;
			var pal_opts = $.data(jq[0], "datagrid").panel.panel("options");
			var opts = $.extend(options, {
						width : pal_opts.width,
						height : pal_opts.height,
						closed : pal_opts.closed,
						collapsed : pal_opts.collapsed,
						minimized : pal_opts.minimized,
						maximized : pal_opts.maximized
					});
			return opts;
		},
		getPanel : function(jq) {
			return $.data(jq[0], "datagrid").panel;
		},
		getPager : function(jq) {
			return $.data(jq[0], "datagrid").panel
					.children("div.datagrid-pager");
		},
		getColumnFields : function(jq, frozen) {
			return getColumnFields(jq[0], frozen);
		},
		getColumnOption : function(jq, field) {
			return getColumnOption(jq[0], field);
		},
		resize : function(jq, param) {
			return jq.each(function() {
						setSize(this, param);
					});
		},
		load : function(jq, param) {
			return jq.each(function() {
						var opts = $(this).datagrid("options");
						opts.pageNumber = 1;
						var pager = $(this).datagrid("getPager");
						pager.pagination({
									pageNumber : 1
								});
						request(this, param);
					});
		},
		reload : function(jq, param) {
			return jq.each(function() {
						request(this, param);
					});
		},
		reloadFooter : function(jq, footer) {
			return jq.each(function() {
						var opts = $.data(this, "datagrid").options;
						var dc = $.data(this, "datagrid").dc;
						if (footer) {
							$.data(this, "datagrid").footer = footer;
						}
						if (opts.showFooter) {
							opts.view.renderFooter.call(opts.view, this,
									dc.footer2, false);
							opts.view.renderFooter.call(opts.view, this,
									dc.footer1, true);
							if (opts.view.onAfterRender) {
								opts.view.onAfterRender.call(opts.view, this);
							}
							$(this).datagrid("fixRowHeight");
						}
					});
		},
		loading : function(jq) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				$(this).datagrid("getPager").pagination("loading");
				if (opts.loadMsg) {
					var _1ac = $(this).datagrid("getPanel");
					$("<div class=\"datagrid-mask\" style=\"display:block\"></div>")
							.appendTo(_1ac);
					var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>")
							.html(opts.loadMsg).appendTo(_1ac);
					msg.css("marginLeft", -msg.outerWidth() / 2);
				}
			});
		},
		loaded : function(jq) {
			return jq.each(function() {
						$(this).datagrid("getPager").pagination("loaded");
						var panel = $(this).datagrid("getPanel");
						panel.children("div.datagrid-mask-msg").remove();
						panel.children("div.datagrid-mask").remove();
					});
		},
		fitColumns : function(jq) {
			return jq.each(function() {
						fitColumn(this);
					});
		},
		fixColumnSize : function(jq, _1ae) {
			return jq.each(function() {
						fixColumnSize(this, _1ae);
					});
		},
		fixRowHeight : function(jq, index) {
			return jq.each(function() {
						fixRowHeight(this, index);
					});
		},
		freezeRow : function(jq, _1b0) {
			return jq.each(function() {
						freezeRow(this, _1b0);
					});
		},
		autoSizeColumn : function(jq, field) {
			return jq.each(function() {
						autoSizeColumn(this, field);
					});
		},
		loadData : function(jq, data) {
			return jq.each(function() {
						loadData(this, data);
						cacheRows(this);
					});
		},
		getData : function(jq) {
			return $.data(jq[0], "datagrid").data;
		},
		getRows : function(jq) {
			return $.data(jq[0], "datagrid").data.rows;
		},
		getFooterRows : function(jq) {
			return $.data(jq[0], "datagrid").footer;
		},
		getRowIndex : function(jq, id) {
			return getRowIndex(jq[0], id);
		},
		getChecked : function(jq) {
			return getChecked(jq[0]);
		},
		getSelected : function(jq) {
			var rows = getSelections(jq[0]);
			return rows.length > 0 ? rows[0] : null;
		},
		getSelections : function(jq) {
			return getSelections(jq[0]);
		},
		clearSelections : function(jq) {
			return jq.each(function() {
						var rows = $.data(this, "datagrid").selectedRows;
						rows.splice(0, rows.length);
						clearSelections(this);
					});
		},
		clearChecked : function(jq) {
			return jq.each(function() {
						var rows = $.data(this, "datagrid").checkedRows;
						rows.splice(0, rows.length);
						clearChecked(this);
					});
		},
		selectAll : function(jq) {
			return jq.each(function() {
						selectAll(this);
					});
		},
		unselectAll : function(jq) {
			return jq.each(function() {
						clearSelections(this);
					});
		},
		selectRow : function(jq, index) {
			return jq.each(function() {
						selectRow(this, index);
					});
		},
		selectRecord : function(jq, id) {
			return jq.each(function() {
						selectRecord(this, id);
					});
		},
		unselectRow : function(jq, index) {
			return jq.each(function() {
						unselectRow(this, index);
					});
		},
		checkRow : function(jq, index) {
			return jq.each(function() {
						checkRow(this, index);
					});
		},
		uncheckRow : function(jq, index) {
			return jq.each(function() {
						uncheckRow(this, index);
					});
		},
		checkAll : function(jq) {
			return jq.each(function() {
						checkAll(this);
					});
		},
		uncheckAll : function(jq) {
			return jq.each(function() {
						clearChecked(this);
					});
		},
		beginEdit : function(jq, index) {
			return jq.each(function() {
						beginEdit(this, index);
					});
		},
		endEdit : function(jq, index) {
			return jq.each(function() {
						endEdit(this, index, false);
					});
		},
		cancelEdit : function(jq, index) {
			return jq.each(function() {
						endEdit(this, index, true);
					});
		},
		getEditors : function(jq, index) {
			return getEditors(jq[0], index);
		},
		getEditor : function(jq, options) {
			return getEditor(jq[0], options);
		},
		refreshRow : function(jq, index) {
			return jq.each(function() {
						var opts = $.data(this, "datagrid").options;
						opts.view.refreshRow.call(opts.view, this, index);
					});
		},
		validateRow : function(jq, index) {
			return validateRow(jq[0], index);
		},
		updateRow : function(jq, param) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				opts.view.updateRow.call(opts.view, this, param.index, param.row);
			});
		},
		appendRow : function(jq, row) {
			return jq.each(function() {
						appendRow(this, row);
					});
		},
		insertRow : function(jq, param) {
			return jq.each(function() {
						insertRow(this, param);
					});
		},
		deleteRow : function(jq, index) {
			return jq.each(function() {
						deleteRow(this, index);
					});
		},
		getChanges : function(jq, type) {
			return getChanges(jq[0], type);
		},
		acceptChanges : function(jq) {
			return jq.each(function() {
						acceptChanges(this);
					});
		},
		rejectChanges : function(jq) {
			return jq.each(function() {
						rejectChanges(this);
					});
		},
		mergeCells : function(jq, options) {
			return jq.each(function() {
						mergeCells(this, options);
					});
		},
		showColumn : function(jq, field) {
			return jq.each(function() {
						var panel = $(this).datagrid("getPanel");
						panel.find("td[field=\"" + field + "\"]").show();
						$(this).datagrid("getColumnOption", field).hidden = false;
						$(this).datagrid("fitColumns");
					});
		},
		hideColumn : function(jq, field) {
			return jq.each(function() {
						var panel = $(this).datagrid("getPanel");
						panel.find("td[field=\"" + field + "\"]").hide();
						$(this).datagrid("getColumnOption", field).hidden = true;
						$(this).datagrid("fitColumns");
					});
		}
	};
	$.fn.datagrid.parseOptions = function(_1c8) {
		var t = $(_1c8);
		return $.extend({}, $.fn.panel.parseOptions(_1c8), $.parser
						.parseOptions(_1c8, ["url", "toolbar", "idField",
										"sortName", "sortOrder",
										"pagePosition", "resizeHandle", {
											fitColumns : "boolean",
											autoRowHeight : "boolean",
											striped : "boolean",
											nowrap : "boolean"
										}, {
											rownumbers : "boolean",
											singleSelect : "boolean",
											checkOnSelect : "boolean",
											selectOnCheck : "boolean"
										}, {
											pagination : "boolean",
											pageSize : "number",
											pageNumber : "number"
										}, {
											remoteSort : "boolean",
											showHeader : "boolean",
											showFooter : "boolean"
										}, {
											scrollbarSize : "number"
										}]), {
					pageList : (t.attr("pageList")
							? eval(t.attr("pageList"))
							: undefined),
					loadMsg : (t.attr("loadMsg") != undefined ? t
							.attr("loadMsg") : undefined),
					rowStyler : (t.attr("rowStyler")
							? eval(t.attr("rowStyler"))
							: undefined)
				});
	};
	var defaultView = {
		render : function(target, container, frozen) {
			var datagridData = $.data(target, "datagrid");
			var opts = datagridData.options;
			var rows = datagridData.data.rows;
			var fields = $(target).datagrid("getColumnFields", frozen);
			if (frozen) {//如冻结列存在并长度大于1或者显示行号，则继续否则返回
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))) {
					return;
				}
			}
			var strTableArr = ["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for (var i = 0; i < rows.length; i++) {
				var cls = (i % 2 && opts.striped)//row的class
						? "class=\"datagrid-row datagrid-row-alt\""
						: "class=\"datagrid-row\"";
				var cls2 = opts.rowStyler ? opts.rowStyler.call(target, i,
						rows[i]) : "";//获取自定义的样式，如无则为""
				var style = cls2 ? "style=\"" + cls2 + "\"" : "";
				var rowId = datagridData.rowIdPrefix + "-" + (frozen ? 1 : 2) + "-" + i;
				strTableArr.push("<tr id=\"" + rowId + "\" datagrid-row-index=\"" + i
						+ "\" " + cls + " " + style + ">");
				strTableArr.push(this.renderRow.call(this, target, fields, frozen, i,
						rows[i]));
				strTableArr.push("</tr>");
			}
			strTableArr.push("</tbody></table>");
			$(container).html(strTableArr.join(""));
		},
		renderFooter : function(target, container, frozen) {
			var opts = $.data(target, "datagrid").options;
			var rows = $.data(target, "datagrid").footer || [];
			var fields = $(target).datagrid("getColumnFields", frozen);
			var strTableArr = ["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for (var i = 0; i < rows.length; i++) {
				strTableArr.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+ i + "\">");
				strTableArr.push(this.renderRow.call(this, target, fields, frozen, i,rows[i]));
				strTableArr.push("</tr>");
			}
			strTableArr.push("</tbody></table>");
			$(container).html(strTableArr.join(""));
		},
		/**
		 * 定义如何显示一行，该方法取得一行的html字符串
		 */
		renderRow : function(target, fields, frozen, rowIndex, rowData) {
			var opts = $.data(target, "datagrid").options;
			var cc = [];
			if (frozen && opts.rownumbers) {//行号的列
				var rowNum = rowIndex + 1;
				if (opts.pagination) {
					rowNum += (opts.pageNumber - 1) * opts.pageSize;
				}
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"
								+ rowNum + "</div></td>");
			}
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				var fieldOpts = $(target).datagrid("getColumnOption", field);
				if (fieldOpts) {
					var fieldValue = rowData[field];
					var fieldStyleElem = fieldOpts.styler
							? (fieldOpts.styler(fieldValue, rowData, rowIndex) || "")
							: "";
					var fieldStyle = fieldOpts.hidden ? "style=\"display:none;" + fieldStyleElem
							+ "\"" : (fieldStyleElem ? "style=\"" + fieldStyleElem + "\"" : "");
					cc.push("<td field=\"" + field + "\" " + fieldStyle + ">");
					if (fieldOpts.checkbox) {
						var fieldStyle = "";
					} else {
						var fieldStyle = "";
						if (fieldOpts.align) {
							fieldStyle += "text-align:" + fieldOpts.align + ";";
						}
						if (!opts.nowrap) {
							fieldStyle += "white-space:normal;height:auto;";
						} else {
							if (opts.autoRowHeight) {
								fieldStyle += "height:auto;";
							}
						}
					}
					cc.push("<div style=\"" + fieldStyle + "\" ");
					if (fieldOpts.checkbox) {
						cc.push("class=\"datagrid-cell-check ");
					} else {
						cc.push("class=\"datagrid-cell " + fieldOpts.cellClass);
					}
					cc.push("\">");
					if (fieldOpts.checkbox) {
						cc.push("<input type=\"checkbox\" name=\"" + field
								+ "\" value=\""
								+ (fieldValue != undefined ? fieldValue : "") + "\"/>");
					} else {
						if (fieldOpts.formatter) {
							cc.push(fieldOpts.formatter(fieldValue, rowData, rowIndex));
						} else {
							cc.push(fieldValue);
						}
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow : function(elem, index) {
			this.updateRow.call(this, elem, index, {});
		},
		updateRow : function(elem, index, row) {
			var opts = $.data(elem, "datagrid").options;
			var rows = $(elem).datagrid("getRows");
			$.extend(rows[index], row);
			var styleElem = opts.rowStyler ? opts.rowStyler.call(elem, index,
					rows[index]) : "";
			function c_renderRow(frozen) {
				var fields = $(elem).datagrid("getColumnFields", frozen);
				var tr = opts.finder.getTr(elem, index, "body", (frozen ? 1 : 2));
				var checked = tr
						.find("div.datagrid-cell-check input[type=checkbox]")
						.is(":checked");
				tr.html(this.renderRow.call(this, elem, fields, frozen, index,
						rows[index]));
				tr.attr("style", styleElem || "");
				if (checked) {
					tr.find("div.datagrid-cell-check input[type=checkbox]")
							._propAttr("checked", true);
				}
			};
			c_renderRow.call(this, true);
			c_renderRow.call(this, false);
			$(elem).datagrid("fixRowHeight", index);
		},
		insertRow : function(elem, index, row) {
			var datagridData = $.data(elem, "datagrid");
			var opts = datagridData.options;
			var dc = datagridData.dc;
			var data = datagridData.data;
			if (index == undefined || index == null) {
				index = data.rows.length;
			}
			if (index > data.rows.length) {
				index = data.rows.length;  
			}
			/**
			 * 更新tr的行号及id
			 */
			function updateTrIndex(frozen) {
				var dataIndex = frozen ? 1 : 2;
				for (var i = data.rows.length - 1; i >= index; i--) {
					var tr = opts.finder.getTr(elem, i, "body", dataIndex);
					tr.attr("datagrid-row-index", i + 1);
					tr.attr("id", datagridData.rowIdPrefix + "-" + dataIndex + "-"+ (i + 1));
					if (frozen && opts.rownumbers) {
						var rowNum = i + 2;
						if (opts.pagination) {
							rowNum += (opts.pageNumber - 1) * opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(rowNum);
					}
				}
			};
			/**
			 * 在tr中插入一行
			 */
			function insertTr(frozen) {
				var dataIndex = frozen ? 1 : 2;
				var fields = $(elem).datagrid("getColumnFields", frozen);
				var trId = datagridData.rowIdPrefix + "-" + dataIndex + "-" + index;
				var tr = "<tr id=\"" + trId
						+ "\" class=\"datagrid-row\" datagrid-row-index=\""
						+ index + "\"></tr>";
				if (index >= data.rows.length) {
					if (data.rows.length) {
						opts.finder.getTr(elem, "", "last", dataIndex).after(tr);
					} else {
						var cc = frozen ? dc.body1 : dc.body2;
						cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+ tr + "</tbody></table>");
					}
				} else {
					opts.finder.getTr(elem, index + 1, "body", dataIndex).before(tr);
				}
			};
			updateTrIndex.call(this, true);
			updateTrIndex.call(this, false);
			insertTr.call(this, true);
			insertTr.call(this, false);
			data.total += 1;
			data.rows.splice(index, 0, row);//在指定位置插入新增的行
			this.refreshRow.call(this, elem, index);//刷新新增的行，显示数据
		},
		deleteRow : function(elem, index) {
			var datagridData = $.data(elem, "datagrid");
			var opts = datagridData.options;
			var data = datagridData.data;
			/**
			 * 更新tr的行号及id
			 */
			function updateTrIndex(frozen) {
				var dataIndex = frozen ? 1 : 2;
				for (var i = index + 1; i < data.rows.length; i++) {
					var tr = opts.finder.getTr(elem, i, "body", dataIndex);
					tr.attr("datagrid-row-index", i - 1);
					tr.attr("id", datagridData.rowIdPrefix + "-" + dataIndex + "-"+ (i - 1));
					if (frozen && opts.rownumbers) {
						var rowNum = i;
						if (opts.pagination) {
							rowNum += (opts.pageNumber - 1) * opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(rowNum);
					}
				}
			};
			opts.finder.getTr(elem, index).remove();
			updateTrIndex.call(this, true);
			updateTrIndex.call(this, false);
			data.total -= 1;
			data.rows.splice(index, 1);
		},
		onBeforeRender : function(target, rows) {
		},
		onAfterRender : function(target) {
			var opts = $.data(target, "datagrid").options;
			if (opts.showFooter) {
				var footer = $(target).datagrid("getPanel").find("div.datagrid-footer");
				footer.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility", "hidden");
			}
		}
	};
	/**
	 * datagrid的默认配置，包含panel的默认配置
	 */
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		frozenColumns : undefined,
		columns : undefined,
		fitColumns : false,
		resizeHandle : "right",
		autoRowHeight : true,
		toolbar : null,
		striped : false,
		method : "post",
		nowrap : true,
		idField : null,
		url : null,
		data : null,
		loadMsg : "Processing, please wait ...",
		rownumbers : false,//True 就会显示行号的列
		singleSelect : false,
		selectOnCheck : true,
		checkOnSelect : true,
		pagination : false,
		pagePosition : "bottom",
		pageNumber : 1,
		pageSize : 10,
		pageList : [10, 20, 30, 40, 50],
		queryParams : {},
		sortName : null,
		sortOrder : "asc",
		remoteSort : true,
		showHeader : true,
		showFooter : false,
		scrollbarSize : 18,
		rowStyler : function(rowIndex, rowData) {
		},
		loader : function(param, success, error) {//success为load成功的回调函数参数为data，error为错误时的回调函数
			var opts = $(this).datagrid("options");
			if (!opts.url) {
				return false;
			}
			$.ajax({
						type : opts.method,
						url : opts.url,
						data : param,
						dataType : "json",
						success : function(data) {
							success(data);
						},
						error : function() {
							error.apply(this, arguments);
						}
					});
		},
		loadFilter : function(data) {
			if (typeof data.length == "number"
					&& typeof data.splice == "function") {
				return {
					total : data.length,
					rows : data
				};
			} else {
				return data;
			}
		},
		editors : editorsObj,
		finder : {
			/**
			 * 获取指定的tr的jquery对象
			 * @param {} elem  datagrid数据关联的dom节点
			 * @param {} index tr的索引
			 * @param {} type 获取哪个模块下table的tr 共有：body,footer,selected,last,allbody,allfooter 7个类别
			 * @param {} dataIndex dc中body or footer的索引通常为1或2 0表示取1和2的合集
			 */
			getTr : function(elem, index, type, dataIndex) {
				type = type || "body";
				dataIndex = dataIndex || 0;
				var datagridData = $.data(elem, "datagrid");
				var dc = datagridData.dc;
				var opts = datagridData.options;
				if (dataIndex == 0) {
					var tr1 = opts.finder.getTr(elem, index, type, 1);
					var tr2 = opts.finder.getTr(elem, index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == "body") {
						var tr = $("#" + datagridData.rowIdPrefix + "-" + dataIndex + "-"
								+ index);
						if (!tr.length) {
							tr = (dataIndex == 1 ? dc.body1 : dc.body2)
									.find(">table>tbody>tr[datagrid-row-index="
											+ index + "]");
						}
						return tr;
					} else {
						if (type == "footer") {
							return (dataIndex == 1 ? dc.footer1 : dc.footer2)
									.find(">table>tbody>tr[datagrid-row-index="
											+ index + "]");
						} else {
							if (type == "selected") {
								return (dataIndex == 1 ? dc.body1 : dc.body2)
										.find(">table>tbody>tr.datagrid-row-selected");
							} else {
								if (type == "last") {
									return (dataIndex == 1 ? dc.body1 : dc.body2)
											.find(">table>tbody>tr[datagrid-row-index]:last");
								} else {
									if (type == "allbody") {
										return (dataIndex == 1 ? dc.body1 : dc.body2)
												.find(">table>tbody>tr[datagrid-row-index]");
									} else {
										if (type == "allfooter") {
											return (dataIndex == 1
													? dc.footer1
													: dc.footer2)
													.find(">table>tbody>tr[datagrid-row-index]");
										}
									}
								}
							}
						}
					}
				}
			},
			/**
			 * 获取datagrid的一行数据对象
			 * @param {} elem 与datagrid的数据关联的dom节点
			 * @param {} p 行的tr的jquery对象或是行的索引index
			 */
			getRow : function(elem, p) {
				var index = (typeof p == "object") ? p
						.attr("datagrid-row-index") : p;
				return $.data(elem, "datagrid").data.rows[parseInt(index)];
			}
		},
		view : defaultView,
		onBeforeLoad : function(param) {
		},
		onLoadSuccess : function(data) {
		},
		onLoadError : function() {
		},
		onClickRow : function(rowIndex, rowData) {
		},
		onDblClickRow : function(rowIndex, rowData) {
		},
		onClickCell : function(rowIndex, field, value) {
		},
		onDblClickCell : function(rowIndex, field, value) {
		},
		onSortColumn : function(sort, order) {
		},
		onResizeColumn : function(field, width) {
		},
		onSelect : function(rowIndex, rowData) {
		},
		onUnselect : function(rowIndex, rowData) {
		},
		onSelectAll : function(rows) {
		},
		onUnselectAll : function(rows) {
		},
		onCheck : function(rowIndex, rowData) {
		},
		onUncheck : function(rowIndex, rowData) {
		},
		onCheckAll : function(rows) {
		},
		onUncheckAll : function(rows) {
		},
		onBeforeEdit : function(rowIndex, rowData) {
		},
		onAfterEdit : function(rowIndex, rowData, changes) {
		},
		onCancelEdit : function(rowIndex, rowData) {
		},
		onHeaderContextMenu : function(e, field) {
		},
		onRowContextMenu : function(e, rowIndex, rowData) {
		}
	});
})(jQuery);
