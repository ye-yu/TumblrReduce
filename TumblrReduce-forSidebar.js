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
	document.getElementById("showList").innerHTML = '<li class="navigationsub"><a href="#">List of Tumblr Websites: </a></li><li class="selected"><a href="#" onclick = "findMedia(\'all blogs\')">&gt;show posts from all blogs</a></li>';
	if (!localStorage['siteList'])siteList = getListOfWebsites();
	for(var i = 0; i < siteList.length; i++)
	{
		var b = document.createElement("li");
		b.innerHTML = '<a href="#" onclick="findMedia(\'' + siteList[i] +'\');"> ' + siteList[i] +' </a>';
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

function addBlog()
{
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

