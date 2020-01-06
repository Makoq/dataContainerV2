var count = 0;
function go(name) {
    var tag_name = undefined;
    if ($("h1[name=" + name + "]").offset() !== undefined) {
        tag_name = "h1[name=" + name + "]";
    } else if ($("h2[name=" + name + "]").offset() !== undefined) {
        tag_name = "h2[name=" + name + "]";

    } else if ($("h3[name=" + name + "]").offset() !== undefined) {
        tag_name = "h3[name=" + name + "]";
    } else if ($("h4[name=" + name + "]").offset() !== undefined) {
        tag_name = "h4[name=" + name + "]";
    } else if ($("h5[name=" + name + "]").offset() !== undefined) {
        tag_name = "h5[name=" + name + "]";
    } else if ($("h6[name=" + name + "]").offset() !== undefined) {
        tag_name = "h6[name=" + name + "]";
    }
    if (tag_name != undefined) {
        $("html, body").animate({
            scrollTop: $(tag_name).offset().top - 50
        },
            { duration: 500, easing: "swing" }
        );
    }

    return false;
};



 function up_click() {
    var currentScrollTop = $(".right-content-nav").scrollTop();
    $('.right-content-nav').animate({ scrollTop: currentScrollTop - 100 }, 100);
    return false;
};
function down_click() {
    var currentScrollTop = $(".right-content-nav").scrollTop();
    $('.right-content-nav').animate({ scrollTop: currentScrollTop + 100 }, 100);
    return false;
};

function addToNav(_tag) {

    if ($(".content-nav").hasClass("right-nav")) {
        var html_str = '<div class="right-content-nav">' +
            '<div id="up-down" class="">' +
            '<button id="scroll-up" class="btn" onClick="up_click()"><i class="fa fa-chevron-up" aria-hidden="true"></i></button>' +
            '<button id="scroll-down" class="btn" onClick="down_click()"><i class="fa fa-chevron-down" aria-hidden="true"></i></button>' +
            '</div>' +
            '<dl></dl></div>';


        $(".right-nav").append(html_str);


        var children_elem = $(_tag).children();
        for (var i = 0; i < children_elem.length; i++) {
            var tagName = children_elem[i].tagName;
            var text = children_elem[i].textContent;
            switch (tagName) {
                case 'h1':
                case 'H1':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;
                case 'h2':
                case 'H2':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;
                case 'h3':
                case 'H3':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;
                case 'h4':
                case 'H4':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;
                case 'h5':
                case 'H5':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;
                case 'h6':
                case 'H6':
                    //给一个id,用于锚定位
                    $(children_elem[i]).attr("name", 'anchor_' + (++count));
                    var item_str = "<dt>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    item_str += '<a onclick="go(\'' + 'anchor_' + count + '\')">' + text + '</a> ';
                    item_str += '</dt>';
                    $(".right-content-nav dl").append(item_str);
                    break;

                default:
                    break;
            }
        }







    }

}