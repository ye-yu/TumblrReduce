import requests
import xmltodict
import json
import re
def decodeFile():
	try:
		readWebList = open("sites.txt", "r")
		a = readWebList.read().split("\n")
		for i in range(len(a)):
			print(a[i])
		return a
		readWebList.close()
	except:
		print("Error occured. Unable to read sites.txt.")
		return None

def retriveContent(site, num):
	try:
		r = requests.get("http://" + site + ".tumblr.com/api/read?num=" + num +"&start=1")
		return re.sub(u'[^\x20-\x7f]+', u'', response.content.decode('utf-8'))
	except:
		print("Error occured. Unable to make a successful connection.")
		return None

def writeToFiles(site, content):
	try:
		writeWebList = open(site+".json", "w")
		writeWebList.write(content)
		writeWebList.close()
	except Exception as e:
		print("Error occured. Unable to write into file.")
		print(e)

def findMedia(source):
	parsedContent = xmltodict.parse(source)
	parsedContent = parsedContent['tumblr']['posts']
	return json.dumps(parsedContent)
a = decodeFile()
for i in range(len(a)):
	content = retriveContent(a[i], 100)
	writeToFiles(a[i], content)

# to iterate through photos
'''
for i in range (len(p)):
	if ("photoset" in p[i]):
		print(str(i) + ". Photoset:")
		for j in range(len(p[i]['photoset']['photo'])):
			print("> " + p[i]['photoset']['photo'][j]['photo-url'][0]['#text'])
	else:
		print(str(i) + ". Photo: " + p[i]['photo-url'][0]['#text'])
'''