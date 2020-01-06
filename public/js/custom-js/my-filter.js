
/**
 * how to use:
 *      html:<div class="my-folding"></div> 
 * if you want it collapse,add class .my-collapse to div calss.just like this:
 *      html:<div class="my-folding my-collapse"></div> 
 * 
 * then add css:
 *      .my-collapse{
 *          height:2.4em!important;
 *        }; 
 * this is height after folding.
 * 
 */

//get the expand height

function BindClickEvent() {
    $(".group-body span").click(function () {
        remove_selected(".group-body span");
        $(this).addClass("selected");
    })

    $(".my-folding-button").click(function () {
        if ($(this).text()==="Expand") {
            $(this).text("Collapse");        
        } else {
            $(this).text("Expand");
        }
        handle_collapse(this);
    })
}
//collapse or expand
function handle_collapse(elem) {
    if ($(elem).parent(".my-folding").hasClass("my-collapse")) {
        $(elem).parent(".my-folding").removeClass("my-collapse");
    } else {
        $(elem).parent(".my-folding").addClass("my-collapse");
    }
}
//remove selected state
function remove_selected(elem_name) {
    $(elem_name).each(function () {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            return false;
        }
    });
}

//add collapse button
function add_collapse_button() {
    var html = '<a class="my-folding-button" style="text-decoration: none;" href="javascript:void(0);">Expand</a>';
    $(".my-folding").prepend(html);
}

//handle collapse button
function handle_collapse_button() {
    var current_height;
    var m_height;
    $(".my-folding").each(function () {
        if ($(this).hasClass("my-collapse")) {
            current_height = $(this).outerHeight(); //折叠后的高度
            $(this).removeAttr("style");
            $(this).removeClass("my-collapse");
            m_height = $(this).outerHeight();   //展开后的高度
            $(this).attr("style", "height:" + m_height + "px;");
            $(this).addClass("my-collapse");


        } else {
            //展开状态
            $(this).removeAttr("style");   //不remove掉会影响默认的auto属性，即展不开
            m_height = $(this).outerHeight();

            

            $(this).addClass("my-collapse");
            current_height = $(this).outerHeight();   //折叠后的高度
            $(this).removeClass("my-collapse");
            $(this).attr("style", "height:" + m_height + "px;"); //将auto属性下，div的高度赋值给style,仍然有误差，加4后效果较好
        }
        if (current_height+10 < m_height) {  //总会有些误差，这里加10再进行比较
            $(this).children(".my-folding-button").show();
        } else {
            $(this).children(".my-folding-button").hide();
        }

    })



}

//resize
$(window).resize(function () {
    handle_collapse_button();
});

//run it now
$(function () {
    add_collapse_button();
    BindClickEvent();
    handle_collapse_button();

})