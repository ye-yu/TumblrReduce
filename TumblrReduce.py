import requests
import xmltodict
import json
import re
def decodeFile():
	try:
		readWebList = open("sites.txt", "r")
		a = readWebList.read().split("\n")
		return a
		readWebList.close()
	except:
		print("Error occured. Unable to read sites.txt.")
		return None

def retriveContent(site, num, type):
	try:
		r = requests.get("http://" + site + ".tumblr.com/api/read?type="+ type +"&num=" + str(num) +"&start=1")
		return re.sub(u'[^\x20-\x7f]+', u'', r.content.decode('utf-8'))
	except Exception as e:
		print("Error occured. Unable to make a successful connection.")
		print(e)
		return None

def writeToFiles(site, content):
	try:
		writeWebList = open(site+".json", "w")
		writeWebList.write(content)
		writeWebList.close()
	except Exception as e:
		print("Error occured. Unable to write into file.")
		print(e)

def findMedia(sourceP, sourceV, sourceT):
	parsedContent = []
	try:
		parsedContentP = xmltodict.parse(sourceP)
		parsedContentV = xmltodict.parse(sourceV)
		parsedContentT = xmltodict.parse(sourceT)
		parsedContent = {'post' : []}
		parsedContent['post'] = parsedContentP['tumblr']['posts']['post'] + parsedContentV['tumblr']['posts']['post'] + parsedContentT['tumblr']['posts']['post']
	except Exception as e:
		print("Error occured. The blog might not be available.")
	return json.dumps(parsedContent)
	
a = decodeFile()
for i in range(len(a)):
	print ("Loading blog: " + a[i])
	contentphoto = retriveContent(a[i], 100, 'photo')
	contentvideo = retriveContent(a[i], 100, 'video')
	contentregul = retriveContent(a[i], 100, 'regular')
	content = findMedia(contentphoto, contentvideo, contentregul)
	writeToFiles(a[i], content)
	print("Successful.")

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