/*
Function List: //since notepad++ is a bitch for not showing the function list
forHeader
- headSetting(key)
- makeShowDict()
- headerChangeBackground(key)
- headerChangeMessage(message)
forSidebar
- getListOfWebsites()
- setListOfWebsites(lists)
- configSidebar()
- addBlog()
- checkSiteList()
- promptSiteListDiff()
forPlayer
- photosetduo: boolean
- photodict: array
- photosetdict: array
- videodict: array
- textdict: array
- showdict: array
- siteList: array
- reloadPage()
- pushContent()
- addImagesToDiv(div, imageLink, isGIF)
- converToDateTime(epoch)
- trimToAPI(source)
- findMedia(blogName)
- getWebsiteContent(site)
*/
function str(i) //debuggin purpose
{
	return (i+1) + "";
}

$(document).ready(function() {
	//addingthescript
	console.log("loading");
	var addScript = document.createElement("script");
	addScript.src = "TumblrReduce-forHeader.js";
	document.head.appendChild(addScript);
	addScript = document.createElement("script");
	addScript.src = "TumblrReduce-forPlayer.js";
	document.head.appendChild(addScript);
	addScript = document.createElement("script");
	addScript.src = "TumblrReduce-forSidebar.js";
	document.head.appendChild(addScript);
	
	$("a").click( function(e) {
		e.preventDefault();
	}
	)
	}
);

window.onload = function() 
{
	//checking file in local storage
	headerConfig = {"panel1": true, "panel2": false, "panel3": false, "panel4": false, "panel5": false, "panel6": false, "panel7": false, "panel8": false};
	if (localStorage['first'] == null) 
	{
		localStorage.setItem('first', true);
		siteList = getListOfWebsites();
		saveToLocalStorage();
	}
	else
	{
		headerConfig = JSON.parse(localStorage['headerConfig']);
		siteList = JSON.parse(localStorage['siteList']);
		favourites = JSON.parse(localStorage['favourites']);
		favposts = JSON.parse(localStorage['favposts']);
		seenposts = JSON.parse(localStorage['seenposts']);
		seen = JSON.parse(localStorage['seen']);
		checkSiteList();
	}
	//setting of header
	headerObj = {"panel1": document.getElementById("panel1"), 
				"panel2": document.getElementById("panel2"),
				"panel3": document.getElementById("panel3"),
				"panel4": document.getElementById("panel4"),
				"panel5": document.getElementById("panel5"),
				"panel6": document.getElementById("panel6"),
				"panel7": document.getElementById("panel7"),
				"panel8": document.getElementById("panel8")};
	for(k in headerConfig) headerChangeBackground(k);
	configSidebar();
	
	jQuery(function($){
		$("#splayer").on('scroll', function() {
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
			{
				pushContent();
				console.log("Pushed content.");
			}
		} )
	});
	$("a").click( function(e) {
		e.preventDefault();
	}
	);
	//findMedia("all blogs");
}

function getPlayerScrollerInfo()
{
	console.log("$(this).scrollTop() =>" + $("#splayer").scrollTop());
	console.log("$(this).innerHeight() =>" + $("#splayer").innerHeight());
	console.log("$(this)[0].scrollHeight =>" + $("#splayer")[0].scrollHeight)
}

function saveToLocalStorage()
{
	localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
	localStorage.setItem('siteList', JSON.stringify(siteList));
	localStorage.setItem('favourites', JSON.stringify(favourites));
	localStorage.setItem('favposts', JSON.stringify(favposts));
	localStorage.setItem('seenposts', JSON.stringify(seenposts));
	localStorage.setItem('seen', JSON.stringify(seen));

}

window.addEventListener("beforeunload", function(e) {
	checkSiteList();
	saveToLocalStorage();
}, false);