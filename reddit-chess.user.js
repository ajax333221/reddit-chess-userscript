// ==UserScript==
// @name           reddit-chess-userscript
// @author         ajax333221
// @description    Transforms u/chessvision-ai-bot comments into isepic-chess replayer
// @version        0.10.1
// @include        http://*.reddit.com/r/chess/*
// @include        https://*.reddit.com/r/chess/*
// @include        http://*.reddit.com/r/AnarchyChess/*
// @include        https://*.reddit.com/r/AnarchyChess/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require        https://ajax333221.github.io/isepic-chess-ui/js/isepic-chess.js
// @require        https://ajax333221.github.io/isepic-chess-ui/js/isepic-chess-ui.js
// @icon           https://github.com/ajax333221/isepic-chess-ui/raw/master/css/images/ic_ui_logo.png
// ==/UserScript==

function getFenParam(str){
	var results, rtn;
	
	rtn="";
	
	results=new RegExp("[\?&]fen=([^&#]*)").exec(str);
	
	if(results!=null){
		rtn=(decodeURI(results[1]) || "");
	}
	
	return (""+rtn);
}

function watchUrlChanges(old_url){
	var temp;
	
	temp=window.location.href;
	
	if(temp!==old_url && temp.indexOf("/comments/")!==-1){
		fireCommentTransform();
	}
	
	old_url=temp;
	
	setTimeout(function(){
		watchUrlChanges(old_url);
	}, 1000);
}

function fireCommentTransform(){
	$(function(){
		setTimeout(function(){
			$(function(){
				var temp, temp2, try_pgn, is_rotated;
				
				temp=(""+$("blockquote p a").first().html());
				
				if(Ic && IcUi && temp==="chess.com"){
					temp=$("blockquote p a").first().attr("href");
					temp=getFenParam(temp).replace(/\+/g, " ");
					
					temp2=$("blockquote p a").closest("div").find("blockquote").last();
					temp2.find("*:not(:has(\"*\"))").remove();
					
					try_pgn=(""+temp2.find("*:not(:has(\"*\"))").html());
					is_rotated=(try_pgn.indexOf("...")!==-1);
					
					$("blockquote p a").closest("div").html("<div class=\"ic_ui_board\" style=\"height:350px; width:350px;\"><div id=\"ic_ui_board\"></div></div><div class=\"ic_ui_controls\"><div id=\"icbuttons\"><a id=\"ic_ui_quitpuzzle\" href=\"#\">(Exit puzzle-mode)</a><br><br><input id=\"ic_ui_nav_first\" value=\"|<\" type=\"button\"><input id=\"ic_ui_nav_previous\" value=\"<\" type=\"button\"><input id=\"ic_ui_nav_next\" value=\">\" type=\"button\"><input id=\"ic_ui_nav_last\" value=\">|\" type=\"button\"><input id=\"ic_ui_rotate\" value=\"rotate\" type=\"button\"><select id=\"ic_ui_promote\"><option value=\"5\" selected=\"selected\">queen</option><option value=\"4\">rook</option><option value=\"3\">bishop</option><option value=\"2\">knight</option></select></div><br><div class=\"ic_ui_move_list\"><div id=\"ic_ui_move_list\"></div></div></div>");
					
					$("#icbuttons").css("text-align", "center");
					$("#icbuttons input").css({"margin": "0 2px", "padding": "8px 16px"});
					$("#ic_ui_board").parent().css("margin", "0 auto");
					
					$("#ic_ui_quitpuzzle").click(function(){
						IcUi.setCfg("puzzleMode", false);
						$(this).hide();
						return false;
					});
					
					IcUi.setCfg("puzzleMode", true);
					IcUi.setCfg("arrowKeysNavigation", false);
					IcUi.setCfg("scrollNavigation", false);
					IcUi.setCfg("pieceAnimations", false);
					IcUi.setCfg("pieceDragging", false);
					IcUi.setCfg("soundEffects", false);
					
					Ic.initBoard({
						boardName: "main",
						fen: temp,
						pgn: try_pgn,
						isRotated: is_rotated,
						moveIndex: 0
					});
				}
			});
		}, 1000);
	});
}

$(function(){
	$("<link>").appendTo("head").attr({
		type: "text/css", 
		rel: "stylesheet",
		href: "https://ajax333221.github.io/isepic-chess-ui/css/isepic-chess-ui.css"
	});
	
	watchUrlChanges();
});
