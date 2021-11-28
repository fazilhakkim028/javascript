$(function() {
	if ($.cookie("email")) {
		$("#jquery-comments-form #subscriber_email").val($.cookie("email"));
	};

});

/*ajaxcall*/

function ajax_call(url, type, data, datatype, success, currentcallback) {
	$("#kre-comments-parent .spinner").show();
	$.ajax({
		url : url,
		type : type,
		data : data,
		dataType : (datatype || 'JSON'),
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
		},
		success : function(data) {
			$("#kre-comments-parent .spinner").remove();
			if (currentcallback == "getComments") {
			if (data["status"] == true) {
		     	success(data["data"]);
				kre_comment_advert(data["data"]);
						   // var hashlocation = window.location.href.split("#")[1];
	   // if(!(typeof hashlocation==="undefined")){
	   	 // $('html,body').scrollTop(0);
    // $('html,body').animate({scrollTop:$('a[href="#'+hashlocation+'"]').offset().top},1500);   
    // }
				}
				if (data["status"] == false) {
					alert(data["error"]);

				}
if(data["data"]){
krescroll(parseInt(data["commenters"].split(" ")[0]));
}
			} else {

				if (data["status"] == true) {
					if(data["moderation_status"]==true){
						alert(data["moderation_data"]);
						$("#comments-container .textarea-wrapper .close").trigger("click");
					}else{
					success(data["data"]);
					}

				} else {
					if (data["status"] == false) {
						alert(data["error"]);

					}
				}

			}
			if(data["commenters"] !== "")$(".kre-comments-top #commenters").html(data["commenters"]);

			var maxLength = 300;
			$(".jquery-comments .content").each(function() {
				var myStr = $(this).text();
				if ($.trim(myStr).length > maxLength) {
					var newStr = myStr.substring(0, maxLength);
					var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
					$(this).empty().html(newStr);
					$(this).append(' <a href="javascript:void(0);" class="read-more">read more</a>');
					$(this).append('<span class="more-text">' + removedStr + '</span>');
				}
			});
			$(".read-more").click(function() {
				$(this).siblings(".more-text").contents().unwrap();
				$(this).remove();
			});
			if ($(".article-content").length > 0) {
				$(".jquery-comments *").not(".jquery-comments i.fa").css({
					"font-family" : $(".article-content p").css("font-family")
				});
			}
krecomment_updateTime();

		}
	});

}

function kre_post_button(item) {
	($(item).hasClass("postasanonymous")) ? $("#anonymous_post").val("true") : $("#anonymous_post").val("false");
	if (!($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined")) {
$(".textarea").removeClass("blocked_word_check");
      $(item).parents(".textarea-wrapper").find(".textarea").addClass("blocked_word_check");
		var spinner = '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>';
		$(".spinner").remove();
		$(item).parents(".control-row").after(spinner);
	}
}
	var comment_form = $("#jquery-comments-form").serialize();
	function article_data(item) {
		$("#jquery-comments-form input[type='hidden']").each(function(key, val) {
			item[$(this).attr("name")] = $(this).val();
		});
	}

$(function() {


	$('#comments-container').comments({
		profilePictureURL : '/images/user-icon.png',
		roundProfilePictures : true,
		textareaRows : 1,
		readOnly:krereadOnly,
		enableAttachments : false,
		enableLoadmorebutton:false,
		enableHashtags : true,
		 hashtagClicked: function(hashtag) {
		 	if($("#"+hashtag).hasClass("activehash")){
		 		$(".comment").removeClass("activehash");
		 		$(".kreshare").remove();
		 		
		 	}else{
	$(".kreshare").remove();	
	$(".comment").removeClass("activehash");
	$("#"+hashtag).addClass("activehash");
         var hashdiv='<div class="kreshare" id="'+hashtag+'hashtag">'+location.href+"#"+hashtag+'</div>';
          $("> .comment-wrapper .hashtag","#"+hashtag).after(hashdiv);
          selectText($(hashdiv).attr("id"));
    }
   },
		getComments : function(success, error) {
			setTimeout(function() {
				if (!(($.cookie("user_name") == "" && $.cookie("email") == "") || ( typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined"))) {
					var kre_placeholder = $(".textarea-wrapper .textarea").data("placeholder");
					$(".textarea-wrapper .textarea").attr("data-placeholder", kre_placeholder + " as " + $.cookie("user_name"));
				};
			ajax_call("/getComments", "POST", comment_form, "JSON", success, "getComments");
		
		 }, 500);
		},
	
		postComment : function(data, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {
								
			} else {
	
				setTimeout(function() {
					
						article_data(data);
	var currentvalue=$(".blocked_word_check.textarea").text();
			 if(krewarned(currentvalue))ajax_call("/createComment", "POST", data, "JSON", success, "postComment");
					}, 500);
			
			}
		},
		putComment : function(data, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {
				alert("Please login");
			} else {
				setTimeout(function() {					
					article_data(data);
				var currentvalue=$(".blocked_word_check.textarea").text(),warnword=false;
			 if(krewarned(currentvalue))ajax_call("/updateComment", "POST", data, "JSON", success, "putComment");
				}, 500);
			}
		},
		deleteComment : function(data, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {

				alert("Please login");
			} else {
				setTimeout(function() {
					article_data(data);
					ajax_call("/deleteComment", "POST", data, "JSON", success, "deleteComment");
				}, 500);
			}
		},
		loadmore:function(success, error){
							setTimeout(function() {
				if (!(($.cookie("user_name") == "" && $.cookie("email") == "") || ( typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined"))) {
					var kre_placeholder = $(".textarea-wrapper .textarea").data("placeholder");
					$(".textarea-wrapper .textarea").attr("data-placeholder", kre_placeholder + " as " + $.cookie("user_name"));
				};
		    	var val=$("#jquery-comments-form #comment_start").val();
				if(!val == ""){
				$("#jquery-comments-form #comment_start").val(parseInt(val)+5);
				}else{
						$("#jquery-comments-form #comment_start").val(5);
				}
					var comment_form = $("#jquery-comments-form").serialize();
				ajax_call("/getComments", "POST", comment_form, "JSON", success, "getComments");
		 }, 500);
		},
		upvoteComment : function(data, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {
                $(".kre_commentuser .Downvote").attr("disabled",false);
				alert("Please login");
			} else {
				setTimeout(function() {
					article_data(data);
					ajax_call("/upvoteComment", "POST", data, "JSON", success, "upvoteComment");
				}, 500);
			}
		},
		downvoteComment : function(data, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {
			$(".kre_commentuser .upvote").attr("disabled",false);
				alert("Please login");
			} else {
				setTimeout(function() {
					article_data(data);
					ajax_call("/downvoteComment", "POST", data, "JSON", success, "upvoteComment");
				}, 500);
			}
		},

		uploadAttachments : function(dataArray, success, error) {
			if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {

				alert("Please login");
			} else {
				setTimeout(function() {
					ajax_call("/uploadAttachments", "POST", dataArray, "JSON", success, "uploadAttachments");
				}, 500);
			}
		},
		
	});	
});

function kre_comment_advert(item) {
	if (item.length > 0 || $('#comment-list > li').length > 1) {
		if (!KRE_adv_list.length == 0) {
			KRE_adv_list[0];
			var $html = "<div id='" + KRE_adv_list[0] + "'><script>googletag.cmd.push(function(){googletag.display('" + KRE_adv_list[0] + "');});</script></div>";
			$(".kre_advertisements_top").html($html);
			if (item.length >= 5 || $('#comment-list > li').length > 1) {
				$('#comment-list > li').each(function(no, item) {
					$(item).attr("comment-id", no + 1);
					var item_no = parseInt($(item).attr("comment-id"));
					var item_no1 = parseInt(item_no / 5);
					if (item_no % 5 == 0) {
						if ( typeof KRE_adv_list[item_no1] === "undefined") {

						} else {
							var $html = "<div id='" + KRE_adv_list[item_no1] + "' class='kre_comment_adv'><script>googletag.cmd.push(function(){googletag.display('" + KRE_adv_list[item_no1] + "');});</script></div>";
			     			$(item).append($html);
			               if(typeof googletag.pubads != 'undefined')googletag.pubads().refresh();
						}
					}
				});
			}
		}
	}
}
function kre_report_click(item) {
	$(".kre_report_blk textarea,.kre_report_blk input").val("");
	$("#kre_report_id").val($(item).parents(".comment").attr("id"));
	if ($(item).hasClass("active")) {
		$(".kre_report").removeClass("active");
		$(".kre_report_blk").hide();
	} else {
		$(".kre_report").removeClass("active");
		$(item).addClass("active");
		$(".kre_report_blk").css({
			"top" : $(item).position().top + $(item).height() + 5,
			"left" : $(item).position().left
		}).show();
			if (!($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined")) {
		$("#kre_report_input").remove();
		$("#kre_report_id").val($(item).parents("li").attr("id"));
	}
			
	}
};

function kreclose(item) {
	$(".kre_report").removeClass("active");
	$(item).parents(".kre_report_blk").hide();
}

function krereport(item) {
	var $valid = !($("#kre_report_textarea").val() == "");
	var $valid1= !($("#kre_report_input").val() == ""); 
	if ($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined") {
	($valid && $valid1)? (reportajax(item)): alert("Plese fill reason and email field");
	} else {
	($valid) ? 	(reportajax(item)) : alert("Plese fill reason field");
	
}
}
function reportajax(item){
	  var spinner = '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>';
			$(".spinner").remove();
			$(item).parents(".kre_report_submit").prepend(spinner);
				$.ajax({
				url : "/report_comments",
				type : "POST",
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				},
				data : $(".kre_report_blk form").serialize(),
				dataType : 'JSON',
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				},
				success : function(data) {
					$("#kre-comments-parent .spinner").remove();
					if (data["status"] == true) {
						alert(data["message"]);
						$(".kre_report_blk").hide();
						$(".kre_report").removeClass("active");

					}
					if (data["status"] == false) {
						alert(data["message"]);
   
					}
				}
			});
		}
/*moment time  change*/
// var krecomment_updateTime = function() {
	// $('.jquery-comments time').each(function(i, e) {
		// var formattedTime = moment($(this).data('original'), "YYYY-MM-DD h:mm:ss a").fromNow();
		// $(this).html(formattedTime);
	// });
// };
var krecomment_updateTime = function() {
	$('.jquery-comments time').each(function(i, e) {
		$(this).timeago();

	});
};
setInterval(krecomment_updateTime, 6000);

function krevotebutton(item) {
	if (!($.cookie("user_name") == "" && $.cookie("email") == "" || typeof $.cookie("user_name") == "undefined" && typeof $.cookie("email") == "undefined")) {
		var spinner = '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>';
		$(".spinner").remove();
		$(item).parents(".actions").prepend(spinner);
	
	}
}



function element_in_scroll(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height()+600;

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function krescroll (no) {
  $(document).scroll(function(e){
	if (element_in_scroll("#comment-list li:last")) {
			$(document).unbind('scroll');
			if(!(no== $("#comment-list li").length+1)){
$(".loadmore").trigger("click");
}
}
});
}

function selectText( containerid ) {
var node = document.getElementById( containerid );
if ( document.selection ) {
var range = document.body.createTextRange();
range.moveToElementText( node );
range.select();
} else if ( window.getSelection ) {
var range = document.createRange();
range.selectNodeContents( node );
window.getSelection().removeAllRanges();
window.getSelection().addRange( range );
}
}


debugger;
function krewarned(currentvalue){
	var warnword=true;
		$.each(kreblockedwords,function(no,item){
		if(new RegExp('\\b'+item+'\\b').test(currentvalue)){
			alert(item + " is word not support");
			currentvalue=currentvalue.replace(item," ");
			$(".blocked_word_check.textarea").text(currentvalue);
			warnword=false;
		   $(".spinner").remove();
			$(".send").addClass("enabled");
			return false; 
		}
	});
return warnword;
}
