var photodict = [], photosetdict = [], videodict = [], textdict = [], showdict = [];
var siteList = [];
function findMedia(blogName)
{
	var content = getWebsiteContent("file:///C:/Users/raflie/Desktop/miscellaneous/TumblrReduce/" + blogName + ".json");
	var q = JSON.parse(content);
	var p = q['post']
	console.log(p['@type']);
	for (var i = 0; i < p.length; i++)
	{
		if ("photoset" in p[i])
		{
			console.log(str(i) + ". Photoset:");
			var sets = [], hasGif = false;
			for (var j = 0; j < p[i]['photoset']['photo'].length; j++)
			{
				if(p[i]['photoset']['photo'][j]['photo-url'][0]['#text'].indexOf('.gif') != -1)
					hasGif = true;
				console.log("> " + p[i]['photoset']['photo'][j]['photo-url'][0]['#text']);
				sets.push(p[i]['photoset']['photo'][j]['photo-url'][0]['#text']);
			}
			if (hasGif) console.log("This photoset has GIFs");
			photosetdict.push({"date": parseInt(p[i]['@unix-timestamp']), "links" : sets, "gif" : hasGif, "id": parseInt(p[i]['@id'])});
		}
		else
		{
			switch(p[i]['@type'])
			{
				case "photo":
					photodict.push({"date": parseInt(p[i]['@unix-timestamp']), 
									"link" : p[i]['photo-url'][0]['#text'], 
									"gif" : (p[i]['photo-url'][0]['#text'].indexOf('.gif') != -1), 
					"id": parseInt(p[i]['@id'])});
					console.log(str(i) + ". Photo: " + p[i]['photo-url'][0]['#text']);
					break;
				case "video":
					videodict.push({"date": parseInt(p[i]['@unix-timestamp']), "embed" : p[i]['video-player'][1]['#text'], "id": parseInt(p[i]['@id'])});
					break;
				case "regular":
					textdict.push({"date": parseInt(p[i]['@unix-timestamp']), "embed" : p[i]['regular-body'], "id": parseInt(p[i]['@id'])});
			}
		}
	}
}

function str(i)
{
	return (i+1) + "";
}

function getWebsiteContent(site)
{
	var client = new XMLHttpRequest();
	client.open('GET', site);
	var content = "";
	var once = true;
	client.onreadystatechange = function() {
		if (client.readyState==4 && client.status==200)
			content = client.responseText;
	}
	client.open("GET", site, false);
	client.send();
	return content;
}
//this is for header settings
var headerConfig, headerObj, defaultHeaderMessage = "", noneSelected;
function headerSetting(key)
{
	headerConfig[key] = !headerConfig[key];
	headerChangeBackground(key);
	var checkFalse = true;
	for (key in headerConfig)
	{
		if (headerConfig[key]) 
		{
			checkFalse = false;
			break;
		}
	}
	if (checkFalse) 
	{
		noneSelected = true;
		defaultHeaderMessage = "None of the setting is selected.";
	}
	else
	{
		noneSelected = false;
		defaultHeaderMessage = "";
	}
	
	makeShowDict();
}

function makeShowDict()
{
	showdict = [];
	if (headerConfig['panel1'] || headerConfig['panel3'])
	{
		//check if has gif
		for(var i = 0; i < photodict.length; i++)
			if((headerConfig['panel1'] && !photodict[i]['gif']) || (headerConfig['panel3'] && photodict[i]['gif']))
				showdict.push({"type": "photo", "content":photodict[i]});
		for(var i = 0; i < photosetdict.length; i++)
			if((headerConfig['panel1'] && !photosetdict[i]['gif']) || (headerConfig['panel3'] && photosetdict[i]['gif']))
			showdict.push({"type": "photoset", "content":photosetdict[i]});
	}
	if (headerConfig['panel2'])
	{
		for(var i = 0; i < videodict.length; i++)
			showdict.push({"type": "video", "content":videodict[i]});
	}
	if (headerConfig['panel5'])
	{
		for(var i = 0; i < textdict.length; i++)
			showdict.push({"type": "video", "content":textdict[i]});
	}
}
function headerChangeBackground(key)
{
	if(headerConfig[key]) headerObj[key].className = "clicked";
	else headerObj[key].className = "";
}

function headerChangeMessage(message){
	if (message == "") document.getElementById("headerMessage").innerHTML = defaultHeaderMessage;
	else document.getElementById("headerMessage").innerHTML = message;
}

function getListOfWebsites()
{
	var content = getWebsiteContent("sites.txt");
	return content.split("\r\n");
}

function setListOfWebsites(lists)
{
	var toReturn = ""
	for(var i = 0; i < lists.length - 1; i++)
		toReturn += (lists[i] + "\r\n");
	toReturn += lists[lists.length - 1];
	return toReturn;

}

function configSidebar()
{
	document.getElementById("showList").innerHTML = '<li class="navigationsub"><a href="#">List of Tumblr Websites: </a></li><li class="selected"><a href="#" onclick = "">&gt;show posts from all blogs</a></li>';
	if (!localStorage['siteList'])siteList = getListOfWebsites();
	for(var i = 0; i < siteList.length; i++)
	{
		var a = document.createElement("a");
		a.innerHTML = siteList[i];
		a.href = "#";
		a.onclick = "";
		var b = document.createElement("li");
		b.appendChild(a);
		document.getElementById("showList").appendChild(b);
	}
	
	var aa = document.createElement("a");
	aa.innerHTML = "&gt;Add blog";
	aa.href = "#";
	aa.onclick = function () {addBlog();};
	var bb = document.createElement("li");
	bb.appendChild(aa);
	document.getElementById("showList").appendChild(bb);
}

function addBlog(){
	var a = window.prompt("Enter blog name(without tumblr.com):", "");
	if (siteList.indexOf(a) != -1)
		window.alert("The blog has already been added.");
	else
	{
		if (!(a == "" || a == null))
			siteList.push(a);
		console.log(!(a == "" || a == null));
	}
	configSidebar();
}

function checkSiteList()
{
	var fromFile = getListOfWebsites();
	var fromLoca = siteList;
	var diff = false;
	for(var i = 0; i < fromFile.length; i++)
	{
		if (fromLoca.indexOf(fromFile[i]) == -1)
		{
			diff = true;
			break;
		}
	}
	for(var i = 0; (i < fromLoca.length) && !diff; i++)
	{
		if (fromFile.indexOf(fromLoca[i]) == -1)
		{
			diff = true;
			break;
		}
	}
	if (diff) promptSiteListDiff();
}

function promptSiteListDiff()
{
	if(confirm("The list of sites from file and the one from the local browser storage are different. Do you want to refresh the site list?"))
	{
		siteList = getListOfWebsites();
		localStorage.setItem('siteList', JSON.stringify(siteList));
	}
	else
	{
		if(confirm("Do you want to create a new list of sites?"))
		{
			var openWin = window.open("", "Copy this to sites.txt", "width=500, height=350");
			openWin.document.write("<p>Please copy this text, clear to text inside sites.txt file, and paste this into sites.txt file. After that, please run TumblrReduce.py</p>");
			openWin.document.write("<textarea readonly>" + setListOfWebsites(siteList) + "</textarea> ")
		}
	}
}
$(document).ready(function() {
	//checking file in local storage
	headerConfig = {"panel1": true, "panel2": false, "panel3": false, "panel4": false, "panel5": false, "panel6": false, "panel7": false, "panel8": false};
	if (localStorage['first'] == null) 
	{
		localStorage.setItem('first', true);
		localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
		siteList = getListOfWebsites();
		localStorage.setItem('siteList', JSON.stringify(siteList));
	}
	else
	{
		headerConfig = JSON.parse(localStorage['headerConfig']);
		siteList = JSON.parse(localStorage['siteList']);
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
				//pushContent();
				console.log("Pushed content.");
			}
		} )
	});
}
);

function reloadPage()
{
	document.getElementById("showContent").innerHTML = '';
}

function pushContent()
{
	var e = showdict.pop();
	if(e)
	{
		console.log(e);
		var frag = document.createDocumentFragment();
		var d = document.createElement("div");
		var date = document.createElement("b");
		date.innerHTML = '<a href="#" onclick="makeFavourite(' + '' + ');"><div class="favourited">Make Favourite </div> </a> Date: ' + convertToDateTime(e['content']['date']);
		d.appendChild(date);
		d.appendChild(document.createElement("hr"));
		switch (e['type'])
		{
			case 'photo':
				d = addImagesToDiv(d, e['content']['link'], e['content']['gif']);
				//move this later to the bottom
				frag.appendChild(d);
				document.getElementById("showContent").appendChild(frag);
				break;
			case 'photoset':
				for(var i = 0; i < e['content']['links'].length; i++)
				{
					d = addImagesToDiv(d, e['content']['links'][i], e['content']['gif']);
				}
				//move this later to the bottom
				frag.appendChild(d);
				document.getElementById("showContent").appendChild(frag);
				break;
		}
	}
}

var photosetduo = false;

function addImagesToDiv(div, imageLink, isGIF)
{
	var img = document.createElement("img");
	img.className = "playerimages";
	img.style.width = "45%";
	if (isGIF)
	{
		img.src = "placeholder.png";
		img.onclick = function() {
			this.src = imageLink;
		}
	}
	else
		img.src = trimToAPI(imageLink);
	div.appendChild(img);
	if (photosetduo) 
	{
		div.appendChild(document.createElement("hr"));
		photosetduo = false;
	}
	else photosetduo = true;
	return div;
}
function convertToDateTime(epoch)
{
	var time = parseInt(epoch);
	var dObj = new Date(0);
	dObj.setUTCSeconds(time);
	return dObj.toUTCString();
}

function trimToAPI(source)
{
	var e = source.split("/");
	console.log(e);
	var newLink = e[0] + "//rsz.io";
	for (var i = 2; i < e.length; i++)
	{
		newLink += "/" + e[i];
	}
	return newLink + "?width=30%25";
}
window.addEventListener("beforeunload", function(e) {
	checkSiteList();
	localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
	localStorage.setItem('siteList', JSON.stringify(siteList));
}, false);