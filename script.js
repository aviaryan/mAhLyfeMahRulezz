// Substitutes

var chars = {
	'o': ['0'],
	'e': ['3'],
	'i': ['1']
}

// this is matched using regex (case-insensitive)
var words = {
	'tha': 'da',
	'wha': 'wa'
}
// the follwing should match at word end (or they should be complete words)
var endWords = {
	'you': 'u',
	'ith': 'id',
	'the': 'da',
	'this': 'dis',
	'es': 'ezz',  // lookahead if word end
	'my': 'mah'
}

// convert endWords into words
for (var key in endWords){
	words[key + '(?=[^a-z])'] = endWords[key]
}


function convertChars(text){
	var text = String(text)
	var probab = 0.5

	for (var key in words) {
		reg = new RegExp(key, "gi")
		var bracketCount = (key.match(/\(/g) || []).length

		if (reg.test(text)){
			// replace
			text = text.replace(reg, (match, p1, p2) => {
				chance = Math.random()
				if (chance <= probab){
					if (bracketCount < 2){
						return words[key]
					} else if (bracketCount == 2){
						return words[key].replace("$1", p1)
					}
				} else {
					return match
				}
			})
			// end replace
		}
	}

	return text
}

function loadSubstitutes(orig, newCh){
	list = [newCh]
	orig = orig.toLowerCase()
	if (orig in chars) {
		Array.prototype.push.apply(list, chars[orig]);
	}
	return list
}

function convertSingleChar(text){
	var probab = 0.5
	len = text.length
	var newText = ""

	for (var i=0; i < len; i++){
		charCode = text[i].charCodeAt()
		chance = Math.random()
		
		if (chance <= probab){
			if (charCode >= 65 && charCode <= 90){
				subs = loadSubstitutes(text[i], String.fromCharCode(charCode + 32))
				newText += subs[Math.floor(Math.random() * subs.length)]; // random from list
			} else if (charCode >= 97 && charCode <= 122){
				subs = loadSubstitutes(text[i], String.fromCharCode(charCode - 32))
				newText += subs[Math.floor(Math.random() * subs.length)];
			} else {
				newText += text[i]
			}
		} else {
			newText += text[i]
		}
	}

	return newText
}

function inputChangeEvent(){
	val = $("#input").val()
	newVal = convertChars(val)
	console.log(newVal)
	newVal = convertSingleChar(newVal)
	console.log(newVal)
	$("#output").text(newVal)
}

$(document).ready(function(){
	$("#input").bind('input propertychange', inputChangeEvent)
})
