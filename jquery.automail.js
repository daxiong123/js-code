/**
 * Created by zhangwj on 14-7-14.
 */
(function ($) {
	$.fn.autoMail = function (options) {
		var autoMail = $(this);
		var _value = '';
		var _index = -1;
		autoMail.defaults = {
			deValue: '',
			textCls: '',
			listCls: '',
			listTop: 1,
			left: 0,
			top: 0,
			mailArr: ["qq.com", "163.com", "126.com", "sina.com", "sohu.com"]
		};
		//初始化
		autoMail.init = function () {
			autoMail.vars = $.extend({}, autoMail.defaults, options);
			autoMail.val(autoMail.vars.deValue).addClass(autoMail.vars.textCls);
			autoMail.click(function (event) {
				autoMail.auto(event);
			});
			if ($.browser.msie) {
				autoMail.bind("input propertychange", function (event) {
					autoMail.auto(event);
				});
			} else {
				autoMail.bind("input", function (event) {
					autoMail.auto(event);
				});
			}
			/**
			 * 失去焦点事件
			 */
			autoMail.blur(function (event) {
				if (autoMail.val() == '' || autoMail.val() == autoMail.vars.deValue) {
					autoMail.val(autoMail.vars.deValue).addClass(autoMail.vars.textCls);
				}
			});
			//文本域键盘松开事件
			autoMail.keyup(function (event) {
				var keyCode = event.keyCode;
				switch (keyCode) {
					case 13:
						autoMail.remove();
						autoMail.blur();
						break;
					case 38:
						_index--;
						if (_index < 0) {
							_index = 0;
						}
						autoMail.keyOperate(_index);
						break;
					case 40:
						_index++;
						if (_index > $('.item', autoMail.list).length - 1) {
							_index = ('.item', autoMail.list).length - 1;
						}
						autoMail.keyOperate(_index);
						break;
					default:
						if (autoMail.val().indexOf('@') < 0) {
							_value = autoMail.val();
						}
				}
			});
			$(document).click(function () {
				if ($(autoMail.list).length > 0) {
					autoMail.remove();
					autoMail.blur();
				}
			});
		};

		autoMail.auto = function (event) {
			if (autoMail.val().indexOf("@") >= 0) {
				return false;
			}

			if (autoMail.val() == autoMail.vars.textCls) {
				autoMail.removeClass(autoMail.vars.textCls);
			}
			if (autoMail.val() != autoMail.vars.deValue) {
				autoMail.create();
				autoMail.list.find('.item').each(function () {
					if ($(this).text() == autoMail.val()) {
						$(this).siblings('.item').removeClass('cur');
						$(this).addClass('cur');
						return false;
					}
				});
			}
			event.stopPropagation();
		};
		//创建列表
		autoMail.create = function () {
			var li = '<li class="item">' + autoMail.val() + '</li>';
			for (var i = 0; i < autoMail.vars.mailArr.length; i++) {
				li += '<li class="item">' + autoMail.val() + '@' + autoMail.vars.mailArr[i] + '</li>';
			}

			if (typeof autoMail.list != "undefined") {
				autoMail.list.find("ul").html(li);
			}
			else {
				autoMail.list = $('<div class="' + autoMail.vars.listCls + '"><ul>' + li + '</ul></div>');

				autoMail.css(autoMail.offset().left, autoMail.offset().top, autoMail.outerHeight(), autoMail.outerWidth());

				autoMail.list.appendTo($('body'));

				$(window).on("resize scroll", function () {
					autoMail.css(autoMail.offset().left, autoMail.offset().top, autoMail.outerHeight(), autoMail.outerWidth());
				});
			}
			//邮箱列表绑定事件
			autoMail.list.find('.item').click(function (event) {
				autoMail.val($(this).text());
				autoMail.remove();
				event.stopPropagation();
			});
			autoMail.list.find('.item').hover(
				function () {
					$(this).addClass('cur');
				},
				function () {
					$(this).removeClass('cur');
				}
			);
			return autoMail.list;
		};
		//移除列表
		autoMail.remove = function () {
			if (autoMail.list.length > 0) {
				autoMail.list.remove();
				delete autoMail.list;
			}
		};
		//设置样式
		autoMail.css = function (_left, _top, _height, _width) {
			autoMail.list.css({
				'position': 'absolute',
				'left': _left - autoMail.vars.left,
				'top': _top + _height + autoMail.vars.top,
				'min-width': _width,
				'z-index': 9999,
				'display': 'block'
			});
		};
		//键盘操作
		autoMail.keyOperate = function (_index) {
			$('.item', autoMail.list).eq(_index).addClass('cur').siblings('.item').removeClass('cur');
			autoMail.val($('.item', autoMail.list).eq(_index).text());
		};
		//开始初始话动作...
		autoMail.init();
	}
})(jQuery);