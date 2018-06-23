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
	posts = showdict;
}

function headerChangeBackground(key)
{
	if(headerConfig[key]) headerObj[key].className = "clicked";
	else headerObj[key].className = "";
}

function headerChangeMessage(message)
{
	if (message == "") document.getElementById("headerMessage").innerHTML = defaultHeaderMessage;
	else document.getElementById("headerMessage").innerHTML = message;
}

