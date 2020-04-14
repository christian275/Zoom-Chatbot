require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome to the Unsplash Chatbot for Zoom!')
})

app.get('/authorize', (req, res) => {
  res.redirect('https://zoom.us/launch/chat?jid=robot_' + process.env.zoom_bot_jid)
})

app.get('/support', (req, res) => {
  res.send('Contact tommy.gaessler@zoom.us for support.')
})

app.get('/privacy', (req, res) => {
  res.send('The Unsplash Chatbot for Zoom does not store any user data.')
})

app.get('/terms', (req, res) => {
  res.send('By installing the Unsplash Chatbot for Zoom, you are accept and agree to these terms...')
})

app.get('/documentation', (req, res) => {
  res.send('Try typing "island" to see a photo of an island, or anything else you have in mind!')
})

app.get('/zoomverify/verifyzoom.html', (req, res) => {
  res.send(process.env.zoom_verification_code)
})

app.post('/unsplash', (req, res) => {

// First Injection point in the POST
getChatbotToken()

function getChatbotToken () {
  request({
    url: `https://api.zoom.us/oauth/token?grant_type=client_credentials`,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64')
    }
  }, (error, httpResponse, body) => {
    if (error) {
      console.log('Error getting chatbot_token from Zoom.', error)
    } else {
      body = JSON.parse(body)
	  
	  sendChat(body.access_token, req.body.payload.cmd.toUpperCase())
	  
    }
  })
}

// Variable body is of type object, and to get the string do, body.body which will get the JSON string
function getMeme (chatbotToken, url) 
{
	request(url, (error, body) => { 
    if (error) 
	{
      console.log('Error getting photo from Unsplash.', error)
	  return
    } 
	else 
	{
	  var bodyStr = body.body

	  var picUrl = parseImages(bodyStr)
	  
	  var photo = 
	  [
		  {
			'type': 'section',
			'sections': 
			[
			  {
				'type': 'attachments',
				'img_url': 'https://preview.redd.it/nvsjk2jnwsr41.jpg?width=640&crop=smart&auto=webp&s=7ae9716e3552b27a8b765b8c5f0f5f169437c0ff',
				'resource_url': 'https://preview.redd.it/nvsjk2jnwsr41.jpg?width=640&crop=smart&auto=webp&s=7ae9716e3552b27a8b765b8c5f0f5f169437c0ff',
				'information': 
				{
				  'title': 
				  {
					'text': 'Random DnD Meme'
				  },
				}
			  }
			]
		  }
	  ]
	  
	  head = 'You have been graciously given a meme by the God himself'
	  msg = 'Accept it carefully...'
	  
	  secondRequest(chatbotToken, head, msg, photo)
		
	  }
	})
}

function sendChat (chatbotToken, cmd) {
	
  var head = '';	
  var msg = '';
  
  if (cmd === 'ROLL D4') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 4);
  }
  else if (cmd === 'ROLL D6') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 6);
  }
  else if (cmd === 'ROLL D8') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 8);
  }
  else if (cmd === 'ROLL D10') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 10);
  }
  else if (cmd === 'ROLL D12') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 12);
  }
  else if (cmd === 'ROLL D20') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 20);
  }
  else if (cmd === 'ROLL D100') {
	head = 'You rolled a...';	  
	msg = Math.ceil(Math.random() * 100);
  }
  else if (cmd === 'MEME') {
	  getMeme(chatbotToken, 'https://www.reddit.com/r/dndmemes/')
	  return
  }
  else if (cmd === 'HELP') {
	  head = '--Instructions--'
	  msg = 'Input a command to Matt Mercer in any of the two formats...\n   1. \\request <cmd>\n   2. <cmd>\n\nAvailable commands are as follows...\n' + 
	        '1. roll d<4><8><10><12><20><100>\n2. meme\n3. help'
  }
  else {
	photo = [
	  {
		'type': 'section',
		'sections': [
		  {
			'type': 'attachments',
			'img_url': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c4e97a41-bfb9-435f-b16c-2dc02724c237/ddumvar-a0c7954c-2745-49dc-b105-80a8916f0a93.jpg/v1/fill/w_1280,h_710,q_75,strp/imgonline_com_ua_resizempxbovj8qz70rjt_by_christian2751_ddumvar-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzEwIiwicGF0aCI6IlwvZlwvYzRlOTdhNDEtYmZiOS00MzVmLWIxNmMtMmRjMDI3MjRjMjM3XC9kZHVtdmFyLWEwYzc5NTRjLTI3NDUtNDlkYy1iMTA1LTgwYTg5MTZmMGE5My5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.fTJedfaxoFntLN9pgWDbIXBS8VDSuy7OLI2xEZI6DNw',
			'resource_url': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c4e97a41-bfb9-435f-b16c-2dc02724c237/ddumvar-a0c7954c-2745-49dc-b105-80a8916f0a93.jpg/v1/fill/w_1280,h_710,q_75,strp/imgonline_com_ua_resizempxbovj8qz70rjt_by_christian2751_ddumvar-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzEwIiwicGF0aCI6IlwvZlwvYzRlOTdhNDEtYmZiOS00MzVmLWIxNmMtMmRjMDI3MjRjMjM3XC9kZHVtdmFyLWEwYzc5NTRjLTI3NDUtNDlkYy1iMTA1LTgwYTg5MTZmMGE5My5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.fTJedfaxoFntLN9pgWDbIXBS8VDSuy7OLI2xEZI6DNw',
			'information': {
			  'title': {
				'text': 'LET THE SMITING COMMENCE!!!'
			  },
			}
		  }
		]
	  }
	]
	head = 'You have input an invalid command!'
	msg = 'You will be smited by the angry god. FEEL HIS WRATH!!!'
	
	secondRequest(chatbotToken, head, msg, photo)
	
	return
  }
  
  secondRequest(chatbotToken, head, msg, null)
  
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

var stringToHTML = function (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
}

// Function that obtains all of the images in an HTML string
function parseImages (htmlStr) {
	// First find the <img> tags in the html string
	// Pull all of the "src" CSS selections out of the string
	// Put all of the Image URLs into an array 
	// Choose random number in the range of 0 - (# of images - 1)
	// Pull URL from that Index
	// Return the URL
	
	var count = 100
	
	var tempSet = htmlStr.match(/<img[^>]+src="([^">]+)"/g)
	
	console.log(htmlStr)
	
	console.log(tempSet)
	
	/*for (var i = 0; i < htmlStr.length; i++)
	{
		
	}*/
	
	
	
	
}

async function secondRequest (chatbotToken, head, msg, photo) {
	await firstRequest(chatbotToken, head, msg);
	
	console.log(photo)
	
	if (photo != null) {
	  await request({
		url: 'https://api.zoom.us/v2/im/chat/messages',
		method: 'POST',
		json: true,
		body: {
		  'robot_jid': process.env.zoom_bot_jid,
		  'to_jid': req.body.payload.toJid,
		  'account_id': req.body.payload.accountId,
		  'content': {
			'body': photo
		  }
		},
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer ' + chatbotToken
		}
	  }, (error, httpResponse, body) => {
		if (error) {
		  console.log('Error sending chat.', error)
		} else {
		  console.log(body)
		}
	  })
  }
  
  photo = null
  
}

async function firstRequest (chatbotToken, head, msg) {
  // First request for a message
  request({
	url: 'https://api.zoom.us/v2/im/chat/messages',
	method: 'POST',
	json: true,
	body: {
	  'robot_jid': process.env.zoom_bot_jid,
	  'to_jid': req.body.payload.toJid,
	  'account_id': req.body.payload.accountId,
	  'content': {
		'head': {
		  'text': head
		},
		'body': [{
			'type': 'message',
			'text': msg
		}]
	  }
	},
	headers: {
	  'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + chatbotToken
	}
  }, (error, httpResponse, body) => {
	if (error) {
	  console.log('Error sending chat.', error)
	} else {
	  console.log(body)
	}
  })
  
}

/**
* Delay for a number of milliseconds
*/
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

})

app.post('/deauthorize', (req, res) => {
  if (req.headers.authorization === process.env.zoom_verification_token) {
    res.status(200)
    res.send()
    request({
      url: 'https://api.zoom.us/oauth/data/compliance',
      method: 'POST',
      json: true,
      body: {
        'client_id': req.body.payload.client_id,
        'user_id': req.body.payload.user_id,
        'account_id': req.body.payload.account_id,
        'deauthorization_event_received': req.body.payload,
        'compliance_completed': true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64'),
        'cache-control': 'no-cache'
      }
    }, (error, httpResponse, body) => {
      if (error) {
        console.log(error)
      } else {
        console.log(body)
      }
    })
  } else {
    res.status(401)
    res.send('Unauthorized request to Unsplash Chatbot for Zoom.')
  }
})

app.listen(port, () => console.log(`Unsplash Chatbot for Zoom listening on port ${port}!`))