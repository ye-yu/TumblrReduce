var photosetduo = false; //to put <br> on alternate for photosets
var photodict = [], photosetdict = [], videodict = [], textdict = [], showdict = [];
var posts = [], seenposts = [], seen = [];
var siteList = [];
var favourites = [], favposts = [];
var reducepercentage = 35;
var hideSeen = true;
function reloadPage()
{
	document.getElementById("showContent").innerHTML = '';
	pushContent();
}

function checkPosts(post)
{
	if (post)
	{
		if(seen.indexOf(post['content']['id']) > -1) return true;
		else return false;
	}
	else return false;
}
function pushContent()
{
	var e = showdict.pop();
	while(checkPosts(e) && hideSeen) e = showdict.pop();
	if(e)
	{
		photosetduo = false;
		if (hideSeen)
		{
			seenposts.push(e);
			seen.push(e['content']['id']);
		}
		var frag = document.createDocumentFragment();
		var d = document.createElement("div");
		var date = document.createElement("b");
		if (favourites.indexOf(e['content']['id']) == -1)
			date.innerHTML = '<a href="#" onclick="makeFavourite(' + e['content']['id'] + ', this);"><div class="nonfavourite">Make Favourite </div> </a> Date: ' + convertToDateTime(e['content']['date']);
		else
			date.innerHTML = '<a href="#" onclick="makeFavourite(' + e['content']['id'] + ', this);"><div class="favourited">Make Favourite </div> </a> Date: ' + convertToDateTime(e['content']['date']);
		d.appendChild(date);
		d.appendChild(document.createElement("hr"));
		switch (e['type'])
		{
			case 'photo':
				d = addImagesToDiv(d, e['content']['link'], e['content']['gif']);
				//move this later to the bottom
				frag.appendChild(d);
				break;
			case 'photoset':
				for(var i = 0; i < e['content']['links'].length; i++)
				{
					d = addImagesToDiv(d, e['content']['links'][i], e['content']['gif']);
				}
				//move this later to the bottom
				frag.appendChild(d);
				break;
			case 'video':
			case 'text':
				var embedFrag = document.createElement('div');
				embedFrag.innerHTML = checkEmbed(e['content']['embed']);
				frag.appendChild(d);
				frag.appendChild(embedFrag);
				break;
		}
		document.getElementById("showContent").appendChild(frag);
	}
	$('a').click( function(e) {
		e.preventDefault();
	}
	);
		
}

function addImagesToDiv(div, imageLink, isGIF)
{
	var img = document.createElement("img");
	img.className = "playerimages";
	img.style.width = "45%";
	if (isGIF)
	{
		img.src = "placeholder.png";
		if (headerConfig['panel8']) img.src = imageLink;
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
	return newLink + "?width=" + reducepercentage + "%25";
}

function findMedia(blogName)
{
	console.log(blogName);
	document.getElementById('blogname').innerHTML = blogName;
	if(blogName == "fav")
	{
		hideSeen = false;
		for(var i = 0; i < favposts.length; i++)
		{
			if ('embed' in favposts[i]) showdict.push({'type': 'video', 'content': favposts[i]});
			if ('link' in favposts[i]) showdict.push({'type': 'photo', 'content': favposts[i]});
			if ('links' in favposts[i]) showdict.push({'type': 'photoset', 'content': favposts[i]});
		}
		reloadPage();
		return;
	}
	if (blogName == "seen") hideSeen = false;
	else hideSeen = true;
	if(blogName == "all blogs" || blogName == "seen") 
	{
		for (var i = 0; i < siteList.length; i++) 
			findMediaS(siteList[i], false);
	}
	else 
	{
		findMediaS(blogName, true);
	}
	makeShowDict();
	reloadPage();
}

//apparently it doesn't support method overloading
function findMediaS(blogName, clearDictionaries)
{
	if(clearDictionaries)
	{
		photodict = [];
		photosetdict = [];
		videodict = [];
		textdict = [];
		showdict = [];
	}
	console.log("Loading content from:");
	console.log("file:///C:/Users/raflie/Desktop/miscellaneous/TumblrReduce/" + blogName + ".json");
	var content = getWebsiteContent(blogName + ".json");
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
					break;
			}
		}
	}
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

function makeFavourite(id, a)
{
	var el = a.childNodes[0];
	var checkIndex = favourites.indexOf(id);
	if (checkIndex > -1)
	{
		favourites.splice(checkIndex, 1);
		favposts.splice(checkIndex, 1);
		el.className = "nonfavourite";
	}
	else
	{
		favourites.push(id);
		favposts.push(findPost(id));
		el.className = "favourited";
	}
}

function findPost(id)
{
	for(var i = 0; i < photodict.length; i++) if (photodict[i]['id'] == id) return photodict[i];
	for(var i = 0; i < photosetdict.length; i++) if (photosetdict[i]['id'] == id) return photosetdict[i];
	for(var i = 0; i < videodict.length; i++) if (videodict[i]['id'] == id) return videodict[i];
	for(var i = 0; i < textdict.length; i++) if (textdict[i]['id'] == id) return textdict[i];
	return null;
}

function checkEmbed(content)
{
	var a = document.createElement('div');
	a.innerHTML = content;
	checkElement(a);
	return a.innerHTML;
}

function checkElement(el)
{
	if (el.childElementCount == 0)
	{
		if(el.nodeName == "IMG")
		{
			if(el.src.indexOf(".gif") != -1 && !headerConfig['panel8'])
			{
				var imgSrc = el.src;
				el.onclick = function ()
				{
					this.src = imgSrc;
				}
				el.src = "placeholder.png";
			}
			else
				el.src = trimToAPI(el.src);
			console.log("Image: " + el.src);
		}
	}
	else
	{
		for(var i = 0; i < el.childElementCount; i++)
			checkElement(el.childNodes[i]);
	}
}